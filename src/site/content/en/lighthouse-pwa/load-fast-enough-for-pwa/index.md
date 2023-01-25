---
layout: post
title: Page load is not fast enough on mobile networks
description: |
  Learn how to make your web page load quickly on mobile networks.
web_lighthouse:
  - load-fast-enough-for-pwa
date: 2019-05-04
updated: 2020-06-10
---

Many users of your page visit on a slow cellular network connection.
Making your page load quickly on a mobile network
helps to ensure a positive experience for your mobile users.

{% Aside 'note' %}
A fast page load on a mobile network is a baseline requirement for a site
to be considered a Progressive Web App. See the
[Core Progressive Web App checklist](/pwa-checklist/#core).
{% endAside %}

## How the Lighthouse page load speed audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages that don't load fast enough on mobile:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Cg0UJ1Lykj672ygYYeXo.png", alt="Lighthouse audit showing page doesn't load fast enough on mobile", width="800", height="98", class="w-screenshot" %}
</figure>

Two main metrics affect how users perceive load time:

- [First Meaningful Paint (FMP)](/first-meaningful-paint), which measures when the primary content of the page appears visually complete
- [Time to Interactive (TTI)](/interactive), which measures when the page is fully interactive

For example, if a page appears visually complete after 1&nbsp;second,
but the user can't interact with it for 10&nbsp;seconds,
users will likely perceive the page load time as 10&nbsp;seconds.

Lighthouse computes what the TTI would be on a slow 4G network connection.
If the time to interactive is more than 10&nbsp;seconds, the audit fails.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## How to improve your page's load time

{% include 'content/lighthouse-performance/improve.njk' %}

## Resources

- [Source code for **Page load is not fast enough on mobile networks** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/load-fast-enough-for-pwa.js)
- [Baseline Progressive Web App Checklist](https://developers.google.com/web/progressive-web-apps/checklist#baseline)
- [Critical Rendering Path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/)
- [Get Started With Analyzing Runtime Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/)
- [Record load performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference#record-load)
- [Optimizing Content Efficiency](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/)
- [Rendering Performance](https://developers.google.com/web/fundamentals/performance/rendering/)
