# Translation Files

This directory contains translation files following the **Arabic Localization Standards**.

## File Structure

- `en.json` - English translations (fallback language)
- `ar.json` - Arabic translations (Professional Modern tone for B2B SaaS)

## Key Principles

### Number Formatting
**Always use Western numerals (0-9) for all digital interfaces:**
- ✅ Correct: `"500+"`, `"99.9%"`, `"6 أحرف"`
- ❌ Incorrect: `"٥٠٠+"`, `"٩٩٫٩٪"`, `"٦ أحرف"`

**Rationale:** Modern Arabic digital interfaces use Western numerals for consistency, readability, and compatibility with technical content. Eastern Arabic numerals (٠١٢٣٤٥٦٧٨٩) are reserved for traditional/formal contexts.

### Symbols
**Maintain modern symbols:**
- ✅ `%` (percent), `+` (plus), `-` (minus), `=` (equals)
- ✅ `$`, `€`, `£` (currency symbols)
- ✅ All standard mathematical and technical symbols

### Tone
**Professional Modern Arabic** - Appropriate for B2B SaaS applications:
- Clear, concise language
- Modern terminology for tech concepts
- Professional distance while remaining accessible
- Avoids overly formal classical structures

### Translation Key Structure
- Use **camelCase** for keys: `forgotPassword`, `emailAddress`
- Group related translations: `auth.login.*`, `dashboard.teams.*`
- Be descriptive but concise: `loginSubmit` not `btn1`
- Consistent patterns: All buttons end with action: `save`, `cancel`, `submit`

## Usage

```typescript
import { useTranslation } from '@/app/hooks/useTranslation';

const { t } = useTranslation();
const title = t('hero.title');
```

## Number Formatting Utilities

For dynamic number formatting, use utilities from `lib/i18n.ts`:

```typescript
import { formatNumber, formatPercentage, formatCompact } from '@/lib/i18n';

formatNumber(1234567.89, 'ar'); // "1,234,567.89" (Western numerals)
formatPercentage(99.9, 'ar'); // "99.9%"
formatCompact(50000, 'ar'); // "50K+"
```

## Validation

- All translation keys must exist in both `en.json` and `ar.json`
- Numbers in Arabic translations must use Western numerals (0-9)
- Symbols must be modern and consistent
- Tone must remain Professional Modern throughout

