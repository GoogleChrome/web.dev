---
layout: post
title: Page doesn't use passive event listeners to improve scrolling performance
description: |
  Learn about `uses-passive-event-listeners` audit.
web_lighthouse:
  - uses-passive-event-listeners
---

Setting the `passive` option on your touch and
wheel event listeners can improve scrolling performance.
Lighthouse flags potential passive event listener candidates.

<!--***Todo***
I have no idea how to recreate this. I tried a few options with event listeners.
None show the audit failing, even with scrolling implemented without passive.
<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="uses-passive-event-listeners.png" alt="Lighthouse audit shows page doesn't use passive event listeners to improve scrolling performance">
  <figcaption class="w-figcaption">
    Fig. 1 — Page doesn't use passive event listeners to improve scrolling performance
  </figcaption>
</figure>
-->

## How this audit fails

Lighthouse uses the following algorithm
to flag potential passive event listener candidates:

1. Collect all event listeners on the page.
2. Filter out non-touch and non-wheel listeners.
3. Filter out listeners that call `preventDefault()`.
4. Filter out listeners that are from a different host than the page.

Lighthouse filters out listeners from different hosts
because you probably don't have control over these scripts.
Because of this,
Lighthouse's audit does not represent the full scroll performance of your page.
There may be third-party scripts that are harming your page's scroll performance,
but these aren't listed in your Lighthouse report.

## Add passive event listeners to improve scrolling performance

Add the `passive` flag to all of the event listeners
that Lighthouse has identified.
In general, add the `passive` flag to every `wheel`,
`mousewheel`, `touchstart`, and `touchmove` event listener
that does not call `preventDefault()`.

In browsers that support passive event listeners,
marking a listener as `passive` is as easy as setting a flag:

```js
document.addEventListener('touchstart', onTouchStart, {passive: true});
```

However, in browsers that do not support passive event listeners,
the third parameter is a boolean to indicate
whether the event should bubble or capture.
So, using the syntax above may cause unintended consequences.

See the polyfill in
[Feature Detection](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection)
to learn how to safely implement passive event listeners.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## More information

- [Page doesn't use passive event listeners to improve scrolling audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/uses-passive-event-listeners.js)
- [Improving Scrolling Performance with Passive Event Listeners](https://developers.google.com/web/updates/2016/06/passive-event-listeners)
- [Passive event listeners explainer](https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md)