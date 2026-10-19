'use client';

import { useEffect } from 'react';

/** Registers the offline service worker (static generator shell). No-op when unsupported. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Offline support is best-effort; the app works fully without it.
    });
  }, []);
  return null;
}
