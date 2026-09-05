import React from 'react';
import { LandRecord } from '../../../types';
import { Check } from 'lucide-react';

interface MutationRegisterExtractViewProps {
  landRecord: LandRecord;
  vendor: string;
  renderFieldVal: (transKey: string, originalVal: string | undefined, fallback?: string) => React.ReactNode;
}

export const MutationRegisterExtractView: React.FC<MutationRegisterExtractViewProps> = ({
  landRecord: lr,
  vendor,
  renderFieldVal,
}) => {
  return (
    <div className="space-y-2.5">
      {/* Primary Header for Mutation Register */}
      <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-100 flex items-start justify-between">
        <div>
          <div className="text-[10px] text-amber-800 uppercase font-semibold">
            गाव नमुना ६ - फेरफार नोंद क्रमांक (Mutation No.)
          </div>
          <div className="text-xl font-black text-amber-950 font-mono">
            {lr.mutationNumber || 'MTR-104'}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-amber-800 uppercase font-semibold">
            संबंधित खाते क्रमांक (Khata No.)
          </div>
          <div className="text-lg font-bold text-slate-800 font-mono">
            {lr.khataNumber}
          </div>
        </div>
      </div>

      {/* Mutation Register 8-Field Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">नवीन समाविष्ट खातेदार (Transferee / New Owner):</span>
          <div className="mt-0.5 text-sm">
            {renderFieldVal('ownerName', lr.ownerName)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">मागील खातेदार (Transferor / Previous Owner):</span>
          <div className="mt-0.5 text-sm">
            {renderFieldVal('vendorName', vendor)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">संबंधित भूमापन / गट क्र. (Survey / Gat No.):</span>
          <div className="mt-0.5 text-sm font-mono font-bold text-blue-900">
            {lr.surveyNumber}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">हस्तांतरणाचा प्रकार (Mutation Nature):</span>
          <div className="mt-0.5 font-semibold text-slate-800">
            {renderFieldVal('ownershipType', lr.ownershipType)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">गाव व मौजे (Village Jurisdiction):</span>
          <div className="mt-0.5 font-semibold text-slate-800">
            {renderFieldVal('village', lr.village)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">तालुका व जिल्हा (Tehsil & District):</span>
          <div className="mt-0.5 font-semibold text-slate-800">
            {renderFieldVal('district', `${lr.tehsil}, ${lr.district}`)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">संबंधित क्षेत्रफळ (Affected Land Area):</span>
          <div className="mt-0.5 text-sm font-bold text-emerald-800">
            {renderFieldVal('plotArea', lr.plotArea)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">प्रमाणीकरण स्थिती (Sanction Status):</span>
          <div className="mt-0.5 font-semibold text-emerald-700 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> मंडळ अधिकारी प्रमाणित (Sanctioned)
          </div>
        </div>
      </div>
    </div>
  );
};
