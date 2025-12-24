'use client';

import { PageShell } from '@/app/components/dashboard/PageShell';
import { StatCard } from '@/app/components/dashboard/StatCard';
import { useTranslation } from '@/app/hooks/useTranslation';

const timeline = [
  { title: 'Outdoor survival workshop', date: 'Mar 18', status: 'inProgress' },
  { title: 'Community service day', date: 'Mar 20', status: 'planned' },
  { title: 'Leadership camp', date: 'Mar 24', status: 'planned' },
];

export default function DashboardOverviewPage() {
  const { t } = useTranslation();

  const stats = [
    { label: t('dashboard.overview.activeTeams'), value: '12', hint: '+2 this month' },
    { label: t('dashboard.overview.scoutsEnrolled'), value: '248', hint: '+18 this week' },
    { label: t('dashboard.overview.scheduledActivities'), value: '36', hint: 'Across 4 regions' },
    { label: t('dashboard.overview.completionRate'), value: '92%', hint: 'Last 30 days' },
  ];

  return (
    <PageShell title={t('dashboard.sidebar.overview')}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} hint={stat.hint} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-scout-gray-lighter bg-white p-6 shadow-sm hover:shadow-md hover:border-scout-green/30 transition-all relative overflow-hidden">
          {/* Subtle accent line */}
          <div className="absolute top-0 start-0 end-0 h-1 bg-gradient-to-e from-scout-green/40 via-scout-green-lighter/30 to-transparent" />
          <h3 className="text-lg font-medium text-scout-green mb-4">{t('dashboard.overview.recentActivity')}</h3>
          <ul className="space-y-4">
            {timeline.map((item) => (
              <li key={item.title} className="flex items-center justify-between hover:bg-scout-green/5 p-2 rounded-lg transition-colors group">
                <div>
                  <div className="text-scout-green font-medium group-hover:text-scout-green-light transition-colors">{item.title}</div>
                  <div className="text-sm text-scout-gray">{item.date}</div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-scout-neutral to-white border border-scout-gray-lighter text-scout-gray group-hover:border-scout-green/30 transition-colors">
                  {t(`dashboard.activities.status.${item.status}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-scout-gray-lighter bg-white p-6 shadow-sm hover:shadow-md hover:border-scout-green/30 transition-all relative overflow-hidden">
          {/* Subtle accent line */}
          <div className="absolute top-0 start-0 end-0 h-1 bg-gradient-to-e from-scout-green/40 via-scout-green-lighter/30 to-transparent" />
          <h3 className="text-lg font-medium text-scout-green mb-4">{t('dashboard.overview.atAGlance')}</h3>
          <div className="space-y-4 text-scout-gray">
            <div className="flex items-center justify-between hover:bg-scout-green/5 p-2 rounded-lg transition-colors group">
              <span>{t('dashboard.overview.upcomingEvents')}</span>
              <span className="text-scout-green font-medium group-hover:text-scout-green-light transition-colors">8</span>
            </div>
            <div className="flex items-center justify-between hover:bg-scout-green/5 p-2 rounded-lg transition-colors group">
              <span>{t('dashboard.overview.reportsAwaiting')}</span>
              <span className="text-scout-green font-medium group-hover:text-scout-green-light transition-colors">3</span>
            </div>
            <div className="flex items-center justify-between hover:bg-scout-green/5 p-2 rounded-lg transition-colors group">
              <span>{t('dashboard.overview.unreadMessages')}</span>
              <span className="text-scout-green font-medium group-hover:text-scout-green-light transition-colors">12</span>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
