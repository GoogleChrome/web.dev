---
layout: post
title: Page is blocked from indexing
description: |
  Learn about the "Page is blocked from indexing" Lighthouse audit.
web_lighthouse:
  - is-crawable
---

Search engines can only show pages in their search results
if those pages don't explicitly block indexing.
Don't block indexing for content that you want to show up in search results.

Lighthouse flags pages that search engines can't index:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="is-crawable.png" alt="Lighthouse audit showing search engines can't index your page">
</figure>

## How this audit fails

Lighthouse only checks for headers or elements that block _all_ search engine
crawlers. For example, the `<meta>` element below prevents all search engine
crawlers from accessing your page:

```html
<meta name="robots" content="noindex"/>
```

The HTTP response header below does the same:

```html
X-Robots-Tag: noindex
```

You might also have `<meta>` elements that block specific crawlers, such as:

```html
<meta name="AdsBot-Google" content="noindex"/>
```

Lighthouse doesn't check for crawler-specific directives like this, but they can
still make your page harder to discover, so use them with caution.

You can inspect your page's response headers via
[the **Headers** tab of Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference#headers):

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="headers.svg" alt="The Headers tab">
</figure>

{% include 'content/lighthouse-seo/scoring.njk' %}

## How to ensure search engines can crawl your page

If you want search engines to crawl your page, remove any HTTP headers or
`<meta>` elements that are blocking the crawlers.

See Google's [Robots meta tag and X-Robots-Tag HTTP header specifications](https://developers.google.com/search/reference/robots_meta_tag)
page to learn how to configure your `<meta>` elements and HTTP headers to get
more control over how search engines crawl your page.

See the [Remove code that blocks search engine indexing](/remove-code-blocking-indexing)
post for more information.

## More information

[**Page is blocked from indexing** audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/is-crawlable.js)
