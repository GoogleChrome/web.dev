---
layout: post
title: What is a media experience?
authors:
  - joemedley
description: |
  Videos can be fun and informative. For a good user experience, videos need to
  meet a number of technical requirements.
date: 2017-06-30
updated: 2020-08-27
tags:
  - media
  - video
---

Users like media, especially videos; they can be fun and informative. On mobile
devices, videos can be an easier way to consume information than text. For a
good user experience, videos should not need more than the available bandwidth.
Users should be able to use them no matter what device they're viewing them
with. Users should never need to wait for download. Who likes it when they press
play and nothing happens?

You've no doubt consumed video on your own device. Which means that nothing in
that last paragraph surprises you. Now you need to learn how to put a video or
other media file on your own website. The technical requirements of that work
should be in service to the user experience. Those technical requirements are:

* Versions of a media file in common web-friendly formats containing both audio
  and video streams.
* A resolution appropriate for your users' devices.
* A bitrate that doesn't overload your users' network bandwidth.
* (Optional) Encryption.
* Viewable on all major browsers using appropriate technologies.

Our [media](/media) collection will help you achieve these technical
requirements. Don't worry if you don't know what these technical requirements
mean. I'll explain them.

There are four approaches you can take displaying video on a site.

* Upload your content to a hosting site such as
  [YouTube](https://www.youtube.com/) or [Vimeo](https://vimeo.com/). These
  options do not preclude displaying from within your website.
* Basic embedding using the HTML `<video>` and `<audio>` elements.
* More full-featured embedding using a video library such as [Google's Shaka
  Player](https://github.com/google/shaka-player), [JW
  Player](https://developer.jwplayer.com/), or [Video.js](http://videojs.com/).
* Building your own media streaming application.

This site only covers the second option, at least for now. The last item,
building a media streaming application is beyond the scope of this site.
Frankly, it requires a team of expert programmers and thousands of human-hours
of work. Unless your goal is to enter that market as a competitor, you're better
off using one of the other methods.

This site has three parts. In the first, I'll provide information prerequisite
to adding media to your site. This includes explaining how media files are put
together and basics about the applications you'll need to prepare your files for
the web. The second section explains how to prepare your files. In the last, I
show how to embed a media file in a web page and make it accessible.
