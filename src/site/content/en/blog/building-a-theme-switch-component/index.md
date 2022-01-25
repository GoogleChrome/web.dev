---
layout: post
title: Building a theme switch component
subhead: A foundational overview of how to build an adaptive and accessible theme switch component.
authors:
  - adamargyle
description: A foundational overview of how to build an adaptive and accessible theme switch component.
date: 2022-01-19
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/Us7qjkapii7sZurl0glF.png
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/skKcjSv1gMQRYk1AdEp7.png
alt: The sun and the word light and the moon next to the word dark.
tags:
  - blog
  - css
  - dom
  - javascript
---

In this post I want to share thinking on a way to build a dark and light theme switch component.
[Try the demo](https://gui-challenges.web.app/theme-switch/dist/).

<figure data-size="full">
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/vLZNIPTNEXLl9rxxlirg.mp4",
       autoplay="true",
    loop="true",
    muted="true"
  %}
  <figcaption>
    <a href="https://gui-challenges.web.app/theme-switch/dist/">Demo</a> button size increased for easy visibility
  </figcaption>
</figure>

If you prefer video, here's a YouTube version of this post:

{% YouTube 'kZiS1QStIWc' %}

## Overview

A website may provide settings for controlling the color scheme instead of
relying entirely on the system preference. This means that users may browse in a
mode other than their system preferences. For example, a user's system is in a
light theme, but the user prefers the website to display in the dark theme. 

There are several web engineering considerations when building this feature. For
example, the browser should be made aware of the preference as soon as possible
to prevent page color flashes, and the control needs to first sync with the
system then allow client-side stored exceptions.

<figure data-size="full">
  {% Img 
    src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/5v5M1n6bOtSBaVXbkcon.png", 
    alt="", 
    width="800", 
    height="687" 
  %}
  <figcaption>
    Diagram shows a preview of JavaScript page load and document 
    interaction events to overall show there's 4 paths to setting the theme
  </figcaption>
</figure>

## Markup

