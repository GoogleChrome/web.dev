---
layout: post
title: "`[role]`s are not contained by their required parent element"
description: |
  Learn how to improve your web page's accessibility for assistive technology
  users by making sure that all elements with ARIA roles are contained by the
  required parent element.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - aria-required-parent
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

Some ARIA roles must be owned by specific parent roles.
For example, the `tab` role must have
an element with the `tablist` role as a parent.
If the required parent role isn't present,
assistive technologies may announce the child roles as plain text content
rather than the intended control.

## How Lighthouse identifies missing parent roles

<a href="https://developers.google.com/web/tools/lighthouse" rel="noopener">Lighthouse</a>
flags ARIA child roles that aren't contained by the required parent:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ENzj3jYUVvSR3n23aC6M.png", alt="Lighthouse audit showing ARIA role missing required parent role", width="800", height="206", class="w-screenshot" %}
</figure>

Lighthouse uses the
<a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">role definitions from the WAI-ARIA specification</a>
to check for
<a href="https://www.w3.org/TR/wai-aria/#scope" rel="noopener">required context roles</a>—that is,
required parent roles.
A page fails this audit
when it contains a child role that's missing its required parent role.

In the example Lighthouse audit above,
the `listitem` role requires a parent `group` or `list`.
Since there's no parent role defined,
the audit fails.
This makes sense,
as it would be confusing to have a list item that isn't part of a list.

This issue is important to fix and may break the experience for users.
In the example above, the element would be announced as plain text content,
and its `listitem` role would be ignored.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add missing parent roles

Refer to the
<a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">WAI-ARIA role definitions</a>
to see which parent roles are required for the elements that Lighthouse flagged.
(The spec refers to required parents as
<a href="https://www.w3.org/TR/wai-aria/#scope" rel="noopener">required context roles</a>.)

{% include 'content/lighthouse-accessibility/aria-child-parent.njk' %}

## Resources

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-required-parent.js" rel="noopener">Source code for **`[role]`s are not contained by their required parent element** audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/aria-required-parent" rel="noopener">Certain ARIA roles must be contained by particular parent elements (Deque University)</a>
- <a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">Role definitions from the WAI-ARIA specification</a>
