import { WishingService } from './WishingService';

export interface BirthdayPerson {
  id: string;
  name: string;
  birthDate: Date;
  age?: number;
}

export class NotificationService {
  private static instance: NotificationService;
  private notificationSound: HTMLAudioElement | null = null;
  private hasPermission: boolean = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.notificationSound = new Audio('/sounds/birthday-notification.mp3');
      this.checkPermission();
    }
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async checkPermission(): Promise<void> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      this.hasPermission = true;
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
    }
  }

  public async requestPermission(): Promise<boolean> {
    await this.checkPermission();
    return this.hasPermission;
  }

  public async sendBirthdayNotification(person: BirthdayPerson): Promise<void> {
    if (!this.hasPermission) {
      await this.checkPermission();
    }

    if (!this.hasPermission) {
      console.warn('Notification permission not granted');
      return;
    }

    const age = person.age ? ` turns ${person.age}` : '';
    const notification = new Notification('🎂 Birthday Reminder!', {
      body: `${person.name}${age} today! Time to celebrate! 🎉`,
      icon: '/cake-icon.png',
      badge: '/cake-icon.png',
      requireInteraction: true,
    });

    // Play notification sound
    if (this.notificationSound) {
      try {
        await this.notificationSound.play();
      } catch (error) {
        console.warn('Could not play notification sound:', error);
      }
    }

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  public async checkForBirthdays(birthdays: BirthdayPerson[]): Promise<void> {
    const today = new Date();
    const wishingService = WishingService.getInstance();
    
    for (const person of birthdays) {
      const birthday = new Date(person.birthDate);
      
      // Check if it's the person's birthday (comparing month and day)
      if (birthday.getMonth() === today.getMonth() && 
          birthday.getDate() === today.getDate()) {
        
        // Calculate age if birthYear is available
        if (birthday.getFullYear() !== 1) { // Check if year was provided
          person.age = today.getFullYear() - birthday.getFullYear();
        }
        
        // Send notification
        await this.sendBirthdayNotification(person);

        // Send birthday wish
        await wishingService.sendBirthdayWish(person as any); // Type cast as the interfaces slightly differ
      }
    }
  }

  // Method to schedule daily birthday checks
  public scheduleDailyCheck(birthdays: BirthdayPerson[]): void {
    // Check immediately when the page loads
    this.checkForBirthdays(birthdays);

    // Then check every day at 9:00 AM
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0, 0);
    const timeUntilFirstCheck = tomorrow.getTime() - now.getTime();

    // First check at 9:00 AM tomorrow
    setTimeout(() => {
      this.checkForBirthdays(birthdays);
      // Then check every 24 hours
      setInterval(() => this.checkForBirthdays(birthdays), 24 * 60 * 60 * 1000);
    }, timeUntilFirstCheck);
  }
}
