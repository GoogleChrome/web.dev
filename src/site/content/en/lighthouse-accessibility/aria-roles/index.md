---
layout: post
title: "`[role]` values are not valid"
description: |
  Learn how to improve your web page's accessibility for screen reader users by
  making sure that all ARIA roles are valid.
date: 2019-05-02
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

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

## How Lighthouse determines a role has invalid values

Lighthouse flags ARIA roles with invalid values:

<figure class="w-figure">
  <img class="w-screenshot" src="aria-roles.png" alt="Lighthouse audit showing ARIA role has invalid values">
</figure>

Lighthouse uses the
[WAI ARIA specification: Definition of Roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
to check a role's values.
Lighthouse fails this audit,
when it finds a role with invalid values.
In the example Lighthouse audit above,
`button` has been misspelled as
`buton`, which isn't a valid role value.

This issue is important to fix because it breaks the role. In
the example above, the element's role should be changed from `buton` to
`button`.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to check for invalid roles

Refer to the [WAI ARIA Definition of Roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions).
ARIA explicitly defines role values.
If you set `role=` to any value not appearing in the definitions list,
the audit fails.

For more information on this audit,
see [ARIA roles used must conform to valid values](https://dequeuniversity.com/rules/axe/3.1/aria-roles).

## Resources

- [Source code for **`[role]` values are not valid** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-roles.js)
- [ARIA roles used must conform to valid values](https://dequeuniversity.com/rules/axe/3.3/aria-roles)
