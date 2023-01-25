---
title: Storage for the web
subhead: There are many different options for storing data in the browser. Which one is best for your needs?
authors:
  - petelepage
description: There are many different options for storing data in the browser. Which one is best for your needs?
date: 2020-04-27
updated: 2021-02-11
tags:
  - blog
  - progressive-web-apps
  - storage
  - indexeddb
  - cachestorage
  - memory
hero: image/admin/c8u2hKEFoFfgTsmcKeuK.jpg
alt: Stack of shipping containers
feedback:
  - api
---

Internet connections can be flakey or non-existent on the go, which is why
offline support and reliable performance are common features in
[progressive web apps](/progressive-web-apps/). Even in perfect wireless
environments, judicious use of caching and other storage techniques can
substantially improve the user experience. There are several ways to cache
your static application resources (HTML, JavaScript, CSS, images, etc.), and
data (user data, news articles, etc.). But which is the best solution? How
much can you store? How do you prevent it from being evicted?

## What should I use? {: #recommendation }

Here's a general recommendation for storing resources:

* For the network resources necessary to load your app and file-based content,
  use the [**Cache Storage API**][cache-primer] (part of
  [service workers][sw-primer]).
* For other data, use [**IndexedDB**][mdn-indexeddb] (with a
  [promises wrapper][idb-wrapper]).

IndexedDB and the Cache Storage API are supported in every modern browser.
They're both asynchronous, and will not block the main thread. They're
accessible from the `window` object, web workers, and service workers, making
it easy to use them anywhere in your code.

## What about other storage mechanisms? {: #other }

There are several other storage mechanisms available in the browser, but they
have limited use and may cause significant performance issues.

[SessionStorage][mdn-sessionstorage] is tab specific, and scoped to the
lifetime of the tab. It may be useful for storing small amounts of session
specific information, for example an IndexedDB key. It should be used with
caution because it is synchronous and will block the main thread. It is
limited to about 5MB and can contain only strings. Because it is tab specific,
it is not accessible from web workers or service workers.

[LocalStorage][mdn-localstorage] should be avoided because it is synchronous
and will block the main thread. It is limited to about 5MB and can contain
only strings. LocalStorage is not accessible from web workers or service
workers.

[Cookies][mdn-cookies] have their uses, but should not be used for storage.
Cookies are sent with every HTTP request, so storing anything more than a
small amount of data will significantly increase the size of every web request.
They are synchronous, and are not accessible from web workers. Like
LocalStorage and SessionStorage, cookies are limited to only strings.

The [File System API][mdn-fileapi] and FileWriter API provide methods for
reading and writing files to a sandboxed file system. While it is asynchronous,
it is not recommended because it is
[only available in Chromium-based browsers][caniuse-fs].

The [File System Access API](/file-system-access/) was designed to make it
easy for users to read and edit files on their local file system. The user
must grant permission before a page can read or write to any local file, and
permissions are not persisted across sessions.

WebSQL should **not** be used, and existing usage should be migrated to
IndexedDB. Support has [been removed][caniuse-websql] from almost all major
browsers. The W3C [stopped maintaining the Web SQL spec][w3c-websql] in 2010,
with no plans to further updates planned.

Application Cache should **not** be used, and existing usage should be
migrated to service workers and the Cache API. It has been
[deprecated][mdn-appcache] and support will be removed from browsers in
the future.

## How much can I store? {: #how-much }

In short, **a lot**, at least a couple of hundred megabytes, and potentially
hundreds of gigabytes or more. Browser implementations vary, but the amount
of storage available is usually based on the amount of storage available on the
device.

