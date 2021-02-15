// Inspired by https://github.com/GoogleChrome/devsummit/blob/master/src/nuke-sw.js
// Not actually compiled, just served in places we no longer want a Service Worker.
// This registers an empty Service Worker.

/* globals ServiceWorkerGlobalScope clients */

// Is this actually being executed in a ServiceWorker?
if (
  typeof ServiceWorkerGlobalScope !== 'undefined' &&
  self instanceof ServiceWorkerGlobalScope
) {
  self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
  });

  self.addEventListener('activate', (event) => {
    const p = (async () => {
      await self.clients.claim();

      const existingClients = await clients.matchAll({
        includeUncontrolled: true,
        type: 'window',
      });

      // We must activate and claim our clients before forcing them to navigate,
      // even for a basic reload.
      existingClients.forEach((client) => client.navigate(client.url));
    })();

    event.waitUntil(p);
  });
}
