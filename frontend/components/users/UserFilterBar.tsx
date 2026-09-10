import React from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UserFilterBarProps {
  search: string;
  onSearchChange: (search: string) => void;
  roleFilter: string;
  onRoleFilterChange: (role: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export const UserFilterBar: React.FC<UserFilterBarProps> = ({
  search,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
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
          placeholder={t('common.searchPlaceholder') || 'Search by name, email, district...'}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
        />
      </div>

      <div className="flex items-center gap-2 w-full md:w-auto">
        <select
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
        >
          <option value="">{t('common.all')} Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="OFFICER">Officer</option>
          <option value="VERIFIER">Verifier</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
        >
          <option value="">{t('common.all')} {t('common.status')}</option>
          <option value="ACTIVE">{t('common.verified') || 'Active'}</option>
          <option value="INACTIVE">Inactive</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>
    </div>
  );
};
