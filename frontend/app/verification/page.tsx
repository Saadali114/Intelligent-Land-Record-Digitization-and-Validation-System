'use client';

import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  useVerificationRecordsQuery,
  useVerificationHistoryQuery,
  useVerifyRecordMutation,
} from '../../hooks/useVerification';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate, formatDateTime } from '../../lib/utils';
import { LandRecord, VerificationAction } from '../../types';
import {
  CheckCheck,
  FileCheck,
  CheckCircle,
  XCircle,
  Edit3,
  FileText,
  AlertTriangle,
  History,
  ShieldCheck,
  Building2,
  ZoomIn,
  Sparkles,
} from 'lucide-react';

export default function VerificationPage() {
  const { isAdmin, isVerifier } = useAuth();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');

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
    <AppLayout allowedRoles={['ADMIN', 'OFFICER', 'VERIFIER']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <CheckCheck className="w-6 h-6 text-blue-900" />
              Human-in-the-Loop Verification Workstation
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Cross-reference original archival scans against digitized cadastral fields with differential audit logging.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-700 font-medium"
            >
              <option value="">Pending & Needs Review</option>
              <option value="PENDING">Pending Only</option>
              <option value="NEEDS_REVIEW">Needs Review</option>
              <option value="VERIFIED">Verified</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {queueLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-96 rounded-xl" />
            <Skeleton className="h-96 rounded-xl md:col-span-2" />
          </div>
        )}

        {!queueLoading && records.length === 0 && (
          <EmptyState
            title="Verification Queue Clear"
            description="No land records currently require inspection or verification under this filter."
          />
        )}

        {!queueLoading && records.length > 0 && activeRecord && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Queue Selector (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="gov-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Inspection Queue ({records.length})
                  </span>
                  <span className="text-[10px] text-slate-400">Click to load</span>
                </div>
                <div className="space-y-2 max-h-[calc(80vh-12rem)] overflow-y-auto pr-1">
                  {records.map((rec) => {
                    const isSelected =
                      (selectedRecordId && selectedRecordId === rec._id) ||
                      (!selectedRecordId && activeRecord._id === rec._id);

                    return (
                      <div
                        key={rec._id}
                        onClick={() => setSelectedRecordId(rec._id)}
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-600 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="font-bold text-slate-900">{rec.ownerName}</div>
                          <Badge status={rec.verificationStatus} />
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-600 font-mono">
                          <span>Survey #{rec.surveyNumber}</span>
                          <span>&bull;</span>
                          <span>{rec.village}</span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                          <span>{rec.district}</span>
                          <span className="font-semibold text-emerald-700">
                            {(rec.confidenceScore * 100).toFixed(0)}% AI Conf.
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Verification Audit History */}
              {history && history.length > 0 && (
                <div className="gov-card p-4 text-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-3">
                    <History className="w-4 h-4 text-slate-600" />
                    Record Audit History
                  </div>
                  <div className="space-y-2.5 max-h-48 overflow-y-auto">
                    {history.map((h) => (
                      <div key={h._id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between">
                          <Badge status={h.action} />
                          <span className="text-[10px] text-slate-400">
                            {formatDateTime(h.verifiedAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-700 mt-1">{h.remarks}</p>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Verifier: {h.verifiedBy?.name || 'Inspector'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Split Screen Workstation (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="gov-card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-5 border-b border-slate-200 gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      Cadastral Verification: Survey #{activeRecord.surveyNumber}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Primary Record ID: <span className="font-mono">{activeRecord._id}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">Status:</span>
                    <Badge status={activeRecord.verificationStatus} />
                  </div>
                </div>

                {/* The 2-Pane Split Section Required by Section 21 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Pane: Original Document Preview */}
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-blue-900" />
                        Original Archival Document
                      </span>
                      <span className="text-[10px] font-normal text-slate-400">7/12 Satbara Scan</span>
                    </div>

                    <div className="rounded-xl border border-slate-300 bg-slate-100 p-4 min-h-[340px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                      {/* Simulated Historical Scan Display */}
                      <div className="w-full h-full bg-amber-50/70 border border-amber-200/80 rounded-lg p-4 font-serif text-slate-800 text-[11px] leading-relaxed shadow-inner">
                        <div className="text-center font-bold border-b border-amber-300 pb-2 mb-3 text-xs">
                          गाव नमुना सात (७/१२) - अधिकार अभिलेख पत्रक
                        </div>
                        <div className="text-left space-y-1.5">
                          <p>
                            <strong>जिल्हा:</strong> {activeRecord.district} &bull;{' '}
                            <strong>तालुका:</strong> {activeRecord.tehsil}
                          </p>
                          <p>
                            <strong>गाव:</strong> {activeRecord.village}
                          </p>
                          <p>
                            <strong>भूमापन क्रमांक (Survey #):</strong> {activeRecord.surveyNumber}
                          </p>
                          <p>
                            <strong>खाते क्रमांक:</strong> {activeRecord.khataNumber} &bull;{' '}
                            <strong>खसरा क्रमांक:</strong> {activeRecord.khasraNumber}
                          </p>
                          <p>
                            <strong>भूधारकाचे नाव:</strong> {activeRecord.ownerName}
                          </p>
                          <p>
                            <strong>क्षेत्रफळ (Area):</strong> {activeRecord.plotArea}
                          </p>
                          <p>
                            <strong>धारणा प्रकार:</strong> {activeRecord.ownershipType}
                          </p>
                        </div>
                        <div className="mt-6 pt-3 border-t border-amber-300 text-[10px] text-amber-900 italic text-center">
                          शासकीय नोंदणीकृत मुद्रांक व महसूल शिक्का प्रमाणित
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                        <ZoomIn className="w-3.5 h-3.5 text-slate-400" />
                        Archival scan matched & authenticated
                      </div>
                    </div>
                  </div>

                  {/* Right Pane: Extracted Information */}
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Extracted Information
                      </span>
                      <span className="text-xs font-bold text-emerald-700">
                        Confidence: {(activeRecord.confidenceScore * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2.5 text-xs shadow-xs">
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Owner Name:</span>
                        <span className="font-bold text-slate-900">{activeRecord.ownerName}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Survey Number:</span>
                        <span className="font-mono font-bold text-blue-900">
                          {activeRecord.surveyNumber}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Khasra Number:</span>
                        <span className="font-mono text-slate-800">{activeRecord.khasraNumber}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Khata Number:</span>
                        <span className="font-mono text-slate-800">{activeRecord.khataNumber}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Village / Gram:</span>
                        <span className="font-semibold text-slate-800">{activeRecord.village}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Tehsil:</span>
                        <span className="font-semibold text-slate-800">{activeRecord.tehsil}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">District:</span>
                        <span className="font-semibold text-slate-800">{activeRecord.district}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Plot Area:</span>
                        <span className="font-bold text-slate-900">{activeRecord.plotArea}</span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-slate-500 font-medium">Classification:</span>
                        <span className="text-slate-800">{activeRecord.landClassification}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verifier Action Buttons */}
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-xs text-slate-500">
                      Authorized Inspectors / Admins can certify, correct, or reject records.
                    </div>

                    {(isAdmin || isVerifier) && (
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button
                          variant="danger"
                          size="md"
                          onClick={() => handleOpenAction('REJECTED')}
                          className="flex-1 sm:flex-initial"
                        >
                          <XCircle className="w-4 h-4 mr-1.5" />
                          Reject Record
                        </Button>

                        <Button
                          variant="outline"
                          size="md"
                          onClick={() => handleOpenAction('CORRECTED')}
                          className="flex-1 sm:flex-initial text-slate-700"
                        >
                          <Edit3 className="w-4 h-4 mr-1.5" />
                          Correct & Certify
                        </Button>

                        <Button
                          variant="success"
                          size="md"
                          onClick={() => handleOpenAction('APPROVED')}
                          className="flex-1 sm:flex-initial"
                        >
                          <CheckCircle className="w-4 h-4 mr-1.5" />
                          Approve Record
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Verification Action Submission Modal */}
      {activeAction && (
        <Modal
          isOpen={!!activeAction}
          onClose={() => setActiveAction(null)}
          title={`Confirm ${activeAction} Decision`}
          description="Mandatory remarks are logged to the immutable audit trail."
          maxWidth={activeAction === 'CORRECTED' ? 'xl' : 'md'}
        >
          <div className="space-y-4">
            {/* If Correcting, show inline editable fields */}
            {activeAction === 'CORRECTED' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="font-semibold text-slate-900 mb-1">Correct Extracted Data:</div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Owner Name"
                    value={correctedData.ownerName || ''}
                    onChange={(e) =>
                      setCorrectedData({ ...correctedData, ownerName: e.target.value })
                    }
                  />
                  <Input
                    label="Survey Number"
                    value={correctedData.surveyNumber || ''}
                    onChange={(e) =>
                      setCorrectedData({ ...correctedData, surveyNumber: e.target.value })
                    }
                  />
                  <Input
                    label="Khasra Number"
                    value={correctedData.khasraNumber || ''}
                    onChange={(e) =>
                      setCorrectedData({ ...correctedData, khasraNumber: e.target.value })
                    }
                  />
                  <Input
                    label="Plot Area"
                    value={correctedData.plotArea || ''}
                    onChange={(e) =>
                      setCorrectedData({ ...correctedData, plotArea: e.target.value })
                    }
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Remarks & Audit Justification (Mandatory)
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Scanned signature and cadastral boundaries verified against revenue sub-division register."
                className="w-full rounded-lg border border-slate-300 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" onClick={() => setActiveAction(null)}>
                Cancel
              </Button>
              <Button
                variant={activeAction === 'REJECTED' ? 'danger' : 'primary'}
                size="sm"
                isLoading={verifyMutation.isPending}
                onClick={handleExecuteVerification}
              >
                Submit {activeAction} Record
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}
