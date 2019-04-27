---
layout: post
title: Page is blocked from indexing
description: |
  Learn about is-crawable audit.
authors:
 - kaycebasques
 - megginkearney
web_lighthouse:
  - is-crawable
---

Search engines crawl your page in order to understand your content. If you don't
give them permission to crawl your page, they can't know what your page
contains, and therefore are unable to list your page in search results.

## Recommendations

If you want search engines to crawl your page, remove the HTTP headers or meta
tags that are preventing crawlers from doing so. Your Lighthouse report lists the
problematic headers or tags. Lighthouse only checks for the general headers or
tags that affect all crawlers. It doesn't flag headers or tags that block
specific search engine bots.

See [Robots meta tag and X-Robots-Tag HTTP header specifications](https://developers.google.com/search/reference/robots_meta_tag)
for details about exactly how you can configure your meta tags and HTTP headers
to get more control over how search engines crawl your page. Below is an
overview of the issues that Lighthouse flags.

The tag below prevents all search engine crawlers from accessing your page:

```html
<meta name="robots" content="noindex"/>
```

The HTTP response header below does the same:

```hmtl
X-Robots-Tag: noindex
```

You can inspect your page's response headers via [the **Headers** tab of Chrome
DevTools](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference#headers).

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="headers.svg" alt="The Headers tab">
  <figcaption class="w-figcaption">
    Fig. 1 — The Headers tab
  </figcaption>
</figure>

## More information

You might also have meta tags that block specific crawlers, such as:

```html
<meta name="AdsBot-Google" content="noindex"/>
```

Lighthouse doesn't check for bot-specific directives like this. Nonetheless,
directives like this can still make your page harder to discover in various
ways.

[Audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/is-crawlable.js)