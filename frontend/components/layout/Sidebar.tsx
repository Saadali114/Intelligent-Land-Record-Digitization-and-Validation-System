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
  LogOut,
  PanelLeftClose,
} from 'lucide-react';

import { useTranslation } from 'react-i18next';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { user, isAdmin, isOfficer, isVerifier, logout } = useAuth();

  const navItems = [
    {
      label: t('navbar.dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'OFFICER', 'VERIFIER'],
    },
    {
      label: t('navbar.landRecords'),
      href: '/land-records',
      icon: FileSpreadsheet,
      roles: ['ADMIN', 'OFFICER', 'VERIFIER'],
    },
    {
      label: t('navbar.documentRepository'),
      href: '/documents',
      icon: Files,
      roles: ['ADMIN', 'OFFICER', 'VERIFIER'],
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
      roles: ['ADMIN', 'OFFICER'],
    },
    {
      label: t('navbar.myProfile'),
      href: '/profile',
      icon: UserCheck,
      roles: ['ADMIN', 'OFFICER', 'VERIFIER'],
    },
  ];

  const allowedNavItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  const renderSidebarContent = (collapsed: boolean) => (
    <div
      className={cn(
        'flex h-full flex-col justify-between bg-slate-900 text-slate-200 transition-all duration-300',
        collapsed ? 'py-5 px-2 items-center' : 'py-5 px-4'
      )}
    >
      <div className={cn('w-full', collapsed && 'flex flex-col items-center')}>
        {/* Header Branding & Collapse Trigger */}
        {collapsed ? (
          <div className="flex flex-col items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shrink-0"
              title="ILRD PORTAL - National Land Registry"
            >
              <FileCheck2 className="w-5 h-5" />
            </div>
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                aria-label={t('sidebar.showSidebar', { defaultValue: 'Expand Sidebar (Ctrl+B)' })}
                title={t('sidebar.showSidebar', { defaultValue: 'Expand Sidebar (Ctrl+B)' })}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <PanelLeftClose className="w-4 h-4 text-blue-400 rotate-180" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between px-2 mb-6">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-white tracking-wide truncate">ILRD PORTAL</h2>
                <p className="text-[10px] text-slate-400 truncate">
                  {t('sidebar.nationalLandRegistry', { defaultValue: 'National Land Registry' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t('common.close', { defaultValue: 'Close' })}
                  className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  aria-label={t('sidebar.hideSidebar', { defaultValue: 'Hide Sidebar (Ctrl+B)' })}
                  title={t('sidebar.hideSidebar', { defaultValue: 'Hide Sidebar' })}
                  className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {!collapsed && (
          <div className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {t('sidebar.navigation', { defaultValue: 'Navigation' })}
          </div>
        )}

        {/* Navigation List */}
        <nav className={cn('space-y-1.5 w-full', collapsed && 'flex flex-col items-center')}>
          {allowedNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && !!pathname?.startsWith(item.href));

            if (collapsed) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'w-11 h-11 flex items-center justify-center rounded-xl transition-all relative group',
                    isActive
                      ? 'bg-blue-600 text-white shadow-md font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                  title={item.label}
                  aria-label={item.label}
                >
                  <Icon className={cn('w-5 h-5', isActive ? 'text-white' : 'text-slate-400 group-hover:text-white')} />
                  {/* Floating tooltip on hover */}
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 border border-slate-700">
                    {item.label}
                  </div>
                </Link>
              );
            }

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

      {/* Footer: System Status, User Profile & Dedicated Sign Out */}
      <div className={cn('space-y-3 pt-3 border-t border-slate-800 w-full', collapsed && 'flex flex-col items-center')}>
        {/* System Online Status */}
        {collapsed ? (
          <div
            className="flex items-center justify-center w-10 h-8 rounded-lg bg-slate-800/60 border border-slate-700/60"
            title={t('sidebar.systemOnline', { defaultValue: 'System Online' })}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        ) : (
          <div className="px-3 py-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400">
            <div className="font-semibold text-slate-200 mb-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {t('sidebar.systemOnline', { defaultValue: 'System Online' })}
            </div>
            <p className="text-[10px] leading-relaxed text-slate-400">
              {t('sidebar.systemOnlineDesc', {
                defaultValue: 'AI & Multilingual OCR pipeline ready for Phase 2 integration.',
              })}
            </p>
          </div>
        )}

        {/* User Profile Card */}
        {user && (
          collapsed ? (
            <div
              className="flex items-center justify-center relative group"
              title={`${user.name} (${user.role})`}
            >
              <div className="w-10 h-10 rounded-full bg-blue-900 border border-blue-600/50 flex items-center justify-center text-amber-400 font-bold text-xs shadow-xs cursor-pointer">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 border border-slate-700">
                <div className="font-bold">{user.name}</div>
                <div className="text-[10px] text-amber-400">{user.role}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-slate-800/80 border border-slate-700/80">
              <div className="w-8 h-8 rounded-full bg-blue-900 border border-blue-600/50 flex items-center justify-center text-amber-400 font-bold text-xs shrink-0">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-white truncate">{user.name}</div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-bold text-[9px] border border-blue-800/50">
                    {user.role}
                  </span>
                  <span className="truncate">{user.department || user.district}</span>
                </div>
              </div>
            </div>
          )
        )}

        {/* Dedicated Sign Out Button */}
        {collapsed ? (
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              logout();
            }}
            className="w-11 h-11 flex items-center justify-center rounded-xl text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/80 border border-rose-900/50 hover:border-rose-700 transition-all cursor-pointer shadow-xs relative group"
            title={t('common.logout', 'Sign Out')}
            aria-label={t('common.logout', 'Sign Out')}
          >
            <LogOut className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
            <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-rose-300 text-xs font-bold rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 border border-slate-700">
              {t('common.logout', 'Sign Out')}
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (onClose) onClose();
              logout();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/80 border border-rose-900/50 hover:border-rose-700 transition-all group cursor-pointer shadow-xs"
            title={t('common.logout', 'Sign Out')}
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
              <span>{t('common.logout', 'Sign Out')}</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-rose-300/90 bg-rose-900/60 px-1.5 py-0.5 rounded border border-rose-800/60">
              {t('sidebar.exit', 'Exit')}
            </span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop collapsible sidebar - collapses to sleek w-20 mini-rail showing little bit */}
      <aside
        className={cn(
          'hidden md:flex flex-col fixed inset-y-0 z-30 pt-16 border-r border-slate-800 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {renderSidebarContent(isCollapsed)}
      </aside>

      {/* Mobile Drawer (Always full width when opened on mobile) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />
          <div className="relative w-72 h-full z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {renderSidebarContent(false)}
          </div>
        </div>
      )}
    </>
  );
};
