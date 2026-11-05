'use client';

/**
 * FooterAdBanner — injected once inside AppFooter so every page in the app
 * gets an AdSense placement without touching individual page files.
 *
 * Excluded paths (no ads per policy):
 *   /dashboard*   — authenticated user area
 *   /login*       — auth pages
 *   /r/*          — scan-redirect short links (thin, no content)
 *   /api/*        — API routes (should never render HTML, guard anyway)
 *
 * The ad sits above the footer nav, clearly separated from navigation links,
 * and is always below the fold — never above content.
 */

import { usePathname } from 'next/navigation';
import { AdSenseSlot } from './AdSenseSlot';
import { adsenseSlots } from '@/lib/adsense';

/** Pathname prefixes where ads must never appear. */
const EXCLUDED_PREFIXES = ['/dashboard', '/login', '/r/', '/api/'];

export function FooterAdBanner() {
  const pathname = usePathname();

  // Strip locale prefix (e.g. /es/dashboard → /dashboard) for the check.
  // next-intl uses /[locale]/... for non-default locales.
  const bare = pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?(?=\/)/, '');

  const excluded = EXCLUDED_PREFIXES.some(
    (prefix) => bare === prefix.replace(/\/$/, '') || bare.startsWith(prefix)
  );

  if (excluded) return null;

  // Use in-content slot; fall back to sidebar slot if that's all that's set.
  const slot = adsenseSlots.inContent || adsenseSlots.sidebar;
  if (!slot) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <AdSenseSlot
        slot={slot}
        format="auto"
        responsive
        minHeight={90}
        eligible={true}
        label="Advertisement"
      />
    </div>
  );
}
