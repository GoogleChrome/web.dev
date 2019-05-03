---
layout: post
title: Manually check structured data is valid
description: |
  Learn about structured-data audit.
web_lighthouse:
  - structured-data
---

Run the [Structured Data Testing Tool](https://search.google.com/structured-data/testing-tool/) and the
[Structured Data Linter](http://linter.structured-data.org/)
to validate structured data.

{% Aside 'note' %}
This is a manual audit and does not impact the overall Lighthouse SEO score.
{% endAside %}

## Structured data guidelines

1. Identify the [content type](https://developers.google.com/search/docs/guides/mark-up-content#content_types) that represents your content.
2. Create the structured data mark-up using the [reference docs for that content type](https://developers.google.com/search/docs/data-types/article).
3. Insert this mark-up into each page you wish to make eligible to search engines.
4. Test how the mark-up works in Google Search using the [Structured Data Testing Tool](https://search.google.com/structured-data/testing-tool/).

See [Mark Up Your Content Items](https://developers.google.com/search/docs/guides/mark-up-content#content_types).

## More information

- [Manually check structured data audit source](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/seo/manual/structured-data.js)