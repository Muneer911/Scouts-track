'use client';

import Link from 'next/link';
import { useTranslation } from '../../hooks/useTranslation';
import { Section } from '../ui/Section';
import { Button } from '@/components/ui/button';

export function FinalCTA() {
  const { t } = useTranslation();

  return (
    <Section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-32 overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
          {t('finalCta.title')}
        </h2>
        <p className="text-xl md:text-2xl mb-12 opacity-90 font-light leading-relaxed">
          {t('finalCta.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/register">
            <Button
              variant="secondary"
              className="bg-background text-foreground hover:bg-background/90 min-w-[200px] px-8 py-4 text-base shadow-lg"
            >
              {t('finalCta.cta')}
            </Button>
          </Link>
          <Link href="/login">
            <Button
              variant="outline"
              className="bg-background text-foreground hover:bg-background/90 min-w-[200px] px-8 py-4 text-base shadow-lg"
            >
              {t('finalCta.ctaSecondary')}
            </Button>
          </Link>
        </div>
      </div>
    </Section>
  );
}

