'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  UserCheck,
  Database,
  Stamp,
  History,
  Send,
  HelpCircle,
} from 'lucide-react';
import {
  VerificationWorkflowData,
  verificationWorkflowService,
  OfficerDecisionType,
} from '../../services/verificationWorkflowService';
import { StepDualPaneOcrReview } from '../citizen-verification/StepDualPaneOcrReview';
import { StepDocumentConsistencyPanel } from '../citizen-verification/StepDocumentConsistencyPanel';
import { StepOfficialRecordMatch } from '../citizen-verification/StepOfficialRecordMatch';
import { StepRelationshipVerification } from '../citizen-verification/StepRelationshipVerification';
import { StepRiskAnalysisCard } from '../citizen-verification/StepRiskAnalysisCard';
import { StepApplicationTimeline } from '../citizen-verification/StepApplicationTimeline';

interface OfficerVerificationWorkspaceProps {
  initialWorkflow: VerificationWorkflowData;
}

export const OfficerVerificationWorkspace: React.FC<OfficerVerificationWorkspaceProps> = ({
  initialWorkflow,
}) => {
  const { t } = useTranslation();
  const [workflow, setWorkflow] = useState<VerificationWorkflowData>(initialWorkflow);
  const [remarks, setRemarks] = useState('');
  const [selectedAction, setSelectedAction] = useState<OfficerDecisionType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleAction = (action: OfficerDecisionType) => {
    setSelectedAction(action);
    if (!remarks) {
      if (action === 'APPROVED') {
        setRemarks('Verified against cadastral registry & field inspection. Approved under Section 149 MLRC.');
      } else if (action === 'CLARIFICATION_REQUESTED') {
        setRemarks('Applicant name differs from recorded khatedar. Produce registered Power of Attorney or Legal Heir certificate.');
      } else if (action === 'REJECTED') {
        setRemarks('Area discrepancy and altered survey subdivision flagged. Application rejected.');
      }
    }
  };

  const submitVerdict = () => {
    if (!selectedAction) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const updated = verificationWorkflowService.saveOfficerDecision(
        workflow.id,
        selectedAction,
        remarks,
        'S. R. Deshmukh',
        'Sub-Divisional Officer / Revenue Inspector'
      );
      setWorkflow(updated);
      setIsSubmitting(false);
      setNotification(
        t(
          'verificationWorkflow.decisionRecorded',
          'Officer decision recorded in immutable audit log.'
        )
      );
    }, 600);
  };

  const isDecided = !!workflow.officerDecision;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
              {workflow.trackingNumber}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-400">Dossier ID: {workflow.id}</span>
          </div>
          <h1 className="text-xl font-bold text-white">
            {t(
              'verificationWorkflow.officerWorkspaceTitle',
              'Officer Cadastral Verification Workspace'
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t(
              'verificationWorkflow.officerWorkspaceSubtitle',
              'Comprehensive 4-pillar dossier review with statutory approval controls.'
            )}
          </p>
        </div>

        {/* Status Pill */}
        <div>
          {isDecided ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verdict: {workflow.officerDecision?.decision}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Awaiting Officer Action</span>
            </div>
          )}
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-900/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 4 Pillars in Full Dossier View */}
      <div className="space-y-6">
        {/* Pillar 1 & Applicant Card */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-sky-400" />
              <span>{t('verificationWorkflow.applicantSection', 'Applicant & Identity')}</span>
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {workflow.applicant.identityStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Applicant Name</span>
              <span className="font-semibold text-white mt-0.5 block">{workflow.applicant.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Mobile Number</span>
              <span className="font-mono text-slate-200 mt-0.5 block">{workflow.applicant.mobile}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Verification Mode</span>
              <span className="text-slate-300 mt-0.5 block">{workflow.applicant.identityMethod}</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Document OCR Scan & Extracted Attributes */}
        <StepDualPaneOcrReview workflow={workflow} />

        {/* Pillar 2: Consistency Checks */}
        <StepDocumentConsistencyPanel workflow={workflow} />

        {/* Pillar 3: Official Cadastral Match */}
        <StepOfficialRecordMatch workflow={workflow} />

        {/* Pillar 4: Relationship Verification */}
        <StepRelationshipVerification workflow={workflow} />

        {/* Rule-Based Risk Engine Score */}
        <StepRiskAnalysisCard workflow={workflow} />

        {/* Immutable Audit Trail */}
        <StepApplicationTimeline workflow={workflow} />
      </div>

      {/* Statutory Decision Action Bar */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <Stamp className="w-5 h-5 text-sky-400" />
          <h3 className="text-base font-semibold text-white">Statutory Revenue Officer Verdict</h3>
        </div>

        {isDecided ? (
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">
                Decision Recorded by: {workflow.officerDecision?.officerName} ({workflow.officerDecision?.officerDesignation})
              </span>
              <span className="text-xs font-mono text-slate-500">
                {new Date(workflow.officerDecision!.decidedAt).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded border border-slate-800">
              {workflow.officerDecision?.remarks}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                {t('verificationWorkflow.decisionRemarksLabel', 'Official Statutory Justification / Remarks')}
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={t(
                  'verificationWorkflow.decisionRemarksPlaceholder',
                  'Record statutory rationale for officer review verdict...'
                )}
                className="w-full text-xs p-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleAction('APPROVED')}
                className={`py-3 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 border ${
                  selectedAction === 'APPROVED'
                    ? 'bg-emerald-600 text-white border-emerald-500 ring-2 ring-emerald-500/40'
                    : 'bg-emerald-950/30 text-emerald-400 border-emerald-800/60 hover:bg-emerald-900/40'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('verificationWorkflow.approveButton', 'Approve Record')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction('CLARIFICATION_REQUESTED')}
                className={`py-3 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 border ${
                  selectedAction === 'CLARIFICATION_REQUESTED'
                    ? 'bg-amber-600 text-white border-amber-500 ring-2 ring-amber-500/40'
                    : 'bg-amber-950/30 text-amber-400 border-amber-800/60 hover:bg-amber-900/40'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>{t('verificationWorkflow.clarificationButton', 'Request Clarification')}</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction('REJECTED')}
                className={`py-3 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 border ${
                  selectedAction === 'REJECTED'
                    ? 'bg-rose-600 text-white border-rose-500 ring-2 ring-rose-500/40'
                    : 'bg-rose-950/30 text-rose-400 border-rose-800/60 hover:bg-rose-900/40'
                }`}
              >
                <XCircle className="w-4 h-4" />
                <span>{t('verificationWorkflow.rejectButton', 'Reject Application')}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={submitVerdict}
              disabled={!selectedAction || isSubmitting}
              className="w-full py-3 px-4 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <span>Submitting to Ledger...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t('verificationWorkflow.submitDecision', 'Record Official Verdict')}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
