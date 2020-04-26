var CACHE_NAME = 'my-site-cache-v5';

var baseUrl = new URL(self.registration.scope).pathname; 
console.log(baseUrl);

var urlsToCache = [
  baseUrl,
  baseUrl + 'index.html',
  baseUrl + 'index.js',
  baseUrl + 'icon.png',
  'https://timmi-on-rails.github.io/catalog/catalog.pdf'
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
