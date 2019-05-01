---
layout: post
title: Avoids `document.write()`
description: |
  Learn about `no-document-write` audit.
author: kaycebasques
web_lighthouse:
  - no-document-write
---

For users on slow connections, such as 2G, 3G, or slow Wi-Fi, external
scripts dynamically injected via `document.write()` can delay the display of
main page content by tens of seconds.

See [Intervening against `document.write()`](https://developers.google.com/web/updates/2016/08/removing-document-write) to learn more.

## Recommendations

In your report, Lighthouse lists out every call to `document.write()`.
Review this list, and note any call that dynamically injects a script.
If the script meets the criteria outlined in the introduction to
[Intervening against `document.write()`](https://developers.google.com/web/updates/2016/08/removing-document-write), Chrome won't execute the
injected script. These are the calls to `document.write()` that you want
to change. See [How do I fix this?](https://developers.google.com/web/updates/2016/08/removing-document-write#how_do_i_fix_this) for possible solutions. 

{% include 'content/lighthouse-best-practices/scoring.njk' %}

## More information

Lighthouse reports every instance of `document.write()` that it encounters.
Note that Chrome's intervention against `document.write()` only applies to
render-blocking, dynamically-injected scripts. Other uses of `document.write()`
may be acceptable.
