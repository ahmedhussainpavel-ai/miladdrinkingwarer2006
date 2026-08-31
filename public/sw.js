// Milad Drinking Water PWA Service Worker (v2)
// Enhanced with Product Catalog Caching & Resilient Offline Fallbacks

const STATIC_CACHE_NAME = 'milad-static-v2';
const DYNAMIC_CACHE_NAME = 'milad-dynamic-v2';
const CATALOG_CACHE_NAME = 'milad-catalog-v2';

// Core Application Shell Assets
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.png',
  '/logo.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700;800;900&family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
];

// Install Event: Pre-cache App Shell & Core Assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      // Use catch on individual resources so a single remote asset failure won't break SW install
      return Promise.all(
        PRECACHE_ASSETS.map((asset) => {
          return cache.add(asset).catch((err) => {
            console.warn('[SW] Pre-cache non-blocking warning for:', asset, err);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up legacy caches
self.addEventListener('activate', (event) => {
  const currentCaches = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME, CATALOG_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log('[SW] Deleting legacy cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event Strategy:
// 1. Static Assets (scripts, CSS, fonts, images) -> Stale While Revalidate
// 2. Catalog & API requests -> Network First with dynamic Catalog Cache fallback
// 3. Navigation (HTML pages) -> Network First with /index.html Cache fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET, browser extensions, or analytics beacons
  if (
    request.method !== 'GET' || 
    !request.url.startsWith('http') || 
    url.hostname.includes('google-analytics.com') ||
    url.hostname.includes('doubleclick.net')
  ) {
    return;
  }

  // 1. Navigation Requests (User loading or refreshing SPA pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const copy = networkResponse.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return networkResponse;
        })
        .catch(async () => {
          console.log('[SW] Offline navigate fallback served for:', request.url);
          const cachedIndex = await caches.match('/index.html');
          if (cachedIndex) return cachedIndex;
          const cachedReq = await caches.match(request);
          if (cachedReq) return cachedReq;
          return new Response(
            `<!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>মিলাদ ড্রিংকিং ওয়াটার - অফলাইন মোড</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                  body { font-family: sans-serif; text-align: center; padding: 40px 20px; background: #f8fafc; color: #0f172a; }
                  .card { max-width: 440px; margin: 0 auto; background: #fff; padding: 30px; border-radius: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
                  h1 { font-size: 20px; color: #0284c7; margin-bottom: 8px; }
                  p { font-size: 14px; color: #475569; line-height: 1.5; }
                  button { background: #0284c7; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 16px; }
                </style>
              </head>
              <body>
                <div class="card">
                  <h1>🌐 অফলাইন মোড (Offline Mode)</h1>
                  <p>আপনার ইন্টারনেট সংযোগ বিচ্ছিন্ন রয়েছে। অনুগ্রহ করে সংযোগ চালু করে রিফ্রেশ করুন।</p>
                  <button onclick="window.location.reload()">পুনরায় চেষ্টা করুন</button>
                </div>
              </body>
            </html>`,
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // 2. Static Resources & Images (Vite chunks, CSS, Icons, Fonts)
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('unpkg.com')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Return cached version immediately if found, and update cache in background (Stale While Revalidate)
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(STATIC_CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 3. Catalog Data & General Requests (Network First with Dynamic Cache)
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return new Response(JSON.stringify({ offline: true, message: 'Offline Mode Active' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        });
      })
  );
});

// Handle custom messages from client (e.g., explicit catalog cache triggers)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_PRODUCT_CATALOG') {
    const productsData = event.data.payload;
    caches.open(CATALOG_CACHE_NAME).then((cache) => {
      const response = new Response(JSON.stringify(productsData), {
        headers: { 'Content-Type': 'application/json', 'X-Offline-Cached-At': new Date().toISOString() }
      });
      cache.put('/api/offline-catalog', response);
      console.log('[SW] Product catalog explicitly cached for offline viewing.');
    });
  }
});
