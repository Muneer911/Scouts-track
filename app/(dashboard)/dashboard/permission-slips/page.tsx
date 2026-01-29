'use client';

import { PageShell } from '@/app/components/dashboard/PageShell';
import { useTranslation } from '@/app/hooks/useTranslation';
import { ClipboardList, Plus, Search } from 'lucide-react';

export default function PermissionSlipsPage() {
  const { t } = useTranslation();

  return (
    <PageShell title={t('dashboard.permissionSlips.title')}>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-scout-gray-light" />
            <input
              type="text"
              placeholder={t('dashboard.permissionSlips.searchPlaceholder')}
              className="w-full rounded-lg border border-scout-gray-lighter bg-white ps-10 pe-4 py-2.5 text-scout-green focus:outline-none focus:ring-2 focus:ring-scout-green focus:border-scout-green transition"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-scout-green text-white rounded-lg hover:bg-scout-green-light transition-colors font-medium">
            <Plus className="w-5 h-5" />
            {t('dashboard.permissionSlips.createSlip')}
          </button>
        </div>

        {/* Empty State */}
        <div className="rounded-2xl border border-scout-gray-lighter bg-white p-12 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-scout-neutral mx-auto mb-4 flex items-center justify-center">
            <ClipboardList className="w-8 h-8 text-scout-gray-light" />
          </div>
          <h3 className="text-lg font-medium text-scout-green mb-2">{t('dashboard.permissionSlips.emptyTitle')}</h3>
          <p className="text-sm text-scout-gray max-w-md mx-auto">{t('dashboard.permissionSlips.emptyDescription')}</p>
        </div>
      </div>
    </PageShell>
  );
}
