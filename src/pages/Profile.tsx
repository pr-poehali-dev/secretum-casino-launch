import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useGame } from '@/contexts/GameContext';

const Profile = () => {
  const { balance, tapPower } = useGame();

  const stats = [
    { label: 'Баланс', value: `${balance.toFixed(2)} ₽`, icon: 'Wallet', color: 'neon-text-gold' },
    { label: 'Сила тапа', value: `+${tapPower}`, icon: 'Zap', color: 'neon-text-cyan' },
    { label: 'Уровень', value: `${tapPower}`, icon: 'Trophy', color: 'neon-text-magenta' },
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold neon-text-magenta mb-8 text-center">Профиль</h1>

        <Card className="p-8 mb-8 border-primary/30 neon-glow-magenta text-center">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-neon flex items-center justify-center neon-glow-gold">
            <Icon name="User" size={64} className="text-background" />
          </div>
          <h2 className="text-3xl font-bold neon-text-cyan mb-2">Игрок #{Math.floor(Math.random() * 100000)}</h2>
          <p className="text-muted-foreground">Участник Secretum Casino</p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6 border-primary/30 neon-glow-cyan text-center">
              <Icon name={stat.icon as any} size={48} className={`mx-auto mb-3 ${stat.color}`} />
              <p className="text-muted-foreground mb-2">{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>

        <Card className="p-8 border-secondary/30 neon-glow-cyan mb-8">
          <h3 className="text-2xl font-bold neon-text-cyan mb-6">История операций</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-3">
                <Icon name="ArrowUpRight" size={24} className="text-accent" />
                <div>
                  <p className="font-semibold">Пополнение баланса</p>
                  <p className="text-sm text-muted-foreground">Сегодня, 14:23</p>
                </div>
              </div>
              <p className="text-xl font-bold text-accent">+100.00 ₽</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-3">
                <Icon name="Gamepad2" size={24} className="text-primary" />
                <div>
                  <p className="font-semibold">Игра Crash</p>
                  <p className="text-sm text-muted-foreground">Сегодня, 13:45</p>
                </div>
              </div>
              <p className="text-xl font-bold text-destructive">-30.00 ₽</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-primary/20">
              <div className="flex items-center space-x-3">
                <Icon name="Package" size={24} className="text-secondary" />
                <div>
                  <p className="font-semibold">Кейс "Новичок"</p>
                  <p className="text-sm text-muted-foreground">Сегодня, 12:30</p>
                </div>
              </div>
              <p className="text-xl font-bold text-accent">+65.00 ₽</p>
            </div>
          </div>
        </Card>

        <Card className="p-8 border-accent/30 neon-glow-gold">
          <h3 className="text-2xl font-bold neon-text-gold mb-6">Настройки аккаунта</h3>
          <div className="space-y-4">
            <Button className="w-full justify-start bg-card hover:bg-card/70 border border-primary/30">
              <Icon name="User" size={20} className="mr-3" />
              Изменить профиль
            </Button>
            <Button className="w-full justify-start bg-card hover:bg-card/70 border border-primary/30">
              <Icon name="Lock" size={20} className="mr-3" />
              Изменить пароль
            </Button>
            <Button className="w-full justify-start bg-card hover:bg-card/70 border border-primary/30">
              <Icon name="Bell" size={20} className="mr-3" />
              Уведомления
            </Button>
            <Button className="w-full justify-start bg-card hover:bg-card/70 border border-primary/30">
              <Icon name="CreditCard" size={20} className="mr-3" />
              Платёжные методы
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              <Icon name="LogOut" size={20} className="mr-3" />
              Выйти из аккаунта
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
