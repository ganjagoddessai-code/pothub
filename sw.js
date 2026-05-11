const CACHE_VERSION = 'ganjagoddessai-v1.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const MODEL_CACHE = `${CACHE_VERSION}-models`;
const FONT_CACHE = `${CACHE_VERSION}-fonts`;
const OFFLINE_URL = '/offline.html';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/robots.txt',
  '/sitemap.xml',
  '/assets/css/styles.css',
  '/assets/js/app.js',
  '/assets/js/orbit-engine.js',
  '/assets/js/smoke-engine.js',
  '/assets/js/voice-engine.js',
  '/assets/js/ai-engine.js',
  '/assets/js/ar-engine.js',
  '/assets/js/vr-engine.js',
  '/assets/js/pwa-engine.js',
  '/assets/audio/ambient.mp3',
  '/assets/models/goddess.glb',
  '/assets/icons/icon-72.png',
  '/assets/icons/icon-96.png',
  '/assets/icons/icon-128.png',
  '/assets/icons/icon-144.png',
  '/assets/icons/icon-152.png',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-384.png',
  '/assets/icons/icon-512.png',
  '/assets/screenshots/hero.png',
  '/assets/screenshots/mobile.png'
];

const API_ROUTES = [
  '/api/',
  '/ai/',
  '/agents/',
  '/analytics/',
  '/commerce/',
  '/xr/',
  '/3dpod/'
];

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'avif'];
const MODEL_EXTENSIONS = ['glb', 'gltf', 'fbx', 'obj', 'stl'];
const FONT_EXTENSIONS = ['woff', 'woff2', 'ttf', 'otf'];

self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .catch(error => console.error('Install Cache Error:', error))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => !key.startsWith(CACHE_VERSION))
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (API_ROUTES.some(route => url.pathname.startsWith(route))) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  if (isImage(url.pathname)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  if (isModel(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request, MODEL_CACHE));
    return;
  }

  if (isFont(url.pathname)) {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(pageNetworkFallback(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
});

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    return caches.match(OFFLINE_URL);
  }
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);

    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cached = await cache.match(request);
    return cached || new Response(JSON.stringify({
      status: 'offline',
      message: 'Network unavailable'
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const networkFetch = fetch(request)
    .then(response => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }

      return response;
    })
    .catch(() => cached);

  return cached || networkFetch;
}

async function pageNetworkFallback(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);

    cache.put(request, response.clone());

    return response;
  } catch (error) {
    const cached = await caches.match(request);

    return cached || caches.match(OFFLINE_URL);
  }
}

function isImage(pathname) {
  return IMAGE_EXTENSIONS.some(ext => pathname.endsWith(`.${ext}`));
}

function isModel(pathname) {
  return MODEL_EXTENSIONS.some(ext => pathname.endsWith(`.${ext}`));
}

function isFont(pathname) {
  return FONT_EXTENSIONS.some(ext => pathname.endsWith(`.${ext}`));
}

self.addEventListener('sync', event => {
  if (event.tag === 'sync-ai-memory') {
    event.waitUntil(syncMemoryGraph());
  }

  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }

  if (event.tag === 'sync-analytics') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncMemoryGraph() {
  try {
    const pending = await getStoredData('memory-queue');

    if (!pending.length) {
      return;
    }

    await Promise.all(
      pending.map(item =>
        fetch('/api/memory/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(item)
        })
      )
    );
  } catch (error) {
    console.error('Memory Sync Failed:', error);
  }
}

async function syncOrders() {
  try {
    const orders = await getStoredData('offline-orders');

    await Promise.all(
      orders.map(order =>
        fetch('/api/orders/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(order)
        })
      )
    );
  } catch (error) {
    console.error('Order Sync Failed:', error);
  }
}

async function syncAnalytics() {
  try {
    const analytics = await getStoredData('analytics-events');

    await Promise.all(
      analytics.map(event =>
        fetch('/api/analytics/collect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(event)
        })
      )
    );
  } catch (error) {
    console.error('Analytics Sync Failed:', error);
  }
}

async function getStoredData(storeName) {
  return new Promise(resolve => {
    const request = indexedDB.open('ganjagoddessai-db', 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, {
          autoIncrement: true
        });
      }
    };

    request.onsuccess = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(storeName)) {
        resolve([]);
        return;
      }

      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const getAll = store.getAll();

      getAll.onsuccess = () => resolve(getAll.result || []);
      getAll.onerror = () => resolve([]);
    };

    request.onerror = () => resolve([]);
  });
}

self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data.json();
  } catch {
    data = {
      title: 'GanjaGoddessAI',
      body: 'New orbital intelligence event received.'
    };
  }

  const options = {
    body: data.body,
    icon: '/assets/icons/icon-192.png',
    badge: '/assets/icons/icon-96.png',
    image: data.image || '/assets/screenshots/hero.png',
    vibrate: [200, 100, 200],
    requireInteraction: true,
    silent: false,
    renotify: true,
    tag: data.tag || 'ganjagoddess-notification',
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open Interface'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'GanjaGoddessAI', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});

self.addEventListener('message', event => {
  if (!event.data) {
    return;
  }

  switch (event.data.type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'CLEAR_CACHES':
      clearAllCaches();
      break;

    case 'CACHE_URLS':
      cacheUrls(event.data.payload || []);
      break;

    default:
      break;
  }
});

async function clearAllCaches() {
  const keys = await caches.keys();

  await Promise.all(keys.map(key => caches.delete(key)));
}

async function cacheUrls(urls = []) {
  const cache = await caches.open(DYNAMIC_CACHE);

  return cache.addAll(urls);
}
