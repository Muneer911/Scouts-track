'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

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
    .from('attendance')
    .select(`
      id,
      status,
      created_at,
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
    .from('attendance')
    .insert({
      activity_id: activityId,
      member_id: memberId,
      status: 'absent', // Default status when registered
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
  status: 'present' | 'absent' | 'late' | 'excused' | 'registered' | 'attended'
) {
  const supabase = await createClient();

  const { data: participant, error } = await supabase
    .from('attendance')
    .update({ status: status })
    .eq('id', participantId)
    .select()
    .single();

  if (error) {
    console.error('Error updating attendance:', error);
    return { participant: null, error: error.message };
  }

  revalidatePath(`/dashboard/activities/${participant.activity_id}/attendance`);
  return { participant, error: null };
}

export async function saveAttendance(activityId: string, records: { memberId: string; status: string }[]) {
  const supabase = await createClient();

  // Since we don't know if (activity_id, member_id) is unique constrained in DB,
  // we'll handle upsert manually or assume constraint properties.
  // For safety, let's try UPSERT on conflict if we assume schema is good, 
  // OR loop through. Looping is slow but safe if small numbers.
  // Better: Fetch existing for this activity.

  const { data: existing } = await supabase
    .from('attendance')
    .select('id, member_id')
    .eq('activity_id', activityId);

  const existingMap = new Map(existing?.map(e => [e.member_id, e.id]));

  const updates = [];
  const inserts = [];

  for (const r of records) {
    if (existingMap.has(r.memberId)) {
      updates.push({
        id: existingMap.get(r.memberId),
        status: r.status,
        updated_at: new Date().toISOString()
      });
    } else {
      inserts.push({
        activity_id: activityId,
        member_id: r.memberId,
        status: r.status,
        date: new Date().toISOString().slice(0, 10)
      });
    }
  }

  if (inserts.length > 0) {
    const { error: insertError } = await supabase.from('attendance').insert(inserts);
    if (insertError) return { error: insertError.message };
  }

  if (updates.length > 0) {
    for (const u of updates) {
      await supabase.from('attendance').update({ status: u.status }).eq('id', u.id);
    }
  }

  revalidatePath(`/dashboard/activities/${activityId}/attendance`);
  return { success: true };
}
