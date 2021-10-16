---
layout: codelab
title: Reduce JavaScript payloads with code splitting
authors:
  - houssein
description: |
  In this codelab, learn how to improve the performance of a simple application
  through code splitting.
date: 2018-11-05
glitch: code-splitting-starter
related_post: reduce-javascript-payloads-with-code-splitting
tags:
  - performance
---

{% include 'content/devtools-headsup.njk' %}

Most web pages and applications are made up of many different parts. Instead of
sending all the JavaScript that makes up the application as soon as the first
page is loaded, splitting the JavaScript into multiple chunks
improves page performance.

This codelab shows how to use **code splitting** to improve the performance of a
simple application that sorts three numbers.

{% Img src="image/admin/1lb0XbGP6M4eShkmYaQW.png", alt="A browser window shows an application titled Magic Sorter with three fields for inputting numbers and a sort button.", width="800", height="504" %}

## Measure

{% Aside %}
Since webpack is used in this application, any changes made to the code will trigger a new build which can take a few seconds. Once it completes, you should see your changes reflected in the application.
{% endAside %}

Like always, it's important to first measure how well a website performs before
attempting to add any optimizations.

{% Instruction 'preview', 'ol' %}
{% Instruction 'devtools-network', 'ol' %}
{% Instruction 'disable-cache', 'ol' %}
{% Instruction 'reload-app', 'ol' %}

{% Img src="image/admin/pyzLwutSzSx2qztQMXTM.png", alt="Network panel showing 71.2 KB JavaScript bundle.", width="800", height="153", class="w-screenshot" %}

71.2 KB worth of JavaScript just to sort a few numbers in a simple application.
What gives?

