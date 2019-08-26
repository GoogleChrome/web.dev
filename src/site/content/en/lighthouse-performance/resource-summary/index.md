---
layout: post
title: Keep request counts low and transfer sizes small
description: |
  TODO
updated: 2019-08-23
web_lighthouse:
  - resource-summary
---

The **Keep request counts low and transfer sizes small** audit tells you how many network requests 
your page made while it loaded, as well as the total transfer size of all of those network requests:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="font-display.png" 
       alt="Keep request counts low and transfer sizes small">
  <figcaption class="w-figcaption">
    <b>Keep request counts low and transfer sizes small</b>
  </figcaption>
</figure>

## How the Lighthouse title audit fails

Lighthouse flags pages without a `<title>` element in the page's `<head>`:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot" src="document-title.png" alt="Lighthouse audit showing HTML document doesn't have a title elemement">
</figure>

## How to add a title



## Resources

- [Source code](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/resource-summary.js)