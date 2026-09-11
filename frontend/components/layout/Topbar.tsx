'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { LogOut, User as UserIcon, Shield, Menu, Building2, PanelLeft, PanelLeftClose } from 'lucide-react';
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
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 shadow-xs">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile menu trigger */}
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label={t('topbar.toggleNavigation', { defaultValue: 'Toggle Navigation' })}
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Desktop Sidebar Toggle (Hide / Show) */}
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className={cn(
              'hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border shadow-2xs cursor-pointer',
              isSidebarCollapsed
                ? 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            )}
            aria-label={
              isSidebarCollapsed
                ? t('sidebar.showSidebar', { defaultValue: 'Show Sidebar (Ctrl+B)' })
                : t('sidebar.hideSidebar', { defaultValue: 'Hide Sidebar (Ctrl+B)' })
            }
            title={
              isSidebarCollapsed
                ? t('sidebar.showSidebar', { defaultValue: 'Show Sidebar (Ctrl+B)' })
                : t('sidebar.hideSidebar', { defaultValue: 'Hide Sidebar (Ctrl+B)' })
            }
          >
            {isSidebarCollapsed ? (
              <>
                <PanelLeft className="w-4 h-4 text-blue-700" />
                <span className="hidden lg:inline font-bold">
                  {t('sidebar.showSidebar', { defaultValue: 'Show Sidebar' })}
                </span>
              </>
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 text-slate-500" />
                <span className="hidden lg:inline font-medium text-slate-600">
                  {t('sidebar.hideSidebar', { defaultValue: 'Hide Sidebar' })}
                </span>
              </>
            )}
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-900 flex items-center justify-center text-amber-400 shadow-sm font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 tracking-tight">
                {t('topbar.officerPortalTitle', {
                  portalName: t('common.portalName'),
                  defaultValue: `${t('common.portalName')} Officer Portal`,
                })}
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                {t('common.govtOfIndia')}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              {t('common.portalFullName')}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <LanguageSwitcher variant="header" />

        {user && (
          <>
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-900">{user.name}</span>
                <Badge status={user.role} />
              </div>
              <span className="text-[11px] text-slate-500">
                {user.department} &bull; {user.district}
              </span>
            </div>

            <Link href="/profile">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer">
                <UserIcon className="w-4 h-4" />
              </div>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-slate-500 hover:text-rose-600 hover:bg-rose-50"
              title={t('common.logout')}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-1 text-xs font-medium">
                {t('common.logout')}
              </span>
            </Button>
          </>
        )}
      </div>
    </header>
  );
};
