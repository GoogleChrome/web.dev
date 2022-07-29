---
layout: post
title: New patterns
subhead: Animations, theming, components, and more layout patterns are live and ready to help kick start or inspire your UI and UX.
authors:
  - adamargyle
description: Animations, theming, components, and more layout patterns are live and ready to help kick start or inspire your UI and UX.
date: 2022-07-29
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/mBXnYVdru7dzNVaQlh5M.png
alt: Colorful circle and block pattern by George Francis in this Codepen https://codepen.io/georgedoescode/pen/OJjoymK
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/qopbUHltS7bY1k9z3JWZ.png
tags:
  - blog
  - css
  - html
  - javascript
  - layout
  - animations
  - svg
  - ux
  - intl
---

I'm excited to share many new [web.dev patterns](/patterns/)! These additions
are from the show [GUI Challenges](/shows/gui-challenges/) where I share
my strategies on how to build various components and common interface needs,
then collect user submissions for the same tasks and help us all grow our
perspectives on how to solve them.

Turns out GUI Challenges fit nicely into patterns:

{% CodePattern 'gui-challenges/animation/interactive-words' %}

Now they can be embedded into posts (like above), aggregated for easy browsing
and inspiration, and also have added new categories for other contributors to
add their patterns to. Take a look around, take some code: it's all there for
you.

## Overview

Three new pattern categories:

1. [Components](#components)
1. [Animations](#animations)
1. [Theming](#theming)

Plus, five new patterns added to the existing
[Layout](#new-layout-patterns-on-centering) patterns.

### Components

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/J2QtGMJ3e1cJkHFrQ2K3.svg",
alt="Supporting graphic which has colorful prototyped components in a grid
layout.", width="360", height="240" %}

View [the component patterns landing page](/patterns/components/) or check each
out individually:

1. [Breadcrumbs](/patterns/components/breadcrumbs/)
1. [Buttons](/patterns/components/buttons/)
1. [Carousel](/patterns/components/carousel/)
1. [Dialog](/patterns/components/dialog/)
1. [Game Menu](/patterns/components/game-menu/)
1. [Loading Bar](/patterns/components/loading-bar/)
1. [Media Scroller](/patterns/components/media-scroller/)
1. [Multi-Select](/patterns/components/multi-select/)
1. [Settings](/patterns/components/settings/)
1. [Sidenav](/patterns/components/sidenav/)
1. [Split Buttons](/patterns/components/split-buttons/)
1. [Stories](/patterns/components/stories/)
1. [SVG Favicon](/patterns/components/svg-favicon/)
1. [Switch](/patterns/components/switch/)
1. [Tabs](/patterns/components/tabs/)
1. [Toast](/patterns/components/toast/)

Here's a preview of the split button pattern:

{% CodePattern 'components/split-buttons' %}

### Animations

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/KL7dFk9XKx5PVUzXT2hb.svg",
alt="Supporting graphic which has a ball in motion down a curve.", width="360",
height="240" %}

View [the animation patterns landing page](/patterns/animation/) or check each
out individually:

1. [Animated Letters](/patterns/animations/animated-letters/)
1. [Animated Words](/patterns/animations/animated-words/)
1. [Interactive Letters](/patterns/animations/interactive-letters/)
1. [Interactive Words](/patterns/animations/interactive-words/)

Here's a preview of the animated letters pattern:

{% CodePattern 'animation/animated-letters' %}

{% Aside %}
These patterns only split the text and animate if a user's system hasn't
indicated [reduced
motion](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion).
{% endAside %}

### Theming

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/X2nU3op9YZAqzox7FDgN.svg",
alt="Supporting graphic with two layers of a dashboard, one is pink and the
other is blue.", width="360", height="240" %}

View [the theming patterns landing page](/patterns/theming/) or check each out
individually:

1. [Color Schemes](/patterns/theming/color-schemes/)
1. [Theme Switch](/patterns/theming/theme-switch/)

One pattern is for building a client side [theme
switch](/building-a-theme-switch-component/) so users can indicate their
preference without it being directly tied to their system preference. The other
is for creating a [theming design system](/building-a-color-scheme/) with CSS
custom properties.

Here's a preview of the color schemes pattern:

{% CodePattern 'theming/color-schemes' %}

### New layout patterns on centering

View [the layout patterns landing page](/patterns/layouts/) or check each out
individually:

1. [Autobot](/patterns/layout/autobot/)
1. [Content Center](/patterns/layout/content-center/)
1. [Fluffy Center](/patterns/layout/fluffy-center/)
1. [Gentle Flex](/patterns/layout/gentle-flex/)
1. [Pop n' Plop](/patterns/layout/pop-n-plop/)

Each demo features a grab handle to resize the container and a button to add a
child to the layout. These, as explained in [the article](/centering-in-css/),
are to help you feel the strengths and weaknesses of various centering
techniques the web offers. Plus, they have fun names.

Here is the article determined "winner" of the centering exploration, the Gentle
Flex:

{% CodePattern 'layout/gentle-flex' %}

## Wrap up

I hope these new patterns help teach you new techniques, inspire you, provide
insights into accessibility and overall keep you hyped on building UI. Stay
tuned for more [patterns](/patterns/) as the Chrome Team continues adding to
these collections.

- Post hero images generated from [George Francis' fantastic
  Codepen](https://codepen.io/georgedoescode/pen/OJjoymK)
