'use client';

import { useTransition, useState } from 'react';
import Link from 'next/link';
import { registerAction } from '@/app/actions/register';
import { Button } from '@/app/components/ui/Button';
import { LanguageToggle } from '@/app/components/ui/LanguageToggle';
import { useTranslation } from '@/app/hooks/useTranslation';

export default function RegisterPage() {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await registerAction(formData);
      if (result?.error) {
        setError(t(result.error));
      } else {
        window.location.href = '/dashboard';
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-scout-neutral via-white to-scout-neutral/50 flex items-center justify-center px-4 relative">
      {/* Decorative accent */}
      <div className="absolute top-0 start-0 w-64 h-64 bg-scout-green/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 end-0 w-96 h-96 bg-scout-gold/5 rounded-full blur-3xl -z-10" />
      
      <div className="absolute top-6 start-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-scout-gray hover:text-scout-green transition-colors group">
          <svg className="w-4 h-4 rtl:rotate-180 transition-transform group-hover:-translate-x-1 rtl:group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>{t('auth.backToHome')}</span>
        </Link>
      </div>
      
      <div className="absolute top-6 end-6">
        <LanguageToggle />
      </div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-scout-gray-lighter/50 relative overflow-hidden">
        {/* Subtle accent border */}
        <div className="absolute top-0 start-0 end-0 h-1 bg-gradient-to-e from-scout-green via-scout-green-lighter to-scout-gold/30" />
        <div className="mb-8">
          <h1 className="text-2xl font-light text-scout-green">{t('auth.register.title')}</h1>
          <p className="text-scout-gray mt-2">{t('auth.register.subtitle')}</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm text-scout-gray text-start mb-2" htmlFor="name">
              {t('auth.register.name')}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              dir="auto"
              className="w-full rounded-lg border border-scout-gray-lighter bg-white ps-4 pe-4 py-3 text-scout-green focus:outline-none focus:ring-2 focus:ring-scout-green/30 focus:border-scout-green-lighter transition text-start hover:border-scout-green/30"
              placeholder="Aisha Al Saud"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-scout-gray text-start mb-2" htmlFor="email">
              {t('auth.register.email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              dir="auto"
              className="w-full rounded-lg border border-scout-gray-lighter bg-white ps-4 pe-4 py-3 text-scout-green focus:outline-none focus:ring-2 focus:ring-scout-green/30 focus:border-scout-green-lighter transition text-start hover:border-scout-green/30"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-scout-gray text-start mb-2" htmlFor="password">
              {t('auth.register.password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              dir="auto"
              className="w-full rounded-lg border border-scout-gray-lighter bg-white ps-4 pe-4 py-3 text-scout-green focus:outline-none focus:ring-2 focus:ring-scout-green/30 focus:border-scout-green-lighter transition text-start hover:border-scout-green/30"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full py-3 bg-gradient-to-r from-scout-green to-scout-green-light hover:from-scout-green-light hover:to-scout-green-accent shadow-md hover:shadow-lg transition-all" disabled={pending}>
            {pending ? t('auth.register.submitting') : t('auth.register.submit')}
          </Button>
        </form>

        <div className="mt-6 text-sm text-scout-gray flex items-center justify-between">
          <span>{t('auth.register.hasAccount')}</span>
          <Link href="/login" className="text-scout-green hover:underline">
            {t('auth.register.signIn')}
          </Link>
        </div>
      </div>
    </div>
  );
}
