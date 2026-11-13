/* হাওয়া Hawa — minimal service worker: installability + offline shell.
   Strategy: pages & APIs network-first (fresh data), static assets SWR. */
const CORE = 'hawa-core-v1';
const PAGES = 'hawa-pages-v1';
const API = 'hawa-api-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CORE).then((c) =>
      c.addAll([
        '/favicon.svg',
        '/manifest.webmanifest',
        '/icons/icon-192.png',
        '/icons/icon-512.png',
        '/icons/maskable-512.png',
        '/icons/apple-touch-180.png',
      ]),
    ),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      await clients.claim();
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => ![CORE, PAGES, API].includes(k)).map((k) => caches.delete(k)));
    })(),
  );
});

async function networkFirst(req, cacheName, fallback) {
  const cache = await caches.open(cacheName);
  try {
    const r = await fetch(req);
    if (r.ok) cache.put(req, r.clone());
    return r;
  } catch {
    const hit = await cache.match(req);
    if (hit) return hit;
    if (fallback) {
      const shell = await caches.match(fallback);
      if (shell) return shell;
    }
    return new Response('offline', { status: 503 });
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(CORE);
  const hit = await cache.match(req);
  const fresh = fetch(req)
    .then((r) => {
      if (r.ok) cache.put(req, r.clone());
      return r;
    })
    .catch(() => hit);
  return hit || fresh;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // external APIs (air quality, geocoding) — network-first, cached fallback
  if (url.origin !== location.origin) {
    if (/open-meteo|bigdatacloud/.test(url.hostname)) {
      e.respondWith(networkFirst(req, API));
    }
    return;
  }

  // app navigations — network-first, fall back to the cached page then '/'
  if (req.mode === 'navigate') {
    e.respondWith(networkFirst(req, PAGES, '/'));
    return;
  }

  // same-origin static assets — stale-while-revalidate
  e.respondWith(staleWhileRevalidate(req));
});
