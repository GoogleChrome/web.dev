---
layout: post
title: Announcing <model-viewer> 1.0
subhead: 3D models for your web page as easily as writing HTML.
authors:
  - joemedley
  - rkochman
description: 3D models are more relevant than ever. Retailers bring in-store shopping experiences to customers' home. Museums let anyone see artifacts from anywhere. 3D is difficult to do without a deep knowledge of 3D technologies or third-party hosting. <model-viewer> 1.0 makes these tasks as easy as writing HTML.
date: 2020-07-26
tags:
  - blog
  - 3d
  - model-viewer
---

3D models are more relevant than ever. Retailers are using 3D models to bring the in-store shopping experience to customers at home. Museums are making 3D models of their artifacts available to everyone on the web. Unfortunately, it can be difficult to add a 3D model to a website in a way that provides a great user experience, without a deep knowledge of 3D technologies or resorting to hosting 3D content on a third-party site. `<model-viewer>`, [introduced in early 2019](https://developers.google.com/web/updates/2019/02/model-viewer), seeks to make putting 3D models on the web as easy as writing a few lines of HTML. Since then, the team has been working to address feedback and requests from the community. The culmination of that work is `<model-viewer>` version 1.0. 

## What’s new since last year?

Version 1.0 includes built-in support for augmented reality (AR) on the web, improvements to speed and fidelity, and other frequently-requested features.

### Augmented reality ###

Viewing a 3D model on a blank canvas is great, but being able to view it in your space is even better. Now `<model-viewer>` supports WebXR augmented reality, for an entirely-within-the-browser 3D and AR experience on Chrome Android. 

```html
<model-viewer src="ToyTrain.glb" ar ar-scale="auto" camera-controls alt="A 3D model of a wooden toy train"> 
</model-viewer>
```
<iframe style="width:100%; height: 100%;position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);" src="https://modelviewer.dev/webdotdev/webxr.html" frameborder="0" allowfullscreen></iframe>

The above example shows the minimum required to use AR. The `<model-viewer>` component also allows you use HTML to customize the WebXR AR experience, as shown in [this example on the modelviewer.dev site](https://modelviewer.dev/examples/webxr.html).

### Camera controls ###

`<model-viewer>` now gives full control over the view's virtual camera (the perspective of the viewer). This includes the camera target, orbit (position relative to the model), and field of view. You can also enable auto-rotation and set limits on user interaction (e.g. maximum and minimum fields of view). 

### Annotations ###

You can also annotate your models using HTML and CSS. This capability is often used to “attach” labels to parts of the model in a way that moves with the model as it’s manipulated. The annotations are customizable, including their appearance and the extent to which they’re hidden when they’re positioned behind the model. Annotations also work in AR.

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

<model-viewer src="https://modelviewer.dev/assets/ShopifyModels/ToyTrain.glb" alt="A 3D model of a Toy Train" camera-controls>
  <button slot="hotspot-hand" data-position="-0.023 0.0594 0.0714" data-normal="-0.3792 0.0004 0.9253">
    <div id="annotation">Whistle</div>
  </button>
</model-viewer>
```

<iframe style="width:100%; height: 100%;position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);" src="https://modelviewer.dev/webdotdev/annotations.html" frameborder="0" allowfullscreen></iframe>

See the [annotations documentation page](https://modelviewer.dev/examples/annotations.html) for more information.

### Tester ###

The new version introduces and hosts a `<model-viewer>` [“tester” tool](https://modelviewer.dev/examples/tester.html), which enables you to quickly preview your model, try out different `<model-viewer>` configurations (e.g. exposure and shadow softness), generate a poster image, and interactively get coordinates for annotations. 

### Rendering and performance improvements ###

Rendering fidelity has been greatly improved, especially for high dynamic range (HDR) environments. `<model-viewer>` now also uses a direct render path when only one `<model-viewer>` element is in the viewport, which increases performance (especially on Firefox). Lastly, dynamically scaling the render resolution improved frame rate dramatically. The example below shows off some of these recent improvements. 

```html
<model-viewer camera-controls skybox-image="spruit_sunrise_1k_HDR.hdr" alt="A 3D model of a damaged helmet" src="DamagedHelmet.glb"></model-viewer>
```

<iframe style="width:100%; height: 100%;position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);" src="https://modelviewer.dev/webdotdev/rendering.html" frameborder="0" allowfullscreen></iframe>

### Stability ###

With `<model-viewer>` reaching its first major version, we’re prioritizing API stability and will avoid making any breaking changes until version 2.0 is released. 

## What’s next?

`<model-viewer>` version 1.0 includes the most-requested capabilities, but we’re not done yet. 
We’re continuing to add features, as well as focusing on performance, stability, documentation, and tooling. If you have suggestions, file an [issue in Github](https://github.com/google/model-viewer/issues); also, PRs are always welcome. You can also stay connected by following [`<model-viewer>` on Twitter](https://twitter.com/modelviewer) and checking out our [community chat on Spectrum](https://spectrum.chat/model-viewer?tab=posts).
