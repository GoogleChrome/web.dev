---
layout: post
title: 'Designcember Calculator'
authors:
  - thomassteiner
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/kKhOZkehYIQ49GQOXrsw.png
alt: 'Designcember'
thumbnail: image/kheDArv5csY6rvQUJDbWRscckLr1/qRLa7xFsolDUbEfyugoW.png
subhead: >
  A skeuomorphic attempt at recreating a solar calculator on the web.
description: >
  A skeuomorphic attempt at recreating a solar calculator on the web that makes use of the ambient
  light sensor and the window controls overlay feature.
date: 2021-12-26
tags:
  - blog
  - capabilities
  - css
---

I am a kid of the eighties. A thing that was all the rage back when I was in highschool were solar calculators.
We were all given a [TI-30X SOLAR](https://en.wikipedia.org/wiki/TI-30#/media/File:TI-30X_SOLAR,_2.jpg),
and I have fond memories of us benchmarking our calculators against each other by calculating the factorial of 69, the highest
number the TI-30X could deal with. (The speed variance was very measurable, I have still no idea why.)

Now, almost 28 years later, I thought it would be a fun Designcember challenge to recreate the calculator in HTML, CSS, and JavaScript.
Being not much of a designer, I did not start from scratch, but with a [CodePen](https://codepen.io/sassjajc/pen/zNJgKg) by
[Sassja Ceballos](https://codepen.io/sassjajc).

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/DvhjfNHAYtSgJ6jK8uoI.png", alt="CodePen view with stacked HTML, CSS, and JS panels on the left and the calculator preview on the right.", width="800", height="470" %}

While not a bad start, I decided to pump it up for full skeuomorphic awesomeness. The first step was to make it a PWA so it could be installed.
I maintain a [baseline PWA template on Glitch](https://glitch.com/edit/#!/baseline-pwa) that I remix whenever I need a quick demo.
Its service worker will not win you any coding award and it is definitely _not_ production-ready, but it is sufficient to trigger Chromium's mini infobar so the app can be installed.

```js
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
  event.waitUntil(
    (async () => {
      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      try {
        const response = await event.preloadResponse;
        if (response) {
          return response;
        }
        return fetch(event.request);
      } catch {
        return new Response('Offline');
      }
    })(),
  );
});
```

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/9iqLIfTrHYv0O8J1tBrr.png", alt="Designcember Calculator running in standalone mode with the Window Controls Overlay feature active. The display spells 'Google' in the calculator alphabet.", width="800", height="1291" %}
