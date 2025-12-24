'use server';

import { createSession } from '@/lib/auth';

export async function loginAction(formData: FormData) {
  const email = (formData.get('email') as string)?.trim();
  const password = (formData.get('password') as string)?.trim();

  if (!email || !email.includes('@')) {
    return { error: 'auth.login.errors.invalidEmail' };
  }
  if (!password || password.length < 6) {
    return { error: 'auth.login.errors.shortPassword' };
  }

  await createSession({ email, name: email.split('@')[0] });
  return { success: true };
}

