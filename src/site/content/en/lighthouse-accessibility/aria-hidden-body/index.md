---
layout: post
title: "`[aria-hidden=\"true\"]` is present on the document `<body>`"
description: |
  Learn how to make sure your web page is accessible to assistive technology
  users by avoiding the aria-hidden attribute on the body element.
date: 2019-10-17
web_lighthouse:
  - aria-hidden-body
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

Screen readers and other assistive technologies don't announce content that's
marked as hidden. Applying the `aria-hidden="true"` attribute to your `<body>`
element hides your entire web page from assistive technology users.

## How Lighthouse identifies hidden body elements

<a href="https://developers.google.com/web/tools/lighthouse" rel="noopener">Lighthouse</a>
flags pages whose `<body>` element has an `aria-hidden="true"` attribute:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/enyVVcLr73lIw7qMyndR.png", alt="Lighthouse audit showing that a page's body element has the aria-hidden attribute", width="800", height="206", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to make your page accessible to assistive technology users

Remove the `aria-hidden="true"` attribute
from the `<body>` element of your page.

One reason developers mistakenly hide the body element is to prevent assistive
technologies from announcing the main content of a page while a
[modal dialog](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal) is open.
However, hiding the body hides _all_ page content from assistive technology users,
including the dialog.

A better solution is to apply the `aria-hidden` attribute
to a lower-level container element while the dialog is open.
For example, this sample hides the `<main>` element,
which precedes the dialog in the HTML:

```html/6
<!DOCTYPE html>
<html lang="en">
  <head>
    …
  </head>
  <body>
    <main aria-hidden="true">
      <h1>Page title</h1>
      <p>Main page content</p>
    </main>
    <div class="dialog" role="dialog" aria-modal="true" aria-label="Sample dialog">
      <p>Sample dialog content</p>
      <button>Close dialog</button>
    </div>
  </body>
</html>
```

## Resources

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-hidden-body.js" rel="noopener">Source code for **`[aria-hidden="true"]` is present on the document `<body>`** audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/aria-hidden-body" rel="noopener">aria-hidden="true" must not be present on the document &#60;body&#62; (Deque University)</a>
