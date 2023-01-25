---
layout: post
title: Document does not have a meta description
description: |
  Learn about the "Document does not have a meta description" Lighthouse audit.
date: 2019-05-02
updated: 2021-04-08
web_lighthouse:
  - meta-description
---

The `<meta name="description">` element provides a summary of a page's content
that search engines include in search results. A high-quality, unique meta
description makes your page appear more relevant and can increase your search
traffic.

## How the Lighthouse meta description audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags pages
without a meta description:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dtMQ12xujHMJGuEwZ413.png", alt="Lighthouse audit showing the document doesn't have a meta description", width="800", height="74", class="w-screenshot w-screenshot" %}
</figure>

The audit fails if:
- Your page doesn't have a `<meta name=description>` element.
- The `content` attribute of the `<meta name=description>` element is empty.

Lighthouse doesn't evaluate the quality of your description.

{% include 'content/lighthouse-seo/scoring.njk' %}

## How to add a meta description

Add a `<meta name=description>` element to the `<head>` of each of your pages:

```html
<meta name="description" content="Put your description here.">
```

If appropriate, include clearly tagged facts in the descriptions. For example:

```html
<meta name="description" content="Author: A.N. Author,
    Illustrator: P. Picture, Category: Books, Price: $17.99,
    Length: 784 pages">
```

## Meta description best practices

- Use a unique description for each page.
- Make descriptions clear and concise. Avoid vague descriptions like "Home."
- Avoid [keyword stuffing](https://support.google.com/webmasters/answer/66358).
  It doesn't help users, and search engines may mark the page as spam.
- Descriptions don't have to be complete sentences; they can contain structured
  data.

Here are examples of good and bad descriptions:

{% Compare 'worse' %}
```html
<meta name="description" content="A donut recipe.">
```
{% CompareCaption %}
Too vague.
{% endCompareCaption %}
{% endCompare %}

{% Compare 'better' %}
```html
<meta
  name="description"           
  content="Mary's simple recipe for maple bacon donuts
           makes a sticky, sweet treat with just a hint
           of salt that you'll keep coming back for.">
```
{% CompareCaption %}
Descriptive yet concise.
{% endCompareCaption %}
{% endCompare %}

See Google's [Create good titles and snippets in Search Results](https://support.google.com/webmasters/answer/35624#1)
page for more tips.

## Resources

- [Source code for **Document does not have a meta description** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/meta-description.js)
- [Create good titles and snippets in Search Results](https://support.google.com/webmasters/answer/35624#1)
- [Irrelevant keywords](https://support.google.com/webmasters/answer/66358)
