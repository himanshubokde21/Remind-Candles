import { getToken, onMessage, isSupported } from "firebase/messaging";
import { getFunctions, httpsCallable } from "firebase/functions";
import FirebaseService from "./FirebaseService";
import TokenService from "./TokenService";
import AuthService from "./AuthService";

class MessagingService {
  private static instance: MessagingService;
  private messaging;
  private currentToken: string | null = null;

  private constructor() {
    this.messaging = FirebaseService.getInstance().getMessaging();
    this.setupForegroundListener();
  }

  private setupForegroundListener(): void {
    onMessage(this.messaging, (payload) => {
      console.log("Message received in foreground:", payload);
      // Add custom logic here to handle foreground messages
    });
  }

  public static getInstance(): MessagingService {
    if (!MessagingService.instance) {
      MessagingService.instance = new MessagingService();
    }
    return MessagingService.instance;
  }

  private async handleTokenError(error: Error, token: string): Promise<void> {
    const currentUser = AuthService.getInstance().getCurrentUser();
    if (!currentUser) return;

    if (
      error.message.includes("messaging/registration-token-not-registered") ||
      error.message.includes("messaging/invalid-registration-token")
    ) {
      try {
        const functions = getFunctions(FirebaseService.getInstance().getApp());
        const cleanupTokens = httpsCallable(functions, "cleanupInvalidTokens");

        await cleanupTokens({
          token,
          userId: currentUser.uid,
          error: error.message,
        });

        this.currentToken = null; 
      } catch (cleanupError) {
        console.error("Error cleaning up invalid token:", cleanupError);
      }
    }
  }

  public async sendNotification(userId: string, notification: any): Promise<void> {
    try {
      const functions = getFunctions(FirebaseService.getInstance().getApp());
      const sendNotification = httpsCallable(functions, "sendNotification");
      await sendNotification({ userId, notification });
    } catch (error) {
      if (error instanceof Error && this.currentToken) {
        await this.handleTokenError(error, this.currentToken);
      }
      throw error;
    }
  }

  public async initMessaging(): Promise<boolean> {
    const currentUser = AuthService.getInstance().getCurrentUser();
    if (!currentUser) {
      console.error("User must be authenticated to initialize messaging");
      return false;
    }

    try {
      const isMessagingSupported = await isSupported();
      if (!isMessagingSupported) {
        console.log("Firebase messaging is not supported in this browser");
        return false;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.log("Notification permission denied");
        return false;
      }

      const registration = await navigator.serviceWorker.ready;
      const token = await getToken(this.messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        this.currentToken = token;
        await TokenService.getInstance().saveToken(currentUser.uid, token);
        return true;
      }

      console.log("No registration token available");
      return false;
    } catch (error) {
      console.error("Error getting messaging token:", error);
      if (error instanceof Error && this.currentToken) {
        await this.handleTokenError(error, this.currentToken);
      }
      return false;
    }
  }

  public getCurrentToken(): string | null {
    return this.currentToken;
  }
}

export default MessagingService;
