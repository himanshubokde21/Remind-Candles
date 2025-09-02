export interface Birthday {
  id: string;
  name: string;
  birthDate: string;
  email?: string;
  phone?: string;
  customWish?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'remind-candles-birthdays';

export class BirthdayService {
  private static instance: BirthdayService;

  private constructor() {}

  public static getInstance(): BirthdayService {
    if (!BirthdayService.instance) {
      BirthdayService.instance = new BirthdayService();
    }
    return BirthdayService.instance;
  }

  private getStoredBirthdays(): Birthday[] {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  }

  private saveBirthdays(birthdays: Birthday[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(birthdays));
  }

  public getAllBirthdays(): Birthday[] {
    return this.getStoredBirthdays();
  }

  public getBirthdayById(id: string): Birthday | undefined {
    return this.getStoredBirthdays().find(birthday => birthday.id === id);
  }

  public addBirthday(birthday: Omit<Birthday, 'id' | 'createdAt' | 'updatedAt'>): Birthday {
    const birthdays = this.getStoredBirthdays();
    const newBirthday: Birthday = {
      ...birthday,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    birthdays.push(newBirthday);
    this.saveBirthdays(birthdays);
    return newBirthday;
  }

  public updateBirthday(id: string, updates: Partial<Omit<Birthday, 'id' | 'createdAt'>>): Birthday {
    const birthdays = this.getStoredBirthdays();
    const index = birthdays.findIndex(b => b.id === id);
    
    if (index === -1) {
      throw new Error('Birthday not found');
    }

    const updatedBirthday = {
      ...birthdays[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    birthdays[index] = updatedBirthday;
    this.saveBirthdays(birthdays);
    return updatedBirthday;
  }

  public deleteBirthday(id: string): void {
    const birthdays = this.getStoredBirthdays();
    const filteredBirthdays = birthdays.filter(birthday => birthday.id !== id);
    this.saveBirthdays(filteredBirthdays);
  }
}
