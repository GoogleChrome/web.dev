---
layout: post
title: "`[role]`s do not have all required `[aria-*]` attributes"
description: |
  Learn how to improve your web page's accessibility for assistive technology
  users by making sure that all elements with ARIA roles have the required ARIA
  attributes.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - aria-required-attr
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

Some ARIA roles have required `aria-*` attributes
that provide essential information about state and functionality.
For example, the `option` role requires the `aria-selected` attribute.
If ARIA roles don't have the required attributes,
assistive technology users won't be able to successfully interact with them.

## How Lighthouse identifies missing required states and properties

<a href="https://developers.google.com/web/tools/lighthouse" rel="noopener">Lighthouse</a>
flags ARIA roles that don't have the required states and properties:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/EF8Fjn4V8r1rR6JoZtIc.png", alt="Lighthouse audit showing ARIA role missing required states and properties", width="800", height="185", class="w-screenshot" %}
</figure>

Lighthouse uses the
<a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">role definitions from the WAI-ARIA specification</a>
to check for a role's required attributes.
A page fails this audit
when it contains a role that's missing its required states or properties.

A missing required attribute won't break the element's role.
In the example above,
the element is still announced as a heading and assigned a default level of `2`.
However, this issue is still important to fix and
probably indicates a mistaken assumption in your code.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add missing states and properties to ARIA roles

Refer to the
<a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">WAI-ARIA role definitions</a>
to see what states and properties are required for the roles on your page.

Since properties don't change, you can simply add them to the elements
that Lighthouse flagged.

States, however, do change as the user interacts with your page,
so you'll need to add JavaScript to change the state value
when the relevant event occurs.
For example, an `option` role's `aria-selected` state should toggle
between `true` and `false` when the user clicks the element or
presses `Enter` or `Space` when the element is focused.

## Resources

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-required-attr.js" rel="noopener">Source code for **`[role]`s do not have all required `[aria-*]` attributes** audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/aria-required-attr" rel="noopener">Required ARIA attributes must be provided (Deque University)</a>
- <a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">Role definitions from the WAI-ARIA specification</a>
