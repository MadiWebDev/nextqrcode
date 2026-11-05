'use client';

import Script from 'next/script';
import { siteConfig } from '@/config/site';

/**
 * FIXED AdSense loader — replaces src/components/GoogleAdSense.tsx
 *
 * WHY THE OLD ONE FAILED APPROVAL / SHOWED NO ADS:
 * The old component returned null unless localStorage 'qrs_cookie_consent'
 * === 'accepted'. Googlebot, the AdSense crawler (Mediapartners-Google) and
 * a first-time reviewer never click "Accept All", so adsbygoogle.js NEVER
 * loaded for them — AdSense could not verify the code on the site.
 *
 * FIX: Load the script whenever a client ID is configured. Consent Mode v2
 * (src/lib/gtag.ts) still controls PERSONALISATION — default denied until
 * the visitor accepts — but it must not gate the script itself.
 * Auto Ads (enabled in the AdSense dashboard) needs only this script.
 */
export function GoogleAdSense() {
  const client = siteConfig.adsense.client;
  if (!siteConfig.flags.ads || !client) return null;

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
