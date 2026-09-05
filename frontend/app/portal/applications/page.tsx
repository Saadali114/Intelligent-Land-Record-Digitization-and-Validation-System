'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Search,
  Filter,
  ArrowRight,
  UploadCloud,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ChevronRight,
} from 'lucide-react';
import { PortalLayout } from '../../../components/portal/PortalLayout';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { citizenService } from '../../../services/citizen.service';
import { CitizenApplication } from '../../../types/citizen';

export default function CitizenApplicationsPage() {
  const { t } = useTranslation();
  const [applications, setApplications] = useState<CitizenApplication[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    loadApplications();
  }, [selectedStatus, searchQuery]);

  const loadApplications = () => {
    const list = citizenService.getApplications({
      status: selectedStatus,
      search: searchQuery,
    });
    setApplications(list);
  };

  const statusFilters = [
    { label: t('applications.allTab'), value: 'ALL' },
    { label: t('applications.processingTab'), value: 'PROCESSING' },
    { label: t('applications.underReviewTab'), value: 'UNDER_REVIEW' },
    { label: t('applications.verifiedTab'), value: 'VERIFIED' },
    { label: t('applications.actionRequiredTab'), value: 'ACTION_REQUIRED' },
  ];

  return (
    <PortalLayout>
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>{t('navbar.citizenPortal')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {t('applications.title')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('applications.subtitle')}
          </p>
        </div>

        <Link href="/portal/upload">
          <Button variant="primary" size="md" className="gap-2 bg-blue-900 hover:bg-blue-800">
            <UploadCloud className="w-4 h-4 text-amber-300" />
            <span>{t('dashboard.uploadCta')}</span>
          </Button>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {statusFilters.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedStatus(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedStatus === tab.value
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t('common.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
            />
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {applications.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">{t('applications.noApplications')}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {t('applications.noApplicationsDesc')}
            </p>
            <div className="pt-2">
              <Link href="/portal/upload">
                <Button variant="primary" size="sm">
                  {t('dashboard.uploadCta')}
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-slate-950">
                      {app.id}
                    </span>
                    <Badge status={app.status}>
                      {app.status === 'UNDER_REVIEW'
                        ? t('common.underReview')
                        : app.status === 'VERIFIED'
                        ? t('common.verified')
                        : app.status === 'ACTION_REQUIRED'
                        ? t('common.actionRequired')
                        : app.status === 'PROCESSING'
                        ? t('common.processing')
                        : app.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {app.submittedDate}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-700 font-medium">
                    <span>
                      {app.documentType}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span>
                      {t('common.surveyNumber')}: <strong className="font-mono">{app.surveyNumber}</strong>
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span>
                      {t('common.village')}: <strong>{app.village}</strong>, {app.taluka}
                    </span>
                    <span className="text-slate-300">&bull;</span>
                    <span>
                      {t('common.landArea')}: <strong>{app.landArea}</strong>
                    </span>
                  </div>

                  {app.status === 'ACTION_REQUIRED' && (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2 mt-2">
                      <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                      <div>
                        {t('applications.noticeDiscrepancy')}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-end md:self-center">
                  <Link href={`/portal/applications/${app.id}`}>
                    <Button
                      variant={app.status === 'ACTION_REQUIRED' ? 'primary' : 'outline'}
                      size="sm"
                      className={`gap-1.5 text-xs ${
                        app.status === 'ACTION_REQUIRED'
                          ? 'bg-amber-600 hover:bg-amber-700 text-white'
                          : ''
                      }`}
                    >
                      <span>
                        {app.status === 'ACTION_REQUIRED'
                          ? t('applications.reviewDiscrepancy')
                          : t('applications.viewTimeline')}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
