---
title: 'The <model-viewer> web component'
subhead: Adding 3D models to a website can be tricky; &lt;model-viewer&gt; is as easy as writing HTML.
authors:
  - joemedley
date: 2019-02-06
updated: 2020-08-21
hero: image/admin/MY2KWQPCX2P9kDNLX69Q.jpg
description: |
  Adding 3D models to a website is tricky for a variety of reasons including
  the hosting issues and the high bar of 3D programming. That's why we're
  introducing the &lt;model-viewer&gt; web component to let you use 3D models
  declaratively.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - 3d
  - augmented-reality
  - virtual-reality
  - webxr
  - model-viewer
feedback:
  - api
---

Adding 3D models to a website is tricky. 3D models ideally will be shown in
a viewer that can work responsively on all browsers including smartphones,
desktop, or even new head-mounted displays. The viewer should support
progressive enhancement for performance and rendering quality. It should support
use cases on all devices ranging from older, lower-powered smartphones to newer
devices that support augmented reality. It should stay up to date with current
technologies. It should be performant and accessible. However, building such a
viewer requires specialty 3D programming skills, and can be a challenge for web
developers that want to host their own models instead of using a third-party
hosting service.


To help with that, the `<model-viewer>` web component, which just released
[version 1.1](https://modelviewer.dev/), lets you declaratively add a 3D model
to a web page, while hosting the model on your own site. The web component
supports responsive design and use cases like augmented reality on some devices,
and it includes features for accessibility, rendering quality, and
interactivity.  The goal of the component is to enable adding 3D models to your
website without understanding the underlying technology and platforms.

{% Aside %}
We're always [updating and
improving](https://github.com/google/model-viewer/releases)
`<model-viewer>`. Check out the [`<model-viewer>`
homepage](https://modelviewer.dev/) to explore what &lt;model-viewer&gt; 1.1 can do.
{% endAside %}

## What is a web component?

A web component is a custom HTML element built from standard web platform
features. A web component behaves for all intents and purposes like a standard
element. It has a unique tag, it can have properties and methods, and it can
fire and respond to events. In short, you don't need to know anything special to
use any web component, much less `<model-viewer>`.

In this article, I will show you things that are particular to `<model-viewer>`.
If you're interested in learning more about web components,
[webcomponents.org](https://www.webcomponents.org/) is a good place to start.

## What can &lt;model-viewer> do?

I'll show you a few current capabilities of `<model-viewer>`. You'll get a great
experience today, and `<model-viewer>` will get better over time as Google adds
new features and improves rendering quality. The examples I'm provided are just
to give you a sense of what it does. If you want to try them there are
installation and usage instructions in [its GitHub
repo](https://modelviewer.dev/).

### Basic 3D models

Embedding a 3D model is as simple as the markup below. By
[using glb files](https://www.marxentlabs.com/glb-files/), we've ensured that this component will work on any major
browser.

```html
<!-- Import the component -->
<script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
<script nomodule src="https://unpkg.com/@google/model-viewer/dist/model-viewer-legacy.js"></script>
<!-- Use it like any other HTML element -->
<model-viewer id="mv-demo" shadow-intensity="1" src="./spacesuit.glb"
alt="A 3D model of an astronaut" auto-rotate camera-controls
poster="./spacesuit.jpg"></model-viewer>
```

That code renders like this:

<div class="glitch-embed-wrap" style="height: 500px; width: 100%;">
  <iframe
    src="https://model-viewer-shark.glitch.me/"
    title="<model-viewer> on Glitch"
    allow="geolocation; microphone; camera; midi; vr; encrypted-media;
clipboard; clipboard-read; clipboard-write"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

### Adding motion and interactivity

The `auto-rotate` and `camera-controls` attributes provide motion and user
control. Those aren't the only possible attributes. See the documentation for [a
complete list of attributes](https://modelviewer.dev/#section-attributes).

```html
<model-viewer src="assets/Astronaut.glb" auto-rotate camera-controls>
```

### Delayed loading with poster images

Some 3D models can be very large, so you might want to hold off loading them
until the user has requested the model. For this, the component has a built-in
means of delaying loading until the user wants it. That's what the `poster`
attribute does.

```html
<model-viewer src="assets/Astronaut.glb" controls auto-rotate
poster="./spacesuit.jpg">
```

To show your users that it's a 3D model, and not just an image, you can provide
some preload animation by using script to switch between multiple posters.

```html
<model-viewer id="toggle-poster" src="assets/Astronaut.glb" controls
auto-rotate poster="assets/poster2.png"></model-viewer>
<script>
    const posters = ['poster.png', 'poster2.png'];
    let i = 0;
    setInterval(() =>
        document.querySelector('#toggle-poster').setAttribute('poster',
            `assets/${posters[i++ % 2]}`), 2000);
</script>
```

### Responsive design

The component handles some types of [responsive design](/responsive-web-design-basics), scaling for both mobile
and desktop. It can also manage multiple instances on a page and uses
[Intersection
Observer](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver)
to conserve battery power and GPU cycles when a model isn't visible.

<figure class="w-figure">
  {% Img src="image/admin/8jXl21iFxh7O3QeEeL0k.png", alt="Multiple spacesuit images representing responsiveness.", width="800", height="453" %}
  <figcaption class="w-figcaption">Multiple spacesuit images representing responsiveness.</figcaption>
</figure>

## Looking Forward

[Install `<model-viewer>` and give it a try](https://modelviewer.dev/) The
project team wants `<model-viewer>` to be useful to you, and wants your input on
its future. That's not to say they don't have ideas. So give it a try and let us
know what you think by [filing an issue in
GitHub](https://github.com/google/model-viewer/issues).
