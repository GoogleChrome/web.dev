---
layout: post
title: Charset declaration is missing or occurs too late in the HTML
description: |
  Learn how to [fix the problem identified by the audit].
web_lighthouse:
  - charset
date: 2020-05-01
---

Servers and browsers communicate with each other by sending bytes of data over the
internet. If the server doesn't specify which [character encoding format][format] it's
using when it sends an HTML file, the browser won't know what character each byte represents.
The [character encoding declaration](https://html.spec.whatwg.org/multipage/semantics.html#charset)
in the HTML spec solves this problem. 

## How the Lighthouse `charset` audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages that do not specify their character encoding:

<figure class="w-figure">
  <img class="w-screenshot" src="audit-slug.png" alt="Lighthouse audit showing [the problem]">
</figure>

Lighthouse considers the character encoding to be declared if it finds any of the following:

- A `<meta charset>` element in the `<head>` of the document that is completely
  contained in the first 1024 bytes of the document
- A `Content-Type` HTTP response header with a `charset` directive
- A [byte-order mark](https://www.w3.org/International/questions/qa-byte-order-mark) (BOM)

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## How to pass the `charset` audit

### Add a `<meta chartset>` element to your HTML {: #html }

Add a `<meta charset>` element within the first 1024 bytes of your HTML document.
The best practice is to make the `<meta charset>` element the first element in the
`<head>` of your document.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
```

### Add a `Content-Type` HTTP response header {: #http }


Brief explanation of the most common way(s) to fix the issue causing the audit
to fail. Explanation should include:
- Code sample(s) when appropriate
- Links to further information if a full understanding of the issue requires
  more text than is appropriate for a post focused on resolving a failed audit

When a fix involves multiple steps, provide a codelab instead of sample code.

### Add a byte-order mark {: #BOM }

https://www.w3.org/International/questions/qa-byte-order-mark

## Resources
<!--
  Include all links from the post that are immediately relevant to the audit,
  along with any further reading that may be useful. The source code for the
  audit always comes first. If there are no links other than the source code,
  present it as a paragraph rather than an unordered list.
-->
- [Charset declaration is missing or occurs too late in the HTML](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/charset.js)
- [Link to another resource](#)


[format]: https://en.wikipedia.org/wiki/Character_encoding