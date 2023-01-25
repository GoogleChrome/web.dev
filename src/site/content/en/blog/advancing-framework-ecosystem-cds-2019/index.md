---
title: "Advancing the web framework ecosystem"
subhead: |
  Chrome is collaborating with open-source frameworks to work towards a better web
authors:
  - houssein
date: 2020-01-08
description: |
  Learn about how Chrome is investing efforts in a number of open-source tools to advance the JavaScript ecosystem
hero: image/admin/prKYY6a0bcDxDvuiWvWk.jpg
thumbnail: image/admin/c8D4Cj94qLbosd7ptE7Q.jpg
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - performance
  - frameworks
---

Chrome is an active contributor to the web framework ecosystem and our talk at Chrome Dev Summit
2019 covers what we've worked on in the past year.

{% YouTube 'QDljY2I1Pfw' %}

Read on for an extended recap of the talk with additional details and resources.

## How do we make the web better?

The goal of everyone on the Chrome team is to make the web better. We work on improving browser APIs
and V8--the core JavaScript and WebAssembly engine that powers Chrome--so that developers are
equipped with features that help them build great web pages. We also try to improve websites that
are already in production today by contributing to open-source tooling in many ways.

[Most web
developers](https://almanac.httparchive.org/en/2019/javascript#open-source-libraries-and-frameworks)
rely on open source tools whenever possible and they prefer not to build entirely custom
infrastructure. Client-side JavaScript frameworks and UI libraries make up a growing portion of
open-source usage. Data on the three most popular client-side frameworks and libraries,
[React](https://reactjs.org/), [Angular](https://angular.io/), and [Vue](https://vuejs.org/), shows
that:

+   72% of participants in the
    [MDN's First Annual Web Developer & Designer Survey](https://hacks.mozilla.org/2019/12/presenting-the-mdn-web-developer-needs-assessment-web-dna-report/)
    use at least one of these frameworks and libraries.
+   Over
    [320,000 sites](https://bigquery.cloud.google.com/savedquery/1086077897885:24ffb259f2a04a7f9955e44f6e0298e9) in
    the top 5 million URLs analyzed by HTTP Archive use at least one of these frameworks and libraries.
+   When grouped by time spent, 30 of the top 100 URLs use at least one of these frameworks and
    libraries. (Research was done on internal data.)

This means that **better open-source tooling can directly result in a better web** and that's why
Chrome engineers have started working directly with external framework and library authors.

## Contributions to web frameworks

Frameworks commonly used to build and structure web pages fall into two categories:

+   **UI frameworks** (or libraries), such as Preact, React, or Vue, which provide control
    over an application's view layer (through a component model for example).
+   **Web frameworks**, such as Next.js, Nuxt.js, and Gatsby, which provide an end-to-end system
    with opinionated features built-in, such as server-side rendering. These frameworks usually
    leverage a UI framework or library for the view layer.

{% Img src="image/admin/OI4rF5fAQJ5PYP2f6AA6.png", alt="A spectrum of UI frameworks and libraries versus Web frameworks", width="800", height="455" %}

Developers can choose not to use frameworks but by piecing together a view layer library, router,
styling system, server renderer and so forth, they often end up creating their own type of a
framework. Although opinionated, web frameworks take care of many of these concerns by default.

The rest of this post highlights many improvements that have recently landed in different frameworks
and tools, including contributions from the Chrome team.

## Angular

The Angular team has shipped a number of improvements to version 8 of the framework:

+   [Differential loading](https://angular.io/guide/deployment#differential-builds) by
    default to minimize unneeded polyfills for newer browsers.

<figure class="w-figure">
  {% Img src="image/admin/kPQFf4eoaz1wcUZULmbZ.png", alt="Graph showing bundle size reduction of angular.io with and without differential builds", width="800", height="463", class="w-screenshot" %}
  <figcaption class="w-figcaption">Bundle size reduction for angular.io with differential builds (from <a href="https://blog.angular.io/version-8-of-angular-smaller-bundles-cli-apis-and-alignment-with-the-ecosystem-af0261112a27">Version 8 of Angular</a>)</figcaption>
</figure>

+   Support for standard dynamic import syntax for lazy-loading routes.
+   [Web worker support](https://angular.io/guide/web-worker) to run operations in a background thread separate from the main thread.
+   [Ivy](https://www.youtube.com/watch?v=jnp_ny4SOQE&feature=youtu.be&t=1320), Angular's new
    rendering engine which provides better re-compilation performance and a reduction in bundle
    sizes, is available in [preview mode](https://angular.io/guide/ivy#opting-into-angular-ivy) for
    existing projects.

You can learn more about these improvements in
["Version 8 of Angular"](https://blog.angular.io/version-8-of-angular-smaller-bundles-cli-apis-and-alignment-with-the-ecosystem-af0261112a27)
and the Chrome team looks forward to working with them closely in the next year as more features
land.

## Next.js

[Next.js](https://nextjs.org/) is a web framework that uses React as a view layer. In addition to a
UI component model that many developers expect from a client-side framework, Next.js provides a
number of built-in default features:

+   Routing with default code-splitting
+   Compilation and bundling (using [Babel](https://babeljs.io/) and
    [webpack](https://webpack.js.org/))
+   Server-side rendering
+   Mechanisms to fetch data at a per-page level
+   Encapsulated styling (with [styled-jsx](https://github.com/zeit/styled-jsx))

Next.js optimizes for reduced bundle sizes, and the Chrome team helped identify areas where we could
help further improve performance. You can learn more about each of them by viewing their requests
for comments (RFCs) and pull requests (PRs):

1.  An improved webpack chunking strategy that emits more granular bundles, reducing the
    amount of duplicate code fetched through multiple routes
    ([RFC](https://github.com/zeit/next.js/issues/7631),
    [PR](https://github.com/zeit/next.js/pull/7696)).
2.  Differential loading with the
    [module/nomodule pattern](../serve-modern-code-to-modern-browsers/#use-lessscript-type%22module%22greater)
    which can reduce the total amount of JavaScript in Next.js apps by up to 20% with no code
    changes ([RFC](https://github.com/zeit/next.js/issues/7563),
    [PR](https://github.com/zeit/next.js/pull/7704)).
3.  Improved performance metric tracking which utilizes the User Timing API
    ([PR](https://github.com/zeit/next.js/pull/8069)).

<figure class="w-figure">
  {% Img src="image/admin/5QA6KNYCwQ4aLdowLGNS.png", alt="Homepage of Barnebys.com", width="800", height="543", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption"><a href="https://www.barnebys.com/">Barnebys.com</a>, a large search engine for antiques and collectibles, saw a 23% reduction in total JavaScript after enabling granular chunking</figcaption>
</figure>

We are also exploring other features to improve both the user and developer experience of using
Next.js, such as:

+   Enabling concurrent mode to unlock progressive or partial hydration of components.
+   A webpack based conformance system that analyzes all source files and generated assets to
    surface better errors and warnings ([RFC](https://github.com/zeit/next.js/issues/9310)).

<figure class="w-figure">
  {% Img src="image/admin/LoKCHqIIpGkQIUjxZlre.png", alt="Example of a conformance build error in Next.js", width="800", height="367", class="w-screenshot w-screenshot--filled" %}
  <figcaption class="w-figcaption">An example of a conformance build error in Next.js (prototype)</figcaption>
</figure>

## Nuxt.js

[Nuxt.js](https://nuxtjs.org/) is a web framework that combines Vue.js with different libraries to
provide an opinionated setup. Similar to Next.js, it includes many features out-of-the-box:

+   Routing with default code-splitting
+   Compilation and bundling (using [Babel](https://babeljs.io/) and
    [webpack](https://webpack.js.org/))
+   Server-side rendering
+   Asynchronous data fetching for every page
+   Default data store ([Vuex](https://vuex.vuejs.org/guide/))

Along with working directly on improving the performance of different tools, we've expanded the
[framework fund](https://opencollective.com/chrome) to provide monetary support to more open-source
frameworks and libraries. With our [recent
support](https://github.com/nuxt/nuxt.js/issues/6467#issuecomment-538192059) to Nuxt.js, a few
features are slated to land in the near future including smarter server-rendering and image
optimizations.

{% Aside %}
The framework fund accelerates the efforts of different frameworks and libraries with the goal to
improve their performance. If you are working on an open-source tool and need support, [please
apply](https://bit.ly/chrome-framework-fund)!
{% endAside %}

## Babel

We've also made progress on improving the performance of an important underlying tool in almost all
of the mentioned frameworks--[Babel](https://babeljs.io/).

Babel compiles code that contains newer syntax into code that different browsers can understand.
It's become common to use [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) to target
modern browsers where different browser targets can be specified to provide enough polyfilling
required for all the chosen environments. One way to specify the targets is to use `<script
type="module">` to target all browsers that [support ES
Modules](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules).

{% Aside %}
To learn more about how to leverage ES modules to minimize polyfill code shipped to browsers
that do not need them, check out
[Serve modern code to modern browsers for faster page loads](/serve-modern-code-to-modern-browsers).
{% endAside %}

To optimize for this case, we launched a brand new preset;
[@babel/preset-modules](http://github.com/babel/preset-modules). Instead of converting modern syntax
to older syntax to avoid browser bugs, `preset-modules` fixes each specific bug by transforming to the
closest possible non-broken modern syntax. This results in modern code that can be delivered *nearly
unmodified* to most browsers.

{% Img src="image/admin/8qG6cuXyjKvE89du82Ki.png", alt="A new babel preset to provide better polyfilling for browsers", width="800", height="453" %}

Developers who already use `preset-env` will also benefit from these optimizations without having to
do anything, as they'll soon be incorporated into `preset-env` too.

## What's next?

Working closely with open-source frameworks and libraries to provide better experiences helps the
Chrome team realize what is fundamentally important to users and developers alike.

If you work on a web framework, UI library, or any form of web tooling (bundler, compiler, linter),
[apply for the framework fund](http://bit.ly/chrome-framework-fund)!
