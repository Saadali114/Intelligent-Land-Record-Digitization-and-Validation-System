'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  User,
  LogOut,
  Building2,
  FileCheck2,
  Menu,
} from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { citizenService } from '../../services/citizen.service';
import { CitizenProfile, CitizenNotification } from '../../types/citizen';

interface PortalHeaderProps {
  onToggleSidebar?: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({ onToggleSidebar }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [notifications, setNotifications] = useState<CitizenNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const prof = citizenService.getProfile();
    setProfile(prof);
    const notifs = citizenService.getNotifications();
    setNotifications(notifs);
  }, [pathname]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = async () => {
    citizenService.logout();
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch {
      // ignore
    }
    router.push('/portal/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Gov Tricolor Thin Ribbon */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 border-b border-slate-200" />

      {/* Main Bar */}
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Hamburger + Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label={t('topbar.toggleNavigation', { defaultValue: 'Toggle navigation' })}
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/portal" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-blue-900 flex items-center justify-center text-amber-400 font-bold shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 tracking-tight">
                  ILRDVS <span className="text-blue-900 font-semibold">{t('navbar.citizenPortal')}</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {t('citizenCorner.title')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                {t('common.portalFullName')}
              </p>
            </div>
          </Link>
        </div>

        {/* Right: Actions, Language, Notifications, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Language Selector Component */}
          <LanguageSwitcher variant="header" />

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none transition-colors"
              title={t('notifications.title')}
              aria-label={t('notifications.viewNotifications', { defaultValue: 'View notifications' })}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg border border-slate-200 bg-white shadow-xl py-2 z-50 animate-in fade-in">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {t('notifications.title')} ({unreadCount} {t('notifications.unread')})
                  </span>
                  <Link
                    href="/portal/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-blue-800 hover:underline font-medium"
                  >
                    {t('common.viewAll')}
                  </Link>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.slice(0, 4).map((n) => (
                    <Link
                      key={n.id}
                      href={n.link || '/portal/notifications'}
                      onClick={() => setShowNotifications(false)}
                      className={`block px-4 py-2.5 hover:bg-slate-50 transition-colors ${
                        !n.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-slate-900 line-clamp-1">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {n.date}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile pill */}
          <Link
            href="/portal/profile"
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold text-xs">
              {(profile?.name || 'C').charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-900 leading-tight">
                {profile?.name || t('common.citizen', { defaultValue: 'Citizen' })}
              </div>
              <div className="text-[10px] text-slate-500 leading-none">{t('navbar.citizenCorner')}</div>
            </div>
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title={t('common.logout')}
            aria-label={t('common.signOutCitizen', { defaultValue: 'Sign out of Citizen Portal' })}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
