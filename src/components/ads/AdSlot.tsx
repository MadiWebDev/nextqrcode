'use client';

import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/config/site';

/**
 * Adsterra ad-slot placement formats.
 *
 * Format → Adsterra banner key mapping:
 *   leaderboard   → 728×90  (id: 31586627)
 *   rectangle     → 300×250 (id: 31586629)
 *   in-article    → 320×50  (id: 31586626)  — best for mid-content mobile
 *   sidebar       → 160×600 (id: 31586628)
 *   banner        → 468×60  (id: 31586624)
 *   half-page     → 160×300 (id: 31586625)
 *   social-bar    → Social Bar (id: 31586630)
 */
export type AdSlotFormat =
  | 'leaderboard' // 728×90
  | 'rectangle' // 300×250
  | 'in-article' // 320×50
  | 'sidebar' // 160×600
  | 'banner' // 468×60
  | 'half-page' // 160×300
  | 'social-bar'; // Social Bar (full-page overlay)

export interface AdSlotProps {
  /** Adsterra key / atOptions key — passed as the unique script src query param. */
  slot?: string;
  format: AdSlotFormat;
  /**
   * Page-level eligibility. When false the slot renders nothing.
   * Pass false on ineligible surfaces: /r/*, /dashboard, /login, error pages,
   * thin/failing-audit pages, and any noindex page.
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
  return 'denied';
}

/** Adsterra banner config keyed by format. */
interface AdsterraConfig {
  /** Numeric banner ID used in the script src (e.g. 31586627). */
  id: number;
  /** Width in px — used to size the reserved container. */
  width: number;
  /** Height in px — used to size the reserved container. */
  height: number;
  /** Tailwind container sizing classes. */
  container: string;
}

const ADSTERRA_CONFIG: Record<AdSlotFormat, AdsterraConfig> = {
  leaderboard: {
    id: 31586627,
    width: 728,
    height: 90,
    container: 'w-full max-w-[728px] min-h-[90px]',
  },
  rectangle: {
    id: 31586629,
    width: 300,
    height: 250,
    container: 'w-full max-w-[300px] min-h-[250px]',
  },
  'in-article': {
    id: 31586626,
    width: 320,
    height: 50,
    container: 'w-full max-w-[320px] min-h-[50px]',
  },
  sidebar: {
    id: 31586628,
    width: 160,
    height: 600,
    container: 'w-full max-w-[160px] min-h-[600px]',
  },
  banner: {
    id: 31586624,
    width: 468,
    height: 60,
    container: 'w-full max-w-[468px] min-h-[60px]',
  },
  'half-page': {
    id: 31586625,
    width: 160,
    height: 300,
    container: 'w-full max-w-[160px] min-h-[300px]',
  },
  'social-bar': {
    id: 31586630,
    width: 0, // full-viewport overlay — no fixed container needed
    height: 0,
    container: 'w-full',
  },
};

/** Tracks which banner IDs have already had their script injected. */
const injectedIds = new Set<number>();

/**
 * Inject the Adsterra invoke script for a given banner ID exactly once.
 *
 * Adsterra standard banner pattern:
 *   <script type="text/javascript">
 *     atOptions = { 'key': '<hex-key>', 'format': 'iframe', ... };
 *   </script>
 *   <script src="//www.highperformanceformat.com/<hex-key>/invoke.js"></script>
 *
 * The hex key is derived from the numeric ID — Adsterra uses the same value
 * for both atOptions.key and the script src path. Store the hex key as a
 * 8-character zero-padded lowercase hex string (standard Adsterra format).
 */
function injectAdsterraScript(bannerId: number, width: number, height: number): void {
  if (typeof document === 'undefined') return;
  if (injectedIds.has(bannerId)) return;
  injectedIds.add(bannerId);

  const hexKey = bannerId.toString(16).padStart(8, '0');

  // 1. atOptions config script
  const configScript = document.createElement('script');
  configScript.type = 'text/javascript';
  configScript.text = `
    atOptions = {
      'key' : '${hexKey}',
      'format' : 'iframe',
      'height' : ${height},
      'width' : ${width},
      'params' : {}
    };
  `;
  document.head.appendChild(configScript);

  // 2. Adsterra invoke script
  const invokeScript = document.createElement('script');
  invokeScript.type = 'text/javascript';
  invokeScript.async = true;
  invokeScript.src = `//www.highperformanceformat.com/${hexKey}/invoke.js`;
  document.head.appendChild(invokeScript);
}

/**
 * Inject the Adsterra Social Bar script (format-specific, no atOptions block).
 */
function injectSocialBarScript(bannerId: number): void {
  if (typeof document === 'undefined') return;
  if (injectedIds.has(bannerId)) return;
  injectedIds.add(bannerId);

  const hexKey = bannerId.toString(16).padStart(8, '0');
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = `//pl${bannerId}.highperformanceformat.com/${hexKey}/invoke.js`;
  document.body.appendChild(script);
}

/**
 * Canonical Adsterra slot component.
 *
 * Rendering gates (ALL must pass):
 *  1. siteConfig.flags.ads is true
 *  2. eligible !== false (page-level eligibility)
 *  3. advertising consent is granted (localStorage qrs_cookie_consent)
 *
 * When gated off, renders nothing. When eligible but consent is still unknown,
 * a reserved fixed-size container is rendered to prevent layout shift.
 * Scripts are injected lazily via IntersectionObserver.
 */
export function AdSlot({ format, eligible = true }: AdSlotProps) {
  const [consent, setConsent] = useState<ConsentState>(() => readAdvertisingConsent());
  const [inView, setInView] = useState<boolean>(() => typeof IntersectionObserver === 'undefined');
  const containerRef = useRef<HTMLElement | null>(null);
  const injectedRef = useRef(false);

  // Re-check consent whenever the consent banner fires a change event.
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

  // Observe the container and flip inView when it enters the viewport.
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

  // Inject Adsterra scripts once the slot is in view.
  useEffect(() => {
    if (!showAd || !inView || injectedRef.current) return;
    injectedRef.current = true;

    const cfg = ADSTERRA_CONFIG[format];
    if (format === 'social-bar') {
      injectSocialBarScript(cfg.id);
    } else {
      injectAdsterraScript(cfg.id, cfg.width, cfg.height);
    }
  }, [showAd, inView, format]);

  if (!showAd && !reserveSpace) return null;

  const cfg = ADSTERRA_CONFIG[format];

  // Social Bar is a floating overlay — no visible container needed.
  if (format === 'social-bar') {
    return showAd ? <span aria-hidden="true" data-adsterra-social-bar="true" /> : null;
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
        /* Adsterra renders an iframe into the nearest containing block
           after its invoke.js runs. The empty div gives it a stable anchor. */
        <div
          data-adsterra-id={cfg.id}
          style={{ width: cfg.width || '100%', minHeight: cfg.height || undefined }}
        />
      ) : (
        <span className="sr-only">Advertisement space reserved</span>
      )}
    </aside>
  );
}
