'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Info,
  CheckCheck,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { PortalLayout } from '../../../components/portal/PortalLayout';
import { Button } from '../../../components/ui/Button';
import { citizenService } from '../../../services/citizen.service';
import { CitizenNotification } from '../../../types/citizen';
import { useTranslation } from 'react-i18next';

export default function CitizenNotificationsPage() {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<CitizenNotification[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const notifs = citizenService.getNotifications();
    setNotifications(notifs);
  };

  const handleMarkAllRead = () => {
    citizenService.markAllNotificationsRead();
    loadNotifications();
  };

  const handleMarkRead = (id: string) => {
    citizenService.markNotificationRead(id);
    loadNotifications();
  };

  const filtered =
    filter === 'UNREAD' ? notifications.filter((n) => !n.read) : notifications;

  return (
    <PortalLayout>
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
            <Bell className="w-4 h-4" />
            <span>Alerts &amp; Notices</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {t('notifications.title')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('notifications.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            className="text-xs gap-1.5"
          >
            <CheckCheck className="w-4 h-4" />
            <span>{t('notifications.markAllRead')}</span>
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'ALL'
              ? 'bg-blue-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {t('notifications.all')} ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filter === 'UNREAD'
              ? 'bg-blue-900 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {t('notifications.unread')} ({notifications.filter((n) => !n.read).length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            {t('notifications.empty')}
          </div>
        ) : (
          filtered.map((n) => {
            const isWarning = n.type === 'WARNING';
            const isSuccess = n.type === 'SUCCESS';

            return (
              <div
                key={n.id}
                onClick={() => handleMarkRead(n.id)}
                className={`p-5 transition-colors flex items-start justify-between gap-4 ${
                  !n.read ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`p-2 rounded-lg mt-0.5 flex-shrink-0 ${
                      isWarning
                        ? 'bg-amber-100 text-amber-800'
                        : isSuccess
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    {isWarning ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : isSuccess ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Info className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-xs font-bold ${
                          !n.read ? 'text-slate-900 font-extrabold' : 'text-slate-700'
                        }`}
                      >
                        {n.title}
                      </h3>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      {n.date}
                    </span>
                  </div>
                </div>

                {n.link && (
                  <Link
                    href={n.link}
                    className="flex-shrink-0 self-center"
                  >
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                )}
              </div>
            );
          })
        )}
      </div>
    </PortalLayout>
  );
}
