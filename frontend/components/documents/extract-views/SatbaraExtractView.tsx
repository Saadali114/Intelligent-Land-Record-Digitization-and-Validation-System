import React from 'react';
import { LandRecord } from '../../../types';
import { User, MapPin, Sprout, ShieldCheck } from 'lucide-react';

interface SatbaraExtractViewProps {
  landRecord: LandRecord;
  renderFieldVal: (transKey: string, originalVal: string | undefined, fallback?: string) => React.ReactNode;
}

export const SatbaraExtractView: React.FC<SatbaraExtractViewProps> = ({
  landRecord: lr,
  renderFieldVal,
}) => {
  return (
    <div className="space-y-3">
      {/* 1. Cadastral Parcel & Khata Hero Strip */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-3.5 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            भूमापन / गट क्रमांक (Gat & Survey No.)
          </span>
          <div className="text-2xl font-black font-mono tracking-tight text-white flex items-center gap-2 mt-0.5">
            <span>{lr.surveyNumber}</span>
            {lr.gatNumber && !lr.surveyNumber?.includes(lr.gatNumber) && (
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-950 border border-emerald-600 px-2 py-0.5 rounded font-sans">
                गट {lr.gatNumber}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            खाते क्र. (Khata No.)
          </span>
          <div className="text-2xl font-bold font-mono text-white mt-0.5">
            {lr.khataNumber}
          </div>
        </div>
      </div>

      {/* 2. Three Distinct Semantic Information Cards */}
      <div className="space-y-2.5">
        {/* Block A: मालकी व अधिकार (Ownership & Legal Rights) */}
        <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5 mb-2 pb-1 border-b border-slate-200/60">
            <User className="w-3.5 h-3.5 text-blue-700" />
            मालकी व अधिकार (Ownership & Rights)
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-medium block">खातेदार / शेतीमालक (Owner):</span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">
                {renderFieldVal('ownerName', lr.ownerName)}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-medium block">धारणा पद्धती / वर्ग (Tenure Class):</span>
              <div className="font-semibold text-slate-800 mt-0.5">
                {renderFieldVal('ownershipType', lr.ownershipType)}
              </div>
            </div>
          </div>
        </div>

        {/* Block B: स्थान व क्षेत्रफळ (Location & Plot Area) */}
        <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 mb-2 pb-1 border-b border-slate-200/60">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            स्थान व क्षेत्रफळ (Location & Plot Area)
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-medium block">एकूण क्षेत्रफळ (Total Plot Area):</span>
              <div className="font-bold text-emerald-700 font-mono text-sm mt-0.5">
                {renderFieldVal('plotArea', lr.plotArea)}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-medium block">गाव, तालुका व जिल्हा (Location):</span>
              <div className="font-semibold text-slate-800 mt-0.5">
                {renderFieldVal('village', lr.village)}, {renderFieldVal('district', `${lr.tehsil}, ${lr.district}`)}
              </div>
            </div>
          </div>
        </div>

        {/* Block C: महसूल व वापर (Revenue & Land Use) */}
        <div className="bg-slate-50/90 border border-slate-200/90 rounded-xl p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5 mb-2 pb-1 border-b border-slate-200/60">
            <Sprout className="w-3.5 h-3.5 text-amber-700" />
            महसूल व वापर (Revenue & Crop Use)
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 font-medium block">शेवटचा फेरफार क्रमांक (Latest Mutation):</span>
              <div className="font-bold font-mono text-blue-800 mt-0.5">
                {lr.mutationNumber || 'MTR-Verified'}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-medium block">जमीन प्रकार व पीक (Land Use):</span>
              <div className="font-semibold text-slate-800 mt-0.5">
                {lr.landClassification || 'जिरायत (उस)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Official Status Ribbon */}
      <div className="flex items-center justify-between px-3 py-2 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs">
        <span className="text-slate-600 font-medium text-[11px]">अभिलेख स्थिती (Registry Status):</span>
        <span className="inline-flex items-center gap-1 text-emerald-800 font-bold text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> प्रमाणित डिजिटल नोंद (100% Validated)
        </span>
      </div>
    </div>
  );
};
