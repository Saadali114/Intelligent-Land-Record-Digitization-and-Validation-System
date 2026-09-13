'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  MapPin,
  FileText,
  FileCheck2,
  Compass,
  Building2,
  Landmark,
  Scale,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StackLayer {
  id: number;
  shortTag: string;
  name: string;
  nameMr: string;
  department: string;
  desc: string;
  statusText: string;
  activeBadge: string;
  details: Record<string, string>;
}

export const LandStackSection: React.FC = () => {
  const { t } = useTranslation();
  const [activeLayer, setActiveLayer] = useState<number>(1);

  const stackLayers: StackLayer[] = [
    {
      id: 1,
      shortTag: 'L1',
      name: 'Layer 1: Cadastral Vector Map',
      nameMr: '(भूकर नकाशा)',
      department: 'Survey of India • TILR',
      desc: 'Bhu-Naksha spatial vectors, GIS boundaries, traverse stations, ETS/GPS, drone-based ortho-rectified imagery.',
      statusText: 'ACTIVE LAYER',
      activeBadge: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40',
      details: {
        '14-Digit Bhu-Aadhaar': '13cg05e4mt7b0',
        'Survey Vector Cadastre': '1: 50,000 (Survey of India)',
        'Sheet / Hissa Reference': 'Sheet No. 14, Haveli 204',
        'Root Synchronization Layer': 'Layer 2 (RoR 7/12) in Read',
      },
    },
    {
      id: 2,
      shortTag: 'L2',
      name: 'Layer 2: RoR 7/12 & 8A Rights',
      nameMr: '(अधिकार अभिलेख)',
      department: 'Mahabhulekh',
      desc: 'Ownership shares, cultivator tenancy, tenure (भोगवटादार वर्ग), revenue assessment rates, and pot-kharaba uncultivated fractions.',
      statusText: 'RoR Synced',
      activeBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      details: {
        'Khata Account No.': 'KH-2024/09841',
        'Tenure Classification': 'Bhogwatdar Class-1 (Freehold)',
        'Primary Titleholder': 'Laxman Bapu Kadam & Co-holders',
        'Certified Area': '0.84 Hectares (8,400 sq.m)',
      },
    },
    {
      id: 3,
      shortTag: 'L3',
      name: 'Layer 3: Registration & Conveyance Deeds',
      nameMr: '(नोंद नोंदणी)',
      department: 'IGR / SRO',
      desc: 'Sale deeds, gift instruments, partition agreements, and encumbrance declarations filed with Sub-Registrar of Assurances.',
      statusText: 'e-Step Cleared',
      activeBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      details: {
        'SRO Document No.': 'HAV-2024-DEED-4410',
        'Registration Date': '14-Aug-2024 (Verified)',
        'IGR Hash Stamp': '0x8f7a93c411...',
        'Stamp Duty Status': 'PAID (e-GRAS 100% Reconciled)',
      },
    },
    {
      id: 4,
      shortTag: 'L4',
      name: 'Layer 4: Land Use Zoning & Master Plan',
      nameMr: '(विकास योजना)',
      department: 'Town Planning',
      desc: 'Regional plan classifications: Agricultural, Residential (R-Zone), Commercial, Industrial, Coastal Regulation Zones (CRZ).',
      statusText: 'Zone R-1',
      activeBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      details: {
        'Development Plan (DP)': 'Pune Metropolitan Regional Plan 2038',
        'Zoning Sanction': 'Semi-Urban / Agricultural Buffer (Clear)',
        'FSI / TDR Permissible': '1.10 Base FSI with TDR loading',
        'CRZ / Eco-sensitive': 'Clear / Zero Restriction',
      },
    },
    {
      id: 5,
      shortTag: 'L5',
      name: 'Layer 5: URBAN LANDS/CTS',
      nameMr: '(नगर भूमापन मिळकत पत्रिका)',
      department: 'City Survey',
      desc: 'City Survey Office (CTSO) property sheets for municipal corporations, gaothan areas, and vertical flat unit entitlements.',
      statusText: 'CTS Mapped',
      activeBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      details: {
        'CTS No. (City Survey)': 'CTS-1049/2A (Sanghavi)',
        'Urban Local Body': 'PCMC Municipal Limits',
        'Gaothan Status': 'Non-Gaothan (Surveyed Plot)',
        'Vertical Unit Title': 'Super-Structure Mapped',
      },
    },
    {
      id: 6,
      shortTag: 'L6',
      name: 'Layer 6: Banking Mortgages & Agricultural Credit',
      nameMr: '(बँक बोजा)',
      department: 'CERSAI / NABARD',
      desc: 'Instant auto-mutation of bank hypothecation liens, Kisan Credit Card charges, and cooperative society loans without paperwork.',
      statusText: 'Zero Lien',
      activeBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      details: {
        'CERSAI Registry ID': 'CER-2026-NIL-00812',
        'Charge State': 'NIL / Clear Free Title',
        'KCC Hypothecation': 'No Agricultural Dues Pending',
        'Automated Lien Check': 'Bank of Maharashtra API Verified',
      },
    },
    {
      id: 7,
      shortTag: 'L7',
      name: 'Layer 7: RCCMS Court Disputes & Injunctions',
      nameMr: '(दिवाणी दावा)',
      department: 'Revenue / HC Courts',
      desc: 'Real-time sync with Revenue Court Case Management System (RCCMS) and Bombay High Court to flag lis pendens warnings.',
      statusText: 'No Dispute',
      activeBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      details: {
        'RCCMS Status': 'Zero Pending Disputes / Litigations',
        'High Court Lis Pendens': 'NIL Injunction Recorded',
        'Tehsildar Appeal Window': 'Clearance Certificate Active',
        'Lokayukta Record': 'No Complaints Pending',
      },
    },
    {
      id: 8,
      shortTag: 'L8',
      name: 'Layer 8: Ready Reckoner & Stamp Duty Valuation',
      nameMr: '(बाजारमूल्य दर)',
      department: 'IGR Valuation',
      desc: 'Annual Statement of Rates (ASR), automated government guidance values, capital gains tax basis, and infrastructure acquisition compensation.',
      statusText: 'ASR 2026',
      activeBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      details: {
        'ASR Circle Rate': '₹ 4,200 per sq. meter',
        'Plot Certified Area': '8,400 sq. meters',
        'Government Valuation': '₹ 3,52,80,000 (Calculated)',
        'Mandatory Stamp Duty': '₹ 24,69,600 (Pre-computed)',
      },
    },
  ];

  const currentLayer = stackLayers.find((l) => l.id === activeLayer) || stackLayers[0];

  return (
    <section id="land-stack" className="py-12 sm:py-16 bg-[#f7f8f4] border-b border-slate-200/80 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#b45309] uppercase tracking-wider">
            <span>📐 DILRMP 3.0 GUIDELINES (2026-2031 ARCHITECTURE)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#0f2d1e] tracking-tight">
            The Unified 8-Layer Cadastral Land Stack
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            In Maharashtra's modernized land governance, a single parcel is not merely a piece of paper—it is an 8-dimensional synchronized stack where geospatial boundaries, legal rights, civil court suits, bank liens, and urban planning intersect seamlessly in real-time.
          </p>
        </div>

        {/* 2-Column Stacking Architecture Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left: 8 Interactive Stack Layer Selectors */}
          <div className="lg:col-span-6 space-y-2">
            {stackLayers.map((layer) => {
              const isActive = activeLayer === layer.id;
              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => setActiveLayer(layer.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 text-xs ${
                    isActive
                      ? 'bg-[#14532d] border-[#14532d] text-white shadow-md'
                      : 'bg-white border-slate-200/90 text-slate-700 hover:border-emerald-400 hover:bg-[#f3f6f1]'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] shrink-0 ${
                        isActive
                          ? 'bg-white/20 text-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {layer.shortTag}
                    </span>
                    <div className="min-w-0 space-y-0.5">
                      <div className="font-bold truncate flex items-center gap-1.5">
                        <span className={isActive ? 'text-white' : 'text-slate-900'}>
                          {layer.name}
                        </span>
                        <span className={`font-normal text-[11px] ${isActive ? 'text-emerald-200' : 'text-slate-500'}`}>
                          {layer.nameMr}
                        </span>
                      </div>
                      <p className={`text-[11px] leading-relaxed line-clamp-1 ${isActive ? 'text-emerald-100' : 'text-slate-500'}`}>
                        {layer.desc}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shrink-0 border ${
                      isActive
                        ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400/40'
                        : 'bg-emerald-50 text-[#14532d] border-emerald-200'
                    }`}
                  >
                    {layer.statusText}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Dynamic Inspector & Geospatial Polygon Visualizer */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-lg p-5 sm:p-6 space-y-4">
            {/* Inspector Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#166534] font-bold">
                  LAYER {currentLayer.id} INSPECTOR
                </span>
                <h3 className="font-bold text-sm text-slate-900">Geospatial Polygon Visualizer</h3>
              </div>
              <div className="text-right text-[10px] text-slate-500 font-mono">
                <div>EPSG: 7755 (Reckoner)</div>
                <div className="text-emerald-700 font-bold">Bhu-Naksha Schema v4</div>
              </div>
            </div>

            {/* Satellite / Polygon Overlay Map */}
            <div className="relative rounded-xl overflow-hidden border border-emerald-300 bg-[#2d3a29] h-56 shadow-inner">
              {/* Satellite / Vector Topographic Simulation */}
              <svg className="w-full h-full" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <linearGradient id="satGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2b3b24" />
                    <stop offset="50%" stopColor="#3c5033" />
                    <stop offset="100%" stopColor="#283822" />
                  </linearGradient>
                  <pattern id="fieldLines" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 40 M 0 0 L 40 40" fill="none" stroke="#48613e" strokeWidth="0.5" />
                  </pattern>
                </defs>

                <rect width="400" height="240" fill="url(#satGrad)" />
                <rect width="400" height="240" fill="url(#fieldLines)" opacity="0.6" />

                {/* Adjoining Plot Boundary Lines */}
                <polygon points="20,30 140,20 130,110 15,100" fill="#35492d" stroke="#5d7e50" strokeWidth="1.2" opacity="0.8" />
                <polygon points="280,35 390,40 380,130 270,120" fill="#35492d" stroke="#5d7e50" strokeWidth="1.2" opacity="0.8" />
                <polygon points="130,110 270,120 285,220 140,215" fill="#35492d" stroke="#5d7e50" strokeWidth="1.2" opacity="0.8" />

                {/* Main Verified Polygon - Gat 204 */}
                <polygon
                  points="140,20 280,35 270,120 130,110"
                  fill="#15803d"
                  fillOpacity="0.45"
                  stroke="#4ade80"
                  strokeWidth="2.5"
                  strokeDasharray="4,2"
                />

                {/* Center Centroid Indicator */}
                <circle cx="205" cy="71" r="14" fill="#14532d" stroke="#86efac" strokeWidth="1.5" />
                <text x="205" y="75" fontSize="10" fill="#ffffff" fontWeight="bold" textAnchor="middle">
                  204
                </text>
                <text x="205" y="93" fontSize="9" fill="#bbf7d0" fontWeight="bold" textAnchor="middle">
                  0.84 Hec
                </text>

                {/* Traverse Vertex Crosshairs */}
                <circle cx="140" cy="20" r="3" fill="#ffffff" />
                <circle cx="280" cy="35" r="3" fill="#ffffff" />
                <circle cx="270" cy="120" r="3" fill="#ffffff" />
                <circle cx="130" cy="110" r="3" fill="#ffffff" />
              </svg>

              {/* Top Floating Compass & CORS Tags */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono">
                Boundary Loop Closed: 18.52° N, 73.85° E
              </div>

              <div className="absolute bottom-2 right-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#14532d] text-emerald-200 text-[10px] font-bold border border-emerald-400/40 shadow-sm">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  100% POLYGON INTEGRITY
                </span>
              </div>
            </div>

            {/* Dynamic Metadata per selected layer */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(currentLayer.details).map(([key, val]) => (
                <div key={key} className="bg-[#f7f8f4] p-2.5 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-medium">{key}</span>
                  <span className="font-bold text-slate-800 text-[11px] truncate block">{val}</span>
                </div>
              ))}
            </div>

            {/* Bottom Sub-label & CTA */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <span className="text-[11px] text-slate-500 font-medium">
                Published by: <strong className="text-slate-800">{currentLayer.department}</strong>
              </span>

              <Link
                href="/land-records"
                className="inline-flex items-center gap-1.5 font-bold text-[#14532d] hover:text-[#166534] transition-colors"
              >
                <span>View Full 8-Layer Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
