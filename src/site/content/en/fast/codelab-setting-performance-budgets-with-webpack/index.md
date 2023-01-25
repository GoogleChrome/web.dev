---
layout: codelab
title: Setting performance budgets with webpack
authors:
  - mihajlija
description: |
  Learn how to set performance budgets and keep your bundlesize in check with
  webpack.
date: 2019-01-31
glitch: webpack-performance-budgets
related_post: incorporate-performance-budgets-into-your-build-tools
tags:
  - performance
---

[Webpack](https://developers.google.com/web/fundamentals/performance/webpack/)
combines all your imported files and packages them into one or more output
files known as bundles. Bundling is neat, but as your app grows your bundles
will grow too. You need to monitor bundle sizes to ensure that they don't grow
too large and affect how long your application takes to load. Webpack supports
setting [performance budgets](/performance-budgets-101)
based on **asset size** and it can keep an eye on bundle sizes for you.

To see it in action, here's an app that counts the days left until New Year's.
It's built with [React](https://reactjs.org/) and [moment.js](https://momentjs.com/).
(Just like real-world apps that increasingly rely on frameworks and libraries. 😉)

{% Img src="image/admin/xG1cKnEmDUJk6Dd4892x.png", alt="An app that counts the days left until New Year's day", width="800", height="459" %}

## Measure

This codelab already contains the app bundled with webpack.

{% Instruction 'remix', 'ol' %}
{% Instruction 'console', 'ol' %}
1. To get a color-coded list of assets and their sizes, type `webpack` in the console.

```bash
webpack
```

The main bundle is highlighted in yellow because it's larger than 244 KiB (250
KB).

{% Aside %}
Webpack uses the unit "KiB", which you might not have
seen before. 1 "KiB" and 1 "KB" are fairly close in size: 1 KiB is 1024 bytes,
while 1 KB is 1000 bytes.
{% endAside %}

<figure class="w-figure">
  {% Img src="image/admin/MpeaVZE4nJHOAAnlQ8Sz.png", alt="Webpack output showing bundle size of 323 KiB", width="640", height="59", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
    Webpack warning you about bulky JS bundle ⚠️
  </figcaption>
</figure>

These warnings are enabled by default in [production mode](https://webpack.js.org/concepts/mode/)
and the default threshold is **244 KiB uncompressed**, for both assets and
[entry points](https://webpack.js.org/concepts/entry-points/)
(the combination of all assets used during the initial load of a page).

<figure class="w-figure">
  {% Img src="image/admin/tXgrsOqdJAzf6LTelr0v.png", alt="Webpack warning that the asset exceeds the recommended size limit", width="642", height="108", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">
    Webpack warning you about bulky JS bundle ⚠️
  </figcaption>
</figure>

Webpack will not only warn you, but it will also give you a recommendation on
how to downsize your bundles. You can learn more about the recommended techniques on
[Web Fundamentals](https://developers.google.com/web/fundamentals/performance/webpack/use-long-term-caching#lazy-loading).

<figure class="w-figure">
  {% Img src="image/admin/pygtt0At7nmByNKm38hr.png", alt="Webpack performance optimization recommendation", width="641", height="96", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">Webpack performance optimization recommendation 💁</figcaption>
</figure>

## Set a custom performance budget

An appropriate performance budget will depend on the nature of your project.
It's always best to [do your own research](/your-first-performance-budget).
A [good rule](/your-first-performance-budget#budget-for-quantity-based-metrics)
of thumb is to deliver under 170 KB of compressed/minified
[critical-path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/)
resources.

{% Aside %}
Critical-path resources are the minimal set of resources required
for the browser to display the first screen's worth of content.
{% endAside %}

For this simple demo, try being even more conservative and set the budget to
100 KB (97.7 KiB). In `webpack.config.js`, add the following:

```js
module.exports = {
  //...
  performance: {
    maxAssetSize: 100000,
    maxEntrypointSize: 100000,
    hints: "warning"
  }
};
```

The new performance budget is set in **bytes**:

- 100000 bytes for individual assets (maxAssetSize)
- 100000 bytes for the entry-point (maxEntrypointSize)

In this case, there's only one bundle which also acts as the entry point.

Possible values for **hints** are:

1. **`warning`** (default): Displays a yellow warning message, but the build
   passes. It's best to use this in development environments.
2. **`error`**: Displays a red error message, but the build still passes. This
   setting is recommended for production builds.
3. **`false`**: No warnings or errors are shown.

<figure class="w-figure">
  {% Img src="image/admin/ZFP0SZfO4zzD0lyD29Vk.png", alt="Webpack performance error in red font", width="606", height="107" %}
  <figcaption class="w-figcaption">Webpack performance hint "error" 🚨</figcaption>
</figure>

## Optimize

The purpose of a performance budget is to warn you about performance issues
before they become too difficult to fix. There is always more than one way to
build an app and some techniques will make for faster load times. (A lot of
them are documented right here in [Optimizing your JavaScript](/fast#optimize-your-javascript). 🤓)

Frameworks and libraries make developers' lives easier, but end users don't
really care how apps are built, only that they're functional and fast. If you
find yourself going over the performance budget, it's time to think about
possible optimizations.

In the real world, large client-side frameworks are usually hard to swap out,
so it's important to use them wisely. With a bit of research, you can often
find smaller alternatives to popular libraries that do the job just as well
([date-fns](https://date-fns.org/) is a good alternative for [moment.js](https://momentjs.com/)).
Sometimes it makes more sense to not use a framework or library at all if it
has a significant performance impact.

Removing unused code a good way to optimize apps that include large third-party
libraries. The [Remove unused code guide](/remove-unused-code) explains this
process in detail and here's a quick way to rewrite the countdown code without using moment.js.

In **app/components/Countdown.jsx** remove:

```js//0-2
const today = moment();
const yearEnd = moment().endOf('year');
const daysLeft = yearEnd.diff(today, 'days');
```

And delete this line:

```js//0
const moment = require('moment');
```

It takes a bit of math, but you can implement the same countdown with vanilla
JavaScript:

```js
const today = new Date();
const year = today.getFullYear();
const yearEnd = new Date(year,11,31); //months are zero indexed in JS
const timeDiff = Math.abs(yearEnd.getTime() - today.getTime());
const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
```

Now remove `moment.js` from `package.json` and run webpack in the console
again to build the optimized bundle.

Ta-da! You have shaved off 223 KiB (230KB) and the app is under budget.🎉

{% Img src="image/admin/A6TIDToLthjRrHvxluND.png", alt="Webpack bundle size output after optimization is 97.7 KiB", width="473", height="58", class="w-screenshot w-screenshot--filled" %}

## Monitor

Setting up a performance budget in webpack takes just a couple of lines of code
and it will warn you if you ever (accidentally) add a big dependency. The
saying goes "out of sight, out of mind" but webpack can make sure that you are
aware of performance implications at all times.
