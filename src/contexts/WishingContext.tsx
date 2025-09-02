import { createContext, useContext } from 'react';
import { WishingService } from '../services/WishingService';
import type { Birthday } from '../services/BirthdayService';

interface WishingContextType {
  sendWish: (birthday: Birthday) => Promise<boolean>;
}

const WishingContext = createContext<WishingContextType | undefined>(undefined);

export const WishingProvider = ({ children }: { children: React.ReactNode }) => {
  const wishingService = WishingService.getInstance();

  const value = {
    sendWish: (birthday: Birthday) => wishingService.sendBirthdayWish(birthday),
  };

  return (
    <WishingContext.Provider value={value}>
      {children}
    </WishingContext.Provider>
  );
};

export const useWishing = () => {
  const context = useContext(WishingContext);
  if (context === undefined) {
    throw new Error('useWishing must be used within a WishingProvider');
  }
  return context;
};
