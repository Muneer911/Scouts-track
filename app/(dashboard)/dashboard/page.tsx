'use client';

import { PageShell } from '@/app/components/dashboard/PageShell';
import { UpcomingEvents } from '@/app/components/dashboard/UpcomingEvents';
import { AttendanceTrend } from '@/app/components/dashboard/AttendanceTrend';
import { useTranslation } from '@/app/hooks/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UsersRound, TrendingUp, Stethoscope } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { getDashboardStats, getUpcomingEvents, getAttendanceTrend } from '@/app/actions/dashboard';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';

import { DEMO_ATTENDANCE_TREND } from '@/lib/demoData';

export default function DashboardOverviewPage() {
  const { t } = useTranslation();

  const [stats, setStats] = useState<{ totalScouts: number; activeTeams: number; attendanceRate: number; healthReportsCount: number } | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [statsRes, eventsRes, trendRes] = await Promise.all([
        getDashboardStats(),
        getUpcomingEvents(),
        getAttendanceTrend()
      ]);
      setStats(statsRes);
      setEvents(eventsRes as any[]);
      setTrendData(trendRes);
      setLoading(false);
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

  if (loading || !stats) {
    return (
      <PageShell title={t('dashboard.sidebar.overview')}>
        <LoadingSpinner />
      </PageShell>
    );
  }

  return (
    <PageShell title={t('dashboard.sidebar.overview')}>
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Scouts */}
        <Card className="border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('dashboard.overview.totalScouts')}</p>
                <p className="text-3xl font-black text-slate-900">{stats.totalScouts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Teams */}
        <Card className="border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                <UsersRound className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('dashboard.overview.activeTeams')}</p>
                <p className="text-3xl font-black text-slate-900">{stats.activeTeams}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Rate */}
        <Card className="border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('dashboard.overview.attendanceRate')}</p>
                <p className="text-3xl font-black text-slate-900">{stats.attendanceRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical Reports */}
        <Card className="border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('dashboard.overview.healthReports')}</p>
                <p className="text-3xl font-black text-slate-900">{stats.healthReportsCount}</p>
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
          data={trendData.length > 0 ? trendData : [...DEMO_ATTENDANCE_TREND]}
          title={t('dashboard.overview.attendanceTrend')}
        />
      </div>
    </PageShell>
  );
}
