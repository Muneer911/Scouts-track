'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function registerAction(formData: FormData) {
  const supabase = await createClient();

  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const password = (formData.get('password') as string)?.trim();

  if (!name || name.length < 2) {
    return { error: 'auth.register.errors.invalidName' };
  }
  if (!email || !email.includes('@')) {
    return { error: 'auth.register.errors.invalidEmail' };
  }
  if (!password || password.length < 6) {
    return { error: 'auth.register.errors.shortPassword' };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'auth.register.errors.emailExists' };
    }
    return { error: 'auth.register.errors.signupFailed' };
  }

  redirect('/auth/confirm');
}

