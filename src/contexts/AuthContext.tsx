import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "firebase/auth";
import AuthService from "../services/AuthService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AuthService.getInstance().onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    await AuthService.getInstance().signInWithGoogle();
  };

  const signInWithEmail = async (email: string, password: string) => {
    await AuthService.getInstance().signInWithEmail(email, password);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    await AuthService.getInstance().signUpWithEmail(email, password);
  };

  const signOut = async () => {
    await AuthService.getInstance().signOut();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
