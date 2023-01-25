---
layout: post
title: "`<html>` element does not have a `[lang]` attribute"
description: |
  Learn how to make sure assistive technologies pronounce your web page's
  content correctly by providing a lang attribute for the HTML element.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - html-has-lang
---

{% include 'content/lighthouse-accessibility/lang-attr.njk' %}

If a page doesn't specify a language for the `<html>` element,
a screen reader assumes the page is in the default language
that the user chose when setting up the screen reader,
often making it impossible to understand the content.

## How the Lighthouse missing `<html>` `lang` audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags pages whose `<html>` element doesn't have a `lang` attribute:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/h6k3xwau2Jz0GXXsM8Av.png", alt="Lighthouse audit showing the html element doesn't have a lang attribute", width="800", height="228", class="w-screenshot" %}
</figure>

Note that this audit
checks whether a `lang` attribute is present.
The [**`<html>` element does not have a valid value for its `[lang]` attribute** audit](/html-lang-valid)
checks whether the _value_ for that attribute is valid.

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add an HTML `lang` attribute

{% include 'content/lighthouse-accessibility/fix-lang-attr.njk' %}

## Resources

- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/html-has-lang.js" rel="noopener">Source code for **`<html>` element does not have a `[lang]` attribute** audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/html-has-lang" rel="noopener">`<html>` element must have a lang attribute (Deque University)</a>
