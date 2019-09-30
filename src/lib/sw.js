importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js",
);

// TODO(samthor): rollup a list of assets to precache on install.
// TODO(samthor): match Google Fonts, Firebase and friends.

workbox.googleAnalytics.initialize();

// The bootstrap JS always has the same name, and references other scripts. As
// web.dev works fine as purely static content, always go to network first.
workbox.routing.registerRoute(
  "/bootstrap.js",
  new workbox.strategies.NetworkFirst(),
);

// All other JS files have cache-busting names, so hit the cache first with no
// particular approach to invalidation.
workbox.routing.registerRoute(/\.js$/, new workbox.strategies.CacheFirst());

// Helper that matches the RegExp on the pathname of a matching hostname only.
// This avoids the open-ended matching described here:
//   https://developers.google.com/web/tools/workbox/modules/workbox-routing#how_to_register_a_regular_expression_route
function hostnameWithMatch(re) {
  return ({url}) => {
    return url.hostname === self.location.hostname && re.exec(url.pathname);
  };
}

// Match all assets served under /images/.
workbox.routing.registerRoute(
  hostnameWithMatch(/^\/images\/.*/),
  new workbox.strategies.StaleWhileRevalidate(),
);

// Match "/", "/article/", or "/article/subarticle/", ... etc. Requires trailing slash.
workbox.routing.registerRoute(
  hostnameWithMatch(/^\/(\w+\/)*/),
  new workbox.strategies.StaleWhileRevalidate(),
);

self.addEventListener("activate", (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener("install", (e) => {
  self.skipWaiting();
});
