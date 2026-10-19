/**
 * next-intl routing configuration (Phase 8).
 *
 * `localePrefix: 'as-needed'` keeps the default locale (English) unprefixed,
 * so `/` stays English and only non-default locales get a prefix (`/es`, …).
 * Short-link routes `/r/*` and `/q/*` are excluded from locale handling in
 * `src/middleware.ts` and must never redirect.
 */
import { defineRouting } from 'next-intl/routing';

export const locales = [
  'en',
  'es',
  'fr',
  'de',
  'pt',
  'ar',
  'ur',
  'hi',
  'id',
  'tr',
  'ru',
  'ja',
  'ko',
  'zh',
] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = 'en';

/** Locales rendered right-to-left. */
export const rtlLocales: readonly AppLocale[] = ['ar', 'ur'];

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
});
