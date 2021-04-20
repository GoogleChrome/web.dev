---
title: Receiving shared data with the Web Share Target API
subhead: Sharing on mobile made simple with the Web Share Target API
authors:
  - petelepage
  - joemedley
date: 2019-11-08
updated: 2020-02-09
hero: image/admin/RfxdrfKdh5Fp8camulRt.png
alt: An illustration demonstrating that platform-specific apps can now share content with web apps.
description: |
  On a mobile device, sharing should be as simple as clicking the Share button,
  choosing an app, then choosing who to share with. The Web Share Target API
  allows installed web apps to register with the underlying operating system to receive shared content.
tags:
  - blog
  - capabilities
  - progressive-web-apps
feedback:
  - api
---

On a mobile device, sharing should be as straightforward as clicking the **Share** button,
choosing an app, and choosing who to share with. For example, you may want to
share an interesting article, either by emailing it to friends or tweeting it to
the world.

In the past, only platform-specific apps could register with the operating system to
receive shares from other installed apps. But with the Web Share Target API,
installed web apps can register with the underlying operating system
as a share target to receive shared content.

{% Aside %}
The Web Share Target API is only half of the magic. Web apps can share data,
files, links, or text using the Web Share API. See
[Web Share API](/web-share/) for details.
{% endAside %}

<figure class="w-figure w-figure--inline-right">
  {% Img src="image/admin/Q4nuOQMpsQrTilpXA3fL.png", alt="Android phone with the 'Share via' drawer open.", width="400", height="377" %}
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    System-level share target picker with an installed PWA as an option.
  </figcaption>
</figure>

## See Web Share Target in action

1. Using either Chrome 76 or later for Android, or Chrome 89 or later on
   desktop, open the [Web Share Target demo][demo].
2. When prompted, click **Install** to add the app to your home screen, or
   use the Chrome menu to add it to your home screen.
3. Open any app that supports sharing, or use the Share button
   in the demo app.
4. From the target picker, choose **Web Share Test**.

After sharing, you should see all of the shared information in
the web share target web app.

## Register your app as a share target

To register your app as a share target, it needs to meet [Chrome's
installability criteria][installability]. In addition, before a user can share
to your app, they must add it to their home screen. This prevents sites from
randomly adding themselves to the user's share intent chooser and ensures that
sharing is something that users want to do with your app.

## Update your web app manifest

To register your app as a share target, add a `share_target` entry to its [web
app manifest][manifest]. This tells the operating system to include your app as
an option in the intent chooser. What you add to the manifest controls the data
that your app will accept. There are three common scenarios for the `share_target`
entry:

- Accepting basic information
- Accepting application changes
- Accepting files

{% Aside %}
You can only have one `share_target` per manifest, if you want to share to
different places within your app, provide that as an option within the share
target landing page.
{% endAside %}

### Accepting basic information

If your target app is merely accepting basic information such as data, links,
and text, add the following to the `manifest.json` file:

```json
"share_target": {
  "action": "/share-target/",
  "method": "GET",
  "params": {
    "title": "title",
    "text": "text",
    "url": "url"
  }
}
```

If your application already has a share URL scheme, you can replace the `param`
values with your existing query parameters. For example, if your share URL
scheme uses `body` instead of `text`, you could replace `"text": "text"` with `"text":
"body"`.

The `method` value defaults to `"GET"` if not provided. The `enctype` field, not
shown in this example, indicates the [type of encoding][encoding] for the data.
For the `"GET"` method, `enctype` defaults to `"application/x-www-form-urlencoded"` and
is ignored if it's set to anything else.

### Accepting application changes

If the shared data changes the target app in some way—for example, saving a
bookmark in the target application—set the `method` value to `"POST"` and include
the `enctype` field. The example below creates a bookmark in the target app,
so it uses `"POST"` for the `method` and `"multipart/form-data"` for the
`enctype`:

```json/4-5
{
  "name": "Bookmark",
  "share_target": {
    "action": "/bookmark",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "url": "link"
    }
  }
}
```

### Accepting files

As with application changes, accepting files requires that `method` be `"POST"`
and that `enctype` be present. Additionally, `enctype` must be
`"multipart/form-data"`, and a `files` entry must be added.

You must also add a `files` array defining the types of files your app accepts. The
array elements are entries with two members: a `name` field and an `accept`
field. The `accept` field takes a MIME type, a file extension, or an array
containing both. It's best to provide an array that includes both a
MIME type and a file extension since operating systems differ in which
they prefer.

```json/5,10-19
{
  "name": "Aggregator",
  "share_target": {
    "action": "/cgi-bin/aggregate",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "name",
      "text": "description",
      "url": "link",
      "files": [
        {
          "name": "records",
          "accept": ["text/csv", ".csv"]
        },
        {
          "name": "graphs",
          "accept": "image/svg+xml"
        }
      ]
    }
  }
}
```