* Chrome allows the browser to use up to 80% of total disk space. An origin can
  use up to 60% of the total disk space. You can use the [StorageManager
  API](#check) to determine the maximum quota available. Other Chromium-based
  browsers may allow the browser to use more storage. See
  [PR #3896](https://github.com/GoogleChrome/web.dev/pull/3896) for details about
  Chrome's implementation.
* Internet Explorer 10 and later can store up to 250MB and will prompt the
  user when more than 10MB has been used.
* Firefox allows the browser to use up to 50% of free disk space. An
  [eTLD+1](https://godoc.org/golang.org/x/net/publicsuffix)
  group (e.g., `example.com`, `www.example.com` and `foo.bar.example.com`)
  [may use up to 2GB][ff-usage-limits]. You can use the
  [StorageManager API](#check-available) to determine how much space is still
  available.
* Safari (both desktop and mobile) appears to allow about 1GB. When the limit
  is reached, Safari will prompt the user, increasing the limit in 200MB
  increments. I was unable to find any official documentation on this.
  * If a PWA is added to the home screen on mobile Safari, it appears to
    create a new storage container, and nothing is shared between the PWA
    and mobile Safari. Once the quota has been hit for an installed PWA, there
    doesn't appear to be any way to request additional storage.

In the past, if a site exceeded a certain threshold of data stored, the
browser would prompt the user to grant permission to use more data. For
example, if the origin used more than 50MB, the browser would prompt the user
to allow it to store up to 100MB, then ask again at 50MB increments.

Today, most modern browsers will not prompt the user, and will allow a site
to use up to its allotted quota. The exception appears to be Safari, which
prompts at 750MB, asking permission to store up to 1.1GB. If an origin
attempts to use more than its allotted quota, further attempts to write data
will fail.

## How can I check how much storage is available? {: #check }

In [many browsers][caniuse-sm], you can use the
[StorageManager API][mdn-storagemanager] to determine the amount of storage
available to the origin, and how much storage it's using. It reports the total
number of bytes used by IndexedDB and the Cache API, and makes it possible
to calculate the approximate remaining storage space available.

```js
if (navigator.storage && navigator.storage.estimate) {
  const quota = await navigator.storage.estimate();
  // quota.usage -> Number of bytes used.
  // quota.quota -> Maximum number of bytes available.
  const percentageUsed = (quota.usage / quota.quota) * 100;
  console.log(`You've used ${percentageUsed}% of the available storage.`);
  const remaining = quota.quota - quota.usage;
  console.log(`You can write up to ${remaining} more bytes.`);
}
```

The StorageManager isn't [implemented][caniuse-sm] in all browsers yet, so you
must feature detect it before using it. Even when it is available, you must
still catch over-quota errors (see below). In some cases, it's possible for
the available quota to exceed the actual amount of storage available.

{% Aside %}
Other Chromium-based browsers may factor in the amount of free space when
reporting the available quota. Chrome does not, and will always report 60% of
the actual disk size. This helps to reduce the ability to determine the size
of stored cross origin resources.
{% endAside %}

### Inspect

During development, you can use your browser's DevTools to inspect the
different storage types, and easily clear all stored data.

A new feature was added in Chrome 88 that lets you override the site's storage
quota in the Storage Pane. This feature gives you the ability to simulate
different devices and test the behavior of your apps in low disk availability
scenarios. Go to **Application** then **Storage**, enable the
**Simulate custom storage quota** checkbox, and enter any valid number to
simulate the storage quota.

{% Img src="image/0g2WvpbGRGdVs0aAPc6ObG7gkud2/tYlbklNwF6DFKNV2cY0D.png", alt="DevTools Storage pane.", width="800", height="567" %}

While working on this article, I wrote a [simple tool][glitch-storage] to
attempt to quickly use as much storage as possible. It's a quick and easy way
to experiment with different storage mechanisms, and see what happens when
you use all of your quota.

## How to handle going over quota? {: #over-quota }

What should you do when you go over quota? Most importantly, you should
always catch and handle write errors, whether it's a `QuotaExceededError` or
something else. Then, depending on your app design, decide how to handle it.
For example delete content that hasn't been accessed in a long time, remove
data based on size, or provide a way for users to choose what they want to delete.

Both IndexedDB and the Cache API both throw a `DOMError` named
`QuotaExceededError` when you've exceeded the quota available.

### IndexedDB

If the origin has exceeded its quota, attempts to write to IndexedDB will
fail. The transaction's `onabort()` handler will be called, passing an event.
The event will include a `DOMException` in the error property. Checking the
error `name` will return `QuotaExceededError`.

```js
const transaction = idb.transaction(['entries'], 'readwrite');
transaction.onabort = function(event) {
  const error = event.target.error; // DOMException
  if (error.name == 'QuotaExceededError') {
    // Fallback code goes here
  }
};
```

### Cache API

If the origin has exceeded its quota, attempts to write to the Cache API
will reject with a `QuotaExceededError` `DOMException`.

```js
try {
  const cache = await caches.open('my-cache');
  await cache.add(new Request('/sample1.jpg'));
} catch (err) {
  if (error.name === 'QuotaExceededError') {
    // Fallback code goes here
  }
}
```

## How does eviction work? {: #eviction }

Web storage is categorized into two buckets, "Best Effort" and "Persistent".
Best effort means the storage can be cleared by the browser without
interrupting the user, but is less durable for long-term or critical data.
Persistent storage is not automatically cleared when storage is low. The user
needs to manually clear this storage (via browser settings).

By default, a site's data (including IndexedDB, Cache API, etc) falls into
the best effort category, which means unless a site has
[requested persistent storage][persistent-storage], the browser may evict
site data at its discretion, for example, when device storage is low.

The eviction policy for best effort is:

* Chromium-based browsers will begin to evict data when the browser runs out
  of space, clearing all site data from the least recently used origin first,
  then the next, until the browser is no longer over the limit.
* Internet Explorer 10+ will not evict data, but will prevent the origin from
  writing any more.
* Firefox will begin to evict data when the available disk space is filled up,
  clearing all site data from the least recently used origin first, then the
  next, until the browser is no longer over the limit.
* Safari previously did not evict data, but recently implemented a new
  seven-day cap on all writable storage (see below).

Starting in iOS and iPadOS 13.4 and Safari 13.1 on macOS, there is a
seven-day cap on all script writable storage, including IndexedDB, service
worker registration, and the Cache API. This means Safari will evict all
content from the cache after seven days of Safari use if the user does not
interact with the site. This eviction policy **does not apply to installed
PWAs** that have been added to the home screen. See
[Full Third-Party Cookie Blocking and More][webkit-itp-blog] on the WebKit
blog for complete details.

{% Aside %}
  You can request [persistent storage](/persistent-storage/) for your site to
  protect critical user or application data.
{% endAside %}

## Bonus: Why use a wrapper for IndexedDB

IndexedDB is a low level API that requires significant setup before use,
which can be particularly painful for storing simple data.  Unlike most modern
promise-based APIs, it is event based. Promise wrappers like
[idb][idb-wrapper] for IndexedDB hide some of the powerful features but more
importantly, hide the complex machinery (e.g. transactions, schema versioning)
that comes with the IndexedDB library.

## Conclusion

Gone are the days of limited storage and prompting the user to store more and
more data. Sites can store effectively all of the resources and data they
need to run. Using the [StorageManager API][mdn-storagemanager] you can
determine how much is available to you, and how much you've used. And with
[persistent storage][persistent-storage], unless the user removes it, you
can protect it from eviction.

### Additional resources

* [IndexedDB Best Practices][idb-best-practices]
* [Chrome Web Storage and Quota Concepts][chrome-storage-doc]

### Thanks

Special thanks to Jarryd Goodman, Phil Walton, Eiji Kitamura, Daniel Murphy,
Darwin Huang, Josh Bell, Marijn Kruisselbrink, and Victor Costan for reviewing
this article. Thanks to Eiji Kitamura, Addy Osmani, and Marc Cohen who wrote
the original articles that this is based on. Eiji wrote a helpful tool
called [Browser Storage Abuser][storage-abuser] that was useful in validating
current behavior. It allows you to store as much data as possible and see the
storage limits on your browser. Thanks to Francois Beaufort who did the digging
into Safari to figure out its storage limits.

The hero image is by Guillaume Bolduc on
[Unsplash](https://unsplash.com/photos/uBe2mknURG4).

[mdn-sessionstorage]: https://developer.mozilla.org/en/docs/Web/API/Window/sessionStorage
[mdn-localstorage]: https://developer.mozilla.org/en/docs/Web/API/Window/localStorage
[mdn-indexeddb]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
[mdn-storagemanager]: https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate
[mdn-fileapi]: https://developer.mozilla.org/en-US/docs/Web/API/File_and_Directory_Entries_API/Introduction
[mdn-appcache]: https://developer.mozilla.org/en-US/docs/Web/API/Window/applicationCache
[mdn-cookies]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies
[cache-primer]: https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/cache-api
[sw-primer]: https://developers.google.com/web/fundamentals/primers/service-workers
[idb-wrapper]: https://www.npmjs.com/package/idb
[w3c-websql]: https://www.w3.org/TR/webdatabase/
[caniuse-fs]: https://caniuse.com/#feat=filesystem
[caniuse-sm]: https://caniuse.com/#feat=mdn-api_storagemanager
[ff-usage-limits]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Browser_storage_limits_and_eviction_criteria#Storage_limits
[persistent-storage]: https://developers.google.com/web/updates/2016/06/persistent-storage
[storage-abuser]: http://demo.agektmr.com/storage/
[webkit-itp-blog]: https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
[caniuse-websql]: https://caniuse.com/#feat=sql-storage
[glitch-storage]: https://storage-quota.glitch.me/
[idb-best-practices]: https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/indexeddb-best-practices
[chrome-storage-doc]: https://docs.google.com/document/d/19QemRTdIxYaJ4gkHYf2WWBNPbpuZQDNMpUVf8dQxj4U/preview
