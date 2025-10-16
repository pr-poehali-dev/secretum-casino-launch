import React, { createContext, useContext, useState, useEffect } from 'react';

interface GameContextType {
  balance: number;
  setBalance: (balance: number) => void;
  addToBalance: (amount: number) => void;
  subtractFromBalance: (amount: number) => boolean;
  tapPower: number;
  tapCost: number;
  upgradeTap: () => boolean;
  handleTap: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('casino_balance');
    return saved ? parseFloat(saved) : 100;
  });

  const [tapPower, setTapPower] = useState(() => {
    const saved = localStorage.getItem('tap_power');
    return saved ? parseInt(saved) : 1;
  });

  const tapCost = 50;

  useEffect(() => {
    localStorage.setItem('casino_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('tap_power', tapPower.toString());
  }, [tapPower]);

  const addToBalance = (amount: number) => {
    setBalance(prev => prev + amount);
  };

  const subtractFromBalance = (amount: number): boolean => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  const upgradeTap = (): boolean => {
    if (balance >= tapCost) {
      setBalance(prev => prev - tapCost);
      setTapPower(prev => prev + 1);
      return true;
    }
    return false;
  };

  const handleTap = () => {
    setBalance(prev => prev + tapPower);
  };

  return (
    <GameContext.Provider
      value={{
        balance,
        setBalance,
        addToBalance,
        subtractFromBalance,
        tapPower,
        tapCost,
        upgradeTap,
        handleTap,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
