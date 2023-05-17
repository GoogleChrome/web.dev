---
layout: post
title: Avoid large, complex layouts and layout thrashing
hero: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/Yv6fjfgK4j51XHDWIkw1.jpg
thumbnail: image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/l0vqWPN7MjFYtNw1rTkZ.jpg
alt: A rough watercolor painting of a design layout. There are three boxes laid across the X-axis. The left one is primarily painted in the blue, the middle in purple, and the one at the right in green.
subhead: |
  Layout is where the browser figures out the geometric information for elements - their size and location in the page. Each element will have explicit or implicit sizing information based on the CSS that was used, the contents of the element, or a parent element. The process is called Layout in Chrome.
authors:
  - paullewis
  - jlwagner
date: 2015-03-20
updated: 2023-05-09
description: |
  Layout is where the browser figures out the geometric information for elements - their size and location in the page. Each element will have explicit or implicit sizing information based on the CSS that was used, the contents of the element, or a parent element. The process is called Layout in Chrome.
tags:
  - blog
  - performance
  - web-vitals
---

Layout is where the browser figures out the geometric information for elements: their size and location in the page. Each element will have explicit or implicit sizing information based on the CSS that was used, the contents of the element, or a parent element. The process is called Layout in Chrome (and derived browsers such as Edge), and Safari. In Firefox it's called Reflow, but the process is effectively the same.

Similarly to style calculations, the immediate concerns for layout cost are:

1. The number of elements that require layout, which is a byproduct of the page's [DOM size](/dom-size-and-interactivity/).
1. The complexity of those layouts.

## Summary

* Layout has a direct effect on interaction latency
* Layout is normally scoped to the whole document.
* The number of DOM elements will affect performance; you should avoid triggering layout wherever possible.
* Avoid forced synchronous layouts and layout thrashing; read style values then make style changes.

## The effects of layout on interaction latency

When a user interacts with the page, those interactions should be as fast as possible. The amount of time it takes for an interaction to complete—ending when the browser presents the next frame to show the results of the interaction—is known as _interaction latency_. This is an aspect of page performance that the [Interaction to Next Paint](/inp/) metric measures.

The amount of time it takes for the browser to present the next frame in response to a user interaction is known as the interaction's _presentation delay_. The goal of an interaction is to provide visual feedback in order to signal to the user that something has occurred, and visual updates can involve some amount of layout work in order to achieve that goal.

In order to keep your website's INP as low as possible, it's important to avoid layout when possible. If it's not possible to avoid layout entirely, it's important to limit that layout work so that the browser can present the next frame quickly.

{% Aside 'objective' %}
**Read to learn more:**&nbsp;[Interaction to Next Paint (INP)](/inp/).
{% endAside %}

## Avoid layout wherever possible

When you change styles the browser checks to see if any of the changes require layout to be calculated, and for that render tree to be updated. Changes to "geometric properties", such as widths, heights, left, or top all require layout.

```css
.box {
  width: 20px;
  height: 20px;
}

/**
  * Changing width and height
  * triggers layout.
  */

.box--expanded {
  width: 200px;
  height: 350px;
}
```

Layout is almost always scoped to the entire document. If you have a lot of elements, it's going to take a long time to figure out the locations and dimensions of them all.

If it's not possible to avoid layout then the key is to once again use Chrome DevTools to see how long it's taking, and determine if layout is the cause of a bottleneck. Firstly, open DevTools, go to the Timeline tab, hit record and interact with your site. When you stop recording you'll see a breakdown of how your site performed:

<figure>
  {% Img src="image/jL3OLOhcWUQDnR4XjewLBx4e3PC3/HlHTc64DGtiGxcnGhWxP.png", alt="DevTools showing a long time in Layout.", width="800", height="597" %}
</figure>

When digging into the trace in the above example, we see that over 28 milliseconds is spent inside layout for each frame, which, when we have 16 milliseconds to get a frame on screen in an animation, is far too high. You can also see that DevTools will tell you the tree size (1,618 elements in this case), and how many nodes were in need of layout (5 in this case).

