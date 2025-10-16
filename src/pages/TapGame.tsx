import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useGame } from '@/contexts/GameContext';
import { toast } from '@/hooks/use-toast';

const TapGame = () => {
  const { balance, setBalance } = useGame();
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem('tap_coins');
    return saved ? parseInt(saved) : 0;
  });
  const [tapPower, setTapPower] = useState(() => {
    const saved = localStorage.getItem('coin_tap_power');
    return saved ? parseInt(saved) : 1;
  });
  const [isSubscribed, setIsSubscribed] = useState(() => {
    return localStorage.getItem('telegram_subscribed') === 'true';
  });
  const [clickAnimation, setClickAnimation] = useState<{ x: number; y: number; id: number }[]>([]);
  const [animationId, setAnimationId] = useState(0);

  const upgradeCost = 50;
  const withdrawThreshold = 3000;
  const withdrawAmount = 200;
  const subscribeBonus = 30;

  useEffect(() => {
    localStorage.setItem('tap_coins', coins.toString());
  }, [coins]);

  useEffect(() => {
    localStorage.setItem('coin_tap_power', tapPower.toString());
  }, [tapPower]);

  const handleCoinTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCoins(prev => prev + tapPower);
    
    const newId = animationId;
    setAnimationId(prev => prev + 1);
    setClickAnimation(prev => [...prev, { x, y, id: newId }]);
    
    setTimeout(() => {
      setClickAnimation(prev => prev.filter(anim => anim.id !== newId));
    }, 1000);
  };

  const handleUpgrade = () => {
    if (balance >= upgradeCost) {
      setBalance(balance - upgradeCost);
      setTapPower(prev => prev + 1);
      toast({
        title: '🎉 Улучшение куплено!',
        description: `Теперь +${tapPower + 1} монет за тап`
      });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FFD700', '#00FFFF']
      });
    } else {
      toast({
        title: 'Недостаточно средств',
        description: `Нужно ${upgradeCost}₽`,
        variant: 'destructive'
      });
    }
  };

  const handleWithdraw = () => {
    if (coins >= withdrawThreshold) {
      setCoins(prev => prev - withdrawThreshold);
      setBalance(prev => prev + withdrawAmount);
      toast({
        title: '💰 Вывод успешен!',
        description: `+${withdrawAmount}₽ зачислено на баланс`
      });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#00FFFF', '#FF00FF']
      });
    } else {
      toast({
        title: 'Недостаточно монет',
        description: `Нужно ${withdrawThreshold} монет`,
        variant: 'destructive'
      });
    }
  };

  const handleSubscribe = () => {
    window.open('https://t.me/proectkot', '_blank');
    
    setTimeout(() => {
      if (!isSubscribed) {
        setCoins(prev => prev + subscribeBonus);
        setIsSubscribed(true);
        localStorage.setItem('telegram_subscribed', 'true');
        toast({
          title: '🎁 Бонус получен!',
          description: `+${subscribeBonus} монет за подписку`
        });
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#00FFFF']
        });
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold neon-text-gold mb-8 text-center">
          Таполек Монет
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-accent/30 neon-glow-gold text-center">
            <Icon name="Coins" size={48} className="mx-auto mb-3 neon-text-gold" />
            <p className="text-muted-foreground mb-2">Монеты</p>
            <p className="text-3xl font-bold neon-text-gold">{coins}</p>
          </Card>

          <Card className="p-6 border-primary/30 neon-glow-cyan text-center">
            <Icon name="Zap" size={48} className="mx-auto mb-3 neon-text-cyan" />
            <p className="text-muted-foreground mb-2">Сила тапа</p>
            <p className="text-3xl font-bold neon-text-cyan">+{tapPower}</p>
          </Card>

          <Card className="p-6 border-secondary/30 neon-glow-magenta text-center">
            <Icon name="Wallet" size={48} className="mx-auto mb-3 neon-text-magenta" />
            <p className="text-muted-foreground mb-2">Баланс</p>
            <p className="text-3xl font-bold neon-text-magenta">{balance.toFixed(2)}₽</p>
          </Card>
        </div>

        <Card className="p-8 border-accent/30 neon-glow-gold mb-8 relative overflow-hidden">
          <h3 className="text-2xl font-bold neon-text-gold mb-6 text-center flex items-center justify-center">
            <Icon name="Hand" size={28} className="mr-3" />
            Кликай на монету!
          </h3>

          <div 
            className="relative w-64 h-64 mx-auto cursor-pointer select-none group"
            onClick={handleCoinTap}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-accent via-accent/80 to-accent/60 neon-glow-gold flex items-center justify-center transform transition-transform group-hover:scale-105 active:scale-95">
              <Icon name="Coins" size={128} className="text-background drop-shadow-2xl" />
            </div>
            
            {clickAnimation.map((anim) => (
              <div
                key={anim.id}
                className="absolute text-2xl font-bold neon-text-gold pointer-events-none animate-float-up"
                style={{
                  left: `${anim.x}px`,
                  top: `${anim.y}px`,
                }}
              >
                +{tapPower}
              </div>
            ))}
          </div>

          <p className="text-center text-muted-foreground mt-6">
            Каждый клик = <span className="neon-text-gold font-bold">+{tapPower}</span> монет
          </p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 border-primary/30 neon-glow-cyan">
            <h3 className="text-xl font-bold neon-text-cyan mb-4 flex items-center">
              <Icon name="TrendingUp" size={24} className="mr-3" />
              Улучшение
            </h3>
            <p className="text-muted-foreground mb-4">
              Увеличь силу тапа на <span className="neon-text-cyan font-bold">+1 монету</span>
            </p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">Стоимость:</span>
              <span className="font-bold neon-text-gold">{upgradeCost}₽</span>
            </div>
            <Button 
              onClick={handleUpgrade}
              disabled={balance < upgradeCost}
              className="w-full bg-primary hover:bg-primary/90 neon-glow-cyan"
            >
              <Icon name="ArrowUp" size={20} className="mr-2" />
              Улучшить тап
            </Button>
          </Card>

          <Card className="p-6 border-accent/30 neon-glow-gold">
            <h3 className="text-xl font-bold neon-text-gold mb-4 flex items-center">
              <Icon name="Banknote" size={24} className="mr-3" />
              Вывод монет
            </h3>
            <p className="text-muted-foreground mb-4">
              Обменяй монеты на рубли
            </p>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span>Нужно монет:</span>
                <span className="font-bold">{withdrawThreshold}</span>
              </div>
              <div className="flex justify-between">
                <span>Получишь:</span>
                <span className="font-bold neon-text-gold">{withdrawAmount}₽</span>
              </div>
              <div className="flex justify-between">
                <span>Прогресс:</span>
                <span className={coins >= withdrawThreshold ? 'neon-text-gold font-bold' : ''}>
                  {coins}/{withdrawThreshold}
                </span>
              </div>
            </div>
            <Button 
              onClick={handleWithdraw}
              disabled={coins < withdrawThreshold}
              className="w-full bg-accent hover:bg-accent/90 neon-glow-gold text-background"
            >
              <Icon name="Download" size={20} className="mr-2" />
              Вывести {withdrawAmount}₽
            </Button>
          </Card>
        </div>

        <Card className="p-6 border-secondary/30 neon-glow-magenta">
          <h3 className="text-xl font-bold neon-text-magenta mb-4 flex items-center">
            <Icon name="Gift" size={24} className="mr-3" />
            Бонусы
          </h3>
          <div className="bg-card/50 rounded-lg p-4 border border-primary/20 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Send" size={32} className="neon-text-cyan" />
                <div>
                  <p className="font-semibold">Подпишись на Telegram</p>
                  <p className="text-sm text-muted-foreground">Получи {subscribeBonus} монет</p>
                </div>
              </div>
              {isSubscribed ? (
                <div className="flex items-center space-x-2 text-accent">
                  <Icon name="CheckCircle2" size={24} />
                  <span className="font-bold">Получено</span>
                </div>
              ) : (
                <Button 
                  onClick={handleSubscribe}
                  className="bg-primary hover:bg-primary/90 neon-glow-cyan"
                >
                  <Icon name="Send" size={20} className="mr-2" />
                  Подписаться
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.5);
          }
        }
        .animate-float-up {
          animation: float-up 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default TapGame;
