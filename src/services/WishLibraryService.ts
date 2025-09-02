export interface WishTemplate {
  id: string;
  content: string;
  name: string;
  isDefault?: boolean;
}

const DEFAULT_WISHES: WishTemplate[] = [
  {
    id: 'default-1',
    content: 'Happy Birthday 🎉 Wishing you lots of happiness and success!',
    name: 'Default Wish',
    isDefault: true
  },
  {
    id: 'default-2',
    content: 'May your birthday be filled with joy and laughter! 🎈',
    name: 'Cheerful Wish'
  },
  {
    id: 'default-3',
    content: 'Warmest wishes on your special day! 🎂',
    name: 'Simple Wish'
  }
];

export class WishLibraryService {
  private static instance: WishLibraryService;
  private wishes: WishTemplate[] = [];

  private constructor() {
    this.loadWishes();
  }

  public static getInstance(): WishLibraryService {
    if (!WishLibraryService.instance) {
      WishLibraryService.instance = new WishLibraryService();
    }
    return WishLibraryService.instance;
  }

  private loadWishes(): void {
    const savedWishes = localStorage.getItem('birthdayWishes');
    if (savedWishes) {
      this.wishes = JSON.parse(savedWishes);
    } else {
      this.wishes = [...DEFAULT_WISHES];
      this.saveWishes();
    }
  }

  private saveWishes(): void {
    localStorage.setItem('birthdayWishes', JSON.stringify(this.wishes));
  }

  public getAllWishes(): WishTemplate[] {
    return [...this.wishes];
  }

  public getDefaultWish(): WishTemplate {
    return this.wishes.find(wish => wish.isDefault) || this.wishes[0];
  }

  public getWishById(id: string): WishTemplate | undefined {
    return this.wishes.find(wish => wish.id === id);
  }

  public addWish(wish: Omit<WishTemplate, 'id'>): WishTemplate {
    const newWish: WishTemplate = {
      ...wish,
      id: `wish-${Date.now()}`,
      isDefault: false
    };
    this.wishes.push(newWish);
    this.saveWishes();
    return newWish;
  }

  public updateWish(id: string, updates: Partial<Omit<WishTemplate, 'id'>>): WishTemplate {
    const index = this.wishes.findIndex(wish => wish.id === id);
    if (index === -1) throw new Error('Wish not found');

    this.wishes[index] = {
      ...this.wishes[index],
      ...updates
    };
    this.saveWishes();
    return this.wishes[index];
  }

  public deleteWish(id: string): void {
    const index = this.wishes.findIndex(wish => wish.id === id);
    if (index === -1) return;

    // Don't delete if it's the only wish or if it's the default wish
    if (this.wishes.length === 1 || this.wishes[index].isDefault) {
      throw new Error('Cannot delete the default wish');
    }

    this.wishes.splice(index, 1);
    this.saveWishes();
  }

  public setDefaultWish(id: string): void {
    const newDefault = this.wishes.find(wish => wish.id === id);
    if (!newDefault) throw new Error('Wish not found');

    this.wishes = this.wishes.map(wish => ({
      ...wish,
      isDefault: wish.id === id
    }));
    this.saveWishes();
  }
}
