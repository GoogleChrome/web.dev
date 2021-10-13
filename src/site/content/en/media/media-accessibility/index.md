---
layout: post
title: Media accessibility
authors:
  - joemedley
  - derekherman
description: |
  Accessibility isn't like icing on a cake. It's never anything you put on a
  backlog with the hope of introducing later. Captions and screen reader
  descriptions are the only way many users can experience your videos, and in
  some jurisdictions, they're even required by law or regulation.
date: 2020-08-20
updated: 2021-07-05
tags:
  - media
  # - video
  - accessibility
---

In this article you will learn about the WebVTT (Web Video Text Tracks) format,
which is used to describe timed text data such as closed captions or subtitles
in order to make videos more accessible to your audience.

Accessibility isn't like icing on a cake. It's never anything you put on a
backlog with the hope of introducing it later. Captions and screen reader
descriptions are the only way many users can experience your videos, and in some
jurisdictions, they're even required by law or regulation.

## Add `<track>` tags

To add captions or screen reader descriptions to a web video, add a [`<track>`]
tag within a `<video>` tag. In addition to captions and screen reader
descriptions, `<track>` tags may also be used for subtitles and chapter titles.
The `<track>` tag can also help search engines understand what's in a video.
However, those capabilities are outside the scope of this article.

<figure class="w-figure  w-figure--inline-right">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vbNDp5R05MwQmsxZ0RLI.jpg", alt="Screenshot showing captions displayed using the track element in Chrome on Android", width="800", height="480" %}
  <figcaption class="w-figcaption">Screenshot showing captions displayed using the
track element in Chrome on Android</figcaption>
</figure>

The `<track>` tag is similar to the `<source>` element in that both have a `src`
attribute that points to referenced content. For a `<track>` tag, it points to a
[WebVTT file]. The `label` attribute specifies how a particular track will be
identified in the interface.

To provide tracks for multiple languages add a separate `<track>` tag for each
WebVTT file you're providing and indicate the language using the `srclang`
attribute.

An example `<video>` tag with two `<track>` tags is shown below. There's also a
sample you can [view on Glitch] ([source]).

Add a `<track>` element as a child of the `<video>` element:

```html/3
<video controls>
  <source src="https://storage.googleapis.com/webfundamentals-assets/videos/chrome.webm" type="video/webm" />
  <source src="https://storage.googleapis.com/webfundamentals-assets/videos/chrome.mp4" type="video/mp4" />
  <track src="chrome-subtitles-en.vtt" label="English captions" kind="captions" srclang="en" default>
  <track src="chrome-subtitles-zh.vtt" label="中文字幕" kind="captions" srclang="zh">
  <p>This browser does not support the video element.</p>
</video>
```

{% Aside %}
Notice in the example on **line 4** that the `default` attribute indicates which
language track is the default.
{% endAside %}

## WebVTT file structure

Below is a hypothetical WebVTT file for the demo linked to above. The file is a
text file containing a series of *cues*. Each cue is a block of text to display
on screen, and the time range during which it will be displayed.

```text
WEBVTT

00:00.000 --> 00:04.999
Man sitting on a tree branch, using a laptop.

00:05.000 --> 00:08.000
The branch breaks, and he starts to fall.

...
```

Each item within the track file is called a *cue*. Each cue has a start time and
end time separated by an arrow, with cue text in the line below. Cues can
optionally also have IDs like `railroad` and `manuscript` in the example below.
Cues are separated by an empty line.

```text
WEBVTT

railroad
00:00:10.000 --> 00:00:12.500
Left uninspired by the crust of railroad earth

manuscript
00:00:13.200 --> 00:00:16.900
that touched the lead to the pages of your manuscript.
```

Cue times are in `hours:minutes:seconds.milliseconds` format. Parsing is strict.
Meaning, numbers must be zero padded if necessary: hours, minutes, and seconds
must have two digits (00 for a zero value) and milliseconds must have three
digits (000 for a zero value). There is an excellent WebVTT validator at
[Live WebVTT Validator], which checks for errors in time formatting, and
problems such as non-sequential times.

You can create a VTT file by hand, thought there are [many services] that will
create them for you.

As you can see in our previous examples, the WebVTT format is pretty simple.
Just add your text data along with timings.

However, what if you want your captions to render in a different position with
left or right alignment? Perhaps to align the captions with the current speaker
position, or to stay out of the way of in-camera text. WebVTT defines settings to do that,
and more, directly inside the
`.vtt` file. Take note of how the caption placement is defined by adding
settings after the time interval definitions.

```text
WEBVTT

00:00:05.000 --> 00:00:10.000 line:0 position:20% size:60% align:start
The first line of the subtitles.
```

Another handy feature is the ability to style cues using CSS. Perhaps you want
to use a gray linear gradient as the background, with a foreground color of
`papayawhip` for all captions and all bold text colored `peachpuff`.

```css
video::cue {
  background-image: linear-gradient(to bottom, dimgray, lightgray);
  color: papayawhip;
}

video::cue(b) {
  color: peachpuff;
}
```

{% Aside 'gotchas' %}
Be careful when coloring text to keep to high-contrast colors so as not to
degrade readability.
{% endAside %}

If you're interested in learning more about styling and tagging of individual
cues, the [WebVTT specification] is a good source for advanced examples.

## Kinds of text tracks

Did you notice the `kind` attribute of the `<track>` element? It's used to
indicate what relation the particular text track has to the video. The
possible values of the `kind` attribute are:

* `captions`: For closed captions, i.e. transcripts and possibly translations
  of any audio. Suitable for hearing impaired and in cases when the video is
  playing muted.
* `subtitles`: For subtitles, i.e. translations of speech and text in a
  language different from the main language of the video.
* `descriptions`: For descriptions of visual parts of the video content.
  Suitable for visually impaired people.
* `chapters`: Intended to be displayed when the user is navigating within the
  video.
* `metadata`: Not visible, and may be used by scripts.

Now that you understand the basics of making a video available and accessible
on your web page, you might wonder about more complex use cases. Next up, you'll
lean about [Media frameworks](/media-frameworks/) and how they can help you add
videos to your web page while providing advanced features.

[`<track>`]: https://developer.mozilla.org/docs/Web/HTML/Element/track
[view on Glitch]: https://track-demonstration.glitch.me
[source]: https://glitch.com/edit/#!/track-demonstration
[WebVTT file]: https://developer.mozilla.org/docs/Web/API/WebVTT_API
[Live WebVTT Validator]: https://quuz.org/webvtt/
[many services]: https://www.google.com/search?q=webvtt+services
[WebVTT specification]: https://w3c.github.io/webvtt/
