---
layout: post
title: Structured data is valid
description: |
  Learn about the "Structured data is valid" Lighthouse audit.
date: 2019-05-02
updated: 2019-08-21
web_lighthouse:
  - structured-data
---

Search engines use structured data to understand what kind of content is on
your page. For example, you can tell search engines that your page is an
article, a job posting, or an FAQ.

Marking up your content with structured data makes it more likely that it will
be included in rich search results. For example, content marked up as an article
might appear in a list of top stories relevant to something the user searched
for.

{% Aside 'note' %}
The [Lighthouse](https://developers.google.com/web/tools/lighthouse/)
structured data audit is manual, so it does not affect your Lighthouse SEO
score.
{% endAside %}

## How to mark up your content

1. Identify the [content type](https://developers.google.com/search/docs/guides/mark-up-content#content_types)
   that represents your content.
1. Create the structured data markup using the [reference docs for that content type](https://developers.google.com/search/docs/guides/search-gallery).
1. Insert the markup into each page you wish to make eligible to search engines.
1. Run the
[Structured Data Linter](http://linter.structured-data.org/)
to validate your structured data.
1. Test how the markup works in Google Search using the [Structured Data Testing Tool](https://search.google.com/structured-data/testing-tool/).

See Google's [Mark Up Your Content Items](https://developers.google.com/search/docs/guides/mark-up-content)
page for more information.

## Resources

- [Source code for **Structured data is valid** audit](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/seo/manual/structured-data.js)
- [Mark Up Your Content Items](https://developers.google.com/search/docs/guides/mark-up-content)
- [Structured Data Testing Tool](https://search.google.com/structured-data/testing-tool/)
- [Structured Data Linter](http://linter.structured-data.org/)
- [Google search gallery](https://developers.google.com/search/docs/guides/search-gallery)
