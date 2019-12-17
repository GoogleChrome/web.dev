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

## How to manually test that videos have captions

To verify that a `<video>` element has captions,
check that it contains at least one `<track>` element
with the attribute `kind="captions"`.
You need a captions track for each language you want to support:

```html/2,4
<video width="300" height="200">
    <source src="videoSample.mp4" type="video/mp4">
    <track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions">
    <track src="audio_desc_en.vtt" kind="descriptions" srclang="en" label="english_description">
    <track src="captions_es.vtt" kind="captions" srclang="es" label="spanish_captions">
    <track src="audio_desc_es.vtt" kind="descriptions" srclang="es" label="spanish_description">
</video>
```

## How to create captions tracks

{% include 'content/lighthouse-accessibility/caption-specs.njk' %}

{% include 'content/lighthouse-accessibility/track-kinds.njk' %}

## Resources

- [Source code for **`<video>` elements do not contain a `<track>` element with `[kind="captions"]`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/video-caption.js)
- [`<video>` elements must have a `<track>` for captions (Deque University)](https://dequeuniversity.com/rules/axe/3.3/video-caption)
- [Web Video Text Tracks Format (WebVTT)](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)
