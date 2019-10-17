---
layout: post
title: "`<video>` elements do not contain a `<track>` element with `[kind=\"captions\"]`"
description: |
  Learn how to make video on your web page more accessible by providing
  closed captions.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - video-caption
---

{% include 'content/lighthouse-accessibility/why-captions.njk' %}

## How the Lighthouse video caption audit fails

Lighthouse flags `<video>` elements that don't have a child `<track>` element
with the attribute `kind="captions"`.

<!--
***Todo*** I tried very hard to get this audit to fail.
But no matter what, it seems to pass,
even with all sorts of crazy errors.
See glitch: [meggin-accessibility-assets](https://glitch.com/edit/#!/meggin-accessibiity-assets-1).

<figure class="w-figure">
  <img class="w-screenshot" src="" alt="Lighthouse audit showing video element missing captions">
</figure>
-->

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add captions to a video

For every `<video>` element on your page, add at least one `<track>` element
with the attribute `kind="captions"`:

```html
<video width="300" height="200">
    <source src="marathonFinishLine.mp4" type="video/mp4">
    <track src="captions_en.vtt" kind="captions" srclang="en" label="captions">
    <track src="audio_desc_en.vtt" kind="descriptions" srclang="en" label="description">
</video>
```

{% include 'content/lighthouse-accessibility/caption-specs.njk' %}

Provide a captions track for each language you want to support.
Specify each track's language using the `srclang` attribute:

```html
<video width="300" height="200">
    <source src="videoSample.mp4" type="video/mp4">
    <track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions">
    <track src="audio_desc_en.vtt" kind="descriptions" srclang="en" label="english_description">
    <track src="captions_es.vtt" kind="captions" srclang="es" label="spanish_captions">
    <track src="audio_desc_es.vtt" kind="descriptions" srclang="es" label="spanish_description">
</video>
```

{% include 'content/lighthouse-accessibility/track-kinds.njk' %}

## Resources

- [Source code for **`<video>` elements do not contain a `<track>` element with `[kind="captions"]`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/video-caption.js)
- [`<video>` elements must have a `<track>` for captions (Deque University)](https://dequeuniversity.com/rules/axe/3.3/video-caption)
- [Web Video Text Tracks Format (WebVTT)](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)
