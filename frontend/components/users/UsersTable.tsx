import React from 'react';
import { User } from '../../types';
import { Badge } from '../ui/Badge';
import { Pagination } from '../ui/Pagination';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { formatDate } from '../../lib/utils';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UsersTableProps {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  users?: User[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  currentPage: number;
  onPageChange: (page: number) => void;
  onToggleStatus: (id: string, currentStatus: string) => void;
  onConfirmDelete: (id: string) => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  isLoading,
  isError,
  errorMessage,
  users,
  pagination,
  currentPage,
  onPageChange,
  onToggleStatus,
  onConfirmDelete,
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
          {errorMessage || t('officerUsers.failedLoadUsers', { defaultValue: 'Failed to load users' })}
        </div>
      )}

      {!isLoading && !isError && (!users || users.length === 0) && (
        <EmptyState
          title={t('officerUsers.noUsersFound', { defaultValue: 'No Users Found' })}
          description={t('officerUsers.noUsersDesc', {
            defaultValue: 'No official accounts match your current filter criteria.',
          })}
        />
      )}

      {!isLoading && !isError && users && users.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-semibold border-b border-slate-200 text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">
                    {t('officerUsers.userCol', { defaultValue: 'User' })}{' '}
                    {t('common.details', { defaultValue: 'Details' })}
                  </th>
                  <th className="px-4 py-3.5">{t('common.role', { defaultValue: 'Role' })}</th>
                  <th className="px-4 py-3.5">
                    {t('officerProfile.department', { defaultValue: 'Department' })}
                  </th>
                  <th className="px-4 py-3.5">{t('common.district')}</th>
                  <th className="px-4 py-3.5">{t('common.status')}</th>
                  <th className="px-4 py-3.5">{t('officerUsers.joined', { defaultValue: 'Joined' })}</th>
                  <th className="px-5 py-3.5 text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900">{user.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{user.email}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge status={user.role} />
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">{user.department}</td>
                    <td className="px-4 py-3.5 font-medium text-slate-700">{user.district}</td>
                    <td className="px-4 py-3.5">
                      <Badge status={user.status} />
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{formatDate(user.createdAt)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onToggleStatus(user._id, user.status)}
                          className="px-2 py-1 rounded text-[11px] font-medium border border-slate-200 hover:bg-slate-100 transition-colors"
                          title={t('officerUsers.toggleAccountTitle', {
                            defaultValue: 'Toggle account active/inactive',
                          })}
                        >
                          {user.status === 'ACTIVE'
                            ? t('officerUsers.deactivate', { defaultValue: 'Deactivate' })
                            : t('officerUsers.activate', { defaultValue: 'Activate' })}
                        </button>
                        <button
                          onClick={() => onConfirmDelete(user._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title={t('officerUsers.deleteAccountTitle', {
                            defaultValue: 'Delete account',
                          })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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

