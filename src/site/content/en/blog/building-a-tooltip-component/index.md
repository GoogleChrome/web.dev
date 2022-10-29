---
layout: post
title: Building a tooltip component
subhead: A foundational overview of how to build a color-adaptive and accessible tooltip custom element.
authors:
  - adamargyle
description: A foundational overview of how to build a color-adaptive and accessible tooltip custom element.
date: 2022-10-25
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/Mx5dDmELgbJottijzfwF.png
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/5XgqLJdeI33MDjvJu2te.png
alt: A tiled grid of tooltips.
tags:
  - blog
  - css
  - html
---

In this post I want to share my thoughts on how to build a color-adaptive and accessible `<tool-tip>` custom element. [Try the
demo](https://gui-challenges.web.app/tooltips/dist/) and [view the
source](https://github.com/argyleink/gui-challenges)!

<style>
  .auto-aspect {
    aspect-ratio: auto;
  }
</style>

<figure data-size="full">
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/pLo4ykDKsCiyDexUb208.mp4",
    autoplay="true",
    loop="true",
    muted="true"
  %}
  <figcaption>
    A tooltip is shown working across a variety of examples and color schemes
  </figcaption>
</figure>

If you prefer video, here's a YouTube version of this post:

{% YouTube 'Y5EIC_UyPME' %}

## Overview

A tooltip is a non-modal, non-blocking, non-interactive overlay containing
supplemental information to user interfaces. It is hidden by default and becomes
unhidden when an associated element is hovered or focused. A tooltip can't be
selected or interacted with directly. Tooltips are not replacements for labels
or other high value information, a user should be able to fully complete their
task without a tooltip.

