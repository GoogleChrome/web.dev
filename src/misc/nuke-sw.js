// Inspired by https://github.com/GoogleChrome/devsummit/blob/master/src/nuke-sw.js
// Not actually compiled, just served in places we no longer want a Service Worker

// Is this actually being executed in a ServiceWorker?
if (self instanceof ServiceWorkerGlobalScope) {
  Promise.resolve()
    .then(() => {
      // Nuke the Service Worker.
      return self.registration.unregister();
    })
    .then(() => {
      // Match all window'ed pages.
      return clients.matchAll({
        includeUncontrolled: true,
        type: "window",
      });
    })
    .then((clients) => {
      // Reload all pages (this isn't part of the promise chain, as we can block ourselves).
      clients.forEach((client) => client.navigate(client.url));
    })
    .catch((err) => {
      console.error(err);
    });
}
