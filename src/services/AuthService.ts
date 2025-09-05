import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged
} from "firebase/auth";
import type { User } from "firebase/auth";
import FirebaseService from "./FirebaseService";

class AuthService {
  private static instance: AuthService;
  private auth;

  private constructor() {
    this.auth = getAuth(FirebaseService.getInstance().getApp());
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    return result.user;
  }

  public async signOut(): Promise<void> {
    await signOut(this.auth);
  }

  public getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  public onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, callback);
  }
}

export default AuthService;