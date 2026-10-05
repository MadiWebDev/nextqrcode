'use client';

import React from 'react';

interface AdSlotProps {
  id: string;
  format?: 'horizontal-banner' | 'medium-rectangle' | 'in-article' | 'sidebar';
  className?: string;
  isTestMode?: boolean;
}

/**
 * AdSlot Component
 * - Preserves strict dimensions (zero Cumulative Layout Shift)
 * - Safe margin isolation (prevents accidental clicks on buttons or tools)
 * - Inactive by default until Google AdSense account approval
 */
export function AdSlot({
  id,
  format = 'horizontal-banner',
  className = '',
  isTestMode = false,
}: AdSlotProps) {
  // Dimensions strictly locked to standard IAB ad units
  const dimensions = {
    'horizontal-banner': 'min-h-[90px] sm:min-h-[100px] w-full max-w-[728px]',
    'medium-rectangle': 'min-h-[250px] w-full max-w-[300px]',
    'in-article': 'min-h-[280px] w-full max-w-[650px]',
    'sidebar': 'min-h-[600px] w-full max-w-[300px]',
  }[format];

  return (
    <aside
      id={`ad-container-${id}`}
      aria-label="Advertisement"
      className={`my-8 mx-auto flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-border/50 bg-slate-50/50 dark:bg-slate-900/30 p-2 text-center transition-all ${dimensions} ${className}`}
    >
      <div className="w-full flex justify-between items-center px-2 py-0.5 text-[10px] tracking-wider uppercase text-muted-foreground/60 select-none">
        <span>Advertisement</span>
        <span>Sponsored</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-3 text-xs text-muted-foreground/70">
        {isTestMode ? (
          <div className="flex flex-col items-center gap-1">
            <span className="font-semibold text-foreground/80">Ad Slot Reserved</span>
            <span className="text-[11px]">Format: {format} | ID: {id}</span>
            <span className="text-[10px] text-muted-foreground">Zero-CLS placeholder. Live ads activate upon AdSense verification.</span>
          </div>
        ) : (
          <div className="hidden" aria-hidden="true">
            {/* Live Google AdSense script placeholder (injected post-approval) */}
            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
              data-ad-slot={id}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        )}
      </div>
    </aside>
  );
}
