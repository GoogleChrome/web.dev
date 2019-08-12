---
layout: post
title: Ensure that each HTML document has a <title> element
description: |
  Learn about the "Ensure that each HTML document has a <title> element"
  Lighthouse audit.
web_lighthouse:
  - document-title
---

Having a `<title>` element on every page helps all your users:

- Search engine users rely on the title to determine whether a page is
relevant to their search.
- The title also gives screen reader users an overview of the page. The title is
the first text that a screen reader announces.

Lighthouse flags pages without a title:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="document-title.png" alt="Lighthouse audit showing HTML document doesn't have a title elemement">
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

See the
[Write descriptive titles, descriptions, and link text for every page](/write-descriptive-text)
post and Deque University's [Documents must contain a title element to aid in navigation](https://dequeuniversity.com/rules/axe/3.2/document-title)
page for more information.


## Tips for creating great titles

- Make titles descriptive and concise. Avoid vague descriptions like "Home."
- Avoid [keyword stuffing](https://support.google.com/webmasters/answer/66358?hl=en): it's not helpful to users, and search engines may mark the page as spam.
- Avoid repeated or boilerplate titles.
- It's OK to brand your titles, but do it concisely.

See Google's [Create descriptive page titles](https://support.google.com/webmasters/answer/35624)
page for more details about these tips.

<!--
## How this audit impacts overall Lighthouse score

Todo. I have no idea how accessibility scoring is working!
-->
## More information

- [Label documents and frames](/labels-and-text-alternatives#label-documents-and-frames)
- [**Document has a `<title>` element** audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/document-title.js)
- [axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [List of axe 3.2 rules](https://dequeuniversity.com/rules/axe/3.2)
