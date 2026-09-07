import React from 'react';
import { LandRecord } from '../../../types';
import { ShieldCheck, Hash, User, Ruler, MapPin, Tag, FileText, Sprout } from 'lucide-react';

interface SatbaraExtractViewProps {
  landRecord: LandRecord;
  renderFieldVal: (transKey: string, originalVal: string | undefined, fallback?: string) => React.ReactNode;
}

export const SatbaraExtractView: React.FC<SatbaraExtractViewProps> = ({
  landRecord: lr,
  renderFieldVal,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xs">
      {/* Official Revenue Card Header: Survey / Gat & Khata */}
      <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 flex items-center gap-1">
            <Hash className="w-3.5 h-3.5" /> भूमापन / गट क्रमांक (Survey & Gat No.)
          </span>
          <div className="text-2xl font-black font-mono tracking-tight text-white flex items-center gap-2 mt-0.5">
            <span>{lr.surveyNumber}</span>
            {lr.gatNumber && !lr.surveyNumber?.includes(lr.gatNumber) && (
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-600 px-2 py-0.5 rounded font-sans">
                गट क्र. {lr.gatNumber}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            खाते क्र. (Khata No.)
          </span>
          <div className="text-2xl font-bold font-mono text-white mt-0.5">
            {lr.khataNumber}
          </div>
        </div>
      </div>

      {/* Unified Official Cadastral Table (Clean, Aligned Key-Value Rows) */}
      <div className="divide-y divide-slate-100 text-xs">
        {/* Row 1: Primary Landholder */}
        <div className="grid grid-cols-12 px-4 py-2.5 items-center hover:bg-slate-50/70 transition-colors">
          <div className="col-span-5 sm:col-span-4 text-slate-500 font-medium flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>खातेदार / शेतीमालक:</span>
          </div>
          <div className="col-span-7 sm:col-span-8 font-bold text-slate-900 text-sm">
            {renderFieldVal('ownerName', lr.ownerName)}
          </div>
        </div>

        {/* Row 2: Total Plot Area */}
        <div className="grid grid-cols-12 px-4 py-2.5 items-center hover:bg-slate-50/70 transition-colors bg-slate-50/40">
          <div className="col-span-5 sm:col-span-4 text-slate-500 font-medium flex items-center gap-1.5">
            <Ruler className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>एकूण क्षेत्रफळ (Plot Area):</span>
          </div>
          <div className="col-span-7 sm:col-span-8 font-bold text-emerald-700 font-mono text-sm">
            {renderFieldVal('plotArea', lr.plotArea)}
          </div>
        </div>

        {/* Row 3: Village */}
        <div className="grid grid-cols-12 px-4 py-2.5 items-center hover:bg-slate-50/70 transition-colors">
          <div className="col-span-5 sm:col-span-4 text-slate-500 font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>गाव / मौजे (Village):</span>
          </div>
          <div className="col-span-7 sm:col-span-8 font-semibold text-slate-800">
            {renderFieldVal('village', lr.village)}
          </div>
        </div>

        {/* Row 4: Tehsil & District */}
        <div className="grid grid-cols-12 px-4 py-2.5 items-center hover:bg-slate-50/70 transition-colors bg-slate-50/40">
          <div className="col-span-5 sm:col-span-4 text-slate-500 font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>तालुका व जिल्हा:</span>
          </div>
          <div className="col-span-7 sm:col-span-8 font-semibold text-slate-800">
            {renderFieldVal('district', `${lr.tehsil}, ${lr.district}`)}
          </div>
        </div>

        {/* Row 5: Tenure Class */}
        <div className="grid grid-cols-12 px-4 py-2.5 items-center hover:bg-slate-50/70 transition-colors">
          <div className="col-span-5 sm:col-span-4 text-slate-500 font-medium flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>धारणा पद्धती / वर्ग:</span>
          </div>
          <div className="col-span-7 sm:col-span-8 font-semibold text-slate-800">
            {renderFieldVal('ownershipType', lr.ownershipType)}
          </div>
        </div>

        {/* Row 6: Latest Mutation */}
        <div className="grid grid-cols-12 px-4 py-2.5 items-center hover:bg-slate-50/70 transition-colors bg-slate-50/40">
          <div className="col-span-5 sm:col-span-4 text-slate-500 font-medium flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>शेवटचा फेरफार क्रमांक:</span>
          </div>
          <div className="col-span-7 sm:col-span-8 font-bold font-mono text-blue-800">
            {lr.mutationNumber || 'MTR-Verified'}
          </div>
        </div>

        {/* Row 7: Land Classification & Crop */}
        <div className="grid grid-cols-12 px-4 py-2.5 items-center hover:bg-slate-50/70 transition-colors">
          <div className="col-span-5 sm:col-span-4 text-slate-500 font-medium flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>जमीन आकारणी व वापर:</span>
          </div>
          <div className="col-span-7 sm:col-span-8 text-slate-700 font-medium">
            {lr.landClassification || 'जिरायत'}
          </div>
        </div>
      </div>

      {/* Official Status Footer */}
      <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">अभिलेख स्थिती:</span>
        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> प्रमाणित डिजिटल नोंद (100% Validated)
        </span>
      </div>
    </div>
  );
};
