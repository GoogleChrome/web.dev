---
title: 'Animation and motion'
authors:
  - cariefisher
description: >
  Support people with all types of movement-triggered disorders.  
date: 2023-09-30
tags:
  - accessibility
---

Have you ever been riding in a car, boat, or plane and suddenly felt the world
spin? Or had a migraine so bad that animations on your phone or tablet, 
created to “delight” you, suddenly make you sick? Or perhaps you've always been
sensitive to all types of motion? These are examples of different types of
vestibular disorders. 

By age 40, over 35% of adults will have experienced some form of
[vestibular dysfunction](https://vestibular.org/article/what-is-vestibular/about-vestibular-disorders/).
This may lead to a temporary dizzy spell, migraine-induced vertigo, or a more
permanent vestibular disability.

Beyond triggering vertigo, many people find moving, blinking, or scrolling
content distracting. People with
[ADHD](https://www.nimh.nih.gov/health/publications/attention-deficit-hyperactivity-disorder-in-children-and-teens-what-you-need-to-know)
and other attention deficit disorders might be so distracted by your animated
elements that they forget why they even went to your website or app in the
first place.

In this module, we'll look at some of the ways to help better support people
with all types of movement-triggered disorders. 

## Flashing and moving content

When building animation and motion, you should ask yourself whether the element's movement is excessive. For example, colors flickering from dark to light or quick movements on the screen, can cause seizures in people with photosensitive epilepsy. It is estimated that [3% of people with epilepsy](https://www.epilepsy.com/what-is-epilepsy/seizure-triggers/photosensitivity) suffer from photosensitivity, and it's more common in women and younger people.

The WCAG's [guidelines on flashing](https://www.w3.org/TR/WCAG21/#three-flashes-or-below-threshold) recommend against the following: 

* Flashes for more than three times in any one second
* Flashes below the [general flash and red flash threshold](https://www.w3.org/TR/WCAG21/#dfn-general-flash-and-red-flash-thresholds).

These flashes may, at best, cause an inability to use a webpage or, at worst, lead to illness.

For any extreme movement, it is imperative that you test it using the [Photosensitive Epilepsy Analysis Tool (PEAT)](https://trace.umd.edu/peat/). PEAT is a free tool to identify if the screen's content, video, or animations are likely to cause seizures. Not all content needs to be evaluated by PEAT, but content that contains flashing or rapid transitions between light and dark background colors should be evaluated, just to be safe.

Another question you should ask yourself about animation and motion is whether the element's movement is essential to understanding the content or actions on the screen. If it is not essential, consider removing all movement—even micro-movements—from the element you are building or designing.

Suppose you believe the element's movement is not essential but could enhance the user's overall experience, or you cannot remove the movement for another reason. In that case, you should follow WCAG's [guidelines on motion](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html). The guidelines state that you must build an option for users to pause, stop or hide movement for: non-essential moving, blinking, or scrolling elements that start automatically, last more than five seconds, and are part of other page elements.

## Pause, stop, hide movement

Add a [pause, stop, or hide](https://css-tricks.com/accessible-web-animation-the-wcag-on-animation-explained/#aa-pause-stop-hide) mechanism to your page to allows users to turn off potentially problematic motion animation. You can do this on the screen level or element level.

For example, suppose your digital product includes a lot of animations. Consider adding an [accessible JavaScript toggle](https://css-irl.info/accessible-toggles/) to allow users to control their experience. When the button is toggled to "motion off," all animations are frozen on that screen and all others.

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'xxjpBGE',
 height: 300,
 theme: 'auto',
 tab: 'html,css,result'
} %}

## Reduced motion media query

In addition to being selective about your animations, giving your users options to pause, stop, hide movement, and avoiding infinite animation loops, you may also consider adding a movement-focused media query. This gives your users even more choice when it comes to what is displayed on the screen.

### Prefers reduced motion

Similar to the color-focused media queries in the [color module](/learn/accessibility/color-contrast), the @prefers-reduced-motion media query checks the [user's OS settings](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion#user_preferences) related to animation.

A user may set display preferences to reduce motion. With [@prefers-reduced-motion](https://web.dev/prefers-reduced-motion/), you can design a site which respects this preference. The @prefers-reduced-motion media query is currently supported by [94.76% of all browsers](https://caniuse.com/prefers-reduced-motion).

{% Codepen {
 user: 'web-dev-codepen-external',
 id: 'VwxyReM',
 height: 350,
 theme: 'auto',
 tab: 'css,result'
} %}

Alternatively, as shown in the next set of examples, you can code all your animations to stop moving within five seconds or less instead of playing on an infinite loop.


