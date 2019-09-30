---
layout: post
title: Ensure video elements have audio descriptions
description: |
  Learn about video-description audit.
date: 2019-05-02
web_lighthouse:
  - video-description
---

Audio descriptions provide relevant information for videos that dialogue
cannot, such as facial expressions and scenes.
Lighthouse reports any `<video>` elements that are missing a `<track>` element
with the attribute `kind="descriptions"`.

<!--
***Todo*** I tried very hard to get audio/video audits to fail.
But no matter what, they seem to pass
even with all sorts of crazy errors.
See glitch: [meggin-accessibility-assets](https://glitch.com/edit/#!/meggin-accessibiity-assets-1)

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="" alt="Lighthouse audit showing video element missing audio descriptions">
  <figcaption class="w-figcaption">
    Video element missing audio descriptions.
  </figcaption>
</figure>
-->
## How to fix the problem

To fix the problem,
add at least one track element to the `video` element
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

Learn more in
[`<video>` elements must have an audio description `<track>`](https://dequeuniversity.com/rules/axe/3.3/video-description).

{% Aside 'note' %}
The example above includes both audio descriptions for visually impaired users
and captions for hearing impaired users.
Captions make video elements usable for deaf or hearing-impaired users.
See also [Ensures `<video>` elements have captions](/video-caption).
{% endAside %}

<!--
## How this audit impacts overall Lighthouse score

Todo. I have no idea how accessibility scoring is working!
-->
## More information

- [Video elements have audio descriptions audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/video-description.js)
- [axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
