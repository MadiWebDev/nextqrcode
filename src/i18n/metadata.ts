/**
 * hreflang helpers (Phase 8).
 *
 * The default locale is unprefixed (next-intl `localePrefix: 'as-needed'`),
 * so English lives at `englishPath` (e.g. `/wifi-qr-code-generator`) while
 * other locales live at `/<locale><localizedPath>` (e.g. `/es/wifi`).
 */
import { locales, defaultLocale } from './routing';

/**
 * Build an hreflang `languages` map for a page cluster.
 *
 * @param englishPath   Path of the English (default-locale) version.
 * @param localizedPath Path suffix used under every non-default locale.
 */
export function localizedLanguages(
  englishPath: string,
  localizedPath: string
): Record<string, string> {
  const cleanEnglish = englishPath === '/' ? '/' : englishPath.replace(/\/$/, '');
  const cleanLoc =
    localizedPath === '/'
      ? ''
      : localizedPath.startsWith('/')
        ? localizedPath
        : `/${localizedPath}`;
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = locale === defaultLocale ? cleanEnglish : `/${locale}${cleanLoc}`;
  }
  languages['x-default'] = cleanEnglish;
  return languages;
}
