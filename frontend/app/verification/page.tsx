'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  useVerificationRecordsQuery,
  useVerificationHistoryQuery,
  useVerifyRecordMutation,
} from '../../hooks/useVerification';
import { useAuth } from '../../context/AuthContext';
import { VerificationAction } from '../../types';
import {
  VerificationQueueList,
  VerificationScanViewer,
  VerificationDetailsPanel,
  VerificationActionModal,
  VerificationAuditHistory,
  UserDocumentVerificationWorkstation,
} from '../../components/verification';
import {
  CheckCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Layers,
  UploadCloud,
} from 'lucide-react';

export default function VerificationPage() {
  const { t } = useTranslation();
  const { isAdmin, isVerifier, isOfficer } = useAuth();

  // Mode switcher: 'user-docs' (Citizen Uploaded Documents) vs 'land-records' (Cadastral Records)
  const [activeQueueType, setActiveQueueType] = useState<'user-docs' | 'land-records'>('user-docs');

  // Land Records Queue State
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [scanZoom, setScanZoom] = useState(1);
  const [showScanPreview, setShowScanPreview] = useState(true);

  // Review Action Dialog State for Land Records
  const [activeAction, setActiveAction] = useState<VerificationAction | null>(null);
  const [remarks, setRemarks] = useState('');
  const [correctedData, setCorrectedData] = useState<Record<string, string>>({});

  const { data: queueData, isLoading: queueLoading } = useVerificationRecordsQuery({
    status: statusFilter || undefined,
    limit: 50,
  });

  const records = queueData?.records || [];
  const activeRecord =
    records.find((r) => r._id === selectedRecordId) || records[0] || null;

  const { data: history } = useVerificationHistoryQuery(activeRecord?._id || '');
  const verifyMutation = useVerifyRecordMutation();

  const handleOpenAction = (action: VerificationAction) => {
    setActiveAction(action);
    setRemarks('');
    if (action === 'CORRECTED' && activeRecord) {
      setCorrectedData({
        ownerName: activeRecord.ownerName,
        surveyNumber: activeRecord.surveyNumber,
        khasraNumber: activeRecord.khasraNumber,
        khataNumber: activeRecord.khataNumber,
        plotArea: activeRecord.plotArea,
        village: activeRecord.village,
        tehsil: activeRecord.tehsil,
        district: activeRecord.district,
      });
    }
  };

  const handleExecuteVerification = async () => {
    if (!activeAction || !activeRecord) return;
    if (!remarks.trim() || remarks.trim().length < 3) {
      alert('Mandatory inspector remarks must be at least 3 characters.');
      return;
    }

    try {
      await verifyMutation.mutateAsync({
        recordId: activeRecord._id,
        data: {
          action: activeAction,
          remarks: remarks.trim(),
          correctedData: activeAction === 'CORRECTED' ? correctedData : undefined,
        },
      });
      setActiveAction(null);
      setRemarks('');
      alert(`Record successfully marked as ${activeAction}!`);
    } catch (err: any) {
      alert(err.message || 'Verification submission failed');
    }
  };

  // Quick statistics calculation for Land Records
  const totalCount = records.length;
  const pendingCount = records.filter((r) => r.verificationStatus === 'PENDING').length;
  const needsReviewCount = records.filter((r) => r.verificationStatus === 'NEEDS_REVIEW').length;
  const verifiedCount = records.filter((r) => r.verificationStatus === 'VERIFIED').length;
  const rejectedCount = records.filter((r) => r.verificationStatus === 'REJECTED').length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Simple & Clean Header with Queue Mode Switcher */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-900 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                {t('officerVerification.statutoryDocumentTitle', {
                  defaultValue: 'Statutory Document & Title Verification',
                })}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <CheckCheck className="w-6 h-6 text-blue-900" />
              {activeQueueType === 'user-docs'
                ? t('officerVerification.userUploadedDocVerif', {
                    defaultValue: 'User Uploaded Document Verification',
                  })
                : t('officerVerification.cadastralRecordsQueue', {
                    defaultValue: 'Cadastral Records Verification Queue',
                  })}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {activeQueueType === 'user-docs'
                ? t('officerVerification.userDocsSubtitle', {
                    defaultValue:
                      'Inspect citizen uploaded land documents (7/12, 8A, Ferfar, Sale Deed), review AI extraction, and record official verifications.',
                  })
                : t('officerVerification.cadastralSubtitle', {
                    defaultValue:
                      'Review cadastral land records, cross-check against physical scans, and record official verification decisions.',
                  })}
            </p>
          </div>

          {/* Queue Type Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveQueueType('user-docs')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeQueueType === 'user-docs'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>
                {t('officerVerification.citizenUploadedDocsTab', {
                  defaultValue: 'Citizen Uploaded Docs',
                })}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveQueueType('land-records')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeQueueType === 'land-records'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>
                {t('officerVerification.cadastralRecordsTab', {
                  defaultValue: 'Cadastral Records',
                })}
              </span>
            </button>
          </div>
        </div>

        {/* Dynamic Queue View */}
        {activeQueueType === 'user-docs' ? (
          /* User Uploaded Documents Workstation */
          <UserDocumentVerificationWorkstation canVerify={isAdmin || isVerifier || isOfficer} />
        ) : (
          /* Cadastral Land Records Workstation */
          <div className="space-y-6">
            {/* Quick Metrics Bar for Land Records */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setStatusFilter('')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  statusFilter === ''
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t('officerDocuments.allStatuses', { defaultValue: 'All' })} ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('PENDING')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  statusFilter === 'PENDING'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                    : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                {t('status.pending', { defaultValue: 'Pending' })} ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('NEEDS_REVIEW')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  statusFilter === 'NEEDS_REVIEW'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : 'bg-white text-purple-700 border-purple-200 hover:bg-purple-50'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                {t('status.needsReview', { defaultValue: 'Needs Review' })} ({needsReviewCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('VERIFIED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  statusFilter === 'VERIFIED'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t('status.verified', { defaultValue: 'Verified' })} ({verifiedCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('REJECTED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                  statusFilter === 'REJECTED'
                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                    : 'bg-white text-red-700 border-red-200 hover:bg-red-50'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                {t('status.rejected', { defaultValue: 'Rejected' })} ({rejectedCount})
              </button>
            </div>

            {/* Workstation 2-column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (4 cols) */}
              <VerificationQueueList
                records={records}
                isLoading={queueLoading}
                selectedRecordId={selectedRecordId}
                onSelectRecord={setSelectedRecordId}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />

              {/* Right Column (8 cols) */}
              <div className="lg:col-span-8 flex flex-col space-y-4">
                {activeRecord ? (
                  <>
                    <VerificationScanViewer
                      sourceDocument={activeRecord.sourceDocument}
                      scanZoom={scanZoom}
                      onZoomChange={setScanZoom}
                      showScanPreview={showScanPreview}
                      onToggleScanPreview={() => setShowScanPreview(!showScanPreview)}
                    />

                    <VerificationDetailsPanel
                      record={activeRecord}
                      onOpenAction={handleOpenAction}
                      canVerify={isAdmin || isVerifier || isOfficer}
                    />

                    <VerificationAuditHistory history={history} />
                  </>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl p-16 text-center text-slate-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-600">
                      {t('officerVerification.noRecords', { defaultValue: 'No active record selected for verification.' })}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {t('officerVerification.selectAppFromQueue', {
                        defaultValue: 'Select an application from the review queue on the left to begin inspection.',
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Verification Action Dialog for Land Records */}
      <VerificationActionModal
        action={activeAction}
        onClose={() => setActiveAction(null)}
        onExecute={handleExecuteVerification}
        isSubmitting={verifyMutation.isPending}
        remarks={remarks}
        onRemarksChange={setRemarks}
        correctedData={correctedData}
        onCorrectedDataChange={setCorrectedData}
      />
    </AppLayout>
  );
}
