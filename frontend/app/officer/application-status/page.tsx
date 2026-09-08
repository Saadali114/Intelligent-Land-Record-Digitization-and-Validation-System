'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Shield,
  Briefcase,
  MapPin,
  ArrowRight,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { LanguageSwitcher } from '../../../components/ui/LanguageSwitcher';
import { authService } from '../../../services/auth.service';

export default function OfficerApplicationStatusPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const app = await authService.getOfficerSelfStatus();
      setApplication(app);
    } catch (err: any) {
      // Fallback: check cached user from localStorage
      const cached = localStorage.getItem('user');
      if (cached) {
        try {
          const u = JSON.parse(cached);
          setApplication({
            name: u.name,
            email: u.email,
            department: u.department || 'Revenue Department',
            district: u.district || 'Maharashtra',
            designation: 'Revenue Officer',
            employeeId: 'REV-APPLICANT',
            status: u.accountStatus || 'PENDING_APPROVAL',
            createdAt: u.createdAt || new Date().toISOString(),
          });
        } catch {
          setError(
            err.message ||
              t('registration.unableToLoadStatus', { defaultValue: 'Unable to load application status.' })
          );
        }
      } else {
        setError(
          err.message ||
            t('registration.loginToCheckStatus', { defaultValue: 'Please log in to check your application status.' })
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            ✓ {t('registration.statusApprovedActive', { defaultValue: 'APPROVED • ACTIVE OFFICER' })}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            ✕ {t('registration.statusRejectedBadge', { defaultValue: 'APPLICATION REJECTED' })}
          </span>
        );
      case 'ACTION_REQUIRED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            ⚠ {t('registration.statusClarificationRequested', { defaultValue: 'CLARIFICATION REQUESTED' })}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200">
            ● {t('registration.statusPendingApproval', { defaultValue: 'PENDING ADMINISTRATIVE APPROVAL' })}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Gov Tricolor Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-white to-emerald-600 border-b border-slate-200" />

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-800 flex items-center justify-center text-white font-bold shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">
                ILRDVS <span className="text-amber-800 font-semibold">{t('registration.officerPortal', { defaultValue: 'Revenue Officer Portal' })}</span>
              </div>
              <div className="text-xs text-slate-500">{t('registration.applicationTracker', { defaultValue: 'Access Application Status Tracker' })}</div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher variant="header" />
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-slate-600 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('auth.logout', { defaultValue: 'Sign Out' })}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-amber-950 p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1">
                  {t('registration.applicationStatusHeading', { defaultValue: 'Officer Access Dossier' })}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  {application?.name || t('registration.defaultOfficerApplicantName', { defaultValue: 'Revenue Officer Applicant' })}
                </h1>
                <p className="text-xs text-slate-300 mt-1">
                  {application?.designation || t('registration.designations.revenueOfficer', { defaultValue: 'Revenue Officer' })} • {application?.department || t('registration.defaultDepartment', { defaultValue: 'Revenue & Forest Department' })}
                </p>
              </div>

              <div className="shrink-0">
                {getStatusBadge(application?.status || 'PENDING_APPROVAL')}
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5">
              {t('registration.verificationLifecycle', { defaultValue: 'Application Verification Stages' })}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Stage 1 */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>1. {t('registration.stageRegistration', { defaultValue: 'Submitted' })}</span>
                </div>
                <div className="text-[11px] text-emerald-800">
                  {t('registration.stageRegistrationDesc', { defaultValue: 'Details recorded' })}
                </div>
              </div>

              {/* Stage 2 */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>2. {t('registration.stageEmail', { defaultValue: 'Email Verified' })}</span>
                </div>
                <div className="text-[11px] text-emerald-800">
                  {t('registration.stageEmailDesc', { defaultValue: '6-digit OTP confirmed' })}
                </div>
              </div>

              {/* Stage 3 */}
              <div
                className={`p-3.5 rounded-xl border ${
                  application?.status === 'APPROVED'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : application?.status === 'REJECTED'
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : application?.status === 'ACTION_REQUIRED'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-blue-50 border-blue-200 text-blue-900'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold mb-1">
                  {application?.status === 'APPROVED' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : application?.status === 'REJECTED' ? (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-blue-600" />
                  )}
                  <span>3. {t('registration.stageReview', { defaultValue: 'Admin Review' })}</span>
                </div>
                <div className="text-[11px]">
                  {application?.status === 'APPROVED'
                    ? t('registration.stageApprovedByAdmin', { defaultValue: 'Approved by Admin' })
                    : application?.status === 'REJECTED'
                    ? t('registration.stageRejectedByAdmin', { defaultValue: 'Rejected by Admin' })
                    : application?.status === 'ACTION_REQUIRED'
                    ? t('registration.stageActionRequired', { defaultValue: 'Action Required' })
                    : t('registration.stageReviewInProgress', { defaultValue: 'Review in progress' })}
                </div>
              </div>

              {/* Stage 4 */}
              <div
                className={`p-3.5 rounded-xl border ${
                  application?.status === 'APPROVED'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>4. {t('registration.stageActivation', { defaultValue: 'Activation' })}</span>
                </div>
                <div className="text-[11px]">
                  {application?.status === 'APPROVED'
                    ? t('registration.stageActiveAccess', { defaultValue: 'Active Officer Access' })
                    : t('registration.stageAwaitingApproval', { defaultValue: 'Awaiting approval' })}
                </div>
              </div>
            </div>
          </div>

          {/* Details & Next Action */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* If clarification requested */}
            {application?.status === 'ACTION_REQUIRED' && application?.clarificationMessage && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-amber-950">
                  <AlertCircle className="w-4 h-4 text-amber-700" />
                  <span>{t('registration.adminClarificationTitle', { defaultValue: 'Administrator Clarification Request:' })}</span>
                </div>
                <p className="italic bg-white/70 p-3 rounded-lg border border-amber-200">
                  "{application.clarificationMessage}"
                </p>
                <p className="text-[11px] text-amber-800">
                  {t('registration.clarificationContactHelp', {
                    defaultValue: 'Please contact the district nodal officer or email support@landrecord.gov.in with your clarification.',
                  })}
                </p>
              </div>
            )}

            {/* If Rejected */}
            {application?.status === 'REJECTED' && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-rose-950">
                  <AlertCircle className="w-4 h-4 text-rose-700" />
                  <span>{t('registration.rejectionTitle', { defaultValue: 'Application Rejection Notice:' })}</span>
                </div>
                <p className="bg-white/70 p-3 rounded-lg border border-rose-200">
                  {application.rejectionReason ||
                    t('registration.defaultRejectionReason', {
                      defaultValue: 'Officer credentials could not be verified by the administration.',
                    })}
                </p>
              </div>
            )}

            {/* If Approved */}
            {application?.status === 'APPROVED' && (
              <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-sm text-emerald-950">
                    {t('registration.officerAccountActivated', { defaultValue: 'Your Officer Account is Activated!' })}
                  </div>
                  <p className="text-emerald-800 text-xs mt-0.5">
                    {t('registration.officerAccountActivatedDesc', {
                      defaultValue: 'You have authorized access to the dual-pane 4-pillar verification workspace.',
                    })}
                  </p>
                </div>
                <Link
                  href="/verification"
                  className="py-2.5 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
                >
                  <span>{t('registration.goToVerificationWorkspace', { defaultValue: 'Go to Verification Workspace' })}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Official Application Summary */}
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                {t('registration.submittedDetailsTitle', { defaultValue: 'Submitted Application Details' })}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">{t('registration.employeeIdLabel', { defaultValue: 'Employee ID' })}</span>
                  <span className="font-mono font-semibold text-slate-800">{application?.employeeId || 'N/A'}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">{t('registration.officialEmailLabel', { defaultValue: 'Official Email' })}</span>
                  <span className="font-mono font-semibold text-slate-800">{application?.email || 'N/A'}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">{t('registration.departmentAndOffice', { defaultValue: 'Department & Office' })}</span>
                  <span className="font-medium text-slate-800">
                    {application?.department} • {application?.office || t('registration.districtOfficeFallback', { defaultValue: 'District Office' })}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block text-[11px]">{t('registration.jurisdiction', { defaultValue: 'Jurisdiction' })}</span>
                  <span className="font-medium text-slate-800">
                    {t('registration.districtLabel', { defaultValue: 'District:' })} {application?.district} {application?.taluka ? `| ${t('registration.talukaLabel', { defaultValue: 'Taluka:' })} ${application.taluka}` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="text-center pt-2">
              <button
                onClick={loadStatus}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-xs text-blue-900 hover:underline font-semibold cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{t('registration.refreshStatus', { defaultValue: 'Refresh Status' })}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-4 py-3 text-center text-xs text-slate-500">
        <div>
          {t('common.portalGovNotice', {
            defaultValue: 'ILRDVS — Government of Maharashtra Revenue & Forest Department Land Record Governance Portal',
          })}
        </div>
      </footer>
    </div>
  );
}
