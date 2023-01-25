---
layout: post
title: Everything announced at Chrome Dev Summit 2021
subhead: A roundup of all the key announcements from the 2021 Chrome Dev Summit, with the links you need to find out more.
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/gK7MVviHglsjJNEDG6Au.png
alt: Chrome Dev Summit 2021
authors:
  - rachelandrew
description: >
  A roundup of all the key announcements from the 2021 Chrome Dev Summit, with the links you need to find out more.
date: 2021-11-03
tags:
  - blog
---

{% YouTube "n57U2_-3NLQ" %}

This post rounds up all the key announcements from the 2021 Chrome Dev Summit, with the links you need to find out more.

## Make the web more interoperable

Web compatibility is one of the biggest challenges for web developers,
and so Google has been working with other browser vendors to fix the top five compatibility pain points:
[flexbox](/learn/css/flexbox/),
[grid](/learn/css/grid/),
`position: sticky`,
[`aspect-ratio`](/aspect-ratio/),
and [transforms](/learn/css/transitions/#transform).

The work has already led to improvements in these key areas.
You can read about those in the [Compat 2021 mid-year update](/compat2021-midyear/).

{% Aside %}
The Microsoft Edge team took on the work of rewriting CSS grid layout as part of the Compat 2021 effort.
You can read about their work in the post
[Compat2021: Improving CSS Grid compatibility with GridNG](https://blogs.windows.com/msedgedev/2021/08/10/compat2021-css-grid-gridng/).
{% endAside %}

## Allow new classes of applications to run on the web

[Project Fugu](https://developer.chrome.com/blog/fugu-status/) is an effort that aims to allow new classes of applications to the web.
You can keep up to date with progress on the Fugu APIs at [fugu-tracker.web.app](https://fugu-tracker.web.app/).

Adobe recently announced that they are bringing Photoshop to the web,
a feat made possible by collaboration between Adobe, Google, and web standards organizations.
Find out more in the post [Photoshop's journey to the web](/ps-on-the-web/).

## Ensure privacy

Many common web functions rely on third-party cookies and other cross-site tracking mechanisms that weren’t designed with privacy in mind, making it difficult for developers to meet the growing need for privacy.

We are working with the web community and industry stakeholders to develop new privacy-preserving technologies to support the ecosystem,
with the aim to phase out third-party cookies and reduce covert tracking and browser fingerprinting.

Find out about this work on the [Privacy Sandbox](https://privacysandbox.com/) site.
We also have [information and guides to the proposals for developers](https://developer.chrome.com/docs/privacy-sandbox/),
a [monthly update or changes and progress](https://developer.chrome.com/tags/progress-in-the-privacy-sandbox/),
and information on the timeline and testing details for [changes to the user-agent string](https://goo.gle/user-agent-reduction).

## Improve Core Web Vitals

We've been working with the developers of popular JavaScript frameworks to improve Core Web Vitals,
and as part of that work have identified two new metrics that we'd love your feedback on.
Read about [overall responsiveness](/responsiveness/) and
[smoothness](/smoothness/), then let us know what you think.

{% Aside %}
You can find out more on our collaboration with JavaScript frameworks in our post
[Introducing Aurora](/introducing-aurora/).
{% endAside %}

Also announced is an updated version of [PageSpeed Insights](/whats-new-pagespeed-insights/),
a new [Recorder Panel for Chrome DevTools](https://developer.chrome.com/docs/devtools/recorder/), currently available in Canary,
and a new [user flow API for Lighthouse](/lighthouse-user-flows/).


## Enable new web platform features

RenderingNG is an ambitious refactoring of Chromium's rendering engine,
a project that is fixing long standing bugs in Chrome, and also unlocking new features.
This includes one feature that has been the top request from web developers for many years—[container queries](https://developer.mozilla.org/docs/Web/CSS/CSS_Container_Queries).

Container queries look familiar to anyone who has ever used a media query to create a responsive design.
However, inside of querying the viewport size, they allow you to query the size of the container your component is in.
Google has been working on a trial implementation of the emerging specification, behind the `#enable-container-queries` flag in Chrome.

Read a blog post covering
[RenderingNG in detail](https://developer.chrome.com/blog/renderingng/),
or watch [this video](https://www.youtube.com/watch?v=sUbJPHYKZkU)
to get all the key details of how this work unlocks implementation of features that were once thought impossible to land.

## Help you to create beautiful and responsive sites

The [new responsive design](/new-responsive/) is so much more than just screen—or container—size.
You can learn how to create modern responsive sites in our course
[Learn Design](/learn/design/).
The first five modules launch today, the rest will be posted over the coming weeks.

New CSS properties have landed in Chrome and other browsers this year to make creating beautiful experiences easier.
Find out more about [`accent-color`](/accent-color/) and [`size-adjust`](/css-size-adjust/).

To help you quickly take advantage of new CSS, we have launched a set of [layout patterns](/patterns/layout/).
These will give you a robust starting point for many common interface patterns.

## Provide courses to help you learn web technology

In addition to Learn Design, we are launching new modules for [Learn CSS](/learn/css/),
our comprehensive CSS course launched earlier this year.

We have also developed a complete course helping you to design functional and accessible forms—[Learn Forms](/learn/forms/).
Along with these courses, you can find the first few modules of [Learn PWA](/learn/pwa/).
