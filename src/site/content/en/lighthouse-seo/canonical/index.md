---
layout: post
title: Document does not have a valid `rel=canonical`
description: |
  Learn about the "Document does not have a valid rel=canonical" Lighthouse
  audit.
date: 2019-05-02
updated: 2019-08-20
web_lighthouse:
  - canonical
---

When multiple pages have similar content, search engines consider them duplicate
versions of the same page. For example, desktop and mobile versions of a product
page are often considered duplicates.

Search engines select one of the pages as the _canonical_, or primary, version
and **crawl** that one more. Valid canonical links let you tell search engines
which version of a page to crawl and display to users in search results.

{% Aside 'key-term' %}
_Crawling_ is how a search engine updates its index of content on the web.
{% endAside %}

Using canonical links has many advantages:
- It helps search engines consolidate multiple URLs into a single, preferred URL. For example,
  if other sites put query parameters on the ends of links to your page, search engines
  consolidate those URLs to your preferred version.
- It simplifies tracking methods. Tracking one URL is easier than tracking many.
- It improves the page ranking of syndicated content by consolidating the syndicated links to
  your original content back to your preferred URL.

## How the Lighthouse canonical links audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags any page
with an invalid canonical link:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TLhOThFgDllifsEEeOH3.png", alt="Lighthouse audit showing document with invalid canonical link", width="800", height="76", class="w-screenshot w-screenshot" %}
</figure>

A page fails this audit if any of the following conditions are met:

- There is more than one canonical link.
- The canonical link is not a valid URL.
- The canonical link points to a page for a different region or language.
- The canonical link points to a different domain.
- The canonical link points to the site root. Note that this scenario may be
  valid in some scenarios, such as for AMP or mobile page variations, but
  Lighthouse nonetheless treats it as a failure.

{% include 'content/lighthouse-seo/scoring.njk' %}

## How to add canonical links to your pages

There are two options for specifying a canonical link.

**Option 1:** Add a `<link rel=canonical>` element to the `<head>` of the page:

```html/4
<!doctype html>
<html lang="en">
  <head>
    …
    <link rel="canonical" href="https://example.com"/>
    …
  </head>
  <body>
    …
  </body>
</html>
```

**Option 2:** Add a `Link` header to the HTTP response:

```html
Link: https://example.com; rel=canonical
```

For a list of the pros and cons of each approach, see
Google's [Consolidate duplicate URLs](https://support.google.com/webmasters/answer/139066)
page.

### General guidelines

- Make sure that the canonical URL is valid.
- Use secure [HTTPS](https://developers.google.com/web/fundamentals/security/encrypt-in-transit/why-https) canonical URLs rather than HTTP whenever possible.
- If you use [`hreflang` links](/hreflang) to serve different versions of a page
  depending on a user's language or country, make sure that the canonical URL
  points to the   proper page for that respective language or country.
- Don't point the canonical URL to a different domain. Yahoo and Bing don't
  allow this.
- Don't point lower-level pages to the site's root page unless their content is
  the same.

### Google-specific guidelines

- Use the [Google Search Console](https://search.google.com/search-console/index)
  to see which URLs Google considers canonical or duplicative across your entire
  site.
- Don't use Google's URL removal tool for canonization. It removes *all* versions
  of a URL from search.

{% Aside 'note' %}
Recommendations for other search engines are welcome.
[Edit this page](https://github.com/GoogleChrome/web.dev/blob/master/src/site/content/en/lighthouse-seo/canonical/index.md).
{% endAside %}

## Resources

- [Source code for **Document does not have a valid `rel=canonical`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/canonical.js)
- [5 common mistakes with rel=canonical](https://webmasters.googleblog.com/2013/04/5-common-mistakes-with-relcanonical.html)
- [Consolidate duplicate URLs](https://support.google.com/webmasters/answer/139066)
- [Block crawling of parameterized duplicate content](https://support.google.com/webmasters/answer/6080548)
- [Google Search Console](https://search.google.com/search-console/index)
