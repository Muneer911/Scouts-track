'use client';

import { useTranslation } from '../hooks/useTranslation';
import { Section } from './ui/Section';

export function ProblemSolution() {
  const { t } = useTranslation();

  return (
    <Section className="bg-white py-32">
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-light text-scout-green mb-6 tracking-tight">
          {t('problemSolution.title')}
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Problem Section */}
        <div className="bg-scout-neutral rounded-2xl p-10 border border-scout-gray-lighter">
          <h3 className="text-2xl font-medium text-scout-gray mb-8">
            {t('problemSolution.problem.title')}
          </h3>
          <ul className="space-y-5">
            {(t('problemSolution.problem.items') as string[]).map((item, index) => (
              <li key={index} className="flex items-start gap-4 text-scout-gray">
                <div className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full mt-0.5">
                  <svg className="w-4 h-4 text-scout-gray-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <span className="font-light leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Solution Section */}
        <div className="bg-gradient-to-br from-scout-green/5 to-scout-green-light/5 rounded-2xl p-10 border border-scout-green/20">
          <h3 className="text-2xl font-medium text-scout-green mb-8">
            {t('problemSolution.solution.title')}
          </h3>
          <p className="text-scout-gray leading-relaxed text-lg font-light">
            {t('problemSolution.solution.description')}
          </p>
        </div>
      </div>
    </Section>
  );
}
