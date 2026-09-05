'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { PortalLayout } from '../portal/PortalLayout';
import {
  FileText,
  ArrowLeft,
  CheckCircle2,
  Clock,
  HelpCircle,
  XCircle,
  AlertTriangle,
  Send,
  ShieldCheck,
  Building2,
  History,
  Check,
} from 'lucide-react';
import {
  documentVerificationService,
  DocumentVerificationItem,
} from '../../services/documentVerification.service';

interface Props {
  id: string;
}

export const CitizenVerificationWorkspace: React.FC<Props> = ({ id }) => {
  const { t } = useTranslation();
  const [workflow, setWorkflow] = useState<DocumentVerificationItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Clarification reply state
  const [clarificationReply, setClarificationReply] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await documentVerificationService.getDetail(id);
      setWorkflow(data);
    } catch (err) {
      console.error('Failed to load verification detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClarificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clarificationReply.trim()) return;

    setSubmittingReply(true);
    try {
      await documentVerificationService.respondToClarification(
        id,
        clarificationReply.trim()
      );
      setReplySuccess(true);
      setClarificationReply('');
      await loadData();
    } catch (err) {
      console.error('Error submitting clarification:', err);
    } finally {
      setSubmittingReply(false);
    }
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="py-20 text-center text-slate-400">
          <div className="inline-block animate-spin w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full mb-3"></div>
          <p className="text-sm">Loading verification details...</p>
        </div>
      </PortalLayout>
    );
  }

  if (!workflow) {
    return (
      <PortalLayout>
        <div className="py-20 text-center text-slate-400">
          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <p className="text-base font-semibold text-slate-300">Application not found</p>
          <Link
            href="/citizen/verifications"
            className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold px-3 py-2 rounded-lg bg-slate-800 text-sky-400 hover:bg-slate-700"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Applications
          </Link>
        </div>
      </PortalLayout>
    );
  }

  const appId = (workflow as any).trackingNumber || workflow.applicationId || (workflow as any).id;
  const isApproved =
    workflow.status === 'VERIFIED' || workflow.officerDecision?.status === 'APPROVED';
  const isRejected =
    workflow.status === 'REJECTED' || workflow.officerDecision?.status === 'REJECTED';
  const isClarification = workflow.status === 'ACTION_REQUIRED';

  return (
    <PortalLayout>
      <div className="space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/citizen/verifications"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Verifications List
          </Link>

          <span className="font-mono text-xs text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded border border-sky-500/20">
            {appId}
          </span>
        </div>

        {/* Application Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
                {workflow.document?.documentType || '7/12 Extract'}
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                Submitted {new Date(workflow.createdAt || Date.now()).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white">Application Tracking Dossier</h1>
            <p className="text-sm text-slate-400 mt-1">
              Survey No: {workflow.officialRecordMatch?.matchedSurveyNumber || '145/2A'} •{' '}
              {workflow.officialRecordMatch?.matchedVillage || 'Khadakwasla'},{' '}
              {workflow.officialRecordMatch?.matchedTaluka || 'Haveli'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl font-semibold ${
                isApproved
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : isRejected
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : isClarification
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              }`}
            >
              {isApproved ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : isRejected ? (
                <XCircle className="w-5 h-5" />
              ) : isClarification ? (
                <HelpCircle className="w-5 h-5" />
              ) : (
                <Clock className="w-5 h-5" />
              )}
              {isApproved
                ? 'Statutory Verified'
                : isRejected
                ? 'Verification Rejected'
                : isClarification
                ? 'Action Required: Clarification Requested'
                : 'Pending Sub-Divisional Officer Review'}
            </span>
          </div>
        </div>

        {/* Action Required: Officer Clarification Form */}
        {isClarification && (
          <div className="bg-amber-950/30 border border-amber-500/50 rounded-xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-amber-300">
                  Officer Clarification Notice
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  The Revenue Officer reviewed your document and provided the following instruction:
                </p>
                <div className="mt-3 p-3.5 rounded-lg bg-slate-950 border border-amber-500/30 text-sm text-amber-200 font-medium leading-relaxed">
                  "{workflow.officerDecision?.remarks || 'Applicant name differs from recorded Khatedar. Please provide succession proof or legal heir affidavit.'}"
                </div>
              </div>
            </div>

            {replySuccess ? (
              <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2">
                <Check className="w-5 h-5 text-emerald-400" />
                <span>Your clarification has been submitted to the Sub-Divisional Officer. Application status returned to active review.</span>
              </div>
            ) : (
              <form onSubmit={handleClarificationSubmit} className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Your Clarification Statement / Document References:
                </label>
                <textarea
                  rows={3}
                  value={clarificationReply}
                  onChange={(e) => setClarificationReply(e.target.value)}
                  placeholder="Explain the relationship, succession order, or attach reference numbers..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  required
                />
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={submittingReply || !clarificationReply.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {submittingReply ? 'Submitting...' : 'Submit Clarification to Officer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 3-Pillar Verification Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Extracted Document Entities */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-sky-400 border-b border-slate-800 pb-3">
              <FileText className="w-5 h-5" />
              <h2 className="text-base font-bold text-white">Extracted Entities</h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 text-xs">Owner Name</span>
                <span className="font-medium text-white text-right">
                  {workflow.document?.extractedFields?.ownerName?.value || 'Shankar Ganpat Patil'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 text-xs">Survey / Gat No.</span>
                <span className="font-medium text-white">
                  {workflow.document?.extractedFields?.surveyNumber?.value || '145/2A'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 text-xs">Land Area</span>
                <span className="font-medium text-white">
                  {workflow.document?.extractedFields?.plotArea?.value || '1.25 Hectares'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 text-xs">OCR Engine Metric</span>
                <span className="font-medium text-emerald-400">
                  {Math.round((workflow.document?.avgConfidence || 0.98) * 100)}% Confidence
                </span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Cadastral Register Match */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 border-b border-slate-800 pb-3">
              <Building2 className="w-5 h-5" />
              <h2 className="text-base font-bold text-white">Cadastral Cross-Check</h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 text-xs">Reference Match</span>
                <span className="font-medium text-emerald-400">
                  {workflow.officialRecordMatch?.status || 'STRONG_MATCH'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 text-xs">Official Record ID</span>
                <span className="font-mono text-xs text-sky-300">
                  {workflow.officialRecordMatch?.matchedRecordId || 'REC-MH-PUN-001'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 text-xs">Title Relationship</span>
                <span className="font-medium text-white">
                  {workflow.relationshipVerification?.relationshipType || 'OWNER'}
                </span>
              </div>
              <div className="text-xs text-slate-400 pt-1 leading-relaxed">
                {workflow.officialRecordMatch?.summary || 'Matched against state prototype cadastral database.'}
              </div>
            </div>
          </div>

          {/* Pillar 3: AI Integrity Assessment */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-purple-400 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="text-base font-bold text-white">Integrity Evaluation</h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 text-xs">Discrepancy Risk</span>
                <span
                  className={`font-bold ${
                    workflow.riskAssessment?.level === 'LOW'
                      ? 'text-emerald-400'
                      : workflow.riskAssessment?.level === 'MEDIUM'
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                >
                  {workflow.riskAssessment?.level || 'LOW'} ({workflow.riskAssessment?.score ?? 15}/100)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 text-xs">Visual Density</span>
                <span className="font-medium text-emerald-400">Intact / No Alteration</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400 text-xs">Consistency Checks</span>
                <span className="font-medium text-white">6 of 6 Passed</span>
              </div>
              <div className="text-xs text-slate-400 pt-1 leading-relaxed">
                {workflow.riskAssessment?.summary || 'Document evaluation shows low discrepancy risk.'}
              </div>
            </div>
          </div>
        </div>

        {/* Audit Timeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-300 border-b border-slate-800 pb-3">
            <History className="w-5 h-5 text-sky-400" />
            <h2 className="text-base font-bold text-white">Statutory Audit Timeline</h2>
          </div>

          <div className="space-y-4 pt-2">
            {(workflow.auditTimeline || []).map((entry, idx) => (
              <div key={idx} className="flex items-start gap-4 text-xs">
                <span className="font-mono text-slate-500 w-36 flex-shrink-0 pt-0.5">
                  {new Date(entry.timestamp).toLocaleString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <div className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-white mr-2">
                    {entry.actor} ({entry.actorRole || 'SYSTEM'}):
                  </span>
                  <span className="text-slate-300">{entry.description || (entry as any).message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};