<figure>
  {% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/b2K0zdHds4yQQNST7DUj.png", width="800", height="245", alt="" %}
  <figcaption>
    Do: always label your inputs.<br>
    Don't: rely on tooltips instead of labels
  </figcaption>
</figure>

### Toggletip vs Tooltip

Like many components, there are varying descriptions of what a tooltip is, for
example in
[MDN](https://developer.mozilla.org/docs/Web/Accessibility/ARIA/Roles/tooltip_role),
[WAI ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/), [Sarah
Higley](https://sarahmhigley.com/writing/tooltips-in-wcag-21/), and [Inclusive
Components](https://inclusive-components.design/tooltips-toggletips/). I like
the separation between tooltips and toggletips. A tooltip should contain
non-interactive supplemental information, while a toggletip can contain
interactivity and important information. The primary reason for the divide is
accessibility, how are users expected to navigate to the popup and have access
to the information and buttons within. Toggletips get complex quickly.

Here's a video of a toggletip from the [Designcember](https://designcember.com/)
site; an overlay with interactivity that a user can pin open and explore, then
close with light dismiss or the escape key:

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/DM7qi0GUBZQGpR2qvMst.mp4",
  autoplay="true",
  loop="true",
  muted="true",
  class="auto-aspect"
%}

This GUI Challenge went the route of a tooltip, looking to do almost everything
with CSS, and here's how to build it.

## Markup

I chose to use a custom element `<tool-tip>`. Authors don't need to make custom
elements into web components if they don't want to. The browser will treat
`<foo-bar>` just like a `<div>`. You could think of a custom element like a
classname with less specificity. There's no JavaScript involved.

```html
<tool-tip>A tooltip</tool-tip>
```

This is like a div with some text inside. We can tie into the accessibility tree
of capable screen readers by adding `[role="tooltip"]`.

```html
<tool-tip role="tooltip">A tooltip</tool-tip>
```

Now, to screen readers, it's recognized as a tooltip. See in the following
example how the first link element has a recognized tooltip element in its tree
and the second does not? The second one doesn't have the role. In the styles
section we'll improve upon this tree view.

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/yFjZc6VXnJhXPBKk6nGA.png", alt="A
screenshot of Chrome DevTools Accessibility Tree representing the HTML. Shows a
link with text 'top ; Has tooltip: Hey, a tooltip!' that's focusable. Inside of
it is static text of 'top' and a tooltip element.", width="800", height="268" %}

Next we need the tooltip to not be focusable. If a screen reader doesn't
understand the tooltip role it will allow users to focus the `<tool-tip>` to
read the contents, and the user experience doesn't need this. Screen readers
will append the content to the parent element and as such, it doesn't need focus
to be made accessible. Here we can use `inert` to ensure no users will
accidentally find this tooltip content in their tab flow:

```html
<tool-tip inert role="tooltip">A tooltip</tool-tip>
```

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/sNBvSvyOyfJQdu2viQHs.png",
alt="Another screenshot of Chrome DevTools Accessibility Tree, this time the
tooltip element is missing.", width="800", height="77" %}

I then chose to use attributes as the interface to specify the position of the
tooltip. By default all the `<tool-tip>`s will assume a "top" position, but the
position can be customized on an element by adding `tip-position`:

```html
<tool-tip role="tooltip" tip-position="right ">A tooltip</tool-tip>
```

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/TMXICYtLqsuCEUrOROOn.png", alt="A
screenshot of a link with a tooltip to the right saying 'A tooltip'.",
width="800", height="155" %}

I tend to use attributes instead of classes for things like this so that the
`<tool-tip>` can't have multiple positions assigned to it at the same time.
There can be only one or none.

Finally, place `<tool-tip>` elements inside of the element you wish to provide a
tooltip for. Here I share the `alt` text with sighted users by placing an image
and a `<tool-tip>` inside of a
[`<picture>`](https://developer.mozilla.org/docs/Web/HTML/Element/picture)
element:

```html
<picture>
  <img alt="The GUI Challenges skull logo" width="100" src="...">
  <tool-tip role="tooltip" tip-position="bottom">
    The <b>GUI Challenges</b> skull logo
  </tool-tip>
</picture>
```

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/JeKL6O5gpZTaqdAdY20w.png", alt="A
screenshot of an image with a tooltip that says 'The GUI Challenges skull
logo'.", width="800", height="552" %}

Here I place a `<tool-tip>` inside of an
[`<abbr>`](https://developer.mozilla.org/docs/Web/HTML/Element/abbr)
element:

```html
<p>
  The <abbr>HTML <tool-tip role="tooltip" tip-position="top">Hyper Text Markup Language</tool-tip></abbr> abbr element.
</p>
```

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/AfXJazViIAf8ONlI3AxF.png", alt="A
screenshot of a paragraph with the acronym HTML underlined and a tooltip above
it saying 'Hyper Text Markup Language'.", width="512", height="250" %}

## Accessibility

Since I've chosen to build tooltips and not toggletips, this section is much
simpler. First, let me outline what our desired user experience:

1. In constrained spaces or cluttered interfaces, hide supplemental messages.
1. When a user hovers, focuses or uses touch to interact with an element, reveal
   the message.
1. When hover, focus or touch ends, hide the message again.
1. Lastly, ensure any motion is reduced if a user has specified a preference for
   reduced motion.

Our goal is on demand supplemental messaging. A sighted mouse or keyboard user can hover to reveal the message, reading it with their eyes. A non-sighted screen reader user can focus to reveal the message, audibly receiving it through their tool.

<figure>
  {% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/UysCSNx4AhGBPeStZ3CU.png", width="800", height="189", alt="" %}
  <figcaption>
    Screenshot of MacOS VoiceOver reading a link with a tooltip
  </figcaption>
</figure>

In the previous section we covered the accessibility tree, the tooltip role and
inert, what's left is to test it and verify the user experience appropriately
reveals the tooltip message to the user. Upon testing, it's unclear as to which
part of the audible message is a tooltip. It can be seen while debugging in the
accessibility tree too, the link text of "top" is run together, without
hesitation, with "Look, tooltips!". The screen reader doesn't break or identify
the text as tooltip content.

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/wfn1xsgRMUuQxG4SXfT4.png", alt="A
screenshot of the Chrome DevTools Accessibility Tree where the link text says
'top Hey, a tooltip!'.", width="800", height="106" %}

Add a screen reader only pseudo-element to the `<tool-tip>` and we can add our
own prompt text for non-sighted users.

```css
&::before {
  content: "; Has tooltip: ";
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
  height: 1px;
  width: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
}
```

Below you can see the updated accessibility tree, which now has a semicolon
after the link text and a prompt for the tooltip "Has tooltip: ".

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/cLTxacpxlsqNQtO2fTi4.png",
alt="An updated screenshot of the Chrome DevTools Accessibility Tree where the
link text has improved phrasing, 'top ; Has tooltip: Hey, a tooltip!'.",
width="800", height="82" %}

Now, when a screen reader user focuses the link, it says "top" and takes a small
pause, then announces "has tooltip: look, tooltips". This gives a screen reader
user a couple nice UX hints. The hesitation gives a nice separation between the
link text and the tooltip. Plus, when "has tooltip" is announced, a screen
reader user can easily cancel it if they've already heard it before. It's very
reminiscent to hovering and unhovering quickly, as you've already seen the
supplemental message. This felt like nice UX parity.

## Styles

The `<tool-tip>` element will be a child of the element it's representing
supplemental messaging for, so let's first start with the essentials for the
overlay effect. Take it out of document flow with `position absolute`:

```css
tool-tip {
  position: absolute;
  z-index: 1;
}
```

If the parent is not a stacking context, the tooltip will position itself to the
nearest one that is, which isn't what we want. There's a new selector on the
block that can help, [`:has()`](https://developer.chrome.com/blog/has-m105/):

{% BrowserCompat 'css.selectors.has' %}

```css
:has(> tool-tip) {
  position: relative;
}
```

Don't worry too much about the browser support. First, remember these tooltips
are supplementary. If they don't work it should be fine. Second, in the
JavaScript section we'll deploy a script to polyfill the functionality we need
for browsers without `:has()` support.

Next, let's make the tooltips non-interactive so they don’t steal pointer events
from their parent element:

```css
tool-tip {
  …
  pointer-events: none;
  user-select: none;
}
```

Then, hide the tooltip with opacity so we can transition the tooltip with a
crossfade:

```css
tool-tip {
  opacity: 0;
}

:has(> tool-tip):is(:hover, :focus-visible, :active) > tool-tip {
  opacity: 1;
}
```

[`:is()`](https://developer.mozilla.org/docs/Web/CSS/:is) and `:has()` do
the heavy lifting here, making `tool-tip` containing parent elements aware of
user interactivity as to toggle the visibility of a child tooltip. Mouse users
can hover, keyboard and screen reader users can focus, and touch users can tap.

{% Aside %}
I think the reality of this tooltip solution is that touch users get
the worst experience, as they need to hold their finger over the element to see
the tooltip. Really ensure these tooltips are supplemental information.
{% endAside %}

With the show and hide overlay working for sighted users, it's time to add some
styles for theming, positioning and adding the triangle shape to the bubble. The
following styles begin using custom properties, building upon where we are so
far but also adding shadows, typography and colors so it looks like a floating
tooltip:

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/ofzjTXNlID2kGJsL4MYo.png", alt="A
screenshot of the tooltip in dark mode, floating over the link 'block-start'.",
width="796", height="272" %}

```css
tool-tip {
  --_p-inline: 1.5ch;
  --_p-block: .75ch;
  --_triangle-size: 7px;
  --_bg: hsl(0 0% 20%);
  --_shadow-alpha: 50%;

  --_bottom-tip: conic-gradient(from -30deg at bottom, rgba(0,0,0,0), #000 1deg 60deg, rgba(0,0,0,0) 61deg) bottom / 100% 50% no-repeat;
  --_top-tip: conic-gradient(from 150deg at top, rgba(0,0,0,0), #000 1deg 60deg, rgba(0,0,0,0) 61deg) top / 100% 50% no-repeat;
  --_right-tip: conic-gradient(from -120deg at right, rgba(0,0,0,0), #000 1deg 60deg, rgba(0,0,0,0) 61deg) right / 50% 100% no-repeat;
  --_left-tip: conic-gradient(from 60deg at left, rgba(0,0,0,0), #000 1deg 60deg, rgba(0,0,0,0) 61deg) left / 50% 100% no-repeat;

  pointer-events: none;
  user-select: none;

  opacity: 0;
  transform: translateX(var(--_x, 0)) translateY(var(--_y, 0));
  transition: opacity .2s ease, transform .2s ease;

  position: absolute;
  z-index: 1;
  inline-size: max-content;
  max-inline-size: 25ch;
  text-align: start;
  font-size: 1rem;
  font-weight: normal;
  line-height: normal;
  line-height: initial;
  padding: var(--_p-block) var(--_p-inline);
  margin: 0;
  border-radius: 5px;
  background: var(--_bg);
  color: CanvasText;
  will-change: filter;
  filter:
    drop-shadow(0 3px 3px hsl(0 0% 0% / var(--_shadow-alpha)))
    drop-shadow(0 12px 12px hsl(0 0% 0% / var(--_shadow-alpha)));
}

/* create a stacking context for elements with > tool-tips */
:has(> tool-tip) {
  position: relative;
}

/* when those parent elements have focus, hover, etc */
:has(> tool-tip):is(:hover, :focus-visible, :active) > tool-tip {
  opacity: 1;
  transition-delay: 200ms;
}

/* prepend some prose for screen readers only */
tool-tip::before {
  content: "; Has tooltip: ";
  clip: rect(1px, 1px, 1px, 1px);
  clip-path: inset(50%);
  height: 1px;
  width: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
}

/* tooltip shape is a pseudo element so we can cast a shadow */
tool-tip::after {
  content: "";
  background: var(--_bg);
  position: absolute;
  z-index: -1;
  inset: 0;
  mask: var(--_tip);
}

/* top tooltip styles */
tool-tip:is(
  [tip-position="top"],
  [tip-position="block-start"],
  :not([tip-position]),
  [tip-position="bottom"],
  [tip-position="block-end"]
) {
  text-align: center;
}
```

### Theme adjustments

The tooltip only has a few colors to manage as the text color is inherited from
the page via the system keyword `CanvasText`. Also, since we've made custom
properties to store the values, we can update only those custom properties and
let the theme handle the rest:

```css
@media (prefers-color-scheme: light) {
  tool-tip {
    --_bg: white;
    --_shadow-alpha: 15%;
  }
}
```

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/mdoUK4pOHiyf4jcgpACG.png", alt="A
side by side screenshot of the light and dark versions of the tooltip.",
width="800", height="153" %}

For the light theme, we adapt the background to white and make the shadows much
less strong by adjusting their opacity.

### Right to left

In order to support right to left reading modes, a custom property will store
the value of the document direction into a value of -1 or 1 respectively.

```css
tool-tip {
  --isRTL: -1;
}

tool-tip:dir(rtl) {
  --isRTL: 1;
}
```

This can be used to assist in positioning the tooltip:

```css
tool-tip[tip-position="top"]) {
  --_x: calc(50% * var(--isRTL));
}
```

As well as assist in where the triangle is:

```css
tool-tip[tip-position="right"]::after {
  --_tip: var(--_left-tip);
}

tool-tip[tip-position="right"]:dir(rtl)::after {
  --_tip: var(--_right-tip);
}
```

Lastly, can also be used for logical transforms on `translateX()`:

```css
--_x: calc(var(--isRTL) * -3px * -1);
```

### Tooltip positioning

Position the tooltip logically with the `inset-block` or `inset-inline`
properties to handle both the physical and logical tooltip positions. The
following code shows how each of the four positions are styled for both
left-to-right and right-to-left directions.

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Qi9AZrjpX4s9Nzoe1yZX.mp4",
  autoplay="true",
  loop="true",
  muted="true",
  class="auto-aspect"
%}

#### Top and block-start alignment

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/XPtm4jrENpk3wt7p1e4V.png", alt="A
screenshot showing the placement difference between left-to-right top position
and right-to-left top position.", width="800", height="191" %}

```css
tool-tip:is([tip-position="top"], [tip-position="block-start"], :not([tip-position])) {
  inset-inline-start: 50%;
  inset-block-end: calc(100% + var(--_p-block) + var(--_triangle-size));
  --_x: calc(50% * var(--isRTL));
}

tool-tip:is([tip-position="top"], [tip-position="block-start"], :not([tip-position]))::after {
  --_tip: var(--_bottom-tip);
  inset-block-end: calc(var(--_triangle-size) * -1);
  border-block-end: var(--_triangle-size) solid transparent;
}
```

#### Right and inline-end alignment

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/HyTs2tuKcPbmHnH3BVor.png", alt="A
screenshot showing the placement difference between left-to-right right position
and right-to-left inline-end position.", width="800", height="421" %}

```css
tool-tip:is([tip-position="right"], [tip-position="inline-end"]) {
  inset-inline-start: calc(100% + var(--_p-inline) + var(--_triangle-size));
  inset-block-end: 50%;
  --_y: 50%;
}

tool-tip:is([tip-position="right"], [tip-position="inline-end"])::after {
  --_tip: var(--_left-tip);
  inset-inline-start: calc(var(--_triangle-size) * -1);
  border-inline-start: var(--_triangle-size) solid transparent;
}

tool-tip:is([tip-position="right"], [tip-position="inline-end"]):dir(rtl)::after {
  --_tip: var(--_right-tip);
}
```

#### Bottom and block-end alignment

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/CgSlkA2Styscf9rDRAnf.png", alt="A
screenshot showing the placement difference between left-to-right bottom
position and right-to-left block-end position.", width="800", height="216" %}

```css
tool-tip:is([tip-position="bottom"], [tip-position="block-end"]) {
  inset-inline-start: 50%;
  inset-block-start: calc(100% + var(--_p-block) + var(--_triangle-size));
  --_x: calc(50% * var(--isRTL));
}

tool-tip:is([tip-position="bottom"], [tip-position="block-end"])::after {
  --_tip: var(--_top-tip);
  inset-block-start: calc(var(--_triangle-size) * -1);
  border-block-start: var(--_triangle-size) solid transparent;
}
```

#### Left and inline-start alignment

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/ASyNnVtZ8bp9VuwFgfH2.png", alt="A
screenshot showing the placement difference between left-to-right left position
and right-to-left inline-start position.", width="800", height="486" %}

```css
tool-tip:is([tip-position="left"], [tip-position="inline-start"]) {
  inset-inline-end: calc(100% + var(--_p-inline) + var(--_triangle-size));
  inset-block-end: 50%;
  --_y: 50%;
}

tool-tip:is([tip-position="left"], [tip-position="inline-start"])::after {
  --_tip: var(--_right-tip);
  inset-inline-end: calc(var(--_triangle-size) * -1);
  border-inline-end: var(--_triangle-size) solid transparent;
}

tool-tip:is([tip-position="left"], [tip-position="inline-start"]):dir(rtl)::after {
  --_tip: var(--_left-tip);
}
```

## Animation

So far we've only toggled the visibility of the tooltip. In this section we'll
first animate opacity for all users, as it's a generally safe reduced motion
transition. Then we'll animate the transform position so the tooltip appears to
slide out from the parent element.

### A safe and meaningful default transition

Style the tooltip element to transition opacity and transform, like this:

```css
tool-tip {
  opacity: 0;
  transform: translateX(var(--_x, 0)) translateY(var(--_y, 0));
  transition: opacity .2s ease, transform .2s ease;
}

:has(> tool-tip):is(:hover, :focus-visible, :active) > tool-tip {
  opacity: 1;
  transition-delay: 200ms;
}
```

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/zCibybxd4947z1qLnGEP.mp4",
  autoplay="true",
  loop="true",
  muted="true"
%}

### Adding motion to the transition

For each of the sides a tooltip can appear on, if the user is ok with motion,
slightly position the translateX property by giving it a small distance to
travel from:

```css
@media (prefers-reduced-motion: no-preference) {
  :has(> tool-tip:is([tip-position="top"], [tip-position="block-start"], :not([tip-position]))):not(:hover):not(:focus-visible):not(:active) tool-tip {
    --_y: 3px;
  }

  :has(> tool-tip:is([tip-position="right"], [tip-position="inline-end"])):not(:hover):not(:focus-visible):not(:active) tool-tip {
    --_x: -3px;
  }

  :has(> tool-tip:is([tip-position="bottom"], [tip-position="block-end"])):not(:hover):not(:focus-visible):not(:active) tool-tip {
    --_y: -3px;
  }

  :has(> tool-tip:is([tip-position="left"], [tip-position="inline-start"])):not(:hover):not(:focus-visible):not(:active) tool-tip {
    --_x: 3px;
  }
}
```

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/OUglbz54FT80hEZY5ouw.mp4",
  autoplay="true",
  loop="true",
  muted="true"
%}

