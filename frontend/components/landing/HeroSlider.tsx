'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ApplyDigitalDocumentModal } from '../portal/ApplyDigitalDocumentModal';

export const HeroSlider: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  return (
    <section
      id="hero"
      data-purpose="hero-banner"
      className="relative bg-sovereign-800 text-white py-12 md:py-16 px-4 sm:px-8 lg:px-12 border-b border-stone-700/60 overflow-hidden select-none"
    >
      {/* Ambient Glow Behind Hero */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        {/* Left Column: Sovereign Authority & Pitch */}
        <div className="lg:col-span-7 space-y-6">
          {/* Authority Badge */}
          <div className="inline-flex items-center space-x-2 bg-sovereign-850/90 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-medium text-emerald-300 backdrop-blur-xs shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Secure Land Records Repository</span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-300">100% Authenticated Cadastral Database</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight tracking-tight">
            Your Land Records Are <br className="hidden sm:inline" />
            <span className="text-white">Safe, Verified &amp; </span>
            <span className="text-gold-500 underline decoration-gold-500/50 decoration-2 underline-offset-8">
              Protected Here
            </span>
          </h1>

          {/* Subtitle / Narrative */}
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
            Powered by state-of-the-art <strong className="text-white font-semibold">AI Multilingual OCR</strong>, spatial cadastral parsing, and cryptographic audit security. Never lose a land title to physical degradation, forgery, or unauthorized record manipulation.
          </p>

          {/* Primary CTA Controls */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              href="/land-records"
              className="border border-stone-500 hover:border-white bg-sovereign-850/80 hover:bg-sovereign-700 text-stone-200 hover:text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
            >
              <span>Explore Land Records</span>
              <span>→</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsApplyModalOpen(true)}
              className="border border-stone-500 hover:border-white bg-sovereign-850/80 hover:bg-sovereign-700 text-stone-200 hover:text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded transition-all flex items-center space-x-2 cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4 text-gold-400" />
              <span>Apply for Digital Document</span>
            </button>
          </div>

          {/* Trust Badges Bar */}
          <div className="pt-4 border-t border-stone-700/60 flex flex-wrap items-center gap-6 text-xs text-stone-300">
            <div className="flex items-center space-x-1.5">
              <span className="text-emerald-400 font-bold">✓</span>
              <span>100% Legally Validated</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-gold-400">🔒</span>
              <span>256-Bit Cryptographic Seal</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-blue-300">🏛️</span>
              <span>36 Revenue Districts Active</span>
            </div>
          </div>
        </div>

        {/* Right Column: Bento Cadastral Protection Card */}
        <div className="lg:col-span-5" data-purpose="hero-security-card">
          <div className="bg-sovereign-850/90 border border-emerald-500/30 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md relative group">
            {/* Header */}
            <div className="p-4 border-b border-stone-700/60 flex items-center justify-between bg-sovereign-900/60">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-semibold text-emerald-300 uppercase tracking-wide">
                  DILRMP 3.0 Geospatial Cadastre
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold">
                GIS Engine Active
              </span>
            </div>

            {/* Visual with authentic Stitch asset */}
            <div className="relative overflow-hidden aspect-4/3">
              <Image
                src="/hero-cadastral-ai.jpg"
                alt="Digital Land Records Transformation showing historical parchment dissolving into vector cadastral maps"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                priority
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-900 via-stone-900/85 to-transparent p-4">
                <div className="inline-flex items-center space-x-1.5 bg-emerald-950/90 border border-emerald-500/40 px-2.5 py-1 rounded text-[11px] font-mono text-emerald-300 mb-1.5 backdrop-blur-xs">
                  <span className="text-gold-400">⚡</span>
                  <span>Modi &amp; Devanagari Paper Scans ➔ 14-Digit Bhu-Aadhaar Vector</span>
                </div>
                <p className="text-[11px] text-stone-300 leading-snug">
                  Real-time automated ingestion converting century-old revenue deeds into cryptographically verified cadastral vector polygons.
                </p>
              </div>
            </div>

            {/* Metrics */}
            <div className="p-3.5 bg-sovereign-900/80 border-t border-stone-700/60 grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-sovereign-800/80 p-2 rounded border border-emerald-500/20">
                <div className="text-[10px] text-stone-400 font-mono">PROVENANCE</div>
                <div className="font-bold text-white flex items-center space-x-1">
                  <span className="text-emerald-400">✓</span>
                  <span>Tamper-Evident</span>
                </div>
              </div>
              <div className="bg-sovereign-800/80 p-2 rounded border border-emerald-500/20">
                <div className="text-[10px] text-stone-400 font-mono">GEO-COORDINATES</div>
                <div className="font-mono font-bold text-gold-400">WGS-84 Centroid</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {isApplyModalOpen && (
        <ApplyDigitalDocumentModal
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
        />
      )}
    </section>
  );
};
