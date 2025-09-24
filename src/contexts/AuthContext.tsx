// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import * as firebase from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  signIn: () => Promise<void>;
  signOutUser: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 Setting up auth state listener...');
    const unsubscribe = onAuthStateChanged(firebase.auth, (currentUser) => {
      console.log('👤 Auth state changed:', currentUser?.displayName || 'No user');
      setUser(currentUser);
      setLoading(false);
      setError(null);
    }, (authError) => {
      console.error('❌ Auth state error:', authError);
      setError(authError.message);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await firebase.signInWithGoogle();
    } catch (error: any) {
      console.error('❌ AuthContext sign-in error:', error);
      setError(error.message);
      throw error; // Re-throw so components can handle it
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      setLoading(true);
      setError(null);
      await firebase.auth.signOut();
    } catch (error: any) {
      console.error('❌ AuthContext sign-out error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = { user, signIn, signOutUser, loading, error };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
