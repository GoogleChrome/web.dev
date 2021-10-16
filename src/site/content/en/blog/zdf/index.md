---
layout: post
title: How ZDF created a video PWA with offline and dark mode
subhead: >
  Learn how ZDF created a progressive web app (PWA) with modern
  features like offline support, installability, and dark mode.
authors:
  - scottfriesen
  - martinschierle
date: 2020-10-07
hero: image/admin/8NYB8FoRFfEIIurhIwsS.jpg
alt: A person looking at the ZDF PWA on a smartphone.
description: >
  Learn how ZDF created a progressive web app (PWA) with modern features
  like offline support, installability, and dark mode.
tags:
  - blog
  - case-study
  - capabilities
  - progressive-web-apps
---

When broadcaster ZDF was considering redesigning their frontend technology
stack, they decided to take a closer look at [Progressive Web Apps](/pwa/) for their
streaming site [ZDFmediathek](https://pwa.zdf.de/). Development agency
[Cellular](https://www.cellular.de/) took on the challenge to build a web-based
experience that is on par with ZDF's platform-specific iOS and Android apps. The
PWA offers installability, offline video playback, transition animations, and a
dark mode.

## Adding a service worker

A key feature of a PWA is offline support. For ZDF most of the heavy lifting is done by
[Workbox](/workbox/), a set of libraries
and Node modules that make it easy to support different caching strategies. The
ZDF PWA is built with TypeScript and React, so it uses the Workbox library
already built into
[create-react-app](https://reactjs.org/docs/create-a-new-react-app.html) to
precache static assets. This lets the application focus on making the dynamic
content available offline, in this case the videos and their metadata.

The basic idea is quite simple: fetch the video and store it as a blob in
IndexedDB. Then during playback, listen for online/offline events, and switch to
the downloaded version when the device goes offline.

Unfortunately things turned out to be a little more complex. One of the project
requirements was to use the official ZDF web player which doesn't provide any
offline support. The player takes a content ID as input, talks to the ZDF API,
and plays back the associated video.

This is where one of the web's most powerful features comes to the rescue:
[service workers](/service-worker-mindset/).

The service worker can intercept the various requests done by the player and
respond with the data from IndexedDB. This transparently adds offline
capabilities without having to change a single line of the player's code.

Since offline videos tend to be quite large, a big question is how many of them
can actually be stored on a device. With the help of the [StorageManager
API](/storage-for-the-web/#how-much) the app can estimate the
available space and inform the user when there is insufficient space before even
starting the download. Unfortunately Safari isn't on the list of browsers
implementing this API and at the time of writing there wasn't much up-to-date
information about how other browsers applied quotas. Therefore, the team wrote a
[small utility](https://cellular.github.io/quota) to test the behavior on
various devices. By now a [comprehensive
article](/storage-for-the-web/) exists that sums up all the
details.

## Adding a custom install prompt

The ZDF PWA offers a custom in-app installation flow and prompts users to
install the app as soon as they want to download their first video. This is a
good point in time to prompt for install because the user has expressed a clear intention to
use the app offline.

<figure class="w-figure">
  <div class="w-columns">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/sj4J2JMlYdgf4BrhaRsT.jpg", alt="Custom invitation to install.", width="800", height="1595" %}
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FT4Xt5xpjCp57C8BwLtn.jpg", alt="Custom install prompt being triggered when downloading a video for offline consumption.", width="800", height="1595" %}
  </div>
  <figcaption class="w-figcaption">Custom install prompt being triggered when downloading a video for offline consumption.</figcaption>
</figure>

## Building an offline page to access downloads

When the device is not connected to the internet and the user navigates to a
page that is not available in offline mode, a special page is shown instead that
lists all videos that have previously been downloaded or (in case no content has
been downloaded yet) a short explanation of the offline feature.

<figure class="w-figure">
  <div class="w-columns">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FcWDhtuSSpHg04krFqUD.png", alt="Offline page showing all content available for watching offline.", width="800", height="1418" %}
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PUvFyyaVfhh7PFyXDwCo.png", alt="Offline page showing that no content is available for watching offline.", width="800", height="1423" %}
  </div>
  <figcaption class="w-figcaption">Offline page showing all content available for watching offline.</figcaption>
</figure>

## Using frame loading rate for adaptive features

To offer a rich user experience the ZDF PWA includes some subtle transitions
that happen when the user scrolls or navigates. On low-end devices such
animations usually have the opposite effect and make the app feel sluggish and
less responsive if they don't run at 60 frames per second. To take this into
account the app measures the actual frame rate via `requestAnimationFrame()` while
the application loads and disables all animations when the value drops below a
certain threshold.

```js
const frameRate = new Promise(resolve => {
  let lastTick;
  const samples = [];

  function measure() {
    const tick = Date.now();
    if (lastTick) samples.push(tick - lastTick);
    lastTick = tick;
    if (samples.length < 20) requestAnimationFrame(measure);
    else {
      const avg = samples.reduce((a, b) => a + b) / samples.length;
      const fps = 1000 / avg;
      resolve(fps);
    }
  }
  measure();
});
```

Even if this measurement provides only a rough indication of the device's
performance and varies on each load, it was still a good basis for
decision-making. It's worth mentioning that depending on the use case there are
[other techniques for adaptive loading](/adaptive-loading-with-service-workers/)
that developers can implement. One great advantage of this approach is that it
is available on all platforms.

## Dark mode

A popular feature for modern mobile experiences is
[dark mode](/prefers-color-scheme/).
Especially when
watching videos in low ambient light many people prefer a dimmed UI. The ZDF PWA
not only provides a switch that allows users to toggle between a light and a
dark theme, it also reacts to changes of the OS-wide color preferences. This way
the app will automatically change its appearance on devices that have set up a
schedule to change the theme base on the time of day.

## Results

The new progressive web app was silently launched as a public beta in March 2020
and has received a lot of positive feedback since then. While the beta phase
continues, the PWA still runs under its own temporary domain. Even though the
PWA wasn't publicly promoted there is a steadily growing number of users. Many
of these are from the Microsoft Store which allows Windows 10 users to discover
PWAs and install them like platform-specific apps.

## What's next?

ZDF plans to continue adding features to their PWA, including login for
personalization, cross-device and platform viewing, and push notifications.
