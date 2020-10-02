---
layout: post
title: Why are some animations slow?
authors:
  - rachelandrew
description: |
  Animating well is core to a great web experience.
  This post explains why certain types of animation perform better than others.
date: 2020-10-02
tags:
  - performance
---

Modern browsers can animate two properties cheaply `transform` and `opacity`.
If you animate anything else,
the chances are you're not going to hit a silky smooth 60fps.
This post explains why this is the case.

## Animation performance and frame rate

It is widely accepted that a frame rate of 60 frames per second (fps) is the target when animating anything on the web.
This frame rate will ensure that your animations look smooth.
On the web a frame is the time that it takes to do all of the work required to update and repaint the screen.
If each frame does not complete within 16.7ms,
then the delay will be perceivable by your user.

## Animations and the browser

To display something on a webpage the browser has to go through the following steps.
When you animate something on a page that has already loaded
these steps have to happen again.
This process begins from the step that has to be changed in order to allow the animation to take place.

1. **Style**: Calculate the styles that apply to the elements.
2. **Layout**: Generate the geometry and position for each element.
3. **Paint**: Fill out the pixels for each element into layers.
4. **Composite**: Draw the layers out to screen.

Animating something that changes layout,
is therefore more expensive than animating something that only changes compositing.
As the layout change will involve the layout, paint, and composite steps.

{% Aside %}
For an in-depth look at exactly how this process happens in the browser
read [From Braces to Pixels](https://alistapart.com/article/braces-to-pixels/) and
[Inside look at modern browser browser](https://developers.google.com/web/updates/2018/09/inside-browser-part3).
{% endAside %}

## Animating layout properties

Layout changes involve calculating the geometry (position and size) of all the elements affected by the change.
If you change one element,
the geometry of other elements may need to be recalculated.
For example, if you change the width of the `<html>` element any of its children may be affected.
Due to the way elements overflow and affect one another,
changes further down the tree can sometimes result in layout calculations all the way back up to the top.

The larger the tree of visible elements,
the longer it takes to perform layout calculations.

## Animating paint properties

If layout has been triggered then the next step is to move onto paint.
In addition, animating some properties may allow the browser to skip the layout step and start with paint.

Paint is the process of filling in pixels that eventually get composited to the users' screens.
It is often the longest-running of all tasks in the pipeline,

The majority of painting in modern browsers is done in software rasterizers.
Depending on how the elements in your app are grouped into layers,
other elements besides the one that changed may also need to be painted.

## Animating composite properties

The last step is composite,
if your property only triggers this step then it is likely to perform well.

This is why the `opacity` property is included in the list of things which are cheap to animate.
As long as this property is in its own layer, changes to it can be handled by the GPU during the compositing step.
Chromium-based browsers and WebKit create a new layer for any element which has a CSS transition or animation on `opacity`.

{% Aside %}
For an in-depth look at compositing see the article
[GPU Animation: Doing It Right](https://www.smashingmagazine.com/2016/12/gpu-animation-doing-it-right/)
{% endAside %}

## What is a layer?

By placing the things that will be animated or transitioned onto a new layer,
the browser only needs to repaint those items and not everything else.
If you have used a package such as Photoshop,
you will be familiar with the concept of a layer which contains a bunch of elements that can be moved together.
You can think of these browser rendering layers as being similar to that idea.

While the browser does a good job of making decisions about while elements should be on a new layer,
if it misses one there are ways to force layer creation.
You can find out about that in the guide to [creating high performance animations](/animations-guide).
However, creating new layers should be done with care.
Each layer uses memory,
on devices with limited memory creating new layers may cause more of a performance problem than the one you are trying to solve.
In addition, each layer's textures need to be uploaded to the GPU.
Therefore you may well hit constraints of bandwidth between the CPU and GPU.

{% Aside %}
You can read a good explanation of layers, and how to create them in Surma's article
[Layers and how to force them](https://dassur.ma/things/forcing-layers/).
{% endAside %}

## CSS vs JavaScript performance

You might wonder whether it is better from a performance perspective to use CSS or JavaScript for animations.

CSS-based animations, and Web Animations where supported natively,
are typically handled on a thread known as the "compositor thread".
This is different from the browser's "main thread", where styling, layout, painting, and JavaScript are executed.
This means that if the browser is running some expensive tasks on the main thread,
these animations can keep going without being interrupted.

As explained in this article,
other changes to transforms and opacity can, in many cases, also be handled by the compositor thread.

If any animation triggers paint, layout, or both,
the "main thread" will be required to do work.
This is true for both CSS and JavaScript animations,
and the overhead of layout or paint will likely dwarf any work associated with CSS or JavaScript execution,
rendering the question moot.
