import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useGame } from '@/contexts/GameContext';
import { useToast } from '@/hooks/use-toast';

interface CaseItem {
  name: string;
  price: number;
  color: string;
  glowClass: string;
  items: { amount: number; chance: number }[];
}

const Cases = () => {
  const { balance, subtractFromBalance, addToBalance } = useGame();
  const { toast } = useToast();
  const [opening, setOpening] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);

  const cases: CaseItem[] = [
    {
      name: 'Бомж',
      price: 20,
      color: 'border-gray-500',
      glowClass: 'neon-glow-magenta',
      items: [
        { amount: 1, chance: 30 },
        { amount: 3, chance: 30 },
        { amount: 4, chance: 30 },
        { amount: 10, chance: 22 },
        { amount: 100, chance: 2 },
      ],
    },
    {
      name: 'Новичок',
      price: 25,
      color: 'border-blue-500',
      glowClass: 'neon-glow-cyan',
      items: [
        { amount: 15, chance: 50 },
        { amount: 40, chance: 20 },
        { amount: 65, chance: 19 },
        { amount: 70, chance: 18 },
        { amount: 250, chance: 15 },
      ],
    },
    {
      name: 'Богатый',
      price: 300,
      color: 'border-accent',
      glowClass: 'neon-glow-gold',
      items: [
        { amount: 200, chance: 30 },
        { amount: 250, chance: 27 },
        { amount: 450, chance: 20 },
        { amount: 600, chance: 13 },
        { amount: 1500, chance: 1 },
        { amount: 2550, chance: 0.1 },
      ],
    },
  ];

  const openCase = (caseData: CaseItem) => {
    if (!subtractFromBalance(caseData.price)) {
      toast({ title: 'Ошибка', description: 'Недостаточно средств', variant: 'destructive' });
      return;
    }

    setOpening(true);
    setSelectedCase(caseData);

    setTimeout(() => {
      const random = Math.random() * 100;
      let cumulative = 0;
      let wonItem = caseData.items[0];

      for (const item of caseData.items) {
        cumulative += item.chance;
        if (random <= cumulative) {
          wonItem = item;
          break;
        }
      }

      addToBalance(wonItem.amount);
      setOpening(false);

      toast({
        title: '🎉 Кейс открыт!',
        description: `Вы выиграли ${wonItem.amount}₽!`,
      });

      setSelectedCase(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold neon-text-cyan mb-4 text-center">Кейсы</h1>
        <p className="text-center text-muted-foreground mb-8">Открой кейс и получи награду!</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {cases.map((caseData) => (
            <Card
              key={caseData.name}
              className={`p-6 border-2 ${caseData.color} ${caseData.glowClass} hover:scale-105 transition-all duration-300`}
            >
              <div className="relative h-64 mb-4 flex items-center justify-center">
                <img
                  src="https://cdn.poehali.dev/projects/8f9e9067-d2e1-4294-9050-e22f9293a147/files/29593b19-9257-4c17-ba8e-006c0101f4ce.jpg"
                  alt={caseData.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent rounded-lg"></div>
              </div>

              <h3 className="text-3xl font-bold neon-text-gold mb-2">{caseData.name}</h3>
              <p className="text-4xl font-bold text-accent mb-4">{caseData.price} ₽</p>

              <div className="space-y-2 mb-4">
                <p className="text-sm font-semibold text-muted-foreground">Возможные выигрыши:</p>
                {caseData.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-accent font-bold">{item.amount}₽</span>
                    <span className="text-muted-foreground">{item.chance}%</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => openCase(caseData)}
                disabled={opening}
                className={`w-full ${caseData.glowClass} bg-primary/20 hover:bg-primary/30 border border-primary/50`}
              >
                <Icon name="Package" size={20} className="mr-2" />
                Открыть за {caseData.price}₽
              </Button>
            </Card>
          ))}
        </div>

        {opening && selectedCase && (
          <Card className="p-12 text-center border-primary/30 neon-glow-magenta mb-8">
            <h2 className="text-4xl font-bold neon-text-magenta mb-8">Открываем кейс "{selectedCase.name}"</h2>
            <div className="flex justify-center mb-8">
              <Icon name="Package" size={128} className="text-primary animate-pulse-neon" />
            </div>
            <div className="flex justify-center">
              <Icon name="Loader2" size={48} className="animate-spin text-accent" />
            </div>
            <p className="text-xl text-muted-foreground mt-4">Подождите...</p>
          </Card>
        )}

        <Card className="p-8 bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30 text-center">
          <h3 className="text-3xl font-bold neon-text-cyan mb-4">Как работают кейсы?</h3>
          <div className="max-w-2xl mx-auto text-left space-y-4 text-muted-foreground">
            <p className="flex items-start">
              <Icon name="Check" size={20} className="mr-2 mt-1 text-accent" />
              Выберите кейс и оплатите его стоимость
            </p>
            <p className="flex items-start">
              <Icon name="Check" size={20} className="mr-2 mt-1 text-accent" />
              Система случайным образом определит ваш выигрыш
            </p>
            <p className="flex items-start">
              <Icon name="Check" size={20} className="mr-2 mt-1 text-accent" />
              Выигрыш автоматически зачислится на баланс
            </p>
            <p className="flex items-start">
              <Icon name="Check" size={20} className="mr-2 mt-1 text-accent" />
              Чем дороже кейс, тем больше потенциальный выигрыш
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Cases;
