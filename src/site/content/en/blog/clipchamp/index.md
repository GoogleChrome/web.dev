---
title: Clipchamp's video editor PWA installs see a 97% monthly growth
subhead: >
  How PWAs, WebAssembly, and Chrome OS are helping a web-based video editor
  deliver better performance and a more engaging experience to 12M users.
date: 2020-12-08
hero: image/admin/i9GBgCAOS5eWVBXvOT84.jpg
thumbnail: image/admin/1tHJ6FI8tOIIgRocFkCm.jpg
alt: Clipchamp's logo.
description: >
  How PWAs, WebAssembly, and Chrome OS are helping a web-based video editor
  deliver better performance and a more engaging experience to 12M users.
tags:
  - blog
  - case-study
  - progressive-web-apps
authors:
  - sorenbalko
---

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">97<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Monthly growth in PWA installations</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">2.3<sub class="w-stat__sub">x</sub></p>
    <p class="w-stat__desc">Performance improvement</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">9<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">Higher retention in PWA users</p>
  </div>
</div>

Clipchamp is the in-browser online [video
editor](https://clipchamp.com/en/video-editor/) that empowers anyone to tell
stories worth sharing through video. Around the world, over 12 million creators
use Clipchamp to easily edit videos. We offer simple solutions for making videos,
from intuitive tools like crop and trim, to practical features like our screen
recorder, and even a [meme maker](https://clipchamp.com/en/video-meme-generator/).

## Who uses Clipchamp?

Our users (or everyday editors as we call them) are diverse. No expertise is
necessary to be a video editor with Clipchamp. Specifically, we're currently
noticing sales, support training, and product marketing teams using our webcam
and screen recorder for quick explainer content with added text and GIFs to make
it engaging. We're also observing a lot of small businesses edit and post social
videos while on the move.

### What challenges do they face?

We recognise that video editing can be intimidating at first. The assumption is
that it's hard, probably due to previous frustrating experiences with complex
editing software. In contrast, Clipchamp focuses on ease and simplicity,
providing support with text overlays, stock video and music, templates, and
more.

We find most everyday editors aren't wanting to create motion picture
masterpieces. We talk to our users a lot and are continually reminded that
they're busy and just want to get their story out to the world as quickly and
easily as possible, so this is a focus for us.

## Developing a Clipchamp PWA

At Clipchamp, we're all about empowering people to tell their stories through
video. To live up to this vision, we soon realised that allowing our users to
use their own footage when putting together a video project is important.

That insight put the pressure on Clipchamp's engineering team to come up with a
technology that can efficiently process Gigabyte-scale media files in a web
application. Having network bandwidth constraints in mind, we were quick to rule
out a traditional cloud-based solution. Uploading large media files from a
retail internet connection would invariably introduce massive waiting times
before editing could even begin, effectively resulting in a poor user
experience.

That made us switch to a fully in-browser solution, where all the "heavy
lifting" of video processing is done locally using hardware resources available
on the end user's device. We strategically bet on the Chrome browser and, by
extension, the Chrome OS platform to help us overcome the inevitable challenges
of building an in-browser video creation platform.

Video processing is enormously resource hungry, affecting computer and storage
resources alike. We started out building the first version of Clipchamp on top
of Google's (Portable) Native Client (PNaCl). While eventually phased out, PNaCl
was a great confirmation for our team that web apps can be fast and low latency,
while still running on end user hardware.

When later switching to WebAssembly, we were glad to see Chrome taking the lead
in incorporating post-MVP features such as bulk memory operations, threading,
and most recently: fixed-width vector operations. The latter has been hotly
anticipated by our engineering team, offering us the ability to optimize our
video processing stack to take advantage of [SIMD](https://v8.dev/features/simd)
operations, prevalent on contemporary CPUs. Taking advantage of Chrome's
WebAssembly SIMD support, we were able to speed up some particularly demanding
workloads such as 4K video decoding and video encoding.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9NFi12YDG360SlfMl1OP.png", alt="Encoder performance (1080p, 8.33 sec @ 30 fps). Default preset without SIMD: 25 seconds. Default preset with SIMD: ~13 seconds. Compression preset without SIMD: ~83 seconds. Compression preset with SIMD: ~33 seconds. Quality preset (new!) without SIMD: ~75 seconds. Quality preset with SIMD: ~30 seconds.", width="800", height="495" %}

With little prior experience and in less than a month of effort for one of our
engineers, we managed to improve performance by 2.3x. While still limited to a
Chrome origin trial, we were already able to roll out these SIMD enhancements to
the majority of our users. While our users run wildly different hardware setups,
we were able to confirm a matching performance uplift in production without
seeing any detrimental effects in failure rates.

More recently, we integrated the emerging WebCodecs API, currently available
under another Chrome origin trial. Using this new capability, we will be able to
further improve performance of video decoding on low-spec hardware as found
in many popular Chromebooks.

With a PWA created, it's important to encourage its adoption. As with many web
apps, we've focused on ease of access which includes things like social logins
including Google, quickly getting the user into a place where they can edit
video and then making it easy to export the video. Additionally, we promoted
our PWA install prompts in the toolbar and as a pop-up notice in our menu
navigation.

## Results

Our installable Chrome PWA has been doing really well. We've been so pleased to
see 9% higher retention with PWA users than with our standard desktop users.
Installation of the PWA has been massive, increasing at a rate of 97% a month
since we launched five months ago. And, as mentioned before, the WebAssembly
SIMD enhancements improved performance 2.3x.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/MR7YUGQ4r99r3oG4w0Jx.png", alt="June 2020: ~1K installs. July 2020: ~5K installs. August 2020: ~12K installs. September 2020: ~20K installs. October 2020: ~30K installs.", width="800", height="266", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Clipchamp PWA installs over the last 6 months.
  </figcaption>
</figure>

## Future

We're pleasantly surprised by the engagement and uptake of our PWA. We think
Clipchamp user retention benefited because the PWA is installed and easier to
get to. We also noted the PWA performs better for the editor, which makes it
more compelling and keeps people coming back.

Looking to the future, we're excited about the opportunity Chrome OS provides
for even more users to get more done with less fuss. Specifically, we're excited
about some of the convenience integrations with the local OS when working with
files. We think this will help speed up workflows for our busy everyday editors,
and that's one of our highest priorities.
