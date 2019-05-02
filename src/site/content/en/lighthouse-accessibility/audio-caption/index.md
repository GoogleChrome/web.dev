---
layout: post
title: Ensure audio elements have captions
description: |
  Learn about audio-caption audit.
web_lighthouse:
  - audio-caption
---

Captions make audio elements usable for deaf or hearing-impaired users,
providing critical information such as who is talking, what they're saying,
and other non-speech information.
Lighthouse reports any `<audio>` elements that are missing a `<track>` element
with the attribute `kind="captions"`.

<!--
***Todo*** I tried very hard to get this audit to fail.
But no matter what, it seems to pass,
even with all sorts of crazy errors.
See glitch: [meggin-accessibility-assets](https://glitch.com/edit/#!/meggin-accessibiity-assets)

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="" alt="Lighthouse audit showing Audio element missing captions">
  <figcaption class="w-figcaption">
    Fig. 1 — Audio element missing captions
  </figcaption>
</figure>
-->
## How to fix this problem

To fix this problem,
add at least one track element to the `audio` element
with attribute `kind="captions"`:

```html
<audio>
   <source src="favoriteSong.mp3" type="audio/mp3">
   <track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions">
   <track src="captions_es.vtt" kind="captions" srclang="es" label="spanish_captions">
</audio>
```

Learn more in
[`<audio>` elements must have a captions `<track>`](https://dequeuniversity.com/rules/axe/3.2/audio-caption).

<!--
## How this audit impacts overall Lighthouse score

Todo. I have no idea how accessibility scoring is working!
-->
## More information

- [Audio elements have captions audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/audit-caption.js)
- [axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [List of axe 3.2 rules](https://dequeuniversity.com/rules/axe/3.2)