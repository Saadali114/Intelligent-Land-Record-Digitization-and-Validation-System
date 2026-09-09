'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { UserDocumentVerificationWorkstation } from '../../components/verification';
import { CheckCheck } from 'lucide-react';

export default function VerificationPage() {
  const { t } = useTranslation();
  const { isAdmin, isVerifier, isOfficer } = useAuth();

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Verification Workstation Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-900 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                {t('officerVerification.statutoryDocumentTitle', {
                  defaultValue: 'Statutory Verification & Title Validation Workstation',
                })}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <CheckCheck className="w-6 h-6 text-blue-900" />
              {t('officerVerification.title', { defaultValue: 'Document Verification Queue' })}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {t('officerVerification.userDocsSubtitle', {
                defaultValue:
                  'Inspect citizen land documents, cross-reference side-by-side against official government cadastral records, and generate statutory validation reports.',
              })}
            </p>
          </div>
        </div>

        {/* Full Verification Workstation with Split Screen & Hideable Queue */}
        <UserDocumentVerificationWorkstation canVerify={isAdmin || isVerifier || isOfficer} />
      </div>
    </AppLayout>
  );
}
