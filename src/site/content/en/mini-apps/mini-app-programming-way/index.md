---
layout: post
title: Programming the mini app way
authors:
  - thomassteiner
date: 2021-03-03
# updated: 2021-03-03
description: |
  This chapter introduces the way of programming the mini app way.
tags:
  - mini-apps
---

{% Aside %}
  This post is part of an article collection where each article builds upon previous articles.
  If you just landed here, you may want to start reading from the [beginning](/mini-app-super-apps/).
{% endAside %}

## What has worked well for mini apps

In this chapter, I want to look at lessons I learned from researching mini apps from a web
developer's point of view, or answer the question what does it mean to develop the mini app way.

## Components

Rather than reinvent the wheel and make developers build yet another implementation of common UI paradigms like tabs,
accordions, carousels, etc., mini apps just ship with a default selection of components that is extensible in case you need more.
On the web, there are likewise many options, some of which I have listed in the [chapter on mini app components](/mini-app-components/#web-components).
In an ideal world, component libraries on the web were built in a way that you could mix them freely.
In practice, too many times, there is a certain lock-in regarding a design system you need to buy in to when you use a component,
or the component library is distributed in a way that it is all or nothing, but no individual components can be easily added to a project.
There are, however, atomic components that you can use in isolation, or libraries like [generic-components](https://github.com/thepassle/generic-components)
that are unstyled on purpose.
Finding an using those seems like a good idea.

## Model-view-viewmodel

The [model–view–viewmodel](/mini-app-markup-styling-and-scripting/#markup-languages) (MVVM) architectural pattern—that facilitates the
separation of the development of the graphical user interface (the view) via a markup language from
the development of the back-end logic (the model)—means the view is not dependent on any specific model platform.
While there are some documented [disadvantages](https://docs.microsoft.com/en-us/archive/blogs/johngossman/advantages-and-disadvantages-of-m-v-vm) of the pattern, in general it works really well for applications of the complexity of mini apps.
It can shine especially with rich templating libraries (see [next chapter](mini-app-example-project/)).

## Page-wise thinking

Debugging mini apps shows that they are essentially multi-page applications (MPA).
This has many advantages, like, for example, it allows for trivial routing and conflict-free per-page styling.
People have [successfully applied MPA architectures](https://medium.com/elemefe/upgrading-ele-me-to-progressive-web-app-2a446832e509) to Progressive Web Apps.
Thinking in pages also helps manage resources like each page's CSS and JavaScript files, and other assets like images and videos.
Most importantly, building this way means you get route-based code splitting for free
if you do not load anything else.
In that case, each page by definition strictly only loads what it needs to function.

## Build process

Mini apps have [no visible build process](/mini-app-project-structure-lifecycle-and-bundling/#the-build-process).
On the web, modern build tools like [Snowpack](https://www.snowpack.dev/) leverage JavaScript's built-in
[module system](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
(known as ESM) to avoid unnecessary work and stay fast no matter how big a project grows.
While it is early days for technologies like [Web Bundles](/web-bundles/), it is something that can be easily added
to the build process.

## Powerful capabilities

The web platform has gained many [new capabilities](/tags/capabilities/) recently.
Access to [devices](/tags/devices/) via [Bluetooth](/bluetooth/), [USB](/usb/), [HID](/hid/), [serial](/serial/),
and [NFC](/nfc/) is all possible now.
Where mini apps run in WebViews and depend on a [JavaScript bridge](/mini-app-markup-styling-and-scripting/#javascript-bridge-api),
on the web, these powerful capabilities are available directly,
so you do not program against an API provided by the JavaScript bridge,
but against the browser API without an intermediate actor.

{% Aside 'success' %}
  Read on to see an [example project](/mini-app-example-project/) that puts this way of programming into practice.
{% endAside %}

## Acknowledgements

This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
and Keith Gu.
