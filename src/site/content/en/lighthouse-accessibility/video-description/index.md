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

Videos often include information that is only conveyed through visuals.
For example, a scene may take place in a park, but blind viewers have no way
of knowing that if it isn't noted in dialog or voiceover.

Audio descriptions make visual information in videos
accessible to users with visual impairments by
explaining details that aren't conveyed in the original audio.

## How the Lighthouse video description audit fails

Lighthouse flags `<video>` elements that are missing a `<track>` element
with the attribute `kind="descriptions"`.

<!--
***Todo*** I tried very hard to get audio/video audits to fail.
But no matter what, they seem to pass
even with all sorts of crazy errors.
See glitch: [meggin-accessibility-assets](https://glitch.com/edit/#!/meggin-accessibiity-assets-1)

<figure class="w-figure">
  <img class="w-screenshot" src="" alt="Lighthouse audit showing video element missing audio descriptions">
</figure>
-->

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to add audio descriptions to a video

For every `<video>` element on your page, add at least one `<track>` element
with the attribute `kind="descriptions"`. The source for each track must be a text file in the
[WebVTT format](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API).
Provide an audio description track for each language you want to support:

```html
<video width="300" height="200">
    <source src="videoSample.mp4" type="video/mp4">
    <track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions">
    <track src="audio_desc_en.vtt" kind="descriptions" srclang="en" label="english_description">
    <track src="captions_es.vtt" kind="captions" srclang="es" label="spanish_captions">
    <track src="audio_desc_es.vtt" kind="descriptions" srclang="es" label="spanish_description">
</video>
```

For brief overviews of how to create effective audio descriptions,
see the [guidelines](http://www.acb.org/adp/guidelines.html)
from the Audio Description Project
and the [How to Describe page](http://www.descriptionkey.org/how_to_describe.html)
from Description Key.

{% include 'content/lighthouse-accessibility/track-kinds.njk' %}

## Resources

- [Source code for **`<video>` elements do not contain a `<track>` element with `[kind="description"]`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/video-description.js)
- [`<video>` elements must have an audio description `<track>` (Deque University)](https://dequeuniversity.com/rules/axe/3.3/video-description)
- [Web Video Text Tracks Format (WebVTT)](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)
