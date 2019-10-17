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

## How the Lighthouse audio caption audit fails

Lighthouse flags `<audio>` elements that don't have a child `<track>` element.

<!--
***Todo*** I tried very hard to get this audit to fail.
But no matter what, it seems to pass,
even with all sorts of crazy errors.
See glitch: [meggin-accessibility-assets](https://glitch.com/edit/#!/meggin-accessibiity-assets)
<figure class="w-figure">
  <img class="w-screenshot" src="" alt="Lighthouse audit showing Audio element missing captions">
</figure>
-->

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add captions to an audio clip

For every `<audio>` element on your page, add at least one `<track>` element
with the attribute `kind="captions"`:

```html
<audio>
   <source src="audioSample.mp3" type="audio/mp3">
   <track src="captions_en.vtt" kind="captions" srclang="en" label="captions">
</audio>
```

The source for the track must be a text file in the
[WebVTT format](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API).
Captions should include all essential information about the audio clip,
including who is speaking, a transcript of the dialogue,
and any musical cues or sound effects.

Provide a captions track for each language you want to support.
Specify each track's language using the `srclang` attribute:

```html
<audio>
   <source src="favoriteSong.mp3" type="audio/mp3">
   <track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions">
   <track src="captions_es.vtt" kind="captions" srclang="es" label="spanish_captions">
</audio>
```

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
