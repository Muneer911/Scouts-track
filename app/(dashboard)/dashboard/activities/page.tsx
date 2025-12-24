'use client';

import { PageShell } from '@/app/components/dashboard/PageShell';
import { useTranslation } from '@/app/hooks/useTranslation';

const activities = [
  { title: 'Trail navigation', date: 'Mar 22', status: 'scheduled', owner: 'Falcons' },
  { title: 'First aid basics', date: 'Mar 24', status: 'planned', owner: 'Desert Hawks' },
  { title: 'Night hike', date: 'Mar 28', status: 'draft', owner: 'Green Peaks' },
];

export default function ActivitiesPage() {
  const { t } = useTranslation();

  return (
    <PageShell title={t('dashboard.activities.title')}>
      <div className="rounded-2xl border border-scout-gray-lighter bg-white p-6 shadow-sm hover:shadow-md hover:border-scout-green/30 transition-all relative overflow-hidden">
        {/* Subtle accent line */}
        <div className="absolute top-0 start-0 end-0 h-1 bg-gradient-to-e from-scout-green/40 via-scout-green-lighter/30 to-transparent" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-scout-green">{t('dashboard.activities.pipeline')}</h3>
          <button className="text-sm text-scout-green hover:text-scout-green-light hover:underline transition-colors font-medium">{t('dashboard.activities.addActivity')}</button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {activities.map((item) => (
            <div key={item.title} className="rounded-xl border border-scout-gray-lighter p-4 bg-gradient-to-br from-scout-neutral to-white hover:border-scout-green/50 hover:shadow-md transition-all group relative overflow-hidden">
              {/* Subtle accent on hover */}
              <div className="absolute top-0 start-0 w-full h-0.5 bg-gradient-to-e from-scout-green/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-scout-green font-medium mb-2 group-hover:text-scout-green-light transition-colors">{item.title}</div>
              <div className="text-sm text-scout-gray mb-1">{t('dashboard.activities.date')}: {item.date}</div>
              <div className="text-sm text-scout-gray mb-1">{t('dashboard.activities.team')}: {item.owner}</div>
              <span className="inline-flex text-xs px-3 py-1 rounded-full bg-white border border-scout-gray-lighter text-scout-gray">
                {t(`dashboard.activities.status.${item.status}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
