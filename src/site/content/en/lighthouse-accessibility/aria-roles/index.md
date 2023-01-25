---
layout: post
title: "`[role]` values are not valid"
description: |
  Learn how to improve your web page's accessibility for assistive technology
  users by making sure that all ARIA roles are valid.
date: 2019-05-02
web_lighthouse:
  - aria-roles
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

The ARIA specification includes a
<a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">defined set of roles</a>.
When the value for an element's `role` attribute doesn't match a role from the set,
assistive technologies can't announce the element correctly
or interact with it as the developer intended.

## How Lighthouse determines an ARIA role has an invalid value

<a href="https://developers.google.com/web/tools/lighthouse" rel="noopener">Lighthouse</a>
flags ARIA roles with invalid values:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/8Qd5Rfq5WUWJa1ZF6z0A.png", alt="Lighthouse audit showing ARIA role has invalid values", width="800", height="185", class="w-screenshot" %}
</figure>

Lighthouse uses the
<a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">role definitions from the WAI-ARIA specification</a>
to check that all `role` attributes have valid values.
A page fails this audit when it contains an element with an invalid `role` value.
In the example Lighthouse audit above,
`button` has been misspelled as
`buton`, which isn't a valid role value.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix invalid ARIA role values

Refer to the
<a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">WAI-ARIA role definitions</a>
to see the full list of valid roles.
Make sure all `role` attributes are set to a value in the definitions list.

## Resources

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-roles.js" rel="noopener">Source code for **`[role]` values are not valid** audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/aria-roles" rel="noopener">ARIA roles used must conform to valid values (Deque University)</a>
- <a href="https://www.w3.org/TR/wai-aria-1.1/#role_definitions" rel="noopener">Role definitions from the WAI-ARIA specification</a>
