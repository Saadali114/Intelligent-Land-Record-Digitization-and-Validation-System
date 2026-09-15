'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Search,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { PortalLayout } from '../../../components/portal/PortalLayout';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ApplyDigitalDocumentModal } from '../../../components/portal/ApplyDigitalDocumentModal';
import { citizenService } from '../../../services/citizen.service';
import { CitizenApplication } from '../../../types/citizen';

export default function CitizenApplicationsPage() {
  const { t } = useTranslation();
  const [applications, setApplications] = useState<CitizenApplication[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    loadApplications();
  }, [selectedStatus, searchQuery]);

  const loadApplications = () => {
    const list = citizenService.getApplications({
      status: selectedStatus,
      search: searchQuery,
    });
    setApplications(list);

    citizenService
      .fetchApplications({
        status: selectedStatus,
        search: searchQuery,
      })
      .then((liveList) => {
        if (liveList && liveList.length > 0) {
          setApplications(liveList);
        }
      })
      .catch((err) => {
        console.warn('Failed to fetch live applications:', err);
      });
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

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsApplyModalOpen(true)}
          className="gap-2 bg-blue-900 hover:bg-blue-800 cursor-pointer"
        >
          <FileText className="w-4 h-4 text-amber-300" />
          <span>Apply for Digital Document</span>
        </Button>
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
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsApplyModalOpen(true)}
              >
                Apply for Digital Document
              </Button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
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
                    {app.verifiedByOfficer ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        <span>Verified by Officer</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                        <Clock className="w-3 h-3 text-blue-700" />
                        <span>Under Officer Verification</span>
                      </span>
                    )}
                    <span className="text-xs text-slate-400 ml-auto md:ml-0">
                      {app.submittedDate}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-700 font-medium">
                    <span className="font-semibold text-slate-900">
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

                  {/* Officer Verification Details */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 pt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-900 flex-shrink-0" />
                    <span>
                      Officer: <strong className="text-slate-900">{app.officerName || 'Circle Revenue Officer (Haveli)'}</strong>
                      {app.officerDesignation && <span className="text-slate-500"> ({app.officerDesignation})</span>}
                    </span>
                    {app.digitalSignatureId && (
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        DSC #{app.digitalSignatureId}
                      </span>
                    )}
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

      <ApplyDigitalDocumentModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() => loadApplications()}
      />
    </PortalLayout>
  );
}
