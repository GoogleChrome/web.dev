---
layout: handbook
title: Images and video
date: 2019-06-26
updated: 2021-03-11
description: |
  Learn how to create the Markdown for images and video for web.dev.
---

## Navigate to the media uploader

Visit [the image uploader page](https://web-dev-uploads.web.app/) and
sign-in using your Google corporate account. Note that this page only allows
Googlers access, so signing in with a personal account will fail.

{% Aside 'caution' %}
There are different uploaders for web.dev and developer.chrome.com:
* [web.dev uploader](https://web-dev-uploads.web.app/uploader)
* [developer.chrome.com uploader](https://chrome-gcs-uploader.web.app/)
{% endAside %}

## Choose a file

Upload a high quality image (jpg or png if you need alpha transparency). Our
image CDN will handle converting the image to webp if the browser supports it
and it will resize the image so you don't have to.

- Drag one or more files to the **Drop files here!** area
- Click **Upload**

A preview of the image or video with a shortcode snippet will appear. It should
look something like this:

```md
{% raw %}{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QlgeHQrzaD9IOKBXB68I.jpg", alt="ALT_TEXT_HERE", width="380", height="240" %}{% endraw %}
```

- Click the copy button to copy the snippet to your clipboard 📋

## Paste!

Paste the copied code from the previous step into your article.

Be sure to replace the text that says "ALT_TEXT_HERE" with your own description
of the image. You can read more about writing effective alt text over on [the
web.dev handbook](/handbook/inclusion-and-accessibility/#use-inclusive-images).

{% Aside %}
You may notice that the generated code is using either the
{% raw %}`{% Img %}`{% endraw%} or {% raw %}`{% Video %}`{% endraw%} shortcodes.
These are custom components for `web.dev` that ensure our media is
responsive 📱
{% endAside %}

### Properties

The `{% raw %}`{% Img %}`{% endraw%}` and `{% raw %}`{% Video %}`{% endraw%}`
shortcodes accepts many named arguments. Below are interfaces for both
shortcodes. Each property of the interface is a named argument that can be used
in the shortode.

#### Img Properties (`ImgArgs`)

```typescript
{% include '../../../../../../node_modules/webdev-infra/types/shortcodes/Img.d.ts' %}
```

The `{% raw %}`{% Img %}`{% endraw%}` `params` object exposes the entire [Imgix
API](https://docs.imgix.com/apis/rendering) to you. For example, if you wanted
to use the [flip API](https://docs.imgix.com/apis/rendering/rotation/flip) to flip
an image on its horitonzal axis you would do:

```md
{% raw %}{% Img
  src="image/foR0vJZKULb5AGJExlazy1xYDgI2/iuwBXAyKJMz4b7oRyIdI.jpg",
  alt="ALT_TEXT_HERE",
  width="380",
  height="240",
  params={flip: 'h'}
%}{% endraw%}
```

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QlgeHQrzaD9IOKBXB68I.jpg", alt="ALT_TEXT_HERE", width="380", height="240" %}
Original

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QlgeHQrzaD9IOKBXB68I.jpg", alt="ALT_TEXT_HERE", width="380", height="240", params={flip: 'h'} %}
Flipped

{% Aside %}
Please call out in a review if you're calling a specific Imgix API, so we can be
aware of custom use-cases and potentially support them through our own shortcode
directly.
{% endAside %}

#### Video Properties (`VideoArgs`)

```typescript
{% include '../../../../../../node_modules/webdev-infra/types/shortcodes/Video.d.ts' %}
```
## Captions

To include a caption along with an image, use `<figure>` with `<figcaption>` and
place the shortcode snippet inside:

```md
<figure class="w-figure">
{% raw %}{% Img
  src="image/foR0vJZKULb5AGJExlazy1xYDgI2/iuwBXAyKJMz4b7oRyIdI.jpg",
  alt="ALT_TEXT_HERE",
  width="380",
  height="240",
%}{% endraw%}
  <figcaption class="w-figcaption">
    A good boy.
  </figcaption>
</figure>
```

<figure class="w-figure">
{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QlgeHQrzaD9IOKBXB68I.jpg",
alt="ALT_TEXT_HERE", width="380", height="240" %}
  <figcaption class="w-figcaption">
    A good boy.
  </figcaption>
</figure>
