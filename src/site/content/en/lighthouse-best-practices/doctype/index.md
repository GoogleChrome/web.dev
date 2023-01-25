---
layout: post
title: Page lacks the HTML doctype, thus triggering quirks mode
description: |
  Learn how to make sure your page doesn't trigger quirks mode in older
  browsers.
web_lighthouse:
  - doctype
date: 2019-05-02
updated: 2019-08-28
---

Specifying a doctype prevents the browser from switching to
[quirks mode](https://developer.mozilla.org/en-US/docs/Web/HTML/Quirks_Mode_and_Standards_Mode),
which can cause your page to render in unexpected ways.

## How the Lighthouse doctype audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags pages without the `<!DOCTYPE html>` declaration:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/l6IEjHdtgCa45QimENjb.png", alt="Lighthouse audit showing missing doctype", width="800", height="76", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## How to add a doctype declaration

Add the `<!DOCTYPE html>` declaration to the top of your HTML document:

```html
<!DOCTYPE html>
<html lang="en">
…
```

See MDN's [Doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype)
page for more information.

## Resources

- [Source code for **Page lacks the HTML doctype, thus triggering quirks mode** audit](https://github.com/GoogleChrome/lighthouse/blob/ecd10efc8230f6f772e672cd4b05e8fbc8a3112d/lighthouse-core/audits/dobetterweb/doctype.js)
- [Doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype)
- [Quirks Mode and Standards Mode](https://developer.mozilla.org/en-US/docs/Web/HTML/Quirks_Mode_and_Standards_Mode)
