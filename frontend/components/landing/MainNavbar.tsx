'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  ChevronDown,
  LayoutDashboard,
  FileCheck,
  Shield,
  Briefcase,
  PhoneCall,
  Eye,
} from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export type FontSize = 'small' | 'normal' | 'large';

const FONT_SIZE_STYLES: Record<FontSize, string> = {
  small: '87.5%',
  normal: '100%',
  large: '115%',
};

export const applyFontSize = (size: FontSize) => {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-font-size', size);
  document.documentElement.style.fontSize = FONT_SIZE_STYLES[size];
  try {
    localStorage.setItem('ilrdvs_font_size', size);
  } catch {
    // ignore
  }
};

interface DistrictOption {
  key: string;
  defaultName: string;
}

const DISTRICTS_LIST: DistrictOption[] = [
  { key: 'pune', defaultName: 'Pune' },
  { key: 'mumbaiCity', defaultName: 'Mumbai City' },
  { key: 'mumbaiSuburban', defaultName: 'Mumbai Suburban' },
  { key: 'nagpur', defaultName: 'Nagpur' },
  { key: 'nashik', defaultName: 'Nashik' },
  { key: 'thane', defaultName: 'Thane' },
  { key: 'chhatrapatiSambhajinagar', defaultName: 'Chhatrapati Sambhajinagar' },
  { key: 'kolhapur', defaultName: 'Kolhapur' },
  { key: 'solapur', defaultName: 'Solapur' },
  { key: 'amravati', defaultName: 'Amravati' },
  { key: 'nanded', defaultName: 'Nanded' },
  { key: 'satara', defaultName: 'Satara' },
];

export const MainNavbar: React.FC = () => {
  const { t } = useTranslation();
  const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
  const [selectedDistrictKey, setSelectedDistrictKey] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState<FontSize>('normal');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ilrdvs_font_size') as FontSize | null;
      if (saved && (saved === 'small' || saved === 'normal' || saved === 'large')) {
        setFontSize(saved);
        applyFontSize(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size);
    applyFontSize(size);
  };

  return (
    <div className="bg-slate-900 text-slate-200 text-[11px] border-b border-slate-800">
      {/* Topmost Official Accessibility & Gov Ribbon */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Government Identification */}
          <div className="flex items-center gap-2.5 font-medium text-slate-300">
            <span className="text-amber-400 font-bold tracking-wider">
              {t('common.govtOfIndiaEmblem', '🏛️ भारत सरकार')}
            </span>
            <span className="text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-300 font-semibold uppercase">
              {t('common.govtOfIndia')}
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="hidden md:inline text-slate-400">
              {t('home.bannerBadge')}
            </span>
          </div>

          {/* Accessibility & Utility Tools */}
          <div className="flex items-center gap-3 text-[10px] text-slate-300">
            <div className="hidden lg:flex items-center gap-1.5 text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/50">
              <PhoneCall className="w-2.5 h-2.5" />
              <span>{t('common.tollFree')}</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
              <span className="text-slate-400">{t('navbar.textLabel', 'Text:')}</span>
              <button
                type="button"
                onClick={() => handleFontSizeChange('small')}
                className={`hover:text-white px-1.5 py-0.5 rounded font-bold transition-colors ${
                  fontSize === 'small' ? 'text-amber-400 bg-slate-700/80' : 'text-slate-300'
                }`}
                title={t('navbar.decreaseText')}
                aria-label={t('navbar.decreaseText')}
                aria-pressed={fontSize === 'small'}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange('normal')}
                className={`hover:text-white px-1.5 py-0.5 rounded font-bold transition-colors ${
                  fontSize === 'normal' ? 'text-amber-400 bg-slate-700/80' : 'text-slate-300'
                }`}
                title={t('navbar.standardText')}
                aria-label={t('navbar.standardText')}
                aria-pressed={fontSize === 'normal'}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => handleFontSizeChange('large')}
                className={`hover:text-white px-1.5 py-0.5 rounded font-bold transition-colors ${
                  fontSize === 'large' ? 'text-amber-400 bg-slate-700/80' : 'text-slate-300'
                }`}
                title={t('navbar.increaseText')}
                aria-label={t('navbar.increaseText')}
                aria-pressed={fontSize === 'large'}
              >
                A+
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-1">
              <Eye className="w-3 h-3 text-slate-400" />
              <span className="text-slate-300">{t('navbar.screenReader')}</span>
            </div>

            {/* Language Switcher in Top Bar */}
            <LanguageSwitcher variant="dark" />
          </div>
        </div>
      </div>

      {/* Main Top Navigation Row: Districts, RTI, RTS, EODB, Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
        {/* Left Side: Districts Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDistrictDropdownOpen(!districtDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-750 text-white font-semibold text-xs border border-slate-700 hover:border-blue-500 transition-all shadow-xs"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {t('navbar.districts')} (
              {selectedDistrictKey
                ? t(`districts.${selectedDistrictKey}`, selectedDistrictKey)
                : t('common.all')}
              )
            </span>
            <ChevronDown
              className={`w-3 h-3 text-slate-400 transition-transform ${
                districtDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {districtDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 grid grid-cols-1 gap-1 max-h-64 overflow-y-auto">
              <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 border-b border-slate-800 flex items-center justify-between">
                <span>{t('navbar.maharashtraDistricts', 'Maharashtra Districts')}</span>
                {selectedDistrictKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDistrictKey(null);
                      setDistrictDropdownOpen(false);
                    }}
                    className="text-[9px] text-amber-400 hover:underline"
                  >
                    {t('common.all')}
                  </button>
                )}
              </div>
              {DISTRICTS_LIST.map((dist) => (
                <button
                  key={dist.key}
                  type="button"
                  onClick={() => {
                    setSelectedDistrictKey(dist.key);
                    setDistrictDropdownOpen(false);
                  }}
                  className={`text-left px-2 py-1.5 rounded hover:bg-blue-900/60 transition-colors truncate text-[11px] ${
                    selectedDistrictKey === dist.key
                      ? 'bg-blue-950 text-amber-300 font-bold'
                      : 'text-slate-300'
                  }`}
                >
                  {t(`districts.${dist.key}`, dist.defaultName)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Key Governance Portals (RTI, RTS, EODB, Dashboard) */}
        <nav className="flex items-center flex-wrap gap-1 sm:gap-2">
          {/* RTI */}
          <Link
            href="#faq"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-medium"
            title={t('navbar.rtiTitle', 'Right to Information Act portal')}
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>{t('navbar.rti')}</span>
          </Link>

          {/* RTS */}
          <Link
            href="#services"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-medium"
            title={t('navbar.rtsTitle', 'Right to Services Act')}
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('navbar.rts')}</span>
          </Link>

          {/* EODB */}
          <Link
            href="#services"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-xs font-medium"
            title={t('navbar.eodbTitle', 'Ease of Doing Business')}
          >
            <Briefcase className="w-3.5 h-3.5 text-purple-400" />
            <span>{t('navbar.eodb')}</span>
          </Link>

          {/* Dashboard Direct Link */}
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-900/80 hover:bg-blue-800 text-white font-semibold text-xs border border-blue-700/60 transition-all shadow-xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('navbar.dashboard')}</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};
