---
title: Integrate PWAs into built-in sharing UIs with Workbox
subhead: How to get your PWA to show up next to platform-specific apps in system-level sharing UIs
description: |
  How to register routes in Workbox so that your Progressive Web App shows up in system-level
  sharing UIs, alongside platform-specific apps.
authors:
  - samrichard
  - joemedley
  - jeffposnick
date: 2019-12-19
hero: image/admin/Cos9WFMqJGVZjBdQHcMU.jpg
alt: Two pairs of hands holding a cup of tomatoes.
tags:
  - blog
  - capabilities
  - workbox
  - test-post
feedback:
  - api
---

The [Web Share Target API](/web-share-target/) lets you display
your [Progressive Web App](https://developers.google.com/web/progressive-web-apps/checklist) in a
user's system-level share [sheet] after it's been installed. While it works great if you have a server
available to receive the request, it's much harder to get working if you don't.

In this article we'll use
[Workbox](https://developers.google.com/web/tools/workbox), a set of JavaScript
libraries for adding offline support to web apps, to create a share target URL
that lives entirely inside your [service worker](/service-workers-cache-storage/). This lets static sites and
single-page apps serve as share targets without a dedicated server endpoint.

<figure class="w-figure w-figure--inline-right">
  {% Img src="image/admin/mp2bdiP2gVeMQ4UX12vd.png", alt="Android phone with the 'Share via' drawer open.", width="400", height="377" %}
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    System-level share target picker with an installed PWA called
    <code>Share Target Test</code> as an option.
  </figcaption>
</figure>

## On the same page

If you're unfamiliar with how Web Share Target Works, [Receiving shared data with the Web Share
Target API](/web-share-target/) gives you an in-depth introduction.
Here's a quick review.

There are two parts to implementing web share target functionality. First,
update your [web app manifest](/add-manifest/) to indicate that you want your app to be a share
target when installed. The following example directs shares to the `/share` url
via a `POST` request. It is encoded as a multipart form, with title being called
`name`, text being called `description`, and JPEG images being called `photos`.

```json
…
"share_target": {
  "action": "/share",
  "method": "POST",
  "enctype": "multipart/form-data",
  "params": {
    "title": "name",
    "text": "description",
    "files": [
      {
        "name": "photos",
        "accept": ["image/jpeg", ".jpg"]
      }
    ]
  }
}
…
```

## Service worker share targets with Workbox

While normally handled by a server endpoint, a neat trick you can do for a share
target is to register a route directly in your service worker to handle the
request. This will let your app be a share target without a backend.

You do this in [Workbox](https://developers.google.com/web/tools/workbox) by
registering a route that's handled by your service worker. Start by importing
`registerRoute` from `'workbox-routing'`. Notice that it's registered for the
`/share` route, the same one listed in the example web app manifest. In
response it calls `shareTargetHandler()`.

```js
import { registerRoute } from 'workbox-routing';

registerRoute(
  '/share',
  shareTargetHandler,
  'POST'
);
```

The `shareTargetHandler()` function is asynchronous and takes the event, awaits
the form data, then retrieves the media files from that.

```js
async function shareTargetHandler ({event}) {
  const formData = await event.request.formData();
  const mediaFiles = formData.getAll('media');

  for (const mediaFile of mediaFiles) {
    // Do something with mediaFile
    // Maybe cache it or post it back to a server
  });

  // Do something with the rest of formData as you need
  // Maybe save it to IndexedDB
};
```

You can then do whatever you'd like with these files. You can cache them. You
can send them somewhere with a fetch request. You can even use the other
manifest options, maybe serving a page with some query parameters for the other
shared items or storing the data and pointers to the media in the [Cache Storage
API](https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/cache-api)
or [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API).

You can try it out on the sample app [Fugu
Journal](https://fugu-journal.web.app/) and see its service worker
implementation in its [source
code](https://github.com/chromeos/bridging-the-native-app-gap/blob/master/fugu-journal/src/js/service-worker.js).

One common thing you might do is hold shared resources until better network
connections are available. Workbox also supports [periodic background
sync](/periodic-background-sync/).

## Conclusion

The Share Target API is a simple way to deeply integrate your Progressive Web
App into user's devices, putting them on-par with platform-specific applications for the
critical task of sharing content between apps. But doing so usually requires a
server available to receive the request. By leveraging Workbox to create a share
target route directly in your service worker, your app is free of this
constraint, allowing Share Target to work for apps while offline and without
backends.

Photo by [Elaine Casap](https://unsplash.com/@ecasap?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/s/photos/share?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

[sheet]: https://material.io/develop/android/components/bottom-sheet-behavior/
