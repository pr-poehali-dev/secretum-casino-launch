import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useGame } from '@/contexts/GameContext';
import { useToast } from '@/hooks/use-toast';

const Games = () => {
  const { balance, subtractFromBalance, addToBalance } = useGame();
  const { toast } = useToast();
  const [activeGame, setActiveGame] = useState<'crash' | 'mines' | 'coin' | null>(null);

  const [crashBet, setCrashBet] = useState(30);
  const [crashMultiplier, setCrashMultiplier] = useState(1.0);
  const [crashActive, setCrashActive] = useState(false);
  const [crashInterval, setCrashInterval] = useState<NodeJS.Timeout | null>(null);

  const [minesBet, setMinesBet] = useState(10);
  const [minesField, setMinesField] = useState<boolean[]>(Array(25).fill(false));
  const [minesRevealed, setMinesRevealed] = useState<number[]>([]);
  const [minesActive, setMinesActive] = useState(false);
  const [minesMultiplier, setMinesMultiplier] = useState(1.0);

  const [coinBet, setCoinBet] = useState(15);
  const [coinChoice, setCoinChoice] = useState<'heads' | 'tails' | null>(null);
  const [coinFlipping, setCoinFlipping] = useState(false);

  const startCrash = () => {
    if (crashBet < 30) {
      toast({ title: 'Ошибка', description: 'Минимальная ставка 30₽', variant: 'destructive' });
      return;
    }
    if (!subtractFromBalance(crashBet)) {
      toast({ title: 'Ошибка', description: 'Недостаточно средств', variant: 'destructive' });
      return;
    }

    setCrashActive(true);
    setCrashMultiplier(1.0);

    const crashPoint = 1 + Math.random() * 4;
    const winChance = Math.random() < 0.29;
    const actualCrashPoint = winChance ? crashPoint : 1 + Math.random() * 2;

    const interval = setInterval(() => {
      setCrashMultiplier((prev) => {
        const next = prev + 0.1;
        if (next >= actualCrashPoint) {
          clearInterval(interval);
          setCrashActive(false);
          toast({ title: '💥 CRASH!', description: `Ракета взорвалась на ${actualCrashPoint.toFixed(2)}x` });
          return prev;
        }
        return next;
      });
    }, 100);

    setCrashInterval(interval);
  };

  const cashoutCrash = () => {
    if (crashInterval) clearInterval(crashInterval);
    setCrashActive(false);
    const winAmount = crashBet * crashMultiplier;
    addToBalance(winAmount);
    toast({
      title: '🚀 Успех!',
      description: `Выведено ${winAmount.toFixed(2)}₽ с множителем ${crashMultiplier.toFixed(2)}x`,
    });
  };

  const startMines = () => {
    if (minesBet < 10) {
      toast({ title: 'Ошибка', description: 'Минимальная ставка 10₽', variant: 'destructive' });
      return;
    }
    if (!subtractFromBalance(minesBet)) {
      toast({ title: 'Ошибка', description: 'Недостаточно средств', variant: 'destructive' });
      return;
    }

    const field = Array(25).fill(false);
    const minePositions = new Set<number>();
    while (minePositions.size < 5) {
      minePositions.add(Math.floor(Math.random() * 25));
    }
    minePositions.forEach((pos) => (field[pos] = true));

    setMinesField(field);
    setMinesRevealed([]);
    setMinesActive(true);
    setMinesMultiplier(1.0);
  };

  const revealCell = (index: number) => {
    if (!minesActive || minesRevealed.includes(index)) return;

    if (minesField[index]) {
      setMinesActive(false);
      setMinesRevealed([...minesRevealed, index]);
      toast({ title: '💣 Взрыв!', description: 'Вы наткнулись на мину!', variant: 'destructive' });
    } else {
      const newRevealed = [...minesRevealed, index];
      setMinesRevealed(newRevealed);
      const newMultiplier = 1 + newRevealed.length * 0.3;
      setMinesMultiplier(newMultiplier);
      
      if (newRevealed.length === 20) {
        const winAmount = minesBet * newMultiplier;
        addToBalance(winAmount);
        setMinesActive(false);
        toast({ title: '🎉 Победа!', description: `Вы выиграли ${winAmount.toFixed(2)}₽!` });
      }
    }
  };

  const cashoutMines = () => {
    if (minesRevealed.length === 0) return;
    const winAmount = minesBet * minesMultiplier;
    addToBalance(winAmount);
    setMinesActive(false);
    toast({ title: '✅ Вывод', description: `Выведено ${winAmount.toFixed(2)}₽` });
  };

  const playCoin = (choice: 'heads' | 'tails') => {
    if (coinBet < 15) {
      toast({ title: 'Ошибка', description: 'Минимальная ставка 15₽', variant: 'destructive' });
      return;
    }
    if (!subtractFromBalance(coinBet)) {
      toast({ title: 'Ошибка', description: 'Недостаточно средств', variant: 'destructive' });
      return;
    }

    setCoinFlipping(true);
    setCoinChoice(choice);

    setTimeout(() => {
      const result: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';
      const won = result === choice && Math.random() < 0.29;

      if (won) {
        const winAmount = coinBet * 2;
        addToBalance(winAmount);
        toast({ title: '🪙 Победа!', description: `Выпало ${result === 'heads' ? 'Орёл' : 'Решка'}! +${winAmount}₽` });
      } else {
        toast({
          title: '😔 Проигрыш',
          description: `Выпало ${result === 'heads' ? 'Орёл' : 'Решка'}`,
          variant: 'destructive',
        });
      }

      setCoinFlipping(false);
      setCoinChoice(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold neon-text-magenta mb-8 text-center">Игры</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card
            className={`p-6 cursor-pointer transition-all ${
              activeGame === 'crash' ? 'border-primary neon-glow-magenta' : 'border-primary/30'
            }`}
            onClick={() => setActiveGame('crash')}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="Rocket" size={32} className="text-primary" />
              <div>
                <h3 className="text-2xl font-bold">Crash</h3>
                <p className="text-sm text-muted-foreground">От 30₽</p>
              </div>
            </div>
            <p className="text-muted-foreground">Выведи ставку до взрыва ракеты</p>
          </Card>

          <Card
            className={`p-6 cursor-pointer transition-all ${
              activeGame === 'mines' ? 'border-secondary neon-glow-cyan' : 'border-primary/30'
            }`}
            onClick={() => setActiveGame('mines')}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="Bomb" size={32} className="text-secondary" />
              <div>
                <h3 className="text-2xl font-bold">Мины</h3>
                <p className="text-sm text-muted-foreground">От 10₽</p>
              </div>
            </div>
            <p className="text-muted-foreground">Открывай клетки, избегая мин</p>
          </Card>

          <Card
            className={`p-6 cursor-pointer transition-all ${
              activeGame === 'coin' ? 'border-accent neon-glow-gold' : 'border-primary/30'
            }`}
            onClick={() => setActiveGame('coin')}
          >
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="Coins" size={32} className="text-accent" />
              <div>
                <h3 className="text-2xl font-bold">Монетка</h3>
                <p className="text-sm text-muted-foreground">От 15₽</p>
              </div>
            </div>
            <p className="text-muted-foreground">Орёл или решка</p>
          </Card>
        </div>

        {activeGame === 'crash' && (
          <Card className="p-8 border-primary/30 neon-glow-magenta">
            <h2 className="text-3xl font-bold neon-text-magenta mb-6">Crash Game 🚀</h2>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-muted-foreground">Ставка (мин. 30₽)</label>
                <Input
                  type="number"
                  value={crashBet}
                  onChange={(e) => setCrashBet(Number(e.target.value))}
                  disabled={crashActive}
                  className="max-w-xs"
                />
              </div>
              <div className="bg-card/50 rounded-lg p-8 text-center">
                <div className="text-6xl font-bold neon-text-cyan mb-4">{crashMultiplier.toFixed(2)}x</div>
                {crashActive && <Icon name="Rocket" size={64} className="mx-auto text-primary animate-float" />}
              </div>
              <div className="flex gap-4">
                {!crashActive ? (
                  <Button onClick={startCrash} className="bg-primary hover:bg-primary/90 neon-glow-magenta">
                    <Icon name="Play" size={20} className="mr-2" />
                    Начать
                  </Button>
                ) : (
                  <Button onClick={cashoutCrash} className="bg-accent hover:bg-accent/90 neon-glow-gold text-background">
                    <Icon name="TrendingUp" size={20} className="mr-2" />
                    Вывести {(crashBet * crashMultiplier).toFixed(2)}₽
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {activeGame === 'mines' && (
          <Card className="p-8 border-secondary/30 neon-glow-cyan">
            <h2 className="text-3xl font-bold neon-text-cyan mb-6">Мины 💣</h2>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-muted-foreground">Ставка (мин. 10₽)</label>
                <Input
                  type="number"
                  value={minesBet}
                  onChange={(e) => setMinesBet(Number(e.target.value))}
                  disabled={minesActive}
                  className="max-w-xs"
                />
              </div>
              {minesActive && (
                <div className="text-center mb-4">
                  <p className="text-2xl font-bold neon-text-gold">
                    Множитель: {minesMultiplier.toFixed(2)}x
                  </p>
                  <p className="text-muted-foreground">Потенциальный выигрыш: {(minesBet * minesMultiplier).toFixed(2)}₽</p>
                </div>
              )}
              <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
                {minesField.map((isMine, index) => (
                  <button
                    key={index}
                    onClick={() => revealCell(index)}
                    disabled={!minesActive || minesRevealed.includes(index)}
                    className={`aspect-square rounded-lg text-2xl font-bold transition-all ${
                      minesRevealed.includes(index)
                        ? isMine
                          ? 'bg-destructive neon-glow-magenta'
                          : 'bg-green-500/20 neon-glow-cyan'
                        : 'bg-card hover:bg-card/70 border border-primary/30'
                    }`}
                  >
                    {minesRevealed.includes(index) ? (isMine ? '💣' : '💎') : '?'}
                  </button>
                ))}
              </div>
              <div className="flex gap-4 justify-center">
                {!minesActive ? (
                  <Button onClick={startMines} className="bg-secondary hover:bg-secondary/90 neon-glow-cyan text-background">
                    <Icon name="Play" size={20} className="mr-2" />
                    Начать игру
                  </Button>
                ) : (
                  <Button
                    onClick={cashoutMines}
                    disabled={minesRevealed.length === 0}
                    className="bg-accent hover:bg-accent/90 neon-glow-gold text-background"
                  >
                    <Icon name="TrendingUp" size={20} className="mr-2" />
                    Забрать {(minesBet * minesMultiplier).toFixed(2)}₽
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {activeGame === 'coin' && (
          <Card className="p-8 border-accent/30 neon-glow-gold">
            <h2 className="text-3xl font-bold neon-text-gold mb-6">Монетка 🪙</h2>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 text-muted-foreground">Ставка (мин. 15₽)</label>
                <Input
                  type="number"
                  value={coinBet}
                  onChange={(e) => setCoinBet(Number(e.target.value))}
                  disabled={coinFlipping}
                  className="max-w-xs"
                />
              </div>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => playCoin('heads')}
                  disabled={coinFlipping}
                  className="bg-primary hover:bg-primary/90 neon-glow-magenta text-4xl px-12 py-8"
                >
                  🦅 Орёл
                </Button>
                <Button
                  onClick={() => playCoin('tails')}
                  disabled={coinFlipping}
                  className="bg-secondary hover:bg-secondary/90 neon-glow-cyan text-background text-4xl px-12 py-8"
                >
                  🌟 Решка
                </Button>
              </div>
              {coinFlipping && (
                <div className="text-center">
                  <Icon name="Loader2" size={64} className="mx-auto animate-spin text-accent" />
                  <p className="text-xl mt-4">Монетка в воздухе...</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Games;
