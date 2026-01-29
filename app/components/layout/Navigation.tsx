'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { LanguageToggle } from '../ui/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

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
        className="text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg text-sm font-medium md:text-base md:p-0 hover:bg-muted md:hover:bg-transparent"
      >
        {t('nav.features')}
      </button>
      <button
        onClick={() => scrollToSection('how-it-works')}
        className="text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg text-sm font-medium md:text-base md:p-0 hover:bg-muted md:hover:bg-transparent"
      >
        {t('nav.howItWorks')}
      </button>
      <Link href="/pricing">
        <span className="text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg text-sm font-medium md:text-base md:p-0 hover:bg-muted md:hover:bg-transparent cursor-pointer">
          {t('nav.pricing')}
        </span>
      </Link>
      <button
        onClick={() => scrollToSection('contact')}
        className="text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg text-sm font-medium md:text-base md:p-0 hover:bg-muted md:hover:bg-transparent"
      >
        {t('nav.contact')}
      </button>
    </>
  );

  return (
    <nav className="fixed top-0 start-0 end-0 bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">{t('nav.brand')}</span>
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
                <Button className="text-sm">
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
                className="inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring"
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
        <div className="md:hidden border-t border-border bg-background" id="mobile-menu">
          <div className="px-4 pt-4 pb-3 space-y-1 flex flex-col">{navLinks}</div>
          <div className="pt-4 pb-4 border-t border-border px-4 space-y-3">
            <Link href="/login" className="block">
              <Button variant="ghost" className="w-full justify-start">
                {t('hero.ctaSecondary')}
              </Button>
            </Link>
            <Link href="/register" className="block">
              <Button className="w-full">
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

