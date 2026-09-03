'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { UserRole } from '../../types';
import { Loader2 } from 'lucide-react';

export interface AppLayoutProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, allowedRoles }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        router.push('/unauthorized');
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
          <p className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
            Loading Registry Session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Topbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />
      <div className="flex flex-1">
        <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        <main className="flex-1 md:pl-64 flex flex-col">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
