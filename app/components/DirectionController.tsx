'use client';

import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function DirectionController() {
  const { language } = useLanguage();

  useEffect(() => {
    const direction = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language]);

  return null; // This component renders nothing.
}