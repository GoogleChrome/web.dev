---
layout: post
title: Stick to Compositor-Only Properties and Manage Layer Count
subhead: |
  Compositing is where the painted parts of the page are put together for displaying on screen.
authors:
  - paullewis
date: 2015-03-20
updated: 2018-08-17
description: |
  Compositing is where the painted parts of the page are put together for displaying on screen.
tags:
  - blog # blog is a required tag for the article to show up in the blog.

---

Compositing is where the painted parts of the page are put together for
displaying on screen.

There are two key factors in this area that affect page performance: the number of compositor layers that need to be managed, and the properties that you use for animations.

### Summary

* Stick to transform and opacity changes for your animations.
* Promote moving elements with `will-change` or `translateZ`.
* Avoid overusing promotion rules; layers require memory and management.

## Use transform and opacity changes for animations

The best-performing version of the pixel pipeline avoids both layout and paint, and only requires compositing changes:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/4to9zPKpICVNFCPl7qwV.jpg", alt="The pixel pipeline with no layout or paint.", width="800", height="122" %}
</figure>

In order to achieve this you will need to stick to changing properties that can be handled by the compositor alone. Today there are only two properties for which that is true - `transform`s and `opacity`:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/VoLzvR2akAnQfKFVyyM9.jpg", alt="The properties you can animate without triggering layout or paint.", width="800", height="600" %}
</figure>

The caveat for the use of `transform`s and `opacity` is that the element on which you change these properties should be on _its own compositor layer_. In order to make a layer you must promote the element, which we will cover next.

{% Aside %}
If you're concerned that you may not be able to limit your animations to just those properties, take a look at the [FLIP principle](https://aerotwist.com/blog/flip-your-animations), which may help you remap animations to changes in transforms and opacity from more expensive properties.
{% endAside %}

## Promote elements that you plan to animate

As we mentioned in the "[Simplify paint complexity and reduce paint areas](/simplify-paint-complexity-and-reduce-paint-areas/)" section, you should promote elements that you plan to animate (within reason, don't overdo it!) to their own layer:

```css
.moving-element {
  will-change: transform;
}
```

Or, for older browsers, or those that don't support will-change:

```css
.moving-element {
  transform: translateZ(0);
}
```

## Manage layers and avoid layer explosions

It's perhaps tempting, then, knowing that layers often help performance, to promote all the elements on your page with something like the following:

```css
* {
  will-change: transform;
  transform: translateZ(0);
}
```

Which is a roundabout way of saying that you'd like to promote every single element on the page. The problem here is that every layer you create requires memory and management, and that's not free. In fact, on devices with limited memory the impact on performance can far outweigh any benefit of creating a layer. Every layer's textures needs to be uploaded to the GPU, so there are further constraints in terms of bandwidth between CPU and GPU, and memory available for textures on the GPU.

{% Aside 'warning '%}
Do not promote elements unnecessarily.
{% endAside %}

## Use Chrome DevTools to understand the layers in your app

<figure>
  {% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/QNAAH0VJDRjtu9iC6KVE.jpg", alt="The toggle for the paint profiler in Chrome DevTools.", width="278", height="129" %}
</figure>

To get an understanding of the layers in your application, and why an element has a layer you must enable the Paint profiler in Chrome DevTools' Timeline:

With this switched on you should take a recording. When the recording has finished you will be able to click individual frames, which is found between the frames-per-second bars and the details:

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/7zZkTVCqwvqYrty8m8Oy.jpg", alt="A frame the developer is interested in profiling.", width="397", height="229" %}
</figure>

Clicking on this will provide you with a new option in the details: a layer tab.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/f2yHHn8kTJLm6WVn3vnR.jpg", alt="The layer tab button in Chrome DevTools.", width="333", height="260" %}
</figure>

This option will bring up a new view that allows you to pan, scan and zoom in on all the layers during that frame, along with reasons that each layer was created.

<figure>
{% Img src="image/T4FyVKpzu4WKF1kBNvXepbi08t52/spj7LxeccWat0sWddxo3.jpg", alt="The layer view in Chrome DevTools.", width="800", height="600" %}
</figure>


Using this view you can track the number of layers you have. If you're spending a lot time in compositing during performance-critical actions like scrolling or transitions (you should aim for around **4-5ms**), you can use the information here to see how many layers you have, why they were created, and from there manage layer counts in your app.
