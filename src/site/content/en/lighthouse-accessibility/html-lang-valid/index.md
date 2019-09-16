---
layout: post
title: "<html> element does not have a valid value for its [lang] attribute"
description: |
  Learn how to make sure screen readers interpret your web page's content
  correctly by providing a valid value for the HTML element's lang attribute.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - html-lang-valid
---

Specifying a valid
[BCP 47 language](https://www.w3.org/International/questions/qa-choosing-language-tags#question)
helps screen readers announce text with the correct pronunciation.

## How this Lighthouse audit fails

Lighthouse flags pages whose `<html>` element doesn't have a valid value
for its `lang` attribute:

<figure class="w-figure">
  <img class="w-screenshot" src="html-lang-valid.png" alt="Lighthouse audit showing <html> element does not have a valid value for its lang attribute">
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix an invalid HTML `lang` attribute

Use valid language codes in the HTML `lang` attribute.
The language specified in the HTML document must be one of the valid languages
to ensure text is pronounced correctly for screen reader users.

For example, this sets the language of the document to English:

```html
<html lang="en">
```

Learn more in [`lang` attribute must have a valid value](https://dequeuniversity.com/rules/axe/3.3/valid-lang).

## Resources

- [Source code for **`<html>` element does not have a valid value for its `[lang]` attribute** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/html-has-lang.js)
- [`lang` attribute must have a valid value](https://dequeuniversity.com/rules/axe/3.3/valid-lang)
