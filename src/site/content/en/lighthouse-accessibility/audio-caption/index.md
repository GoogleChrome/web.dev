---
layout: post
title: "`<audio>` elements are missing a `<track>` element with `[kind=\"captions\"]`"
description: |
  Learn how to improve the accessibility of audio on your web page by providing
  closed captions.
date: 2019-05-02
updated: 2020-03-25
web_lighthouse:
  - audio-caption
---

{% Banner 'caution', 'body' %}This audit has been deprecated.{% endBanner %}

Captions make audio elements usable for deaf or hearing-impaired users,
providing critical information such as who is talking, what they're saying,
and other non-speech information.

## How the Lighthouse audio track audit fails

Lighthouse flags `<audio>` elements that are missing `<track>` elements.

<!--
***Todo*** I tried very hard to get this audit to fail.
But no matter what, it seems to pass,
even with all sorts of errors.
See glitch: [meggin-accessibility-assets](https://glitch.com/edit/#!/meggin-accessibiity-assets)
<figure class="w-figure">
  <img class="w-screenshot" src="" alt="Lighthouse audit showing Audio element missing captions">
</figure>
-->

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add an audio track

Add at least one `<track>` element to the `<audio>` element
with attribute `kind="captions"`:

```html
<audio>
   <source src="favoriteSong.mp3" type="audio/mp3">
   <track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions">
   <track src="captions_es.vtt" kind="captions" srclang="es" label="spanish_captions">
</audio>
```

## Resources

- [Source code for **`<audio>` elements are missing a `<track>` element with `[kind="captions"]`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/audio-caption.js)
- [`<audio> `elements must have a captions `<track>` (Deque University)](https://dequeuniversity.com/rules/axe/3.3/audio-caption)
