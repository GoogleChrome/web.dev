---
layout: post
title: Ensure ARIA roles have required states and properties
description: |
  Learn about aria-required-attr audit.
author: megginkearney
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
Lighthouse reports a role's missing required states and properties:

***TODO*** talk to Rob about this one. I can't seem to get a failed audit.
From what I can tell is there's often defaults for required states and properties,
so the audit never fails, since there's something to fall back on.

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="" alt="Lighthouse: ARIA role missing required states and properties">
  <figcaption class="w-figcaption">
    Fig. 1 — ARIA role missing required states and properties
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

## How Lighthouse identifies missing required states and properties

Lighthouse uses the
[WAI ARIA specification - Definition of roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
to check for a role's required attributes.
Any role that contains "required states and properties",
must have the required state and property defined.

Lighthouse fails this audit,
when it finds a role is missing it's required state and property.
***TODO*** I can't seem to get this to work,
as there's defaults for most of these requirements.
Need to ask Rob for help to get an example.

## How this audit impacts overall Lighthouse score

Lighthouse will flag this as a low severity issue. It is important to fix, and
probably indicates a mistaken assumption in your code, but a missing required
attribute will not break the element's role. In the example above, the element
would still be announced as a heading and assigned a default level of `2`.

## How to check for required child roles

To check for required states and properties,
refer to the [WAI ARIA Definition of roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions).
Link to the role from the specification,
and check the required states and properties.

Add the missing ARIA state or property to the given element.

For more information on this audit,
see [Required ARIA attributes must be provided](https://dequeuniversity.com/rules/axe/3.1/aria-required-attr?application=lighthouse).

## More information

- [ARIA roles have required states and properties audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-required-attr.js)
- [axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [List of axe 3.2 rules](https://dequeuniversity.com/rules/axe/3.2)