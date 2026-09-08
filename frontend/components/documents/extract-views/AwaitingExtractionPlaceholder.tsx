import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormCategory } from '../../../lib/cadastral-utils';
import { Button } from '../../ui/Button';
import { Sparkles } from 'lucide-react';

interface AwaitingExtractionPlaceholderProps {
  formCategory: FormCategory;
  onRunExtraction: () => void;
  isExtracting: boolean;
}

export const AwaitingExtractionPlaceholder: React.FC<AwaitingExtractionPlaceholderProps> = ({
  formCategory,
  onRunExtraction,
  isExtracting,
}) => {
  const { t } = useTranslation();

  return (
    <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-4">
      {/* Header informing user about the exact Form Template */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-xs">
              {formCategory === 'SALE_DEED' &&
                t('documents.saleDeedPlaceholder', {
                  defaultValue: 'नोंदणीकृत खरेदी खत (Sale Deed) Template Placeholder',
                })}
              {formCategory === 'MUTATION_REGISTER' &&
                t('documents.mutationRegisterPlaceholder', {
                  defaultValue: 'गाव नमुना ६ (Mutation Register) Template Placeholder',
                })}
              {formCategory === 'PROPERTY_CARD' &&
                t('documents.propertyCardPlaceholder', {
                  defaultValue: 'मिळकत पत्रिका (Property Card) Template Placeholder',
                })}
              {formCategory === '7_12_SATBARA' &&
                t('documents.satbaraPlaceholder', {
                  defaultValue: 'गाव नमुना ७/१२ (Satbara) Template Placeholder',
                })}
            </h4>
            <p className="text-[10px] text-slate-500">
              {t('documents.awaitingOcrDesc', {
                defaultValue: 'Awaiting AI Cadastral OCR execution to extract structured fields.',
              })}
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          {t('documents.scanIngested', { defaultValue: 'Scan Ingested' })}
        </span>
      </div>

      {/* Dedicated Form Ghost Grid representing separate placeholders per form */}
      {formCategory === 'SALE_DEED' && (
        <div className="space-y-2">
          <div className="p-2.5 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/30 flex justify-between text-xs">
            <span className="text-[11px] text-indigo-700 font-semibold">
              {t('documents.saleDeedPropertyNo', { defaultValue: 'प्लॉट / साईट क्रमांक (Site / Plot No.)' })}: {t('documents.awaitingOcr', { defaultValue: '[Awaiting OCR]' })}
            </span>
            <span className="text-[11px] text-indigo-700 font-semibold">
              {t('documents.deedRegistrationPid', { defaultValue: 'दस्त नोंदणी क्र.' })}: {t('documents.awaitingOcr', { defaultValue: '[Awaiting OCR]' })}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded border border-dashed border-slate-300 bg-white">
              <span className="text-[10px] text-slate-400">
                {t('documents.purchaserNewOwner', { defaultValue: 'खरेदीदार (Purchaser Name)' })}:
              </span>
              <div className="text-[11px] text-slate-400 font-mono italic mt-0.5">
                {t('documents.pendingAiExtraction', { defaultValue: 'Pending AI Extraction...' })}
              </div>
            </div>
            <div className="p-2 rounded border border-dashed border-slate-300 bg-white">
              <span className="text-[10px] text-slate-400">
                {t('documents.vendorOriginalOwner', { defaultValue: 'विक्रेता (Vendor Name)' })}:
              </span>
              <div className="text-[11px] text-slate-400 font-mono italic mt-0.5">
                {t('documents.pendingAiExtraction', { defaultValue: 'Pending AI Extraction...' })}
              </div>
            </div>
            <div className="p-2 rounded border border-dashed border-slate-300 bg-white">
              <span className="text-[10px] text-slate-400">
                {t('documents.superBuiltPlotArea', { defaultValue: 'क्षेत्रफळ (Plot Area)' })}:
              </span>
              <div className="text-[11px] text-slate-400 font-mono italic mt-0.5">
                {t('documents.pendingAiExtraction', { defaultValue: 'Pending AI Extraction...' })}
              </div>
            </div>
            <div className="p-2 rounded border border-dashed border-slate-300 bg-white">
              <span className="text-[10px] text-slate-400">
                {t('documents.localityColony', { defaultValue: 'परिसर व कॉलनी (Locality)' })}:
              </span>
              <div className="text-[11px] text-slate-400 font-mono italic mt-0.5">
                {t('documents.pendingAiExtraction', { defaultValue: 'Pending AI Extraction...' })}
              </div>
            </div>
          </div>
        </div>
      )}

      {formCategory === 'MUTATION_REGISTER' && (
        <div className="space-y-2">
          <div className="p-2.5 rounded-lg border border-dashed border-amber-200 bg-amber-50/30 flex justify-between text-xs">
            <span className="text-[11px] text-amber-800 font-semibold">
              {t('documents.mutationRegisterHeader', { defaultValue: 'फेरफार नोंद क्र. (Mutation Entry No.)' })}: {t('documents.awaitingOcr', { defaultValue: '[Awaiting OCR]' })}
            </span>
            <span className="text-[11px] text-amber-800 font-semibold">
              {t('documents.khataNoHeader', { defaultValue: 'खाते क्र.' })}: {t('documents.awaitingOcr', { defaultValue: '[Awaiting OCR]' })}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded border border-dashed border-slate-300 bg-white">
              <span className="text-[10px] text-slate-400">
                {t('documents.transfereeNewOwner', { defaultValue: 'नवीन खातेदार (New Acquirer)' })}:
              </span>
              <div className="text-[11px] text-slate-400 font-mono italic mt-0.5">
                {t('documents.pendingAiExtraction', { defaultValue: 'Pending AI Extraction...' })}
              </div>
            </div>
            <div className="p-2 rounded border border-dashed border-slate-300 bg-white">
              <span className="text-[10px] text-slate-400">
                {t('documents.transferorPreviousOwner', { defaultValue: 'मागील खातेदार (Transferor)' })}:
              </span>
              <div className="text-[11px] text-slate-400 font-mono italic mt-0.5">
                {t('documents.pendingAiExtraction', { defaultValue: 'Pending AI Extraction...' })}
              </div>
            </div>
            <div className="p-2 rounded border border-dashed border-slate-300 bg-white">
              <span className="text-[10px] text-slate-400">
                {t('documents.mutationNature', { defaultValue: 'हस्तांतरणाचा प्रकार (Mutation Type)' })}:
              </span>
              <div className="text-[11px] text-slate-400 font-mono italic mt-0.5">
                {t('documents.pendingAiExtraction', { defaultValue: 'Pending AI Extraction...' })}
              </div>
            </div>
            <div className="p-2 rounded border border-dashed border-slate-300 bg-white">
              <span className="text-[10px] text-slate-400">
                {t('documents.surveyGatNo', { defaultValue: 'संबंधित गट / सर्व्हे क्र.' })}:
              </span>
              <div className="text-[11px] text-slate-400 font-mono italic mt-0.5">
                {t('documents.pendingAiExtraction', { defaultValue: 'Pending AI Extraction...' })}
              </div>
            </div>
          </div>
        </div>
      )}

      {formCategory === 'PROPERTY_CARD' && (
        <div className="space-y-2">
          <div className="p-2.5 rounded-lg border border-dashed border-purple-200 bg-purple-50/30 flex justify-between text-xs">
            <span className="text-[11px] text-purple-800 font-semibold">
              {t('documents.ctsNumberHeader', { defaultValue: 'नगर भूमापन क्र. (CTS No.)' })}: {t('documents.awaitingOcr', { defaultValue: '[Awaiting OCR]' })}
            </span>
            <span className="text-[11px] text-purple-800 font-semibold">
              {t('documents.sheetWardNoHeader', { defaultValue: 'शिट व प्रभाग क्र.' })}: {t('documents.awaitingOcr', { defaultValue: '[Awaiting OCR]' })}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded border border-dashed border-slate-300 bg-white">
              <span className="text-[10px] text-slate-400">
                {t('documents.propertyHolder', { defaultValue: 'नोंदणीकृत मिळकतधारक' })}:
              </span>
              <div className="text-[11px] text-slate-400 font-mono italic mt-0.5">
                {t('documents.pendingAiExtraction', { defaultValue: 'Pending AI Extraction...' })}
              </div>
            </div>
            <div className="p-2 rounded border border-dashed border-slate-300 bg-white">
              <span className="text-[10px] text-slate-400">
                {t('documents.carpetPlotArea', { defaultValue: 'भूखंड क्षेत्रफळ' })}:
              </span>
              <div className="text-[11px] text-slate-400 font-mono italic mt-0.5">
                {t('documents.pendingAiExtraction', { defaultValue: 'Pending AI Extraction...' })}
              </div>
            </div>
          </div>
        </div>
      )}

      {formCategory === '7_12_SATBARA' && (
        <div className="space-y-2">
          <div className="p-2.5 rounded-lg border border-dashed border-blue-200 bg-blue-50/30 flex justify-between text-xs">
            <span className="text-[11px] text-blue-800 font-semibold">
              {t('documents.gatSurveyNo', { defaultValue: 'भूमापन / गट क्रमांक' })}: {t('documents.awaitingOcr', { defaultValue: '[Awaiting OCR]' })}
            </span>
            <span className="text-[11px] text-blue-800 font-semibold">
              {t('documents.khataNoHeader', { defaultValue: 'खाते क्र.' })}: {t('documents.awaitingOcr', { defaultValue: '[Awaiting OCR]' })}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded border border-dashed border-slate-300 bg-white">
              <span className="text-[10px] text-slate-400">
                {t('documents.farmerOwner', { defaultValue: 'खातेदार / मालक (Owner Name)' })}:
              </span>
              <div className="text-[11px] text-slate-400 font-mono italic mt-0.5">
                {t('documents.pendingAiExtraction', { defaultValue: 'Pending AI Extraction...' })}
              </div>
            </div>
            <div className="p-2 rounded border border-dashed border-slate-300 bg-white">
              <span className="text-[10px] text-slate-400">
                {t('documents.totalPlotArea', { defaultValue: 'क्षेत्रफळ (Total Plot Area)' })}:
              </span>
              <div className="text-[11px] text-slate-400 font-mono italic mt-0.5">
                {t('documents.pendingAiExtraction', { defaultValue: 'Pending AI Extraction...' })}
              </div>
            </div>
            <div className="p-2 rounded border border-dashed border-slate-300 bg-white">
              <span className="text-[10px] text-slate-400">
                {t('documents.villageJurisdiction', { defaultValue: 'गाव व मौजे (Village)' })}:
              </span>
              <div className="text-[11px] text-slate-400 font-mono italic mt-0.5">
                {t('documents.pendingAiExtraction', { defaultValue: 'Pending AI Extraction...' })}
              </div>
            </div>
            <div className="p-2 rounded border border-dashed border-slate-300 bg-white">
              <span className="text-[10px] text-slate-400">
                {t('documents.tenureClass', { defaultValue: 'धारणा पद्धती (Tenure Class)' })}:
              </span>
              <div className="text-[11px] text-slate-400 font-mono italic mt-0.5">
                {t('documents.pendingAiExtraction', { defaultValue: 'Pending AI Extraction...' })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Extraction Call To Action Button */}
      <div className="pt-2 text-center">
        <Button onClick={onRunExtraction} isLoading={isExtracting} className="mx-auto">
          <Sparkles className="w-4 h-4 mr-1.5" />
          {t('documents.runAiOcrPipeline', { defaultValue: 'Run AI OCR Pipeline & Digitize This Form' })}
        </Button>
      </div>
    </div>
  );
};
