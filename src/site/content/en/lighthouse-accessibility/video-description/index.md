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

## How to manually test that videos have audio descriptions

To verify that a `<video>` element has an audio description,
check that it contains at least one `<track>` element
with the attribute `kind="descriptions"`.
The source for each track must be a text file in the
[WebVTT format](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API).
You need an audio description track for each language you want to support:

```html/3,5
<video width="300" height="200">
    <source src="videoSample.mp4" type="video/mp4">
    <track src="captions_en.vtt" kind="captions" srclang="en" label="english_captions">
    <track src="audio_desc_en.vtt" kind="descriptions" srclang="en" label="english_description">
    <track src="captions_es.vtt" kind="captions" srclang="es" label="spanish_captions">
    <track src="audio_desc_es.vtt" kind="descriptions" srclang="es" label="spanish_description">
</video>
```

{% Aside 'caution' %}
Browsers' default media players don't currently support `description` tracks.
The [HTML 5 Audio Description extension](https://chrome.google.com/webstore/detail/html5-audio-description-v/jafenodgdcelmajjnbcchlfjomlkaifp)
for Chrome plays audio tracks via text-to-speech.
If video is critical to your site, you may want to tell your users about this extension.
Or consider using an [accessible video player](https://a11yproject.com/patterns/#video-players).
{% endAside %}

## How to write effective audio descriptions

For brief overviews of how to write effective audio descriptions,
see the [guidelines](http://www.acb.org/adp/guidelines.html)
from the Audio Description Project
and the [How to Describe page](http://www.descriptionkey.org/how_to_describe.html)
from Description Key.

{% include 'content/lighthouse-accessibility/track-kinds.njk' %}

## Resources

- [Source code for **`<video>` elements do not contain a `<track>` element with `[kind="description"]`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/video-description.js)
- [`<video>` elements must have an audio description `<track>` (Deque University)](https://dequeuniversity.com/rules/axe/3.3/video-description)
- [Web Video Text Tracks Format (WebVTT)](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)
