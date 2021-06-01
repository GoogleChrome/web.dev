---
title: 'Cross-browser paint worklets and Houdini.how'
subhead: 'Supercharging your CSS with Houdini paint worklets is just a few clicks away.'
authors:
  - una
date: 2020-12-10
hero: image/admin/qphHgunn2LamPL1qODh5.jpg
alt: A sparkler.
description: Learn how to implement cross-browser Houdini Paint API's and explore a world of Houdini worklets with Houdini.how.
tags:
  - blog
  - css
  - houdini
---

{% YouTube '5eBar5TI71M' %}

CSS [Houdini](https://developer.mozilla.org/en-US/docs/Web/Houdini) is an umbrella term that
describes a series of low-level browser APIs that give developers much more control and power over
the styles they write.

<figure class="w-figure">
  {% Img src="image/admin/KgTxiRodgp6kFwHGHvqA.jpg", alt="Houdini layer", width="800", height="599" %}
</figure>

Houdini enables more semantic CSS with the [Typed Object
Model](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Typed_OM_API/Guide). Developers can
define advanced CSS custom properties with syntax, default values, and inheritance through the
[Properties and Values API](/at-property/).

It also introduces paint, layout, and animation
[worklets](https://developers.google.com/web/updates/2018/10/animation-worklet), which open up a
world of possibilities, by making it easier for authors to hook into the styling and layout process
of the browser's rendering engine.

## Understanding Houdini worklets

Houdini worklets are browser instructions that run off the main thread and can be called when
needed. Worklets enable you to write modular CSS to accomplish specific tasks, and require a single
line of JavaScript to import and register. Much like service workers for CSS style, Houdini worklets
are registered to your application, and once registered can be used in your CSS by name.

Write worklet file Register worklet module (`CSS.paintWorklet.addModule(workletURL)`) Use worklet
(`background: paint(confetti)`)

## Implementing your own features with the CSS Painting API

The [CSS Painting API](https://drafts.css-houdini.org/css-paint-api/) is an example of such a
worklet (the Paint worklet), and enables developers to define canvas-like custom painting functions
that can be used directly in CSS as backgrounds, borders, masks, and more. There is a whole world of
possibilities for how you can use CSS Paint in your own user interfaces.

For example, instead of waiting for a browser to implement an angled borders feature, you can write
your own Paint worklet, or use an existing published worklet. Then, rather than using border-radius
apply this worklet to borders and clipping.

<figure class="w-figure">
  {% Video
    src="video/tcFciHGuF3MxnTr1y5ue01OGLBn2/LNMysDPgN7nSgyT1p1Fl.mp4",
    class="w-screenshot",
    autoplay=true,
    loop=true,
    muted=true,
    playsinline=true
  %}
  <figcaption class="w-figcaption">
    The example above uses the same paint worklet with different arguments (see code below) to accomplish this result. Demo on <a href="https://glitch.com/~angled-corners">Glitch</a>.</a>
  </figcaption>
</figure>

```css
.angled {
  --corner-radius: 15 0 0 0;
  --paint-color: #6200ee;
  --stroke-weight: 0;

  /* Mask every angled button with fill mode */
  -webkit-mask: paint(angled-corners, filled);
}

.outline {
  --stroke-weight: 1;

  /* Paint outline */
  border-image: paint(angled-corners, outlined) 0 fill !important;
}
```

The CSS Painting API is currently one of the best-supported Houdini APIs, its spec being a W3C
candidate recommendation. It is currently enabled in all Chromium-based browsers, partially
supported in Safari, and is under consideration for Firefox.

<figure class="w-figure">
  {% Img src="image/admin/vL8Z5YEwk2g2QJ6T6IWp.png", alt="Caniuse support", width="800", height="176", class="w-screenshot" %}
  <figcaption class="w-figcaption">The CSS Painting API is currently supported on Chromium-based browsers.</figcaption>
</figure>

But even without full browser support, you can still get creative with the Houdini Paint API and see
your styles work across all modern browsers with the [CSS Paint
Polyfill](https://github.com/GoogleChromeLabs/css-paint-polyfill). And to showcase a few unique
implementations, as well as to provide a resource and worklet library, my team built
[houdini.how](https://houdini.how).

## Houdini.how

<figure class="w-figure">
  {% Img src="image/admin/UKenhKMvDWI9PvWGcTG4.png", alt="Worklet page screenshot.", width="800", height="833", class="w-screenshot" %}
  <figcaption class="w-figcaption">Screenshot from the <a href="https://houdini.how">Houdini.how</a> homepage.</figcaption>
</figure>

[Houdini.how](https://houdini.how) is a library and reference for Houdini worklets and resources. It
provides everything you need to know about CSS Houdini: browser support, an
[overview](https://houdini.how/about) of its various APIs, [usage](https://houdini.how/usage)
information, additional [resources](https://houdini.how/resources), and live paint worklet
[samples](https://houdini.how/). Each sample on Houdini.how is backed by the CSS Paint API, meaning
they each work on all modern browsers. Give it a whirl!

## Using Houdini

Houdini worklets must either be run via a server locally, or on HTTPS in production. In order to
work with a Houdini worklet, you will need to either install it locally or use a content delivery
network (CDN) like [unpkg](https://unpkg.com) to serve the files. You will then need to register the
worklet locally.

There are a few ways to include the Houdini.how showcase worklets in your own web projects. They can
either be used via a CDN in a prototyping capacity, or you can manage the worklets on your own using
npm modules. Either way, you'll want to also include the CSS Paint Polyfill to ensure they are
cross-browser compatible.

### 1. Prototyping with a CDN

When registering from unpkg, you can link directly to the worklet.js file without needing to locally
install the worklet. Unpkg will resolve to the worklet.js as the main script, or you can specify it
yourself. Unpkg will not cause CORS issues, as it is served over HTTPS.

```html
CSS.paintWorklet.addModule("https://unpkg.com/<package-name>");
```

Note that this does not register the custom properties for syntax and fallback values. Instead, they
each have fallback values embedded into the worklet.

To optionally register the custom properties, include the properties.js file as well.

```html
<script src="https://unpkg.com/<package-name>/properties.js"></script>
```

To include the CSS Paint Polyfill with unpkg:

```html
<script src="https://unpkg.com/css-paint-polyfill"></script>
```

### 2. Managing worklets via NPM

Install your worklet from npm:

```bash
npm install <package-name>
npm install css-paint-polyfill
```

Importing this package does not automatically inject the paint worklet. To install the worklet,
you'll need to generate a URL that resolves to the package's worklet.js, and register that. You do
so with:

```js
CSS.paintWorklet.addModule(..file-path/worklet.js)
```

The npm package name and link can be found on each worklet card.

You will also need to include the CSS Paint Polyfill via script or import it directly, as you would
with a framework or bundler.

Here is an example of how to use Houdini with the paint polyfill in modern bundlers:

```js
import 'css-paint-polyfill';
import '<package-name>/properties.js'; // optionally register properties
import workletURL from 'url:<package-name>/worklet.js';

CSS.paintWorklet.addModule(workletURL);
```

{% Aside 'note' %}
For more specific instruction per-bundler, check out the [usage page](https://houdini.how/usage) on Houdini.how.
{% endAside %}

## Contribute

Now that you've played around with some Houdini samples, it's your turn to contribute your own!
Houdini.how does not host any worklets itself, and instead showcases the work of the community. If
you have a worklet or resource you would like to submit, check out the [github
repo](https://github.com/GoogleChromeLabs/houdini.how/blob/main/CONTRIBUTING.md) with contribution guidelines.
We'd love to see what you come up with!
