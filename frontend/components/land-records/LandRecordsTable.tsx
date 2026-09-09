import React from 'react';
import { LandRecord } from '../../types';
import { Badge } from '../ui/Badge';
import { Pagination } from '../ui/Pagination';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { MapPin, Sparkles, Eye, Edit, Trash2, QrCode } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LandRecordsTableProps {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  records?: LandRecord[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewRecord: (rec: LandRecord) => void;
  onEditRecord: (rec: LandRecord) => void;
  onDeleteRecord: (id: string) => void;
  onShowQr?: (rec: LandRecord) => void;
  canEdit: boolean;
  canDelete: boolean;
}

export const LandRecordsTable: React.FC<LandRecordsTableProps> = ({
  isLoading,
  isError,
  errorMessage,
  records,
  pagination,
  currentPage,
  onPageChange,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
  onShowQr,
  canEdit,
  canDelete,
}) => {
  const { t } = useTranslation();

  return (
    <div className="gov-card overflow-hidden">
      {isLoading && (
        <div className="p-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      )}

      {isError && (
        <div className="p-6 text-center text-rose-600 text-xs font-semibold">
          {errorMessage || t('landRecords.failedToLoad', { defaultValue: 'Failed to load land records' })}
        </div>
      )}

      {!isLoading && !isError && (!records || records.length === 0) && (
        <EmptyState
          title={t('landRecords.noRecordsFound', { defaultValue: 'No Cadastral Records Found' })}
          description={t('landRecords.noRecordsDesc', {
            defaultValue: 'No records matched your search criteria. Try modifying your filters.',
          })}
        />
      )}

      {!isLoading && !isError && records && records.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">
                    {t('common.ownerName')} / {t('landRecords.parcel', { defaultValue: 'Parcel' })}
                  </th>
                  <th className="px-4 py-3.5">
                    {t('common.surveyNumber')} &amp; {t('landRecords.khasra', { defaultValue: 'Khasra' })}
                  </th>
                  <th className="px-4 py-3.5">{t('common.khataNumber')}</th>
                  <th className="px-4 py-3.5">{t('common.landType')}</th>
                  <th className="px-4 py-3.5">Status &amp; Verification</th>
                  <th className="px-4 py-3.5">
                    {t('landRecords.aiConfidence', { defaultValue: 'AI Confidence' })}
                  </th>
                  <th className="px-5 py-3.5 text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((rec) => (
                  <tr key={rec._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900">{rec.ownerName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>
                          {rec.village}, {rec.tehsil}, {rec.district}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-emerald-700 font-medium">{rec.plotArea}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px]">
                      <div className="font-semibold text-blue-900">
                        {t('common.survey', { defaultValue: 'Survey' })}: {rec.surveyNumber}
                      </div>
                      <div className="text-slate-400">
                        {t('landRecords.khasra', { defaultValue: 'Khasra' })}: {rec.khasraNumber}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[11px] text-slate-700">
                      {rec.khataNumber}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                        {rec.landClassification}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {rec.verificationStatus === 'VERIFIED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                          <QrCode className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>✓ QR Scanned &amp; Verified</span>
                        </span>
                      ) : (
                        <Badge status={rec.verificationStatus} />
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${rec.confidenceScore * 100}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono font-medium text-slate-600">
                          {(rec.confidenceScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onShowQr && (
                          <button
                            onClick={() => onShowQr(rec)}
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors cursor-pointer"
                            title="View Official Digital QR Verification Seal"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onViewRecord(rec)}
                          className="p-1.5 text-slate-500 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                          title={t('common.viewDetails', { defaultValue: 'View Details' })}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => onEditRecord(rec)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                            title={t('landRecords.editRecord', { defaultValue: 'Edit Record' })}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => onDeleteRecord(rec._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title={t('landRecords.deleteRecord', { defaultValue: 'Delete Record' })}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && (
            <div className="border-t border-slate-100 px-4">
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                limit={pagination.limit}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
