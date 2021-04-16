---
layout: post
title: Use lazy-loading to improve loading speed
authors:
  - jeremywagner
  - rachelandrew
date: 2019-08-16
updated: 2020-06-09
description: |
  This post explains lazy-loading and why you might want to lazy-load elements on your site.
tags:
  - performance
  - images
---


The portion of
[images](http://beta.httparchive.org/reports/state-of-images?start=earliest&end=latest)
and [video](http://beta.httparchive.org/reports/page-weight#bytesVideo) in the
typical payload of a website can be significant.
Unfortunately, project stakeholders may be unwilling to cut any media resources from their existing
applications.
Such impasses are frustrating,
especially when all parties involved want to improve site performance,
but can't agree on how to get there.
Fortunately, lazy-loading is a solution that lowers initial page payload _and_
load time, but doesn't skimp on content.

## What is lazy-loading? {: #what }

Lazy-loading is a technique that defers loading of non-critical resources at page
load time. Instead, these non-critical resources are loaded at the moment of
need. Where images are concerned, "non-critical" is often synonymous with
"off-screen". If you've used Lighthouse and examined some opportunities for
improvement, you may have seen some guidance in this realm in the form of the
[Defer offscreen images audit](/offscreen-images/):

<figure class="w-figure">
  {% Img src="image/admin/63NnMISWUUWD3mvAliwe.png", alt="A screenshot of the Defer offscreen images audit in Lighthouse.", width="800", height="102", class="w-screenshot" %}
  <figcaption class="w-figcaption">One of Lighthouse's performance audits is to
identify off screen images, which are candidates for lazy-loading.</figcaption>
</figure>

You've probably already seen lazy-loading in action, and it goes something like
this:

- You arrive at a page, and begin to scroll as you read content.
- At some point, you scroll a placeholder image into the viewport.
- The placeholder image is suddenly replaced by the final image.

An example of image lazy-loading can be found on the popular publishing platform
[Medium](https://medium.com/), which loads lightweight placeholder images at
page load, and replaces them with lazily-loaded images as they're scrolled into
the viewport.

<figure class="w-figure">
  {% Img src="image/admin/p5ahQ67QtZ20bgto7Kpy.jpg", alt="A screenshot of the website Medium in the browsing, demonstrating lazy-loading in action. The blurry placeholder is on the left, and the loaded resource is on the right.", width="800", height="493" %}
  <figcaption class="w-figcaption">An example of image lazy-loading in action. A
placeholder image is loaded at page load (left), and when scrolled into the
viewport, the final image loads at the time of need.</figcaption>
</figure>

If you're unfamiliar with lazy-loading, you might be wondering just how useful
the technique is, and what its benefits are. Read on to find out!

## Why lazy-load images or video instead of just _loading_ them? {: #why }

Because it's possible you're loading stuff the user may never see. This is
problematic for a couple reasons:

- It wastes data. On unmetered connections, this isn't the worst thing that could
happen (although you could be using that precious bandwidth for downloading
other resources that are indeed going to be seen by the user). On limited data
plans, however, loading stuff the user never sees could effectively be a waste
of their money.
- It wastes processing time, battery, and other system resources. After a media
resource is downloaded, the browser must decode it and render its content in the
viewport.

Lazy-loading images and video reduces initial page load time, initial
page weight, and system resource usage, all of which have positive impacts on
performance.

## Implementing lazy-loading {: #implementing }

There are a number of ways to implement lazy-loading.
Your choice of solution must take into account the browsers you support,
and also what you are trying to lazy-load.

Modern browsers implement [browser-level lazy-loading](/browser-level-image-lazy-loading/),
which can be enabled using the `loading` attribute on images and iframes.
To provide compatibility with older browsers
or to perform lazy-loading on elements without built-in lazy-loading
you can implement a solution with your own JavaScript.
There are also a number of existing libraries to help you to do this.
See the posts on this site for full details of all of these approaches:

- [Lazy-loading images](/lazy-loading-images/)
- [Lazy-loading video](/lazy-loading-video/)

Also, we have compiled a list of [potential issues with lazy-loading](/lazy-loading-best-practices),
and things to watch out for in your implementation.

## Conclusion

Used with care, lazy-loading images and video can seriously lower the initial
load time and page payloads on your site. Users won't incur unnecessary network
activity and processing costs of media resources they may never see, but they
can still view those resources if they want.

As far as performance improvement techniques go, lazy-loading is reasonably
uncontroversial. If you have a lot of inline imagery in your site, it's a
perfectly fine way to cut down on unnecessary downloads. Your site's users and
project stakeholders will appreciate it!
