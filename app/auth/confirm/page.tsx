'use client';

import Link from 'next/link';
import { useTranslation } from '@/app/hooks/useTranslation';
import { LanguageToggle } from '@/app/components/ui/LanguageToggle';

export default function ConfirmPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-scout-neutral via-white to-scout-neutral/50 flex items-center justify-center px-4 relative">
      <div className="absolute top-0 start-0 w-64 h-64 bg-scout-green/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 end-0 w-96 h-96 bg-scout-gold/5 rounded-full blur-3xl -z-10" />
      
      <div className="absolute top-6 end-6">
        <LanguageToggle />
      </div>

      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-scout-gray-lighter/50 relative overflow-hidden text-center">
        <div className="absolute top-0 start-0 end-0 h-1 bg-gradient-to-e from-scout-green via-scout-green-lighter to-scout-gold/30" />
        
        <div className="mb-6">
          <div className="w-16 h-16 bg-scout-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-scout-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-light text-scout-green">{t('auth.confirm.title')}</h1>
          <p className="text-scout-gray mt-2">{t('auth.confirm.subtitle')}</p>
        </div>

        <p className="text-sm text-scout-gray mb-6">
          {t('auth.confirm.description')}
        </p>

        <Link 
          href="/login" 
          className="inline-block text-scout-green hover:underline text-sm"
        >
          {t('auth.confirm.backToLogin')}
        </Link>
      </div>
    </div>
  );
}
