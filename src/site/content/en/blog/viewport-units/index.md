---
layout: post
title: The large, small, and dynamic viewport units
subhead: >
  New CSS units that account for mobile viewports with dynamic toolbars.
authors:
  - bramus
description: >
  New CSS units that account for mobile viewports with dynamic toolbars.
date: 2022-11-29
hero: image/AeNB0cHNDkYPUYzDuv8gInYA9rY2/3ZKf0cQWs0eESL5WZzb0.png
alt: Visualization of the small viewport (left) and large viewport (right).
is_baseline: true
tags:
  - blog
  - css
  - newly-interoperable
---

{% Aside 'celebration' %}
This web feature is now available in all three browser engines!
{% endAside %}

## The viewport and its units

To size something as tall as the viewport, you can use the `vw` and `vh` units.

- `vw` = 1% of the width of the viewport size.
- `vh` = 1% of the height of the viewport size.

Give an element a width of `100vw` and a height of `100vh`, and it will cover the viewport entirely.

<figure>
  {% Img src="image/AeNB0cHNDkYPUYzDuv8gInYA9rY2/IpR2qrX8ENZ1MRMJfehn.png", alt="A light blue element set to be 100vw by 100vh, covering the entire viewport. The viewport itself is indicated using a blue dashed border.", width="800", height="450", class="screenshot" %}
  <figcaption>A light blue element set to be 100vw by 100vh, covering the entire viewport.<br />The viewport itself is indicated using a blue dashed border.</figcaption>
</figure>

The `vw` and `vh` units landed in browsers with these additional units

- `vi` = 1% of the size of the viewport’s inline axis.
- `vb` = 1% of the size of the viewport’s block axis.
- `vmin` = the smaller of `vw` or `vh`.
- `vmax` = the larger of `vw` or `vh`.

These units have good browser support.

{% BrowserCompat 'css.types.length.vw' %}

## The need for new viewport units

While the existing units work well on desktop, it’s a different story on mobile devices. There, the viewport size is influenced by the presence or absence of dynamic toolbars. These are user interfaces such as address bars and tab bars.

Although the viewport size can change, the `vw` and `vh` sizes do not. As a result, elements sized to be `100vh` tall will bleed out of the viewport.

<figure>
  {% Img src="image/AeNB0cHNDkYPUYzDuv8gInYA9rY2/bWbl71iEuR5Gu9a2eAxD.png", alt="100vh on mobile is too tall on load.", width="800", height="450", class="screenshot" %}
  <figcaption>100vh on mobile is too tall on load.</figcaption>
</figure>

When scrolling down these dynamic toolbars will retract. In this state, elements sized to be `100vh` tall will cover the entire viewport.

<figure>
  {% Img src="image/AeNB0cHNDkYPUYzDuv8gInYA9rY2/kuGqSsKtDI1PNUDEVx8n.png", alt="100vh on mobile is “correct” when the User-Agent user interfaces are retracted.", width="800", height="450", class="screenshot" %}
  <figcaption>100vh on mobile is “correct” when the User-Agent user interfaces are retracted.</figcaption>
</figure>

To solve this problem, the various states of the viewport have been specified at the CSS Working Group.

- **Large viewport**: The viewport sized assuming any UA interfaces that are dynamically expanded and retracted to be retracted.
- **Small Viewport**: The viewport sized assuming any UA interfaces that are dynamically expanded and retracted to be expanded.

<figure>
  {% Img src="image/AeNB0cHNDkYPUYzDuv8gInYA9rY2/ZwgiN6CI2ERg04ntpnNG.png", alt="Visualizations of the large and small viewports.", width="800", height="450", class="screenshot" %}
  <figcaption>Visualizations of the large and small viewports.</figcaption>
</figure>

The new viewports also have units assigned to them:

- Units representing the large viewport have the `lv` prefix. The units are `lvw`, `lvh`, `lvi`, `lvb`, `lvmin`, and `lvmax`.
- Units representing the small viewport have the `sv` prefix. The units are `svw`, `svh`, `svi`, `svb`, `svmin`, and `svmax`.

The sizes of these viewport-percentage units are fixed (and therefore stable) unless the viewport itself is resized.

<figure>
  {% Img src="image/AeNB0cHNDkYPUYzDuv8gInYA9rY2/ScGKMyzS1WyS7ByoVvn8.png", alt="Two mobile browser visualizations positioned next to each other. One has an element sized to be 100svh and the other 100lvh.", width="800", height="450", class="screenshot" %}
  <figcaption>Two mobile browser visualizations positioned next to each other.<br />One has an element sized to be 100svh and the other 100lvh.</figcaption>
</figure>

In addition to the large and small viewports, there‘s also a dynamic viewport which has dynamic consideration of the UA UI:

- When the dynamic toolbars are expanded, the dynamic viewport is equal to the size of the small viewport.
- When the dynamic toolbars are retracted, the dynamic viewport is equal to the size of the large viewport.

Its accompanied units have the `dv` prefix: `dvw`, `dvh`, `dvi`, `dvb`, `dvmin`, and `dvmax`. Their sizes are clamped between their `lv*` and `sv*` counterparts.

<figure>
  {% Img src="image/AeNB0cHNDkYPUYzDuv8gInYA9rY2/UCWsRe1PmYg7nvAvTu86.png", alt="100dvh adapts itself to be either the large or small viewport size.", width="800", height="450", class="screenshot" %}
  <figcaption>100dvh adapts itself to be either the large or small viewport size.</figcaption>
</figure>

These units ship in Chrome 108, joining Safari and Firefox which already have support.

{% BrowserCompat 'css.types.length.viewport_percentage_units_large' %}

{%Aside%}
In browsers that don’t have dynamic UA UI–such as Chrome on desktop–the size of the large, small, and dynamic viewports are the same.
{%endAside%}

## Caveats

There‘s a few caveats to know about Viewport Units:

- None of the viewport units take the size of scrollbars into account. On systems that have classic scrollbars enabled, an element sized to `100vw` will therefore be a little bit too wide. This is as [per specification](https://www.w3.org/TR/css-values-4/#viewport-relative-lengths:~:text=In%20all%20cases%2C%20scrollbars%20are%20assumed%20not%20to%20exist.).

- The values for the dynamic viewport do not update at 60fps. In all browsers updating is throttled as the UA UI expands or retracts. Some browsers even debounce updating entirely depending on the gesture (a slow scroll versus a swipe) used.

- The on-screen keyboard (also known as the virtual keyboard) is not considered part of the UA UI. Therefore it does not affect the size of the viewport units. In Chrome [you can opt-in to a behavior where the presence of the virtual keyboard does affect the viewport units](https://developer.chrome.com/blog/viewport-resize-behavior/#opting-in-to-a-different-behavior).

## Additional resources

To learn more about viewports and these units check out [this episode of HTTP 203](https://www.youtube.com/watch?v=xl9R8aTOW_I). In it, [Bramus](/authors/bramus/) tells [Jake](/authors/jakearchibald/) all about the various viewports and explains how exactly the sizes of these units are determined.

{% YouTube id="xl9R8aTOW_I" %}

Additional reading material:

- [CSS Values 4 Specification: Viewport-relative lengths](https://www.w3.org/TR/css-values-4/#viewport-relative-lengths)
- [ChromeStatus Entry](https://chromestatus.com/feature/5170718078140416?context=myfeatures)
- [Layout Viewport explainer](https://github.com/web-platform-tests/interop-2022-viewport/blob/main/explainers/layout-viewport.md)
- [Viewport Units explainer](https://github.com/web-platform-tests/interop-2022-viewport/blob/main/explainers/viewport-units.md)
