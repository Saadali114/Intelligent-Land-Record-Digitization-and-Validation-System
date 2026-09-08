import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  FileText,
  Download,
  Calendar,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NoticeItem {
  id: string;
  category: 'CIRCULAR' | 'GAZETTE' | 'ORDER' | 'PROJECT';
  titleKey: string;
  departmentKey: string;
  date: string;
  refNo: string;
  isNew: boolean;
}

export const NewsNoticesSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('ALL');

  const tabs: { key: string; labelKey: string }[] = [
    { key: 'ALL', labelKey: 'news.tabs.all' },
    { key: 'GAZETTE', labelKey: 'news.tabs.gazette' },
    { key: 'CIRCULAR', labelKey: 'news.tabs.circular' },
    { key: 'ORDER', labelKey: 'news.tabs.order' },
    { key: 'PROJECT', labelKey: 'news.tabs.project' },
  ];

  const notices: NoticeItem[] = [
    {
      id: '1',
      category: 'GAZETTE',
      titleKey: 'notice1Title',
      departmentKey: 'notice1Dept',
      date: '04 March 2026',
      refNo: 'REV-GAZ/2026/089',
      isNew: true,
    },
    {
      id: '2',
      category: 'CIRCULAR',
      titleKey: 'notice2Title',
      departmentKey: 'notice2Dept',
      date: '28 February 2026',
      refNo: 'CIR-DILRMP/2026/112',
      isNew: true,
    },
    {
      id: '3',
      category: 'ORDER',
      titleKey: 'notice3Title',
      departmentKey: 'notice3Dept',
      date: '15 February 2026',
      refNo: 'ORD-SEC/2026/045',
      isNew: false,
    },
    {
      id: '4',
      category: 'PROJECT',
      titleKey: 'notice4Title',
      departmentKey: 'notice4Dept',
      date: '02 February 2026',
      refNo: 'PRJ-SVM/2026/031',
      isNew: false,
    },
    {
      id: '5',
      category: 'CIRCULAR',
      titleKey: 'notice5Title',
      departmentKey: 'notice5Dept',
      date: '18 January 2026',
      refNo: 'CIR-NA/2026/014',
      isNew: false,
    },
  ];

  const filteredNotices =
    activeTab === 'ALL' ? notices : notices.filter((n) => n.category === activeTab);

  return (
    <section id="notices" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-xs font-bold text-rose-800 uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5 text-rose-600" />
              {t('news.badge')}
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
              {t('news.title')}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {t('news.subtitle')}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 text-xs font-semibold self-start md:self-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-950 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t(tab.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Notices List */}
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          {filteredNotices.map((n) => (
            <div
              key={n.id}
              className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase border ${
                      n.category === 'GAZETTE'
                        ? 'bg-purple-50 text-purple-800 border-purple-200'
                        : n.category === 'CIRCULAR'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : n.category === 'ORDER'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {t(`news.tabs.${n.category.toLowerCase()}`)}
                  </span>

                  {n.isNew && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white animate-pulse">
                      {t('common.newBadge')}
                    </span>
                  )}

                  <span className="text-[11px] font-mono text-slate-500">{n.refNo}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm hover:text-blue-900 transition-colors cursor-pointer">
                  {t(`news.notices.${n.titleKey}`)}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{t(`news.notices.${n.departmentKey}`)}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {n.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <Link
                  href="/documents"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 hover:border-blue-900 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-900 text-xs font-bold transition-all shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-blue-800" />
                  <span>{t('common.downloadPdf')}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
