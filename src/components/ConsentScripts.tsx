'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const CONSENT_KEY = 'qrs_cookie_consent';

/**
 * Third-party scripts that must only load after the visitor accepts cookies.
 *
 * Reads the same `qrs_cookie_consent` localStorage key as GoogleAnalytics'
 * Consent Mode v2 setup. Renders nothing until consent is granted, and reacts
 * to the consent banner's accept action via the `storage` event.
 */
export function ConsentScripts() {
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
    window.addEventListener('storage', check);
    window.addEventListener('qrs:consent-changed', check);
    return () => {
      window.removeEventListener('storage', check);
      window.removeEventListener('qrs:consent-changed', check);
    };
  }, []);

  if (!granted) return null;

  return (
    <Script
      src="https://analytics.ahrefs.com/analytics.js"
      data-key="gJtIVr71KPTGk3DOKkCTKA"
      strategy="afterInteractive"
    />
  );
}
