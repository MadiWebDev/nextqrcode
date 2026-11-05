'use client';

import { useEffect, useRef } from 'react';
import { adsenseClient } from '@/lib/adsense';
import { siteConfig } from '@/config/site';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdSenseSlotProps {
  /** AdSense data-ad-slot value (the numeric ID from your ad unit). */
  slot: string;
  /** data-ad-format — defaults to "auto". */
  format?: string;
  /** Whether to set data-full-width-responsive="true". Defaults to true. */
  responsive?: boolean;
  /**
   * Minimum reserved height (px) to prevent CLS while the ad loads.
   * Defaults to 90 (leaderboard height).
   */
  minHeight?: number;
  /**
   * Page-level eligibility gate. Pass false on error pages, /login,
   * /dashboard, /r/* redirects, and thin pages.
   */
  eligible?: boolean;
  /** Human-readable label shown above the unit (default "Advertisement"). */
  label?: string;
}

// ─── Dev-mode placeholder ─────────────────────────────────────────────────────

function DevPlaceholder({
  slot,
  minHeight,
  label,
}: {
  slot: string;
  minHeight: number;
  label: string;
}) {
  return (
    <aside
      aria-label={label}
      style={{ minHeight }}
      className="mx-auto my-6 flex w-full max-w-[728px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 p-4"
    >
      <span className="mb-1 select-none text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
        {label}
      </span>
      <span className="text-xs text-muted-foreground/50">
        Ad placeholder: slot {slot} (dev only)
      </span>
    </aside>
  );
}

// ─── Production unit (hooks live here) ───────────────────────────────────────

/**
 * Inner component that owns all hooks. Rendered only in production after all
 * gate checks pass, so hooks are never called conditionally.
 */
function AdSenseUnit({
  client,
  slot,
  format,
  responsive,
  minHeight,
  label,
}: {
  client: string;
  slot: string;
  format: string;
  responsive: boolean;
  minHeight: number;
  label: string;
}) {
  const pushed = useRef(false);

  useEffect(() => {
    // Reset the guard on slot change so re-initialisation works after
    // client-side navigation to a different page with the same component.
    pushed.current = false;
  }, [slot]);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle not yet loaded — the script picks up the slot on load
    }
  });

  return (
    <aside
      aria-label={label}
      className="mx-auto my-6 flex w-full flex-col items-center overflow-hidden"
      style={{ minHeight }}
    >
      <span className="mb-1 select-none self-start text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
        {label}
      </span>
      <ins
        className="adsbygoogle block w-full"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </aside>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

/**
 * Google AdSense display ad unit.
 *
 * Rendering gates (ALL must hold before any ad renders):
 *  1. siteConfig.flags.ads is true
 *  2. eligible !== false
 *  3. adsenseClient (NEXT_PUBLIC_ADSENSE_CLIENT or _CLIENT_ID) is set
 *  4. slot is a non-empty string
 *
 * Development:   renders a labeled placeholder box, never a real ad.
 * Production:    renders <ins class="adsbygoogle"> and calls push() once per mount.
 *
 * Anti-double-push: the `pushed` ref inside AdSenseUnit is reset on slot change
 * and guards the push call, so React Strict Mode double-invocations and
 * client-side navigations both behave correctly.
 */
export function AdSenseSlot({
  slot,
  format = 'auto',
  responsive = true,
  minHeight = 90,
  eligible = true,
  label = 'Advertisement',
}: AdSenseSlotProps) {
  const client = adsenseClient || siteConfig.adsense.client;
  const isDev = process.env.NODE_ENV !== 'production';

  // All gate checks before any render — no hooks called in outer component.
  if (!siteConfig.flags.ads || !eligible || !client || !slot) return null;

  if (isDev) {
    return <DevPlaceholder slot={slot} minHeight={minHeight} label={label} />;
  }

  return (
    <AdSenseUnit
      client={client}
      slot={slot}
      format={format}
      responsive={responsive}
      minHeight={minHeight}
      label={label}
    />
  );
}
