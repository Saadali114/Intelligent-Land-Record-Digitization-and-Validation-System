'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { PortalLayout } from '../../../../components/portal/PortalLayout';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  ShieldCheck,
  Building2,
  FileCheck,
  Scroll,
} from 'lucide-react';
import { documentVerificationService } from '../../../../services/documentVerification.service';

export default function CitizenDocumentUploadPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [documentType, setDocumentType] = useState('7/12 Extract (Satbara)');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<'CASE_1_GREEN' | 'CASE_2_YELLOW' | 'CASE_3_RED' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineStage, setPipelineStage] = useState(0);

  const stages = [
    'Computing SHA-256 Checksum & Adaptive Sharpening...',
    'Performing Multilingual Cadastral OCR (Marathi / English)...',
    'Extracting Entities: Khatedar, Gat No., Land Area & Boundary...',
    'Querying Prototype Government Reference Registry...',
    'Evaluating Structural Consistency & Risk Analysis...',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setSelectedPreset(null);
    }
  };

  const handlePresetSelect = (preset: 'CASE_1_GREEN' | 'CASE_2_YELLOW' | 'CASE_3_RED') => {
    setSelectedPreset(preset);
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !selectedPreset) {
      alert('Please select a file to upload or choose a demo evaluation scenario.');
      return;
    }

    setIsProcessing(true);
    setPipelineStage(0);

    const interval = setInterval(() => {
      setPipelineStage((prev) => {
        if (prev < stages.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 800);

    try {
      const formData = new FormData();
      formData.append('documentType', documentType);
      if (selectedPreset) {
        formData.append('casePreset', selectedPreset);
      }
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const result = await documentVerificationService.uploadAndVerify(formData);
      clearInterval(interval);
      const appId = (result as any).trackingNumber || result.applicationId || (result as any).id || 'CASE-001-GREEN';
      router.push(`/citizen/verifications/${appId}`);
    } catch (err: any) {
      clearInterval(interval);
      console.error('Error submitting document:', err);
      setIsProcessing(false);
      alert(err.message || 'Verification pipeline encountered an error. Please try again.');
    }
  };

  return (
    <PortalLayout>
      <div className="max-w-4xl mx-auto space-y-6 select-none">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/portal"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Citizen Hub
          </Link>
          <span className="text-[11px] font-mono uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-[#14532d] border border-emerald-300">
            DILRMP 3.0 Automated Title Ingestion
          </span>
        </div>

        {/* Title Card */}
        <div className="bg-sovereign-800 text-white rounded-2xl p-6 sm:p-7 shadow-md border border-emerald-950 space-y-2">
          <div className="inline-flex items-center gap-2 text-emerald-300 font-mono text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Cadastral Document Digitization Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Upload Land Document for Verification
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed font-normal max-w-2xl">
            Upload your scanned Maharashtra revenue record or choose an authoritative prototype scenario to trigger the 8-Layer AI cross-verification pipeline.
          </p>
        </div>

        {isProcessing ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-8 sm:p-10 text-center space-y-6 shadow-xs">
            <div className="inline-block p-4 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-xl text-stone-900">
                Processing Document Ingestion
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                {stages[pipelineStage]}
              </p>
            </div>

            {/* Stepper progress */}
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden max-w-md mx-auto">
              <div
                className="bg-sovereign-800 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((pipelineStage + 1) / stages.length) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Document Type Selector */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
              <label className="block font-serif font-bold text-sm text-stone-900">
                Select Revenue Document Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {[
                  '7/12 Extract (Satbara)',
                  'Form 6 Ferfar (Mutation)',
                  'Archival Deed / Sanad',
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDocumentType(type)}
                    className={`p-3.5 rounded-xl border text-left font-semibold transition-all cursor-pointer ${
                      documentType === type
                        ? 'bg-emerald-50 border-[#14532d] text-[#14532d] ring-1 ring-[#14532d]'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-800" />
                      <span>{type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Area */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
              <label className="block font-serif font-bold text-sm text-stone-900">
                Upload Scanned File (PDF, TIFF, JPEG)
              </label>
              <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-8 text-center bg-stone-50/60 hover:bg-emerald-50/30 transition-colors">
                <input
                  type="file"
                  id="document-upload"
                  accept=".pdf,.jpg,.jpeg,.png,.tiff"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="document-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-stone-900 block">
                      {selectedFile ? selectedFile.name : 'Click to select document or drag & drop'}
                    </span>
                    <span className="text-xs text-stone-500 mt-1 block">
                      Supports high-resolution scans up to 50MB (Bilingual Marathi / English)
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Evaluation Scenarios / Presets */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div>
                <h3 className="font-serif font-bold text-sm text-stone-900">
                  Or Test Authoritative Prototype Scenarios
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Select a pre-configured sample document to test the automatic verification checks
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Case 1 */}
                <button
                  type="button"
                  onClick={() => handlePresetSelect('CASE_1_GREEN')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                    selectedPreset === 'CASE_1_GREEN'
                      ? 'bg-emerald-50 border-[#14532d] ring-1 ring-[#14532d]'
                      : 'bg-stone-50 border-stone-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-xs">Case 1: Clear RoR</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#14532d] text-white">
                      CLEAN
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    Clean 7/12 extract matching RoR with zero area discrepancy.
                  </p>
                </button>

                {/* Case 2 */}
                <button
                  type="button"
                  onClick={() => handlePresetSelect('CASE_2_YELLOW')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                    selectedPreset === 'CASE_2_YELLOW'
                      ? 'bg-amber-50 border-amber-500 ring-1 ring-amber-500'
                      : 'bg-stone-50 border-stone-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-xs">Case 2: Variance</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-stone-950">
                      WARNING
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    0.04 Ha boundary variance against SVAMITVA drone ortho-polygon.
                  </p>
                </button>

                {/* Case 3 */}
                <button
                  type="button"
                  onClick={() => handlePresetSelect('CASE_3_RED')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                    selectedPreset === 'CASE_3_RED'
                      ? 'bg-rose-50 border-rose-500 ring-1 ring-rose-500'
                      : 'bg-stone-50 border-stone-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-xs">Case 3: Collision</span>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-600 text-white">
                      CRITICAL
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-snug">
                    Double-registration or active court stay injunction collision.
                  </p>
                </button>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/portal"
                className="px-5 py-3 rounded-xl border border-stone-300 text-stone-700 font-semibold text-xs hover:bg-stone-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sovereign-800 hover:bg-sovereign-700 text-white font-serif font-bold text-xs shadow-md transition-all cursor-pointer border border-emerald-500/30"
              >
                <FileCheck className="w-4 h-4 text-gold-400" />
                <span>Run Ingestion Pipeline</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </PortalLayout>
  );
}
