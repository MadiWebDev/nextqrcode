/* Resume Builder service worker (spec §9): offline app shell for
   resumebuilder.freeqrcode.tools only. Cache-first for static assets,
   network-first for pages with a cached fallback. Bump VERSION to
   ship an update; the app's own prompt (bound to this script) offers
   the reload. */
const VERSION = 'resume-v1';
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
const PRECACHE = ['/', '/app', '/templates', '/tracker', '/resumebuilder-manifest.webmanifest', '/resumebuilder-logo.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PAGE_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/resumebuilder-')) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const hit = await cache.match(request);
        if (hit) return hit;
        const res = await fetch(request);
        if (res.ok) cache.put(request, res.clone());
        return res;
      }),
    );
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGE_CACHE).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(PAGE_CACHE);
          return (await cache.match(request)) || (await cache.match('/app')) || Response.error();
        }),
    );
  }
});
