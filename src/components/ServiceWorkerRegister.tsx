'use client';

import { useEffect } from 'react';

/** Registers the offline service worker (static generator shell). No-op when unsupported. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    if (process.env.NODE_ENV !== 'production') return;
    // The Social Media Calendar host runs its own app-scoped worker
    // (/social-sw.js, registered by PwaSetup). Registering /sw.js there
    // too makes the two scripts fight over the same scope: each page
    // load looks like an "update" to the other script, which looped
    // the app's "new version ready" prompt forever.
    if (window.location.hostname === 'socialcalendar.freeqrcode.tools') return;
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Offline support is best-effort; the app works fully without it.
    });
  }, []);
  return null;
}
