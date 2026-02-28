/* ============================================
   KABUT DI PELABUHAN LAMA — Service Worker
   Offline Support & Cache Strategy
   ============================================ */

const CACHE_NAME = 'kabut-v1.0.0';
const OFFLINE_URL = 'offline.html';

// File-file yang wajib di-cache saat install
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './offline.html',
  './css/style.css',
  './js/app.js',
  './manifest.json',
  './images/cover.jpg',
  './images/characters/arka.jpg',
  './images/characters/ines.jpg',
  // Chapters yang sudah dirilis
  './chapters/chapter1.txt',
  './chapters/chapter2.txt',
  './chapters/chapter3.txt',
  './chapters/chapter4.txt',
  './chapters/chapter5.txt',
  './chapters/chapter6.txt',
  './chapters/chapter7.txt',
  './chapters/chapter8.txt',
  './chapters/chapter9.txt',
  './chapters/chapter10.txt',
  './chapters/chapter11.txt',
  './chapters/chapter12.txt',
  './chapters/chapter13.txt',
  './chapters/chapter14.txt',
  './chapters/chapter15.txt',
  './chapters/chapter16.txt',
  './chapters/chapter17.txt',
  './chapters/chapter18.txt',
  './chapters/chapter19.txt',
  './chapters/chapter20.txt',
  './chapters/chapter21.txt',
  './chapters/chapter22.txt',
  './chapters/chapter23.txt',
  './chapters/sinopsis.txt',
  './chapters/copyright.txt',
  // Google Fonts (di-cache setelah di-fetch)
];

// ============================================================
// INSTALL — Precache semua aset penting
// ============================================================
self.addEventListener('install', (event) => {
  console.log('[SW] Install — Kabut di Pelabuhan Lama');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching assets...');
        // Cache satu per satu agar tidak gagal total kalau ada 1 file missing
        return Promise.allSettled(
          PRECACHE_ASSETS.map(url =>
            cache.add(url).catch(err => {
              console.warn(`[SW] Failed to cache: ${url}`, err);
            })
          )
        );
      })
      .then(() => {
        console.log('[SW] Precache complete');
        return self.skipWaiting();
      })
  );
});

// ============================================================
// ACTIVATE — Hapus cache lama
// ============================================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// ============================================================
// FETCH — Strategy: Cache First untuk konten, Network First untuk API
// ============================================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension dan request lain yang bukan http/https
  if (!url.protocol.startsWith('http')) return;

  // Strategi berdasarkan tipe konten
  if (isChapterFile(url) || isLocalAsset(url)) {
    // CACHE FIRST: chapter dan aset lokal
    event.respondWith(cacheFirstStrategy(request));
  } else if (isGoogleFont(url)) {
    // STALE WHILE REVALIDATE: Google Fonts
    event.respondWith(staleWhileRevalidate(request));
  } else if (isNavigationRequest(request)) {
    // NETWORK FIRST dengan fallback ke offline.html
    event.respondWith(networkFirstWithOfflineFallback(request));
  } else {
    // DEFAULT: Network first, cache fallback
    event.respondWith(networkFirstStrategy(request));
  }
});

// ============================================================
// HELPER: Cek tipe request
// ============================================================
function isChapterFile(url) {
  return url.pathname.includes('/chapters/') && url.pathname.endsWith('.txt');
}

function isLocalAsset(url) {
  const localExts = ['.css', '.js', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', '.json'];
  return localExts.some(ext => url.pathname.endsWith(ext));
}

function isGoogleFont(url) {
  return url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// ============================================================
// STRATEGI CACHE
// ============================================================

// 1. Cache First — ideal untuk chapter txt dan gambar lokal
async function cacheFirstStrategy(request) {
  try {
    const cached = await caches.match(request);
    if (cached) {
      // Refresh cache di background (non-blocking)
      refreshCacheInBackground(request);
      return cached;
    }
    // Tidak ada di cache, ambil dari network dan simpan
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // Offline dan tidak ada cache
    const cached = await caches.match(request);
    if (cached) return cached;
    return offlineAssetFallback(request);
  }
}

// 2. Network First dengan offline fallback untuk halaman HTML
async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request, { timeout: 5000 });
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // Coba dari cache dulu
    const cached = await caches.match(request);
    if (cached) return cached;
    // Tampilkan halaman offline
    const offlinePage = await caches.match(OFFLINE_URL);
    if (offlinePage) return offlinePage;
    // Last resort
    return new Response(
      '<html><body style="font-family:sans-serif;text-align:center;padding:2rem"><h1>Offline</h1><p>Konten tidak tersedia.</p></body></html>',
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

// 3. Network First — default
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw err;
  }
}

