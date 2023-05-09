---
layout: post
title: Reduce the scope and complexity of style calculations
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/soE8BwfZ2Svut2cfoQTp.jpg
thumbnail: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/tir1bnxgs7uFrIDw26sN.jpg
alt: A photo of a desktop publishing prepress color palette CMYK book with line tester.
subhead: |
  JavaScript is often the trigger for visual changes. Sometimes that's directly through style manipulations, and sometimes it's calculations that will result in visual changes, like searching or sorting some data. Badly-timed or long-running JavaScript can be a common cause of performance issues, and you should look to minimize its impact where you can.
authors:
  - paullewis
  - jlwagner
date: 2015-03-20
updated: 2023-05-09
description: |
  JavaScript is often the trigger for visual changes. Sometimes that's directly through style manipulations, and sometimes it's calculations that will result in visual changes, like searching or sorting some data. Badly-timed or long-running JavaScript can be a common cause of performance issues, and you should look to minimize its impact where you can.
tags:
  - blog
  - performance
  - web-vitals
---

Changing the DOM, through adding and removing elements, changing attributes, classes, or through animation, will all cause the browser to recalculate element styles and, in many cases, layout (or reflow) the page, or parts of it. This process is called _computed style calculation_.

The first part of computing styles is to create a set of matching selectors, which is essentially the browser figuring out which classes, pseudo-selectors, and IDs apply to any given element.

The second part of the process involves taking all the style rules from the matching selectors and figuring out what final styles the element has.

{% Aside %}
Roughly half of the time used in Blink (the rendering engine used in Chromium and derived browsers) to calculate the computed style for an element is used to match selectors, and the other half of the time is used to construct the RenderStyle (computed style representation) from the matched rules.

