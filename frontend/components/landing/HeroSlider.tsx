import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  FileCheck2,
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
  Layers,
  Database,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const slides: SlideData[] = [
    {
      id: 0,
      tag: t('home.slider.slide0Tag'),
      tagIcon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      title: t('home.slider.slide0Title'),
      highlight: t('home.slider.slide0Highlight'),
      description: t('home.slider.slide0Desc'),
      primaryBtnText: t('home.ctaExplore', 'Search Land Records'),
      primaryBtnLink: '/land-records',
      secondaryBtnText: t('home.ctaUpload', 'Upload Land Record'),
      secondaryBtnLink: '/portal/upload',
      badge: t('home.slider.slide0Badge'),
      theme: 'from-blue-950 via-slate-900 to-indigo-950',
    },
    {
      id: 1,
      tag: t('home.slider.slide1Tag'),
      tagIcon: <FileSpreadsheet className="w-4 h-4 text-amber-400" />,
      title: t('home.slider.slide1Title'),
      highlight: t('home.slider.slide1Highlight'),
      description: t('home.slider.slide1Desc'),
      primaryBtnText: t('home.slider.slide1PrimaryBtn'),
      primaryBtnLink: '#services',
      secondaryBtnText: t('home.slider.slide1SecondaryBtn'),
      secondaryBtnLink: '/verification',
      badge: t('home.slider.slide1Badge'),
      theme: 'from-slate-950 via-blue-950 to-slate-900',
    },
    {
      id: 2,
      tag: 'DILRMP 3.0 Operational Guidelines (2026-2031)',
      tagIcon: <Layers className="w-4 h-4 text-cyan-400" />,
      title: 'Unified Multi-Registry',
      highlight: '8-Layer Land Stack & ULPIN',
      description: 'Connecting Survey boundaries, Record of Rights, NGDRS deeds, town zoning, urban property cards, bank liens, and RCCMS court disputes to a deterministic 14-digit Bhu-Aadhaar.',
      primaryBtnText: 'Explore 8-Layer Land Stack',
      primaryBtnLink: '#land-stack',
      secondaryBtnText: 'Search Parcel Registry',
      secondaryBtnLink: '/land-records',
      badge: '14-Digit Bhu-Aadhaar (ULPIN)',
      theme: 'from-slate-950 via-blue-950 to-indigo-950',
    },
    {
      id: 3,
      tag: t('home.slider.slide3Tag'),
      tagIcon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      title: t('home.slider.slide3Title'),
      highlight: t('home.slider.slide3Highlight'),
      description: t('home.slider.slide3Desc'),
      primaryBtnText: t('home.slider.slide3PrimaryBtn'),
      primaryBtnLink: '/verification',
      secondaryBtnText: t('home.slider.slide3SecondaryBtn'),
      secondaryBtnLink: '#about',
      badge: t('home.slider.slide3Badge'),
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

      {/* Main Slide Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[420px] sm:min-h-[460px]">
          {/* Left Column: Heading, Tag, Description, CTAs */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Tag Pill */}
            <div className="inline-flex flex-wrap items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] sm:text-xs font-semibold text-blue-200 backdrop-blur-sm shadow-md animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-full">
              {slide.tagIcon}
              <span className="truncate max-w-[200px] sm:max-w-none">{slide.tag}</span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-amber-400 font-bold">{slide.badge}</span>
            </div>

            {/* Slide Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight animate-in fade-in slide-in-from-bottom-3 duration-500">
              {slide.title}{' '}
              <span className="block mt-1 bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 drop-shadow-sm">
                {slide.highlight}
              </span>
            </h1>

            {/* Slide Description */}
            <p className="text-xs sm:text-sm lg:text-base text-slate-300 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-500">
              {slide.description}
            </p>

            {/* Action Buttons (Full-width on mobile, inline on tablet+) */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
              <Link
                href={slide.primaryBtnLink}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all text-center"
              >
                <span>{slide.primaryBtnText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={slide.secondaryBtnLink}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 hover:border-slate-500 transition-all backdrop-blur-sm text-center"
              >
                <span>{slide.secondaryBtnText}</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-slate-400 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> {t('home.slider.trust1')}
              </span>
              <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                <Lock className="w-3.5 h-3.5" /> {t('home.slider.trust2')}
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Building2 className="w-3.5 h-3.5" /> {t('home.slider.trust3')}
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
                      <div className="font-bold text-xs text-white">{t('home.slider.slide0CardTitle')}</div>
                      <div className="text-[10px] text-emerald-400">{t('home.slider.slide0CardStatus')}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] border border-emerald-800">
                    {t('home.slider.slide0HashVerified')}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700 flex justify-between items-center">
                    <span className="text-slate-400">{t('home.slider.slide0Item1Label')}</span>
                    <span className="text-emerald-400 font-bold">{t('home.slider.slide0Item1Value')}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700 flex justify-between items-center">
                    <span className="text-slate-400">{t('home.slider.slide0Item2Label')}</span>
                    <span className="text-emerald-400 font-bold">{t('home.slider.slide0Item2Value')}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700 flex justify-between items-center">
                    <span className="text-slate-400">{t('home.slider.slide0Item3Label')}</span>
                    <span className="text-emerald-400 font-bold">{t('home.slider.slide0Item3Value')}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/50 text-[11px] text-blue-200">
                  <div className="font-semibold flex items-center gap-1.5 text-amber-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {t('home.slider.slide0GuaranteeTitle')}
                  </div>
                  {t('home.slider.slide0GuaranteeText')}
                </div>
              </div>
            )}

            {currentSlide === 1 && (
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                    {t('home.slider.slide1CardTitle')}
                  </div>
                  <span className="text-[10px] text-slate-400">{t('home.slider.slide1CardSubtitle')}</span>
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
                      {t('services.items.satbara.title', '7/12 Extract')}
                    </div>
                    <div className="text-[10px] text-slate-400">{t('home.slider.slide1SearchSurvey')}</div>
                  </Link>

                  <Link
                    href="#services"
                    className="p-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-900/60 text-purple-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                      {t('services.items.propertyCard.title', 'Property Card')}
                    </div>
                    <div className="text-[10px] text-slate-400">{t('home.slider.slide1UrbanCts')}</div>
                  </Link>

                  <Link
                    href="/verification"
                    className="p-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-900/60 text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                      {t('services.items.verification.title', 'Verification')}
                    </div>
                    <div className="text-[10px] text-slate-400">{t('home.slider.slide1InspectorWorkstation')}</div>
                  </Link>

                  <Link
                    href="#services"
                    className="p-3 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-900/60 text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                      {t('services.items.mutation.title', 'Mutation Status')}
                    </div>
                    <div className="text-[10px] text-slate-400">{t('home.slider.slide1FerfarTracking')}</div>
                  </Link>
                </div>

                <div className="text-center pt-2">
                  <Link
                    href="/land-records"
                    className="text-xs font-bold text-amber-400 hover:underline inline-flex items-center gap-1"
                  >
                    {t('home.slider.slide1FullCatalog')} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {currentSlide === 2 && (
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">8-Layer Land Stack Architecture</div>
                      <div className="text-[10px] text-cyan-400">DILRMP 3.0 Standard Integration</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] border border-cyan-800">
                    ULPIN: 81LVQLD9407JH0
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700">
                    <span className="text-[10px] text-slate-400">L1: Cadastral Map</span>
                    <div className="text-[11px] text-emerald-400 font-bold truncate">WGS-84 Polygon Verified</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700">
                    <span className="text-[10px] text-slate-400">L2: Record of Rights</span>
                    <div className="text-[11px] text-blue-400 font-bold truncate">Aadhaar Seeded Title</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700">
                    <span className="text-[10px] text-slate-400">L3: Registration</span>
                    <div className="text-[11px] text-purple-400 font-bold truncate">NGDRS e-Deed Clear</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700">
                    <span className="text-[10px] text-slate-400">L4: Statutory Zoning</span>
                    <div className="text-[11px] text-amber-400 font-bold truncate">Residential R-1 / No CRZ</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700">
                    <span className="text-[10px] text-slate-400">L5: NAKSHA Urban</span>
                    <div className="text-[11px] text-indigo-400 font-bold truncate">CTS Property Card Active</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700">
                    <span className="text-[10px] text-slate-400">L6: Bank Mortgage</span>
                    <div className="text-[11px] text-emerald-400 font-bold truncate">RBI ULI Unencumbered</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/50 flex items-center justify-between text-[11px] text-blue-200">
                  <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    L7 Court Disputes & L8 Valuation
                  </span>
                  <span className="font-mono font-bold text-emerald-400">0 Disputes / ₹4.2k/sqm</span>
                </div>
              </div>
            )}

            {currentSlide === 3 && (
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="font-bold text-xs text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    {t('home.slider.slide3CardTitle')}
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] border border-cyan-800">
                    {t('home.slider.slide3Accuracy')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-xl font-black text-emerald-400 font-mono">36 / 36</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                      {t('home.slider.slide3DistrictsCovered')}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-xl font-black text-amber-400 font-mono">44,280+</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                      {t('home.slider.slide3VillagesDigitized')}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-xl font-black text-blue-400 font-mono">1.2M+</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                      {t('home.slider.slide3ParcelsAuthenticated')}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div className="text-xl font-black text-purple-400 font-mono">&lt; 3.2s</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">
                      {t('home.slider.slide3InferenceSla')}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('home.slider.slide3DevanagariSupport')}</span>
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
                aria-label={t('home.slider.goToSlide', { num: idx + 1, defaultValue: `Go to slide ${idx + 1}` })}
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
              title={isPlaying ? t('home.slider.pauseSlideshow', 'Pause slideshow') : t('home.slider.playSlideshow', 'Play slideshow')}
              aria-label={isPlaying ? t('home.slider.pauseSlideshow', 'Pause slideshow') : t('home.slider.playSlideshow', 'Play slideshow')}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={prevSlide}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title={t('home.slider.prevSlide', 'Previous slide')}
              aria-label={t('home.slider.prevSlide', 'Previous slide')}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title={t('home.slider.nextSlide', 'Next slide')}
              aria-label={t('home.slider.nextSlide', 'Next slide')}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
