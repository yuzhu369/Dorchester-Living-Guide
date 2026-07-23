const CACHE='dorchester-guide-v17-0-1';
const APP='./index.html';
const CORE=['./',APP,'./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;event.respondWith((async()=>{try{const response=await fetch(event.request);if(response&&response.ok){const cache=await caches.open(CACHE);cache.put(event.request,response.clone())}return response}catch(e){return (await caches.match(event.request))||(event.request.mode==='navigate'?await caches.match(APP):Response.error())}})())});
