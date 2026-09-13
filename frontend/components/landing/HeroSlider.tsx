'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Search,
  UploadCloud,
  CheckCircle2,
  FileCheck2,
  Layers,
  FileText,
  Download,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const HeroSlider: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [selectedDistrict, setSelectedDistrict] = useState('Pune (पुणे)');
  const [selectedTaluka, setSelectedTaluka] = useState('Haveli (हवेली)');
  const [surveyNumber, setSurveyNumber] = useState('204');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/land-records?survey=${encodeURIComponent(surveyNumber)}&district=pune`);
  };

  const handleDownloadSanad = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      window.open('/sample-712-extract.png', '_blank');
    }, 600);
  };

  return (
    <section className="relative overflow-hidden bg-[#f7f8f4] text-slate-900 select-none border-b border-slate-200/80">
      {/* Background Subtle Geospatial Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#15803d_0.8px,transparent_0.8px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Main Title, Description, Tags, Search Card, Trust Badges      */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-5">
            {/* Top Vault / ULPIN Status Tag */}
            <div className="inline-flex flex-wrap items-center gap-2 p-1 pr-2.5 rounded-full bg-white/90 border border-emerald-200 shadow-2xs text-[11px] font-medium text-slate-700">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] font-semibold border border-[#fde68a]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#b45309]" />
                State-Grade Secure Cadastral Vault • Bhu-Aadhaar (ULPIN) Integrated
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#14532d] font-bold text-[10px] border border-[#86efac]">
                DILRMP 3.0 Validated
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-serif font-black tracking-tight leading-[1.18] text-[#0f2d1e]">
              Every Land Parcel Safeguarded, Verified & Digitally Sealed on Soil
            </h1>

            {/* Description Paragraph */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
              Pioneering state-grade artificial intelligence for archaic revenue records. ILRDVS decodes century-old Modi script parchments, reconciles cadastral village maps with centimeter-accurate satellite vector polygons, and locks ownership provenance into immutable digital state vaults under DILRMP 3.0 guidelines.
            </p>

            {/* 3 Pill Feature Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-emerald-200/80 text-[#14532d] font-semibold shadow-2xs text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                3-Layer Deed OCR
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-emerald-200/80 text-[#14532d] font-semibold shadow-2xs text-[11px]">
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                Modi & Romanized Neural OCR
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-emerald-200/80 text-[#14532d] font-semibold shadow-2xs text-[11px]">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                Geometric Mutation Ledger
              </span>
            </div>

            {/* Direct Cadastral Search Card */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-3.5">
              <form onSubmit={handleSearch} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* District Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      जिल्हा / DISTRICT
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs"
                    >
                      <option value="Pune (पुणे)">Pune (पुणे)</option>
                      <option value="Mumbai (मुंबई)">Mumbai (मुंबई)</option>
                      <option value="Nagpur (नागपूर)">Nagpur (नागपूर)</option>
                      <option value="Nashik (नाशिक)">Nashik (नाशिक)</option>
                      <option value="Thane (ठाणे)">Thane (ठाणे)</option>
                      <option value="Chhatrapati Sambhajinagar">Chh. Sambhajinagar</option>
                      <option value="Kolhapur (कोल्हापूर)">Kolhapur (कोल्हापूर)</option>
                    </select>
                  </div>

                  {/* Taluka Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      तालुका / TALUKA
                    </label>
                    <select
                      value={selectedTaluka}
                      onChange={(e) => setSelectedTaluka(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-medium focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs"
                    >
                      <option value="Haveli (हवेली)">Haveli (हवेली)</option>
                      <option value="Pune City (पुणे शहर)">Pune City (पुणे शहर)</option>
                      <option value="Baramati (बारामती)">Baramati (बारामती)</option>
                      <option value="Shirur (शिरूर)">Shirur (शिरूर)</option>
                      <option value="Maval (मावळ)">Maval (मावळ)</option>
                    </select>
                  </div>

                  {/* Survey / Gat No */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      गट नंबर किंवा सर्व्हे / SURVEY NO.
                    </label>
                    <input
                      type="text"
                      value={surveyNumber}
                      onChange={(e) => setSurveyNumber(e.target.value)}
                      placeholder="उदा. 204 किंवा 104/A"
                      className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 font-bold focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-xs"
                    />
                  </div>
                </div>

                {/* 2 Buttons Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#14532d] hover:bg-[#166534] text-white font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>भू-नकाशा / Land Extracts (7/12 शोधा)</span>
                  </button>

                  <Link
                    href="/portal/upload"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-300 hover:border-emerald-600 transition-all text-center shadow-2xs"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Upload Parchment/Deed for AI Scan</span>
                  </Link>
                </div>
              </form>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] text-slate-600 font-medium">
              <span className="inline-flex items-center gap-1.5 text-[#14532d]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                100% Legally Validated Recorded Rights
              </span>
              <span className="inline-flex items-center gap-1.5 text-[#14532d]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                SHA-256 Revenue Seal Integrity
              </span>
              <span className="inline-flex items-center gap-1.5 text-[#14532d]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Survey Computation Verified
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Cadastral Record Protection Vault Card                      */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">
              {/* Header Banner in Deep Emerald Green */}
              <div className="bg-[#14532d] text-white px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-emerald-300">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight leading-snug">
                      Cadastral Record Protection Vault
                    </h3>
                    <p className="text-[10px] text-emerald-200">
                      State Cadastral Title Register: Act 1966
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 font-bold text-[10px] border border-emerald-500/60 uppercase tracking-wide">
                  VERIFIED
                </span>
              </div>

              {/* Interactive Vector Map Snippet */}
              <div className="relative bg-[#ecf3e7] border-b border-slate-200 p-3">
                <div className="relative h-44 rounded-xl overflow-hidden border border-emerald-300/80 bg-[#f4f8f1]">
                  {/* SVG Cadastral Map Representation */}
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 400 200"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <defs>
                      <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#d5e3cd" strokeWidth="0.8" />
                      </pattern>
                    </defs>
                    <rect width="400" height="200" fill="url(#cadGrid)" />

                    {/* Surrounding Plots */}
                    <polygon
                      points="10,20 120,15 110,95 20,85"
                      fill="#e9f2e3"
                      stroke="#9cb58e"
                      strokeWidth="1"
                    />
                    <text x="45" y="55" fontSize="10" fill="#607d50" fontWeight="bold">
                      GAT NO. 203
                    </text>

                    <polygon
                      points="120,15 280,30 250,90 110,95"
                      fill="#dcfce7"
                      fillOpacity="0.85"
                      stroke="#15803d"
                      strokeWidth="2.5"
                      strokeDasharray="4,2"
                    />
                    <circle cx="195" cy="60" r="14" fill="#14532d" />
                    <text x="195" y="64" fontSize="10" fill="#ffffff" fontWeight="bold" textAnchor="middle">
                      204
                    </text>
                    <text x="195" y="80" fontSize="9" fill="#14532d" fontWeight="bold" textAnchor="middle">
                      0.84 Hec
                    </text>

                    <polygon
                      points="280,30 390,25 380,110 250,90"
                      fill="#e9f2e3"
                      stroke="#9cb58e"
                      strokeWidth="1"
                    />
                    <text x="300" y="65" fontSize="10" fill="#607d50" fontWeight="bold">
                      GAT NO. 205
                    </text>

                    {/* Lower adjacent plots */}
                    <polygon
                      points="20,85 110,95 125,185 15,175"
                      fill="#f0f5eb"
                      stroke="#9cb58e"
                      strokeWidth="1"
                    />
                    <polygon
                      points="110,95 250,90 270,185 125,185"
                      fill="#e9f2e3"
                      stroke="#9cb58e"
                      strokeWidth="1"
                    />
                    <text x="180" y="140" fontSize="10" fill="#607d50" fontWeight="bold">
                      GAT NO. 208
                    </text>

                    {/* Cadastral Pin & Marker Crosshairs */}
                    <line x1="120" y1="15" x2="280" y2="30" stroke="#15803d" strokeWidth="2" />
                    <circle cx="120" cy="15" r="3.5" fill="#14532d" />
                    <circle cx="280" cy="30" r="3.5" fill="#14532d" />
                    <circle cx="250" cy="90" r="3.5" fill="#14532d" />
                    <circle cx="110" cy="95" r="3.5" fill="#14532d" />
                  </svg>

                  {/* Top floating badges inside map */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-white/90 border border-slate-200 text-[9px] font-mono text-slate-700 shadow-2xs">
                    CORS Ref: 18.5204° N, 73.8567° E
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-100/90 border border-emerald-300 text-[9px] font-bold text-[#14532d] shadow-2xs">
                    CORS / Survey of India
                  </div>

                  {/* Bottom survey reference */}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[9px] font-mono">
                    Gat 204 • Hissa 4B [Centroid Lat: 18.5204, Long: 73.8567]
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-white/90 text-slate-800 text-[9px] font-bold">
                    Area: 0.84 Hec
                  </div>
                </div>
              </div>

              {/* Key Details Table / Grid */}
              <div className="p-4 sm:p-5 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 font-medium">Survey & Hissa:</span>
                    <div className="font-bold text-slate-800">Gat No: 204 • Hissa: 4B (0.84 Hec)</div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Master ULPIN ID:</span>
                    <div className="font-bold text-slate-800 font-mono">MH-Hav-Hav-Hav-91288</div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-500 font-medium">Jurisdiction:</span>
                    <div className="font-bold text-slate-800">Sanghavi, Haveli, Dist: Pune 411027</div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-2.5 space-y-1.5">
                  {/* Verification Status Items */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                      Village Form 7/12 (Satbara)
                    </span>
                    <span className="font-bold text-[#14532d] flex items-center gap-1">
                      VERIFIED & SEALED ✓
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      Ferfar / Mutation Register (Ferfar)
                    </span>
                    <span className="font-bold text-[#14532d]">
                      Last Ferfar: 2024/7841 ✓
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      CERSAI Encumbrance Registry
                    </span>
                    <span className="font-bold text-[#14532d]">
                      ZERO LIEN / NIL ✓
                    </span>
                  </div>
                </div>

                {/* State Title Guarantee Provenance Note */}
                <div className="p-3 rounded-lg bg-[#fffbeb] border border-[#fde68a] text-[10px] text-[#92400e] leading-relaxed">
                  <span className="font-bold block mb-0.5 text-[#78350f]">
                    State Title Guarantee Provenance: Maharashtra Land Revenue Code 1966.
                  </span>
                  Certified extract carries digital state-stamp valid for all legal, banking and registry purposes.
                </div>

                {/* Download e-Sanad Button */}
                <button
                  type="button"
                  onClick={handleDownloadSanad}
                  disabled={isDownloading}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-75"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isDownloading ? 'Generating Sealed e-Sanad...' : 'Download Digitally Signed e-Sanad (DS-Validated)'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