Rune Lillesveen, Opera / [Style Invalidation in Blink](https://docs.google.com/document/d/1vEW86DaeVs4uQzNFI5R-_xS9TcS1Cs_EUsHRSgCHGu8/view)
{% endAside %}

## Summary

* How reducing style calculation costs can lower interaction latency.
* Reduce the complexity of your selectors; use a class-centric methodology (BEM, for example).
* Reduce the number of elements on which style calculation must be calculated.

## Style recalculation time and interaction latency

The [Interaction to Next Paint (INP)](/inp/) is a user-centric runtime performance metric that assesses a page's overall responsiveness to user input. When interaction latency is assessed by this metric, it measures the time starting from when the user interacts with the page, up until the browser paints the next frame showing the corresponding visual updates made to the user interface.

A significant component of an interaction is the time it takes to paint the next frame. Rendering work done to present the next frame is made up of many parts, including calculation of page styles that occur just prior to layout, paint, and compositing work. While this article focuses solely on style calculation costs, it's important to emphasize that reducing any part of the rendering phase inherent to interaction will reduce its total latency—style calculation included.

## Reduce the complexity of your selectors

In the simplest case, you can reference an element in your CSS with just a class:

```css
.title {
  /* styles */
}
```

But, as any project grows, it will likely result in more complex CSS, such that you may end up with selectors that look like this:

```css
.box:nth-last-child(-n+1) .title {
  /* styles */
}
```

In order to know how these styles apply to the page, the browser has to effectively ask "is this an element with a class of `title` which has a parent who happens to be the minus nth child plus 1 element with a class of `box`?" Figuring this out _can_ take a lot of time, depending on the selector used as well as the browser in question. The intended behavior of the selector could instead be changed to a class:

```css
.final-box-title {
  /* styles */
}
```

You can take issue with the name of the class, but the job just got a lot simpler for the browser. In the previous version, in order to know, for example, that the element is the last of its type, the browser must first know everything about all the other elements and whether the are any elements that come after it that would be the `nth-last-child`, which is potentially more expensive than simply matching up the selector to the element because its class matches.

## Reduce the number of elements being styled

Another performance consideration—which is typically _the more important factor for many style updates_—is the sheer volume of work that needs to be carried out when an element changes.

In general terms, the worst case cost of calculating the computed style of elements is the number of elements multiplied by the selector count, because each element needs to be at least checked once against every style to see if it matches.

{% Aside %}
It used to be the case that if you changed a class on—say—the body element, that all the children in the page would need to have their computed styles recalculated. Thankfully that is no longer the case; some browsers instead maintain a small collection of rules unique to each element that, if changed, cause the element's styles to be recalculated. That means that an element may or may not need to be recalculated depending on where it is in the tree, and what specifically got changed.
{% endAside %}

Style calculations can often be targeted to a few elements directly rather than invalidating the page as a whole. In modern browsers, this tends to be less of an issue because the browser doesn't necessarily need to check all the elements potentially affected by a change. Older browsers, on the other hand, aren't necessarily as optimized for such tasks. Where you can, you should **reduce the number of invalidated elements**.

{% Aside %}
If you're into Web Components, it's worth noting that style calculations here are a little different, since by default styles do not cross the Shadow DOM boundary, and are scoped to individual components rather than the tree as a whole. Overall, however, the same concept still applies: smaller trees with simpler rules are more efficiently processed than larger trees with more complex rules.
{% endAside %}

## Measure your style recalculation cost

One way to measure the cost of style recalculations is to use the performance panel in Chrome DevTools. To begin, open DevTools, go to the tab labeled **Performance**, hit record, and interact with the page. When you stop recording, you'll see something like the image below:

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/wfJrPeoKeLzbJLEjoZsz.png", alt="DevTools showing style calculations.", width="800", height="595" %}
</figure>

The strip at the top is a miniature flame chart that also plots frames per second. The closer the activity is to the bottom of the strip, the faster frames are being painted by the browser. If you see the flame chart leveling out at the top with red strips above it, then you have work that's causing long running frames.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/VfajFwdCmOINMIaN6ApQ.png", alt="Zooming in on a trouble area in Chrome DevTools in the activity summary of the populated performance panel in Chrome DevTools.", width="769", height="126" %}
</figure>

If you have a long running frame during an interaction like scrolling, then it bears further scrutiny. If you have a large purple block, zoom in on the activity and select any work labeled **Recalculate Style** to get more information on potentially expensive style recalculation work.

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/qUtq3jcEjpzDN9isYF9U.png", alt="Getting the details of long-running style calculations, including vital information such as the amount of elements affected by the style recalculation work.", width="647", height="218" %}
</figure>

In this grab there is long-running style recalculation work that is taking just over 25ms.

If you click the event itself, you are given a call stack. If the rendering work was due to a user interaction, the place in your JavaScript that is responsible for triggering the style change will be called out. In addition to that, you also get the number of elements that have been affected by the change—just over 900 elements in this case—and how long it took to do the style calculation work. You can use this information to start trying to find a fix in your code.

## Use Block, Element, Modifier

Approaches to coding like [BEM (Block, Element, Modifier)](https://bem.info/) actually bake in the selector matching performance benefits above, because it recommends that everything has a single class, and, where you need hierarchy, that gets baked into the name of the class as well:

```css
.list {
  /* Styles */
}

.list__list-item {
  /* Styles */
}
```

If you need some modifier, like in the above where we want to do something special for the last child, you can add that like so:

```css
.list__list-item--last-child {
  /* Styles */
}
```

If you're looking for a good way to organize your CSS, BEM is a good starting point, both from a structure point-of-view, and also because of the simplifications of style lookup the methodology promotes.

If you don't like BEM, there are other ways to approach your CSS, but the performance considerations should be assessed alongside the ergonomics of the approach.

## Resources

* [Style invalidation in Blink](https://docs.google.com/document/d/1vEW86DaeVs4uQzNFI5R-_xS9TcS1Cs_EUsHRSgCHGu8/edit)
* [BEM (Block, Element, Modifier)](https://bem.info/)

_Hero image from [Unsplash](https://unsplash.com/), by [Markus Spiske](https://unsplash.com/@markusspiske)._
