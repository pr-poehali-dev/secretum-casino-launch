'''
Business: Активация промокодов для пользователей
Args: event - dict с httpMethod, headers (X-Auth-Token), body с промокодом
      context - объект с атрибутами request_id
Returns: HTTP response с результатом активации
'''

import json
import os
import psycopg2
from typing import Dict, Any
import jwt

DATABASE_URL = os.environ.get('DATABASE_URL')
JWT_SECRET = os.environ.get('JWT_SECRET', 'default-secret-key')

def get_user_from_token(token: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return payload
    except:
        return None

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    headers = event.get('headers', {}) or {}
    token = headers.get('X-Auth-Token') or headers.get('x-auth-token')
    
    if not token:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Missing auth token'}),
            'isBase64Encoded': False
        }
    
    user_data = get_user_from_token(token)
    
    if not user_data:
        return {
            'statusCode': 401,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid token'}),
            'isBase64Encoded': False
        }
    
    user_id = user_data.get('user_id')
    body_data = json.loads(event.get('body', '{}'))
    promo_code = body_data.get('code', '').strip()
    
    if not promo_code:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Промокод не указан'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    cur.execute('''
        SELECT id, code, reward_amount, max_uses, current_uses, is_active
        FROM promo_codes
        WHERE code = %s
    ''', (promo_code,))
    
    promo = cur.fetchone()
    
    if not promo:
        cur.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Промокод не найден'}),
            'isBase64Encoded': False
        }
    
    promo_id, code, reward_amount, max_uses, current_uses, is_active = promo
    
    if not is_active:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Промокод неактивен'}),
            'isBase64Encoded': False
        }
    
    if current_uses >= max_uses:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Промокод исчерпан'}),
            'isBase64Encoded': False
        }
    
    cur.execute('''
        SELECT id FROM promo_activations
        WHERE user_id = %s AND promo_code_id = %s
    ''', (user_id, promo_id))
    
    if cur.fetchone():
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Вы уже использовали этот промокод'}),
            'isBase64Encoded': False
        }
    
    cur.execute('''
        INSERT INTO promo_activations (user_id, promo_code_id)
        VALUES (%s, %s)
    ''', (user_id, promo_id))
    
    cur.execute('''
        UPDATE promo_codes
        SET current_uses = current_uses + 1
        WHERE id = %s
    ''', (promo_id,))
    
    cur.execute('''
        UPDATE users
        SET balance = balance + %s
        WHERE id = %s
        RETURNING balance
    ''', (reward_amount, user_id))
    
    new_balance = cur.fetchone()[0]
    
    conn.commit()
    cur.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            'reward': reward_amount,
            'new_balance': new_balance,
            'message': f'Промокод активирован! +{reward_amount}₽'
        }),
        'isBase64Encoded': False
    }
