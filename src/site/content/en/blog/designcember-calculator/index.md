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

## The challenge

I am a kid of the eighties. A thing that was all the rage back when I was in highschool were solar calculators.
We were all given a [TI-30X SOLAR](https://en.wikipedia.org/wiki/TI-30#/media/File:TI-30X_SOLAR,_2.jpg),
and I have fond memories of us benchmarking our calculators against each other by calculating the factorial of 69, the highest
number the TI-30X could deal with. (The speed variance was very measurable, I have still no idea why.)

Now, almost 28 years later, I thought it would be a fun Designcember challenge to recreate the calculator in HTML, CSS, and JavaScript.
Being not much of a designer, I did not start from scratch, but with a [CodePen](https://codepen.io/sassjajc/pen/zNJgKg) by
[Sassja Ceballos](https://codepen.io/sassjajc).

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/DvhjfNHAYtSgJ6jK8uoI.png", alt="CodePen view with stacked HTML, CSS, and JS panels on the left and the calculator preview on the right.", width="800", height="470" %}

## Make it installable

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

## Blending in on mobile

Now that the app is installable, the next step is to make it blend in as much as possible. On mobile, this can be done by
setting the display mode to `fullscreen` in the Web App Manifest.

```json
{
  "display": "fullscreen"
}
```

On devices with a camera hole or notch, [tweaking the viewport](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)
so that the content covers the whole screen makes the app look great.

```html
<meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
```

## Blending in on desktop

On desktop, there is a cool feature I can make use of, [Window Controls Overlay](/window-controls-overlay/), which allows me to
put content in the title bar of the app window. The first step is to override the display mode fallback sequence so it tries to use
`window-controls-overlay` first when it is available.

```json
{
  "display_override": ["window-controls-overlay"]
}
```

This makes the title bar effectively go away and the content moves up into the title bar area as if title bar were not there.
My idea is to move the skeuomorphic solar cell up into the title bar and the rest of the calculator UI down accordingly, which I can do with some CSS
that makes use of the `titlebar-area-*` environment variables. You will notice that all the selectors carry a `wco` class, which will be relevant a couple of paragraphs down.

```css
#calc_solar_cell.wco {
  position: fixed;
  left: calc(0.25rem + env(titlebar-area-x, 0))
  top: calc(0.75rem + env(titlebar-area-y, 0));
  width: calc(env(titlebar-area-width, 100%) - 0.5rem);
  height: calc(env(titlebar-area-height, 33px) - 0.5rem);
}

#calc_display_surface.wco {
  margin-top: calc(env(titlebar-area-height, 33px) - 0.5rem);
}
```

Up next, I need to decide which elements to make draggable, since the title bar that I would usually use for dragging is not available.
In the style of a classic widget, I can even decide to make the entire calculator draggable by applying `(-webkit-)app-region: drag`, apart from the buttons, which get `(-webkit-)app-region: no-drag` so they cannot be used to drag.

```css
#calc_inside.wco,
#calc_solar_cell.wco {
  -webkit-app-region: drag;
  app-region: drag;
}

button {
  -webkit-app-region: no-drag;
  app-region: no-drag;
}
```

The final step is to make the app reactive to window controls overlay changes.
In a true progressive enhancement approach, I only load the code for this feature when the browser supports it.

```js
if ('windowControlsOverlay' in navigator) {
  import('/wco.js');
}
```

Whenever the window controls overlay geometry changes, I make some modifications to the app to make it look good.
Namely, I apply the `wco` class to some elements, so my CSS from above kicks in,
and I also change the theme color. I can detect if the window controls overlay is visible by checking the `navigator.windowControlsOverlay.visible` property.

```js
const meta = document.querySelector('meta[name="theme-color"]');
const nodes = document.querySelectorAll(
  '#calc_display_surface, #calc_solar_cell, #calc_outside, #calc_inside',
);

const toggleWCO = () => {
  if (!navigator.windowControlsOverlay.visible) {
    meta.content = '';
  } else {
    meta.content = '#385975';
  }
  nodes.forEach((elem) => {
    elem.classList.toggle('wco', navigator.windowControlsOverlay.visible);
  });
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

navigator.windowControlsOverlay.ongeometrychange = debounce((e) => {
  toggleWCO();
}, 250);

toggleWCO();
```

Now with all this in place, I can get a calculator widget that feels almost like one of the oldschool [Winamp&nbsp; themes](https://en.wikipedia.org/wiki/Winamp#/media/File:Winamp5.png). I can now freely place the calculator on my desktop and activate the window controls feature by clicking the chevron in the upper right corner.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/9iqLIfTrHYv0O8J1tBrr.png", alt="Designcember Calculator running in standalone mode with the Window Controls Overlay feature active. The display spells 'Google' in the calculator alphabet.", width="267", height="430" %}

## An actually working solar cell

For the ultimate geekery, I of course need to make the solar cell actually work.
The calculator should only be functioning if there is enough light.
