import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

const Rules = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl font-bold neon-text-magenta mb-4 text-center">Правила</h1>
        <p className="text-center text-muted-foreground mb-8">
          Ознакомьтесь с правилами казино и условиями игр
        </p>

        <Card className="p-8 mb-8 border-primary/30 neon-glow-magenta bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-start space-x-4">
            <Icon name="AlertCircle" size={32} className="text-accent flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold neon-text-cyan mb-2">Важная информация</h2>
              <p className="text-muted-foreground">
                Это демонстрационная версия казино. Все операции происходят в виртуальной среде.
                Реальные деньги не используются. Соблюдайте правила честной игры.
              </p>
            </div>
          </div>
        </Card>

        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="general" className="border border-primary/30 rounded-lg px-6 neon-glow-cyan">
            <AccordionTrigger className="text-xl font-bold hover:text-primary">
              <div className="flex items-center">
                <Icon name="FileText" size={24} className="mr-3 text-primary" />
                Общие правила
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2 pt-4">
              <p>• Минимальный возраст для игры: 18 лет</p>
              <p>• Запрещено создавать несколько аккаунтов</p>
              <p>• Администрация оставляет за собой право заблокировать аккаунт при нарушении правил</p>
              <p>• Использование ботов и программ для автоматизации запрещено</p>
              <p>• Все выигрыши и проигрыши определяются честным алгоритмом</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="crash" className="border border-secondary/30 rounded-lg px-6 neon-glow-cyan">
            <AccordionTrigger className="text-xl font-bold hover:text-secondary">
              <div className="flex items-center">
                <Icon name="Rocket" size={24} className="mr-3 text-secondary" />
                Игра Crash
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2 pt-4">
              <p>• Минимальная ставка: 30 ₽</p>
              <p>• Множитель начинается с 1.00x и растёт до момента краша</p>
              <p>• Выведите ставку до взрыва ракеты, чтобы получить выигрыш</p>
              <p>• Если ракета взорвалась до вывода - ставка проиграна</p>
              <p>• Шанс выиграть: 24-34%</p>
              <p>• Максимальный множитель ограничен алгоритмом</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="mines" className="border border-accent/30 rounded-lg px-6 neon-glow-gold">
            <AccordionTrigger className="text-xl font-bold hover:text-accent">
              <div className="flex items-center">
                <Icon name="Bomb" size={24} className="mr-3 text-accent" />
                Игра Мины
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2 pt-4">
              <p>• Минимальная ставка: 10 ₽</p>
              <p>• Поле 5x5 содержит 5 мин и 20 безопасных клеток</p>
              <p>• Открывайте клетки, избегая мин</p>
              <p>• Каждая открытая безопасная клетка увеличивает множитель на 0.3x</p>
              <p>• Выведите выигрыш в любой момент или продолжайте открывать клетки</p>
              <p>• При попадании на мину - ставка проиграна</p>
              <p>• Шанс выиграть: 24-34%</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="coin" className="border border-primary/30 rounded-lg px-6 neon-glow-magenta">
            <AccordionTrigger className="text-xl font-bold hover:text-primary">
              <div className="flex items-center">
                <Icon name="Coins" size={24} className="mr-3 text-primary" />
                Игра Монетка
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2 pt-4">
              <p>• Минимальная ставка: 15 ₽</p>
              <p>• Выберите орёл или решка</p>
              <p>• При угадывании выигрыш умножается на 2x</p>
              <p>• Результат определяется случайным образом</p>
              <p>• Шанс выиграть: 24-34%</p>
              <p>• Самая простая игра казино</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="cases" className="border border-secondary/30 rounded-lg px-6 neon-glow-cyan">
            <AccordionTrigger className="text-xl font-bold hover:text-secondary">
              <div className="flex items-center">
                <Icon name="Package" size={24} className="mr-3 text-secondary" />
                Кейсы
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-4 pt-4">
              <div>
                <p className="font-bold text-foreground mb-2">Кейс "Бомж" (20₽):</p>
                <p>• 1₽ - 30% шанс</p>
                <p>• 3₽ - 30% шанс</p>
                <p>• 4₽ - 30% шанс</p>
                <p>• 10₽ - 22% шанс</p>
                <p>• 100₽ - 2% шанс</p>
              </div>
              <div>
                <p className="font-bold text-foreground mb-2">Кейс "Новичок" (25₽):</p>
                <p>• 15₽ - 50% шанс</p>
                <p>• 40₽ - 20% шанс</p>
                <p>• 65₽ - 19% шанс</p>
                <p>• 70₽ - 18% шанс</p>
                <p>• 250₽ - 15% шанс</p>
              </div>
              <div>
                <p className="font-bold text-foreground mb-2">Кейс "Богатый" (300₽):</p>
                <p>• 200₽ - 30% шанс</p>
                <p>• 250₽ - 27% шанс</p>
                <p>• 450₽ - 20% шанс</p>
                <p>• 600₽ - 13% шанс</p>
                <p>• 1500₽ - 1% шанс</p>
                <p>• 2550₽ - 0.1% шанс</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="balance" className="border border-accent/30 rounded-lg px-6 neon-glow-gold">
            <AccordionTrigger className="text-xl font-bold hover:text-accent">
              <div className="flex items-center">
                <Icon name="Wallet" size={24} className="mr-3 text-accent" />
                Пополнение и вывод
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2 pt-4">
              <p>• Минимальная сумма пополнения: 1 ₽</p>
              <p>• Пополнение происходит мгновенно</p>
              <p>• Минимальная сумма вывода: 3500 ₽</p>
              <p>• Обработка вывода: 1-3 рабочих дня</p>
              <p>• Вывод доступен только на верифицированные аккаунты</p>
              <p>• Комиссия за операции отсутствует</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tap" className="border border-primary/30 rounded-lg px-6 neon-glow-magenta">
            <AccordionTrigger className="text-xl font-bold hover:text-primary">
              <div className="flex items-center">
                <Icon name="Hand" size={24} className="mr-3 text-primary" />
                Тапалка
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground space-y-2 pt-4">
              <p>• Тапайте по монете и получайте коины</p>
              <p>• Начальная сила тапа: +1 коин за клик</p>
              <p>• Улучшение стоит 50₽ и увеличивает силу на +1 коин</p>
              <p>• Неограниченное количество тапов</p>
              <p>• Прогресс сохраняется автоматически</p>
              <p>• Используйте тапалку для бесплатного заработка</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Card className="p-8 mt-8 border-primary/30 neon-glow-cyan bg-gradient-to-r from-secondary/10 to-primary/10">
          <h3 className="text-2xl font-bold neon-text-gold mb-4">Ответственная игра</h3>
          <div className="space-y-3 text-muted-foreground">
            <p className="flex items-start">
              <Icon name="Check" size={20} className="mr-2 mt-1 text-accent" />
              Играйте только на те средства, которые можете позволить себе потерять
            </p>
            <p className="flex items-start">
              <Icon name="Check" size={20} className="mr-2 mt-1 text-accent" />
              Устанавливайте лимиты на депозиты и время игры
            </p>
            <p className="flex items-start">
              <Icon name="Check" size={20} className="mr-2 mt-1 text-accent" />
              Не пытайтесь отыграть проигрыши
            </p>
            <p className="flex items-start">
              <Icon name="Check" size={20} className="mr-2 mt-1 text-accent" />
              Обращайтесь за помощью при признаках игровой зависимости
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Rules;
