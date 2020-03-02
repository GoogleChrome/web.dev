import * as idb from "idb-keyval";
import manifest from "cache-manifest";
import {initialize as initializeGoogleAnalytics} from "workbox-google-analytics";
import * as workboxRouting from "workbox-routing";
import * as workboxStrategies from "workbox-strategies";
import {CacheableResponsePlugin} from "workbox-cacheable-response";
import {ExpirationPlugin} from "workbox-expiration";
import {matchPrecache, precacheAndRoute} from "workbox-precaching";

// Architecture revision of the Service Worker. If the previously saved revision doesn't match,
// then this will cause clients to be aggressively claimed and reloaded on install/activate.
// Used when the design of the SW changes dramatically, e.g. from DevSite to v2.
const serviceWorkerArchitecture = "v3";

const normalizeIndexCacheKeyPlugin = {
  cacheKeyWillBeUsed({request, mode}) {
    // web.dev does not have any handlers which respond to ?search queries, so strip them (useful
    // for ?utm_... params, which aren't stripped by Workbox).
    // From: https://github.com/GoogleChrome/workbox/issues/1709#issuecomment-429917667
    const u = new URL(request.url);
    if (u.search || u.hash) {
      u.search = "";
      u.hash = "";

      // Request is immutable, so recreate it here.
      request = new Request(u.href, {headers: request.headers});
    }

    // Take advantage of Workbox's built-in handling of .../index.html routes and ensure that its
    // cache keys always include it. (e.g., requests for foo/ will load foo/index.html: but
    // foo/index.html will not load foo/).
    if (request.url.endsWith("/")) {
      return request.url + "index.html";
    }

    return request;
  },
};

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

initializeGoogleAnalytics();

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workboxRouting.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workboxStrategies.StaleWhileRevalidate({
    cacheName: "google-fonts-stylesheets",
  }),
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workboxRouting.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workboxStrategies.CacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  }),
);

// Configure default cache for standard web.dev files: the offline page, various images etc.
precacheAndRoute(manifest);

/**
 * Match "/foo-bar/ "and "/foo-bar/as/many/of-these-as-you-like/" (with optional trailing
 * "index.html"), normal page nodes for web.dev. This only matches on pathname.
 */
const contentPathRe = new RegExp("^/([\\w-]+/)*(|index.html)$");

/**
 * Match "/foo-bar" and "/foo-bar/as-many/but/no/trailing/slash" (but not "/foo/bar/index.html").
 * This only matches on pathname (so it must always start with "/").
 */
const untrailedContentPathRe = new RegExp("^(/[\\w-]+)+$");

/**
 * Send normal nodes to cache first.
 */
workboxRouting.registerRoute(
  ({url, event}) => {
    return url.host === self.location.host && contentPathRe.test(url.pathname);
  },
  new workboxStrategies.NetworkFirst({
    plugins: [normalizeIndexCacheKeyPlugin],
  }),
);

/**
 * Cache images that aren't included in the original manifest, such as author profiles.
 */
workboxRouting.registerRoute(
  new RegExp("/images/.*"),
  new workboxStrategies.StaleWhileRevalidate(),
);

/**
 * This is a special handler for requests without a trailing "/". These requests _should_ go to
 * the network (so that we can match web.dev's redirects.yaml file) but fallback to the normalized
 * version of the request (e.g., "/foo" => "/foo/").
 */
self.addEventListener("fetch", (event) => {
  const u = new URL(event.request.url);
  if (
    !untrailedContentPathRe.test(u.pathname) ||
    self.location.host !== u.host
  ) {
    return;
  }

  const p = Promise.resolve().then(async () => {
    // First, check if there's actually something in the cache already. Workbox always suffixes
    // with "/index.html" relative to our actual request paths.
    const cachedResponse = await matchPrecache(u.pathname + "/index.html");
    if (!cachedResponse) {
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

workboxRouting.setCatchHandler(async ({event}) => {
  // Destination is set by loading this content normally; it's not set for fetch(), so look for our
  // custom header.
  const isDocumentRequest =
    event.request.destination === "document" ||
    event.request.headers.get("X-Document");
  if (isDocumentRequest) {
    const cachedOfflineResponse = await matchPrecache("/offline/index.html");
    if (!cachedOfflineResponse) {
      // This occurs in development when the offline page is in the runtime cache.
      return caches.match("/offline/index.html", {ignoreSearch: true});
    }
    return cachedOfflineResponse;
  }
});
