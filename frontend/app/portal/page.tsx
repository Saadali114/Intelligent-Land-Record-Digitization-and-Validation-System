'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  UploadCloud,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
import { PortalLayout } from '../../components/portal/PortalLayout';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ApplyDigitalDocumentModal } from '../../components/portal/ApplyDigitalDocumentModal';
import { formatDocType, formatStatus } from '../../lib/translationHelpers';
import { citizenService } from '../../services/citizen.service';
import {
  CitizenApplication,
  CitizenLandRecord,
  CitizenProfile,
} from '../../types/citizen';

export default function CitizenDashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [profile, setProfile] = useState<CitizenProfile | null>(null);
  const [applications, setApplications] = useState<CitizenApplication[]>([]);
  const [landRecords, setLandRecords] = useState<CitizenLandRecord[]>([]);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    const prof = citizenService.getProfile();
    setProfile(prof);
    const apps = citizenService.getApplications();
    setApplications(apps);
    const records = citizenService.getLandRecords();
    setLandRecords(records);
  }, []);

  const totalCount = applications.length;
  const underReviewCount = applications.filter(
    (a) => a.status === 'UNDER_REVIEW' || a.status === 'PROCESSING'
  ).length;
  const verifiedCount = applications.filter((a) => a.status === 'VERIFIED').length;
  const actionRequiredCount = applications.filter(
    (a) => a.status === 'ACTION_REQUIRED'
  ).length;

  const discrepancyApp = applications.find((a) => a.status === 'ACTION_REQUIRED');

  return (
    <PortalLayout>
      {/* Welcome & Profile Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-700/60 text-xs font-semibold text-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('dashboard.verifiedCitizenBadge', { defaultValue: 'Verified Citizen Account' })}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {t('dashboard.welcome')}, {profile?.name || t('common.citizen', { defaultValue: 'Citizen' })}
            </h1>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {profile?.village || 'Khadakwasla'}, {t('common.taluka')} {profile?.taluka || 'Haveli'}, {profile?.district || 'Pune'}
              </span>
              <span className="hidden sm:inline text-slate-600">&bull;</span>
              <span className="text-slate-300">
                {t('common.mobileNumber')}: <strong className="text-white font-mono">{profile?.mobile || '—'}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsApplyModalOpen(true)}
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold border border-amber-300 shadow-md gap-2 cursor-pointer"
            >
              <FileText className="w-5 h-5 text-slate-950" />
              <span>Apply for Digital Document</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Discrepancy Action Alert (if any application requires citizen attention) */}
      {discrepancyApp && (
        <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-4 sm:p-5 shadow-xs animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800 flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-amber-950">
                    {t('dashboard.actionAlertTitle')} {discrepancyApp.id}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-200 text-amber-900">
                    {t('common.actionRequired')}
                  </span>
                </div>
                <p className="text-xs text-amber-900/90 mt-1 max-w-3xl">
                  {t('dashboard.actionAlertDesc')} ({discrepancyApp.surveyNumber}, {discrepancyApp.village})
                </p>
              </div>
            </div>
            <Link href={`/portal/applications/${discrepancyApp.id}`}>
              <Button
                variant="primary"
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold whitespace-nowrap shadow-xs"
              >
                {t('dashboard.reviewAndClarify')}
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Submissions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('dashboard.totalApplications')}
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-800">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {t('dashboard.totalDesc')}
          </p>
        </div>

        {/* Under Review */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('dashboard.inProcessing')}
            </span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-800">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-sky-900 mt-2">{underReviewCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {t('dashboard.inProcessingDesc')}
          </p>
        </div>

        {/* Verified / Digitized */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('dashboard.verifiedDigitized')}
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2">{verifiedCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            {t('dashboard.verifiedDesc')}
          </p>
        </div>

        {/* Action Required */}
        <div
          className={`rounded-xl border p-5 shadow-xs transition-colors ${
            actionRequiredCount > 0
              ? 'bg-amber-50/50 border-amber-200'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('dashboard.actionRequired')}
            </span>
            <div
              className={`p-2 rounded-lg ${
                actionRequiredCount > 0
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`text-2xl font-bold mt-2 ${
              actionRequiredCount > 0 ? 'text-amber-800' : 'text-slate-900'
            }`}
          >
            {actionRequiredCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {t('dashboard.actionRequiredDesc')}
          </p>
        </div>
      </div>

      {/* Main Content Split: Recent Applications (Left) + My Land Parcels & Quick Help (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {t('dashboard.recentApplications')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('dashboard.recentSubtitle')}
              </p>
            </div>
            <Link
              href="/portal/applications"
              className="text-xs font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1"
            >
              {t('common.viewAll')} ({totalCount}) <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {applications.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  title={t('dashboard.noRecentApplications', {
                    defaultValue: 'No recent land record applications found',
                  })}
                  description="Apply for an official digital 7/12 extract, 8A Khate-Utara, Property Card or Title Certificate."
                  action={
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsApplyModalOpen(true)}
                    >
                      Apply for Digital Document
                    </Button>
                  }
                />
              </div>
            ) : (
              applications.slice(0, 4).map((app) => (
                <div
                  key={app.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {app.id}
                      </span>
                      <Badge status={app.status}>
                        {formatStatus(app.status, t)}
                      </Badge>
                      {app.verifiedByOfficer ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>Verified by Officer</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          <Clock className="w-3 h-3 text-blue-700" />
                          <span>Under Officer Review</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-slate-800">
                      {formatDocType(app.documentType, t)} &bull; {t('common.surveyNumber')}: <span className="font-mono">{app.surveyNumber}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                      <span>{t('common.village')}: {app.village}</span>
                      <span>&bull;</span>
                      <span>{app.submittedDate}</span>
                      <span>&bull;</span>
                      <span className="text-slate-700 font-medium">
                        Officer: <strong className="text-slate-900">{app.officerName || 'Taluka Officer'}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center">
                    <Link href={`/portal/applications/${app.id}`}>
                      <Button variant="outline" size="sm" className="text-xs gap-1">
                        <span>{t('common.track')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Land Parcels & Citizen Guide */}
        <div className="space-y-6">
          {/* Registered Parcels Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-900" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  {t('dashboard.myVerifiedParcels')}
                </h3>
              </div>
              <Link
                href="/portal/land-records"
                className="text-xs text-blue-900 font-semibold hover:underline"
              >
                {t('common.view')}
              </Link>
            </div>

            <div className="mt-3 space-y-3">
              {landRecords.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">
                  {t('dashboard.noParcelsFound', { defaultValue: 'No verified land parcels found' })}
                </p>
              ) : (
                landRecords.slice(0, 2).map((record) => (
                  <div
                    key={record.id}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        {t('common.surveyNumber')} {record.surveyNumber}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {formatStatus(record.recordStatus || record.status || 'VERIFIED', t)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {record.village}, {t('common.taluka')} {record.taluka}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                      <span>{t('common.landArea')}: {record.area}</span>
                      <span className="font-mono text-[10px] text-slate-400">
                        ULPIN: {record.ulpin ? record.ulpin.slice(0, 10) + '...' : record.id}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Officer Verification Transparency Box */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50/40 to-slate-50 rounded-xl border border-blue-200 p-5 text-xs text-slate-700 space-y-2.5 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-blue-950">
              <ShieldCheck className="w-4 h-4 text-blue-900" />
              <span>Officer Verification Assurance</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Every digital document requested by citizens is systematically inspected and cross-verified by assigned Circle Revenue Officers and Talathis against official cadastral geometry before issuing digitally signed records.
            </p>
            <div className="pt-2 flex items-center justify-between border-t border-blue-100">
              <Link
                href="/portal/applications"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-900 hover:text-blue-700"
              >
                Track Officer Process →
              </Link>
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="text-xs font-bold text-amber-700 hover:text-amber-800"
              >
                + Apply Document
              </button>
            </div>
          </div>
        </div>
      </div>

      <ApplyDigitalDocumentModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        landRecords={landRecords}
        onSuccess={() => {
          setApplications(citizenService.getApplications());
        }}
      />
    </PortalLayout>
  );
}
