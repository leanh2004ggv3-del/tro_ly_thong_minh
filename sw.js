// Service Worker - Lưu đệm thông minh (Smart Cache Storage) cho Classroom App
// CẬP NHẬT PHIÊN BẢN V4: Loại trừ hoàn toàn /to-truong/, dọn sạch cache cũ, ưu tiên Network 100%
const CACHE_NAME = 'troly-thaysach-cache-v4';

// Danh sách các tài nguyên tĩnh quan trọng cần lưu đệm
const PRE_CACHE_ASSETS = [
  './',
  './index.html',
  './Anhtruong.png',
  './Anhtruong.jpg',
  './logo.png',
  './logo.jpg'
];

// 1. Cài đặt Service Worker và kích hoạt ngay
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker v4] Đang nạp bộ nhớ đệm cho tài nguyên tĩnh...');
      return cache.addAll(PRE_CACHE_ASSETS).catch((err) => {
        console.warn('[Service Worker v4] Một số tài nguyên không thể pre-cache:', err);
      });
    })
  );
});

// 2. Kích hoạt và dọn dẹp triệt để TẤT CẢ các phiên bản cache cũ
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker v4] Xóa sạch bộ nhớ đệm cũ:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Xử lý yêu cầu dữ liệu
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // BỎ QUA HOÀN TOÀN: Các yêu cầu không phải GET, extension, hoặc bộ công cụ to-truong
  if (request.method !== 'GET' || url.protocol.startsWith('chrome-extension') || url.pathname.includes('/to-truong/')) {
    return;
  }

  // Đối với trang HTML gốc: Dùng chiến lược Network-first (Ưu tiên mạng 100% để luôn nhận phiên bản mới nhất từ server)
  const isHtml = request.headers.get('accept') && request.headers.get('accept').includes('text/html');
  const isRootPath = url.pathname.endsWith('/') || url.pathname.endsWith('index.html');

  if (isHtml && isRootPath) {
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

  // Đối với file tĩnh (JS, CSS, Ảnh, Font): Dùng Stale-while-revalidate
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
        .catch(() => {
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});
