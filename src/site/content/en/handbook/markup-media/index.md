---
layout: handbook
title: Images and video
date: 2019-06-26
updated: 2022-02-01
description: |
  Learn how to create the Markdown for images and video for web.dev.
---

## Images and video

### Dimensions

- Hero images should be 3200px wide by 960px tall.
- Thumbnail images should be 376px wide by 240px tall.
- Content images should be no wider than 1600px.
- Author images should be a 384px square.

When using the images CDN, treat those dimensions as the minimums and overall
aspect ratio for the source image you upload. The CDN will take care of
downsizing source images that are larger than the recommended dimensions.

### Using the images CDN

All images on web.dev are required to use our image CDN so we can optimize
them for users on different devices.

Visit [the image uploader page](https://web-dev-uploads.web.app/) and
sign-in using your Google corporate account. Note that this page only allows
Googlers access, so signing in with a personal account will fail.

If you're not a Googler, reach out to your Google contact to see about getting
access to the CDN.

### Choose a file

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

### Paste!

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

#### Properties

The `{% raw %}`{% Img %}`{% endraw%}` and `{% raw %}`{% Video %}`{% endraw%}`
shortcodes accepts many named arguments. Below are interfaces for both
shortcodes. Each property of the interface is a named argument that can be used
in the shortode.

##### Img Properties (`ImgArgs`)

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

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QlgeHQrzaD9IOKBXB68I.jpg", alt="ALT_TEXT_HERE", width="380", height="240" %}
  <figcaption>Original</figcaption>
</figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QlgeHQrzaD9IOKBXB68I.jpg", alt="ALT_TEXT_HERE", width="380", height="240", params={flip: 'h'} %}
  <figcaption>Flipped</figcaption>
</figure>

{% Aside %}
Please call out in a review if you're calling a specific Imgix API, so we can be
aware of custom use-cases and potentially support them through our own shortcode
directly.
{% endAside %}

##### Video Properties (`VideoArgs`)

```typescript
{% include '../../../../../../node_modules/webdev-infra/types/shortcodes/Video.d.ts' %}
```
### Captions

To include a caption along with an image, use `<figure>` with `<figcaption>` and
place the shortcode snippet inside:

```md
{% raw %}
<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QlgeHQrzaD9IOKBXB68I.jpg", alt="ALT_TEXT_HERE", width="380", height="240" %}
  <figcaption>A good boy.</figcaption>
</figure>
{% endraw%}
```

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QlgeHQrzaD9IOKBXB68I.jpg", alt="ALT_TEXT_HERE", width="380", height="240" %}
  <figcaption>A good boy.</figcaption>
</figure>

If you would like an image to stretch to the full width of the content, you can apply the `data-size="full"` attribute to the `<figure>` element.

```md
{% raw %}
<figure data-size="full">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QlgeHQrzaD9IOKBXB68I.jpg", alt="ALT_TEXT_HERE", width="380", height="240" %}
  <figcaption>A good boy.</figcaption>
</figure>
{% endraw%}
```

<figure data-size="full">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/QlgeHQrzaD9IOKBXB68I.jpg", alt="ALT_TEXT_HERE", width="380", height="240" %}
  <figcaption>A good boy.</figcaption>
</figure>

### YouTube

Use the {% raw %}`{% YouTube %}`{% endraw %} shortcode to embed a YouTube video.

```md
{% raw %}{% YouTube "qPD2yc8BoDk" %}

<!-- You can pass an optional start time as well -->
{% YouTube id="qPD2yc8BoDk", startTime="1678" %}{% endraw %}
```

{% YouTube "qPD2yc8BoDk" %}

Use the {% raw %}`{% YouTubePlaylist %}`{% endraw %} shortcode to embed a YouTube
playlist iframe.

```md
{% raw %}{% YouTubePlaylist 'PLNYkxOF6rcICntazGfSVKSj5EwuR9w5Nv' %}

<!-- You can pass allow, src, style and title as options in a second param -->
{% YouTubePlaylist 'PLNYkxOF6rcICntazGfSVKSj5EwuR9w5Nv', {title: "My title"} %}{% endraw %}
```

{% YouTubePlaylist 'PLNYkxOF6rcICntazGfSVKSj5EwuR9w5Nv', {title: "My title"} %}
