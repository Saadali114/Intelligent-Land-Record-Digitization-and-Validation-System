'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '../../../components/layout/AppLayout';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import {
  documentVerificationService,
  DocumentVerificationItem,
} from '../../../services/documentVerification.service';

export default function OfficerVerificationQueuePage() {
  const { t } = useTranslation();
  const [items, setItems] = useState<DocumentVerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchQueue();
  }, [statusFilter, riskFilter]);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await documentVerificationService.getOfficerQueue({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        riskLevel: riskFilter !== 'ALL' ? riskFilter : undefined,
        search: searchQuery || undefined,
      });
      setItems(res.items);
    } catch (err) {
      console.error('Failed to load queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQueue();
  };

  const pendingCount = items.filter(
    (i) => i.status === 'PENDING_OFFICER_REVIEW' || (i as any).overallStatus === 'IN_PROGRESS'
  ).length;
  const actionCount = items.filter((i) => i.status === 'ACTION_REQUIRED').length;
  const verifiedCount = items.filter(
    (i) => i.status === 'VERIFIED' || (i.officerDecision && i.officerDecision.status === 'APPROVED')
  ).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Prototype Environment Notice */}
        <div className="bg-gradient-to-r from-sky-900/40 via-blue-900/30 to-slate-900 border border-sky-500/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  Prototype Verification Environment
                </span>
                <span className="text-xs text-slate-400">Section 149 MLRC Compliance</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                AI signals provide decision-support only. Final legal determinations rest solely with the authorized Revenue Officer.
              </p>
            </div>
          </div>
          <Link
            href="/land-records"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 whitespace-nowrap"
          >
            Manage Cadastral Records →
          </Link>
        </div>

        {/* Header and KPI Cards */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Officer Verification Worklist
            </h1>
            <p className="text-sm text-slate-400">
              Review AI-analyzed land document applications and record authoritative statutory decisions.
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total in Queue</span>
              <FileText className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-2">{items.length}</p>
            <span className="text-xs text-slate-500">Active dossiers</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Pending Review</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-300 mt-2">{pendingCount}</p>
            <span className="text-xs text-slate-500">Awaiting officer action</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">Clarifications</span>
              <HelpCircle className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-purple-300 mt-2">{actionCount}</p>
            <span className="text-xs text-slate-500">Citizen responses required</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Approved</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-300 mt-2">{verifiedCount}</p>
            <span className="text-xs text-slate-500">Statutory title confirmed</span>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by Application ID, Applicant, or Survey No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </form>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-300 focus:outline-none pr-2 py-1"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING_OFFICER_REVIEW">Pending Review</option>
                <option value="ACTION_REQUIRED">Clarification Requested</option>
                <option value="VERIFIED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1">
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-300 focus:outline-none pr-2 py-1"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="LOW">Low Risk</option>
                <option value="MEDIUM">Medium Risk</option>
                <option value="HIGH">High Risk</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Queue Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-16 text-center text-slate-400">
              <div className="inline-block animate-spin w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full mb-2"></div>
              <p className="text-sm">Loading verification queue...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-sm font-medium text-slate-300">No applications match your filter</p>
              <p className="text-xs text-slate-500 mt-1">Try adjusting search parameters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3">Application ID</th>
                    <th className="px-5 py-3">Applicant</th>
                    <th className="px-5 py-3">Document & Survey</th>
                    <th className="px-5 py-3">Cadastral Cross-Check</th>
                    <th className="px-5 py-3">AI Risk Assessment</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {items.map((item) => {
                    const appId = (item as any).trackingNumber || item.applicationId || (item as any).id;
                    const riskLevel = item.riskAssessment?.level || 'LOW';
                    const riskScore = item.riskAssessment?.score ?? 15;
                    const isApproved =
                      item.status === 'VERIFIED' || item.officerDecision?.status === 'APPROVED';
                    const isRejected =
                      item.status === 'REJECTED' || item.officerDecision?.status === 'REJECTED';
                    const isClarification = item.status === 'ACTION_REQUIRED';

                    return (
                      <tr key={appId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4 font-mono text-xs font-semibold text-sky-400">
                          {appId}
                          <div className="text-[11px] font-sans text-slate-500 font-normal">
                            {new Date(item.createdAt || Date.now()).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-medium text-white">{item.applicant?.name || 'Applicant'}</div>
                          <div className="text-xs text-slate-400">{item.applicant?.mobile || item.applicant?.email}</div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="text-slate-200 font-medium">
                            {item.document?.documentType || '7/12 Extract'}
                          </div>
                          <div className="text-xs text-slate-400">
                            Survey: {item.officialRecordMatch?.matchedSurveyNumber || '145/2A'}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-medium ${
                              item.officialRecordMatch?.status === 'STRONG_MATCH'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : item.officialRecordMatch?.status === 'PARTIAL_MATCH'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                : 'bg-red-500/10 text-red-400 border border-red-500/30'
                            }`}
                          >
                            {item.officialRecordMatch?.status || 'STRONG_MATCH'}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs px-2 py-0.5 rounded font-bold ${
                                riskLevel === 'LOW'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : riskLevel === 'MEDIUM'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
                              }`}
                            >
                              {riskLevel} ({riskScore}/100)
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                              isApproved
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : isRejected
                                ? 'bg-red-500/20 text-red-300'
                                : isClarification
                                ? 'bg-purple-500/20 text-purple-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {isApproved ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : isRejected ? (
                              <XCircle className="w-3.5 h-3.5" />
                            ) : isClarification ? (
                              <HelpCircle className="w-3.5 h-3.5" />
                            ) : (
                              <Clock className="w-3.5 h-3.5" />
                            )}
                            {isApproved
                              ? 'Approved'
                              : isRejected
                              ? 'Rejected'
                              : isClarification
                              ? 'Clarification'
                              : 'Pending'}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/officer/verifications/${appId}`}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white transition-colors"
                          >
                            Review Workspace
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
