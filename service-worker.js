const CACHE='dorchester-guide-v14-online';
const APP='./dorchester-guide-v14-online-fixed.html';
const CORE=['./',APP,'./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;
  event.respondWith((async()=>{
    const cached=await caches.match(event.request);
    if(cached) return cached;
    try{
      const response=await fetch(event.request);
      if(response && response.ok){
        const cache=await caches.open(CACHE);
        cache.put(event.request,response.clone());
      }
      return response;
    }catch(error){
      if(event.request.mode==='navigate') return (await caches.match(APP)) || Response.error();
      throw error;
    }
  })());
});
