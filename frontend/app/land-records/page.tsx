'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '../../components/layout/AppLayout';
import {
  useLandRecordsQuery,
  useFilterMetadataQuery,
  useCreateLandRecordMutation,
  useUpdateLandRecordMutation,
  useDeleteLandRecordMutation,
} from '../../hooks/useLandRecords';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { LandRecord } from '../../types';
import { LandRecordFormData } from '../../schemas/land-record.schema';
import {
  LandRecordFilterBar,
  LandRecordsTable,
  CreateLandRecordModal,
  EditLandRecordModal,
  ViewLandRecordModal,
} from '../../components/land-records';
import { FileSpreadsheet, Plus, CheckCircle2, Camera, QrCode } from 'lucide-react';
import { QrScannerModal } from '../../components/verification/QrScannerModal';
import { DocumentQrModal } from '../../components/documents/DocumentQrModal';

export default function LandRecordsPage() {
  const { t } = useTranslation();
  const { isAdmin, isOfficer, isVerifier } = useAuth();

  // Filter & Pagination State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<LandRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<LandRecord | null>(null);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [qrRecordDoc, setQrRecordDoc] = useState<any | null>(null);

  const { data, isLoading, isError, error } = useLandRecordsQuery({
    page,
    limit: 10,
    search: search || undefined,
    district: districtFilter || undefined,
    status: 'VERIFIED',
    landClassification: classificationFilter || undefined,
  });

  const { data: filterMeta } = useFilterMetadataQuery();

  const createMutation = useCreateLandRecordMutation();
  const updateMutation = useUpdateLandRecordMutation();
  const deleteMutation = useDeleteLandRecordMutation();

  const handleCreate = async (formData: LandRecordFormData) => {
    try {
      await createMutation.mutateAsync(formData);
      setIsCreateModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create record');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRecord) return;
    try {
      await updateMutation.mutateAsync({
        id: editRecord._id,
        data: {
          ownerName: editRecord.ownerName,
          surveyNumber: editRecord.surveyNumber,
          khasraNumber: editRecord.khasraNumber,
          khataNumber: editRecord.khataNumber,
          plotArea: editRecord.plotArea,
          village: editRecord.village,
          tehsil: editRecord.tehsil,
          district: editRecord.district,
          landClassification: editRecord.landClassification,
          ownershipType: editRecord.ownershipType,
        },
      });
      setEditRecord(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update record');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this land record?')) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err: any) {
      alert(err.message || 'Failed to delete record');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-6 h-6 text-blue-900" />
              {t('officerLandRecords.title', { defaultValue: 'Cadastral Land Records' })}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {t('officerLandRecords.subtitle', { defaultValue: 'Search, filter, and manage verified digital land records and ownership titles.' })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsQrScannerOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-700 shadow-xs"
            >
              <Camera className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              {t('landRecords.scanQr', { defaultValue: 'Scan Physical QR' })}
            </Button>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {t('landRecords.verifiedOnlyBadge', { defaultValue: 'Verified Documents Only' })}
            </span>
            {(isAdmin || isOfficer) && (
              <Button onClick={() => setIsCreateModalOpen(true)} className="sm:self-start">
                <Plus className="w-4 h-4 mr-1.5" />
                {t('officerLandRecords.addRecord', { defaultValue: 'Add Record' })}
              </Button>
            )}
          </div>
        </div>

        {/* Filter Toolbar */}
        <LandRecordFilterBar
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          districtFilter={districtFilter}
          onDistrictFilterChange={(val) => {
            setDistrictFilter(val);
            setPage(1);
          }}
          statusFilter={statusFilter}
          onStatusFilterChange={(val) => {
            setStatusFilter(val);
            setPage(1);
          }}
          classificationFilter={classificationFilter}
          onClassificationFilterChange={(val) => {
            setClassificationFilter(val);
            setPage(1);
          }}
          availableDistricts={filterMeta?.districts}
          availableClassifications={filterMeta?.classifications}
        />

        {/* Records Table & Pagination */}
        <LandRecordsTable
          isLoading={isLoading}
          isError={isError}
          errorMessage={(error as Error)?.message}
          records={data?.records}
          pagination={data?.pagination}
          currentPage={page}
          onPageChange={setPage}
          onViewRecord={setSelectedRecord}
          onEditRecord={setEditRecord}
          onDeleteRecord={handleDelete}
          onShowQr={(rec) => {
            const docForQr =
              typeof rec.sourceDocument === 'object' && rec.sourceDocument
                ? { ...rec.sourceDocument, landRecord: rec }
                : {
                    _id: rec._id,
                    documentId: (rec.registrationNumber || rec.mutationNumber || rec._id).slice(0, 24),
                    fileName: `Record-${rec.surveyNumber || rec._id}.pdf`,
                    originalName: `Record-${rec.surveyNumber || rec._id}.pdf`,
                    fileType: rec.landClassification || '7/12 Extract',
                    processingStatus: 'VERIFIED',
                    landRecord: rec,
                    createdAt: rec.createdAt,
                    updatedAt: rec.updatedAt,
                  };
            setQrRecordDoc(docForQr);
          }}
          canEdit={isAdmin || isOfficer || isVerifier}
          canDelete={isAdmin}
        />
      </div>

      {/* Create Record Dialog */}
      <CreateLandRecordModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
        isCreating={createMutation.isPending}
      />

      {/* Edit Record Dialog */}
      <EditLandRecordModal
        editRecord={editRecord}
        onClose={() => setEditRecord(null)}
        onUpdate={handleUpdate}
        onRecordChange={setEditRecord}
        isUpdating={updateMutation.isPending}
      />

      {/* View Record Details Dialog */}
      <ViewLandRecordModal
        selectedRecord={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      {/* Physical QR Scanner Modal */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
      />

      {/* Document Tamper-Proof QR & Adhesive Sticker Modal */}
      <DocumentQrModal
        document={qrRecordDoc}
        isOpen={Boolean(qrRecordDoc)}
        onClose={() => setQrRecordDoc(null)}
      />
    </AppLayout>
  );
}
