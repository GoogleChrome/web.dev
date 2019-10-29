import manifest from "cache-manifest";

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js",
);

workbox.googleAnalytics.initialize();

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "google-fonts-stylesheets",
  }),
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workbox.strategies.CacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  }),
);

workbox.precaching.precacheAndRoute(manifest);

/**
 * Match /foo-bar/ and "/foo-bar/as/many/of-these-as-you-like/".
 *
 * TODO(samthor): Handle /index.html suffix via cacheKey and the Express-generated 302 from "/foo"
 * to "/foo/".
 *
 * TODO(samthor): Workbox is agressive and will also match "other-domain.com/foo/", include domain
 * restriction.
 */
workbox.routing.registerRoute(
  new RegExp("/([\\w-]+/)*$"),
  new workbox.strategies.StaleWhileRevalidate(),
);

workbox.routing.setCatchHandler(({event}) => {
  // Destination is set by loading this content normally; it's not set for fetch(), so look for our
  // custom header.
  const isDocumentRequest =
    event.request.destination === "document" ||
    event.request.headers.get("X-Document");
  if (isDocumentRequest) {
    return caches.match("/offline/");
  }
});