A [`<button>`](https://developer.mozilla.org/docs/Web/HTML/Element/button)
should be used for the toggle, as you then benefit from browser-provided
interaction events and features, such as click events and focusability.

### The button

The button needs a class for use from CSS and an ID for use from JavaScript.
Additionally, since the button content is an icon rather than text, add a
[title](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/title)
attribute to provide information about the button's purpose. Last, add an
[`[aria-label]`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-label_attribute)
to hold the state of the icon button, so screen readers can share the state of
the theme to folks who are visually impaired.

```html
<button 
  class="theme-toggle" 
  id="theme-toggle" 
  title="Toggles light & dark" 
  aria-label="auto"
>
  …
</button>
```

#### `aria-label` and `aria-live` polite

To indicate to screen readers that changes to `aria-label` should be announced,
add
[`aria-live="polite"`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Attributes/aria-live#:~:text=on%20that%20region.-,polite,-Indicates%20that%20updates)
to the button. 

```html/5/
<button 
  class="theme-toggle" 
  id="theme-toggle" 
  title="Toggles light & dark" 
  aria-label="auto" 
  aria-live="polite"
>
  …
</button>
```

This markup addition signals to screen readers to politely, instead of
[`aria-live="assertive"`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/ARIA_Live_Regions#:~:text=aria%2Dlive%3D%22assertive%22%20should%20only%20be%20used%20for%20time%2Dsensitive/critical%20notifications%20that%20absolutely%20require%20the%20user%27s%20immediate%20attention.),
tell the user what changed. In the case of this button, it will announce "light"
or "dark" depending on what the `aria-label` has become.

### The scalable vector graphic (SVG) icon

[SVG](https://developer.mozilla.org/docs/Web/SVG) provides a way to create
high-quality, scalable shapes with minimal markup. Interacting with the button
can trigger new visual states for the vectors, making SVG great for icons.

The following SVG markup goes inside the `<button>`:

```html
<svg class="sun-and-moon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
  …
</svg>
```

[`aria-hidden`](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-hidden_attribute)
has been added to the SVG element so screen readers know to ignore it as it's
marked presentational. This is great to do for visual decorations, like the icon
inside a button. In addition to the required `viewBox` attribute on the element,
add height and width for [similar reasons that images should get inline
sizes](/learn/design/responsive-images/).

#### The sun

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/Pt2FGFpSH7StPlNYPbU0.png",
  alt="The sun icon shown with the sunbeams faded out and a hotpink arrow
  pointing to the circle in the center.", width="720", height="450" 
%}

The sun graphic consists of a circle and lines which SVG conveniently has shapes
for. The `<circle>` is centered by setting the `cx` and `cy` properties to 12,
which is half of the viewport size (24), and then given a radius (`r`) of `6`
which sets the size.

```html/1/
<svg class="sun-and-moon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
  <circle class="sun" cx="12" cy="12" r="6" mask="url(#moon-mask)" fill="currentColor" />
</svg>
```

Additionally, the mask property points to an [SVG element's
ID](https://developer.mozilla.org/docs/Web/CSS/url()#:~:text=url(myFont.woff)%3B-,url(%23IDofSVGpath),-%3B%0A%0A/*%20associated%20properties%20*/%0Abackground),
which you will create next, and finally given a fill color that matches the
page's text color with
[`currentColor`](https://developer.mozilla.org/docs/Web/CSS/color_value#currentcolor_keyword).

#### The sun beams

{% Img 
  src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/hd7EDnsqE1ubV63IJGp5.png", 
  alt="The sun icon shown with the sun center faded out and a hotpink arrow
  pointing to the sunbeams.", 
  width="720", 
  height="450" 
%}

Next, the sunbeam lines are added just below the circle, inside of a group
element [`<g>`](https://developer.mozilla.org/docs/Web/SVG/Element/g)
group.

```html/2-11/
<svg class="sun-and-moon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
  <circle class="sun" cx="12" cy="12" r="6" mask="url(#moon-mask)" fill="currentColor" />
  <g class="sun-beams" stroke="currentColor">
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </g>
</svg>
```

This time, instead of the value of
[fill](https://developer.mozilla.org/docs/Web/SVG/Attribute/fill) being
`currentColor`, each line's
[stroke](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke) is
set. The lines plus the circle shapes create a nice sun with beams.

{% Aside %} 
Icon SVG sourced from
[https://feathericons.com/?query=sun](https://feathericons.com/?query=sun) with
minor adjustments made. 
{% endAside %}

#### The moon

To create the illusion of a seamless transition between light (sun) and dark
(moon), the moon is an augmentation of the sun icon, using an SVG mask.

```html/5-8/
<svg class="sun-and-moon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
  <circle class="sun" cx="12" cy="12" r="6" mask="url(#moon-mask)" fill="currentColor" />
  <g class="sun-beams" stroke="currentColor">
    …
  </g>
  <mask class="moon" id="moon-mask">
    <rect x="0" y="0" width="100%" height="100%" fill="white" />
    <circle cx="24" cy="10" r="6" fill="black" />
  </mask>
</svg>
```

<figure>
  {% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/zZD0vHrGfUaZg5N8NFNV.png",
alt="Graphic with three vertical layers to help show how masking works. The top
layer is a white square with a black circle. The middle layer is the sun icon.
The bottom layer is labeled as the result and it shows the sun icon with a
cutout where the top layer black circle is.", width="800", height="708" %}
</figure>

[Masks](https://developer.mozilla.org/docs/Web/SVG/Element/mask) with SVG
are powerful, allowing the colors white and black to either remove or include
parts of another graphic. The sun icon will be eclipsed by a moon
[`<circle>`](https://developer.mozilla.org/docs/Web/SVG/Element/circle)
shape with an SVG mask, simply by moving a circle shape in and out of a mask
area.

#### What happens if CSS doesn’t load?

<figure style="max-inline-size: 116px">
  {% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/wJQaRpllUVFFoNHxbDfK.png",
alt="Screenshot of a plain browser button with the sun icon inside.",
width="116", height="103" %}
</figure>

It can be nice to test your SVG as if CSS didn't load to ensure the result isn't
super large or causing layout issues. The inline height and width attributes on
the SVG plus the use of `currentColor` give minimal style rules for the browser
to use if CSS doesn't load. This makes for nice defensive styles against network
turbulence.

## Layout

The theme switch component has little surface area, so you don’t need grid or
flexbox for layout. Instead, SVG positioning and CSS transforms are used. 

## Styles

### `.theme-toggle` styles

The `<button>` element is the container for the icon shapes and styles. This
parent context will hold adaptive colors and sizes to pass down to SVG. 

The first task is to make the button a circle and remove the default button
styles: 

```css
.theme-toggle {
  --size: 2rem;
  
  background: none;
  border: none;
  padding: 0;

  inline-size: var(--size);
  block-size: var(--size);
  aspect-ratio: 1;
  border-radius: 50%;
}
```

Next, add some interaction styles. Add a cursor style for mouse users. Add
`touch-action: manipulation` for a [fast reacting touch
experience](https://twitter.com/argyleink/status/1405881231695302659?s=20).
Remove the semi-transparent highlight iOS applies to buttons. Last, give the
focus state outline some breathing room from the edge of the element:

```css/12-15/
.theme-toggle {
  --size: 2rem;

  background: none;
  border: none;
  padding: 0;

  inline-size: var(--size);
  block-size: var(--size);
  aspect-ratio: 1;
  border-radius: 50%;

  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  outline-offset: 5px;
}
```

The SVG inside of the button needs some styles as well. The SVG should fit the size of the button and, for visual softness, round out the line ends:

```css/16-20/
.theme-toggle {
  --size: 2rem;

  background: none;
  border: none;
  padding: 0;

  inline-size: var(--size);
  block-size: var(--size);
  aspect-ratio: 1;
  border-radius: 50%;

  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  outline-offset: 5px;

  & > svg {
    inline-size: 100%;
    block-size: 100%;
    stroke-linecap: round;
  }
}
```

{% Aside %} 
The [CSS @nest](https://www.w3.org/TR/css-nesting-1/)
feature, used with [PostCSS
Nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting),
allows authoring new styles without leaving a selectors context. The above
nested selector creates `.theme-toggle > svg` because the `&` character is
dynamically represented as `.theme-toggle`. 
{% endAside %}

#### Adaptive sizing with the `hover` media query

The icon button size is a bit small at `2rem`, which is fine for mouse users but
can be a struggle for a coarse pointer like a finger. Make the button meet many
[touch size
guidelines](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple/overview/buttons/#:~:text=buttons%20that%20measure%2044x44%20pt)
by using a [hover media
query](https://developer.mozilla.org/docs/Web/CSS/@media/hover) to specify
a size increase. 

```css/4-6/
.theme-toggle {
  --size: 2rem;
  …
  
  @media (hover: none) {
    --size: 48px;
  }
}
```

### Sun and moon SVG styles

The button holds the interactive aspects of the theme switch component while SVG
inside will hold the visual and animated aspects. This is where the icon can be
made beautiful and brought to life.

#### Light theme

<figure>
{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/Lswkub5NhuBJ016OeSO1.png",
alt="ALT_TEXT_HERE", width="800", height="551" %}
</figure>

For scale and rotate animations to happen from the center of SVG shapes, set
their `transform-origin: center center`. The adaptive colors provided by the
button are used here by the shapes. The moon and sun use the button provided
`var(--icon-fill)` and `var(--icon-fill-hover)` for their fill, while the
sunbeams use the variables for stroke.

```css
.sun-and-moon {
  & > :is(.moon, .sun, .sun-beams) {
    transform-origin: center center;
  }

  & > :is(.moon, .sun) {
    fill: var(--icon-fill);

    @nest .theme-toggle:is(:hover, :focus-visible) > & {
      fill: var(--icon-fill-hover);
    }
  }

  & > .sun-beams {
    stroke: var(--icon-fill);
    stroke-width: 2px;

    @nest .theme-toggle:is(:hover, :focus-visible) & {
      stroke: var(--icon-fill-hover);
    }
  }
}
```

{% Aside %} 
`@nest` is used again, this time to make a new selector that targets
a parent button being hovered or focused. `@nest .theme-toggle:is(:hover,
:focus-visible) &` in this usage is the same as `@nest .theme-toggle:is(:hover,
:focus-visible) .sun-and-moon > .sun-beams`. 
{% endAside %}

#### Dark theme

<figure>
{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/qNMkCQzYCuBK0EjrJHjk.png",
alt="ALT_TEXT_HERE", width="800", height="556" %}
</figure>

The moon styles need to remove the sunbeams, scale up the sun circle and move
the circle mask. 

```css
.sun-and-moon {
  @nest [data-theme="dark"] & {
    & > .sun {
      transform: scale(1.75);
    }

    & > .sun-beams {
      opacity: 0;
    }

    & > .moon > circle {
      transform: translateX(-7px);

      @supports (cx: 1) {
        transform: translateX(0);
        cx: 17;
      }
    }
  }
}
```

Notice the dark theme has no color changes or transitions. The parent button
component owns the colors, where they're already adaptive within a dark and
light context. The transition information should be behind a user's motion
preference media query.

## Animation

The button should be functional and stateful but without transitions at this
point. The following sections are all about defining **how** and **what**
transitions.

<figure>
{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/47Di3gA4139lDULJJY2y.mp4",
  autoplay="true",
  loop="true",
  muted="true" 
%}
</figure>

### Sharing media queries and importing easings

To make it easy to put transitions and animations behind a user's operating
system motion preferences, the [PostCSS](https://postcss.org/) plugin [Custom
Media](https://github.com/postcss/postcss-custom-media) enables usage of the
[drafted CSS specification for media query
variables](https://drafts.csswg.org/mediaqueries-5/#custom-mq) syntax:

```css
@custom-media --motionOK (prefers-reduced-motion: no-preference);

/* usage example */
@media (--motionOK) {
  .sun {
    transition: transform .5s var(--ease-elastic-3);
  }
}
```

For unique and easy to use CSS easings, import the
[easings](https://open-props.style/#easing) portion of [Open
Props](https://open-props.style/):

```css
@import "https://unpkg.com/open-props/easings.min.css";

/* usage example */
.sun {
  transition: transform .5s var(--ease-elastic-3);
}
```

### The sun

The sun transitions will be more playful than the moon, achieving this effect
with bouncy easings. The sunbeams should bounce a small amount as they rotate
and the center of the sun should bounce a small amount as it scales.

<figure>
{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/47Di3gA4139lDULJJY2y.mp4",
  autoplay="true",
  loop="true",
  muted="true"
%}
</figure>

The default (light theme) styles define the transitions and the dark theme
styles define customizations for the transition to light:

```css/3,7-10,16-17,22/
​​.sun-and-moon {
  @media (--motionOK) {
    & > .sun {
      transition: transform .5s var(--ease-elastic-3);
    }

    & > .sun-beams {
      transition: 
        transform .5s var(--ease-elastic-4),
        opacity .5s var(--ease-3)
      ;
    }

    @nest [data-theme="dark"] & {
      & > .sun {
        transform: scale(1.75);
        transition-timing-function: var(--ease-3);
        transition-duration: .25s;
      }

      & > .sun-beams {
        transform: rotateZ(-25deg);
        transition-duration: .15s;
      }
    }
  }
}
```

In the [Animation](https://developer.chrome.com/docs/devtools/css/animations/)
panel in Chrome DevTools, you can find a timeline for animation transitions. The
duration of the total animation, the elements, and the easing timing can be
inspected.

<figure data-size="full">
  {% Img 
    src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/5KYAhwMgxZf9nnKvlDxn.png", 
    alt="",
    width="800", 
    height="334" 
  %}
  <figcaption>
    Light to dark transition
  </figcaption>
</figure>

<figure data-size="full">
  {% Img 
    src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/SO9IRLvOXSVeyl3TCjPu.png", 
    alt="",
    width="800", 
    height="203" 
  %}
  <figcaption>
    Dark to light transition
  </figcaption>
</figure>

### The moon

The moon light and dark positions are already set, add transition styles inside
of the `--motionOK` media query to bring it to life while respecting the user's
motion preferences. 

<figure>
{% Video 
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/47Di3gA4139lDULJJY2y.mp4",
  autoplay="true",
  loop="true",
  muted="true"
%}
</figure>

The timing with delay and duration are critical in making this transition clean.
If the sun is eclipsed too early, for example, the transition doesn't feel
orchestrated or playful, it feels chaotic.

```css/4,9,15-16/
​​.sun-and-moon {
  @media (--motionOK) {
    & .moon > circle {
      transform: translateX(-7px);
      transition: transform .25s var(--ease-out-5);

      @supports (cx: 1) {
        transform: translateX(0);
        cx: 17;
        transition: cx .25s var(--ease-out-5);
      }
    }

    @nest [data-theme="dark"] & {
      & > .moon > circle {
        transition-delay: .25s;
        transition-duration: .5s;
      }
    }
  }
}
```

<figure data-size="full">
  {% Img 
    src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/Fd6K4IVMe4XaOF12ngXY.png", 
    alt="",
    width="800", 
    height="334" 
  %}
  <figcaption>
    Light to dark transition
  </figcaption>
</figure>

<figure data-size="full">
  {% Img 
    src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/Bw0oBqpFw1mZ0OXHGeAU.png", 
    alt="",
    width="800", 
    height="203" 
  %}
  <figcaption>
    Dark to light transition
  </figcaption>
</figure>

### Prefers reduced motion

In most [GUI Challenges](/shows/gui-challenges/) I try to keep
some animation, like opacity cross fades, for users who prefer reduced motion.
This component felt better with instant state changes however. 

## JavaScript

There's a lot of work for JavaScript in this component, from managing ARIA
information for screen readers to getting and setting values from [local
storage](https://developer.mozilla.org/docs/Web/API/Window/localStorage).


### The page load experience

It was important that no color flashing occurs on page load. If a user with a
dark color scheme indicates they preferred light with this component, then
reloaded the page, at first the page would be dark then it would flash to light.
Preventing this meant running a small amount of blocking JavaScript with the
goal to set the HTML attribute `data-theme` as early as possible. 

```html
<script src="./theme-toggle.js"></script>
```

To achieve this, a plain `<script>` tag in the document `<head>` is loaded
first, before any CSS or `<body>` markup. When the browser encounters an
unmarked script like this, it runs the code and executes it before the rest of
the HTML. Using this blocking moment sparingly, it's possible to set the HTML
attribute before the main CSS paints the page, thus preventing a flash or
colors.

The JavaScript first checks for the user's preference in local storage and
fallback to check the system preference if nothing is found in storage:

```js
const storageKey = 'theme-preference'

const getColorPreference = () => {
  if (localStorage.getItem(storageKey))
    return localStorage.getItem(storageKey)
  else
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
}
```

A function to set the user's preference in local storage is parsed next:

```js
const setPreference = () => {
  localStorage.setItem(storageKey, theme.value)
  reflectPreference()
}
```

Followed by a function to modify the document with the preferences. 

```js
const reflectPreference = () => {
  document.firstElementChild
    .setAttribute('data-theme', theme.value)

  document
    .querySelector('#theme-toggle')
    ?.setAttribute('aria-label', theme.value)
}
```

An important thing to note at this point is the HTML
document parsing state. The browser doesn't know about the "#theme-toggle"
button yet, as the `<head>` tag hasn't been completely parsed. However, the
browser does have a
[`document.firstElementChild`](https://developer.mozilla.org/docs/Web/API/Element/firstElementChild)
, aka the `<html>` tag. The function attempts to set both to keep them in sync,
but on first run will only be able to set the HTML tag. The
[`querySelector`](https://developer.mozilla.org/docs/Web/API/Document/querySelector)
won't find anything at first and the [optional chaining
operator](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
ensures no syntax errors when it's not found and the setAttribute function is
attempted to be invoked. 

Next, that function `reflectPreference()` is immediately called so the HTML
document has its `data-theme` attribute set:

```js
reflectPreference()
```

The button still needs the attribute, so wait for the page load event, then it
will be safe to query, add listeners and set attributes on:

```js
window.onload = () => {
  // set on load so screen readers can get the latest value on the button
  reflectPreference()

  // now this script can find and listen for clicks on the control
  document
    .querySelector('#theme-toggle')
    .addEventListener('click', onClick)
}
```

### The toggling experience

When the button is clicked, the theme needs to be swapped, in JavaScript memory
and in the document. The current theme value will need to be inspected and a
decision made about its new state. Once the new state is set, save it and update
the document:

```js
const onClick = () => {
  theme.value = theme.value === 'light'
    ? 'dark'
    : 'light'

  setPreference()
}
```

### Synchronizing with the system

Unique to this theme switch is synchronization with the system preference as it
changes. If a user changes their system preference while a page and this
component are visible, the theme switch will change to match the new user
preference, as if the user had interacted with the theme switch at the same time
it did the system switch. 

Achieve this with JavaScript and a
[`matchMedia`](https://developer.mozilla.org/docs/Web/API/Window/matchMedia)
event listening for changes to a media query:

```js
window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', ({matches:isDark}) => {
    theme.value = isDark ? 'dark' : 'light'
    setPreference()
  })
```

<figure>
  {% Video 
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/0QqWAZuInaTPysj2BYCq.mp4",
    autoplay="true",
    loop="true",
    muted="true"
  %}
  <figcaption>
    Changing the MacOS system preference changes the theme switch state
  </figcaption>
</figure>

## Conclusion

Now that you know how I did it, how would you‽ 🙂

Let's diversify our approaches and learn all the ways to build on the web.
Create a demo, [tweet me](https://twitter.com/argyleink) links, and I'll add it
to the community remixes section below!

## Community remixes

- [@NathanG](https://twitter.com/NathanG) on [Codepen with Vue](https://codepen.io/nathangath/pen/qYeOJJ)
- [@ShadowShahriar](https://twitter.com/ShadowShahriar) on [Codepen](https://codepen.io/ShadowShahriar/pen/ZEQPvMP)
- [@tomayac](https://twitter.com/tomayac) as a [custom element](https://github.com/GoogleChromeLabs/dark-mode-toggle)
- [@bramus](https://twitter.com/bramus) with [vanilla JavaScript](https://www.bram.us/2020/04/26/the-quest-for-the-perfect-dark-mode-using-vanilla-javascript/)
- [@JoshWComeau](https://twitter.com/JoshWComeau) with [react](https://www.joshwcomeau.com/react/dark-mode/)
