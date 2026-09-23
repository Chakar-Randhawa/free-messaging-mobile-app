import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { loginUser, logoutUser, registerUser, resetPassword, watchAuthState } from '@/services/auth';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string, displayName: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  reset: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => watchAuthState((nextUser) => {
    setUser(nextUser);
    setLoading(false);
  }), []);

  const value = useMemo(() => ({
    user,
    loading,
    register: registerUser,
    login: loginUser,
    logout: logoutUser,
    reset: resetPassword,
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
