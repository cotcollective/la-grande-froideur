// Service worker LA GRANDE FROIDEUR — cache-first sur les assets (jeu offline après 1re visite)
const CACHE = "lgf-v1";
const ASSETS = [
  "./",
  "index.html",
  "manifest.json",
  "icon-192.png", "icon-512.png",
  "assets/title.png", "assets/intro1.png", "assets/intro2.png", "assets/intro3.png", "assets/intro4.png",
  "assets/dungeon_dep.png", "assets/dungeon_usine.png", "assets/dungeon_chateau.png",
  "assets/boss_roi.png", "assets/ti_coq.png", "assets/ending.png"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(resp => {
    if (resp.ok && new URL(e.request.url).origin === location.origin) {
      const copy = resp.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
    }
    return resp;
  }).catch(() => caches.match("./"))));
});