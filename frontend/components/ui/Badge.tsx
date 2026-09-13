'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'neutral'
    | 'purple';
  status?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant,
  status,
  children,
  ...props
}) => {
  const { t } = useTranslation();
  let resolvedVariant = variant || 'default';

  // Auto-resolve variant based on standard status words if status is provided
  if (status) {
    const s = status.toUpperCase();
    if (s === 'VERIFIED' || s === 'PROCESSED' || s === 'ACTIVE' || s === 'APPROVED') {
      resolvedVariant = 'success';
    } else if (s === 'PENDING' || s === 'UPLOADED' || s === 'VERIFIER') {
      resolvedVariant = 'warning';
    } else if (s === 'REJECTED' || s === 'FAILED' || s === 'SUSPENDED') {
      resolvedVariant = 'danger';
    } else if (s === 'PROCESSING' || s === 'OFFICER') {
      resolvedVariant = 'info';
    } else if (s === 'ADMIN' || s === 'NEEDS_REVIEW' || s === 'CORRECTED') {
      resolvedVariant = 'purple';
    } else if (s === 'PENDING_OFFICER_REVIEW') {
      resolvedVariant = 'info';
    } else if (s === 'INACTIVE') {
      resolvedVariant = 'neutral';
    }
  }

  const variants = {
    default: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-900 border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    info: 'bg-teal-50 text-teal-800 border-teal-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-purple-50 text-purple-800 border-purple-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide uppercase',
        variants[resolvedVariant],
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          resolvedVariant === 'success' && 'bg-emerald-500',
          resolvedVariant === 'warning' && 'bg-amber-500',
          resolvedVariant === 'danger' && 'bg-rose-500',
          resolvedVariant === 'info' && 'bg-sky-500',
          resolvedVariant === 'purple' && 'bg-purple-500',
          resolvedVariant === 'neutral' && 'bg-slate-400',
          resolvedVariant === 'default' && 'bg-blue-500'
        )}
      />
      {children
        ? typeof children === 'string'
          ? t(`roles.${children.toLowerCase()}`, {
              defaultValue: t(`status.${children.toLowerCase()}`, { defaultValue: children }),
            })
          : children
        : status
        ? t(`roles.${status.toLowerCase()}`, {
            defaultValue: t(`status.${status.toLowerCase()}`, { defaultValue: status.replace(/_/g, ' ') }),
          })
        : null}
    </span>
  );
};
