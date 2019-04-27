---
layout: post
title: Ensure ARIA role values are valid.
description: |
  Learn about aria-roles audit.
author: megginkearney
web_lighthouse:
  - aria-roles
---

[ARIA](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
roles and attributes help screen readers
provide missing information about an element.
For these roles and attributes to make sense,
each ARIA `role` supports a specific subset of `aria-*` attributes
(see [ARIA roles definitions](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)).
ARIA roles must have valid values in order
to perform their intended accessibility functions.
Lighthouse reports when a role has invalid values:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="aria-roles.png" alt="Lighthouse: ARIA role has invalid values">
  <figcaption class="w-figcaption">
    Fig. 1 — ARIA role has invalid values
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

## How Lighthouse determines role has invalid values

Lighthouse uses the
[WAI ARIA specification - Definition of roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
to check a role's values.
Lighthouse fails this audit,
when it finds a role with invalid values.
In the example Lighthouse audit above,
`buton` isn't a valid role value.
Looks like a spelling mistake.

## How this audit impacts overall Lighthouse score

Todo. I have no idea how accessibility scoring is working!

## How to check for invalid values

To check for invalid values,
refer to the [WAI ARIA Definition of roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions).
ARIA explicitly defines role values.
If you set `role=` to any value not appearing in the defintions list,
the audit will fail.

For more information on this audit,
see [ARIA roles used must conform to valid values](https://dequeuniversity.com/rules/axe/3.1/aria-roles?application=lighthouse).

## More information

- [ARIA role values are vailid audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-roles.js)
- [axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [List of axe 3.2 rules](https://dequeuniversity.com/rules/axe/3.2)