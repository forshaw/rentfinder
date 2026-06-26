const CACHE_NAME = "rentfinder-cache-v4";
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(["/", OFFLINE_URL])
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* Offline navigation support */
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

/* PUSH NOTIFICATION HANDLING */
self.addEventListener("push", (event) => {
  let data = {};

  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || "RentFinder";
  const options = {
    body: data.body || "You have a new notification",
    icon: "/icons/icon-192.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});