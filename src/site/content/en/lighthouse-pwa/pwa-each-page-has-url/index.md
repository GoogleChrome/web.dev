---
layout: post
title: Each page has a URL
description: |
  Learn about the Lighthouse "Each page has a URL" audit.
web_lighthouse:
  - pwa-each-page-has-url
date: 2019-05-04
updated: 2019-09-19
---

Ensure individual pages and views in your
[Progressive Web App (PWA)](/discover-installable)
are deep linkable via URL and that each URL is unique
to make them easily shareable on social media.

## Recommendations

- Test that individual pages and views can be opened and
  directly accessed via new browser windows.
- If building a single-page app,
  make sure the client-side router can reconstruct the app state from a given URL.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## Resources

[Source code for **Each page has a URL** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/manual/pwa-each-page-has-url.js)
