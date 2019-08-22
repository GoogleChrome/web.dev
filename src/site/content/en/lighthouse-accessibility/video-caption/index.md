---
layout: post
title: Ensure video elements have captions
description: |
  Learn about video-caption audit.
web_lighthouse:
  - video-caption
---

Captions make video elements usable for deaf or hearing-impaired users,
providing critical information such as who is talking, what they're saying,
and other non-speech information.
Lighthouse reports any `<video>` elements that are missing a `<track>` element
with the attribute `kind="captions"`.

<!--
***Todo*** I tried very hard to get this audit to fail.
But no matter what, it seems to pass,
even with all sorts of crazy errors.
See glitch: [meggin-accessibility-assets](https://glitch.com/edit/#!/meggin-accessibiity-assets-1).
Also worth mentioning that I ran accessibility audit
against the convert gifs to video codelab,
and the audit doesn't fail either.
We don't have the track info in the codelab,
which seems problematic as well.

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="" alt="Lighthouse audit showing video element missing captions">
  <figcaption class="w-figcaption">
    Video element missing captions.
  </figcaption>
</figure>
-->
## How to fix the problem

To fix the problem,
add at least one track element to the `video` element
with attribute `kind="captions"`:

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
[`<video>` elements must have a `<track>` for captions](https://dequeuniversity.com/rules/axe/3.3/video-caption).

{% Aside 'note' %}
The example above includes both captions for hearing impaired users,
and audio descriptions for visually impaired users.
Audio descriptions provide context beyond dialog, such as scenery, facial expressions.
See also [Ensures `<video>` elements have audio descriptions](/video-description).
{% endAside %}

<!--
## How this audit impacts overall Lighthouse score

Todo. I have no idea how accessibility scoring is working!
-->
## More information

- [Video elements have captions audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/video-caption.js)
- [axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
