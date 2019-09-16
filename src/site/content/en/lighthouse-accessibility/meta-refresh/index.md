---
layout: post
title: "The document uses <meta http-equiv=\"refresh\">"
description: |
  Learn why automatically refreshing your web page is bad for accessibility
  and how to avoid it.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - meta-refresh
---

Users generally don't expect a page to refresh automatically.
Refreshing moves focus to the top of the page,
which may frustrate or confuse users.

## How the Lighthouse automatic refresh audit fails

Lighthouse flags timed refreshes:

<figure class="w-figure">
  <img class="w-screenshot" src="meta-refresh.png" alt="Lighthouse audit showing the document uses timed refresh">
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to avoid automatic page refreshes

Remove `<meta http-equiv="refresh">` from the page.
Learn more in
[Timed refresh must not exist](https://dequeuniversity.com/rules/axe/3.3/meta-refresh).

## Resources

- [Source code for **The document uses `<meta http-equiv="refresh">`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/meta-refresh.js)
- [Timed refresh must not exist](https://dequeuniversity.com/rules/axe/3.3/meta-refresh)
