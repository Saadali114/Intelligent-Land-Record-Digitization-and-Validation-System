'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, FileCheck2, AlertCircle, Stamp } from 'lucide-react';
import { VerificationWorkflowData } from '../../services/verificationWorkflowService';

interface StepDualPaneOcrReviewProps {
  workflow: VerificationWorkflowData;
}

export const StepDualPaneOcrReview: React.FC<StepDualPaneOcrReviewProps> = ({ workflow }) => {
  const { t } = useTranslation();
  const fields = workflow.document.extractedFields;
  const isAlteredCase = workflow.presetId === 'CASE_3_RED';

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {t('verificationWorkflow.originalDocumentScan', 'Original Archival Document')} & OCR Analysis
            </h2>
            <p className="text-xs text-slate-400">
              Synchronized side-by-side inspection between raw revenue scan and neural OCR model
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Average OCR Confidence:</span>
          <span
            className={`font-mono text-xs font-semibold px-2 py-0.5 rounded border ${
              workflow.document.avgConfidence >= 0.9
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {Math.round(workflow.document.avgConfidence * 100)}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: Authentic Form 7/12 Document Scan Facsimile */}
        <div className="lg:col-span-6 bg-amber-50/95 text-slate-900 rounded-lg p-5 border border-amber-200/80 shadow-inner font-serif select-none relative overflow-hidden">
          {/* Official Document Watermark & Border */}
          <div className="border-4 border-double border-amber-900/40 p-4 rounded min-h-[380px] flex flex-col justify-between relative">
            <div className="text-center border-b-2 border-amber-900/60 pb-2 mb-3">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Stamp className="w-5 h-5 text-amber-900/70" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-950">
                  महाराष्ट्र शासन — महसूल व वन विभाग
                </span>
              </div>
              <h3 className="text-sm font-bold text-amber-950">
                गाव नमुना नंबर सात व बारा (नियम २९ पहा)
              </h3>
              <p className="text-[10px] text-amber-900/80 italic">
                अधिकार अभिलेख पत्रक — तलाठी कार्यालय हवेली
              </p>
            </div>

            {/* Cadastral Header Info */}
            <div className="grid grid-cols-3 gap-2 text-[11px] mb-3 pb-2 border-b border-amber-900/20">
              <div>
                <span className="text-amber-900/70 font-sans text-[10px]">गाव: </span>
                <span className="font-bold">{fields.village?.value || 'पुणे'}</span>
              </div>
              <div>
                <span className="text-amber-900/70 font-sans text-[10px]">तालुका: </span>
                <span className="font-bold">{fields.taluka?.value || 'हवेली'}</span>
              </div>
              <div>
                <span className="text-amber-900/70 font-sans text-[10px]">जिल्हा: </span>
                <span className="font-bold">{fields.district?.value || 'पुणे'}</span>
              </div>
            </div>

            {/* Main Land Record Data Grid */}
            <div className="border border-amber-900/50 rounded overflow-hidden text-[11px] mb-3">
              <div className="grid grid-cols-3 bg-amber-200/70 font-bold border-b border-amber-900/40 p-1.5 text-center text-[10px]">
                <div>भूमापन क्रमांक व उपविभाग</div>
                <div>क्षेत्र (हेक्टर.आर)</div>
                <div>खातेदाराचे नाव / भोगवटादार वर्ग-१</div>
              </div>
              <div className="grid grid-cols-3 p-2.5 items-center text-center divide-x divide-amber-900/20">
                <div className="font-mono font-bold text-amber-950">
                  {fields.surveyNumber?.value}
                </div>
                <div
                  className={`font-mono font-bold p-1 rounded ${
                    isAlteredCase
                      ? 'bg-rose-500/20 text-rose-900 border border-rose-500/50 animate-pulse ring-2 ring-rose-500/30'
                      : 'text-amber-950'
                  }`}
                >
                  {fields.plotArea?.value}
                  {isAlteredCase && (
                    <span className="block text-[9px] text-rose-700 font-sans font-normal">
                      [Tamper Flagged]
                    </span>
                  )}
                </div>
                <div className="font-bold text-amber-950 text-left pl-2">
                  {fields.ownerName?.value}
                </div>
              </div>
            </div>

            {/* Mutation & Potkharaba Footer */}
            <div className="border-t border-amber-900/30 pt-2 text-[10px] flex justify-between text-amber-900/80">
              <span>फेरफार क्रमांक: <strong>{fields.mutationNumber?.value || 'MR-2026-00125'}</strong></span>
              <span>आकारणी: रु. ४.२५</span>
              <span>डिजिटल सही प्रमाणित प्रत</span>
            </div>

            {/* Government Seal Stamp Indicator */}
            <div className="absolute right-4 bottom-8 opacity-20 rotate-[-15deg] pointer-events-none">
              <div className="border-2 border-amber-900 rounded-full w-20 h-20 flex items-center justify-center text-[8px] font-bold uppercase text-center">
                तहसीलदार कार्यालय<br />हवेली, पुणे
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Extracted Cadastral Attributes with Confidences */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-200">
                {t('verificationWorkflow.extractedAttributes', 'Extracted Cadastral Attributes')}
              </h3>
              <span className="text-[11px] text-slate-400">Model: Devanagari Cadastral OCR</span>
            </div>

            <div className="space-y-2.5">
              {Object.entries(fields).map(([key, field]) => {
                const confPercent = Math.round(field.confidence * 100);
                const isHigh = field.status === 'HIGH';
                const isLow = field.status === 'LOW';

                return (
                  <div
                    key={key}
                    className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
                      isLow
                        ? 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                        : isHigh
                        ? 'bg-slate-950/60 border-slate-800 text-slate-200'
                        : 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    }`}
                  >
                    <div>
                      <div className="text-[11px] text-slate-400">{field.label}</div>
                      <div className="text-xs font-semibold text-white font-mono mt-0.5">
                        {field.value}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[10px] text-slate-400 mb-0.5">
                        {t('verificationWorkflow.confidence', 'Confidence')}
                      </div>
                      <span
                        className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                          isHigh
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : isLow
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/50'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {confPercent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Entities normalized against Maharashtra Land Revenue Code 1966 nomenclature.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
