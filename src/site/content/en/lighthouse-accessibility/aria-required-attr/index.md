---
layout: post
title: "`[role]`s do not have all required `[aria-*]` attributes"
description: |
  Learn how to improve your web page's accessibility for screen reader users by
  making sure that all elements with ARIA roles have the required ARIA
  attributes.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - aria-required-attr
---

[ARIA](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
roles and attributes help screen readers
provide missing information about an element.
For these roles and attributes to make sense,
each ARIA `role` supports a specific subset of `aria-*` attributes
(see [ARIA roles definitions](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)).
Some ARIA roles have required attributes that describe the state of the element to screen readers.

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

## How Lighthouse identifies missing required states and properties

Lighthouse flags ARIA roles that don't have the required states and properties:

<figure class="w-figure">
  <img class="w-screenshot" src="aria-required-attr.png" alt="Lighthouse audit showing ARIA role missing required states and properties">
</figure>

Lighthouse uses the
[WAI ARIA specification: Definition of Roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
to check for a role's required attributes.
Any role that contains "required states and properties",
must have the required state and property defined.
Lighthouse fails this audit,
when it finds a role is missing it's required state and property.

A missing required attribute won't break the element's role.
In the example above,
the element is still announced as a heading and assigned a default level of `2`.
However, this issue is still important to fix and
probably indicates a mistaken assumption in your code.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to check that roles have all required states and properties

Refer to the [WAI ARIA Definition of roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions).
Link to the role from the specification,
and check the required states and properties.

Add the missing ARIA state or property to the given element.

For more information on this audit,
see [Required ARIA attributes must be provided](https://dequeuniversity.com/rules/axe/3.1/aria-required-attr).

## Resources

- [Source code for **`[role]`s do not have all required `[aria-*]` attributes** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-required-attr.js)
- [Required ARIA attributes must be provided](https://dequeuniversity.com/rules/axe/3.3/aria-required-attr)
