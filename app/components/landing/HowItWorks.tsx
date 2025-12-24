'use client';

import { useTranslation } from '../../hooks/useTranslation';
import { Section } from '../ui/Section';

interface Step {
  number: string;
  title: string;
  description: string;
}

export function HowItWorks() {
  const { t } = useTranslation();
  const steps = t('howItWorks.steps') as Step[];

  return (
    <Section className="bg-scout-neutral py-32">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-light text-scout-green mb-6 tracking-tight">
          {t('howItWorks.title')}
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-16 start-full w-full h-px bg-gradient-to-e from-scout-gray-lighter to-transparent -z-10" />
            )}
            
            <div className="text-center">
              {/* Step Number */}
              <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-scout-green to-scout-green-light text-white flex items-center justify-center text-2xl font-light shadow-lg shadow-scout-green/20">
                {step.number}
              </div>
              
              {/* Step Content */}
              <h3 className="text-2xl font-medium text-scout-green mb-4">
                {step.title}
              </h3>
              <p className="text-scout-gray leading-relaxed font-light text-lg">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

