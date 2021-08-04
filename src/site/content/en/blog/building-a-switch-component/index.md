---
layout: post
title: Building a switch component
subhead: A foundational overview of how to build a responsive and accessible switch component.
authors:
  - adamargyle
description: A foundational overview of how to build a responsive and accessible switch component.
date: 2021-08-04
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/9enjDnqrgdzS6lUOWAGO.png
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/gNjyaiykXSBUPVhSOinL.png
tags:
  - blog
  - css
  - dom
  - javascript
---

In this post I want to share thinking on a way to build switch components.
[Try the demo](https://gui-challenges.web.app/switch/dist/).

<figure class="w-figure w-figure--fullbleed">
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/nzABBfSBoy73cyYD60WR.mp4",
    class="w-screenshot",
    autoplay="true",
    loop="true",
    muted="true"
  %}
  <figcaption class="w-figure">
    <a href="https://gui-challenges.web.app/switch/dist/">Demo</a>
  </figcaption>
</figure>

If you prefer video, here's a YouTube version of this post:

{% YouTube 'kHL3gxAlvK8' %}

## Overview

A [switch](https://w3c.github.io/aria/#switch) functions similar to a checkbox
but explicitly represents boolean on and off states. 

This demo uses `<input type="checkbox" role="switch">` for the majority of its
functionality, which has the advantage of not needing CSS or JavaScript to be
fully functional and accessible. Loading CSS brings support for right-to-left
languages, verticality, animation and more. Loading JavaScript makes the switch
draggable and tangible.

### Custom properties

The following variables represent the various parts of the switch and their
options. As the top level class, `.gui-switch` contains custom properties used
throughout the component children, as well as entry points for centralized
customization.

### Track
The length (`--track-size`), padding, and two colors:

```css
.gui-switch {
  --track-size: calc(var(--thumb-size) * 2);
  --track-padding: 2px;

  --track-inactive: hsl(80 0% 80%);
  --track-active: hsl(80 60% 45%);

  --track-color-inactive: var(--track-inactive);
  --track-color-active: var(--track-active);

  @media (prefers-color-scheme: dark) { 
    --track-inactive: hsl(80 0% 35%);
    --track-active: hsl(80 60% 60%);
  }
}
```
### Thumb

The size, background color, and interaction highlight colors:

```css
.gui-switch {
  --thumb-size: 2rem;
  --thumb: hsl(0 0% 100%);
  --thumb-highlight: hsl(0 0% 0% / 25%);

  --thumb-color: var(--thumb);
  --thumb-color-highlight: var(--thumb-highlight);

  @media (prefers-color-scheme: dark) { 
    --thumb: hsl(0 0% 5%);
    --thumb-highlight: hsl(0 0% 100% / 25%);
  }
}
```

#### Reduced motion

To add a clear alias and reduce repetition, a reduced motion preference user
media query can be put into a custom property with the [PostCSS
plugin](https://github.com/postcss/postcss-custom-media) based on this [draft
spec in Media Queries
5](https://drafts.csswg.org/mediaqueries-5/#at-ruledef-custom-media):

```css
@custom-media --motionOK (prefers-reduced-motion: no-preference);
```

