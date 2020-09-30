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

Captions make video elements usable for deaf or hearing-impaired users,
providing critical information such as who is talking, what they're saying,
and other non-speech information.

## How the Lighthouse video caption audit fails

Lighthouse flags `<video>` elements that are missing a `<track>` element
with the attribute `kind="captions"`.

<!--
***Todo*** I tried very hard to get this audit to fail.
But no matter what, it seems to pass,
even with all sorts of errors.
See glitch: [meggin-accessibility-assets](https://glitch.com/edit/#!/meggin-accessibiity-assets-1).
Also worth mentioning that I ran accessibility audit
against the convert gifs to video codelab,
and the audit doesn't fail either.
We don't have the track info in the codelab,
which seems problematic as well.

<figure class="w-figure">
  <img class="w-screenshot" src="" alt="Lighthouse audit showing video element missing captions">
</figure>
-->

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add captions to a video

Add at least one track element to the `video` element
with the `kind="captions"` attribute:

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
The example above includes both captions for deaf users,
and audio descriptions for visually impaired users.
Audio descriptions provide context beyond dialog, such as scenery, facial expressions.
See also [`<video>` elements do not contain a `<track>` element with `[kind="description"]`](/video-description).
{% endAside %}

## Resources

- [Source code for **`<video>` elements do not contain a `<track>` element with `[kind="captions"]`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/video-caption.js)
- [`<video>` elements must have a `<track>` for captions (Deque University)](https://dequeuniversity.com/rules/axe/3.3/video-caption)
