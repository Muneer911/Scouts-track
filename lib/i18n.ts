/**
 * Internationalization utilities following Arabic Localization standards
 * 
 * Key principles:
 * - Use Western numerals (0-9) for all digital interfaces
 * - Maintain modern symbols: %, $, €, +, -, =, etc.
 * - Professional Modern tone for B2B SaaS applications
 */

/**
 * Format numbers for display in Arabic locale
 * Always uses Western numerals (0-9) per Arabic Localization skill guidelines
 * 
 * @param num - Number to format
 * @param locale - Locale code ('ar' or 'en')
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string with Western numerals
 * 
 * @example
 * formatNumber(1234567.89, 'ar') // "1,234,567.89"
 * formatNumber(99.9, 'ar', { style: 'percent' }) // "99.9%"
 */
export function formatNumber(
  num: number,
  locale: 'ar' | 'en' = 'en',
  options?: Intl.NumberFormatOptions
): string {
  // Always use Western numerals for Arabic (modern digital interface standard)
  // Use ar-SA locale but ensure Western numerals are displayed
  const localeCode = locale === 'ar' ? 'ar-SA' : 'en-US';
  
  return new Intl.NumberFormat(localeCode, {
    ...options,
    // Ensure Western numerals are used (default behavior in modern browsers)
    numberingSystem: 'latn', // Latin/Western numerals (0-9)
  }).format(num);
}

/**
 * Format percentage values
 * 
 * @param value - Percentage value (0-100)
 * @param locale - Locale code
 * @returns Formatted percentage string
 * 
 * @example
 * formatPercentage(99.9, 'ar') // "99.9%"
 */
export function formatPercentage(
  value: number,
  locale: 'ar' | 'en' = 'en'
): string {
  return formatNumber(value, locale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

/**
 * Format currency values
 * 
 * @param amount - Amount to format
 * @param locale - Locale code
 * @param currency - Currency code (default: 'SAR')
 * @returns Formatted currency string
 * 
 * @example
 * formatCurrency(99.99, 'ar') // "99.99 ر.س"
 */
export function formatCurrency(
  amount: number,
  locale: 'ar' | 'en' = 'en',
  currency: string = 'SAR'
): string {
  return formatNumber(amount, locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format large numbers with K/M suffixes
 * 
 * @param num - Number to format
 * @param locale - Locale code
 * @returns Formatted string with suffix
 * 
 * @example
 * formatCompact(50000, 'ar') // "50K+"
 * formatCompact(500, 'ar') // "500+"
 */
export function formatCompact(
  num: number,
  locale: 'ar' | 'en' = 'en'
): string {
  if (num >= 1000000) {
    return `${formatNumber(num / 1000000, locale, { maximumFractionDigits: 1 })}M+`;
  }
  if (num >= 1000) {
    return `${formatNumber(num / 1000, locale, { maximumFractionDigits: 0 })}K+`;
  }
  return `${formatNumber(num, locale, { maximumFractionDigits: 0 })}+`;
}

