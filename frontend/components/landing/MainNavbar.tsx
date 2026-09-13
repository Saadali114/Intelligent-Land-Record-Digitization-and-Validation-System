'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [screenReaderModalOpen, setScreenReaderModalOpen] = useState(false);

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

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    try {
      localStorage.setItem('i18nextLng', lang);
    } catch {
      // ignore
    }
  };

  return (
    <header className="w-full text-xs select-none" data-purpose="top-government-bar">
      {/* Tricolor Flag Line */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-green-600" />

      {/* Official Portal Identity Banner */}
      <div className="bg-stone-900 text-stone-300 border-b border-stone-800 px-4 sm:px-8 py-1.5 flex flex-wrap justify-between items-center text-[11px]">
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span className="font-semibold text-white tracking-wide">Government of India</span>
          </span>
          <span className="text-stone-600">|</span>
          <span className="font-medium text-stone-300">GOVERNMENT OF INDIA / DLRS</span>
          <span className="text-stone-600">|</span>
          <span className="hidden md:inline text-stone-400">
            National Land Records Modernization Programme (NLRMP)
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Toll-free telephone support */}
          <span className="hidden sm:inline-flex items-center space-x-1 text-gold-500 font-medium font-mono">
            <span>Toll-Free: 1800-120-8040</span>
          </span>

          {/* Accessibility switcher */}
          <div className="flex items-center space-x-1 bg-stone-800 px-1.5 py-0.5 rounded text-[10px]">
            <button
              type="button"
              onClick={() => handleFontSizeChange('small')}
              className={`cursor-pointer hover:text-white px-1 transition-colors ${
                fontSize === 'small' ? 'font-bold text-white' : 'text-stone-400'
              }`}
              title="Small Text"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => handleFontSizeChange('normal')}
              className={`cursor-pointer hover:text-white px-1 transition-colors ${
                fontSize === 'normal' ? 'font-bold text-white' : 'text-stone-400'
              }`}
              title="Normal Text"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => handleFontSizeChange('large')}
              className={`cursor-pointer hover:text-white px-1 transition-colors ${
                fontSize === 'large' ? 'font-bold text-white' : 'text-stone-400'
              }`}
              title="Large Text"
            >
              A+
            </button>
          </div>

          {/* Screen reader modal trigger */}
          <button
            type="button"
            onClick={() => setScreenReaderModalOpen(true)}
            className="cursor-pointer hover:text-white flex items-center space-x-1 text-stone-300"
          >
            <span>Screen Reader</span>
          </button>

          {/* Language dropdown */}
          <select
            value={i18n.language?.startsWith('mr') ? 'mr' : i18n.language?.startsWith('hi') ? 'hi' : 'en'}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-stone-800 text-white border-0 py-0.5 px-1.5 rounded text-[10px] focus:ring-0 cursor-pointer outline-none"
          >
            <option value="en">English</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>
        </div>
      </div>

      {screenReaderModalOpen && (
        <ScreenReaderModal
          isOpen={screenReaderModalOpen}
          onClose={() => setScreenReaderModalOpen(false)}
        />
      )}
    </header>
  );
};
