'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { PortalLayout } from '../../../components/portal/PortalLayout';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Clock,
  HelpCircle,
  XCircle,
  ArrowRight,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Search,
} from 'lucide-react';
import {
  documentVerificationService,
  DocumentVerificationItem,
} from '../../../services/documentVerification.service';

export default function CitizenVerificationsListPage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<DocumentVerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const res = await documentVerificationService.getCitizenApplications();
      setItems(res.items);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const term = searchQuery.toLowerCase();
    const id = ((item as any).trackingNumber || item.applicationId || (item as any).id || '').toLowerCase();
    const docType = (item.document?.documentType || '').toLowerCase();
    const survey = (item.officialRecordMatch?.matchedSurveyNumber || '').toLowerCase();
    return id.includes(term) || docType.includes(term) || survey.includes(term);
  });

  const pendingClarifications = items.filter((i) => i.status === 'ACTION_REQUIRED');

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Banner Notice */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {t('citizenVerifications.selfServiceBadge')}
              </span>
              <span className="text-xs text-slate-400">{t('citizenVerifications.mlrcSection')}</span>
            </div>
            <h1 className="text-2xl font-bold text-white">{t('citizenVerifications.pageTitle')}</h1>
            <p className="text-sm text-slate-400 mt-1">
              {t('citizenVerifications.pageDesc')}
            </p>
          </div>
          <Link
            href="/citizen/documents/upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-sky-600/20 whitespace-nowrap"
          >
            <UploadCloud className="w-4 h-4" />
            {t('citizenVerifications.uploadNewDoc')}
          </Link>
        </div>

        {/* Action Required Alert Banner */}
        {pendingClarifications.length > 0 && (
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-300">
                {t('citizenVerifications.actionRequiredTitle')}
              </h3>
              <p className="text-xs text-amber-200/80 mt-0.5">
                {t('citizenVerifications.actionRequiredDesc', { count: pendingClarifications.length })}
              </p>
            </div>
            <Link
              href={`/citizen/verifications/${
                (pendingClarifications[0] as any).trackingNumber ||
                pendingClarifications[0].applicationId ||
                (pendingClarifications[0] as any).id
              }`}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors whitespace-nowrap"
            >
              {t('citizenVerifications.respondNow')}
            </Link>
          </div>
        )}

        {/* Search Toolbar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={t('citizenVerifications.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <div className="inline-block animate-spin w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full mb-2"></div>
              <p className="text-sm">{t('citizenVerifications.loadingApplications')}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-medium text-slate-300">{t('citizenVerifications.noApplicationsFound')}</p>
              <p className="text-xs text-slate-500 mt-1">{t('citizenVerifications.noApplicationsDesc')}</p>
              <Link
                href="/citizen/documents/upload"
                className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
              >
                {t('citizenVerifications.uploadNow')}
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">{t('citizenVerifications.colTrackingNumber')}</th>
                    <th className="px-5 py-3">{t('citizenVerifications.colDocumentType')}</th>
                    <th className="px-5 py-3">{t('citizenVerifications.colSurveyVillage')}</th>
                    <th className="px-5 py-3">{t('citizenVerifications.colAiIntegrity')}</th>
                    <th className="px-5 py-3">{t('citizenVerifications.colOfficerStatus')}</th>
                    <th className="px-5 py-3 text-right">{t('citizenVerifications.colDetails')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredItems.map((item) => {
                    const appId = (item as any).trackingNumber || item.applicationId || (item as any).id;
                    const isApproved =
                      item.status === 'VERIFIED' || item.officerDecision?.status === 'APPROVED';
                    const isRejected =
                      item.status === 'REJECTED' || item.officerDecision?.status === 'REJECTED';
                    const isClarification = item.status === 'ACTION_REQUIRED';

                    return (
                      <tr key={appId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs font-semibold text-sky-400">
                          {appId}
                          <div className="text-[11px] font-sans text-slate-500 font-normal">
                            {new Date(item.createdAt || Date.now()).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                        </td>

                        <td className="px-5 py-4 font-medium text-white">
                          {item.document?.documentType || '7/12 Extract'}
                          <div className="text-xs text-slate-400 font-normal">
                            {item.document?.fileName}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          <div>Survey {item.officialRecordMatch?.matchedSurveyNumber || '145/2A'}</div>
                          <div className="text-xs text-slate-400">
                            {item.officialRecordMatch?.matchedVillage || 'Khadakwasla'}, {item.officialRecordMatch?.matchedTaluka || 'Haveli'}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-medium ${
                              item.riskAssessment?.level === 'LOW'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : item.riskAssessment?.level === 'MEDIUM'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-red-500/10 text-red-400 border border-red-500/30'
                            }`}
                          >
                            <ShieldCheck className="w-3 h-3" />
                            {item.riskAssessment?.level || 'LOW'} {t('citizenVerifications.riskLabel')} ({item.riskAssessment?.score ?? 15}/100)
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                              isApproved
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : isRejected
                                ? 'bg-red-500/20 text-red-300'
                                : isClarification
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {isApproved ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : isRejected ? (
                              <XCircle className="w-3.5 h-3.5" />
                            ) : isClarification ? (
                              <HelpCircle className="w-3.5 h-3.5" />
                            ) : (
                              <Clock className="w-3.5 h-3.5" />
                            )}
                            {isApproved
                              ? t('citizenVerifications.statusStatutoryVerified')
                              : isRejected
                              ? t('citizenVerifications.statusRejected')
                              : isClarification
                              ? t('citizenVerifications.statusClarificationNeeded')
                              : t('citizenVerifications.statusUnderReview')}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/citizen/verifications/${appId}`}
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                              isClarification
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                            }`}
                          >
                            {isClarification ? t('citizenVerifications.respondBtn') : t('citizenVerifications.viewStatusBtn')}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
