/* Minimal offline shell for the static QR generator.
 *
 * Strategy:
 *  - On install, precache the home page shell and core static assets.
 *  - Runtime: cache-first for same-origin GET requests (pages, chunks, images);
 *    network-first for navigations so content stays fresh, falling back to the
 *    cached home shell when offline.
 *  - Never caches /api/* or /r/* (dynamic/redirect endpoints).
 */
const CACHE = 'qrstudio-shell-v1';
const PRECACHE = ['/', '/manifest.webmanifest', '/qrcodelogo.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
      .catch(() => undefined),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
      .catch(() => undefined),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/r/')) return;

  if (request.mode === 'navigate') {
    // Network-first for pages; offline → cached shell.
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
          return res;
        })
        .catch(() => caches.match('/').then((r) => r || Response.error())),
    );
    return;
  }

  // Cache-first for static assets.
  event.respondWith(
    caches.match(request).then(
      (hit) =>
        hit ||
        fetch(request).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => undefined);
          return res;
        }),
    ),
  );
});
