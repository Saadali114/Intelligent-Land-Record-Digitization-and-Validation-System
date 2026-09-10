'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PortalHeader } from './PortalHeader';
import { PortalSidebar } from './PortalSidebar';
import { citizenService } from '../../services/citizen.service';
import { Loader2 } from 'lucide-react';

interface PortalLayoutProps {
  children: React.ReactNode;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const isCitizenAuth = citizenService.isAuthenticated();
    if (!isCitizenAuth) {
      setIsAuthorized(false);
      router.replace('/portal/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (isAuthorized !== true) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-900" />
          <p className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
            Loading Citizen Portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Header */}
      <PortalHeader onToggleSidebar={() => setMobileOpen(true)} />

      {/* Main Container with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <PortalSidebar
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-slate-50/60 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

