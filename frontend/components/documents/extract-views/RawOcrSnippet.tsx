import React from 'react';
import { useTranslation } from 'react-i18next';

interface RawOcrSnippetProps {
  rawText?: string;
}

export const RawOcrSnippet: React.FC<RawOcrSnippetProps> = ({ rawText }) => {
  const { t } = useTranslation();
  if (!rawText) return null;

  return (
    <details className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 cursor-pointer">
      <summary className="font-semibold text-slate-700 select-none">
        {t('documents.viewRawOcrText', { defaultValue: 'View Raw OCR Text Extracted from Scan' })}
      </summary>
      <pre className="mt-2 text-[11px] font-mono text-slate-700 bg-white p-2.5 rounded border border-slate-200 whitespace-pre-wrap max-h-36 overflow-y-auto">
        {rawText}
      </pre>
    </details>
  );
};
