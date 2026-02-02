'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getDashboardStats() {
  const supabase = await createClient();

  try {
    const [
      { count: totalScouts },
      { count: activeTeams },
      { count: totalAttendance },
      { count: presentAttendance },
      { count: healthReportsCount }
    ] = await Promise.all([
      supabase.from('team_members').select('*', { count: 'exact', head: true }),
      supabase.from('team').select('*', { count: 'exact', head: true }),
      supabase.from('attendance').select('*', { count: 'exact', head: true }),
      supabase.from('attendance').select('*', { count: 'exact', head: true }).eq('status', 'present'),
      supabase.from('team_health_reports').select('*', { count: 'exact', head: true })
    ]);

    const attendanceRate = totalAttendance ? Math.round((presentAttendance || 0) / totalAttendance * 100) : 0;

    return {
      totalScouts: totalScouts || 0,
      activeTeams: activeTeams || 0,
      attendanceRate,
      healthReportsCount: healthReportsCount || 0
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { totalScouts: 0, activeTeams: 0, attendanceRate: 0, healthReportsCount: 0 };
  }
}

export async function getUpcomingEvents() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .gte('activity_date', new Date().toISOString().slice(0, 10))
      .order('activity_date', { ascending: true })
      .limit(5);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}

// Calculate based on last 6 months attendance data
export async function getAttendanceTrend() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('attendance')
      .select('status, date')
      .order('date', { ascending: true });

    if (error || !data) return [];

    // Group by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trendMap = new Map<string, { month: string; rate: number; total: number; present: number }>();

    data.forEach(item => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthLabel = months[date.getMonth()];

      const current = trendMap.get(monthKey) || { month: monthLabel, rate: 0, total: 0, present: 0 };
      current.total += 1;
      if (item.status === 'present') current.present += 1;
      current.rate = Math.round((current.present / current.total) * 100);
      trendMap.set(monthKey, current);
    });

    return Array.from(trendMap.values()).slice(-6);
  } catch (error) {
    console.error('Error fetching attendance trend:', error);
    return [];
  }
}

export async function revalidateDashboard() {
  revalidatePath('/dashboard');
}
