import React, { useState, useMemo } from 'react';
import {
  useComplaintsQuery,
  useCreateComplaintMutation,
  useUpdateComplaintStatusMutation,
} from '../../hooks/useComplaints';
import { UserComplaint, CreateComplaintInput } from '../../services/complaints.service';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { formatDate } from '../../lib/utils';
import {
  AlertCircle,
  ShieldAlert,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  FileSpreadsheet,
  Building,
  UserCheck,
  Send,
  MessageSquare,
} from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  BOUNDARY_DISPUTE: 'Boundary & Survey Plot Discrepancy',
  FRAUDULENT_TRANSFER: 'Fraudulent / Unauthorized Transfer',
  VERIFICATION_DELAY: 'Verification Queue Delay',
  FERFAR_ERROR: 'Ferfar / Mutation Register Error',
  NAME_MISMATCH: 'Khatedar Name / Modi Script Mismatch',
  OTHER: 'General Cadastral Grievance',
};

const SEVERITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CRITICAL: { bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-300' },
  HIGH: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-300' },
  MEDIUM: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300' },
  LOW: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
};

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; icon: React.FC<{ className?: string }> }
> = {
  PENDING: {
    label: 'Pending Review',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-300',
    icon: Clock,
  },
  UNDER_INVESTIGATION: {
    label: 'Under Investigation',
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-300',
    icon: ShieldAlert,
  },
  RESOLVED: {
    label: 'Resolved & Closed',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-300',
    icon: CheckCircle2,
  },
  DISMISSED: {
    label: 'Dismissed',
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-300',
    icon: XCircle,
  },
};

