---
layout: post
title: Page has unsuccessful HTTP status code
description: |
  Learn about http-status-code audit.
web_lighthouse:
  - http-status-code
---

Search engines may not properly index pages
that return unsuccessful HTTP status codes.
Lighthouse considers any HTTP status code between 400 and 599 (inclusive)
to be unsuccessful and flags them in the report:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="http-status-code.png" alt="Lighthouse audit showing search engines are struggling to index your page">
  <figcaption class="w-figcaption">
    Fig. 1 — Search engines struggling to index your page
  </figcaption>
</figure>

## How to ensure search engines can index your page

When a page is requested,
ensure that your server returns a 2XX or 3XX HTTP status code.
Search engines may not properly index pages with 4XX or 5XX status codes.
Learn more in [Fix unsuccessful HTTP status codes](/fix-http-status-codes).

<div class="w-codelabs-callout">
  <div class="w-codelabs-callout__header">
    <h2 class="w-codelabs-callout__lockup">Codelabs</h2>
    <div class="w-codelabs-callout__headline">See it in action</div>
    <div class="w-codelabs-callout__blurb">
      Learn more and put this guide into action.
    </div>
  </div>
  <ul class="w-unstyled-list w-codelabs-callout__list">
    <li class="w-codelabs-callout__listitem">
      <a class="w-codelabs-callout__link" href="/codelab-fix-sneaky-404">
        Fix sneaky 404s
      </a>
    </li>
  </ul>
</div>

{% include 'content/lighthouse-seo/scoring.njk' %}

## More information

[Search engines struggling to index your page audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/http-status-code.js)