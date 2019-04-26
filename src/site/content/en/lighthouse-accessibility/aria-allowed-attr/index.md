---
layout: post
title: Ensure ARIA attributes are allowed for an element's role
description: |
  Learn about aria-allowed-attr audit.
author: megginkearney
web_lighthouse:
  - aria-allowed-attr
---

[ARIA](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
roles and attributes help screen readers
provide missing information about an element.
For these roles and attributles to make sense,
each ARIA `role` supports a specific subset of `aria-*` attributes
(see [ARIA roles definitions](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)).
Lighthouse reports any mismatches between roles and `aria-*` attributes:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="aria-allowed-attr.png" alt="Lighthouse: ARIA attributes do not match their roles">
  <figcaption class="w-figcaption">
    Fig. 1 — ARIA attributes do not match their roles
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

## How Lighthouse finds ARIA mismatches

Lighthouse uses the
[WAI ARIA specification - Definition of roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
to check for mismatches between ARIA roles and attributes.
Each role has a subset of "supported states and properties" and
"inherited states and properties".
Any element with that role
can only use the attributes in the role's definition.

Lighthouse fails this audit,
when it finds an attribute that isn't allowed for a role on an elememnt.
In the example Lighthouse audit above,
the `aria-checked` attribute is not allowed on the `role=list`,
so the audit fails.
This makes sense--
as list elements wouldn't have a state of checked,
so applying a checked state would be confusing to screen reader users.

## How this audit impacts overall Lighthouse score

Lighthouse will flag this as a low severity issue.
It is important to fix,
and probably indicates a mistaken assumption in your code,
but a disallowed attribute will not break the element's role.
In the example above, the element would still be announced as a list and
the `aria-checked` attribute would be ignored.

## How to avoid ARIA mismatches

To avoid ARIA mismatches,
refer to the [WAI ARIA Definition of roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions).
ARIA explicitly defines which attributes are allowed for any given role and for every attribute.
Link to the role from the specification,
and check the attributes allowed.
So long as an attribute is listed for that role,
you can use it.

For more information on this audit,
see [Elements must only use allowed ARIA attributes](https://dequeuniversity.com/rules/axe/3.1/aria-allowed-attr?application=lighthouse).

## More information

- [ARIA attributes match their roles audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-allowed-attr.js)
- [axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [List of axe 3.2 rules](https://dequeuniversity.com/rules/axe/3.2)