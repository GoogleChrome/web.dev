---
layout: post
title: Page is blocked from indexing
description: |
  Learn about is-crawable audit.
web_lighthouse:
  - is-crawable
---

Search engines can only show pages in their search results,
if those pages are not explicitly blocking indexing.
Don't block indexing for content that you want to show up in search results.
Lighthouse flags when search engines can't index your page:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="is-crawable.png" alt="Lighthouse audit showing search engines can't index your page">
  <figcaption class="w-figcaption">
    Fig. 1 — Search engines can't index your page
  </figcaption>
</figure>

## What causes this audit to fail

Lighthouse checks for the general headers or tags that affect all crawlers.
It doesn't flag headers or tags that block specific search engine bots.
For example, the tag below prevents all search engine crawlers from accessing your page:

```html
<meta name="robots" content="noindex"/>
```

The HTTP response header below does the same:

```html
X-Robots-Tag: noindex
```

You might also have meta tags that block specific crawlers, such as:

```html
<meta name="AdsBot-Google" content="noindex"/>
```

Lighthouse doesn't check for bot-specific directives like this.
Nonetheless,
directives like this can still make your page harder to discover in various ways.

You can inspect your page's response headers via
[the **Headers** tab of Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/network-performance/reference#headers):

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="headers.svg" alt="The Headers tab">
  <figcaption class="w-figcaption">
    Fig. 1 — The Headers tab
  </figcaption>
</figure>


## How to ensure search engines can crawl your page

If you want search engines to crawl your page,
remove the HTTP headers or meta tags that are preventing crawlers from doing so.

See [Robots meta tag and X-Robots-Tag HTTP header specifications](https://developers.google.com/search/reference/robots_meta_tag)
for details about exactly how you can configure your meta tags and HTTP headers
to get more control over how search engines crawl your page.

Learn more in [Remove code that blocks search engine indexing](/remove-code-blocking-indexing).

{% include 'content/lighthouse-seo/scoring.njk' %}

## More information

[Search engines can't index your site audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/is-crawlable.js)
