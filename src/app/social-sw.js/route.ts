import { NextResponse } from 'next/server';

/**
 * Service worker for the Social Media Calendar app ONLY.
 *
 * It is registered exclusively by code inside the socialcalendar site
 * (and only on the socialcalendar.freeqrcode.tools host), so its root
 * scope covers just that subdomain's origin. The main site's own
 * service worker (/sw.js) is a different file and is untouched.
 *
 * Strategy: network-first for page navigations (fresh content wins,
 * cache is the offline fallback), cache-first for static assets.
 */
const SW_SOURCE = `
const CACHE = 'socialcalendar-v1';
const SHELL = ['/', '/app', '/socialcalendar-logo.svg', '/socialcalendar-icon-192.png', '/socialcalendar-icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).catch(() => undefined)
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('socialcalendar-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
          return response;
        })
        .catch(() => caches.match(request).then((hit) => hit || caches.match('/app')))
    );
    return;
  }

  if (url.pathname.startsWith('/_next/static/') || /\\.(?:png|svg|jpg|jpeg|webp|ico|woff2?)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((hit) => hit || fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
        return response;
      }))
    );
  }
});
`;

export function GET() {
  return new NextResponse(SW_SOURCE, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Service-Worker-Allowed': '/',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
