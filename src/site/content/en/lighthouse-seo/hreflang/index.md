---
layout: post
title: Document doesn't have a valid `hreflang`
description: |
  Learn about the "Document doesn't have a valid hreflang" Lighthouse audit.
date: 2019-05-02
updated: 2019-08-21
web_lighthouse:
  - hreflang
---

Many sites provide different versions of a page based on a user's language or
region. `hreflang` links tell search engines the URLs for all the versions of
a page so that they can display the correct version for each language or region.

## How the Lighthouse `hreflang` audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags
incorrect `hreflang` links:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9SqStqAKEC9FyHAC2TRQ.png", alt="Lighthouse audit showing incorrect hreflang links", width="800", height="185", class="w-screenshot w-screenshot" %}
</figure>

Lighthouse checks for `hreflang` links
in the page's `head` and in its [response headers](https://developer.mozilla.org/en-US/docs/Glossary/Response_header).

Lighthouse then checks for valid language codes within the `hreflang`links.
Lighthouse reports any `hreflang` links with invalid language codes.

Lighthouse does not check region codes or your [sitemap](https://support.google.com/webmasters/answer/156184).

{% include 'content/lighthouse-seo/scoring.njk' %}

## How to define an `hreflang` link for each version of a page

Suppose that you have three versions of a page:

- An English version at `https://example.com`
- A Spanish version at `https://es.example.com`
- A German version at `https://de.example.com`

There are three ways to tell search engines that these pages are equivalent.
Choose whichever method is easiest for your situation.

**Option 1:** Add `hreflang` links to the `<head>` of each page:

```html
<link rel="alternate" hreflang="en" href="https://example.com" />
<link rel="alternate" hreflang="es" href="https://es.example.com" />
<link rel="alternate" hreflang="de" href="https://de.example.com" />
```

Each version of a page must link to all other versions,
**including itself**. Otherwise, search engines may ignore the `hreflang` links
or interpret them incorrectly.

For pages that allow users to select their language, use the `x-default`
keyword:

```html
<link rel="alternate" href="https://example.com" hreflang="x-default" />
```

**Option 2:** Add `Link` headers to your HTTP response:

```html
Link: <https://example.com>; rel="alternate"; hreflang="en", <https://es.example.com>;
rel="alternate"; hreflang="es", <https://de.example.com>; rel="alternate"; hreflang="de"
```

**Option 3:** Add language version information to your [sitemap](https://support.google.com/webmasters/answer/156184).

```xml
<url>
<loc>https://example.com</loc>

<xhtml:link rel="alternate" hreflang="es"
href="https://es.example.com"/>

<xhtml:link rel="alternate" hreflang="de"
href="https://es.example.com"/>

</url>
```

{% Aside %}
For more information, see Google's
[Tell Google about localized versions of your page](https://support.google.com/webmasters/answer/189077).
{% endAside %}

## Guidelines for `hreflang` values

- The `hreflang` value must always specify a language code.
- The language code must follow
  [ISO 639-1 format](https://wikipedia.org/wiki/List_of_ISO_639-1_codes).
- The `hreflang` value can also include an optional regional code.
  For example, `es-mx` is for Spanish speakers in Mexico, while `es-cl` is for
  Spanish speakers in Chile.
- The region code must follow the
  [ISO 3166-1 alpha-2 format](https://wikipedia.org/wiki/ISO_3166-1_alpha-2).

## Resources

- [Source code for **Document does not have a valid `hreflang`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/hreflang.js)
- [Tell Google about localized versions of your page](https://support.google.com/webmasters/answer/189077)
- [ISO 639-1 format](https://wikipedia.org/wiki/List_of_ISO_639-1_codes)
- [ISO 3166-1 alpha-2 format](https://wikipedia.org/wiki/ISO_3166-1_alpha-2)
