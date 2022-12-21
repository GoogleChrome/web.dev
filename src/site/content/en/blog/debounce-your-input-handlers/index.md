---
layout: post
title: Debounce your input handlers
subhead: |
  Input handlers are a potential cause of performance problems in your apps, as they can block frames from completing, and can cause additional and unnecessary layout work.
authors:
  - paullewis
date: 2015-03-20
updated: 2018-08-17
description: |
  Input handlers are a potential cause of performance problems in your apps, as they can block frames from completing, and can cause additional and unnecessary layout work.
tags:
  - blog # blog is a required tag for the article to show up in the blog.

---

Input handlers are a potential cause of performance problems in your apps, as
they can block frames from completing, and can cause additional and unnecessary
layout work.

## Summary

* Avoid long-running input handlers; they can block scrolling.
* Do not make style changes in input handlers.
* Debounce your handlers; store event values and deal with style changes in the next requestAnimationFrame callback.

## Avoid long-running input handlers

In the fastest possible case, when a user interacts with the page, the page’s compositor thread can take the user’s touch input and simply move the content around. This requires no work by the main thread, where JavaScript, layout, styles, or paint are done.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/3gVWdQyhrcRbaCge89hX.jpg", alt="Lightweight scrolling; compositor only.", width="800", height="600" %}
</figure>

If, however, you attach an input handler, like `touchstart`, `touchmove`, or `touchend`, the compositor thread must wait for this handler to finish executing because you may choose to call `preventDefault()` and stop the touch scroll from taking place. Even if you don’t call `preventDefault()` the compositor must wait, and as such the user’s scroll is blocked, which can result in stuttering and missed frames.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/hPl1pZ4w1M5d7HJ7ZeQO.jpg", alt="Heavy scrolling; compositor is blocked on JavaScript.", width="800", height="600" %}
</figure>

In short, you should make sure that any input handlers you run should execute quickly and allow the compositor to do its job.

## Avoid style changes in input handlers

Input handlers, like those for scroll and touch, are scheduled to run just before any `requestAnimationFrame` callbacks.

If you make a visual change inside one of those handlers, then at the start of the `requestAnimationFrame`, there will be style changes pending. If you _then_ read visual properties at the start of the requestAnimationFrame callback, as the advice in “[Avoid large, complex layouts and layout thrashing](/avoid-large-complex-layouts-and-layout-thrashing/)” suggests, you will trigger a forced synchronous layout!

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/qQ2ymRuMt1rdAhhIXyLy.jpg", alt="Heavy scrolling; compositor is blocked on JavaScript.", width="800", height="324" %}
</figure>

## Debounce your scroll handlers

The solution to both of the problems above is the same: you should always debounce visual changes to the next `requestAnimationFrame` callback:

```js
function onScroll (evt) {

    // Store the scroll value for laterz.
    lastScrollY = window.scrollY;

    // Prevent multiple rAF callbacks.
    if (scheduledAnimationFrame)
    return;

    scheduledAnimationFrame = true;
    requestAnimationFrame(readAndUpdatePage);
}

window.addEventListener('scroll', onScroll);
```

Doing this also has the added benefit of keeping your input handlers light, which is awesome because now you’re not blocking things like scrolling or touch on computationally expensive code!
