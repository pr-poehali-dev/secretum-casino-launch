import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

const AUTH_URL = 'https://functions.poehali.dev/26f10c2a-2530-402b-bb12-9af71c320ca4';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
      return;
    }

    const code = searchParams.get('code');
    const provider = searchParams.get('provider');

    if (code && provider) {
      handleCallback(code, provider);
    }
  }, [searchParams, isAuthenticated]);

  const handleCallback = async (code: string, provider: string) => {
    try {
      const redirectUri = `${window.location.origin}/login`;
      
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, code, redirect_uri: redirectUri })
      });

      const data = await response.json();

      if (response.ok && data.token && data.user) {
        login(data.user, data.token);
        toast({ title: '🎉 Вход выполнен!', description: `Добро пожаловать, ${data.user.name}!` });
        navigate('/');
      } else {
        toast({ title: 'Ошибка входа', description: data.error || 'Попробуйте снова', variant: 'destructive' });
        navigate('/login');
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось войти', variant: 'destructive' });
      navigate('/login');
    }
  };

  const handleGoogleLogin = async () => {
    if (!captchaToken) {
      toast({ title: 'Подтвердите капчу', description: 'Пожалуйста, подтвердите, что вы не робот', variant: 'destructive' });
      return;
    }
    
    try {
      const redirectUri = `${window.location.origin}/login`;
      const response = await fetch(`${AUTH_URL}?action=google-url&redirect_uri=${encodeURIComponent(redirectUri)}`);
      const data = await response.json();
      
      if (data.url) {
        window.location.href = `${data.url}&state=provider:google`;
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось подключиться к Google', variant: 'destructive' });
    }
  };

  const handleVKLogin = async () => {
    if (!captchaToken) {
      toast({ title: 'Подтвердите капчу', description: 'Пожалуйста, подтвердите, что вы не робот', variant: 'destructive' });
      return;
    }
    
    try {
      const redirectUri = `${window.location.origin}/login`;
      const response = await fetch(`${AUTH_URL}?action=vk-url&redirect_uri=${encodeURIComponent(redirectUri)}`);
      const data = await response.json();
      
      if (data.url) {
        window.location.href = `${data.url}&state=provider:vk`;
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось подключиться к VK', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-8 px-4">
      <Card className="max-w-md w-full p-8 border-primary/30 neon-glow-magenta">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-neon flex items-center justify-center neon-glow-gold animate-pulse-neon">
            <Icon name="Sparkles" size={48} className="text-background" />
          </div>
          <h1 className="text-4xl font-bold neon-text-magenta mb-2">SECRETUM</h1>
          <p className="text-xl neon-text-cyan mb-2">CASINO</p>
          <p className="text-muted-foreground">Войдите, чтобы начать игру</p>
        </div>

        <div className="mb-6 flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={(token) => setCaptchaToken(token)}
            onExpired={() => setCaptchaToken(null)}
            theme="dark"
          />
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            disabled={!captchaToken}
            className="w-full bg-white hover:bg-gray-100 text-black border-2 border-primary/30 py-6 text-lg disabled:opacity-50"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Войти через Google
          </Button>

          <Button
            onClick={handleVKLogin}
            disabled={!captchaToken}
            className="w-full bg-[#0077FF] hover:bg-[#0066DD] text-white border-2 border-primary/30 py-6 text-lg disabled:opacity-50"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.574-1.496c.586-.19 1.336 1.26 2.132 1.818.6.419 1.056.327 1.056.327l2.125-.03s1.111-.07.584-.96c-.043-.073-.308-.663-1.588-1.875-1.34-1.27-1.16-1.063.453-3.256.983-1.334 1.374-2.148 1.25-2.496-.117-.332-.842-.244-.842-.244l-2.393.015s-.178-.025-.309.056c-.128.079-.21.263-.21.263s-.377 1.023-.88 1.893c-1.06 1.832-1.484 1.928-1.658 1.813-.404-.267-.303-1.075-.303-1.648 0-1.792.266-2.536-.519-2.729-.26-.064-.452-.106-1.118-.113-.856-.009-1.58.003-1.99.208-.273.137-.483.442-.355.46.158.022.517.099.707.363.246.341.237 1.107.237 1.107s.142 2.11-.33 2.371c-.324.18-.768-.187-1.722-1.862-.488-.854-.857-1.8-.857-1.8s-.071-.178-.198-.273c-.154-.115-.37-.152-.37-.152l-2.274.015s-.342.01-.467.161c-.112.134-.009.41-.009.41s1.773 4.233 3.781 6.364c1.843 1.955 3.937 1.827 3.937 1.827h.949z"/>
            </svg>
            Войти через VK
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Нажимая кнопку входа, вы соглашаетесь с правилами казино
          </p>
          <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
            <span className="flex items-center">
              <Icon name="Shield" size={14} className="mr-1 text-accent" />
              Безопасно
            </span>
            <span className="flex items-center">
              <Icon name="Lock" size={14} className="mr-1 text-accent" />
              Зашифровано
            </span>
            <span className="flex items-center">
              <Icon name="Check" size={14} className="mr-1 text-accent" />
              18+
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;