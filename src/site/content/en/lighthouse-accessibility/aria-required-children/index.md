---
layout: post
title: Ensure parent roles contain required child role(s)
description: |
  Learn about aria-required-children audit.
author: megginkearney
web_lighthouse:
  - aria-required-children
---

[ARIA](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
roles and attributes help screen readers
provide missing information about an element.
For these roles and attributles to make sense,
each ARIA `role` supports a specific subset of `aria-*` attributes
(see [ARIA roles definitions](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)).
Some ARIA `roles` require child roles.
Lighthouse reports when a role is missing their required child role(s):

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="aria-required-children.png" alt="Lighthouse: ARIA role missing required child role(s)">
  <figcaption class="w-figcaption">
    Fig. 1 — ARIA role missing required child role(s)
  </figcaption>
</figure>

## About ARIA

The [Web Accessibility Initiative's Accessible Rich Internet Applications specification (WAI-ARIA, or just ARIA)](https://www.w3.org/TR/html-aria)
is good for bridging areas with accessibility issues that can't be managed with native HTML.
It works by allowing you to specify attributes that modify the way an element is translated into the accessibility tree. 

Using ARIA attributes,
you can give the element the missing information so the screen reader can properly interpret it.
In order for these attributes to be effective,
they need to make sense-- you wouldn't want a screen reader
to misinform a user.

For a brief intro, see the
[Introduction to ARIA](https://developers.google.com/web/fundamentals/accessibility/semantics-aria/).

## How Lighthouse finds missing child roles

Lighthouse uses the
[WAI ARIA specification - Definition of roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
to check for required child roles.
Any role that contains "required owned elements",
is considered a parent role to the child role/s.

Lighthouse fails this audit,
when it finds a parent role that's missing it's child role/s.
In the example Lighthouse audit above,
the `list` role requires a group of `listitem` roles.
Since there's no `listitem` role defined,
the audit fails.
This makes sense,
as it would be confusing to have a list without list items.

## How this audit impacts overall Lighthouse score

Todo. I have no idea how accessibility scoring is working!

## How to check for required child roles

To check for required child roles
refer to the [WAI ARIA Definition of roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions).
ARIA explicitly defines required child roles for parent roles.
Link to the parent role from the specification,
and check the required child roles.
Make sure to include a child role for that parent role.

For more information on this audit,
see [Elements must only use allowed ARIA attributes](https://dequeuniversity.com/rules/axe/3.2/aria-required-children).

## More information

- [axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [List of axe 3.2 rules](https://dequeuniversity.com/rules/axe/3.2)