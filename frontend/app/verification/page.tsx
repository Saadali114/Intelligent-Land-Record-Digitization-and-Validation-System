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
} from '../../components/verification';
import { CheckCheck } from 'lucide-react';

export default function VerificationPage() {
  const { t } = useTranslation();
  const { isAdmin, isVerifier } = useAuth();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [scanZoom, setScanZoom] = useState(1);
  const [showScanPreview, setShowScanPreview] = useState(true);

  // Review Action Dialog State
  const [activeAction, setActiveAction] = useState<VerificationAction | null>(null);
  const [remarks, setRemarks] = useState('');
  const [correctedData, setCorrectedData] = useState<Record<string, string>>({});

  const { data: queueData, isLoading: queueLoading } = useVerificationRecordsQuery({
    status: statusFilter || undefined,
    limit: 20,
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

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <CheckCheck className="w-6 h-6 text-blue-900" />
              {t('officerVerification.title', { defaultValue: 'Cadastral Verification Workstation' })}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {t('officerVerification.subtitle', { defaultValue: 'Cross-validate OCR extracted records against archival physical scans.' })}
            </p>
          </div>
        </div>

        {/* Main Workstation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Review Queue Sidebar */}
          <VerificationQueueList
            records={records}
            isLoading={queueLoading}
            selectedRecordId={selectedRecordId}
            onSelectRecord={setSelectedRecordId}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          {/* Active Record Review Panel */}
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
                  canVerify={isAdmin || isVerifier}
                />

                <VerificationAuditHistory history={history} />
              </>
            ) : (
              <div className="gov-card p-12 text-center text-slate-400 text-xs">
                {t('officerVerification.noRecords', { defaultValue: 'No active record selected for verification.' })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verification Action Dialog */}
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
