import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { DocumentRecord } from '../../types';
import { FormCategory, getDocumentFormCategory, translateCadastralText } from '../../lib/cadastral-utils';
import { exportCadastralPdfCertificate } from '../../lib/certificate-generator';
import { Button } from '../ui/Button';
import { SatbaraExtractView } from './extract-views/SatbaraExtractView';
import { SaleDeedExtractView } from './extract-views/SaleDeedExtractView';
import { MutationRegisterExtractView } from './extract-views/MutationRegisterExtractView';
import { PropertyCardExtractView } from './extract-views/PropertyCardExtractView';
import { AwaitingExtractionPlaceholder } from './extract-views/AwaitingExtractionPlaceholder';
import { RawOcrSnippet } from './extract-views/RawOcrSnippet';
import {
  Sparkles,
  Building2,
  Landmark,
  FileCheck2,
  CheckCircle2,
  Printer,
  Globe,
  Languages,
  ArrowRightLeft,
  AlertTriangle,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface CadastralRecordViewProps {
  document: DocumentRecord;
  onRunExtraction: (id: string) => void;
  isExtracting: boolean;
}

export const CadastralRecordView: React.FC<CadastralRecordViewProps> = ({
  document: doc,
  onRunExtraction,
  isExtracting,
}) => {
  const { t } = useTranslation();
  const formCat = getDocumentFormCategory(doc);

  // Translation States
  const [targetLanguage, setTargetLanguage] = useState<'en' | 'mr' | 'hi' | 'gu' | 'kn' | 'te' | 'ta' | 'bn'>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const [showSideBySide, setShowSideBySide] = useState(false);
  const [translatedData, setTranslatedData] = useState<Record<string, string>>({});
  const [translationNotice, setTranslationNotice] = useState<string | null>(null);

  // Reset translator when document changes
  useEffect(() => {
    setTranslatedData({});
    setIsTranslated(false);
    setShowSideBySide(false);
    setTranslationNotice(null);
  }, [doc._id]);

  const handleTranslateRecord = async () => {
    if (!doc.landRecord) return;
    setIsTranslating(true);
    setTranslationNotice(null);

    try {
      const lr = doc.landRecord;
      const entities = doc.metadata?.aiExtraction?.entities || {};
      const fieldsToTranslate: Record<string, string> = {
        ownerName: lr.ownerName || '',
        village: lr.village || '',
        tehsil: lr.tehsil || '',
        district: lr.district || '',
        ownershipType: lr.ownershipType || '',
        landClassification: lr.landClassification || '',
        plotArea: lr.plotArea || '',
        mutationNumber: lr.mutationNumber || '',
        remarks: lr.remarks || '',
        vendorName:
          entities.vendor_name ||
          (lr.remarks?.match(/Vendor:\s*([^->|]+)/)?.[1]?.trim() || ''),
        purchaserName:
          entities.purchaser_name ||
          (lr.remarks?.match(/Purchaser:\s*([^|]+)/)?.[1]?.trim() || lr.ownerName || ''),
        considerationAmount:
          entities.consideration_amount ||
          (lr.remarks?.match(/Consideration:\s*([^|]+)/)?.[1]?.trim() || ''),
        locality: entities.locality || lr.village || '',
      };

      const result: Record<string, string> = {};
      await Promise.all(
        Object.entries(fieldsToTranslate).map(async ([key, val]) => {
          if (val) {
            result[key] = await translateCadastralText(val, targetLanguage);
          } else {
            result[key] = '';
          }
        })
      );

      setTranslatedData(result);
      setIsTranslated(true);
      const langNames: Record<string, string> = {
        en: 'English',
        mr: 'मराठी',
        hi: 'हिन्दी',
        gu: 'ગુજરાતી',
        kn: 'ಕನ್ನಡ',
        te: 'తెలుగు',
        ta: 'தமிழ்',
        bn: 'বাংলা',
      };
      setTranslationNotice(
        `${t('documents.translatedRecord', { defaultValue: 'Translated record' })} (${langNames[targetLanguage] || targetLanguage})`
      );
    } catch (err: any) {
      alert('Translation service error: ' + (err.message || 'Unknown'));
    } finally {
      setIsTranslating(false);
    }
  };

  const handleResetTranslation = () => {
    setTranslatedData({});
    setIsTranslated(false);
    setShowSideBySide(false);
    setTranslationNotice(null);
  };

  const renderFieldVal = (transKey: string, originalVal: string | undefined, fallback = '—') => {
    const original = originalVal || fallback;
    const translated = isTranslated ? translatedData[transKey] || original : original;

    if (showSideBySide && isTranslated && translated !== original) {
      return (
        <div>
          <div className="text-slate-900 font-bold">{translated}</div>
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{original}</div>
        </div>
      );
    }
    return <div className="text-slate-900 font-bold">{translated}</div>;
  };

  const lr = doc.landRecord;
  const entities = doc.metadata?.aiExtraction?.entities || {};
  const notSpecified = t('common.notSpecified', { defaultValue: 'Not Specified' });
  const vendor =
    translatedData.vendorName ||
    entities.vendor_name ||
    lr?.remarks?.match(/Vendor:\s*([^->|]+)/)?.[1]?.trim() ||
    notSpecified;
  const purchaser =
    translatedData.purchaserName ||
    entities.purchaser_name ||
    lr?.remarks?.match(/Purchaser:\s*([^|]+)/)?.[1]?.trim() ||
    lr?.ownerName ||
    notSpecified;
  const consideration =
    translatedData.considerationAmount ||
    entities.consideration_amount ||
    lr?.remarks?.match(/Consideration:\s*([^|]+)/)?.[1]?.trim() ||
    notSpecified;
  const execDate =
    entities.execution_date ||
    lr?.remarks?.match(/(?:Date|Executed):\s*([^|]+)/)?.[1]?.trim() ||
    '';
  const stampDuty =
    entities.stamp_duty || t('documents.nonJudicialStampPaper', { defaultValue: 'Non-Judicial Stamp Paper' });

  return (
    <div className="lg:col-span-6 flex flex-col space-y-3">
      {/* Re-uploaded Document Warning Banner */}
      {(doc.isReuploaded ||
        doc.metadata?.isReuploaded ||
        doc.metadata?.aiExtraction?.anomalies?.some((a: string) =>
          a.toLowerCase().includes('duplicate') || a.toLowerCase().includes('already exists')
        )) && (
        <div className="p-2.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 flex items-start gap-2 text-xs shadow-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>{t('documents.reuploadedWarningTitle', { defaultValue: 'Re-Uploaded Document Detected' })}</span>
              <span className="text-[10px] font-semibold bg-amber-200 text-amber-800 px-1.5 py-0.5 rounded">
                {t('documents.duplicateParcelBadge', { defaultValue: 'Duplicate Parcel' })}
              </span>
            </div>
            <p className="text-[11px] text-amber-800 mt-0.5">
              {t('documents.reuploadedWarningDesc', { defaultValue: 'This document or land parcel already exists in the registry' })}
              {doc.reuploadedFromId || doc.metadata?.reuploadedFromId
                ? ` (Original: ${doc.reuploadedFromId || doc.metadata?.reuploadedFromId})`
                : ''}
              . {t('documents.reuploadedConfidenceNote', { defaultValue: 'AI confidence has been adjusted to mandate revenue officer review.' })}
            </p>
          </div>
        </div>
      )}
      {/* Streamlined Header with Badges, Inline Translation and PDF Export */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            {t('documents.digitizedCadastralRecord', { defaultValue: 'Digitized Cadastral Record' })}
          </span>

          {/* Form Category Badge */}
          {formCat === 'SALE_DEED' && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              {t('documents.saleDeedBadge', { defaultValue: 'खरेदी खत (Sale Deed)' })}
            </span>
          )}
          {formCat === 'MUTATION_REGISTER' && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
              <Landmark className="w-3 h-3" />
              {t('documents.mutationRegisterBadge', { defaultValue: 'फेरफार नोंदवही (Form 6)' })}
            </span>
          )}
          {formCat === 'PROPERTY_CARD' && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
              <FileCheck2 className="w-3 h-3" />
              {t('documents.propertyCardBadge', { defaultValue: 'मिळकत पत्रिका (Property Card)' })}
            </span>
          )}
          {formCat === '7_12_SATBARA' && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {t('documents.satbaraBadge', { defaultValue: 'गाव नमुना ७/१२ (Satbara)' })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Compact Inline Translation Selector */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value as any)}
              className="text-[11px] bg-transparent border-none py-1 pr-1 text-slate-700 font-medium focus:ring-0 cursor-pointer"
            >
              <option value="en">English (इंग्रजी)</option>
              <option value="mr">मराठी (Original)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
            </select>
            <Button
              size="sm"
              variant="outline"
              onClick={handleTranslateRecord}
              isLoading={isTranslating}
              className="h-6 px-2 text-[10px] font-bold bg-white text-blue-700 border-slate-200 hover:bg-slate-50 shadow-none"
            >
              {t('documents.translate', { defaultValue: 'Translate' })}
            </Button>
          </div>

          {doc.landRecord && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                exportCadastralPdfCertificate({
                  doc,
                  formCat,
                  isTranslated,
                  translatedData,
                  targetLanguage,
                })
              }
              className="text-xs h-7.5 px-3 bg-blue-50/80 border-blue-200 text-blue-900 hover:bg-blue-100 font-semibold"
              title={t('documents.downloadPdfTitle', { defaultValue: 'Download official digital certificate as PDF' })}
            >
              <Printer className="w-3.5 h-3.5 mr-1 text-blue-700" />
              {t('documents.downloadPdf', { defaultValue: 'Download PDF' })}
            </Button>
          )}
        </div>
      </div>

      {/* Translation Compare Strip (Only visible when translated) */}
      {isTranslated && (
        <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center justify-between">
          <span className="font-medium">✓ {translationNotice || t('documents.translatedRecord', { defaultValue: 'Translated record' })}</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowSideBySide(!showSideBySide)}
              className={`px-2 py-0.5 text-[10px] font-bold rounded border transition-colors flex items-center gap-1 ${
                showSideBySide
                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <ArrowRightLeft className="w-3 h-3" />
              {showSideBySide
                ? t('documents.sideBySideOn', { defaultValue: 'Side-by-Side: ON' })
                : t('documents.compareView', { defaultValue: 'Compare View' })}
            </button>
            <button
              type="button"
              onClick={handleResetTranslation}
              className="px-2 py-0.5 text-[10px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors"
            >
              {t('documents.showOriginal', { defaultValue: 'Show Original' })}
            </button>
          </div>
        </div>
      )}

      {doc.landRecord ? (
        <div className="space-y-3">
          {/* OCR Quality Warning Banner */}
          {doc.metadata?.aiExtraction?.anomalies?.some((a: string) => a.includes('Low OCR')) && (
            <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-lg text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-rose-800">
                  {t('documents.lowOcrQualityTitle', { defaultValue: 'OCR Could Not Read This Document Clearly' })}
                </div>
                <div className="text-rose-700 mt-0.5">
                  {t('documents.lowOcrQualityDesc', {
                    defaultValue:
                      'The scan quality prevented accurate text extraction. Values below are estimated placeholders — please update in Verification Workstation.',
                  })}
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC FORM-SPECIFIC CADASTRAL DATA GRID */}
          {formCat === 'SALE_DEED' && (
            <SaleDeedExtractView
              landRecord={lr!}
              purchaser={purchaser}
              vendor={vendor}
              consideration={consideration}
              execDate={execDate}
              stampDuty={stampDuty}
              renderFieldVal={renderFieldVal}
            />
          )}

          {formCat === 'MUTATION_REGISTER' && (
            <MutationRegisterExtractView
              landRecord={lr!}
              vendor={vendor}
              renderFieldVal={renderFieldVal}
            />
          )}

          {formCat === 'PROPERTY_CARD' && (
            <PropertyCardExtractView
              landRecord={lr!}
              renderFieldVal={renderFieldVal}
            />
          )}

          {formCat === '7_12_SATBARA' && (
            <SatbaraExtractView
              landRecord={lr!}
              renderFieldVal={renderFieldVal}
            />
          )}

          {/* Clean AI Extraction Status Footer */}
          {doc.metadata?.aiExtraction && (
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">
                  {t('documents.aiConfidence', { defaultValue: 'AI Confidence' })}: {((doc.metadata.aiExtraction.overallConfidence || 0.95) * 100).toFixed(0)}%
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] font-mono text-slate-500">
                  {t('documents.engine', { defaultValue: 'Engine' })}: {doc.metadata.aiExtraction.ocrEngine || 'Gemini-1.5-Flash'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/verification"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-900 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded border border-blue-200 transition-colors"
                >
                  {t('documents.verificationWorkstation', { defaultValue: 'Verification Workstation' })}
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </Link>
                <Link
                  href="/land-records"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 px-2.5 py-1 rounded border border-slate-200 transition-colors"
                >
                  {t('documents.landRecordsNav', { defaultValue: 'Land Records' })}
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        <AwaitingExtractionPlaceholder
          formCategory={formCat}
          onRunExtraction={() => onRunExtraction(doc._id)}
          isExtracting={isExtracting}
        />
      )}

      {/* Raw OCR Text Snippet */}
      <RawOcrSnippet rawText={doc.metadata?.aiExtraction?.rawTextSnippet} />
    </div>
  );
};
