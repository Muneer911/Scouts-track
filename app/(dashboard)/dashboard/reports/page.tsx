'use client';

import { PageShell } from '@/app/components/dashboard/PageShell';
import { useTranslation } from '@/app/hooks/useTranslation';

const reports = [
  { title: 'Monthly performance', period: 'February 2025', status: 'ready' },
  { title: 'Attendance summary', period: 'Q1 2025', status: 'inReview' },
  { title: 'Safety checklist', period: 'March 2025', status: 'draft' },
];

export default function ReportsPage() {
  const { t } = useTranslation();

  return (
    <PageShell title={t('dashboard.reports.title')}>
      <div className="rounded-2xl border border-scout-gray-lighter bg-white p-6 shadow-sm hover:shadow-md hover:border-scout-green/30 transition-all relative overflow-hidden">
        {/* Subtle accent line */}
        <div className="absolute top-0 start-0 end-0 h-1 bg-gradient-to-e from-scout-green/40 via-scout-green-lighter/30 to-transparent" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-scout-green">{t('dashboard.reports.title')}</h3>
          <button className="text-sm text-scout-green hover:text-scout-green-light hover:underline transition-colors font-medium">{t('dashboard.reports.generate')}</button>
        </div>
        <ul className="space-y-4">
          {reports.map((report) => (
            <li key={report.title} className="relative flex items-center justify-between rounded-xl border border-scout-gray-lighter p-4 hover:border-scout-green/50 hover:bg-scout-green/5 hover:shadow-sm transition-all cursor-pointer group">
              {/* Subtle accent on hover */}
              <div className="absolute start-0 top-0 bottom-0 w-1 bg-gradient-to-b from-scout-green/40 to-scout-green-lighter/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-s-xl" />
              <div>
                <div className="text-scout-green font-medium group-hover:text-scout-green-light transition-colors">{report.title}</div>
                <div className="text-sm text-scout-gray">{report.period}</div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-scout-neutral text-scout-gray border border-scout-gray-lighter">
                {t(`dashboard.reports.status.${report.status}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
