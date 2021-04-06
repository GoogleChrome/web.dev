---
title: Introducing PROXX
subhead: A game of proximity, inspired by minesweeper.
authors:
  - kosamari
date: 2019-05-09
hero: image/admin/cQAxElnaPyIPqlB9wkrb.jpg
alt: a logo image of PROXX.
description: |
  PROXX as a minesweeper-like game built as a PWA. It works on a vast variety
  of devices and progressively enhances the visual appearance the more capable
  the device is.
tags:
  - blog
  - PROXX
  - games
---

The team that brought you [squoosh.app](https://squoosh.app) is back! This time,
we built a web-based game called PROXX ([proxx.app](https://proxx.app)). PROXX
is a game of proximity inspired by the legendary game Minesweeper. The game is
situated in the space and your job is to find out where the black holes are. It
works on all kinds of devices—from desktop all the way to feature phones.
Users can play the game using a mouse, keyboard, d-pad even with a screen
reader.

<figure class="w-figure w-figure--fullbleed">
<video controls autoplay loop muted poster="https://storage.googleapis.com/webfundamentals-assets/proxx-announce-blogpost/poster.jpg">
  <source src="https://storage.googleapis.com/webfundamentals-assets/proxx-announce-blogpost/kaios_vp8.webm" type="video/webm; codecs=vp8">
  <source src="https://storage.googleapis.com/webfundamentals-assets/proxx-announce-blogpost/kaios_x264.mp4" type="video/mp4; codecs=h264">
</video>
 <figcaption class="w-figcaption w-figcaption--fullbleed">
    PROXX on a feature phone.
  </figcaption>
</figure>

## Our baseline

Before building this game, we set the following goals and budgets for the
application:

- **Same core experience**: all devices must function the same way
- **Accessible**: mouse, keyboard, touch, d-pad, screen readers
- **Performant**:
  - Less than 25kb of initial payload
  - Less than 5 seconds TTI ([time to interactive](/interactive))
    on slow 3G
  - Consistent 60fps animation

<figure class="w-figure w-figure--fullbleed">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ka9f7OrsFGjsulY1QoYe.jpg", alt="A pixelbook running PROXX", width="800", height="445", class="w-screenshot" %}
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    PROXX on a pixelbook.
  </figcaption>
</figure>

## Web Workers

The game consists of 4 main entities, the core game logic, the UI service, the
state service, and the animation graphics. Since we knew from the get-go we
would have to run heavily animated graphics on the main thread, we moved the
game logic and state service to a web worker in order to keep the main thread as
free as possible.

## Build time pre-render

Our UI is built with [Preact](https://preactjs.com/), as it allows us to hit our
aggressive target for an initial payload that is less than 25kb. In order to
give a good initial loading experience, we decided to pre-render our 1st view.
We prerender at build time using [Puppeteer](https://pptr.dev/) to access the
top page and let preact populate the DOM. The resulting DOM is then serialized
to HTML and saved as index.html

## Canvas for animation, (invisible) DOM For accessibility

We render the game graphics in a canvas using
[WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API). One canvas
is responsible for the background animation and another one canvas for the game
grid on top. We also have an HTML table with buttons for accessibility reasons,
that is on top of both of these canvases, but is made invisible (opacity: 0).
Even though what you see is a canvas rendering of the game state, the player is
interacting with the invisible DOM table, giving us the ability to attach event
listeners and rely on the browser's focus management.

By keeping the DOM element in the canvas, we are able to tap into browsers
built-in accessibility features. For example: by setting `role="grid"` on our game
table, screen readers can announce the row and column of the focused cell
without us having to implement that.

## Rollup for bundling and code splitting

Our total size for the app comes down to 100KB gzipped. Out of that, 20KB is for
the initial payload (index.html). We use [Rollup.js](https://rollupjs.org) for
this project. We have shared dependencies between the main thread and our web
worker, and Rollup can put these shared dependencies in a separate chunk that
only needs to be loaded once. Other bundlers like webpack duplicate the shared
dependencies which results in double-loading.

## Supporting feature phones

Smart feature phones such as [KaiOS](https://www.kaiostech.com/) phones are
rapidly gaining popularity. These are very resource constrained devices, but our
approach of using web workers whenever we can allowed us to make the experience
highly responsive on these phones as well. Since feature phones come with
different input interface (d-pad and number keys, no touchscreen), we also
implemented key-based interface.

<figure class="w-figure w-figure--fullbleed">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/zk0lWvjbZ0V2Shz53d42.jpg", alt="A man playing PROXX on a yellow feature phone", width="800", height="512", class="w-screenshot" %}
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    PROXX on a feature phone.
  </figcaption>
</figure>

## What's next

We had great but busy time building this game in time for Google I/O 2019, so we
will take some well-deserved time off to rest, but plan to come back with more
in-depth documentation on each of these areas of the game.

Until then, please check the talk Mariko gave at I/O on this project.

{% YouTube 'w8P5HLxcIO4' %}

You can browse the code at [the proxx github repo](https://github.com/GoogleChromeLabs/proxx).

Cheers! Surma, Jake, Mariko
