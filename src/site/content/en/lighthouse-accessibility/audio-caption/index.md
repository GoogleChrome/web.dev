---
layout: post
title: "`<audio>` elements are missing a `<track>` element with `[kind=\"captions\"]`"
description: |
  Learn how to improve the accessibility of audio on your web page by providing
  closed captions.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - audio-caption
---

{% include 'content/lighthouse-accessibility/why-captions.njk' %}

## How to manually test that audio files have captions

To verify that an `<audio>` element has captions,
check that it contains at least one `<track>` element
with the attribute `kind="captions"`.
You need a captions track for each language you want to support:

```html/2-3
<audio>
    <source src="audioSample.mp3" type="audio/mp3">
    <track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions">
    <track src="captions_es.vtt" kind="captions" srclang="es" label="spanish_captions">
</video>
```

## How to add captions to an audio clip

{% include 'content/lighthouse-accessibility/caption-specs.njk' %}

{% Aside %}
Captions aren't the same as subtitles. Captions describe audio information for
users with hearing impairments. Subtitles provide translations for users who
don't speak the language(s) in an audio clip. _Always_ provide captions.
Provide subtitles when possible, based on the needs of your users.
{% endAside %}

## Resources

- [Source code for **`<audio>` elements are missing a `<track>` element with `[kind="captions"]`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/audio-caption.js)
- [`<audio> `elements must have a captions `<track>` (Deque University)](https://dequeuniversity.com/rules/axe/3.3/audio-caption)
- [Web Video Text Tracks Format (WebVTT)](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)
