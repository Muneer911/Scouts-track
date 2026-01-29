'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/app/hooks/useTranslation';
import { cn } from '@/lib/utils';
import {
  Home,
  Users,
  Calendar,
  Settings,
  LogOut,
  Plus,
} from 'lucide-react';
import { logoutAction } from '@/app/actions/logout';

const navItems = [
  { href: '/dashboard', key: 'overview', icon: Home },
  { href: '/dashboard/teams', key: 'teams', icon: Users, hasAdd: true },
  { href: '/dashboard/activities', key: 'activities', icon: Calendar, hasAdd: true },
  { href: '/dashboard/settings', key: 'settings', icon: Settings },
];

export function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-e border-border bg-sidebar">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">S</span>
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">
            Scanance
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors',
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{t(`dashboard.sidebar.${item.key}`)}</span>
                  </div>
                  {item.hasAdd && (
                    <Plus className="w-4 h-4 text-muted-foreground" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Links */}
      <div className="border-t border-sidebar-border p-4 space-y-1">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          {t('dashboard.sidebar.logout')}
        </button>
      </div>
    </aside>
  );
}
