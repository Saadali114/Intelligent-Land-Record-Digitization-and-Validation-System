'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  useDocumentsQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
  useExtractDocumentMutation,
  useDocumentPolling,
  TERMINAL_STATUSES,
} from '../../hooks/useDocuments';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { DocumentRecord } from '../../types';
import {
  DocumentFilterBar,
  DocumentsTable,
  UploadDocumentModal,
  DocumentInspectionModal,
  DocumentQrModal,
} from '../../components/documents';
import { QrScannerModal } from '../../components/verification/QrScannerModal';
import { Files, UploadCloud, Camera, QrCode } from 'lucide-react';

export default function DocumentsPage() {
  const { t } = useTranslation();
  const { isAdmin, isVerifier, isOfficer } = useAuth();
  const queryClient = useQueryClient();

  // Filter & Pagination State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');

  // Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [qrModalDoc, setQrModalDoc] = useState<DocumentRecord | null>(null);

  // Polling & Extraction State
  const [processingDocId, setProcessingDocId] = useState<string | null>(null);
  const [extractingId, setExtractingId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useDocumentsQuery({
    page,
    limit: 10,
    search: search || undefined,
    status: statusFilter || undefined,
    language: languageFilter || undefined,
  });

  // Poll the newly uploaded document until it reaches a terminal status
  const { data: polledDoc } = useDocumentPolling(processingDocId);

  useEffect(() => {
    if (polledDoc && TERMINAL_STATUSES.includes(polledDoc.processingStatus)) {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      setProcessingDocId(null);
    }
  }, [polledDoc, queryClient]);

  const uploadMutation = useUploadDocumentMutation();
  const deleteMutation = useDeleteDocumentMutation();
  const extractMutation = useExtractDocumentMutation();

  const handleRunExtraction = async (id: string) => {
    try {
      setExtractingId(id);
      const res = await extractMutation.mutateAsync(id);
      if (res && res.document) {
        setSelectedDoc((prev) => {
          if (!prev) return res.document;
          return {
            ...prev,
            ...res.document,
            landRecord: res.landRecord || res.document.landRecord || prev.landRecord,
          };
        });
      }
      queryClient.invalidateQueries({ queryKey: ['documents', 'detail', id] });
    } catch (err: any) {
      alert(err.message || 'AI extraction failed');
    } finally {
      setExtractingId(null);
    }
  };

  useEffect(() => {
    if (selectedDoc && data?.documents) {
      const updated = data.documents.find((d) => d._id === selectedDoc._id);
      if (updated && updated.landRecord && !selectedDoc.landRecord) {
        setSelectedDoc(updated);
      }
    }
  }, [data?.documents, selectedDoc]);

  const handleUpload = async (formData: FormData) => {
    try {
      const newDoc = await uploadMutation.mutateAsync(formData);
      setIsUploadModalOpen(false);
      if (newDoc?._id) {
        setProcessingDocId(newDoc._id);
      }
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
              {t('officerDocuments.title', { defaultValue: 'Document Registry & Ingestion' })}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {t('officerDocuments.subtitle', { defaultValue: 'Archival repository for scanned land records, 7/12 extracts, and mutation registers.' })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsQrScannerOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-700 shadow-xs"
            >
              <Camera className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              {t('officerDocuments.scanQr', { defaultValue: 'Scan Document QR' })}
            </Button>
            {(isAdmin || isVerifier) && (
              <Button onClick={() => setIsUploadModalOpen(true)} className="sm:self-start">
                <UploadCloud className="w-4 h-4 mr-1.5" />
                {t('officerDocuments.uploadButton', { defaultValue: 'Upload Document' })}
              </Button>
            )}
          </div>
        </div>

        {/* Filter Toolbar */}
        <DocumentFilterBar
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          languageFilter={languageFilter}
          onLanguageFilterChange={(val) => {
            setLanguageFilter(val);
            setPage(1);
          }}
          statusFilter={statusFilter}
          onStatusFilterChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
        />

        {/* Registry Table & Pagination */}
        <DocumentsTable
          isLoading={isLoading}
          isError={isError}
          errorMessage={(error as Error)?.message}
          documents={data?.documents}
          pagination={data?.pagination}
          currentPage={page}
          onPageChange={setPage}
          processingDocId={processingDocId}
          extractingId={extractingId}
          onRunExtraction={handleRunExtraction}
          onSelectDoc={setSelectedDoc}
          onDeleteDoc={handleDelete}
          onShowQr={setQrModalDoc}
          isAdmin={isAdmin}
        />
      </div>

      {/* Ingestion Upload Dialog */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        isUploading={uploadMutation.isPending}
      />

      {/* Cadastral Dual-Pane Inspection Dialog */}
      <DocumentInspectionModal
        document={selectedDoc}
        isOpen={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        onRunExtraction={handleRunExtraction}
        isExtracting={extractingId === selectedDoc?._id}
      />

      {/* Physical QR Scanner Modal */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
      />

      {/* Document Tamper-Proof QR & Adhesive Sticker Modal */}
      <DocumentQrModal
        document={qrModalDoc}
        isOpen={Boolean(qrModalDoc)}
        onClose={() => setQrModalDoc(null)}
      />
    </AppLayout>
  );
}
