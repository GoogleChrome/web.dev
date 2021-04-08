---
layout: post
title: "`[aria-*]` attributes do not match their roles"
description: |
  Learn how to improve your web page's accessibility for assistive technology
  users by making sure that all elements with ARIA roles have appropriate ARIA
  attributes.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - aria-allowed-attr
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

Each ARIA `role` supports a specific subset of `aria-*` attributes.
Applying an attribute to a role that doesn't support it generally won't
break the role, but it should still be fixed.

## How Lighthouse identifies ARIA mismatches

<a href="https://developers.google.com/web/tools/lighthouse" rel="noopener">Lighthouse</a>
flags mismatches between ARIA roles and `aria-*` attributes:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cvvXT1n2vOJrdhotI58T.png", alt="Lighthouse audit showing an ARIA list role with an unsupported checked attribute", width="800", height="206", class="w-screenshot" %}
</figure>

Lighthouse uses the
<a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">role definitions from the WAI-ARIA specification</a>
to check for mismatches between ARIA roles and attributes.
Each role has a set of states and properties (that is, _attributes_)
that it can support or inherit.
A page fails this audit
when it contains an element with an ARIA role and an ARIA attribute
that isn't supported for that role.

In the example shown in the screenshot,
the `aria-checked` attribute is not allowed on an element with the `list` role.
This makes sense: list elements can't be checked or unchecked.

An unsupported attribute generally won't break an element's role.
In the example above, the element is still announced as a list, and
the browser ignores the `aria-checked` attribute.
However, this issue is still important to fix
and probably indicates a mistaken assumption in your code.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to avoid ARIA mismatches

Refer to the
<a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">WAI-ARIA role definitions</a>.
ARIA explicitly defines which attributes are allowed for each role.
As long as an attribute is listed for the role you're using,
you can apply it.

## Resources

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-allowed-attr.js" rel="noopener">Source code for <strong><code>[aria-*]</code> attributes do not match their roles</strong> audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/aria-allowed-attr" rel="noopener">Elements must only use allowed ARIA attributes (Deque University)</a>
- <a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">Role definitions from the WAI-ARIA specification</a>
