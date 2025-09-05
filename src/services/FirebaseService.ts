import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

class FirebaseService {
  private static instance: FirebaseService;
  private app;
  private analytics;
  private db;
  private messaging;

  private constructor() {
    this.app = initializeApp({
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    });
    this.analytics = getAnalytics(this.app);
    this.db = getFirestore(this.app);
    this.messaging = getMessaging(this.app);
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  public getApp() { return this.app; }
  public getAnalytics() { return this.analytics; }
  public getDb() { return this.db; }
  public getMessaging() { return this.messaging; }

  public async getToken(vapidKey: string): Promise<string | null> {
    try {
      const token = await getToken(this.messaging, { vapidKey });
      return token;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }
}

export default FirebaseService;