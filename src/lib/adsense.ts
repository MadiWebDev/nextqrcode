/**
 * Google AdSense configuration helper.
 *
 * Resolves the publisher client ID from NEXT_PUBLIC_ADSENSE_CLIENT,
 * falling back to NEXT_PUBLIC_ADSENSE_CLIENT_ID.  All values degrade
 * gracefully to empty strings so callers can gate on truthiness alone.
 *
 * Usage:
 *   import { adsenseClient, adsenseSlots } from '@/lib/adsense';
 *   if (adsenseClient) { ... }
 */

/** ca-pub-XXXXXXXXXXXXXXXX — empty when not configured. */
export const adsenseClient: string =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '';

export const adsenseSlots = {
  /** Ad unit placed after main tool / article body (below the fold). */
  inContent: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT || '',
  /** Ad unit shown in the sidebar, sticky on desktop. */
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '',
} as const;

/** True when the AdSense script can be loaded. */
export const isAdsenseConfigured = Boolean(adsenseClient);
