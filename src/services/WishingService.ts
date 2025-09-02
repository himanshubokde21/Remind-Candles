import type { Birthday } from './BirthdayService';
import type { BirthdayPerson } from './NotificationService';
import { EmailService } from './EmailService';
import { WhatsAppService } from './WhatsAppService';

const DEFAULT_WISH = "Happy Birthday 🎉 Wishing you lots of happiness and success!";

export class WishingService {
  private static instance: WishingService;
  private emailService: EmailService;
  private whatsAppService: WhatsAppService;
  private wishingSessions: Set<string> = new Set(); // Track wishes to prevent duplicates

  private constructor() {
    this.emailService = EmailService.getInstance();
    this.whatsAppService = WhatsAppService.getInstance();
  }

  public static getInstance(): WishingService {
    if (!WishingService.instance) {
      WishingService.instance = new WishingService();
    }
    return WishingService.instance;
  }

  public async sendBirthdayWish(birthday: Birthday): Promise<boolean> {
    // Check if we've already sent a wish today for this person
    const sessionKey = `${birthday.id}-${new Date().toDateString()}`;
    if (this.wishingSessions.has(sessionKey)) {
      console.log('Already sent birthday wish today for:', birthday.name);
      return false;
    }

    const message = birthday.customWish || DEFAULT_WISH;
    let success = false;

    try {
      // Try WhatsApp first if phone number is available
      if (birthday.phone) {
        success = await this.whatsAppService.sendBirthdayWish(
          birthday.phone,
          birthday.name,
          message
        );
      }
      
      // If WhatsApp failed or wasn't available, try email
      if (!success && birthday.email) {
        success = await this.emailService.sendBirthdayWish(
          birthday.email,
          birthday.name,
          message
        );
      }

      if (success) {
        // Record that we've sent a wish today
        this.wishingSessions.add(sessionKey);
        
        // Clean up old session keys (older than 2 days)
        this.cleanupWishingSessions();
      }

      return success;
    } catch (error) {
      console.error('Failed to send birthday wish:', error);
      return false;
    }
  }

  public async checkAndSendWishes(birthdays: Birthday[]): Promise<void> {
    const today = new Date();
    
    for (const birthday of birthdays) {
      const birthDate = new Date(birthday.birthDate);
      
      // Check if it's the person's birthday (comparing month and day)
      if (birthDate.getMonth() === today.getMonth() && 
          birthDate.getDate() === today.getDate()) {
        await this.sendBirthdayWish(birthday);
      }
    }
  }




  private cleanupWishingSessions(): void {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    for (const sessionKey of this.wishingSessions) {
      const [, dateString] = sessionKey.split('-');
      const sessionDate = new Date(dateString);
      
      if (sessionDate < twoDaysAgo) {
        this.wishingSessions.delete(sessionKey);
      }
    }
  }

  public openWishingInterface(person: Birthday | BirthdayPerson): void {
    // Convert BirthdayPerson to Birthday if needed
    const birthday: Birthday = 'birthDate' in person && person.birthDate instanceof Date ? {
      ...person,
      birthDate: person.birthDate.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as Birthday : person as Birthday;

    // Open appropriate interface based on available contact methods
    if (birthday.phone) {
      // Open WhatsApp with pre-filled message
      const message = encodeURIComponent(birthday.customWish || DEFAULT_WISH);
      const whatsappUrl = `https://wa.me/${birthday.phone}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    } else if (birthday.email) {
      // Open default email client
      const subject = encodeURIComponent('Happy Birthday! 🎉');
      const body = encodeURIComponent(birthday.customWish || DEFAULT_WISH);
      window.open(`mailto:${birthday.email}?subject=${subject}&body=${body}`, '_blank');
    }
  }
}
