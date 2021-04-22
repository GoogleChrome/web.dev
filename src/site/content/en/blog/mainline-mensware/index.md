---
layout: post
title: Mainline Menswear implements PWA and sees a 55% conversion rate uplift
authors:
  - charistheodoulou
  - natashakosoglov
  - thomassteiner
description: >
  Mainline Menswear implements a Progressive Web App (PWA) and sees a 55% conversion rate uplift for
  users that installed the app with caching and offline capabilities.
date: 2021-04-20
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/Yz5G0leLpdHLidygym31.jpg
tags:
  - blog
  - case-study
  - service-worker
  - progressive-web-apps
---

Mainline is an online clothing retailer that offers the biggest designer brand names in fashion. The
UK-based company entrusts its team of in-house experts, blended strategically with key partners, to
provide a frictionless shopping experience for all. With market presence in over 100 countries via
seven custom-built territorial websites and an app, Mainline will continue to ensure the ecommerce
offering is rivalling the competition.

## Challenge

Mainline Menswear's goal was to complement the current mobile optimized website with progressive
features that would adhere to their 'mobile first' vision, focusing on mobile-friendly design and
functionality with a growing smartphone market in mind.

## Solution

The objective was to build and launch a PWA that complemented the original mobile friendly version
of the Mainline Menswear website, and then compare the stats to their hybrid mobile app,
which is currently available on Android and iOS.

Once the app launched and was being used by a small section of Mainline Menswear users, they were able to
determine the difference in key stats between PWA, app, and Web.

The approach Mainline took when converting their website to a PWA was to make sure that
the framework they selected for their website (Nuxt.js, utilizing Vue.js) would be future-proof
and enable them to take advantage of fast moving web technology.

## Results

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">139<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">More pages per session in PWA vs. web.</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">161<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Longer session durations in PWA vs. web.</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">10<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Lower bounce rate in PWA vs. web</p>
  </div>
</div>

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">12.5<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Higher average order value in PWA vs. web</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">55<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Higher conversion rate in PWA vs. web.</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">243<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Higher revenue per session in PWA vs. web.</p>
  </div>
</div>

## Technical deep dive

