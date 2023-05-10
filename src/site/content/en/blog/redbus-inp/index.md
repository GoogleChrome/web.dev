---
layout: post
title: How redBus improved their website's Interaction to Next Paint (INP) and increased sales by 7%
subhead: |
  INP optimizations helped redBus increase sales by about 7%
description: |
  INP optimizations helped redBus increase sales by about 7%
authors:
  - amitkumar
  - saurabhrajpal
date: 2023-05-10
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/3164So5aDk7vKTkhx9Vm.png
thumbnail: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/TR9V6jk32xwz5ACzj0RE.png
alt: A composition of the redBus logo, at left, with the INP thresholds offset at right.
tags:
  - blog
  - web-vitals
  - case-study
---

The web and its capabilities are evolving at a fast pace. You can now build rich and full-featured experiences on the web that can achieve much of what native applications can in terms of capabilities.

JavaScript is a primary driver for interactivity across the web, but if it's not used with care, interactions can feel sluggish, and lead users to perceive your website to be non-responsive or altogether broken. Thankfully, the [Interaction to Next Paint (INP)](/inp/) metric was created to address this specific user experience problem.

INP measures all interactions made with a page during its lifecycle, and reports a single value that is representative of a website's speed in responding to user inputs. Simply put, if a page's INP is at or below the [good threshold](/inp/#what-is-a-good-inp-score), all interactions made with a page can be said to be reliably fast.

[redBus](https://www.redbus.in/), a bus booking and ticketing website based in India, undertook a substantial effort to improve their website's INP, even during the time when it was still considered an experimental metric. As a result of their efforts, they were able to increase sales by 7%, illustrating once again the relationship between web performance and business health. Here's what redBus did to improve their website's INP.

## Top goals

When redBus set out to optimize their website's INP, they had three goals in mind:

1. Provide a better user experience for users by focusing on interaction latency regardless of network speed and device capabilities.
2. Optimize their website to keep interactions as fast as possible.
3. Ensure that responses from their API were as light as possible to ensure fast data transfer to the front end.

## The journey

redBus categorized interaction latency in two ways:

1. Interaction latency caused by blocking JavaScript on the client. When interactions use excessive JavaScript that blocks the main thread, rendering is delayed, and this affects a page's INP.
2. Network latency caused by API calls. While network activity is not something that INP measures, an interaction reliant on a call to a remote API can feel sluggish on slower networks, or if requests result in large responses.

redBus was initially quite confident that the INP for their website would be good, but the [Real User Monitoring (RUM)](https://en.wikipedia.org/wiki/Real_user_monitoring) data for this metric at the 95th percentile told a different story.

## How redBus measured INP

redBus relied on the [`web-vitals` JavaScript library](https://github.com/GoogleChrome/web-vitals) built by Google to track not just INP, but all important user experience metrics for all pages across their website. In addition to the `web-vitals` JavaScript library, redBus used [ELK](https://www.elastic.co/what-is/elk-stack) to analyze INP data that was collected on the front end.

However, how you track your website's INP in [the field](/lab-and-field-data-differences/#field-data) may be quite different from how redBus approached the problem. We highly recommend that you read about [how to find slow interactions in the field](/find-slow-interactions-in-the-field/) to learn how to best to track INP for your websites, and subsequently [how to reproduce them in the lab](/diagnose-slow-interactions-in-the-lab/) before you begin [optimizing interactions](/optimize-inp/).

Once redBus had a system in place for tracking INP, they were able to analyze the data in order to gain a better understanding of where slow interactivity was present.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/s4JxEJgRhQAYZRSi7X3m.png", alt="A screenshot of the ELK logging system reporting INP values for analysis.", width="800", height="287" %}
  <figcaption>
    A screenshot of the logging system used by redBus to analyze INP values collected from the field. (<a href="https://web-dev.imgix.net/image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/s4JxEJgRhQAYZRSi7X3m.png" rel="noopener" target="_blank">Click for a higher resolution version of this image</a>.)
  </figcaption>
</figure>

## Use cases

When users search for fares on the redBus website, they can change the date on the search page to filter selected fares for the desired destination. The interaction to change the date on this page was slow, and was a cause of poor INP.

Additionally, when a user scrolls through fares, additional fares are lazy-loaded from the API. [Though scrolling itself isn't factored in how INP is measured](/inp/#whats-in-an-interaction), the `scroll` event listener itself schedules a lot of work that must run on the main thread. This work was causing contention on the main thread that increased interaction latency, leading to poor INP on the search page.

<figure>
  <video autoplay loop muted playsinline>
    <source src="https://web-dev.imgix.net/video/jL3OLOhcWUQDnR4XjewLBx4e3PC3/xcxqqKz4JaUO9yQlS3Ex.webm" type="video/webm">
  </video>
  <figcaption>
    The lazy-loading behavior used to load additional fares from the API on scroll. (<a href="https://web-dev.imgix.net/video/jL3OLOhcWUQDnR4XjewLBx4e3PC3/xcxqqKz4JaUO9yQlS3Ex.webm" rel="noopener" target="_blank">Click for a higher resolution version of this video</a>.)
  </figcaption>
</figure>

## How redBus optimized INP for the search page

To improve the search page's INP, redBus made several optimizations:

- The [`scroll`](https://developer.mozilla.org/docs/Web/API/Element/scroll_event) event handler was [debounced](/debounce-your-input-handlers/) in order to reduce the amount of times the event callback would fire in a given period. By lowering the frequency in which `scroll` event callback ran, the main thread was able to respond more quickly to user interactions on the search page.
- The resulting rendering work was prioritized by using a [`requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame) callback. `requestAnimationFrame` tells the browser that the work in the callback must be done before the next frame.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/seddeACyZ710UvE5s5L7.jpg", alt="A screenshot of the performance panel in Chrome DevTools showing the redBus website firing scroll event callbacks which are not debounced. The result is that the main thread becomes blocked.", width="800", height="500" %}
  <figcaption>
    Before: scroll handlers firing without debouncing applied to the event callback. A considerable number of blocking tasks on the main thread are present, which will delay interactions.
  </figcaption>
</figure>

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/op1p5FGFPsSi8cNU21WS.jpg", alt="A screenshot of the performance panel in Chrome DevTools showing the redBus website firing scroll event callbacks which are debounced. The result is that the main thread is less blocked because the scroll event handlers fire far less frequently.", width="800", height="500" %}
  <figcaption>
    After: scroll handlers firing with debouncing applied. The scroll event callbacks fire less frequently, giving the main thread more opportunities to respond to user interactions.
  </figcaption>
</figure>

Additionally, the following further optimizations were made to the search results page:

- New batches of results were fetched on the second to last card on the search results page in order to improve the user experience and visual performance by triggering lazy loading earlier.
- Fewer results were fetched on each network call during lazy loading. By reducing fetches from 30 to 10 results, a reduction in INP ranges at 870 to 900 down to 350 to 370 were observed.

<figure>
  <video autoplay loop muted playsinline>
    <source src="https://web-dev.imgix.net/video/jL3OLOhcWUQDnR4XjewLBx4e3PC3/ZjeONw0InjN2H5FEU0PM.webm" type="video/webm">
  </video>
  <figcaption>
    The lazy-loading behavior used to load additional fares from the API on scroll. (<a href="https://web-dev.imgix.net/video/jL3OLOhcWUQDnR4XjewLBx4e3PC3/ZjeONw0InjN2H5FEU0PM.webm" rel="noopener" target="_blank">Click for a higher resolution version of this video</a>.)
  </figcaption>
</figure>

While these changes significantly improved the INP of the search page, there was still the problem where the [`change`](https://developer.mozilla.org/docs/Web/API/HTMLElement/change_event) event on the search page's input fields would call an expensive reducer function to update the user interface. This resulted in unnecessary rerendering of the user interface, which affected the page's INP.

<figure>
  <video autoplay loop muted playsinline>
    <source src="https://web-dev.imgix.net/video/jL3OLOhcWUQDnR4XjewLBx4e3PC3/9A46NHqYLxgWLkFsKGmF.webm" type="video/webm">
  </video>
  <figcaption>
    INP values reported in the console while the user types in an input field. The resulting INP value of 344 observed in a lab setting falls within the "need improvement" thresholds. (<a href="https://web-dev.imgix.net/video/jL3OLOhcWUQDnR4XjewLBx4e3PC3/9A46NHqYLxgWLkFsKGmF.webm" rel="noopener" target="_blank">Click for a higher resolution version of this video</a>.)
  </figcaption>
</figure>

To optimize this interaction, redBus managed the state of input components locally and synced it with the [Redux](https://react-redux.js.org/) store only when an input's [`blur`](https://developer.mozilla.org/docs/Web/API/Element/blur_event) event was fired. This change reduced the number of rerenders and eliminated unwanted rerendering of the user interface by calling the reducer less frequently.

<figure>
  <video autoplay loop muted playsinline>
    <source src="https://web-dev.imgix.net/video/jL3OLOhcWUQDnR4XjewLBx4e3PC3/gD8RNByfNP8IsjytGbXZ.webm" type="video/webm">
  </video>
  <figcaption>
    Improved INP as a result of calling the reducer less frequently on an input field change. (<a href="https://web-dev.imgix.net/video/jL3OLOhcWUQDnR4XjewLBx4e3PC3/gD8RNByfNP8IsjytGbXZ.webm" rel="noopener" target="_blank">Click for a higher resolution version of this video</a>.)
  </figcaption>
</figure>

With this change, the page's INP improved by 72%, resulting in a faster and smoother user experience that users are more likely to engage with.

## Business impact

The relationship between business health and page performance is well-known. Though INP is a relatively new metric compared to other Core Web Vitals, redBus observed better business outcomes by focusing on improving this important user-centric performance metric. **The result was a 7% overall increase in sales.**

In short, INP helped to paint a picture of runtime performance issues on the redBus website. With the knowledge that there were improvements to be made, redBus was able to observe the problem, reproduce it, and use that crucial information to make optimizations that were beneficial to redBus and its business.
