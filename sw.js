/*
 * Service worker: lets the app open and run with no connection.
 *
 * - Same-origin files: network first (so a deploy shows up on the next online
 *   visit), falling back to the cache when offline or after NETWORK_TIMEOUT_MS.
 *   Every successful response refreshes the cache.
 * - Google Fonts: cache first; cached on the first online visit.
 *
 * PRECACHE must list every local file index.html needs to start;
 * tests/run.py fails if one is missing. Bump CACHE when removing files.
 */
const CACHE = "private-reserve-v1";
const FONT_CACHE = "private-reserve-fonts-v1";
const NETWORK_TIMEOUT_MS = 3000;

const PRECACHE = [
  "./",
  "index.html",
  "css/app.css",
  "data/catalog.js",
  "js/core.js",
  "js/glassware.js",
  "js/store.js",
  "js/render.js",
  "js/ui.js",
  "js/editors.js",
  "js/data-panel.js",
  "js/share.js",
  "js/main.js",
  "manifest.webmanifest",
  "icons/favicon-32.png",
  "icons/icon-192.png",
  "icons/apple-touch-icon.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== FONT_CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(request));
  } else if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(cacheFirst(request));
  }
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  const fromNetwork = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  });
  const fromCache = () => cache.match(request, { ignoreSearch: true })
    .then(hit => hit || (request.mode === "navigate" ? cache.match("index.html") : undefined));

  let timer;
  const timedOut = new Promise(resolve => { timer = setTimeout(resolve, NETWORK_TIMEOUT_MS, "timeout"); });
  try {
    const first = await Promise.race([fromNetwork, timedOut]);
    if (first !== "timeout") return first;
    // Slow network: serve the cached copy now if there is one, otherwise keep waiting.
    return (await fromCache()) || (await fromNetwork);
  } catch (err) {
    const hit = await fromCache();
    if (hit) return hit;
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(FONT_CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok || response.type === "opaque") cache.put(request, response.clone());
  return response;
}
