---
layout: post
title: Charset declaration is missing or occurs too late in the HTML
description: |
  Learn how to add a character encoding declaration to your HTML.
web_lighthouse:
  - charset
date: 2020-05-05
---

Servers and browsers communicate with each other by sending bytes of data over the
internet. If the server doesn't specify which [character encoding format][format] it's
using when it sends an HTML file, the browser won't know what character each byte represents.
The [character encoding declaration](https://html.spec.whatwg.org/multipage/semantics.html#charset)
specification solves this problem. 

{% Aside %}
  Theoretically, a late `<meta charset>` element (one that is not fully contained in
  the first 1024 bytes of the document) can also significantly affect load performance.
  See [Issue #10023](https://github.com/GoogleChrome/lighthouse/issues/10023#issuecomment-575129051).
{% endAside %}

## How the Lighthouse `charset` audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages that do not specify their character encoding:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/IERR919vogl1HyYwxvVZ.png", alt="The failing character encoding audit.", width="800", height="110", class="w-screenshot" %}
</figure>

Lighthouse considers the character encoding to be declared if it finds any of the following:

- A `<meta charset>` element in the `<head>` of the document that is completely
  contained in the first 1024 bytes of the document
- A `Content-Type` HTTP response header with a `charset` directive that matches a
  [valid IANA name][iana]
- A [byte-order mark](https://www.w3.org/International/questions/qa-byte-order-mark) (BOM)

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## How to pass the `charset` audit

### Add a `<meta charset>` element to your HTML {: #html }

Add a `<meta charset>` element within the first 1024 bytes of your HTML document.
The element must be fully contained within the first 1024 bytes.
The best practice is to make the `<meta charset>` element the first element in the
`<head>` of your document.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    …
```

### Add a `Content-Type` HTTP response header {: #http }

Configure your server to add a [`Content-Type`][type]
HTTP response header that includes a `charset` directive.

```http
Content-Type: text/html; charset=UTF-8
```

## Resources

- [Charset declaration is missing or occurs too late in the HTML](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/charset.js)
- [Example page that fails the audit](https://charset.glitch.me/)
  ([source](https://glitch.com/edit/#!/charset))
- [Character encoding][format]
- [`Content-Type`][type]
- [IANA character set names][iana]

[format]: https://en.wikipedia.org/wiki/Character_encoding
[type]: https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Type
[iana]: https://www.iana.org/assignments/character-sets/character-sets.xhtml
