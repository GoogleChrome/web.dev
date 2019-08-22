---
layout: post
title: Page is blocked from indexing
description: |
  Learn about the "Page is blocked from indexing" Lighthouse audit.
updated: 2019-08-21
web_lighthouse:
  - is-crawable
---

Search engines can only show pages in their search results if those pages don't
explicitly block indexing. Don't block indexing for content that you want to
appear in search results.

## How the Lighthouse indexing audit fails

Lighthouse flags pages that search engines can't index:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot" src="is-crawable.png" alt="Lighthouse audit showing search engines can't index your page">
</figure>

Lighthouse only checks for headers or elements that block _all_ search engine
crawlers. For example, the `<meta>` element below prevents all search engine
crawlers from accessing your page:

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

If you want search engines to crawl your page, remove any HTTP headers or
`<meta>` elements that are blocking the crawlers.

You can inspect your page's response headers using
[the **Headers** tab of Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference#headers):

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="headers.svg" alt="The Headers tab">
</figure>

See Google's [Robots meta tag and X-Robots-Tag HTTP header specifications](https://developers.google.com/search/reference/robots_meta_tag)
page to learn how to configure your `<meta>` elements and HTTP headers to get
more control over how search engines crawl your page.

## Add additional control (optional)

You may want more control over how search engines index your page. (For example,
maybe you don't want Google to index images, but you do want the rest of the page
to be indexed.) See these guidelines for specific search engines:

-  [Google Search](https://developers.google.com/search/reference/robots_meta_tag)
-  [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
-  [Yandex](https://yandex.com/support/webmaster/controlling-robot/html.html)

## Resources

- [Source code for **Page is blocked from indexing** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/is-crawlable.js)
- [Robots meta tag and X-Robots-Tag HTTP header specifications](https://developers.google.com/search/reference/robots_meta_tag)
