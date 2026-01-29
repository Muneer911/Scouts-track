'use server';

import { createClient } from '@/lib/supabase/server';

export async function getActivities() {
  const supabase = await createClient();

  const { data: activities, error } = await supabase
    .from('activities')
    .select(`
      id,
      title,
      description,
      activity_date,
      start_time,
      end_time,
      location,
      status,
      team_id,
      team:team(id, name),
      max_participants,
      required_equipment,
      notes,
      created_at
    `)
    .order('activity_date', { ascending: true });

  if (error) {
    console.error('Error fetching activities:', error);
    return { activities: null, error: error.message };
  }

  return { activities, error: null };
}

export async function getActivityById(activityId: string) {
  const supabase = await createClient();

  const { data: activity, error } = await supabase
    .from('activities')
    .select(`
      *,
      team:team(id, name, region),
      created_by_profile:profiles!activities_created_by_fkey(full_name)
    `)
    .eq('id', activityId)
    .single();

  if (error) {
    console.error('Error fetching activity:', error);
    return { activity: null, error: error.message };
  }

  return { activity, error: null };
}

export async function createActivity(formData: {
  title: string;
  description?: string;
  activity_date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  status: string;
  team_id?: string;
  max_participants?: number;
  required_equipment?: string[];
  notes?: string;
}) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { activity: null, error: 'Not authenticated' };
  }

  const { data: activity, error } = await supabase
    .from('activities')
    .insert({
      ...formData,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating activity:', error);
    return { activity: null, error: error.message };
  }

  return { activity, error: null };
}

export async function updateActivity(activityId: string, updates: {
  title?: string;
  description?: string;
  activity_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  status?: string;
  team_id?: string;
  max_participants?: number;
  required_equipment?: string[];
  notes?: string;
}) {
  const supabase = await createClient();

  const { data: activity, error } = await supabase
    .from('activities')
    .update(updates)
    .eq('id', activityId)
    .select()
    .single();

  if (error) {
    console.error('Error updating activity:', error);
    return { activity: null, error: error.message };
  }

  return { activity, error: null };
}

export async function deleteActivity(activityId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('activities')
    .delete()
    .eq('id', activityId);

  if (error) {
    console.error('Error deleting activity:', error);
    return { success: false, error: error.message };
  }

  return { success: true, error: null };
}

export async function getActivityParticipants(activityId: string) {
  const supabase = await createClient();

  const { data: participants, error } = await supabase
    .from('activity_participants')
    .select(`
      id,
      attendance_status,
      registered_at,
      member:team_members(id, full_name, date_of_birth)
    `)
    .eq('activity_id', activityId);

  if (error) {
    console.error('Error fetching participants:', error);
    return { participants: null, error: error.message };
  }

  return { participants, error: null };
}

export async function registerParticipant(activityId: string, memberId: string) {
  const supabase = await createClient();

  const { data: participant, error } = await supabase
    .from('activity_participants')
    .insert({
      activity_id: activityId,
      member_id: memberId,
      attendance_status: 'registered',
    })
    .select()
    .single();

  if (error) {
    console.error('Error registering participant:', error);
    return { participant: null, error: error.message };
  }

  return { participant, error: null };
}

export async function updateParticipantAttendance(
  participantId: string,
  attendanceStatus: 'registered' | 'attended' | 'absent' | 'excused'
) {
  const supabase = await createClient();

  const { data: participant, error } = await supabase
    .from('activity_participants')
    .update({ attendance_status: attendanceStatus })
    .eq('id', participantId)
    .select()
    .single();

  if (error) {
    console.error('Error updating attendance:', error);
    return { participant: null, error: error.message };
  }

  return { participant, error: null };
}
