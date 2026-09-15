'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Building2,
  ShieldCheck,
  Download,
  Info,
  Paperclip,
  Check,
  Eye,
  Layers,
} from 'lucide-react';
import { PortalLayout } from '../../../../components/portal/PortalLayout';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { citizenService } from '../../../../services/citizen.service';
import { CitizenApplication } from '../../../../types/citizen';
import { useTranslation } from 'react-i18next';

export default function ApplicationDetailClient() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || '';

  const [application, setApplication] = useState<CitizenApplication | null>(null);
  const [loading, setLoading] = useState(true);

  // Discrepancy response state
  const [clarificationText, setClarificationText] = useState('');
  const [supportingFile, setSupportingFile] = useState<string>('');
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [responseSuccess, setResponseSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      const cachedApp = citizenService.getApplicationById(id);
      if (cachedApp) {
        setApplication(cachedApp);
        setLoading(false);
      }
      // Query backend for live status
      citizenService
        .fetchApplicationById(id)
        .then((liveApp) => {
          if (liveApp) {
            setApplication(liveApp);
          }
        })
        .catch((err) => {
          console.warn('Live application detail fetch failed:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handleClarificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarificationText.trim() || !application) return;

    setIsSubmittingResponse(true);
    try {
      await citizenService.respondToDiscrepancy(
        application.id,
        clarificationText,
        supportingFile || 'tax_receipt_2025_26.pdf'
      );
      // Reload updated application
      const updated = citizenService.getApplicationById(application.id);
      if (updated) {
        setApplication(updated);
      }
      setIsSubmittingResponse(false);
      setResponseSuccess(true);
    } catch (err) {
      console.error('Clarification submit error:', err);
      setIsSubmittingResponse(false);
    }
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="p-12 text-center text-xs text-slate-500">
          {t('common.loading')}
        </div>
      </PortalLayout>
    );
  }

  if (!application) {
    return (
      <PortalLayout>
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">
            {t('applications.noApplications')}
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            The application reference <span className="font-mono">{id}</span> could not be located in your citizen account.
          </p>
          <Link href="/portal/applications">
            <Button variant="outline" size="sm">
              ← {t('applications.title')}
            </Button>
          </Link>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/portal/applications">
            <button
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Back to applications"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold font-mono text-slate-900">
                {application.id}
              </h1>
              <Badge status={application.status}>
                {application.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {application.documentType} &bull; Survey {application.surveyNumber}, {application.village} &bull; Submitted {application.submittedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {application.status === 'VERIFIED' && (
            <button
              onClick={() =>
                alert(`Downloading Digitally Signed ${application.documentType} (PDF)...`)
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('applications.downloadSigned')}</span>
            </button>
          )}
        </div>
      </div>

      {/* OFFICER VERIFICATION STATUS BANNER */}
      <div
        className={`rounded-xl border p-5 sm:p-6 shadow-xs ${
          application.verifiedByOfficer
            ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white border-emerald-800'
            : application.status === 'ACTION_REQUIRED'
            ? 'bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 text-white border-amber-800'
            : 'bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white border-blue-800'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {application.verifiedByOfficer ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Verified & Authenticated by Revenue Officer
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Under Officer Verification & Cadastral Scrutiny
                </span>
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                {application.verifiedByOfficer
                  ? 'Revenue Authority Sanction Complete'
                  : 'Assigned for Circle Officer & Talathi Verification'}
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-0.5 leading-relaxed">
                {application.verifiedByOfficer
                  ? `This record was thoroughly scrutinized, validated against Mahabhunaksha cadastral geometry, and digitally signed under the Maharashtra Land Revenue Code.`
                  : `Your land record document is currently under statutory review by the Circle Revenue Officer. Boundary coordinates, ownership history, and mutation logs are being reconciled.`}
              </p>
            </div>

            {/* Officer Details Pills */}
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300 pt-1">
              <span>
                Assigned Officer: <strong className="text-white">{application.officerName || 'Shri Suresh Deshmukh'}</strong>
              </span>
              <span>&bull;</span>
              <span>
                Designation: <span className="text-slate-200">{application.officerDesignation || 'Circle Revenue Officer (Haveli Division)'}</span>
              </span>
              {application.digitalSignatureId && (
                <>
                  <span>&bull;</span>
                  <span className="font-mono text-amber-300 font-semibold">
                    DSC #{application.digitalSignatureId}
                  </span>
                </>
              )}
            </div>
          </div>

          {application.verifiedByOfficer && (
            <div className="flex-shrink-0 self-start md:self-center">
              <Button
                variant="primary"
                size="md"
                onClick={() =>
                  alert(`Downloading Official Digitally Signed ${application.documentType} (PDF)...`)
                }
                className="gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold border-0 shadow-md cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>Download Signed Extract</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* DISCREPANCY RESOLUTION SCREEN (If Action Required) */}
      {application.status === 'ACTION_REQUIRED' && (
        <div className="bg-white rounded-xl border-2 border-amber-300 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 flex-shrink-0 mt-1">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-amber-950">
                  {t('applications.discrepancyBoxTitle')}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-200 text-amber-900 rounded">
                  {t('applications.pendingCitizenResponse')}
                </span>
              </div>
              <p className="text-xs text-amber-900/90 mt-1 leading-relaxed">
                {t('applications.discrepancyBoxDesc')}
              </p>
            </div>
          </div>

          {/* Discrepancy Breakdown Table */}
          {application.discrepancies && application.discrepancies.length > 0 && (
            <div className="border border-amber-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-amber-100/70 text-amber-900 font-bold border-b border-amber-200">
                  <tr>
                    <th className="p-3">{t('applications.field')}</th>
                    <th className="p-3">{t('applications.mahabhunakshaGis')}</th>
                    <th className="p-3">{t('applications.foundInDoc')}</th>
                    <th className="p-3">{t('common.status')}</th>
                    <th className="p-3">{t('applications.officerNote')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100 bg-amber-50/30">
                  {application.discrepancies.map((d, i) => (
                    <tr key={i}>
                      <td className="p-3 font-semibold text-slate-800">{d.field}</td>
                      <td className="p-3 text-slate-700 font-mono">{d.expected || 'N/A'}</td>
                      <td className="p-3 text-rose-700 font-mono font-bold">{d.found}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800">
                          {d.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{d.note || 'Review requested'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Officer Remarks */}
          {application.officerRemarks && (
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-700">{t('applications.officerRemarks')}:</span>
              <p className="text-slate-600 italic">
                "{application.officerRemarks}"
              </p>
            </div>
          )}

          {/* Clarification Submission Form */}
          <form onSubmit={handleClarificationSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {t('applications.yourExplanation')}
              </label>
              <textarea
                rows={3}
                required
                value={clarificationText}
                onChange={(e) => setClarificationText(e.target.value)}
                placeholder={t('applications.explanationPlaceholder')}
                className="w-full text-xs p-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-blue-900"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <Paperclip className="w-4 h-4 text-slate-400" />
                <label className="cursor-pointer text-blue-900 font-semibold hover:underline">
                  <span>{t('applications.attachSupporting')}</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setSupportingFile(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
                {supportingFile && (
                  <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {supportingFile}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmittingResponse}
                className="gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold"
              >
                <Send className="w-4 h-4" />
                <span>{t('applications.submitClarification')}</span>
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* SUCCESS CONFIRMATION IF CITIZEN JUST RESPONDED */}
      {responseSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <strong>{t('applications.clarificationSuccess')}</strong>
          </div>
        </div>
      )}

      {/* Main Grid: 5-Stage Timeline (Left 7 cols) & Extracted Summary (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Detailed 5-Stage Verification Timeline */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                {t('applications.lifecycleTitle')}
              </h2>
              <p className="text-xs text-slate-500">
                {t('applications.lifecycleSubtitle')}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('applications.auditLogged')}</span>
            </div>
          </div>

          {/* Timeline items */}
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            {application.timeline.map((event) => {
              const isDone = event.status === 'COMPLETED';
              const isCurrent = event.status === 'CURRENT';

              return (
                <div key={event.step} className="relative flex items-start gap-4">
                  {/* Step bullet */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-blue-900 text-white ring-4 ring-blue-100 animate-pulse'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                    }`}
                  >
                    {isDone ? <Check className="w-3.5 h-3.5" /> : event.step}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-slate-50/70 rounded-lg p-4 border border-slate-200/80 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3
                        className={`text-xs font-bold ${
                          isDone
                            ? 'text-slate-900'
                            : isCurrent
                            ? 'text-blue-950 font-extrabold'
                            : 'text-slate-500'
                        }`}
                      >
                        {event.title}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-400">
                        {event.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Cols: Extracted Revenue Record Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900">
                {t('applications.extractedDetails')}
              </h2>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                OCR {Math.round(application.ocrConfidence * 100)}%
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Document Type:</span>
                <span className="font-bold text-slate-900">{application.documentType}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Registered Owner:</span>
                <span className="font-bold text-slate-900">{application.ownerName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Survey / Gat No:</span>
                <span className="font-mono font-bold text-slate-900">
                  {application.surveyNumber}
                </span>
              </div>
              {application.khataNumber && (
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Khata No:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {application.khataNumber}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Land Area:</span>
                <span className="font-bold text-slate-900">{application.landArea}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Land Classification:</span>
                <span className="text-slate-800">{application.landType}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Location:</span>
                <span className="text-slate-800 text-right">
                  {application.village}, Taluka {application.taluka}, Dist {application.district}
                </span>
              </div>
              {application.aadharNumber && (
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Aadhaar e-KYC:</span>
                  <span className="font-mono font-bold text-slate-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {application.aadharNumber}
                  </span>
                </div>
              )}
              {application.aadharFileName && (
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Aadhaar Document:</span>
                  <span className="font-mono text-slate-700 text-right truncate max-w-[180px]">
                    {application.aadharFileName}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Original File:</span>
                <span className="font-mono text-slate-700 text-right truncate max-w-[180px]">
                  {application.fileName}
                </span>
              </div>
            </div>
          </div>

          {/* Official Officer Verification Seal Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-blue-900" />
              <span>Officer Verification & DSC Seal</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-center space-y-2">
              <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-blue-950 text-amber-400 font-serif font-bold text-sm border-2 border-amber-400/60 shadow-xs">
                MAHA
              </div>
              <div className="text-xs font-bold text-slate-900">
                Government of Maharashtra
              </div>
              <div className="text-[11px] text-slate-500">
                Revenue & Forest Department &bull; Haveli Division
              </div>
              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 space-y-1.5 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Officer Verification:</span>
                  <span className={`font-bold ${application.verifiedByOfficer ? 'text-emerald-700' : 'text-blue-900'}`}>
                    {application.verifiedByOfficer ? 'Verified & Approved' : 'Under Officer Scrutiny'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Inspecting Officer:</span>
                  <span className="font-semibold text-slate-800">{application.officerName || 'Circle Officer'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Designation:</span>
                  <span className="text-slate-700">{application.officerDesignation || 'Mandal Adhikari'}</span>
                </div>
                <div className="flex justify-between font-mono text-[10px]">
                  <span className="text-slate-400">Digital Seal:</span>
                  <span className="text-slate-800 font-bold">{application.digitalSignatureId || 'PENDING-APPROVAL'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cadastral Authority Contact Card */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Building2 className="w-4 h-4" />
              <span>{t('applications.jurisdictionTitle')}</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {t('applications.jurisdictionDesc')}
            </p>
            <div className="pt-1 text-[11px] text-slate-400 border-t border-slate-800">
              Inquiry Desk: <span className="text-slate-200 font-mono">020-24458911</span> (Ext 14)
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
