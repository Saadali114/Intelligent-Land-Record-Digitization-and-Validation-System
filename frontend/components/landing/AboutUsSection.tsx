'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

export const AboutUsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section
      id="about"
      data-purpose="modernizing-historical-records"
      className="py-16 px-4 sm:px-8 max-w-7xl mx-auto bg-white select-none"
    >
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-1.5 bg-emerald-100/80 text-sovereign-800 font-mono text-xs px-3 py-1 rounded-full uppercase tracking-widest font-semibold mb-3 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>Digital Governance</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-stone-900 tracking-tight">
          Modernizing Historical Land Records with Cadastral AI
        </h2>
        <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
          ILRDVS is designed to bridge historical paper records (Modi script, archaic Marathi, and revenue formats) with modern digital land registries, ensuring every land parcel is securely geo-referenced and tamper-proof.
        </p>
      </div>

      {/* Modernization Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Narrative & Key Metrics */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <span className="w-8 h-8 rounded bg-gold-100 text-gold-600 flex items-center justify-center font-bold text-sm">
                📜
              </span>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                The Challenge of Archival Land Records
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              For decades, land records—including Records of Rights (RoR), mutation registers, and registered sale deeds—have been maintained on physical paper, making them vulnerable to yellowing, ink bleeding, tear damage, and manual transcription errors.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-3">
              These vulnerabilities can contribute to duplicate or conflicting land records, ownership disputes, lengthy civil litigation, and delays in land verification. ILRDVS addresses these challenges through an end-to-end AI-powered workflow for digitizing, validating, and verifying land records.
            </p>
          </div>

          {/* 4 Metric Highlights */}
          <div className="grid grid-cols-2 gap-4 pt-6 mt-6 border-t border-stone-200">
            <div className="bg-white p-3 rounded border border-stone-200 shadow-2xs">
              <div className="text-2xl font-bold font-serif text-sovereign-800">8 Layers</div>
              <div className="text-[11px] text-stone-500">DILRMP 3.0 Unified Stack</div>
            </div>
            <div className="bg-white p-3 rounded border border-stone-200 shadow-2xs">
              <div className="text-2xl font-bold font-serif text-gold-600">14 Digits</div>
              <div className="text-[11px] text-stone-500">Bhu-Aadhaar Spatial Anchor</div>
            </div>
            <div className="bg-white p-3 rounded border border-stone-200 shadow-2xs">
              <div className="text-2xl font-bold font-serif text-emerald-700">100%</div>
              <div className="text-[11px] text-stone-500">Audit Trail Provenance</div>
            </div>
            <div className="bg-white p-3 rounded border border-stone-200 shadow-2xs">
              <div className="text-2xl font-bold font-serif text-sovereign-800">98.4%</div>
              <div className="text-[11px] text-stone-500">OCR Extraction Accuracy</div>
            </div>
          </div>
        </div>

        {/* Right: 4 AI Technical Capabilities */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1 */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm mb-3">
              ⚙️
            </div>
            <h4 className="font-serif font-bold text-sm text-stone-900 mb-1">
              OpenCV &amp; EasyOCR
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Adaptive thresholding, deskewing, and multilingual neural recognition of cursive and handwritten Devanagari script for accurate extraction.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded bg-gold-50 text-gold-600 flex items-center justify-center font-bold text-sm mb-3">
              📐
            </div>
            <h4 className="font-serif font-bold text-sm text-stone-900 mb-1">
              Spatial NER Extraction
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Heuristic cadastral parsing isolates Survey No, Khasra, Khata, Plot Area, Owner Name, and Mutation references directly into structured datasets.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm mb-3">
              🖥️
            </div>
            <h4 className="font-serif font-bold text-sm text-stone-900 mb-1">
              Inspector Workstation
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Dual-pane scan/parse review interface enabling revenue officers to compare raw archival scans against AI predictions before sanctioning.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm mb-3">
              🔏
            </div>
            <h4 className="font-serif font-bold text-sm text-stone-900 mb-1">
              Tamper-Proof Certificates
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Automated generation of official bilingual certificates with digital watermarks, SHA-256 integrity signatures, and instant print capability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