Keep in mind that the general advice here is to avoid layout _whenever possible_—but it isn't always possible to avoid layout. In cases where you can't avoid layout, know that the cost of layout has a relationship with the size of the DOM. Although the relationship between the two isn't tightly coupled, larger DOMs will generally incur higher layout costs.

{% Aside 'objective' %}
**Read to learn more:**&nbsp;[DOM size and interactivity](/dom-size-and-interactivity/).
{% endAside %}

## Avoid forced synchronous layouts

Shipping a frame to screen has this order:

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/mSZbp9o13Mub4fq8PWzT.jpg", alt="Using flexbox as layout.", width="800", height="122" %}
</figure>

First the JavaScript runs, _then_ style calculations, _then_ layout. It is, however, possible to force a browser to perform layout earlier with JavaScript. This is called **forced synchronous layout**.

The first thing to keep in mind is that as the JavaScript runs all the old layout values from the previous frame are known and available for you to query. So if, for example, you want to write out the height of an element (let's call it "box") at the start of the frame you may write some code like this:

```js
// Schedule our function to run at the start of the frame:
requestAnimationFrame(logBoxHeight);

function logBoxHeight () {
  // Gets the height of the box in pixels and logs it out:
  console.log(box.offsetHeight);
}
```

Things get problematic if you've changed the styles of the box _before_ you ask for its height:

```js
function logBoxHeight () {
  box.classList.add('super-big');

  // Gets the height of the box in pixels and logs it out:
  console.log(box.offsetHeight);
}
```

Now, in order to answer the height question, the browser must _first_ apply the style change (because of adding the `super-big` class), and _then_ run layout. Only then will it be able to return the correct height. This is unnecessary and potentially expensive work.

{% Aside 'important' %}
While the example above uses the `offsetHeight` property, there are [many properties to be aware of](https://gist.github.com/paulirish/5d52fb081b3570c81e3a) that can trigger forced synchronous layout.
{% endAside %}

Because of this, you should always batch your style reads and do them first (where the browser can use the previous frame's layout values) and then do any writes:

Done correctly the above function would be:

```js
function logBoxHeight () {
  // Gets the height of the box in pixels and logs it out:
  console.log(box.offsetHeight);

  box.classList.add('super-big');
}
```

For the most part you shouldn't need to apply styles and then query values; using the last frame's values should be sufficient. Running the style calculations and layout synchronously and earlier than the browser would like are potential bottlenecks, and not something you will typically want to do.

## Avoid layout thrashing

There's a way to make forced synchronous layouts even worse: _do lots of them in quick succession_. Take a look at this code:

```js
function resizeAllParagraphsToMatchBlockWidth () {
  // Puts the browser into a read-write-read-write cycle.
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.width = `${box.offsetWidth}px`;
  }
}
```

This code loops over a group of paragraphs and sets each paragraph's width to match the width of an element called "box". It looks harmless enough, but the problem is that each iteration of the loop reads a style value (`box.offsetWidth`) and then immediately uses it to update the width of a paragraph (`paragraphs[i].style.width`). On the next iteration of the loop, the browser has to account for the fact that styles have changed since `offsetWidth` was last requested (in the previous iteration), and so it must apply the style changes, and run layout. This will happen on _every single iteration!_.

The fix for this sample is to once again _read_ and then _write_ values:

```js
// Read.
const width = box.offsetWidth;

function resizeAllParagraphsToMatchBlockWidth () {
  for (let i = 0; i < paragraphs.length; i++) {
    // Now write.
    paragraphs[i].style.width = `${width}px`;
  }
}
```

If you want to guarantee safety, consider using [FastDOM](https://github.com/wilsonpage/fastdom), which automatically batches your reads and writes for you, and should prevent you from triggering forced synchronous layouts or layout thrashing accidentally.

_Hero image from [Unsplash](https://unsplash.com/), by [Hal Gatewood](https://unsplash.com/@halacious)._
