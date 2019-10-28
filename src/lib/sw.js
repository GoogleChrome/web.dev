const normalizeIndexCacheKeyPlugin = {
  cacheKeyWillBeUsed({request, mode}) {
    // Take advantage of Workbox's built-in handling of .../index.html routes and ensure that its
    // cache keys always include it. (e.g., requests for foo/ will load foo/index.html: but
    // foo/index.html will not load foo/).
    if (request.url.endsWith("/")) {
      return request.url + "index.html";
    }
    return request;
  },
};

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
 * Match "/foo-bar/ "and "/foo-bar/as/many/of-these-as-you-like/" (with optional trailing
 * "index.html"), normal page nodes for web.dev.
 */
const contentPageRe = new RegExp("/([\\w-]+/)*(|index.html)$");

/**
 * Match "/foo-bar" and "/foo-bar/as-many/but/no/trailing/slash" (but not "/foo/bar/index.html").
 */
const untrailedContentPageRe = new RegExp("(/[\\w-]+)+$");

/**
 * Send normal nodes to cache first.
 */
workbox.routing.registerRoute(
  contentPageRe,
  new workbox.strategies.StaleWhileRevalidate({
    plugins: [normalizeIndexCacheKeyPlugin],
  }),
);

/**
 * Cache images that aren't included in the original manifest, such as author profiles.
 */
workbox.routing.registerRoute(
  new RegExp("/images/.*"),
  new workbox.strategies.StaleWhileRevalidate(),
);

/**
 * Untrailed requests are network-only, but with a fallback to redirecting to the same page with a
 * trailing slash.
 */
self.addEventListener("fetch", (event) => {
  const u = new URL(event.request.url);
  if (
    !untrailedContentPageRe.exec(event.request.url) ||
    self.location.host !== u.host
  ) {
    return;
  }

  // Go to the network first, looking for interesting responses from the server (e.g., "/subscribe"
  // redirects to a form).
  const p = fetch(event.request).catch(() => {
    // Otherwise, just assume that the content is actually at the trailed location.
    const headers = new Headers();
    headers.append("Location", event.request.url + "/");
    const redirectResponse = new Response("", {
      status: 301,
      headers,
    });
    return redirectResponse;
  });

  event.respondWith(p);
});

workbox.routing.setCatchHandler(async ({event}) => {
  // Destination is set by loading this content normally; it's not set for fetch(), so look for our
  // custom header.
  const isDocumentRequest =
    event.request.destination === "document" ||
    event.request.headers.get("X-Document");
  if (isDocumentRequest) {
    // TODO(samthor): Annotate this page so the client knows it's being displayed because the user
    // is offline, and force it to rerequest when navigator.onLine is true.
    const cacheKey = workbox.precaching.getCacheKeyForURL(
      "/offline/index.html",
    );
    return caches.match(cacheKey);
  }
});
