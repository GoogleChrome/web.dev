const updateContent = async () => {
  const data = await fetch(
    'https://worldtimeapi.org/api/timezone/Europe/London.json'
  ).then((response) => response.json());
  return new Date(data.unixtime * 1000);
};

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
  event.waitUntil(
    (async () => {
      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      if (event.request.url.endsWith('last-updated')) {
        console.log(event.request.url);
        console.log(await caches.match(event.request.url));
        return (await caches.match(event.request.url)) || new Response('Never');
      }
      try {
        const response = await event.preloadResponse;
        if (response) {
          return response;
        }
        return fetch(event.request);
      } catch {
        return new Response('Offline');
      }
    })()
  );
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    event.waitUntil(
      (async () => {
        // Sync new data in the background and store it.
        const lastUpdated = await updateContent();
        const backgroundSyncCache = await caches.open(
          'periodic-background-sync'
        );
        backgroundSyncCache.put('/last-updated', new Response(lastUpdated));

        // Notify potentially running clients, so they can update.
        self.clients.matchAll().then((clientList) => {
          for (const client of clientList) {
            client.postMessage({
              tag: event.tag,
            });
          }
        });
      })()
    );
  }
});
