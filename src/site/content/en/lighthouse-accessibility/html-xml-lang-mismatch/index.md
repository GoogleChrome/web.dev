---
layout: post
title: "The `<html>` `[lang]` attribute does not match the `[xml:lang]` attribute"
description: |
  Learn how to make sure screen readers pronounce your web page's content
  correctly by fixing mismatches between your html element's lang and xml:lang
  attributes.
web_lighthouse:
  - html-xml-lang-mismatch
date: 2019-10-17
---

<!-- TODO -->

## How Lighthouse identifies mismatches between the `lang` and `xml:lang` attributes

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags `<html>` elements whose `lang` and `xml:lang` attributes don't match:

<figure class="w-figure">
  <img class="w-screenshot" src="html-xml-lang-mismatch.png"
    alt="Lighthouse audit showing a mismatch between the lang and xml:lang attribute on the html element">
</figure>

<!-- TODO -->

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix `lang` and `xml:lang` mismatches

<!-- TODO -->

## Resources
- <a href="https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/html-xml-lang-mismatch.js" rel="noopener">Source code for **The `<html>` `[lang]` attribute does not match the `[xml:lang]` attribute** audit</a>
- <a href="https://dequeuniversity.com/rules/axe/3.3/html-xml-lang-mismatch" rel="noopener">&#60;html&#62; elements with lang and xml:lang must have the same base language</a>
