import React, { useState, useMemo } from 'react';
import { User, DocumentRecord } from '../../types';
import { useDocumentsQuery } from '../../hooks/useDocuments';
import { DocumentQrModal } from '../documents/DocumentQrModal';
import { DocumentInspectionModal } from '../documents/DocumentInspectionModal';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { formatDate, formatFileSize } from '../../lib/utils';
import {
  Link2,
  FileText,
  CheckCircle2,
  Clock,
  QrCode,
  Search,
  ChevronDown,
  ChevronUp,
  Eye,
  Building2,
  FolderArchive,
  Sparkles,
} from 'lucide-react';

interface UserDocumentLinkedTabProps {
  users?: User[];
  isLoadingUsers: boolean;
}

export const UserDocumentLinkedTab: React.FC<UserDocumentLinkedTabProps> = ({
  users = [],
  isLoadingUsers,
}) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [docFilter, setDocFilter] = useState<'ALL' | 'WITH_DOCS' | 'NO_DOCS'>('ALL');
  const [expandedUsers, setExpandedUsers] = useState<Record<string, boolean>>({});

  // Modals
  const [qrModalDoc, setQrModalDoc] = useState<DocumentRecord | null>(null);
  const [inspectionDoc, setInspectionDoc] = useState<DocumentRecord | null>(null);

  // Fetch all documents to link with users
  const { data: docsData, isLoading: isLoadingDocs } = useDocumentsQuery({ limit: 100 });

  const documents = useMemo(() => docsData?.documents || [], [docsData?.documents]);

  // Group documents by user identifier (uploadedById, or matched by user ID, email, or name)
  const userDocumentsMap = useMemo(() => {
    const map: Record<string, DocumentRecord[]> = {};

    users.forEach((u) => {
      map[u._id] = [];
    });

    documents.forEach((doc) => {
      let matchedUserId = '';

      if (typeof doc.uploadedBy === 'object' && doc.uploadedBy) {
        matchedUserId = doc.uploadedBy._id || (doc.uploadedBy as any).id || '';
      } else if (typeof doc.uploadedBy === 'string') {
        matchedUserId = doc.uploadedBy;
      }

      if (!matchedUserId && (doc as any).uploadedById) {
        matchedUserId = (doc as any).uploadedById;
      }

      // If matched by ID
      if (matchedUserId && map[matchedUserId]) {
        map[matchedUserId].push(doc);
      } else {
        // Fallback: match by email or name if present
        const uEmail = typeof doc.uploadedBy === 'object' ? doc.uploadedBy?.email : '';
        const foundUser = users.find(
          (u) => (uEmail && u.email.toLowerCase() === uEmail.toLowerCase()) || u._id === matchedUserId
        );
        if (foundUser) {
          if (!map[foundUser._id]) map[foundUser._id] = [];
          map[foundUser._id].push(doc);
        }
      }
    });

    return map;
  }, [users, documents]);

  // Toggle user accordion expansion
  const toggleUser = (userId: string) => {
    setExpandedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    users.forEach((u) => {
      all[u._id] = true;
    });
    setExpandedUsers(all);
  };

  const collapseAll = () => {
    setExpandedUsers({});
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role filter
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;

      const userDocs = userDocumentsMap[u._id] || [];

      // Document filter
      if (docFilter === 'WITH_DOCS' && userDocs.length === 0) return false;
      if (docFilter === 'NO_DOCS' && userDocs.length > 0) return false;

      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesUser =
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.district.toLowerCase().includes(q) ||
          u.department.toLowerCase().includes(q);

        const matchesDoc = userDocs.some(
          (d) =>
            d.documentId.toLowerCase().includes(q) ||
            d.originalName.toLowerCase().includes(q) ||
            d.fileType.toLowerCase().includes(q) ||
            d.landRecord?.surveyNumber?.toLowerCase().includes(q)
        );

        if (!matchesUser && !matchesDoc) return false;
      }

      return true;
    });
  }, [users, roleFilter, docFilter, search, userDocumentsMap]);

  // Overall Stats
  const totalLinkedDocs = documents.length;
  const verifiedLinkedDocs = documents.filter((d) => d.processingStatus === 'VERIFIED').length;
  const usersWithDocsCount = Object.values(userDocumentsMap).filter((docs) => docs.length > 0).length;

  const isLoading = isLoadingUsers || isLoadingDocs;

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Users
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{users.length}</div>
          <div className="mt-1 text-[11px] text-slate-400">
            {usersWithDocsCount} users with active records
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Linked Documents
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FolderArchive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{totalLinkedDocs}</div>
          <div className="mt-1 text-[11px] text-slate-400">
            Across 7/12, 8A & cadastral registries
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              QR Verified Deeds
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-700">{verifiedLinkedDocs}</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-medium">
            ✓ Official statutory verification seals
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Average Linkage
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">
            {users.length > 0 ? (totalLinkedDocs / users.length).toFixed(1) : 0}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">Documents per user account</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by User Name, Email, District, or Document ID..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Roles</option>
              <option value="CITIZEN">Citizen Accounts</option>
              <option value="OFFICER">Officer Accounts</option>
              <option value="VERIFIER">Verifier Accounts</option>
              <option value="ADMIN">Admin Accounts</option>
            </select>

            <select
              value={docFilter}
              onChange={(e) => setDocFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Linkage Status</option>
              <option value="WITH_DOCS">Has Linked Documents</option>
              <option value="NO_DOCS">No Documents Linked</option>
            </select>

            <button
              type="button"
              onClick={expandAll}
              className="px-2.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="px-2.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Users & Linked Documents Accordion List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          title="No Matching User & Document Linkages"
          description="Try adjusting your filters or search terms."
        />
      ) : (
        <div className="space-y-3">
          {filteredUsers.map((user) => {
            const userDocs = userDocumentsMap[user._id] || [];
            const isExpanded = expandedUsers[user._id] ?? (userDocs.length > 0 && filteredUsers.length <= 5);
            const verifiedCount = userDocs.filter((d) => d.processingStatus === 'VERIFIED').length;

            return (
              <div
                key={user._id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
              >
                {/* User Header Summary Bar */}
                <div
                  onClick={() => toggleUser(user._id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {/* User Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">{user.name}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {user.role}
                        </span>
                        {user.emailVerified ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3 text-amber-500" />
                            Unverified
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{user.email}</span>
                        <span>•</span>
                        <span>{user.district}</span>
                        <span>•</span>
                        <span>{user.department}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Document Counts & Accordion Indicator */}
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-xs font-bold">
                        <Link2 className="w-3.5 h-3.5 text-blue-600" />
                        {userDocs.length} {userDocs.length === 1 ? 'Document' : 'Documents'}
                      </div>
                      {verifiedCount > 0 && (
                        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 text-right">
                          {verifiedCount} QR Verified
                        </div>
                      )}
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Linked Documents List */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-4">
                    {userDocs.length === 0 ? (
                      <div className="p-4 bg-white rounded-lg border border-dashed border-slate-200 text-center">
                        <p className="text-xs text-slate-500">
                          No documents currently ingested or uploaded under this user account.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-2xs">
                        <table className="w-full text-left text-xs text-slate-600">
                          <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                            <tr>
                              <th className="px-4 py-2.5">Document Details</th>
                              <th className="px-4 py-2.5">Document ID</th>
                              <th className="px-4 py-2.5">Type</th>
                              <th className="px-4 py-2.5">Cadastral Reference</th>
                              <th className="px-4 py-2.5">Status</th>
                              <th className="px-4 py-2.5">Uploaded</th>
                              <th className="px-4 py-2.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {userDocs.map((doc) => (
                              <tr key={doc._id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="px-4 py-2.5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                                      <FileText className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <div className="font-semibold text-slate-900 truncate max-w-[180px]">
                                        {doc.originalName}
                                      </div>
                                      <div className="text-[10px] text-slate-400">
                                        {formatFileSize(doc.fileSize)}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-2.5 font-mono text-[11px] font-semibold text-slate-800">
                                  {doc.documentId}
                                </td>
                                <td className="px-4 py-2.5 font-medium text-slate-700">
                                  {doc.fileType || '7/12 Extract'}
                                </td>
                                <td className="px-4 py-2.5">
                                  {doc.landRecord ? (
                                    <div className="text-[11px]">
                                      <span className="font-bold text-slate-900">
                                        Survey #{doc.landRecord.surveyNumber}
                                      </span>
                                      <div className="text-[10px] text-slate-500">
                                        {doc.landRecord.village}, {doc.landRecord.district}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 italic">
                                      Pending Cadastral Extraction
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-2.5">
                                  {doc.processingStatus === 'VERIFIED' ? (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded shadow-2xs">
                                      <QrCode className="w-3 h-3 text-emerald-700 shrink-0" />
                                      ✓ QR Scanned & Verified
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                                      {doc.processingStatus}
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-2.5 text-slate-500 text-[11px]">
                                  {formatDate(doc.uploadedAt)}
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setInspectionDoc(doc)}
                                      className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                      title="Inspect Extracted Data & Original Scan"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setQrModalDoc(doc)}
                                      className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                                      title="Tamper-Proof QR & Adhesive Sticker Seal"
                                    >
                                      <QrCode className="w-4 h-4 text-emerald-600" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Document QR Code & Adhesive Sticker Seal Modal */}
      <DocumentQrModal
        document={qrModalDoc}
        isOpen={Boolean(qrModalDoc)}
        onClose={() => setQrModalDoc(null)}
      />

      {/* Document Inspection Dual-Pane Modal */}
      <DocumentInspectionModal
        document={inspectionDoc}
        isOpen={Boolean(inspectionDoc)}
        onClose={() => setInspectionDoc(null)}
      />
    </div>
  );
};
