'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface StackLayerItem {
  id: number;
  tag: string;
  name: string;
  dept: string;
  status: 'ACTIVE' | 'CLEARED';
  title: string;
  subTitle: string;
  description: string;
  ulpin: string;
  spatialRef: string;
  coordinates: string;
  gatNo: string;
  surveyDate: string;
  impact: string;
}

export const LandStackSection: React.FC = () => {
  const { t } = useTranslation();
  const [selectedLayerId, setSelectedLayerId] = useState<number>(1);

  const layers: StackLayerItem[] = [
    {
      id: 1,
      tag: 'L1',
      name: 'L1: Cadastral Vector Map',
      dept: 'Survey of India Demarcation',
      status: 'ACTIVE',
      title: 'Layer 1: Cadastral Parcel Map & Geospatial Vector Boundary',
      subTitle: 'Survey of India • State Settlement Commissioner & Land Records',
      description:
        'The physical baseline of the Land Stack. Provides geo-referenced polygon boundaries with exact centroid latitude/longitude, corner vertex pins, and survey demarcation lines.',
      ulpin: '81LVQLD9407JH0',
      spatialRef: 'WGS-84 (EPSG:4326)',
      coordinates: '18.5204° N, 73.8567° E',
      gatNo: 'Gat No. 104 / Plot 4B',
      surveyDate: 'SVAMITVA (Phase-IV Verified)',
      impact:
        'Eliminates boundary encroachment disputes with millimeter-accurate WGS-84 coordinates polygons derived from high-resolution drone imagery (ETS survey).',
    },
    {
      id: 2,
      tag: 'L2',
      name: 'L2: Record of Rights (RoR)',
      dept: 'Department of Land Records (Bhoomi • 7/12 & 8-A)',
      status: 'ACTIVE',
      title: 'Layer 2: Record of Rights (RoR 7/12 & 8-A)',
      subTitle: 'Revenue Department • Mahabhulekh Digital Repository',
      description:
        'Immutable ancestral titleholder entries, tenancy classifications (Bhogwatdar Class 1/2), joint occupant shares, and agricultural revenue assessments.',
      ulpin: '81LVQLD9407JH0',
      spatialRef: 'Khata Record: KH-2024/09841',
      coordinates: 'Bhogwatdar Class-1 (Freehold)',
      gatNo: 'Gat No. 104 / Plot 4B (Haveli, Pune)',
      surveyDate: 'Real-Time RoR Digital Sync',
      impact:
        'Prevents fraudulent inheritance transfers and unauthorized tenancy alteration by locking RoR changes to verified mutation orders.',
    },
    {
      id: 3,
      tag: 'L3',
      name: 'L3: Registration & Conveyance',
      dept: 'Inspector General of Registration & Stamps (IGR)',
      status: 'CLEARED',
      title: 'Layer 3: Registered Deed Instruments & Stamp Conveyances',
      subTitle: 'IGR Maharashtra • Sub-Registrar Offices (SRO)',
      description:
        'Real-time automated verification of registered sale deeds, conveyances, gift deeds, and partitions filed with Sub-Registrar offices.',
      ulpin: '81LVQLD9407JH0',
      spatialRef: 'Deed Reference: SRO-PUN-84192',
      coordinates: 'Registration Status: Complete',
      gatNo: 'Gat No. 104 / Plot 4B',
      surveyDate: 'IGR National Gateway Linked',
      impact:
        'Stops double-registration fraud by instantly freezing seller conveyance rights upon contract registration.',
    },
    {
      id: 4,
      tag: 'L4',
      name: 'L4: Land Use & Statutory Zoning',
      dept: 'Town & Country Planning Directorate',
      status: 'ACTIVE',
      title: 'Layer 4: Master Plan Land Use & NA Statutory Zoning',
      subTitle: 'Urban Development & Town Planning • PMRDA',
      description:
        'Spatial zoning demarcating agricultural green belts, residential R-zones, industrial corridors, and public utility reservations.',
      ulpin: '81LVQLD9407JH0',
      spatialRef: 'Zone: Residential R-1 Permissible',
      coordinates: 'FSI Baseline: 1.10 (Standard)',
      gatNo: 'Gat No. 104 / Plot 4B',
      surveyDate: 'PMRDA Master Plan 2026',
      impact:
        'Prevents illegal residential plotting on restricted agricultural zones or environmentally sensitive buffers.',
    },
    {
      id: 5,
      tag: 'L5',
      name: 'L5: ULB/Tax & Urban Property',
      dept: 'Urban Local Bodies (ULBs) • CTS GIS',
      status: 'ACTIVE',
      title: 'Layer 5: Urban Property Card & Municipal Tax Ledger',
      subTitle: 'City Survey Office (CTS) & Municipal Corporation',
      description:
        'Harmonizes rural revenue Gat numbers with urban City Survey Numbers (CTS) and municipal property tax assessment IDs.',
      ulpin: '81LVQLD9407JH0',
      spatialRef: 'CTS Number: CTS-8412-A',
      coordinates: 'Property Tax ID: PMC-WZ-0941',
      gatNo: 'Gaothan / Urban Limit Cadastre',
      surveyDate: 'City Survey GIS Demarcation',
      impact:
        'Bridges municipal building permits and revenue property registers, ensuring seamless rural-to-urban conversion provenance.',
    },
    {
      id: 6,
      tag: 'L6',
      name: 'L6: Bank Mortgage & Encumbrance',
      dept: 'Reserve Bank of India (RBI) Lien Registry',
      status: 'CLEARED',
      title: 'Layer 6: Banking Mortgages & CERSAI Financial Encumbrance',
      subTitle: 'RBI Unified Lending Interface (ULI) • CERSAI Central Registry',
      description:
        'Live financial ledger integration detecting active mortgages, pledge charges, and hypothecations across all scheduled financial institutions.',
      ulpin: '81LVQLD9407JH0',
      spatialRef: 'Lien Register: CERSAI Clean',
      coordinates: 'Active Charges: 0 (Unencumbered)',
      gatNo: 'Gat No. 104 / Plot 4B',
      surveyDate: 'Automated Daily Clearing Sync',
      impact:
        'Eliminates multi-bank loan fraud on the same parcel of land through instant automated mortgage charge registration.',
    },
    {
      id: 7,
      tag: 'L7',
      name: 'L7: Revenue Court Disputes (RCCMS)',
      dept: 'Court of Sub-Divisional Officer (SDO) & Tehsildar',
      status: 'CLEARED',
      title: 'Layer 7: Revenue Court Litigation & Stay Order Registry',
      subTitle: 'Revenue Court Case Management System (RCCMS)',
      description:
        'Live court ledger tracking pending appeals, interim injunctions, and status-quo orders in Sub-Divisional Officer and Collector revenue courts.',
      ulpin: '81LVQLD9407JH0',
      spatialRef: 'RCCMS Case Status: Nil Pending',
      coordinates: 'Injunction Restraints: None',
      gatNo: 'Gat No. 104 / Plot 4B',
      surveyDate: 'Daily Judicial Sync',
      impact:
        'Automatically halts land mutations and sales the instant a revenue court enters a stay order into the RCCMS ledger.',
    },
    {
      id: 8,
      tag: 'L8',
      name: 'L8: Circle Rate & Valuation',
      dept: 'Directorate of Valuation Ready Reckoner',
      status: 'ACTIVE',
      title: 'Layer 8: Ready Reckoner Valuation & Circle Rate Cadastre',
      subTitle: 'Town Planning & Valuation Department Maharashtra',
      description:
        'Algorithmic valuation based on geographic road-width, road frontage, zone usage, and statutory ready reckoner rates.',
      ulpin: '81LVQLD9407JH0',
      spatialRef: 'Ready Reckoner: 2026-27 Rate',
      coordinates: 'Standard Valuation: ₹18,400 / sq.m',
      gatNo: 'Gat No. 104 / Plot 4B',
      surveyDate: 'State Valuation Gazette Approved',
      impact:
        'Provides transparent, instant stamp duty calculation, preventing undervaluation in registered transactions.',
    },
  ];

  const activeLayer = layers.find((l) => l.id === selectedLayerId) || layers[0];

  return (
    <section
      id="stack"
      data-purpose="unified-8-layer-land-stack"
      className="py-16 border-y border-stone-200 bg-white select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1 bg-emerald-100 text-sovereign-800 font-mono text-[11px] px-3 py-1 rounded-full uppercase tracking-wider font-semibold mb-2 border border-emerald-200">
            <span>🛡️</span>
            <span>DILRMP 3.0 GUIDELINES (2026–2031)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            The Unified 8-Layer Land Stack
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-2">
            Eliminating historical government data silos by anchoring spatial boundaries, Record of Rights, registration deeds, urban property cards, bank liens, and court stay orders into a single deterministic 14-digit Bhu-Aadhaar (ULPIN).
          </p>
        </div>

        {/* 8-Layer Interactive View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Layer Selector Tabs */}
          <div className="lg:col-span-5 space-y-2">
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2 flex justify-between">
              <span>Select Multi-Registry Layer</span>
              <span className="font-mono">
                Layer {String(activeLayer.id).padStart(2, '0')} / 08
              </span>
            </div>

            {layers.map((layer) => {
              const isSelected = layer.id === selectedLayerId;
              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`w-full p-3 rounded-lg text-left flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-2 border-sovereign-800 shadow-sm'
                      : 'bg-white/70 hover:bg-white border border-stone-200 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-sovereign-800 text-white'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {layer.tag}
                    </span>
                    <div className="min-w-0">
                      <div
                        className={`text-xs truncate ${
                          isSelected
                            ? 'font-bold text-stone-900'
                            : 'font-semibold text-stone-800'
                        }`}
                      >
                        {layer.name}
                      </div>
                      <div className="text-[10px] text-stone-500 truncate">
                        {layer.dept}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold shrink-0 ${
                      layer.status === 'ACTIVE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {layer.status}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Layer Detail View */}
          <div
            data-purpose="active-layer-detail"
            className="lg:col-span-7 bg-white border border-stone-200 rounded-xl p-6 shadow-md"
          >
            {/* Header for Selected Layer */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg shrink-0">
                  📍
                </div>
                <div>
                  <div className="text-[10px] font-mono text-stone-500 uppercase">
                    DILRMP 3.0 Architectural Component
                  </div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                    {activeLayer.title}
                  </h3>
                  <div className="text-[11px] text-stone-500">
                    {activeLayer.subTitle}
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded font-bold shrink-0">
                ● {activeLayer.status}
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed mb-6">
              {activeLayer.description}
            </p>

            {/* Metadata Key-Value Box */}
            <div className="rounded-lg p-4 border border-stone-200 space-y-3 bg-white">
              <div className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center space-x-1.5">
                <span>🟧</span>
                <span>Simulated Real-Time Registry Attributes (Bhu-Aadhaar Linked):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded border border-stone-200">
                  <div className="text-[10px] text-stone-400 font-mono">BHU-AADHAAR (ULPIN)</div>
                  <div className="font-mono font-bold text-stone-800">{activeLayer.ulpin}</div>
                </div>
                <div className="bg-white p-2.5 rounded border border-stone-200">
                  <div className="text-[10px] text-stone-400 font-mono">SPATIAL REFERENCE</div>
                  <div className="font-mono font-bold text-stone-800">{activeLayer.spatialRef}</div>
                </div>
                <div className="bg-white p-2.5 rounded border border-stone-200">
                  <div className="text-[10px] text-stone-400 font-mono">CENTROID COORDINATES</div>
                  <div className="font-mono font-bold text-stone-800">{activeLayer.coordinates}</div>
                </div>
                <div className="bg-white p-2.5 rounded border border-stone-200">
                  <div className="text-[10px] text-stone-400 font-mono">SURVEY / GAT NO.</div>
                  <div className="font-mono font-bold text-stone-800">{activeLayer.gatNo}</div>
                </div>
              </div>
              <div className="bg-white p-2.5 rounded border border-stone-200">
                <div className="text-[10px] text-stone-400 font-mono">DRONE SURVEY DATE</div>
                <div className="font-bold text-stone-800">{activeLayer.surveyDate}</div>
              </div>
            </div>

            {/* Anti-fraud Benefit */}
            <div className="mt-4 p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-stone-700">
              <strong className="text-emerald-900 font-semibold">
                Primary Governance &amp; Anti-Fraud Impact:{' '}
              </strong>
              {activeLayer.impact}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
