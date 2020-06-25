/**
 * @fileoverview Service Worker entrypoint for web.dev.
 */

import * as idb from 'idb-keyval';
import {initialize as initializeGoogleAnalytics} from 'workbox-google-analytics';
import * as workboxRouting from 'workbox-routing';
import * as workboxStrategies from 'workbox-strategies';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';
import {ExpirationPlugin} from 'workbox-expiration';
import {cacheNames as workboxCacheNames} from 'workbox-core';
import {matchSameOriginRegExp} from './utils/sw-match.js';

const cacheNames = {webdevCore: 'webdev-core', ...workboxCacheNames};

// Architecture revision of the Service Worker. If the previously saved revision doesn't match,
// then this will cause clients to be aggressively claimed and reloaded on install/activate.
// Used when the design of the SW changes dramatically.
const serviceWorkerArchitecture = 'v3';

let replacingPreviousServiceWorker = false;

self.addEventListener('install', (event) => {
  // This is non-null if there was a previous Service Worker registered. Record for "activate", so
  // that a lack of current architecture can be seen as a reason to reload our clients.
  if (self.registration.active) {
    replacingPreviousServiceWorker = true;
  }
  const handler = async () => {
    await templateForPartial(null);
    await self.skipWaiting();
  };
  event.waitUntil(handler());
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

    // If this is not a new install, and the architecture has changed, force an immediate reload.
    // Installs from March 2020 will do this in the client scope (but we need this for safety).
    if (replacingPreviousServiceWorker) {
      const windowClients = await self.clients.matchAll({
        includeUncontrolled: true,
        type: 'window',
      });
      windowClients.map((client) => client.navigate(client.url));
    }
  });
  event.waitUntil(p);
});

// By default, use our core cache which is prefilled by the template code, containing assets like
// our JS, CSS, etc. This doesn't use Workbox.
self.addEventListener('fetch', (event) => {
  const p = caches.match(event.request, {
    cacheName: cacheNames.webdevCore,
    ignoreSearch: true,
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
    cacheName: 'google-fonts-stylesheets',
    plugins: [externalExpirationPlugin],
  }),
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workboxRouting.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new workboxStrategies.CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      externalExpirationPlugin,
    ],
  }),
);

/**
 * Match fetches for partials, for SPA requests. Matches requests like:
 *   - /index.json
 *   - /foo-bar/index.json
 *   - /foo-bar/many/parts/test.json
 *
 * This matches all JSON files, but the only JSON files served on our domain are
 * partials.
 */
const partialPathRe = new RegExp('^/([\\w-]+/)*\\w+\\.json$');
const partialStrategy = new workboxStrategies.NetworkFirst({
  cacheName: 'webdev-html-cache-v1', // nb. We used to cache HTML here, so we name it the same
  plugins: [contentExpirationPlugin],
});

const partialMatch = matchSameOriginRegExp(partialPathRe);
workboxRouting.registerRoute(partialMatch, partialStrategy);

/**
 * Cache images that aren't included in the original manifest, such as author profiles.
 */
