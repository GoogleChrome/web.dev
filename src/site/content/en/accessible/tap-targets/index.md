---
layout: post
title: Tap target guidance
authors:
  - rachelandrew
date: 2020-05-18
description: |
  intro
---

When your design is displayed on a mobile device, you should ensure that interactive elements like buttons or links are large enough, and have enough space around them, to make them easy to press without accidentally overlapping onto other elements. This benefits all users, but is especially helpful for anyone with a motor impairment.

A minimum recommended touch target size is around 48 device independent pixels on a site with a properly set mobile viewport. For example, while an icon may only have a width and height of 24px, you can use additional padding to bring the tap target size up to 48px. The 48x48 pixel area corresponds to around 9mm, which is about the size of a person's finger pad area.

In the demo, I have added padding to all of the links in order to make sure they meet the minimum size.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/tap-targets?path=index.html&previewSize=100"
    title="tap-targets on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

Touch targets should also be spaced about 8 pixels apart, both horizontally and vertically, so that a user's finger pressing on one tap target does not inadvertently touch another tap target.

## Testing your touch targets

If your target is text and you have used relative values such as `em` or `rem` to size the text and any padding, you can use DevTools to check that the computed value of that area is large enough. In the example below I am using `em` for my text and padding.

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/tap-targets-2?path=style.css&previewSize=100"
    title="tap-targets-2 on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

Inspect the `a` of the link, and in Chrome DevTools switch to the Computed Panel where you can inspect the various parts of the box and see what pixel size they resolve to. In Firefox DevTools there is a Layout Panel. In that Panel you get the actual size of the inspected element.

<figure class="w-figure">
  <img src="./firefox-layout.png" alt="The Layout Panel in Firefox DevTools showing the size of the a element" style="max-width: 400px;">
</figure>

## Using media queries to detect touchscreen use

One of the media features we can now test for with media queries is whether the user's primary input is a touchscreen. The `pointer` feature will return `fine` or `coarse`. A fine pointer will be someone using a mouse or trackpad, even if that mouse is connected via Bluetooth to a phone. A `coarse` pointer indicates a touchscreen, which could be a mobile device but may also be a laptop screen or large tablet.





## Next steps

Once you know a bit about semantics and how they aid screen reader navigation,
you can't help but look at the pages you build differently. In the next section,
we'll take a step back and consider how the entire outline of a page can be
conveyed using effective headings and landmarks.
