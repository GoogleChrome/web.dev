---
layout: post
title: "Baseline"
subhead: |
  Web Platform Baseline brings clarity to information about browser support for web platform features.
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/Gv27TPZQF9EPSZIDmpHZ.png
thumbnail: image/kheDArv5csY6rvQUJDbWRscckLr1/0VOcvycql3S9d7wFy6Zv.png
alt: The Baseline icon for supported features which includes a green check.
date: 2023-05-10
description: |
  Web Platform Baseline brings clarity to information about browser support for web platform features.
tags:
  - baseline
---

Web Platform Baseline gives you clear information about which web platform features are safe to use in your projects today. When reading an article, or choosing a library for your project, if the features used are all part of Baseline, you can trust the level of browser compatibility. By aligning with Baseline, there should be no surprises when testing your site.

Baseline is rolling out on MDN, web.dev, and we will be providing the tools for you to show that features described in an article or library are all in Baseline.

<figure>
{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/LdeGG4Edq2Q7TRfovzIz.png", alt="A screenshot of the page for the CSS grid property on MDN. The green checkmark for Baseline shows this feature is supported.", width="800", height="503" %}
    <figcaption>Baseline on MDN.</figcaption>
</figure>

Baseline makes target browser support easy to understand for all your stakeholders and team members. 

- When planning a project, rather than needing to list specific browser versions, you can set a requirement to use features that are part of Baseline.
- When publishing a library, you can help potential users understand support of features used (and therefore whether it is safe to use on their site) by declaring support for Baseline.
- When writing a tutorial, you can tell readers that everything described is in Baseline. Your reader then knows this is a solution they can incorporate into a project.

Features become part of Baseline when they are supported in the current and previous version of all major browsers—Chrome, Edge, Firefox, and Safari. Targeting Baseline helps prevent your site requirements becoming stuck in the past. When adding features, you can take advantage of new things that have become part of Baseline, maintaining the same level of support for your users. 

## Working with our partners at other browsers

The Chrome team wants to improve the experience of developers, and we know how important it is that your sites and applications work well in all browsers. To improve interoperability we have been collaborating with Apple, Microsoft and Mozilla, along with other partners in Interop 2022 and Interop 2023. 

As there will always be some gap between features being available in all browsers, we proposed the idea of creating a known set of safe features to the [Web DX Community Group](https://www.w3.org/blog/2022/11/webdx-improving-the-experience-for-web-developers/). This idea became Baseline, a way to identify which features work well across all engines, a way to make support in a multi-engine world clear.

## Baseline 2024

Baseline will move as more features become interoperable, however we think there is value in understanding the featureset of the web at a point in time. Therefore, once a year we will publish the Baseline set of the year, later this year you’ll be able to see what’s in Baseline 2024. This means if you want a non-moving target you can target the yearly release. You’ll also be able to compare year on year, how the web platform has changed.  

## Get involved

Baseline is developed as part of the [Feature Set project](https://github.com/web-platform-dx/feature-set), a community-driven project that aims to provide a comprehensive and up-to-date set of grouped web platform features. Anyone can contribute to Baseline by adding new features, reviewing existing features, or providing feedback as issues on that repository.

If you are a library or tool author, we'll be making it easy to show support. Coming soon, we'll provide ways to show that your library or tool is compatible with Baseline. The widget can be displayed on Github and will link to the Baseline website. Watch this page for updates.

## Find out more

- [Introducing Baseline](/introducing-baseline/)
- [Baseline features you can use today](/baseline-features/)
- [Introducing Baseline: a unified view of stable web features](https://developer.mozilla.org/en-US/blog/baseline-unified-view-stable-web-features/)
