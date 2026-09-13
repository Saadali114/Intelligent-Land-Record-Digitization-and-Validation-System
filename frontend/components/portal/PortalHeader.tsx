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
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Hamburger + Brand */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/portal" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#14532d] border border-emerald-500/40 flex items-center justify-center text-amber-300 font-bold shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900 tracking-tight">
                  ILRDVS
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-[#fde68a] text-amber-950 border border-amber-300">
                  DILRMP 3.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                महाराष्ट्र भूमी पोर्टल - Intelligent Land Record Digitization & Validation
              </p>
            </div>
          </Link>
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
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </Link>

          {/* Profile pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="hidden sm:flex flex-col items-end text-right leading-tight">
              <span className="text-xs font-bold text-slate-900">
                {profile?.name || 'Saad Ali'}
              </span>
              <span className="text-[10px] text-[#14532d] font-semibold">
                Landholder • Khadakwasla, Pune
              </span>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#14532d] text-white flex items-center justify-center font-bold text-xs border border-emerald-600/40 shadow-2xs">
              SA
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
