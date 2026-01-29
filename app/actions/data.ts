'use server';

import { createClient } from '@/lib/supabase/server';

export type DataResult<T> = {
  data: T | null;
  error: string | null;
};

export async function getOrganizations(): Promise<DataResult<{ id: string }[]>> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('organization')
    .select('id');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function getProfiles(): Promise<DataResult<{ id: string }[]>> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('id');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function getTeams(): Promise<DataResult<{ id: string }[]>> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('teams')
    .select('id');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function getScouts(): Promise<DataResult<{ id: string }[]>> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('scouts')
    .select('id');

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}
