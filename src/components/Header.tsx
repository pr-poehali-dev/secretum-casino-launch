import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { useGame } from '@/contexts/GameContext';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { balance } = useGame();
  const { user, isAuthenticated, logout } = useAuth();
  
  if (location.pathname === '/login') return null;

  const navItems = [
    { path: '/', label: 'Главная', icon: 'Home' },
    { path: '/games', label: 'Игры', icon: 'Gamepad2' },
    { path: '/cases', label: 'Кейсы', icon: 'Package' },
    { path: '/balance', label: 'Пополнение', icon: 'Wallet' },
    { path: '/profile', label: 'Профиль', icon: 'User' },
    { path: '/rules', label: 'Правила', icon: 'FileText' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-primary/30 neon-glow-magenta">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-gradient-neon flex items-center justify-center neon-glow-magenta">
              <Icon name="Sparkles" size={24} className="text-background" />
            </div>
            <h1 className="text-2xl font-bold neon-text-magenta">SECRETUM</h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? 'default' : 'ghost'}
                  className={`${
                    location.pathname === item.path
                      ? 'bg-primary/20 neon-glow-magenta'
                      : 'hover:bg-primary/10'
                  }`}
                >
                  <Icon name={item.icon as any} size={18} className="mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="bg-card border border-accent/50 rounded-lg px-4 py-2 neon-glow-gold flex items-center space-x-2">
                  <Icon name="Coins" size={20} className="text-accent" />
                  <span className="font-bold text-accent">{balance.toFixed(2)} ₽</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar className="w-10 h-10 border-2 border-primary neon-glow-magenta">
                    <AvatarImage src={user?.avatar_url} alt={user?.name} />
                    <AvatarFallback className="bg-gradient-neon text-background">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="hover:bg-destructive/20"
                  >
                    <Icon name="LogOut" size={20} className="text-destructive" />
                  </Button>
                </div>
              </>
            ) : (
              <Button
                onClick={() => navigate('/login')}
                className="bg-primary hover:bg-primary/90 neon-glow-magenta"
              >
                <Icon name="LogIn" size={18} className="mr-2" />
                Войти
              </Button>
            )}
          </div>
        </div>

        <nav className="md:hidden mt-4 flex overflow-x-auto space-x-2 pb-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                size="sm"
                variant={location.pathname === item.path ? 'default' : 'ghost'}
                className={`${
                  location.pathname === item.path
                    ? 'bg-primary/20 neon-glow-magenta'
                    : 'hover:bg-primary/10'
                } whitespace-nowrap`}
              >
                <Icon name={item.icon as any} size={16} className="mr-1" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;