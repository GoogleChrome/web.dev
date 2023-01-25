---
layout: post
title: Page is blocked from indexing
description: |
  Learn about the "Page is blocked from indexing" Lighthouse audit.
date: 2019-05-02
updated: 2019-08-21
web_lighthouse:
  - is-crawlable
---

Search engines can only show pages in their search results if those pages don't
explicitly block indexing by search engine crawlers. Some HTTP headers and meta
tags tell crawlers that a page shouldn't be indexed.

Only block indexing for content that you don't want to appear in search results.

## How the Lighthouse indexing audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags pages
that search engines can't index:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/83IDo3GOQNVcas3472CI.png", alt="Lighthouse audit showing search engines can't index your page", width="800", height="185", class="w-screenshot w-screenshot" %}
</figure>

Lighthouse only checks for headers or elements that block _all_ search engine
crawlers. For example, the `<meta>` element below prevents all search engine
crawlers (also known as robots) from accessing your page:

```html
<meta name="robots" content="noindex"/>
```

This HTTP response header also blocks all crawlers:

```html
X-Robots-Tag: noindex
```

You might also have `<meta>` elements that block specific crawlers, such as:

```html
<meta name="AdsBot-Google" content="noindex"/>
```

Lighthouse doesn't check for crawler-specific directives like this, but they can
still make your page harder to discover, so use them with caution.

{% include 'content/lighthouse-seo/scoring.njk' %}

## How to ensure search engines can crawl your page

First make sure you want search engines to index the page. Some pages, like
[sitemaps](https://support.google.com/webmasters/answer/156184?hl=en&ref_topic=4581190)
or legal content, generally shouldn't be indexed. (Keep in mind that blocking
indexing doesn't prevent users from accessing a page if they know its URL.)

For pages that you want indexed, remove any HTTP headers or `<meta>` elements
that are blocking search engine crawlers. Depending on how you set up your site,
you might need to do some or all of the steps below:

- Remove the `X-Robots-Tag` HTTP response header if you set up a HTTP
    response header:

```text
X-Robots-Tag: noindex
```

- Remove the following meta tag if it's present in the head of the page:

```html
<meta name="robots" content="noindex">
```

- Remove meta tags that block specific crawlers if these tags are present in the
  head of the page. For example:

```html
<meta name="Googlebot" content="noindex">
```

## Add additional control (optional)

You may want more control over how search engines index your page. (For example,
maybe you don't want Google to index images, but you do want the rest of the page
indexed.)

For information about how to configure your `<meta>` elements and HTTP
headers for specific search engines, see these guides:

-  [Google Search](https://developers.google.com/search/reference/robots_meta_tag)
-  [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
-  [Yandex](https://yandex.com/support/webmaster/controlling-robot/html.html)

## Resources

- [Source code for **Page is blocked from indexing** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/is-crawlable.js)
- Google's [Robots meta tag and X-Robots-Tag HTTP header specifications](https://developers.google.com/search/reference/robots_meta_tag)
- Bing's [Robots Metatags](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
- Yandex's [Using HTML elements](https://yandex.com/support/webmaster/controlling-robot/html.html)