export const UserComplaintsTab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  // Modals state
  const [isLodgeModalOpen, setIsLodgeModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<UserComplaint | null>(null);

  // New Complaint Form state
  const [lodgeForm, setLodgeForm] = useState<CreateComplaintInput>({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    district: 'Pune',
    tehsil: '',
    village: '',
    category: 'BOUNDARY_DISPUTE',
    severity: 'MEDIUM',
    targetDocumentId: '',
    targetSurveyNumber: '',
    title: '',
    description: '',
  });

  // Resolution Form state
  const [resolutionStatus, setResolutionStatus] = useState<string>('RESOLVED');
  const [resolutionRemarks, setResolutionRemarks] = useState<string>('');
  const [investigatingOfficer, setInvestigatingOfficer] = useState<string>('');

  const { data: complaints = [], isLoading, isError, error } = useComplaintsQuery();

  const createMutation = useCreateComplaintMutation();
  const updateStatusMutation = useUpdateComplaintStatusMutation();

  // Filtered complaints
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;
      if (severityFilter !== 'ALL' && c.severity !== severityFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          c.complaintNumber.toLowerCase().includes(q) ||
          c.applicantName.toLowerCase().includes(q) ||
          c.applicantEmail.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.village.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          (c.targetSurveyNumber && c.targetSurveyNumber.toLowerCase().includes(q)) ||
          (c.targetDocumentId && c.targetDocumentId.toLowerCase().includes(q));

        if (!matches) return false;
      }

      return true;
    });
  }, [complaints, statusFilter, categoryFilter, severityFilter, search]);

  // Statistics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter((c) => c.status === 'PENDING').length;
  const investigatingCount = complaints.filter((c) => c.status === 'UNDER_INVESTIGATION').length;
  const resolvedCount = complaints.filter((c) => c.status === 'RESOLVED').length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  // Handle open resolution modal
  const handleOpenResolution = (complaint: UserComplaint) => {
    setSelectedComplaint(complaint);
    setResolutionStatus(complaint.status === 'PENDING' ? 'UNDER_INVESTIGATION' : complaint.status);
    setResolutionRemarks(complaint.resolutionRemarks || '');
    setInvestigatingOfficer(complaint.investigatingOfficer || 'Revenue Inquiry Officer');
  };

  // Submit resolution
  const handleSubmitResolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    try {
      await updateStatusMutation.mutateAsync({
        id: selectedComplaint.id,
        status: resolutionStatus,
        resolutionRemarks,
        investigatingOfficer,
      });
      setSelectedComplaint(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update complaint status');
    }
  };

  // Submit new complaint
  const handleLodgeComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lodgeForm.applicantName || !lodgeForm.title || !lodgeForm.description) {
      alert('Please fill in applicant name, title, and description');
      return;
    }

    try {
      await createMutation.mutateAsync(lodgeForm);
      setIsLodgeModalOpen(false);
      setLodgeForm({
        applicantName: '',
        applicantEmail: '',
        applicantPhone: '',
        district: 'Pune',
        tehsil: '',
        village: '',
        category: 'BOUNDARY_DISPUTE',
        severity: 'MEDIUM',
        targetDocumentId: '',
        targetSurveyNumber: '',
        title: '',
        description: '',
      });
    } catch (err: any) {
      alert(err.message || 'Failed to lodge complaint');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Grievances
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{totalCount}</div>
          <div className="mt-1 text-[11px] text-slate-400">Citizen & official filings</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Redressal
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-amber-700">{pendingCount}</div>
          <div className="mt-1 text-[11px] text-amber-600 font-medium">
            Requires initial review
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Under Investigation
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-blue-700">{investigatingCount}</div>
          <div className="mt-1 text-[11px] text-slate-400">Assigned to SDO/TILR officers</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Resolution Rate
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-700">{resolutionRate}%</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">
            {resolvedCount} resolved cases closed
          </div>
        </div>
      </div>

      {/* Filter Toolbar & Actions */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Complaint ID, Citizen Name, Survey #, Village, or Keyword..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Review</option>
              <option value="UNDER_INVESTIGATION">Under Investigation</option>
              <option value="RESOLVED">Resolved & Closed</option>
              <option value="DISMISSED">Dismissed</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="FRAUDULENT_TRANSFER">Fraudulent / Unauthorized Transfer</option>
              <option value="BOUNDARY_DISPUTE">Boundary & Plot Discrepancy</option>
              <option value="VERIFICATION_DELAY">Verification Queue Delay</option>
              <option value="FERFAR_ERROR">Ferfar / Mutation Register Error</option>
              <option value="NAME_MISMATCH">Khatedar Name Mismatch</option>
              <option value="OTHER">Other Grievance</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <Button
              onClick={() => setIsLodgeModalOpen(true)}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs shrink-0"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Lodge Citizen Grievance
            </Button>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="gov-card overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 text-center text-rose-600 text-xs font-semibold">
            {(error as Error)?.message || 'Failed to load complaints'}
          </div>
        ) : filteredComplaints.length === 0 ? (
          <EmptyState
            title="No Citizen Grievances Found"
            description="There are currently no complaints matching your selected criteria."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Grievance #</th>
                  <th className="px-4 py-3.5">Complainant</th>
                  <th className="px-4 py-3.5">Category & Subject</th>
                  <th className="px-4 py-3.5">Cadastral Target</th>
                  <th className="px-4 py-3.5">Severity</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Filed Date</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.map((c) => {
                  const statusInfo = STATUS_CONFIG[c.status] || STATUS_CONFIG.PENDING;
                  const severityStyle = SEVERITY_COLORS[c.severity] || SEVERITY_COLORS.MEDIUM;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 font-mono text-[11px] font-bold text-slate-900">
                        {c.complaintNumber}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-900">{c.applicantName}</div>
                        <div className="text-[10px] text-slate-400">
                          {c.applicantPhone} • {c.district}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 max-w-xs">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          {CATEGORY_LABELS[c.category] || c.category}
                        </span>
                        <div className="font-medium text-slate-800 text-xs mt-1 truncate" title={c.title}>
                          {c.title}
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-[11px]">
                        {c.targetSurveyNumber ? (
                          <div>
                            <span className="font-bold text-slate-900">
                              Survey #{c.targetSurveyNumber}
                            </span>
                            <div className="text-[10px] text-slate-500">
                              {c.village || '—'}, {c.district}
                            </div>
                          </div>
                        ) : c.targetDocumentId ? (
                          <span className="font-mono text-[10px] text-slate-700">
                            {c.targetDocumentId}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">General Registry</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center text-[10px] font-black uppercase px-2 py-0.5 rounded border ${severityStyle.bg} ${severityStyle.text} ${severityStyle.border}`}
                        >
                          {c.severity}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                        >
                          <StatusIcon className="w-3 h-3 shrink-0" />
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                        {formatDate(c.filedAt)}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenResolution(c)}
                          className="text-xs h-7 text-blue-900 hover:bg-blue-50 font-semibold"
                        >
                          Inspect & Resolve
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: LODGE CITIZEN GRIEVANCE */}
      <Modal
        isOpen={isLodgeModalOpen}
        onClose={() => setIsLodgeModalOpen(false)}
        title="Lodge Citizen Grievance & Cadastral Dispute"
        description="Register a formal inquiry or claim regarding land records, mutation entries, or survey boundaries."
        maxWidth="lg"
      >
        <form onSubmit={handleLodgeComplaint} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Complainant Full Name *</label>
              <input
                type="text"
                required
                value={lodgeForm.applicantName}
                onChange={(e) => setLodgeForm({ ...lodgeForm, applicantName: e.target.value })}
                placeholder="e.g. Ramesh Balasaheb Patil"
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
              <input
                type="tel"
                required
                value={lodgeForm.applicantPhone}
                onChange={(e) => setLodgeForm({ ...lodgeForm, applicantPhone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">District *</label>
              <input
                type="text"
                required
                value={lodgeForm.district}
                onChange={(e) => setLodgeForm({ ...lodgeForm, district: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Tehsil / Taluka</label>
              <input
                type="text"
                value={lodgeForm.tehsil}
                onChange={(e) => setLodgeForm({ ...lodgeForm, tehsil: e.target.value })}
                placeholder="e.g. Haveli"
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Village</label>
              <input
                type="text"
                value={lodgeForm.village}
                onChange={(e) => setLodgeForm({ ...lodgeForm, village: e.target.value })}
                placeholder="e.g. Wagholi"
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Category *</label>
              <select
                value={lodgeForm.category}
                onChange={(e) => setLodgeForm({ ...lodgeForm, category: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="BOUNDARY_DISPUTE">Boundary & Plot Discrepancy</option>
                <option value="FRAUDULENT_TRANSFER">Fraudulent / Unauthorized Transfer</option>
                <option value="VERIFICATION_DELAY">Verification Queue Delay</option>
                <option value="FERFAR_ERROR">Ferfar / Mutation Register Error</option>
                <option value="NAME_MISMATCH">Khatedar Name Mismatch</option>
                <option value="OTHER">Other Grievance</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Severity Escalation *</label>
              <select
                value={lodgeForm.severity}
                onChange={(e) => setLodgeForm({ ...lodgeForm, severity: e.target.value as any })}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="LOW">Low (Administrative Query)</option>
                <option value="MEDIUM">Medium (Data / Name Correction)</option>
                <option value="HIGH">High (Disputed Boundary / Ferfar)</option>
                <option value="CRITICAL">Critical (Suspected Title Fraud / Forgery)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Target Survey / Gat Number</label>
              <input
                type="text"
                value={lodgeForm.targetSurveyNumber}
                onChange={(e) => setLodgeForm({ ...lodgeForm, targetSurveyNumber: e.target.value })}
                placeholder="e.g. 108/4"
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Target Document ID (Optional)</label>
              <input
                type="text"
                value={lodgeForm.targetDocumentId}
                onChange={(e) => setLodgeForm({ ...lodgeForm, targetDocumentId: e.target.value })}
                placeholder="e.g. DOC-MTST1AGQ-EEOP"
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Subject / Grievance Title *</label>
            <input
              type="text"
              required
              value={lodgeForm.title}
              onChange={(e) => setLodgeForm({ ...lodgeForm, title: e.target.value })}
              placeholder="Brief summary of dispute or claim"
              className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Detailed Statement of Facts *</label>
            <textarea
              required
              rows={3}
              value={lodgeForm.description}
              onChange={(e) => setLodgeForm({ ...lodgeForm, description: e.target.value })}
              placeholder="Provide specific dates, deed numbers, partition details, or officer interactions relevant to this matter..."
              className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsLodgeModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={createMutation.isPending}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              Lodge Official Grievance
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: INSPECT & RESOLVE COMPLAINT */}
      {selectedComplaint && (
        <Modal
          isOpen={Boolean(selectedComplaint)}
          onClose={() => setSelectedComplaint(null)}
          title={`Grievance Dossier: ${selectedComplaint.complaintNumber}`}
          description={`Filed on ${formatDate(selectedComplaint.filedAt)} • Status: ${selectedComplaint.status}`}
          maxWidth="xl"
        >
          <form onSubmit={handleSubmitResolution} className="space-y-4">
            {/* Header info strip */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Complainant</span>
                <div className="font-semibold text-slate-900">{selectedComplaint.applicantName}</div>
                <div className="text-[10px] text-slate-500">{selectedComplaint.applicantPhone}</div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Location</span>
                <div className="font-semibold text-slate-900">
                  {selectedComplaint.village || '—'}, {selectedComplaint.district}
                </div>
                <div className="text-[10px] text-slate-500">{selectedComplaint.tehsil} Tehsil</div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Category</span>
                <div className="font-semibold text-blue-900">
                  {CATEGORY_LABELS[selectedComplaint.category] || selectedComplaint.category}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Survey Target</span>
                <div className="font-semibold text-slate-900">
                  {selectedComplaint.targetSurveyNumber
                    ? `Survey #${selectedComplaint.targetSurveyNumber}`
                    : selectedComplaint.targetDocumentId || 'General Registry'}
                </div>
              </div>
            </div>

            {/* Title & Statement */}
            <div className="space-y-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Subject Title</span>
                <h4 className="font-bold text-sm text-slate-900 mt-0.5">{selectedComplaint.title}</h4>
              </div>

              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wide">
                  Complainant Statement of Facts
                </span>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed whitespace-pre-wrap">
                  {selectedComplaint.description}
                </p>
              </div>
            </div>

            {/* Officer Action & Redressal Panel */}
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Officer Statutory Redressal Decision
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-300">
                    Redressal Status *
                  </label>
                  <select
                    value={resolutionStatus}
                    onChange={(e) => setResolutionStatus(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="UNDER_INVESTIGATION">Under Formal Investigation</option>
                    <option value="RESOLVED">Resolved & Redressal Completed</option>
                    <option value="DISMISSED">Dismissed / Inadmissible Claim</option>
                    <option value="PENDING">Re-queue as Pending</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-300">
                    Investigating Officer Designation
                  </label>
                  <input
                    type="text"
                    value={investigatingOfficer}
                    onChange={(e) => setInvestigatingOfficer(e.target.value)}
                    placeholder="e.g. Sub-Divisional Officer / Tahsildar"
                    className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-300">
                  Official Findings & Statutory Remarks *
                </label>
                <textarea
                  required
                  rows={3}
                  value={resolutionRemarks}
                  onChange={(e) => setResolutionRemarks(e.target.value)}
                  placeholder="Record investigative findings, notices issued to sub-registrars, survey boundary adjustments, or reasons for closure..."
                  className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-[10px] text-slate-400">
                Action will be permanently logged in the Cadastral Audit Log
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedComplaint(null)}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  isLoading={updateStatusMutation.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Save Statutory Resolution
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
