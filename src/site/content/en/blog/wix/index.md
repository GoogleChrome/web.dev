---
layout: post
title: How Wix improved website performance by evolving their infrastructure
subhead: >
  A case study of some major changes introduced at Wix to improve website loading
  performance for millions of sites, clearing the path for them to receive good PageSpeed Insights and
  Core Web Vitals scores.
authors:
  - alonko
description: >
  A case study of some major changes introduced at Wix to improve website loading
  performance for millions of sites, clearing the path for them to receive good PageSpeed Insights and
  Core Web Vitals scores.
date: 2021-03-10
hero: image/BrQidfK9jaQyIHwdw91aVpkPiib2/HNGPDotyTYOuPE0YxLQ9.jpg
alt: "A fast train (source: https://unsplash.com/photos/60VrGk-bfeA)"
tags:
  - blog
  - fast
  - performance
  - web-vitals
  - case-study
---

{% Aside %}
  Alon leads the core backend team at [Wix](https://www.wix.com).
{% endAside %}

Thanks to leveraging industry standards, cloud providers, and CDN capabilities,
combined with a major rewrite of our website runtime, the percentage of Wix
sites reaching good 75th percentile scores on all Core Web Vitals (CWV) metrics
**more than tripled** year over year, according to data from
[CrUX](https://developers.google.com/web/tools/chrome-user-experience-report)
and
[HTTPArchive](https://httparchive.org/faq#how-do-i-use-bigquery-to-write-custom-queries-over-the-data).

Wix adopted a performance-oriented culture, and further improvements will
continue rolling out to users. As we focus on performance KPIs, we expect to see
the number of sites passing CWV thresholds grow.

## Overview

The world of performance is [beautifully complex](https://youtu.be/ctavZT87syI),
with many variables and intricacies. Research shows that site [speed has a
direct impact on conversion rates and revenues](/milliseconds-make-millions) for
businesses. In recent years, the industry has put more emphasis on performance
visibility and [making the web faster](/fast). Starting in May 2021, [page
experience
signals](https://developers.google.com/search/blog/2020/11/timing-for-page-experience)
will be included in Google Search ranking.

The unique challenge at Wix is supporting **millions** of sites, some of which
were built _many years ago_ and have not been updated since. We have various
[tools and
articles](https://support.wix.com/en/performance-and-technical-issues/site-performance)
to assist our users on what they can do to analyze and improve the performance
of their sites.

Wix is a managed environment and not everything is in the hands of the user.
Sharing common infrastructures presents many challenges for all these sites, but
also opens opportunities for major enhancements across the board, i.e.
leveraging the economies of scale.

{% Aside%}
_In this post I will focus on enhancements done around serving the initial HTML, which
initiates the page loading process._
{% endAside %}


### Speaking in a common language

One of the core difficulties with performance is finding a common terminology to
discuss different aspects of the user experience, while considering both the
technical and perceived performance. Using a well-defined, common language
within the organization enabled us to easily discuss and categorize the
different technical parts and trade-offs, clarified our performance reports and
tremendously helped to understand what aspects we should focus on improving
first.

We adjusted all our monitoring and internal discussions to include industry
standard metrics such as [Web Vitals](/vitals/), which include:

<figure class="w-figure">
  {% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/PLF62sx8lHkpKbnvYKKR.jpg", alt="A diagram of the 2020 Core Web Vitals: LCP, FID, and CLS.", width="800", height="215" %}
  <figcaption class="w-figcaption">Core Web Vitals</figcaption>
</figure>

### Site complexity and performance scores

It's pretty easy to create a site that loads instantly so long as you
[make it very simple](https://justinjackson.ca/words.html) using only
HTML and serve it via a CDN.

<figure class="w-figure w-figure--inline-left">
  {% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/xMUN9CUVvgnHofImPcV5.jpg", alt="PageSpeed Insights Example", width="800", height="647" %}
</figure>

However, the reality is that sites are getting more and more complex and
sophisticated, operating more like applications rather than documents, and
supporting functionalities such as blogs, e-commerce solutions, custom code,
etc.

Wix offers a very large [variety of
templates](https://www.wix.com/website/templates), enabling its users to easily
build a site with many business capabilities. Those additional features often
come with _some_ performance costs.

## The journey

### In the beginning, there was HTML

Every time a webpage is loaded, it always starts with an initial request to a
URL in order to retrieve the HTML document. This HTML response triggers all the
additional client requests and browser logic to run and render your site. This
is the most important part of the page loading, because nothing happens until
the beginning of the response arrives (known as TTFB - time to first byte).

<figure class="w-figure">
  {% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/b1KKSlUQQTuNCDj4ndyJ.jpg", alt="WebPageTest First View", width="800", height="411" %}
  <figcaption class="w-figcaption">WebPageTest First View</figcaption>
</figure>

#### The past: client-side rendering (CSR)

When operating large scale systems, you always have trade-offs you need to
consider, such as performance, reliability and costs. Up to a few years ago, Wix
used client-side rendering (CSR), in which the actual HTML content was generated
via JavaScript on the client side (i.e. in the browser) allowing us to support a
high scale of sites without having huge backend operational costs.

CSR enabled us to use a common HTML document, which was essentially empty. All
it did was trigger the download of the required code and data which was then
used to generate the full HTML on the client device.

#### Today: server-side rendering (SSR)

A few years ago we transitioned to server-side rendering (SSR), as that was
beneficial both to SEO and performance, improving initial page visibility times
and ensuring better indexing for search engines that do not have full support
for running JavaScript.

This approach improved the visibility experience, especially on slower
devices/connections, and opened the door for further performance optimizations.
However, it also meant that for each web page request, a unique HTML response
was generated on the fly, which is **far** from optimal, especially for sites
with a large amount of views.


### Introducing caching in multiple locations

The HTML for each site was mostly static, but it had a few caveats:

1. It frequently changes. Each time a user edits their site, or makes changes in site data,
   such as on the website store inventory.
2. It had certain data and cookies that were **visitor specific**,
   meaning two people visiting the same site would see somewhat different HTML. For example,
   to support products features such as remembering what items a visitor put in the cart,
   or the chat the visitor started with the business earlier, and more.
3. Not all pages are cacheable. For example a page with custom user code on it,
   that displays the current time as part of the document, is not eligible for caching.

Initially, we took the relatively safe approach of caching the HTML <span
style="text-decoration:underline;">without</span> visitor data, and then only
modified specific parts of the HTML response on the fly for each visitor, for
each cache hit.

#### In-house CDN solution

We did this by deploying an in-house solution: Using [Varnish HTTP
Cache](https://varnish-cache.org/) for proxying and caching, Kafka for
invalidation messages, and a Scala/Netty-based service which proxies these HTML
responses, but mutates the HTML and adds visitor-specific data and cookies to
the cached response.

This solution enabled us to deploy these **slim** components in many more
geographic locations and multiple cloud provider regions, which are spread
across the world. In 2019, we introduced **over 15 new regions**, and gradually
enabled caching for over 90% of our page views that were eligible for caching.
Serving sites from additional locations reduced the [network
latency](https://www.cloudping.co/grid) between the clients and the servers
serving the HTML response, by bringing the content closer to the website's
visitors.

We also started caching certain read-only API responses by using the same
solution and invalidating the cache on any change to the site content. For
example, the list of blog posts on the site is cached and invalidated when a
post is published/modified.

#### Reducing complexities

Implementing caching improved performance substantially, mostly on the
[TTFB](/time-to-first-byte/) and [FCP](/fcp/) phases, and improved our
reliability by serving the content from a location closer to the end user.

However, the need to modify the HTML for each response introduced an unnecessary
complexity that, if removed, presented an opportunity for further performance
improvements.

### Browser caching (and preparations for CDNs)

<div class="w-figure">
  <div class="w-stats">
    <div class="w-stat">
     <p class="w-stat__figure">~ 13<sub class="w-stat__sub">%</sub></p>
     <p class="w-stat__desc">HTML requests served directly from the browser cache,
     saving much bandwidth and reducing loading times for repeat views</p>
    </div>
  </div>
</div>

The next step was to actually remove this visitor-specific data from the HTML
<span style="text-decoration:underline;">entirely</span>, and retrieve it from a
separate endpoint, called by the client for this purpose, after the HTML has
arrived.

We carefully migrated this data and cookies to a new endpoint, which is called
on each page load, but returns a slim JSON, which is required only for the
[hydration process](https://reactjs.org/docs/react-dom.html#hydrate), to reach
full page interactivity.

This allowed us to enable browser caching of the HTML, which means that browsers
now save the HTML response for repeating visits, and only call the server to
validate that the content hasn't changed. This is done using [HTTP
ETag](https://en.wikipedia.org/wiki/HTTP_ETag), which is basically an identifier
assigned to a specific version of an HTML resource. If the content is still the
same, a [304 Not
Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304) response
is sent by our servers to the client, without a body.

<figure class="w-figure">
  {% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/hr1xnQccJEkHTBGxS5wF.jpg", alt="ALT_TEXT_HERE", width="800", height="410" %}
  <figcaption class="w-figcaption">WebPageTest Repeat View</figcaption>
</figure>

In addition, this change means that our HTML is no longer visitor-specific and
contains no cookies. In other words it can basically be cached anywhere, opening
the door to using CDN providers that have much better geo presence in hundreds
of locations around the world.


### DNS, SSL and HTTP/2

With caching enabled, wait times were reduced and other important parts of the
initial connection became more substantial. Enhancing our networking
infrastructure and monitoring enabled us to improve our DNS, connection, and SSL
times.

<figure class="w-figure w-figure--inline-right">
  {% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/Uuvh9xTItQ8wMA9s13RP.jpg", alt="A response time graph.", width="800", height="441" %}
</figure>

[HTTP/2](https://en.wikipedia.org/wiki/HTTP/2) was enabled for all user domains,
reducing both the amount of connections required and the overhead that comes
with each new connection. This was a relatively easy change to deploy, while
taking advantage of the [performance and resilience
benefits](https://developers.google.com/web/fundamentals/performance/http2) that
come with HTTP/2.


### Brotli compression (vs. gzip)

<div class="w-figure">
  <div class="w-stats">
    <div class="w-stat">
     <p class="w-stat__figure">21 - 25<sub class="w-stat__sub">%</sub></p>
     <p class="w-stat__desc">Reduction of median file transfer size</p>
    </div>
  </div>
</div>

Traditionally, all our files were compressed using [gzip
compression](https://en.wikipedia.org/wiki/Gzip), which is the most prevalent
HTML compression option on the web. This compression protocol was initially
implemented almost 30 years ago!

<figure class="w-figure w-figure--inline-right">
  {% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/h7KzeAfg2THMdDGMYvlR.jpg", alt="Brotli compression", width="800", height="805" %}
  <figcaption class="w-figcaption">
    <a href="https://tools.paulcalvano.com/compression.php">Brotli Compression Level Estimator</a>
  </figcaption>
</figure>


The newer [Brotli compression](https://en.wikipedia.org/wiki/Brotli) introduces
compression improvements with almost no trade-offs, and is slowly becoming more
popular, as described in the yearly Web Almanac [Compression
chapter](https://almanac.httparchive.org/en/2020/compression#what-type-of-content-should-we-compress).
It has been supported by [all the major browsers](https://caniuse.com/brotli)
for a while.

We enabled Brotli support on our nginx proxies in the edges, for all clients
that support it.

Moving to use Brotli compression reduced our median file transfer sizes by
**21% to 25%** resulting in a reduced bandwidth usage and improved loading times.

<figure class="w-figure">
  {% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/392RWYamrwkdFozk91LC.jpg", alt="Mobile and Desktop Median Response Sizes", width="800", height="173" %}
  <figcaption class="w-figcaption">Median Response Sizes</figcaption>
</figure>

## Content delivery networks (CDNs)

### Dynamic CDN selection

At Wix, we have always used [CDNs](/content-delivery-networks/) to serve all the
JavaScript code and images on user websites.

Recently, we integrated with a solution by our DNS provider, to automatically
select the best performing CDN according to the client's network and origin.
This enables us to serve the static files from the best location for each
visitor, and avoid availability issues on a certain CDN.

### Coming soon… user domains served by CDNs

The final piece of the puzzle is serving the last, and most critical part,
through a CDN: the HTML from the user domain.

As described above, we created our own in-house solution to cache and serve the
site-specific HTML and API results. Maintaining this solution in so many new
regions also has its operational costs, and adding new locations becomes a
process we need to manage and continually optimize.

We are currently integrating with various CDN providers to support serving the
entire Wix site directly from CDN locations to improve the distribution of our
servers across the globe and thus further improve response times. This is a
challenge due to the large amount of domains we serve, which require SSL
termination at the edge.

Integrating with CDNs brings Wix websites closer than ever to the customer and
comes with more improvements to the loading experience, including newer
technologies such as HTTP/3 without added effort on our side.

<hr>

### A few words on performance monitoring

If you run a Wix site, you're probably wondering how this translates to your Wix
site performance results, and how we compare against other website platforms.

Most of the work done above has been deployed in the past year, and some is
still being rolled out.

The Web Almanac by HTTPArchive recently published the [2020
edition](https://almanac.httparchive.org/en/2020) which includes an excellent
chapter on [CMS user experience](https://almanac.httparchive.org/en/2020/cms).
Keep in mind that many of the numbers described in this article are from the
middle of 2020.

We look forward to seeing the updated report in 2021, and are actively
monitoring
[CrUX](https://developers.google.com/web/tools/chrome-user-experience-report/)
reports for our sites as well as our internal performance metrics.

We are committed to continuously improve loading times and provide our users
with a platform where they can build sites as they imagine, without compromising
on performance.

<figure class="w-figure">
  {% Img src="image/BrQidfK9jaQyIHwdw91aVpkPiib2/AADz7d1yVOWZlq0iSb6P.jpg", alt="LCP, Speed Index and FCP for a mobile site over time", width="800", height="259" %}
  <figcaption class="w-figcaption">LCP, Speed Index and FCP for a mobile site over time</figcaption>
</figure>

DebugBear recently released a very interesting [Website Builder Performance
Review](https://www.debugbear.com/blog/website-builder-performance-review),
which touches on some of the areas I mentioned above and examines the
performance of very simple sites built on each platform. This
[site](https://matt05041.wixsite.com/bizsolutions) was built almost two years
ago, and not modified since, but the platform is continually improving, and the
site performance along with it, which can be witnessed by [viewing its
data](https://www.debugbear.com/project/175/pageLoad/873/overview?dateRange=2019-03-31T21%3A00Z-to-2021-03-31T21%3A59Z)
over the past year and a half.

## Conclusion

We hope our experience inspires you to adopt a performance-oriented culture at
your organisation and that the details above are helpful and applicable to your
platform or site.

To sum up:

* Pick a set of metrics that you can track consistently using tools endorsed by
  the industry. We recommend Core Web Vitals.
* Leverage browser caching and CDNs.
* Migrate to HTTP/2 (or HTTP/3 if possible).
* Use Brotli compression.

Thanks for learning our story and we invite you to ask questions, share ideas on
[Twitter](https://twitter.com/alonkochba) and
[GitHub](https://github.com/alonkochba) and join the web performance
conversation on your favorite channels.

## So, how does **your** recent Wix site performance look like?
