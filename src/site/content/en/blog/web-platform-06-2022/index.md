---
layout: post
title: "New to the web platform in June"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during June 2022. 
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during June 2022.
date: 2022-06-30
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/xPDclET3NIAnmeBygeTW.jpg
alt: The word new on a red brick wall.
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In June, [Chrome 103](https://developer.chrome.com/blog/new-in-chrome-103/) and [Firefox 102](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/102) became stable.

### Transform streams and readable byte streams

Firefox 102 includes support for [Transform Streams](https://developer.mozilla.org/docs/Web/API/TransformStream). This enables piping from ReadableStream to a WritableStream, executing a transformation on the chunks. It's great to see this feature become available in all three engines, making this a very good time to learn about [Streams](/streams/).

{% BrowserCompat 'api.TransformStream' %}

[Readable byte streams](https://developer.mozilla.org/docs/Web/API/Streams_API#bytestream-related_interfaces) are also now supported in Firefox 102, enabling a BYOB (bring your own buffer) reader with the [ReadableStreamBYOBReader](https://developer.mozilla.org/docs/Web/API/ReadableStreamBYOBReader) interface. This can be used to stream data supplied by the developer. 

{% BrowserCompat 'api.ReadableStreamBYOBReader' %}

### Access locally installed fonts

Chrome 103 includes the [Local Font Access API](/local-fonts/), which allows access to the user's locally installed fonts. After requesting access to the fonts installed on the device, call `window.queryLocalFonts()` to get an array of the installed fonts.

```js
const opts = {};
const pickedFonts = await self.queryLocalFonts();
for (const fontData of pickedFonts) {
  console.log(fontData.postscriptName);
  console.log(fontData.fullName);
  console.log(fontData.family);
  console.log(fontData.style);
}
```

### The update media feature

Firefox 102 includes the [`update`](https://developer.mozilla.org/docs/Web/CSS/@media/update-frequency) media feature. This is used to query whether the output device can modify the appearance of content once it has been rendered.

{% BrowserCompat 'css.at-rules.media.update' %}

### A new HTTP status code—103 early hints

Chrome 103 adds a new status code HTTP 103 Early Hints. If the server or CDN knows that a certain set of subresources is required to load a page, it can advise the browser to preconnect to origins or even preload resources as the page that requires them comes in. This requires updates to your server or CDN to take advantage of the feature, [find out more about Early Hints](https://developer.chrome.com/blog/early-hints/). 

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release.

New betas in April were [Chrome 104](https://blog.chromium.org/2022/06/chrome-104-beta-new-media-query-syntax.html), [Firefox 103](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/103), and [Safari 16](https://developer.apple.com/documentation/safari-release-notes/safari-16-release-notes). 

Chrome 104 includes the new syntax for [range media queries](https://developer.chrome.com/blog/media-query-range-syntax/), from the Media Queries Level 4 specification. For example, a media query previously written like this:

```css
@media (min-width: 400px) { … }
```

Can now be written like this:

```css
@media (width >= 400px) { … }
```

{% BrowserCompat 'css.at-rules.media.range_syntax' %}

Chrome 103 on desktop also includes the [Region Capture API](https://developer.chrome.com/docs/web-platform/region-capture/). This enables cropping and removing content from captured video before sharing it.

Safari 16 looks to be another exciting release from the Safari team. This release adds many of the features that are included in [Interop 2022](/interop-2022/), it's great to see so much landing at this mid-year point. I'm highlighting a few of my favorite features here, but do check out the [release notes](https://developer.apple.com/documentation/safari-release-notes/safari-16-release-notes) for more.

{% Aside %}
To try out the Safari 16 beta you need to be running the macOS beta, however many of these features can also be found in [Safari Technology Preview from version 147](https://webkit.org/blog/12960/release-notes-for-safari-technology-preview-147-with-safari-16-features/).
{% endAside %}

Along with many developers, I'm really excited to see size queries support for Container Queries, a feature that is also behind a flag in Chrome currently.

Also in Safari 16 is support for the `subgrid` value for `grid-template-columns` and `grid-template-rows`. This feature is already in Firefox, and in development in Chrome, and enables grid track sizing to be inherited by nested grids.

{% BrowserCompat 'css.properties.grid-template-columns.subgrid' %}

Also for grid layout is the ability to animate grid tracks.

{% BrowserCompat 'css.properties.grid-template-columns.animation' %}

The [`showPicker()`](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/showPicker) method, enabling a canonical way to show a browser picker for dates, time, color, and files is included. You can find out more about this in [show a browser picker for date, time, color, and files](https://developer.chrome.com/blog/show-picker/).

{% BrowserCompat 'api.HTMLInputElement.showPicker' %}

[Accessibility issues](https://hidde.blog/more-accessible-markup-with-display-contents/) for `display: contents` have also been addressed, making this useful feature safe to use without danger of removing elements from the accessibility tree.

These beta features will land in stable browsers soon.

_Hero image by [Nick Fewings](https://unsplash.com/@jannerboy62)._
