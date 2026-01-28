'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

interface AuthContextType {
  user: any;
  loading: boolean;
  error: Error | undefined;
  isAdmin: boolean;
  isVendor: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, loading, error] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isVendor, setIsVendor] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      user.getIdTokenResult().then((idTokenResult) => {
        setIsAdmin(idTokenResult.claims.admin === true);
        setIsVendor(idTokenResult.claims.vendor === true);
      });
    } else {
      setIsAdmin(false);
      setIsVendor(false);
    }
  }, [user]);

  const value = {
    user,
    loading,
    error,
    isAdmin,
    isVendor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
