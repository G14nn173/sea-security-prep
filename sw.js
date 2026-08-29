const CACHE_NAME = "airport-security-prep-v9";
const CACHE_PREFIX = "airport-security-prep-";
const LEGACY_CACHE_PREFIX = "sea-security-prep-";
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./assessment.html",
  "./english.html",
  "./colloquio.html",
  "./style.css",
  "./app.js",
  "./english.js",
  "./pwa.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (name) {
            return (
              name.startsWith(CACHE_PREFIX) ||
              name.startsWith(LEGACY_CACHE_PREFIX)
            ) && name !== CACHE_NAME;
          })
          .map(function (name) {
            return caches.delete(name);
          })
      );
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (cachedResponse) {
        if (cachedResponse) return cachedResponse;

        return fetch(event.request).then(function (networkResponse) {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseCopy = networkResponse.clone();
          cache.put(event.request, responseCopy);
          return networkResponse;
        });
      });
    })
  );
});
