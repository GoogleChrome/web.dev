---
layout: post
title: 'Designcember Calculator'
authors:
  - thomassteiner
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/kKhOZkehYIQ49GQOXrsw.png
alt: 'Designcember'
thumbnail: image/kheDArv5csY6rvQUJDbWRscckLr1/qRLa7xFsolDUbEfyugoW.png
subhead: >
  A skeuomorphic attempt at recreating a solar calculator on the web with the Window Controls
  Overlay API and the Ambient Light Sensor API.
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

I'm a kid of the 1980s. A thing that was all the rage back when I was in high school were solar
calculators. We were all given a
[TI-30X SOLAR](https://en.wikipedia.org/wiki/TI-30#/media/File:TI-30X_SOLAR,_2.jpg) by the school,
and I have fond memories of us benchmarking our calculators against each other by calculating the
factorial of 69, the highest number the TI-30X could handle. (The speed variance was very
measurable, I have still no idea why.)

Now, almost 28 years later, I thought it would be a fun Designcember challenge to recreate the
calculator in HTML, CSS, and JavaScript. Being not much of a designer, I did not start from scratch,
but with a [CodePen](https://codepen.io/sassjajc/pen/zNJgKg) by
[Sassja Ceballos](https://codepen.io/sassjajc).

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/DvhjfNHAYtSgJ6jK8uoI.png", alt="CodePen view with stacked HTML, CSS, and JS panels on the left and the calculator preview on the right.", width="800", height="470" %}

## Make it installable

While not a bad start, I decided to pump it up for full skeuomorphic awesomeness. The first step was
to make it a PWA so it could be installed. I maintain a
[baseline PWA template on Glitch](https://glitch.com/edit/#!/baseline-pwa) that I remix whenever I
need a quick demo. Its service worker will not win you any coding award and it is definitely _not_
production-ready, but it is sufficient to trigger Chromium's mini infobar so the app can be
installed.

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

## Blending with mobile

Now that the app is installable, the next step is to make it blend in with the operating system apps as much as possible. On
mobile, I can do this by setting the display mode to `fullscreen` in the Web App Manifest.

```json
{
  "display": "fullscreen"
}
```

On devices with a camera hole or notch,
[tweaking the viewport](https://webkit.org/blog/7929/designing-websites-for-iphone-x/) so that the
content covers the whole screen makes the app look gorgeous.

```html
<meta name="viewport" content="initial-scale=1, viewport-fit=cover" />
```

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/kEOrYPiDbg6DSTGHeB0C.jpg", alt="Designcember Calculator running fullscreen on a Pixel 6 Pro phone.", width="800", height="773" %}

## Blending with desktop

On desktop, there is a cool feature I can use:
[Window Controls Overlay](/window-controls-overlay/), which allows me to put content in the title
bar of the app window. The first step is to override the display mode fallback sequence so it tries
to use `window-controls-overlay` first when it is available.

```json
{
  "display_override": ["window-controls-overlay"]
}
```

This makes the title bar effectively go away and the content moves up into the title bar area as if
the title bar were not there. My idea is to move the skeuomorphic solar cell up into the title bar
and the rest of the calculator UI down accordingly, which I can do with some CSS that uses
the `titlebar-area-*` environment variables. You will notice that all the selectors carry a `wco`
class, which will be relevant a couple of paragraphs down.

```css
#calc_solar_cell.wco {
  position: fixed;
  left: calc(0.25rem + env(titlebar-area-x, 0));
  top: calc(0.75rem + env(titlebar-area-y, 0));
  width: calc(env(titlebar-area-width, 100%) - 0.5rem);
  height: calc(env(titlebar-area-height, 33px) - 0.5rem);
}

#calc_display_surface.wco {
  margin-top: calc(env(titlebar-area-height, 33px) - 0.5rem);
}
```

Next, I need to decide which elements to make draggable, since the title bar that I would usually
use for dragging is not available. In the style of a classic widget, I can even make the
entire calculator draggable by applying `(-webkit-)app-region: drag`, apart from the buttons, which
get `(-webkit-)app-region: no-drag` so they cannot be used to drag.

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

The final step is to make the app reactive to window controls overlay changes. In a true progressive
enhancement approach, I only load the code for this feature when the browser supports it.

```js
if ('windowControlsOverlay' in navigator) {
  import('/wco.js');
}
```

Whenever the window controls overlay geometry changes, I modify the app to make
it look as natural as possible. It is a good idea to debounce this event, since it can be triggered
frequently when the user resizes the window. Namely, I apply the `wco` class to some elements, so my
CSS from above kicks in, and I also change the theme color. I can detect if the window controls
overlay is visible by checking the `navigator.windowControlsOverlay.visible` property.

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
  nodes.forEach((node) => {
    node.classList.toggle('wco', navigator.windowControlsOverlay.visible);
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

Now with all this in place, I get a calculator widget that feels almost like the classic
[Winamp](https://en.wikipedia.org/wiki/Winamp) with one of the oldschool
[Winamp&nbsp; themes](https://en.wikipedia.org/wiki/Winamp#/media/File:Winamp5.png). I can now
freely place the calculator on my desktop and activate the window controls feature by clicking the
chevron in the upper right corner.

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/9iqLIfTrHYv0O8J1tBrr.png", alt="Designcember Calculator running in standalone mode with the Window Controls Overlay feature active. The display spells 'Google' in the calculator alphabet.", width="267", height="430" %}

## An actually working solar cell

For the ultimate geekery, I of course needed to make the solar cell actually work. The calculator
should only be functioning if there is enough light. The way I modeled this is through setting the
CSS `opacity` of the digits on the display via a CSS variable `--opacity` that I control via
JavaScript.

```css
:root {
  --opacity: 0.75;
}

#calc_expression,
#calc_result {
  opacity: var(--opacity);
}
```

To detect if enough light is available for the calculator to work, I use the
[`AmbientLightSensor`](https://developer.mozilla.org/docs/Web/API/AmbientLightSensor) API. For
this API to be available, I needed to set the `#enable-generic-sensor-extra-classes` flag in
`about:flags` and request the `'ambient-light-sensor'` permission. As before, I use progressive
enhancement to only load the relevant code when the API is supported.

```js
if ('AmbientLightSensor' in window) {
  import('/als.js');
}
```

The sensor returns the ambient light in [lux](https://en.wikipedia.org/wiki/Lux) units whenever a
new reading is available. Based on a
[table of values](https://en.wikipedia.org/wiki/Lux#Illuminance) of typical light situations, I came
up with a very simple formula to convert the lux value to a value between 0 and 1 that I
programmatically assign to the `--opacity` variable.

```js
const luxToOpacity = (lux) => {
  if (lux > 250) {
    return 1;
  }
  return lux / 250;
};

const sensor = new window.AmbientLightSensor();
sensor.onreading = () => {
  console.log('Current light level:', sensor.illuminance);
  document.documentElement.style.setProperty(
    '--opacity',
    luxToOpacity(sensor.illuminance),
  );
};
sensor.onerror = (event) => {
  console.log(event.error.name, event.error.message);
};

(async () => {
  const {state} = await navigator.permissions.query({
    name: 'ambient-light-sensor',
  });
  if (state === 'granted') {
    sensor.start();
  }
})();
```

In the video below you can see how the calculator starts working once I turn the room light up
enough. And there you have it: a skeuomorphic solar calculator that actually works. My good old
time-tested TI-30X SOLAR has come a long way indeed.

{% Video autoplay=true, muted=true, loop=true, playsinline=true, src="video/8WbTDNrhLsU0El80frMBGE4eMCD3/lXUTb872NtCdw7fqrQY3.mp4" %}

## Demo

Be sure to play with the [Designcember Calculator demo](https://designcember-calculator.glitch.me/)
and check out the [source code on Glitch](https://glitch.com/edit/#!/designcember-calculator). (To
install the app, you need to open it in its own window. The embedded version below will not trigger
the mini infobar.)

<!-- Copy and Paste Me -->
<div class="glitch-embed-wrap" style="height: 750px; width: 400px;">
  <iframe
    src="https://designcember-calculator.glitch.me/"
    title="designcember-calculator on Glitch"
    allow="geolocation; microphone; camera; midi; vr; encrypted-media"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

Happy [Designcember](https://designcember.com)!
