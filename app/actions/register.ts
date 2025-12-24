'use server';

import { createSession } from '@/lib/auth';

export async function registerAction(formData: FormData) {
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

  await createSession({ email, name });
  return { success: true };
}

