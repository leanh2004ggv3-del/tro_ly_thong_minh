// Service Worker - Lưu đệm thông minh (Smart Cache Storage) cho Classroom App
// CẬP NHẬT PHIÊN BẢN V3: Dọn sạch mọi cache cũ, loại bỏ data_games.js và ưu tiên Network 100% cho HTML
const CACHE_NAME = 'troly-thaysach-cache-v3';

// Danh sách các tài nguyên tĩnh quan trọng cần lưu đệm (ĐÃ BỎ HOÀN TOÀN data_games.js)
const PRE_CACHE_ASSETS = [
  './',
  './index.html',
  './Anhtruong.png',
  './Anhtruong.jpg',
  './logo.png',
  './logo.jpg'
];

// 1. Cài đặt Service Worker và lưu trước tài nguyên tĩnh
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Ép kích hoạt ngay lập tức không cần chờ tab cũ đóng
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker v3] Đang nạp bộ nhớ đệm cho tài nguyên tĩnh...');
      return cache.addAll(PRE_CACHE_ASSETS).catch((err) => {
        console.warn('[Service Worker v3] Một số tài nguyên không thể pre-cache:', err);
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
            console.log('[Service Worker v3] Xóa sạch bộ nhớ đệm cũ:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Chiếm quyền điều khiển trang ngay lập tức
  );
});

// 3. Xử lý yêu cầu dữ liệu (Network-first 100% cho trang HTML chính)
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Bỏ qua các yêu cầu không phải GET hoặc chrome-extension
  if (request.method !== 'GET' || url.protocol.startsWith('chrome-extension')) {
    return;
  }

  // Đối với trang HTML chính: Dùng chiến lược Network-first (Ưu tiên mạng 100% để luôn nhận phiên bản mới nhất từ server)
  if (request.headers.get('accept') && request.headers.get('accept').includes('text/html') || url.pathname.endsWith('index.html') || url.pathname.endsWith('/')) {
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
          // Chỉ khi mất mạng hoàn toàn mới dùng cache
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
