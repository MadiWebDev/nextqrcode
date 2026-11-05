'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { adsenseClient } from '@/lib/adsense';
import { siteConfig } from '@/config/site';

const CONSENT_KEY = 'qrs_cookie_consent';

/**
 * AdSense loader — renders one <Script> tag site-wide.
 *
 * Conditions (ALL must hold before the script loads):
 *  a) siteConfig.flags.ads is true
 *  b) NEXT_PUBLIC_ADSENSE_CLIENT (or _CLIENT_ID) is set
 *  c) The visitor has accepted cookie consent
 *
 * Must be rendered inside <body> (not <head>) so next/script's
 * "afterInteractive" strategy works correctly.  The layout places it
 * inside the ThemeProvider tree, after the <main> element.
 */
export function GoogleAdSense() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        setGranted(window.localStorage.getItem(CONSENT_KEY) === 'accepted');
      } catch {
        setGranted(false);
      }
    };
    check();
    window.addEventListener('qrs:consent-changed', check);
    return () => window.removeEventListener('qrs:consent-changed', check);
  }, []);

  const client = adsenseClient || siteConfig.adsense.client;
  if (!siteConfig.flags.ads || !client || !granted) return null;

  return (
    <Script
      id="google-adsense"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  );
}
