---
layout: post
title: "New to the web platform in October"
subhead: >
  Discover some of the interesting features that landed in stable and beta web browsers during October 2022.
description: >
  Discover some of the interesting features that landed in stable and beta web browsers during October 2022.
date: 2022-10-31
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/Gld0PunAHpxPzZSTPWDv.jpg
alt: Train tracks and a colorful sunset.
authors:
  - rachelandrew
tags:
  - blog
  - new-to-the-web
---

## Stable browser releases

In October, [Firefox 106](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/106), [Chrome 107](https://developer.chrome.com/blog/new-in-chrome-107/), and [Safari 16.1](https://developer.apple.com/documentation/safari-release-notes/safari-16_1-release-notes) became stable. Let's take a look at what this means for the web platform.

### Animation of grid tracks

Thanks to the work of our contributors at Microsoft, Chrome is now able to interpolate `grid-template-columns` and `grid-template-rows` values. This means that grid layouts can smoothly transition between states, instead of snapping at the halfway point of an animation or transition.

<figure>
{% Codepen {
  user: 'web-dot-dev',
  id: 'XWqVowx',
  height: 480,
  theme: 'light',
  tab: 'result'
} %}

<figcaption>Hover over the avatars to see the animation. This example is from the article <a href="/css-animated-grid-layouts/">CSS animated grid layouts</a>, where you can find out more.</figcaption>
</figure>

{% BrowserCompat 'css.properties.grid-template-columns.animation' %}

### Additions to `getDisplayMedia()`

Also in Chrome are some additions to [`getDisplayMedia()`](https://developer.mozilla.org/docs/Web/API/MediaDevices/getDisplayMedia) that aim to prevent [accidental oversharing when screen sharing](https://developer.chrome.com/blog/avoiding-oversharing-when-screen-sharing/). 

- The [`displaySurface`](https://developer.chrome.com/docs/web-platform/screen-sharing-controls/#displaySurface) option can indicate that the web app prefers to offer a specific display surface type (tabs, windows, or screens).
- The [`surfaceSwitching`](https://developer.chrome.com/docs/web-platform/screen-sharing-controls/#surfaceSwitching) option indicates whether Chrome should allow the user to dynamically switch between shared tabs.
- The [`selfBrowserSurface`](https://developer.chrome.com/docs/web-platform/screen-sharing-controls/#selfBrowserSurface) option can be used to prevent the user from sharing the current tab. This avoids the "hall of mirrors" effect.
- The [`systemAudio`](https://developer.chrome.com/docs/web-platform/screen-sharing-controls/#systemAudio) option ensures Chrome only offers relevant audio-capture to the user.

Safari 16.1 also includes support for `getDisplayMedia`, adding support for capturing a specific Safari window.

### Testing for support of font technology and features from CSS

Firefox has added the `font-tech()` and `font-format()` functions to feature queries with `@supports`. The following example tests for support of [COLRv1 fonts](https://developer.chrome.com/blog/colrv1-fonts/).

```css
@supports font-tech(color-COLRv1) {

}
```

You can find more examples [on MDN](https://developer.mozilla.org/docs/Web/CSS/@supports#testing_for_the_support_of_a_font_technology).

### Scroll to text fragment

Safari 16.1 includes support for [scroll to text fragment](https://wicg.github.io/scroll-to-text-fragment/) which adds support for navigating to a URL with a particular text fragment specified. 

### AVIF support

Safari 16 included support for still AVIF images, Safari 16.1 includes support for animated AVIF images on macOS Ventura, iOS 16, and iPadOS 16. 

### Web Push for Safari

Safari 16.1 brings Web Push support to Safari on macOS Ventura. This uses the Push API and Notifications API, you can read more about this in the article [Meet Web Push](https://webkit.org/blog/12945/meet-web-push/). Web Push landing in Safari means that it is now available across all three major engines. 

## Beta browser releases

Beta browser versions give you a preview of things that will be in the next stable version of the browser. It's a great time to test new features, or removals, that could impact your site before the world gets that release. New betas this month are [Chrome 108](/blog/chrome-108-beta/), [Firefox 107](https://developer.mozilla.org/docs/Mozilla/Firefox/Releases/107), and [Safari 16.2](https://developer.apple.com/documentation/safari-release-notes/safari-16_2-release-notes).

Chrome 108 includes support for the `avoid` value of the CSS fragmentation properties `break-before`, `break-after`, and `break-inside` when printing. This value tell the browser to avoid breaking before, after or inside the element it is applied to. For example, the following CSS avoids a figure being broken at a page break.

```css
figure {
    break-inside: avoid;
}
```

Chrome 108 starts to roll out a change to the way overflow behaves on replaced elements, which may cause visual changes in some circumstances. Read the article [A change to overflow on replaced elements in CSS](https://developer.chrome.com/blog/overflow-replaced-elements/) for more details and to see how to address any issues you see.

There's a change to how the Layout Viewport behaves in Chrome on Android when the on-screen keyboard is shown. Read [Prepare for viewport resize behavior changes coming to Chrome on Android](/blog/viewport-resize-behavior/) to learn more and find out how to prepare for this shipping to stable next month.

Also in Chrome are the new CSS Viewport Units. These include small (`svw`, `svh`, `svi`, `svb`, `svmin`, `svmax`), large (`lvw`, `lvh`, `lvi`, `lvb`, `lvmin`, `lvmax`), dynamic (`dvw`, `dvh`, `dvi`, `dvb`, `dvmin`, `dvmax`), and logical (`vi`, `vb`) units. These units are already implemented in Firefox and Safari.

Firefox 107 enables COLRv1 font support, joining Chrome in supporting this font technology. Also in fonts, Chrome 108 adds support for the `font-tech()` and `font-format()` functions to feature queries with `@supports`.

Firefox also adds [`contain-intrinsic-size`](https://developer.mozilla.org/docs/Web/CSS/contain-intrinsic-size) support, joining Chrome to make two browsers with support for this feature.

Safari 16.2 Beta includes a bunch of CSS fixes including sizing and scroll snap.

_Photo by [ahmed zid](https://unsplash.com/@ahmedzaid?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)._
