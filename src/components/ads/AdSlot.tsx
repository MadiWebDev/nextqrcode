'use client';

import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/config/site';

/**
 * AdSense ad-slot placement formats.
 * - leaderboard: 728x90 responsive horizontal banner
 * - rectangle: 300x250 medium rectangle
 * - in-article: fluid in-content ad
 */
export type AdSlotFormat = 'leaderboard' | 'rectangle' | 'in-article';

export interface AdSlotProps {
  /** AdSense ad-unit slot ID (rendered as data-ad-slot). */
  slot: string;
  format: AdSlotFormat;
  /**
   * Page-level eligibility. When false the slot renders nothing.
   * Callers should pass false on ineligible surfaces (see docs/ADSENSE.md):
   * /r/*, /dashboard, /login, error pages, thin/failing-audit pages,
   * and any noindex page.
   */
  eligible?: boolean;
}

type ConsentState = 'granted' | 'denied' | 'unknown';

const CONSENT_KEY = 'qrs_cookie_consent';
const CONSENT_CHANGED_EVENT = 'qrs:consent-changed';

interface CustomConsentPreferences {
  advertising?: boolean;
}

/**
 * Read advertising consent from the custom cookie-consent banner's
 * localStorage value ('accepted' | 'rejected' | 'custom:<json>').
 */
function readAdvertisingConsent(): ConsentState {
  if (typeof window === 'undefined') return 'unknown';
  const raw = window.localStorage.getItem(CONSENT_KEY);
  if (raw === null) return 'unknown';
  if (raw === 'accepted') return 'granted';
  if (raw.startsWith('custom:')) {
    try {
      const prefs = JSON.parse(raw.slice('custom:'.length)) as CustomConsentPreferences;
      return prefs.advertising ? 'granted' : 'denied';
    } catch {
      return 'denied';
    }
  }
  // 'rejected' or anything unrecognized: no advertising consent.
  return 'denied';
}

interface FormatConfig {
  /** Reserved-space container classes (fixed space, zero CLS). */
  container: string;
  /** <ins> min-height matching the reserved space. */
  minHeight: string;
  adFormat: string;
  adLayout?: string;
  fullWidthResponsive?: string;
}

const FORMAT_CONFIG: Record<AdSlotFormat, FormatConfig> = {
  leaderboard: {
    container: 'w-full max-w-[728px] min-h-[90px]',
    minHeight: '90px',
    adFormat: 'horizontal',
    fullWidthResponsive: 'true',
  },
  rectangle: {
    container: 'w-full max-w-[300px] min-h-[250px]',
    minHeight: '250px',
    adFormat: 'rectangle',
  },
  'in-article': {
    container: 'w-full min-h-[280px]',
    minHeight: '280px',
    adFormat: 'fluid',
    adLayout: 'in-article',
  },
};

const ADSENSE_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
let adsenseScriptQueued = false;

/** Inject the AdSense script tag exactly once per page load. */
function ensureAdsenseScript(clientId: string): void {
  if (typeof document === 'undefined' || adsenseScriptQueued) return;
  if (
    document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')
  ) {
    adsenseScriptQueued = true;
    return;
  }
  const script = document.createElement('script');
  script.async = true;
  script.src = `${ADSENSE_SRC}?client=${encodeURIComponent(clientId)}`;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
  adsenseScriptQueued = true;
}

/** Push a fill request onto the adsbygoogle command queue. */
function pushAd(): void {
  try {
    const w = window as unknown as { adsbygoogle?: unknown[] };
    w.adsbygoogle = w.adsbygoogle || [];
    w.adsbygoogle.push({});
  } catch {
    // Ad blockers / failed script load: fail silently and keep layout stable.
  }
}

/**
 * Canonical AdSense slot component.
 *
 * Rendering gates (ALL must pass):
 *  1. siteConfig.flags.ads is true
 *  2. NEXT_PUBLIC_ADSENSE_CLIENT_ID is set (via siteConfig.adsense.client)
 *  3. eligible !== false (page-level eligibility)
 *  4. advertising consent granted (localStorage qrs_cookie_consent)
 *
 * When gated off, renders nothing — no empty divs. When eligible but the
 * visitor hasn't chosen yet (consent unknown), reserved fixed space is
 * rendered so accepting later doesn't shift layout. The AdSense script is
 * injected lazily and adsbygoogle is pushed only when the slot enters the
 * viewport (IntersectionObserver).
 */
export function AdSlot({ slot, format, eligible = true }: AdSlotProps) {
  const clientId = siteConfig.adsense.client;
  // Lazy initializers read external state (localStorage / feature support)
  // directly — SSR-safe via the typeof guards inside the readers.
  const [consent, setConsent] = useState<ConsentState>(() => readAdvertisingConsent());
  const [inView, setInView] = useState<boolean>(() => typeof IntersectionObserver === 'undefined');
  const containerRef = useRef<HTMLElement | null>(null);
  const pushedRef = useRef(false);

  // Re-check consent whenever the consent banner changes the stored value.
  useEffect(() => {
    const handleConsentChange = () => {
      pushedRef.current = false;
      setConsent(readAdvertisingConsent());
    };
    window.addEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
  }, []);

  const gated = siteConfig.flags.ads && eligible && clientId.length > 0;
  const showAd = gated && consent === 'granted';
  const reserveSpace = gated && consent === 'unknown';

  // Lazy-load trigger: only observe when an ad may actually render.
  useEffect(() => {
    if (!showAd || typeof IntersectionObserver === 'undefined') return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [showAd]);

  // Inject the AdSense script and push only once the slot is in view.
  useEffect(() => {
    if (!showAd || !inView || pushedRef.current) return;
    ensureAdsenseScript(clientId);
    pushedRef.current = true;
    pushAd();
  }, [showAd, inView, clientId]);

  if (!showAd && !reserveSpace) return null;

  const cfg = FORMAT_CONFIG[format];

  return (
    <aside
      ref={containerRef}
      aria-label="Advertisement"
      className={`mx-auto my-8 flex flex-col items-center justify-center overflow-hidden ${cfg.container}`}
    >
      <span className="mb-1 select-none text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60">
        Advertisement
      </span>
      {showAd && inView ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: cfg.minHeight }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format={cfg.adFormat}
          data-ad-layout={cfg.adLayout}
          data-full-width-responsive={cfg.fullWidthResponsive}
        />
      ) : (
        <span className="sr-only">Advertisement space reserved</span>
      )}
    </aside>
  );
}
