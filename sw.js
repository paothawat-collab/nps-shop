/* =========================================================
   Service Worker — ร้านหนองภัยศูนย์เสาโรมัน (NPS เสาโรมัน)
   • แคช app shell + โลโก้/ไอคอน เปิดออฟไลน์ได้ (ฝั่งลูกค้าเห็นหน้าเว็บแม้เน็ตหลุด)
   • ข้อมูลสินค้าในโหมด Firebase ใช้ offline cache ของ Firestore แยกต่างหาก
   • เปลี่ยนเลข CACHE_VERSION ทุกครั้งที่อัปเดตไฟล์ เพื่อให้เครื่องลูกค้าโหลดของใหม่
   ========================================================= */

const CACHE_VERSION = 'nps-v8';
const APP_SHELL = [
  './',
  './index.html',
  './firebase-config.js',
  './manifest.webmanifest',
  './catalog.json',
  './assets/logo.png',
  './assets/logo-mark.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './apple-touch-icon.png',
  './favicon.png',
  './favicon.ico'
];

// ติดตั้ง: พรีแคช app shell (เผื่อบางไฟล์ไม่มี ก็ไม่ให้ install ล้ม)
self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    await Promise.allSettled(APP_SHELL.map(u => cache.add(u)));
    self.skipWaiting();
  })());
});

// เปิดใช้งาน: ลบแคชเวอร์ชันเก่า
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // อย่ายุ่งกับ Firestore/Firebase/Google APIs — ปล่อยให้ SDK จัดการ (รวม offline cache เอง)
  if (/firestore|firebaseio|googleapis|gstatic|identitytoolkit|google\.com/.test(url.hostname)) {
    return;
  }

  // คำขอเปิดหน้า (navigation) → ลองเน็ตก่อน, ล้มเหลวค่อยใช้แคช index.html (รองรับ SPA hash route)
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        return fresh;
      } catch (err) {
        const cache = await caches.open(CACHE_VERSION);
        return (await cache.match('./index.html')) || (await cache.match('./')) || Response.error();
      }
    })());
    return;
  }

  // ไฟล์เว็บเดียวกัน (same-origin) → cache-first พร้อมอัปเดตเบื้องหลัง (stale-while-revalidate)
  if (url.origin === location.origin) {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE_VERSION);
      const cached = await cache.match(req);
      const network = fetch(req).then(res => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => null);
      return cached || (await network) || Response.error();
    })());
    return;
  }

  // ทรัพยากรภายนอก (ฟอนต์ / qrcode cdn) → stale-while-revalidate
  e.respondWith((async () => {
    const cache = await caches.open(CACHE_VERSION);
    const cached = await cache.match(req);
    const network = fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
      return res;
    }).catch(() => null);
    return cached || (await network) || Response.error();
  })());
});
