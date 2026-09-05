import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DocumentFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  languageFilter: string;
  onLanguageFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
}

export const DocumentFilterBar: React.FC<DocumentFilterBarProps> = ({
  search,
  onSearchChange,
  languageFilter,
  onLanguageFilterChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="gov-card p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder={t('common.searchPlaceholder') || 'Search by file name, doc ID, language...'}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <select
          value={languageFilter}
          onChange={(e) => onLanguageFilterChange(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
        >
          <option value="">{t('common.all')} Languages</option>
          <option value="Marathi">मराठी (Marathi)</option>
          <option value="Hindi">हिन्दी (Hindi)</option>
          <option value="English">English</option>
          <option value="Gujarati">Gujarati</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
        >
          <option value="">{t('common.all')} {t('common.status')}</option>
          <option value="UPLOADED">{t('common.pending') || 'Uploaded'}</option>
          <option value="PROCESSING">{t('common.processing') || 'Processing'}</option>
          <option value="PROCESSED">{t('common.completed') || 'Processed'}</option>
          <option value="NEEDS_REVIEW">{t('common.actionRequired') || 'Needs Review'}</option>
          <option value="FAILED">{t('common.rejected') || 'Failed'}</option>
        </select>
      </div>
    </div>
  );
};
