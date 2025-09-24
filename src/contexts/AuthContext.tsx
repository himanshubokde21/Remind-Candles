// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type User = { uid: string; displayName?: string } | null;

type AuthContextType = {
  user: User;
  signIn: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If you integrate Firebase later, replace this with onAuthStateChanged subscription.
    // Quickly finish initialization so provider exists immediately.
    const t = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(t);
  }, []);

  const signIn = async () => {
    // replace with real Firebase Google sign-in when ready
    setUser({ uid: 'demo-uid', displayName: 'Demo User' });
  };

  const signOutUser = async () => {
    setUser(null);
  };

  const value: AuthContextType = { user, signIn, signOutUser };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading authentication...</div> : children}
    </AuthContext.Provider>
  );
};
