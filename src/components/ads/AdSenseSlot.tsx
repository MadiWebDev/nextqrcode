'use client';

import { useEffect, useRef } from 'react';
import { siteConfig } from '@/config/site';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * REAL AdSense unit — put this in src/components/ads/AdSenseSlot.tsx
 *
 * Use ONLY after approval, and ONLY with a real numeric slot ID from
 * AdSense (Ad units > Create > copy the data-ad-slot number, e.g. "1234567890").
 * Do NOT pass page slugs like "bitcoin-qr-code-generator-top" as data-ad-slot —
 * AdSense ignores non-numeric / unknown slot IDs and the unit stays blank.
 *
 * Before approval: do NOT add manual units. The loader script alone +
 * Auto Ads in the AdSense dashboard is enough for the review.
 * After approval: max 3 units per page, never on /dashboard, /login,
 * /r/*, error or noindex pages.
 */
export type AdSenseFormat = 'horizontal' | 'rectangle' | 'in-article' | 'auto';

export function AdSenseSlot({
  slot,
  format = 'auto',
  label = 'Advertisement',
}: {
  slot: string; // numeric AdSense slot ID only
  format?: AdSenseFormat;
  label?: string;
}) {
  const ref = useRef<HTMLModElement>(null);
  const client = siteConfig.adsense.client;

  useEffect(() => {
    if (!client || !slot || !ref.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* AdSense not ready yet — blank unit, not a crash */
    }
  }, [client, slot]);

  if (!client || !slot) return null;

  const isInArticle = format === 'in-article';
  return (
    <aside aria-label={label} className="mx-auto my-8 w-full">
      <span className="mb-1 block text-center text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
        {label}
      </span>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={isInArticle ? 'fluid' : format === 'auto' ? 'auto' : format}
        data-ad-layout={isInArticle ? 'in-article' : undefined}
        data-full-width-responsive={format !== 'rectangle' ? 'true' : undefined}
      />
    </aside>
  );
}
