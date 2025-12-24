'use client';

import { useTranslation } from '../hooks/useTranslation';
import { Section } from './Section';

interface Step {
  number: string;
  title: string;
  description: string;
}

export function HowItWorks() {
  const { t } = useTranslation();
  const steps = t('howItWorks.steps') as Step[];

  return (
    <Section className="bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-scout-green mb-4">
          {t('howItWorks.title')}
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Connector line (hidden on last item) */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-12 start-full w-full h-0.5 bg-scout-green-light -z-10" />
            )}
            
            <div className="text-center">
              {/* Step Number */}
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-scout-green text-white flex items-center justify-center text-3xl font-bold shadow-lg">
                {step.number}
              </div>
              
              {/* Step Content */}
              <h3 className="text-xl font-semibold text-scout-green mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
