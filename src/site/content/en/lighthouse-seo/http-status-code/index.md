---
layout: post
title: Page has unsuccessful HTTP status code
description: |
  Learn about http-status-code audit.
authors:
 - kaycebasques
 - megginkearney
web_lighthouse:
  - http-status-code
---

Search engines may not properly index pages that return unsuccessful HTTP status codes.

## Recommendations

When a page is requested, ensure that your server returns a 2XX or 3XX HTTP status code. Search
engines may not properly index pages with 4XX or 5XX status codes.

## More information {: #more-info }

Lighthouse considers any HTTP status code between 400 and 599 (inclusive) to be unsuccessful.

[Audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/http-status-code.js)