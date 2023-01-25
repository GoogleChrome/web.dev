---
title: "Create OS-style backgrounds with backdrop-filter"
subhead: |
  Blurring and color shifting behind an element.
date: 2019-07-26
updated: 2019-08-29
authors:
  - adamargyle
  - joemedley
hero: image/admin/ltK4SNRultTnkbimOySm.jpg
alt: A view through a rain-covered foggy window.
description: |
  Learn how to add background effects like blurring and transparency to UI
  elements on the web using the CSS backdrop-filter property.
tags:
  - blog
  - css
  - backdrop-filter
feedback:
  - api
---
Translucence, blurring, and other effects are useful ways of creating depth while keeping the context of the background content. They support a host of use cases such as frosted glass, video overlays, translucent navigation headers, inappropriate image censoring, image loading, and so on. You may recognize these effects from two popular operating systems: [Windows 10](https://i.kinja-img.com/gawker-media/image/upload/s--9RLXARU4--/c_scale,dpr_2.0,f_auto,fl_progressive,q_80,w_800/trgz8yivyyqrpcnwscu5.png) and [iOS](https://static.businessinsider.com/image/51fd2822eab8eae16e00000b-750.jpg).

<figure class="w-figure">
  {% Img src="image/admin/mEc6bdwB2ZX6VSXvyJEn.jpg", alt="An example of a frosted glass effect.", width="400", height="300" %}
  <figcaption class="w-figcaption">An example of a frosted glass effect. <a href="https://dribbble.com/shots/733714-Weather-App?list=tags&tag=android" target="_blank" rel="noopener noreferrer">Source</a>.</figcaption>
</figure>

Historically, these techniques were difficult to implement on the web, requiring less than perfect [hacks or workarounds](https://stackoverflow.com/questions/38145368/css-workaround-to-backdrop-filter). In recent years both [Safari](https://webkit.org/blog/3632/introducing-backdrop-filters/) and Edge have provided these capabilities through the `background-filter` (and alternatively, the `-webkit-backdrop-filter`) property, which dynamically blends foreground and background colors based on filter functions. Now Chrome supports `background-filter`, starting in version 76.

<figure class="w-figure w-figure--fullbleed">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-kitchen_sink2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-kitchen_sink2.mp4" type="video/mp4; codecs=h264">
  </video>
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    A demonstration of the filter functions for <code>backdrop-filter</code>. Try the example on <a href="https://codepen.io/robinrendle/pen/LmzLEL" target="_blank" rel="noopener">CodePen</a>.
  </figcaption>
</figure>

## Basics

- The `backdrop-filter` property applies one or more filters to an element, changing the appearance of anything behind the element.
- The overlaying element must be at least partially transparent.
- The overlaying element will get a new stacking context.

{% Aside 'caution' %}
`backdrop-filter` may harm performance. Test it before deploying.
{% endAside %}

CSS `backdrop-filter` applies one or more effects to an element that is translucent or transparent. To understand that, consider the images below.

<div class="w-columns">
{% Compare 'worse', 'No foreground transparency' %}
{% Img src="image/admin/LOqxvB3qqVkbZBmxMmKS.png", alt="A triangle superimposed on a circle. The circle can't be seen through the triangle.", width="480", height="283" %}

```css
.frosty-glass-pane {
  backdrop-filter: blur(2px);
}
```
{% endCompare %}

{% Compare 'better', 'Foreground transparency' %}
{% Img src="image/admin/VbyjpS6Td39E4FudeiVg.png", alt="A triangle superimposed on a circle. The triangle is translucent, allowing the circle to be seen through it.", width="480", height="283" %}

```css/1
.frosty-glass-pane {
  opacity: .9;
  backdrop-filter: blur(2px);
}
```
{% endCompare %}
</div>

The image on the left shows how overlapping elements would be rendered if `backdrop-filter` were not used or supported. The image on the right applies a blurring effect using `backdrop-filter`. Notice that it uses `opacity` in addition to `backdrop-filter`. Without `opacity`, there would be nothing to apply blurring to. It almost goes without saying that if `opacity` is set to `1` (fully opaque) there will be no effect on the background.

The `backdrop-filter` property is like CSS [filters](https://developer.mozilla.org/en-US/docs/Web/CSS/filter) in that all your favorite [filter functions](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#Filter_functions) are supported: `blur()`, `brightness()`, `contrast()`, `opacity()`, `drop-shadow()`, and so on. It also supports the `url()` function if you want to use an external image as the filter, as well as the keywords `none`, `inherit`, `initial`, and `unset`. There are explanations for all of this on [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter), including descriptions of syntax, filters, and values.

When `backdrop-filter` is set to anything other than `none`, the browser creates a new [stacking context](https://www.w3.org/TR/CSS21/zindex.html). A [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block) may also be created, but only if the element has absolute and fixed position descendants.

You can combine filters for rich and clever effects, or use just one filter for more subtle or precise effects. You can even combine them with [SVG filters](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/filter).

## Feature detection and fallback

As with many features of the modern web, you'll want to know whether the user's browser supports `backdrop-filter` before using it. Do this with `@supports()`. For performance reasons, fall back to an image instead of a polyfill when `backdrop-image` isn't supported. The example below shows this.

```css
@supports (backdrop-filter: none) {
	.background {
		backdrop-filter: blur(10px);
	}
}

@supports not (backdrop-filter: none) {
  .background {
    background-image: blurred-hero.png;
  }
}
```
## Examples

Design techniques and styles previously reserved for operating systems are now performant and achievable with a single CSS declaration. Let's look at some examples.

### Single filter

In the following example, the frosted effect is achieved by combining color and blur. The blur is supplied by `backdrop-filter`, while the color comes from the element's semi-transparent background color.

```css
.blur-behind-me {
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(.5rem);
}
```

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-rgb2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-rgb2.mp4" type="video/mp4; codecs=h264">
  </video>
  <figcaption class="w-figcaption">
    Try this example for yourself in <a href="https://codepen.io/netsi1964/pen/JqBLPK" target="_blank" rel="noopener">CodePen</a>.
  </figcaption>
</figure>

### Multiple filters

Sometimes you'll need multiple filters to achieve the desired effect. To do this, provide a list of filters separated by a space. For example:

```css
.brighten-saturate-and-blur-behind-me {
  backdrop-filter: brightness(150%) saturate(150%) blur(1rem);
}
```

In the following example, each of the four panes has a different combination of backdrop filters while the same set of shapes are animated behind them.

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-ambient_blur2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-ambient_blur2.mp4" type="video/mp4; codecs=h264">
  </video>
  <figcaption class="w-figcaption">
    Try this example for yourself in <a href="https://codepen.io/pepf/pen/GqZkdj" target="_blank" rel="noopener">CodePen</a>.
  </figcaption>
</figure>

### Overlays

This example shows how to blur a semi-transparent background to make text readable while stylistically blending with a page's background.

```css
.modal {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.5);
}
```

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-modal2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-modal2.mp4" type="video/mp4; codecs=h264">
  </video>
  <figcaption class="w-figcaption">
    Try this <a href="https://mfreed7.github.io/backdrop-filter-feature/examples/scrollable.html" target="_blank" rel="noopener">example</a> for yourself.
  </figcaption>
</figure>

### Text contrast on dynamic backgrounds

As stated earlier, `backdrop-filter` allows performant effects that would be difficult or impossible on the web. An example of this is changing a background in response to an animation. In this example, `backdrop-filter` maintains the high contrast between the text and its background in spite of what's going on behind the text. It starts with the default background color `darkslategray` and uses `backdrop-filter` to invert the colors after the transformation.

```css
.container::before {
  z-index: 1;
  background-color: darkslategray;
  filter: invert(1);
}

.container::after {
	backdrop-filter: invert(1);
  z-index: 3;
}
```

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-invert_color2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-invert_color2.mp4" type="video/mp4; codecs=h264">
  </video>
  <figcaption class="w-figcaption">
    Try this example from <a href="https://www.chenhuijing.com/#%F0%9F%91%9F">Chen Hui Jing</a> in <a href="https://tympanus.net/codrops-playground/huijing/Qqpwg5Iy/editor" target="_blank" rel="noopener">Codrops</a>.
  </figcaption>
</figure>

## Conclusion
More than 560 of you have upvoted the [Chromium bug](https://crbug.com/497522) over the past few years, clearly marking this as a long awaited CSS feature. Chrome's release of `backdrop-filter` in version 76 brings the web a step closer to truly OS-like UI presentation.

### Additional resources
- [Specification](https://drafts.fxtf.org/filter-effects-2/#BackdropFilterProperty)
- [Chrome Platform Status](https://www.chromestatus.com/feature/5679432723333120)
- [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
- [`background-filter` at CSS Tricks](https://css-tricks.com/the-backdrop-filter-css-property/)
- [Samples on Codepen](https://codepen.io/tag/backdrop-filter/#)
