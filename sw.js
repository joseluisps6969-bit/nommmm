const CACHE_NAME = 'nom-simulador-v2'; // Cambiado a v2 para invalidar el viejo
const assets = [
  './',
  './index.html',
  './manifest.json'
];

// Instalar el Service Worker y guardar archivos en caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    }).then(() => self.skipWaiting()) // Fuerza a activarse de inmediato
  );
});

// Activar y limpiar cachés antiguos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // Borra la v1 guardada en tu cel/pc
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Responder desde el caché
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
