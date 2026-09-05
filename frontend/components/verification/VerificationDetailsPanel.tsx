import React from 'react';
import { useTranslation } from 'react-i18next';
import { LandRecord, VerificationAction } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  CheckCircle,
  XCircle,
  Edit3,
  Sparkles,
  AlertTriangle,
  Building2,
  ShieldCheck,
} from 'lucide-react';

interface VerificationDetailsPanelProps {
  record: LandRecord;
  onOpenAction: (action: VerificationAction) => void;
  canVerify: boolean;
}

export const VerificationDetailsPanel: React.FC<VerificationDetailsPanelProps> = ({
  record,
  onOpenAction,
  canVerify,
}) => {
  const { t } = useTranslation();
  const sourceDoc = typeof record.sourceDocument === 'object' ? record.sourceDocument : null;
  const aiMeta = sourceDoc?.metadata?.aiExtraction;

  return (
    <div className="gov-card p-5 space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">{record.ownerName}</h2>
            <Badge status={record.verificationStatus} />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Survey No: <strong className="text-slate-800 font-mono">{record.surveyNumber}</strong> •
            Khasra: <strong className="text-slate-800 font-mono">{record.khasraNumber}</strong>
          </p>
        </div>

        {canVerify && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenAction('APPROVED')}
              className="text-xs border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-900"
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              {t('officerVerification.approveAction', { defaultValue: 'Approve' })}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenAction('CORRECTED')}
              className="text-xs border-blue-300 text-blue-800 bg-blue-50 hover:bg-blue-100 hover:text-blue-900"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1 text-blue-600" />
              {t('officerVerification.correctionAction', { defaultValue: 'Edit & Verify' })}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenAction('REJECTED')}
              className="text-xs border-rose-300 text-rose-800 bg-rose-50 hover:bg-rose-100 hover:text-rose-900"
            >
              <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
              {t('officerVerification.rejectAction', { defaultValue: 'Reject' })}
            </Button>
          </div>
        )}
      </div>

      {/* Cadastral Data Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">{t('officerLandRecords.primaryOwner', { defaultValue: 'Owner Name' })}</span>
          <div className="mt-0.5 font-bold text-slate-900">{record.ownerName}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">{t('officerLandRecords.surveyDivision', { defaultValue: 'Survey Number' })}</span>
          <div className="mt-0.5 font-bold font-mono text-slate-900">{record.surveyNumber}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">{t('officerLandRecords.khasra', { defaultValue: 'Khasra Number' })}</span>
          <div className="mt-0.5 font-bold font-mono text-slate-900">{record.khasraNumber}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">{t('officerLandRecords.khata', { defaultValue: 'Khata Number' })}</span>
          <div className="mt-0.5 font-bold font-mono text-slate-900">{record.khataNumber}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">{t('officerLandRecords.plotArea', { defaultValue: 'Plot Area' })}</span>
          <div className="mt-0.5 font-bold text-emerald-800">{record.plotArea}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">{t('officerLandRecords.village', { defaultValue: 'Village' })}</span>
          <div className="mt-0.5 font-bold text-slate-900">{record.village}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">{t('officerLandRecords.tehsil', { defaultValue: 'Tehsil' })}</span>
          <div className="mt-0.5 font-bold text-slate-900">{record.tehsil}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">{t('officerLandRecords.district', { defaultValue: 'District' })}</span>
          <div className="mt-0.5 font-bold text-slate-900">{record.district}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">{t('officerLandRecords.classification', { defaultValue: 'Classification' })}</span>
          <div className="mt-0.5 font-bold text-slate-900">{record.landClassification}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">{t('officerLandRecords.ownershipType', { defaultValue: 'Ownership Type' })}</span>
          <div className="mt-0.5 font-bold text-slate-900">{record.ownershipType}</div>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 col-span-2">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Mutation / Deed Ref</span>
          <div className="mt-0.5 font-mono text-slate-800">{record.mutationNumber || '—'}</div>
        </div>
      </div>

      {/* AI Confidence & Inspection Anomaly Strip */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            AI Pipeline Confidence: {(record.confidenceScore * 100).toFixed(0)}%
          </span>
          {aiMeta?.ocrEngine && (
            <span className="text-[10px] font-mono text-slate-500">
              Engine: {aiMeta.ocrEngine}
            </span>
          )}
        </div>

        {aiMeta?.anomalies && aiMeta.anomalies.length > 0 && (
          <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px] space-y-1">
            <div className="font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Automated Inspection Flag(s):
            </div>
            {aiMeta.anomalies.map((anom: string, i: number) => (
              <div key={i} className="pl-3 text-slate-700">
                • {anom}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
