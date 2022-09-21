---
layout: post
title: Building a floating action button (FAB) component
subhead: A foundational overview of how to build color-adaptive, responsive, and accessible FAB components.
authors:
  - adamargyle
description: A foundational overview of how to build color-adaptive, responsive, and accessible FAB components.
date: 2022-09-21
thumbnail: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/0mQ6NlDjbNGqdcjiJRaM.png
hero: image/vS06HQ1YTsbMKSFTIPl2iogUQP73/sGEdjhUpRkriI86wZctn.png
alt: A tilted grid of hotpink FABs.
tags:
  - blog
  - css
  - html
---

In this post I want to share my thoughts on how to build color-adaptive,
responsive, and accessible FAB components. [Try the
demo](https://gui-challenges.web.app/FAB/dist/) and [view the
source](https://github.com/argyleink/gui-challenges)!

<style>
  .auto-aspect {
    aspect-ratio: auto;
  }
</style>

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/g3TG5gGs3qmGxBfaUIXf.mp4",
  autoplay="true",
  loop="true",
  muted="true",
  class="auto-aspect"
%}

If you prefer video, here's a YouTube version of this post:

{% YouTube 'RXopH5t2Kww' %}

## Overview

FABs are more common on mobile than desktop, but they're prevalent in both
scenarios. They keep primary actions in view, making them convenient and
omnipresent. This user experience style was made famous by Material UI and their
suggestions for usage and placement can be [found
here](https://material.io/components/buttons-floating-action-button).

## Elements and styles

The HTML for these controls involves a container element and a set of one or
more buttons. The container positions the FABs within the viewport and manages a
gap between the buttons. The buttons can be mini or default, giving some nice
variety between primary and secondary actions.

### FAB container

This element can be a regular `<div>` but let's do our unsighted users a favor
and tag it with some helpful attributes to explain the purpose and contents of
this container.

#### FABs markup

Start with a ".fabs" class for CSS to hook into for style, then add
`role="group"` and `aria-label` so it's  not just a generic container, it's
named and purposeful.

```html
<div class="fabs" role="group" aria-label="Floating action buttons">
  <!-- buttons will go here -->
</div>
```

#### FABs style

In order for FABs to be convenient they stick within the viewport at all times.
This is a great use case for position
[`fixed`](https://developer.mozilla.org/docs/Web/CSS/position). Within this
viewport position I chose to use
[`inset-block`](https://developer.mozilla.org/docs/Web/CSS/inset-block) and
[`inset-inline`](https://developer.mozilla.org/docs/Web/CSS/inset-inline) so the
position will compliment the user's document mode, like right-to-left or
left-to-right. Custom properties are also used to prevent repetition and ensure
equal distance from the bottom and side edges of the viewport:

```css
.fabs {
  --_viewport-margin: 2.5vmin;

  position: fixed;
  z-index: var(--layer-1);

  inset-block: auto var(--_viewport-margin);
  inset-inline: auto var(--_viewport-margin);
}
```

Next I give the container display
[`flex`](https://developer.mozilla.org/docs/Web/CSS/flex) and change its
layout direction to
[`column-reverse`](https://developer.mozilla.org/docs/Web/CSS/flex-direction).
This stacks the children on top of each other (column) and also reverses their
visual order. This has the effect of making the first focusable element the
bottom element instead of the top, which would be where focus goes normally per
the HTML document. Reversing the visual order unites the experience for sighted
users and keyboard users, as the styling of the primary action as larger than
the mini buttons indicates to sighted users that it's a primary action, and
keyboard users will focus it as the first item in the source.

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/PkRWiv4mtfCDXujti7lL.png", alt="ALT_TEXT_HERE", width="800", height="501" %}

```css
.fabs {
  …

  display: flex;
  flex-direction: column-reverse;
  place-items: center;
  gap: var(--_viewport-margin);
}
```

Centering is handled with
[`place-items`](https://developer.mozilla.org/docs/Web/CSS/place-items), and
[`gap`](https://developer.mozilla.org/docs/Web/CSS/gap) adds space between any
FAB buttons placed in the container.

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/2AKk0IQVDdvMDGnBVk6J.mp4",
  autoplay="true",
  loop="true",
  muted="true",
  class="auto-aspect"
%}

### FAB buttons

Time to style some buttons to look like they're floating over top of everything.

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/XFklV07Wsn7q82rEBYD6.mp4",
  autoplay="true",
  loop="true",
  muted="true",
  class="auto-aspect"
%}

#### Default FAB

The first button to style is the default button. This will serve as the base for
all the FAB buttons. Later we'll create a variant that achieves an alternative
appearance while modifying as little of these base styles as possible.

#### FAB markup

The `<button>` element is the right choice. We'll start with this as the base
because it comes with great mouse, touch, and keyboard user experience. The most
crucial aspect of this markup is to hide the icon from screenreader users with
`aria-hidden="true"` and add the necessary label text to the `<button>` markup
itself. When adding labels in these cases I also like adding a `title` so mouse
users can get information about what the icon is hoping to communicate.

```html
<button data-icon="plus" class="fab" title="Add new action" aria-label="Add new action">
  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">...</svg>
</button>
```

#### FAB style

First let's turn the button into a padded round button with a strong shadow, as
these are the first defining features of the button:

```css
.fab {
  --_size: 2rem;

  padding: calc(var(--_size) / 2);
  border-radius: var(--radius-round);
  aspect-ratio: 1;
  box-shadow: var(--shadow-4);
}
```

Next let's add color. We'll use a strategy we've used in GUI Challenges before.
Create a clearly named set of custom properties that statically hold the light
and dark colors, then an adaptive custom property that will be set to either the
light or the dark variables depending on the user's system preference for
colors:

```css
.fab {
  …

  /* light button and button hover */
  --_light-bg: var(--pink-6);
  --_light-bg-hover: var(--pink-7);

  /* dark button and button hover */
  --_dark-bg: var(--pink-4);
  --_dark-bg-hover: var(--pink-3);

  /* adaptive variables set to light by default */
  --_bg: var(--_light-bg);

  /* static icon colors set to the adaptive foreground variable */
  --_light-fg: white;
  --_dark-fg: black;
  --_fg: var(--_light-fg);

  /* use the adaptive properties on some styles */
  background: var(--_bg);
  color: var(--_fg);

  &:is(:active, :hover, :focus-visible) {
    --_bg: var(--_light-bg-hover);

    @media (prefers-color-scheme: dark) {
      --_bg: var(--_dark-bg-hover);
    }
  }

  /* if users prefers dark, set adaptive props to dark */
  @media (prefers-color-scheme: dark) {
    --_bg: var(--_dark-bg);
    --_fg: var(--_dark-fg);
  }
}
```

Next add some styles to help the SVG icons fit the space.

```css
.fab {
  …

  & > svg {
    inline-size: var(--_size);
    block-size: var(--_size);
    stroke-width: 3px;
  }
}
```

Last, remove the tap highlight from the button since we've added our own visual
feedback for interaction:

```css
.fab {
  -webkit-tap-highlight-color: transparent;
}
```

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/qjMTHfEqKa6o2zRRcvKg.mp4",
  autoplay="true",
  loop="true",
  muted="true",
  class="auto-aspect"
%}

#### Mini FAB

The goal of this section is to create a variant for the FAB button. By making
some of the FABs smaller than the default action, we can promote the action the
user performs the most often.

##### Mini FAB markup

The HTML is the same as a FAB but we add a ".mini" class to give CSS a hook into
the variant.

```html
<button data-icon="heart" class="fab mini" title="Like action" aria-label="Like action">
  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">...</svg>
</button>
```

##### Mini FAB style

Thanks to usage of custom properties, the only change needed is an adjustment to
the `--_size` variable.

```css
.fab.mini {
  --_size: 1.25rem;
}
```

{% Img src="image/vS06HQ1YTsbMKSFTIPl2iogUQP73/bYhvGgYmV0OiztY7j58r.png", alt="ALT_TEXT_HERE", width="664", height="410" %}

## Accessibility

The most important part to remember for accessibility with FABs is placement
within the keyboard flow of the page. This demo only has the FABs, there's
nothing to compete with in terms of keyboard order and flow, which means it
doesn't have an opportunity to demonstrate a meaningful keyboard flow. In a
scenario where there's competing elements for focus, I suggest thinking deeply
about where in that flow should a user find themselves entering into the FAB
button flow.

<figure data-size="full">
  {% Video
    src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/Sgr0PllZvJ9eDTP3LSf6.mp4",
    autoplay="true",
    loop="true",
    muted="true",
    class="auto-aspect"
  %}
  <figcaption>
    Keyboard interaction demonstration
  </figcaption>
</figure>

Once the user has focused into the FAB container, we've already added
`role="group"` and `aria-label="floating action buttons"` which inform screen
reader users about the contents of what they have focused. Strategically I've
placed the default FAB first, so that users find the primary action first. I
then use `flex-direction: column-reverse;` to visually order the primary button
on the bottom, close to the users fingers for easy access. This is a nice win
because the default button is visually prominent and also first for keyboard
users, giving them very similar experiences.

Lastly, don't forget to hide your icons from screen reader users and ensure you
provide them with a label for the button so it's not a mystery. This has been
done in the HTML already with `aria-hidden="true"` on the `<svg>` and
`aria-label="Some action"` on the `<button>`s.

## Animation

Various types of animation can be added to enhance the user experience. Like in
other GUI Challenges, we'll set up a couple of custom properties to hold the
intent of a reduced motion experience and a full motion experience. By default
the styles will assume the user wants reduced motion, then using the
`prefers-reduced-motion` media query swap the transition value to full motion.

### A reduced motion strategy with custom properties

Three custom properties are created in the following CSS: `--_motion-reduced`,
`--_motion-ok`, and `--_transition`. The first two hold appropriate transitions
given the user's preference, and the last variable `--_transition` will be set
to either `--_motion-reduced` or `--_motion-ok` respectively.

```css
.fab {
  /* box-shadow and background-color can safely be transitioned for reduced motion users */
  --_motion-reduced:
    box-shadow .2s var(--ease-3),
    background-color .3s var(--ease-3);

  /* add transform and outline-offset for users ok with motion */
  --_motion-ok:
    var(--_motion-reduced),
    transform .2s var(--ease-3),
    outline-offset 145ms var(--ease-2);

  /* default the transition styles to reduced motion */
  --_transition: var(--_motion-reduced);

  /* set the transition to our adaptive transition custom property*/
  transition: var(--_transition);

  /* if motion is ok, update the adaptive prop to the respective transition prop */
  @media (prefers-reduced-motion: no-preference) {
    --_transition: var(--_motion-ok);
  }
}
```

With the above in place, changes to `box-shadow`, `background-color`,
`transform` and `outline-offset` can be transitioned, giving the user nice UI
feedback that their interaction has been received.

Next, add a little bit more flair to the `:active` state by adjusting
`translateY`a little bit, this gives the button a nice pressed effect:

```css
.fab {
  …

  &:active {
    @media (prefers-reduced-motion: no-preference) {
      transform: translateY(2%);
    }
  }
}
```

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/lc16x8xZb8SAjvn3j4nK.mp4",
  autoplay="true",
  loop="true",
  muted="true",
  class="auto-aspect"
%}

Then lastly, transition any changes to the SVG icons in the buttons:

```css
.fab {
  …

  &[data-icon="plus"]:hover > svg {
    transform: rotateZ(.25turn);
  }

  & > svg {
    @media (prefers-reduced-motion: no-preference) {
      will-change: transform;
      transition: transform .5s var(--ease-squish-3);
    }
  }
}
```

{% Video
  src="video/vS06HQ1YTsbMKSFTIPl2iogUQP73/fAZut0C45mYdXvcX1kz4.mp4",
  autoplay="true",
  loop="true",
  muted="true",
  class="auto-aspect"
%}

{% Aside %}
The easing function `--ease-squish-3` is part of Open Props and is
responsible for the elastic bouncy effect on the rotation. Find more props like
it at the [Open Props document website](https://open-props.style/).
{% endAside %}

## Conclusion

Now that you know how I did it, how would you‽ 🙂

Let's diversify our approaches and learn all the ways to build on the web.

Create a demo, [tweet me](https://twitter.com/argyleink) links, and I'll add it
to the community remixes section below!

## Community remixes

*Nothing to see here yet.*

### Resources

- [Source code](https://github.com/argyleink/gui-challenges/tree/main/FAB) on Github
