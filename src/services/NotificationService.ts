import { WishingService } from './WishingService';
import type { NotificationSettings, NotificationSound } from '../types/notification';
import { DEFAULT_NOTIFICATION_SETTINGS } from '../types/notification';
import type { Birthday } from './BirthdayService';

export interface BirthdayPerson {
  id: string;
  name: string;
  birthDate: Date;
  age?: number;
  email?: string;
  phone?: string;
  customWish?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class NotificationService {
  private static instance: NotificationService;
  private sounds: Record<NotificationSound, HTMLAudioElement | null> = {
    'soft-chime': null,
    'birthday-tune': null,
    'loud-alert': null
  };
  private hasPermission: boolean = false;
  private settings: NotificationSettings;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.sounds = {
        'soft-chime': new Audio('/sounds/soft-chime.mp3'),
        'birthday-tune': new Audio('/sounds/birthday-notification.mp3'),
        'loud-alert': new Audio('/sounds/loud-alert.mp3')
      };
      this.checkPermission();
    }
    this.settings = this.loadSettings();
  }

  private loadSettings(): NotificationSettings {
    const savedSettings = localStorage.getItem('notificationSettings');
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_NOTIFICATION_SETTINGS;
  }

  private saveSettings(settings: NotificationSettings): void {
    localStorage.setItem('notificationSettings', JSON.stringify(settings));
    this.settings = settings;
  }

  public getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  public updateSettings(settings: NotificationSettings): void {
    this.saveSettings(settings);
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

  public async sendBirthdayNotification(person: BirthdayPerson, daysAway: number = 0): Promise<void> {
    if (!this.hasPermission) {
      await this.checkPermission();
    }

    if (!this.hasPermission) {
      console.warn('Notification permission not granted');
      return;
    }

    const age = person.age ? ` turns ${person.age}` : '';
    const timeMessage = daysAway === 0 ? 'today' : `in ${daysAway} day${daysAway > 1 ? 's' : ''}`;
    
    const notification = new Notification('🎂 Birthday Reminder!', {
      body: `${person.name}${age} ${timeMessage}! ${daysAway === 0 ? 'Time to celebrate! 🎉' : 'Get ready to celebrate! 🎈'}`,
      icon: '/cake-icon.png',
      badge: '/cake-icon.png',
      requireInteraction: true,
      tag: `birthday-${person.id}-${daysAway}` // Prevent duplicate notifications
    });

    // Play selected notification sound
    const selectedSound = this.sounds[this.settings.sound];
    if (selectedSound) {
      try {
        await selectedSound.play();
      } catch (error) {
        console.warn('Could not play notification sound:', error);
      }
    }

    notification.onclick = () => {
      if (daysAway === 0) {
        const wishingService = WishingService.getInstance();
        wishingService.openWishingInterface(person);
      }
      window.focus();
      notification.close();
    };
  }

  public async checkForBirthdays(birthdays: BirthdayPerson[]): Promise<void> {
    const today = new Date();
    const wishingService = WishingService.getInstance();
    
    for (const person of birthdays) {
      const birthday = new Date(person.birthDate);
      const thisYearBirthday = new Date(
        today.getFullYear(),
        birthday.getMonth(),
        birthday.getDate()
      );
      
      // Calculate days until birthday
      const timeDiff = thisYearBirthday.getTime() - today.getTime();
      const daysUntilBirthday = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      
      // Check if we should notify based on settings
      if (daysUntilBirthday === this.settings.advanceDays) {
        const personToNotify = { ...person };
        
        // Only calculate and set age on the actual birthday
        if (daysUntilBirthday === 0 && birthday.getFullYear() !== 1) {
          personToNotify.age = today.getFullYear() - birthday.getFullYear();
          
          // Send birthday wish on the actual day
          const birthdayData: Birthday = {
            ...personToNotify,
            birthDate: personToNotify.birthDate.toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await wishingService.sendBirthdayWish(birthdayData);
        }
        
        // Send notification
        await this.sendBirthdayNotification(personToNotify, daysUntilBirthday);
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
