---
layout: post
title: Remove code that blocks search engine indexing
authors:
  - ekharvey
date: 2018-11-05
description: |
  Search engines can only show pages in their search results if those pages are
  not explicitly blocking indexing. Don't block indexing for content that you
  want to show up in search results.
web_lighthouse:
  - is-crawlable
---

## Why does this matter?

Search engines can only show pages in their search results if those pages are
not explicitly blocking indexing. Don't block indexing for content that you want
to show up in search results.

## Measure

Lighthouse displays the following failed audit if search engines can't index
your page: "Page is blocked from indexing".

## Determine if you actually want search engines to index this page

Some HTTP headers and meta tags tell crawlers that this page shouldn't be
indexed. That means search engines don't index the page, and therefore don't
surface this page in search results. This makes sense for some pages, like
[sitemaps](https://support.google.com/webmasters/answer/156184?hl=en&ref_topic=4581190),
legal content, or other things that you don't want to show up in search results.
Keep in mind that blocking indexing doesn't prevent normal users from accessing
the page, should they know its URL. Use server-side authentication for any
private or confidential content on your website.

## Remove tags applicable to your site setup

Depending on how you set up your site, you might not need to do all of the steps
below:

- Remove the `X-Robots-Tag` HTTP response header if you set up a HTTP
    response header:

```
X-Robots-Tag: noindex
```

- Remove the following meta tag if it's present in the head of the page:

```html
<meta name="robots" content="noindex">
```

- Remove meta tags that block specific crawlers if these tags are present in the
  head of the page, such as:

```html
<meta name="Googlebot" content="noindex">
```

## Add additional control (optional step)

If you want more control over how search engines index your page (for example,
maybe you don't want Google to index images, but the rest of the page should be
indexed), see the following guidelines that are specific to each search
engine:

+  [Google Search](https://developers.google.com/search/reference/robots_meta_tag)
+  [Bing](https://www.bing.com/webmaster/help/which-robots-metatags-does-bing-support-5198d240)
+  [Yandex](https://yandex.com/support/webmaster/controlling-robot/html.html)

## Verify

Run the Lighthouse SEO Audit (**Lighthouse > Options > SEO**) and look for the
results of the audit **Page is blocked from indexing**.
