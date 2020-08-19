---
layout: post
title: Serve modern code to modern browsers for faster page loads
authors:
  - houssein
description: |
  Building websites that work well on all major browsers is a core tenet of an
  open web ecosystem. However, this means additional work of ensuring that all
  of the code you write is supported in each browser that you plan to target. If
  you want to use new JavaScript language features, you need to transpile these
  features to backwards-compatible formats.  
date: 2018-11-05
updated: 2020-06-23
codelabs:
  - codelab-serve-modern-code
tags:
  - performance
---

Building websites that work well on all major browsers is a core tenet of an
open web ecosystem. However, this means additional work of ensuring that all of
the code you write is supported in each browser that you plan to target. If you
want to use new JavaScript language features, you need to transpile these
features to backwards-compatible formats for browsers that do not yet support
them.

[Babel](https://babeljs.io/docs/en) is the most widely used tool to compile code
that contains newer syntax into code that different browsers and environments
(such as Node) can understand. This guide assumes you are using Babel, so you
need to follow the [setup instructions](https://babeljs.io/setup) to
include it into your application if you haven't already. Select `webpack`
in `Build Systems` if you are using webpack as the module bundler in your app.

{% Aside %}
Fun fact: Lebab is a separate library that does the opposite of what Babel does.
It converts older code into newer syntax.
{% endAside %}

To use Babel to only transpile what is needed for your users, you
need to:

1. Identify which browsers you want to target.
2. Use `@babel/preset-env` with appropriate browser targets.
3. Use `<script type="module">` to stop sending transpiled code to browsers that don't need it.

## Identify which browsers you want to target

Before you begin to modify how the code in your application is transpiled, you
need to identify which browsers access your application. Analyze which browsers
your users are currently using as well as those that you plan to target to make an
informed decision.

## Use @babel/preset-env

Transpiling code usually results in a file that is larger than the
original larger file sizes than their original forms. By minimizing the amount of
compilation that you do you can reduce the size of your bundles to improve the
performance of a web page.

Instead of including specific plugins to selectively compile certain language
features you are using, Babel provides a number of presets that bundles plugins
together. Use [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)
to only include the transforms and polyfills needed for the browsers you plan on
targeting.

Include `@babel/preset-env` within the `presets` array in your Babel
configurations file, `.babelrc`:

```json
{
 "presets": [
   [
     "@babel/preset-env",
     {
       "targets": ">0.25%"
     }
   ]
 ]
}
```

Use the `targets` field to specify which browser versions you want to include
by adding an appropriate query to the `browsers` field. `@babel/preset-env`
integrates with browserslist, an open-source configuration shared between different
tools for targeting browsers. A full list of compatible queries is in the
[browserslist documentation](https://github.com/browserslist/browserslist#full-list).
Another option is to use a [`.browserslistrc`](https://babeljs.io/docs/en/babel-preset-env#browserslist-integration) file to list the environments
you wish to target.

The `">0.25%"` value tells Babel to only include the transforms
needed to support browsers that make up more than 0.25% of global
usage. This ensures your bundle does not contain unnecessary transpiled
code for browsers that are used by a very small percentage of users.

In most cases, this is a better approach than using the following
configuration:

```json
  "targets": "last 2 versions"
```

The `"last 2 versions"` value transpiles your code for the
[last two versions](http://browserl.ist/?q=last+2+versions) of every browser,
which means support is provided for discontinued browsers such as Internet Explorer.
This can unnecessarily increase the size of your bundle if you do not expect these
browsers to be used to access your application.

Ultimately, you should select the appropriate combination of queries to only
target browsers that fit your needs.

### Enable modern bugfixes

`@babel/preset-env` groups multiple JavaScript syntax features into collections and enables/disables
them based on the target browsers specified. Although this works well, an entire collection of
syntax features is transformed when a targeted browser contains a bug with just a single feature.
This often results in more transformed code than is necessary.

Originally developed as a [separate preset](https://github.com/babel/preset-modules), the 
[bugfixes option](https://babeljs.io/docs/en/babel-preset-env#bugfixes) in `@babel/preset-env`
solves this problem by converting modern syntax that is broken in some browsers to the closest
equivalent syntax that is not broken in those browsers. The result is nearly identical modern code
with a few small syntax tweaks that guarantee compatibility in all target browsers. To use this
optimization, make sure you have `@babel/preset-env` 7.10 or later installed, then set the
[`bugfixes`](https://babeljs.io/docs/en/babel-preset-env#bugfixes) property to `true`:

```json
{
 "presets": [
   [
     "@babel/preset-env",
     {
       "bugfixes": true
     }
   ]
 ]
}
```

In Babel 8, the `bugfixes` option will be enabled by default.

## Use `<script type="module">`

JavaScript modules, or ES modules, are a relatively new feature supported in
[all major browsers](https://caniuse.com/#feat=es6-module). You can use modules
to create scripts that can import and export from other modules, but you can
also use them with `@babel/preset-env` to only target browsers that support
them.


Instead of querying for specific browser versions or market share, consider 
specifying `"esmodules" : true` inside your `.babelrc` file's `targets` field.

```json
{
   "presets":[
      [
         "@babel/preset-env",
         {
            "targets":{
               "esmodules": true
            }
         }
      ]
   ]
}
```

Many newer ECMAScript features compiled with Babel are already supported
in environments that support JavaScript modules. So by doing this, you
simplify the process of making sure that only transpiled code is used
for browsers that actually need it.

Browsers that support modules ignore scripts with a `nomodule` attribute.
Conversely, browsers that do not support modules ignore script elements with
`type="module"`. This means you can include a module as well as a compiled fallback.

Ideally, the two version scripts of an application are included like this:

```html
  <script type="module" src="main.mjs"></script>
  <script nomodule src="compiled.js" defer></script>
```

Browsers that support modules fetch and execute `main.mjs` and ignore `compiled.js`.
The browsers that do not support modules do the opposite.

{% Aside %}
  Module scripts are deferred by default. The `defer` attribute is added to the
  `nomodule` script for the same behavior.
{% endAside %}

If you use webpack, you can set different targets in your configurations for two
separate versions of your application:

* A version only for browsers that support modules.
* A version that includes a compiled script which works in any legacy browser. This has a larger file size, since transpilation needs to support a wider range of browsers.

{% Aside %}
  Although this HTML approach can provide performance benefits, certain browsers have been found to
  double-fetch when specifying both module and nomodule scripts. Jason Miller's [Modern Script
  Loading](https://jasonformat.com/modern-script-loading/) explains this in more detail and covers a
  few options that can be used to circumvent this.
{% endAside %}

_With thanks to Connor Clark and Jason Miller for their reviews._
