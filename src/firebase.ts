import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import FirebaseService from './services/FirebaseService';

class MessagingService {
  private static instance: MessagingService;
  private messaging;
  private token: string | null = null;

  private constructor() {
    this.messaging = getMessaging(FirebaseService.getInstance().getApp());
    this.setupForegroundListener();
  }

  public static getInstance(): MessagingService {
    if (!MessagingService.instance) {
      MessagingService.instance = new MessagingService();
    }
    return MessagingService.instance;
  }

  private setupForegroundListener() {
    onMessage(this.messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      if (payload.notification) {
        new Notification(payload.notification.title || 'Birthday Reminder', {
          body: payload.notification.body,
          icon: '/icons/icon-192x192.png',
        });
      }
    });
  }

  public async initMessaging(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        return false;
      }

      const registration = await navigator.serviceWorker.ready;
      const token = await getToken(this.messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (token) {
        this.token = token;
        console.log('✅ FCM Token:', token);
        return true;
      }

      console.log('⚠️ No registration token available');
      return false;
    } catch (error) {
      console.error('❌ Error getting messaging token:', error);
      return false;
    }
  }

  public getToken(): string | null {
    return this.token;
  }
}

// ✅ Just refresh / get token if already granted
export const requestForToken = async (): Promise<string | null> => {
  const messagingService = MessagingService.getInstance();
  const initialized = await messagingService.initMessaging();
  return initialized ? messagingService.getToken() : null;
};

// ✅ Ask permission, then get token
export const getOrRequestPermissionAndToken = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return await requestForToken();
    } else {
      console.log('Notification permission denied.');
      return null;
    }
  } catch (error) {
    console.error('Error requesting permission and token:', error);
    return null;
  }
};

export default MessagingService;
