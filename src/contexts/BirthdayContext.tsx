import { createContext, useContext, useState, useEffect } from 'react';
import type { Birthday } from '../services/BirthdayService';
import { BirthdayService } from '../services/BirthdayService';

interface BirthdayContextType {
  birthdays: Birthday[];
  addBirthday: (birthday: Omit<Birthday, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBirthday: (id: string, updates: Partial<Omit<Birthday, 'id' | 'createdAt'>>) => void;
  deleteBirthday: (id: string) => void;
  getBirthdayById: (id: string) => Birthday | undefined;
}

const BirthdayContext = createContext<BirthdayContextType | undefined>(undefined);

export const BirthdayProvider = ({ children }: { children: React.ReactNode }) => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [birthdayService] = useState(() => BirthdayService.getInstance());

  useEffect(() => {
    // Load birthdays from storage when component mounts
    setBirthdays(birthdayService.getAllBirthdays());
  }, [birthdayService]);

  const value = {
    birthdays,
    addBirthday: (birthday: Omit<Birthday, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newBirthday = birthdayService.addBirthday(birthday);
      setBirthdays(birthdayService.getAllBirthdays());
      return newBirthday;
    },
    updateBirthday: (id: string, updates: Partial<Omit<Birthday, 'id' | 'createdAt'>>) => {
      birthdayService.updateBirthday(id, updates);
      setBirthdays(birthdayService.getAllBirthdays());
    },
    deleteBirthday: (id: string) => {
      birthdayService.deleteBirthday(id);
      setBirthdays(birthdayService.getAllBirthdays());
    },
    getBirthdayById: (id: string) => birthdayService.getBirthdayById(id),
  };

  return (
    <BirthdayContext.Provider value={value}>
      {children}
    </BirthdayContext.Provider>
  );
};

export const useBirthdays = () => {
  const context = useContext(BirthdayContext);
  if (context === undefined) {
    throw new Error('useBirthdays must be used within a BirthdayProvider');
  }
  return context;
};
