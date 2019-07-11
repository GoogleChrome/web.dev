---
title: "A view through the fog"
subhead: |
  Blurring and color shifting behind an element.
date: 2019-07-12
authors:
  - adamargyle
  - joemedley
hero: hero.jpg
alt: A view through a rain-covered foggy window.
description: |
  CSS backdrop-filter was made famous by Apple's design team.
  It adds background effects like blurring and transparency to
  the artefacts behind an element.
tags:
  - post
  - css
  - backdrop-filter
---
Translucency, vibrancy, and blurring are effective ways of creating depth while keeping the context of the background content. They support a host of use cases such as frosted glass, video overlays, translucent navigation headers, inappropriate image censoring, image loading, and so on. You may recognize these effects from two popular operating systems: [Windows 10](https://i.kinja-img.com/gawker-media/image/upload/s--9RLXARU4--/c_scale,dpr_2.0,f_auto,fl_progressive,q_80,w_800/trgz8yivyyqrpcnwscu5.png) and [iOS](https://static.businessinsider.com/image/51fd2822eab8eae16e00000b-750.jpg).

<figure class="w-figure w-figure--center">
  <img src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/weather_app.jpg" alt="An example of a frosted glass effect.">
  <figcaption class="w-figcaption">
    An example of a frosted glass effect. <a href="https://dribbble.com/shots/733714-Weather-App?list=tags&tag=android" target="_blank">Source</a>.
  </figcaption>
</figure>

Historically, these effects were difficult to implement on the web, requiring less than perfect [hacks or workarounds](https://stackoverflow.com/questions/38145368/css-workaround-to-backdrop-filter). In recent years both [Safari](https://webkit.org/blog/3632/introducing-backdrop-filters/) and Edge have provided these capabilities through the `background-filter` (and alternatively, the `-webkit-backdrop-filter`) property which dynamically blends foreground and background colors based on filter functions. Now Chrome supports `background-filter`, starting in version 76.

<figure class="w-figure w-figure--fullbleed">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-kitchen_sink.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    A demonstration of the filter functions for <code>backdrop-filter</code>. Try the example on <a href="https://codepen.io/robinrendle/pen/LmzLEL" target="_blank">CodePen</a>.
  </figcaption>
</figure>

# Overview

- The `backdrop-filter` property can apply one or more filters to an element.
- The overlaying element must be at least partially transparent.
- The overlaying element will get a new stacking context.

{% Aside 'caution' %}
`backdrop-filter` may harm performance. Test it before deploying.
{% endAside %}

CSS `backdrop-filter` applies one or more filters to the backdrop of an element, leaving the contents unchanged. Some people find its name confusing. Is it changing the background? Does it add another layer between the forground and background? Actually it does neither of these things. Rather, it makes an existing element transparent or partially transparent, altering the appearance of whatever is seen through it. It almost goes without saying that if the element has no transparency, that is, if its value is set to `none` there will be no effect on the background.

{% Aside 'key-term' %}
  A backdrop is the painted content behind the element.
{% endAside %}

The following example illustrates this. For comparison, the image on the left shows how overlapping elements would be rendered if `backdrop-filter` were not used or supported. The image on the right shows how these elements appear when the foreground element uses `backdrop-filter`. Here's the CSS declaration that defines this.

```css
.frosty-glass-pane {
  opacity: .9;
  backdrop-filter: blur(2px);
}
```

<figure class="w-figure w-figure--center">
  <img src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop-filter.png" alt="The item on the right uses <code>backdrop-filter<code>. The one on the left does not.">
  <figcaption class="w-figcaption w-figcaption--fullbleed">
    The item on the right uses <code>backdrop-filter</code>. The one on the left does not.
  </figcaption>
</figure>

## Essentials

The `backdrop-filter` property is like CSS [filters](https://developer.mozilla.org/en-US/docs/Web/CSS/filter) in that all your favorite [filter functions](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#Filter_functions) are supported: `blur()`, `brightness()`, `contrast()`, `opacity()`, `drop-shadow()`, and so on. It also supports the `url()` function, if you want to use an external image as the filter, as well as the keywords `none`, `inherit`, `initial`, and `unset`. There are explanations for all of this on [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter), including descriptions of syntax, filters, and values.

When `backdrop-filter` is set to anything other than `none`, a new [stacking context](https://www.w3.org/TR/CSS21/zindex.html). A [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block) may also be created, but only if the element has absolute and fixed position descendats.

You can combine filters for rich and clever effects, or use just one filter for more subtle or precise effects. You can even combine them with [SVG filters](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/filter).

As with many features of the modern web, you'll want to know whether the user's browser supports `backdrop-filter` before using it. Do this with `@supports()` as shown below.

```css
@supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
	.ManipulateElement {
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
	}
}
```
These essentials provide a foundation for creativity and performance. Design techniques and styles previously reserved for native operating systems are now performant and achievable with a single CSS declaration. Very exciting!

## Basic examples

Let's look at some examples.

### Single filter

In the following example, the frosted effect is achieved by combining color and blur. The blur is supplied by `backdrop-filter`, while the color comes from the element's transparent background color. Combined, they produce the blurred, semi-transparent backdrop you see here.

```css
.blur-behind-me {
  background-color: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(.5rem);
}
```

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-rgb.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    Try this example for yourself in <a href="https://codepen.io/netsi1964/pen/JqBLPK" target="_blank">CodePen</a>.
  </figcaption>
</figure>

### Multiple filters

Sometimes you'll need multiple filters to achieve the desired effect. To do this, provide a list of filters separated by a space.

In the following example, each of the four panes have different combinations of backdrop filters while the same set of shapes are animated behind them.

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
    Try this example for yourself in <a href="https://codepen.io/pepf/pen/GqZkdj" target="_blank">CodePen</a>.
  </figcaption>
</figure>

## Creative examples

Here are some interesting capabilities unlocked with `backdrop-filter`. I find these examples are best for teaching what could beß.

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
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-modal.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    Try this <a href="https://mfreed7.github.io/backdrop-filter-feature/examples/scrollable.html" target="_blank">example</a> for yourself.
  </figcaption>
</figure>

### Text contrast on dynamic backgrounds

I said earlier that `backdrop-filter` allows performant effects that would be difficult or impossible on the web. The following example shows how to change a background in reponse to an animation. This is done to maintain high contrast between text and its background in spite of what's going on behind the text.

This animation starts with the default background color `darkslategray` and uses `backdrop-filter` to invert the colors after the transformation.

```css
.container::before {
  z-index: 1;
  background-color: darkslategray;
  filter: invert(1);
}

.container::after {
	-webkit-backdrop-filter: invert(1);
  backdrop-filter: invert(1);
  z-index: 3;
}
```

<figure class="w-figure">
  <video controls autoplay loop muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/backdrop_filter-invert_color.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    Try this example from <a href="https://www.chenhuijing.com/#%F0%9F%91%9F">Chen Hui Jing</a> in <a href="https://tympanus.net/codrops-playground/huijing/Qqpwg5Iy/editor" target="_blank">Codrops</a>.
  </figcaption>
</figure>

## Conclusion
More than 560 of you have upvoted the [Chromium bug](https://crbug.com/497522) over the past few years, clearly marking this as a long awaited CSS feature. The wait is over. Chrome's excited to release `backdrop-filter` in version 76.

<figure class="w-figure">
  <img src="https://storage.googleapis.com/web-dev-assets/backdrop-filter/translucent-chrome.png" alt="A translucent Chrome logo over a dark gradient">
  <figcaption class="w-figcaption">
    A translucent Chrome logo over a dark gradient. (<a href="https://dribbble.com/shots/1224915-Roundaque-Icons-Closeup-Chrome" target="_blank">Source</a>)
  </figcaption>
</figure>

### Additional resources
- [Specification](https://drafts.fxtf.org/filter-effects-2/#BackdropFilterProperty)
- [Chrome Platform Status](https://www.chromestatus.com/feature/5679432723333120)
- [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter)
- [`background-filter` at CSS Tricks](https://css-tricks.com/the-backdrop-filter-css-property/)
- [Samples on Codepen](https://codepen.io/tag/backdrop-filter/#)
