---
layout: post
title: Page has unsuccessful HTTP status code
description: |
  Learn about the "Page has unsuccessful HTTP status code" Lighthouse audit.
web_lighthouse:
  - http-status-code
---

Search engines may not properly index pages that return unsuccessful HTTP status
codes. HTTP status codes in the 400s and 500s
[are defined as errors](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status),
so Lighthouse flags them:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="http-status-code.png" alt="Lighthouse audit showing search engines are struggling to index your page">
</figure>

{% include 'content/lighthouse-seo/scoring.njk' %}

## How to ensure that search engines can index your page

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

## More information

[**Page has unsuccessful HTTP status code** audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/http-status-code.js)
