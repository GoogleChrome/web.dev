// Architecture revision of the Service Worker. If the previously saved revision doesn't match,
// then this will cause clients to be aggressively claimed and reloaded on install/activate.
// Used when the design of the SW changes dramatically, e.g. from DevSite to v2.
const serviceWorkerArchitecture = "v2";

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

import * as idb from "idb-keyval";
import manifest from "cache-manifest";

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js",
);

let replacingPreviousServiceWorker = false;

self.addEventListener("install", (event) => {
  // This is non-null if there was a previous Service Worker registered. Record for "activate", so
  // that a lack of current architecture can be seen as a reason to reload our clients.
  if (self.registration.active) {
    replacingPreviousServiceWorker = true;
  }

  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  const p = Promise.resolve().then(async () => {
    const previousArchitecture = await idb.get("arch");
    if (previousArchitecture === undefined && replacingPreviousServiceWorker) {
      // We're replacing a Service Worker that didn't have architecture info. Force reload.
    } else if (
      !replacingPreviousServiceWorker ||
      previousArchitecture === serviceWorkerArchitecture
    ) {
      // The architecture didn't change (or this is a brand new install), don't force a reload,
      // upgrades will happen in due course.
      return;
    }
    console.debug(
      "web.dev SW upgrade from",
      previousArchitecture,
      "to arch",
      serviceWorkerArchitecture,
    );

    await self.clients.claim();

    // Reload all open pages (includeUncontrolled shouldn't be needed as we've _just_ claimed
    // clients, but include it anyway for sanity).
    const windowClients = await self.clients.matchAll({
      includeUncontrolled: true,
      type: "window",
    });

    // It's impossible to 'await' this navigation because this event would literally be blocking
    // our fetch handlers from running. These navigates must be 'fire-and-forget'.
    windowClients.map((client) => client.navigate(client.url));

    await idb.set("arch", serviceWorkerArchitecture);
  });
  event.waitUntil(p);
});

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
 * This roots at the left "/" as it's not given to Workbox, which does this for us.
 */
const untrailedContentPageRe = new RegExp("^(/[\\w-]+)+$");

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
    !untrailedContentPageRe.exec(u.pathname) ||
    self.location.host !== u.host
  ) {
    return;
  }

  const p = Promise.resolve().then(async () => {
    // First, check if there's actually something in the cache already.
    const cacheKey = workbox.precaching.getCacheKeyForURL(
      u.pathname + "/index.html",
    );
    const cached = await caches.match(cacheKey);
    if (!cached) {
      // If there's not, then try the network.
      try {
        return await fetch(event.request);
      } catch (e) {
        // If fetch fails, just redirect below.
      }
    }

    // Either way, redirect to the updated Location.
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
    const cacheKey = workbox.precaching.getCacheKeyForURL(
      "/offline/index.html",
    );
    if (!cacheKey) {
      // This occurs in development when the offline page is in the runtime cache.
      return caches.match("/offline/index.html", {ignoreSearch: true});
    }
    return caches.match(cacheKey);
  }
});
