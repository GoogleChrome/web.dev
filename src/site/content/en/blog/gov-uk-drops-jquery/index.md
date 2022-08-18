---
title: GOV.UK drops jQuery from their front end.
subhead: |
  GOV.UK dropped their jQuery dependency from their front end. You'll never
  guess what happened. (Yes, you will.)
authors:
  - jlwagner
date: 2022-05-19
description: |
  GOV.UK dropped their jQuery dependency from their front end. You'll never
  guess what happened. (Yes, you will.)
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/hQPjpsIlOA26Y8PVulAo.png
thumbnail: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/LA52Yr53TgZCizpkOLJo.png
alt: The GOV.UK crown logo set on a black background.
tags:
  - blog
  - performance
  - javascript
---

[jQuery](https://jquery.com/) is a [roughly 30 KiB dependency](https://bundlephobia.com/package/jquery@3.6.0) that nearly [84% of mobile pages used in 2021](https://almanac.httparchive.org/en/2021/javascript#libraries-usage)&mdash;and for good reason. jQuery was an instrumental tool in a time when we really needed a way to script interactivity in a way that smoothed over the differing implementations of stuff like event handling, selecting elements, animating elements, and so on.

The web is better because of jQuery&mdash;not just because it has such incredible utility, but because its ubiquity led to making what it provided part of the web platform itself. Nowadays, we can do just about anything jQuery can do in vanilla JavaScript:

- We can select elements using a CSS selector syntax with [`querySelector`](https://developer.mozilla.org/docs/Web/API/Document/querySelector) and [`querySelectorAll`](https://developer.mozilla.org/docs/Web/API/Document/querySelectorAll).
- We can add, remove, and toggle classes on elements with the [`classList API`](https://developer.mozilla.org/docs/Web/API/Element/classList).
- We can attach event handlers to DOM elements and the `window` using [`addEventListener`](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener).
- And so, so, much more.

It really begs the question: [Do we _really_ need jQuery today?](https://youmightnotneedjquery.com/) That's a question that [GOV.UK](https://www.gov.uk/) has answered with a resounding "no". In March of 2022, [Matt Hobbs](https://twitter.com/TheRealNooshu) announced that GOV.UK removed their jQuery dependency. This is a big deal when it comes to the user experience, because GOV.UK provides services and information online for The United Kingdom at scale. Not everyone is tapping away on their 2022 MacBook Pro on a rip-roarin' broadband connection. GOV.UK has to be accessible to everyone, and that means keepin' it _lean_.

Here's a few of the greatest hits from Matt Hobbs on what GOV.UK noticed in removing jQuery:

- [Less front end processing time overall](https://twitter.com/TheRealNooshu/status/1509487061300039681).
- [11% less blocking time](https://twitter.com/TheRealNooshu/status/1509487066941374466/photo/1) at the 75th percentile.
- [10% less blocking time](https://twitter.com/TheRealNooshu/status/1509487072721125376/photo/1) for users at the 95th percentile. These are users who experience seriously adverse network and device conditions, and every performance gain matters _especially_ for them.

For the full story, check out [Matt's informative Twitter thread](https://twitter.com/TheRealNooshu/status/1509487050122276864). It's great stuff for web performance geeks, and drives home the point that _dependencies matter_ when it comes to performance. Don't shortchange your users if the web platform can easily do the job a framework can.

This level of commitment to the user experience from a institution that works at the scale GOV.UK does is commendable. I can only hope others follow in their footsteps.
