---
layout: post
title: "`<html>` element does not have a `[lang]` attribute"
description: |
  Learn how to make sure screen readers pronounce your web page's content
  correctly by providing a lang attribute on the HTML element.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - html-has-lang
---

Screen readers use different sound libraries for each language.
Screen readers can switch between these language libraries easily,
but only if the documents specify which language(s) to read and when.

If a page doesn't specify a language,
a screen reader assumes the page is in the default language
that the user chose when setting up the screen reader,
often making it impossible to understand the content.

## How this Lighthouse audit fails

Lighthouse flags pages whose `<html>` element doesn't have a `lang` attribute':

<figure class="w-figure">
  <img class="w-screenshot" src="html-has-lang.png" alt="Lighthouse audit showing <html> element does not have a lang attribute">
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add an HTML `lang` attribute

Add a `lang` attribute to the `<html>` element.
If your page is in English, use the `en` value:

```html
<html lang="en">
```

Learn more in [`<html>` element must have a lang attribute](https://dequeuniversity.com/rules/axe/3.3/html-has-lang).

## Resources

- [Source code for **`<html>` element does not have a `[lang]` attribute** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/html-has-lang.js)
- [`<html>` element must have a lang attribute](https://dequeuniversity.com/rules/axe/3.3/html-has-lang)