// 4. Stale While Revalidate — untuk fonts
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const networkFetch = fetch(request).then(response => {
    if (response.ok) {
      caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    }
    return response;
  }).catch(() => null);

  return cached || networkFetch;
}

// ============================================================
// BACKGROUND REFRESH
// ============================================================
function refreshCacheInBackground(request) {
  fetch(request)
    .then(response => {
      if (response.ok) {
        return caches.open(CACHE_NAME).then(cache => cache.put(request, response));
      }
    })
    .catch(() => {/* Offline, skip */});
}

// ============================================================
// OFFLINE ASSET FALLBACK
// ============================================================
function offlineAssetFallback(request) {
  const url = new URL(request.url);

  // Image fallback
  if (/\.(jpg|jpeg|png|gif|webp|svg)$/.test(url.pathname)) {
    return new Response(
      `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
        <rect width="200" height="200" fill="#1e1b17"/>
        <text x="100" y="110" text-anchor="middle" fill="#8b6f4e" font-size="40">☁</text>
      </svg>`,
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }

  // Text fallback
  if (url.pathname.endsWith('.txt')) {
    return new Response(
      'Chapter ini belum tersedia secara offline. Hubungkan ke internet untuk mengunduhnya.',
      { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  }

  return new Response('Konten tidak tersedia offline.', { status: 503 });
}

// ============================================================
// MESSAGE HANDLER — untuk update cache dari app
// ============================================================
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_CHAPTER') {
    const chapterUrl = event.data.url;
    caches.open(CACHE_NAME)
      .then(cache => cache.add(chapterUrl))
      .then(() => {
        event.ports[0]?.postMessage({ success: true, url: chapterUrl });
        console.log('[SW] Cached chapter:', chapterUrl);
      })
      .catch(err => {
        event.ports[0]?.postMessage({ success: false, error: err.message });
      });
  }

  if (event.data && event.data.type === 'CHECK_CACHE_STATUS') {
    // Cek berapa chapter yang sudah di-cache
    caches.open(CACHE_NAME)
      .then(cache => cache.keys())
      .then(keys => {
        const chapterUrls = keys
          .filter(req => req.url.includes('/chapters/chapter') && req.url.endsWith('.txt'))
          .map(req => req.url);
        event.ports[0]?.postMessage({
          type: 'CACHE_STATUS',
          cachedChapters: chapterUrls.length,
          urls: chapterUrls
        });
      });
  }

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ============================================================
// PUSH NOTIFICATIONS (chapter baru)
// ============================================================
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Kabut di Pelabuhan Lama';
  const options = {
    body: data.body || 'Chapter baru sudah tersedia!',
    icon: 'images/cover.jpg',
    badge: 'images/cover.jpg',
    tag: 'new-chapter',
    renotify: true,
    data: {
      url: data.url || './'
    },
    actions: [
      { action: 'read', title: 'Baca Sekarang' },
      { action: 'dismiss', title: 'Nanti Saja' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || './';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(windowClients => {
        // Cek kalau app sudah terbuka
        for (const client of windowClients) {
          if (client.url.includes('index.html') || client.url.endsWith('/')) {
            client.focus();
            client.postMessage({ type: 'OPEN_CHAPTER' });
            return;
          }
        }
        // Buka baru
        return clients.openWindow(url);
      })
  );
});

console.log('[SW] Service Worker loaded — Kabut di Pelabuhan Lama v1.0.0');
