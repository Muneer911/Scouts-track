'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateTeamMember(memberId: string, data: {
  full_name?: string;
  date_of_birth?: string | null;
  parent_name?: string | null;
  parent_phone?: string | null;
  parent_email?: string | null;
  emergency_contact?: string | null;
  emergency_phone?: string | null;
  notes?: string | null;
}) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('team_members')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', memberId);

    if (error) throw error;

    revalidatePath('/dashboard/teams');
    return { success: true };
  } catch (error) {
    console.error('Error updating team member:', error);
    return { success: false, error: 'Failed to update member' };
  }
}

export async function updatePermissionSlipStatus(slipId: string, status: 'pending' | 'approved' | 'denied') {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from('permission_slips')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', slipId);

    if (error) throw error;

    revalidatePath('/dashboard/teams');
    return { success: true };
  } catch (error) {
    console.error('Error updating permission slip:', error);
    return { success: false, error: 'Failed to update status' };
  }
}
