---
layout: post
title: Page uses deprecated APIs
description: |
  Learn about `deprecations` audit.
web_lighthouse:
  - deprecations
---

Deprecated APIs are scheduled to be removed from Chrome.
Calling these APIs
after they're removed causes errors on your site.
Lighthouse flags the deprecated APIs:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="deprecations.png" alt="Lighthouse audit shows usage of deprecated APIs">
  <figcaption class="w-figcaption">
    Document uses deprecated APIs.
  </figcaption>
</figure>

## How this audit fails

Lighthouse collects the deprecated API warnings that Chrome logs
to the DevTools Console and includes them in the Lighthouse repot as warnings.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## How to remove deprecated APIs.

Go to
[Chrome Platform Status](https://www.chromestatus.com/features#deprecated) and
expand the entries for the APIs that you're using
to learn more about why the APIs are deprecated,
as well as how to replace them.

## More information

[Page uses deprecated APIs audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/deprecations.js)
