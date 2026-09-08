'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileQuestion } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
}) => {
  const { t } = useTranslation();
  const displayTitle = title || t('emptyState.title', { defaultValue: 'No records found' });
  const displayDescription =
    description ||
    t('emptyState.description', {
      defaultValue: 'There are no items to display at this moment.',
    });

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-dashed border-slate-300 my-4">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
        {icon || <FileQuestion className="w-6 h-6" />}
      </div>
      <h4 className="text-sm font-semibold text-slate-800 mb-1">{displayTitle}</h4>
      <p className="text-xs text-slate-500 max-w-sm mb-4">{displayDescription}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
