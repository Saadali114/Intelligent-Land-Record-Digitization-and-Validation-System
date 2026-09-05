import React from 'react';
import { useTranslation } from 'react-i18next';
import { LandRecord } from '../../types';
import { Badge } from '../ui/Badge';
import { Skeleton } from '../ui/Skeleton';
import { FileCheck, Sparkles, Building2 } from 'lucide-react';

interface VerificationQueueListProps {
  records: LandRecord[];
  isLoading: boolean;
  selectedRecordId: string | null;
  onSelectRecord: (id: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export const VerificationQueueList: React.FC<VerificationQueueListProps> = ({
  records,
  isLoading,
  selectedRecordId,
  onSelectRecord,
  statusFilter,
  onStatusFilterChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="lg:col-span-4 flex flex-col space-y-3">
      <div className="gov-card p-3 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-blue-900" />
          {t('officerVerification.reviewQueue', { defaultValue: 'Review Queue' })} ({records.length})
        </span>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-2 py-1 text-xs rounded border border-slate-300 bg-white text-slate-700 focus:ring-1 focus:ring-blue-900"
        >
          <option value="">{t('officerDocuments.allStatuses', { defaultValue: 'All Statuses' })}</option>
          <option value="PENDING">{t('officerVerification.pendingReview', { defaultValue: 'Pending Review' })}</option>
          <option value="NEEDS_REVIEW">{t('officerVerification.needsReview', { defaultValue: 'Needs Review' })}</option>
          <option value="VERIFIED">{t('status.verified', { defaultValue: 'Verified' })}</option>
          <option value="REJECTED">{t('status.rejected', { defaultValue: 'Rejected' })}</option>
        </select>
      </div>

      <div className="gov-card p-2 space-y-1.5 max-h-[720px] overflow-y-auto">
        {isLoading && (
          <div className="p-3 space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        )}

        {!isLoading && records.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-400">
            {t('officerVerification.noRecords', { defaultValue: 'No records in this verification queue.' })}
          </div>
        )}

        {!isLoading &&
          records.map((rec) => {
            const isSelected =
              selectedRecordId === rec._id || (!selectedRecordId && records[0]?._id === rec._id);

            return (
              <button
                key={rec._id}
                type="button"
                onClick={() => onSelectRecord(rec._id)}
                className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex flex-col gap-1.5 ${
                  isSelected
                    ? 'border-blue-900 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate">
                    {rec.ownerName || 'Unknown Owner'}
                  </span>
                  <Badge status={rec.verificationStatus} />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono">Survey #{rec.surveyNumber}</span>
                  <span>
                    {rec.village}, {rec.district}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <span className="flex items-center gap-1 font-medium text-emerald-700">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Confidence: {(rec.confidenceScore * 100).toFixed(0)}%
                  </span>
                  <span className="truncate max-w-[120px]">{rec.landClassification}</span>
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
};
