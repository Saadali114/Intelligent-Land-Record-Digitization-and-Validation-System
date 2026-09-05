'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  FileSpreadsheet,
  Files,
  CheckCheck,
  Users,
  UserCheck,
  X,
  FileCheck2,
} from 'lucide-react';

import { useTranslation } from 'react-i18next';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { user, isAdmin, isOfficer, isVerifier } = useAuth();

  const navItems = [
    {
      label: t('navbar.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'OFFICER', 'VERIFIER', 'VIEWER'],
    },
    {
      label: t('navbar.landRecords'),
      href: '/land-records',
      icon: FileSpreadsheet,
      roles: ['ADMIN', 'OFFICER', 'VERIFIER', 'VIEWER'],
    },
    {
      label: t('navbar.documentRepository'),
      href: '/documents',
      icon: Files,
      roles: ['ADMIN', 'OFFICER', 'VERIFIER', 'VIEWER'],
    },
    {
      label: t('navbar.verificationQueue'),
      href: '/verification',
      icon: CheckCheck,
      roles: ['ADMIN', 'OFFICER', 'VERIFIER'],
    },
    {
      label: t('navbar.userManagement'),
      href: '/users',
      icon: Users,
      roles: ['ADMIN'],
    },
    {
      label: t('navbar.myProfile'),
      href: '/profile',
      icon: UserCheck,
      roles: ['ADMIN', 'OFFICER', 'VERIFIER', 'VIEWER'],
    },
  ];

  const allowedNavItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between py-5 px-4 bg-slate-900 text-slate-200">
      <div>
        <div className="flex items-center justify-between px-2 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">ILRD PORTAL</h2>
              <p className="text-[10px] text-slate-400">National Land Registry</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>

        <nav className="space-y-1.5">
          {allowedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all',
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-slate-400')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer info box */}
      <div className="px-3 py-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-400">
        <div className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          System Online
        </div>
        <p className="text-[10px] leading-relaxed">
          AI & Multilingual OCR pipeline ready for Phase 2 integration.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-30 pt-16 border-r border-slate-800">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-72 h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
