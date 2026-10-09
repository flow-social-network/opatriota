/* O PATRIOTA PWA service worker.
 * Only same-origin static assets are cached. API, authentication,
 * subscriber and editorial/admin responses are intentionally excluded.
 */
const CACHE_NAME = 'o-patriota-static-v1';
const STATIC_ASSETS = [
  '/manifest.webmanifest',
  '/pwa-icon-192.svg',
  '/pwa-icon-512.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith('o-patriota-static-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/auth/') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/minha-conta') ||
    url.pathname.startsWith('/redacao')
  ) {
    return;
  }

  // Cache-first only for versioned/static assets. Navigation and article
  // requests stay network-driven to avoid serving stale or private content.
  const isStaticAsset = /\.(?:js|css|svg|png|jpg|jpeg|webp|woff2?)$/i.test(url.pathname)
    || url.pathname === '/manifest.webmanifest';

  if (!isStaticAsset) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});