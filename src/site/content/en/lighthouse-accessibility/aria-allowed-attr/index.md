---
layout: post
title: "[aria-*] attributes do not match their roles"
description: |
  Learn how to improve your web page's accessibility for screen reader users by
  making sure that all elements with ARIA roles have appropriate ARIA
  attributes.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - aria-allowed-attr
---

[ARIA](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
roles and attributes help screen readers
provide missing information about an element.
For these roles and attributes to make sense,
each ARIA `role` supports a specific subset of `aria-*` attributes
(see [ARIA roles definitions](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)).

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

## How Lighthouse identifies ARIA mismatches

Lighthouse flags mismatches between ARIA roles and `aria-*` attributes:

<figure class="w-figure">
  <img class="w-screenshot" src="aria-allowed-attr.png" alt="Lighthouse audit showing ARIA attributes do not match their roles">
</figure>

Lighthouse uses the
[WAI ARIA specification: Definition of Roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
to check for mismatches between ARIA roles and attributes.
Each role has a subset of "supported states and properties" and
"inherited states and properties".
Any element with that role
can only use the attributes in the role's definition.

Lighthouse fails this audit
when it finds an attribute that isn't allowed for a role on an element.
In the example Lighthouse audit above,
the `aria-checked` attribute is not allowed on an element with the `list` role,
so the audit fails.
This makes sense—as list elements wouldn't have a state of checked,
so applying a checked state would be confusing to screen reader users.

A disallowed attribute won't break an element's role.
In the example above, the element is still announced as a list, and
the browser ignores the `aria-checked` attribute.
However, this issue is still important to fix
and probably indicates a mistaken assumption in your code.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to avoid ARIA mismatches

Refer to the [WAI ARIA Definition of roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions).
ARIA explicitly defines which attributes are allowed for any given role and for every attribute.
Link to the role from the specification,
and check the attributes allowed.
So long as an attribute is listed for that role,
you can use it.

For more information on this audit,
see [Elements must only use allowed ARIA attributes](https://dequeuniversity.com/rules/axe/3.1/aria-allowed-attr).

## Resources

- [Source code for **`[aria-*]` attributes do not match their roles** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-allowed-attr.js)
- [Elements must only use allowed ARIA attributes](https://dequeuniversity.com/rules/axe/3.3/aria-allowed-attr)
