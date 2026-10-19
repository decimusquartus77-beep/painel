// Service worker: guarda o app no aparelho para abrir sem internet.
// Ao publicar uma nova versão, aumente o número em CACHE.
const CACHE = 'gaiola-mkii-v02';
const ASSETS = [
  './', './index.html', './app.css', './app.js', './manifest.json',
  './img/logo.png', './img/icon-192.png', './img/icon-512.png', './img/apple-touch-icon.png',
  './fonts/barlow-condensed-latin-500-normal.woff2', './fonts/barlow-condensed-latin-600-normal.woff2',
  './fonts/barlow-condensed-latin-700-normal.woff2', './fonts/barlow-condensed-latin-800-normal.woff2',
  './fonts/barlow-condensed-latin-800-italic.woff2'
];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => {
    const net = fetch(req).then(res => {
      if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
