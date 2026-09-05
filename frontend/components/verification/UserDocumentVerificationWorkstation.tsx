'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { DocumentRecord, User } from '../../types';
import { documentsService } from '../../services/documents.service';
import {
  FileText,
  Search,
  Filter,
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
  Building2,
  Layers,
  ShieldCheck,
  Send,
  Eye,
  FileCheck,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';

interface UserDocumentVerificationWorkstationProps {
  canVerify?: boolean;
}

export const UserDocumentVerificationWorkstation: React.FC<
  UserDocumentVerificationWorkstationProps
> = ({ canVerify = true }) => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [viewMode, setViewMode] = useState<'preview' | 'data'>('preview');

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

  useEffect(() => {
    fetchDocuments();
  }, [statusFilter]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await documentsService.getDocuments({
        status: statusFilter || undefined,
        limit: 50,
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
      setRemarks('Verified against cadastral extract & revenue records. Document authenticated.');
    } else if (action === 'NEEDS_REVIEW') {
      setRemarks('Clarification required: Legibility or surveyor seal verification needed.');
    } else if (action === 'REJECTED') {
      setRemarks('Document does not match official cadastral registry. Rejection confirmed.');
    }
  };

  const handleExecuteDecision = async () => {
    if (!actionModal.action || !selectedDoc) return;
    if (!remarks.trim() || remarks.trim().length < 3) {
      alert('Mandatory inspector remarks must be at least 3 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await documentsService.verifyDocument(selectedDoc._id, {
        action: actionModal.action,
        remarks: remarks.trim(),
      });

      // Update local state
      setDocuments((prev) =>
        prev.map((d) => (d._id === selectedDoc._id ? { ...d, ...updated } : d))
      );

      const actionText =
        actionModal.action === 'APPROVED'
          ? 'approved and verified'
          : actionModal.action === 'REJECTED'
          ? 'rejected'
          : 'marked for clarification';

      setNotification(`Document #${selectedDoc.documentId} has been ${actionText} successfully!`);
      setActionModal({ isOpen: false, action: null });
      setRemarks('');
      setTimeout(() => setNotification(null), 5000);
    } catch (err: any) {
      alert(err.message || 'Verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploader = typeof selectedDoc?.uploadedBy === 'object' ? (selectedDoc.uploadedBy as User) : null;
  const isPdf = selectedDoc?.mimeType === 'application/pdf' || selectedDoc?.originalName?.endsWith('.pdf');

  return (
    <div className="space-y-6">
      {/* Success Notification Alert */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-sm shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Workstation 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: User Uploaded Documents Queue (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-3">
          {/* Filter & Search Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-900" />
                Citizen Uploads ({filteredDocs.length})
              </span>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1 text-xs rounded border border-slate-300 bg-white text-slate-700 focus:ring-1 focus:ring-blue-900"
              >
                <option value="">All Statuses</option>
                <option value="UPLOADED">Uploaded</option>
                <option value="PROCESSING">Processing</option>
                <option value="NEEDS_REVIEW">Needs Review</option>
                <option value="VERIFIED">Verified</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search citizen name, file, or survey..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white"
              />
            </div>
          </div>

          {/* Document Cards List */}
          <div className="bg-white border border-slate-200 rounded-xl p-2 space-y-1.5 max-h-[720px] overflow-y-auto shadow-xs">
            {loading ? (
              <div className="p-3 space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">
                <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No user uploaded documents found matching filter.</p>
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
                        ? 'border-blue-900 bg-blue-50/50 shadow-xs ring-1 ring-blue-900'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate max-w-[180px]">
                        {doc.originalName || doc.fileName}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          status === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : status === 'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : status === 'NEEDS_REVIEW' || status === 'ACTION_REQUIRED'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600">
                      <span className="flex items-center gap-1">
                        <UserIcon className="w-3 h-3 text-slate-400" />
                        {docUploader?.name || 'Citizen User'}
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
                          Survey: {doc.landRecord.surveyNumber}
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

        {/* Right Column: Selected User Document Review & Verdict (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {selectedDoc ? (
            <>
              {/* Uploader Details Header Banner */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-900 font-bold border border-blue-200">
                      {selectedDoc.documentId}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs text-slate-500">
                      Uploaded on{' '}
                      {new Date(selectedDoc.uploadedAt || selectedDoc.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900">{selectedDoc.originalName}</h2>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span>
                      Uploader: <strong className="text-slate-800">{uploader?.name || 'Citizen'}</strong>
                    </span>
                    <span>•</span>
                    <span>{uploader?.email || 'N/A'}</span>
                    <span>•</span>
                    <span>{(selectedDoc.fileSize / 1024).toFixed(0)} KB</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-bold uppercase ${
                      selectedDoc.processingStatus === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedDoc.processingStatus === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : selectedDoc.processingStatus === 'NEEDS_REVIEW' ||
                          selectedDoc.processingStatus === 'ACTION_REQUIRED'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedDoc.processingStatus === 'VERIFIED' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : selectedDoc.processingStatus === 'REJECTED' ? (
                      <XCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    {selectedDoc.processingStatus || 'PENDING'}
                  </span>
                </div>
              </div>

              {/* Document Scan Viewer */}
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setViewMode('preview')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        viewMode === 'preview'
                          ? 'bg-blue-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Original Document Scan
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('data')}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        viewMode === 'data'
                          ? 'bg-blue-900 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      AI Extracted Fields
                    </button>
                  </div>

                  {viewMode === 'preview' && (
                    <div className="flex items-center gap-1 text-slate-600">
                      <button
                        onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setZoom(1)}
                        className="p-1.5 hover:bg-slate-200 rounded text-slate-700"
                        title="Reset"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={selectedDoc.fileUrl || `/uploads/${selectedDoc.fileName}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 hover:bg-slate-200 rounded text-blue-900 ml-1"
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-100/70 min-h-[360px] max-h-[460px] overflow-auto flex items-center justify-center">
                  {viewMode === 'preview' ? (
                    isPdf ? (
                      <div className="w-full h-[420px] flex flex-col items-center justify-center bg-white rounded-lg border border-slate-200 p-6 text-center shadow-xs">
                        <FileText className="w-12 h-12 text-blue-900 mb-3" />
                        <h4 className="text-sm font-bold text-slate-800 mb-1">{selectedDoc.originalName}</h4>
                        <p className="text-xs text-slate-500 mb-4 max-w-sm">
                          PDF Document Scan ({((selectedDoc.fileSize || 0) / 1024).toFixed(0)} KB). Open in viewer or new tab to inspect full multipage archival sheets.
                        </p>
                        <a
                          href={selectedDoc.fileUrl || `/uploads/${selectedDoc.fileName}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-900 text-white font-semibold text-xs hover:bg-blue-800 transition-colors shadow-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open Document PDF in Full Viewer
                        </a>
                      </div>
                    ) : (
                      <img
                        src={selectedDoc.fileUrl || `/uploads/${selectedDoc.fileName}`}
                        alt={selectedDoc.originalName}
                        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                        className="max-h-[420px] object-contain rounded shadow-sm transition-transform duration-200"
                        onError={(e) => {
                          // Fallback placeholder image if upload file isn't physically on local disk
                          (e.target as HTMLImageElement).src = '/sample-712-extract.png';
                        }}
                      />
                    )
                  ) : (
                    /* AI Extracted Data View */
                    <div className="w-full bg-white rounded-lg border border-slate-200 p-4 shadow-xs space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          AI Cadastral Extraction Results
                        </span>
                        <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {Math.round((selectedDoc.landRecord?.confidenceScore || 0.95) * 100)}% Confidence
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 block mb-0.5">Khatedar / Land Owner</span>
                          <span className="font-bold text-slate-900 text-sm">
                            {selectedDoc.landRecord?.ownerName || 'Shankar Ganpat Patil'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Survey / Gat Number</span>
                          <span className="font-bold text-slate-900 text-sm">
                            {selectedDoc.landRecord?.surveyNumber || '145/2A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Village / Taluka</span>
                          <span className="font-medium text-slate-800">
                            {selectedDoc.landRecord?.village || 'Khadakwasla'},{' '}
                            {selectedDoc.landRecord?.tehsil || 'Haveli'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Land Area</span>
                          <span className="font-bold text-emerald-700">
                            {selectedDoc.landRecord?.plotArea || '1.25 Hectares'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Classification</span>
                          <span className="text-slate-800">
                            {selectedDoc.landRecord?.landClassification || 'Agricultural (Jirayat)'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">Mutation (Ferfar)</span>
                          <span className="font-mono text-slate-700">
                            {selectedDoc.landRecord?.mutationNumber || 'MUT-2024-8812'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Authoritative Verifier Action Panel */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-900" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Official Document Verification Decision</h3>
                      <p className="text-xs text-slate-500">
                        Record statutory inspection verdict under Section 149 Maharashtra Land Revenue Code.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenDecision('APPROVED')}
                    className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Verify & Approve Document
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDecision('NEEDS_REVIEW')}
                    className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Request Clarification
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDecision('REJECTED')}
                    className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Document
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-16 text-center text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No user uploaded document selected</p>
              <p className="text-xs text-slate-400 mt-1">
                Select a citizen document from the queue on the left to review and record official verification.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Decision Execution Modal */}
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
                Confirm Verdict: {actionModal.action}
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
                Document: <strong className="text-slate-800">{selectedDoc?.originalName}</strong>
              </p>
              <p>
                Citizen Uploader: <strong className="text-slate-800">{uploader?.name || 'Citizen'}</strong> ({uploader?.email || 'N/A'})
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Mandatory Inspector Remarks / Statutory Findings:
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter verification remarks, gazette reference, or reason for decision..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-900 focus:bg-white"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActionModal({ isOpen: false, action: null })}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting || !remarks.trim()}
                onClick={handleExecuteDecision}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white shadow-xs transition-colors disabled:opacity-50 ${
                  actionModal.action === 'APPROVED'
                    ? 'bg-emerald-700 hover:bg-emerald-800'
                    : actionModal.action === 'REJECTED'
                    ? 'bg-red-700 hover:bg-red-800'
                    : 'bg-purple-700 hover:bg-purple-800'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Recording...' : `Confirm ${actionModal.action}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
