'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Types
export interface TeamFormData {
  name: string;
  region?: string | null;
  description?: string | null;
  age_range_min?: number | null;
  age_range_max?: number | null;
  meeting_schedule?: string | null;
  objectives?: string | null;
  max_capacity?: number | null;
}

export interface Team {
  id: string;
  name: string;
  region: string | null;
  description: string | null;
  supervisor_id: string;
  age_range_min: number | null;
  age_range_max: number | null;
  meeting_schedule: string | null;
  objectives: string | null;
  max_capacity: number | null;
  created_at: string;
}

export interface MedicalRecord {
  id: string;
  member_id: string;
  member_name?: string;
  blood_type: string | null;
  allergies: string | null;
  medical_conditions: string | null;
  last_checkup: string | null;
}

export interface PermissionSlip {
  id: string;
  member_id: string;
  member_name?: string;
  activity_name: string;
  activity_date: string | null;
  status: 'pending' | 'approved' | 'denied';
}

// Get all teams for the current user
export async function getTeams() {
  const supabase = await createClient();

  const { data: teams, error } = await supabase
    .from('team')
    .select('id, name, region, description')
    .order('name');

  if (error) {
    console.error('Error fetching teams:', error);
    return { teams: null, error: error.message };
  }

  return { teams, error: null };
}

// Get teams with member counts
export async function getTeamsWithMemberCounts() {
  const supabase = await createClient();

  const { data: teams, error: teamsError } = await supabase
    .from('team')
    .select('id, name, region, description')
    .order('name');

  if (teamsError) {
    console.error('Error fetching teams:', teamsError);
    return { teams: null, error: teamsError.message };
  }

  if (!teams) return { teams: [], error: null };

  // Fetch member counts
  const teamsWithCounts = await Promise.all(
    teams.map(async (team) => {
      const { count } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', team.id);

      return {
        ...team,
        supervisor: null,
        member_count: count || 0,
      };
    })
  );

  return { teams: teamsWithCounts, error: null };
}

// Get single team by ID
export async function getTeamById(teamId: string) {
  const supabase = await createClient();

  const { data: team, error } = await supabase
    .from('team')
    .select('*')
    .eq('id', teamId)
    .single();

  if (error) {
    console.error('Error fetching team:', error);
    return { team: null, error: error.message };
  }

  return { team, error: null };
}

// Get full team data including members, medical records, permission slips
export async function getTeamFullData(teamId: string) {
  const supabase = await createClient();

  // Fetch team
  const { data: team, error: teamError } = await supabase
    .from('team')
    .select('id, name, region, description')
    .eq('id', teamId)
    .single();

  if (teamError) {
    console.error('Error fetching team:', teamError);
    return { team: null, members: [], medicalRecords: [], permissionSlips: [], archivedReports: [], error: teamError.message };
  }

  // Fetch members
  const { data: members } = await supabase
    .from('team_members')
    .select('*')
    .eq('team_id', teamId)
    .order('full_name');

  const memberIds = members?.map(m => m.id) || [];

  let medicalRecords: MedicalRecord[] = [];
  let permissionSlips: PermissionSlip[] = [];

  if (memberIds.length > 0) {
    // Fetch medical records
    const { data: medicalData } = await supabase
      .from('medical_records')
      .select('*')
      .in('member_id', memberIds);

    if (medicalData) {
      medicalRecords = medicalData.map(record => ({
        ...record,
        member_name: members?.find(m => m.id === record.member_id)?.full_name || 'Unknown',
      }));
    }

    // Fetch permission slips
    const { data: slipsData } = await supabase
      .from('permission_slips')
      .select('*')
      .in('member_id', memberIds);

    if (slipsData) {
      permissionSlips = slipsData.map(slip => ({
        ...slip,
        member_name: members?.find(m => m.id === slip.member_id)?.full_name || 'Unknown',
      }));
    }
  }

  // Fetch archived reports
  const { data: archivedReports } = await supabase
    .from('team_health_reports')
    .select('*')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false });

  return {
    team,
    members: members || [],
    medicalRecords,
    permissionSlips,
    archivedReports: archivedReports || [],
    error: null,
  };
}

// Create new team
export async function createTeam(data: TeamFormData) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { team: null, error: 'Not authenticated' };
  }

  const { data: team, error } = await supabase
    .from('team')
    .insert({
      ...data,
      supervisor_id: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating team:', error);
    return { team: null, error: error.message };
  }

  revalidatePath('/dashboard/teams');
  return { team, error: null };
}

// Update team
export async function updateTeam(teamId: string, data: Partial<TeamFormData>) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('team')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', teamId);

  if (error) {
    console.error('Error updating team:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/teams');
  revalidatePath(`/dashboard/teams/${teamId}`);
  return { success: true, error: null };
}

// Delete team
export async function deleteTeam(teamId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('team')
    .delete()
    .eq('id', teamId);

  if (error) {
    console.error('Error deleting team:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/teams');
  return { success: true, error: null };
}

// Update permission slip status
export async function updatePermissionSlipStatus(
  slipId: string,
  status: 'pending' | 'approved' | 'denied'
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('permission_slips')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', slipId);

  if (error) {
    console.error('Error updating permission slip:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/dashboard/teams');
  return { success: true, error: null };
}
