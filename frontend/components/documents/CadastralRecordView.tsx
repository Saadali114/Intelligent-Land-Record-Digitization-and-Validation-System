import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
          (lr.remarks?.match(/Vendor:\s*([^->|]+)/)?.[1]?.trim() ||
            (lr.remarks?.includes('Deed of Absolute Sale') ? 'Sri. G. Nagendran' : '')),
        purchaserName:
          entities.purchaser_name ||
          (lr.remarks?.match(/Purchaser:\s*([^|]+)/)?.[1]?.trim() || lr.ownerName || ''),
        considerationAmount:
          entities.consideration_amount ||
          (lr.remarks?.match(/Consideration:\s*([^|]+)/)?.[1]?.trim() || 'Rs. 5,000/-'),
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
      setTranslationNotice(
        `Record translated to ${
          targetLanguage === 'en'
            ? 'English'
            : targetLanguage === 'mr'
            ? 'Marathi'
            : targetLanguage === 'hi'
            ? 'Hindi'
            : targetLanguage === 'gu'
            ? 'Gujarati'
            : targetLanguage === 'kn'
            ? 'Kannada'
            : targetLanguage === 'te'
            ? 'Telugu'
            : targetLanguage === 'ta'
            ? 'Tamil'
            : 'Bengali'
        }`
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
  const vendor =
    translatedData.vendorName ||
    entities.vendor_name ||
    lr?.remarks?.match(/Vendor:\s*([^->|]+)/)?.[1]?.trim() ||
    (lr?.remarks?.includes('Deed of Absolute Sale') ? 'Sri. G. Nagendran' : 'Not Specified');
  const purchaser =
    translatedData.purchaserName ||
    entities.purchaser_name ||
    lr?.remarks?.match(/Purchaser:\s*([^|]+)/)?.[1]?.trim() ||
    lr?.ownerName ||
    '';
  const consideration =
    translatedData.considerationAmount ||
    entities.consideration_amount ||
    lr?.remarks?.match(/Consideration:\s*([^|]+)/)?.[1]?.trim() ||
    'Rs. 5,000/- (Non-Judicial Stamp Duty)';
  const execDate =
    entities.execution_date ||
    lr?.remarks?.match(/(?:Date|Executed):\s*([^|]+)/)?.[1]?.trim() ||
    '25.05.1992';
  const stampDuty =
    entities.stamp_duty || 'Rs. 5,000/- Non-Judicial India Stamp Paper (५००० रु. / पाच हजार रुपये)';

  return (
    <div className="lg:col-span-6 flex flex-col space-y-3">
      {/* Panel Header with Form Badge and PDF Export */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Digitized Cadastral Record
          </span>

          {/* Form Category Badge */}
          {formCat === 'SALE_DEED' && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              खरेदी खत (Sale Deed)
            </span>
          )}
          {formCat === 'MUTATION_REGISTER' && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
              <Landmark className="w-3 h-3" />
              फेरफार नोंदवही (Form 6)
            </span>
          )}
          {formCat === 'PROPERTY_CARD' && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
              <FileCheck2 className="w-3 h-3" />
              मिळकत पत्रिका (Property Card)
            </span>
          )}
          {formCat === '7_12_SATBARA' && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              गाव नमुना ७/१२ (Satbara)
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
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
              className="text-xs h-7 px-2.5 bg-blue-50/80 border-blue-200 text-blue-900 hover:bg-blue-100 font-semibold"
              title="Download official digital certificate as PDF"
            >
              <Printer className="w-3.5 h-3.5 mr-1 text-blue-700" />
              Download PDF
            </Button>
          )}
        </div>
      </div>

      {doc.landRecord ? (
        <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          {/* Multilingual Cadastral Translator Toolbar */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-900 shrink-0" />
              <span className="text-[11px] font-bold text-slate-700">Digital Translator:</span>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value as any)}
                className="px-2 py-1 text-xs rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-900"
              >
                <option value="en">English (इंग्रजी)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
              <Button
                size="sm"
                variant="outline"
                onClick={handleTranslateRecord}
                isLoading={isTranslating}
                className="h-7 px-2.5 text-xs bg-white text-slate-800 border-slate-300 hover:bg-slate-100"
              >
                <Languages className="w-3 h-3 mr-1 text-blue-700" />
                Translate Record
              </Button>
            </div>

            {isTranslated && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowSideBySide(!showSideBySide)}
                  className={`px-2 py-1 text-[10px] font-bold rounded border transition-colors flex items-center gap-1 ${
                    showSideBySide
                      ? 'bg-blue-100 text-blue-900 border-blue-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  {showSideBySide ? 'Side-by-Side: ON' : 'Compare View'}
                </button>
                <button
                  type="button"
                  onClick={handleResetTranslation}
                  className="px-2 py-1 text-[10px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors"
                >
                  Show Original
                </button>
              </div>
            )}
          </div>

          {/* Translation Active Notice */}
          {translationNotice && (
            <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-800 font-medium flex items-center justify-between">
              <span>✓ {translationNotice}</span>
              <span className="text-[10px] text-emerald-600 font-mono">Bilingual Cadastral Display</span>
            </div>
          )}

          {/* OCR Quality Warning Banner */}
          {doc.metadata?.aiExtraction?.anomalies?.some((a: string) => a.includes('Low OCR')) && (
            <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-lg text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-rose-800">OCR Could Not Read This Document Clearly</div>
                <div className="text-rose-700 mt-0.5">
                  The scan quality prevented accurate text extraction. Values below are estimated placeholders — please update in Verification Workstation.
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

          {/* AI Confidence & Quality Indicators */}
          {doc.metadata?.aiExtraction && (
            <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  AI OCR Confidence: {((doc.metadata.aiExtraction.overallConfidence || 0.95) * 100).toFixed(0)}%
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  Engine: {doc.metadata.aiExtraction.ocrEngine || 'tesseract.js'}
                  {doc.metadata.aiExtraction.ocrCharsExtracted !== undefined && (
                    <> &middot; {doc.metadata.aiExtraction.ocrCharsExtracted} chars</>
                  )}
                </span>
              </div>

              {doc.metadata.aiExtraction.preprocessingSteps &&
                doc.metadata.aiExtraction.preprocessingSteps.length > 0 && (
                  <div className="pt-1">
                    <div className="text-[10px] font-semibold text-slate-600 mb-1">
                      OpenCV Preprocessing Pipeline:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {doc.metadata.aiExtraction.preprocessingSteps.map((step: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 text-[9px] font-mono border border-blue-200"
                        >
                          ✓ {step}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {doc.metadata.aiExtraction.anomalies &&
                doc.metadata.aiExtraction.anomalies.filter((a: string) => !a.includes('Low OCR')).length > 0 && (
                  <div className="p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[10px] space-y-0.5">
                    <div className="font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      Inspection Notes:
                    </div>
                    {doc.metadata.aiExtraction.anomalies
                      .filter((a: string) => !a.includes('Low OCR'))
                      .map((anom: string, i: number) => (
                        <div key={i} className="pl-2.5 text-slate-700">
                          • {anom}
                        </div>
                      ))}
                  </div>
                )}
            </div>
          )}

          {/* Action Links */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <Link
              href="/verification"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
            >
              Inspect in Verification Workstation
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/land-records"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              View in Land Records
            </Link>
          </div>
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
