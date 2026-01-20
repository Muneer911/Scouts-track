'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type Session = {
  email: string;
  name?: string;
  id: string;
};

export async function getSession(): Promise<Session | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.full_name || user.email?.split('@')[0],
  };
}

export async function requireAuth(): Promise<Session> {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}

