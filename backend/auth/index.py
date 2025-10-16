'''
Business: OAuth авторизация через Google и VK с созданием пользователей в БД
Args: event - dict с httpMethod, queryStringParameters, body
      context - объект с атрибутами request_id, function_name
Returns: HTTP response с JWT токеном или данными пользователя
'''

import json
import os
import psycopg2
from typing import Dict, Any
import jwt
import time
from urllib.parse import urlencode
import urllib.request

DATABASE_URL = os.environ.get('DATABASE_URL')
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', '')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET', '')
VK_CLIENT_ID = os.environ.get('VK_CLIENT_ID', '')
VK_CLIENT_SECRET = os.environ.get('VK_CLIENT_SECRET', '')
JWT_SECRET = os.environ.get('JWT_SECRET', 'default-secret-key')

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    query_params = event.get('queryStringParameters', {}) or {}
    action = query_params.get('action', '')
    
    if method == 'GET' and action == 'google-url':
        redirect_uri = query_params.get('redirect_uri', '')
        auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode({
            'client_id': GOOGLE_CLIENT_ID,
            'redirect_uri': redirect_uri,
            'response_type': 'code',
            'scope': 'email profile',
            'access_type': 'online'
        })}"
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'url': auth_url}),
            'isBase64Encoded': False
        }
    
    if method == 'GET' and action == 'vk-url':
        redirect_uri = query_params.get('redirect_uri', '')
        auth_url = f"https://oauth.vk.com/authorize?{urlencode({
            'client_id': VK_CLIENT_ID,
            'redirect_uri': redirect_uri,
            'response_type': 'code',
            'scope': 'email',
            'v': '5.131'
        })}"
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'url': auth_url}),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        provider = body_data.get('provider')
        code = body_data.get('code')
        redirect_uri = body_data.get('redirect_uri')
        
        if not provider or not code:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Missing provider or code'}),
                'isBase64Encoded': False
            }
        
        user_data = None
        
        if provider == 'google':
            token_url = 'https://oauth2.googleapis.com/token'
            token_data = urlencode({
                'code': code,
                'client_id': GOOGLE_CLIENT_ID,
                'client_secret': GOOGLE_CLIENT_SECRET,
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code'
            }).encode()
            
            req = urllib.request.Request(token_url, data=token_data, method='POST')
            with urllib.request.urlopen(req) as response:
                token_response = json.loads(response.read())
            
            access_token = token_response.get('access_token')
            
            userinfo_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
            headers = {'Authorization': f'Bearer {access_token}'}
            req = urllib.request.Request(userinfo_url, headers=headers)
            with urllib.request.urlopen(req) as response:
                user_info = json.loads(response.read())
            
            user_data = {
                'provider_id': user_info.get('id'),
                'email': user_info.get('email'),
                'name': user_info.get('name'),
                'avatar_url': user_info.get('picture'),
                'provider': 'google'
            }
        
        elif provider == 'vk':
            token_url = 'https://oauth.vk.com/access_token'
            token_params = urlencode({
                'client_id': VK_CLIENT_ID,
                'client_secret': VK_CLIENT_SECRET,
                'redirect_uri': redirect_uri,
                'code': code
            })
            
            req = urllib.request.Request(f'{token_url}?{token_params}')
            with urllib.request.urlopen(req) as response:
                token_response = json.loads(response.read())
            
            access_token = token_response.get('access_token')
            user_id = token_response.get('user_id')
            email = token_response.get('email', '')
            
            api_url = f'https://api.vk.com/method/users.get?{urlencode({
                "user_ids": user_id,
                "fields": "photo_200",
                "access_token": access_token,
                "v": "5.131"
            })}'
            
            req = urllib.request.Request(api_url)
            with urllib.request.urlopen(req) as response:
                api_response = json.loads(response.read())
            
            user_info = api_response.get('response', [{}])[0]
            
            user_data = {
                'provider_id': str(user_id),
                'email': email or f'vk_{user_id}@secretum.casino',
                'name': f"{user_info.get('first_name', '')} {user_info.get('last_name', '')}".strip(),
                'avatar_url': user_info.get('photo_200', ''),
                'provider': 'vk'
            }
        
        if not user_data:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Invalid provider'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        cur.execute('''
            SELECT id, email, name, avatar_url, balance, created_at 
            FROM users 
            WHERE provider = %s AND provider_id = %s
        ''', (user_data['provider'], user_data['provider_id']))
        
        existing_user = cur.fetchone()
        
        if existing_user:
            user_id, email, name, avatar_url, balance, created_at = existing_user
            cur.execute('UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = %s', (user_id,))
        else:
            cur.execute('''
                INSERT INTO users (email, name, avatar_url, provider, provider_id, balance)
                VALUES (%s, %s, %s, %s, %s, 0)
                RETURNING id, email, name, avatar_url, balance, created_at
            ''', (
                user_data['email'],
                user_data['name'],
                user_data['avatar_url'],
                user_data['provider'],
                user_data['provider_id']
            ))
            user_id, email, name, avatar_url, balance, created_at = cur.fetchone()
        
        conn.commit()
        cur.close()
        conn.close()
        
        token = jwt.encode({
            'user_id': user_id,
            'email': email,
            'exp': int(time.time()) + 86400 * 30
        }, JWT_SECRET, algorithm='HS256')
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'token': token,
                'user': {
                    'id': user_id,
                    'email': email,
                    'name': name,
                    'avatar_url': avatar_url,
                    'balance': balance
                }
            }),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
