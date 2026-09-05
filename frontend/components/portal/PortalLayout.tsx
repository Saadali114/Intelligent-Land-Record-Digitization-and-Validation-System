'use client';

import React, { useState } from 'react';
import { PortalHeader } from './PortalHeader';
import { PortalSidebar } from './PortalSidebar';

interface PortalLayoutProps {
  children: React.ReactNode;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

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
