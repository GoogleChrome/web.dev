import * as idb from "idb-keyval";
import manifest from "cache-manifest";
import layoutTemplate from "layout-template";
import {initialize as initializeGoogleAnalytics} from "workbox-google-analytics";
import * as workboxRouting from "workbox-routing";
import * as workboxStrategies from "workbox-strategies";
import {CacheableResponsePlugin} from "workbox-cacheable-response";
import {ExpirationPlugin} from "workbox-expiration";
import {matchPrecache, precacheAndRoute} from "workbox-precaching";
import {cacheNames} from "workbox-core";
import {matchSameOriginRegExp} from "./utils/sw-match.js";

// Architecture revision of the Service Worker. If the previously saved revision doesn't match,
// then this will cause clients to be aggressively claimed and reloaded on install/activate.
// Used when the design of the SW changes dramatically, e.g. from DevSite to v2.
const serviceWorkerArchitecture = "v3";

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
  // This deletes the default Workbox runtime cache, which was previously growing unbounded. At the
  // start of March 2020, caches must now have explicit expirations and custom names.
  event.waitUntil(caches.delete(cacheNames.runtime));
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

const externalExpirationPlugin = new ExpirationPlugin({
  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 yr
});

const contentExpirationPlugin = new ExpirationPlugin({
  maxEntries: 50, // store the most recent ~50 articles
});

const assetExpirationPlugin = new ExpirationPlugin({
  maxAgeSeconds: 60 * 60 * 24 * 7, // 1 wk
  maxEntries: 100, // allow a large number of images, but expire quickly
});

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workboxRouting.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  new workboxStrategies.StaleWhileRevalidate({
    cacheName: "google-fonts-stylesheets",
    plugins: [externalExpirationPlugin],
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
      externalExpirationPlugin,
    ],
  }),
);

// Configure default cache for standard web.dev files: the offline page, various images etc.
precacheAndRoute(manifest);

/**
 * This is a special handler for requests without a trailing "/". These requests _should_ go to
 * the network (so that we can match web.dev's redirects.yaml file) but fallback to the normalized
 * version of the request (e.g., "/foo" => "/foo/").
 */
const untrailedContentPathRe = new RegExp("^(/[\\w-]+)+$");

workboxRouting.registerRoute(
  matchSameOriginRegExp(untrailedContentPathRe),
  async ({url, event}) => {
    const {pathname} = url;

    // First, check if there's actually something in the cache already. Workbox always suffixes
    // with "/index.html" relative to our actual request paths.
    const cachedResponse = await matchPrecache(pathname + "/index.html");
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
  },
);

/**
 * Match fetches for patials, for SPA requests. Matches "/foo-bar/index.json" and
 * "/foo-bar/many/parts/index.json", for partial SPA requests.
 */
const partialPathRe = new RegExp("^/([\\w-]+/)*index\\.json$");
const partialStrategy = new workboxStrategies.NetworkFirst({
  cacheName: "webdev-html-cache-v1", // nb. We used to cache HTML here, so we name it the same
  plugins: [contentExpirationPlugin],
});

workboxRouting.registerRoute(
  matchSameOriginRegExp(partialPathRe),
  partialStrategy,
);

/**
 * Cache images that aren't included in the original manifest, such as author profiles.
 */
workboxRouting.registerRoute(
  new RegExp("/images/.*"),
  new workboxStrategies.StaleWhileRevalidate({
    cacheName: "webdev-assets-cache-v1",
    plugins: [assetExpirationPlugin],
  }),
);

/**
 * Match "/foo-bar/ "and "/foo-bar/as/many/of-these-as-you-like/" (with optional trailing
 * "index.html"), normal page nodes for web.dev. This only matches on pathname.
 *
 * This fetch handler internally fetches the required partial using `partialStrategy`, and
 * generates the page's real HTML based on the layout template.
 */
const contentPathRe = new RegExp("^(/(?:[\\w-]+/)*)(?:|index\\.html)$");

workboxRouting.registerRoute(
  matchSameOriginRegExp(contentPathRe),
  async ({params}) => {
    const pathname = params[1]; // 1st group from contentPathRe regexp

    let response;
    try {
      // Use the same strategy for partials when hydrating a full request.
      // Note that this doesn't implicitly invoke the global catch handler (as we're just using
      // the strategy itself), so failures here flow to the catch block below.
      response = await partialStrategy.handle({
        request: new Request(pathname + "index.json"),
      });
    } catch (e) {
      // Offline pages are served with the default 200 status.
      response = await offlinePartial();
    }

    if (!response.ok) {
      throw response.status;
    }
    const partial = await response.json();

    // Our target browsers all don't mind if we just place <title> in the middle of the document.
    // This is far simpler than trying to find the right place in <head>.
    const meta = partial.offline ? `<meta name="offline" value="true" />` : "";
    const output = layoutTemplate.replace(
      "%_CONTENT_REPLACE_%",
      meta + `<title>${escape(partial.title)}</title>` + partial.raw,
    );
    const headers = new Headers();
    headers.append("Content-Type", "text/html");
    return new Response(output, {headers, status: response.status});
  },
);

workboxRouting.setCatchHandler(async ({event, url}) => {
  // This check is the same as the partialPathRe handler above. It only handles partial JSON
  // failures (as the handler above is a simple NetworkFirst strategy). Regular HTML failures are
  // handled by the in-depth contentPathRe path above.
  if (url.host === self.location.host && partialPathRe.test(url.pathname)) {
    return offlinePartial();
  }
});

async function offlinePartial() {
  const cachedResponse = await matchPrecache("/offline/index.json");
  if (!cachedResponse) {
    // This occurs in development when the offline partial isn't precached.
    return new Response(
      JSON.stringify({offline: true, raw: "<h1>Dev offline</h1>", title: ""}),
    );
  }
  return cachedResponse;
}
