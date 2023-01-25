---
layout: post
title: Uses deprecated APIs
description: |
  Learn how to remove and replace deprecated APIs from your web page.
web_lighthouse:
  - deprecations
date: 2019-05-02
updated: 2019-08-28
---

Deprecated APIs are scheduled to be removed from Chrome.
Calling these APIs
after they're removed causes errors on your site.

## How the Lighthouse deprecated API audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags pages that call deprecated APIs:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zsb1AOPs5Bua46tKX8Ot.png", alt="Lighthouse audit shows usage of deprecated APIs", width="800", height="247", class="w-screenshot" %}
</figure>

Lighthouse includes all deprecated API warnings that Chrome logs
to the DevTools Console.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## How to remove deprecated APIs

Go to
[Chrome Platform Status](https://www.chromestatus.com/features#deprecated) and
expand the entries for the APIs that you're using
to learn why the APIs are deprecated and how to replace them.

## Resources

- [Source code for **Uses deprecated APIs** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/deprecations.js)
- [Chrome Platform Status](https://www.chromestatus.com/features#deprecated)
