---
layout: post
title: Remove unused JavaScript
description: |
  Learn how to pass Lighthouse's "Remove unused JavaScript" audit.
web_lighthouse:
  - unused-javascript
date: 2020-06-17
---

Unused JavaScript can slow down your page speed if the JavaScript is
[render-blocking][crp]. When the browser encounters a render-blocking script,
it has to download, parse, compile, and evaluate the script before it
can proceed with all of the other work that's needed for rendering the page.

{% Aside %}
  Since the JavaScript code that Lighthouse flags in this audit is unused,
  there is no evaluation cost. However, there are download, parse, and compilation
  costs.
{% endAside %}

Even if the unused JavaScript is not render-blocking, sending unused code over
the network is always a waste of bandwidth, which is especially important
for mobile users that don't have unlimited data plans.

## How the unused JavaScript audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/)
flags every JavaScript file with more than 20 kilobytes of unused code:

<figure class="w-figure">
  <img class="w-screenshot" src="remove-unused-javascript.jpg"
       alt="A screenshot of the audit.">
</figure>

Click a value in the **URL** column to open the script's source code
in a new tab.

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
* [Dead Code Elimination][eliminate]
* [Dead Imported Code][import]

## Resources

* [Source code for the **Remove unused code** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/byte-efficiency/unused-javascript.js)
* [Adding interactivity with JavaScript][crp]
* [Remove unused code](/remove-unused-code/)
* [Code Splitting][split]
* [Dead Code Elimination][eliminate]
* [Dead Imported Code][import]
* [Find Unused JavaScript And CSS Code With The Coverage Tab In Chrome DevTools][coveragetab]
* [`Coverage`][coverageclass]

[crp]: https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript
[coveragetab]: https://developers.google.com/web/tools/chrome-devtools/coverage
[coverageclass]: https://pptr.dev/#?product=Puppeteer&version=v4.0.0&show=api-class-coverage
[split]: https://bundlers.tooling.report/code-splitting/
[eliminate]: https://bundlers.tooling.report/transformations/dead-code/
[import]: https://bundlers.tooling.report/transformations/dead-code-dynamic/
[tr]: https://tooling.report