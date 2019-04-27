---
layout: post
title: Ensure ARIA attributes have valid values
description: |
  Learn about aria-valid-attr-value audit.
author: megginkearney
web_lighthouse:
  - aria-valid-attr-value
---

[ARIA](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
roles and attributes help screen readers
provide missing information about an element.
For these roles and attributes to make sense,
each ARIA `role` supports a specific subset of `aria-*` attributes
(see [ARIA roles definitions](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)).
Assistive technologies, like screen readers,
can't interpret ARIA attributes with invalid values.
Lighthouse reports when attributes do not have valid values:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="aria-valid-attr-value.png" alt="Lighthouse: ARIA attributes do not have valid values">
  <figcaption class="w-figcaption">
    Fig. 1 — ARIA attributes do not have valid values
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

## How Lighthouse determines an attribute's value is invalid

Lighthouse uses the
[WAI ARIA specification - Definition of roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
to check the values of roles and their attrbutes.
Lighthouse fails this audit,
when it finds attributes with invalid values.
In the example Lighthouse audit above,
`aria-checked` should be set to either `"true"`, `"false"`, or `"mixed"`.

{% Aside %}
HTML boolean attributes such as `hidden` or `checked` are assumed to be either
true or false depending on if they are present on the element.

However, ARIA attributes require an _explicit_ `"true"` or `"false"` string.
This is because most ARIA attributes actually support [a third state](https://www.w3.org/TR/wai-aria-1.1/#valuetype_true-false-undefined)—`undefined`—or a [tristate](https://www.w3.org/TR/wai-aria-1.1/#valuetype_tristate)
with an intermediate `"mixed"` value.
{% endAside %}

## How this audit impacts overall Lighthouse score

Lighthouse will flag this as a low severity issue. It is important to fix, and
probably indicates a mistaken assumption in your code. In the example above, the
element would still be announced as a checkbox but it will have an implicit
checked state of "unchecked.

## How to check for invalid attribute values

To check for invalid attribute values,
refer to the [WAI ARIA Definition of roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions).
ARIA defines a role's allowable attributes, and the valid values for those attributes.
Check that you are using the correct values for any attributes you use in your roles.

For more information on this audit,
see [ARIA attributes must conform to valid values](https://dequeuniversity.com/rules/axe/3.2/aria-valid-attr-value).

## More information

- [ARIA attributes have valid values audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-valid-attr-value.js)
- [axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [List of axe 3.2 rules](https://dequeuniversity.com/rules/axe/3.2)