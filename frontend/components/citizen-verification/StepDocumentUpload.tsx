'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, UploadCloud, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';
import { VerificationWorkflowData } from '../../services/verificationWorkflowService';

interface StepDocumentUploadProps {
  workflow: VerificationWorkflowData;
  onStartProcessing: () => void;
  isProcessing?: boolean;
}

export const StepDocumentUpload: React.FC<StepDocumentUploadProps> = ({
  workflow,
  onStartProcessing,
  isProcessing = false,
}) => {
  const { t } = useTranslation();
  const [selectedDocType, setSelectedDocType] = useState('7/12 Extract (Satbara)');

  const docTypes = [
    {
      id: '7/12 Extract (Satbara)',
      label: t('verificationWorkflow.satbaraExtract', '7/12 Extract (Satbara)'),
      desc: 'Maharashtra Land Revenue Code, Form VII & XII record of rights',
    },
    {
      id: 'Ferfar / Mutation Register',
      label: t('verificationWorkflow.ferfarRegister', 'Ferfar / Mutation Register'),
      desc: 'Form VI record of changes, succession & transfer mutations',
    },
    {
      id: 'Registered Sale Deed',
      label: t('verificationWorkflow.saleDeed', 'Registered Sale Deed (Kharidi Khat)'),
      desc: 'Sub-registrar certified deed with stamp duty verification',
    },
  ];

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            {t('verificationWorkflow.uploadTitle', 'Upload Land Document for Verification')}
          </h2>
          <p className="text-xs text-slate-400">
            {t(
              'verificationWorkflow.pillar2Desc',
              'Evaluate document structure, required attributes, OCR confidence, and visual consistency.'
            )}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Document Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            {t('verificationWorkflow.selectDocumentType', 'Select Document Type')}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {docTypes.map((type) => {
              const isSelected = selectedDocType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedDocType(type.id)}
                  className={`text-left p-3.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold">{type.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{type.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload Dropzone / File Preview */}
        <div className="border-2 border-dashed border-slate-700 hover:border-slate-600 rounded-xl p-6 bg-slate-950/40 text-center flex flex-col items-center justify-center transition-colors">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 mb-3">
            <FileText className="w-6 h-6 text-emerald-400" />
          </div>

          <div className="mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-200 font-mono">
              <span>{workflow.document.fileName}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{workflow.document.fileSize}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 max-w-md mx-auto mb-2">
            Loaded from demo archive for active test scenario. Document is pre-scanned at 300 DPI high-resolution for OCR feature analysis.
          </p>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 justify-center">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>OCR Engine: {workflow.document.ocrEngine}</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onStartProcessing}
            disabled={isProcessing}
            className="w-full py-3 px-6 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Running 4-Pillar Pipeline...</span>
            ) : (
              <>
                <span>
                  {t(
                    'verificationWorkflow.startVerification',
                    'Start Automated 4-Pillar Verification'
                  )}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
