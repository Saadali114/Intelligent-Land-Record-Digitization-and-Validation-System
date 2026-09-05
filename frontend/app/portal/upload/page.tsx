'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

  // Extracted Fields for editing
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
      title: '7/12 Extract (Saatbara Utara)',
      marathi: '७/१२ उतारा',
      desc: 'Contains ownership, crop details, land assessment, and encumbrances under Maharashtra Land Revenue Code.',
      popular: true,
    },
    {
      type: 'Ferfar / Mutation Record',
      title: 'Ferfar / Mutation Record (Form 6)',
      marathi: 'फेरफार नोंदवही (नमुना ६)',
      desc: 'Official record recording change of title through sale, succession, partition, or court decree.',
    },
    {
      type: 'Sale Deed',
      title: 'Registered Sale Deed (Kharidi Khat)',
      marathi: 'नोंदणीकृत खरेदीखत',
      desc: 'Conveyance deed executed at the Sub-Registrar office transferring ownership rights.',
    },
    {
      type: 'Other Land Document',
      title: 'Other Land Document',
      marathi: 'इतर महसूल दस्ताऐवज',
      desc: '8-A Khatedar extract, City Survey Property Card (Malmatta Patrak), or Land Measurement Map (Mojani).',
    },
  ];

  // AI Pipeline Stages
  const aiStages = [
    { name: 'Document Preprocessing & Skew Correction', duration: 700 },
    { name: 'Multilingual OCR (Devanagari Marathi & English)', duration: 900 },
    { name: 'Entity & Cadastral Extraction (Survey, Khata, Area)', duration: 800 },
    { name: 'Cross-checking with Cadastral Map Geometry', duration: 800 },
    { name: 'Anomaly & Discrepancy Assessment', duration: 600 },
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
    const newApp = citizenService.submitApplication({
      documentType,
      fileName: uploadedFile?.name || 'document.pdf',
      fileSize: uploadedFile?.size || 1850000,
      surveyNumber: fields.surveyNumber.value,
      khasraNumber: fields.khasraNumber.value,
      khataNumber: fields.khataNumber.value,
      village: fields.village.value,
      taluka: fields.taluka.value,
      district: fields.district.value,
      landArea: fields.landArea.value,
      landType: fields.landType.value,
      ownerName: fields.ownerName.value,
      ocrConfidence: 0.97,
      extractedFields: fields,
      mobileNumber: '+91 98220 12345',
    });

    setSubmittedAppId(newApp.id);
    setStep(8);
  };

  return (
    <PortalLayout>
      {/* Wizard Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-900 uppercase tracking-wider">
              <UploadCloud className="w-4 h-4" />
              <span>Land Document Digitization Wizard</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Submit Land Record for Cadastral AI Extraction
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload your official land document. Our AI will transcribe the records, which you can verify before submission.
            </p>
          </div>

          {step < 8 && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start md:self-auto">
              <span>Step {step} of 7:</span>
              <span className="text-blue-900">
                {step === 1 && 'Select Document'}
                {step === 2 && 'Upload File'}
                {step === 3 && 'Document Preview'}
                {step === 4 && 'AI Processing'}
                {step === 5 && 'Extracted Review'}
                {step === 6 && 'Citizen Verification'}
                {step === 7 && 'Declaration'}
              </span>
            </div>
          )}
        </div>

        {/* Step Indicator Bar */}
        {step < 8 && (
          <div className="mt-6 pt-4 border-t border-slate-100 hidden sm:block">
            <div className="grid grid-cols-7 gap-2">
              {[
                { s: 1, label: 'Type' },
                { s: 2, label: 'Upload' },
                { s: 3, label: 'Preview' },
                { s: 4, label: 'AI OCR' },
                { s: 5, label: 'Review' },
                { s: 6, label: 'Identity' },
                { s: 7, label: 'Submit' },
              ].map((item) => (
                <div key={item.s} className="flex flex-col gap-1">
                  <div
                    className={`h-1.5 rounded-full transition-colors ${
                      step >= item.s ? 'bg-blue-900' : 'bg-slate-200'
                    }`}
                  />
                  <span
                    className={`text-[11px] font-medium text-center ${
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
              Select Land Document Category
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Choose the exact document type you are uploading. This helps our OCR model apply the correct revenue template.
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
                    Most Common
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
                Cancel
              </Button>
            </Link>
            <Button
              variant="primary"
              size="md"
              onClick={() => setStep(2)}
              className="gap-2"
            >
              <span>Continue to Upload</span>
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
                Upload {documentType}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Upload clear scanned copies or photos. Supported formats: PDF, PNG, JPG (up to 15 MB).
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Change Document Type
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
              Drag &amp; drop your document file here
            </h3>
            <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
              Scanned 7/12 extract or official revenue certificate in high resolution (300 DPI recommended for Devanagari text).
            </p>

            <label className="inline-block">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileInput}
                className="hidden"
              />
              <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-blue-900 text-white hover:bg-blue-800 cursor-pointer shadow-xs">
                Browse File from Computer
              </span>
            </label>
          </div>

          {/* Quick Demo Sample Picker */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-amber-950">
                  Quick Demo Evaluation Mode
                </div>
                <div className="text-[11px] text-amber-800">
                  Don't have a file handy? Use our preloaded sample 7/12 Extract (Survey 142/3, Pune).
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUseSampleFile}
              className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100/60 whitespace-nowrap text-xs font-bold"
            >
              Load Sample Document
            </Button>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <Button variant="outline" size="md" onClick={() => setStep(1)}>
              Back
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
                Document Selected &amp; Ready
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Confirm your uploaded file details before initiating automated AI digitization.
              </p>
            </div>
            <button
              onClick={() => setStep(2)}
              className="text-xs text-blue-900 font-semibold hover:underline"
            >
              Re-upload different file
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
                  Size: {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB &bull; Type: {documentType}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <Check className="w-3.5 h-3.5" /> File Validated
              </span>
            </div>
          </div>

          {/* Metadata Confirmation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                State
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
                District
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
                Taluka
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
              Back
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => setStep(4)}
              className="gap-2 bg-blue-900 hover:bg-blue-800 text-white"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Start AI Extraction &amp; Processing</span>
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
              Processing Document with Cadastral AI
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Please wait while our vision model transcribes Marathi and English land record details. Information will be presented for your review.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Overall Progress</span>
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
                    <span>{stage.name}</span>
                  </div>

                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    {isFinished && <span className="text-emerald-700">Completed</span>}
                    {isCurrent && <span className="text-blue-800">Processing...</span>}
                    {!isFinished && !isCurrent && <span className="text-slate-400">Waiting</span>}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-center text-[11px] text-slate-400">
            Realistic verification standard &bull; Does not make automated ownership declarations
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
                <strong>AI Extraction Complete. Please Review Carefully.</strong>
                <p className="text-blue-900/80 text-[11px]">
                  Compare the extracted data against your original document. You can click on any field to edit spelling or numbers before final submission.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-900 font-bold text-xs whitespace-nowrap self-start sm:self-auto">
              Average Confidence: 97%
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 5 Cols: Document Preview & Bounding Highlight */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Eye className="w-4 h-4 text-blue-900" />
                  <span>Document View (Saatbara 142/3)</span>
                </div>
                <span className="text-[10px] text-slate-400">Page 1 of 1</span>
              </div>

              {/* Mockup Scanned Document Representation */}
              <div className="flex-1 min-h-[420px] rounded-lg border border-slate-300 bg-amber-50/20 p-5 font-mono text-[11px] text-slate-700 relative overflow-hidden shadow-inner flex flex-col justify-between select-none">
                {/* Gov emblem header in document */}
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

                {/* Highlighted bounding box on Survey number */}
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
                    Extracted Revenue Fields
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review and modify any discrepancies detected.
                  </p>
                </div>
                <span className="text-[11px] text-slate-400">
                  {Object.keys(editedFields).length} field(s) edited
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
                              Edited
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
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep(6)}
                  className="gap-2 bg-blue-900 hover:bg-blue-800 text-white"
                >
                  <span>Confirm Extracted Data</span>
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
              Aadhaar Mobile Identity Authentication
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              To prevent fraudulent land record submissions, verify your identity with an OTP sent to your linked mobile number.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Applicant:</span>
              <span className="font-bold text-slate-900">Rahul Sitaram Patil</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Linked Mobile:</span>
              <span className="font-mono font-bold text-slate-900">+91 98220 12345</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Document:</span>
              <span className="font-semibold text-slate-800">{documentType} (142/3)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Enter 6-Digit OTP received on Mobile
            </label>
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-center text-xl font-mono font-bold tracking-widest bg-white border border-slate-300 rounded-lg py-2.5 focus:ring-2 focus:ring-blue-900"
            />
            <p className="text-[11px] text-center text-slate-400">
              Demo OTP automatically filled: <strong>841920</strong>
            </p>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <Button variant="outline" size="md" onClick={() => setStep(5)}>
              Back
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
              <span>Verify &amp; Continue</span>
            </Button>
          </div>
        </div>
      )}

      {/* STEP 7: APPLICATION REVIEW & DECLARATION */}
      {step === 7 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Final Review &amp; Citizen Declaration
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Please review all submitted details before final submission to the Taluka Land Records Office.
            </p>
          </div>

          {/* Summary Box */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 px-4 py-2.5 font-bold text-slate-800 border-b border-slate-200">
              Application Summary
            </div>
            <div className="p-4 grid grid-cols-2 gap-3 divide-y divide-slate-100 sm:divide-y-0">
              <div>
                <span className="text-slate-500">Document Type:</span>
                <div className="font-bold text-slate-900">{documentType}</div>
              </div>
              <div>
                <span className="text-slate-500">Owner Name:</span>
                <div className="font-bold text-slate-900">{fields.ownerName.value}</div>
              </div>
              <div>
                <span className="text-slate-500">Survey / Gat No:</span>
                <div className="font-bold text-slate-900">{fields.surveyNumber.value}</div>
              </div>
              <div>
                <span className="text-slate-500">Khata No:</span>
                <div className="font-bold text-slate-900">{fields.khataNumber.value}</div>
              </div>
              <div>
                <span className="text-slate-500">Location:</span>
                <div className="font-bold text-slate-900">
                  {fields.village.value}, {fields.taluka.value}, {fields.district.value}
                </div>
              </div>
              <div>
                <span className="text-slate-500">Total Area:</span>
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
                <strong>Legal Undertaking:</strong> I hereby declare that the uploaded document and provided information are true, authentic, and accurate to the best of my knowledge. I understand that submitting fraudulent or tampered land records is a punishable offence under the Maharashtra Land Revenue Code and Indian Penal Code.
              </span>
            </label>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <Button variant="outline" size="md" onClick={() => setStep(6)}>
              Back
            </Button>
            <Button
              variant="primary"
              size="lg"
              disabled={!declarationAccepted}
              onClick={handleFinalSubmit}
              className="gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold"
            >
              <span>Submit Land Record Application</span>
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
              Application Successfully Registered
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Thank You! Your Land Record is Submitted
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your application has been assigned an official reference number and entered into the cadastral verification queue.
            </p>
          </div>

          {/* Reference ID Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 inline-block">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Application Reference Number
            </div>
            <div className="font-mono text-xl font-bold text-blue-950 mt-1">
              {submittedAppId || 'ILRDVS-2026-000125'}
            </div>
          </div>

          <div className="text-xs text-slate-600 space-y-1 max-w-md mx-auto">
            <p>
              An SMS confirmation has been dispatched to <strong>+91 98220 12345</strong>.
            </p>
            <p className="text-slate-400 text-[11px]">
              The Taluka Land Records Officer / Talathi will review the cadastral alignment within 2-3 working days.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <Link href={`/portal/applications/${submittedAppId}`}>
              <Button variant="primary" size="md" className="gap-2 bg-blue-900 hover:bg-blue-800">
                <Layers className="w-4 h-4" />
                <span>Track Application Timeline</span>
              </Button>
            </Link>
            <Link href="/portal">
              <Button variant="outline" size="md">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
