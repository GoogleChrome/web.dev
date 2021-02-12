---
layout: post
title: Why are some animations slow?
authors:
  - rachelandrew
description: |
  Animating well is core to a great web experience.
  This post explains why certain types of animation perform better than others.
date: 2020-10-06
tags:
  - animations
  - performance
---

Modern browsers can animate two CSS properties cheaply: `transform` and `opacity`.
If you animate anything else,
the chances are you're not going to hit a silky smooth 60 frames per second (FPS).
This post explains why this is the case.

## Animation performance and frame rate {: #fps }

It is widely accepted that a frame rate of 60 FPS is the target when animating anything on the web.
This frame rate will ensure that your animations look smooth.
On the web a frame is the time that it takes to do all of the work required to update and repaint the screen.
If each frame does not complete within 16.7ms (1000ms / 60 ≈ 16.7),
then users will perceive the delay.

## The rendering pipeline {: #pipeline }

To display something on a webpage the browser has to go through the following sequential steps:

1. **Style**: Calculate the styles that apply to the elements.
2. **Layout**: Generate the geometry and position for each element.
3. **Paint**: Fill out the pixels for each element into [layers](#layers).
4. **Composite**: Draw the layers to the screen.

These four steps are known as the browser's **rendering pipeline**.

When you animate something on a page that has already loaded
these steps have to happen again.
This process begins from the step that has to be changed in order to allow the animation to take place.

As mentioned before, these steps are **sequential**.
For example, if you animation something that changes layout, the paint and composite
steps also have to run again. Animating something that changes layout
is therefore more expensive than animating something that only changes compositing.

{% Aside %}
For an in-depth look at exactly how this process happens in the browser
read [From Braces to Pixels](https://alistapart.com/article/braces-to-pixels/) and
[Inside look at modern browser browser](https://developers.google.com/web/updates/2018/09/inside-browser-part3).
{% endAside %}

### Animating layout properties {: #layout }

Layout changes involve calculating the geometry (position and size) of all the elements affected by the change.
If you change one element,
the geometry of other elements may need to be recalculated.
For example, if you change the width of the `<html>` element any of its children may be affected.
Due to the way elements overflow and affect one another,
changes further down the tree can sometimes result in layout calculations all the way back up to the top.

The larger the tree of visible elements,
the longer it takes to perform layout calculations.

### Animating paint properties {: #paint }

[Paint](https://developers.google.com/web/updates/2018/09/inside-browser-part3#paint)
is the process of determining in what order elements should be painted to the screen.
It is often the longest-running of all tasks in the pipeline.

The majority of painting in modern browsers is done in
[software rasterizers](https://software.intel.com/content/www/us/en/develop/articles/software-vs-gpu-rasterization-in-chromium.html).
Depending on how the elements in your app are grouped into layers,
other elements besides the one that changed may also need to be painted.

### Animating composite properties {: #composite }

[Compositing](https://developers.google.com/web/updates/2018/09/inside-browser-part3#what_is_compositing)
is the process of separating the page into layers, converting the information about how the page should look
into pixels (rasterization), and putting the layers together to create a page (compositing).

This is why the `opacity` property is included in the list of things which are cheap to animate.
As long as this property is in its own layer, changes to it can be handled by the GPU during the compositing step.
Chromium-based browsers and WebKit create a new layer for any element which has a CSS transition or animation on `opacity`.

{% Aside %}
For an in-depth look at compositing see the article
[GPU Animation: Doing It Right](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/)
{% endAside %}

## What is a layer? {: #layers }

By placing the things that will be animated or transitioned onto a new layer,
the browser only needs to repaint those items and not everything else.
You may be familiar with Photoshop's concept of a layer which contains a bunch of elements that can be moved together.
Browser rendering layers are similar to that idea.

While the browser does a good job of making decisions about what elements should be on a new layer,
if it misses one there are ways to force layer creation.
You can find out about that in [How to create high-performance animations](/animations-guide).
However, creating new layers should be done with care because each layer uses memory.
On devices with limited memory creating new layers may cause more of a performance problem than the one you are trying to solve.
In addition, each layer's textures need to be uploaded to the GPU.
Therefore you may well hit constraints of bandwidth between the CPU and GPU.

{% Aside %}
You can read a good explanation of layers, and how to create them in
[Layers and how to force them](https://dassur.ma/things/forcing-layers/).
{% endAside %}

## CSS vs JavaScript performance {: #css-js }

You might wonder: is it better from a performance perspective to use CSS or JavaScript for animations?

CSS-based animations, and [Web Animations](/web-animations/) (in the browsers that support the API),
are typically handled on a thread known as the *compositor thread*.
This is different from the browser's *main thread*, where styling, layout, painting, and JavaScript are executed.
This means that if the browser is running some expensive tasks on the main thread,
these animations can keep going without being interrupted.

As explained in this article,
other changes to transforms and opacity can, in many cases, also be handled by the compositor thread.

If any animation triggers paint, layout, or both,
the main thread will be required to do work.
This is true for both CSS and JavaScript animations,
and the overhead of layout or paint will likely dwarf any work associated with CSS or JavaScript execution,
rendering the question moot.
