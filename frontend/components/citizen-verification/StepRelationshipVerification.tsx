'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserCheck, AlertTriangle, CheckCircle2, ShieldAlert, FileWarning, Upload } from 'lucide-react';
import { VerificationWorkflowData } from '../../services/verificationWorkflowService';

interface StepRelationshipVerificationProps {
  workflow: VerificationWorkflowData;
}

export const StepRelationshipVerification: React.FC<StepRelationshipVerificationProps> = ({
  workflow,
}) => {
  const { t } = useTranslation();
  const rel = workflow.relationshipVerification;
  const isMatched = rel.status === 'MATCHED';
  const isNotEstablished = rel.status === 'NOT_ESTABLISHED';

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
              isMatched
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}
          >
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {t('verificationWorkflow.pillar4Title', '4. User ↔ Land Relationship')}
            </h2>
            <p className="text-xs text-slate-400">
              Establish legal authorization, title-holding standing, and identity-to-parcel binding
            </p>
          </div>
        </div>

        <div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
              isMatched
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {isMatched ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{isMatched ? 'STANDING CONFIRMED' : 'RELATIONSHIP NOT ESTABLISHED'}</span>
          </span>
        </div>
      </div>

      {/* Cross-Identity Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            {t('verificationWorkflow.registeredOwner', 'Registered Parcel Owner')}
          </span>
          <div className="text-sm font-semibold text-white font-mono">{rel.landOwnerName}</div>
          <div className="text-[11px] text-slate-500">
            {t('verificationWorkflow.registeredOwnerDesc')}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            {t('verificationWorkflow.verifiedApplicant', 'Verified Applicant')}
          </span>
          <div className="text-sm font-semibold text-white font-mono">{rel.applicantName}</div>
          <div className="text-[11px] text-slate-500">
            {t('verificationWorkflow.verifiedApplicantDesc')}
          </div>
        </div>
      </div>

      {/* Critical Relationship Warning (Case 2: Stolen / Third-Party) */}
      {isNotEstablished && (
        <div className="p-4 rounded-lg bg-amber-950/30 border border-amber-500/40 text-amber-200 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-300">
                {t('verificationWorkflow.actionRequiredRelationship')}
              </h4>
              <p className="text-xs text-amber-200/90 leading-relaxed mt-1">
                {t(
                  'verificationWorkflow.stolenDocWarning',
                  'Document appears consistent, but the applicant’s relationship with the land record could not be established.'
                )}
              </p>
              <div className="mt-2 text-xs font-mono text-amber-300/80 bg-amber-950/50 p-2 rounded border border-amber-800/40">
                <strong>{t('verificationWorkflow.systemNote')}</strong>{' '}
                {t('verificationWorkflow.systemNoteDesc', {
                  applicant: rel.applicantName,
                  owner: rel.landOwnerName,
                })}
              </div>
            </div>
          </div>

          {/* Evidence Upload Section for Legal Heir / POA */}
          <div className="p-3 bg-slate-950/70 rounded-lg border border-amber-900/40 mt-3 space-y-2">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
              <FileWarning className="w-4 h-4 text-amber-400" />
              <span>{t('verificationWorkflow.requiredDocuments')}</span>
            </span>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc pl-5">
              <li>{t('verificationWorkflow.requiredDoc1', { owner: rel.landOwnerName })}</li>
              <li>{t('verificationWorkflow.requiredDoc2')}</li>
              <li>{t('verificationWorkflow.requiredDoc3')}</li>
            </ul>
          </div>
        </div>
      )}

      {isMatched && (
        <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-emerald-300">
              {t('verificationWorkflow.relMatchedBadge', 'Ownership Relationship Matched')}
            </h4>
            <p className="text-xs text-emerald-200/80 mt-0.5">{rel.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
};
