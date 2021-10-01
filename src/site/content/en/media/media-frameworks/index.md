---
layout: post
title: Media frameworks
authors:
  - derekherman
description: |
  Media frameworks come in both the proprietary and open-source variety, and at
  their core are a set of APIs that support audio and/or video playback for
  various container formats and transmission protocols.
date: 2021-07-05
updated: 2021-07-05
tags:
  - media
  # - video
---

There are several ways to add media to a web page. Previously you learned how to
use the standard `<video>` tag. In this article you will learn about a few of the
media frameworks (or libraries) available that you can use to extend or replace
the behavior of the default HTML5 video player.

Media frameworks come in both the proprietary and open-source variety, and at
their core are a set of APIs that support audio and/or video playback for
various container formats and transmission protocols. A good framework has
a modular architecture and provides clear and detailed documentation. Ideally it
should also be relatively easy to set up and use. You might be asking yourself,
"If the HTML5 video player provides most features already then why would I use a
framework or library?" That's a great question, let's dig in.

## Benefits of using a framework

In most situations that are beyond the needs of a basic web page, you are going
to want to use a media framework to serve your content. Unless you are prepared
to develop and maintain a rich feature set like offline playback, streaming,
analytics, picture-in-picture, preview thumbnails, embedding, and monetization
such as fill rate optimization, Ad scheduling, or header bidding to name a few
then you should probably offload that complexity to an existing solution.

This is where media frameworks come in. They provide you with a set of features,
and conditions in which you can use those features, and then you have to decide
which framework is right for your project. In the next article we will discuss
how we built a [PWA with offline streaming] that implements several complex
features. Spoiler alert, it was a lot of work and is still far from being a
production ready solution. Save yourself the headache and use a framework.

There are a lot of options out there to choose from, for now this article will
focus on three, which are [Shaka Player], [JW Player], and [Video.js].

## Shaka Player

According to the documentation, Google's [Shaka Player] is an open-source
JavaScript library for adaptive media. It plays adaptive media formats (such as
[DASH] and [HLS]) in a browser, without using plugins. Instead, Shaka Player
uses the open web standards [MediaSource Extensions] and
[Encrypted Media Extensions].

Shaka Player also supports [offline storage and playback] of media using
[IndexedDB]. Content can be stored on any browser. Storage of licenses
depends on browser support.

There are directions for [basic usage] on the Shaka Player documentation site.
However, in a nutshell to use Shaka Player you first need to create an HTML page
with a video or audio element. Then in your application's JavaScript you
install the polyfills and check for browser support. Once the browser has
confirmed support for Shaka Player a script will create a Player object to wrap
the media element, listen for errors, then load a manifest file. Shaka Player
will take over from there.

With Shaka you will need to host and encode your media files yourself.
Creating a media server is not overly complex, however encoding/transcoding media
can be time-consuming and complicated. You will likely want to offload
this part to a service such as [Zencoder], [Amazon Elastic Encoder], or
[Google Transcoder API] to automate repetitive tasks and speed the process up.

The great thing about the Shaka Player is there is also a really fantastic tool
and media packaging SDK for DASH and HLS packaging and encryption called Shaka
Packager. It can prepare and package media content for online streaming, which
you learned about earlier in [Media conversion](/media-conversion/) and
[Media encryption](/media-encryption/).

## JW Player

If you are looking for an option that provides hosting and encoding/transcoding
services then you might look into [JW Player], but keep in mind that JW Player is
proprietary software. Meaning, you don't have much control over the platform or
roadmap. There is a basic free version where videos are displayed with a watermark,
and a commercial version.

JW Player supports streaming with MPEG-DASH (paid version only), Digital rights
management (DRM) (with Vualto), interactive advertisement, customization of the
interface, and embeds. There is a well documented API and SDK. However, if you
are just looking for a quick and free way to host your media then embedding
YouTube videos are typically going to be your best free option.

## Video.js

According tho their website, [Video.js] is built from the
ground up for an HTML5 world. It supports HTML5 video and modern streaming
formats such as DASH and HLS, as well as YouTube, and Vimeo. It supports
video playback on desktop and mobile devices and looks good everywhere with
CSS-based skins.

There are a few ways to use Video.js, but the easiest is to use the free CDN
version provided by [Fastly]. You can learn more on how to get the player set
up on the [getting started] page. Video.js is a very powerful video player,
and much like Shaka Player you will also need to host and encode your video.
However, one difference is in the plugin system where you can do things like
play YouTube videos in the Video.js player, which can also be customized.

## Other frameworks

There are lots of different frameworks and libraries available, this article
only scratches the surface on what is out there. When choosing a framework you
should consider what features you need for the project and how you plan to host
and encode or transcode your media. Do you need pre-roll Ads or other
monetization strategies? Will your media be available offline? How big or
small is your budget? Or any other number of considerations. Do your research
and ask people in your network for suggestions. There are dozens of other great
options and before you make any choices take some time to pick one that will
be right for your team and avoid creating unnecessary technical debt or
complexity to maintain during the project lifecycle.

Next, you will learn about the [PWA with offline streaming] we built to
demonstrate how to approach and tackle the main challenges that come with
rolling your own solution using just the HTML5 video object without a framework
to handle the heavy lifting.

[PWA with offline streaming]: /pwa-with-offline-streaming/
[Shaka Player]: https://github.com/google/shaka-player
[JW Player]: https://developer.jwplayer.com/
[Video.js]: http://videojs.com/
[DASH]: http://dashif.org/
[HLS]: https://developer.apple.com/streaming/
[MediaSource Extensions]: https://www.w3.org/TR/media-source/
[Encrypted Media Extensions]: https://www.w3.org/TR/encrypted-media/
[IndexedDB]: https://www.w3.org/TR/IndexedDB-2/
[offline storage and playback]: https://shaka-player-demo.appspot.com/docs/api/tutorial-offline.html
[basic usage]: https://shaka-player-demo.appspot.com/docs/api/tutorial-basic-usage.html
[Zencoder]: https://en.wikipedia.org/wiki/Zencoder
[Amazon Elastic Encoder]: https://aws.amazon.com/elastictranscoder
[Google Transcoder API]: https://cloud.google.com/transcoder/docs
[Fastly]: https://videojs.com/getting-started/#videojs-cdn
[getting started]: https://videojs.com/getting-started
