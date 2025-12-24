'use client';

import { useLanguage } from '../../contexts/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-scout-gray-lighter hover:border-scout-green hover:bg-scout-neutral transition-all text-sm font-medium"
      aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <span className={language === 'en' ? 'font-semibold text-scout-green' : 'text-scout-gray'}>
        EN
      </span>
      <span className="text-scout-gray-lighter">|</span>
      <span className={language === 'ar' ? 'font-semibold text-scout-green' : 'text-scout-gray'}>
        AR
      </span>
    </button>
  );
}

