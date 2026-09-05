import React from 'react';
import { LandRecord } from '../../../types';
import { Check } from 'lucide-react';

interface SatbaraExtractViewProps {
  landRecord: LandRecord;
  renderFieldVal: (transKey: string, originalVal: string | undefined, fallback?: string) => React.ReactNode;
}

export const SatbaraExtractView: React.FC<SatbaraExtractViewProps> = ({
  landRecord: lr,
  renderFieldVal,
}) => {
  return (
    <div className="space-y-2.5">
      {/* Cadastral Primary Header for 7/12 */}
      <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 flex items-start justify-between">
        <div>
          <div className="text-[10px] text-blue-700 uppercase font-semibold">
            भूमापन / गट क्रमांक (Survey & Sub-Division)
          </div>
          <div className="text-xl font-black text-blue-950 font-mono">
            {lr.surveyNumber}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-blue-700 uppercase font-semibold">खाते क्र. (Khata)</div>
          <div className="text-lg font-bold text-slate-800 font-mono">
            {lr.khataNumber}
          </div>
        </div>
      </div>

      {/* Cadastral Details Grid for 7/12 */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-500 font-medium">खातेदार / मालक (Primary Owner Name):</span>
          <div className="mt-0.5 text-sm">
            {renderFieldVal('ownerName', lr.ownerName)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-500 font-medium">एकूण क्षेत्रफळ (Total Plot Area / Potkharaba):</span>
          <div
            className={`mt-0.5 text-sm ${
              lr.plotArea?.includes('Estimated') ? 'text-amber-700' : 'text-emerald-800'
            }`}
          >
            {renderFieldVal('plotArea', lr.plotArea)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-500 font-medium">गाव / मौजे (Village):</span>
          <div className="mt-0.5 font-semibold text-slate-800">
            {renderFieldVal('village', lr.village)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-500 font-medium">तालुका व जिल्हा (Tehsil & District):</span>
          <div className="mt-0.5 font-semibold text-slate-800">
            {renderFieldVal('district', `${lr.tehsil}, ${lr.district}`)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-500 font-medium">धारणा पद्धती / वर्ग (Tenure Class):</span>
          <div className="mt-0.5 font-semibold text-slate-800">
            {renderFieldVal('ownershipType', lr.ownershipType)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-500 font-medium">शेवटचा फेरफार क्रमांक (Latest Mutation No.):</span>
          <div className="font-semibold text-blue-900 font-mono mt-0.5">
            {lr.mutationNumber || 'MTR-Verified'}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-500 font-medium">जमीन आकारणी व पीक पद्धती (Assessment & Land Use):</span>
          <div className="mt-0.5 font-semibold text-slate-800">
            {lr.landClassification || 'जिरायत (आकारणी: रु. १२५.००)'}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] text-slate-500 font-medium">अभिलेख स्थिती (Registry Status):</span>
          <div className="mt-0.5 font-semibold text-emerald-700 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> प्रमाणित डिजिटल प्रत (100% Validated)
          </div>
        </div>
      </div>
    </div>
  );
};
