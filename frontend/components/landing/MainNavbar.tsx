'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  PhoneCall,
  Volume2,
} from 'lucide-react';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { ScreenReaderModal } from '../ui/ScreenReaderModal';

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

export const MainNavbar: React.FC = () => {
  const { t } = useTranslation();
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [screenReaderModalOpen, setScreenReaderModalOpen] = useState(false);

  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        setScreenReaderModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, []);

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
    <div className="bg-[#f7f8f4] text-slate-700 text-[11px] border-b border-slate-200/90 relative">
      {/* Skip to Main Content Accessible Anchor for Screen Readers & Keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#14532d] focus:text-white focus:font-black focus:rounded-lg focus:shadow-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
      >
        {t('navbar.skipToContent', 'Skip to main content')}
      </a>

      {/* Topmost Official Accessibility & Gov Ribbon */}
      <div className="border-b border-slate-200/70 bg-[#f3f5ed]/90 px-4 sm:px-6 lg:px-8 py-1.5">
        <div className="w-full flex flex-wrap items-center justify-between gap-2">
          {/* Government Identification */}
          <div className="flex items-center gap-2.5 font-medium text-slate-700 text-[11px]">
            <span className="text-[#14532d] font-bold tracking-wide flex items-center gap-1.5">
              <span className="text-base">🏛️</span> महाराष्ट्र शासन | Govt. of Maharashtra
            </span>
            <span className="text-slate-300">|</span>
            <span className="hidden sm:inline px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100/70 text-[#14532d] border border-emerald-300/60">
              DILRMP 3.0 Standard Compliance
            </span>
            <span className="text-slate-300 hidden md:inline">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-600 font-medium">
              <PhoneCall className="w-3 h-3 text-[#166534]" />
              <span>Toll Free Helpline: 1800-120-8040</span>
            </span>
          </div>

          {/* Accessibility & Utility Tools */}
          <div className="flex items-center gap-3 text-[10px] text-slate-700">
            <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
              <span className="text-slate-500 font-medium">{t('navbar.textLabel', 'Text:')}</span>
              <button
                type="button"
                onClick={() => handleFontSizeChange('small')}
                className={`hover:text-[#14532d] px-1.5 py-0.5 rounded font-bold transition-colors ${
                  fontSize === 'small' ? 'text-[#14532d] bg-emerald-100' : 'text-slate-600'
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
                className={`hover:text-[#14532d] px-1.5 py-0.5 rounded font-bold transition-colors ${
                  fontSize === 'normal' ? 'text-[#14532d] bg-emerald-100' : 'text-slate-600'
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
                className={`hover:text-[#14532d] px-1.5 py-0.5 rounded font-bold transition-colors ${
                  fontSize === 'large' ? 'text-[#14532d] bg-emerald-100' : 'text-slate-600'
                }`}
                title={t('navbar.increaseText')}
                aria-label={t('navbar.increaseText')}
                aria-pressed={fontSize === 'large'}
              >
                A+
              </button>
            </div>

            {/* Screen Reader Access Interactive Trigger */}
            <button
              type="button"
              onClick={() => setScreenReaderModalOpen(true)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white hover:bg-slate-50 text-slate-700 hover:text-[#14532d] border border-slate-200 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer shadow-2xs shrink-0"
              title="Screen Reader Access & Audio Narration (Alt + S)"
              aria-label="Screen Reader Access and Text-to-Speech audio tools (Press Alt + S)"
            >
              <Volume2 className="w-3 h-3 text-[#14532d] shrink-0" />
              <span className="font-semibold hidden sm:inline">{t('navbar.screenReader', 'Screen Reader')}</span>
              <span className="font-semibold sm:hidden">SR</span>
            </button>

            {/* Language Switcher in Top Bar */}
            <div className="shrink-0">
              <LanguageSwitcher variant="light" />
            </div>
          </div>
        </div>
      </div>

      {/* Screen Reader Access & Text-to-Speech Modal */}
      <ScreenReaderModal
        isOpen={screenReaderModalOpen}
        onClose={() => setScreenReaderModalOpen(false)}
      />
    </div>
  );
};
