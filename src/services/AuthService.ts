// src/services/AuthService.ts
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import app from "../firebase"; // ✅ import your initialized firebase app

class AuthService {
  private static instance: AuthService;
  private auth = getAuth(app);

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }

  // 🔹 Google Login
  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
  }

  // 🔹 Email/Password Login
  async signInWithEmail(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  // 🔹 Email/Password Signup
  async signUpWithEmail(email: string, password: string) {
    await createUserWithEmailAndPassword(this.auth, email, password);
  }

  // 🔹 Logout
  async signOut() {
    await signOut(this.auth);
  }
}

export default AuthService;
