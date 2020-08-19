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

Quick page transitions are key to how users perceive the performance of your
[Progressive Web App (PWA)](/discover-installable).
Transitions should feel snappy, even on a slow network.

## Recommendations

To find slow page transitions,
navigate your web app using a simulated slow network. To do that in Chrome:
{% Instruction 'devtools-network', 'ol' %}
1. In the **Throttling** drop-down list, select **Slow 3G**.


Every time you tap a link or button in the app,
check that the page responds immediately in one of two ways:

- The page transitions immediately to the next screen and shows a loading screen
  while waiting for content from the network.
- The page shows a loading indicator while the app waits for a response from the network.

If you're working on a client-rendered single-page app,
transition the user to the next page immediately and show a
[skeleton screen](http://hannahatkin.com/skeleton-screens/).
Make sure to immediately show any content that's already available,
such as the page title or thumbnail,
while the rest of the content loads.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Resources

- [Source code for **Page transitions don't feel like they block on the network** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/manual/pwa-page-transitions.js)
- [Skeleton Screen](http://hannahatkin.com/skeleton-screens/)
