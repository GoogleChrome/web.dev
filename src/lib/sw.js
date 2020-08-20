/**
 * @fileoverview Service Worker entrypoint for web.dev.
 */

import * as idb from 'idb-keyval';
import {initialize as initializeGoogleAnalytics} from 'workbox-google-analytics';
import * as workboxRouting from 'workbox-routing';
import * as workboxStrategies from 'workbox-strategies';
import {ExpirationPlugin} from 'workbox-expiration';
import {matchPrecache, precacheAndRoute} from 'workbox-precaching';
import {cacheNames as workboxCacheNames} from 'workbox-core';
import {matchSameOriginRegExp} from './utils/sw-match.js';

const cacheNames = {
  webDevFonts: 'webdev-fonts-cache-v1',
  webDevHtml: 'webdev-html-cache-v1',
  webDevAssets: 'webdev-assets-cache-v1',
  ...workboxCacheNames,
};

// This import defines self['_manifest'], used below.
try {
  self.importScripts('/sw-manifest.js');
} catch (e) {
  // ignore, possible in dev
}

/**
 * Configure default cache for some common web.dev assets: images, CSS, JS, offline page.
 *
 * This must occur first, as we cache images that are also matched by runtime handlers below. See
 * this workbox issue for updates: https://github.com/GoogleChrome/workbox/issues/2402
 */
precacheAndRoute(self['_manifest'] || [], {
  cleanURLs: false, // don't allow "foo" for "foo.html"
});

/**
 * Architecture revision of the Service Worker. If the previously saved revision doesn't match,
 * then this will cause clients to be aggressively claimed and reloaded on install/activate.
 * Used when the design of the SW changes dramatically.
 */
const serviceWorkerArchitecture = 'v4';

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  // Define a list of allowed caches.
  // If a cache does not appear in the list then it will be deleted.
  const p = Promise.resolve().then(async () => {
    const allowedCaches = new Set(Object.values(cacheNames));
    const cacheKeys = await caches.keys();
    for (const cacheKey of cacheKeys) {
      if (!allowedCaches.has(cacheKey)) {
        await caches.delete(cacheKey);
      }
    }
  });
  event.waitUntil(p);
});

self.addEventListener('activate', (event) => {
  // This deletes the default Workbox runtime cache, which was previously growing unbounded. At the
  // start of March 2020, caches must now have explicit expirations and custom names.
  event.waitUntil(caches.delete(cacheNames.runtime));
});

self.addEventListener('activate', (event) => {
  const p = Promise.resolve().then(async () => {
    const previousArchitecture = await idb.get('arch');
    if (previousArchitecture === serviceWorkerArchitecture) {
      return; // no arch change, don't force reload, upgrade will happen over time
    }
    await idb.set('arch', serviceWorkerArchitecture);

    // If the architecture changed (including due to an initial install), claim our clients so they
    // get the 'controllerchange' event and take over their network requests.
    await self.clients.claim();
  });
  event.waitUntil(p);
});

initializeGoogleAnalytics();

const fontExpirationPlugin = new ExpirationPlugin({
  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 yr
});

const contentExpirationPlugin = new ExpirationPlugin({
  maxEntries: 50, // store the most recent ~50 articles
});

const assetExpirationPlugin = new ExpirationPlugin({
  maxAgeSeconds: 60 * 60 * 24 * 7, // 1 wk
  maxEntries: 100, // allow a large number of images, but expire quickly
});

// Cache the underlying font files with a cache-first strategy for 1 year.
workboxRouting.registerRoute(
  ({request}) => request.destination === 'font',
  new workboxStrategies.CacheFirst({
    cacheName: cacheNames.webDevFonts,
    plugins: [fontExpirationPlugin],
  }),
);

/**
 * Matches normal web.dev routes. This will match pages like:
 *   - /
 *   - /foo-bar                  # without trailing slash
 *   - /foo-bar/
 *   - /zing/hello/
 *   - /test/page/index.html     # trailing /index.html is special
 *   - /hello/other.html         # also allows any html page
 *   - ///////////.html          # valid but wrong
 *
 * This won't match any URL that contains a "." except for a trailing ".html".
 */
const pagePathRe = new RegExp('^/[\\w-/]*(?:|\\.html)$');
const pageStrategy = new workboxStrategies.NetworkFirst({
  cacheName: 'webdev-html-cache-v1',
  plugins: [contentExpirationPlugin],
});

const pageMatch = matchSameOriginRegExp(pagePathRe);
workboxRouting.registerRoute(pageMatch, pageStrategy);

/**
 * Cache images at runtime that aren't included in the original manifest, suchas author profiles.
 */
workboxRouting.registerRoute(
  new RegExp('/images/.*'),
  new workboxStrategies.StaleWhileRevalidate({
    cacheName: 'webdev-assets-cache-v1',
    plugins: [assetExpirationPlugin],
  }),
);

workboxRouting.setCatchHandler(async ({url}) => {
  // If we see an internal error in pageMatch above, assume we're offline and serve the page from
  // the cache.
  if (pageMatch({url})) {
    // TODO(ewag): for now, just match English
    const response = await matchPrecache('/en/offline/index.html');
    response.headers.set('X-Offline', 1);
    return response;
  }
});
