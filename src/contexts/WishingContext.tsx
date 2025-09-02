import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WishingService } from '../services/WishingService';
import { WishLibraryService, type WishTemplate } from '../services/WishLibraryService';
import type { Birthday } from '../services/BirthdayService';

interface WishingContextType {
  sendWish: (birthday: Birthday) => Promise<boolean>;
  wishes: WishTemplate[];
  defaultWish: WishTemplate;
  addWish: (wish: Pick<WishTemplate, 'content' | 'name'>) => void;
  updateWish: (id: string, updates: Partial<Omit<WishTemplate, 'id'>>) => void;
  deleteWish: (id: string) => void;
  setDefaultWish: (id: string) => void;
}

const WishingContext = createContext<WishingContextType | undefined>(undefined);

export const WishingProvider = ({ children }: { children: React.ReactNode }) => {
  const wishingService = WishingService.getInstance();
  const wishLibrary = WishLibraryService.getInstance();
  const [wishes, setWishes] = useState<WishTemplate[]>([]);
  const [defaultWish, setDefaultWish] = useState<WishTemplate>({
    id: 'default',
    content: 'Happy Birthday!',
    name: 'Default',
    isDefault: true
  });

  // Load wishes on mount
  useEffect(() => {
    const loadedWishes = wishLibrary.getAllWishes();
    setWishes(loadedWishes);
    setDefaultWish(wishLibrary.getDefaultWish());
  }, []);

  const addWish = useCallback((wish: Pick<WishTemplate, 'content' | 'name'>) => {
    const newWish = wishLibrary.addWish(wish);
    setWishes(prev => [...prev, newWish]);
  }, []);

  const updateWish = useCallback((id: string, updates: Partial<Omit<WishTemplate, 'id'>>) => {
    const updatedWish = wishLibrary.updateWish(id, updates);
    setWishes(prev => prev.map(wish => wish.id === id ? updatedWish : wish));
    if (updatedWish.isDefault) {
      setDefaultWish(updatedWish);
    }
  }, []);

  const deleteWish = useCallback((id: string) => {
    try {
      wishLibrary.deleteWish(id);
      setWishes(prev => prev.filter(wish => wish.id !== id));
    } catch (error) {
      console.error('Failed to delete wish:', error);
    }
  }, []);

  const setNewDefaultWish = useCallback((id: string) => {
    try {
      wishLibrary.setDefaultWish(id);
      const newDefault = wishLibrary.getWishById(id);
      if (newDefault) {
        setDefaultWish(newDefault);
        setWishes(wishLibrary.getAllWishes());
      }
    } catch (error) {
      console.error('Failed to set default wish:', error);
    }
  }, []);

  const value = {
    sendWish: (birthday: Birthday) => wishingService.sendBirthdayWish(birthday),
    wishes,
    defaultWish,
    addWish,
    updateWish,
    deleteWish,
    setDefaultWish: setNewDefaultWish,
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
