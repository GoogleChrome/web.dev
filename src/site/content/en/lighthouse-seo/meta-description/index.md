---
layout: post
title: Document does not have a meta description
description: |
  Learn about the "Document does not have a meta description" Lighthouse audit.
web_lighthouse:
  - meta-description
---

The meta description provides a summary of a page's content that search engines
include in search results. A high-quality, unique description makes your page
appear more relevant and can increase your search traffic.

Lighthouse flags pages without a meta description:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="meta-description.png" alt="Lighthouse audit showing the document doesn't have a meta description">
</figure>

## How this audit fails

This audit fails if your page doesn't have a `<meta name=description>` element,
or if the `content` attribute is empty.
Lighthouse doesn't evaluate the quality of your description.

{% include 'content/lighthouse-seo/scoring.njk' %}

## How to add a meta description

Add a `<meta name=description>` element to the `<head>` of each of your pages:

```html
<meta name="Description" content="Put your description here.">
```

If appropriate, include clearly tagged facts in the descriptions. For example:

```html
<meta name="Description" content="Author: A.N. Author,
    Illustrator: P. Picture, Category: Books, Price: $17.99,
    Length: 784 pages">
```

See the [Write descriptive titles, descriptions, and link text](/write-descriptive-text#add-tags-to-the-head-of-the-page)
post for more information.

## Meta description guidelines

- Make descriptions clear and concise.
- Avoid [keyword stuffing](https://support.google.com/webmasters/answer/66358).
- Avoid repeated or boilerplate titles.
- Use a unique description for each page.
- Descriptions don't have to be in sentence format; they can contain structured data.

See Google's [Create good titles and snippets in Search Results](https://support.google.com/webmasters/answer/35624#1)
page for more guidance.

## More information

[**Document does not have a meta description** audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/meta-description.js)
