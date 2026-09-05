import React from 'react';
import { LandRecord } from '../../../types';

interface SaleDeedExtractViewProps {
  landRecord: LandRecord;
  purchaser: string;
  vendor: string;
  consideration: string;
  execDate: string;
  stampDuty: string;
  renderFieldVal: (transKey: string, originalVal: string | undefined, fallback?: string) => React.ReactNode;
}

export const SaleDeedExtractView: React.FC<SaleDeedExtractViewProps> = ({
  landRecord: lr,
  purchaser,
  vendor,
  consideration,
  execDate,
  stampDuty,
  renderFieldVal,
}) => {
  return (
    <div className="space-y-2.5">
      {/* Primary Header for Sale Deed */}
      <div className="p-3 bg-indigo-50/70 rounded-lg border border-indigo-100 flex items-start justify-between">
        <div>
          <div className="text-[10px] text-indigo-700 uppercase font-semibold">
            खरेदी दस्त / मिळकत क्रमांक (Site / Property No.)
          </div>
          <div className="text-xl font-black text-indigo-950 font-mono">
            {lr.surveyNumber}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-indigo-700 uppercase font-semibold">दस्त नोंदणी / PID क्र.</div>
          <div className="text-lg font-bold text-slate-800 font-mono">
            {lr.khataNumber}
          </div>
        </div>
      </div>

      {/* Conveyance Highlight Strip */}
      <div className="px-3 py-2 bg-gradient-to-r from-indigo-50 via-blue-50 to-emerald-50 rounded-lg border border-indigo-200/80 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-indigo-950">मोबदला / किंमत:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-bold font-mono text-[11px] border border-emerald-300">
            {consideration}
          </span>
        </div>
        <div className="text-[11px] font-medium text-slate-700">
          निष्पादन दिनांक: <strong className="text-slate-900 font-mono">{execDate}</strong>
        </div>
      </div>

      {/* Sale Deed 10-Field Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">खरेदीदार / नवीन मालक (Purchaser):</span>
          <div className="mt-0.5 text-sm font-bold text-blue-950">
            {renderFieldVal('purchaserName', purchaser)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">विक्रेता / मूळ मालक (Vendor):</span>
          <div className="mt-0.5 text-sm font-bold text-slate-800">
            {renderFieldVal('vendorName', vendor)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">मोबदला रक्कम (Consideration Amount):</span>
          <div className="mt-0.5 text-sm font-bold text-emerald-800 font-mono">
            {renderFieldVal('considerationAmount', consideration)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">दस्त निष्पादन दिनांक (Execution Date):</span>
          <div className="mt-0.5 font-bold text-slate-800 font-mono">
            {execDate}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">मिळकतीचे क्षेत्रफळ (Super Built / Plot Area):</span>
          <div className="mt-0.5 text-sm text-emerald-800">
            {renderFieldVal('plotArea', lr.plotArea)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">जमीन वर्गवारी (Land Classification):</span>
          <div className="mt-0.5 font-semibold text-slate-800">
            {renderFieldVal('landClassification', lr.landClassification)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">परिसर / लेआउट (Locality / Colony):</span>
          <div className="mt-0.5 font-semibold text-slate-800">
            {renderFieldVal('village', lr.village)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">उपनिबंधक कार्यालय व जिल्हा (Jurisdiction):</span>
          <div className="mt-0.5 font-semibold text-slate-800">
            {renderFieldVal('district', `${lr.tehsil}, ${lr.district}`)}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">मुद्रांक शुल्क तपशील (Stamp Duty Value):</span>
          <div className="mt-0.5 font-semibold text-slate-800 text-[11px] font-mono">
            {stampDuty}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">धारणा पद्धती (Tenure Status):</span>
          <div className="mt-0.5 font-semibold text-slate-800">
            {renderFieldVal('ownershipType', lr.ownershipType)}
          </div>
        </div>
      </div>
    </div>
  );
};
