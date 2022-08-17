---
layout: post
title: "Blibli's PWA generates 10x more revenue per user than their previous mobile website"
subhead: "How Blibli achieved a 42% reduction in bounce rate, an 8x improvement in mobile conversion rate, and 2.5x more pages per session."
authors:
  - collindionagata
  - swethagopalakrishnan
date: 2021-06-15
description: How Blibli achieved a 42% reduction in bounce rate, an 8x improvement in mobile conversion rate, and 2.5x more pages per session.
hero: image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/nO8c2UEgQRXsoYVp3tZO.png
alt: |
  Images of the BliBli app.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
  - case-study
---

[Blibli](https://www.blibli.com/) is a well known e-commerce marketplace in
Indonesia. The company had over 29 million average monthly website visits in
2019. In a recent study, Blibli's web team found that their mobile web platform
is a significant visitor and user acquisition platform, with 70% of web
users landing on mobile and 30% of web users landing on desktop.

With that insight, Blibli embarked on a journey to develop a better web
experience and improve conversions. As a result, they were able to achieve some
exceptional results:

<div class="stats">
  <div class="stats__item">
    <p class="stats__figure">42<sub>%</sub></p>
    <p>Reduction in bounce rates</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">8<sub>x</sub></p>
    <p>Better mCVR in installed PWA compared to browser mobile web</p>
  </div>
  <div class="stats__item">
    <p class="stats__figure">2.5<sub>x</sub></p>
    <p>More pages/sessions on installed PWA</p>
  </div>
</div>

## Highlighting the opportunity

Blibli identified the following areas of opportunities:

+   For Blibli, the mobile web platform was important for user
    acquisition with many users on mid- to low-tier devices.
+   Indonesia's internet economy was [expanding rapidly beyond tier 1
    cities](https://storage.googleapis.com/gweb-economy-sea.appspot.com/assets/pdf/Indonesia-e-Conomy_SEA_2020_Country_Insights.pdf).
    Hence, PWA and fast pages were a good investment to support user needs like
    limited storage and slow networks.
+   50% of users that are coming to the Blibli web platform are returning users.

## The approach they used

The team took a staged strategy of short- to medium-term improvements on the
mobile web platform. This included:

+   A performance optimized website including a UX revamped [home
    page](https://www.blibli.com).
+   A lite version of the home page for new users with a
    [service worker](https://developer.chrome.com/docs/workbox/service-worker-overview/)
    to cache critical assets for subsequent navigation.
+   A [Progressive Web App](/progressive-web-apps/) (PWA) for
    returning users.

### User flow

New visitors are presented with a lightweight page which is three times faster
when compared to the old home page.

<figure>
{% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/bfL1ZGsRjv3QcbACnRGu.png", alt="A lightweight page that is three times faster than the old.", width="800", height="1422", params={w: '400' } %}
  <figcaption>
    A lightweight page that is three times faster than the old.
  </figcaption>
</figure>

On subsequent pages, Blibli prompts users to add the PWA shortcut
to their home screen.

<figure>
  <video controls autoplay loop muted style="width:800px;">
    <source src="https://storage.googleapis.com/web-dev-assets/blibli/save-to-home-screen.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/blibli/save-to-home-screen.mp4" type="video/mp4">
  </video>
  <figcaption>
    The add to home screen prompt.
  </figcaption>
</figure>

If users lose the network connection, they are presented with an elegant offline
fallback page.

<figure>
{% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/biDb6f1owQWxmRNXUauu.png", alt="An elegent offline fallback page.", width="800", height="468" %}
  <figcaption>
    An elegent offline fallback page.
  </figcaption>
</figure>

Blibli's lite page created a first impression that Blibli.com is fast and
responsive. Moreover, the lite page streamlined the number of features by only
focusing on those that deliver the value proposition of Blibli.

<figure>
  <video controls autoplay loop muted style="width:800px;">
    <source src="https://storage.googleapis.com/web-dev-assets/blibli/responsive-comparison.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/blibli/responsive-comparison.mp4" type="video/mp4">
  </video>
  <figcaption>
    Comparison of loading times before and after streamlining.
  </figcaption>
</figure>

Blibli's PWA is installable, giving it an app-like look and feel. It is also
fast and reliable which was achieved using service worker caching and graceful
offline fallback.

<figure>
{% Img src="image/sQ51XsLqKMgSQMCZjIN0B7hlBO02/ONCtI6MryOS5wCLPd3Ep.jpeg", alt="The offline fallback", width="800", height="1778" %}
  <figcaption>
    The offline fallback.
  </figcaption>
</figure>

This comes as a delight for web users, a large proportion of whom use mid-tier
devices. Since Blibli's PWA is less than 1MB in size (that's a whopping 24 times
lighter than their Android app!), there is much less friction for users to
install it. It also makes it easier for Blibli to retain users while providing
them with a seamless app-like experience.

### Set performance budgets

Blibli made performance budgeting a performance standard within the tech
development and management, where the standard was reviewed on a regular basis.
It's set as the KPI of internal tech development, with the guidance
of top management to ensure the best platform for all of our users.

## Overall business results

+   3x reduction in page load times.
+   42% reduction in bounce rates.
+   8x Better mobile conversion rates in installed PWA compared to browser
    mobile web.
+   2.5x more pages/sessions on installed PWA.
+   10x more revenue per user compared to the previous mobile website.

"Speed and PWA were a valuable investment for us to provide the best mobile
experience and representing our mission, to deliver the best platform for our
users"
_—Collin Dion Agata, Lead Product Manager, Blibli_

Photo by [Cristian Escobar](https://unsplash.com/@cristian1) on Unsplash.
