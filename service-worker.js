const CACHE_NAME = "emak-teklif-v10";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./jszip.min.js",
  "./emak-template.xlsx",
  "./emak-logo.jpg",
  "./hero-v10.png"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL.map(x => x + (x.includes('?')?'&':'?') + 'v=10'))).catch(()=>caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL))));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;
  const url=new URL(event.request.url);
  if(url.origin !== self.location.origin) return;
  const important = event.request.mode === "navigate" || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/emak-template.xlsx') || url.pathname.endsWith('/jszip.min.js');
  if(important){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then(resp=>{
      if(resp.ok){const copy=resp.clone();caches.open(CACHE_NAME).then(c=>c.put(event.request,copy));}
      return resp;
    }).catch(()=>caches.match(event.request).then(r=>r||caches.match('./index.html'))));
  } else {
    event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(resp=>{if(resp.ok){const copy=resp.clone();caches.open(CACHE_NAME).then(c=>c.put(event.request,copy));}return resp;})));
  }
});
