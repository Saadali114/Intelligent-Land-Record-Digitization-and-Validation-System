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

    // Animate stages for realistic feedback
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/citizen/verifications"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to My Applications
          </Link>
          <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30">
            Automated Land Title Ingestion
          </span>
        </div>

        {/* Title */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-white">Upload Land Document for Verification</h1>
          <p className="text-sm text-slate-400 mt-1">
            Upload your scanned Maharashtra revenue record or select an authoritative evaluation case to run the end-to-end AI cross-check pipeline.
          </p>
        </div>

        {isProcessing ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-6">
            <div className="inline-block p-4 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 animate-pulse">
              <Sparkles className="w-10 h-10 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Verification Engine Running</h3>
              <p className="text-sm text-sky-400 font-medium mt-1">
                {stages[pipelineStage]}
              </p>
            </div>

            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden max-w-md mx-auto border border-slate-800">
              <div
                className="bg-gradient-to-r from-sky-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${((pipelineStage + 1) / stages.length) * 100}%` }}
              ></div>
            </div>

            <p className="text-xs text-slate-500">
              Generating cryptographic SHA-256 fingerprint, parsing Devanagari numerals, and querying cadastral registry...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Select Document Type */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                <h2 className="text-base font-bold text-white">Select Document Classification</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { id: '7/12 Extract (Satbara)', desc: 'Record of Rights (RoR) & Crops' },
                  { id: '8A Extract (Khate Pustika)', desc: 'Holding & Tax Assessment' },
                  { id: 'Ferfar (Mutation Register)', desc: 'Title Transition & Inheritance' },
                  { id: 'Sale Deed (Kharidi Khat)', desc: 'Sub-Registrar Conveyance' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDocumentType(item.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      documentType === item.id
                        ? 'bg-sky-500/10 border-sky-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{item.id}</div>
                    <div className="text-[11px] text-slate-400 mt-1">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Instant Demo Scenarios (Judge/Evaluator Mode) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                  <h2 className="text-base font-bold text-white">Instant Demo Scenarios (Optional)</h2>
                </div>
                <span className="text-xs text-sky-400 font-semibold">Judge / Demonstration Mode</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div
                  onClick={() => handlePresetSelect('CASE_1_GREEN')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedPreset === 'CASE_1_GREEN'
                      ? 'bg-emerald-500/10 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Scenario 1 (Low Risk)</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Pass</span>
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">Shankar Ganpat Patil</div>
                  <div className="text-xs text-slate-400 mt-0.5">Survey 145/2A • Haveli, Pune</div>
                  <p className="text-[11px] text-slate-500 mt-2">Genuine owner matching cadastral registry.</p>
                </div>

                <div
                  onClick={() => handlePresetSelect('CASE_2_YELLOW')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedPreset === 'CASE_2_YELLOW'
                      ? 'bg-amber-500/10 border-amber-500 text-white'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">Scenario 2 (Medium Risk)</span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">Clarification</span>
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">Meena Rajendra Kulkarni</div>
                  <div className="text-xs text-slate-400 mt-0.5">Survey 88/3 • Dindori, Nashik</div>
                  <p className="text-[11px] text-slate-500 mt-2">Legal heir relationship requires clarification.</p>
                </div>

                <div
                  onClick={() => handlePresetSelect('CASE_3_RED')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedPreset === 'CASE_3_RED'
                      ? 'bg-red-500/10 border-red-500 text-white'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400">Scenario 3 (High Risk)</span>
                    <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded">Discrepancy</span>
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">Rahul Shankar Patil</div>
                  <div className="text-xs text-slate-400 mt-0.5">Survey 211/4 • Haveli, Pune</div>
                  <p className="text-[11px] text-slate-500 mt-2">Area inflation & ownership discrepancy detected.</p>
                </div>
              </div>
            </div>

            {/* Step 3: Or Upload Custom File */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <span className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">3</span>
                <h2 className="text-base font-bold text-white">Upload Your File (PDF, PNG, JPG)</h2>
              </div>

              <div className="border-2 border-dashed border-slate-800 hover:border-sky-500 rounded-xl p-8 text-center transition-colors">
                <UploadCloud className="w-10 h-10 text-sky-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-white">
                  {selectedFile ? selectedFile.name : 'Click to browse or drag & drop document file'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supported formats: PDF, PNG, JPEG, TIFF (Max file size: 10MB)
                </p>
                <input
                  type="file"
                  id="doc-upload-input"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,.tiff"
                  className="hidden"
                />
                <label
                  htmlFor="doc-upload-input"
                  className="inline-block mt-4 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 font-semibold text-xs cursor-pointer transition-colors"
                >
                  Choose Document File
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/citizen/verifications"
                className="px-4 py-2.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white text-sm font-semibold"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/20 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Execute AI Verification Pipeline
              </button>
            </div>
          </form>
        )}
      </div>
    </PortalLayout>
  );
}
