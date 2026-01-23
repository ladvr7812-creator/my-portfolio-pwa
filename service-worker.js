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
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cache if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Else try network
      return fetch(event.request)
        .then((networkResponse) => {
          // If network fails or not valid, just return it
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          // Cache valid response
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });

          return networkResponse;
        })
        .catch(() => {
          // Offline fallback ONLY for pages
          if (event.request.mode === 'navigate') {
            return caches.match('/my-portfolio-pwa/index.html');
          }
        });
    })
  );
});
