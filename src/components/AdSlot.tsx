'use client';

/**
 * Legacy compatibility path for AdSlot.
 *
 * The canonical implementation now lives at src/components/ads/AdSlot.tsx
 * with a stricter props contract (consent-gated, lazy-loaded Adsterra).
 * This wrapper keeps the old `id`/`format` API working for existing page
 * imports by adapting them to the canonical component.
 */
import { AdSlot as CanonicalAdSlot } from './ads/AdSlot';
import type { AdSlotFormat } from './ads/AdSlot';

export type LegacyAdSlotFormat =
  'horizontal-banner' | 'medium-rectangle' | 'in-article' | 'sidebar';

export interface LegacyAdSlotProps {
  /** Slot identifier (also used as the AdSense data-ad-slot value). */
  id: string;
  /** Explicit AdSense ad-unit slot ID; falls back to `id` when omitted. */
  slotId?: string;
  format?: LegacyAdSlotFormat;
  className?: string;
  /** Reserved for local preview mode; currently renders nothing when true. */
  isTestMode?: boolean;
}

const FORMAT_MAP: Record<LegacyAdSlotFormat, AdSlotFormat> = {
  'horizontal-banner': 'leaderboard',
  'medium-rectangle': 'rectangle',
  'in-article': 'in-article',
  sidebar: 'sidebar',
};

export function AdSlot({
  id,
  slotId,
  format = 'horizontal-banner',
  isTestMode = false,
  // className is intentionally not destructured: the canonical component
  // never renders empty containers when gated off, and no caller passes
  // className (grep). Passing it remains type-legal via LegacyAdSlotProps.
}: LegacyAdSlotProps) {
  if (isTestMode) return null;
  return <CanonicalAdSlot slot={slotId || id} format={FORMAT_MAP[format]} />;
}
