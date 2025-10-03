const CACHE_NAME = 'shelfsnap-cache-v1';
const ASSETS = [
    '/', '/index.html', '/manifest.webmanifest',
    '/icons/icon-192.png', '/icons/icon-512.png',
    'https://unpkg.com/@zxing/library@0.20.0',
    // 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js'
];

self.addEventListener('install', (e)=>{
    e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', (e)=>{
    e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
    self.clients.claim();
});
self.addEventListener('fetch', (e)=>{
    const url = new URL(e.request.url);
    if(url.origin === location.origin){
        e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
} else {
    e.respondWith(fetch(e.request).catch(()=> caches.match(e.request)));
}
});