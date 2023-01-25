---
layout: post
title: "`[aria-*]` attributes do not have valid values"
description: |
  Learn how to improve your web page's accessibility for assistive technology
  users by making sure that all ARIA attributes have valid values.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - aria-valid-attr-value
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

Each ARIA `role` supports a specific subset of `aria-*` attributes
that define the state and properties of that role.
For example, the `aria-selected` attribute indicates whether
an element is currently selected depending on whether its value
is `true` or `false`.

If an element's ARIA attribute doesn't have a valid value,
assistive technologies won't be able
to interact with it as the developer intended.

## How Lighthouse determines an ARIA attribute's value is invalid

<a href="https://developers.google.com/web/tools/lighthouse" rel="noopener">Lighthouse</a>
flags ARIA attributes with invalid values:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/d3U3jGziH67BYcWPa1T4.png", alt="Lighthouse audit showing aria-checked without the value 'true'", width="800", height="185", class="w-screenshot" %}
</figure>

Lighthouse uses the
<a href="https://www.w3.org/TR/wai-aria-1.1/#states_and_properties" rel="noopener">states and properties from the WAI-ARIA specification</a>
to check that all ARIA attributes have valid values.
A page fails this audit
when it contains an attributes with an invalid value.

In the example Lighthouse audit above,
`aria-checked` should be set to either `true`, `false`, or `mixed`.

{% Aside %}
Browsers treat HTML Boolean attributes, such as `hidden` or `checked`,
as true if they're present in an element's opening tag
and false if they're not.

However, ARIA attributes require an _explicit_ `true` or `false` value.
This is because most ARIA attributes actually support [a third state](https://www.w3.org/TR/wai-aria-1.1/#valuetype_true-false-undefined)—`undefined`—or a [tristate](https://www.w3.org/TR/wai-aria-1.1/#valuetype_tristate)
with an intermediate `mixed` value.
{% endAside %}

This issue is important to fix and
probably indicates a mistaken assumption in your code. In the example above, the
element is still announced as a checkbox, but it will have an implicit
state of `unchecked`, which may not be what's intended.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix invalid ARIA attribute values

Refer to the
<a href="https://www.w3.org/TR/wai-aria-1.1/#states_and_properties" rel="noopener">WAI-ARIA supported states and properties</a>
to see the full list of valid ARIA attribute values.
Check that you have correct values for any attributes you use.

Also verify that your JavaScript is updating ARIA state values
as users interact with your page.
For example, an `option` role's `aria-selected` state should toggle
between `true` and `false` when the user clicks the element or
presses `Enter` or `Space` when the element is focused.

## Resources

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-valid-attr-value.js" rel="noopener">Source code for **`[aria-*]` attributes do not have valid values** audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/aria-valid-attr-value" rel="noopener">ARIA attributes must conform to valid values (Deque University)</a>
- <a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">Role definitions from the WAI-ARIA specification</a>
