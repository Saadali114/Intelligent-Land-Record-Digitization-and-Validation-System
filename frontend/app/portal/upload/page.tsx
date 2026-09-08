'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Eye,
  Sparkles,
  ShieldCheck,
  Building2,
  FileCheck,
  FileCode,
  Layers,
  Smartphone,
  Check,
  RefreshCw,
  Info,
} from 'lucide-react';
import { PortalLayout } from '../../../components/portal/PortalLayout';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { citizenService } from '../../../services/citizen.service';
import {
  CitizenDocumentType,
  ExtractedField,
} from '../../../types/citizen';

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export default function CitizenUploadWizardPage() {
  const { t } = useTranslation();
  const router = useRouter();

  // Wizard state
  const [step, setStep] = useState<WizardStep>(1);
  const [documentType, setDocumentType] = useState<CitizenDocumentType>('7/12 Extract');
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: number;
    type: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // AI Processing pipeline simulation
  const [aiProgress, setAiProgress] = useState(0);
  const [aiStageIndex, setAiStageIndex] = useState(0);

  // Extracted Fields for editing (Preserving original document legal values)
  const [fields, setFields] = useState<Record<string, ExtractedField>>({
    ownerName: {
      label: 'Land Owner Name',
      value: 'Rahul Sitaram Patil',
      confidence: 0.98,
      confidenceLevel: 'High',
    },
    surveyNumber: {
      label: 'Survey / Gat Number',
      value: '142/3',
      confidence: 0.99,
      confidenceLevel: 'High',
    },
    khasraNumber: {
      label: 'Hissa / Sub-Division',
      value: 'Sub-3',
      confidence: 0.94,
      confidenceLevel: 'High',
    },
    khataNumber: {
      label: 'Khata Number',
      value: '512',
      confidence: 0.97,
      confidenceLevel: 'High',
    },
    village: {
      label: 'Village',
      value: 'Khadakwasla',
      confidence: 0.99,
      confidenceLevel: 'High',
    },
    taluka: {
      label: 'Taluka',
      value: 'Haveli',
      confidence: 0.99,
      confidenceLevel: 'High',
    },
    district: {
      label: 'District',
      value: 'Pune',
      confidence: 0.99,
      confidenceLevel: 'High',
    },
    landArea: {
      label: 'Total Land Area',
      value: '1.45 Hectare (14,500 sq.m)',
      confidence: 0.91,
      confidenceLevel: 'High',
    },
    landType: {
      label: 'Land Classification',
      value: 'Agricultural (Jirayat)',
      confidence: 0.88,
      confidenceLevel: 'Medium',
    },
  });

  const [editedFields, setEditedFields] = useState<Record<string, boolean>>({});

  // Step 6: Identity verification
  const [otp, setOtp] = useState('841920');
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Step 7: Legal Declaration
  const [declarationAccepted, setDeclarationAccepted] = useState(false);

  // Step 8: Final submitted ID
  const [submittedAppId, setSubmittedAppId] = useState<string>('');

  const docTypeOptions: {
    type: CitizenDocumentType;
    title: string;
    marathi: string;
    desc: string;
    popular?: boolean;
  }[] = [
    {
      type: '7/12 Extract',
      title: '7/12 Extract (Saatbara)',
      marathi: '७/१२ उतारा (अधिकार अभिलेख)',
      desc: 'Contains ownership, crop details, land assessment, and encumbrances under Maharashtra Land Revenue Code.',
      popular: true,
    },
    {
      type: 'Ferfar / Mutation Record',
      title: 'Ferfar / Mutation Record (Form 6)',
      marathi: 'फेरफार नोंदवही (गाव नमुना ६)',
      desc: 'Official record recording change of title through sale, succession, partition, or court decree.',
    },
    {
      type: 'Sale Deed',
      title: 'Registered Sale Deed (Kharidi Khat)',
      marathi: 'नोंदणीकृत खरेदीखत (दस्त)',
      desc: 'Conveyance deed executed at the Sub-Registrar office transferring ownership rights.',
    },
    {
      type: 'Other Land Document',
      title: 'Other Land Document',
      marathi: 'इतर महसूल दस्ताऐवज / मिळकत पत्रिका',
      desc: '8-A Khatedar extract, City Survey Property Card (Malmatta Patrak), or Land Measurement Map (Mojani).',
    },
  ];

  // AI Pipeline Stages
  const aiStages = [
    { key: 'aiStage1', name: 'Document Preprocessing & Skew Correction', duration: 700 },
    { key: 'aiStage2', name: 'Multilingual OCR (Devanagari Marathi & English)', duration: 900 },
    { key: 'aiStage3', name: 'Entity & Cadastral Extraction (Survey, Khata, Area)', duration: 800 },
    { key: 'aiStage4', name: 'Cross-checking with Cadastral Map Geometry', duration: 800 },
    { key: 'aiStage5', name: 'Anomaly & Discrepancy Assessment', duration: 600 },
  ];

  // Run AI processing animation when entering step 4
  useEffect(() => {
    if (step === 4) {
      setAiProgress(0);
      setAiStageIndex(0);

      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 4;
        setAiProgress((prev) => {
          const next = Math.min(prev + 4, 100);
          if (next >= 20 && next < 45) setAiStageIndex(1);
          else if (next >= 45 && next < 70) setAiStageIndex(2);
          else if (next >= 70 && next < 90) setAiStageIndex(3);
          else if (next >= 90) setAiStageIndex(4);
          return next;
        });

        if (currentProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStep(5); // Advance to Extracted Data Review
          }, 600);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [step]);

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
      });
      setStep(3);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile({
        name: file.name,
        size: file.size,
        type: file.type,
      });
      setStep(3);
    }
  };

  // Preset sample file for instant reviewer testing
  const handleUseSampleFile = () => {
    setUploadedFile({
      name: 'Sample_7_12_Extract_Pune_142_3.pdf',
      size: 1940000,
      type: 'application/pdf',
    });
    setStep(3);
  };

  // Field edit handler
  const handleFieldChange = (key: string, newValue: string) => {
    setFields((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: newValue,
      },
    }));
    setEditedFields((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  // Final Submit
  const handleFinalSubmit = () => {
    const prof = citizenService.getProfile();
    const newApp = citizenService.submitApplication({
      documentType,
      fileName: uploadedFile?.name || 'document.pdf',
      fileSize: uploadedFile?.size || 1850000,
      surveyNumber: fields.surveyNumber.value,
      khasraNumber: fields.khasraNumber.value,
      khataNumber: fields.khataNumber.value,
      village: fields.village.value || prof.village,
      taluka: fields.taluka.value || prof.taluka,
      district: fields.district.value || prof.district,
      landArea: fields.landArea.value,
      landType: fields.landType.value,
      ownerName: fields.ownerName.value || prof.name,
      ocrConfidence: 0.97,
      extractedFields: fields,
      mobileNumber: prof.mobile || '+91 98220 12345',
    });

    setSubmittedAppId(newApp.id);
    setStep(8);
  };

  const stepLabels = [
    { s: 1, label: t('upload.step1') },
    { s: 2, label: t('upload.step2') },
    { s: 3, label: t('upload.step3') },
    { s: 4, label: t('upload.step4') },
    { s: 5, label: t('upload.step5') },
    { s: 6, label: t('upload.step6') },
    { s: 7, label: t('upload.step7') },
  ];

  return (
    <PortalLayout>
      {/* Wizard Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
              <UploadCloud className="w-4 h-4" />
              <span>{t('upload.wizardTitle')}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              {t('upload.wizardSubtitle')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('upload.wizardDesc')}
            </p>
          </div>

          {step < 8 && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start md:self-auto">
              <span>{t('upload.step')} {step} {t('upload.of')} 7:</span>
              <span className="text-blue-900">
                {stepLabels.find((sl) => sl.s === step)?.label}
              </span>
            </div>
          )}
        </div>

        {/* Step Indicator Bar */}
        {step < 8 && (
          <div className="mt-6 pt-4 border-t border-slate-100 hidden sm:block">
            <div className="grid grid-cols-7 gap-2">
              {stepLabels.map((item) => (
                <div key={item.s} className="flex flex-col gap-1">
                  <div
                    className={`h-1.5 rounded-full transition-colors ${
                      step >= item.s ? 'bg-blue-900' : 'bg-slate-200'
                    }`}
                  />
                  <span
                    className={`text-[11px] font-medium text-center truncate ${
                      step === item.s ? 'text-blue-900 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* STEP 1: SELECT DOCUMENT TYPE */}
      {step === 1 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {t('upload.selectCategoryTitle')}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t('upload.selectCategorySubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {docTypeOptions.map((opt) => (
              <div
                key={opt.type}
                onClick={() => setDocumentType(opt.type)}
                className={`p-5 rounded-xl border-2 transition-all cursor-pointer relative ${
                  documentType === opt.type
                    ? 'border-blue-900 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {opt.popular && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-900 text-white">
                    {t('upload.mostCommon')}
                  </span>
                )}
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-lg ${
                      documentType === opt.type
                        ? 'bg-blue-900 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">{opt.title}</h3>
                    <div className="text-xs font-semibold text-blue-950 font-serif">
                      {opt.marathi}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed pt-1">
                      {opt.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <Link href="/portal">
              <Button variant="outline" size="md">
                {t('common.cancel')}
              </Button>
            </Link>
            <Button
              variant="primary"
              size="md"
              onClick={() => setStep(2)}
              className="gap-2"
            >
              <span>{t('common.continue')}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: DRAG & DROP UPLOAD */}
      {step === 2 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {t('common.submitting')}: {documentType}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {t('upload.fileFormatNote')}
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> {t('common.back')}
            </button>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
              isDragging
                ? 'border-blue-900 bg-blue-50/80 scale-[1.005]'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center mx-auto mb-4">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              {t('upload.dragDropTitle')}
            </h3>
            <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
              {t('upload.dragDropSubtitle')}
            </p>

            <label className="inline-block">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileInput}
                className="hidden"
              />
              <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-900 text-white hover:bg-blue-800 cursor-pointer shadow-xs">
                {t('upload.browseFile')}
              </span>
            </label>
          </div>

          {/* Quick Demo Sample Picker */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-amber-950">
                  {t('upload.demoSampleTitle')}
                </div>
                <div className="text-[11px] text-amber-800">
                  {t('upload.demoSampleDesc')}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUseSampleFile}
              className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100/60 whitespace-nowrap text-xs font-bold"
            >
              {t('upload.loadSample')}
            </Button>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <Button variant="outline" size="md" onClick={() => setStep(1)}>
              {t('common.back')}
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: DOCUMENT PREVIEW & METADATA */}
      {step === 3 && uploadedFile && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {uploadedFile.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {t('upload.confirmFileDesc')}
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="text-xs text-blue-900 font-semibold hover:underline"
            >
              {t('common.cancel')}
            </button>
          </div>

          {/* Document File Card */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                PDF
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {uploadedFile.name}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {t('upload.sizeLabel')}: {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; {t('upload.typeLabel')}: {documentType}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <Check className="w-3.5 h-3.5" /> {t('upload.fileValidated')}
              </span>
            </div>
          </div>

          {/* Metadata Confirmation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('upload.stateLabel')}
              </label>
              <input
                type="text"
                disabled
                value="Maharashtra"
                className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-slate-700 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('common.district')}
              </label>
              <input
                type="text"
                disabled
                value="Pune"
                className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-slate-700 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('common.taluka')}
              </label>
              <input
                type="text"
                disabled
                value="Haveli"
                className="w-full text-xs bg-slate-100 border border-slate-200 rounded-lg p-2.5 text-slate-700 font-medium"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <Button variant="outline" size="md" onClick={() => setStep(2)}>
              {t('common.back')}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setStep(4)}
              className="gap-2 bg-blue-900 hover:bg-blue-800 text-white"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{t('upload.startAi')}</span>
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: AI PROCESSING PIPELINE (Animated) */}
      {step === 4 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-900 text-amber-400 flex items-center justify-center mx-auto shadow-md animate-pulse">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {t('upload.aiProgressTitle')}
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {t('upload.aiProgressSubtitle')}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>{t('common.status')}</span>
              <span className="font-mono text-blue-900">{aiProgress}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-blue-900 transition-all duration-200 rounded-full"
                style={{ width: `${aiProgress}%` }}
              />
            </div>
          </div>

          {/* 5-Step Pipeline Checklist */}
          <div className="space-y-3 pt-2">
            {aiStages.map((stage, idx) => {
              const isFinished = aiStageIndex > idx || aiProgress >= 100;
              const isCurrent = aiStageIndex === idx && aiProgress < 100;

              return (
                <div
                  key={stage.name}
                  className={`flex items-center justify-between p-3.5 rounded-lg border text-xs transition-colors ${
                    isFinished
                      ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950 font-medium'
                      : isCurrent
                      ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold shadow-xs'
                      : 'bg-slate-50/40 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isFinished ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 text-blue-800 animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                    )}
                    <span>{t(`upload.${stage.key}`, stage.name)}</span>
                  </div>

                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    {isFinished && <span className="text-emerald-700">{t('common.completed')}</span>}
                    {isCurrent && <span className="text-blue-800">{t('common.processing')}...</span>}
                    {!isFinished && !isCurrent && <span className="text-slate-400">{t('common.pending')}</span>}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-center text-[11px] text-slate-400">
            {t('upload.aiRealisticStandard')}
          </div>
        </div>
      )}

      {/* STEP 5: SPLIT-SCREEN EXTRACTED DATA REVIEW */}
      {step === 5 && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Info className="w-5 h-5 text-blue-800 flex-shrink-0" />
              <div>
                <strong>{t('upload.reviewBannerTitle')}</strong>
                <p className="text-blue-900/80 text-[11px]">
                  {t('upload.reviewBannerDesc')}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-900 font-bold text-xs whitespace-nowrap self-start sm:self-auto">
              {t('upload.averageConfidence')}: 97%
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Document Preview & Bounding Highlight (Preserving Original Document Text) */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Eye className="w-4 h-4 text-blue-900" />
                  <span>{t('upload.documentView')} (142/3)</span>
                </div>
                <span className="text-[10px] text-slate-400">Page 1 of 1</span>
              </div>

              {/* Scanned Document Mockup Representation */}
              <div className="flex-1 min-h-[420px] rounded-lg border border-slate-300 bg-amber-50/20 p-5 font-mono text-[11px] text-slate-700 relative overflow-hidden shadow-inner flex flex-col justify-between select-none">
                <div className="text-center pb-3 border-b border-slate-300 space-y-1">
                  <div className="font-bold text-slate-900 text-xs">
                    महाराष्ट्र शासन - महसूल व वन विभाग
                  </div>
                  <div className="text-[10px] text-slate-500 font-serif">
                    गाव नमुना सात (अधिकार अभिलेख पत्रक) व बारा (पिकांची नोंदवही)
                  </div>
                  <div className="text-[9px] text-slate-400">
                    तालुका: हवेली &bull; जिल्हा: पुणे &bull; गाव: खडकवासला
                  </div>
                </div>

                <div className="my-3 p-3 bg-white border border-slate-200 rounded text-xs space-y-2 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">भूमापन क्रमांक व उपविभाग:</span>
                    <span className="font-bold text-blue-900 px-1.5 py-0.5 bg-blue-100 rounded border border-blue-300">
                      142/3
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">खाते क्रमांक:</span>
                    <span className="font-bold text-slate-800">५१२ (512)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">एकूण क्षेत्र:</span>
                    <span className="font-bold text-slate-800">१.४५ हेक्टर</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">भोगवटादाराचे नाव:</span>
                    <span className="font-bold text-emerald-800">
                      राहुल सीताराम पाटील
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-500">
                  <div>आकारणी: रु. ४.२५ &bull; पोटखराब: ०.०५ हेक्टर</div>
                  <div className="mt-1">इतर हक्क: फेरफार क्र. MTR-2026-012 अन्वये नोंद</div>
                </div>

                <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-200">
                  Digital Watermark: MH-REV-DIGI-2026-VERIFIED
                </div>
              </div>
            </div>

            {/* Right 7 Cols: Editable Fields List */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {t('upload.extractedFieldsTitle')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {t('upload.reviewDiscrepanciesDesc')}
                  </p>
                </div>
                <span className="text-[11px] text-slate-400">
                  {Object.keys(editedFields).length} {t('upload.fieldsEdited')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(fields).map(([key, field]) => {
                  const isEdited = editedFields[key];
                  return (
                    <div
                      key={key}
                      className={`p-3 rounded-lg border transition-colors ${
                        isEdited
                          ? 'border-blue-500 bg-blue-50/30'
                          : 'border-slate-200 bg-slate-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700">
                          {field.label}
                        </label>
                        <div className="flex items-center gap-1">
                          {isEdited ? (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                              {t('upload.edited')}
                            </span>
                          ) : (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                field.confidenceLevel === 'High'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {Math.round(field.confidence * 100)}% Conf.
                            </span>
                          )}
                        </div>
                      </div>
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        className="w-full text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-blue-900 focus:border-blue-900"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <Button variant="outline" size="md" onClick={() => setStep(3)}>
                  {t('common.back')}
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep(6)}
                  className="gap-2 bg-blue-900 hover:bg-blue-800 text-white"
                >
                  <span>{t('upload.confirmExtracted')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: IDENTITY VERIFICATION */}
      {step === 6 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-10 shadow-xs max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {t('upload.authTitle')}
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {t('upload.authSubtitle')}
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{t('common.ownerName')}:</span>
              <span className="font-bold text-slate-900">Rahul Sitaram Patil</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{t('common.mobileNumber')}:</span>
              <span className="font-mono font-bold text-slate-900">+91 98220 12345</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{t('common.status')}:</span>
              <span className="font-semibold text-slate-800">{documentType} (142/3)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              {t('auth.otpLabel')}
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-center text-xl font-mono font-bold tracking-widest bg-white border border-slate-300 rounded-lg py-2.5 focus:ring-2 focus:ring-blue-900"
            />
            <p className="text-[11px] text-center text-slate-400">
              {t('upload.demoOtpNote')} <strong>841920</strong>
            </p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <Button variant="outline" size="md" onClick={() => setStep(5)}>
              {t('common.back')}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setIsOtpVerified(true);
                setStep(7);
              }}
              className="gap-2 bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              <Check className="w-4 h-4" />
              <span>{t('upload.verifyAndContinue')}</span>
            </Button>
          </div>
        </div>
      )}

      {/* STEP 7: APPLICATION REVIEW & DECLARATION */}
      {step === 7 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {t('upload.finalReviewTitle')}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t('upload.finalReviewSubtitle')}
            </p>
          </div>

          {/* Summary Box */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-800 border-b border-slate-200">
              {t('upload.summaryTitle')}
            </div>
            <div className="p-4 grid grid-cols-2 gap-3 divide-y divide-slate-100 sm:divide-y-0">
              <div>
                <span className="text-slate-500">{t('upload.docTypeLabel')}</span>
                <div className="font-bold text-slate-900">{documentType}</div>
              </div>
              <div>
                <span className="text-slate-500">{t('common.ownerName')}:</span>
                <div className="font-bold text-slate-900">{fields.ownerName.value}</div>
              </div>
              <div>
                <span className="text-slate-500">{t('common.surveyNumber')}:</span>
                <div className="font-bold text-slate-900">{fields.surveyNumber.value}</div>
              </div>
              <div>
                <span className="text-slate-500">{t('common.khataNumber')}:</span>
                <div className="font-bold text-slate-900">{fields.khataNumber.value}</div>
              </div>
              <div>
                <span className="text-slate-500">{t('common.village')}:</span>
                <div className="font-bold text-slate-900">
                  {fields.village.value}, {fields.taluka.value}, {fields.district.value}
                </div>
              </div>
              <div>
                <span className="text-slate-500">{t('common.landArea')}:</span>
                <div className="font-bold text-slate-900">{fields.landArea.value}</div>
              </div>
            </div>
          </div>

          {/* Legal Declaration Checkbox */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={declarationAccepted}
                onChange={(e) => setDeclarationAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900 cursor-pointer"
              />
              <span className="text-xs text-slate-800 leading-relaxed">
                <strong>{t('upload.legalUndertakingTitle')}</strong> {t('upload.legalUndertakingText')}
              </span>
            </label>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <Button variant="outline" size="md" onClick={() => setStep(6)}>
              {t('common.back')}
            </Button>
            <Button
              variant="primary"
              size="lg"
              disabled={!declarationAccepted}
              onClick={handleFinalSubmit}
              className="gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold"
            >
              <span>{t('upload.submitApplication')}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 8: SUBMISSION SUCCESS */}
      {step === 8 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 sm:p-12 shadow-md max-w-2xl mx-auto text-center space-y-6 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {t('upload.successBadge')}
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              {t('upload.successTitle')}
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {t('upload.successDesc')}
            </p>
          </div>

          {/* Reference ID Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 inline-block">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              {t('upload.refNumberLabel')}
            </div>
            <div className="font-mono text-xl font-bold text-blue-950 mt-1">
              {submittedAppId || 'ILRDVS-2026-000125'}
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-1 max-w-md mx-auto">
            <p>
              {t('upload.smsConfirmation')} (+91 98220 12345)
            </p>
            <p className="text-slate-400 text-[11px]">
              {t('common.pendingOfficerVerification')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <Link href={`/portal/applications/${submittedAppId}`}>
              <Button variant="primary" size="md" className="gap-2 bg-blue-900 hover:bg-blue-800">
                <Layers className="w-4 h-4" />
                <span>{t('upload.trackTimeline')}</span>
              </Button>
            </Link>
            <Link href="/portal">
              <Button variant="outline" size="md">
                {t('upload.returnDashboard')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