workboxRouting.registerRoute(
  new RegExp('/images/.*'),
  new workboxStrategies.StaleWhileRevalidate({
    cacheName: 'webdev-assets-cache-v1',
    plugins: [assetExpirationPlugin],
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
 *
 * Internally, the handler fetches the required partial using `partialStrategy`,
 * and generates the page's real HTML based on the layout template. This can be
 * an offline page if there was a network failure, but other failures (including
 * a 404) fall through to the catch handler which does a network fetch.
 */
const normalMatch = matchSameOriginRegExp(
  new RegExp('^/[\\w-/]*(?:|\\.html)$'),
);
workboxRouting.registerRoute(normalMatch, async ({url}) => {
  let pathname = url.pathname;

  // Ensure that the pathname always ends with ".html". This means that URLs
  // ending with "foo.html" are valid, and we add a default "index.html" if
  // it's otherwise missing.
  if (!pathname.endsWith('.html')) {
    if (!pathname.endsWith('/')) {
      // Special-case a URL that doesn't end with "/". We must redirect before
      // returning content as otherwise relative URLs don't work.
      // This is not a problem as:
      //   * this is occuring almost immediately (no network traffic)
      //   * our webserver treats "/foo" and "/foo/" the same for other folders
      //     and for the _redirects.yaml handler (i.e., a 404 on /foo and /foo/
      //     will be treated the same way)
      //   * a _real_ network request to "/foo" gets 301'ed to "/foo/"
      return Response.redirect(pathname + '/' + url.search, 301);
    }
    pathname += 'index.html';
  }

  // As we have a fully-formed URL with a trailing ".html", then just replace
  // it to get the path of its respective partial.
  const partialPath = pathname.replace(/\.html$/, '.json');

  let response;
  try {
    // Use the same strategy for partials when hydrating a full request. Note
    // that this doesn't implicitly invoke the global catch handler (as we're
    // just using the strategy itself), so failures here flow to the catch
    // block below.
    const request = new Request(partialPath);
    response = await partialStrategy.handle({request});
  } catch (e) {
    // Offline pages are served with the default 200 status.
    response = await offlinePartialResponse();
  }

  // If we can't get a real response (or the offline response), go to the
  // network proper. This includes for 404 pages, as we don't want to mask
  // redirect handlers.
  if (!response.ok) {
    throw new Error(
      `unhandled status for normal route '${url.pathname}': ${response.status}`,
    );
  }
  const partial = await response.json();

  const meta = partial.offline ? '<meta name="offline" value="true" />' : '';
  const title = `<title>${partial.title || 'web.dev'}</title>`;
  const rssHref = partial.rss || '/feed.xml';
  const rssTitle =
    partial.rss !== '/feed.xml'
      ? `${partial.title} on web.dev`
      : 'web.dev feed';
  const rss = `<link rel="alternate" href="${rssHref}" type="application/atom+xml" data-title="${rssTitle}" />`;

  const layoutTemplate = await templateForPartial(partial);
  const output = layoutTemplate
    .replace('<!-- %_HEAD_REPLACE_% -->', `${meta}\n${title}\n${rss}`)
    .replace('%_CONTENT_REPLACE_%', partial.raw);
  const headers = new Headers();
  headers.append('Content-Type', 'text/html');
  return new Response(output, {headers, status: response.status});
});

let pendingTemplateUpdate = null;

/**
 * @param {?Object} partial to fetch for
 * @return {!Promise<string>} partial template to use in hydration
 */
async function templateForPartial(partial) {
  const manifestUrl = '/sw-manifest';
  const requestKey = new Request(manifestUrl);
  const cache = await caches.open(cacheNames.webdevCore);

  if (partial !== null) {
    const cachedResponse = await cache.match(requestKey);
    if (cachedResponse) {
      const {template, builtAt, resourcesVersion} = await cachedResponse.json();

      // If the template was built for the same resources as the page we're showing, don't fetch it
      // anew. If the version is different but the template is _newer_, then we're offline and are
      // rendering an old cached partial in a newer template. We can't do anything here, so return.
      if (!resourcesVersion) {
        // In dev, always fetch and update the cache.
      } else if (
        resourcesVersion === partial.resourcesVersion ||
        builtAt > partial.builtAt
      ) {
        return template;
      }
    }
  }

  // Don't update the partial more than once. Two tabs might be causing independent fetch events
  // which are triggering the same update.
  if (pendingTemplateUpdate !== null) {
    return pendingTemplateUpdate;
  }

  const update = async () => {
    let updates = 0;
    let deletes = 0;

    // Otherwise, we need to update the template cache. We don't use any Workbox built-ins here
    // because we're never actually serving this file and we completely manage its lifecycle in this
    // method. Return the template immediately for use.
    const networkResponse = await fetch(manifestUrl);
    const raw = await networkResponse.json();
    const {cache: cacheManifest, template, resourcesVersion, builtAt} = raw;
    const assetMap = new Map();

    // #1: Fetch and update all our dependent resources. Mark them with cache-busting params.
    const updateTasks = cacheManifest.map(async ({url, revision}) => {
      if (!url.startsWith('/')) {
        url = `/${url}`; // we get naked URLs without prefix slash
      }
      assetMap.set(url, revision);

      // Search for the request with an optional cache-busting param (JS/CSS doesn't show up with
      // a revision as it's implied by the URL itself).
      const requestKey = new Request(
        url + (revision !== null ? `?__revision=${revision}` : ''),
      );
      const previous = await cache.match(requestKey);
      if (!previous) {
        ++updates;
        return cache.add(requestKey);
      }
    });
    await Promise.all(updateTasks);

    // #2: Insert the new manifest itself, as it's now safe for use: all its assets are ready.
    delete raw.cache; // this is large, don't include it
    cache.put(requestKey, new Response(JSON.stringify(raw)));

    // #3: Remove any assets that aren't in the new cache with a matching revision.
    const keys = await cache.keys();
    const deleteTasks = keys.map((request) => {
      const u = new URL(request.url);
      const previousRevision = u.searchParams.get('__revision') || null;

      if (assetMap.has(u.pathname)) {
        const revision = assetMap.get(u.pathname);
        if (revision === previousRevision) {
          return;
        }
      }

      // Not in the new map, or the revision doesn't match. Delete.
      ++deletes;
      return cache.delete(request);
    });
    await Promise.all(deleteTasks);

    console.debug(
      'Installed web.dev core version',
      resourcesVersion,
      `(built at ${new Date(builtAt)}),`,
      updates,
      'updates,',
      deletes,
      'deletes',
    );

    // Return the actual template text. Finally!
    return template;
  };

  pendingTemplateUpdate = update();

  // This is basically `finally`, clean up this task even if it fails.
  const cleanup = () => (pendingTemplateUpdate = null);
  pendingTemplateUpdate.then(cleanup, cleanup);

  return pendingTemplateUpdate;
}

/**
 * @return {!Promise<Response>} response for the offline page's partial
 */
async function offlinePartialResponse() {
  const cachedResponse = await caches.match('/offline/index.json', {
    cacheName: cacheNames.webdevCore,
  });
  if (!cachedResponse) {
    // This occurs in development when the offline partial isn't precached.
    return new Response(
      JSON.stringify({offline: true, raw: '<h1>Dev offline</h1>', title: ''}),
    );
  }
  return cachedResponse;
}

workboxRouting.setCatchHandler(async ({url, request}) => {
  // If we failed to fetch a partial, use the offline partial.
  if (partialMatch({url})) {
    return offlinePartialResponse();
  }

  // Go to the network for 'normal' pages. This will only fire if there's an
  // internal error with the normalMatch route handler, above.
  if (normalMatch({url})) {
    return fetch(request);
  }
});
