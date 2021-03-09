---
layout: post
title: Building a Settings component
subhead: A foundational overview of how to build a settings component of sliders and checkboxes.
authors:
  - adamargyle
description: A foundational overview of how to build a settings component of sliders and checkboxes.
date: 2021-03-17
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/SUaxDTgOYvv2JXxaErBP.png
tags:
  - blog
  - css
  - dom
  - javascript
  - layout
  - mobile
  - ux
---

In this post I want to share thinking on building a Settings component for the web
that is responsive, supports multiple device inputs, and works across browsers.
Try the [demo](https://gui-challenges.web.app/settings/dist/).

<figure class="w-figure w-figure--fullbleed">
  {% Video 
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/WuIwd9jPb30KmmnjJn75.mp4",
    className="w-screenshot", 
    autoplay="true", 
    loop="true", 
    muted="true" 
  %}
  <figcaption class="w-figure">
    <a href="https://gui-challenges.web.app/settings/dist/">Demo</a>
  </figcaption>
</figure>

If you prefer video, or want a UI/UX preview of what we're building, 
here's a shorter walkthrough on YouTube:

{% YouTube 'mMBcHcvxuuA' %}

## Overview



## Layouts
- all grid
- spacing
- nesting
- wrapping and max / determined width
- inline svg

## Color
- text, surface, brand -> light/dark
- fixed bg gradient
- color-scheme
- accent-color
- focus-within

## Custom Range
- preseve-3d translateZ
- transform order matters
- box-shadow trick
- gradient syntax

## Custom Checkbox
- display contents label

## Accessibility

## JavaScript

## Conclusion

Now that you know how I did it, how would you?! This makes for some fun
component architecture! Who's going to make the 1st version with slots in their
favorite framework? 🙂

Let's diversify our approaches and learn all the ways to build on the web.
Create a demo, [tweet me](https://twitter.com/argyleink)
links, and I'll add it to the [Community remixes](#community-remixes)
section below!

## Community remixes

<i>awaiting submissions</i>
