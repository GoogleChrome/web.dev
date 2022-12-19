---
layout: post
title: "Interop 2022: end of year update"
description: >
  Discover just some of the features that have become interoperable during 2022.
subhead: >
  Discover just some of the features that have become interoperable during 2022.
authors:
  - rachelandrew
hero: "image/kheDArv5csY6rvQUJDbWRscckLr1/wwRUKgVGHB1Tz6FGzPZy.jpg"
alt: "Hands holding sparklers."
date: 2022-12-19
tags:
  - blog
  - css
---

We've reached the end of another year, and it's time to look at the improvements made by browsers as we work together to improve the interoperability of the web platform. You can check out how things started in [our post in March this year](/interop-2022/), as the initiative was launched.

<figure>
  {% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/s0O6F22XtjN6K9x9NLDs.png", alt="Scores showing Chrome and Edge Dev on 71, Firefox Nightly on 74, Safari Technology Preview on 73.", width="800", height="372" %}
  <figcaption>The scores for experimental browsers in March 2022.</figcaption>
</figure>

The overall scores at the end of the year show a great improvement across all engines.

<figure>

  {% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/bNJOIpIdpPbN4AFnrcQA.png", alt="Scores showing Chrome and Edge Dev on 90, Firefox Nightly on 89, Safari Technology Preview on 94.", width="800", height="391" %}
  <figcaption>The scores for experimental browsers in December 2022.</figcaption>
</figure>

In this post, learn about the progress made during 2022. In addition to these headline features, there were many smaller improvements made by all engines. Small issues that can cause inconsistencies between engines and trip you up during development, have been fixed. Seeing [big features available cross-browser](/tags/newly-interoperable/) is definitely exciting, but it's sometimes the small things that cause the most problems, and it's great to see how much has been improved.

{% Aside %}
[Explore the tests](https://wpt.fyi/results/?view=subtest&q=%28label%3Ainterop-2021-aspect-ratio%20or%20label%3Ainterop-2021-flexbox%20or%20label%3Ainterop-2021-grid%20or%20label%3Ainterop-2021-position-sticky%20or%20label%3Ainterop-2021-transforms%20or%20label%3Ainterop-2022-cascade%20or%20label%3Ainterop-2022-color%20or%20label%3Ainterop-2022-contain%20or%20label%3Ainterop-2022-dialog%20or%20label%3Ainterop-2022-forms%20or%20label%3Ainterop-2022-scrolling%20or%20label%3Ainterop-2022-subgrid%20or%20label%3Ainterop-2022-text%20or%20label%3Ainterop-2022-viewport%20or%20label%3Ainterop-2022-webcompat%29%20exists%28status%3A%21pass%29%20seq%28status%3A%21missing%20status%3A%21missing%20status%3A%21missing%20status%3Apass%20status%3Apass%20status%3Apass%29&run_id=5694898400395264&run_id=5671385434161152&run_id=5747379813744640&run_id=4818947338141696&run_id=4882567984054272&run_id=5158468428759040) that failed in at least one browser at the start of the year and now pass in all engines. Note that this link may be a little unreliable, try reloading if it's not working for you.
{% endAside %}

## Cascade layers

[Cascade layers](https://developer.mozilla.org//docs/Learn/CSS/Building_blocks/Cascade_layers) let you manage the cascade by grouping selectors into layers. It's the kind of feature that only becomes useful when it is supported everywhere. All major engines now support cascade layers, and the scores across all browsers reflect how interoperable the feature is, with just a few tests left to pass for Firefox.

{% BrowserCompat 'css.at-rules.layer' %}

## The dialog element

[The dialog element](https://developer.mozilla.org/docs/Web/HTML/Element/dialog) allows the creation of modal dialogs. This is a common pattern on the web, and using this element gives you usability and accessibility that you would otherwise have to develop and test when creating your own components. In the article [Building a dialog component](/building-a-dialog-component/), Adam Argyle explains how to build on top of this element to build different types of dialogs.

{% BrowserCompat 'html.elements.dialog' %}

## Subgrid

At the beginning of 2022, the only browser supporting the `subgrid` value for `grid-template-rows` and `grid-template-columns` was Firefox. During 2023 Safari has landed support, and the feature is under development in Chrome. It's going to miss the end of year deadline for interoperability, but it's on the way.

{% BrowserCompat 'css.properties.grid-template-columns.subgrid' %}

## Viewport units

Viewport units are the only feature that has hit 100% of passing tests across all engines. This includes the concepts of the small and large viewport, that accounts for the changing viewport size on mobile as device UI elements appear and disappear. You can find out more about these units in the post [the large, small, and dynamic viewport units](/viewport-units/).

{% BrowserCompat 'css.types.length.viewport_percentage_units_large' %}

## Color 4

This collection of color work enables CSS to not only specify colors in higher definition gamuts (for example, display p3, rec2020), but also provides new color functions that each have unique utilities for working with color. New color spaces are `lch()`, `oklch()`, `lab()`, `oklab()`, `display-p3`, `rec2020`, `a98-rgb`, `prophoto-rgb`, `xyz`, `xyz-d50`, `xzy-d65`: [try these in Canary](https://codepen.io/argyleink/pen/RwyOyeq) today with [this flag enabled](chrome://flags/#enable-experimental-web-platform-features). These changes also apply to gradients, allowing authors to [specify which colorspace their gradients use](https://codepen.io/argyleink/pen/OJObWEW). The same flag also enables [`color-mix()`](https://codepen.io/argyleink/pen/YzLMaor) support, allowing you to mix two colors together in a space of your choice. The color-mix() function is also behind a flag in Safari and Firefox. More colors, better colors, better gradients, and better tools.

## Interop 2023

I hope you'll be happy to know that we aren't intending to stop at the end of 2022, and [Interop 2023](/submit-your-proposals-for-interop-2023/) is already well through the initial planning stage. In the New Year we'll be able to announce the features that have been selected, and look forward to another year of making it easier to develop for the web.

_Hero image by [Ian Schneider](https://unsplash.com/fr/@goian?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)._
