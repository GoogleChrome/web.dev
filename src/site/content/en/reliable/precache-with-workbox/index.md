---
layout: post
title: Precaching with Workbox
authors:
  - jeffposnick
date: 2018-11-05
description: |
  One feature of service workers is the ability to save files to the cache when
  the service worker is installing. Precaching makes it possible to serve cached
  files to the browser without going to the network. Use precaching with Workbox
  for critical assets that your site needs even when offline.
feedback:
  - api
---

One feature of service workers is the ability to save files to the cache when
the service worker is installing. This is referred to as "precaching".
Precaching makes it possible to serve cached files to the browser without going
to the network. Use precaching for critical assets that your site needs even
when offline: main page, styles, fallback image and essential scripts.

## Why should you use Workbox?

Using Workbox for precaching is optional. You can write your own code to
[precache critical assets when the service worker is installing](https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker).
The primary benefit of using Workbox is its out-of-the-box version control.
You'll run into a lot less trouble updating precached assets using Workbox than
if you had to manage the versioning and updating of these files on your own.

## Precache manifests

Precaching is driven by a list of URLs and associated versioning information for
each URL. Taken together, this information is known as a
[**precache manifest**](https://developers.google.com/web/tools/workbox/modules/workbox-precaching#explanation_of_the_precache_list).
The manifest is the "source of truth" for the state of everything meant to be in
the precache for a given version of a web app. A precache manifest, in the
format used by [Workbox](https://developers.google.com/web/tools/workbox/),
looks something like:

```js
[{
  url: 'app.abcd1234.js'
}, {
  url: 'offline.svg',
  revision: '7836745f'
}, {
  url: 'index.html',
  revision: '518747aa'
}]
```

When the service worker is installed, three cache entries are created in the
Cache Storage, for each of the three listed URLs. The first asset has versioning
information already included in its URL (`app` is the actual file name, and
`.abcd1234` contains the versioning information, right before the file extension
`.js`). Workbox's build tools can detect this and exclude a revision field. The
other two assets do not include any versioning info in their URLs, so Workbox's
build tools create a separate `revision` field, containing a hash of the local
file's contents.

## Serving precached resources

Adding assets to the cache is just one part of the precaching story—once the
assets are cached, they need to respond to outgoing requests. That requires a
`fetch` event listener in your service worker that can check which URLs have
been precached, and return those cached responses reliably, bypassing the
network in the process. Since the service worker checks the cache for responses
(and uses those before the network), this is called a
[**cache-first strategy**](https://developers.google.com/web/tools/workbox/modules/workbox-strategies#cache_first_cache_falling_back_to_network).

## Efficient updates

A precache manifest provides an exact representation of the expected cache
state; if a URL/revision combination in the manifest changes, a service worker
_knows_ that the previous cached entry is no longer valid, and needs to be
updated. It only takes a single network request, made automatically by the
browser as part of the service worker
[update check](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#updates),
to determine which precached URLs need to be refreshed.

## Updates to precached resources

As you release new versions of your web app over time, you need to keep
previously precached URLs up to date, precache new assets, and delete outdated
entries. As long as you continue generating a full precache manifest each time
you rebuild your site, that manifest serves as the "source of truth" for your
precache state at any point in time.

If there's an existing URL with a new revision field, or if any URLs have been
added or dropped from the manifest, that's a sign to your service worker that
updates need to be performed, as part of the
[`install`](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#install_1)
and
[`activate`](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#activate_1)
event handlers. For instance, if you've made some changes to your site and
rebuilt, your latest precache manifest might have undergone the following
changes:

```js
[{
  url: 'app.ffaa4455.js'
}, {
  url: 'offline.svg',
  revision: '7836745f'
}, {
  url: 'index.html',
  revision: '518747aa'
}]
```

Each of these changes tells your service worker that new requests need to be
made to update previously cached entries (`'offline.svg'` and `'index.html'`)
and cache new URLs (`'app.ffaa4455.js'`), as well as deletions to clean up URLs
that are no longer used (`'app.abcd1234.js'`).

## True "app store" install experience

Another benefit of precaching is that you can give your users an experience that
would otherwise be difficult to achieve outside of an "app store"
installation. Once a user visits any page on your web app for the first time,
you can potentially precache _all_ of the URLs needed to display _any_ of your
web app's views ahead of time, without having to wait until they visit each
individual view.

When a user installs an app, they expect every part to display quickly,
not just the views that they've gone to in the past. Precaching brings that same
experience to web apps.

## Which of your assets should be precached?

Refer back to the [Identify what's being
loaded](/identify-resources-via-network-panel/) guide to get a good
picture of which URLs make the most sense to precache. The general rule is to
precache any HTML, JavaScript, or CSS that's loaded early on and is crucial to
displaying the basic structure of a given page.

It's preferable to avoid precaching media or other assets that are loaded later
(unless crucial for your web app's functionality). Instead, use a [runtime
caching strategy](/runtime-caching-with-workbox/) to ensure these
assets are cached-as-you-go.

Always keep in mind that precaching involves using network bandwidth and storage
on a user's device (just like installing an app from an app store does).
It's up to you as the developer to precache judiciously, and avoid a bloated
precache manifest.

Workbox's build tools help by telling you the number of items in the precache
manifest as well as the total size of the precache payload.

Repeat visitors to your web app benefit in the long run from the upfront cost of
precaching, since the ability it offers to avoid the network quickly pays for
itself in saved bandwidth over time.