## Handle the incoming content

How you deal with the incoming shared data is up to you and depends on your
app. For example:

* An email client could draft a new email using `title` as the subject of an
  email, with `text` and `url` concatenated together as the body.
* A social networking app could draft a new post ignoring `title`, using
  `text` as the body of the message, and adding `url` as a link. If `text` is
  missing, the app might use `url` in the body as well. If `url` is missing,
  the app might scan `text` looking for a URL and add that as a link.
* A photo sharing app could create a new slideshow using `title` as the
  slideshow title, `text` as a description, and `files` as the slideshow images.
* A text messaging app could draft a new message using `text` and `url`
  concatenated together and dropping `title`.

### Processing GET shares

If the user selects your application, and your `method` is `"GET"` (the
default), the browser opens a new window at the `action` URL. The browser then
generates a query string using the URL-encoded values supplied in the manifest.
For example, if the sharing app provides `title` and `text`, the query string is
`?title=hello&text=world`. To process this, use a `DOMContentLoaded` event
listener in your foreground page and parse the query string:

```js
window.addEventListener('DOMContentLoaded', () => {
  const parsedUrl = new URL(window.location);
  // searchParams.get() will properly handle decoding the values.
  console.log('Title shared: ' + parsedUrl.searchParams.get('title'));
  console.log('Text shared: ' + parsedUrl.searchParams.get('text'));
  console.log('URL shared: ' + parsedUrl.searchParams.get('url'));
});
```

Be sure to use a service worker to [precache](https://developers.google.com/web/ilt/pwa/caching-files-with-service-worker) the `action`
page so that it will load quickly and work reliably, even if the user is offline.
[Workbox](https://developers.google.com/web/tools/workbox/) is a tool that can help you
[implement precaching](/precache-with-workbox/) in your service worker.

### Processing POST shares

If your `method` is `"POST"`, as it would be if your target app accepts a saved
bookmark or shared files, then the body of the incoming `POST` request contains
the data passed by the sharing application, encoded using the `enctype` value
provided in the manifest.

The foreground page cannot process this data directly. Since the page sees the data as
a request, the page passes it to the service worker, where you can intercept it with a
`fetch` event listener. From here, you can pass the data back to the foreground
page using `postMessage()` or pass it on to the server:

```js
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // If this is an incoming POST request for the
  // registered "action" URL, respond to it.
  if (event.request.method === 'POST' &&
      url.pathname === '/bookmark') {
    event.respondWith((async () => {
      const formData = await event.request.formData();
      const link = formData.get('link') || '';
      const responseUrl = await saveBookmark(link);
      return Response.redirect(responseUrl, 303);
    })());
  }
});
```

### Verifying shared content

<figure class="w-figure w-figure--inline-right">
  {% Img src="image/admin/hSwbgPk8IFgPC81oJbxZ.png", alt="An Android phone displaying the demo app with shared content.", width="400", height="280" %}
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    The sample sharing target app.
  </figcaption>
</figure>

Be sure to verify incoming data. Unfortunately, there is no guarantee that other
apps will share the appropriate content in the right parameter.

For example, on Android, the [`url` field will be
empty](https://bugs.chromium.org/p/chromium/issues/detail?id=789379) because
it's not supported in Android's share system. Instead, URLs will often appear in
the `text` field, or occasionally in the `title` field.

<div class="w-clearfix"></div>

## Browser support

As of early 2021, the Web Share Target API is supported by:

- Chrome and Edge 76 or later on Android.
- Chrome 89 or later on Chrome OS.

On all platforms, your web app has to be [installed][installability] before it will show up as a
potential target for receiving shared data.

## Sample applications

- [Squoosh](https://github.com/GoogleChromeLabs/squoosh)
- [Scrapbook PWA](https://github.com/GoogleChrome/samples/blob/gh-pages/web-share/README.md#web-share-demo)


[spec]: https://wicg.github.io/web-share-target/
[demo]: https://web-share.glitch.me/
[demo-source]: https://glitch.com/edit/#!/web-share?path=index.html
[cr-bug]: https://bugs.chromium.org/p/chromium/issues/detail?id=668389
[cr-status]: https://www.chromestatus.com/feature/5662315307335680
[explainer]: https://github.com/WICG/web-share-target/blob/master/docs/explainer.md
[issues]: https://github.com/WICG/web-share-target/issues
[wicg-discourse]: https://discourse.wicg.io/t/web-share-target-api-for-websites-to-receive-shared-content/1854
[manifest]:/add-manifest/
[installability]:https://developers.google.com/web/fundamentals/app-install-banners/#criteria
[encoding]:https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-enctype
