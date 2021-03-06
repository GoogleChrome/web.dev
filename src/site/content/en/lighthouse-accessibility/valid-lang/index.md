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

{% include 'content/lighthouse-accessibility/lang-attr.njk' %}

If the language changes within your page,
you must specify a valid
<a href="https://www.w3.org/International/questions/qa-choosing-language-tags#question" rel="noopener">BCP 47 language</a>
to ensure that the section in the new language is pronounced correctly.

## How the Lighthouse invalid `lang` attribute audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags elements that have a `lang` attribute with an invalid value:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/0nINILzsfWRPuAtqiExn.png", alt="Lighthouse audit showing elements with an invalid value for the lang attribute", width="800", height="206", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix invalid `lang` attribute values

Use only valid
<a href="https://www.w3.org/International/questions/qa-choosing-language-tags#question" rel="noopener">BCP 47 language codes</a>
in all `lang` attribute values.

## Resources

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/valid-lang.js" rel="noopener">Source code for **`[lang]` attributes do not have a valid value** audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/valid-lang" rel="noopener">lang attribute must have a valid value (Deque University)</a>
