---
layout: post
title: "`[aria-*]` attributes are not valid or misspelled"
description: |
  Learn how to improve your web page's accessibility for screen reader users by
  making sure that all ARIA attributes are valid.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - aria-valid-attr
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

Each ARIA `role` supports a specific subset of `aria-*` attributes.
Assistive technologies, like screen readers,
can't interpret ARIA attributes with invalid names.

## How Lighthouse checks for invalid attributes

Lighthouse flags invalid ARIA attributes:

<figure class="w-figure">
  <img class="w-screenshot" src="aria-valid-attr.png" alt="Lighthouse audit showing ARIA attribute has invalid value">
</figure>

Lighthouse uses the
[WAI ARIA specification: Definition of Roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
to check accepted values for roles and attributes.

Lighthouse fails this audit,
when it finds an attribute with an invalid value.
In the example Lighthouse audit above,
the `aria-checked` attribute is undefined,
when it should be either `true` or `false`.
The audit fails since the attribute has an invalid value.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to check that attributes are valid

Refer to the [WAI ARIA Definition of Roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions).
Check the role definition that the attribute describes,
and then check the values for that attribute.

For more information on this audit,
see [ARIA attributes must conform to valid values](https://dequeuniversity.com/rules/axe/3.3/aria-valid-attr-value).

## Resources

- [Source code for **`[aria-*]` attributes are not valid or misspelled** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-valid-attr.js)
- [ARIA attributes must conform to valid names](https://dequeuniversity.com/rules/axe/3.3/aria-valid-attr)
