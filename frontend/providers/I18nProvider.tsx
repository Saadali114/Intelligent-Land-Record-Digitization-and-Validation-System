'use client';

import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { getInitialLanguage, changeAppLanguage } from '../lib/i18n';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const initialLang = getInitialLanguage();
    if (i18n.language !== initialLang) {
      changeAppLanguage(initialLang);
    } else if (typeof document !== 'undefined') {
      document.documentElement.lang = initialLang;
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
