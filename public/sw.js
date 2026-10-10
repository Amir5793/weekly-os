/* Weekly OS — Service Worker
 * استراتژی:
 *  - ناوبری (صفحات): شبکه اول، در صورت قطعی از کش (با fallback به /)
 *  - فایل‌های هش‌دار /_next/static: کش اول (همیشه سریع)
 *  - تصاویر/فونت/manifest: stale-while-revalidate
 * فقط GET و فقط همین دامنه.
 */

const VERSION = "weekly-os-v1";
const PAGE_CACHE = `${VERSION}-pages`;
const ASSET_CACHE = `${VERSION}-assets`;

const CORE_PAGES = [
  "/",
  "/schedule",
  "/rules",
  "/priorities",
  "/review",
  "/daily",
  "/print",
  "/manifest.webmanifest",
];

self.addEventListener("install", event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PAGE_CACHE);
      await Promise.allSettled(CORE_PAGES.map(url => cache.add(url)));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

async function networkFirstPage(request) {
  try {
    const res = await fetch(request);
    if (res && res.ok) {
      const cache = await caches.open(PAGE_CACHE);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    const cached = (await caches.match(request)) || (await caches.match("/"));
    if (cached) return cached;
    throw new Error("offline and no cache");
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const res = await fetch(request);
  if (res && res.ok) {
    const cache = await caches.open(ASSET_CACHE);
    cache.put(request, res.clone());
  }
  return res;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then(res => {
      if (res && res.ok) cache.put(request, res.clone());
      return res;
    })
    .catch(() => undefined);
  if (cached) return cached;
  const res = await network;
  if (res) return res;
  return Response.error();
}

self.addEventListener("fetch", event => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  if (url.pathname.startsWith("/_next/static/") ||
      url.pathname.startsWith("/icons/") ||
      request.destination === "font" ||
      request.destination === "script" ||
      request.destination === "style") {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (request.destination === "image" ||
      url.pathname === "/manifest.webmanifest" ||
      url.pathname.endsWith(".webmanifest")) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
