---
layout: post
title: Heading elements are not in a sequentially-descending order
description: |
  Learn how to make sure assistive technology users can easily navigate your
  web page by correctly structuring your heading elements.
date: 2019-10-17
updated: 2020-05-07
web_lighthouse:
  - heading-order
---

{% include 'content/lighthouse-accessibility/why-headings.njk' %}

## How the Lighthouse heading levels audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages whose headings skip one or more levels:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4dd4TvMxSF6tYJ0wGM64.png", alt="Lighthouse audit showing headings that skip levels", width="800", height="206", class="w-screenshot" %}
</figure>

For example, using an `<h1>` element for your page title
and then using `<h3>` elements for the page's main sections
will cause the audit to fail
because the `<h2>` level is skipped:

```html
<h1>Page title</h1>
  <h3>Section heading 1</h3>
  …
  <h3>Section heading 2</h3>
  …
```


{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix poorly structured headings

- Make all heading elements follow a logical, numerical order
  that reflects the structure of your content.
- Make sure your heading text clearly conveys the content
  in the associated section.

For example:

```html
<h1>Page title</h1>
<section>
  <h2>Section Heading</h2>
  …
    <h3>Sub-section Heading</h3>
</section>
```

One way to check your heading structure is to ask,
"If someone created an outline of my page using only the headings,
would it make sense?"

You can also use tools like Microsoft's
<a href="https://accessibilityinsights.io/" rel="noopener">Accessibility Insights extension</a>
to visualize your page structure and catch out-of-order heading elements.

{% Aside 'caution' %}
Less experienced developers sometimes skip heading levels
to achieve a desired visual style.
For example, they may use an `<h3>` element
because they feel the `<h2>` text is too large.
This is considered an **anti-pattern**.
Instead, use a correctly sequenced heading structure
and use CSS to visually style the headings as desired.
{% endAside %}

See the [Headings and landmarks](/headings-and-landmarks)
post for more information.

## Resources

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/heading-order.js" rel="noopener">Source code for **Headings skip levels** audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/heading-order" rel="noopener">Heading levels should only increase by one (Deque University)</a>
