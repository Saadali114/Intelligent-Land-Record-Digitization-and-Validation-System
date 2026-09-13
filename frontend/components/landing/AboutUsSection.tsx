'use client';

import React from 'react';
import {
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  MapPin,
  Binary,
  Compass,
  FileCheck,
  QrCode,
  ScanLine,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AboutUsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-12 sm:py-16 bg-[#f7f8f4] border-b border-slate-200/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#b45309] uppercase tracking-wider">
              <span>📜 HISTORICAL HERITAGE NEURAL DIGITIZATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#0f2d1e] tracking-tight">
              Rescuing Historical Parchments with Cadastral AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Maharashtra holds over 230 million physical revenue folios dating back to Chhatrapati Shivaji Maharaj's Peshwa registers, Sher Shah Suri / British Cadastral Plane Table surveys. Our custom transformer-based vision engine bridges 300 years of land tenure into structured GIS databases.
            </p>
          </div>

          <div className="shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#14532d] font-bold text-xs border border-emerald-300 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              Modi-Set OCR v4.2 Live
            </span>
          </div>
        </div>

        {/* Side-by-side: Archaic Paper Challenge vs ILRDVS Neural OCR */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: The Archaic Paper Challenge */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  The Archaic Paper Challenge
                </h3>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-2xs">
                  DEGRADATION CRITICAL
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Original hand-inked Modi script folios (circa 1908), Baramoti Ferfars, insect-eaten weeping paper, fading iron-gall water-based ciphers, and fragmented untested bounding dimensions.
              </p>
            </div>

            {/* Antique Modi Parchment Graphic Simulation */}
            <div className="relative rounded-xl overflow-hidden border border-amber-300/80 bg-[#f4e8c1] p-4 shadow-inner min-h-[160px] flex flex-col justify-between font-serif">
              {/* Paper Aging & Stains */}
              <div className="absolute inset-0 bg-[radial-gradient(#8c6227_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-amber-800/10 rounded-full blur-xl pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-amber-900/10 rounded-full blur-xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between text-[11px] text-amber-950/70 border-b border-amber-900/20 pb-2">
                <span className="font-mono">दस्त क्र. ०४१२ / १९०८ (हवेली - पुणे)</span>
                <span className="italic text-[10px] bg-amber-900/15 px-2 py-0.5 rounded">मोडी लिपी हस्तलिखित</span>
              </div>

              {/* Modi Script Sample Glyphs / Archaic Rendering */}
              <div className="relative z-10 py-3 space-y-1 text-amber-950/85">
                <div className="text-base sm:text-lg tracking-wide font-medium leading-relaxed opacity-90 drop-shadow-xs">
                  𑘦𑘻𑘚𑘲 𑘩𑘲𑘢𑘲 𑘀𑘦𑘩𑘹 — 𑘐𑘨𑘿𑘝 𑘡𑘽. 𑘪𑘭𑘿𑘝𑘲𑘔𑘹 𑘫𑘹𑘝
                </div>
                <div className="text-xs sm:text-sm tracking-wide text-amber-900/80 leading-relaxed font-mono">
                  {`[खतावणी नं. ४८ - भोगवटादार: लक्ष्मण बापू कदम • आकार: दोन आणे सहा पै]`}
                </div>
                <div className="text-[10px] text-amber-800/70 italic">
                  * Insect perforation noted on bounding boundary dimensions (पूर्वेस रस्ता, पश्चिमेस ओढा)
                </div>
              </div>

              <div className="relative z-10 text-[9px] font-mono text-amber-900/60 border-t border-amber-900/20 pt-2 flex justify-between">
                <span>पुणे अभिलेखागार दप्तर • बस्तान क्र. १२</span>
                <span className="text-rose-800 font-bold">आर्द्रता हानी: ७८%</span>
              </div>
            </div>

            {/* Bottom 2 Stats */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="bg-[#f7f8f4] p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-medium block">Physical Paper Folios</span>
                <span className="font-black text-[#0f2d1e] text-sm">230+ Million</span>
              </div>
              <div className="bg-[#f7f8f4] p-2.5 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-500 font-medium block">Avg Age of Records</span>
                <span className="font-black text-[#0f2d1e] text-sm">75 to 140 Years</span>
              </div>
            </div>
          </div>

          {/* Right: ILRDVS Neural OCR & Entity Graph */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 sm:p-6 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  ILRDVS Neural OCR & Entity Graph
                </h3>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#14532d] text-white shadow-2xs">
                  98.4% OCR ACCURACY
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multimodal Vision Transformer parses historical abbreviations, maps Modi cursive glyphs into modern Marathi/Devanagari, and validates against modern standardized LandGML geometries.
              </p>
            </div>

            {/* Transcribed Structured Entity Card */}
            <div className="bg-[#f0fdf4] rounded-xl border border-emerald-300/80 p-3.5 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                <div className="font-bold text-xs text-[#14532d] flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                  मोडी हस्तलिखित उतारा (हवेली - पुणे) १९२२
                </div>
                <span className="px-2 py-0.5 rounded bg-white text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  Transcribed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white p-2 rounded-lg border border-emerald-100">
                  <span className="text-slate-500 text-[10px] block">जमिनीचे नाव / शेत नाव:</span>
                  <span className="font-bold text-slate-900">वस्तीचे शेत</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-emerald-100">
                  <span className="text-slate-500 text-[10px] block">गट नंबर / Hissa No.:</span>
                  <span className="font-bold text-slate-900">२४ (चार एकर)</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-emerald-100">
                  <span className="text-slate-500 text-[10px] block">धारक (Area Registered):</span>
                  <span className="font-bold text-slate-900">लक्ष्मण बापू कदम</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-emerald-100">
                  <span className="text-slate-500 text-[10px] block">आकारणी दर / Revenue (Tax):</span>
                  <span className="font-bold text-slate-900">दोन आणे सहा पै (Assessed)</span>
                </div>
              </div>

              {/* SHA-256 Hash Badge */}
              <div className="bg-white p-1.5 px-2 rounded-lg border border-emerald-200 flex items-center justify-between text-[10px] font-mono text-emerald-900 truncate">
                <span className="font-bold shrink-0 mr-2 text-[#14532d]">SHA-256 HASH:</span>
                <span className="truncate text-slate-600">c4e3b1c88ff12d91b7a2d8157e390c5874de388b8e0e6405232822a95e2f3f88</span>
              </div>
            </div>

            {/* Bottom 2 Stats */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="bg-[#f0fdf4] p-2.5 rounded-lg border border-emerald-200">
                <span className="text-[10px] text-[#166534] font-medium block">Character Recognition</span>
                <span className="font-black text-[#14532d] text-sm">98.4% Zero-Shot Acc</span>
              </div>
              <div className="bg-[#f0fdf4] p-2.5 rounded-lg border border-emerald-200">
                <span className="text-[10px] text-[#166534] font-medium block">Spatial Cadastral Alignment</span>
                <span className="font-black text-[#14532d] text-sm">±0.8 cm CORS Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stat Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5 hover:border-emerald-400 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-[#14532d] font-mono">8 Layers</div>
            <div className="text-xs font-bold text-slate-900">DILRMP 3.0 Unified Stack</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Synchronized vertical layers from plane-plane satellite imagery, RoR to ready reckoner rate valuation.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5 hover:border-emerald-400 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-[#14532d] font-mono">14 Digits</div>
            <div className="text-xs font-bold text-slate-900">Bhu-Aadhaar ULPIN Geo-Hash</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Unique land parcel identifier derived mathematically from centroid polygon latitude and longitude centroid.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5 hover:border-emerald-400 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-[#14532d] font-mono">100%</div>
            <div className="text-xs font-bold text-slate-900">Immutable Audit Trail</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Cryptographic chaining of every Talathi sign-off, sub-registrar deed, and mutation order without room to manipulate.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5 hover:border-emerald-400 transition-colors">
            <div className="text-2xl sm:text-3xl font-black text-[#14532d] font-mono">98.4%</div>
            <div className="text-xs font-bold text-slate-900">Modi Script OCR Precision</div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Trained on over 1.4 million historical archival revenue folios spanning 18th to 20th century orthographic records.
            </p>
          </div>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-emerald-400 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#14532d]">
              <ScanLine className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">OpenCV & Neural Denoise</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Eliminates water stains, mold decay, and bleed-through and font eroded handmade papers before deep neural tokenization.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-emerald-400 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#14532d]">
              <Compass className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Spatial NER Entity Parser</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automatically extracts boundary descriptions (पूर्वेस नदी, पश्चिमेस रस्ता), linking textual adjacencies to vector polygons.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-emerald-400 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#14532d]">
              <Cpu className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Revenue Officer Workstation</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Digital desk for Talathi, Circle Officer, and Tehsildar with side-by-side automated discrepancy flagging and digital stylus approvals.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 hover:border-emerald-400 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#14532d]">
              <QrCode className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Cryptographic Land Seals</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every issued 7/12, 8A, and Property Card embeds a tamper-proof dynamic QR code verified offline via Mahabhumi field scanner apps.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
