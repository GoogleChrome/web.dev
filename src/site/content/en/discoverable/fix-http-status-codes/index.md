---
layout: post
title: Fix unsuccessful HTTP status codes
authors:
  - ekharvey
date: 2018-11-05
description: |
  HTTP status codes indicate the response given by a server for a request to a
  URL. 4XX status codes signal to search engines that a page does not provide
  any content.
codelabs:
  - codelab-fix-sneaky-404
---

## Why does this matter?

HTTP status codes indicate the response given by a server for a request to a
URL. `4XX` status codes signal to search engines that a page does not provide
any content. For example, `404` indicates the page not found; `403` indicates
the content is restricted. In both cases, search engines assume there's nothing
to show in search results, and may not index the page.

## Measure

Lighthouse displays the following failed audit if search engines have trouble
indexing your page: **Page has unsuccessful HTTP status code**.

## Determine if you actually want search engines to crawl this page

Some HTTP status codes tell crawlers that a page isn't available. That means
search engines won't index the page and therefore won't include it in search
results. This makes sense for any URLs that show errors, or which don't exist on
your website.

## Fix the error on your server

To fix the error, refer to the documentation for your specific server or hosting
provider to make sure that your server returns a `2XX` HTTP status code for all
valid URLs, or a `3XX` status code if the page has moved to another URL.

{% Aside 'codelab' %}
[Learn how to fix 404's in an express.js application](/codelab-fix-sneaky-404).
{% endAside %}

## Verify

Run the Lighthouse SEO Audit (**Lighthouse > Options > SEO**) and look for the
results of the audit **Page has unsuccessful HTTP status code**.
