---
layout: post
title: Page transitions don't feel like they block on the network
description: |
  Learn how to make transitions between web pages feel responsive,
  even on a slow network.
web_lighthouse:
  - pwa-page-transitions
date: 2019-05-04
updated: 2019-09-19
---

Transitions should feel snappy as you tap around, even on a slow network,
a key to perceived performance.

## Recommendations

Open the app on a simulated very slow network.
Every time you tap a link/button in the app the page should respond immediately, either by:

- Transitioning immediately to the next screen and showing a placeholder loading screen
while waiting for content from the network.
- A loading indicator is shown while the app waits for a response from the network.

If using a single-page-app (client rendered),
transition the user to the next page immediately and show a
[skeleton screen](http://hannahatkin.com/skeleton-screens/).
Use any content such as title or thumbnail already available while content loads.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Resources

[Source code for **Page transitions don't feel like they block on the network** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/manual/pwa-page-transitions.js)
