---
layout: post
title: "`[lang]` attributes do not have a valid value"
description: |
  Learn how to improve the accessibility of your web page for international
  audiences by providing a valid value for all lang attributes.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - valid-lange
---

Specifying a valid
[BCP 47 language](https://www.w3.org/International/questions/qa-choosing-language-tags#question)
helps screen readers pronounce text correctly for screen reader users.

## How this Lighthouse audit fails

Lighthouse flags `lang` attributes that don't have a valid value:

<figure class="w-figure">
  <img class="w-screenshot" src="valid-lang.png" alt="Lighthouse audit showing `lang` attribute does not have a valid value">
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix invalid `lang` attribute values

Use only valid [BCP 47 language codes](https://www.w3.org/International/questions/qa-choosing-language-tags#question)
in all `lang` attribute values.

Learn more in [lang attribute must have a valid value](https://dequeuniversity.com/rules/axe/3.3/valid-lang).

## Resources

- [Source code for **`[lang]` attributes do not have a valid value** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/valid-lang.js)
- [lang attribute must have a valid value](https://dequeuniversity.com/rules/axe/3.3/valid-lang)
