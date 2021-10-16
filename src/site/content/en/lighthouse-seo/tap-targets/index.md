---
layout: post
title: Tap targets are not sized appropriately
description: |
  Learn about the "Tap targets are not sized appropriately" Lighthouse audit.
date: 2019-05-02
updated: 2019-08-21
web_lighthouse:
  - tap-targets
---

Tap targets are the areas of a web page that users on touch devices can
interact with. Buttons, links, and form elements all have tap targets.

Many search engines rank pages based on how mobile-friendly they are. Making
sure tap targets are big enough and far enough apart from each other makes
your page more mobile-friendly and accessible.

## How the Lighthouse tap targets audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags pages
with tap targets that are too small or too close together:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6Dhlxe7vkj7gX3e5rX4B.png", alt="Lighthouse audit showing inappropriately sized tap targets", width="800", height="206", class="w-screenshot" %}
</figure>

Targets that are smaller than 48&nbsp;px by 48&nbsp;px or closer than 8&nbsp;px
apart fail the audit. When the audit fails, Lighthouse lists the results in a
table with three columns:

<div class="w-table-wrapper">
  <table>
    <tbody>
      <tr>
        <td><strong>Tap Target</strong></td>
        <td>The tap target that is inappropriately sized.</td>
      </tr>
      <tr>
        <td><strong>Size</strong></td>
        <td>The size of the target's bounding rectangle in pixels.</td>
      </tr>
      <tr>
        <td><strong>Overlapping Target</strong></td>
        <td>Which other tap targets, if any, are too close.</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-seo/scoring.njk' %}

## How to fix your tap targets

**Step 1:** Increase the size of tap targets that are too small.
Tap targets that are 48&nbsp;px by 48&nbsp;px never fail the audit. If you have
elements that shouldn't _appear_ any bigger (for example, icons), try increasing
the `padding` property:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ggUhPDcAaExFfcmm8kaF.jpg", alt="Appropriately-sized tap targets", width="800", height="419", class="w-screenshot w-screenshot" %}
  <figcaption class="w-figcaption">
    Use <code>padding</code> to make tap targets bigger without changing the appearance of an element.
  </figcaption>
</figure>

**Step 2:** Increase the spacing between tap targets that are too close together
using properties like `margin`. There should be at least 8&nbsp;px between
tap targets.

## Resources

- [Accessible tap targets](/accessible-tap-targets): more information on how to ensure your tap targets are accessible by all users.
- [Source code for **Tap targets are not sized appropriately** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/tap-targets.js)
