---
layout: post
title: "Elements with an ARIA [role] that require children to contain a specific [role] are missing some or all of those required children"
description: |
  Learn how to improve your web page's accessibility for screen reader users by
  making sure that all elements with ARIA roles have the required child
  elements.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - aria-required-children
---

[ARIA](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
roles and attributes help screen readers
provide missing information about an element.
For these roles and attributes to make sense,
each ARIA `role` supports a specific subset of `aria-*` attributes
(see [ARIA roles definitions](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)).
Some ARIA `roles` require child roles.

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

## How Lighthouse identifies missing child roles

Lighthouse flags ARIA roles that don't have the required child roles:

<figure class="w-figure">
  <img class="w-screenshot" src="aria-required-children.png" alt="Lighthouse audit showing ARIA role missing required child role(s)">
</figure>

Lighthouse uses the
[WAI ARIA specification: Definition of Roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
to check for required child roles.
Any role that contains "required owned elements",
is considered a parent role to the child role/s.

Lighthouse fails this audit
when it finds a parent role that's missing its required child role(s).
In the example Lighthouse audit above,
the `radiogroup` role requires a group of child elements with `radio` roles.
Since there are no children with a `radio` role defined,
the audit fails.
This makes sense,
as it would be confusing to have a radio group without any radio buttons.

This issue is important to fix and may break the experience for users.
In the example above, the element may still be announced as a list,
but the number of items in the list may be unclear.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to check for required child roles

Refer to the [WAI ARIA Definition of Roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions).
ARIA explicitly defines required child roles for parent roles.
Link to the parent role from the specification,
and check the required child roles.
Make sure to include a child role for that parent role.

For more information on this audit,
see [Elements must only use allowed ARIA attributes](https://dequeuniversity.com/rules/axe/3.3/aria-required-children).

## Resources

- [Source code for **Elements with an ARIA `[role]` that require children to contain a specific [role] are missing some or all of those required children** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-required-children.js)
- [axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
