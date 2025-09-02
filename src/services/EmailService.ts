import emailjs from '@emailjs/browser';

export class EmailService {
  private static instance: EmailService;
  private readonly serviceId: string;
  private readonly templateId: string;
  private readonly publicKey: string;

  private constructor() {
    // These values should be set in your environment variables
    this.serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
    this.templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
    this.publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

    if (!this.serviceId || !this.templateId || !this.publicKey) {
      console.warn('EmailJS configuration is missing. Email sending will be disabled.');
    }
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  public async sendBirthdayWish(
    to: string,
    name: string,
    message: string
  ): Promise<boolean> {
    if (!this.serviceId || !this.templateId || !this.publicKey) {
      console.error('EmailJS configuration is missing');
      return false;
    }

    try {
      await emailjs.send(
        this.serviceId,
        this.templateId,
        {
          to_email: to,
          to_name: name,
          message: message,
        },
        this.publicKey
      );
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }
}
