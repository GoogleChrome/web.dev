---
layout: post
title: "`<video>` elements do not contain a `<track>` element with `[kind=\"description\"]`"
description: |
  Learn how to make video on your web page more accessible by providing
  an audio description.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - video-description
---

{% Banner 'caution', 'body' %}This audit has been deprecated and was removed in Lighthouse 7.0.{% endBanner %}

Audio descriptions provide relevant information for videos that dialogue
cannot, such as facial expressions and scenes.

## How the Lighthouse video description audit fails

Lighthouse flags `<video>` elements that are missing a `<track>` element
with the attribute `kind="descriptions"`.

<!--
***Todo*** I tried very hard to get audio/video audits to fail.
But no matter what, they seem to pass
even with all sorts of errors.
See glitch: [meggin-accessibility-assets](https://glitch.com/edit/#!/meggin-accessibiity-assets-1)

<figure class="w-figure">
  <img class="w-screenshot" src="" alt="Lighthouse audit showing video element missing audio descriptions">
</figure>
-->

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add audio descriptions to video elements

Add at least one track element to the `video` element
with attribute `kind="descriptions"`:

```html
<video width="300" height="200">
    <source src="marathonFinishLine.mp4" type="video/mp4">
    <track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions">
    <track src="audio_desc_en.vtt" kind="descriptions" srclang="en" label="english_description">
    <track src="captions_es.vtt" kind="captions" srclang="es" label="spanish_captions">
    <track src="audio_desc_es.vtt" kind="descriptions" srclang="es" label="spanish_description">
</video>
```

{% Aside 'note' %}
The example above includes both audio descriptions for visually impaired users
and captions for hearing impaired users.
Captions make video elements usable for deaf or hearing-impaired users.
See also [`<video>` elements do not contain a `<track>` element with `[kind="captions"]`](/video-caption).
{% endAside %}

## Resources

- [Source code for **`<video>` elements do not contain a `<track>` element with `[kind="description"]`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/video-description.js)
- [`<video>` elements must have an audio description `<track>` (Deque University)](https://dequeuniversity.com/rules/axe/3.3/video-description)
