---
layout: post
title: Remove unused JavaScript
description: |
  Learn how to pass Lighthouse's "Remove unused JavaScript" audit.
web_lighthouse:
  - unused-javascript
date: 2020-07-07
---

Unused JavaScript can slow down your page load speed:

* If the JavaScript is [render-blocking][crp], the browser must
  download, parse, compile, and evaluate the script before it can proceed
  with all of the other work that's needed for rendering the page.
* Even if the JavaScript is asynchronous (i.e. not render-blocking), the
  code competes for bandwidth with other resources while it's downloading,
  which has significant performance implications. Sending unused code over
  the network is also wasteful for mobile users who don't have unlimited
  data plans.


## How the unused JavaScript audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags every JavaScript file with more than 20 kibibytes of unused code:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jYbX7CFrcOaaqMHaHa6f.jpg", alt="A screenshot of the audit.", width="800", height="332", class="w-screenshot" %}
  <figcaption class="w-figcaption">
    Click a value in the <b>URL</b> column to open the script's
    source code in a new tab.
  </figcaption>
</figure>


{% include 'content/lighthouse-performance/scoring.njk' %}

## How to remove unused JavaScript

### Detect unused JavaScript

The [Coverage tab][coveragetab] in Chrome DevTools can give you a line-by-line
breakdown of unused code.

The [`Coverage`][coverageclass] class in Puppeteer can help you automate the
process of detecting unused code and extracting used code.

### Build tool for support for removing unused code

Check out the following [Tooling.Report][tr] tests to find out if your bundler
supports features that make it easier to avoid or remove unused code:

* [Code Splitting][split]
* [Unused Code Elimination][eliminate]
* [Unused Imported Code][import]

## Stack-specific guidance

### Angular

If you are using Angular CLI, include source maps in your production build to
[inspect your bundles](https://angular.io/guide/deployment#inspect-the-bundles).

### Drupal

Consider removing unused JavaScript assets and only attach the needed Drupal
libraries to the relevant page or component in a page. See the [Defining a
library](https://www.drupal.org/docs/8/creating-custom-modules/adding-stylesheets-css-and-javascript-js-to-a-drupal-8-module#library)
for details.

### Joomla

Consider reducing, or switching, the number of [Joomla
extensions](https://extensions.joomla.org/) loading unused JavaScript in your
page.

### Magento

Disable Magento's built-in [JavaScript
bundling](https://devdocs.magento.com/guides/v2.3/frontend-dev-guide/themes/js-bundling.html).

### React

If you are not server-side rendering, [split your JavaScript
bundles](/code-splitting-suspense/) with `React.lazy()`.
Otherwise, code-split using a third-party library such as
[loadable-components](https://www.smooth-code.com/open-source/loadable-components/docs/getting-started/).

### WordPress

Consider reducing, or switching, the number of [WordPress
plugins](https://wordpress.org/plugins/) loading unused JavaScript in your page.

## Resources

* [Source code for the **Remove unused code** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/unused-javascript.js)
* [Remove unused code](/remove-unused-code/)
* [Adding interactivity with JavaScript][crp]
* [Code Splitting][split]
* [Dead Code Elimination][eliminate]
* [Dead Imported Code][import]
* [Find Unused JavaScript And CSS Code With The Coverage Tab In Chrome DevTools][coveragetab]
* [class: `Coverage`][coverageclass]

[crp]: https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript
[coveragetab]: https://developers.google.com/web/tools/chrome-devtools/coverage
[coverageclass]: https://pptr.dev/#?product=Puppeteer&version=v4.0.0&show=api-class-coverage
[split]: https://bundlers.tooling.report/code-splitting/
[eliminate]: https://bundlers.tooling.report/transformations/dead-code/
[import]: https://bundlers.tooling.report/transformations/dead-code-dynamic/
[tr]: https://tooling.report
