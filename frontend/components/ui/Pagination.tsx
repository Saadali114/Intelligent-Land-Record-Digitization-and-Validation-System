'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
}) => {
  const { t } = useTranslation();
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2">
      <div className="text-xs text-slate-600 font-medium">
        {t('pagination.showing', { defaultValue: 'Showing' })}{' '}
        <span className="font-semibold text-slate-900">{startItem}</span>{' '}
        {t('pagination.to', { defaultValue: 'to' })}{' '}
        <span className="font-semibold text-slate-900">{endItem}</span>{' '}
        {t('pagination.of', { defaultValue: 'of' })}{' '}
        <span className="font-semibold text-slate-900">{totalItems}</span>{' '}
        {t('pagination.records', { defaultValue: 'records' })}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-8 px-2.5"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          {t('pagination.previous', { defaultValue: 'Previous' })}
        </Button>

        <span className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-md">
          {t('pagination.pageOf', {
            current: currentPage,
            total: totalPages || 1,
            defaultValue: `Page ${currentPage} of ${totalPages || 1}`,
          })}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-8 px-2.5"
        >
          {t('pagination.next', { defaultValue: 'Next' })}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};
