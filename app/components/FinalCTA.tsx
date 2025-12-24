'use client';

import { useTranslation } from '../hooks/useTranslation';
import { Section } from './Section';
import { Button } from './Button';

export function FinalCTA() {
  const { t } = useTranslation();

  return (
    <Section className="bg-gradient-to-br from-scout-green to-scout-green-light text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {t('finalCta.title')}
        </h2>
        <p className="text-lg md:text-xl mb-8 opacity-90">
          {t('finalCta.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            variant="secondary-on-dark"
            className="min-w-[160px]"
          >
            {t('finalCta.cta')}
          </Button>
          <Button
            variant="outline-light"
            className="min-w-[160px]"
          >
            {t('finalCta.ctaSecondary')}
          </Button>
        </div>
      </div>
    </Section>
  );
}
