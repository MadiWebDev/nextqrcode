'use client';

import { useEffect, useState } from 'react';

/**
 * Registers the app-scoped service worker (/social-sw.js) — only on the
 * real socialcalendar host, so previews and other subdomains are never
 * affected — and surfaces an honest "update ready" notice instead of
 * silently swapping versions.
 */
export default function PwaSetup() {
  const [updateReady, setUpdateReady] = useState(false);
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;
    if (window.location.hostname !== 'socialcalendar.freeqrcode.tools') return;
    let registration: ServiceWorkerRegistration | undefined;
    navigator.serviceWorker
      .register('/social-sw.js')
      .then((reg) => {
        registration = reg;
        if (reg.waiting) {
          setWaiting(reg.waiting);
          setUpdateReady(true);
        }
        reg.addEventListener('updatefound', () => {
          const worker = reg.installing;
          if (!worker) return;
          worker.addEventListener('statechange', () => {
            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
              setWaiting(worker);
              setUpdateReady(true);
            }
          });
        });
      })
      .catch(() => {
        // Offline support is an enhancement; the app works without it.
      });
    const onControllerChange = () => window.location.reload();
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      void registration;
    };
  }, []);

  if (!updateReady) return null;
  return (
    <div
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-lg border border-border bg-card p-4 shadow-lg"
      role="status"
    >
      <p className="text-sm font-medium">A new version of Social Media Calendar is ready.</p>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
          onClick={() => waiting?.postMessage({ type: 'SKIP_WAITING' })}
        >
          Reload to update
        </button>
        <button
          type="button"
          className="rounded-md border border-input px-3 py-1.5 text-sm font-medium"
          onClick={() => setUpdateReady(false)}
        >
          Later
        </button>
      </div>
    </div>
  );
}
