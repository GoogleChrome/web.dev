---
layout: post
title: "Elements with an ARIA `[role]` that require children to contain a specific `[role]` are missing some or all of those required children"
description: |
  Learn how to improve your web page's accessibility for assistive technology
  users by making sure that all elements with ARIA roles have the required child
  elements.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - aria-required-children
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

Some ARIA roles require specific child roles.
For example, the `tablist` role must own at least one element
with the `tab` role.
If the required child roles aren't present,
assistive technologies may convey confusing information about your page,
like announcing a tab set with no tabs.

## How Lighthouse identifies missing child roles

<a href="https://developers.google.com/web/tools/lighthouse" rel="noopener">Lighthouse</a>
flags ARIA roles that don't have the required child roles:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/meMpRNGub2polfC7ysFf.png", alt="Lighthouse audit showing ARIA role missing required child role(s)", width="800", height="205", class="w-screenshot" %}
</figure>

Lighthouse uses the
<a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">role definitions from the WAI-ARIA specification</a>
to check for
<a href="https://www.w3.org/TR/wai-aria/#mustContain" rel="noopener">required owned elements</a>—that is,
required child roles.
A page fails this audit
when it contains a parent role that's missing its required child roles.

In the example Lighthouse audit above,
the `radiogroup` role requires child elements with the `radio` role.
Since there are no children with a `radio` role defined,
the audit fails.
This makes sense,
as it would be confusing to have a radio group without any radio buttons.

This issue is important to fix and may break the experience for users.
In the example above, the element may still be announced as a radio group,
but users won't know how many radio buttons it contains.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add missing child roles

Refer to the
<a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">WAI-ARIA role definitions</a>
to see which child roles are required for the elements that Lighthouse flagged.
(The spec refers to required children as
<a href="https://www.w3.org/TR/wai-aria/#mustContain" rel="noopener">required owned elements</a>.)

{% include 'content/lighthouse-accessibility/aria-child-parent.njk' %}

## Resources
- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-required-children.js" rel="noopener">Source code for **Elements with an ARIA `[role]` that require children to contain a specific [role] are missing some or all of those required children** audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/aria-required-children" rel="noopener">Certain ARIA roles must contain particular children (Deque University)</a>
- <a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">Role definitions from the WAI-ARIA specification</a>
