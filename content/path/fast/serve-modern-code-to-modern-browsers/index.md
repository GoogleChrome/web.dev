---
page_type: guide
title: Serve modern code to modern browsers for faster page loads
author: houssein
wf_blink_components: N/A
---

# Serve modern code to modern browsers for faster page loads

Building websites that work well on all major browsers is a core tenet of an
open web ecosystem. However, this means additional work of ensuring that all of
the code you write is supported in each browser that you plan to target. If you
want to use new JavaScript language features, you will need to transpile these
features to backwards-compatible formats for browsers that do not yet support
them.

![image](./serve-modern-code-to-modern-browsers-1.png)

[Babel](https://babeljs.io/docs/en) is the most widely used tool to compile code
that contains newer syntax into code that different browsers and environments
(such as Node) can understand. This guide assumes you are using Babel, so you
will need to follow the [setup instructions](https://babeljs.io/setup) to
include it into your application if you haven't already.

To use Babel to only transpile what is required byneeded for your users, you
will need to:

1. Identify which browsers you want to target.
1. Use @babel/preset-env with appropriate browser targets.
1. Use `<script type="module">` to stop sending transpiled code to browsers
    that don't need it.

## Identify which browsers you want to target

Before you begin to modify how the code in your application is transpiled, you
will need to identify which browsers will be used your users will be using to
access your application. Use [browser market
share](http://gs.statcounter.com/browser-market-share) data to help make an
informed decision and filter for the device platforms and regions you are
targeting.

## Use @babel/preset-env

Transpiling code will usually result in a file that is larger than the
originallarger file sizes than their original forms. By minimizing the amount of
compilation that you do you can reduce the size of your bundles to improve the
performance of a web page.

Instead of including specific plugins to selectively compile certain language
features you are using, Babel provides a number of presets that bundles plugins
together. Use [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)
to only include the transforms and polyfills needed for the browsers you plan on
targeting. This ensures that any transpiled code for browsers that are not being
used to access your application does not get included into the final bundle.

Include `@babel/preset-env`it settings within the `presets` array in your Babel
configurations file, `.babelrc`:

{  
 "presets": [  
**   **[  
**     "@babel/preset-env",**  
**     {**  
**       "targets": {**  
**         "browsers": [">0.25%"]**  
**       }**  
**     }**  
**   ]**  
 ]  
}

Use the `targets` field to specify which browser versions you want to include,
by adding an appropriate query to the `browsers` field. `@babel/preset-env`
integrates with browserslist, and you can find a full list of compatible queries
in the [documentation](https://github.com/browserslist/browserslist#full-list).
Another option is to use a
[`.browserslistrc](https://babeljs.io/docs/en/babel-preset-env#browserslist-integration)`
file to list the environments you wish to target.

The `">0.25%"` value tellsis used to inform Babel to include all necessary
transforms needed to support browsers that make up of more than 0.25% of global
usage. This will ensure your bundle does not contain unnecessary transpiled code
for browsers that are used by a very small percentage of users.

In most cases, this is a better approach than using the following
configuration:

** "targets": {**  
**     "browsers": ["last 2 versions"]**  
**  }**

The `"last 2 versions"` value will transpile your code for the [last two
versions](http://browserl.ist/?q=last+2+versions) of every browser, which. This
means support will be provided for discontinued browsers such as Internet
Explorer. This can unnecessarily increase the size of your bundle if you do not
expect users to use these browsers to be used to access your application. This
is further explained in [this article](https://jamie.build/last-2-versions) by
James Kyle.

Ultimately, you should select the appropriate combination of queries to only
target browsers that fit your needs.

### Use <script type="module">

JavaScript modules, or ES modules, are a relatively new feature supported in
[all major browsers](https://caniuse.com/#feat=es6-module). You can use modules
to create scripts that can import and export from other modules, but you can
also use them with `@babel/preset-env`to only target browsers that support
them.

Instead of querying for specific browser versions or market share, you can also
use the different approach of adding `"esmodules" : true` inside your `.babelrc`
file's `targets` field. Many newer ECMAScript features usually compiled with
Babel are already supported in environments that support JavaScript modules. So
by doing this, you can simplify the process of making sure that only transpiled
code is used for browsers that actually need it.

    {
     "presets": [
       [
         "@babel/preset-env",
         {
           "targets": {
             "esmodules": true
           }
         }
       ]
     ]
    }

A ``nomodule`` attribute, which is unrecognized in environments that do not yet
support modules, can be used for the compiled script. This script will not be
fetched and executed in environments that support modules. Similarly, older
browsers that do not support this feature will ignore script elements with
`type="module"`.

    <script type="module" src="main.mjs"></script>
    <script nomodule src="compiled.js"></script>

If you use a module bundler like [webpack](https://webpack.js.org/), you can set
different targets in your configurations for two separate versions of your
application:

+  A version that works in would work in newer browsers that support
    modules and whichthat includes a module that is largely untranspiled but
    has a smaller file size
+  A version that includes a larger, compiled script that would work in any
    legacy browser

Philip Walton explains this in further detail in his article,
[Deploying ES2015+ Code in Production Today](https://philipwalton.com/articles/deploying-es2015-code-in-production-today/).

## Next Steps

Now that you have a better understanding of how Babel can be used to only
compile code for browsers that you are targeting, head on over to the associated
[codelab](https://docs.google.com/document/d/1mg1SZj5HFKhaAzQfsuMfw3pTA7nH8F4qyMxf3dfqJ_g/edit#heading=h.owjpdw50s587)
for this guide to see all of this in practice with a real example.
