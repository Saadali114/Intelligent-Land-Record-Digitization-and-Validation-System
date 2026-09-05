'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from '../locales/en/translation.json';
import mrTranslation from '../locales/mr/translation.json';
import hiTranslation from '../locales/hi/translation.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]['code'];

const resources = {
  en: { translation: enTranslation },
  mr: { translation: mrTranslation },
  hi: { translation: hiTranslation },
};

// Initial language detection
export const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return 'en';
  const saved = (localStorage.getItem('ilrdvs_language') ||
    localStorage.getItem('i18nextLng')) as SupportedLanguage;
  if (saved && ['en', 'mr', 'hi'].includes(saved)) {
    return saved;
  }
  return 'en';
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'en', // Default English
    fallbackLng: 'en',
    supportedLngs: ['en', 'mr', 'hi'],
    interpolation: {
      escapeValue: false, // React already safe from XSS
    },
    react: {
      useSuspense: false, // Prevents hydration/suspense mismatch in SSR/static export
    },
  });
}

// Global language switcher helper
export const changeAppLanguage = (lang: SupportedLanguage): void => {
  i18n.changeLanguage(lang);
  if (typeof window !== 'undefined') {
    localStorage.setItem('ilrdvs_language', lang);
    localStorage.setItem('i18nextLng', lang);
    document.documentElement.lang = lang;
  }
};

export default i18n;
