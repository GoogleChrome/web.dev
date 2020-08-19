---
layout: post
title: Third-party JavaScript performance
subhead: Find out how third-party JavaScript can affect performance and what you can do to keep it from slowing down your sites.
authors:
  - mihajlija
date: 2019-08-13
# Add an updated date to your post if you edit in the future.
# updated: 2019-06-27
description: |
  This post describes the common kinds of third-party JavaScript and the performance issues they can cause. It also provides general guidance about how to optimize third-party scripts.
alt: A diagram of a webpage featuring text, a video, a map, a chat widget, and social media sharing buttons.
tags:
  - blog
  - performance
  - third-party
---

Third-party JavaScript generally refers to scripts embedded in your website that are:
- Not authored by you
- Served from third-party servers

Sites use these scripts for various purposes, including:
- Social sharing buttons
- Video player embeds
- Chat services
- Advertising iframes
- Analytics and metrics scripts
- A/B testing scripts for experiments
- Helper libraries (like date formatting, animation, and functional libraries)

<figure class="w-figure w-figure--fullbleed">
  <video autoplay loop muted playsinline>
    <source src="./third-party-examples.mp4" type="video/mp4">
  </video>
</figure>

Third-party scripts can provide powerful functionality, but that's not the whole story. They also affect privacy, security, and page behavior⁠—and they can be particularly problematic for performance.

## Performance
Any significant amount of [JavaScript can slow down performance](/bootup-time). But because third-party JavaScript is usually outside your control, it can bring additional issues.

### Network
Setting up connections takes time, and sending too many requests to multiple servers causes slowdowns. That time is even longer for secure connections, which may involve DNS lookups, redirects, and several round trips to the final server that handles the user's request.

Third-party scripts often add to network overhead with things such as:
- Firing additional network requests
- Pulling in unoptimized images and videos
- Insufficient [HTTP caching](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching), which forces frequent fetching of network resources
- Insufficient [server compression](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/optimize-encoding-and-transfer) of resources
- Multiple instances of frameworks and libraries pulled in by different third-party embeds

### Rendering
The way third-party JavaScript is loaded matters a lot. If it's done synchronously in the critical rendering path it delays parsing of the rest of the document.

{% Aside 'key-term' %}
The __critical rendering path__ includes all resources that the browser needs to display the first screen's worth of content.
{% endAside %}

If a third party has server issues and fails to deliver a resource, rendering is blocked until the request times out, which can be anywhere from 10 to 80 seconds. You can test and simulate this problem with [WebPageTest Single-Point-of-Failure tests](https://css-tricks.com/use-webpagetest-api/#single-point-of-failure).

{% Aside %}
[A/B testing scripts](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/loading-third-party-javascript/#ab_test_smaller_samples_of_users) can also often delay rendering. Most of them block content display until they complete processing—which can be true even for asynchronous A/B testing scripts.
{% endAside %}

## What to do about it
Using third-party JavaScript is often unavoidable, but there are things you can do to minimize adverse effects:
- When choosing third-party resources, favor those that send the least amount of code while still giving you the functionality you need.
- Use [performance budgets](/use-lighthouse-for-performance-budgets/) for third-party content to keep their cost in check.
- Don't use the same functionality from two different vendors. You probably don't need two tag managers or two analytics platforms.
- Routinely audit and clean out redundant third-party scripts.

To learn how to audit third-party content and load it efficiently for better performance and user experience, check out the other posts in the [Optimize your third-party resources](/fast/#optimize-your-third-party-resources) section.
