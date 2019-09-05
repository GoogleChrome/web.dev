---
layout: post
title: Uses document.write()
description: |
  Learn how to speed up your page's load time by avoiding  document.write().
web_lighthouse:
  - no-document-write
updated: 2019-08-28
---

For users on slow connections,
such as 2G, 3G, or slow Wi-Fi,
third-party scripts dynamically injected via `document.write()`
can delay the display of main page content by tens of seconds.
Chrome therefore blocks the execution of these scripts.

## How the Lighthouse `document.write()` audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags
every instance of `document.write()` it encounters:

<figure class="w-figure">
  <img class="w-screenshot" src="no-document-write.png" alt="Lighthouse audit showing usage of document.write">
</figure>

Lighthouse reports calls to `document.write()` because it's often used to inject
third-party render-blocking scripts. Chrome won't execute such scripts
when all the following conditions are met:
- The user is on a slow connection.
- The call to `document.write()` is in a top-level document.
- The script in the `document.write()` call is render-blocking. (Scripts with the `async` or `defer` attributes will still execute.)
- The script is not hosted on the same site.
- The script is not already in the browser HTTP cache.
- The page request isn't a reload.

See Google's [Intervening against `document.write()`](https://developers.google.com/web/updates/2016/08/removing-document-write)
article for more information.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Avoid `document.write()`

Review the uses of `document.write()` in your code. If it's being used
to inject third-party scripts, try using
[asynchronous loading](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript#parser_blocking_versus_asynchronous_javascript)
instead.

If the third-party code itself is using `document.write()`,
there are a couple approaches to try:
- Add an `async` attribute to the script element.
- Add the script element using DOM APIs
  like `document.appendChild()` or `parentNode.insertBefore()`.

If neither approach works for your case,
ask your third-party service provider to support asynchronous loading.

## Resources

- [Source code for **Uses `document.write()`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/no-document-write.js)
- [Intervening against `document.write()`](https://developers.google.com/web/updates/2016/08/removing-document-write)
- [Parser blocking versus asynchronous JavaScript](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript#parser_blocking_versus_asynchronous_javascript)
