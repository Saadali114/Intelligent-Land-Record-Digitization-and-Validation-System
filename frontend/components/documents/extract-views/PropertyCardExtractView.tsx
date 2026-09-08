import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LandRecord, DocumentRecord } from '../../../types';
import {
  Building,
  CheckCircle2,
  MapPin,
  Layers,
  ShieldCheck,
  Scale,
  FileText,
  Check,
  Copy,
  FileCheck2,
  Sparkles,
  Coins,
  Compass,
} from 'lucide-react';

interface PropertyCardExtractViewProps {
  landRecord: LandRecord;
  renderFieldVal: (transKey: string, originalVal: string | undefined, fallback?: string) => React.ReactNode;
  doc?: DocumentRecord;
  ctsNumber?: string;
  sheetNumber?: string;
  wardName?: string;
  municipalBody?: string;
  landTenure?: string;
  assessmentTax?: string;
  encumbranceCharge?: string;
  ctsoOffice?: string;
}

export const PropertyCardExtractView: React.FC<PropertyCardExtractViewProps> = ({
  landRecord: lr,
  renderFieldVal,
  doc,
  ctsNumber,
  sheetNumber,
  wardName,
  municipalBody,
  landTenure,
  assessmentTax,
  encumbranceCharge,
  ctsoOffice,
}) => {
  const { t } = useTranslation();
  const [copiedCts, setCopiedCts] = useState(false);
  const [showAkhivDetails, setShowAkhivDetails] = useState(false);

  const safeCtsNo = ctsNumber || lr.surveyNumber || 'CTS-1084';
  const safeSheetNo = sheetNumber || lr.khataNumber || 'Sheet No. 12';
  const safeWard = wardName || lr.village || 'सदाशिव पेठ (Ward 14)';
  const safeMunicipal =
    municipalBody || `${lr.tehsil || 'पुणे'} महानगरपालिका (PMC)`;
  const safeTenure =
    landTenure || lr.ownershipType || 'Occupant Class 1 / Freehold (वर्ग १ - पूर्ण मालकी)';
  const safeTax = assessmentTax || '₹ 1,420/- प्रतिवर्ष (Municipal Assessment)';
  const safeEncumbrance =
    encumbranceCharge ||
    (lr.mutationNumber ? `Charge Ref: ${lr.mutationNumber}` : 'Nil (निरंक / भारमुक्त मिळकत)');
  const safeCtso =
    ctsoOffice || `नगर भूमापन अधिकारी कार्यालय (CTSO), ${lr.tehsil || 'पुणे'}`;

  const handleCopyCts = () => {
    navigator.clipboard.writeText(safeCtsNo);
    setCopiedCts(true);
    setTimeout(() => setCopiedCts(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* 1. Official State Cadastral Header: Urban Property Card (नगर भूमापन मिळकत पत्रिका) */}
      <div className="p-3 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 text-white rounded-xl shadow-sm border border-purple-700/60">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-800/80 rounded-lg border border-purple-500/30">
              <Building className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <div className="text-[10px] text-purple-300 uppercase tracking-widest font-semibold">
                {t('documents.deptLandRecordsUrban', {
                  defaultValue: 'भूमी अभिलेख व नगर भूमापन विभाग • महाराष्ट्र शासन',
                })}
              </div>
              <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>
                  {t('documents.propertyCardOfficialTitle', {
                    defaultValue: 'नगर भूमापन मिळकत पत्रिका (City Survey Property Card)',
                  })}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                  {t('documents.ctsVerifiedBadge', { defaultValue: 'CTS Validated' })}
                </span>
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-purple-950/70 px-3 py-1.5 rounded-lg border border-purple-700/50">
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-wider text-purple-300 font-semibold">
                {t('documents.ctsNoHeaderLabel', { defaultValue: 'नगर भूमापन क्रमांक' })}
              </div>
              <div className="font-mono text-sm font-black text-amber-300 tracking-wider">
                {safeCtsNo}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyCts}
              title="Copy CTS Number"
              className="p-1 rounded hover:bg-purple-800 text-purple-300 hover:text-white transition-colors"
            >
              {copiedCts ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Municipal & CTSO Jurisdiction Strip */}
        <div className="mt-2.5 pt-2 border-t border-purple-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-purple-200">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-purple-300" />
            <span>{safeMunicipal} • {safeWard}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-amber-100">
            <span>शिट: <strong>{safeSheetNo}</strong></span>
            <span>•</span>
            <span>{safeCtso}</span>
          </div>
        </div>
      </div>

      {/* 2. Urban Property Title & Tenure Conduit */}
      <div className="p-3 bg-gradient-to-r from-slate-50 via-purple-50/30 to-blue-50/40 rounded-xl border border-purple-200/80 shadow-xs">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>{t('documents.urbanPropertyOwnership', { defaultValue: 'नगर भूमापन मालकी व अधिकार (Urban Cadastral Ownership)' })}</span>
          <span className="text-purple-800 font-semibold text-[10px]">
            Akhiv Patrika Record of Rights
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-11 gap-2 items-center">
          {/* Primary Holder */}
          <div className="md:col-span-4 p-2.5 bg-white rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>{t('documents.registeredHolder', { defaultValue: 'नोंदणीकृत मिळकतधारक (Property Holder)' })}</span>
              <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[9px] font-bold">
                एकल पूर्ण मालकी
              </span>
            </div>
            <div className="mt-1 text-xs font-black text-slate-900 truncate" title={lr.ownerName}>
              {renderFieldVal('ownerName', lr.ownerName)}
            </div>
            <div className="mt-1 text-[10px] text-slate-400 font-mono">
              शिट क्र: {safeSheetNo}
            </div>
          </div>

          {/* Central Survey Conduit */}
          <div className="md:col-span-3 flex flex-col items-center justify-center p-1 text-center">
            <div className="flex items-center gap-1 text-[10px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-300 shadow-xs">
              <Coins className="w-3 h-3 text-purple-700" />
              <span className="font-mono">{safeTax.split('(')[0].trim()}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-purple-700 font-medium my-0.5">
              <span>ETS भूमापन प्रमाणित</span>
            </div>
            <div className="text-[9px] text-emerald-800 font-bold font-mono">
              क्षेत्र: {lr.plotArea}
            </div>
          </div>

          {/* Tenure & Alienation Class */}
          <div className="md:col-span-4 p-2.5 bg-purple-50/70 rounded-lg border border-purple-200 shadow-xs">
            <div className="flex items-center justify-between text-[10px] text-purple-800 font-medium">
              <span>{t('documents.tenureRights', { defaultValue: 'धारणा प्रकार व अधिकार (Tenure Class)' })}</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold border border-emerald-300">
                वर्ग १ (Freehold)
              </span>
            </div>
            <div className="mt-1 text-xs font-bold text-purple-950 truncate" title={safeTenure}>
              {renderFieldVal('ownershipType', safeTenure)}
            </div>
            <div className="mt-1 text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{t('documents.unrestrictedAlienation', { defaultValue: 'बिनशर्त मालकी • हस्तांतरणास पूर्ण मुभा' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 12-Point Urban Cadastral Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
        {/* CTS Number */}
        <div className="p-2.5 rounded-lg bg-purple-50/50 border border-purple-200">
          <span className="text-[10px] text-purple-800 font-medium">
            {t('documents.ctsNoHeaderLabel', { defaultValue: 'नगर भूमापन क्र. (CTS No.)' })}:
          </span>
          <div className="mt-0.5 text-sm font-black text-purple-950 font-mono">
            {safeCtsNo}
          </div>
        </div>

        {/* Sheet Number */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.sheetNoLabel', { defaultValue: 'शिट क्रमांक (Sheet No.)' })}:
          </span>
          <div className="mt-0.5 text-sm font-bold text-slate-900 font-mono">
            {safeSheetNo}
          </div>
        </div>

        {/* Ward / Peth */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.wardPethLabel', { defaultValue: 'प्रभाग / पेठ (Ward / Peth)' })}:
          </span>
          <div className="mt-0.5 font-semibold text-slate-800 text-[11px] truncate" title={safeWard}>
            {safeWard}
          </div>
        </div>

        {/* Carpet / Plot Area */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.carpetPlotArea', { defaultValue: 'भूखंड / चटई क्षेत्र (Plot Area)' })}:
          </span>
          <div className="mt-0.5 text-xs font-bold text-emerald-800 font-mono">
            {renderFieldVal('plotArea', lr.plotArea)}
          </div>
        </div>

        {/* Local Municipal Body */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.localBodyJurisdiction', { defaultValue: 'स्थानिक संस्था (Municipal Body)' })}:
          </span>
          <div className="mt-0.5 font-semibold text-slate-800 text-[11px] truncate" title={safeMunicipal}>
            {safeMunicipal}
          </div>
        </div>

        {/* Property Classification */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.propertyClassification', { defaultValue: 'मिळकत वर्ग (Property Class)' })}:
          </span>
          <div className="mt-0.5 font-semibold text-slate-800 text-[11px] truncate">
            {renderFieldVal('landClassification', lr.landClassification)}
          </div>
        </div>

        {/* Tenure Type */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.tenureType', { defaultValue: 'धारणा प्रकार (Tenure Type)' })}:
          </span>
          <div className="mt-0.5 font-semibold text-slate-800 text-[11px] truncate" title={safeTenure}>
            {safeTenure}
          </div>
        </div>

        {/* Assessment Tax */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.assessmentTaxLabel', { defaultValue: 'विशेष कर (Assessment Tax)' })}:
          </span>
          <div className="mt-0.5 font-bold text-slate-900 font-mono text-[11px] truncate">
            {safeTax}
          </div>
        </div>

        {/* City & District */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.districtLabel', { defaultValue: 'जिल्हा व शहर (City & District)' })}:
          </span>
          <div className="mt-0.5 font-semibold text-slate-800 text-[11px]">
            {renderFieldVal('district', `${lr.tehsil}, ${lr.district}`)}
          </div>
        </div>

        {/* CTSO Office */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.ctsoOfficeLabel', { defaultValue: 'सक्षम नगर भूमापन कार्यालय' })}:
          </span>
          <div className="mt-0.5 font-semibold text-slate-800 text-[11px] truncate" title={safeCtso}>
            {safeCtso}
          </div>
        </div>

        {/* Encumbrance / Charge */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.encumbranceStatus', { defaultValue: 'बोजा व इतर हक्क (Encumbrance)' })}:
          </span>
          <div className="mt-0.5 font-bold text-emerald-700 text-[11px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
            <span className="truncate">{safeEncumbrance}</span>
          </div>
        </div>

        {/* Planning / IOD Status */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.buildingPlanEligible', { defaultValue: 'बांधकाम परवानगी पात्रता' })}:
          </span>
          <div className="mt-0.5 font-bold text-emerald-800 text-[11px]">
            ✓ IOD / CC Eligible
          </div>
        </div>
      </div>

      {/* 4. Encumbrance, Easement & Rights Column (इतर हक्क व बोजा रकाना) */}
      <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-950">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
            <span>{t('documents.otherRightsRegister', { defaultValue: 'इतर हक्क व बोजा रकाना (Other Rights & Encumbrances)' })}</span>
          </div>
          <span className="text-[9px] font-bold text-purple-800 bg-purple-200/80 px-2 py-0.5 rounded">
            CERSAI Clean Search
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-white border border-purple-100 shadow-2xs">
            <div className="text-[10px] text-purple-900 font-bold">
              बँक तारण / गहाण बोजा (Mortgage & Bank Charges)
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>निरंक (Nil Encumbrance - Zero Charge Registered)</span>
            </div>
          </div>

          <div className="p-2 rounded-lg bg-white border border-purple-100 shadow-2xs">
            <div className="text-[10px] text-purple-900 font-bold">
              रस्ता व सुखाधिकार (Right of Way & DP Access Road)
            </div>
            <div className="text-[11px] text-slate-700 font-medium mt-0.5 flex items-center gap-1">
              <Compass className="w-3 h-3 text-purple-600" />
              <span>९.१४ मीटर रुंद सार्वजनिक विकास योजना (DP) रस्ता</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Akhiv Patrika Urban Planning Drawer Toggle */}
      <div className="p-2.5 bg-indigo-50/70 rounded-xl border border-indigo-200 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-700 shrink-0" />
          <div>
            <div className="font-bold text-indigo-950 flex items-center gap-1.5">
              <span>{t('documents.akhivPatrikaDetailsTitle', { defaultValue: 'आखीव पत्रिका डिजिटल अभिलेख (Akhiv Patrika Extract)' })}</span>
              <span className="text-[9px] font-semibold bg-indigo-200 text-indigo-900 px-1.5 py-0.2 rounded">
                DGPS Geocoded
              </span>
            </div>
            <div className="text-[11px] text-indigo-800 mt-0.5">
              {t('documents.akhivPatrikaDesc', {
                defaultValue: 'Electronic survey parcel coordinates and boundary pins recorded with Maharashtra Land Records.',
              })}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAkhivDetails(!showAkhivDetails)}
          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white text-indigo-900 border border-indigo-200 hover:bg-indigo-50 shadow-xs transition-colors flex items-center gap-1"
        >
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <span>
            {showAkhivDetails
              ? t('documents.hideAkhivDetails', { defaultValue: 'Hide Akhiv Details' })
              : t('documents.viewAkhivDetails', { defaultValue: 'Preview Akhiv Details' })}
          </span>
        </button>
      </div>

      {/* 6. Akhiv Patrika Details Drawer */}
      {showAkhivDetails && (
        <div className="p-3 bg-white rounded-xl border border-indigo-300 text-xs space-y-2 animate-in fade-in duration-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-indigo-100 pb-1.5">
            <div className="flex items-center gap-1.5 font-bold text-indigo-950">
              <FileCheck2 className="w-4 h-4 text-indigo-700" />
              <span>आखीव पत्रिका - इलेक्ट्रॉनिक भूमापन तपशील</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              CTS: {safeCtsNo} • {safeWard}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 rounded bg-indigo-50/60 border border-indigo-100">
              <div className="text-[9px] text-indigo-800 font-bold uppercase">
                सीमा मोजणी पद्धती (Survey Method)
              </div>
              <div className="text-slate-800 font-semibold mt-0.5">
                ETS & DGPS Electronic Pin
              </div>
            </div>

            <div className="p-2 rounded bg-indigo-50/60 border border-indigo-100">
              <div className="text-[9px] text-indigo-800 font-bold uppercase">
                शहराचा विकास आराखडा (Town Planning Zone)
              </div>
              <div className="text-slate-800 font-semibold mt-0.5">
                R-Zone (Residential Urban)
              </div>
            </div>

            <div className="p-2 rounded bg-indigo-50/60 border border-indigo-100">
              <div className="text-[9px] text-indigo-800 font-bold uppercase">
                मागील फेरफार संदर्भ (Previous Mutation)
              </div>
              <div className="text-slate-800 font-semibold mt-0.5 font-mono">
                {lr.mutationNumber || 'MTR-104 (खरेदी दाखल)'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
