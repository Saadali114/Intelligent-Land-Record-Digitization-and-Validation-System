'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Search } from 'lucide-react';
import { VerificationWorkflowData } from '../../services/verificationWorkflowService';

interface StepDocumentConsistencyPanelProps {
  workflow: VerificationWorkflowData;
}

export const StepDocumentConsistencyPanel: React.FC<StepDocumentConsistencyPanelProps> = ({
  workflow,
}) => {
  const { t } = useTranslation();
  const consistency = workflow.document.consistency;
  const isPassed = consistency.status === 'PASSED';

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
              isPassed
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {t('verificationWorkflow.pillar2Title', '2. Document & Consistency Check')}
            </h2>
            <p className="text-xs text-slate-400">
              Structural layout parsing, revenue code syntax, and visual anomaly evaluation
            </p>
          </div>
        </div>

        <div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
              isPassed
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{isPassed ? 'CONSISTENCY VERIFIED' : 'DISCREPANCY FLAGGED'}</span>
          </span>
        </div>
      </div>

      {/* Primary Status Banner */}
      <div
        className={`p-4 rounded-lg border mb-5 flex items-start gap-3 ${
          isPassed
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
            : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
        }`}
      >
        {isPassed ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        )}
        <div>
          <h4 className="text-sm font-semibold mb-0.5">
            {isPassed
              ? t(
                  'verificationWorkflow.documentPassedSummary',
                  'No significant document-level discrepancy detected.'
                )
              : t(
                  'verificationWorkflow.documentWarningSummary',
                  'Visual density anomalies and low OCR confidence detected.'
                )}
          </h4>
          <p className="text-xs opacity-90">{consistency.summary}</p>
        </div>
      </div>

      {/* Breakdown Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {consistency.checks.map((check) => (
          <div
            key={check.id}
            className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex items-start justify-between gap-2"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-200">{check.name}</span>
              </div>
              <p className="text-[11px] text-slate-400">{check.notes}</p>
            </div>
            <div>
              {check.passed ? (
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  PASSED
                </span>
              ) : (
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/50">
                  FAILED
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
