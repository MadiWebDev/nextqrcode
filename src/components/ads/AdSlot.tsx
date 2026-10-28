'use client';

import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/config/site';

/**
 * Adsterra ad-slot placement formats.
 *
 * Format       Dimensions   Key
 * -----------  ----------   --------------------------------
 * leaderboard  728×90       0b50e2a443b8e19263c2a8f31d1a4ad7
 * rectangle    300×250      53ca9b859f00727dc4b4b7573f68f6ee
 * in-article   320×50       834df58583134c627c6054e559659cd5
 * sidebar      160×600      70ec1d9e24db496fb19361950b780e78
 * banner       468×60       a543917aebd8f86b003158f6ea030ba3
 * half-page    160×300      ec6ed5aef2a1cf1f138795b5593d0883
 * social-bar   overlay      (set NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_KEY)
 *
 * Embed script domain: https://bauval.org/22/<key>
 */
export type AdSlotFormat =
  | 'leaderboard' // 728×90
  | 'rectangle' // 300×250
  | 'in-article' // 320×50
  | 'sidebar' // 160×600
  | 'banner' // 468×60
  | 'half-page' // 160×300
  | 'social-bar'; // Social Bar overlay

export interface AdSlotProps {
  /** Unused — kept for backward-compat with existing callers that pass `slot`. */
  slot?: string;
  format: AdSlotFormat;
  /**
   * Page-level eligibility. When false the slot renders nothing.
   * Pass false on /r/*, /dashboard, /login, error pages, noindex pages.
   */
  eligible?: boolean;
}

// ---------------------------------------------------------------------------
// Consent
// ---------------------------------------------------------------------------

type ConsentState = 'granted' | 'denied' | 'unknown';

const CONSENT_KEY = 'qrs_cookie_consent';
const CONSENT_CHANGED_EVENT = 'qrs:consent-changed';

interface CustomConsentPreferences {
  advertising?: boolean;
}

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
  return 'denied';
}

// ---------------------------------------------------------------------------
// Adsterra config
// ---------------------------------------------------------------------------

interface AdsterraConfig {
  /** Hex key from the Adsterra embed code (atOptions.key). */
  key: string;
  width: number;
  height: number;
  /** Tailwind classes for the reserved-space container. */
  container: string;
}

const ADSTERRA_DOMAIN = 'https://bauval.org/22';

const ADSTERRA_CONFIG: Record<AdSlotFormat, AdsterraConfig> = {
  leaderboard: {
    key: '0b50e2a443b8e19263c2a8f31d1a4ad7',
    width: 728,
    height: 90,
    container: 'w-full max-w-[728px] min-h-[90px]',
  },
  rectangle: {
    key: '53ca9b859f00727dc4b4b7573f68f6ee',
    width: 300,
    height: 250,
    container: 'w-full max-w-[300px] min-h-[250px]',
  },
  'in-article': {
    key: '834df58583134c627c6054e559659cd5',
    width: 320,
    height: 50,
    container: 'w-full max-w-[320px] min-h-[50px]',
  },
  sidebar: {
    key: '70ec1d9e24db496fb19361950b780e78',
    width: 160,
    height: 600,
    container: 'w-full max-w-[160px] min-h-[600px]',
  },
  banner: {
    key: 'a543917aebd8f86b003158f6ea030ba3',
    width: 468,
    height: 60,
    container: 'w-full max-w-[468px] min-h-[60px]',
  },
  'half-page': {
    key: 'ec6ed5aef2a1cf1f138795b5593d0883',
    width: 160,
    height: 300,
    container: 'w-full max-w-[160px] min-h-[300px]',
  },
  'social-bar': {
    // Social Bar key — set NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_KEY in .env
    key: process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_KEY ?? '',
    width: 0,
    height: 0,
    container: 'w-full',
  },
};

// ---------------------------------------------------------------------------
// Script injection (once per key per page load)
// ---------------------------------------------------------------------------

const injectedKeys = new Set<string>();

/**
 * Injects the two-script Adsterra banner embed:
 *
 *   <script>atOptions = { 'key': '...', 'format': 'iframe', ... };</script>
 *   <script src="https://bauval.org/22/<key>"></script>
 */
