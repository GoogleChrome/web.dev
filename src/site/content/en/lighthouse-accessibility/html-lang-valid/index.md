---
layout: post
title: "`<html>` element does not have a valid value for its `[lang]` attribute"
description: |
  Learn how to make sure assistive technologies pronounce your web page's content
  correctly by providing a valid value for the HTML element's lang attribute.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - html-lang-valid
---

{% include 'content/lighthouse-accessibility/lang-attr.njk' %}

To ensure correct pronunciation of the page as a whole,
you must specify a valid
<a href="https://www.w3.org/International/questions/qa-choosing-language-tags#question" rel="noopener">BCP 47 language</a>
for the `<html>` element.

## How the Lighthouse invalid `<html>` `lang` value audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages whose `<html>` element doesn't have a valid value
for its `lang` attribute:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CqvcHw47iqVVkVcigSx0.png", alt="Lighthouse audit showing the html element has an invalid value for its lang attribute", width="800", height="185", class="w-screenshot" %}
</figure>

Note that the [**`<html>` element does not have a `[lang]` attribute** audit](/html-has-lang)
checks whether a `lang` attribute is present.
This audit checks whether the _value_ for that attribute is valid.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix an invalid HTML `lang` attribute

{% include 'content/lighthouse-accessibility/fix-lang-attr.njk' %}

## Resources

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/html-lang-valid.js" rel="noopener">Source code for **`<html>` element does not have a valid value for its `[lang]` attribute** audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/html-lang-valid" rel="noopener">&#60;html&#62; element must have a valid value for the lang attribute (Deque University)</a>
