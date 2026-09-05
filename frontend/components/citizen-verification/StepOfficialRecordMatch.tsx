'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Database, CheckCircle2, XCircle, AlertCircle, ArrowRightLeft } from 'lucide-react';
import { VerificationWorkflowData } from '../../services/verificationWorkflowService';

interface StepOfficialRecordMatchProps {
  workflow: VerificationWorkflowData;
}

export const StepOfficialRecordMatch: React.FC<StepOfficialRecordMatchProps> = ({ workflow }) => {
  const { t } = useTranslation();
  const match = workflow.officialRecordMatch;
  const isStrongMatch = match.status === 'STRONG_MATCH';

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
              isStrongMatch
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}
          >
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {t('verificationWorkflow.pillar3Title', '3. Official Cadastral Match')}
            </h2>
            <p className="text-xs text-slate-400">
              Cross-reference extracted document values against authorized cadastral registry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Registry Reference:</span>
          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-sky-400 border border-slate-700">
            {match.matchedRecordId}
          </span>
        </div>
      </div>

      {/* Status Notice */}
      <div
        className={`p-4 rounded-lg border flex items-center justify-between gap-3 ${
          isStrongMatch
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
            : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
        }`}
      >
        <div className="flex items-center gap-3">
          {isStrongMatch ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <div>
            <h4 className="text-sm font-semibold">
              {isStrongMatch
                ? t('verificationWorkflow.strongMatch', 'Official Record Match: Strong')
                : t('verificationWorkflow.mismatchDetected', 'Official Record Match: Discrepancy Detected')}
            </h4>
            <p className="text-xs opacity-90">{match.summary}</p>
          </div>
        </div>

        <span
          className={`text-xs font-mono font-bold px-2.5 py-1 rounded border uppercase shrink-0 ${
            isStrongMatch
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
          }`}
        >
          {match.status}
        </span>
      </div>

      {/* Side-by-Side Comparison Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/60">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900 border-b border-slate-800 text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Cadastral Attribute</th>
              <th className="py-3 px-4 text-sky-300">
                {t('verificationWorkflow.uploadedDocHeader', 'Uploaded Document')}
              </th>
              <th className="py-3 px-4 text-emerald-300">
                {t('verificationWorkflow.officialRecordHeader', 'Authorized Cadastral Record')}
              </th>
              <th className="py-3 px-4 text-center">
                {t('verificationWorkflow.matchStatus', 'Match Result')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {match.fieldComparisons.map((item, idx) => (
              <tr
                key={idx}
                className={`transition-colors ${
                  !item.isMatch ? 'bg-rose-950/10 hover:bg-rose-950/20' : 'hover:bg-slate-900/40'
                }`}
              >
                <td className="py-3 px-4 font-medium text-slate-200">{item.fieldName}</td>
                <td className="py-3 px-4 font-mono font-medium text-slate-100">
                  <span
                    className={
                      !item.isMatch
                        ? 'text-rose-300 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/60'
                        : ''
                    }
                  >
                    {item.uploadedValue}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono font-medium text-emerald-400">
                  {item.officialValue}
                </td>
                <td className="py-3 px-4 text-center">
                  {item.isMatch ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>MATCH</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-500/40">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>MISMATCH</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
