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
  title: string;
  department: string;
  date: string;
  refNo: string;
  isNew: boolean;
}

export const NewsNoticesSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('ALL');

  const notices: NoticeItem[] = [
    {
      id: '1',
      category: 'GAZETTE',
      title: 'Implementation of AI-Driven Cadastral Validation for All Historical 7/12 Satbara Extracts',
      department: 'Revenue & Forest Department, Mantralaya',
      date: '04 March 2026',
      refNo: 'REV-GAZ/2026/089',
      isNew: true,
    },
    {
      id: '2',
      category: 'CIRCULAR',
      title: 'Time-Bound 15-Day Clearance Directive for Online Form 6 Mutation (Ferfar) Applications',
      department: 'Office of the Settlement Commissioner & Director of Land Records',
      date: '28 February 2026',
      refNo: 'CIR-DILRMP/2026/112',
      isNew: true,
    },
    {
      id: '3',
      category: 'ORDER',
      title: 'Notification on Mandatory Digital Watermark & QR Code Verification on Certified Extracts',
      department: 'State Land Governance & E-Mahabhumi Mission',
      date: '15 February 2026',
      refNo: 'ORD-SEC/2026/045',
      isNew: false,
    },
    {
      id: '4',
      category: 'PROJECT',
      title: 'SVAMITVA Drone Cadastral Mapping Phase-IV Commencement across 12,000 Rural Gaothans',
      department: 'Survey of India & Ministry of Panchayati Raj Joint Cell',
      date: '02 February 2026',
      refNo: 'PRJ-SVM/2026/031',
      isNew: false,
    },
    {
      id: '5',
      category: 'CIRCULAR',
      title: 'Standard Operating Procedures for Online Land Classification Change and Non-Agricultural (NA) Permissions',
      department: 'Urban Development & Revenue Joint Secretariat',
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
              {t('news.badge') || 'Official Gazette & Circulars'}
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
              {t('news.title') || 'News, Notices & Press Releases'}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {t('news.subtitle') || 'Latest statutory orders, administrative guidelines, and land modernization updates.'}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 text-xs font-semibold self-start md:self-auto">
            {['ALL', 'GAZETTE', 'CIRCULAR', 'ORDER', 'PROJECT'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeTab === tab
                    ? 'bg-white text-blue-950 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'ALL' ? 'All Updates' : tab.charAt(0) + tab.slice(1).toLowerCase()}
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
                    {n.category}
                  </span>

                  {n.isNew && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-600 text-white animate-pulse">
                      NEW
                    </span>
                  )}

                  <span className="text-[11px] font-mono text-slate-500">{n.refNo}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm hover:text-blue-900 transition-colors cursor-pointer">
                  {n.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{n.department}</span>
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
                  <span>Download PDF</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
