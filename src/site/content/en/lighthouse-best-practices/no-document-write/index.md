---
layout: post
title: Uses document.write()
description: |
  Learn how to speed up your page's load time by avoiding  document.write().
web_lighthouse:
  - no-document-write
date: 2019-05-02
updated: 2020-06-04
---

Using [`document.write()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/write)
can delay the display of page content by tens of seconds
and is particularly problematic for users on slow connections.
Chrome therefore blocks the execution of `document.write()` in many cases,
meaning you can't rely on it.

In the Chrome DevTools Console you'll see the following message when you use `document.write()`:

```text
[Violation] Avoid using document.write().
```

In the Firefox DevTools Console you'll see this message:

```text
An unbalanced tree was written using document.write() causing
data from the network to be reparsed.
```

## How the Lighthouse `document.write()` audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags
calls to `document.write()` that weren't blocked by Chrome:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5YbEaKuzO2kzulClv1qj.png", alt="Lighthouse audit showing usage of document.write", width="800", height="213", class="w-screenshot" %}
</figure>

For the most problematic uses,
Chrome will either block calls to `document.write()`
or emit a console warning about them, depending on the user's connection speed.
Either way, the affected calls appear in the DevTools Console.
See Google's [Intervening against `document.write()`](https://developers.google.com/web/updates/2016/08/removing-document-write)
article for more information.

Lighthouse reports any remaining calls to `document.write()`
because it adversely affects performance no matter how it's used,
and there are better alternatives.


{% include 'content/lighthouse-best-practices/scoring.njk' %}

## Avoid `document.write()`

Remove all uses of `document.write()` in your code. If it's being used
to inject third-party scripts, try using
[asynchronous loading](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript#parser_blocking_versus_asynchronous_javascript)
instead.

If third-party code is using `document.write()`,
ask the provider to support asynchronous loading.

## Resources

- [Source code for **Uses `document.write()`** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/dobetterweb/no-document-write.js)
- [Intervening against `document.write()`](https://developers.google.com/web/updates/2016/08/removing-document-write)
- [Parser blocking versus asynchronous JavaScript](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/adding-interactivity-with-javascript#parser_blocking_versus_asynchronous_javascript)
- [Speculative parsing](https://developer.mozilla.org/en-US/docs/Glossary/speculative_parsing)