'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { LanguageToggle } from '../ui/LanguageToggle';
import { Button } from '../ui/Button';

export function Navigation() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = (
    <>
      <button
        onClick={() => scrollToSection('features')}
        className="text-scout-gray hover:text-scout-green transition-colors px-3 py-2 rounded-lg text-sm font-medium md:text-base md:p-0 hover:bg-scout-neutral md:hover:bg-transparent"
      >
        {t('nav.features')}
      </button>
      <button
        onClick={() => scrollToSection('how-it-works')}
        className="text-scout-gray hover:text-scout-green transition-colors px-3 py-2 rounded-lg text-sm font-medium md:text-base md:p-0 hover:bg-scout-neutral md:hover:bg-transparent"
      >
        {t('nav.howItWorks')}
      </button>
      <button
        onClick={() => scrollToSection('contact')}
        className="text-scout-gray hover:text-scout-green transition-colors px-3 py-2 rounded-lg text-sm font-medium md:text-base md:p-0 hover:bg-scout-neutral md:hover:bg-transparent"
      >
        {t('nav.contact')}
      </button>
    </>
  );

  return (
    <nav className="fixed top-0 start-0 end-0 bg-white/80 backdrop-blur-md border-b border-scout-gray-lighter z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-2xl font-light text-scout-green tracking-tight">
              {t('nav.brand')}
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {navLinks}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-sm">
                  {t('hero.ctaSecondary')}
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" className="text-sm">
                  {t('hero.cta')}
                </Button>
              </Link>
            </div>
            <div className="hidden md:block">
              <LanguageToggle />
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-scout-gray hover:text-scout-green hover:bg-scout-neutral focus:outline-none focus:ring-2 focus:ring-inset focus:ring-scout-green"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-scout-gray-lighter bg-white" id="mobile-menu">
          <div className="px-4 pt-4 pb-3 space-y-1 flex flex-col">{navLinks}</div>
          <div className="pt-4 pb-4 border-t border-scout-gray-lighter px-4 space-y-3">
            <Link href="/login" className="block">
              <Button variant="ghost" className="w-full justify-start">
                {t('hero.ctaSecondary')}
              </Button>
            </Link>
            <Link href="/register" className="block">
              <Button variant="primary" className="w-full">
                {t('hero.cta')}
              </Button>
            </Link>
            <div className="pt-2">
              <LanguageToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

