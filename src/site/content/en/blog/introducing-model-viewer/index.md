---
layout: post
title: 'Introducing <model-viewer> 1.1'
subhead: 3D models for your web page as easily as writing HTML.
authors:
  - rkochman
  - joemedley
description: |
  3D models are more relevant than ever. Retailers bring in-store shopping
  experiences to customers' homes. Museums let anyone see artifacts from anywhere.
  3D is difficult to do without a deep knowledge of 3D technologies or third-party
  hosting. <model-viewer> 1.1 makes these tasks as easy as writing HTML.
date: 2020-09-03
updated: 2020-09-03
hero: image/admin/shbwwMBKANGHEy6TtBV7.jpg
alt: A 3D image of a shark.
tags:
  - blog
  - 3d
  - model-viewer
  - augmented-reality
  - virtual-reality
  - webxr
feedback:
  - api
---

3D models are more relevant than ever. Retailers bring in-store shopping
experiences to customers' homes. Museums are making 3D models of their artifacts
available to everyone on the web. Unfortunately, it can be difficult to add a 3D
model to a website in a way that provides a great user experience without a deep
knowledge of 3D technologies or resorting to hosting 3D content on a third-party
site. The `<model-viewer>` web component, [introduced in early
2019](/model-viewer), seeks to make putting 3D models on the web as easy as
writing a few lines of HTML. Since then, the team has been working to address
feedback and requests from the community. The culmination of that work was
`<model-viewer>` version 1.0, released earlier this year. We're now announcing
the release of `<model-viewer>` 1.1. You can [read the release
notes](https://github.com/google/model-viewer/releases/tag/v1.1.0) in GitHub.

## What's new since last year?

Version 1.1 includes built-in support for augmented reality (AR) on the web,
improvements to speed and fidelity, and other frequently-requested features.

### Augmented reality

Viewing a 3D model on a blank canvas is great, but being able to view it in your
space is even better. For an entirely-within-the-browser 3D and AR Chrome
Android supports [augmented
reality](https://modelviewer.dev/examples/augmented-reality.html) using WebXR .

<figure class="w-figure w-figure--inline-right">
  <video controls muted class="w-screenshot">
    <source src="https://storage.googleapis.com/web-dev-assets/introducing-model-viewer/modelviewer1-0.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/introducing-model-viewer/modelviewer1-0.mp4" type="video/mp4">
  </video>
  <figcaption class="w-figcaption">
    A demonstration of the <code>&lt;model-viewer></code> AR capability.
  </figcaption>
</figure>

When it's ready, you'll be able to use it by add an `ar` attribute to the
`<model-viewer>` tag. Other attributes allow you to customize the WebXR AR
experience, as shown in [the WebXR sample on
modelviewer.dev](https://modelviewer.dev/examples/webxr.html). The code sample
below shows what this might look like.

```html
<model-viewer src="Chair.glb"
  ar ar-scale="auto"
  camera-controls
  alt="A 3D model of an office chair.">
</model-viewer>
```

<!-- Hide until model-viewer's iframe bug is fixed -->
<!-- <iframe style="width:100%; height: 100%;position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);" src="https://modelviewer.dev/examples/webxr.html" frameborder="0" allowfullscreen></iframe> -->

It looks something like the embedded video shown under this heading.

### Camera controls

`<model-viewer>` now gives full control over the view's virtual camera (the
perspective of the viewer). This includes the camera target, orbit (position
relative to the model), and field of view. You can also enable auto-rotation and
set limits on user interaction (e.g. maximum and minimum fields of view).

### Annotations

You can also annotate your models using HTML and CSS. This capability is often
used to "attach" labels to parts of the model in a way that moves with the model
as it's manipulated. The annotations are customizable, including their
appearance and the extent to which they're hidden by
the model. Annotations also work in AR.

```html
<style>
  button{
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    border: 3px solid blue;
    background-color: blue;
    box-sizing: border-box;
  }

  #annotation{
    background-color: #dddddd;
    position: absolute;
    transform: translate(10px, 10px);
    border-radius: 10px;
    padding: 10px;
  }
</style>
<model-viewer src="https://modelviewer.dev/assets/ShopifyModels/ToyTrain.glb" alt="A 3D model of a Toy Train" camera-controls>
  <button slot="hotspot-hand" data-position="-0.023 0.0594 0.0714" data-normal="-0.3792 0.0004 0.9253">
    <div id="annotation">Whistle</div>
  </button>
</model-viewer>
```

<!-- Hide until model-viewer's iframe bug is fixed -->
<!-- <iframe style="width:100%; height: 100%;position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);" src="https://modelviewer.dev/webdotdev/annotations.html" frameborder="0" allowfullscreen></iframe> -->

<figure class="w-figure w-figure--inline-right">
  {% Img src="image/admin/CG1JQXZP9Gncr7qLz5JZ.png", alt="A space suit with an annotation.", width="800", height="839" %}
  <figcaption class="w-figcaption">A space suit with an annotation.</figcaption>
</figure>

See the [annotations documentation
page](https://modelviewer.dev/examples/annotations.html) for more information.

### Editor

Version 1.1 introduces and hosts a `<model-viewer>` ["editing"
tool](https://modelviewer.dev/editor/), which enables you to
quickly preview your model, try out different `<model-viewer>` configurations
(e.g. exposure and shadow softness), generate a poster image, and interactively
get coordinates for annotations.

### Rendering and performance improvements

Rendering fidelity is greatly improved, especially for high dynamic range (HDR)
environments. `<model-viewer>` now also uses a direct render path when only one
`<model-viewer>` element is in the viewport, which increases performance
(especially on Firefox). Lastly, dynamically scaling the render resolution
improved frame rate dramatically. The example below shows off some of these
recent improvements.

```html
<model-viewer camera-controls
              skybox-image="spruit_sunrise_1k_HDR.hdr"
              alt="A 3D model of a well-worn  helmet"
              src="DamagedHelmet.glb"></model-viewer>
```

<!-- Hide until model-viewer's iframe bug is fixed -->
<!-- <iframe style="width:100%; height: 100%;position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);" src="https://modelviewer.dev/webdotdev/rendering.html" frameborder="0" allowfullscreen></iframe> -->

<figure class="w-figure w-figure--inline-right">
  {% Img src="image/admin/ZAID4J5TsJTcJs3qPNTp.png", alt="A 3D model of a well-worn  helmet.", width="800", height="809" %}
  <figcaption class="w-figcaption">A 3D model of a well-worn  helmet.</figcaption>
</figure>

### Stability

With `<model-viewer>` reaching its first major version, API stability is a
priority, so breaking changes will be avoided until version 2.0 is released.

## What's next?

`<model-viewer>` version 1.0 includes the most-requested capabilities, but the
team is not done yet. More features will be added, as will improvements in
performance, stability, documentation, and tooling. If you have suggestions,
file an [issue in Github](https://github.com/google/model-viewer/issues); also,
PRs are always welcome. You can stay connected by following [`<model-viewer>` on
Twitter](https://twitter.com/modelviewer) and checking out the [community chat
on Spectrum](https://spectrum.chat/model-viewer?tab=posts).
