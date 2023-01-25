---
layout: post
title: Does not use passive listeners to improve scrolling performance
description: |
  Learn how to improve your page's scrolling responsiveness by avoiding
  passive event listeners.
web_lighthouse:
  - uses-passive-event-listeners
date: 2019-05-02
updated: 2019-08-28
---

Touch and wheel event listeners are useful
for tracking user interactions and creating custom scrolling experiences,
but they can also delay page scrolling.
Currently, browsers can't know if an event listener will prevent scrolling,
so they always wait for the listener to finish executing before scrolling the page.
Passive event listeners solve this problem by letting you indicate
that an event listener will never prevent scrolling.

## Browser compatibility

Most browsers support passive event listeners. See
[Browser compatibility](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener#Browser_compatibility)

## How the Lighthouse passive event listener audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags event listeners that may delay page scrolling:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/a59Rk7aCUDvyKNqqoYRJ.png", alt="Lighthouse audit shows page doesn't use passive event listeners to improve scrolling performance", width="800", height="213", class="w-screenshot" %}
</figure>

Lighthouse uses the following process
to identify event listeners that may affect scrolling performance:

1. Collect all event listeners on the page.
2. Filter out non-touch and non-wheel listeners.
3. Filter out listeners that call `preventDefault()`.
4. Filter out listeners that are from a different host than the page.

Lighthouse filters out listeners from different hosts
because you probably don't have control over these scripts.
There may be third-party scripts that are harming your page's scrolling performance,
but these aren't listed in your Lighthouse report.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## How to make event listeners passive to improve scrolling performance

Add a `passive` flag to every event listener that Lighthouse identified.

If you're only supporting browsers that have passive event listener support,
just add the flag. For example:

```js
document.addEventListener('touchstart', onTouchStart, {passive: true});
```

If you're supporting [older browsers that don't support passive event listeners](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Browser_compatibility),
you'll need to use feature detection or a polyfill. See the
[Feature Detection](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection)
section of the WICG [Passive event listeners](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md)
explainer document for more information.

## Resources

- [Source code for **Does not use passive listeners to improve scrolling performance** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/uses-passive-event-listeners.js)
- [Improving Scrolling Performance with Passive Event Listeners](https://developers.google.com/web/updates/2016/06/passive-event-listeners)
- [Passive event listeners explainer](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md)
- [EventTarget.addEventListener()](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)
