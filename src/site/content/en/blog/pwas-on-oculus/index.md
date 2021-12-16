---
layout: post
title: 'PWAs on Oculus Quest'
authors:
  - thomassteiner
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/B7zNhOVvzK3O71sQyLKe.jpg
alt: 'Person wearing an Oculus Quest 2 device with a PWA sticker on it spreading their arms with Quest controllers in both hands.'
subhead: >
  The Oculus Quest 2 is a virtual reality (VR) headset created by Oculus, a division
  of Meta. Developers can now build and distribute 2D apps that take advantage of Oculus Quest's
  multitasking feature using Progressive Web Apps.
description: >
  The Oculus Quest 2 is a virtual reality (VR) headset created by Oculus, a division
  of Meta. Developers can now build and distribute 2D apps that take advantage of Oculus Quest's
  multitasking feature using Progressive Web Apps. This article describes the experience and how
  to test your PWA on the Oculus Quest 2.
date: 2021-12-09
tags:
  - blog
  - capabilities
  - progressive-web-apps
---

## The Oculus Quest&nbsp;2

On October&nbsp;28, 2021, [Jacob Rossi](https://twitter.com/jacobrossi), Product Management Lead at Meta (Oculus), [shared](https://twitter.com/jacobrossi/status/1453776349299019778) that PWAs are coming to Oculus Quest.
The Oculus Quest&nbsp;2 is a virtual reality (VR) headset created by Oculus, a division of Meta.
It is the successor to the company's previous headset, the Oculus Quest.
The device is capable of running as both a standalone headset with an internal, Android-based operating system, and with Oculus-compatible VR software running on a desktop computer when connected over USB or Wi-Fi.
It uses the Qualcomm Snapdragon XR2 system on a chip with 6&nbsp;GB of RAM. The Quest&nbsp;2's display is a singular fast-switch LCD panel with a 1832×1920 per eye resolution, which can run at a refresh rate of up to 120&nbsp;Hz.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/g0IQmlLaOiLWqwQuvnhQ.jpeg", alt="Oculus Quest 2 device with controllers.", width="800", height="304" %}

## Browsers on the Oculus Quest&nbsp;2

Currently there are two browsers available for the Oculus Quest&nbsp;2, [Firefox Reality](https://www.oculus.com/experiences/quest/2180252408763702/) and
the built-in [Oculus Browser](https://www.oculus.com/experiences/quest/1916519981771802).
This article focuses on the latter. The Oculus website [introduces](https://developer.oculus.com/documentation/web/browser-intro/) the browser as follows.

_"Oculus Browser provides support for the latest web standards and other technologies to help you create VR experiences on the web. Today's 2D web sites work great in Oculus Browser because it's powered by the Chromium rendering engine. It's further optimized for Oculus headsets to get the best performance and to enable web developers take advantage of the full potential of VR with new APIs, like WebXR. Through WebXR, we’re opening the doors to the next frontier of the web."_

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/R4SwrV05Pqap583Rzr4L.jpeg", alt="Oculus Browser with three browser windows open.", width="800", height="450" %}

### User agent

The browser's user agent string at the time of writing can be broken down as follows.

```
Mozilla/5.0 (X11; Linux x86_64; Quest 2)
AppleWebKit/537.36 (KHTML, like Gecko)
OculusBrowser/18.1.0.2.46.337441587
SamsungBrowser/4.0
Chrome/95.0.4638.74
VR
Safari/537.36
```

If the user switches to mobile mode, `VR` changes to `Mobile VR`. As you can see, the current version 18.1.0.2.46.337441587 of the Oculus Browser is based on Chrome 95.0.4638.74, that is only one version behind the current stable version of Chrome, which is 96.0.4664.110.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/E3929PxcGa7GCxKoTffh.png", alt="Oculus Browser About page.", width="800", height="449" %}

## User interface

The browser's user interface that you can see in the screenshot above has the following features (top row from left to right):

- Back button
- Reload button
- Site information
- URL bar
- Create bookmark button
- Resize button with narrow, medium, wide options and a zoom feature
- Request mobile website button
- Menu button with the following options:
  - Enter private mode
  - Close all tabs
  - Settings
  - Bookmarks
  - Downloads
  - History
  - Clear browsing data

The bottom row includes the following features:

- Close button
- Minimize button
- Three dots button with back, forward, and reload options

## Refresh rate

For Oculus Quest&nbsp;2, Oculus Browser renders both 2D&nbsp;web page content and WebXR at 90&nbsp;Hz refresh rate.
When watching fullscreen media, Oculus Browser optimizes the device refresh rate based on the frame rate of the video.

## Browser window size

For 2D&nbsp;websites, users can resize the width of the content anywhere from 484&nbsp;px to 1998&nbsp;px, with a default width of 1000&nbsp;px. The height of the webpage content is 505&nbsp;px.

## PWAs made by Meta

Multiple Meta divisions have created PWAs for the Oculus Quest&nbsp;2, namely [Instagram](https://www.oculus.com/experiences/quest/6102857836422862) and [Facebook](https://www.oculus.com/experiences/quest/6126469507395223).
PWAs run in standalone app windows

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/m5NoDaB7hyFOvrxHF9oS.jpeg", alt="Facebook Oculus Quest 2 app.", width="800", height="450" %}

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/gxYCh0Z9R3vXRU0MWsIB.jpeg", alt="Instagram Oculus Quest 2 app", width="800", height="450" %}

## Acknowledgements

Oculus Quest&nbsp;2 photo by [Maximilian Prandstätter](https://flickr.com/people/191783462@N03/) on [Flickr](https://flickr.com/photos/191783462@N03/50844634326).
Oculus Store images of [Instagram](https://www.oculus.com/experiences/quest/6102857836422862), [Facebook](https://www.oculus.com/experiences/quest/6126469507395223), and [Oculus Browser](https://www.oculus.com/experiences/quest/1916519981771802) apps by Meta.
