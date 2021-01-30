---
title: WebRTC is now a W3C and IETF standard
subhead: >
  A brief overview of the history, architecture, use cases, and future of WebRTC.
description: >
  A brief overview of the history, architecture, use cases, and future of WebRTC.
date: 2021-01-26
updated: 2021-01-26
authors:
  - huib
tags:
  - blog
  - media
---

The process of defining a web standard is a lengthy process that ensures usefulness, consistency and
compatibility across browsers. Today [the W3C and
IETF](https://www.w3.org/2021/01/pressrelease-webrtc-rec.html.en) mark the completion of perhaps one
of the most important standards during the pandemic: WebRTC.

{% Aside %}
  Check out the [Real-time communication with WebRTC](https://codelabs.developers.google.com/codelabs/webrtc-web)
  codelab for a hands-on walkthrough of implementing WebRTC.
{% endAside %}

## History {: #history }

WebRTC is a platform giving browsers, mobile apps, and desktop apps real-time communication
capabilities, typically used for video calling. The platform consists of a comprehensive set of
technologies and standards. Google initiated the idea to create WebRTC in 2009, as an alternative to
Adobe Flash and desktop applications that couldn't run in the browser. The previous generation of
browser-based products were built on top of licensed proprietary technology. Various products were
built with this technology, including Hangouts. Google then acquired the companies it had been
licensing the technology from and made it available as the open source WebRTC project. This codebase
is integrated in Chrome and used by the majority of applications using WebRTC. Together with other
browser vendors and industry leaders such as Mozilla, Microsoft, Cisco, and Ericsson, the
standardization of WebRTC was kicked off in both the W3C and IETF.  In 2013, Mozilla and Google
[demonstrated](https://blog.chromium.org/2013/02/hello-firefox-this-is-chrome-calling.html) video
calling between their browsers. Through the evolution of the standard, many architectural
discussions had led to implementation differences across browsers and challenged compatibility and
interoperability. Most of these disagreements were ultimately settled as the standard became
finalized in the past years. The WebRTC specification is now accompanied with a
[full set of platform tests](https://wpt.fyi/results/webrtc?label=experimental&label=master&aligned)
and tools to address compatibility and browsers have largely adapted their implementations
accordingly. This brings an end to a challenging period where web developers had to continuously
adopt their services to different browser implementations and specification changes.

## Architecture and functionality {: #architecture }

The [`RTCPeerConnection` API](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection) is
the central part of the WebRTC specification. `RTCPeerConnection` deals with connecting two
applications on different endpoints to communicate using a peer-to-peer protocol. The `PeerConnection`
API interacts closely with
[`getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) for
accessing camera and microphone, and
[`getDisplayMedia`](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia) for
capturing screen content. WebRTC allows you to send and receive streams that include audio and/or
video content, as well as arbitrary binary data through the `DataChannel`. The media functionality for
processing, encoding, and decoding audio and video provides the core of any WebRTC implementation.
WebRTC supports various audio codecs, with Opus being the most used and versatile. WebRTC
implementations are required to support both Google's free-to-use VP8 video codec and H.264 for
processing video. WebRTC connections are always encrypted, which is achieved through two existing
protocols: DTLS and SRTP.  WebRTC leans heavily on existing standards and technologies, from video
codecs (VP8,H264), network traversal (ICE), transport (RTP, SCTP), to media description protocols
(SDP). This is tied together in over 50 RFCs.

## Use cases: when it's a matter of milliseconds {: #use-cases }

WebRTC is widely used in time-critical applications such as remote surgery, system monitoring, and
remote control of autonomous cars, and voice or video calls built on UDP where buffering is not
possible. Nearly all browser-based video callings services from companies such as Google, Facebook,
Cisco, RingCentral, and Jitsi use WebRTC. Google Stadia and NVIDIA GeForce NOW use WebRTC to get the
stream of gameplay from the cloud to the web browser without perceivable delay. 

## Pandemic puts focus on video calling performance {: #performance }

Over the past year, WebRTC has seen a 100X increase of usage in Chrome due to increased video
calling from within the browser. Recognizing that video calling has become a fundamental part of
many people's lives during the pandemic, browser vendors have begun to optimize the technologies
that video calling depends on. This was particularly important as resource demanding large meetings
and video effects in video meetings became more common when employees and students started to work
and study from home.  In the past year Chrome has become up to 30% more battery friendly for video
calling, with more optimizations to come for heavy usage scenarios. Mozilla, Apple, and Microsoft
all [have made significant improvements](https://www.youtube.com/watch?v=YZROn-WsyO4) in their
implementation of WebRTC through the pandemic, in particular in making sure they adhere to the now
formalized standard.

## The future of WebRTC {: # future }

While WebRTC is now completed as a W3C standard, improvements continue. The new video codec AV1
which
[saves up to 50% of bandwidth](https://blog.google/products/duo/4-new-google-duo-features-help-you-stay-connected/)
is becoming available in WebRTC and web browsers. Continued improvements in the open source code
base are expected to further reduce delay and improve the quality of video that can be streamed.
[WebRTC NV](https://www.w3.org/TR/webrtc-nv-use-cases/) gathers the initiative to create
supplementary APIs to enable new use cases. These consist of extensions to existing APIs to give
more control over existing functionality such as [Scalable Video
Coding](https://www.w3.org/TR/webrtc-svc/) as well as APIs that give access to
[lower-level components](https://github.com/w3c/mediacapture-insertable-streams/blob/main/explainer.md).
The latter gives more flexibility to web developers to innovate by integrating high-performance
custom WebAssembly components. With emerging 5G networks and demand for more interactive services,
we're expecting to see a continued increase of services building on top of WebRTC in the year to
come.
