import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  FileCheck2,
  Bell,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
  Pause,
  Play,
  TrendingUp,
  MapPin,
  FileText,
} from 'lucide-react';

interface SlideData {
  id: number;
  tag: string;
  tagIcon: React.ReactNode;
  title: string;
  highlight: string;
  description: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
  badge: string;
  theme: string;
  customComponent?: React.ReactNode;
}

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides: SlideData[] = [
    {
      id: 0,
      tag: 'Secure Land Records Repository',
      tagIcon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      title: 'Your Land Records Are',
      highlight: 'Safe, Verified & Protected Here',
      description:
        'Powered by state-of-the-art AI Multilingual OCR, spatial cadastral parsing, and cryptographic audit security. Never lose a land title to physical degradation, forgery, or record manipulation.',
      primaryBtnText: 'Search Land Records',
      primaryBtnLink: '/land-records',
      secondaryBtnText: 'Verify Document Scan',
      secondaryBtnLink: '/documents',
      badge: '100% Authenticated Cadastral Database',
      theme: 'from-blue-950 via-slate-900 to-indigo-950',
    },
    {
      id: 1,
      tag: 'Land Related Services',
      tagIcon: <FileSpreadsheet className="w-4 h-4 text-amber-400" />,
      title: 'Instant Citizen Services for',
      highlight: '7/12 Satbara, Property Cards & Mutation',
      description:
        'Obtain certified digital extracts of Village Form 7/12, City Survey Property Cards, and Form 6 Mutation (Ferfar) records with official QR validation seals in under 60 seconds.',
      primaryBtnText: 'Explore All Services',
      primaryBtnLink: '#services',
      secondaryBtnText: 'Track Mutation Status',
      secondaryBtnLink: '/verification',
      badge: 'Citizen Friendly & Paperless Delivery',
      theme: 'from-slate-950 via-blue-950 to-slate-900',
    },
    {
      id: 2,
      tag: 'Official News & Gazette Notices',
      tagIcon: <Bell className="w-4 h-4 text-rose-400" />,
      title: 'Latest Gazette Updates &',
      highlight: 'Digital Land Modernization Directives',
      description:
        'Real-time notifications on the National Land Records Modernization Programme (NLRMP), GIS drone surveys across 36 districts, and expedited time-bound mutation clearances.',
      primaryBtnText: 'Read All Notices',
      primaryBtnLink: '#notices',
      secondaryBtnText: 'Citizen Guidelines',
      secondaryBtnLink: '#faq',
      badge: 'Revenue Department Gazetted Feed',
      theme: 'from-indigo-950 via-slate-900 to-blue-950',
    },
    {
      id: 3,
      tag: 'AI-Powered Spatial Verification',
      tagIcon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      title: 'Next-Gen Cadastral Engine with',
      highlight: 'Automated Fraud & Duplicate Detection',
      description:
        'Multi-stage neural pipeline detects duplicate parcel registrations, spelling discrepancies across handwritten Marathi/Hindi extracts, and protects rightful landowners.',
      primaryBtnText: 'Launch Verification Workstation',
      primaryBtnLink: '/verification',
      secondaryBtnText: 'Learn About Our AI',
      secondaryBtnLink: '#about',
      badge: 'EasyOCR & Named Entity Recognition',
      theme: 'from-blue-900 via-indigo-950 to-slate-950',
    },
  ];

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white select-none">
      {/* Dynamic Animated Background Gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${slide.theme} transition-all duration-1000 ease-in-out opacity-95`}
      />

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Top Live Ticker Ribbon */}
      <div className="relative z-20 bg-blue-950/80 border-b border-blue-800/40 px-4 py-2 text-xs flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-2 overflow-hidden">
          <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            LIVE GAZETTE
          </span>
          <p className="text-slate-300 text-[11px] truncate">
            Mahabhumi & DILRMP: Computerized Satbara extracts with automated cryptographic digital verification are now legally recognized across all Maharashtra Sub-Registrar offices.
          </p>
        </div>
      </div>

      {/* Main Slide Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[460px]">
          {/* Left Column: Heading, Tag, Description, CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-blue-200 backdrop-blur-sm shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500">
              {slide.tagIcon}
              <span>{slide.tag}</span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-400 font-bold">{slide.badge}</span>
            </div>

            {/* Slide Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight animate-in fade-in slide-in-from-bottom-3 duration-500">
              {slide.title}{' '}
              <span className="block mt-1 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 drop-shadow-sm">
                {slide.highlight}
              </span>
            </h1>

            {/* Slide Description */}
            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500">
              {slide.description}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
              <Link
                href={slide.primaryBtnLink}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:scale-102"
              >
                <span>{slide.primaryBtnText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={slide.secondaryBtnLink}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 hover:border-slate-500 transition-all backdrop-blur-sm"
              >
                <span>{slide.secondaryBtnText}</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-[11px] text-slate-400 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> 100% Legally Validated
              </span>
              <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                <Lock className="w-3.5 h-3.5" /> 256-Bit Cryptographic Seal
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Building2 className="w-3.5 h-3.5" /> 36 Revenue Districts Active
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Card Display per Slide */}
          <div className="lg:col-span-5">
            {currentSlide === 0 && (
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">Cadastral Record Protection</div>
                      <div className="text-[10px] text-emerald-400">Status: Active & Protected</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] border border-emerald-800">
                    HASH VERIFIED
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700 flex justify-between items-center">
                    <span className="text-slate-400">Village Form 7/12 (Satbara)</span>
                    <span className="text-emerald-400 font-bold">Secured & Digitized</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700 flex justify-between items-center">
                    <span className="text-slate-400">Form 6 Mutation Register (Ferfar)</span>
                    <span className="text-emerald-400 font-bold">Real-time Sync</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700 flex justify-between items-center">
                    <span className="text-slate-400">Urban Property Card (CTS)</span>
                    <span className="text-emerald-400 font-bold">Encumbrance Clear</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/50 text-[11px] text-blue-200">
                  <div className="font-semibold flex items-center gap-1.5 text-amber-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Your Peace of Mind Guarantee:
                  </div>
                  Physical revenue extracts are scanned and linked to national unique parcel IDs with complete ownership provenance.
                </div>
              </div>
            )}

            {currentSlide === 1 && (
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                    Popular Land Services
                  </div>
                  <span className="text-[10px] text-slate-400">Instant Citizen Portal</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <Link
                    href="/land-records"
                    className="p-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-900/60 text-blue-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                      7/12 Extract
                    </div>
                    <div className="text-[10px] text-slate-400">Search by Survey No.</div>
                  </Link>

                  <Link
                    href="#services"
                    className="p-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-900/60 text-purple-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                      Property Card
                    </div>
                    <div className="text-[10px] text-slate-400">Urban CTS Records</div>
                  </Link>

                  <Link
                    href="/verification"
                    className="p-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-900/60 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                      Verification
                    </div>
                    <div className="text-[10px] text-slate-400">Inspector Workstation</div>
                  </Link>

                  <Link
                    href="#services"
                    className="p-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-900/60 text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                      Mutation Status
                    </div>
                    <div className="text-[10px] text-slate-400">Form 6 Ferfar Tracking</div>
                  </Link>
                </div>

                <div className="text-center pt-2">
                  <Link
                    href="/land-records"
                    className="text-xs font-bold text-amber-400 hover:underline inline-flex items-center gap-1"
                  >
                    Launch Full Services Catalog <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {currentSlide === 2 && (
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-rose-400" />
                    Recent Gazette & Notices
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] font-bold border border-rose-800">
                    UPDATED TODAY
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-amber-400 font-bold font-mono">CIR-2026/DILRMP-88</span>
                      <span className="text-slate-400">March 2026</span>
                    </div>
                    <div className="font-semibold text-slate-200">
                      Mandatory Integration of AI OCR for Satbara digitization in Pune & Thane divisions.
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-emerald-400 font-bold font-mono">NOT-REV/104-B</span>
                      <span className="text-slate-400">February 2026</span>
                    </div>
                    <div className="font-semibold text-slate-200">
                      Standard Operating Procedure for Online Ferfar Mutation Application clearances.
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <Link
                    href="#notices"
                    className="text-xs font-bold text-amber-400 hover:underline inline-flex items-center gap-1"
                  >
                    View All Gazette Circulars <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {currentSlide === 3 && (
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    AI Engine Live Telemetry
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] border border-cyan-800">
                    98.4% ACCURACY
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-xl font-black text-emerald-400 font-mono">36 / 36</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                      Districts Covered
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-xl font-black text-amber-400 font-mono">44,280+</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                      Villages Digitized
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-xl font-black text-blue-400 font-mono">1.2M+</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                      Parcels Authenticated
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-xl font-black text-purple-400 font-mono">&lt; 3.2s</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                      AI OCR Inference SLA
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Devanagari, Hindi, Marathi & English Multilingual Support enabled.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Navigation Bar & Slide Indicators */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          {/* Slide Dots Indicator */}
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all ${
                  currentSlide === idx ? 'w-8 bg-amber-400' : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
            <span className="text-[11px] font-mono text-slate-400 ml-2">
              0{currentSlide + 1} / 0{slides.length}
            </span>
          </div>

          {/* Slider Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={prevSlide}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Previous slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Next slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
