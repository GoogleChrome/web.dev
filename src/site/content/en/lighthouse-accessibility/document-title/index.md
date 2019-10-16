---
layout: post
title: Document doesn't have a `<title>` element
description: |
  Learn about the "Document doesn't have a <title> element"
  Lighthouse audit.
date: 2019-05-02
updated: 2019-08-21
web_lighthouse:
  - document-title
---

Having a `<title>` element on every page helps all your users:

- Search engine users rely on the title to determine whether a page is
relevant to their search.
- The title also gives users of screen readers and other assistive technologies
  an overview of the page. The title is the first text
  that an assistive technology announces.

## How the Lighthouse title audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags pages
without a `<title>` element in the page's `<head>`:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot" src="document-title.png" alt="Lighthouse audit showing HTML document doesn't have a title elemement">
</figure>

## How to add a title

Add a `<title>` element to the `<head>` of your page. Make sure the title
clearly states what the page is about. For example:

```html
<!doctype html>
  <html lang="en">
    <head>
      …
      <title>20-week training schedule for your first marathon</title>
      …
    </head>
  <body>
    …
  </body>
</html>
```

## Tips for creating great titles

- Use a unique title for each page.
- Make titles descriptive and concise. Avoid vague titles like "Home."
- Avoid [keyword stuffing](https://support.google.com/webmasters/answer/66358).
  It doesn't help users, and search engines may mark the page as spam.
- It's OK to brand your titles, but do so concisely.

Here are examples of good and bad titles:

```html
<title>Donut recipe</title>
```

{% Compare 'worse', 'Don\'t' %}
Too vague.
{% endCompare %}

```html
<title>Mary's quick maple bacon donut recipe</title>
```

{% Compare 'better', 'Do' %}
Descriptive yet concise.
{% endCompare %}

See Google's [Create good titles and snippets in Search Results](https://support.google.com/webmasters/answer/35624)
page for more details about these tips.

## Resources

- [Source code for **Document has a `<title>` element** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/document-title.js)
- [Create good titles and snippets in Search Results](https://support.google.com/webmasters/answer/35624)
- [Documents must contain a title element to aid in navigation (Deque University)](https://dequeuniversity.com/rules/axe/3.2/document-title)
- [Irrelevant keywords](https://support.google.com/webmasters/answer/66358)
- [Label documents and frames](/labels-and-text-alternatives#label-documents-and-frames)
