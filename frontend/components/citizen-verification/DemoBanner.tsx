'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, AlertCircle, Info } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 text-amber-200 px-4 py-2.5 text-xs font-medium backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-amber-300">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
          <span className="font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
            {t('verificationWorkflow.demoEnvironment', 'Prototype Verification Environment')}
          </span>
          <span className="text-gray-300 hidden md:inline">|</span>
          <span className="text-gray-300 text-[11px] sm:text-xs">
            {t(
              'verificationWorkflow.demoDisclaimer',
              'Simulated government verification for demonstration. Real UIDAI / MahaBhunaksha APIs are simulated for hackathon evaluation.'
            )}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400/90 text-[11px] bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Statutory Compliance Mode Active</span>
        </div>
      </div>
    </div>
  );
};
