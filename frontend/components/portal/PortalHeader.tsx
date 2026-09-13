'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  Building2,
  Bell,
  User as UserIcon,
  LogOut,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { citizenService } from '../../services/citizen.service';

export interface PortalHeaderProps {
  onToggleSidebar?: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({ onToggleSidebar }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  const profile = citizenService.getProfile();

  const handleLogout = () => {
    citizenService.logout();
    router.push('/portal/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs select-none">
      {/* Top Official Accessibility & Gov Ribbon */}
      <div className="bg-[#f6f8f4] border-b border-slate-200/70 px-4 sm:px-6 lg:px-8 py-1 text-[11px] text-slate-700">
        <div className="w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#14532d] font-bold">🏛️ महाराष्ट्र शासन | Govt. of Maharashtra</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 hidden sm:inline">DILRMP 3.0 & NLRMP Compliant Citizen Node</span>
            <span className="text-slate-300 hidden md:inline">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-[#166534] font-medium">
              <PhoneCall className="w-3 h-3" />
              <span>टोल-फ्री: 1800-120-8040</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px]">
              <span className="text-slate-500 font-medium">Text:</span>
              <button type="button" className="px-1 text-slate-700 font-bold hover:text-[#14532d]">A-</button>
              <button type="button" className="px-1 text-[#14532d] font-bold bg-emerald-100 rounded">A</button>
              <button type="button" className="px-1 text-slate-700 font-bold hover:text-[#14532d]">A+</button>
            </div>
            <LanguageSwitcher variant="light" />
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Hamburger + Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/portal" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-sovereign-800 border border-emerald-500/40 flex items-center justify-center text-white font-bold shadow-xs">
              <Building2 className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-wider text-sovereign-950 font-mono text-sm sm:text-base">
                  ILRDVS
                </span>
                <span className="text-sm sm:text-base font-bold text-sovereign-800">
                  महा-भूमी
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] uppercase font-bold tracking-wider border border-emerald-300 hidden sm:inline-block">
                  Govt of India / DLRS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Intelligent Land Record Digitization &amp; Statutory Validation System
              </p>
            </div>
          </Link>
        </div>

        {/* Center: DILRMP FedOps & RTS SLA Node Status (Matching Stitch) */}
        <div className="hidden xl:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-xs text-slate-700 font-medium">DILRMP 3.0 FedOps Core Node</span>
            <span className="text-xs text-emerald-800 font-bold font-mono">[ONLINE]</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
            <span className="text-xs text-slate-600 font-medium">RTS SLA Target:</span>
            <span className="text-xs text-emerald-900 font-bold font-mono">14 Days Max</span>
          </div>
        </div>

        {/* Right: Notification bell & User profile */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <Link
            href="/portal/notifications"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
            )}
          </Link>

          {/* Profile pill with Logout */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="hidden sm:flex flex-col items-end text-right leading-tight">
              <span className="text-xs font-bold text-slate-900">
                {profile?.name || 'Saad Ali'}
              </span>
              <span className="text-[10px] text-emerald-800 font-semibold font-mono">
                Citizen Corner • Haveli
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-sovereign-800 text-white flex items-center justify-center font-bold text-xs border border-emerald-600/40 shadow-2xs">
              SA
            </div>

            <button
              onClick={handleLogout}
              className="p-1 text-slate-400 hover:text-rose-600 transition-colors ml-1"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
