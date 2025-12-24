'use client';

import { useTranslation } from '@/app/hooks/useTranslation';
import { LanguageToggle } from '@/app/components/ui/LanguageToggle';
import { logoutAction } from '@/app/actions/logout';

export function Topbar({ title }: { title: string }) {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-4 bg-white/90 backdrop-blur-md border-b border-scout-gray-lighter px-4 sm:px-6 py-3 relative">
      {/* Subtle accent line */}
      <div className="absolute top-0 start-0 end-0 h-0.5 bg-gradient-to-e from-scout-green/30 via-scout-green-lighter/20 to-transparent" />
      <div>
        <h1 className="text-xl sm:text-2xl font-light text-scout-green">{title}</h1>
        <p className="text-sm text-scout-gray">{t('dashboard.sidebar.brand')}</p>
      </div>
      <div className="flex items-center gap-3">
        <LanguageToggle />
        <form action={logoutAction} className="flex items-center gap-2 rounded-full border border-scout-gray-lighter px-3 py-1 bg-white">
          <div className="w-8 h-8 rounded-full bg-scout-neutral border border-scout-gray-lighter" />
          <span className="text-sm text-scout-gray">{t('dashboard.topbar.admin')}</span>
          <button
            type="submit"
            className="text-xs text-scout-gray hover:text-scout-green transition"
          >
            {t('dashboard.topbar.logout')}
          </button>
        </form>
      </div>
    </header>
  );
}
