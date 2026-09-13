'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  UploadCloud,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  ExternalLink,
  Layers,
  Sparkles,
  Search,
  Download,
  Eye,
  FileCheck,
  Building,
  History,
  Phone,
  Hourglass,
  Calendar,
  Compass,
} from 'lucide-react';
import { PortalLayout } from '../../components/portal/PortalLayout';
import { ApplyDigitalDocumentModal } from '../../components/portal/ApplyDigitalDocumentModal';

export default function CitizenDashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'satbara' | 'ferfar' | 'deeds'>('all');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  return (
    <PortalLayout>
      <div className="space-y-6 select-none">
        {/* ========================================================================= */}
        {/* WELCOME HERO CARD                                                         */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#14532d] font-bold text-[11px] border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Verified Landholder
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-[11px] border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Bhu-Aadhaar e-KYC Active
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                  DILRMP 3.0 Standard
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
                Namaste, Saad Ali{' '}
                <span className="text-base sm:text-lg font-sans font-normal text-slate-500">
                  (नमस्ते, साद अली)
                </span>
              </h1>

              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#14532d]" />
                <span>Khadakwasla, Taluka Haveli, District Pune, Maharashtra • Revenue Division Pune</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1 font-mono">
                <span>Citizen ID: <strong className="text-slate-800">MH-PUN-HV-83421</strong></span>
                <span>•</span>
                <span>Last RoR Sync: <strong className="text-emerald-800">Today, 09:40 AM</strong></span>
              </div>
            </div>

            {/* CTAs on Right */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#14532d] hover:bg-[#166534] text-white font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Apply for Document / Extract</span>
              </button>

              <Link
                href="/portal/upload"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 hover:border-[#14532d] transition-all shadow-2xs"
              >
                <UploadCloud className="w-4 h-4 text-slate-600" />
                <span>Upload Deed / Scan</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ACTION REQUIRED ALERT BOX (Amber Banner)                                  */}
        {/* ========================================================================= */}
        <div className="bg-[#fffbeb] rounded-2xl border border-[#fde68a] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950">
                  ACTION REQUIRED
                </span>
                <span className="text-xs font-bold text-slate-900">
                  Application ILRDVS-2026-000075 • Gat No. 45/1, Kothrud (फेरफार आक्षेप / विसंगती निवारण)
                </span>
              </div>
              <p className="text-xs text-amber-950/80 leading-relaxed max-w-3xl">
                A boundary/area variance of 0.02 Hectares was flagged during automatic cross-verification with SVAMITVA drone ortho-imagery (SOI). Please submit clarification or approve resurvey demarcation to resume processing before 22 Sept 2026.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <Link
              href="/verification"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#92400e] hover:bg-[#78350f] text-white font-bold text-xs shadow-2xs transition-all"
            >
              <span>Review & Clarify</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs border border-amber-300 shadow-2xs transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Overlay</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4 MAIN STATS CARDS                                                        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1: Parcels */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">नोंदणीकृत जमिनी / PARCELS</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              3 <span className="text-xs font-sans font-medium text-slate-500">Parcels</span>
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between border-t border-slate-100 pt-2">
              <span>Across Haveli & Mulshi</span>
              <strong className="text-[#14532d]">3.45 Hectares</strong>
            </div>
          </div>

          {/* Stat 2: In Processing */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">प्रक्रियेत / IN PROCESSING</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Hourglass className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
              2 <span className="text-xs font-sans font-medium text-slate-500">Applications</span>
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between border-t border-slate-100 pt-2">
              <span>Form 6 Ferfar & Area</span>
              <strong className="text-amber-800">3 Days Remaining</strong>
            </div>
          </div>

          {/* Stat 3: Verified Titles */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">प्रमाणित / VERIFIED TITLES</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#14532d] font-mono">
              1 <span className="text-xs font-sans font-medium text-slate-500">Sealed Title</span>
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between border-t border-slate-100 pt-2">
              <span>STQC & MLRC 1966</span>
              <strong className="text-emerald-800">Active QR v3</strong>
            </div>
          </div>

          {/* Stat 4: Action Pending */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">त्वरित कार्यवाही / ACTION PENDING</span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-rose-700 font-mono">
              1 <span className="text-xs font-sans font-medium text-slate-500">Notice Pending</span>
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between border-t border-slate-100 pt-2">
              <span>Drone Demarcation</span>
              <strong className="text-rose-800">12 Days to Auto-Refer</strong>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2-COLUMN MAIN CONTENT (Left: 65% / Right: 35%)                           */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Applications, Document Upload, 8-Layer Health */}
          <div className="lg:col-span-8 space-y-6">
            {/* Recent Land Record Applications */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Recent Land Record Applications & Mutations
                  </h3>
                  <p className="text-xs text-slate-500">
                    फेरफार अर्ज, नोंद वारसा व अभिलेख तपासणी सद्यस्थिती (Track e-Hakk & RoR pipelines in real-time)
                  </p>
                </div>

                <Link
                  href="/portal/applications"
                  className="text-xs font-bold text-[#14532d] hover:underline shrink-0"
                >
                  View All History (14) →
                </Link>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'all'
                      ? 'bg-[#14532d] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Applications (4)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('satbara')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'satbara'
                      ? 'bg-[#14532d] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  7/12 Extracts (1)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ferfar')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'ferfar'
                      ? 'bg-[#14532d] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Form 6 Ferfar (1)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('deeds')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    activeTab === 'deeds'
                      ? 'bg-[#14532d] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Archival Deeds (1)
                </button>
              </div>

              {/* List of Applications */}
              <div className="space-y-3 pt-1">
                {/* Application 1: Processing with Stepper Timeline */}
                <div className="p-4 rounded-xl border border-slate-200 bg-[#f6f8f4] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-xs">
                          ILRDVS-2026-000129
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                          PROCESSING • CIRCLE OFFICER REVIEW
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Village Form 7/12 (गावनिहाय डिजिटल सातबारा) • Gat No. 142/3 • Khadakwasla
                      </p>
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono shrink-0">
                      Submitted: 05 Sept 2026
                    </span>
                  </div>

                  {/* 5-Step Progress Timeline */}
                  <div className="grid grid-cols-5 gap-1 pt-2 text-center text-[10px]">
                    <div className="space-y-1">
                      <div className="w-5 h-5 rounded-full bg-[#14532d] text-white flex items-center justify-center mx-auto text-[9px] font-bold">✓</div>
                      <div className="font-bold text-slate-800">Ingestion</div>
                      <div className="text-[9px] text-slate-400 font-mono">Done 05 Sep</div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-5 h-5 rounded-full bg-[#14532d] text-white flex items-center justify-center mx-auto text-[9px] font-bold">✓</div>
                      <div className="font-bold text-slate-800">AI Modi OCR</div>
                      <div className="text-[9px] text-emerald-800 font-mono">99.1% High</div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-5 h-5 rounded-full bg-[#14532d] text-white flex items-center justify-center mx-auto text-[9px] font-bold">✓</div>
                      <div className="font-bold text-slate-800">Talathi Check</div>
                      <div className="text-[9px] text-slate-400">Approved</div>
                    </div>
                    <div className="space-y-1">
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center mx-auto text-[9px] font-bold animate-pulse">4</div>
                      <div className="font-bold text-amber-900">Circle Officer</div>
                      <div className="text-[9px] text-amber-800">Under Sanction</div>
                    </div>
                    <div className="space-y-1 opacity-60">
                      <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto text-[9px] font-bold">5</div>
                      <div className="font-bold text-slate-600">Digital Seal</div>
                      <div className="text-[9px] text-slate-400 font-mono">Est. 12 Sep</div>
                    </div>
                  </div>
                </div>

                {/* Application 2: Vectorization Completed */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">ILRDVS-2026-000128</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-[#14532d] border border-emerald-300">
                        AI VECTORIZATION COMPLETED (Acc: 98.4%)
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">
                      Archival Tippan & Sale Deed 1974 (ऐतिहासिक दस्तऐवज) • Gat No. 87/3 • Wadgaon Budruk
                    </p>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors shrink-0"
                  >
                    <span>View AI Extraction</span>
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                </div>

                {/* Application 3: Certified & Downloadable */}
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-[#f0fdf4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">ILRDVS-2026-000094</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#14532d] text-white">
                        CERTIFIED & DOWNLOADABLE
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">
                      Form 8A, Khatepustika (८-अ खातेनोंद नोंदवही) • Khata No. 219 • Village: Khadakwasla
                    </p>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#14532d] hover:bg-[#166534] text-white font-bold text-xs shadow-2xs transition-all shrink-0 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Signed PDF (QR Validated)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cadastral Document Upload & Instant OCR Scanner */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Cadastral Document Upload & Instant OCR Scanner
                  </h3>
                  <p className="text-xs text-slate-500">
                    दस्तावेज डिजिटायझेशन व स्वयंचलित वाचन (Peshwa, British & Post-Independence Revenue Records)
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  Dual Engine OCR: Modi & Devanagari
                </span>
              </div>

              {/* Big Drag and Drop Box */}
              <div className="border-2 border-dashed border-emerald-300 rounded-2xl p-6 sm:p-8 text-center bg-[#f6f8f4] hover:bg-[#edf3ea] transition-colors cursor-pointer space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">
                    Drag & Drop Land Deeds, 7/12 Scans, or Tippan Maps
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-lg mx-auto">
                    Supports Modi Script, Archaic Marathi, Devanagari, Urdu & Colonial English. High-resolution PDF, TIFF, JPEG up to 50MB.
                  </p>
                </div>

                {/* Pill Badges of Supported Types */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-[10px]">
                  <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">Village Form 7/12</span>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">Form 6 Ferfar</span>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">Index-II (सूची २)</span>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">Mojani Nakasha (Gat Map)</span>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">Archival Sanad</span>
                </div>

                {/* Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/portal/upload"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#14532d] hover:bg-[#166534] text-white font-bold text-xs shadow-xs"
                  >
                    <span>Browse Files from Computer</span>
                  </Link>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-300 shadow-2xs"
                  >
                    <span>Fetch from DigiLocker</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  All uploads are processed inside Maharashtra State Data Centre (SDC) with 256-bit AES cryptographic hashing.
                </span>
                <span className="text-[#14532d] font-bold shrink-0">
                  View OCR Accuracy Benchmark →
                </span>
              </div>
            </div>

            {/* 8-Layer Cadastral Health Index */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    8-Layer Cadastral Health Index
                  </h3>
                  <p className="text-xs text-slate-500">
                    अष्टस्तरीय भूमी संबंध एकात्मता पडताळणी (Cross-validation integrity across all statutory registries)
                  </p>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-[#14532d] font-bold text-xs border border-emerald-300 font-mono">
                  Composite Score: 94 / 100
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Circular Gauge */}
                <div className="sm:col-span-4 flex items-center justify-center">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#dce5d7" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="40" fill="transparent" stroke="#14532d" strokeWidth="8"
                        strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - 0.91)} strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-xl font-black text-slate-900 font-mono">91%</span>
                      <span className="text-[8px] uppercase tracking-wider font-bold text-slate-500">
                        Integrity
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown & Checklist */}
                <div className="sm:col-span-8 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-[11px] pb-2 border-b border-slate-100">
                    <div>Spatial Alignment: <strong className="text-emerald-800">98%</strong></div>
                    <div>Revenue Sync: <strong className="text-emerald-800">100%</strong></div>
                    <div>Encumbrance: <strong className="text-emerald-800">Clear (0 Lien)</strong></div>
                    <div>Gat 45/1: <strong className="text-amber-800">Drone Gap (Action Req.)</strong></div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-700">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      L1: Rights (7/12)
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      L2: Mutation (Ferfar)
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      L3: Cadastral Vector
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      L4: CERSAI Bank Lien
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      L5: RCCMS Court Stay
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-800 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      L6: SVAMITVA GIS Sync
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: My Land Parcels, Citizen Services, Local Office */}
          <div className="lg:col-span-4 space-y-6">
            {/* My Land Parcels Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">
                    My Land Parcels (माझी जमीन)
                  </h3>
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#14532d] font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Bhu-Aadhaar Digital Passbook</span>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Parcel 1 */}
                <div className="p-3.5 rounded-xl border border-emerald-200 bg-[#f0fdf4] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#14532d] text-white uppercase">
                      VERIFIED & DEMARCATED
                    </span>
                    <div className="text-right">
                      <span className="font-black text-slate-900 text-sm">1.10 Hec</span>
                      <div className="text-[9px] text-slate-500">Potkharaba: 0.05 Hec</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">
                      Survey Gat No. 87/3
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Wadgaon Budruk, Taluka Haveli, Pune
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-white border border-emerald-100 font-mono text-[10px]">
                    <span>ULPIN: <strong>27-25-045-85LVQLD</strong></span>
                    <span className="text-[#14532d] font-bold">GIS MAPPED</span>
                  </div>

                  <div className="space-y-1 text-[10px] text-slate-600">
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      7/12 RoR Synchronized (Khata 219)
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Form 6 Ferfar Sanctioned (SDO #2241)
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      CERSAI & Banking: Clear (No Active Mortgages)
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      RCCMS Revenue Court: No Pending Disputes
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-[#14532d] hover:bg-[#166534] text-white font-bold text-xs shadow-2xs transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Certified 7/12 PDF</span>
                  </button>
                </div>

                {/* Parcel 2 */}
                <div className="p-3.5 rounded-xl border border-amber-200 bg-[#fffbeb] space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-slate-950 uppercase">
                      UNDER RE-SURVEY REVIEW
                    </span>
                    <div className="text-right">
                      <span className="font-black text-slate-900 text-sm">2.35 Hec</span>
                      <div className="text-[9px] text-slate-500">Bagayat Category</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">
                      Survey Gat No. 124/2
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Khadakwasla, Haveli, Pune
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-white border border-amber-200 font-mono text-[10px]">
                    <span>ULPIN: <strong>27-26-089-91MKE7H</strong></span>
                    <span className="text-amber-800 font-bold">DRONE SYNCING</span>
                  </div>

                  <p className="text-[10px] text-amber-900/80 leading-relaxed">
                    Drone demarcation synchronized with village cadastral map. Public notice window expires in 6 days.
                  </p>

                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white hover:bg-amber-50 text-amber-950 font-bold text-xs border border-amber-300 shadow-2xs transition-all"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-800" />
                    <span>View Demarcation Draft</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Citizen Revenue Services 2x2 Grid */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Citizen Revenue Services
                </h3>
                <p className="text-[11px] text-slate-500">
                  महसूल विभागातील थेट नागरिक सुविधा
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(true)}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition-all group cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#14532d] mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900 text-[11px]">Form 6 Ferfar</div>
                  <div className="text-[9px] text-slate-500">फेरफार नोंदणी अर्ज</div>
                </button>

                <Link
                  href="/land-records"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition-all group"
                >
                  <Compass className="w-4 h-4 text-[#14532d] mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900 text-[11px]">Demarcation</div>
                  <div className="text-[9px] text-slate-500">मोजणी अर्ज (Mojani)</div>
                </Link>

                <Link
                  href="/documents"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition-all group"
                >
                  <History className="w-4 h-4 text-[#14532d] mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900 text-[11px]">e-Chawadi Notices</div>
                  <div className="text-[9px] text-slate-500">गाव चावडी जाहीर नोटीस</div>
                </Link>

                <Link
                  href="/verification"
                  className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition-all group"
                >
                  <Phone className="w-4 h-4 text-[#14532d] mb-1 group-hover:scale-110 transition-transform" />
                  <div className="font-bold text-slate-900 text-[11px]">Contact Talathi</div>
                  <div className="text-[9px] text-slate-500">मंडळ अधिकारी संपर्क</div>
                </Link>
              </div>
            </div>

            {/* Local Revenue Office Card */}
            <div className="bg-[#f6f8f4] rounded-2xl border border-slate-200/90 p-4 space-y-2 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#14532d] text-white flex items-center justify-center font-bold">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Saja Khadakwasla • Haveli Pune</div>
                  <div className="text-[11px] text-slate-500">Talathi: Shri. R. S. Deshmukh</div>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 border-t border-slate-200 pt-2 flex justify-between">
                <span>Office Hours: Mon - Fri, 10:00 - 17:00 IST</span>
                <span className="text-[#14532d] font-bold">Open Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CITIZEN FOOTER BAR                                                        */}
        {/* ========================================================================= */}
        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>
            © 2026 महसूल व वन विभाग, महाराष्ट्र शासन (Revenue & Forest Dept, Govt. of Maharashtra). All Rights Reserved.
          </p>
          <div className="flex items-center gap-3 text-[10px]">
            <span>STQC Certified Security</span>
            <span>•</span>
            <span>GIGW 3.0 Validated</span>
            <span>•</span>
            <span>Digital India Land Records Programme</span>
          </div>
        </div>
      </div>

      {/* Digital Document Application Modal */}
      {isApplyModalOpen && (
        <ApplyDigitalDocumentModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
        />
      )}
    </PortalLayout>
  );
}
