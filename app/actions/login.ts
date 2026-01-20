'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get('email') as string)?.trim();
  const password = (formData.get('password') as string)?.trim();

  if (!email || !email.includes('@')) {
    return { error: 'auth.login.errors.invalidEmail' };
  }
  if (!password || password.length < 6) {
    return { error: 'auth.login.errors.shortPassword' };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'auth.login.errors.invalidCredentials' };
  }

  redirect('/dashboard');
}

