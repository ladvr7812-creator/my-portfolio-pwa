const CACHE_NAME = 'vaishnavi-portfolio-v2';

const urlsToCache = [
  '/my-portfolio-pwa/',
  '/my-portfolio-pwa/index.html',
  '/my-portfolio-pwa/style.css',
  '/my-portfolio-pwa/script.js',
  '/my-portfolio-pwa/manifest.json',
  '/my-portfolio-pwa/AppImages/android/android-launchericon-192-192.png',
  '/my-portfolio-pwa/AppImages/android/android-launchericon-512-512.png'
];

// INSTALL
self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        urlsToCache.map((url) =>
          fetch(url, { cache: 'reload' }).then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to fetch ${url}`);
            }
            return cache.put(url, response);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return networkResponse;
        })
        .catch(() => {
          return caches.match('/portfolio-website/index.html');
        });
    })
  );
});
