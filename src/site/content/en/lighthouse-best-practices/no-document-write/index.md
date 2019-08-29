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
external scripts dynamically injected via `document.write()`
can delay the display of main page content by tens of seconds.

## How this audit fails

Lighthouse lists all calls to `document.write()`:

<figure class="w-figure">
  <img class="w-screenshot" src="no-document-write.png" alt="Lighthouse audit showing usage of document.write">
</figure>

See [Intervening against `document.write()`](https://developers.google.com/web/updates/2016/08/removing-document-write)
to learn more.

Lighthouse reports every instance of `document.write()` that it encounters.
Chrome's intervention against `document.write()` only applies
to render-blocking, dynamically-injected scripts.
Other uses of `document.write()` may be acceptable.

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Avoid `document.write()`

Review the usage of `document.write()`.
If the script meets the criteria outlined in the introduction to
[Intervening against `document.write()`](https://developers.google.com/web/updates/2016/08/removing-document-write),
Chrome won't execute the injected script.
These are the calls to `document.write()` that you want to change.

See [How do I fix this?](https://developers.google.com/web/updates/2016/08/removing-document-write#how_do_i_fix_this) for possible solutions.

## Resources

[Source code for **Uses `document.write()`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/no-document-write.js)
