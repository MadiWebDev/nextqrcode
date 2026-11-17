'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  RTL_LOCALES,
  translate,
  type Locale,
  type MessageKey,
} from '../_lib/i18n';

interface LocaleValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
}

const LocaleContext = createContext<LocaleValue>({
  locale: 'en',
  setLocale: () => undefined,
  t: (key) => translate('en', key),
});

export function useLocale(): LocaleValue {
  return useContext(LocaleContext);
}

const STORAGE_KEY = 'socialcalendar:locale';

export default function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const timer = setTimeout(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'ur' || stored === 'ar' || stored === 'hi' || stored === 'en') {
        setLocaleState(stored);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
    return () => {
      document.documentElement.lang = 'en';
      document.documentElement.dir = 'ltr';
    };
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Preference is best-effort.
    }
  };

  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, t: (key) => translate(locale, key) }}
    >
      {children}
    </LocaleContext.Provider>
  );
}
