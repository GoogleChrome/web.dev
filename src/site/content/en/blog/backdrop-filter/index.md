---
title: "CSS backdrop-filter"
subhead: |
  Unleash 60 fps of blurry translucency in your user interfaces.
date: 2019-06-25
authors:
  - adamargyle
hero: hero.jpg
alt: A view through a rain-covered foggy window.
description: |
  CSS backdrop-filter was made famous by Apple's design team. It brings
  a background to act as a filter for the contents beneath
  and creates a nice layering effect that keeps beneath elements in context.
tags:
  - post
  - css
  - backdrop-filter
---

Designers and developers alike can celebrate as a long awaited CSS feature [arrives in Chrome 76](https://www.chromestatus.com/feature/5679432723333120): `backdrop-filter`. Until now, [hacks or workarounds](https://stackoverflow.com/questions/38145368/css-workaround-to-backdrop-filter) were required to create the effects that backdrop-filter provides: frosted glass, video overlays, translucent navigation headers, inappropriate image censoring, image loading, etc.

<figure class="w-figure w-figure--center">
  <img src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/weather_app.jpg" alt="Translucent weather card design">
  <figcaption class="w-figcaption">
    <a href="https://dribbble.com/shots/733714-Weather-App?list=tags&tag=android" target="_blank">Source</a>
  </figcaption>
</figure>

Translucency, vibrancy, and blurring are effective ways of creating depth while keeping context of background content. `backdrop-filter` dynamically blends foreground and background colors based on filter functions. The result helps foreground content pop off the background content.

You may recognize the effect from two popular operating systems: [Windows Vista](https://i.kinja-img.com/gawker-media/image/upload/s--9RLXARU4--/c_scale,dpr_2.0,f_auto,fl_progressive,q_80,w_800/trgz8yivyyqrpcnwscu5.png) and [iOS](https://static.businessinsider.com/image/51fd2822eab8eae16e00000b-750.jpg). Now [Chrome](https://www.chromestatus.com/feature/5679432723333120) can do it too.

The following video demonstrates `backdrop-filter` and each individual filter:

<figure class="w-figure w-figure--fullbleed">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-kitchen_sink.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    <a href="https://codepen.io/robinrendle/pen/LmzLEL" target="_blank">CodePen</a>
  </figcaption>
</figure>


## Technical Details
{% Aside 'key-term' %}
  backdrop - the painted content behind the element.
{% endAside %}

CSS `backdrop-filter` applies one or more filters to the backdrop of an element, leaving the contents unchanged.

In order for the backdrop-filter to have any effect, some portion of the overlaying element needs to be transparent. Therefore, overlaying elements without any transparency will produce no backdrop-filter effects.

<figure class="w-figure w-figure--center">
  <img src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop-filter.png" alt="2 comparisons where one is opaque and the other has transparency and therefore blurred translucency">
</figure>

Backdrop-filters are like CSS filters. When the property is not 'none', a new [stacking context](https://www.w3.org/TR/CSS21/zindex.html) and/or [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block) are created. Note, only elements with absolute and fixed position descendants will get a containing block.

<div>
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter" target="_blank" class="w-button w-button--secondary w-button--with-icon" data-icon="school">
    Full API on MDN
  </a>
</div>

### Summary
- `backdrop-filter` can apply one or more filters to an element
- The overlaying element must be at least partially transparent
- The overlaying element will get a new stacking context

{% Aside 'warning' %}
`backdrop-filter` may harm performance.
{% endAside %}


## Essentials

### Single Filter

```css
.blur-behind-me {
  backdrop-filter: blur(.5rem);
}
```

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-rgb.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    <a href="https://codepen.io/netsi1964/pen/JqBLPK" target="_blank">CodePen</a>
  </figcaption>
</figure>

### Combining Filters

```css
.brighten-saturate-and-blur-behind-me {
  backdrop-filter: brightness(150%) saturate(150%) blur(1rem);
}
```

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-ambient_blur.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    <a href="https://codepen.io/pepf/pen/GqZkdj" target="_blank">CodePen</a>
  </figcaption>
</figure>


## Creative Examples

### Overlays

```css
.modal {
  backdrop-filter: blur(10px);
}
```

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-modal.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    <a href="https://mfreed7.github.io/backdrop-filter-feature/examples/scrollable.html" target="_blank">Demo</a>
  </figcaption>
</figure>

### Text Contrast on Dynamic Backgrounds

```css
.background {
  filter: invert(1);
}

.foreground {
  backdrop-filter: invert(1);
}
```

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-invert_color.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    <a href="https://tympanus.net/codrops-playground/huijing/Qqpwg5Iy/editor" target="_blank">Codrops</a>
  </figcaption>
</figure>

### Censorship

```css
input:not(:checked) ~ .censor {
  backdrop-filter: contrast(4) blur(20px);
}
```

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-censorship.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    <a href="https://tympanus.net/codrops-playground/huijing/6cZVcORz/editor" target="_blank">Codrops</a>
  </figcaption>
</figure>


## Conclusion
Chrome's excited to release `backdrop-filter` in 76. The [Chromium bug](https://crbug.com/497522) has **560+ stars** on it, clearly marking it as a desired web design capability.

<figure class="w-figure">
  <img src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/translucent-chrome.png" alt="Translucent Chrome logo over a dark gradient">
  <figcaption class="w-figcaption">
    <a href="https://dribbble.com/shots/1224915-Roundaque-Icons-Closeup-Chrome" target="_blank">Source</a>
  </figcaption>
</figure>

### Additional Resources
- [Specification](https://drafts.fxtf.org/filter-effects-2/#BackdropFilterProperty)
- [Chrome Platform Status](https://www.chromestatus.com/feature/5679432723333120)
- [Caniuse](http://caniuse.com/#feat=css-backdrop-filter)
- [API](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
- [CSS Tricks](https://css-tricks.com/the-backdrop-filter-css-property/)
- [Codepens](https://codepen.io/tag/backdrop-filter/#)
