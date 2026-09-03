'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate } from '../../lib/utils';
import { LandRecord } from '../../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LandRecordFormSchema, LandRecordFormData } from '../../schemas/land-record.schema';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  MapPin,
  TrendingUp,
} from 'lucide-react';

export default function LandRecordsPage() {
  const { isAdmin, isOfficer, isVerifier } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<LandRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<LandRecord | null>(null);

  const { data, isLoading, isError, error } = useLandRecordsQuery({
    page,
    limit: 10,
    search: search || undefined,
    district: districtFilter || undefined,
    status: statusFilter || undefined,
    landClassification: classificationFilter || undefined,
  });

  const { data: filterMeta } = useFilterMetadataQuery();

  const createMutation = useCreateLandRecordMutation();
  const updateMutation = useUpdateLandRecordMutation();
  const deleteMutation = useDeleteLandRecordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LandRecordFormData>({
    resolver: zodResolver(LandRecordFormSchema),
    defaultValues: {
      district: 'Pune',
      tehsil: 'Haveli',
      village: 'Khadakwasla',
      landClassification: 'Agricultural (Jirayat)',
      ownershipType: 'Single Owner',
      confidenceScore: 0.94,
    },
  });

  const handleCreate = async (formData: LandRecordFormData) => {
    try {
      await createMutation.mutateAsync(formData);
      setIsCreateModalOpen(false);
      reset();
    } catch (err: any) {
      alert(err.message || 'Failed to create record');
    }
  };

  const handleOpenEdit = (rec: LandRecord) => {
    setEditRecord(rec);
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
              Digitized Land Records Catalog
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Searchable registry indexed by Survey Number, Khasra, Khata, and Land Classifications.
            </p>
          </div>

          {(isAdmin || isOfficer) && (
            <Button onClick={() => setIsCreateModalOpen(true)} className="sm:self-start">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Land Record
            </Button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="gov-card p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by owner, survey #, khasra, village..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={districtFilter}
              onChange={(e) => {
                setDistrictFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-blue-900"
            >
              <option value="">All Districts</option>
              {filterMeta?.districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-blue-900"
            >
              <option value="">All Verification Statuses</option>
              <option value="VERIFIED">Verified</option>
              <option value="PENDING">Pending</option>
              <option value="NEEDS_REVIEW">Needs Review</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <select
              value={classificationFilter}
              onChange={(e) => {
                setClassificationFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-blue-900"
            >
              <option value="">All Classifications</option>
              {filterMeta?.classifications.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table of Records */}
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
              {(error as Error)?.message || 'Failed to load land records'}
            </div>
          )}

          {data && data.records.length === 0 && (
            <EmptyState
              title="No Land Records Found"
              description="No digital land records match your search or filter parameters."
            />
          )}

          {data && data.records.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                    <tr>
                      <th className="px-5 py-3.5">Owner Details</th>
                      <th className="px-4 py-3.5">Survey #</th>
                      <th className="px-4 py-3.5">Khasra / Khata</th>
                      <th className="px-4 py-3.5">Location</th>
                      <th className="px-4 py-3.5">Area</th>
                      <th className="px-4 py-3.5">Classification</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5">Confidence</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.records.map((rec) => (
                      <tr key={rec._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-900">{rec.ownerName}</div>
                          <div className="text-[10px] text-slate-400">{rec.ownershipType}</div>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-800 font-bold">
                          {rec.surveyNumber}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-[11px] text-slate-600">
                          <div>{rec.khasraNumber}</div>
                          <div className="text-[10px] text-slate-400">{rec.khataNumber}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="text-slate-800 font-medium">{rec.village}</div>
                          <div className="text-[10px] text-slate-400">
                            {rec.tehsil}, {rec.district}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-900">{rec.plotArea}</td>
                        <td className="px-4 py-3.5 text-slate-700">{rec.landClassification}</td>
                        <td className="px-4 py-3.5">
                          <Badge status={rec.verificationStatus} />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`text-xs font-bold ${
                                rec.confidenceScore >= 0.9
                                  ? 'text-emerald-700'
                                  : rec.confidenceScore >= 0.75
                                  ? 'text-amber-700'
                                  : 'text-rose-700'
                              }`}
                            >
                              {(rec.confidenceScore * 100).toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedRecord(rec)}
                              className="p-1.5 text-slate-500 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {(isAdmin || isOfficer || isVerifier) && (
                              <button
                                onClick={() => handleOpenEdit(rec)}
                                className="p-1.5 text-slate-500 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                                title="Edit Record"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}
                            {isAdmin && (
                              <button
                                onClick={() => handleDelete(rec._id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                title="Delete Record"
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

      {/* Create Land Record Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Digitize New Land Record"
        description="Enter legal cadastral details from archival registers or verified documents."
        maxWidth="2xl"
      >
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Primary Owner Name"
              placeholder="e.g. Ramesh Shankar Patil"
              error={errors.ownerName?.message}
              {...register('ownerName')}
            />
            <Input
              label="Ownership Type"
              placeholder="e.g. Single Owner, Joint Ownership"
              error={errors.ownershipType?.message}
              {...register('ownershipType')}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Survey Number"
              placeholder="e.g. 104/2A"
              error={errors.surveyNumber?.message}
              {...register('surveyNumber')}
            />
            <Input
              label="Khasra Number"
              placeholder="e.g. KH-2045"
              error={errors.khasraNumber?.message}
              {...register('khasraNumber')}
            />
            <Input
              label="Khata Number"
              placeholder="e.g. KT-512"
              error={errors.khataNumber?.message}
              {...register('khataNumber')}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Village (Gram)"
              placeholder="e.g. Khadakwasla"
              error={errors.village?.message}
              {...register('village')}
            />
            <Input
              label="Tehsil (Taluka)"
              placeholder="e.g. Haveli"
              error={errors.tehsil?.message}
              {...register('tehsil')}
            />
            <Input
              label="District"
              placeholder="e.g. Pune"
              error={errors.district?.message}
              {...register('district')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Plot Area"
              placeholder="e.g. 2.5 Hectares / 4.1 Acres"
              error={errors.plotArea?.message}
              {...register('plotArea')}
            />
            <Input
              label="Land Classification"
              placeholder="e.g. Agricultural (Jirayat)"
              error={errors.landClassification?.message}
              {...register('landClassification')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Mutation Number (Optional)"
              placeholder="e.g. MUT-2025-9120"
              {...register('mutationNumber')}
            />
            <Input
              label="Registration Number (Optional)"
              placeholder="e.g. MH-REG-3041"
              {...register('registrationNumber')}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending}>
              Register Land Record
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Land Record Modal */}
      {editRecord && (
        <Modal
          isOpen={!!editRecord}
          onClose={() => setEditRecord(null)}
          title={`Edit Land Record #${editRecord.surveyNumber}`}
          description={`Update cadastral metadata for ${editRecord.ownerName}`}
          maxWidth="2xl"
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Primary Owner Name"
                value={editRecord.ownerName}
                onChange={(e) => setEditRecord({ ...editRecord, ownerName: e.target.value })}
              />
              <Input
                label="Ownership Type"
                value={editRecord.ownershipType}
                onChange={(e) => setEditRecord({ ...editRecord, ownershipType: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Survey Number"
                value={editRecord.surveyNumber}
                onChange={(e) => setEditRecord({ ...editRecord, surveyNumber: e.target.value })}
              />
              <Input
                label="Khasra Number"
                value={editRecord.khasraNumber}
                onChange={(e) => setEditRecord({ ...editRecord, khasraNumber: e.target.value })}
              />
              <Input
                label="Khata Number"
                value={editRecord.khataNumber}
                onChange={(e) => setEditRecord({ ...editRecord, khataNumber: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Village"
                value={editRecord.village}
                onChange={(e) => setEditRecord({ ...editRecord, village: e.target.value })}
              />
              <Input
                label="Tehsil"
                value={editRecord.tehsil}
                onChange={(e) => setEditRecord({ ...editRecord, tehsil: e.target.value })}
              />
              <Input
                label="District"
                value={editRecord.district}
                onChange={(e) => setEditRecord({ ...editRecord, district: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Plot Area"
                value={editRecord.plotArea}
                onChange={(e) => setEditRecord({ ...editRecord, plotArea: e.target.value })}
              />
              <Input
                label="Land Classification"
                value={editRecord.landClassification}
                onChange={(e) => setEditRecord({ ...editRecord, landClassification: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="outline" onClick={() => setEditRecord(null)}>
                Cancel
              </Button>
              <Button type="submit" isLoading={updateMutation.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Record Details Modal */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title={`Cadastral Record Details &mdash; Survey #${selectedRecord.surveyNumber}`}
          description={`${selectedRecord.village}, ${selectedRecord.tehsil}, ${selectedRecord.district}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Owner Name:</span>
                <div className="font-semibold text-slate-900 mt-0.5">{selectedRecord.ownerName}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Ownership Type:</span>
                <div className="font-semibold text-slate-900 mt-0.5">{selectedRecord.ownershipType}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Survey Number:</span>
                <div className="font-bold text-blue-900 font-mono mt-0.5">{selectedRecord.surveyNumber}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Khasra Number:</span>
                <div className="font-semibold font-mono text-slate-900 mt-0.5">{selectedRecord.khasraNumber}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Khata Number:</span>
                <div className="font-semibold font-mono text-slate-900 mt-0.5">{selectedRecord.khataNumber}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Plot Area:</span>
                <div className="font-semibold text-slate-900 mt-0.5">{selectedRecord.plotArea}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Classification:</span>
                <div className="font-semibold text-slate-900 mt-0.5">{selectedRecord.landClassification}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Verification Status:</span>
                <div className="mt-1">
                  <Badge status={selectedRecord.verificationStatus} />
                </div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Confidence Score:</span>
                <div className="font-bold text-emerald-700 mt-0.5">
                  {(selectedRecord.confidenceScore * 100).toFixed(0)}% Match
                </div>
              </div>
            </div>

            {selectedRecord.remarks && (
              <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                <span className="font-semibold">Inspector / Verifier Remarks:</span>
                <p className="mt-1 text-slate-700">{selectedRecord.remarks}</p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <Link href="/verification">
                <Button size="sm" variant="outline" className="text-xs">
                  Inspect in Verification Workstation &rarr;
                </Button>
              </Link>
              <Button variant="primary" size="sm" onClick={() => setSelectedRecord(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}
