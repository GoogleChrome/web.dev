---
layout: post
title: Nikkei achieves a new level of quality and performance with their multi-page PWA
description: |
  With a publishing history of more than 140 years, Nikkei is one of the most authoritative media businesses in Japan. To provide a better user experience and accelerate their business on the web, Nikkei successfully launched a Progressive Web App in November 2017, and they’re seeing amazing results from the new platform.
date: 2018-11-19
updated: 2018-11-19
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - case-study
---

With a publishing history of more than 140 years, [Nikkei](https://r.nikkei.com/)
is one of the most authoritative media businesses in Japan. Along with their
print newspaper, they have over 450 million monthly visits to their digital
properties. To provide a better user experience and accelerate their business
on the web, Nikkei successfully launched a Progressive Web App (PWA) -
<https://r.nikkei.com> - in November 2017. They’re now seeing amazing
results from the new platform.

**Performance gains**
- 2X better Speed Index
- 14 seconds faster time-to-interactive
- 75% faster loading with prefetch

**Business impact**
- 2.3X organic traffic
- 58% more conversions (subscriptions)
- 49% more daily active users
- 2X page views per session

[Download PDF Case study](https://storage.googleapis.com/web-dev-uploads/file/T4FyVKpzu4WKF1kBNvXepbi08t52/JDiPdSdRpvxdrcfUCyqc.pdf)

## Business overview

### Challenge

Nikkei saw a rapid rise in mobile traffic to their legacy website as
smartphones became the main point of entry to the web for many users.
However, using [Lighthouse](https://developers.google.com/web/tools/lighthouse/), an auditing tool that
scans a web page and gives recommendations on how to improve across multiple
categories, they understood that their site wasn’t fully optimized for mobile
across multiple areas and was very slow to load.

Their website was taking ~20 secs to become consistently interactive and
averaged 10 seconds on the Speed Index. Knowing that 53% of mobile users
will abandon an experience if it takes more than 3 seconds to
load, Nikkei wanted to reduce their load time to provide a better experience
and accelerate their business on the web.

{% Blockquote 'Taihei Shigemori, Manager, Digital Strategy' %}
The value of speed is indisputable, especially for financial news. We made
speed one of our core metrics, and our customers have appreciated the
change.
{% endBlockquote %}


### Results

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/frvPpntXjuI7ZeZYP3YX.jpg", alt="Audit run in Apr 2018 on old site", width="800", height="407" %}
  <figcaption>
    Audit run in Apr 2018 on old site hosted at
    <a href="http://mw.nikkei.com">mw.nikkei.com</a>
  </figcaption>
</figure>

Nikkei achieved impressive performance gains. Their Lighthouse score soared
from 23 to 82. Their time-to-interactive measurement improved by 14 seconds.
Organic traffic, speed, conversion rate, and active daily users all rose as
well.

The PWA is a multi-page app (MPA) that reduces front-end complexity,
built with Vanilla JavaScript. Five core front-end engineers worked for a
year to achieve this performance.

{% Blockquote 'Hiroyuki Higashi. Product Manager, Nikkei' %}
The Nikkei front-end engineers have proved that great UX brings good
business performance. We’re fully invested in continuing our journey of
bringing a new level of quality to the web.
{% endBlockquote %}

### Solution

Nikkei created and launched a Progressive Web App, using responsive design,
vanilla JavaScript, and a multi-page architecture, they focused on building a
delightful user experience. By adding a service worker, they were able to
provide predictable performance, regardless of the network. This
also ensures that top articles are always available and loaded almost
immediately because they're stored using Cache Storage. They added a web app
manifest, and together with their service worker this allows users to
install the PWA, so it’s easily accessible. And to ensure
performance was entirely within their control, they optimized their
3rd-party JavaScript.

### Best practices

- Improve loading speed and interactivity by using modern web APIs,
  compression, and code optimization practices.
- Progressively enhance UX by adding PWA features such as offline support
  and Add to Home Screen.
- Build performance budgets into performance strategy.

## Technical Deep Dive

### Speed matters

Speed is more important than ever. As smartphones became the main browsing
device for many users, Nikkei saw a rapid increase of mobile traffic on
their service. But using [Lighthouse](https://developers.google.com/web/tools/lighthouse/), they realized
that their legacy website wasn’t fully optimized for mobile, with the Speed
Index averaging 10 seconds, very slow initial load, and a large JavaScript
bundle. It was time for Nikkei to rebuild their website and adapt
web-performance best practices. Here are the results and key performance
optimizations in the new PWA.

### Leveraging web APIs & best practices to speed loading

#### Preload key requests

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/TxaULtyR4DtBscNF3DWq.jpg", alt="Preload key requests", width="800", height="546" %}
</figure>

It is
[important to prioritize the loading of the critical path](https://developers.google.com/web/tools/lighthouse/audits/critical-request-chains). Using HTTP/2 Server Push, they're able to prioritize critical JavaScript and
CSS bundles they know a user will need.



#### Avoid multiple, costly round trips to any origin

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/6U2uNYiHFY6RJ0Qqfcax.jpg", alt="3rd party resources loading.", width="800", height="270" %}
</figure>

The website needed to load 3rd party resources for tracking, ads and many
other use cases. They used
[`<link rel=preconnect>`](/web/fundamentals/performance/resource-prioritization#preconnect)
to pre-resolve DNS/TCP/SSL handshake and negotiation for these key 3rd party
origins.



#### Dynamically prefetch the next page

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/N1x88qTSpjOHEVGXKAwz.jpg", alt="Dynamic prefetch", width="798", height="321" %}
</figure>
<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/562GBoMg3vDr6hODZ7l9.jpg", alt="Dynamic prefetch", width="777", height="413" %}
</figure>
<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/MiT2Js7zL69wDIW9bI8O.jpg", alt="Dynamic prefetch", width="767", height="428" %}
</figure>

When they were confident that the user will navigate to a certain page, they
didn’t just wait for the navigation to happen. Nikkei dynamically adds
[`<link rel=prefetch>`](https://developers.google.com/web/fundamentals/performance/resource-prioritization#prefetch)
to the `<head>` and pre-fetches the next page before the user actually clicks
the link. This enables instant page navigation.

#### Inline Critical-path CSS

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/5Is1yVbinu7pWR9ZxQyE.jpg", alt="Inline Critical-path CSS", width="800", height="516" %}
</figure>

Reducing render blocking CSS is one of the best practices of speed loading. The
website inlines all the critical CSS with 0
[render blocking stylesheets](https://developers.google.com/web/tools/lighthouse/audits/blocking-resources).
This optimization reduced first meaningful paint by more than 1 second.

#### Optimize JavaScript bundles

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/UZzxYGSQzDbxksL6fcIL.jpg", alt="Optimizing JavaScript bundles", width="730", height="692" %}
</figure>

In their previous experience, Nikkei's JavaScript bundles were bloated,
weighing over 300KB in total. Through a rewrite to vanilla JavaScript and
modern bundling optimizations, such as route-based chunking and tree-shaking,
they were able to trim this bloat. They reduced their JavaScript bundle size
by 80%, dropping it to 60KB with RollUp.

#### Other best practices implemented

- [Compression](https://developers.google.com/web/tools/lighthouse/audits/text-compression): Gzip/Brotli all
  compressible resources using Fastly CDN
-  [Caching](https://developers.google.com/web/tools/lighthouse/audits/cache-policy): Enable HTTP caching,
  edge side caching
-  [Image optimization](https://developers.google.com/web/tools/lighthouse/audits/unoptimized-images): Use
  [imgix](https://www.imgix.com/) for optimization and image format detection
- [Lazy load non-critical resources](https://developers.google.com/web/fundamentals/performance/lazy-loading-guidance/images-and-video/):
  Use intersection observer API to load below-the-fold fragments
- [Have a web font-loading strategy](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/webfont-optimization):
  Prioritize the use of system font
- [Optimize first meaningful paint](https://developers.google.com/web/tools/lighthouse/audits/first-contentful-paint):
 Render the content server side
- [Adopt performance budgets](https://infrequently.org/2017/10/can-you-afford-it-real-world-web-performance-budgets/):
  Keeping JavaScript transmission and parse/compile times low


### Optimizing third-party JavaScript

While it’s not as easy to optimize 3rd party JavaScripts compared to your
own scripts, Nikkei successfully minified and bundled all ad-related scripts,
which are now served from its own content delivery network (CDN). Ad-related
tags usually provide a snippet to initiate and load other required scripts,
which often block the page rendering and also require extra network
turnaround time for each of the scripts downloaded. Nikkei took the following
approach and improved initialization time by 100ms, plus reduced JS size by 30%:

- Bundle all the required scripts using a JS bundler (e.g., Webpack)
- Async load the bundled script, so that it doesn’t block the page rendering
- Attach the calculated ad banner to Shadow DOM (vs iframe)
- Progressively load ads on user scroll with Intersection Observer API


### Progressively enhancing the website

<figure>
{% Video src="video/T4FyVKpzu4WKF1kBNvXepbi08t52/CyWCDtfk4M9nXV18xER3.mp4", autoplay="true", loop="true", muted="true" %}
</figure>

In addition to these basic optimizations, Nikkei leveraged
[Web App Manifest](https://developers.google.com/web/fundamentals/web-app-manifest/) and
[service workers](https://developers.google.com/web/fundamentals/primers/service-workers/) to make their
website [installable](https://developers.google.com/web/fundamentals/app-install-banners/) and even work
offline. By using the [cache-first](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/)
strategy in their service worker, all core resources and top articles are
stored in the Cache Storage and reused even in contingency situations such as
a flaky or offline network, providing consistent, optimized performance.

### Hack the Nikkei

A traditional daily newspaper company with a history of 140+ years successfully
accelerated its digitalization through the power of web and PWA. Nikkei’s
front-end engineers proved that great UX delivers strong  business performance.
The company will continue its journey of bringing a new level of quality to the web.

## Further reading

- [Google I/Oで日経電子版が事例として紹介された話 (Japanese)](https://hack.nikkei.com/blog/nikkei-featured-at-google-io/)
- [日経電子版を支える広告技術 (Japanese)](https://hack.nikkei.com/blog/tech_book_fest04_ds_ad_tech/)

{% YouTube id="Mv-l3-tJgGk" %}
