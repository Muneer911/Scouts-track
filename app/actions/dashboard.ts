'use server';

import { createClient } from '@/lib/supabase/server';

export async function getDashboardStats() {
  const supabase = await createClient();

  const median = (values: number[]) => {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    return sorted[mid];
  };

  try {
    const scoutsCountPromise = (async () => {
      const res = await supabase.from('team_members').select('id', { count: 'exact', head: true });
      if (!res.error) return res.count || 0;

      const fallback = await supabase.from('team_members').select('id', { count: 'exact', head: true });
      return fallback.count || 0;
    })();

    const teamsCountPromise = (async () => {
      const res = await supabase.from('team').select('id', { count: 'exact', head: true });
      if (!res.error) return res.count || 0;

      const fallback = await supabase.from('teams').select('id', { count: 'exact', head: true });
      return fallback.count || 0;
    })();

    const attendanceRatePromise = (async () => {
      const { data: members, error: membersError } = await supabase
        .from('team_members')
        .select('id, team_id');

      if (membersError || !members || members.length === 0) {
        return 0;
      }

      const memberIds = members.map((m) => m.id);
      const today = new Date().toISOString().slice(0, 10);

      const { data: participants, error: participantsError } = await supabase
        .from('activity_participants')
        .select(
          `
          attendance_status,
          member_id,
          activity:activities(activity_date)
        `
        )
        .in('member_id', memberIds);

      if (participantsError || !participants) {
        return 0;
      }

      const perMember = new Map<string, { attended: number; total: number }>();
      for (const id of memberIds) {
        perMember.set(id, { attended: 0, total: 0 });
      }

      for (const row of participants as any[]) {
        const activityDate = row.activity?.activity_date;
        if (!activityDate || activityDate > today) continue;

        const status = row.attendance_status as string;
        if (status === 'registered') continue;

        const agg = perMember.get(row.member_id);
        if (!agg) continue;

        agg.total += 1;
        if (status === 'attended') {
          agg.attended += 1;
        }
      }

      const rates = Array.from(perMember.values()).map((v) => (v.total === 0 ? 0 : (v.attended / v.total) * 100));
      return Math.round(median(rates));
    })();

    const [totalScouts, activeTeams, attendanceRate] = await Promise.all([
      scoutsCountPromise,
      teamsCountPromise,
      attendanceRatePromise,
    ]);

    return {
      totalScouts,
      activeTeams,
      attendanceRate,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { totalScouts: 0, activeTeams: 0, attendanceRate: 0 };
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

// TODO: Implement attendance trend calculation
// Pin: Calculate based on monthly attendance data
export async function getAttendanceTrend() {
  return [];
}
