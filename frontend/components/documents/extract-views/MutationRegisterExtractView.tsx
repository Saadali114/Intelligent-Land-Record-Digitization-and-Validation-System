import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LandRecord, DocumentRecord } from '../../../types';
import {
  Landmark,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileText,
  MapPin,
  Copy,
  Check,
  Layers,
  Scale,
  Clock,
  UserCheck,
  History,
  FileCheck2,
  Sparkles,
} from 'lucide-react';

interface MutationRegisterExtractViewProps {
  landRecord: LandRecord;
  vendor: string;
  renderFieldVal: (transKey: string, originalVal: string | undefined, fallback?: string) => React.ReactNode;
  doc?: DocumentRecord;
  mutationNature?: string;
  transferor?: string;
  transferee?: string;
  orderNumber?: string;
  sanctionDate?: string;
  circleOfficer?: string;
  mutationNarrative?: string;
}

export const MutationRegisterExtractView: React.FC<MutationRegisterExtractViewProps> = ({
  landRecord: lr,
  vendor,
  renderFieldVal,
  doc,
  mutationNature,
  transferor: propTransferor,
  transferee: propTransferee,
  orderNumber,
  sanctionDate,
  circleOfficer,
  mutationNarrative,
}) => {
  const { t } = useTranslation();
  const [copiedMutation, setCopiedMutation] = useState(false);
  const [showSatbaraImpact, setShowSatbaraImpact] = useState(false);

  const safeMutationNo = lr.mutationNumber || 'MTR-4821';
  const safeNature =
    mutationNature || 'नोंदणीकृत खरेदीखत (Registered Sale Deed Conveyance)';
  const safeTransferor =
    propTransferor || vendor || 'श्री. बाळासाहेब रघुनाथ देशमुख';
  const safeTransferee =
    propTransferee || lr.ownerName || 'श्री. रामेश्वर विठ्ठलराव कदम';
  const safeOrderNo =
    orderNumber || `म.अ./${lr.tehsil || 'हवेली'}-का-२/२०२४-१२`;
  const safeSanctionDate = sanctionDate || '२२/०३/२०२४';
  const safeCircleOfficer =
    circleOfficer || `मंडळ अधिकारी / मंडळ निरीक्षक, ${lr.tehsil || 'हवेली'}`;

  const safeNarrative =
    mutationNarrative ||
    `मौजे ${lr.village || 'वडगाव'}, ता. ${lr.tehsil || 'हवेली'} येथील भूमापन / गट क्र. ${lr.surveyNumber || '1378'}, क्षेत्रफळ ${lr.plotArea || '1.62 Hectares'} च्या मिळकतीचे मूळ खातेदार ${safeTransferor} यांनी नोंदणीकृत दस्त अन्वये ${safeTransferee} यांना हक्क हस्तांतरित केल्याने महाराष्ट्र जमीन महसूल संहिता १९६६ चे कलम १५० अन्वये फेरफार नोंद प्रमाणित करून अधिकार अभिलेखात (७/१२) दाखल करण्यात येत आहे.`;

  const handleCopyMutation = () => {
    navigator.clipboard.writeText(safeMutationNo);
    setCopiedMutation(true);
    setTimeout(() => setCopiedMutation(false), 2000);
  };

  return (
    <div className="space-y-3">
      {/* 1. Official State Cadastral Header: Village Form 6 (गाव नमुना ६) */}
      <div className="p-3 bg-gradient-to-r from-amber-950 via-amber-900 to-slate-900 text-white rounded-xl shadow-sm border border-amber-700/60">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-800/80 rounded-lg border border-amber-600/40">
              <Landmark className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="text-[10px] text-amber-300 uppercase tracking-widest font-semibold">
                {t('documents.deptRevenueCadastral', {
                  defaultValue: 'महसूल व वन विभाग • महाराष्ट्र शासन (MLRC 1966 Sec 148)',
                })}
              </div>
              <h4 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>
                  {t('documents.villageForm6Title', {
                    defaultValue: 'गाव नमुना सहा - फेरफार नोंदवही (Form 6)',
                  })}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                  {t('documents.sanctionedBadge', { defaultValue: 'प्रमाणित (Sanctioned)' })}
                </span>
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-amber-950/70 px-3 py-1.5 rounded-lg border border-amber-700/50">
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-wider text-amber-300 font-semibold">
                {t('documents.mutationNoHeader', { defaultValue: 'फेरफार नोंद क्रमांक' })}
              </div>
              <div className="font-mono text-sm font-black text-amber-300 tracking-wider">
                {safeMutationNo}
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyMutation}
              title="Copy Mutation Number"
              className="p-1 rounded hover:bg-amber-800 text-amber-300 hover:text-white transition-colors"
            >
              {copiedMutation ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Sub-Authority & Order Ref Strip */}
        <div className="mt-2.5 pt-2 border-t border-amber-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-amber-200">
          <div className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>{safeCircleOfficer}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-amber-100">
            <span>आदेश: <strong>{safeOrderNo}</strong></span>
            <span>•</span>
            <span>दिनांक: <strong>{safeSanctionDate}</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Statutory 5-Stage Mutation Lifecycle Pipeline (कलम १५० विहित कार्यपद्धती) */}
      <div className="p-3 bg-gradient-to-r from-slate-50 via-amber-50/40 to-slate-50 rounded-xl border border-amber-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-amber-700" />
            {t('documents.mutationLifecycleTitle', {
              defaultValue: 'फेरफार वैधानिक ५-टप्पे स्थिती (Statutory 5-Stage Lifecycle)',
            })}
          </span>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300">
            ✓ १५ दिवसांत निर्गमित (RTS Compliant)
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 text-center">
          {/* Stage 1 */}
          <div className="p-1.5 rounded-lg bg-white border border-emerald-200 shadow-2xs">
            <div className="flex items-center justify-center text-emerald-600 mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] font-bold text-slate-800 leading-tight">
              १. कच्ची नोंद
            </div>
            <div className="text-[8px] text-slate-500 font-mono mt-0.5">तलाठी दाखल</div>
          </div>

          {/* Stage 2 */}
          <div className="p-1.5 rounded-lg bg-white border border-emerald-200 shadow-2xs">
            <div className="flex items-center justify-center text-emerald-600 mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] font-bold text-slate-800 leading-tight">
              २. नोटीस १५०(२)
            </div>
            <div className="text-[8px] text-slate-500 font-mono mt-0.5">हितसंबंधी जारी</div>
          </div>

          {/* Stage 3 */}
          <div className="p-1.5 rounded-lg bg-white border border-emerald-200 shadow-2xs">
            <div className="flex items-center justify-center text-emerald-600 mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] font-bold text-slate-800 leading-tight">
              ३. हरकत मुदत
            </div>
            <div className="text-[8px] text-emerald-700 font-bold font-mono mt-0.5">निर्विवाद</div>
          </div>

          {/* Stage 4 */}
          <div className="p-1.5 rounded-lg bg-white border border-emerald-200 shadow-2xs">
            <div className="flex items-center justify-center text-emerald-600 mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] font-bold text-slate-800 leading-tight">
              ४. प्रमाणीकरण
            </div>
            <div className="text-[8px] text-slate-500 font-mono mt-0.5">मंडळ अधिकारी</div>
          </div>

          {/* Stage 5 */}
          <div className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-300 shadow-2xs">
            <div className="flex items-center justify-center text-emerald-700 mb-0.5">
              <FileCheck2 className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] font-black text-emerald-900 leading-tight">
              ५. ७/१२ अंमल
            </div>
            <div className="text-[8px] text-emerald-800 font-bold font-mono mt-0.5">दाखल व पूर्ण</div>
          </div>
        </div>
      </div>

      {/* 3. Title Transformation Flow (Transferor -> Nature -> Transferee) */}
      <div className="p-3 bg-gradient-to-r from-slate-50 via-amber-50/30 to-blue-50/40 rounded-xl border border-amber-200/80 shadow-xs">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>{t('documents.titleSubstitutionFlow', { defaultValue: 'अधिकार अभिलेख खातेदार बदल (Title Substitution)' })}</span>
          <span className="text-amber-800 font-semibold text-[10px]">
            {safeNature}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-11 gap-2 items-center">
          {/* Transferor / Outgoing Party */}
          <div className="md:col-span-4 p-2.5 bg-white rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>{t('documents.outgoingHolder', { defaultValue: 'कमी होणारे खातेदार (Transferor)' })}</span>
              <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-bold">
                हक्क समाप्त
              </span>
            </div>
            <div className="mt-1 text-xs font-bold text-slate-900 truncate" title={safeTransferor}>
              {renderFieldVal('vendorName', safeTransferor)}
            </div>
            <div className="mt-1 text-[10px] text-slate-400 font-mono">
              संबंधित खाते: {lr.khataNumber}
            </div>
          </div>

          {/* Central Conduit: Mutation Nature & Authority */}
          <div className="md:col-span-3 flex flex-col items-center justify-center p-1 text-center">
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 shadow-xs">
              <Scale className="w-3 h-3 text-amber-700" />
              <span className="font-mono">कलम १५० मंजूर</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-amber-700 font-medium my-0.5">
              <span>{t('documents.substitutedTo', { defaultValue: 'नाव दाखल' })}</span>
              <ArrowRight className="w-3 h-3 text-amber-600" />
            </div>
            <div className="text-[9px] text-slate-500 font-mono">
              क्षेत्र: {lr.plotArea}
            </div>
          </div>

          {/* Transferee / Incoming Beneficiary */}
          <div className="md:col-span-4 p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-200 shadow-xs">
            <div className="flex items-center justify-between text-[10px] text-emerald-800 font-medium">
              <span>{t('documents.incomingHolder', { defaultValue: 'नवीन समाविष्ट खातेदार (Transferee)' })}</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold border border-emerald-300">
                ७/१२ दाखल
              </span>
            </div>
            <div className="mt-1 text-xs font-black text-blue-950 truncate" title={safeTransferee}>
              {renderFieldVal('ownerName', safeTransferee)}
            </div>
            <div className="mt-1 text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>{t('documents.newKhataAssigned', { defaultValue: 'भोगवटादार वर्ग १ दाखल' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. 12-Point Cadastral & Mutation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
        {/* Mutation Entry No */}
        <div className="p-2.5 rounded-lg bg-amber-50/50 border border-amber-200">
          <span className="text-[10px] text-amber-800 font-medium">
            {t('documents.mutationNoHeader', { defaultValue: 'फेरफार नोंद क्र.' })}:
          </span>
          <div className="mt-0.5 text-sm font-black text-amber-950 font-mono">
            {safeMutationNo}
          </div>
        </div>

        {/* Associated Gat / Survey Number */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-amber-300 transition-colors">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.surveyGatNo', { defaultValue: 'संबंधित भूमापन / गट क्र.' })}:
          </span>
          <div className="mt-0.5 text-sm font-bold text-blue-900 font-mono">
            {lr.surveyNumber}
          </div>
        </div>

        {/* Associated Khata Number */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.khataNoHeader', { defaultValue: 'संबंधित खाते क्र.' })}:
          </span>
          <div className="mt-0.5 text-sm font-bold text-slate-800 font-mono">
            {lr.khataNumber}
          </div>
        </div>

        {/* Affected Land Area */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.affectedLandArea', { defaultValue: 'प्रभावित क्षेत्रफळ' })}:
          </span>
          <div className="mt-0.5 text-xs font-bold text-emerald-800 font-mono">
            {renderFieldVal('plotArea', lr.plotArea)}
          </div>
        </div>

        {/* Nature of Mutation */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.mutationNature', { defaultValue: 'हस्तांतरणाचा प्रकार' })}:
          </span>
          <div className="mt-0.5 font-semibold text-slate-800 text-[11px] truncate" title={safeNature}>
            {safeNature}
          </div>
        </div>

        {/* Sanctioning Authority */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.sanctioningAuthority', { defaultValue: 'सक्षम प्राधिकारी' })}:
          </span>
          <div className="mt-0.5 font-semibold text-slate-800 text-[11px] truncate">
            {safeCircleOfficer}
          </div>
        </div>

        {/* Order Reference */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.orderNumberLabel', { defaultValue: 'आदेश संदर्भ क्रमांक' })}:
          </span>
          <div className="mt-0.5 font-mono text-[11px] font-bold text-slate-900 truncate">
            {safeOrderNo}
          </div>
        </div>

        {/* Sanction Date */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.sanctionDateLabel', { defaultValue: 'प्रमाणीकरण दिनांक' })}:
          </span>
          <div className="mt-0.5 font-bold text-slate-900 font-mono text-[11px]">
            {safeSanctionDate}
          </div>
        </div>

        {/* Village Jurisdiction */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.villageJurisdiction', { defaultValue: 'गाव व मौजे' })}:
          </span>
          <div className="mt-0.5 font-semibold text-slate-800 text-[11px] truncate">
            {renderFieldVal('village', lr.village)}
          </div>
        </div>

        {/* Tehsil & District */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.tehsilDistrict', { defaultValue: 'तालुका व जिल्हा' })}:
          </span>
          <div className="mt-0.5 font-semibold text-slate-800 text-[11px]">
            {renderFieldVal('district', `${lr.tehsil}, ${lr.district}`)}
          </div>
        </div>

        {/* Dispute / Objection Status */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.disputeStatusLabel', { defaultValue: 'तक्रार रजिस्टर स्थिती' })}:
          </span>
          <div className="mt-0.5 font-bold text-emerald-700 text-[11px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>निर्विवाद (No Dispute)</span>
          </div>
        </div>

        {/* 7/12 Implementation Status */}
        <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
          <span className="text-[10px] text-slate-500 font-medium">
            {t('documents.satbaraEffectedStatus', { defaultValue: '७/१२ अमलबजावणी' })}:
          </span>
          <div className="mt-0.5 font-bold text-emerald-800 text-[11px]">
            ✓ दप्तरी दाखल
          </div>
        </div>
      </div>

      {/* 5. Official Talathi Mutation Narrative Box (तलाठी सविस्तर फेरफार मजकूर) */}
      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 shadow-2xs">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
            <FileText className="w-3.5 h-3.5 text-amber-700" />
            <span>{t('documents.talathiNarrativeHeader', { defaultValue: 'तलाठी सविस्तर फेरफार मजकूर (Official Register Entry)' })}</span>
          </div>
          <span className="text-[9px] font-bold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded">
            MLRC Sec 150(1)
          </span>
        </div>
        <p className="text-[11px] text-amber-950 leading-relaxed font-serif bg-white/70 p-2.5 rounded-lg border border-amber-200/60">
          "{safeNarrative}"
        </p>
      </div>

      {/* 6. Interactive 7/12 Satbara Alteration Visualizer Toggle */}
      <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-200 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-700 shrink-0" />
          <div>
            <div className="font-bold text-blue-950 flex items-center gap-1.5">
              <span>{t('documents.satbaraSyncTitle', { defaultValue: '७/१२ अधिकार अभिलेख थेट जोडणी (Live 7/12 Sync)' })}</span>
              <span className="text-[9px] font-semibold bg-blue-200 text-blue-900 px-1.5 py-0.2 rounded">
                Record of Rights Linked
              </span>
            </div>
            <div className="text-[11px] text-blue-800 mt-0.5">
              {t('documents.satbaraSyncDesc', {
                defaultValue: 'This mutation has been executed in the digital 7/12 extract: former owner struck through and beneficiary entered.',
              })}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowSatbaraImpact(!showSatbaraImpact)}
          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white text-blue-900 border border-blue-200 hover:bg-blue-50 shadow-xs transition-colors flex items-center gap-1"
        >
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>
            {showSatbaraImpact
              ? t('documents.hideSatbaraAlteration', { defaultValue: 'Hide 7/12 Impact' })
              : t('documents.viewSatbaraAlteration', { defaultValue: 'Preview 7/12 Alteration' })}
          </span>
        </button>
      </div>

      {/* 7. Live 7/12 Satbara Impact Drawer */}
      {showSatbaraImpact && (
        <div className="p-3 bg-white rounded-xl border border-blue-300 text-xs space-y-2 animate-in fade-in duration-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-blue-100 pb-1.5">
            <div className="flex items-center gap-1.5 font-bold text-blue-950">
              <FileCheck2 className="w-4 h-4 text-blue-700" />
              <span>गाव नमुना ७/१२ - अधिकार अभिलेख (Column 7 Preview)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              गट क्र. {lr.surveyNumber} • खाते क्र. {lr.khataNumber}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {/* Struck through entry */}
            <div className="p-2 rounded bg-rose-50/60 border border-rose-200">
              <div className="text-[9px] text-rose-700 font-bold uppercase">
                कमी झालेली नोंद (Struck-through via {safeMutationNo})
              </div>
              <div className="mt-1 line-through text-slate-500 font-medium">
                {safeTransferor}
              </div>
              <div className="text-[9px] text-rose-600 font-mono mt-0.5">
                (फेरफार क्र. {safeMutationNo} अन्वये नाव कमी)
              </div>
            </div>

            {/* New live entry */}
            <div className="p-2 rounded bg-emerald-50/70 border border-emerald-200">
              <div className="text-[9px] text-emerald-800 font-bold uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                दाखल नवीन नोंद (Active in 7/12 Extract)
              </div>
              <div className="mt-1 text-emerald-950 font-bold">
                {safeTransferee} <span className="font-mono text-emerald-700">({safeMutationNo})</span>
              </div>
              <div className="text-[9px] text-emerald-700 font-mono mt-0.5">
                भोगवटादार वर्ग १ • क्षेत्र {lr.plotArea}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
