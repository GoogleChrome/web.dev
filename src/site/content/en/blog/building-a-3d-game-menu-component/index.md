---
layout: post
title: Building a 3D game menu component
subhead: A foundational overview of how to build a responsive, adaptive, and accessible 3D game menu.
authors:
  - adamargyle
description: A foundational overview of how to build a responsive, adaptive, and accessible 3D game menu.
date: 2021-11-10
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/IjOV7KRfEzEj7I1ZVJA5.png
alt: A screenshot of the vibrant 3D game menu component, rotated in space, with the continue button focused which demonstrates the z-space effect.
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/1yLFCkKYvDtrJSepc7A0.png
tags:
  - blog
  - css
  - dom
  - javascript
---

In this post I want to share thinking on a way to build a 3D game menu component. Try the
[demo](https://gui-challenges.web.app/game-menu/dist/).

<figure data-size="full">
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/q9gIXMmP2CcfutwyaK5F.mp4",
       autoplay="true",
    loop="true",
    muted="true"
  %}
  <figcaption>
    <a href="https://gui-challenges.web.app/game-menu/dist/">Demo</a>
  </figcaption>
</figure>

If you prefer video, here's a YouTube version of this post:

{% YouTube 'HCsV8u-KYUw' %}

## Overview

Video games often present users with a creative and unusual menu, animated
and in 3D space. It's popular in new AR/VR games to make the menu appear to be
floating in space. Today we'll be recreating the essentials of this effect but
with the added flair of an adaptive color scheme and accommodations for users
who prefer reduced motion.

