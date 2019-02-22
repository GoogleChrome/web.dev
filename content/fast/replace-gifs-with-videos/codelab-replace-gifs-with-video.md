---
page_type: glitch
title: Replace GIFs with video
author: robdodson
description: |
  In this codelab, learn how to improve performance by replacing an animated GIF
  with a video.
web_updated_on: 2018-12-06
web_published_on: 2018-11-05
glitch: gif-to-video
---

In this codelab, improve performance by replacing an animated GIF with a
video.

## Measure first

First measure how the website performs:

- Click on the **Show Live** button to preview the app.

1. Open Chrome DevTools.
1. Click on the **Audits** panel.
1. Select the **Performance** checkbox.
1. Click **Run Audits** to generate a report.

When you're finished, you should see that Lighthouse has flagged the GIF as an
issue in its "Use video formats for animated content" audit.

## Get FFmpeg

There are a number of ways you can convert GIFs to video; this guide uses
**[FFmpeg](https://www.ffmpeg.org/)**. It's already installed in the Glitch VM,
and, if you want, you can follow **[these instructions to install it on your
local
machine](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/replace-animated-gifs-with-video/#converting_animated_gifs_to_video)**
as well.

## Open the console

Double-check that FFmpeg is installed and working.

- Click the **Remix to Edit** button to make the project editable.

- Click the **Tools** button.

- Click the **Console** button.

- In the console, run:

<pre class="devsite-terminal">
which ffmpeg
</pre>

You should get a file path back:

```shell
/usr/bin/ffmpeg
```

## Change GIF to video

1. In the console, run `cd images` to enter the images directory.
1. Run `ls` to see the contents.

You should see something like this:

```shell
$ ls
cat-herd.gif
```

- In the console, run:

<pre class="devsite-terminal devsite-click-to-copy">
ffmpeg -i cat-herd.gif cat-herd.mp4
</pre>

This tells FFmpeg to take the **input**, signified by the `-i` flag, of
cat-herd.gif and convert it to a video called cat-herd.mp4. This should take a
second to run. When the command finishes, you should be able to type `ls` again
and see two files:

<pre class="prettyprint devsite-disable-click-to-copy">
$ ls  
cat-herd.gif  cat-herd.mp4
</pre>

## Create WebM videos

While MP4 has been around since 1999, WebM is a relative newcomer having been
initially released in 2010. WebM videos can be much smaller than MP4 videos, so
it makes sense to generate both. Thankfully the `<video>` element will let you
add multiple sources, so if a browser doesn't support WebM, it can fallback to
MP4.

- In the console, run:

<pre class="devsite-terminal devsite-click-to-copy">
ffmpeg -i cat-herd.gif -c vp9 -b:v 0 -crf 41 cat-herd.webm
</pre>

- To check the file sizes run:

<pre class="devsite-terminal devsite-click-to-copy">
ls -lh
</pre>

You should have one GIF, and two videos:

<pre class="prettyprint devsite-disable-click-to-copy">
$ ls -lh
total 4.5M
-rw-r--r-- 1 app app 3.7M May 26 00:02 cat-herd.gif  
-rw-r--r-- 1 app app 551K May 31 17:45 cat-herd.mp4  
-rw-r--r-- 1 app app 341K May 31 17:44 cat-herd.webm
</pre>

Notice that the original GIF is 3.7M, whereas the MP4 version is 551K, and the
WebM version is only 341K. That's a huge savings!

## Update HTML to recreate GIF effect

Animated GIFs have three key traits that videos need to replicate:

- They play automatically.
- They loop continuously (usually, but it is possible to prevent looping).
- They're silent.

Luckily, you can recreate these behaviors using the `<video>` element.

- In the `index.html` file, replace the line with the `<img>` with:

<pre class="prettyprint devsite-disable-click-to-copy">
<s>&lt;img src=&quot;/images/cat-herd.gif&quot; alt=&quot;Cowboys herding cats.&quot;&gt;</s>
<strong>&lt;video autoplay loop muted playsinline&gt;&lt;/video&gt;</strong>
</pre>

A `<video>` element using these attributes will play automatically, loop
endlessly, play no audio, and play inline (i.e., not fullscreen), all the
behaviors expected of animated GIFs! 🎉

## Specify your sources

All that's left to do is specify your video sources. The `<video>` element requires
one or more `<source>` child elements pointing to different video files the
browser can choose from, depending on format support.  
Update the `<video>` with `<source>` elements that link to your cat-herd videos:  

<pre class="prettyprint">
&lt;video autoplay loop muted playsinline&gt;
  <strong>&lt;source src=&quot;/images/cat-herd.webm&quot; type=&quot;video/webm&quot;&gt;</strong>
  <strong>&lt;source src=&quot;/images/cat-herd.mp4&quot; type=&quot;video/mp4&quot;&gt;</strong>
&lt;/video&gt;
</pre>

<div class="aside note">
Browsers don't speculate about which <code>&lt;source&gt;</code> is optimal, so the order
of <code>&lt;source&gt;</code>s matters. For example, if you specify an MP4 video first and the
browser supports WebM, browsers will skip the WebM <code>&lt;source&gt;</code> and use the MPEG-4
instead. If you prefer a WebM <code>&lt;source&gt;</code> be used first, specify it first!
</div>

## Preview

-  Click on the **Show Live** button.

The experience should look the same. So far so good.  

## Verify with Lighthouse

With the live site open:
1. Open Chrome DevTools by pressing `CMD + OPTION + i / CTRL + SHIFT + i`.
1. Click on the **Audits** tab.
1. Check the **Performance** checkbox.
1. Click **Run audits**.

You should see that the "Use video formats for animated content" audit is now
passing! Woohoo! 💪
