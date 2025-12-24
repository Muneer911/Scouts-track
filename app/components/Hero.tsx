'use client';

import { useTranslation } from '../hooks/useTranslation';
import { Button } from './Button';
import { LanguageToggle } from './LanguageToggle';

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-scout-neutral to-white">
      {/* Language Toggle - Top Right */}
      <div className="absolute top-6 end-6 z-10">
        <LanguageToggle />
      </div>

      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-scout-green mb-6 leading-tight">
          {t('hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button variant="primary" className="w-full sm:w-auto min-w-[160px]">
            {t('hero.cta')}
          </Button>
          <Button variant="secondary" className="w-full sm:w-auto min-w-[160px]">
            {t('hero.ctaSecondary')}
          </Button>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 start-0 end-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