[Mainline Menswear](https://www.mainlinemenswear.co.uk/) is using the
[Nuxt.js framework](https://nuxtjs.org/) to bundle and render their site, which is a single page
application (SPA).

### Generating a service worker file

For generating the service worker, Mainline Menswear added configuration through a custom
implementation of the [`nuxt/pwa` Workbox module](https://pwa.nuxtjs.org/workbox).

The reason they forked the `nuxt/pwa` module was to allow the team to add more customizations to the
service worker file that they weren't able to or had issues with when using the standard version.
One such optimization was around the [offline functionality](#providing-offline-functionality) of
the site like, for example, serving a default offline page and gathering analytics while offline.

### Anatomy of the web application manifest

The team generated a manifest with icons for different mobile app icon sizes and other web app
details like `name`, `description` and `theme_color`:

```json
{
  "name": "Mainline Menswear",
  "short_name": "MMW",
  "description": "Shop mens designer clothes with Mainline Menswear. Famous brands including Hugo Boss, Adidas, and Emporio Armani.",
  "icons": [
    {
      "src": "/_nuxt/icons/icon_512.c2336e.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#107cbb"
}
```

The web app, once installed, can be launched from the home screen without the browser getting in the
way. This is achieved by adding the `display` parameter in the web application manifest file:

```json
{
  "display": "standalone"
}
```

Last but not the least, the company is now able to easily track how many users are visiting their
web app from the home screen by simply appending a `utm_source` parameter in the `start_url` field of
the manifest:

```json
{
  "start_url": "/?utm_source=pwa"
}
```

{% Aside %} See [Add a web app manifest](/add-manifest/) for a more in-depth explanation of all the
web application manifest fields. {% endAside %}

### Runtime caching for faster navigations

Caching for web apps is a must for page speed optimization and for providing a better user
experience for returning users.

For caching on the web, there are quite a few
[different approaches](https://dev.to/jonchen/service-worker-caching-and-http-caching-p82). The team
is using a mix of the [HTTP cache](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching) and
the [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) for caching assets on the
client side.

The Cache API gives Mainline Menswear finer control over the cached assets, allowing them to apply
complex strategies to each file type. While all this sounds complicated and hard to set up and
maintain, [Workbox](https://developers.google.com/web/tools/workbox) provides them with an easy
way of declaring such complex strategies and eases the pain of maintenance.

#### Caching CSS and JS

For CSS and JS files, the team chose to cache them and serve them over the cache using the
[`StaleWhileRevalidate`](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-strategies.StaleWhileRevalidate)
Workbox strategy. This strategy allows them to serve all Nuxt CSS and JS files fast,
which significantly increases their site's performance.
At the same time, the files are being updated in the background to the latest version for the next visit:

```js
/* sw.js */
workbox.routing.registerRoute(
  /\/_nuxt\/.*(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'css_js',
  }),
  'GET',
);
```

#### Caching Google fonts

The strategy for caching Google Fonts depends on two file types:

* The stylesheet that contains the `@font-face` declarations.
* The underlying font files (requested within the stylesheet mentioned above).

```js
// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
workbox.routing.registerRoute(
  /https:\/\/fonts\.googleapis\.com\/*/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google_fonts_stylesheets',
  }),
  'GET',
);

// Cache the underlying font files with a cache-first strategy for 1 year.
workbox.routing.registerRoute(
  /https:\/\/fonts\.gstatic\.com\/*/,
  new workbox.strategies.CacheFirst({
    cacheName: 'google_fonts_webfonts',
    plugins: [
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
        maxEntries: 30,
      }),
    ],
  }),
  'GET',
);
```

{% Aside %} A full example of the common Google Fonts strategy can be found in the
[Workbox Docs](https://developers.google.com/web/tools/workbox/guides/common-recipes#google_fonts).
{% endAside %}

#### Caching images

For images, Mainline Menswear decided to go with two strategies. The first strategy applies
to all images coming from their CDN, which are usually product images. Their pages are image-heavy so
they are conscious of not taking too much of their users' device storage. So through Workbox, they
added a strategy that is **caching images coming only from their CDN** with a **maximum
of 60 images** using the
[`ExpirationPlugin`](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-expiration.ExpirationPlugin).

The 61st (newest) image requested, replaces the 1st (oldest) image so that no more than 60 product
images are cached at any point in time.

```js
workbox.routing.registerRoute(
  ({ url, request }) =>
    url.origin === 'https://mainline-menswear-res.cloudinary.com' &&
    request.destination === 'image',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'product_images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        // Only cache 60 images.
        maxEntries: 60,
        purgeOnQuotaError: true,
      }),
    ],
  }),
);
```

The second image strategy handles the rest of the images being requested by the origin.
These images tend to be very few and small across the whole origin, but to be on the safe side,
the number of these cached images is also limited to 60.

```js
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg|webp)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        // Only cache 60 images.
        maxEntries: 60,
        purgeOnQuotaError: true,
      }),
    ],
  }),
);
```

{% Aside 'objective' %} Even though the caching strategy is exactly the same as the previous one, by
splitting images into two caches (`product_images` and `images`), it allows for more flexible
updates to the strategies or caches. {% endAside %}

### Providing offline functionality

The offline page is precached right after the service worker is installed and activated. They do
this by creating a list of all offline dependencies: the offline HTML file and an offline SVG icon.

```js
const OFFLINE_HTML = '/offline/offline.html';
const PRECACHE = [
  { url: OFFLINE_HTML, revision: '70f044fda3e9647a98f084763ae2c32a' },
  { url: '/offline/offline.svg', revision: 'efe016c546d7ba9f20aefc0afa9fc74a' },
];
```

The precache list is then fed into Workbox which takes care of all the heavy lifting of adding the
URLs to the cache, checking for any revision mismatch, updating, and serving the
precached files with a `CacheFirst` strategy.

```js
workbox.precaching.precacheAndRoute(PRECACHE);
```

#### Handling offline navigations

Once the service worker activates and the offline page is precached, it is then used to **respond to
offline navigation requests by the user**. While Mainline Menswear's web app is an SPA, the offline
page shows only after the page reloads, the user closes and reopens the browser tab, or when the web
app is launched from the home screen while offline.

To achieve this, Mainline Menswear provided a fallback to failed
[`NavigationRoute`](https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-routing.NavigationRoute)
requests with the precached offline page:

```js/4-6
const htmlHandler = new workbox.strategies.NetworkOnly();
const navigationRoute = new workbox.routing.NavigationRoute(({ event }) => {
    const request = event.request;
    // A NavigationRoute matches navigation requests in the browser, i.e. requests for HTML
    return htmlHandler.handle({ event, request }).catch(() => caches.match(OFFLINE_HTML, {
        ignoreSearch: true
    }));
});
workbox.routing.registerRoute(navigationRoute);
```

## Demo

<figure class="w-figure">
  {% Video src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/eJgApjFLpSRFMcMyC4e0.mp4", width="300", autoplay=true, loop=true, muted=true %}
  <figcaption class="w-figcaption">Offline page example as seen on www.mainlinemenswear.co.uk.</figcaption>
</figure>

### Reporting successful installs

Apart from the home screen launch tracking (with `"start_url": "/?utm_source=pwa"` in the web
application manifest), the web app also reports successful app installs by listening to the
`appinstalled` event on `window`:

```js
window.addEventListener('appinstalled', (evt) => {
  ga('send', 'event', 'Install', 'Success');
});
```

{% Blockquote 'Andy Hoyle, Head of Development' %} Adding PWA capabilities to your website will
further enhance your customers experience of shopping with you, and will be quicker to market than a
[platform-specific] app. {% endBlockquote %}

## Conclusion

To learn more about progressive web apps and how to build them, head to the
[Progressive Web Apps section](/progressive-web-apps/) on web.dev.

To read more Progressive Web Apps case studies, browse to the
[case studies section](https://web.dev/tags/case-study/).
