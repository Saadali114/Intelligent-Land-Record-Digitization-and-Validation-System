'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle2, ShieldAlert, XCircle, Gauge } from 'lucide-react';
import { VerificationWorkflowData } from '../../services/verificationWorkflowService';

interface StepRiskAnalysisCardProps {
  workflow: VerificationWorkflowData;
}

export const StepRiskAnalysisCard: React.FC<StepRiskAnalysisCardProps> = ({ workflow }) => {
  const { t } = useTranslation();
  const risk = workflow.riskAssessment;
  const isLow = risk.level === 'LOW';
  const isMedium = risk.level === 'MEDIUM';
  const isHigh = risk.level === 'HIGH';

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
              isLow
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : isMedium
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
          >
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {t('verificationWorkflow.riskAnalysisTitle', 'Rule-Based Risk & Discrepancy Analysis')}
            </h2>
            <p className="text-xs text-slate-400">
              {t('verificationWorkflow.riskAnalysisDesc')}
            </p>
          </div>
        </div>

        {/* Score Pill */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">{t('verificationWorkflow.calculatedRiskIndex')}</span>
            <span className="text-base font-bold font-mono text-white">
              {risk.score} <span className="text-xs text-slate-500">/ 100</span>
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider border uppercase ${
              isLow
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : isMedium
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
            }`}
          >
            {isLow
              ? t('verificationWorkflow.lowRisk', 'LOW RISK')
              : isMedium
              ? t('verificationWorkflow.mediumRisk', 'MEDIUM RISK')
              : t('verificationWorkflow.highRisk', 'HIGH RISK')}
          </span>
        </div>
      </div>

      {/* Synthesis Summary */}
      <div
        className={`p-4 rounded-lg border ${
          isLow
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
            : isMedium
            ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
            : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
        }`}
      >
        <p className="text-xs sm:text-sm font-medium leading-relaxed">{risk.summary}</p>
      </div>

      {/* Signals Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Positive Signals */}
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t('verificationWorkflow.positiveSignals', 'Positive Verification Signals')}
            </h4>
          </div>
          {risk.signals.positive.length > 0 ? (
            <ul className="space-y-2">
              {risk.signals.positive.map((sig, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{sig}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">{t('verificationWorkflow.noPositiveSignals')}</p>
          )}
        </div>

        {/* Negative / Discrepancy Signals */}
        <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              {t('verificationWorkflow.negativeSignals', 'Risk & Discrepancy Signals')}
            </h4>
          </div>
          {risk.signals.negative.length > 0 ? (
            <ul className="space-y-2">
              {risk.signals.negative.map((sig, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-rose-300">
                  <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{sig}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center gap-2 text-xs text-emerald-400 p-2 rounded bg-emerald-950/20 border border-emerald-800/30">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t('verificationWorkflow.zeroNegativeSignals')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
