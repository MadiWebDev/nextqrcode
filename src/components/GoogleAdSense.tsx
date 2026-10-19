'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { siteConfig } from '@/config/site';

const CONSENT_KEY = 'qrs_cookie_consent';

/**
 * AdSense loader script.
 *
 * Renders only when ALL of these hold:
 *  a) the `ads` feature flag is on,
 *  b) NEXT_PUBLIC_ADSENSE_CLIENT is set,
 *  c) the visitor granted cookie consent (EEA/UK/CH requirement).
 * Otherwise renders nothing. Full placement/eligibility policy lands in Phase 7.
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

  const client = siteConfig.adsense.client;
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
