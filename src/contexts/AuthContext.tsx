// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";   // ✅ type-only import
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import * as firebase from "../firebase"; // ensure this exports { auth, signInWithGoogle }

interface AuthContextType {
  user: FirebaseUser | null;
  signIn: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase.auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      try {
        unsubscribe && unsubscribe();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const signIn = async () => {
    await firebase.signInWithGoogle();
  };

  const signOutUser = async () => {
    await firebase.auth.signOut();
    setUser(null);
  };

  const value: AuthContextType = { user, signIn, signOutUser };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading authentication...</div> : children}
    </AuthContext.Provider>
  );
};
