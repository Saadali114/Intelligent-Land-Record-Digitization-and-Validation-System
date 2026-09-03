'use client';

import React, { useState } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  useDocumentsQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
} from '../../hooks/useDocuments';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate, formatFileSize } from '../../lib/utils';
import { DocumentRecord } from '../../types';
import {
  Files,
  UploadCloud,
  Search,
  FileText,
  Trash2,
  Eye,
  CheckCircle2,
  FileCode,
  Languages,
} from 'lucide-react';

export default function DocumentsPage() {
  const { isAdmin, isOfficer } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);

  // Upload Form State
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('Marathi');
  const [fileType, setFileType] = useState('7/12 Extract');

  const { data, isLoading, isError, error } = useDocumentsQuery({
    page,
    limit: 10,
    search: search || undefined,
    status: statusFilter || undefined,
    language: languageFilter || undefined,
  });

  const uploadMutation = useUploadDocumentMutation();
  const deleteMutation = useDeleteDocumentMutation();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a document file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    formData.append('fileType', fileType);

    try {
      await uploadMutation.mutateAsync(formData);
      setIsUploadModalOpen(false);
      setFile(null);
    } catch (err: any) {
      alert(err.message || 'File upload failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete document');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Files className="w-6 h-6 text-blue-900" />
              Document Registry & Ingestion
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Archival repository for scanned land records, 7/12 extracts, and mutation registers.
            </p>
          </div>

          {(isAdmin || isOfficer) && (
            <Button onClick={() => setIsUploadModalOpen(true)} className="sm:self-start">
              <UploadCloud className="w-4 h-4 mr-1.5" />
              Upload Document
            </Button>
          )}
        </div>

        {/* Filters and Search Bar */}
        <div className="gov-card p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by file name, doc ID, language..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={languageFilter}
              onChange={(e) => {
                setLanguageFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
            >
              <option value="">All Languages</option>
              <option value="Marathi">Marathi</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Gujarati">Gujarati</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
            >
              <option value="">All Statuses</option>
              <option value="UPLOADED">Uploaded</option>
              <option value="PROCESSING">Processing</option>
              <option value="PROCESSED">Processed</option>
              <option value="NEEDS_REVIEW">Needs Review</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
        </div>

        {/* Documents Table */}
        <div className="gov-card overflow-hidden">
          {isLoading && (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          )}

          {isError && (
            <div className="p-6 text-center text-rose-600 text-xs font-semibold">
              {(error as Error)?.message || 'Failed to load documents'}
            </div>
          )}

          {data && data.documents.length === 0 && (
            <EmptyState
              title="No Documents Registered"
              description="No archival document matches your current filter selection."
            />
          )}

          {data && data.documents.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                    <tr>
                      <th className="px-5 py-3.5">Document File</th>
                      <th className="px-4 py-3.5">Document ID</th>
                      <th className="px-4 py-3.5">Type</th>
                      <th className="px-4 py-3.5">Language</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5">Uploaded By</th>
                      <th className="px-4 py-3.5">Date</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.documents.map((doc) => (
                      <tr key={doc._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900">{doc.originalName}</div>
                              <div className="text-[10px] text-slate-400">
                                {formatFileSize(doc.fileSize)}
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
                          <Badge status={doc.processingStatus} />
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
                              onClick={() => setSelectedDoc(doc)}
                              className="p-1.5 text-slate-500 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                              title="View Document Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => handleDelete(doc._id)}
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

              {data.pagination && (
                <div className="border-t border-slate-100 px-4">
                  <Pagination
                    currentPage={page}
                    totalPages={data.pagination.totalPages}
                    totalItems={data.pagination.total}
                    limit={data.pagination.limit}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Upload Document Modal */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Ingest Land Document"
        description="Upload historical scan or PDF into the registry pipeline."
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-blue-700 transition-colors bg-slate-50/50">
            <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-slate-700 mb-1">
              {file ? file.name : 'Select or drag document to upload'}
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Supports PDF, JPEG, PNG, WEBP, TIFF (Max 25MB)
            </p>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp,.tiff"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-900 file:text-white hover:file:bg-blue-800 cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Archival Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-900"
              >
                <option value="Marathi">Marathi</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Gujarati">Gujarati</option>
                <option value="Bengali">Bengali</option>
                <option value="Tamil">Tamil</option>
                <option value="Telugu">Telugu</option>
                <option value="Kannada">Kannada</option>
                <option value="Malayalam">Malayalam</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Odia">Odia</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Record Category
              </label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-900"
              >
                <option value="7/12 Extract (Satbara)">7/12 Extract (Satbara)</option>
                <option value="Sale Deed (Kharidi Khat)">Sale Deed (Kharidi Khat)</option>
                <option value="Mutation Register (Ferfar)">Mutation Register (Ferfar)</option>
                <option value="Property Card (Milkat Patra)">Property Card (Milkat Patra)</option>
                <option value="Survey Map (Tippan)">Survey Map (Tippan)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUploadModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={uploadMutation.isPending}>
              Ingest Document
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Document Details Modal */}
      {selectedDoc && (
        <Modal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          title="Archival Document Details"
          description={`System Record: ${selectedDoc.documentId}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Original File:</span>
                <div className="font-semibold text-slate-900 mt-0.5">{selectedDoc.originalName}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Category:</span>
                <div className="font-semibold text-slate-900 mt-0.5">{selectedDoc.fileType}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Language:</span>
                <div className="font-semibold text-slate-900 mt-0.5">{selectedDoc.language}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Processing Status:</span>
                <div className="mt-1">
                  <Badge status={selectedDoc.processingStatus} />
                </div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">File Size:</span>
                <div className="font-semibold text-slate-900 mt-0.5">{formatFileSize(selectedDoc.fileSize)}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Uploaded Date:</span>
                <div className="font-semibold text-slate-900 mt-0.5">{formatDate(selectedDoc.uploadedAt)}</div>
              </div>
            </div>

            {/* AI Preparation Metadata */}
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 text-xs">
              <div className="font-bold text-blue-900 flex items-center gap-1.5 mb-1.5">
                <FileCode className="w-4 h-4" />
                AI & OCR Pipeline Ingestion Metadata
              </div>
              <pre className="text-[11px] font-mono text-slate-700 bg-white p-3 rounded-lg border border-blue-100 overflow-x-auto">
                {JSON.stringify(selectedDoc.metadata || {}, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedDoc(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}
