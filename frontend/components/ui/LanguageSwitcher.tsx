'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
  changeAppLanguage,
} from '../../lib/i18n';
import { cn } from '../../lib/utils';

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark' | 'header';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'light',
  className,
}) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangCode = (i18n.language?.slice(0, 2) || 'en') as SupportedLanguage;
  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLangCode) ||
    SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = (code: SupportedLanguage) => {
    changeAppLanguage(code);
    setIsOpen(false);
  };

  const buttonStyles = {
    light:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 focus:ring-blue-900',
    dark:
      'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 focus:ring-blue-500',
    header:
      'bg-slate-50/90 hover:bg-slate-100 text-slate-800 border border-slate-200 hover:border-slate-300 focus:ring-blue-900 shadow-2xs',
  };

  return (
    <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Select Language"
        className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 select-none',
          buttonStyles[variant]
        )}
      >
        <Globe className="w-3.5 h-3.5 text-blue-700 shrink-0" />
        <span className="font-medium">{currentLang.nativeName}</span>
        <ChevronDown
          className={cn(
            'w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0',
            isOpen ? 'rotate-180 text-blue-900' : ''
          )}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in-50 slide-in-from-top-1"
        >
          <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
            Language / भाषा
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLang.code === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(lang.code)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors font-medium',
                  isSelected
                    ? 'bg-blue-50 text-blue-900 font-bold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                )}
              >
                <div className="flex items-center gap-2">
                  <span>{lang.nativeName}</span>
                  {lang.code !== 'en' && (
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({lang.name})
                    </span>
                  )}
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-700 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
