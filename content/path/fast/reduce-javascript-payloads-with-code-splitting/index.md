---
page_type: guide
title: Reduce JavaScript payloads with code-splitting
author: houssein
web_lighthouse:
- bootup-time
wf_blink_components: N/A
---

# Reduce JavaScript payloads with code-splitting

Nobody likes waiting.
**[Over 50% of users will abandon a website if it takes longer than 3 seconds to load](https://www.thinkwithgoogle.com/intl/en-154/insights-inspiration/research-data/need-mobile-speed-how-mobile-latency-impacts-publisher-revenue/)**.

![Cookie monster, tapping his fingers on a desk. Waiting for something.](./cookie-monster.gif)

Sending large JavaScript payloads will impact the speed of your site
significantly. Instead of shipping all the JavaScript to your user as soon as
the first page of your application is loaded, **code-split** your bundle into
multiple "pieces" and only send what's necessary at the very beginning. 

## Measure

Lighthouse displays a failed audit when a significant amount of time is taken to
execute all the JavaScript on a page. 

![A failing Lighthouse audit showing scripts taking too long to execute.](./lh-audit.png)

Split the JS bundle to only send the code needed for the initial route when the
user loads an application. This minimizes the amount of script that needs to be
parsed and compiled, which will in faster page load times. 

[webpack](https://webpack.js.org/), the most widely used module bundler, allows
you to split your bundles using
[dynamic imports](https://developers.google.com/web/updates/2017/11/dynamic-import).
For example, consider the following code snippet that shows an example of a
`someFunction `method that gets fired when a form is submitted.

    import moduleA from "library";

    form.addEventListener("submit", e => {
      e.preventDefault();
      someFunction();
    });

    const someFunction = () => {
     // uses moduleA
    }

In here, `someFunction` uses a module imported from a particular library. If
this module is not being used elsewhere, the code block can be modified to use a
dynamic import to fetch it only when the form is submitted by the user. 

    import moduleA from "library";

    form.addEventListener("submit", e => {
     e.preventDefault();
     someFunction();
     import('library.moduleA')
        .then(module => module.default) // using the default export
        .then(someFunction())
        .catch(handleError());
    });

    const someFunction = () => {
      // uses moduleA
    }

The code that makes up the module does not get included into the initial bundle
and is now _lazy loaded**, **_or provided to the user only when it is needed
after the form submission. Other module bundlers, such as
[Parcel](https://parceljs.org/code_splitting.html) and
[Rollup](https://rollupjs.org/guide/en#dynamic-import), also provide dynamic
import support. To further improve page performance, preload critical chunks to
prioritize and fetch them sooner. We cover this in more detail in the "[Preload
critical assets to improve loading speed](https://example.com)" guide.

Although the previous code snippet is a simple example, lazy loading third party
dependencies is not a common pattern in larger applications. Usually, third
party dependencies are split into a separate vendor bundle that can be cached
since they don't update as often. You can read more about how the
**[SplitChunksPlugin](https://webpack.js.org/plugins/split-chunks-plugin/)** can
help you do this.

Splitting on the route or component level when using a client-side framework is
a simpler approach to lazy loading different parts of your application. Many
popular frameworks that use webpack provide abstractions to make lazy loading
easier than diving into the configurations yourself. 

## Next Steps

Although it's useful to understand how dynamic imports work, use the method
recommended by your framework/library instead. Refer to any of the following
sample code projects to learn more about how following frameworks allow you to
split on the route or component level:

+  [Angular](https://example.com)
+  [React](https://example.com/)
+  [Vue](https://example.com/)

To learn more about how dynamic imports work by seeing it used in a real
example, refer to the associated [codelab](https://example.com) for this
guide.
