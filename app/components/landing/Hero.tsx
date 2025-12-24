'use client';

import Link from 'next/link';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../ui/Button';
import { LanguageToggle } from '../ui/LanguageToggle';

export function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-scout-neutral via-white to-white -z-10" />
      
      {/* Decorative subtle pattern */}
      <div className="absolute inset-0 opacity-[0.02] -z-10" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, var(--scout-green) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Language Toggle - Top Right */}
      <div className="absolute top-8 end-8 z-20">
        <LanguageToggle />
      </div>

      <div className="max-w-5xl mx-auto text-center pt-24 pb-32">
        {/* Subtle badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-scout-neutral border border-scout-gray-lighter text-scout-gray text-sm">
          <span className="w-2 h-2 rounded-full bg-scout-green-light"></span>
          <span>{t('hero.trustedBy')}</span>
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-scout-green mb-8 leading-[1.1] tracking-tight">
          {t('hero.title')}
        </h1>
        
        <p className="text-xl md:text-2xl text-scout-gray mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          {t('hero.subtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/register">
            <Button variant="primary" className="w-full sm:w-auto min-w-[180px] px-8 py-4 text-base shadow-lg shadow-scout-green/10 hover:shadow-xl hover:shadow-scout-green/20 transition-all">
              {t('hero.cta')}
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" className="w-full sm:w-auto min-w-[180px] px-8 py-4 text-base">
              {t('hero.ctaSecondary')}
            </Button>
          </Link>
        </div>

        {/* Subtle scroll indicator */}
        <div className="mt-20 flex flex-col items-center gap-2 text-scout-gray-light text-sm animate-bounce">
          <span>Scroll to explore</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}

