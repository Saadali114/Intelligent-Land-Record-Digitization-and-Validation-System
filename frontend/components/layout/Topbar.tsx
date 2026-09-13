'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import {
  Menu,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  User as UserIcon,
  Sun,
  Moon,
  Sparkles,
  PhoneCall,
  Bell,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TopbarProps {
  onMobileMenuToggle?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onMobileMenuToggle,
  isSidebarCollapsed = false,
  onToggleSidebar,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-slate-200 bg-white px-3 sm:px-6 shadow-2xs select-none">
      {/* Left: Mobile trigger & Department Header */}
      <div className="flex items-center gap-3 min-w-0">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#14532d] flex items-center justify-center text-amber-300 font-bold shrink-0 shadow-2xs">
            <svg className="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-slate-900 truncate">
                महाराष्ट्र शासन • महसूल व वन विभाग
              </span>
              <span className="hidden xl:inline-block text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-[#14532d] border border-emerald-200">
                DILRMP-02
              </span>
            </div>
            <p className="text-[10px] text-slate-500 truncate hidden sm:block">
              एकत्रिक भूमी अभिलेख व फेरफार पडताळणी प्रणाली (Consolidated Cadastral & Mutation Console)
            </p>
          </div>
        </div>
      </div>

      {/* Center: Real-time Status Badges (Matching Screenshot) */}
      <div className="hidden lg:flex items-center gap-2.5 text-[11px]">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-700">
          <span className="font-semibold text-slate-500">RTS SLA Target:</span>
          <span className="font-bold text-[#14532d]">14 Days Max</span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#14532d]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold">DSC Token: Active (e-Sign 3.0)</span>
        </div>
      </div>

      {/* Right: Officer Profile Details */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <LanguageSwitcher variant="header" />

        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="hidden sm:flex flex-col items-end text-right leading-tight">
            <span className="text-xs font-bold text-slate-900">
              Smt. Priya R. Deshmukh
            </span>
            <span className="text-[10px] text-emerald-800 font-semibold">
              Circle Officer • Haveli, Pune
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#14532d] text-white flex items-center justify-center font-bold text-xs border border-emerald-600/30 shadow-2xs">
            PD
          </div>
        </div>
      </div>
    </header>
  );
};
