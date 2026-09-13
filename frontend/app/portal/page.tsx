'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  Sparkles,
  Search,
  Download,
  Eye,
  Building,
  History,
  Phone,
  Hourglass,
  Calendar,
  Compass,
  FileCheck,
  Layers,
  Satellite,
  Share2,
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
      <div className="flex flex-col gap-6 select-none">
        {/* ========================================================================= */}
        {/* TOP SOVEREIGN IDENTITY & BREADCRUMB BAR                                    */}
        {/* ========================================================================= */}
        <div className="w-full px-4 sm:px-6 py-2 bg-stone-100/70 border-b border-stone-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-stone-900 uppercase tracking-wider text-[11px]">
              <span className="text-emerald-800">🏛️</span>
              <span>Revenue &amp; Forest Dept • Govt. of Maharashtra</span>
            </div>
            <span className="text-stone-300">/</span>
            <div className="flex items-center gap-1 bg-white border border-stone-200 px-2 py-0.5 rounded shadow-2xs font-mono text-[10px] text-emerald-800 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>DIGITAL PARCHMENT SECURE ID: CIT-MH-PUN-9821</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-600">
            <div className="flex items-center gap-1">
              <span>Standard RTS SLA: <strong className="font-mono text-stone-900">14 Cal Days</strong></span>
            </div>
            <div className="h-3 w-[1px] bg-stone-300 hidden sm:block" />
            <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded border border-stone-200 font-mono text-[10px] text-emerald-800 font-bold">
              <span>LIVE STAMP SERVER: V3.42</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* HERO SOVEREIGN WELCOME BANNER                                             */}
        {/* ========================================================================= */}
        <div className="relative w-full rounded-2xl bg-sovereign-800 text-white p-6 sm:p-8 overflow-hidden shadow-md border border-emerald-950">
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#c1ecd4_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="absolute -right-12 -bottom-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col gap-2 max-w-3xl">
              <div className="flex items-center flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#14532d] font-bold text-[11px] shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Verified Citizen Account
                </span>
                <span className="text-emerald-300 font-mono text-[10px] font-semibold">
                  AADHAAR E-KYC SEEDED
                </span>
                <span className="text-emerald-600">•</span>
                <span className="text-emerald-300 font-mono text-[10px] font-semibold">
                  DIV: HAVELI (411028)
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
                Namaste, Saad Ali
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-emerald-200/90 text-xs pt-1">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-white font-medium">Khadakwasla, Taluka Haveli, Maharashtra</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Mobile: <strong className="font-mono text-white">+91 ••••• •4920</strong></span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Citizen UUID: <strong className="font-mono text-white">MH-HAV-CIT-7840</strong></span>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-stone-950 font-serif font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-stone-950" />
                <span>Apply for Digital Document</span>
              </button>

              <Link
                href="/citizen/documents/upload"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-colors shadow-2xs"
              >
                <UploadCloud className="w-4 h-4 text-emerald-300" />
                <span>Upload Deed / Scan</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STATUTORY ACTION NOTICE / ALERT CARD                                      */}
        {/* ========================================================================= */}
        <div className="w-full rounded-xl bg-amber-50/90 border border-amber-300/80 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start md:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center flex-wrap gap-2">
                <span className="font-serif font-bold text-stone-900 text-sm">
                  Action Required on Application ILRDVS-2026-000075
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-stone-950 uppercase tracking-wider">
                  ACTION REQUIRED
                </span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed max-w-3xl">
                A boundary/area variance of <strong className="font-mono text-amber-900 font-bold">0.04 Ha</strong> was flagged during GIS cross-verification on Parcel <strong className="font-mono text-stone-900 font-bold">45/1, Kothrud</strong>. Please submit a clarification to resume adjudication.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/verification"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs shadow-xs transition-all"
            >
              <span>Review &amp; Clarify</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4 INSTITUTIONAL KPI STAT CARDS                                            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Card 1: Total Applications */}
          <div className="rounded-xl bg-white border border-stone-200 p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-bold">Total Applications</span>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-serif font-bold text-stone-900 font-mono">5</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">100% REG</span>
            </div>
            <div className="text-[11px] text-stone-500">Across 7/12 Extracts, Mutation &amp; Deeds</div>
          </div>

          {/* Card 2: In Processing */}
          <div className="rounded-xl bg-white border border-stone-200 p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-bold">In Processing</span>
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Hourglass className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-serif font-bold text-stone-900 font-mono">3</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900">EST SLA ~4D</span>
            </div>
            <div className="text-[11px] text-stone-500">Cadastral AI &amp; Talathi circle review</div>
          </div>

          {/* Card 3: Verified & Digitized */}
          <div className="rounded-xl bg-white border border-stone-200 p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-stone-500 font-bold">Verified &amp; Digitized</span>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-serif font-bold text-[#14532d] font-mono">1</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#14532d] text-white">COMPLIANT</span>
            </div>
            <div className="text-[11px] text-stone-500">Certified digitally signed records</div>
          </div>

          {/* Card 4: Action Required */}
          <div className="rounded-xl bg-white border border-stone-200 p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-amber-800 font-bold">Action Required</span>
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-serif font-bold text-rose-700 font-mono">1</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-900">URGENT</span>
            </div>
            <div className="text-[11px] text-stone-500">Citizen clarification affidavit pending</div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TWO-COLUMN PRIMARY CADASTRAL WORKSPACE (7 Cols / 5 Cols)                  */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 Cols): Recent Land Record Applications */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h2 className="font-serif font-bold text-base text-stone-900">
                    Recent Land Record Applications
                  </h2>
                  <p className="text-xs text-stone-500">
                    Track status of your uploaded records and AI verification pipeline
                  </p>
                </div>
                <Link
                  href="/portal/applications"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:underline"
                >
                  <span>View All (5)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Application 1 */}
              <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200 hover:bg-stone-50 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-900 text-xs">
                      ILRDVS-2026-000129
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      PROCESSING
                    </span>
                    <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-mono text-[10px]">
                      UNDER OFFICER REVIEW
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">SLA: 6d left</span>
                </div>

                <div className="font-serif font-semibold text-sm text-stone-900">
                  7/12 Extract • Survey Number: <span className="font-mono text-emerald-900">142/3</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                  <span>Village: <strong className="text-stone-800">Khadakwasla</strong></span>
                  <span>•</span>
                  <span>Applied: <strong>05 Sept 2026</strong></span>
                  <span>•</span>
                  <span>Officer: <strong>Taluka Officer</strong></span>
                </div>
              </div>

              {/* Application 2 */}
              <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200 hover:bg-stone-50 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-900 text-xs">
                      ILRDVS-2026-000128
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      PROCESSING
                    </span>
                    <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-mono text-[10px]">
                      CADASTRAL VECTOR ALIGN
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">SLA: 6d left</span>
                </div>

                <div className="font-serif font-semibold text-sm text-stone-900">
                  7/12 Extract • Survey Number: <span className="font-mono text-emerald-900">142/3</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                  <span>Village: <strong className="text-stone-800">Khadakwasla</strong></span>
                  <span>•</span>
                  <span>Applied: <strong>05 Sept 2026</strong></span>
                  <span>•</span>
                  <span>Officer: <strong>Taluka Officer</strong></span>
                </div>
              </div>

              {/* Application 3 */}
              <div className="p-4 rounded-xl bg-stone-50/80 border border-stone-200 hover:bg-stone-50 transition-colors space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-emerald-900 text-xs">
                      ILRDVS-2026-000124
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                      UNDER REVIEW
                    </span>
                    <span className="px-2 py-0.5 rounded bg-stone-200 text-stone-700 font-mono text-[10px]">
                      FORM 6 FERFAR
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-800 font-mono font-bold">9d remaining</span>
                </div>

                <div className="font-serif font-semibold text-sm text-stone-900">
                  Mutation Notice (Form 6 Ferfar) • Partition Succession
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                  <span>Village: <strong className="text-stone-800">Khadakwasla</strong></span>
                  <span>•</span>
                  <span>Notice Issued: <strong>01 Sept 2026</strong></span>
                  <span>•</span>
                  <span>Mandatory Objection Period: <strong>15 Days</strong></span>
                </div>
              </div>
            </div>

            {/* Workflow Visual Banner (AI Verification Status) */}
            <div className="rounded-xl bg-emerald-950 text-white p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 border border-emerald-900">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm text-white">
                    AI Modi Lipi &amp; Archival Optical Scan Active
                  </h3>
                  <p className="text-xs text-emerald-200/80 mt-0.5">
                    1952 revenue ledger records scanned with 98.4% token parity against state central repository.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-900/90 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-700 shrink-0">
                NODAL GATEWAY VALIDATED
              </span>
            </div>
          </div>

          {/* Right Column (5 Cols): My Verified Land Parcels & Cadastre */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-800" />
                  <h2 className="font-serif font-bold text-base text-stone-900">
                    My Verified Land Parcels
                  </h2>
                </div>
                <Link href="/land-records" className="text-xs font-semibold text-emerald-800 hover:underline">
                  View All
                </Link>
              </div>

              {/* Parcel 1 */}
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-sm">
                      Survey Number 87/3
                    </h3>
                    <p className="text-xs text-stone-500">Wadgaon Budruk, Taluka Haveli</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#14532d] text-white font-mono text-[9px] font-bold">
                    VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-1 border-y border-emerald-100">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-stone-400 block">LAND AREA</span>
                    <strong className="font-mono text-stone-900 text-sm">1.10 Hectare</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-stone-400 block">ULPIN REF CODE</span>
                    <strong className="font-mono text-stone-800 text-xs">27-25-045-81LVQLD</strong>
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <Link
                    href="/land-records"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#14532d] hover:bg-[#166534] text-white font-semibold text-xs transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Digitized 7/12</span>
                  </Link>
                  <Link
                    href="/land-records"
                    className="p-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-2xs"
                    title="View on Bhu-Naksha GIS"
                  >
                    <Satellite className="w-4 h-4 text-emerald-800" />
                  </Link>
                </div>
              </div>

              {/* Parcel 2 */}
              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-stone-900 text-sm">
                      Survey Number 124/2
                    </h3>
                    <p className="text-xs text-stone-500">Khadakwasla, Taluka Haveli</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500 text-stone-950 font-mono text-[9px] font-bold">
                    UNDER REVIEW
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-1 border-y border-amber-100">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-stone-400 block">LAND AREA</span>
                    <strong className="font-mono text-stone-900 text-sm">2.35 Hectare</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-stone-400 block">ULPIN REF CODE</span>
                    <strong className="font-mono text-stone-800 text-xs">27-25-045-92MKRTD</strong>
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <Link
                    href="/land-records"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-xs transition-colors shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Draft Record</span>
                  </Link>
                  <Link
                    href="/land-records"
                    className="p-2 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 transition-colors shadow-2xs"
                    title="View Cadastral Coordinates"
                  >
                    <Compass className="w-4 h-4 text-amber-800" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Official Citizen Portals */}
            <div className="rounded-xl bg-white border border-stone-200 p-5 shadow-xs space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
                Official Citizen Portals
              </span>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://aaplesarkar.mahaonline.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-stone-50 border border-stone-200 hover:bg-stone-100 flex flex-col gap-1 transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Aaple Sarkar</span>
                  </div>
                  <span className="text-[10px] text-stone-500">State G2C Services Portal</span>
                </a>

                <a
                  href="https://igrmaharashtra.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg bg-stone-50 border border-stone-200 hover:bg-stone-100 flex flex-col gap-1 transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs">
                    <Building className="w-4 h-4" />
                    <span>IGR Maharashtra</span>
                  </div>
                  <span className="text-[10px] text-stone-500">Deed e-Registration Search</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SOVEREIGN FOOTER PROVENANCE STAMP                                         */}
        {/* ========================================================================= */}
        <div className="w-full pt-4 pb-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-stone-500 text-[11px]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span className="font-mono text-[10px]">
              ILRDVS CORE REVENUE CLUSTER • DLRS PUNE NODAL HEAD • DATA SUBJECT TO CERTIFIED SURVEY UNDER MLR CODE 1966
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <Link href="/documents" className="hover:text-emerald-800 transition-colors">Citizen Charter</Link>
            <span>•</span>
            <Link href="/documents" className="hover:text-emerald-800 transition-colors">RTS Act Compliance</Link>
            <span>•</span>
            <Link href="#contact" className="hover:text-emerald-800 transition-colors">Digital Helpdesk 1800-REV-GOV</Link>
          </div>
        </div>
      </div>

      {isApplyModalOpen && (
        <ApplyDigitalDocumentModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
        />
      )}
    </PortalLayout>
  );
}
