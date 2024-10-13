const CACHE_NAME = `0.12.1.2`; // stable.pre-release.minor.web

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // console.log("Content downloading")
    cache.addAll([
      'index.html',
      "Icons/favicon.ico",
      'love.js',
      'love.wasm',
      'game.js',
      'game.data'
    ]);
    })());
});

self.addEventListener("activate", (e) => { //Delete old caches
  indexedDB.deleteDatabase("EM_PRELOAD_CACHE")
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === CACHE_NAME) {
            return;
          }
          return caches.delete(key);
        }),
      );
    }),
  );
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Get the resource from the cache.
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse) {
      return cachedResponse;
    } else {
        try {
          // If the resource was not in the cache, try the network.
          const fetchResponse = await fetch(event.request);

          // Save the resource in the cache and return it.
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        } catch (e) {
          // The network failed.
        }
    }
  })());
});