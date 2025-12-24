'use client';

import { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageToggle } from './LanguageToggle';

export function Navigation() {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false); // Close menu on navigation
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = (
    <>
      <button
        onClick={() => scrollToSection('features')}
        className="text-gray-700 hover:text-scout-green transition-colors px-3 py-2 rounded-md text-sm font-medium md:text-base md:p-0"
      >
        {t('nav.features')}
      </button>
      <button
        onClick={() => scrollToSection('how-it-works')}
        className="text-gray-700 hover:text-scout-green transition-colors px-3 py-2 rounded-md text-sm font-medium md:text-base md:p-0"
      >
        {t('nav.howItWorks')}
      </button>
      <button
        onClick={() => scrollToSection('contact')}
        className="text-gray-700 hover:text-scout-green transition-colors px-3 py-2 rounded-md text-sm font-medium md:text-base md:p-0"
      >
        {t('nav.contact')}
      </button>
    </>
  );

  return (
    <nav className="fixed top-0 start-0 end-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <a href="/" className="text-xl font-bold text-scout-green">
              {t('nav.brand')}
            </a>
            <div className="hidden md:flex items-center gap-6">
              {navLinks}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <LanguageToggle />
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-scout-green hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-scout-green"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-start">{navLinks}</div>
          <div className="pt-4 pb-3 border-t border-gray-200 px-4">
            <LanguageToggle />
          </div>
        </div>
      )}
    </nav>
  );
}
