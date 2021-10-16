---
title: PWA users are 2.5x more likely to purchase Gravit Designer PRO
subhead: >
  PWA users are also 24% more active than all other install types,
  become repeats users 31% more than all other platforms, and more.
date: 2020-12-08
hero: image/admin/KSsQ4GA6JGIIQom1sSFl.png
thumbnail: image/admin/RctR9tZPmHeBUrsuMFCh.png
alt: Gravit Designer's logo.
description: >
  PWA users are also 24% more active than all other install types,
  become repeat users 31% more than all other platforms, and more.
tags:
  - blog
  - case-study
  - progressive-web-apps
authors:
  - rezakazemi
---

<div class="w-stats">
  <div class="w-stat">
    <p class="w-stat__figure">+24<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">PWA users have 24% more active sessions than all other platforms</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">+31<sub class="w-stat__sub">%</sub></p>
    <p class="w-stat__desc">PWA accounts for 31% more repeat users than all other platforms</p>
  </div>
  <div class="w-stat">
    <p class="w-stat__figure">2.5<sub class="w-stat__sub">x</sub></p>
    <p class="w-stat__desc">PWA users are 2.5x more likely to purchase Gravit Designer PRO</p>
  </div>
</div>

{% Aside %}
  Reza is a product manager at Corel.
{% endAside %}

Corel Corporation's [Gravit Designer](https://www.designer.io/en/) is a powerful
vector design tool. With roots as a startup, Gravit Designer joined Corel's
extensive product portfolio in 2018, and serves tens of thousands of daily
active users demanding rich, affordable, and accessible vector illustration
software. Corel builds a host of creative and productivity software including
[CorelDRAW](https://www.coreldraw.com/), [Corel
PHOTO-PAINT](https://www.coreldraw.com/en/pages/photo-paint/), [Corel
Painter](https://www.painterartist.com/),
[Parallels](https://www.parallels.com), and more.

Gravit Designer's target audience is creators of all stripes - from students
learning about vector illustration to seasoned designers looking for a
fully-functional solution. Corel has always wanted to meet
designers and creatives where they are, on their platform of choice, and Gravit
Designer allows us to deliver powerful vector illustration tools via the web.

Progressive web apps (PWAs) are of particular interest to Gravit Designer and
Corel's Online Graphics initiatives, as they help bridge the gap between web
apps and traditional desktop applications. Progressive web apps are quickly
becoming the
[preferred way to deliver desktop experiences](https://chromeos.dev/en/web/desktop-progressive-web-apps)
for traditional web apps. Chrome OS and the Play Store also present a great
opportunity to Corel by offering secure in-app payments, PWA support for
bringing the web app experience to the desktop in a seamless manner ([local
font](/local-fonts/) and [file system
access](/file-system-access/) are particularly relevant for us),
and most importantly, greater visibility to our web apps for more users.
Students and educators can install the Chrome OS version of Gravit Designer with
ease, and enjoy the same powerful features regardless of platform.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CPOALQnJw0G03EHczYIh.png", alt="A screenshot of Gravit Designer.", width="800", height="476", class="w-screenshot w-screenshot--filled" %}
</figure>

## Engineering challenges

There are a great many engineering challenges with supporting multiple
platforms, particularly web and desktop. In our case, we take great care when
deciding to support a new platform, as our app began its life on the web. When
supporting desktop platforms, we typically have to wrap our application in a
supporting container, which brings its own set of challenges depending on the
host platform.

Our users want an experience that carries over seamlessly from one platform to
another. This is vital to many of our customers who might switch from web, to
desktop, to Chromebooks, and back to web in the course of a design. Furthermore,
our users want their work to travel with them, unencumbered by their situation.
Whether on-the-go, offline, or connected to the internet, they want their
documents accessible in the Gravit Cloud, for example.

At Corel, we have decades of experience porting software to many platforms and
navigating the challenges therein. There is a balancing act in ensuring proper
performance, feature parity, and platform-specific UI support. Gravit Designer
is no stranger to these challenges.

## Gravit Designer's desktop PWA

With some platforms, the answer will be wrapping a web app in a
platform-specific container application for the foreseeable future (e.g.
Electron). However, with PWAs and Chrome OS we can start to deliver on the
promise of a web app ported to a desktop experience with minimal disruption. 

For Gravit Designer, our team could see the growing value of PWAs, and made
great strides to support it as an enabling technology going forward. The
potential of several major platforms supporting PWA (namely Chrome OS, iOS,
Windows, and more) could usher in a new era of cross-platform support for
certain applications. Since Chrome was the clear leader in browsers among our
users, and provided the best user experience for PWA, we decided to investigate
the work involved in building out a PWA version of Gravit Designer.

The team began by first creating a proof-of-concept to understand the effort
required. Next came the development effort associated with local font and local
file system support. In the end, we had to stage our support for local fonts.
Once improvements were made to file loading times, installation, and
performance, we felt more comfortable moving past the proof-of-concept phase and
targeting PWA support for a major release.

## Impact

Since launching our desktop PWA, we've seen a steady increase in installations,
and we're excited by the prospect of releasing the PWA version with enhanced
platform-specific features for Chrome OS and other platforms. In fact, the
standard PWA version of Gravit Designer now leads downloads from the Microsoft
Store and Linux installations, so we're looking forward to even more
growth.

### Key figures

* 18% of total Chrome OS users have installed our PWA (PWA installs across all
  operating systems account for ~5% of our total).
* PWA users are 24% more active than all other install types (more
  sessions per user).
* PWA accounts for 31% more repeat users than all other platforms.
* PWA users are 2.5x more likely to purchase Gravit Designer PRO.
* PWA makes up about 5% of all new user accounts, and growing.

## Summary

The growth of PWA installations in general-past other more established
platforms-points to a future where we could offer a satisfying desktop
experience without the need for platform-specific wrappers on a multitude of
platforms. Our work with Google on PWAs and Chrome OS is vital to this aim, as
more and more features are supported.
