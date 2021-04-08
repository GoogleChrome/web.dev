---
layout: post
title: Remove unused code
subhead: |
  npm makes adding code to your project a breeze. But are you really using all
  those extra bytes?
authors:
  - houssein
date: 2018-11-05
description: |
  Registries like npm have transformed the JavaScript world for the better by
  allowing anyone to easily download and use over half a million public
  packages. But we often include libraries we're not fully utilizing. To fix
  this issue, analyze your bundle to detect unused code.
codelabs:
  - codelab-remove-unused-code
tags:
  - performance
---

Registries like [npm](https://docs.npmjs.com/getting-started/what-is-npm) have
transformed the JavaScript world for the better by allowing anyone to easily
download and use over _half a million_ public packages. But we often include
libraries we're not fully utilizing. To fix this issue, **analyze your bundle**
to detect unused code. Then remove **unused** and **unneeded** libraries.

## Analyze your bundle

DevTools makes it easy to see the size of all network requests:
{% Instruction 'devtools-network', 'ol' %}
{% Instruction 'disable-cache', 'ol' %}
{% Instruction 'reload-page', 'ol' %}

{% Img src="image/admin/aq6QZj5p4KTuaWnUJnLC.png", alt="Network panel with bundle request", width="800", height="169", class="w-screenshot" %}

The [Coverage](https://developers.google.com/web/updates/2017/04/devtools-release-notes#coverage)
tab in DevTools will also tell you how much CSS and JS code in your application
is unused.

{% Img src="image/admin/xlPdOMaeykJhYqGcaMJr.png", alt="Code Coverage in DevTools", width="800", height="562", class="w-screenshot w-screenshot--filled" %}

By specifying a full Lighthouse configuration through its Node CLI, an "Unused
JavaScript" audit can also be used to trace how much unused code is being
shipped with your application.

{% Img src="image/admin/tdC0d65gEIiHZy6eyo82.png", alt="Lighthouse Unused JS Audit", width="800", height="347", class="w-screenshot" %}

If you happen to be using [webpack](https://webpack.js.org/) as your bundler,
[Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)
will help you investigate what makes up the bundle. Include the plugin in your
webpack configurations file like any other plugin:

```js/4
module.exports = {
  //...
  plugins: [
    //...
    new BundleAnalyzerPlugin()
  ]
}
```

Although webpack is commonly used to build single-page applications, other
bundlers, such as [Parcel](https://parceljs.org/) and
[Rollup](https://rollupjs.org/guide/en), also have visualization tools that you
can use to analyze your bundle.

Reloading the application with this plugin included shows a zoomable treemap of
your entire bundle.

{% Img src="image/admin/pLAHEtl5C011wTk2IJij.png", alt="Webpack Bundle Analyzer", width="800", height="468" %}

Using this visualization allows you to inspect which parts of your bundle are
larger than others, as well as get a better idea of all the libraries that
you're importing. This can help identify if you are using any unused or
unnecessary libraries.

## Remove unused libraries

In the previous treemap image, there are quite a few packages within a single
`@firebase` domain. If your website only needs the firebase database component,
update the imports to fetch that library:

```js/1-2/0
import firebase from 'firebase';
import firebase from 'firebase/app';
import 'firebase/database';
```

It is important to emphasize that this process is significantly more complex for
larger applications.

For the mysterious looking package that you're quite sure is not being used
anywhere, take a step back and see which of your top-level dependencies are
using it. Try to find a way to only import the components that you need from it.
If you aren't using a library, remove it.  If the library isn't required for the
initial page load, consider if it can be [lazy loaded](/reduce-javascript-payloads-with-code-splitting).

And in case you're using webpack, check out [the list of plugins
that automatically remove unused code from popular libraries](https://github.com/GoogleChromeLabs/webpack-libs-optimizations).

{% Aside 'codelab' %}
[Remove unused code.](/codelab-remove-unused-code)
{% endAside %}

## Remove unneeded libraries

Not all libraries can be easily broken down into parts and selectively imported.
In these scenarios, consider if the library could be removed entirely. Building
a custom solution or leveraging a lighter alternative should always be options
worth considering. However, it is important to weigh the complexity and effort
required for either of these efforts before removing a library entirely from an
application.
