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
  Building,
  Landmark,
  Scale,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Database,
  Lock,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LayerDef {
  id: number;
  layerKey: string;
  shortName: string;
  fullName: string;
  authority: string;
  status: 'ACTIVE' | 'FLAGGED' | 'CLEARED';
  icon: React.ReactNode;
  accentColor: string;
  badgeBg: string;
  governanceImpact: string;
  mockData: Record<string, string>;
  description: string;
}

export const LandStackSection: React.FC = () => {
  const { t } = useTranslation();
  const [selectedLayerIndex, setSelectedLayerIndex] = useState<number>(0);

  const layers: LayerDef[] = [
    {
      id: 1,
      layerKey: 'cadastral',
      shortName: 'L1: Cadastral Vector Map',
      fullName: 'Layer 1: Cadastral Parcel Map & Geospatial Vector Boundary',
      authority: 'Survey of India • State Settlement Commissioner & Land Records',
      status: 'ACTIVE',
      icon: <Compass className="w-5 h-5 text-cyan-400" />,
      accentColor: 'border-cyan-500 text-cyan-400',
      badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      governanceImpact:
        'Eliminates boundary encroachment disputes with millimeter-accurate WGS-84 coordinate polygons derived from high-resolution drone imagery (ETS survey).',
      description:
        'The physical baseline of the Land Stack. Provides geo-referenced polygon boundaries with exact centroid latitude/longitude, corner vertex pins, and survey demarcation lines.',
      mockData: {
        'Bhu-Aadhaar (ULPIN)': '81LVQLD9407JH0',
        'Spatial Reference': 'WGS-84 (EPSG:4326)',
        'Centroid Coordinates': '18.5204° N, 73.8567° E',
        'Survey / Gat No': 'Gat No. 104 / Plot 4B',
        'Drone Survey Date': 'SVAMITVA Phase-IV (Verified)',
      },
    },
    {
      id: 2,
      layerKey: 'ror',
      shortName: 'L2: Record of Rights (RoR)',
      fullName: 'Layer 2: Record of Rights (7/12 & 8A Extract / Jamabandi)',
      authority: 'Department of Land Resources (DoLR) • Maharashtra Mahabhulekh',
      status: 'ACTIVE',
      icon: <FileText className="w-5 h-5 text-blue-400" />,
      accentColor: 'border-blue-500 text-blue-400',
      badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      governanceImpact:
        'Guarantees indisputable ownership title with consent-based masked Aadhaar seeding (XXXX-XXXX-9124) enabling instantaneous SMS fraud alert notifications.',
      description:
        'The legal ownership baseline capturing titleholder identities, joint holdings, Khata ledger numbers, and statutory tenure classification (Occupant Class 1 Freehold).',
      mockData: {
        'Primary Titleholder': 'Kiran Dnyaneshwar Patil',
        'Tenure Classification': 'Bhogwatdar Class 1 (Freehold)',
        'Khata (Account) No': 'KH-2026/8941',
        'Masked Aadhaar Seed': 'XXXX-XXXX-9124 (Consent Logged)',
        'Total Certified Area': '0.84 Hectares (8,400 sq.m)',
      },
    },
    {
      id: 3,
      layerKey: 'registration',
      shortName: 'L3: Registration & Conveyance',
      fullName: 'Layer 3: Land Registration & Conveyance (NGDRS / e-Deeds)',
      authority: 'Inspector General of Registration & Stamps (IGR) • SRO Haveli',
      status: 'CLEARED',
      icon: <FileCheck2 className="w-5 h-5 text-emerald-400" />,
      accentColor: 'border-emerald-500 text-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      governanceImpact:
        'Instantaneous paperless conveyance through NGDRS direct integration; deed execution automatically triggers online Form 6 mutation pipelines without delay.',
      description:
        'Maintains complete statutory deed history (Sale, Partition, Gift, Lease), e-Challan stamp duty verifications, and digitized sub-registrar signatures.',
      mockData: {
        'Registered Deed Type': 'Registered Sale Deed (खरेदी खत)',
        'Deed Docket No': 'SRO-PUN/2026/10492',
        'e-Challan GRAS No': 'MH-GRAS-982104-B',
        'Stamp Duty Status': '100% Paid & Validated',
        'Automated Mutation': 'Form 6 Triggered (In-Progress)',
      },
    },
    {
      id: 4,
      layerKey: 'zoning',
      shortName: 'L4: Land Use & Statutory Zoning',
      fullName: 'Layer 4: Land Use & Master Plan Statutory Zoning',
      authority: 'Town & Country Planning Directorate • Urban Development Dept',
      status: 'ACTIVE',
      icon: <Building2 className="w-5 h-5 text-amber-400" />,
      accentColor: 'border-amber-500 text-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      governanceImpact:
        'Eliminates unauthorized colony construction and environmental encroachment by flagging Coastal Regulation Zones (CRZ) and forest demarcations.',
      description:
        'Defines statutory permissible land use, distinguishing Agricultural (Jirayat/Bagayat) from Non-Agricultural (NA), Residential (R-Zone), and Commercial belts.',
      mockData: {
        'Statutory Zone': 'Semi-Urban Residential (R-1)',
        'NA Permission Status': 'Sanctioned (Order NA-2025/441)',
        'CRZ / Eco-Buffer': 'Non-Eco-Sensitive / Clear',
        'Flood Plain Buffer': 'Outside 100-Year High Flood Line',
      },
    },
    {
      id: 5,
      layerKey: 'naksha',
      shortName: 'L5: NAKSHA Urban Property',
      fullName: 'Layer 5: NAKSHA Urban Property Register (UrPro & Abadi)',
      authority: 'Urban Local Bodies (ULBs) • Municipal Corporations • SVAMITVA',
      status: 'ACTIVE',
      icon: <Building className="w-5 h-5 text-purple-400" />,
      accentColor: 'border-purple-500 text-purple-400',
      badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      governanceImpact:
        'Extends legal property rights and collateral borrowing power to urban built-up apartments, commercial shops, and rural inhabited Abadi zones.',
      description:
        'Contains City Survey (CTS) / Property Card (Malmatta Patrak) numbers, drone-verified 3D building footprints, carpet area, and permissible Floor Space Index (FSI).',
      mockData: {
        'CTS Property Card': 'CTS No. 492 / Ward 12',
        'Building Footprint': '3D Drone Verified (ETS Vector)',
        'Permissible FSI / FAR': '2.20 FSI (Standard)',
        'Municipal Assessment': 'PT-PUN-2026-0811 (Up-to-Date)',
      },
    },
    {
      id: 6,
      layerKey: 'mortgage',
      shortName: 'L6: Bank Mortgage & Encumbrance',
      fullName: 'Layer 6: Bank Mortgage Registry (Unified Lending Interface - ULI)',
      authority: 'Reserve Bank of India (RBI) • Unified Lending Interface • Banks',
      status: 'CLEARED',
      icon: <Landmark className="w-5 h-5 text-indigo-400" />,
      accentColor: 'border-indigo-500 text-indigo-400',
      badgeBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30',
      governanceImpact:
        'Completely halts multi-bank mortgage fraud; institutional lien is registered on the digital parcel instantaneously via RBI ULI API.',
      description:
        'Real-time financial lien ledger recording agricultural hypothecations (KCC loans) and institutional mortgage charges against the parcel.',
      mockData: {
        'Active Bank Hypothecation': 'None (Title Unencumbered)',
        'ULI Real-Time Check': 'CLEARED (RBI Core Interface)',
        'Prior Lien Release': 'NOC Certified (SBI Agri-Branch)',
        'Instantaneous Loan Lock': 'Available via DoLR-ULI Gateway',
      },
    },
    {
      id: 7,
      layerKey: 'rccms',
      shortName: 'L7: Revenue Court Disputes (RCCMS)',
      fullName: 'Layer 7: Revenue Court Case Management System (RCCMS)',
      authority: 'Court of Sub-Divisional Officer (SDO) & Tehsildar • Mantralaya',
      status: 'CLEARED',
      icon: <Scale className="w-5 h-5 text-rose-400" />,
      accentColor: 'border-rose-500 text-rose-400',
      badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      governanceImpact:
        'Automatic mutation freezing when a court injunction or stay order is issued, stopping fraudulent distress sales during active litigation.',
      description:
        'Live litigation registry tracking partition suits, title disputes, and boundary demarcation appeals under Section 247 of the Land Revenue Code.',
      mockData: {
        'Active Injunction (Stay)': 'FALSE (No Restraining Order)',
        'RCCMS Pending Cases': '0 Active Revenue Disputes',
        'Litigation Risk Index': 'CLEARED / Low Title Risk',
        'Court Jurisdiction': 'Sub-Divisional Officer, Pune Sub-Div',
      },
    },
    {
      id: 8,
      layerKey: 'valuation',
      shortName: 'L8: Circle Rate & Valuation',
      fullName: 'Layer 8: Circle Rate Guidance & Algorithmic Statutory Valuation',
      authority: 'Directorate of Valuation • Annual Statement of Rates (Ready Reckoner)',
      status: 'ACTIVE',
      icon: <Calculator className="w-5 h-5 text-teal-400" />,
      accentColor: 'border-teal-500 text-teal-400',
      badgeBg: 'bg-teal-500/10 text-teal-300 border-teal-500/30',
      governanceImpact:
        'Eliminates arbitrary discretion and tax bribery through algorithmic circle rate calculations (Rate/sq.m × Plot Area = Guaranteed Fair Valuation).',
      description:
        'Automated valuation engine establishing fair market base values for accurate stamp duty payments, capital gains tax, and land acquisition compensation.',
      mockData: {
        'ASR Ready Reckoner Rate': '₹ 4,200 per sq. meter',
        'Plot Certified Area': '8,400 sq. meters',
        'Algorithmic Valuation': '₹ 3,52,80,000 (Calculated)',
        'Mandatory Stamp Duty (7%)': '₹ 24,69,600 (Pre-computed)',
      },
    },
  ];

  const current = layers[selectedLayerIndex];

  return (
    <section id="land-stack" className="py-20 bg-slate-950 text-white relative overflow-hidden border-b border-slate-800">
      {/* Background Decorative Geospatial Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 border border-blue-700/60 text-xs font-bold text-cyan-300 uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>DILRMP 3.0 Operational Guidelines (2026–2031)</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            The Unified{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-300">
              8-Layer Land Stack
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Eliminating historical government data silos by anchoring spatial boundaries, Record of Rights, registration deeds, urban property cards, bank liens, and court stay orders into a single deterministic 14-digit Bhu-Aadhaar (ULPIN).
          </p>
        </div>

        {/* Interactive 8-Layer Stacking Architecture Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Layer Vertical Selector */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 pb-1 flex items-center justify-between">
              <span>Select Multi-Registry Layer:</span>
              <span className="font-mono text-cyan-400">Layer 0{current.id} / 08</span>
            </div>

            <div className="space-y-2">
              {layers.map((layer, idx) => (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => setSelectedLayerIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 group ${
                    selectedLayerIndex === idx
                      ? 'bg-slate-800/95 border-amber-400 shadow-lg shadow-amber-500/10 scale-[1.01]'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 transition-colors ${
                        selectedLayerIndex === idx
                          ? 'bg-amber-400 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-400 group-hover:text-white'
                      }`}
                    >
                      {layer.id}
                    </div>
                    <div>
                      <div
                        className={`text-xs font-bold transition-colors ${
                          selectedLayerIndex === idx ? 'text-white' : 'text-slate-300 group-hover:text-white'
                        }`}
                      >
                        {layer.shortName}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[240px]">
                        {layer.authority.split('•')[0]}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-extrabold font-mono uppercase tracking-wider border shrink-0 ${layer.badgeBg}`}
                  >
                    {layer.status}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic Deep Dive Layer Inspector Card */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
            {/* Card Header with Icon, Authority & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  {current.icon}
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                    DILRMP 3.0 Architectural Component
                  </span>
                  <h3 className="text-lg font-black text-white mt-0.5">{current.fullName}</h3>
                  <p className="text-xs text-indigo-300 font-semibold mt-0.5">{current.authority}</p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase font-mono tracking-wider border self-start sm:self-auto ${current.badgeBg}`}
              >
                ● {current.status}
              </span>
            </div>

            {/* Layer Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{current.description}</p>

            {/* Live Operational Data Inspector */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>Simulated Real-Time Registry Attributes (Bhu-Aadhaar Linked):</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(current.mockData).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between"
                  >
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      {key}
                    </span>
                    <span className="text-xs font-bold text-amber-300 font-mono mt-1 truncate">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Governance & Fraud Prevention Impact Box */}
            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/60 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Primary Governance & Anti-Fraud Impact:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{current.governanceImpact}</p>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/land-records"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20"
              >
                <span>Search Live 8-Layer Parcel</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/verification"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
              >
                <span>Inspector Verification Workstation</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 14-Digit Bhu-Aadhaar (ULPIN) Integration Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/60 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-black text-amber-400">
              <Lock className="w-3.5 h-3.5" />
              <span>Unified 14-Digit Bhu-Aadhaar (ULPIN) Anchor</span>
            </div>
            <h4 className="text-lg font-bold text-white">
              Every Parcel Linked by a Deterministic Spatial PIN
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Derived from regional grid code, centroid latitude/longitude, and ETS cadastral polygon vertices. Cross-references Revenue, Survey, Registration, Banking, and Judiciary into one unified digital passport.
            </p>
          </div>

          <div className="shrink-0 flex flex-col items-center sm:items-end gap-2">
            <div className="px-4 py-2 rounded-xl bg-slate-950 border border-amber-400/40 text-amber-300 font-mono text-base font-black tracking-widest shadow-inner">
              81LVQLD9407JH0
            </div>
            <span className="text-[10px] text-slate-400">Example Bhu-Aadhaar ULPIN Format</span>
          </div>
        </div>
      </div>
    </section>
  );
};
