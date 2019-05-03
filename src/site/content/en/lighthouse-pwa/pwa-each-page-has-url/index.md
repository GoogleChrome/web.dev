---
layout: post
title: Each page has a URL
description: |
  Learn about `pwa-each-page-has-url` audit.
web_lighthouse:
  - pwa-each-page-has-url
---

Ensure individual pages are deep linkable via the URLs and that URLs are unique
for the purpose of shareability on social media.

## Recommendations

- Test individual pages can be opened and directly accessed via new browser windows.
- If building a single-page app,
make sure the client-side router can re-construct app state from a given URL.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## More information

[Each page doesn't have a URL audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/manual/pwa-each-page-has-url.js)