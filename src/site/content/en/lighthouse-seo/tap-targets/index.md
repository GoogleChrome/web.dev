---
layout: post
title: Tap targets are not sized appropriately
description: |
  Learn about the "Tap targets are not sized appropriately" Lighthouse audit.
web_lighthouse:
  - tap-targets
---

Tap targets are the areas of a web page that users on touch devices can
interact with. Buttons, links, and form elements all have tap targets. Making
sure tap targets are big enough and far enough apart from each other makes
your page more mobile-friendly and accessible.

Lighthouse flags pages with inappropriately-sized tap targets:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="tap-targets.png" alt="Lighthouse audit showing inappropriately sized tap targets">
</figure>

{% Aside 'note' %}
Google Search started boosting the ranking of mobile-friendly pages
on mobile search results in 2015.
See [Rolling out the mobile-friendly update](https://webmasters.googleblog.com/2015/04/rolling-out-mobile-friendly-update.html).
{% endAside %}

## How this audit fails

Click the audit to see which tap targets are causing the audit to fail.
The **Tap Target** column tells you which tap target is inappropriately-sized.
The **Size** column tells you the size of the target's bounding rectangle, in pixels.
The **Overlapping Target** column tells you which other tap target is too close.

In practice, Lighthouse provides some leniency on the size,
so tap targets as small as 40 pixels by 40 pixels usually pass.

{% include 'content/lighthouse-seo/scoring.njk' %}

## How to fix inappropriately sized tap targets

To fix the inappropriately-sized tap targets,
increase the size of the failing tap targets.
Tap targets that are 48 pixels wide and 48 pixels tall never fail:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="touch-target.jpg" alt="Appropriately-sized tap targets">
  <figcaption class="w-figcaption">
    Appropriately-sized tap targets.
  </figcaption>
</figure>

Increase the spacing between tap targets,
using properties such as `padding` or `margin`.
There should be at least 8 pixels of space between tap targets.

## More information

[**Tap targets are not sized appropriately** audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/tap-targets.js)
