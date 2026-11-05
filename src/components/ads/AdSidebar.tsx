'use client';

/**
 * Sidebar ad unit — sticky on desktop, hidden on mobile to comply with
 * AdSense placement policy (no ads covering/obscuring content on small screens).
 *
 * Uses NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR.
 * Renders nothing when the slot ID env var is empty.
 */
import { AdSenseSlot } from './AdSenseSlot';
import { adsenseSlots } from '@/lib/adsense';

export interface AdSidebarProps {
  /** Page-level eligibility.  Pass false on error pages, login, etc. */
  eligible?: boolean;
}

export function AdSidebar({ eligible = true }: AdSidebarProps) {
  const slot = adsenseSlots.sidebar;
  if (!slot) return null;
  return (
    /* hidden on mobile (< md), sticky on desktop */
    <div className="hidden md:block sticky top-6 self-start">
      <AdSenseSlot
        slot={slot}
        format="auto"
        responsive
        minHeight={250}
        eligible={eligible}
        label="Advertisement"
      />
    </div>
  );
}
