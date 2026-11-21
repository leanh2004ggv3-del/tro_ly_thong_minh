// Service Worker - Lưu đệm thông minh (Smart Cache Storage) cho Classroom App
const CACHE_NAME = 'troly-thaysach-cache-v1';

// Danh sách các tài nguyên tĩnh quan trọng cần lưu đệm để tải tức thì
const PRE_CACHE_ASSETS = [
  './',
  './index.html',
  './data_games.js',
  './Anhtruong.png',
  './Anhtruong.jpg',
  './logo.png',
  './logo.jpg'
];

// 1. Cài đặt Service Worker và lưu trước tài nguyên tĩnh
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Đang nạp bộ nhớ đệm cho tài nguyên tĩnh...');
      return cache.addAll(PRE_CACHE_ASSETS).catch((err) => {
        console.warn('[Service Worker] Một số tài nguyên không thể pre-cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Kích hoạt và dọn dẹp các phiên bản cache cũ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Xóa bộ nhớ đệm cũ:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Xử lý yêu cầu dữ liệu (Network-first cho HTML, Stale-while-revalidate cho CDN & Assets)
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Bỏ qua các yêu cầu không phải GET hoặc chrome-extension
  if (request.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // Đối với trang HTML chính: Dùng chiến lược Network-first (Ưu tiên mạng để lấy bản mới nhất, mất mạng thì lấy Cache)
  if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return caches.match('./index.html');
          });
        })
    );
    return;
  }

  // Đối với file tĩnh (JS, CSS, Ảnh, Font, PPTX): Dùng Stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch((err) => {
          // Lỗi mạng, vẫn dùng cache nếu có
          return cachedResponse;
        });

      // Nếu đã có cache thì trả về ngay lập tức (siêu nhanh), đồng thời chạy fetch ngầm để cập nhật
      return cachedResponse || fetchPromise;
    })
  );
});
