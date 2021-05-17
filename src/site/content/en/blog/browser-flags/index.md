---
layout: post
title: How to set browser flags in Chromium
subhead: |
  For some of the new APIs we introduce in Chromium, you need to set a browser flag.
  This article explains how to do this in the various Chromium derivatives like Google Chrome, Microsoft Edge, and others.
authors:
  - thomassteiner
date: 2021-05-17
description: |
  For some of the new APIs we introduce in Chromium, you need to set a browser flag.
  This article explains how to do this in the various Chromium derivatives like Google Chrome, Microsoft Edge, and others.
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/NcSd5vAM9zMrbQqwVZhl.jpg
alt: Various party flags.
tags:
  - blog # blog is a required tag for the article to show up in the blog.
  - capabilities
---

[Chromium](https://www.chromium.org/) is an open-source browser project that aims to build a safer,
faster, and more stable way for all users to experience the web. A lot of web browsers are built on
Chromium, including the popular browsers [Google Chrome](https://www.google.com/chrome/) by
[Google](https://www.google.com/), [Microsoft Edge](https://www.microsoft.com/en-us/edge) by
[Microsoft](https://www.microsoft.com/), [Opera Web Browser](https://www.opera.com/) by
[Opera](https://www.opera.com/about), and
[many others](<https://en.wikipedia.org/wiki/Chromium_(web_browser)#Browsers_based_on_Chromium>).

## The `chrome://` scheme

Google Chrome has since the beginning supported a special scheme called `chrome://` for accessing
browser-internal settings or features. You can see the (almost) full list by putting
`chrome://chrome-urls` into the URL bar. The most common such special URL is `chrome://flags`.

## Setting browser flags

For some of the [new APIs](/tags/capabilities/) we introduce in Chromium, you need to set a browser flag.
You guessed it, `chrome://flags` is where this happens. The most popular flag we ask you to set is
`chrome://flags/#enable-experimental-web-platform-features`, which, as the name suggests, enables
experimental web platform features.

{% Aside 'warning' %} As the name suggests, experimental web platform features are _experimental_.
We do not recommend you set flags on your daily production browser. Instead, we prefer you to use a
development browser version like the Beta, Dev, or Canary channel for your development needs where
you can set flags as needed, and the Stable channel for everything else. {% endAside %}

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/vtpmqTzfmsru5ZhxNuGt.png", alt="Toggling the 'experimental web platform features' flag.", width="800", height="125" %}

{% Aside 'key-term' %} Browser flags are distinct from [origin trials](/origin-trials/).

Origin trials are set by website owners and opt in your local browser to a given feature. Only
features deemed safe for testing with real users are available for origin trials.

Browser flags are set by you and opt in your local browser to a given feature. Not all features that
are available behind a flag are ready for prime time. {% endAside %}

## Scheme rewrites

Something interesting happens, though, if you enter a `chrome://` URL into a browser that is not
Chrome. For example, if you enter `chrome://flags/#enable-experimental-web-platform-features` into
Microsoft Edge, you will notice that it gets rewritten as
`edge://flags/#enable-experimental-web-platform-features`. All vendors have created this rewrite
mechanism, which makes sense, as Edge is not Chrome, albeit is based on Chromium.

## Inclusive documentation

We strive for making our documentation inclusive of different browsers, so, for example, telling a
[Brave](https://brave.com/) user to navigate to `chrome://flags` to toggle a given flag—while it
works thanks to the rewrite mechanism—may not be the most welcoming experience. At the same time,
listing all possible vendor schemes like `edge://`, `chrome://`, `brave://`, etc. is not a great
solution either.

## One scheme to rule them all

Luckily there is a hidden champion scheme that fits all our needs: `about://`. In Chrome, `about://`
URLs get rewritten to `chrome://`, in Edge to `edge://`, and so on for all vendors. We are in this
web thing together, and this is `about://` all of us! Whenever you see instructions that include the
`about://` scheme, your Chromium browser of choice will do the right thing.

## Acknowledgements

Hero image by [Photos by Lanty](https://unsplash.com/@photos_by_lanty) on
[Unsplash](https://unsplash.com/s/photos/flags).