function injectBannerScript(cfg: AdsterraConfig): void {
  if (typeof document === 'undefined') return;
  if (!cfg.key || injectedKeys.has(cfg.key)) return;
  injectedKeys.add(cfg.key);

  // 1. atOptions config
  const configScript = document.createElement('script');
  configScript.type = 'text/javascript';
  configScript.text = [
    'atOptions = {',
    `  'key' : '${cfg.key}',`,
    `  'format' : 'iframe',`,
    `  'height' : ${cfg.height},`,
    `  'width' : ${cfg.width},`,
    `  'params' : {}`,
    '};',
  ].join('\n');
  document.head.appendChild(configScript);

  // 2. Invoke script
  const invokeScript = document.createElement('script');
  invokeScript.type = 'text/javascript';
  invokeScript.async = true;
  invokeScript.src = `${ADSTERRA_DOMAIN}/${cfg.key}`;
  document.head.appendChild(invokeScript);
}

/**
 * Social Bar uses a single script tag with no atOptions block.
 * Adsterra places the bar automatically once the script loads.
 */
function injectSocialBarScript(cfg: AdsterraConfig): void {
  if (typeof document === 'undefined') return;
  if (!cfg.key || injectedKeys.has(cfg.key)) return;
  injectedKeys.add(cfg.key);

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = `${ADSTERRA_DOMAIN}/${cfg.key}`;
  document.body.appendChild(script);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Canonical Adsterra slot component.
 *
 * Rendering gates (ALL must pass):
 *  1. siteConfig.flags.ads === true
 *  2. eligible !== false
 *  3. advertising consent granted (localStorage qrs_cookie_consent)
 *
 * When gated off → renders nothing (no empty divs, no CLS).
 * When consent is unknown → renders a fixed-size placeholder to reserve
 *   space so accepting later doesn't shift the layout.
 * Scripts are injected lazily — only once the slot scrolls into view
 *   (IntersectionObserver with 200 px root margin).
 */
export function AdSlot({ format, eligible = true }: AdSlotProps) {
  const [consent, setConsent] = useState<ConsentState>(() => readAdvertisingConsent());
  const [inView, setInView] = useState<boolean>(() => typeof IntersectionObserver === 'undefined');
  const containerRef = useRef<HTMLElement | null>(null);
  const injectedRef = useRef(false);

  // Re-check consent whenever the banner fires a change event.
  useEffect(() => {
    const handleConsentChange = () => {
      injectedRef.current = false;
      setConsent(readAdvertisingConsent());
    };
    window.addEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, handleConsentChange);
  }, []);

  const gated = siteConfig.flags.ads && eligible;
  const showAd = gated && consent === 'granted';
  const reserveSpace = gated && consent === 'unknown';

  // Observe container; flip inView when it enters the viewport.
  useEffect(() => {
    if (!showAd || typeof IntersectionObserver === 'undefined') return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [showAd]);

  // Inject scripts once the slot is in view.
  useEffect(() => {
    if (!showAd || !inView || injectedRef.current) return;
    injectedRef.current = true;
    const cfg = ADSTERRA_CONFIG[format];
    if (format === 'social-bar') {
      injectSocialBarScript(cfg);
    } else {
      injectBannerScript(cfg);
    }
  }, [showAd, inView, format]);

  if (!showAd && !reserveSpace) return null;

  const cfg = ADSTERRA_CONFIG[format];

  // Social Bar is a floating full-viewport overlay — no visible wrapper.
  if (format === 'social-bar') {
    return showAd ? <span aria-hidden="true" data-adsterra-social-bar /> : null;
  }

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
        /*
         * Adsterra's invoke.js writes an <iframe> into the page immediately
         * after its parent <script> tag. Because we inject dynamically, the
         * iframe lands inside <head> — but the scripts themselves trigger
         * atOptions which Adsterra reads globally. The rendered iframe appears
         * in the DOM where Adsterra places it; this div acts as a size anchor
         * so the surrounding layout doesn't collapse while the iframe loads.
         */
        <div
          data-adsterra-key={cfg.key}
          style={{
            width: cfg.width,
            height: cfg.height,
            maxWidth: '100%',
          }}
        />
      ) : (
        <span className="sr-only">Advertisement space reserved</span>
      )}
    </aside>
  );
}
