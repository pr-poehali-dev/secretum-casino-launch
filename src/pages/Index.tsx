import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [balance, setBalance] = useState(1000);
  const [isPlaying, setIsPlaying] = useState(false);

  const games = [
    {
      id: 'crash',
      name: 'CRASH',
      icon: 'Rocket',
      minBet: 30,
      winChance: '24-34%',
      gradient: 'from-neon-magenta to-purple-600',
      description: 'Ракетка взлетает, множитель растет. Успей забрать до взрыва!'
    },
    {
      id: 'mines',
      name: 'МИНЫ',
      icon: 'Bomb',
      minBet: 10,
      winChance: '24-34%',
      gradient: 'from-neon-cyan to-blue-600',
      description: 'Открывай клетки и собирай призы. Не попадись на мину!'
    },
    {
      id: 'coinflip',
      name: 'МОНЕТКА',
      icon: 'Coins',
      minBet: 15,
      winChance: '24-34%',
      gradient: 'from-neon-gold to-yellow-600',
      description: 'Орёл или решка? 50 на 50 шанс удвоить ставку!'
    }
  ];

  const cases = [
    {
      id: 'bomzh',
      name: 'БОМЖ',
      price: 20,
      items: [
        { amount: 1, chance: 30 },
        { amount: 3, chance: 30 },
        { amount: 4, chance: 30 },
        { amount: 10, chance: 22 },
        { amount: 100, chance: 2 }
      ],
      gradient: 'from-gray-600 to-gray-800'
    },
    {
      id: 'novice',
      name: 'НОВИЧОК',
      price: 25,
      items: [
        { amount: 15, chance: 50 },
        { amount: 40, chance: 20 },
        { amount: 65, chance: 19 },
        { amount: 70, chance: 18 },
        { amount: 250, chance: 15 }
      ],
      gradient: 'from-green-600 to-emerald-800'
    },
    {
      id: 'rich',
      name: 'БОГАТЫЙ',
      price: 300,
      items: [
        { amount: 200, chance: 30 },
        { amount: 250, chance: 27 },
        { amount: 450, chance: 20 },
        { amount: 600, chance: 13 },
        { amount: 1500, chance: 1 },
        { amount: 2550, chance: 0.1 }
      ],
      gradient: 'from-yellow-500 to-orange-600'
    }
  ];

  const openCase = (caseItem: any) => {
    if (balance < caseItem.price) {
      toast({
        title: "Недостаточно средств",
        description: "Пополните баланс для открытия кейса",
        variant: "destructive"
      });
      return;
    }

    setBalance(balance - caseItem.price);
    
    const random = Math.random() * 100;
    let cumulativeChance = 0;
    let wonAmount = 0;

    for (const item of caseItem.items) {
      cumulativeChance += item.chance;
      if (random <= cumulativeChance) {
        wonAmount = item.amount;
        break;
      }
    }

    setTimeout(() => {
      setBalance(prev => prev + wonAmount);
      toast({
        title: `Вы выиграли ${wonAmount}₽!`,
        description: `Из кейса "${caseItem.name}"`,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-neon-magenta/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-orbitron font-bold neon-text-magenta animate-pulse-neon">
              SECRETUM CASINO
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg neon-glow-gold">
                <Icon name="Wallet" size={20} className="text-neon-gold" />
                <span className="font-orbitron font-bold text-neon-gold">{balance}₽</span>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="neon-glow-cyan border-neon-cyan">
                    <Icon name="User" size={20} className="text-neon-cyan" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-card border-neon-magenta/30">
                  <SheetHeader>
                    <SheetTitle className="font-orbitron text-neon-magenta">ПРОФИЛЬ</SheetTitle>
                    <SheetDescription>Управление балансом и выводом средств</SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-4">
                    <Card className="bg-background border-neon-cyan/30">
                      <CardHeader>
                        <CardTitle className="font-orbitron text-neon-cyan">Баланс</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-neon-gold">{balance}₽</p>
                      </CardContent>
                    </Card>

                    <div className="space-y-2">
                      <Button 
                        className="w-full neon-glow-cyan bg-neon-cyan text-black hover:bg-neon-cyan/80 font-orbitron"
                        onClick={() => {
                          setBalance(prev => prev + 500);
                          toast({ title: "Баланс пополнен на 500₽" });
                        }}
                      >
                        <Icon name="Plus" size={16} className="mr-2" />
                        ПОПОЛНИТЬ
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="w-full border-neon-magenta text-neon-magenta hover:bg-neon-magenta/10 font-orbitron"
                        onClick={() => {
                          if (balance >= 2000) {
                            toast({ title: "Заявка на вывод создана", description: `Сумма: ${balance}₽` });
                          } else {
                            toast({ 
                              title: "Минимум для вывода 2000₽",
                              variant: "destructive" 
                            });
                          }
                        }}
                      >
                        <Icon name="ArrowUpRight" size={16} className="mr-2" />
                        ВЫВЕСТИ (мин. 2000₽)
                      </Button>
                    </div>

                    <Card className="bg-background border-neon-magenta/30 mt-6">
                      <CardHeader>
                        <CardTitle className="font-orbitron text-sm">ПРАВИЛА</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs space-y-2 text-muted-foreground">
                        <p>• Минимальная сумма вывода: 2000₽</p>
                        <p>• Обработка вывода: до 24 часов</p>
                        <p>• Честная игра с доказуемой случайностью</p>
                        <p>• Шанс выигрыша в играх: 24-34%</p>
                      </CardContent>
                    </Card>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 relative overflow-hidden rounded-2xl p-12 text-center">
          <div className="absolute inset-0 gradient-neon opacity-20 animate-pulse-neon"></div>
          <div className="relative z-10">
            <h2 className="text-5xl font-orbitron font-black mb-4 neon-text-cyan animate-float">
              ДОБРО ПОЖАЛОВАТЬ
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              В мир неоновых побед и киберпанк азарта
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <div className="bg-card/50 backdrop-blur px-6 py-3 rounded-lg border border-neon-magenta/30">
                <Icon name="Rocket" size={24} className="text-neon-magenta inline mr-2" />
                <span className="font-orbitron">CRASH</span>
              </div>
              <div className="bg-card/50 backdrop-blur px-6 py-3 rounded-lg border border-neon-cyan/30">
                <Icon name="Bomb" size={24} className="text-neon-cyan inline mr-2" />
                <span className="font-orbitron">МИНЫ</span>
              </div>
              <div className="bg-card/50 backdrop-blur px-6 py-3 rounded-lg border border-neon-gold/30">
                <Icon name="Coins" size={24} className="text-neon-gold inline mr-2" />
                <span className="font-orbitron">МОНЕТКА</span>
              </div>
            </div>
          </div>
        </section>

        <Tabs defaultValue="games" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-card border border-neon-magenta/30">
            <TabsTrigger value="games" className="font-orbitron data-[state=active]:bg-neon-magenta data-[state=active]:text-black">
              <Icon name="Gamepad2" size={18} className="mr-2" />
              ИГРЫ
            </TabsTrigger>
            <TabsTrigger value="cases" className="font-orbitron data-[state=active]:bg-neon-cyan data-[state=active]:text-black">
              <Icon name="Package" size={18} className="mr-2" />
              КЕЙСЫ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="games" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {games.map((game) => (
                <Card key={game.id} className="bg-card border-2 border-transparent hover:border-neon-magenta transition-all hover:scale-105 group">
                  <CardHeader>
                    <div className={`w-full h-40 bg-gradient-to-br ${game.gradient} rounded-lg flex items-center justify-center mb-4 group-hover:animate-float`}>
                      <Icon name={game.icon as any} size={64} className="text-white" />
                    </div>
                    <CardTitle className="font-orbitron text-2xl neon-text-magenta">{game.name}</CardTitle>
                    <CardDescription>{game.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Минимальная ставка:</span>
                      <span className="font-bold text-neon-gold">{game.minBet}₽</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Шанс выигрыша:</span>
                      <span className="font-bold text-neon-cyan">{game.winChance}</span>
                    </div>
                    <Button 
                      className="w-full neon-glow-magenta bg-neon-magenta text-black hover:bg-neon-magenta/80 font-orbitron font-bold"
                      onClick={() => {
                        if (balance >= game.minBet) {
                          setIsPlaying(true);
                          toast({ title: `Запуск игры ${game.name}...` });
                          setTimeout(() => setIsPlaying(false), 2000);
                        } else {
                          toast({ 
                            title: "Недостаточно средств",
                            variant: "destructive" 
                          });
                        }
                      }}
                      disabled={isPlaying}
                    >
                      {isPlaying ? 'ИГРАЕМ...' : 'ИГРАТЬ'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cases" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {cases.map((caseItem) => (
                <Card key={caseItem.id} className="bg-card border-2 border-transparent hover:border-neon-cyan transition-all hover:scale-105 group">
                  <CardHeader>
                    <div className={`w-full h-40 bg-gradient-to-br ${caseItem.gradient} rounded-lg flex items-center justify-center mb-4 relative overflow-hidden`}>
                      <Icon name="Package" size={64} className="text-white group-hover:animate-float" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    <CardTitle className="font-orbitron text-2xl neon-text-cyan">{caseItem.name}</CardTitle>
                    <CardDescription>Открой и получи приз!</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground mb-2">Возможные призы:</p>
                      {caseItem.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-neon-gold">{item.amount}₽</span>
                          <span className="text-muted-foreground">{item.chance}%</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full neon-glow-cyan bg-neon-cyan text-black hover:bg-neon-cyan/80 font-orbitron font-bold"
                      onClick={() => openCase(caseItem)}
                    >
                      ОТКРЫТЬ ЗА {caseItem.price}₽
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-neon-magenta/30 mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            <span className="neon-text-magenta font-orbitron font-bold">SECRETUM CASINO</span> — Играй ответственно
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;