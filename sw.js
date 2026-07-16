const CACHE = 'antojo-clean-v3';
const ASSETS = [
  '/', '/index.html', '/favicon.svg', '/manifest.webmanifest',
  '/clean-styles-01.css', '/clean-styles-02.css', '/clean-styles-03.css', '/clean-styles-04.css', '/clean-styles-05.css', '/clean-personalizer.css',
  '/clean-data.js', '/clean-ui.js', '/clean-journeys.js', '/clean-experiences.js', '/clean-checkout.js', '/clean-personalizer.js', '/clean-render-bind.js', '/clean-init.js', '/clean-init-core.js',
  '/clean-render-data-01.js', '/clean-render-data-02.js', '/clean-render-data-03.js', '/clean-render-data-04.js', '/clean-render-data-05.js', '/clean-render-data-06.js', '/clean-render-sprite.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put('/index.html', copy));
      return response;
    }).catch(() => caches.match('/index.html')));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(request, copy));
    return response;
  })));
});
