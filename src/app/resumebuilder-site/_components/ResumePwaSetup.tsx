'use client';

/**
 * Resume Builder PWA setup: registers /resume-sw.js on this host
 * only, and shows the update prompt ONLY for that worker (checked by
 * script URL — the 2026-11-18 social-calendar loop came from two
 * workers on one scope prompting for each other).
 */
import { useEffect, useState } from 'react';

export function ResumePwaSetup() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;
    if (window.location.hostname !== 'resumebuilder.freeqrcode.tools' && !window.location.hostname.startsWith('resumebuilder.')) return;
    let cancelled = false;
    void navigator.serviceWorker
      .register('/resume-sw.js')
      .then((registration) => {
        if (cancelled) return;
        const check = (worker: ServiceWorker | null) => {
          if (worker && worker.scriptURL.endsWith('/resume-sw.js') && navigator.serviceWorker.controller) {
            setWaiting(worker);
          }
        };
        check(registration.waiting);
        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed') check(installing);
          });
        });
      })
      .catch(() => {
        // Offline support is best-effort; the builder works without it.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!waiting) return null;
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-md rounded-lg border bg-card p-3 shadow-xl" role="status">
      <p className="text-sm">A new version of Resume Builder is ready.</p>
      <button
        type="button"
        className="mt-2 min-h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
        onClick={() => {
          waiting.postMessage('SKIP_WAITING');
          window.location.reload();
        }}
      >
        Reload to update
      </button>
    </div>
  );
}
