---
layout: post
title: "The document uses `<meta http-equiv=\"refresh\">`"
description: |
  Learn why automatically refreshing your web page is bad for accessibility
  and how to avoid it.
date: 2019-05-02
updated: 2020-06-24
web_lighthouse:
  - meta-refresh
---

The `<meta http-equiv="refresh">` tag causes a web page to refresh automatically
after a specified amount of time.
Users generally don't expect automatic refreshes,
so they can be disorienting.
Refreshing also moves [focus](/keyboard-access/#focus-and-the-tab-order)
to the top of the page,
which may frustrate or confuse users,
particularly those who rely on screen readers or other assistive technologies.

## How the Lighthouse automatic refresh audit fails

Lighthouse flags pages that contain a `<meta>` tag with the `http-equiv="refresh"` attribute:

<figure class="w-figure">
  <img class="w-screenshot" src="meta-refresh.png" alt="Lighthouse audit showing the document uses timed refresh">
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to avoid automatic page refreshes

Remove `<meta http-equiv="refresh">` from the page.

If you need to refresh your page, do so using JavaScript,
where you can add logic to allow users to pause the refresh,
extend the time between refreshes, or even disable refreshes.

## Resources

- [Source code for **The document uses `<meta http-equiv="refresh">`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/meta-refresh.js)
- [Timed refresh must not exist (Deque University)](https://dequeuniversity.com/rules/axe/3.3/meta-refresh)
