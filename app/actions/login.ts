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

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'auth.login.errors.invalidCredentials' };
  }

  // Check user's onboarding status
  if (data?.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed, onboarded')
      .eq('id', data.user.id)
      .single()
    
    // Redirect based on onboarding progress
    if (!profile?.onboarding_completed) {
      redirect('/onboarding');
    }
    if (!profile?.onboarded) {
      redirect('/welcome');
    }
  }

  redirect('/dashboard');
}
