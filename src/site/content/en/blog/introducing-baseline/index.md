---
layout: post
title: "Introducing Baseline"
subhead: >
  At Google I/O 2023 we announced Baseline, learn more about this initiative and why we think it's important.
description: >
  At Google I/O 2023 we announced Baseline, learn more about this initiative and why we think it's important.
date: 2023-05-10
hero: 'image/kheDArv5csY6rvQUJDbWRscckLr1/Gv27TPZQF9EPSZIDmpHZ.png'
alt: The Baseline supported icon and the wordmark.
thumbnail: image/kheDArv5csY6rvQUJDbWRscckLr1/j1MZvXQ8fY232Q1z5El0.png
authors:
  - rachelandrew
tags:
  - blog
---

Baseline helps you to see, at a glance, whether a feature or API is safe to use in your site or web applications. In this post, learn about the ideas that led to this concept, and how we hope it will help you.

{% YouTube "eZa3BgGaAeA" %}

## Keeping up with changes to the web platform

The web of today changes rapidly. Our browsers are _evergreen_, with new features landing in stable browsers each month. This is exciting, however it also poses problems. How do web developers keep up with all of this change? How do you know when it's safe to use a feature? When is it the right time to start to learn, and to invest in new features? 

In the past, we often explained browser support to stakeholders by tying it to a certain browser release (for example, Internet Explorer 11) because the line in the sand a non-evergreen browser created was clear to everyone. Today, the landscape can often seem less clear, with so many features landing it's a lot of work to check support for everything we use.

We know how much of a problem this is to developers, because you have consistently [told us that it's a problem](/deep-dive-into-developer-pain-points/). Over two years ago we decided it was a problem we wanted to try to address.

## Getting our own house in order

We recognized that we were adding to confusion about the status of features, mixing experimental things in with stable content on our sites. So, we've improved the clarity of our own communication channels. We now use web.dev to publish content about the stable web, those things that we can now describe as part of Baseline, and those that are very close to that status. We also highlight the work of other browsers, as we all work together to improve the interoperability of the platform.

On web.dev you'll find content such as the [newly interoperable](/tags/newly-interoperable/) series, celebrating features that are now supported in all three major engines. We also have our monthly series, covering [what's new to the web platform](/tags/new-to-the-web/) sharing the work of all browsers, and updates about Interop 2023. This site is also home to our best practices guidance in subjects such as performance, accessibility, and fundamental web development skills. 

On [developer.chrome.com](https://developer.chrome.com) you can learn about the new things that Chrome is bringing to the web platform. Some of these things are experimental, or only in Chrome right now. Many of the things we post about on developer.chrome.com are coming to other browsers, and we hope to celebrate their interoperable moments very soon, but we want you to have clarity about their status and browser support.

We have also been adding clear browser support information to everything that we publish, and when our team talks about features at conferences.

Documentation is really important for adoption of new features, and this year we've made sure that the new features we are landing in Chrome have documentation over on MDN. For example, take a look at the documentation for [View Transitions](https://developer.mozilla.org/docs/Web/API/View_Transitions_API) and [WebGPU](https://developer.mozilla.org/docs/Web/API/WebGPU_API). We also help support [Open Web Docs](https://openwebdocs.org/) who contribute documentation for the entire web platform to MDN. 

## Working with others

Improving what we do was important, however to address the bigger issue we needed to work with others. We've been successfully working with our partners at other browser vendors and related companies through [Interop 2022](/interop-2022-wrapup/) and [2023](/interop-2023/). Forming the [WebDX Community Group](https://www.w3.org/community/webdx/) brought everyone together to think about this issue of clarity across the platform as a whole.

The group is working together on a [feature set](https://github.com/web-platform-dx/feature-set), a way to group web platform features to show their support status, and this feature-set is key to the concept of Baseline. 

## Creating platform-wide clarity with Baseline

[Baseline](/baseline) is the line in the sand that is hard to identify in a world of evergreen browsers. Everything that is fully supported in the most recent two versions of major browsers will be part of Baseline. Therefore if your library states that all features used are part of Baseline, developers know what you mean. When creating a proposal for a new application, you can explain to stakeholders that browser support will be tied to Baseline, thus creating clarity for everyone as to levels of support. 

From today you will start to see Baseline appearing on pages [on MDN](https://developer.mozilla.org/docs/Web/CSS/grid), and on [web.dev](/baseline-features/).

As Baseline will be a continuously moving line, with new features becoming part of that set each month, every year we will publish a cut of features that are part of Baseline at one moment in time. For extra clarity, you can tie support to Baseline 24, for example.

{% Aside %}
We're also quite excited by the ability to compare year-on-year what Baseline looks like. What will have changed between Baseline 24 and Baseline 25? That will be interesting to see.
{% endAside %}

## What's next?

We'll be continuing the rollout of Baseline across web.dev. When reading an article or tutorial, you'll be able to see when the features described are part of Baseline. You won't get part of the way through something and realize it uses something that doesn't have good browser support.

We'll be providing widgets that you can use on your own articles or libraries, indicating support for the Baseline feature set.

We'll also be working to ensure that new features we are landing in Chrome become part of Baseline as quickly as possible. Watch out for future posts where we'll talk more about that work.

And we'll be gathering feedback from developers to find out how this idea is working in practice, and what more you would like to see. Keep an eye on the [Baseline page](/baseline/), or offer feedback right now via the [WebDX Community Group](https://www.w3.org/community/webdx/).
