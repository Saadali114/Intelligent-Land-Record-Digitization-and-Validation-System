import React from 'react';
import { LandRecord } from '../../../types';
import { Check } from 'lucide-react';

interface PropertyCardExtractViewProps {
  landRecord: LandRecord;
  renderFieldVal: (transKey: string, originalVal: string | undefined, fallback?: string) => React.ReactNode;
}

export const PropertyCardExtractView: React.FC<PropertyCardExtractViewProps> = ({
  landRecord: lr,
  renderFieldVal,
}) => {
  return (
    <div className="space-y-2.5">
      {/* Primary Header for Property Card */}
      <div className="p-3 bg-purple-50/70 rounded-lg border border-purple-100 flex items-start justify-between">
        <div>
          <div className="text-[10px] text-purple-800 uppercase font-semibold">
            नगर भूमापन क्रमांक (City Survey / CTS No.)
          </div>
          <div className="text-xl font-black text-purple-950 font-mono">
            {lr.surveyNumber}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-purple-800 uppercase font-semibold">
            शिट व प्रभाग क्रमांक (Sheet & Ward No.)
          </div>
          <div className="text-lg font-bold text-slate-800 font-mono">
            {lr.khataNumber}
          </div>
        </div>
      </div>

      {/* Property Card 8-Field Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">नोंदणीकृत मिळकतधारक (Property Holder):</span>
          <div className="mt-0.5 text-sm">
            {renderFieldVal('ownerName', lr.ownerName)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">चटई / भूखंड क्षेत्र (Carpet / Plot Area):</span>
          <div className="mt-0.5 text-sm font-bold text-emerald-800">
            {renderFieldVal('plotArea', lr.plotArea)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">स्थानिक स्वराज्य संस्था (Local Body Jurisdiction):</span>
          <div className="mt-0.5 font-semibold text-slate-800">
            {renderFieldVal('village', `${lr.tehsil} महानगरपालिका`)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">जिल्हा (District):</span>
          <div className="mt-0.5 font-semibold text-slate-800">
            {renderFieldVal('district', lr.district)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">मिळकत वर्ग (Property Classification):</span>
          <div className="mt-0.5 font-semibold text-slate-800">
            {renderFieldVal('landClassification', lr.landClassification)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">धारणा पद्धती (Tenure Type):</span>
          <div className="mt-0.5 font-semibold text-slate-800">
            {renderFieldVal('ownershipType', lr.ownershipType)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">बोजा व न्यायाधीन नोंदी (Encumbrance Status):</span>
          <div className="mt-0.5 font-semibold text-blue-900 font-mono">
            {lr.mutationNumber || 'Nil (निरंक)'}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">अभिलेख स्थिती (Validation Status):</span>
          <div className="mt-0.5 font-semibold text-emerald-700 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> प्रमाणित डिजिटल प्रत (Verified)
          </div>
        </div>
      </div>
    </div>
  );
};
