'use client';

import { PageShell } from '@/app/components/dashboard/PageShell';
import { useTranslation } from '@/app/hooks/useTranslation';

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <PageShell title={t('dashboard.settings.title')}>
      <div className="grid gap-6 max-w-3xl">
        <div className="rounded-2xl border border-scout-gray-lighter bg-white p-6 shadow-sm hover:shadow-md hover:border-scout-green/30 transition-all space-y-4 relative overflow-hidden">
          {/* Subtle accent line */}
          <div className="absolute top-0 start-0 end-0 h-1 bg-gradient-to-e from-scout-green/40 via-scout-green-lighter/30 to-transparent" />
          <div>
            <h3 className="text-lg font-medium text-scout-green">{t('dashboard.settings.profile.title')}</h3>
            <p className="text-sm text-scout-gray">{t('dashboard.settings.profile.subtitle')}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              dir="auto"
              className="w-full rounded-lg border border-scout-gray-lighter bg-white ps-4 pe-4 py-3 text-scout-green focus:outline-none focus:ring-2 focus:ring-scout-green focus:border-scout-green transition text-start"
              defaultValue="Admin User"
            />
            <input
              dir="auto"
              className="w-full rounded-lg border border-scout-gray-lighter bg-white ps-4 pe-4 py-3 text-scout-green focus:outline-none focus:ring-2 focus:ring-scout-green focus:border-scout-green transition text-start"
              defaultValue="admin@example.com"
            />
          </div>
          <button className="text-sm text-scout-green hover:text-scout-green-light hover:underline transition-colors font-medium">{t('dashboard.settings.profile.save')}</button>
        </div>

        <div className="rounded-2xl border border-scout-gray-lighter bg-white p-6 shadow-sm hover:shadow-md hover:border-scout-green/30 transition-all space-y-4 relative overflow-hidden">
          {/* Subtle accent line */}
          <div className="absolute top-0 start-0 end-0 h-1 bg-gradient-to-e from-scout-green/40 via-scout-green-lighter/30 to-transparent" />
          <div>
            <h3 className="text-lg font-medium text-scout-green">{t('dashboard.settings.notifications.title')}</h3>
            <p className="text-sm text-scout-gray">{t('dashboard.settings.notifications.subtitle')}</p>
          </div>
          <label className="flex items-center gap-3 text-scout-gray text-start">
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-scout-gray-lighter text-scout-green ms-2" />
            {t('dashboard.settings.notifications.weeklySummaries')}
          </label>
          <label className="flex items-center gap-3 text-scout-gray text-start">
            <input type="checkbox" className="h-4 w-4 rounded border-scout-gray-lighter text-scout-green ms-2" />
            {t('dashboard.settings.notifications.activityAlerts')}
          </label>
          <button className="text-sm text-scout-green hover:text-scout-green-light hover:underline transition-colors font-medium">{t('dashboard.settings.notifications.save')}</button>
        </div>
      </div>
    </PageShell>
  );
}
