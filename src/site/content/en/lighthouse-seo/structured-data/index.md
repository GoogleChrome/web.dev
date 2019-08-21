---
layout: post
title: Structured data is valid
description: |
  Learn about the "Structured data is valid" Lighthouse audit.
updated: 2019-08-21
web_lighthouse:
  - structured-data
---

Run the [Structured Data Testing Tool](https://search.google.com/structured-data/testing-tool/) and the
[Structured Data Linter](http://linter.structured-data.org/)
to validate structured data.

{% Aside 'note' %}
This is a manual audit and does not affect the Lighthouse SEO score.
{% endAside %}

## Structured data guidelines

- Identify the [content type](https://developers.google.com/search/docs/guides/mark-up-content#content_types) that represents your content.
- Create the structured data markup using the [reference docs for that content type](https://developers.google.com/search/docs/guides/search-gallery).
- Insert the markup into each page you wish to make eligible to search engines.
- Test how the markup works in Google Search using the [Structured Data Testing Tool](https://search.google.com/structured-data/testing-tool/).

See Google's [Mark Up Your Content Items](https://developers.google.com/search/docs/guides/mark-up-content)
page for more information.

## Resources

- [Source code for **Structured data is valid** audit](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/seo/manual/structured-data.js)
- [Mark Up Your Content Items](https://developers.google.com/search/docs/guides/mark-up-content)
- [Structured Data Testing Tool](https://search.google.com/structured-data/testing-tool/)
- [Structured Data Linter](http://linter.structured-data.org/)
- [Google search gallery](https://developers.google.com/search/docs/guides/search-gallery)
