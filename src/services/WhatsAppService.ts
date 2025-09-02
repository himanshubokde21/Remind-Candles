export class WhatsAppService {
  private static instance: WhatsAppService;

  private constructor() {}

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  public async sendBirthdayWish(
    phone: string,
    name: string,
    message: string
  ): Promise<boolean> {
    try {
      // Format the phone number and message
      const formattedPhone = this.formatPhoneNumber(phone);
      const encodedMessage = encodeURIComponent(message);
      
      // Create WhatsApp URL
      const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

      // For web, we'll open WhatsApp in a new window
      // In a real app, you might want to use the WhatsApp Business API
      window.open(whatsappUrl, '_blank');
      
      return true;
    } catch (error) {
      console.error('Failed to send WhatsApp message:', error);
      return false;
    }
  }

  private formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    return phone.replace(/\D/g, '');
  }
}
