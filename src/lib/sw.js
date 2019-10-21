import manifest from "cache-manifest";

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js",
);

console.log("Got cache manifest", manifest);

workbox.precaching.precache(["/offline/"]);

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
  if (event.request.destination === "document") {
    // TODO(samthor): Annotate this page so the client knows it's being displayed because the user
    // is offline, and force it to rerequest when navigator.onLine is true.
    return caches.match("/offline/");
  }
});
