// contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useRouter } from 'next/router';

export interface AuthContextType {
  user: {
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, role?: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isAdmin: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultContext);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me', {
          cache: 'no-store',
          credentials: 'include',
        });
        console.log('ME endpoint status:', res.status);
        if (!res.ok) {
          setUser(null);
        } else {
          const data = await res.json();
          console.log('ME endpoint JSON:', data);
          const u = data.user ?? data;
          setUser({
            email: u.email,
            role: u.role,
            firstName: u.firstName,
            lastName: u.lastName,
          });
        }
      } catch (err) {
        console.error('ME error:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string, role?: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    if (!res.ok) throw new Error('Login fallito');
    const data = await res.json();
    setUser({
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    if (data.role.toUpperCase() === 'ARTISAN') {
      router.replace('/dashboard');
    } else {
      router.replace('/');
    }
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    role?: string
  ) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName, role }),
    });
    if (!res.ok) throw new Error('Registrazione fallita');
    const data = await res.json();
    setUser({
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    router.replace('/');
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    router.replace('/login');
  };

  const isAuthenticated = Boolean(user) && !isLoading;
  const isAdmin = user?.role.toUpperCase() === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, isLoading, isAdmin, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
