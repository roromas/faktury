/* Service worker Fakturky: po prvním načtení běží aplikace bez internetu.
   Soubory se berou z paměti telefonu a na pozadí se obnovují, takže nová verze se objeví při dalším otevření. */
const CACHE = 'fakturka-db6ad39071';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('fakturka-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const update = fetch(req).then((res) => {
    if (res && res.ok) {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
    }
    return res;
  }).catch(() => null);
  event.waitUntil(update);

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return update.then((res) => {
        if (res) return res;
        if (req.mode === 'navigate') return caches.match('./index.html').then((idx) => idx || Response.error());
        return Response.error();
      });
    })
  );
});
