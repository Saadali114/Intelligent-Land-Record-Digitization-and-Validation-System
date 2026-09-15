'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  FileText,
  Layers,
  Bell,
  UserCheck,
  PhoneCall,
  ArrowUpRight,
  ShieldCheck,
  Building,
  LogOut,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { citizenService } from '../../services/citizen.service';
import { cn } from '../../lib/utils';

interface PortalSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const PortalSidebar: React.FC<PortalSidebarProps> = ({
  mobileOpen = false,
  onCloseMobile,
}) => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const navigation: {
    name: string;
    href: string;
    icon: any;
    exact?: boolean;
    highlight?: boolean;
    badge?: string;
  }[] = [
    {
      name: t('navbar.dashboard'),
      href: '/portal',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      name: t('landRecords.title'),
      href: '/portal/land-records',
      icon: Layers,
    },
    {
      name: t('applications.title'),
      href: '/portal/applications',
      icon: FileText,
    },
    {
      name: t('complaints.sidebarTitle', { defaultValue: 'Grievance Redressal' }),
      href: '/portal/complaints',
      icon: AlertCircle,
    },
    {
      name: t('notifications.title'),
      href: '/portal/notifications',
      icon: Bell,
    },
    {
      name: t('profile.personalInfo'),
      href: '/portal/profile',
      icon: UserCheck,
    },
  ];

  const isActive = (itemHref: string, exact?: boolean) => {
    if (exact) {
      return pathname === itemHref;
    }
    return !!pathname?.startsWith(itemHref);
  };

  const content = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 border-r border-slate-800">
      {/* Sidebar Top Banner */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{t('navbar.citizenPortal')}</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          {t('common.revenueDept')}
        </div>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navigation.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all my-2 shadow-sm',
                  active
                    ? 'bg-blue-600 text-white shadow-blue-900/50'
                    : 'bg-blue-900/40 text-blue-200 border border-blue-700/50 hover:bg-blue-900/70 hover:text-white'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-amber-300" />
                  <span>{item.name}</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                  {item.badge}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-colors',
                  active ? 'text-blue-400' : 'text-slate-500'
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Support Card */}
      <div className="p-3 border-t border-slate-800/80 space-y-3">
        <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-800 text-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-200 mb-1">
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('common.helpdesk')}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {t('common.tollFree')}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {t('common.helpdeskHours', { defaultValue: 'Mon–Sat: 9:00 AM to 6:00 PM' })}
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Building className="w-3.5 h-3.5" />
            <span>{t('common.backToHome')}</span>
          </div>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>

        {/* Citizen Sign Out Option */}
        <button
          type="button"
          onClick={() => {
            if (onCloseMobile) onCloseMobile();
            citizenService.logout();
            try {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
            } catch {}
            router.push('/portal/login');
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/30 hover:bg-rose-900/60 border border-rose-900/40 hover:border-rose-700 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
            <span>{t('common.logout', 'Sign Out')}</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-rose-400/80 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-900/50">
            Exit
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-shrink-0">{content}</aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex flex-col flex-1 max-w-xs w-full shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
