---
title: Persistent storage
subhead: Persistent storage can help protect critical data from eviction, and reduce the chance of data loss.
authors:
  - petelepage
description: Persistent storage can help protect critical data from eviction, and reduce the chance of data loss.
date: 2020-05-12
updated: 2020-05-12
tags:
  - blog
  - storage
  - progressive-web-apps
hero: image/admin/0TWeS0GZhDTpPzQVhDVS.jpg
alt: Printed circuit board
feedback:
  - api
---

When faced with storage pressure like low disk space, browsers will
typically [evict data][eviction], including from the Cache API and IndexedDB,
from the least recently used origin. This may cause data loss if the app
hasn't synced data with the server, and reduce the reliability of the app by
removing resources required for the app to work, both of which lead to
negative user experiences.

Thankfully, research by the Chrome team shows that data is very rarely
cleared automatically by Chrome. It is far more common for users to manually
clear storage. Thus if a user visits your site regularly, the chances are
small that your data will be evicted. To prevent the browser from deleting
your data, you can request that your entire site's storage be marked
persistent.

{% Aside %}
  Requesting that all your site's data be marked as persistent should only
  be done for critical data (for example, end-to-end encryption keys) that
  if not backed up to the cloud, could result in significant data loss if
  not saved. Persistent storage is not deleted by the browser, even if
  storage is running low. It will only be deleted if the user chooses to
  remove it via their site settings.
{% endAside %}

Persistent storage is [supported in many modern][caniuse-persistent] browsers.
To learn more about eviction, how much you can store, and how to handle quota
limitations, see [Storage for the web](/storage-for-the-web/).

## Check if your site's storage has been marked as persistent

You can use JavaScript to determine if your site's storage has been marked
as persistent. Calling `navigator.storage.persisted()` returns a Promise that
resolves with a boolean, indicating whether storage has been marked as
persisted.

```js
// Check if site's storage has been marked as persistent
if (navigator.storage && navigator.storage.persist) {
  const isPersisted = await navigator.storage.persisted();
  console.log(`Persisted storage granted: ${isPersisted}`);
}
```

## When should I ask for persistent storage?

The best time to request your storage be marked as persistent is when you
save critical user data, and the request should ideally be wrapped in a user
gesture. Do not ask for persistent storage on page load, or in other bootstrap
code, the browser may prompt the user for permission. If the user
isn't doing anything that they think needs to be saved, the prompt may be
confusing, and they'll likely reject the request. Additionally, don't prompt
too frequently. If the user decided not to grant permission, don't immediately
prompt again on the next save.

## Request persistent storage

To request persistent storage for your site's data, call
`navigator.storage.persist()`. It returns a Promise that resolves with a
boolean, indicating whether the persistent storage permission was granted.

```js
// Request persistent storage for site
if (navigator.storage && navigator.storage.persist) {
  const isPersisted = await navigator.storage.persist();
  console.log(`Persisted storage granted: ${isPersisted}`);
}
```

{% Aside %}
  The API names to *check* if your site's storage has already been marked
  persistent, and to *request* persistent storage are very similar. The way
  I remember the difference is `persisted()` is past-tense, and is used to
  check if it's already persist**ed**. Whereas `persist()` is present-tense
  and asks for it now.
{% endAside %}

### How is permission granted?

Persistent storage is treated as a [permission][permission]. Browsers use
different factors to decide whether to grant persistent storage permissions.

#### Chrome and other Chromium-based browsers

Chrome, and most other Chromium-based browsers automatically handle the
permission request, and do not show any prompts to the user. Instead, if a
site is considered important, the persistent storage permission is
automatically granted, otherwise it is silently denied.

The heuristics to determine if a site is important include:

- How high is the level of site engagement?
- Has the site been installed or bookmarked?
- Has the site been granted permission to show notifications?

If the request was denied, it can be requested again later and will be
evaluated using the same heuristics.

#### Firefox

Firefox delegates the permission request to the user. When persistent storage
is requested, it prompts the user with a UI popup asking if they will allow
the site to store data in persistent storage.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/o8W7pNTZ5dFKeDg2cmvA.jpg", alt="A popup shown by Firefox when a site requests persistent storage.", width="428", height="177" %}
  <figcaption class="w-figcaption">
    A popup shown by Firefox when a site requests persistent storage.
  </figcaption>
</figure>

## What storage is protected by persistent storage?

If the persistent storage permission is granted, the browser will not evict
data stored in:

- Cache API
- Cookies
- DOM Storage (Local Storage)
- File System API (browser-provided and sandboxed file system)
- IndexedDB
- Service workers
- App Cache (deprecated, should not be used)
- WebSQL (deprecated, should not be used)

## How to turn off persistent storage

At this time, there is no programmatic way to tell the browser you no longer
need persistent storage.

## Conclusion

Research from the Chrome team shows that although possible, stored data is
rarely cleared automatically by Chrome. To protect critical data that may
not be stored in the cloud, or will result in significant data loss,
persistent storage can be a helpful tool to ensure that your data is not
removed by the browser when the local device is faced with storage pressure.
And remember, only request persistent storage when the user is most likely to
want it.

### Thanks

Special thanks to Victor Costan, and Joe Medley for reviewing this article.
Thanks to Chris Wilson who wrote the original version of this article that
first appeared on WebFundamentals.

Hero image by Umberto on [Unsplash](https://unsplash.com/photos/jXd2FSvcRr8)

[caniuse-persistent]: https://caniuse.com/#feat=mdn-api_permissions_persistent-storage_permission
[eviction]: /storage-for-the-web/#eviction
[permission]: https://storage.spec.whatwg.org/#persistence
