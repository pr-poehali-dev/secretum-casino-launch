import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useGame } from '@/contexts/GameContext';
import { useToast } from '@/hooks/use-toast';

const Balance = () => {
  const { balance, addToBalance, subtractFromBalance, tapPower, tapCost, upgradeTap, handleTap } = useGame();
  const { toast } = useToast();

  const [depositAmount, setDepositAmount] = useState(100);
  const [withdrawAmount, setWithdrawAmount] = useState(3500);
  const [tapAnimation, setTapAnimation] = useState(false);

  const handleDeposit = () => {
    if (depositAmount < 1) {
      toast({ title: 'Ошибка', description: 'Минимальная сумма пополнения 1₽', variant: 'destructive' });
      return;
    }
    addToBalance(depositAmount);
    toast({ title: '✅ Успех', description: `Баланс пополнен на ${depositAmount}₽` });
  };

  const handleWithdraw = () => {
    if (withdrawAmount < 3500) {
      toast({ title: 'Ошибка', description: 'Минимальная сумма вывода 3500₽', variant: 'destructive' });
      return;
    }
    if (!subtractFromBalance(withdrawAmount)) {
      toast({ title: 'Ошибка', description: 'Недостаточно средств', variant: 'destructive' });
      return;
    }
    toast({ title: '✅ Заявка создана', description: `Вывод ${withdrawAmount}₽ обрабатывается` });
  };

  const handleTapClick = () => {
    handleTap();
    setTapAnimation(true);
    setTimeout(() => setTapAnimation(false), 300);
    toast({ title: `+${tapPower}₽`, description: 'Монеты зачислены!' });
  };

  const handleUpgrade = () => {
    if (upgradeTap()) {
      toast({ title: '🚀 Улучшение!', description: `Сила тапа увеличена до ${tapPower + 1} коинов` });
    } else {
      toast({ title: 'Ошибка', description: 'Недостаточно средств для улучшения', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold neon-text-magenta mb-8 text-center">Баланс</h1>

        <Card className="p-8 mb-8 text-center border-accent/30 neon-glow-gold">
          <p className="text-muted-foreground mb-2">Текущий баланс</p>
          <h2 className="text-6xl font-bold neon-text-gold mb-4">{balance.toFixed(2)} ₽</h2>
          <div className="flex justify-center gap-4">
            <Icon name="Coins" size={32} className="text-accent animate-pulse-neon" />
          </div>
        </Card>

        <Tabs defaultValue="tap" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="tap">
              <Icon name="Hand" size={18} className="mr-2" />
              Тапалка
            </TabsTrigger>
            <TabsTrigger value="deposit">
              <Icon name="PlusCircle" size={18} className="mr-2" />
              Пополнение
            </TabsTrigger>
            <TabsTrigger value="withdraw">
              <Icon name="MinusCircle" size={18} className="mr-2" />
              Вывод
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tap">
            <Card className="p-8 border-primary/30 neon-glow-magenta">
              <h2 className="text-3xl font-bold neon-text-magenta mb-6 text-center">Кликер монет 🪙</h2>

              <div className="text-center mb-8">
                <p className="text-muted-foreground mb-2">Сила тапа</p>
                <p className="text-4xl font-bold neon-text-cyan">+{tapPower} коинов за клик</p>
              </div>

              <div className="flex justify-center mb-8">
                <button
                  onClick={handleTapClick}
                  className={`relative transition-transform ${tapAnimation ? 'scale-90' : 'scale-100'}`}
                >
                  <img
                    src="https://cdn.poehali.dev/projects/8f9e9067-d2e1-4294-9050-e22f9293a147/files/57a7dfa5-24b0-4480-9a51-bf5cdf569509.jpg"
                    alt="Coin"
                    className="w-64 h-64 object-contain neon-glow-gold animate-float cursor-pointer hover:scale-110 transition-transform"
                  />
                </button>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <Card className="p-6 bg-card/50 border-accent/30">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xl font-bold">Улучшить тап</h3>
                      <p className="text-sm text-muted-foreground">Следующий уровень: +{tapPower + 1} коин</p>
                    </div>
                    <Icon name="ArrowUp" size={32} className="text-accent" />
                  </div>
                  <Button onClick={handleUpgrade} className="w-full bg-accent hover:bg-accent/90 text-background neon-glow-gold">
                    <Icon name="Zap" size={20} className="mr-2" />
                    Улучшить за {tapCost}₽
                  </Button>
                </Card>

                <div className="text-center text-muted-foreground space-y-2">
                  <p className="flex items-center justify-center">
                    <Icon name="Info" size={16} className="mr-2" />
                    Тапай по монете и зарабатывай коины
                  </p>
                  <p className="flex items-center justify-center">
                    <Icon name="TrendingUp" size={16} className="mr-2" />
                    Улучшай силу тапа за {tapCost}₽
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="deposit">
            <Card className="p-8 border-secondary/30 neon-glow-cyan">
              <h2 className="text-3xl font-bold neon-text-cyan mb-6 text-center">Пополнение баланса</h2>

              <div className="max-w-md mx-auto space-y-6">
                <div>
                  <label className="block mb-2 text-muted-foreground">Сумма пополнения</label>
                  <Input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    placeholder="Введите сумму"
                    className="text-lg"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[100, 500, 1000, 2500, 5000, 10000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => setDepositAmount(amount)}
                      className="border-secondary/50 hover:bg-secondary/10"
                    >
                      {amount}₽
                    </Button>
                  ))}
                </div>

                <Button onClick={handleDeposit} className="w-full bg-secondary hover:bg-secondary/90 neon-glow-cyan text-background text-lg py-6">
                  <Icon name="CreditCard" size={24} className="mr-2" />
                  Пополнить {depositAmount}₽
                </Button>

                <Card className="p-4 bg-card/50 border-primary/20">
                  <p className="text-sm text-muted-foreground flex items-start">
                    <Icon name="Info" size={16} className="mr-2 mt-1" />
                    В демо-режиме пополнение происходит мгновенно. В реальном казино используются платёжные системы.
                  </p>
                </Card>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="withdraw">
            <Card className="p-8 border-accent/30 neon-glow-gold">
              <h2 className="text-3xl font-bold neon-text-gold mb-6 text-center">Вывод средств</h2>

              <div className="max-w-md mx-auto space-y-6">
                <div>
                  <label className="block mb-2 text-muted-foreground">Сумма вывода (мин. 3500₽)</label>
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    placeholder="Введите сумму"
                    className="text-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[3500, 5000, 10000, 20000].map((amount) => (
                    <Button
                      key={amount}
                      variant="outline"
                      onClick={() => setWithdrawAmount(amount)}
                      className="border-accent/50 hover:bg-accent/10"
                    >
                      {amount}₽
                    </Button>
                  ))}
                </div>

                <Button
                  onClick={handleWithdraw}
                  disabled={balance < 3500}
                  className="w-full bg-accent hover:bg-accent/90 neon-glow-gold text-background text-lg py-6"
                >
                  <Icon name="ArrowDownToLine" size={24} className="mr-2" />
                  Вывести {withdrawAmount}₽
                </Button>

                <Card className="p-4 bg-card/50 border-primary/20">
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-start">
                      <Icon name="AlertCircle" size={16} className="mr-2 mt-1 text-accent" />
                      Минимальная сумма вывода: 3500₽
                    </p>
                    <p className="flex items-start">
                      <Icon name="Clock" size={16} className="mr-2 mt-1 text-accent" />
                      Обработка заявки: 1-3 рабочих дня
                    </p>
                    <p className="flex items-start">
                      <Icon name="Shield" size={16} className="mr-2 mt-1 text-accent" />
                      Вывод доступен только на верифицированные счета
                    </p>
                  </div>
                </Card>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Balance;
