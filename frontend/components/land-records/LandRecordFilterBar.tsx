import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LandRecordFilterBarProps {
  search: string;
  onSearchChange: (search: string) => void;
  districtFilter: string;
  onDistrictFilterChange: (district: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  classificationFilter: string;
  onClassificationFilterChange: (classification: string) => void;
  availableDistricts?: string[];
  availableClassifications?: string[];
}

export const LandRecordFilterBar: React.FC<LandRecordFilterBarProps> = ({
  search,
  onSearchChange,
  districtFilter,
  onDistrictFilterChange,
  statusFilter,
  onStatusFilterChange,
  classificationFilter,
  onClassificationFilterChange,
  availableDistricts = [],
  availableClassifications = [],
}) => {
  const { t } = useTranslation();

  return (
    <div className="gov-card p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
      <div className="relative w-full md:w-72">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={t('common.searchPlaceholder') || 'Search owner, survey, khasra...'}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <select
          value={districtFilter}
          onChange={(e) => onDistrictFilterChange(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
        >
          <option value="">{t('common.all')} {t('common.district')}s</option>
          {availableDistricts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={classificationFilter}
          onChange={(e) => onClassificationFilterChange(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
        >
          <option value="">{t('common.all')} Types</option>
          {availableClassifications.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
        >
          <option value="">{t('common.all')} {t('common.status')}</option>
          <option value="ACTIVE">{t('common.verified') || 'Active'}</option>
          <option value="PENDING">{t('common.pending') || 'Pending'}</option>
          <option value="DISPUTED">{t('common.actionRequired') || 'Disputed'}</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
    </div>
  );
};
