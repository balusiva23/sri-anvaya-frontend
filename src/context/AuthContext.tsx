'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/api';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  roles: string[];
  customerProfile?: any;
  providerProfile?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { email: string; password: string; fullName: string; phone?: string; role?: string }) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem('sri_anvaya_token');
    const savedUser = localStorage.getItem('sri_anvaya_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
      // Refresh current user session from backend
      apiFetch('/auth/me')
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('sri_anvaya_user', JSON.stringify(userData));
        })
        .catch(() => {
          // Token expired or invalid
          localStorage.removeItem('sri_anvaya_token');
          localStorage.removeItem('sri_anvaya_user');
          setUser(null);
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem('sri_anvaya_token', res.token);
    localStorage.setItem('sri_anvaya_user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);

    // Smart redirect based on roles
    if (res.user.roles.includes('SUPER_ADMIN') || res.user.roles.includes('ADMIN') || res.user.roles.includes('OPERATIONS') || res.user.roles.includes('FINANCE')) {
      router.push('/admin/dashboard');
    } else if (res.user.roles.includes('PROVIDER')) {
      router.push('/provider/dashboard');
    } else {
      router.push('/customer/dashboard');
    }

    return res.user;
  };

  const register = async (data: { email: string; password: string; fullName: string; phone?: string; role?: string }) => {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    localStorage.setItem('sri_anvaya_token', res.token);
    localStorage.setItem('sri_anvaya_user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);

    if (data.role === 'PROVIDER') {
      router.push('/provider/dashboard');
    } else {
      router.push('/customer/onboarding');
    }

    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('sri_anvaya_token');
    localStorage.removeItem('sri_anvaya_user');
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  const refreshUser = async () => {
    try {
      const userData = await apiFetch('/auth/me');
      setUser(userData);
      localStorage.setItem('sri_anvaya_user', JSON.stringify(userData));
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
