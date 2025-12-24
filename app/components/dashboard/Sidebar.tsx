'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/app/contexts/LanguageContext';
import { useTranslation } from '@/app/hooks/useTranslation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', key: 'overview' },
  { href: '/dashboard/teams', key: 'teams' },
  { href: '/dashboard/activities', key: 'activities' },
  { href: '/dashboard/reports', key: 'reports' },
  { href: '/dashboard/settings', key: 'settings' },
];

export function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { isRTL } = useLanguage();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-2 border-e border-scout-gray-lighter bg-white/60 backdrop-blur-sm p-4">
      <div className="px-2 py-4">
        <div className="text-xl font-light text-scout-green">{t('dashboard.sidebar.brand')}</div>
        <div className="text-sm text-scout-gray">{t('dashboard.sidebar.dashboard')}</div>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all',
                active
                  ? 'bg-gradient-to-e from-scout-green/10 to-scout-green/5 text-scout-green font-medium border border-scout-green/40 shadow-sm'
                  : 'text-scout-gray hover:text-scout-green hover:bg-scout-green/5 hover:border hover:border-scout-green/20'
              )}
            >
              <span className={isRTL ? 'order-2' : ''}>{t(`dashboard.sidebar.${item.key}`)}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
