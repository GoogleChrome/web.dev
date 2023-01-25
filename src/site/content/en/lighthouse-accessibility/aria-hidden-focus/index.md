---
layout: post
title: "`[aria-hidden=\"true\"]` elements contain focusable descendants"
description: |
  Learn how to make sure assistive technology users can't navigate to
  focusable elements that are supposed to be hidden.
date: 2019-10-17
web_lighthouse:
  - aria-hidden-focus
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

Using the `aria-hidden="true"` attribute on an element hides the element
and all its children from screen readers and other assistive technologies.
If the hidden element contains a **focusable** element,
assistive technologies won't read the focusable element,
but keyboard users will still be able to navigate to it,
which can cause confusion.

## How Lighthouse identifies partially hidden focusable elements

<a href="https://developers.google.com/web/tools/lighthouse" rel="noopener">Lighthouse</a>
flags focusable elements that have parents with the `aria-hidden="true"` attribute:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uqhdHogcBrLR4W0uiECZ.png", alt="Lighthouse audit showing focusable elements that have parents with the aria-hidden attribute", width="800", height="206", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-accessibility/focusable-els.njk' %}

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix partially hidden focusable elements

If you're hiding a container element on your page using `aria-hidden`,
you also need to prevent users from navigating to any focusable elements
inside that container.

One way to do that is to use JavaScript to apply a `tabindex="-1"` attribute
to all focusable elements in the container.
However, as implied by the list above,
a query that captures all focusable elements can get complicated quickly.

If you're hiding the container element from sighted users,
consider using one of the following strategies instead:
- Add a `hidden` attribute to the container element.
- Apply the `display: none` or the `visibility: hidden` CSS property
  to the container element.

If you can't visually hide the container element—for example,
if it's behind a modal dialog with a translucent background—consider
using <a href="https://github.com/WICG/inert" rel="noopener">the WICG's `inert` polyfill</a>.
The polyfill emulates the behavior of a proposed `inert` attribute,
which prevents elements from being read or selected.

{% Aside 'caution' %}
The `inert` polyfill is experimental and may not work as expected in all cases.
Test carefully before using in production.
{% endAside %}

## Resources

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-hidden-focus.js" rel="noopener">Source code for **`[aria-hidden="true"]` elements contain focusable descendants** audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/aria-hidden-focus" rel="noopener">aria-hidden elements do not contain focusable elements (Deque University)</a>
- <a href="https://github.com/WICG/inert" rel="noopener">WICG `inert` polyfill</a>
