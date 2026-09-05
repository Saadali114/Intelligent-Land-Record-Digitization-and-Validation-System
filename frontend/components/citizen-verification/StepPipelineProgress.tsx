'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Loader2, Cpu } from 'lucide-react';

interface StepPipelineProgressProps {
  onComplete: () => void;
  speedMs?: number;
}

export const StepPipelineProgress: React.FC<StepPipelineProgressProps> = ({
  onComplete,
  speedMs = 450,
}) => {
  const { t } = useTranslation();
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    { key: 'p1', label: t('verificationWorkflow.p1', 'Document Uploaded') },
    { key: 'p2', label: t('verificationWorkflow.p2', 'Image Preprocessing & Quality Check') },
    { key: 'p3', label: t('verificationWorkflow.p3', 'Language & Script Detection (Devanagari)') },
    { key: 'p4', label: t('verificationWorkflow.p4', 'Cadastral OCR & Text Extraction') },
    { key: 'p5', label: t('verificationWorkflow.p5', 'Entity Extraction (Owner, Survey, Area)') },
    { key: 'p6', label: t('verificationWorkflow.p6', 'Document Consistency & Tamper Analysis') },
    { key: 'p7', label: t('verificationWorkflow.p7', 'Official Land Record Database Matching') },
    { key: 'p8', label: t('verificationWorkflow.p8', 'User ↔ Land Relationship Verification') },
    { key: 'p9', label: t('verificationWorkflow.p9', 'Risk Engine & Discrepancy Scoring') },
    { key: 'p10', label: t('verificationWorkflow.p10', 'Dossier Prepared for Officer Review') },
  ];

  useEffect(() => {
    if (currentStage < stages.length) {
      const timer = setTimeout(() => {
        setCurrentStage((prev) => prev + 1);
      }, speedMs);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentStage, stages.length, speedMs, onComplete]);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 animate-pulse">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Automated Verification Pipeline</h2>
            <p className="text-xs text-slate-400">
              Executing multi-pillar verification algorithms against state cadastral rules
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-semibold text-sky-400">
            {Math.min(100, Math.round((currentStage / stages.length) * 100))}%
          </span>
          <p className="text-[10px] text-slate-500">Processing Stage {Math.min(stages.length, currentStage + 1)} of {stages.length}</p>
        </div>
      </div>

      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;
          return (
            <div
              key={stage.key}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                  : isCurrent
                  ? 'bg-sky-950/40 border-sky-500 text-sky-300 ring-1 ring-sky-500/40'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono w-6 text-slate-400">0{idx + 1}</span>
                <span className="text-xs font-medium">{stage.label}</span>
              </div>
              <div>
                {isDone ? (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Completed</span>
                  </span>
                ) : isCurrent ? (
                  <span className="flex items-center gap-1.5 text-xs text-sky-400 font-medium animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Evaluating...</span>
                  </span>
                ) : (
                  <span className="text-xs text-slate-600 font-mono">Queued</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
