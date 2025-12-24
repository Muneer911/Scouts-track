'use client';

import { useLanguage } from '../contexts/LanguageContext';
import enTranslations from '../translations/en.json';
import arTranslations from '../translations/ar.json';

type TranslationKey = string;
type Translations = typeof enTranslations;

const translations: Record<'en' | 'ar', Translations> = {
  en: enTranslations,
  ar: arTranslations,
};

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: TranslationKey): any => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k as keyof typeof value];
      } else {
        // Fallback to English if key not found
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey as keyof typeof value];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }

    return value !== undefined ? value : key;
  };

  return { t, language };
}

