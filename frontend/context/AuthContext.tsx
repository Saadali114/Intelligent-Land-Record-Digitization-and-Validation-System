'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, UserRole } from '../types';
import { authService } from '../services/auth.service';
import { citizenService } from '../services/citizen.service';
import { LoginFormData, RegisterFormData } from '../schemas/auth.schema';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOfficer: boolean;
  isVerifier: boolean;
  isViewer: boolean;
  isCitizen: boolean;
  hasRole: (roles: UserRole[]) => boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUser = await authService.getMe();
      setUser(currentUser);
      localStorage.setItem('user', JSON.stringify(currentUser));
    } catch {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Attempt to restore user from localStorage for instant rendering, then verify with server
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch {
        // ignore JSON parse error
      }
    }
    loadUser();
  }, [loadUser]);

  const login = async (credentials: LoginFormData) => {
    const { user: loggedInUser, token } = await authService.login(credentials);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);

    if (loggedInUser.accountStatus === 'PENDING_APPROVAL') {
      router.push('/officer/application-status');
    } else if (loggedInUser.role === 'CITIZEN') {
      citizenService.login({
        name: loggedInUser.name,
        email: loggedInUser.email,
        mobile: loggedInUser.mobileNumber || '',
        district: loggedInUser.district || 'Pune',
        taluka: loggedInUser.taluka || 'Haveli',
        village: loggedInUser.village || 'Khadakwasla',
        preferredLanguage: loggedInUser.preferredLanguage || 'English',
      });
      router.push('/portal');
    } else if (loggedInUser.role === 'OFFICER' || loggedInUser.role === 'VERIFIER') {
      router.push('/verification');
    } else {
      router.push('/dashboard');
    }
  };

  const register = async (data: RegisterFormData) => {
    const { user: registeredUser, token } = await authService.register(data);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(registeredUser));
    setUser(registeredUser);
    router.push('/dashboard');
  };


  const logout = async () => {
    try {
      citizenService.logout();
      await authService.logout();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      router.push('/login');
    }
  };

  const role = user?.role;
  const isAdmin = role === 'ADMIN';
  const isOfficer = role === 'OFFICER';
  const isVerifier = role === 'VERIFIER';
  const isViewer = role === 'VIEWER';
  const isCitizen = role === 'CITIZEN';

  const hasRole = (roles: UserRole[]): boolean => {
    if (!role) return false;
    return roles.includes(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin,
        isOfficer,
        isVerifier,
        isViewer,
        isCitizen,
        hasRole,
        login,
        register,
        logout,
        setUser,
      }}
    >
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
