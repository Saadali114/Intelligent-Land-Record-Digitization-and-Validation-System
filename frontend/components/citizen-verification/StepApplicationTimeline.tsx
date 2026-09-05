'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { History, CheckCircle2, AlertCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import { VerificationWorkflowData } from '../../services/verificationWorkflowService';

interface StepApplicationTimelineProps {
  workflow: VerificationWorkflowData;
}

export const StepApplicationTimeline: React.FC<StepApplicationTimelineProps> = ({ workflow }) => {
  const { t } = useTranslation();
  const timeline = workflow.auditTimeline || [];

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {t('verificationWorkflow.timelineSection', 'Immutable Audit Ledger')}
            </h2>
            <p className="text-xs text-slate-400">
              Cryptographically timestamped transaction log of all algorithmic and officer actions
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
          Tracking: {workflow.trackingNumber}
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {timeline.map((entry, idx) => {
          const isSuccess = entry.status === 'SUCCESS';
          const isWarning = entry.status === 'WARNING';
          const isAlert = entry.status === 'ALERT';

          return (
            <div key={idx} className="relative group">
              {/* Dot Icon */}
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center ${
                  isSuccess
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : isWarning
                    ? 'bg-amber-950 border-amber-500 text-amber-400'
                    : isAlert
                    ? 'bg-rose-950 border-rose-500 text-rose-400'
                    : 'bg-slate-950 border-sky-500 text-sky-400'
                }`}
              >
                {isSuccess ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : isWarning || isAlert ? (
                  <AlertTriangle className="w-3 h-3" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                    {entry.stage.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                    <span>{entry.actor}</span>
                    <span>•</span>
                    <span>{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{entry.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
