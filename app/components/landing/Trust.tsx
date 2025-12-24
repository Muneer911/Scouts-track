'use client';

import { useTranslation } from '../../hooks/useTranslation';
import { Section } from '../ui/Section';

interface Stat {
  value: string;
  label: string;
}

export function Trust() {
  const { t } = useTranslation();
  const stats = t('trust.stats') as Stat[];

  return (
    <Section className="bg-white py-32">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-light text-scout-green mb-6 tracking-tight">
          {t('trust.title')}
        </h2>
        <p className="text-xl text-scout-gray max-w-2xl mx-auto font-light">
          {t('trust.subtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-5xl md:text-6xl font-light text-scout-green mb-4">
              {stat.value}
            </div>
            <div className="text-scout-gray text-lg font-light">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

