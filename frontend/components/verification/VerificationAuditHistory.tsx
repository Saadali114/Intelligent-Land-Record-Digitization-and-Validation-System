import React from 'react';
import { useTranslation } from 'react-i18next';
import { VerificationRecord } from '../../types';
import { Badge } from '../ui/Badge';
import { formatDateTime } from '../../lib/utils';
import { History } from 'lucide-react';

interface VerificationAuditHistoryProps {
  history?: VerificationRecord[];
}

export const VerificationAuditHistory: React.FC<VerificationAuditHistoryProps> = ({
  history,
}) => {
  const { t } = useTranslation();
  if (!history || history.length === 0) return null;

  return (
    <div className="gov-card p-4 space-y-3">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
        <History className="w-4 h-4 text-blue-900" />
        {t('officerVerification.auditHistoryTitle', { defaultValue: 'Inspection Audit Trail' })} ({history.length})
      </span>

      <div className="space-y-2">
        {history.map((h) => (
          <div
            key={h._id}
            className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 text-xs flex flex-col gap-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">
                  {typeof h.verifiedBy === 'object' ? h.verifiedBy.name : 'Officer'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {typeof h.verifiedBy === 'object' ? h.verifiedBy.role : 'INSPECTOR'}
                </span>
              </div>
              <Badge status={h.action} />
            </div>

            <p className="text-slate-600 italic text-[11px] mt-0.5">
              &quot;{h.remarks}&quot;
            </p>

            <span className="text-[10px] text-slate-400 self-end">
              {formatDateTime(h.verifiedAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