In the source code (`src/index.js`), the `lodash` library is imported and used
in this application. [Lodash](https://lodash.com/) provides many useful utility
functions, but only a single method from the package is being used here.
Installing and importing entire third-party dependencies where only a small
portion of it is being utilized is a common mistake.

## Optimize

There are a few ways the bundle size can be trimmed:

1.  Write a custom sorting method instead of importing a third-party library
2.  Use the built in `Array.prototype.sort()` method to sort numerically
3.  Only import the `sortBy` method from `lodash` and not the entire library
4.  Download the code for sorting only when the user clicks the button

Options 1 and 2 are perfectly appropriate methods to reduce the bundle size (and
would probably make the most sense for a real application). However, those are
not used in this tutorial for the sake of teaching 😈.

{% Aside %}
The concept of removing unused code is explored in further detail in a
[separate guide](/remove-unused-code).
{% endAside %}

Both options 3 and 4 help improve the performance of this application. The
next few sections of this codelab cover these steps. Like any coding
tutorial, always try to write the code yourself instead of copy and pasting.

### Only import what you need

A few files need to be modified to only import the single method from `lodash`.
To begin with, replace this dependency in `package.json`:

```json
"lodash": "^4.7.0",
```

with this:

```json
"lodash.sortby": "^4.7.0",
```

Now in `src/index.js`, import this specific module:

```js/2/1
import "./style.css";
import _ from "lodash";
import sortBy from "lodash.sortby";
```

And update how the values are sorted::

```js/4/3
form.addEventListener("submit", e => {
  e.preventDefault();
  const values = [input1.valueAsNumber, input2.valueAsNumber, input3.valueAsNumber];
  const sortedValues = _.sortBy(values);
  const sortedValues = sortBy(values);

  results.innerHTML = `
    <h2>
      ${sortedValues}
    </h2>
  `
});
```

Reload the application, open DevTools, and take a look at the **Network** panel
once again.

{% Img src="image/admin/J8c1PhqMDOJKjoenzMCN.png", alt="Network panel showing 15.2 KB JavaScript bundle.", width="800", height="148", class="w-screenshot" %}

For this application, the bundle size was reduced by over 4X with very little
work, but there's still more room for improvement.

### Code splitting

[**webpack**](https://webpack.js.org/) is one of the most popular open-source
module bundlers used today. In short, it _bundles_ all JavaScript modules (as
well as other assets) that make up a web application into static files that can
be read by the browser.

The single bundle used in this application can be split into two separate
chunks:

- One responsible for the code that makes up our initial route
- A secondary chunk that contains our sorting code

With the use of **dynamic imports**, a secondary chunk can be _lazy loaded,_ or
loaded on demand. In this application, the code that makes up the chunk can be
loaded only when the user presses the button.

Begin by removing the top-level import for the sort method in `src/index.js`:

```js//0
import sortBy from "lodash.sortby";
```

And import it within the event listener that fires when the button is pressed:

```js/2-5
form.addEventListener("submit", e => {
  e.preventDefault();
  import('lodash.sortby')
    .then(module => module.default)
    .then(sortInput())
    .catch(err => { alert(err) });
});
```

The `import()` feature is part of a
[proposal](https://github.com/tc39/proposal-dynamic-import) (currently at stage
3 of the TC39 process) to include the capability to dynamically import a module.
webpack has already included support for this and follows the same syntax laid
out by the proposal.

{% Aside %}
Read more about how dynamic imports work in this [Web Updates
article](https://developers.google.com/web/updates/2017/11/dynamic-import).
{% endAside %}


`import()` returns a promise and when it resolves, the selected
module is provided which is split out into a separate chunk. After the module is
returned, `module.default` is used to reference the default
export provided by lodash. The promise is chained with another `.then` that
calls a `sortInput` method to sort the three input values. At the end of the
promise chain, .`catch()` is used to handle cases where the promise is rejected
due to an error.

{% Aside 'caution' %}
In a production application, always handle dynamic import
errors appropriately. A simple alert message similar to what is used here may
not provide the best user experience to let the user know something has
failed.
{% endAside %}

{% Aside %}
You may see a linting error that says:

```bash
Parsing error: 'import' and 'export' may only appear at the top level.
```

This is due to the fact that
the dynamic import syntax is still in the proposal stage and has not been
finalized. Although webpack already supports it, the settings for
[ESLint](https://eslint.org) (a JavaScript linting utility) used by
Glitch has not been updated to include this syntax yet, but it still works!
{% endAside %}

The last thing that needs to be done is to write the `sortInput` method at the
end of the file. This needs to be a function that _returns_ a function that
takes in the imported method from `lodash.sortBy`. The nested function can then
sort the three input values and update the DOM.

```js
const sortInput = () => {
  return (sortBy) => {
    const values = [
      input1.valueAsNumber,
      input2.valueAsNumber,
      input3.valueAsNumber
    ];
    const sortedValues = sortBy(values);

    results.innerHTML = `
      <h2>
        ${sortedValues}
      </h2>
    `
  };
}
```

## Monitor

Reload the application one last time and keep a close eye on the **Network**
panel again. Only a small initial bundle is downloaded as soon as the app
loads.

{% Img src="image/admin/f1QZcSozkaA1rj52YWGV.png", alt="Network panel showing 2.7 KB JavaScript bundle.", width="800", height="151", class="w-screenshot" %}

After the button is pressed to sort the input numbers, the chunk that contains
the sorting code gets fetched and executed.

{% Img src="image/admin/LPNj3JpAmzsGppwJl5fs.png", alt="Network panel showing 2.7 KB JavaScript bundle followed by a 13.9 KB JavaScript bundle.", width="800", height="211", class="w-screenshot" %}

Notice how the numbers still get sorted!

## Conclusion

Code splitting and lazy loading can be extremely useful techniques to trim down
the initial bundle size of your application, and this can directly result in
much faster page load times. However, there are some important things that need
to be considered before including this optimization in your application.

### Lazy loading UI

When lazy loading specific modules of code, it's important to consider how the
experience would be for users with weaker network connections. Splitting and
loading a very large chunk of code when a user submits an action can make it
seem like the application may have stopped working, so consider showing a
loading indicator of some sort.

### Lazy loading third-party node modules

It is not always the best approach to lazy load third-party dependencies in your
application and it depends on where you use them. Usually, third party
dependencies are split into a separate `vendor` bundle that can be cached since
they don't update as often. Read more about how the
[SplitChunksPlugin](https://webpack.js.org/plugins/split-chunks-plugin/) can
help you do this.

### Lazy loading with a JavaScript framework

Many popular frameworks and libraries that use webpack provide abstractions to
make lazy loading easier than using dynamic imports in the middle of your
application.

+  [Lazy loading modules with Angular](https://angular.io/guide/lazy-loading-ngmodules)
+  [Code splitting with React Router](https://reacttraining.com/react-router/web/guides/code-splitting)
+  [Lazy loading with Vue Router](https://router.vuejs.org/guide/advanced/lazy-loading.html)

Although it is useful to understand how dynamic imports work, always use the
method recommended by your framework/library to lazy load specific modules.

### Preloading and prefetching

Where possible, take advantage of browser hints such as `<link rel="preload">`
or `<link rel="prefetch">` in order to try and load critical modules even
sooner. webpack supports both hints through the use of magic comments in import
statements. This is explained in more detail in the
[Preload critical chunks](/preload-critical-assets) guide.

### Lazy loading more than code

Images can make up a significant part of an application. Lazy loading those that
are below the fold, or outside the device viewport, can speed up a website. Read
more about this in the
[Lazysizes](/use-lazysizes-to-lazyload-images) guide.
