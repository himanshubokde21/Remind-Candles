import { 
  doc, 
  setDoc, 
  deleteDoc, 
  Timestamp
} from "firebase/firestore";
import FirebaseService from "./FirebaseService";

interface TokenDocument {
  token: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deviceInfo: {
    platform: string;
    userAgent: string;
    language: string;
  };
  isActive: boolean;
}

class TokenService {
  private static instance: TokenService;
  private db;

  private constructor() {
    this.db = FirebaseService.getInstance().getDb();
  }

  public static getInstance(): TokenService {
    if (!TokenService.instance) {
      TokenService.instance = new TokenService();
    }
    return TokenService.instance;
  }

  public async saveToken(userId: string, fcmToken: string): Promise<void> {
    if (!userId || !fcmToken) {
      throw new Error('userId and fcmToken are required');
    }

    const tokenDoc: TokenDocument = {
      token: fcmToken,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      deviceInfo: {
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        language: navigator.language
      },
      isActive: true
    };

    const tokenRef = doc(this.db, 'users', userId, 'tokens', fcmToken);
    await setDoc(tokenRef, tokenDoc);
  }

  public async deactivateToken(userId: string, fcmToken: string): Promise<void> {
    const tokenRef = doc(this.db, 'users', userId, 'tokens', fcmToken);
    await setDoc(tokenRef, {
      isActive: false,
      updatedAt: Timestamp.now()
    }, { merge: true });
  }

  public async deleteToken(userId: string, fcmToken: string): Promise<void> {
    const tokenRef = doc(this.db, 'users', userId, 'tokens', fcmToken);
    await deleteDoc(tokenRef);
  }
}

export default TokenService;