{% Aside %} This guide uses experimental CSS
[@custom-media](https://www.w3.org/TR/mediaqueries-5/#custom-mq) and
[@nest](https://www.w3.org/TR/css-nesting-1/) to prevent repeating media queries
and to colocate media queries within component style blocks. The syntax proposed
in those specs is enabled with PostCSS and these two plugins:
[postcss-custom-media](https://github.com/postcss/postcss-custom-media) and
[postcss-nesting](https://github.com/csstools/postcss-nesting). {% endAside %}

## HTML

A game menu is a list of buttons. The best way to represent this in HTML is as
follows:

```html
<ul class="threeD-button-set">
  <li><button>New Game</button></li>
  <li><button>Continue</button></li>
  <li><button>Online</button></li>
  <li><button>Settings</button></li>
  <li><button>Quit</button></li>
</ul>
```

A list of buttons will announce itself well to screen reader technologies and
works without JavaScript or CSS.

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/jYu9ioALV3d9jalDWSY1.png", alt="a
very generic looking bullet list with regular buttons as items.", width="800",
height="437" %}

## CSS

Styling the button list breaks down into the following high level steps:
1. Setting up custom properties.
1. A flexbox layout.
1. A custom button with decorative pseudo-elements.
1. Placing elements into 3D space.

### Overview of custom properties

Custom properties help disambiguate values by giving meaningful
names to otherwise random-looking values, avoiding repeated code and sharing
values amongst children.

Below are media queries saved as CSS variables, also known as [custom
media](https://www.w3.org/TR/mediaqueries-5/#custom-mq). These are global and
will be used throughout various selectors to keep code concise and legible. The
game menu component uses [motion
preferences](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-reduced-motion),
system [color
scheme](https://developer.mozilla.org/docs/Web/CSS/@media/prefers-color-scheme),
and [color range
capabilities](https://www.w3.org/TR/mediaqueries-5/#dynamic-range) of the
display.

```css
@custom-media --motionOK (prefers-reduced-motion: no-preference);
@custom-media --dark (prefers-color-scheme: dark);
@custom-media --HDcolor (dynamic-range: high);
```

The following custom properties manage the color scheme and hold mouse
positional values for making the game menu interactive to hover. Naming custom
properties helps code legibility as it reveals the use case for the value or a
friendly name for the result of the value.

{% Aside %} The following variable naming convention uses strategies described in
[this post](https://lea.verou.me/2021/10/custom-properties-with-defaults/) by
[Lea Verou](https://twitter.com/LeaVerou). {% endAside %}

```css
.threeD-button-set {
  --y:;
  --x:;
  --distance: 1px;
  --theme: hsl(180 100% 50%);
  --theme-bg: hsl(180 100% 50% / 25%);
  --theme-bg-hover: hsl(180 100% 50% / 40%);
  --theme-text: white;
  --theme-shadow: hsl(180 100% 10% / 25%);

  --_max-rotateY: 10deg;
  --_max-rotateX: 15deg;
  --_btn-bg: var(--theme-bg);
  --_btn-bg-hover: var(--theme-bg-hover);
  --_btn-text: var(--theme-text);
  --_btn-text-shadow: var(--theme-shadow);
  --_bounce-ease: cubic-bezier(.5, 1.75, .75, 1.25);

  @media (--dark) {
    --theme: hsl(255 53% 50%);
    --theme-bg: hsl(255 53% 71% / 25%);
    --theme-bg-hover: hsl(255 53% 50% / 40%);
    --theme-shadow: hsl(255 53% 10% / 25%);
  }

  @media (--HDcolor) {
    @supports (color: color(display-p3 0 0 0)) {
      --theme: color(display-p3 .4 0 .9);
    }
  }
}
```

### Light and dark theme background conic backgrounds

The light theme has a vibrant `cyan` to `deeppink` [conic
gradient](https://developer.mozilla.org/docs/Web/CSS/gradient/conic-gradient())
while the dark theme has a dark subtle conic gradient. To see more about what
can be done with conic gradients, see [conic.style](https://www.conic.style/).

```css
html {
  background: conic-gradient(at -10% 50%, deeppink, cyan);

  @media (--dark) {
    background: conic-gradient(at -10% 50%, #212529, 50%, #495057, #212529);
  }
}
```

<figure data-size="full">
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/7k1iwE7OaEKSpq4rDCBw.mp4",
       autoplay="true",
    loop="true",
    muted="true"
  %}
  <figcaption>
    Demonstration of background changing between light and dark color preferences.
  </figcaption>
</figure>

### Enabling 3D perspective

For elements to exist in the 3D space of a web page, a viewport with
[perspective](https://developer.mozilla.org/docs/Web/CSS/perspective)
needs to be initialized. I chose to put the perspective on the `body` element
and used viewport units to create the style I liked.

```css
body {
  perspective: 40vw;
}
```

This is the type of impact perspective can have.

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/qDDlbrxpp7vNBkwv5gI7.mp4",
   autoplay="true",
  loop="true",
  muted="true"
%}

### Styling the `<ul>` button list

This element is responsible for the overall button list macro layout as well as
being an interactive and 3D floating card. Here's a way to achieve that.

#### Button group layout

Flexbox can manage the container layout. Change the default direction of flex
from rows to columns with `flex-direction` and ensure each item is the size of
its contents by changing from `stretch` to `start` for `align-items`.

```css
.threeD-button-set {
  /* remove <ul> margins */
  margin: 0;

  /* vertical rag-right layout */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.5vh;
}
```

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Y63ZFy5AEA4VS4yVirgv.mp4",
   autoplay="true",
  loop="true",
  muted="true"
%}

Next, establish the container as a 3D space context and set up CSS `clamp()`
functions to ensure the card doesn't rotate beyond legible rotations. Notice
that the middle value for the clamp is a custom property, these `--x` and `--y`
values will be [set from JavaScript](#mouse-parallax-interaction) upon mouse
interaction later.

```css
.threeD-button-set {
  …

  /* create 3D space context */
  transform-style: preserve-3d;

  /* clamped menu rotation to not be too extreme */
  transform:
    rotateY(
      clamp(
        calc(var(--_max-rotateY) * -1),
        var(--y),
        var(--_max-rotateY)
      )
    )
    rotateX(
      clamp(
        calc(var(--_max-rotateX) * -1),
        var(--x),
        var(--_max-rotateX)
      )
    )
  ;
}
```

Next, if motion is OK with the visiting user, add a hint to the browser that
this item's transform will be constantly changing with
[`will-change`](https://developer.mozilla.org/docs/Web/CSS/will-change).
Additionally, enable interpolation by setting a `transition` on transforms. This
transition will occur when the mouse interacts with the card, enabling smooth
transitions to rotation changes. The animation is a constant running animation
that demonstrates the 3D space the card is within, even if a mouse can't or
isn't interacting with the component.

```css
@media (--motionOK) {
  .threeD-button-set {
    /* browser hint so it can be prepared and optimized */
    will-change: transform;

    /* transition transform style changes and run an infinite animation */
    transition: transform .1s ease;
    animation: rotate-y 5s ease-in-out infinite;
  }
}
```

The `rotate-y` animation only sets the middle keyframe at `50%` since the
browser will default `0%` and `100%` to the default style of the element. This
is shorthand for animations that alternate, needing to begin and end at the same
position. It's a great way to articulate infinite alternating animations.

```css
@keyframes rotate-y {
  50% {
    transform: rotateY(15deg) rotateX(-6deg);
  }
}
```

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/EYqJVUyybb3VV4AX9dNE.mp4",
   autoplay="true",
  loop="true",
  muted="true"
%}

### Styling the `<li>` elements

Each list item (`<li>`) contains the button and its border elements. The
`display` style is changed so the item doesn't show a
[`::marker`](/css-marker-pseudo-element/). The `position` style
is set to `relative` so the upcoming button pseudo-elements can position
themselves within the full area the button consumes.

```css
.threeD-button-set > li {
  /* change display type from list-item */
  display: inline-flex;

  /* create context for button pseudos */
  position: relative;

  /* create 3D space context */
  transform-style: preserve-3d;
}
```

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/6KtslsfnZEhk4liXAlW7.png",
alt="Screenshot of the list rotated in 3D space to show the perspective, and
each list item no longer has a bullet.", width="800", height="691" %}

### Styling the `<button>` elements

Styling buttons can be tough work, there's a lot of states and interaction types
to account for. These buttons get complex quickly due to balancing
pseudo-elements, animations and interactions.

#### Initial `<button>` styles

Below are the foundational styles that will support the other states.

```css
.threeD-button-set button {
  /* strip out default button styles */
  appearance: none;
  outline: none;
  border: none;

  /* bring in brand styles via props */
  background-color: var(--_btn-bg);
  color: var(--_btn-text);
  text-shadow: 0 1px 1px var(--_btn-text-shadow);

  /* large text rounded corner and padded*/
  font-size: 5vmin;
  font-family: Audiowide;
  padding-block: .75ch;
  padding-inline: 2ch;
  border-radius: 5px 20px;
}
```

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/mfv2DarGZ9woqmV2avMH.png",
alt="Screenshot of the button list in 3D perspective, this time with styled
buttons.", width="800", height="495" %}

#### Button pseudo-elements

The borders of the button aren't traditional borders, they're absolute position
pseudo-elements with borders.

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/iNeDRVIv7UK1hRxx8r2z.png",
alt="Screenshot of Chrome Devtools Elements panel with a button shown having
::before and ::after elements.", width="800", height="304" %}

These elements are crucial in showcasing the 3D perspective that's been
established. One of these pseudo-elements will be pushed away from the button,
and one will be pulled closer to the user. The effect is most noticeable in the
top and bottom buttons.

```css
.threeD-button button {
  …

  &::after,
  &::before {
    /* create empty element */
    content: '';
    opacity: .8;

    /* cover the parent (button) */
    position: absolute;
    inset: 0;

    /* style the element for border accents */
    border: 1px solid var(--theme);
    border-radius: 5px 20px;
  }

  /* exceptions for one of the pseudo elements */
  /* this will be pushed back (3x) and have a thicker border */
  &::before {
    border-width: 3px;

    /* in dark mode, it glows! */
    @media (--dark) {
      box-shadow:
        0 0 25px var(--theme),
        inset 0 0 25px var(--theme);
    }
  }
}
```

#### 3D transform styles

Below `transform-style` is set to `preserve-3d` so the children can space
themselves out on the `z` axis. The `transform` is set to the `--distance`
custom property, which will be increased on [hover and
focus](#hover-and-focus-interaction-styles).

```css
.threeD-button-set button {
  …

  transform: translateZ(var(--distance));
  transform-style: preserve-3d;

  &::after {
    /* pull forward in Z space with a 3x multiplier */
    transform: translateZ(calc(var(--distance) / 3));
  }

  &::before {
    /* push back in Z space with a 3x multiplier */
    transform: translateZ(calc(var(--distance) / 3 * -1));
  }
}
```

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/WQQvNTk8gy0dC7w54Q7w.mp4",
   autoplay="true",
  loop="true",
  muted="true"
%}

#### Conditional animation styles

If the user is OK with motion, the button hints to the browser that the
transform property should be ready for change and a transition is set for
`transform` and `background-color` properties. Notice the difference in
duration, I felt it made for a nice subtle staggered effect.

```css
.threeD-button-set button {
  …

  @media (--motionOK) {
    will-change: transform;
    transition:
      transform .2s ease,
      background-color .5s ease
    ;

    &::before,
    &::after {
      transition: transform .1s ease-out;
    }

    &::after    { transition-duration: .5s }
    &::before { transition-duration: .3s }
  }
}
```

#### Hover and focus interaction styles

The goal of the interaction animation is to spread the layers that made up the
flat appearing button. Accomplish this by setting the `--distance` variable,
initially to `1px`. The selector shown in the following code example checks to
see if the button is being hovered or focused by a device that should see a
focus indicator, and not being activated. If so it applies CSS to do the
following:

- Apply the hover background color.
- Increase the distance .
- Add a bounce ease effect.
- Stagger the pseudo-element transitions.

{% Aside %} The varying `transition-duration` values are only on hover,
staggering the animation only for hover. When hover or focus are removed, each
layer transitions in unison to the resting place. {% endAside %}

```css
.threeD-button-set button {
  …

  &:is(:hover, :focus-visible):not(:active) {
    /* subtle distance plus bg color change on hover/focus */
    --distance: 15px;
    background-color: var(--_btn-bg-hover);

    /* if motion is OK, setup transitions and increase distance */
    @media (--motionOK) {
      --distance: 3vmax;

      transition-timing-function: var(--_bounce-ease);
      transition-duration: .4s;

      &::after  { transition-duration: .5s }
      &::before { transition-duration: .3s }
    }
  }
}
```

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/ZR3M0MTBzBU3m0RoHpxp.mp4",
   autoplay="true",
  loop="true",
  muted="true"
%}

The 3D perspective was still really neat for the `reduced` motion preference.
The top and bottom elements show the effect in a nice subtle way.

### Small enhancements with JavaScript

The interface is usable from keyboards, screen readers, gamepads, touch and a
mouse already, but we can add some light touches of JavaScript to ease a couple
of scenarios.

#### Supporting arrow keys

The tab key is a fine way to navigate the menu but I'd expect the directional
pad or joysticks to move focus on a gamepad. The
[roving-ux](https://github.com/argyleink/roving-ux) library often used for GUI
Challenge interfaces will handle arrow keys for us. The below code tells the
library to trap focus within `.threeD-button-set` and forward the focus to the
button children.

```js
import {rovingIndex} from 'roving-ux'

rovingIndex({
  element: document.querySelector('.threeD-button-set'),
  target: 'button',
})
```

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/PSF8lpd2tcmj35WIQlKT.mp4",
   autoplay="true",
  loop="true",
  muted="true"
%}

### Mouse parallax interaction

Tracking the mouse and having it tilt the menu is intended to mimic AR and VR
video game interfaces, where instead of a mouse you may have a virtual pointer.
It can be fun when elements are hyper aware of the pointer.

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/mNtHI14zZMoX250VIIZF.mp4",
   autoplay="true",
  loop="true",
  muted="true"
%}

Since this is a small extra feature, we'll put the interaction behind a query of
the user's motion preference. Also, as part of setup, store the button list
component into memory with `querySelector` and cache the element's bounds into
`menuRect`. Use these bounds to determine the rotate offset applied to the card
based on mouse position.

```js
const menu = document.querySelector('.threeD-button-set')
const menuRect = menu.getBoundingClientRect()

const { matches:motionOK } = window.matchMedia(
  '(prefers-reduced-motion: no-preference)'
)
```

Next, we need a function that accepts the mouse `x` and `y` positions and return
a value we can use to rotate the card. The following function uses the mouse
position to detemine which side of the box it's inside of and by how much. The
delta is returned from the function.

```js
const getAngles = (clientX, clientY) => {
  const { x, y, width, height } = menuRect

  const dx = clientX - (x + 0.5 * width)
  const dy = clientY - (y + 0.5 * height)

  return {dx,dy}
}
```

Lastly, watch the mouse move, pass the position to our `getAngles()` function
and use the delta values as custom property styles. I divided by 20 to pad the
delta and make it less twitchy, there may be a better way to do that. If you
remember from the beginning, we put the `--x` and `--y` props in the middle of a
`clamp()` function, this prevents the mouse position from overly rotating the
card into an illegible position.

```js
if (motionOK) {
  window.addEventListener('mousemove', ({target, clientX, clientY}) => {
    const {dx,dy} = getAngles(clientX, clientY)

    menu.attributeStyleMap.set('--x', `${dy / 20}deg`)
    menu.attributeStyleMap.set('--y', `${dx / 20}deg`)
  })
}
```

## Translations and directions

There was one gotcha when testing out the game menu in other writing modes and
languages.

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/BtBRYNIILR1iirytTZP3.mp4",
   autoplay="true",
  loop="true",
  muted="true"
%}

`<button>` elements have an `!important` style for `writing-mode` in the user
agent stylesheet. This meant the game menu HTML needed to change to accommodate
the desired design. Changing the button list to a list of links enables logical
properties to change the menu direction, as `<a>` elements don't have a browser
supplied `!important` style.

## Conclusion

Now that you know how I did it, how would you‽ 🙂 Can you add accelerometer
interaction to the menu, so tiling your phone rotates the menu? Can we improve
the no motion experience?

Let's diversify our approaches and learn all the ways to build on the web.
Create a demo, [tweet me](https://twitter.com/argyleink) links, and I'll add it
to the community remixes section below!

## Community remixes

*Nothing to see here yet!*
