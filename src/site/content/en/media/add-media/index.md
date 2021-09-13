---
layout: post
title: Add media to a web page
authors:
  - joemedley
  - derekherman
description: |
  Embed a media file in a web page using the <video> and <source> tags.
date: 2020-06-19
updated: 2021-07-05
tags:
  - media
  - video
---

In this section you'll learn how to embed a media file in a web page using the
`<video>` and `<source>` tags, how to add captions to a video for the
hearing-impaired, and some general concepts for using media frameworks.
Additionally, you'll learn about using preload to speed up playback start, and
we will discuss how we built an updated demo PWA with offline adaptive
streaming capabilities called Kino.

This section assumes you have a video file that is ready for embedding in a web
page. A `.mov` file downloaded from a camera will not work. If that's all you
have, see [Prepare media files for the web](/prepare-media/) then come back.

This section covers these topics.

* In [The &lt;video> and &lt;source> tags](/video-and-source-tags/) you'll
  learn specifically how to embed a media file in a web page.
* In [Media accessibility](/media-accessibility/) you'll learn to add captions
  to a media file for hearing impaired.
* In [Media frameworks](/media-frameworks/) you'll learn basics about using
  media frameworks like Shaka Player, JW Player, and Video.js.
* In [Fast playback with audio and video preload](/fast-playback-with-preload/)
  you'll learn to accelerate your media playback by actively preloading
  resources.
* In [PWA with offline streaming](/pwa-with-offline-streaming/) you'll learn how
  we built an updated demo PWA that is capable of adaptive streaming and offline
  playback without using frameworks. Plus you can play with source code.

{% Aside %}
Be sure not to skip the accessibility section. The technical aspects of
supporting accessibility are not that difficult. They are also a regulatory or
legal requirement in many places.
{% endAside %}

There is a lot of ground to cover in this section, get started by learning
how to use the [&lt;video> and &lt;source> tags](/video-and-source-tags/).
