'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '../../../components/layout/AppLayout';
import {
  Database,
  Plus,
  Search,
  Building2,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  X,
} from 'lucide-react';
import {
  documentVerificationService,
  DemoCadastralRecord,
} from '../../../services/documentVerification.service';

export default function AdminLandRecordsPage() {
  const { t } = useTranslation();
  const [records, setRecords] = useState<DemoCadastralRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DemoCadastralRecord | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<DemoCadastralRecord>>({
    recordId: '',
    ownerName: '',
    surveyNumber: '',
    gatNumber: '',
    plotArea: '1.00 Hectares',
    village: '',
    tehsil: '',
    district: 'Pune',
    landClassification: 'Agricultural (Jirayat)',
    mutationNumber: '',
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const data = await documentVerificationService.getDemoRecords();
      setRecords(data);
    } catch (err) {
      console.error('Failed to load demo records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingRecord(null);
    setFormData({
      recordId: `LR-${Date.now().toString().slice(-4)}`,
      ownerName: '',
      surveyNumber: '',
      gatNumber: '',
      plotArea: '1.00 Hectares',
      village: '',
      tehsil: '',
      district: 'Pune',
      landClassification: 'Agricultural (Jirayat)',
      mutationNumber: `MUT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rec: DemoCadastralRecord) => {
    setEditingRecord(rec);
    setFormData({ ...rec });
    setIsModalOpen(true);
  };

  const handleDelete = async (recordId: string) => {
    if (!confirm(`Are you sure you want to delete demo reference record ${recordId}?`)) return;
    try {
      await documentVerificationService.deleteDemoRecord(recordId);
      setRecords((prev) => prev.filter((r) => r.recordId !== recordId));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete demo record');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        const updated = await documentVerificationService.updateDemoRecord(
          editingRecord.recordId,
          formData
        );
        setRecords((prev) =>
          prev.map((r) => (r.recordId === editingRecord.recordId ? { ...r, ...formData } : r))
        );
      } else {
        const created = await documentVerificationService.createDemoRecord(formData);
        setRecords((prev) => [created || (formData as DemoCadastralRecord), ...prev]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Save failed:', err);
      alert(err.message || 'Failed to save demo record');
    }
  };

  const filteredRecords = records.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.recordId.toLowerCase().includes(q) ||
      r.ownerName.toLowerCase().includes(q) ||
      r.surveyNumber.toLowerCase().includes(q) ||
      r.village.toLowerCase().includes(q)
    );
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Prototype Reference Environment
              </span>
              <span className="text-xs text-slate-400">Section 149 MLRC Official Registry Simulator</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Cadastral Reference Records</h1>
            <p className="text-sm text-slate-400 mt-1">
              Authoritative government cadastral datasets used for AI cross-checking and owner title validation.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-sky-600/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Demo Reference Record
          </button>
        </div>

        {/* Search */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by Record ID, Owner Name, Survey Number, Village..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Records Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <div className="inline-block animate-spin w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full mb-2"></div>
              <p className="text-sm">Loading cadastral records...</p>
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Database className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-medium text-slate-300">No cadastral records found</p>
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-lg bg-sky-600 text-white text-xs font-semibold"
              >
                Create First Record
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Record ID</th>
                    <th className="px-5 py-3">Khatedar (Owner)</th>
                    <th className="px-5 py-3">Survey / Gat No.</th>
                    <th className="px-5 py-3">Village & Taluka</th>
                    <th className="px-5 py-3">Plot Area</th>
                    <th className="px-5 py-3">Classification</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredRecords.map((rec) => (
                    <tr key={rec.recordId} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs font-semibold text-sky-400">
                        {rec.recordId}
                        <div className="text-[10px] text-slate-500 font-sans">DEMO RECORD</div>
                      </td>
                      <td className="px-5 py-4 font-medium text-white">{rec.ownerName}</td>
                      <td className="px-5 py-4 text-slate-200">{rec.surveyNumber}</td>
                      <td className="px-5 py-4 text-slate-300">
                        {rec.village}, {rec.tehsil} ({rec.district})
                      </td>
                      <td className="px-5 py-4 text-emerald-400 font-medium">{rec.plotArea}</td>
                      <td className="px-5 py-4 text-xs text-slate-400">{rec.landClassification}</td>
                      <td className="px-5 py-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(rec)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(rec.recordId)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Create or Edit Record */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-white">
                  {editingRecord ? 'Edit Cadastral Reference Record' : 'New Cadastral Reference Record'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-sm">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Record ID</label>
                  <input
                    type="text"
                    value={formData.recordId}
                    onChange={(e) => setFormData({ ...formData, recordId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Owner Name (Khatedar)</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Survey / Gat No.</label>
                    <input
                      type="text"
                      value={formData.surveyNumber}
                      onChange={(e) => setFormData({ ...formData, surveyNumber: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Plot Area</label>
                    <input
                      type="text"
                      value={formData.plotArea}
                      onChange={(e) => setFormData({ ...formData, plotArea: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Village</label>
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Taluka</label>
                    <input
                      type="text"
                      value={formData.tehsil}
                      onChange={(e) => setFormData({ ...formData, tehsil: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">District</label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
