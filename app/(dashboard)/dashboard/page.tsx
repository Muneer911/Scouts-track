'use client';

import { PageShell } from '@/app/components/dashboard/PageShell';
import { UpcomingEvents } from '@/app/components/dashboard/UpcomingEvents';
import { AttendanceTrend } from '@/app/components/dashboard/AttendanceTrend';
import { useTranslation } from '@/app/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UsersRound, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getDashboardStats, getUpcomingEvents } from '@/app/actions/dashboard';

import { DEMO_ATTENDANCE_TREND } from '@/lib/demoData';

export default function DashboardOverviewPage() {
  const { t } = useTranslation();

  const [stats, setStats] = useState<{ totalScouts: number; activeTeams: number; attendanceRate: number } | null>(null);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [statsRes, eventsRes] = await Promise.all([getDashboardStats(), getUpcomingEvents()]);
      setStats(statsRes);
      setEvents(eventsRes as any[]);
    }

    fetchData();
  }, []);

  const upcomingEvents = useMemo(() => {
    return (events || []).map((e) => {
      const date = e.activity_date
        ? new Date(e.activity_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : '';
      const time = e.start_time ? String(e.start_time).slice(0, 5) : '';
      return {
        id: e.id,
        title: e.title,
        date,
        time,
      };
    });
  }, [events]);

  return (
    <PageShell title={t('dashboard.sidebar.overview')}>
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.overview.totalScouts')}</p>
                <p className="text-3xl font-bold text-foreground">{stats?.totalScouts ?? '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <UsersRound className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.overview.activeTeams')}</p>
                <p className="text-3xl font-bold text-foreground">{stats?.activeTeams ?? '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/20 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.overview.attendanceRate')}</p>
                <p className="text-3xl font-bold text-foreground">{stats ? `${stats.attendanceRate}%` : '—'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <UpcomingEvents
          events={upcomingEvents}
          title={t('dashboard.overview.upcomingEvents')}
        />

        {/* Attendance Trend */}
        <AttendanceTrend
          data={[...DEMO_ATTENDANCE_TREND]}
          title={t('dashboard.overview.attendanceTrend')}
        />
      </div>
    </PageShell>
  );
}
