'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Filter,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  FileText,
  Building,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  X,
  Send,
  AlertTriangle,
  Scale,
  BadgeCheck,
} from 'lucide-react';
import { PortalLayout } from '../../../components/portal/PortalLayout';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Modal } from '../../../components/ui/Modal';
import { EmptyState } from '../../../components/ui/EmptyState';
import {
  complaintsService,
  UserComplaint,
  CreateComplaintInput,
} from '../../../services/complaints.service';
import { citizenService } from '../../../services/citizen.service';
import { CitizenProfile } from '../../../types/citizen';

const CATEGORY_MAP: Record<string, { labelKey: string; defaultLabel: string; color: string }> = {
  BOUNDARY_DISPUTE: {
    labelKey: 'complaints.catBoundary',
    defaultLabel: 'Boundary & Plot Discrepancy',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  FRAUDULENT_TRANSFER: {
    labelKey: 'complaints.catFraud',
    defaultLabel: 'Fraudulent / Unauthorized Transfer',
    color: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  VERIFICATION_DELAY: {
    labelKey: 'complaints.catDelay',
    defaultLabel: 'Verification Queue Delay',
    color: 'bg-sky-100 text-sky-800 border-sky-200',
  },
  FERFAR_ERROR: {
    labelKey: 'complaints.catFerfar',
    defaultLabel: 'Ferfar / Mutation Register Error',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
  NAME_MISMATCH: {
    labelKey: 'complaints.catName',
    defaultLabel: 'Khatedar Name / Modi Script Mismatch',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  OTHER: {
    labelKey: 'complaints.catOther',
    defaultLabel: 'General Cadastral Grievance',
    color: 'bg-slate-100 text-slate-800 border-slate-200',
  },
};

const SEVERITY_CONFIG: Record<string, { labelKey: string; defaultLabel: string; badge: string }> = {
  CRITICAL: {
    labelKey: 'complaints.severityCritical',
    defaultLabel: 'Critical (Fraudulent Mutation)',
    badge: 'bg-rose-50 text-rose-800 border-rose-300',
  },
  HIGH: {
    labelKey: 'complaints.severityHigh',
    defaultLabel: 'High (Encroachment / Boundary)',
    badge: 'bg-orange-50 text-orange-800 border-orange-300',
  },
  MEDIUM: {
    labelKey: 'complaints.severityMedium',
    defaultLabel: 'Medium (Administrative Delay)',
    badge: 'bg-amber-50 text-amber-800 border-amber-300',
  },
  LOW: {
    labelKey: 'complaints.severityLow',
    defaultLabel: 'Normal (Routine Clerical)',
    badge: 'bg-slate-50 text-slate-700 border-slate-200',
  },
};

export default function CitizenComplaintsPage() {
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState<UserComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals state
  const [isLodgeModalOpen, setIsLodgeModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<UserComplaint | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessId, setSubmitSuccessId] = useState<string | null>(null);

  // Profile data for pre-fill
  const [profile, setProfile] = useState<CitizenProfile | null>(null);

  // New complaint form state
  const [form, setForm] = useState<CreateComplaintInput>({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    district: 'Pune',
    tehsil: 'Haveli',
    village: 'Khadakwasla',
    category: 'BOUNDARY_DISPUTE',
    severity: 'MEDIUM',
    targetSurveyNumber: '',
    targetDocumentId: '',
    title: '',
    description: '',
  });

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const data = await complaintsService.getComplaints();
      setComplaints(data);
    } catch (err) {
      console.warn('Failed to load complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const prof = citizenService.getProfile();
    setProfile(prof);
    setForm((prev) => ({
      ...prev,
      applicantName: prof.name || 'Rahul Patil',
      applicantEmail: prof.email || 'rahul.patil@example.com',
      applicantPhone: prof.mobile || '+91 98220 12345',
      district: prof.district || 'Pune',
      tehsil: prof.taluka || 'Haveli',
      village: prof.village || 'Khadakwasla',
    }));

    loadComplaints();
  }, []);

  // Filtered complaints
  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchNum = c.complaintNumber?.toLowerCase().includes(q);
        const matchTitle = c.title?.toLowerCase().includes(q);
        const matchSurvey = c.targetSurveyNumber?.toLowerCase().includes(q);
        const matchVillage = c.village?.toLowerCase().includes(q);
        const matchDesc = c.description?.toLowerCase().includes(q);
        if (!matchNum && !matchTitle && !matchSurvey && !matchVillage && !matchDesc) {
          return false;
        }
      }
      return true;
    });
  }, [complaints, statusFilter, categoryFilter, search]);

  // Status Metrics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'PENDING').length;
  const investigatingCount = complaints.filter((c) => c.status === 'UNDER_INVESTIGATION').length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED').length;

  const handleLodgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.applicantName.trim() || !form.title.trim() || !form.description.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await complaintsService.createComplaint(form);
      setSubmitSuccessId(created.complaintNumber);

      // Add portal notification
      citizenService.addNotification({
        title: `Grievance Registered: ${created.complaintNumber}`,
        message: `Your dispute petition "${created.title.slice(0, 45)}..." on Gat ${created.targetSurveyNumber || 'N/A'} has been assigned to the revenue inspector.`,
        type: 'WARNING',
        link: '/portal/complaints',
      });

      // Reload
      await loadComplaints();

      setTimeout(() => {
        setIsLodgeModalOpen(false);
        setIsSubmitting(false);
        setSubmitSuccessId(null);
        // Reset non-contact inputs
        setForm((prev) => ({
          ...prev,
          title: '',
          description: '',
          targetSurveyNumber: '',
          targetDocumentId: '',
        }));
      }, 1200);
    } catch (err: any) {
      alert(err?.message || 'Failed to lodge complaint');
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5" />
            {t('complaints.statPending', { defaultValue: 'Pending Review' })}
          </span>
        );
      case 'UNDER_INVESTIGATION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-300">
            <ShieldAlert className="w-3.5 h-3.5" />
            {t('complaints.statInvestigating', { defaultValue: 'Under Investigation' })}
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t('complaints.statResolved', { defaultValue: 'Resolved & Closed' })}
          </span>
        );
      case 'DISMISSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-300">
            <XCircle className="w-3.5 h-3.5" />
            {t('complaints.statDismissed', { defaultValue: 'Dismissed' })}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <PortalLayout>
      {/* Page Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
            <Scale className="w-4 h-4 text-blue-900" />
            <span>{t('navbar.citizenPortal')}</span>
            <span>&bull;</span>
            <span className="text-amber-800">{t('complaints.badgeRtsa', { defaultValue: 'RTSA 2015' })}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {t('complaints.title', { defaultValue: 'Citizen Grievance & Cadastral Dispute Redressal' })}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            {t('complaints.subtitle', {
              defaultValue:
                'Lodge and track land disputes, mutation delays, boundary conflicts, and clerical corrections under the Maharashtra Right to Public Services Act.',
            })}
          </p>
        </div>

        <div className="flex-shrink-0">
          <Button
            variant="primary"
            onClick={() => setIsLodgeModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold border border-amber-400 shadow-sm gap-2 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{t('complaints.lodgeNew', { defaultValue: 'Lodge New Grievance' })}</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Grievances */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('complaints.totalLodged', { defaultValue: 'Total Lodged' })}
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-800">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{totalCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Official cadastral dispute petitions
          </p>
        </div>

        {/* Pending Review */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('complaints.pendingReview', { defaultValue: 'Pending Review' })}
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-800">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-2">{pendingCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Assigned to Revenue Circle Officer
          </p>
        </div>

        {/* Under Investigation */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('complaints.underInvestigation', { defaultValue: 'Under Investigation' })}
            </span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-800">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-sky-900 mt-2">{investigatingCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Cadastral survey & hearing notices active
          </p>
        </div>

        {/* Resolved & Sealed */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t('complaints.resolvedSealed', { defaultValue: 'Resolved & Closed' })}
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2">{resolvedCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Statutory order issued & records updated
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('complaints.searchPlaceholder', {
                defaultValue: 'Search by Complaint #, Survey / Gat #, Village, or Keyword...',
              })}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs sm:text-sm rounded-lg border border-slate-200 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 bg-white"
            >
              <option value="ALL">{t('complaints.allCategories', { defaultValue: 'All Categories' })}</option>
              <option value="BOUNDARY_DISPUTE">{t('complaints.catBoundary', { defaultValue: 'Boundary & Plot Discrepancy' })}</option>
              <option value="FRAUDULENT_TRANSFER">{t('complaints.catFraud', { defaultValue: 'Fraudulent / Unauthorized Transfer' })}</option>
              <option value="VERIFICATION_DELAY">{t('complaints.catDelay', { defaultValue: 'Verification Queue Delay' })}</option>
              <option value="FERFAR_ERROR">{t('complaints.catFerfar', { defaultValue: 'Ferfar / Mutation Register Error' })}</option>
              <option value="NAME_MISMATCH">{t('complaints.catName', { defaultValue: 'Khatedar Name / Modi Script Mismatch' })}</option>
              <option value="OTHER">{t('complaints.catOther', { defaultValue: 'General Cadastral Grievance' })}</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
          {[
            { id: 'ALL', label: t('complaints.allStatus', { defaultValue: 'All Statuses' }), count: totalCount },
            { id: 'PENDING', label: t('complaints.statPending', { defaultValue: 'Pending Review' }), count: pendingCount },
            { id: 'UNDER_INVESTIGATION', label: t('complaints.statInvestigating', { defaultValue: 'Under Investigation' }), count: investigatingCount },
            { id: 'RESOLVED', label: t('complaints.statResolved', { defaultValue: 'Resolved & Closed' }), count: resolvedCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  statusFilter === tab.id ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-900 border-t-transparent" />
            <p className="text-xs mt-3">Loading grievance petitions from revenue repository...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-8">
            <EmptyState
              title={t('complaints.emptyTitle', { defaultValue: 'No Grievances Found' })}
              description={t('complaints.emptyDesc', {
                defaultValue:
                  'No dispute tickets match your current filters. Click "Lodge New Grievance" to file a petition.',
              })}
              action={
                <Button
                  variant="primary"
                  onClick={() => setIsLodgeModalOpen(true)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  {t('complaints.lodgeNew', { defaultValue: 'Lodge New Grievance' })}
                </Button>
              }
            />
          </div>
        ) : (
          filtered.map((item) => {
            const cat = CATEGORY_MAP[item.category] || CATEGORY_MAP.OTHER;
            const sev = SEVERITY_CONFIG[item.severity] || SEVERITY_CONFIG.MEDIUM;

            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-950 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                      {item.complaintNumber}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${cat.color}`}>
                      {t(cat.labelKey, { defaultValue: cat.defaultLabel })}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${sev.badge}`}>
                      {item.severity}
                    </span>
                  </div>

                  <div>{getStatusBadge(item.status)}</div>
                </div>

                <div className="py-3">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Cadastral & Officer Meta */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 border-t border-slate-100 text-xs text-slate-600 bg-slate-50/50 -mx-5 px-5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>
                      Gat: <strong className="text-slate-900">{item.targetSurveyNumber || '—'}</strong> ({item.village}, {item.tehsil})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>
                      Officer: <strong className="text-slate-900">{item.investigatingOfficer || 'Revenue Duty Officer'}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>
                      Lodged: {new Date(item.filedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Latest remarks & action */}
                <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {item.resolutionRemarks ? (
                    <div className="text-xs text-slate-700 flex items-start gap-1.5">
                      <BadgeCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900">Latest Order: </span>
                        <span className="text-slate-600 italic">"{item.resolutionRemarks}"</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500">
                      Under statutory inquiry with Taluka revenue authority.
                    </div>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedComplaint(item)}
                    className="text-xs font-semibold text-blue-900 border-blue-200 hover:bg-blue-50 self-end sm:self-auto gap-1"
                  >
                    <span>View Dossier & Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: LODGE GRIEVANCE */}
      <Modal
        isOpen={isLodgeModalOpen}
        onClose={() => !isSubmitting && setIsLodgeModalOpen(false)}
        title={t('complaints.lodgeModalTitle', { defaultValue: 'Lodge Land Dispute or Revenue Grievance' })}
      >
        {submitSuccessId ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Grievance Registered Successfully!
            </h3>
            <p className="text-xs text-slate-600">
              Your petition has been assigned statutory docket number:
            </p>
            <div className="font-mono text-sm font-bold bg-slate-100 py-1.5 px-4 rounded border border-slate-200 inline-block text-blue-950">
              {submitSuccessId}
            </div>
            <p className="text-[11px] text-slate-500">
              Under RTSA, the inquiry officer must initiate scrutiny within 7 working days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLodgeSubmit} className="space-y-4">
            <p className="text-xs text-slate-600">
              {t('complaints.lodgeModalDesc', {
                defaultValue:
                  'Your petition will be assigned a statutory tracking number and routed to the Sub-Divisional Revenue Officer.',
              })}
            </p>

            {/* Applicant Details (Pre-filled from citizen profile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block">Applicant Name</label>
                <input
                  type="text"
                  required
                  value={form.applicantName}
                  onChange={(e) => setForm({ ...form, applicantName: e.target.value })}
                  className="w-full mt-1 p-2 rounded border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block">Mobile Number</label>
                <input
                  type="text"
                  value={form.applicantPhone}
                  onChange={(e) => setForm({ ...form, applicantPhone: e.target.value })}
                  className="w-full mt-1 p-2 rounded border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block">District & Taluka</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="w-1/2 p-2 rounded border border-slate-200 bg-white"
                    placeholder="District"
                  />
                  <input
                    type="text"
                    value={form.tehsil}
                    onChange={(e) => setForm({ ...form, tehsil: e.target.value })}
                    className="w-1/2 p-2 rounded border border-slate-200 bg-white"
                    placeholder="Taluka"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block">Village</label>
                <input
                  type="text"
                  value={form.village}
                  onChange={(e) => setForm({ ...form, village: e.target.value })}
                  className="w-full mt-1 p-2 rounded border border-slate-200 bg-white"
                />
              </div>
            </div>

            {/* Dispute Category & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block">
                  Dispute Category <span className="text-rose-600">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full mt-1 p-2 rounded border border-slate-200 bg-white text-xs"
                >
                  <option value="BOUNDARY_DISPUTE">Boundary & Plot Discrepancy</option>
                  <option value="FRAUDULENT_TRANSFER">Fraudulent / Unauthorized Transfer</option>
                  <option value="VERIFICATION_DELAY">Verification Queue Delay</option>
                  <option value="FERFAR_ERROR">Ferfar / Mutation Register Error</option>
                  <option value="NAME_MISMATCH">Khatedar Name / Modi Script Mismatch</option>
                  <option value="OTHER">General Cadastral Grievance</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block">
                  Urgency Level <span className="text-rose-600">*</span>
                </label>
                <select
                  value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: e.target.value as any })}
                  className="w-full mt-1 p-2 rounded border border-slate-200 bg-white text-xs"
                >
                  <option value="LOW">Normal (Routine Clerical)</option>
                  <option value="MEDIUM">Medium (Administrative Delay)</option>
                  <option value="HIGH">High (Encroachment / Boundary Dispute)</option>
                  <option value="CRITICAL">Critical (Fraudulent Mutation Entry)</option>
                </select>
              </div>
            </div>

            {/* Land Parcel Ref */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block">
                  Survey / Gat Number <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 108/4 or 241/1A"
                  value={form.targetSurveyNumber}
                  onChange={(e) => setForm({ ...form, targetSurveyNumber: e.target.value })}
                  className="w-full mt-1 p-2 rounded border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block">
                  Related Application ID / Ferfar # (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ILRDVS-2026-000124 or Ferfar 4921"
                  value={form.targetDocumentId}
                  onChange={(e) => setForm({ ...form, targetDocumentId: e.target.value })}
                  className="w-full mt-1 p-2 rounded border border-slate-200 bg-white"
                />
              </div>
            </div>

            {/* Subject / Title */}
            <div className="text-xs">
              <label className="font-semibold text-slate-700 block">
                Grievance Subject / Brief Title <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Brief summary of dispute or clerical issue"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full mt-1 p-2 rounded border border-slate-200 bg-white"
              />
            </div>

            {/* Narrative Description */}
            <div className="text-xs">
              <label className="font-semibold text-slate-700 block">
                Detailed Narrative of Dispute / Irregularity <span className="text-rose-600">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Describe dates, adverse boundary encroachment, partition order discrepancies, or why the record requires correction..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full mt-1 p-2 rounded border border-slate-200 bg-white text-xs leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLodgeModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="bg-blue-900 hover:bg-blue-800 text-white font-bold gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Grievance</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* MODAL 2: GRIEVANCE DOSSIER & STATUTORY TIMELINE */}
      {selectedComplaint && (
        <Modal
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          title={`Grievance Dossier: ${selectedComplaint.complaintNumber}`}
        >
          <div className="space-y-5 text-xs">
            {/* Header info bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Case Status</span>
                <div className="mt-1">{getStatusBadge(selectedComplaint.status)}</div>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Dispute Category</span>
                <div className="font-bold text-slate-900 mt-1">
                  {CATEGORY_MAP[selectedComplaint.category]?.defaultLabel || selectedComplaint.category}
                </div>
              </div>
              <div>
                <span className="text-slate-500 font-semibold uppercase text-[10px]">Target Land Parcel</span>
                <div className="font-bold text-slate-900 mt-1">
                  Gat #{selectedComplaint.targetSurveyNumber || 'N/A'}, {selectedComplaint.village}
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <div className="p-4 bg-white rounded-lg border border-slate-200 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">{selectedComplaint.title}</h4>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{selectedComplaint.description}</p>
            </div>

            {/* Investigating Officer & Remarks */}
            <div className="p-4 rounded-lg border border-blue-200 bg-blue-50/50 space-y-2">
              <div className="flex items-center gap-2 text-blue-950 font-bold">
                <ShieldCheck className="w-4 h-4 text-blue-900" />
                <span>Assigned Revenue Authority</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-slate-500">Inquiry Officer:</span>{' '}
                  <strong className="text-slate-900">{selectedComplaint.investigatingOfficer || 'Tahsildar / TILR Haveli'}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Jurisdiction:</span>{' '}
                  <strong className="text-slate-900">{selectedComplaint.tehsil}, {selectedComplaint.district}</strong>
                </div>
              </div>

              {selectedComplaint.resolutionRemarks && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <span className="font-bold text-blue-950">Official Order / Inquiry Finding:</span>
                  <p className="text-slate-800 italic mt-1 bg-white p-2.5 rounded border border-blue-200">
                    "{selectedComplaint.resolutionRemarks}"
                  </p>
                </div>
              )}
            </div>

            {/* 4-Stage Statutory Timeline */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                Statutory Redressal Timeline (RTSA 2015)
              </h4>

              <div className="space-y-3 pl-2">
                {/* Step 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Grievance Petition Lodged & Docket Issued</div>
                    <div className="text-[11px] text-slate-500">
                      {new Date(selectedComplaint.filedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} &bull; Docket #{selectedComplaint.complaintNumber}
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                      selectedComplaint.status !== 'PENDING'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {selectedComplaint.status !== 'PENDING' ? '✓' : '2'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Assigned to Sub-Divisional Inquiry Officer</div>
                    <div className="text-[11px] text-slate-500">
                      {selectedComplaint.investigatingOfficer || 'Competent Revenue Officer'} conducting preliminary review of digital cadastral maps and Ferfar register.
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                      selectedComplaint.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedComplaint.status === 'UNDER_INVESTIGATION'
                        ? 'bg-blue-900 text-white animate-pulse'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {selectedComplaint.status === 'RESOLVED' ? '✓' : '3'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Field Boundary Survey & Parties Hearing</div>
                    <div className="text-[11px] text-slate-500">
                      {selectedComplaint.status === 'UNDER_INVESTIGATION'
                        ? 'Active hearing notices dispatched to Khatedars and village Talathi.'
                        : 'Physical verification and statement deposition on record.'}
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 ${
                      selectedComplaint.status === 'RESOLVED'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {selectedComplaint.status === 'RESOLVED' ? '✓' : '4'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Statutory Order Issued & Record Rectified</div>
                    <div className="text-[11px] text-slate-500">
                      {selectedComplaint.status === 'RESOLVED'
                        ? `Resolved and signed on ${selectedComplaint.resolvedAt ? new Date(selectedComplaint.resolvedAt).toLocaleDateString('en-GB') : 'Record'}. Certified digital extract updated.`
                        : 'Final quasi-judicial revenue order pending inquiry closure.'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200">
              <Button variant="primary" onClick={() => setSelectedComplaint(null)}>
                Close Dossier
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PortalLayout>
  );
}
