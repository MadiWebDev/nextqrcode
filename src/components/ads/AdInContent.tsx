'use client';

/**
 * In-content ad unit — place after the main tool or article body, never
 * above the fold.  Uses NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT.
 *
 * Renders nothing when the slot ID env var is empty.
 */
import { AdSenseSlot } from './AdSenseSlot';
import { adsenseSlots } from '@/lib/adsense';

export interface AdInContentProps {
  /** Page-level eligibility.  Pass false on error pages, login, etc. */
  eligible?: boolean;
}

export function AdInContent({ eligible = true }: AdInContentProps) {
  const slot = adsenseSlots.inContent;
  if (!slot) return null;
  return (
    <AdSenseSlot
      slot={slot}
      format="auto"
      responsive
      minHeight={90}
      eligible={eligible}
      label="Advertisement"
    />
  );
}
