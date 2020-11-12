---
layout: post
title: How AMP can guarantee fastness in your Next.js app
authors:
  - houssein
subhead: |
  Learn about the benefits and tradeoffs of supporting AMP in your Next.js app
date: 2019-11-08
codelabs: how-to-use-amp-in-nextjs
---

[AMP](https://amp.dev) is a web component framework that guarantees
fast page loads. [Next.js][intro] has built-in support for AMP.

## What will you learn?

This guide first briefly describes [how AMP guarantees fast page loads](#overview), then
explains [the different ways you can support AMP in a Next.js app](#strategies),
then helps you [decide which approach is best for you](#guidance).

The intended audience for this guide is a web developer who has decided to use Next.js but is
unsure of whether to support AMP.

{% Aside %}
  This guide was not written for web developers who have decided to use AMP but are unsure of what
  framework to use. We will note briefly however that Next.js could be a good choice because it
  supports [AMP server-side rendering](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/server-side-rendering/)
  and makes it easy to serve AMP content without introducing a lot of complexity into your codebase.
{% endAside %}

## How AMP guarantees fast page loads {: #overview }

AMP has two main strategies for guaranteeing fastness:

* **AMP HTML**: A restricted form of HTML that makes certain optimizations mandatory and prohibits
  architectural patterns that lead to slowness. See [How AMP works][overview] for a high-level
  overview of the optimizations and restrictions.
* **AMP Cache**: A content cache used by some search engines, such as Google and Bing, that uses
  [prerendering] to speed up page loads. See [Why AMP Caches exist][why] to learn more about the
  benefits and tradeoffs of the caches and [How does my AMP page get cached?][how] to understand
  how your AMP pages get into the caches.

## How you can use AMP in Next.js {: #strategies }

There are two ways to use AMP in Next.js:

* The **Hybrid AMP** approach lets you create an accompanying AMP version of any
  Next.js page.
* The **AMP-only** approach lets you make AMP the only option for a page.

Although Next.js is usually thought of as a React framework, it's important to understand that
when you use Next.js to serve AMP pages, you can no longer run React components client-side because
React components are not valid AMP components. In other words, Next.js is no longer a React
framework but rather a server-side templating engine for generating AMP pages.

{% Aside 'codelab' %}
  Check out [How to use AMP in Next.js](/how-to-use-amp-in-nextjs) to try out the two
  approaches yourself.
{% endAside %}

## How to decide whether to use the Hybrid AMP or AMP-only approach {: #guidance }

If you're serious about load performance, an AMP-only page could be a good way to make sure
that your page gets fast and stays fast. But here's the catch: in order to guarantee fastness,
AMP prohibits certain architectural patterns and HTML elements that often lead to slow pages.
For example, AMP doesn't allow custom synchronous JavaScript because
[render-blocking resources][blockers] are a common cause of slow page loads.

In order to understand whether an AMP-only approach is right for you, you need to figure out
whether all of your frontend code can be represented in AMP HTML:

* Read [How AMP works][overview] to understand AMP's high-level
  architectural restrictions and mandatory optimizations.
* Read [HTML Tags][tags] to see what HTML tags AMP allows and prohibits,
  browse the [AMP component catalogue](https://amp.dev/documentation/components/) to see the
  custom components that the AMP community has built to solve common use cases, and check
  out [amp-script] to learn how to use custom JavaScript to implement features that AMP
  doesn't currently support.

Even if an AMP-only approach won't work for your page, it might still be a good idea to
use AMP whenever possible, because of the guaranteed fastness of AMP HTML and the AMP Caches.
The Hybrid AMP approach in Next.js provides a way to conditionally serve AMP pages. However,
it also creates a higher maintenance cost because it requires you to maintain
two versions of each page.

## Conclusion

AMP guarantees that your site gets fast and stays fast by enforcing patterns that lead to
fastness and prohibiting patterns that lead to slowness. AMP HTML and AMP Caches are the two
main ways that AMP guarantees fastness. But before adopting AMP you should make sure that it
can support all of your site's requirements.

[intro]: /performance-as-a-default-with-nextjs
[collection]: /react#nextjs
[prerendering]: https://developers.googleblog.com/2019/08/the-speed-benefit-of-amp-prerendering.html
[tags]: https://amp.dev/documentation/guides-and-tutorials/learn/spec/amphtml/#html-tags
[blockers]: /render-blocking-resources
[why]: https://blog.amp.dev/2017/01/13/why-amp-caches-exist/
[how]: https://amp.dev/documentation/guides-and-tutorials/learn/amp-caches-and-cors/how_amp_pages_are_cached/#how-does-my-amp-page-get-cached?
[amp-script]: https://amp.dev/documentation/components/amp-script/
[overview]: https://amp.dev/about/how-amp-works/
