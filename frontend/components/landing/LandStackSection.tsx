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
  iconBg: string;
  badgeClass: string;
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
      icon: <Compass className="w-5 h-5 text-cyan-700" />,
      iconBg: 'bg-cyan-50 border-cyan-200',
      badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-200',
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
      icon: <FileText className="w-5 h-5 text-blue-700" />,
      iconBg: 'bg-blue-50 border-blue-200',
      badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
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
      icon: <FileCheck2 className="w-5 h-5 text-emerald-700" />,
      iconBg: 'bg-emerald-50 border-emerald-200',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
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
      icon: <Building2 className="w-5 h-5 text-amber-700" />,
      iconBg: 'bg-amber-50 border-amber-200',
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
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
      icon: <Building className="w-5 h-5 text-purple-700" />,
      iconBg: 'bg-purple-50 border-purple-200',
      badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
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
      icon: <Landmark className="w-5 h-5 text-indigo-700" />,
      iconBg: 'bg-indigo-50 border-indigo-200',
      badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
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
      icon: <Scale className="w-5 h-5 text-rose-700" />,
      iconBg: 'bg-rose-50 border-rose-200',
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
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
      icon: <Calculator className="w-5 h-5 text-teal-700" />,
      iconBg: 'bg-teal-50 border-teal-200',
      badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
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
    <section id="land-stack" className="py-12 sm:py-20 bg-slate-50 text-slate-900 relative overflow-hidden border-b border-slate-200">
      {/* Background Subtle Geospatial Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-8 sm:space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-[11px] sm:text-xs font-bold text-blue-900 uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate max-w-[260px] sm:max-w-none">DILRMP 3.0 Guidelines (2026–2031)</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900">
            The Unified{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950">
              8-Layer Land Stack
            </span>
          </h2>

          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            Eliminating historical government data silos by anchoring spatial boundaries, Record of Rights, registration deeds, urban property cards, bank liens, and court stay orders into a single deterministic 14-digit Bhu-Aadhaar (ULPIN).
          </p>
        </div>

        {/* Interactive 8-Layer Stacking Architecture Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Column: Interactive Layer Vertical Selector */}
          <div className="lg:col-span-5 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1 pb-1 flex items-center justify-between">
              <span>Select Multi-Registry Layer:</span>
              <span className="font-mono text-blue-900 font-bold">Layer 0{current.id} / 08</span>
            </div>

            <div className="space-y-2">
              {layers.map((layer, idx) => (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => setSelectedLayerIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 group ${
                    selectedLayerIndex === idx
                      ? 'bg-blue-50/90 border-blue-600 shadow-md shadow-blue-500/10 scale-[1.01]'
                      : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50/80 text-slate-700 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 transition-colors ${
                        selectedLayerIndex === idx
                          ? 'bg-blue-900 text-white font-black'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-900'
                      }`}
                    >
                      {layer.id}
                    </div>
                    <div>
                      <div
                        className={`text-xs font-bold transition-colors ${
                          selectedLayerIndex === idx ? 'text-blue-950' : 'text-slate-800 group-hover:text-blue-900'
                        }`}
                      >
                        {layer.shortName}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[130px] sm:max-w-[240px]">
                        {layer.authority.split('•')[0]}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-extrabold font-mono uppercase tracking-wider border shrink-0 whitespace-nowrap ${layer.badgeClass}`}
                  >
                    {layer.status}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic Deep Dive Layer Inspector Card */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xl space-y-5 sm:space-y-6">
            {/* Card Header with Icon, Authority & Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 sm:pb-5">
              <div className="flex items-start gap-3.5 min-w-0 flex-1">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center shrink-0 ${current.iconBg}`}>
                  {current.icon}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-blue-700 font-bold">
                    DILRMP 3.0 Architectural Component
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5 leading-snug">{current.fullName}</h3>
                  <p className="text-xs text-indigo-700 font-semibold mt-0.5">{current.authority}</p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase font-mono tracking-wider border whitespace-nowrap shrink-0 self-start sm:self-center ${current.badgeClass}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                <span>{current.status}</span>
              </span>
            </div>

            {/* Layer Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{current.description}</p>

            {/* Live Operational Data Inspector */}
            <div className="space-y-2">
              <div className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-700" />
                <span>Simulated Real-Time Registry Attributes (Bhu-Aadhaar Linked):</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                {Object.entries(current.mockData).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between"
                  >
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      {key}
                    </span>
                    <span className="text-xs font-bold text-blue-950 font-mono mt-1 truncate">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Governance & Fraud Prevention Impact Box */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Primary Governance & Anti-Fraud Impact:</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{current.governanceImpact}</p>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="/land-records"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition-all shadow-md shadow-blue-900/20 text-center"
              >
                <span>Search Live 8-Layer Parcel</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/verification"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-300 transition-all shadow-2xs text-center"
              >
                <span>Inspector Verification Workstation</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 14-Digit Bhu-Aadhaar (ULPIN) Integration Banner (Light Government Card) */}
        <div className="p-5 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50/60 to-white border border-blue-200/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-1.5 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-black text-blue-900 justify-center md:justify-start">
              <Lock className="w-3.5 h-3.5 text-blue-800" />
              <span>Unified 14-Digit Bhu-Aadhaar (ULPIN) Anchor</span>
            </div>
            <h4 className="text-base sm:text-xl font-black text-slate-900">
              Every Parcel Linked by a Deterministic Spatial PIN
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Derived from regional grid code, centroid latitude/longitude, and ETS cadastral polygon vertices. Cross-references Revenue, Survey, Registration, Banking, and Judiciary into one unified digital passport.
            </p>
          </div>

          <div className="w-full md:w-auto shrink-0 flex flex-col items-center md:items-end gap-2">
            <div className="w-full md:w-auto text-center px-4 sm:px-5 py-2.5 rounded-xl bg-white border-2 border-blue-900 text-blue-950 font-mono text-base sm:text-lg font-black tracking-widest shadow-sm">
              81LVQLD9407JH0
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Standard Bhu-Aadhaar ULPIN Format</span>
          </div>
        </div>
      </div>
    </section>
  );
};
