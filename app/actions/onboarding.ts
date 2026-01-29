'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveOnboardingDataAction(data: {
  name: string;
  role: string;
  organizationName: string;
  organizationType: string;
  teamSize: string;
}) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Save onboarding data to user's profile
  const { error } = await supabase
    .from('profiles')
    .upsert({
      profile_uuid: user.id,
      full_name: data.name,
      role: data.role,
      organization_name: data.organizationName,
      organization_type: data.organizationType,
      team_size: data.teamSize,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'profile_uuid'
    });

  if (error) {
    console.error('Error saving onboarding data:', error);
    return { error: 'Failed to save onboarding data' };
  }

  return { success: true };
}

export async function completeOnboardingAction() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Update the user's profile to mark them as onboarded
  const { error } = await supabase
    .from('profiles')
    .update({
      onboarded: true,
      updated_at: new Date().toISOString(),
    })
    .eq('profile_uuid', user.id);

  if (error) {
    console.error('Error marking user as onboarded:', error);
    return { error: 'Failed to complete onboarding' };
  }

  revalidatePath('/dashboard');
  return { success: true };
}
