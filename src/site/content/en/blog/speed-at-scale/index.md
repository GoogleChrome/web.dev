---
title: "Speed at scale: what's new in web performance?"
subhead: Learn about three new web performance launches from I/O 2019.
authors:
  - katiehempenius
  - addyosmani
date: 2019-05-24
hero: image/admin/3ewq4uJrMKiYvuXxkQGI.jpg
alt: Speedometer on a retro car
description: |
  For Google I/O 2019, we introduced three new Web Performance initiatives that we hope will lead to better user experiences for everyone.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
---

During the ["Speed at Scale"
talk](https://www.youtube.com/watch?v=YJGCZCaIZkQ&feature=youtu.be) at Google
I/O 2019, we announced three things that we hope will improve web performance
over the coming year.

{% YouTube 'YJGCZCaIZkQ' %}

## Lighthouse now supports Performance Budgeting


[LightWallet](https://developers.google.com/web/tools/lighthouse/audits/budgets)
is a new feature in Lighthouse that adds support for [performance
budgets](/fast#set-performance-budgets). Performance budgets establish
standards for the performance of your site. More importantly, they make it is
easy to identify and fix performance regressions before they ship.

<figure class="w-figure">
  {% Img src="image/admin/b1hw1bMU0dCIqS45XdfW.png", alt="A LightWallet report showing which assets are over the file size budget.", width="800", height="607", class="w-screenshot w-screenshot--filled" %}
</figure>

LightWallet is available in the newest version of the Lighthouse CLI and only
takes a couple minutes to set up. These[
instructions](https://developers.google.com/web/tools/lighthouse/audits/budgets)
provide more information.

Unsure what your budgets should be? Try our experimental [Performance Budget
Calculator](https://bit.ly/perf-budget-calculator) which can generate a
LightWallet compatible budget configuration.

## Browser-level image and iframe lazy-loading comes to the web

Web pages often contain a large number of images, which contribute to
data-usage, [page-bloat](https://httparchive.org/reports/state-of-images) and
slower page loads. Many of these images are offscreen, requiring a user to
scroll in order to view them.

Until now, you've needed to solve lazy-loading images using a JavaScript
library but that may soon change. This summer, Chrome will be launching support
for the [loading](https://addyosmani.com/blog/lazy-loading/) attribute which
brings standardized `<img>` and `<iframe>` lazy-loading to the web.

<figure class="w-figure">
{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5W51sHaRUB0NEuN0MaFh.png", alt="Browser-level lazy-loading highlighting offscreen content being loaded on-demand", width="800", height="450" %}
</figure>

The `loading` attribute allows a browser to defer loading offscreen images and
iframes until users scroll near them. `loading` supports three values:

* `lazy`: is a good candidate for lazy loading.
* `eager`: is not a good candidate for lazy loading. Load right away.
* `auto`: browser will determine whether or not to lazily load.

```html
<img src="io2019.jpg" loading="lazy" alt="..." />
<iframe src="video-player.html" loading="lazy"></iframe>
```

The exact heuristics for "when the user scrolls near" is left up to the
browser. In general, our hope is that browsers will start fetching deferred
images and iframe content a little before it comes into the viewport.

The `loading` attribute is implemented behind flags in Chrome Canary. You can
try out [this demo](https://mathiasbynens.be/demo/img-loading-lazy) in Chrome
75+ with the `chrome://flags/#enable-lazy-image-loading` and
`chrome://flags/#enable-lazy-frame-loading` flags turned on.

A [write-up](https://addyosmani.com/blog/lazy-loading/) on the
lazy-loading feature is available with more details.

## Google Fonts now supports font-display as a query parameter

We announced support for [font-display](https://font-display.glitch.me) is now available in production for all [Google Fonts](https://fonts.google.com) via the [display query-string parameter](https://developers.google.com/fonts/docs/getting_started#use_font-display):

```html
https://fonts.googleapis.com/css?family=Lobster&display=swap
```

The `font-display` descriptor lets you decide how your web fonts will render or
fallback, depending on how long it takes for them to load. It supports a number
of values including `auto`, `block`, `swap`, `fallback` and `optional`.

Previously, the only way to specify `font-display` for web fonts from Google Fonts was to self-host them but this change removes the need to do so.

The [Google Fonts
documentation](https://developers.google.com/fonts/docs/getting_started#use_font-display)
has been updated to include `font-display` in the default code embeds (as seem
below). We hope this will encourage more developers to try out this exciting
addition.

<figure class="w-figure">
  {% Img src="image/admin/aJqdPp1xobaYRDNx4aJd.png", alt="Google Fonts embed code with font-display included in the URL as a query-parameter", width="800", height="528", class="w-screenshot" %}
</figure>

Here's a [demo](https://glitch.com/~truth-bookcase) on Glitch of using display
with multiple font families. Try it out with [DevTools network
emulation](https://developers.google.com/web/tools/chrome-devtools/network/#throttle)
to see the impact of `font-display: swap`.

## Watch for more

Our talk also covered several production case studies of using advanced
performance patterns to improve user-experience. These included sites
leveraging image CDNs, [Brotli
compression](/fast/reduce-network-payloads-using-text-compression/codelab-text-compression-brotli),
smart JavaScript serving and prefetching to speed up their pages. [Watch the
talk](https://www.youtube.com/watch?v=YJGCZCaIZkQ&feature=youtu.be) to learn
more :)