Notice this is setting the "out" state, as the "in" state is at `translateX(0)`.

## JavaScript

In my opinion, the JavaScript is optional. This is because none of these
tooltips should be required reading to accomplish a task in your UI. So if the
tooltips completely fail, it should be no big deal. This also means we can treat
the tooltips as progressively enhanced. Eventually all browsers will support
`:has()` and this script can completely go away.

The polyfill script does two things, and does so only if the browser doesn't
support `:has()`. First, check for `:has()` support:

```js
if (!CSS.supports('selector(:has(*))')) {
  // do work
}
```

Next, find the parent elements of `<tool-tip>`s and give them a classname to
work with:

```js
if (!CSS.supports('selector(:has(*))')) {
  document.querySelectorAll('tool-tip').forEach(tooltip =>
    tooltip.parentNode.classList.add('has_tool-tip'))
}
```

Next, inject a set of styles that use that classname, simulating the `:has()`
selector for the exact same behavior:

```js
if (!CSS.supports('selector(:has(*))')) {
  document.querySelectorAll('tool-tip').forEach(tooltip =>
    tooltip.parentNode.classList.add('has_tool-tip'))

  let styles = document.createElement('style')
  styles.textContent = `
    .has_tool-tip {
      position: relative;
    }
    .has_tool-tip:is(:hover, :focus-visible, :active) > tool-tip {
      opacity: 1;
      transition-delay: 200ms;
    }
  `
  document.head.appendChild(styles)
}
```

That's it, now all browsers will happily show the tooltips if `:has()` is not
supported.

## Conclusion

Now that you know how I did it, how would you‽ 🙂 I'm really looking forward to
the
[`popup`](https://developer.chrome.com/blog/pop-ups-theyre-making-a-resurgence/)
API for making toggletips easier, [top
layer](https://developer.chrome.com/blog/what-is-the-top-layer/) for no z-index
battles, and the
[`anchor`](https://twitter.com/jh3yy/status/1563206768049926144?s=20&t=MiEcoMGyRHr5eS_CtWLsmg)
API for positioning things in the window better. Until then, I'll be making
tooltips.

Let's diversify our approaches and learn all the ways to build on the web.

Create a demo, [tweet me](https://twitter.com/argyleink) links, and I'll add it
to the community remixes section below!

## Community remixes

*Nothing to see here yet.*

### Resources

- [Source code](https://github.com/argyleink/gui-challenges/tree/main/tooltips) on Github
