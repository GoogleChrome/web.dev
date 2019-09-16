---
layout: post
title: "[id] attributes on the page are not unique"
description: |
  Learn how to make sure that all elements on your page are announced correctly
  by assistive technologies.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - duplicate-id
---

Duplicate IDs are common validation errors that may break the accessibility of labels.
Assistive technologies typically only reference the first instance of an ID accurately.
The value of each ID attribute must be unique to prevent duplicate instances
from being overlooked by assistive technologies.

## How the Lighthouse duplicate ID audit fails

Lighthouse flags duplicate IDs found in a page:

<figure class="w-figure">
  <img class="w-screenshot" src="duplicate-id.png" alt="Lighthouse audit showing ID attributes on the page are not unique">
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to avoid duplicate IDs

Change an ID value if it is used more than once.
Learn more in
[ID attribute values must be unique](https://dequeuniversity.com/rules/axe/3.3/duplicate-id).

## Resources

- [Source code for **`[id]` attributes on the page are not unique** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/duplicate-id.js)
- [ID attribute values must be unique](https://dequeuniversity.com/rules/axe/3.3/duplicate-id)
