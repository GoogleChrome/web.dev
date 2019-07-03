---
layout: post
title: Ensure all lang attributes have a valid value
description: |
  Learn about valid-lang audit.
web_lighthouse:
  - valid-lange
---

Specifying a valid
[BCP 47 language](https://www.w3.org/International/questions/qa-choosing-language-tags#question)
helps screen readers announce text properly.
Lighthouse reports when any `lang` attribute does not have a valid value.

<!--
***Todo*** I can't seem to get this audit to fail. I tried having a valid html lang, and then adding an invalid lang to body, and to other parts of the page, but none throw this error.

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="valid-lang.png" alt="Lighthouse audit showing `lang` attribute does not have a valid value">
  <figcaption class="w-figcaption">
    The <code>lang</code> attribute does not have a valid value.
</figure>
-->
## How to fix this problem

To fix this problem,
Use only valid language codes in the `lang` attribute.
The language specified in the HTML document must be one of the valid languages
to ensure text is pronounced correctly for screen reader users.
Learn more in [lang attribute must have a valid value](https://dequeuniversity.com/rules/axe/3.2/valid-lang).

<!--
## How this audit impacts overall Lighthouse score

Todo. I have no idea how accessibility scoring is working!
-->
## More information

- [Ensure `lang` attribute has valid value audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/valid-lang.js)
- [axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [List of axe 3.2 rules](https://dequeuniversity.com/rules/axe/3.2)
