---
layout: post
title: It's time to lazy-load offscreen iframes!
subhead: Browser-level native lazy-loading for iframes is here
authors:
  - addyosmani
date: 2020-07-24
#updated: 2020-07-21
hero: hero.png
alt: Phone outline with loading image and assets
description: |
  This post covers the loading attribute and how it can be used
  to control the loading of iframes.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
---

[Native lazy-loading for images](/native-lazy-loading) landed in Chrome 76 via
the `loading` attribute and later came to Firefox. We are happy to share that
**native lazy-loading for iframes** is now
[standardized](https://github.com/whatwg/html/pull/5579) and is also 
supported in Chrome and Chromium-based browsers.

```html/1
<iframe src="https://example.com"
        loading="lazy"
        width="600"
        height="400"></iframe>
```

Native lazy-loading of iframes defers offscreen iframes from being loaded
until the user scrolls near them. This saves data, speeds up the loading of
other parts of the page, and reduces memory usage.

This [demo](https://lazy-load.netlify.app/iframes/) of `<iframe loading=lazy>`
shows lazy-loading video embeds:

<figure class="w-figure w-figure--fullbleed">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/iframe-lazy-loading/lazyload-iframes-compressed.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/iframe-lazy-loading/lazyload-iframes-compressed.mp4" type="video/mp4">
  </video>
</figure>


### Why should we lazy-load iframes?

Third-party embeds cover a wide range of use cases, from video players, to
social media posts, to ads. Often this content is not immediately visible in
the user's viewport. Rather, it's only seen once they scroll further down the
page. Despite this, users pay the cost of downloading data and costly
JavaScript for each frame, even if they don't scroll to it.

<figure class="w-figure">
<img src="./iframe-lazyloading.png" alt="Data-savings from using iframe
lazy-loading for an iframe. Eager loading pulls in 3MB in this example, while
lazy-loading does not pull in this code until the user scrolls closer to the
iframe.">
</figure>

Based off Chrome's research into [automatically lazy-loading offscreen iframes
for Data Saver
users](https://blog.chromium.org/2019/10/automatically-lazy-loading-offscreen.html),
lazy-loading iframes could lead to 2-3% median data savings, 1-2% [First
Contentful Paint](/fcp/) reductions at the median, and 2% [First Input
Delay](/fid/) (FID) improvements at the 95th percentile.

### How does native lazy-loading for iframes work?

The `loading` attribute allows a browser to defer loading offscreen iframes and
images until users scroll near them. `loading` supports three values:

*   `lazy`: is a good candidate for lazy-loading.
*   `eager`: is not a good candidate for lazy-loading. Load right away.
*   `auto`: browser will determine whether or not to lazily load.

{% Aside %}
`auto` is currently a non-standard value, but is the default in Chrome today.
Chrome intends on bringing a proposal for this value to the standards table.
{% endAside %}

Using the `loading` attribute on iframes works as follows:

```html
<!-- Lazy-load the iframe -->
<iframe src="https://example.com" 
        loading="lazy" 
        width="600" 
        height="400"></iframe>

<!-- Eagerly load the iframe -->
<iframe src="https://example.com" 
        width="600" 
        height="400"></iframe>

<!-- or use loading="eager" to out of automatic 
lazy-loading in Lite Mode -->
<iframe src="https://example.com" 
        loading="eager" 
        width="600" 
        height="400"></iframe>
```

Not specifying the attribute at all will have the same impact as explicitly
eagerly loading the resource, except for [Lite
Mode](https://blog.chromium.org/2019/04/data-saver-is-now-lite-mode.html)
users, where Chrome will use the `auto` value to decide whether it should be
lazy-loaded.

If you need to _dynamically_ create iframes via JavaScript, setting
`iframe.loading = 'lazy'` on the element is also
[supported](https://bugs.chromium.org/p/chromium/issues/detail?id=993273):

```js/2
var iframe = document.createElement('iframe');
iframe.src = 'https://example.com';
iframe.loading = 'lazy';
document.body.appendChild(iframe);
```

#### iframe-specific lazy-loading behavior

The loading attribute affects iframes differently than images, depending on
whether the iframe is hidden. (Hidden iframes are often used for analytics or
communication purposes.) Chrome uses the following criteria to determine
whether an iframe is hidden:

*   The iframe's width and height are `4px` or smaller.
*   `display: none` or `visibility: hidden` is applied.
*   The iframe is placed off-screen using negative X or Y positioning.
*   This criteria applies to both `loading=lazy` and `loading=auto`.

If an iframe meets any of these conditions, Chrome considers it hidden and
won't lazy-load it in most cases. iframes that aren't hidden will only load
when they're within the [load-in distance
threshold](/native-lazy-loading/#load-in-distance-threshold). Chrome shows a
placeholder for lazy-loaded iframes that are still being fetched.

### What impact might we see from lazy-loading popular iframe embeds?

What if we could change the web at large so that lazy-loading offscreen iframes
was the default? It would look a little like this:

Lazy-loading YouTube video embeds (saves ~500KB on initial page load):

```html/1
<iframe src="https://www.youtube.com/embed/YJGCZCaIZkQ"
        loading="lazy" 
        width="560" 
        height="315" 
        frameborder="0" 
        allow="accelerometer; autoplay; 
        encrypted-media; gyroscope; 
        picture-in-picture" 
        allowfullscreen></iframe>
```

**Anecdote:** when we switched to lazy-loading YouTube embeds for Chrome.com,
we saved 10 seconds off of how soon our pages could be interactive on mobile
devices. I have opened an internal bug with YouTube to discuss adding
`loading=lazy` to its embed code.

<figure class="w-figure">
<img src="./iframe-chromecom.png" alt="Chrome.com achieved a 10 second
reduction in Time To Interactive by lazy-loading offscreen iframes for their
YouTube video embed">
</figure>

{% Aside %}
If you are looking for more efficient ways to load YouTube embeds, you may be
interested in the [YouTube lite
component](https://github.com/paulirish/lite-youtube-embed).
{% endAside %}

**Lazy-loading Instagram embeds (saves >100KB gzipped on initial load):**

Instagram embeds provide a block of markup and a script, which injects an
iframe into your page. Lazy-loading this iframe avoids having to load all of
the script necessary for the embed. Given such embeds are often displayed below
the viewport in most articles, this seems like a reasonable candidate for
native lazy-loading of their iframe.

**Lazy-loading Spotify embeds (saves 514KB on initial load):**

```html
<iframe src="https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3" 
        loading="lazy"
        width="300" 
        height="380" 
        frameborder="0" 
        allowtransparency="true" 
        allow="encrypted-media"></iframe>
```

Although the above embeds illustrate the potential benefits to lazy-loading
iframes for media content, there's the potential to also see these benefits for
ads.  

### Case study: Natively lazy-loading the Facebook's social plugins

Facebook's _social plugins_ allow developers to embed Facebook content in their
web pages. There's a number of these plugins offered, such as embedded posts,
photos, videos, comments… The most popular is the [Like
plugin](https://developers.facebook.com/docs/plugins/like-button/) - a button
that shows a count of who has "liked" the page. By default, embedding the Like
plugin in a webpage (using the FB JSSDK) pulls in ~215KB of resources, 197KB of
which is JavaScript. In many cases, the plugin may appear at the end of an
article or near the end of a page, so loading it eagerly when it's offscreen
may be suboptimal.

<figure class="w-figure">
  <img class="w-screenshot" src="./fblike.png" alt="Facebook Like Button">
</figure>

Thanks to engineer Stoyan Stefanov, [all of Facebook's social plugins now
support native iframe
lazy-loading](https://developers.facebook.com/docs/plugins/like-button#settings).
Developers who opt in to lazy-loading via the plugins' `data-lazy`
configuration will now be able to avoid it loading until the user scrolls
nearby. This enables the embed to still fully function for users that need it,
while offering data-savings for those who are not scrolling all the way down a
page. We are hopeful this is the first of many embeds to explore native iframe
lazy-loading in production.

### Wait, can't browsers just automatically lazy-load offscreen iframes?

They certainly can. In Chrome 77, Chrome added support for automatically
natively lazy-loading offscreen images and iframes when a user has opted into
[Lite Mode](https://blog.chromium.org/2019/04/data-saver-is-now-lite-mode.html)
(Data Saver mode) in Chrome for Android. 

Lite Mode is commonly used in regions of the world where network connection
quality and data plans are not the greatest. Every byte matters and so
lazy-loading iframes has the potential to make a meaningful difference for
these users.

Origins can detect what percentage of their traffic is coming from Lite Mode
users by checking the `navigator.connection.saveData` property,
which is part of the [`NetworkInformation` API](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation).

### Can I lazy-load iframes cross-browser? Yes

Native iframe lazy-loading can be applied as a progressive enhancement. Browsers which support `loading=lazy` on iframes will lazy-load the iframe, while the `loading` attribute will be safely ignored in browsers which do not support it yet.

It is also possible to lazy-load offscreen iframes using the
[lazysizes](/use-lazysizes-to-lazyload-images/) JavaScript library. This may be desirable if you:

*   require more custom lazy-loading thresholds than what native lazy-loading
currently offers
*   wish to offer users a consistent iframe lazy-loading experience across browsers

```html/3
<script src="lazysizes.min.js" async></script>

<iframe frameborder="0"
	  class="lazyload"
    allowfullscreen=""
    width="600"
    height="400"
    data-src="//www.youtube.com/embed/ZfV-aYdU4uE">
</iframe>
```

Use the following pattern to feature detect lazy-loading and fetch
lazysizes when it's not available:


```html/2
<iframe frameborder="0"
	  class="lazyload"
    loading="lazy"
    allowfullscreen=""
    width="600"
    height="400"
    data-src="//www.youtube.com/embed/ZfV-aYdU4uE">
</iframe>

<script>
  if ('loading' in HTMLIFrameElement.prototype) {
    const iframes = document.querySelectorAll('iframe[loading="lazy"]');

    iframes.forEach(iframe => {
      iframe.src = iframe.dataset.src;
    });

  } else {
    // Dynamically import the LazySizes library
    const script = document.createElement('script');
    script.src =
      'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.2/lazysizes.min.js';
    document.body.appendChild(script);
  }

</script>
```

### Conclusion

Baking in native support for lazy-loading iframes makes it significantly
easier for you to improve the performance of your web pages. If you have any
feedback on native iframe lazy-loading, please feel free to submit an issue to
the [Chromium Bug
Tracker](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3ELoader%3ELazyLoad).

And, in case you missed it, check out web.dev's [image and video lazy-loading
collection](/fast/#lazy-load-images-and-video) for more lazy-loading ideas.

_With thanks to Dom Farolino, Scott Little, Houssein Djirdeh, Simon Pieters, Kayce Basques, Joe Medley and Stoyan
Stefanov for their reviews._ 
