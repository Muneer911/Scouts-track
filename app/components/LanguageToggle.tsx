'use client';

import { useLanguage } from '../contexts/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-solid border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium"
      aria-label={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <span className={language === 'en' ? 'font-semibold' : 'text-gray-500'}>
        EN
      </span>
      <span className="text-gray-300">|</span>
      <span className={language === 'ar' ? 'font-semibold' : 'text-gray-500'}>
        AR
      </span>
    </button>
  );
}

