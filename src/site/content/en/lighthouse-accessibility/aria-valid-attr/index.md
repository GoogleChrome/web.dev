---
layout: post
title: "`[aria-*]` attributes are not valid or misspelled"
description: |
  Learn how to improve your web page's accessibility for assistive technology
  users by making sure that all ARIA attributes are valid.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - aria-valid-attr
---

{% include 'content/lighthouse-accessibility/about-aria.njk' %}

Each ARIA `role` supports a specific subset of `aria-*` attributes
that define the state and properties of that role.
For example, the `aria-selected` attribute is used to indicate whether
elements with `option`, `tab`, or similar roles are currently selected.

If an element's ARIA attribute is invalid,
assistive technologies won't be able
to interact with it as the developer intended.

## How Lighthouse checks for invalid ARIA attributes

<a href="https://developers.google.com/web/tools/lighthouse" rel="noopener">Lighthouse</a>
flags invalid ARIA attributes:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bsTxrfOgA2pNnmdMpP0H.png", alt="Lighthouse audit showing ARIA attribute has invalid value", width="800", height="185", class="w-screenshot" %}
</figure>

Lighthouse uses the
<a href="https://www.w3.org/TR/wai-aria-1.1/#states_and_properties" rel="noopener">states and properties from the WAI-ARIA specification</a>
to check that all ARIA attributes are valid.
A page fails this audit
when it contains an invalid attribute.

In the example Lighthouse audit above,
the `aria-checked` attribute has been misspelled as
`aria-cheked`, making it invalid.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix invalid ARIA attributes

Refer to the
<a href="https://www.w3.org/TR/wai-aria-1.1/#states_and_properties" rel="noopener">WAI-ARIA supported states and properties</a>
to see the full list of valid ARIA attributes.
Make sure all ARIA attributes on your page match one of the defined states or properties.

## Resources

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/aria-valid-attr.js" rel="noopener">Source code for **`[aria-*]` attributes are not valid or misspelled** audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/aria-valid-attr" rel="noopener">ARIA attributes must conform to valid names (Deque University)</a>
- <a href="https://www.w3.org/TR/wai-aria-1.1/#states_and_properties" rel="noopener">States and properties from the WAI-ARIA specification</a>
