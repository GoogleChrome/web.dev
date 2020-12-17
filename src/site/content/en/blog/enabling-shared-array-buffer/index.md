---
layout: post
title: Enabling Shared Array Buffer
authors:
  - jakearchibald
description: >
  Browsers are imposing new requirements on SharedArrayBuffer usage. Learn how to enable it cross-browser and cross-platform.
origin_trial:
  url: https://developers.chrome.com/origintrials/#/view_trial/303992974847508481
date: 2020-12-17
updated: 2020-12-17
hero: hero.jpg
alt: Iframes, images, and windows being accessed by someone 'evil'
tags:
  - blog
  - javascript
  - shared array buffer
  - coop
  - coep
  - spectre
  - meltdown
  - security
feedback:
  - api
---

It's fair to say `SharedArrayBuffer` has had a bit of a rough landing on the web, but things are settling down. Here's what you need to know:

## In brief

- `SharedArrayBuffer` is supported in Firefox 79+, and will arrive in Android Chrome 88. However, it's only available to page that are 'cross-origin isolated' (details below).
- `SharedArrayBuffer` is currently available in desktop Chrome, but from Chrome 91 it will be limited to cross-origin isolated pages.

You can make a page _cross-origin isolated_ by serving the page with these headers:

```http
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```

Once you do this, your page will not be able to load cross-origin content unless the [`Cross-Origin-Resource-Policy` header](<https://developer.mozilla.org/en-US/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP)>) allows it, or via the existing [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) dance that you know and love (`Access-Control-Allow-*` headers and so forth).

There's also a [reporting API](/coop-coep/#observe-issues-using-the-reporting-api), so you can gather data on requests that failed as a result of Cross-Origin-Embedder-Policy and Cross-Origin-Opener-Policy.

If you don't think you can make these changes in time for Chrome 91, you can [register for an origin trial](#register-for-ot) to retain current desktop Chrome behavior until Chrome 93.

More info on:

- [How to cross-origin isolate your pages](/coop-coep/).
- [Why cross-origin isolation is needed](/why-coop-coep/).

## How did we get here?

`SharedArrayBuffer` arrived in Chrome 60 (that's July 2017, for those of you who think of time in dates rather than Chrome versions), and everything was great. For 6 months.

In January 2018 a vulnerability was revealed in some popular CPUs. [See the announcement](https://googleprojectzero.blogspot.com/2018/01/reading-privileged-memory-with-side.html) for full details, but it essentially meant that code could use high resolution timers to read memory that it shouldn't have access to.

This was a problem for us browser vendors, as we want to allow sites to execute code in the form of JavaScript and WASM, but strictly control the memory this code can access. If you arrive on my website, I shouldn't be able to read anything from the internet banking site you also have open. In fact, I shouldn't even know you have your internet banking site open. These are fundamentals of web security.

To mitigate this, we reduced the resolution of our high resolution timers such as `performance.now()`. However, you can _create_ a high resolution timer using `SharedArrayBuffer` by modifying memory in a tight loop in a worker, and reading it back in another thread. This couldn't be effectively mitigated without heavily impacting well-intentioned code, so `SharedArrayBuffer` was disabled altogether.

A general mitigation is to ensure a webpage's system process doesn't contain sensitive data from elsewhere. Chrome had invested in a multiprocess architecture from the start ([remember the comic?](https://www.google.com/googlebooks/chrome/big_00.html)), but there were still cases where data from multiple sites could end up in the same process:

```html
<iframe src="https://your-bank.example/balance.json"></iframe>
<script src="https://your-bank.example/balance.json"></script>
<link rel="stylesheet" href="https://your-bank.example/balance.json" />
<img src="https://your-bank.example/balance.json" />
<video src="https://your-bank.example/balance.json"></video>
<!-- …and more… -->
```

These APIs have a 'legacy' behavior that allows content from other origins to be used without opt-in from the other origin. These requests are made with the cookies of the other origin, so it's a full 'logged in' request. Nowadays, new APIs require the other origin to opt-in using [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

We worked around these legacy APIs by preventing content from entering the webpage's process if it looked 'incorrect', and called it [cross-origin read blocking](https://developers.google.com/web/updates/2018/07/site-isolation#corb). So, in the above cases, we wouldn't allow JSON to enter the process, as it isn't a valid format for any of those APIs. That is, except iframes. For iframes we put the content in a different process.

With these mitigations in place, we reintroduced `SharedArrayBuffer` in Chrome 68 (July 2018), but only on desktop. The extra process requirements meant we couldn't do the same on mobile devices. It was also noted that Chrome's solution was incomplete, as we were only blocking 'incorrect' data formats, whereas it's possible (although unusual) that valid CSS/JS/images at guessable URLs can contain private data.

Web standards folks got together to come up with a more complete cross-browser solution. The solution was to give pages a way to say "I hereby relinquish my ability to bring other-origin content into this process without their opt-in". This declaration is done via [COOP and COEP headers](/coop-coep/) served with the page. The browser enforces that, and in exchange the page gains access to `SharedArrayBuffer` and other APIs with similar powers. Other origins can opt-in to content embedding via [`Cross-Origin-Resource-Policy`](<https://developer.mozilla.org/en-US/docs/Web/HTTP/Cross-Origin_Resource_Policy_(CORP)>) or [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).

Firefox was the first to ship `SharedArrayBuffer` with this restriction, in version 79 (July 2020).

Then, in December 2020, I wrote this article, and you read it. Hello.

And that's where we are now. Chrome 88 brings `SharedArrayBuffer` back to Android for pages that are cross-origin isolated, and Chrome 91 brings the same requirements to desktop, both for consistency, and to achieve total cross-origin isolation.

## Delaying the desktop Chrome change {: #register-for-ot }

This is a temporary exception in the form of an 'origin trial' that gives folks more time to implement cross-origin isolated pages. It enables `SharedArrayBuffer` without requiring the page to be cross-origin isolated. The exception expires in Chrome 93, and the exception only applies to desktop Chrome.

{% include 'content/origin-trial-register.njk' %}

## Further reading

- [How to cross-origin isolate your pages](/coop-coep/).
- [Why cross-origin isolation is needed](/why-coop-coep/).
