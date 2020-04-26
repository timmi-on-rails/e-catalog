var CACHE_NAME = 'my-site-cache-v5';
console.log(window.location.origin)
var urlsToCache = [
  '.',
  'index.html',
  'index.js',
  'icon.png'
];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        var fetchPromise = fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        })
        return response || fetchPromise;
      })
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log("activate");
  event.waitUntil(clients.claim());
});
