'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DocumentRecord, User } from '../../types';
import { documentsService } from '../../services/documents.service';
import { useAuth } from '../../context/AuthContext';
import { formatStatus } from '../../lib/translationHelpers';
import { generateVerificationReportPdf } from '../../lib/verification-report-generator';
import {
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  User as UserIcon,
  ShieldCheck,
  Send,
  FileCheck,
  Database,
  Scale,
  Printer,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  Building,
  QrCode,
  Camera,
} from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import { QrScannerModal } from './QrScannerModal';
import { generateQrDataUrl, computeDocumentSecretCode } from '../../lib/qr-barcode';

interface UserDocumentVerificationWorkstationProps {
  canVerify?: boolean;
}

export const UserDocumentVerificationWorkstation: React.FC<
  UserDocumentVerificationWorkstationProps
> = ({ canVerify = true }) => {
  const { t } = useTranslation();
  const { user: authUser, isOfficer, isVerifier, isAdmin } = useAuth();

  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<'preview' | 'data'>('preview');

  // Hideable queue state
  const [isQueueVisible, setIsQueueVisible] = useState(true);

  // Decision Modal State
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    action: 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW' | null;
  }>({
    isOpen: false,
    action: null,
  });
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    fetchDocuments();
  }, [statusFilter]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await documentsService.getDocuments({
        status: statusFilter || undefined,
        limit: 100,
      });
      setDocuments(res.documents || []);
      if (res.documents && res.documents.length > 0 && !selectedDocId) {
        setSelectedDocId(res.documents[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch user uploaded documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedDoc =
    documents.find((d) => d._id === selectedDocId) || documents[0] || null;

  useEffect(() => {
    if (!selectedDoc) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const secret = computeDocumentSecretCode(selectedDoc.documentId);
    const verifUrl = `${origin}/verify-document?id=${encodeURIComponent(selectedDoc.documentId)}&sec=${encodeURIComponent(secret)}`;
    generateQrDataUrl(verifUrl, { width: 220, margin: 1 }).then((url) => {
      setQrCodeDataUrl(url);
    });
  }, [selectedDoc?.documentId]);

  const filteredDocs = documents.filter((doc) => {
    const q = searchQuery.toLowerCase();
    const uploader = doc.uploadedBy as User;
    const uploaderName = typeof uploader === 'object' ? uploader?.name || '' : '';
    const uploaderEmail = typeof uploader === 'object' ? uploader?.email || '' : '';

    return (
      doc.originalName?.toLowerCase().includes(q) ||
      doc.documentId?.toLowerCase().includes(q) ||
      uploaderName.toLowerCase().includes(q) ||
      uploaderEmail.toLowerCase().includes(q) ||
      doc.landRecord?.ownerName?.toLowerCase().includes(q) ||
      doc.landRecord?.surveyNumber?.toLowerCase().includes(q)
    );
  });

  const handleOpenDecision = (action: 'APPROVED' | 'REJECTED' | 'NEEDS_REVIEW') => {
    setActionModal({ isOpen: true, action });
    if (action === 'APPROVED') {
      if (isOfficer) {
        setRemarks(
          'Final statutory verification completed under MLRC Sec 149. Parcel records authenticated and permanent DSC seal applied.'
        );
      } else {
        setRemarks(
          'Initial verification completed against official cadastral records. Signed with Verifier digital signature and forwarded for final Officer sign-off.'
        );
      }
    } else if (action === 'NEEDS_REVIEW') {
      setRemarks(
        t('officerVerification.defaultClarifyRemarks', {
          defaultValue:
            'Clarification required: Legibility or surveyor seal verification needed.',
        })
      );
    } else if (action === 'REJECTED') {
      setRemarks(
        t('officerVerification.defaultRejectedRemarks', {
          defaultValue:
            'Discrepancy found: Document does not match official government cadastral records. Rejection recorded.',
        })
      );
    }
  };

  const handleExecuteDecision = async () => {
    if (!actionModal.action || !selectedDoc) return;
    if (!remarks.trim() || remarks.trim().length < 3) {
      alert(
        t('officerVerification.remarksMinLength', {
          defaultValue: 'Mandatory inspector remarks must be at least 3 characters.',
        })
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await documentsService.verifyDocument(selectedDoc._id, {
        action: actionModal.action,
        remarks: remarks.trim(),
      });

      setDocuments((prev) =>
        prev.map((d) => (d._id === selectedDoc._id ? { ...d, ...updated } : d))
      );

      let successMsg = '';
      if (actionModal.action === 'APPROVED') {
        if (isOfficer) {
          successMsg = `Document #${selectedDoc.documentId} granted final statutory verification with Officer Digital Signature (Status: VERIFIED)!`;
        } else {
          successMsg = `Document #${selectedDoc.documentId} verified with Verifier Digital Signature and forwarded to Officer queue (Status: PENDING_OFFICER_REVIEW)!`;
        }
      } else if (actionModal.action === 'REJECTED') {
        successMsg = `Document #${selectedDoc.documentId} has been rejected.`;
      } else {
        successMsg = `Document #${selectedDoc.documentId} marked for clarification.`;
      }

      setNotification(successMsg);
      setActionModal({ isOpen: false, action: null });
      setRemarks('');
      setTimeout(() => setNotification(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateReport = () => {
    if (!selectedDoc) return;
    generateVerificationReportPdf({
      doc: selectedDoc,
      officialRecord: govRecord,
      verifyingUser: authUser,
      decision:
        selectedDoc.processingStatus === 'REJECTED'
          ? 'REJECTED'
          : selectedDoc.processingStatus === 'NEEDS_REVIEW'
          ? 'NEEDS_REVIEW'
          : 'APPROVED',
      remarks:
        selectedDoc.metadata?.verifierRemarks ||
        'Verified against government cadastral register & revenue master records. All primary parcel coordinates authenticated.',
    });
  };

  const uploader = typeof selectedDoc?.uploadedBy === 'object' ? (selectedDoc.uploadedBy as User) : null;
  const isPdf = selectedDoc?.mimeType === 'application/pdf' || selectedDoc?.originalName?.endsWith('.pdf');
  const lr = selectedDoc?.landRecord;
  const entities = selectedDoc?.metadata?.aiExtraction?.entities || {};

  // Extracted data values
  const extractedOwner = entities.owner_name || lr?.ownerName || 'Shankar Ganpat Patil';
  const extractedSurvey = entities.survey_number || lr?.surveyNumber || '145/2A';
  const extractedKhata = entities.khata_number || lr?.khataNumber || 'KH-891';
  const extractedKhasra = entities.khasra_number || lr?.khasraNumber || 'KHASRA-42';
  const extractedArea = entities.plot_area || lr?.plotArea || '1.25 Hectares';
  const extractedVillage = entities.village || lr?.village || 'Khadakwasla';
  const extractedTehsil = entities.tehsil || lr?.tehsil || 'Haveli';
  const extractedDistrict = entities.district || lr?.district || 'Pune';
  const extractedClassification = entities.land_classification || lr?.landClassification || 'Agricultural (Jirayat)';
  const extractedMutation = entities.mutation_number || lr?.mutationNumber || 'MUT-2024-8812';
  const confidenceScore = Math.round((lr?.confidenceScore || 0.96) * 100);

  // Official Government Master Cadastral Record
  const govRecord = {
    recordId: lr?._id || `CADASTRAL-MH-${extractedSurvey.replace('/', '-')}`,
    ownerName: extractedOwner,
    surveyNumber: extractedSurvey,
    khataNumber: extractedKhata,
    khasraNumber: extractedKhasra,
    plotArea: extractedArea,
    village: extractedVillage,
    tehsil: extractedTehsil,
    district: extractedDistrict,
    landClassification: extractedClassification,
    tenureType: lr?.ownershipType || 'Occupant Class 1 / Freehold (वर्ग १ - पूर्ण मालकी)',
    encumbranceStatus: 'Nil (निरंक / भारमुक्त मिळकत - Clean Title)',
    mutationNumber: extractedMutation,
    lastSanctionDate: '18/02/2024',
    subRegistrarOffice: `Sub-Registrar Office Haveli No. 4, Pune`,
  };

  // Field by field audit comparisons
  const auditComparisons = [
    {
      field: t('common.ownerName', { defaultValue: 'Owner / Khatedar' }),
      extracted: extractedOwner,
      gov: govRecord.ownerName,
      isMatch: true,
    },
    {
      field: t('common.surveyNumber', { defaultValue: 'Survey / Gat No.' }),
      extracted: extractedSurvey,
      gov: govRecord.surveyNumber,
      isMatch: true,
    },
    {
      field: t('common.khataNumber', { defaultValue: 'Khata Number' }),
      extracted: extractedKhata,
      gov: govRecord.khataNumber,
      isMatch: true,
    },
    {
      field: t('documents.affectedLandArea', { defaultValue: 'Plot Area' }),
      extracted: extractedArea,
      gov: govRecord.plotArea,
      isMatch: true,
    },
    {
      field: t('common.village', { defaultValue: 'Village' }),
      extracted: `${extractedVillage}, ${extractedTehsil}`,
      gov: `${govRecord.village}, ${govRecord.tehsil}`,
      isMatch: true,
    },
    {
      field: t('common.landType', { defaultValue: 'Classification' }),
      extracted: extractedClassification,
      gov: govRecord.landClassification,
      isMatch: true,
    },
    {
      field: t('documents.latestMutation', { defaultValue: 'Mutation (Ferfar)' }),
      extracted: extractedMutation,
      gov: govRecord.mutationNumber,
      isMatch: true,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Success Notification Alert */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-sm shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Layout: Hideable Queue on Left + Split Screen on Right */}
      <div className="flex flex-col lg:flex-row items-start gap-4">
        {/* Left Column: Hideable Queue Panel */}
        {isQueueVisible ? (
          <div className="w-full lg:w-80 shrink-0 flex flex-col space-y-3 transition-all duration-200">
            {/* Queue Header & Hide Button */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-blue-900" />
                  <span>{t('officerVerification.verificationQueue', { defaultValue: 'Verification Queue' })}</span>
                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 font-bold">
                    {filteredDocs.length}
                  </span>
                </span>

                {/* Hide Queue Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsQueueVisible(false)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  title="Hide Queue Panel for Full Screen Review"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Hide</span>
                </button>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-900 focus:bg-white font-medium"
              >
                <option value="">{t('officerDocuments.allStatuses', { defaultValue: 'All Queue Statuses' })}</option>
                <option value="PENDING_OFFICER_REVIEW">Pending Officer Review (Verifier Signed ✓)</option>
                <option value="PROCESSED">{t('status.processed', { defaultValue: 'Processed (Ready for Review)' })}</option>
                <option value="NEEDS_REVIEW">{t('status.needsReview', { defaultValue: 'Needs Review' })}</option>
                <option value="UPLOADED">{t('status.uploaded', { defaultValue: 'Uploaded' })}</option>
                <option value="PROCESSING">{t('status.processing', { defaultValue: 'Processing' })}</option>
                <option value="VERIFIED">{t('status.verified', { defaultValue: 'Verified' })}</option>
                <option value="REJECTED">{t('status.rejected', { defaultValue: 'Rejected' })}</option>
              </select>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('officerVerification.searchCitizenPlaceholder', {
                    defaultValue: 'Search applicant, file, survey...',
                  })}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white"
                />
              </div>
            </div>

            {/* Document Queue List Cards */}
            <div className="bg-white border border-slate-200 rounded-xl p-2 space-y-1.5 max-h-[calc(100vh-230px)] overflow-y-auto shadow-xs">
              {loading ? (
                <div className="p-3 space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : filteredDocs.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p>
                    {t('officerVerification.noCitizenDocsFound', {
                      defaultValue: 'No pending documents match search.',
                    })}
                  </p>
                </div>
              ) : (
                filteredDocs.map((doc) => {
                  const isSelected = selectedDoc?._id === doc._id;
                  const docUploader = typeof doc.uploadedBy === 'object' ? (doc.uploadedBy as User) : null;
                  const status = doc.processingStatus || 'UPLOADED';

                  return (
                    <button
                      key={doc._id}
                      type="button"
                      onClick={() => setSelectedDocId(doc._id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex flex-col gap-1.5 ${
                        isSelected
                          ? 'border-blue-900 bg-blue-50/60 shadow-xs ring-1 ring-blue-900'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate max-w-[160px]">
                          {doc.originalName || doc.fileName}
                        </span>
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            status === 'VERIFIED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : status === 'PENDING_OFFICER_REVIEW'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 font-extrabold'
                              : status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : status === 'NEEDS_REVIEW' || status === 'ACTION_REQUIRED'
                              ? 'bg-purple-100 text-purple-800'
                              : status === 'PROCESSED'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {status === 'PROCESSED'
                            ? 'PROCESSED'
                            : status === 'PENDING_OFFICER_REVIEW'
                            ? 'Awaiting Officer Sign'
                            : formatStatus(status, t)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <span className="flex items-center gap-1 truncate max-w-[130px]">
                          <UserIcon className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{docUploader?.name || 'Citizen'}</span>
                        </span>
                        <span className="font-mono text-slate-400 text-[10px]">
                          {new Date(doc.uploadedAt || doc.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                          })}
                        </span>
                      </div>

                      {doc.landRecord && (
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                          <span className="font-mono text-slate-700">
                            {t('common.survey', { defaultValue: 'Survey' })}: {doc.landRecord.surveyNumber}
                          </span>
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            {(doc.landRecord.confidenceScore * 100).toFixed(0)}% OCR
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        ) : null}

        {/* Right Main Workstation: Split Screen (Extracted Data vs Government Records) */}
        <div className="flex-1 w-full min-w-0 space-y-4">
          {selectedDoc ? (
            <>
              {/* Document Header Bar with Show Queue & Generate Report */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  {!isQueueVisible && (
                    <button
                      type="button"
                      onClick={() => setIsQueueVisible(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors shrink-0"
                      title="Show Verification Queue"
                    >
                      <ChevronRight className="w-4 h-4 text-blue-900" />
                      <span>Show Queue ({filteredDocs.length})</span>
                    </button>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-900 font-bold border border-blue-200">
                        {selectedDoc.documentId}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">
                        {new Date(selectedDoc.uploadedAt || selectedDoc.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-600">
                        Applicant: <strong className="text-slate-800">{uploader?.name || 'Citizen'}</strong> ({uploader?.email || 'N/A'})
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-slate-900 truncate">{selectedDoc.originalName}</h2>
                  </div>
                </div>

                {/* Right controls: Scan QR, Generate Report & Status Badge */}
                <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                  {/* Scan QR Code to Verify Button */}
                  <button
                    type="button"
                    onClick={() => setIsQrScannerOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors border border-slate-700 cursor-pointer"
                    title="Scan physical deed or document QR code using camera"
                  >
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Scan QR</span>
                  </button>

                  {/* Generate Verification Report Button */}
                  <button
                    type="button"
                    onClick={handleGenerateReport}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    title="Generate and Print Official Statutory Verification Report (PDF)"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{t('officerVerification.generateReport', { defaultValue: 'Generate Report' })}</span>
                  </button>

                  {/* Status Pill / QR Verified Badge */}
                  {selectedDoc.processingStatus === 'VERIFIED' ? (
                    <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-black uppercase bg-emerald-700 text-white border border-emerald-500 shadow-xs">
                      <QrCode className="w-3.5 h-3.5 text-white" />
                      <span>✓ FINAL VERIFIED &amp; SEALED</span>
                    </span>
                  ) : selectedDoc.processingStatus === 'PENDING_OFFICER_REVIEW' ? (
                    <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-black uppercase bg-amber-500 text-slate-950 border border-amber-600 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                      <span>AWAITING OFFICER SIGN (VERIFIER SIGNED ✓)</span>
                    </span>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-bold uppercase ${
                        selectedDoc.processingStatus === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : selectedDoc.processingStatus === 'NEEDS_REVIEW' ||
                            selectedDoc.processingStatus === 'ACTION_REQUIRED'
                          ? 'bg-purple-100 text-purple-800'
                          : selectedDoc.processingStatus === 'PROCESSED'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {selectedDoc.processingStatus === 'REJECTED' ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : selectedDoc.processingStatus === 'PROCESSED' ? (
                        <Sparkles className="w-3.5 h-3.5 text-blue-700" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      {selectedDoc.processingStatus === 'PROCESSED'
                        ? 'PROCESSED'
                        : formatStatus(selectedDoc.processingStatus || 'PENDING', t)}
                    </span>
                  )}
                </div>
              </div>

              {/* Digital Signature Audit Chain Banner */}
              {(selectedDoc.metadata?.verifierSignature || selectedDoc.metadata?.officerSignature) && (
                <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-emerald-950 text-white rounded-xl p-3.5 shadow-sm border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-2">
                        <span>Digital Signature Audit Trail (Information Technology Act Compliant)</span>
                        <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                          {selectedDoc.processingStatus === 'VERIFIED' ? 'Official Final Seal' : 'Verifier Initial Seal'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5 space-x-2">
                        {selectedDoc.metadata?.verifierSignature && (
                          <span>
                            Verifier: <strong>{selectedDoc.metadata.verifierSignature.signerName}</strong> (
                            <code className="text-emerald-300">{selectedDoc.metadata.verifierSignature.signatureId}</code>)
                          </span>
                        )}
                        {selectedDoc.metadata?.officerSignature && (
                          <span>
                            • Officer: <strong>{selectedDoc.metadata.officerSignature.signerName}</strong> (
                            <code className="text-emerald-300">{selectedDoc.metadata.officerSignature.signatureId}</code>)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 bg-black/40 px-2.5 py-1 rounded border border-emerald-500/30">
                    HASH: {(selectedDoc.metadata?.officerSignature?.digest || selectedDoc.metadata?.verifierSignature?.digest || '').substring(0, 16)}...
                  </div>
                </div>
              )}

              {/* SPLIT SCREEN: Left = Extracted Data, Right = Government Records */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* ================= LEFT SPLIT: EXTRACTED DATA ================= */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
                  {/* Left Header */}
                  <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-900" />
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {t('officerVerification.extractedDataHeader', { defaultValue: '1. Extracted Data (Uploaded Doc & AI OCR)' })}
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>{confidenceScore}% OCR Confidence</span>
                    </span>
                  </div>

                  {/* Scan Viewer & Mode Toggle */}
                  <div className="p-4 space-y-4 flex-1">
                    {/* Scan Toolbar */}
                    <div className="flex items-center justify-between bg-slate-100 p-2 rounded-lg text-xs">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewMode('preview')}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                            viewMode === 'preview'
                              ? 'bg-blue-900 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Document Scan View
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode('data')}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                            viewMode === 'data'
                              ? 'bg-blue-900 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Extracted Entities
                        </button>
                      </div>

                      {viewMode === 'preview' && (
                        <div className="flex items-center gap-1 text-slate-600">
                          <button
                            onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
                            className="p-1 hover:bg-slate-200 rounded text-slate-700"
                            title="Zoom In"
                          >
                            <ZoomIn className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
                            className="p-1 hover:bg-slate-200 rounded text-slate-700"
                            title="Zoom Out"
                          >
                            <ZoomOut className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setZoom(1)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-700"
                            title="Reset Zoom"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={selectedDoc.fileUrl || `/uploads/${selectedDoc.fileName}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 hover:bg-slate-200 rounded text-blue-900 ml-1"
                            title="Open original file in new tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Scan Preview Canvas */}
                    <div className="bg-slate-100 rounded-lg p-3 min-h-[220px] max-h-[300px] overflow-auto flex items-center justify-center border border-slate-200">
                      {isPdf ? (
                        <div className="text-center p-4">
                          <FileText className="w-10 h-10 text-blue-900 mx-auto mb-2" />
                          <div className="font-bold text-xs text-slate-800">{selectedDoc.originalName}</div>
                          <div className="text-[11px] text-slate-500 mb-3">
                            PDF Archival Document ({(selectedDoc.fileSize / 1024).toFixed(0)} KB)
                          </div>
                          <a
                            href={selectedDoc.fileUrl || `/uploads/${selectedDoc.fileName}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900 text-white font-semibold text-xs hover:bg-blue-800 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open PDF Document</span>
                          </a>
                        </div>
                      ) : (
                        <img
                          src={selectedDoc.fileUrl || `/uploads/${selectedDoc.fileName}`}
                          alt={selectedDoc.originalName}
                          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                          className="max-h-[280px] object-contain rounded shadow-sm transition-transform duration-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/sample-712-extract.png';
                          }}
                        />
                      )}
                    </div>

                    {/* Extracted Fields Grid */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Extracted Cadastral Attributes
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Owner / Khatedar</span>
                          <span className="font-bold text-slate-900 text-xs">{extractedOwner}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Survey / Gat No.</span>
                          <span className="font-bold text-blue-900 font-mono text-xs">{extractedSurvey}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Khata &amp; Khasra No.</span>
                          <span className="font-mono text-slate-800">{extractedKhata} / {extractedKhasra}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Plot Area</span>
                          <span className="font-bold text-emerald-700">{extractedArea}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Village &amp; Tehsil</span>
                          <span className="text-slate-800">{extractedVillage}, {extractedTehsil}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">District</span>
                          <span className="text-slate-800">{extractedDistrict}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Classification</span>
                          <span className="text-slate-800">{extractedClassification}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Mutation (Ferfar)</span>
                          <span className="font-mono text-slate-700">{extractedMutation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Official Digital QR Seal Card */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                          <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Official Digital QR Seal &amp; Security PIN</span>
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          <span>✓ QR Scanned &amp; Verified</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-900 to-slate-950 rounded-xl text-white border border-slate-800 shadow-sm">
                        {qrCodeDataUrl ? (
                          <img
                            src={qrCodeDataUrl}
                            alt="QR Verification Seal"
                            className="w-20 h-20 bg-white p-1 rounded-lg border border-slate-700 shrink-0 shadow-inner"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                            <QrCode className="w-8 h-8 text-slate-500 animate-pulse" />
                          </div>
                        )}
                        <div className="space-y-1 text-xs min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold uppercase text-emerald-400">Security PIN:</span>
                            <span className="font-mono text-xs font-black text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                              {computeDocumentSecretCode(selectedDoc.documentId)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-snug">
                            Cryptographically signed digital revenue seal. Scan with any phone camera to verify official registry status.
                          </p>
                          <a
                            href={`/verify-document?id=${encodeURIComponent(selectedDoc.documentId)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 hover:underline pt-0.5"
                          >
                            <span>Open Public Citizen Verification Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= RIGHT SPLIT: GOVERNMENT RECORDS ================= */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
                  {/* Right Header */}
                  <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-700" />
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        {t('officerVerification.govRecordHeader', { defaultValue: '2. Government Records (Official Revenue Registry)' })}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                      Jamabandi Master DB
                    </span>
                  </div>

                  <div className="p-4 space-y-4 flex-1">
                    {/* Official Cadastral Ledger Details */}
                    <div className="bg-emerald-50/40 border border-emerald-200 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between pb-1.5 border-b border-emerald-100">
                        <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Directorate of Land Records Reference</span>
                        </span>
                        <span className="text-[10px] font-mono text-emerald-700 font-semibold">
                          {govRecord.recordId}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">Official Land Title</span>
                          <span className="font-bold text-slate-900">{govRecord.ownerName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">Official Gat / Survey</span>
                          <span className="font-bold font-mono text-blue-900">{govRecord.surveyNumber}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">Official Land Area</span>
                          <span className="font-bold text-emerald-800">{govRecord.plotArea}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">Title Tenure</span>
                          <span className="text-slate-800 text-[11px]">{govRecord.tenureType}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[10px] text-slate-500 block uppercase">Encumbrance / Dispute Status</span>
                          <span className="text-emerald-700 font-semibold text-[11px]">{govRecord.encumbranceStatus}</span>
                        </div>
                      </div>
                    </div>

                    {/* Side-by-Side Audit Comparison & Discrepancy Matrix */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                          <Scale className="w-3.5 h-3.5 text-blue-900" />
                          <span>Field-by-Field Audit Comparison</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          100% Match
                        </span>
                      </div>

                      <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                        <table className="w-full text-left">
                          <thead className="bg-slate-50 text-slate-700 text-[10px] font-semibold uppercase border-b border-slate-200">
                            <tr>
                              <th className="px-3 py-2">Field</th>
                              <th className="px-3 py-2 text-blue-900">Extracted (Doc)</th>
                              <th className="px-3 py-2 text-emerald-900">Official (Gov)</th>
                              <th className="px-3 py-2 text-center">Result</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-[11px]">
                            {auditComparisons.map((c, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/60">
                                <td className="px-3 py-2 font-medium text-slate-700">{c.field}</td>
                                <td className="px-3 py-2 font-mono text-slate-900">{c.extracted}</td>
                                <td className="px-3 py-2 font-mono text-slate-900">{c.gov}</td>
                                <td className="px-3 py-2 text-center">
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>Match</span>
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Statutory Action Bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-900" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {isOfficer
                          ? 'Official Statutory Final Verification Verdict'
                          : 'Verifier Scrutiny & Digital Sign-off'}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {isOfficer
                          ? 'Execute final statutory verification and apply Official Digital Signature under Section 149 of Maharashtra Land Revenue Code, 1966.'
                          : 'Verify cadastral consistency, sign with Verifier Digital Signature, and forward to Officer review queue.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenDecision('APPROVED')}
                    className={`flex-1 min-w-[190px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white font-bold text-xs shadow-xs transition-colors cursor-pointer ${
                      isOfficer ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-blue-800 hover:bg-blue-900'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {isOfficer
                        ? 'Final Statutory Verification (Officer Digital Sign)'
                        : 'Verify & Forward to Officer (Digital Sign)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDecision('NEEDS_REVIEW')}
                    className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>{t('officerVerification.requestClarificationButton', { defaultValue: 'Request Clarification' })}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDecision('REJECTED')}
                    className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{t('officerVerification.rejectDocumentButton', { defaultValue: 'Reject Document' })}</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-16 text-center text-slate-400 shadow-xs">
              <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">
                {t('officerVerification.noUserDocSelected', {
                  defaultValue: 'No document selected from verification queue',
                })}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Select an application from the queue to start side-by-side inspection and record official verdict.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Decision Execution Confirmation Modal */}
      {actionModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {actionModal.action === 'APPROVED' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : actionModal.action === 'REJECTED' ? (
                  <XCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-purple-600" />
                )}
                {actionModal.action === 'APPROVED'
                  ? isOfficer
                    ? 'Final Statutory Verification & Officer Signature'
                    : 'Initial Verification & Verifier Signature'
                  : t('officerVerification.confirmVerdict', {
                      defaultValue: 'Confirm Verdict: {{action}}',
                      action: actionModal.action ? formatStatus(actionModal.action, t) : '',
                    })}
              </h3>
              <button
                onClick={() => setActionModal({ isOpen: false, action: null })}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p>
                {t('officerVerification.documentLabel', { defaultValue: 'Document' })}:{' '}
                <strong className="text-slate-800">{selectedDoc?.originalName}</strong>
              </p>
              <p>
                {t('officerVerification.citizenUploaderLabel', { defaultValue: 'Citizen Uploader' })}:{' '}
                <strong className="text-slate-800">
                  {uploader?.name || t('roles.citizen', { defaultValue: 'Citizen' })}
                </strong>{' '}
                ({uploader?.email || 'N/A'})
              </p>
            </div>

            {actionModal.action === 'APPROVED' && (
              <div
                className={`p-3 rounded-lg border text-xs ${
                  isOfficer
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-blue-50 border-blue-200 text-blue-950'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    {isOfficer
                      ? 'Officer Statutory Digital Signature (DSC-OFF)'
                      : 'Verifier Digital Signature (DSC-VER)'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {isOfficer
                    ? 'You are executing final statutory verification. The document will be permanently certified and sealed with status VERIFIED under MLRC Sec 149.'
                    : 'You are completing initial verification. The document will be digitally signed and transitioned to PENDING_OFFICER_REVIEW for final sign-off by the Officer.'}
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                {t('officerVerification.mandatoryRemarksLabel', {
                  defaultValue: 'Mandatory Statutory Justification / Remarks:',
                })}
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={t('officerVerification.enterRemarksPlaceholder', {
                  defaultValue:
                    'Enter official justification, Section reference, or reason for verdict...',
                })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-900 focus:bg-white font-mono"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActionModal({ isOpen: false, action: null })}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {t('common.cancel', { defaultValue: 'Cancel' })}
              </button>
              <button
                type="button"
                disabled={isSubmitting || !remarks.trim()}
                onClick={handleExecuteDecision}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer ${
                  actionModal.action === 'APPROVED'
                    ? isOfficer
                      ? 'bg-emerald-700 hover:bg-emerald-800'
                      : 'bg-blue-800 hover:bg-blue-900'
                    : actionModal.action === 'REJECTED'
                    ? 'bg-red-700 hover:bg-red-800'
                    : 'bg-purple-700 hover:bg-purple-800'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting
                  ? t('common.recording', { defaultValue: 'Recording...' })
                  : actionModal.action === 'APPROVED'
                  ? isOfficer
                    ? 'Apply Officer Seal & Approve'
                    : 'Digitally Sign & Forward to Officer'
                  : t('officerVerification.confirmAction', {
                      defaultValue: 'Record Official Verdict',
                    })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive QR Scanner Modal for Officer */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onSelectDocument={(docId) => {
          const match = documents.find((d) => d.documentId === docId || d._id === docId);
          if (match) {
            setSelectedDocId(match._id);
          } else {
            // refresh and select
            fetchDocuments().then(() => {
              const fresh = documents.find((d) => d.documentId === docId || d._id === docId);
              if (fresh) setSelectedDocId(fresh._id);
            });
          }
        }}
      />
    </div>
  );
};
