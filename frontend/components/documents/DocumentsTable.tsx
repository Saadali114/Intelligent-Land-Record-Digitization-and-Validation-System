import React from 'react';
import { DocumentRecord } from '../../types';
import { Badge } from '../ui/Badge';
import { Pagination } from '../ui/Pagination';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { formatDate, formatFileSize } from '../../lib/utils';
import { TERMINAL_STATUSES } from '../../hooks/useDocuments';
import {
  FileText,
  Languages,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Eye,
  Trash2,
  QrCode,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DocumentsTableProps {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  documents?: DocumentRecord[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  currentPage: number;
  onPageChange: (page: number) => void;
  processingDocId: string | null;
  extractingId: string | null;
  onRunExtraction: (id: string) => void;
  onSelectDoc: (doc: DocumentRecord) => void;
  onDeleteDoc: (id: string) => void;
  onShowQr?: (doc: DocumentRecord) => void;
  isAdmin: boolean;
}

export const DocumentsTable: React.FC<DocumentsTableProps> = ({
  isLoading,
  isError,
  errorMessage,
  documents,
  pagination,
  currentPage,
  onPageChange,
  processingDocId,
  extractingId,
  onRunExtraction,
  onSelectDoc,
  onDeleteDoc,
  onShowQr,
  isAdmin,
}) => {
  const { t } = useTranslation();
  return (
    <div className="gov-card overflow-hidden">
      {isLoading && (
        <div className="p-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-8 text-center text-xs text-rose-600">
          Failed to load documents: {errorMessage || 'Server unreachable.'}
        </div>
      )}

      {!isLoading && !isError && (!documents || documents.length === 0) && (
        <EmptyState
          title="No Documents Registered"
          description="No archival document matches your current filter selection."
        />
      )}

      {!isLoading && !isError && documents && documents.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Document File</th>
                  <th className="px-4 py-3.5">Document ID</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Language</th>
                  <th className="px-4 py-3.5">{t('common.status')}</th>
                  <th className="px-4 py-3.5">Digital Version</th>
                  <th className="px-4 py-3.5">Uploaded By</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{doc.originalName}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-slate-400">
                              {formatFileSize(doc.fileSize)}
                            </span>
                            {doc.isLegacyRecord && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 border border-purple-200">
                                📜 Pre-1947 MRR
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-700">
                      {doc.documentId}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">{doc.fileType}</td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        <Languages className="w-3 h-3 text-slate-500" />
                        {doc.language}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1 items-start">
                        {doc.processingStatus === 'VERIFIED' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded shadow-2xs">
                            <QrCode className="w-3 h-3 text-emerald-700 shrink-0" />
                            ✓ QR Scanned & Verified
                          </span>
                        ) : (
                          <Badge status={doc.processingStatus} />
                        )}
                        {processingDocId === doc._id &&
                          !TERMINAL_STATUSES.includes(doc.processingStatus) && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded animate-pulse">
                              <RefreshCw className="w-2.5 h-2.5 text-blue-600 animate-spin" />
                              AI Processing…
                            </span>
                          )}
                        {doc.metadata?.aiExtraction?.overallConfidence && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                            <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                            {(doc.metadata.aiExtraction.overallConfidence * 100).toFixed(0)}% AI
                          </span>
                        )}
                        {(doc.isReuploaded ||
                          doc.metadata?.isReuploaded ||
                          doc.metadata?.aiExtraction?.anomalies?.some((a: string) =>
                            a.toLowerCase().includes('duplicate') || a.toLowerCase().includes('already exists')
                          )) && (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded"
                            title={doc.reuploadedFromId || doc.metadata?.reuploadedFromId ? `Re-uploaded copy of ${doc.reuploadedFromId || doc.metadata?.reuploadedFromId}` : 'Re-uploaded document'}
                          >
                            <RefreshCw className="w-2.5 h-2.5 text-amber-600" />
                            Re-Uploaded
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {doc.landRecord ? (
                        <div className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 text-[11px]">
                          <div className="font-bold text-emerald-950 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>Survey #{doc.landRecord.surveyNumber}</span>
                          </div>
                          <div className="text-[10px] text-emerald-800 font-medium truncate max-w-[140px]">
                            {doc.landRecord.ownerName}
                          </div>
                          <div className="text-[9px] text-emerald-600">
                            {doc.landRecord.village}, {doc.landRecord.district}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => onRunExtraction(doc._id)}
                          disabled={extractingId === doc._id}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 rounded transition-colors"
                          title="Run OCR to extract digital record"
                        >
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          Digitize Record
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-700">
                      {typeof doc.uploadedBy === 'object'
                        ? doc.uploadedBy.name
                        : 'Official Uploader'}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{formatDate(doc.uploadedAt)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onRunExtraction(doc._id)}
                          disabled={extractingId === doc._id}
                          className={`p-1.5 rounded transition-colors ${
                            extractingId === doc._id
                              ? 'text-amber-600 bg-amber-50'
                              : 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
                          }`}
                          title={
                            doc.processingStatus === 'PROCESSED'
                              ? 'Re-run AI Extraction'
                              : 'Run AI OCR Extraction'
                          }
                        >
                          <Sparkles
                            className={`w-4 h-4 ${
                              extractingId === doc._id ? 'animate-spin' : ''
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => onSelectDoc(doc)}
                          className="p-1.5 text-slate-500 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                          title="View Document Details & Extracted Data"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {onShowQr && (
                          <button
                            onClick={() => onShowQr(doc)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                            title="Tamper-Proof QR & Adhesive Sticker Seal"
                          >
                            <QrCode className="w-4 h-4 text-emerald-600" />
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => onDeleteDoc(doc._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Delete Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && (
            <div className="border-t border-slate-100 px-4">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                limit={pagination.limit}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
