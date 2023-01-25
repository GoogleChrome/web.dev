---
layout: post
title: Lazy-loading video
authors:
  - jeremywagner
  - rachelandrew
date: 2019-08-16
updated: 2020-06-05
description: |
  This post explains lazy-loading and the options available to you when lazy-loading video.
tags:
  - performance
feedback:
  - api
---

As with [image elements](/lazy-loading-images), you can also lazy-load video. Videos are commonly loaded with the `<video>` element (although [an
alternate method using
`<img>`](https://calendar.perfplanet.com/2017/animated-gif-without-the-gif/) has
emerged with limited implementation). _How_ to lazy-load `<video>` depends on the
use case, though. Let's discuss a couple of scenarios that each require a
different solution.

## For video that doesn't autoplay {: #video-no-autoplay }

For videos where playback is initiated by the user (i.e., videos that _don't_
autoplay), specifying the [`preload`
attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-preload)
on the `<video>` element may be desirable:

```html
<video controls preload="none" poster="one-does-not-simply-placeholder.jpg">
  <source src="one-does-not-simply.webm" type="video/webm">
  <source src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

The example above uses a `preload` attribute with a value of `none` to prevent browsers
from preloading _any_ video data. The `poster`
attribute gives the `<video>` element a placeholder that will occupy the space while the video loads. The reason for this is
that default behaviors for loading video can vary from browser to browser:

- In Chrome, the default for `preload` used to be `auto`, but as of Chrome 64, it now
defaults to `metadata`. Even so, on the desktop version of Chrome, a portion of
the video may be preloaded using the `Content-Range` header. Firefox, Edge and
Internet Explorer 11 behave similarly.
- As with Chrome on desktop, 11.0 desktop versions of Safari will preload a range
of the video.
From version 11.2, only the video metadata is preloaded. [In Safari on iOS, videos are never
preloaded](https://developer.apple.com/library/content/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/AudioandVideoTagBasics/AudioandVideoTagBasics.html#//apple_ref/doc/uid/TP40009523-CH2-SW9).
- When [Data Saver mode](https://support.google.com/chrome/answer/2392284) is
enabled, `preload` defaults to `none`.

Because browser default behaviors with regard to `preload` are not set in stone,
being explicit is probably your best bet. In this cases where the user initiates
playback, using `preload="none"` is the easiest way to defer loading of video on
all platforms. The `preload` attribute isn't the only way to defer the loading
of video content. [_Fast Playback with Video
Preload_](https://developers.google.com/web/fundamentals/media/fast-playback-with-video-preload) may give you
some ideas and insight into working with video playback in JavaScript.

Unfortunately, it doesn't prove useful when you want to use video in place of
animated GIFs, which is covered next.

## For video acting as an animated GIF replacement {: #video-gif-replacement }

While animated GIFs enjoy wide use, they're subpar to video equivalents in a
number of ways, particularly in file size. Animated GIFs can stretch into
the range of several megabytes of data. Videos of similar visual quality tend to
be far smaller.

Using the `<video>` element as a replacement for animated GIF is not as
straightforward as the `<img>` element. Animated GIFs have three characteristics:

1. They play automatically when loaded.
2. They loop continuously ([though that's not always the
case](https://davidwalsh.name/prevent-gif-loop)).
3. They don't have an audio track.

Achieving this with the `<video>` element looks something like this:

```html
<video autoplay muted loop playsinline>
  <source src="one-does-not-simply.webm" type="video/webm">
  <source src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

The `autoplay`, `muted`, and `loop` attributes are self-explanatory.
[`playsinline` is necessary for autoplaying to occur in
iOS](https://webkit.org/blog/6784/new-video-policies-for-ios/). Now you have a
serviceable video-as-GIF replacement that works across platforms. But how to go
about lazy-loading it? To start, modify your `<video>` markup accordingly:

```html
<video autoplay muted loop playsinline width="610" height="254" poster="one-does-not-simply.jpg">
  <source data-src="one-does-not-simply.webm" type="video/webm">
  <source data-src="one-does-not-simply.mp4" type="video/mp4">
</video>
```

You'll notice the addition of the [`poster`
attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video#attr-poster),
which lets you specify a placeholder to occupy the `<video>` element's space
until the video is lazy-loaded. As with the [`<img>` lazy-loading examples](/lazy-loading-images/),
 stash the video URL in the `data-src` attribute on each `<source>`
element. From there, use JavaScript code similar to the
Intersection Observer-based image lazy-loading examples:

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

  if ("IntersectionObserver" in window) {
    var lazyVideoObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
            }
          }

          video.target.load();
          video.target.classList.remove("lazy");
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function(lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});
```

When you lazy-load a `<video>` element, you need to iterate through all of the child
`<source>` elements and flip their `data-src` attributes to `src` attributes. Once
you've done that, you need to trigger loading of the video by calling the
element's `load` method, after which the media will begin playing automatically
per the `autoplay` attribute.

Using this method, you have a video solution that emulates animated GIF behavior,
but doesn't incur the same intensive data usage as animated GIFs do,
and you can lazy-load that content.

## Lazy-loading libraries {: #libraries }

The following libraries can help you to lazy-load video:

- [lozad.js](https://github.com/ApoorvSaxena/lozad.js) is a super lightweight
option that uses Intersection Observer only. As such, it's highly performant,
but will need to be polyfilled before you can use it on older browsers.
- [yall.js](https://github.com/malchata/yall.js) is a library that uses
Intersection Observer and falls back to event handlers. It's compatible with IE11
and major browsers.
- If you need a React-specific lazy-loading library, you might consider
[react-lazyload](https://github.com/jasonslyvia/react-lazyload). While it
doesn't use Intersection Observer, it _does_ provide a familiar method of lazy
loading images for those accustomed to developing applications with React.

Each of these lazy-loading libraries is well documented, with plenty of markup
patterns for your various lazy-loading endeavors.
