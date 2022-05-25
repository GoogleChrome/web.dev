---
layout: post
title: "New to the web platform in April"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during April 2022. 
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during April 2022.
date: 2022-04-29
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/0fQKPX21U9INqtEspLze.jpg
alt: Colorful stripes.
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In April, Chrome 101 and [Firefox 99](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/99) became stable. After the bumper crop of features landing [last month](/web-platform-03-2022/), it was a bit quieter during April, but a few interesting things landed for us to use.

Chrome 101 includes [hwb color notation](https://developer.mozilla.org/docs/Web/CSS/color_value/hwb). This specifies color according to its hue, whiteness, and blackness. As with other color notation, an optional alpha component specifies opacity.

```css
h1 {
  color: hwb(194 0% 0% / .5) /* #00c3ff with 50% opacity */
}
```

To learn more about `hwb()`, read this article by [Stefan Judis](https://twitter.com/stefanjudis/): [hwb() – a color notation for humans?](https://www.stefanjudis.com/blog/hwb-a-color-notation-for-humans/).

{% BrowserCompat 'css.types.color.hwb' %}

Also in Chrome 101 is the [Priority Hints](/priority-hints/) feature. This gives you a way to hint to the browser which order resources should be downloaded in, by using the `fetchpriority` attribute. In the example below, a low priority image is indicated with `fetchpriority="low"`.

```html
<img src="/images/in_viewport_but_not_important.svg" fetchpriority="low" alt="I'm an unimportant image!">
```

Priority Hints aren't yet available in other browsers, however you can start using them right now to benefit anyone with a browser based on Chromium 101.

{% BrowserCompat 'api.HTMLImageElement.fetchPriority' %}

Firefox 99 includes the [`pdfViewerEnabled`](https://developer.mozilla.org/docs/Web/API/Navigator/pdfViewerEnabled) property of the Navigator interface. This property indicates if the browser supports inline display of PDF files.

```js
if (!navigator.pdfViewerEnabled) {
  // The browser does not support inline viewing of PDF files.
}
```

{% BrowserCompat 'api.Navigator.pdfViewerEnabled' %}

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release.

New betas in April were [Chrome 102](https://blog.chromium.org/2022/04/chrome-102-window-controls-overlay-host.html), [Firefox 100](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/100), and [Safari 15.5](https://developer.apple.com/documentation/safari-release-notes/safari-15_5-release-notes). 

Chrome 102, Safari 15.5, and Firefox preview versions include [the `inert` attribute](https://developer.chrome.com/blog/inert/). This removes elements from the tab order and accessibility tree if they are non-interactive. For example, an element that is currently offscreen or hidden. 

Chrome 102 includes the new value `until-found` for the HTML `hidden` attribute. This enables find-in-page and scroll to text fragment on text that is inside a collapsed area of the page, as you might find in an accordion pattern. Find out more in the post [Making collapsed content accessible with hidden=until-found](https://developer.chrome.com/blog/hidden-until-found/).

{% BrowserCompat 'html.global_attributes.hidden.until-found_value' %}

Chrome 102 also includes the [Local Font Access API](/local-fonts/), which allows access to the user's locally installed fonts.

These beta features will land in stable browsers soon.

_Hero image by [Jason Leung](https://unsplash.com/@ninjason)_
  
  