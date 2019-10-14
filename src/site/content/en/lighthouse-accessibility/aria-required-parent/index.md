---
layout: post
title: "`[role]`s are not contained by their required parent element"
description: |
  Learn how to improve your web page's accessibility for screen reader users by
  making sure that all elements with ARIA roles are contained by the required
  parent element.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - aria-required-parent
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

Each ARIA `role` supports a specific subset of `aria-*` attributes.
Some ARIA child roles must be contained by specific parent roles
to properly perform their intended accessibility functions.

## How Lighthouse identifies missing parent roles

<a href="https://developers.google.com/web/tools/lighthouse" rel="noopener">Lighthouse</a>
flags ARIA child roles that aren't contained by the required parent:

<figure class="w-figure">
  <img class="w-screenshot" src="aria-required-parent.png" alt="Lighthouse audit showing ARIA role missing required parent role">
</figure>

Lighthouse uses the
[WAI ARIA specification: Definition of Roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions)
to check for required parent roles.
Any role that contains "required context role",
is considered a child role to the parent(s).

Lighthouse fails this audit,
when it finds a child role that's missing its parent.
In the example Lighthouse audit above,
the `listitem` role requires a parent `group` or `list`.
Since there's no parent role defined,
the audit fails.
This makes sense,
as it would be confusing to have a listitem without grouping into a list.

This issue is important to fix, and
probably indicates a mistaken assumption in your code. In the example above, the
element would be announced as plain text content and its `listitem` role would
be discarded.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to check for required parent roles

Refer to the [WAI ARIA Definition of Roles](https://www.w3.org/TR/wai-aria-1.1/#role_definitions).
ARIA explicitly defines required parent roles.
Link to the child role from the specification,
and check the "required context role".
Make sure to include a parent role for that child role.

For more information on this audit,
see [Certain ARIA roles must be contained by particular parent elements](https://dequeuniversity.com/rules/axe/3.3/aria-required-parent).

## Resources

- [Source code for **`[role]`s are not contained by their required parent element** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-required-parent.js)
- [Certain ARIA roles must be contained by particular parent elements](https://dequeuniversity.com/rules/axe/3.3/aria-required-parent)
