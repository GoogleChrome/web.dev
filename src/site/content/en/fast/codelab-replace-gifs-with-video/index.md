---
layout: codelab
title: Replace GIFs with video
authors:
  - robdodson
date: 2018-11-05
updated: 2019-12-12
description: |
  In this codelab, learn how to improve performance by replacing an animated GIF
  with a video.
glitch: gif-to-video
related_post: replace-gifs-with-videos
---

In this codelab, you'll improve the performance of a web page
by replacing an animated GIF with a video.

## Measure first

First measure how the web page performs using
[Lighthouse](https://developers.google.com/web/tools/lighthouse):

{% Instruction 'preview', 'ol' %}
{% Instruction 'audit-performance', 'ol' %}

When you're finished, you should see that Lighthouse has flagged the GIF as an
issue in its "Use video formats for animated content" audit.

## Get FFmpeg

There are a number of ways you can convert GIFs to video; this guide uses
[FFmpeg](https://www.ffmpeg.org/). It's already installed in the Glitch VM,
and, if you want, you can follow [these instructions to install it on your
local
machine](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/replace-animated-gifs-with-video/#converting_animated_gifs_to_video)
as well.

## Check FFmpeg

Check that FFmpeg is installed and working:

{% Instruction 'remix', 'ol' %}
{% Instruction 'console', 'ol' %}
1. In the console, run:

    ```bash
    which ffmpeg
    ```

You should get a file path back:

```bash
/usr/bin/ffmpeg
```

## Change the GIF to a video

1. In the console, run `cd images` to enter the images directory.
1. Run `ls` to see the contents.
1. You should see something like this:

    ```bash
    $ ls
    cat-herd.gif
    ```

1. In the console, run:

    ```bash
    ffmpeg -i cat-herd.gif -b:v 0 -crf 25 -f mp4 -vcodec libx264 -pix_fmt yuv420p cat-herd.mp4
    ```

This command tells FFmpeg to take the **input**, signified by the `-i` flag, of
`cat-herd.gif` and convert it to a video called `cat-herd.mp4`.
This should take a second to run.
When the command finishes,
you should be able to type `ls` again and see two files:

```bash
$ ls
cat-herd.gif  cat-herd.mp4
```

## Create a WebM version of the video

While the MP4 video format has been around since 1999,
WebM is a relative newcomer having been initially released in 2010.
WebM videos can be much smaller than MP4 videos,
so it makes sense to generate both.
Thankfully the `<video>` element will let you add multiple sources,
so if a browser doesn't support WebM, it can fall back to MP4.

1. In the console, run:

    ```bash
    ffmpeg -i cat-herd.gif -c vp9 -b:v 0 -crf 41 cat-herd.webm
    ```

1. To check the file sizes run:

    ```bash
    ls -lh
    ```

You should now have one GIF and two videos:

```bash
$ ls -lh
total 4.5M
-rw-r--r-- 1 app app 3.7M May 26 00:02 cat-herd.gif
-rw-r--r-- 1 app app 551K May 31 17:45 cat-herd.mp4
-rw-r--r-- 1 app app 341K May 31 17:44 cat-herd.webm
```

Notice that the original GIF is 3.7&nbsp;MB,
while the MP4 version is 551&nbsp;KB,
and the WebM version is only 341&nbsp;KB. That's a huge savings!

## Update the HTML to recreate GIF behavior

Animated GIFs have three key behaviors that videos need to replicate:

- They play automatically.
- They loop continuously (usually, though it's possible to prevent looping).
- They're silent.

Luckily, you can recreate these behaviors using the `<video>` element.

- In the `index.html` file, replace the `<img>` element with a `<video>` element
  with the following attributes:

```html/1/0
<img src="/images/cat-herd.gif" alt="Cowboys herding cats.">
<video autoplay loop muted playsinline></video>
```

A `<video>` element using these attributes will play automatically, loop
endlessly, play no audio, and play inline (that is, not fullscreen)⁠—all the
behaviors expected of animated GIFs! 🎉

## Specify your sources

Now you need to specify your video sources. The `<video>` element requires
one or more `<source>` child elements pointing to different video files that the
browser can choose from, depending on format support.
Add `<source>` elements that link to your cat-herd videos:

```html/1-2
<video autoplay loop muted playsinline>
  <source src="/images/cat-herd.webm" type="video/webm">
  <source src="/images/cat-herd.mp4" type="video/mp4">
</video>
```

{% Aside %}
Browsers don't have a way to identify which `<source>` is optimal, so the order
of `<source>` elements matters. For example, if you specify an MP4 video first, and the
browser supports WebM, browsers will skip the WebM `<source>` and use the MP4
instead. If you prefer a WebM `<source>` be used first, specify it first!
{% endAside %}

## Add captions and descriptions
One last detail to take care of: accessibility.
With GIFs, you can provide alternative text
to describe the image to users with visual impairments.
For videos, you need two elements:
- A `<track kind="descriptions">` element that links to a [WebVTT](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API)
  file describing the visual information in the video
- A`<track kind="captions">` element that links to a WebVTT file
  indicating that there isn't any audio

You can learn about the WebVTT format on the
[MDN WebVTT page](https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API).
For now, just create a `descriptions_en.vtt` file and a `captions_en.vtt` file
and copy the following content into them:

### `descriptions_en.vtt` content
For the audio description track,
describe what's happening in the video for users who can't see it:

```bash
WEBVTT

00:00.000 --> 99:99.999
Cowboys drive a herd of cats across a prairie.
```

### `captions_en.vtt` content
For the captions track,
you just need to explicitly state that the video has no audio
for users who are deaf or hard of hearing:

```bash
WEBVTT

00:00.000 --> 99:99.999
[No audio]
```

Once you have the VTT files set up, add a `<track>` element for each
inside your `<video>` element:

```html/3-4
<video autoplay loop muted playsinline>
  <source src="/images/cat-herd.webm" type="video/webm">
  <source src="/images/cat-herd.mp4" type="video/mp4">
  <track src="/images/descriptions_en.vtt" kind="descriptions" srclang="en">
  <track src="/images/captions_en.vtt" kind="captions" srclang="en">
</video>
```

This approach is admittedly more work than just adding an `alt` attribute to a GIF.
But it provides a better experience for _all_ your users.
For example, by using video, you allow users to pause playback
if it's distracting them.
And you can at least reuse your caption VTT file
across videos if you set the end time for the cue to a high number.

## Preview

{% Instruction 'preview' %}

The experience should look the same. So far so good.

## Verify with Lighthouse

With the live site open:

{% Instruction 'audit-performance', 'ol' %}

You should see that the "Use video formats for animated content" audit is now
passing! Woohoo! 💪
