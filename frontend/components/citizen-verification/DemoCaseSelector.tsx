'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, AlertTriangle, XCircle, Sparkles } from 'lucide-react';

interface DemoCaseSelectorProps {
  selectedPreset: 'CASE_1_GREEN' | 'CASE_2_YELLOW' | 'CASE_3_RED';
  onSelectPreset: (preset: 'CASE_1_GREEN' | 'CASE_2_YELLOW' | 'CASE_3_RED') => void;
  disabled?: boolean;
}

export const DemoCaseSelector: React.FC<DemoCaseSelectorProps> = ({
  selectedPreset,
  onSelectPreset,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const presets = [
    {
      id: 'CASE_1_GREEN' as const,
      label: t('verificationWorkflow.case1Green', 'Case 1: Genuine Owner (Low Risk / Approved)'),
      subtitle: t('verificationWorkflow.case1Subtitle'),
      badge: t('verificationWorkflow.lowRisk'),
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      activeBorder: 'border-emerald-500 ring-1 ring-emerald-500/50 bg-emerald-950/20',
      icon: CheckCircle,
      iconColor: 'text-emerald-400',
    },
    {
      id: 'CASE_2_YELLOW' as const,
      label: t(
        'verificationWorkflow.case2Yellow',
        'Case 2: Stolen / Unestablished Relationship (Medium Risk / Action Required)'
      ),
      subtitle: t('verificationWorkflow.case2Subtitle'),
      badge: t('verificationWorkflow.mediumRisk'),
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      activeBorder: 'border-amber-500 ring-1 ring-amber-500/50 bg-amber-950/20',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
    },
    {
      id: 'CASE_3_RED' as const,
      label: t(
        'verificationWorkflow.case3Red',
        'Case 3: Cadastral Discrepancy & Alteration (High Risk / Officer Review)'
      ),
      subtitle: t('verificationWorkflow.case3Subtitle'),
      badge: t('verificationWorkflow.highRisk'),
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      activeBorder: 'border-rose-500 ring-1 ring-rose-500/50 bg-rose-950/20',
      icon: XCircle,
      iconColor: 'text-rose-400',
    },
  ];

  return (
    <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
            {t('verificationWorkflow.presetCasesTitle', 'Ready-to-Run Verification Presets')}
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">
          {t('verificationWorkflow.presetCasesSubtitle')}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {presets.map((preset) => {
          const Icon = preset.icon;
          const isSelected = selectedPreset === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectPreset(preset.id)}
              className={`text-left p-3 rounded-lg border transition-all duration-150 flex flex-col justify-between gap-2 ${
                isSelected
                  ? preset.activeBorder
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 opacity-80 hover:opacity-100'
              } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 shrink-0 ${preset.iconColor}`} />
                  <span className="text-xs font-medium text-slate-200 line-clamp-1">{preset.label}</span>
                </div>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded border uppercase shrink-0 ${preset.badgeColor}`}
                >
                  {preset.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">{preset.subtitle}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
