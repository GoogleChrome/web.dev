---
layout: post
title: "Interop 2023: continuing to improve the web for developers"
subhead:
    "Again in 2023, all major browser vendors, and other stakeholders, work together to solve the top browsers compatibility issues."
description:
    "Learn more about how all browser vendors, and other stakeholders, have come together to solve the top browsers compatibility issues identified by web developers. Interop 2023 will improve the experience of developing for the web across a number of key areas."
authors:
  - robertnyman
  - foolip
  - rachelandrew
hero: "image/RYmV5NPuMZRoF3PVwIXTUpdYeQ23/NqhNbZwtnkSEgDtlXdHa.jpg"
alt: "A picture of a curved stairway."
date: 2023-02-01
tags:
  - blog
  - css
  - javascript
  - fonts
---

In 2023, all major browser vendors and other stakeholders are again working together to solve the top browser compatibility issues. The effort started on this scale with Interop 2022, and you can learn what we achieved together in the [end-of-year post](/interop-2022-wrapup/). Everyone involved believes this will help improve the experience for web developers everywhere. This year, for the first time, we publicly announced the [proposal process](/submit-your-proposals-for-interop-2023/) and got many great suggestions from frameworks, large companies, browser vendors, and developers everywhere.

## The Interop 2023 focus areas

This time around, we have no less than 26 focus areas, outlined in detail in our [project document](https://github.com/web-platform-tests/interop/blob/main/2023/README.md#focus-areas). They are, in alphabetical order:

- [Border Image in CSS](https://developer.mozilla.org/docs/Web/CSS/border-image)
- [Color Spaces and Functions in CSS](https://developer.mozilla.org/docs/Web/CSS/color_value)
- [Container Queries in CSS](https://developer.mozilla.org/docs/Web/CSS/CSS_Container_Queries)
- [Containment in CSS](https://developer.mozilla.org/docs/Web/CSS/CSS_Containment)
- [CSS Pseudo-classes](https://developer.mozilla.org/docs/Web/CSS/Pseudo-classes)
- [Custom Properties in CSS](https://developer.mozilla.org/docs/Web/CSS/@property)
- [Flexbox](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Flexbox)
- [Font feature detection](https://developer.mozilla.org/en-US/docs/Web/CSS/@supports#function_syntax) and [palettes](https://developer.mozilla.org/docs/Web/CSS/font-palette)
- [Forms](https://developer.mozilla.org/docs/Web/HTML/Element/form)
- [Grid](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout)
- [:has()](https://developer.mozilla.org/docs/Web/CSS/:has )
- [Inert](https://developer.mozilla.org/docs/Web/API/HTMLElement/inert)
- [Masking in CSS](https://developer.mozilla.org/docs/Web/CSS/CSS_Masking)
- [Math Functions in CSS](https://developer.mozilla.org/docs/Web/CSS/CSS_Functions#math_functions)
- [Media Queries](https://developer.mozilla.org/docs/Web/CSS/Media_Queries/Using_media_queries)
- [Modules in Web Workers](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers)
- [Motion Path in CSS Animations](https://developer.mozilla.org/docs/Web/CSS/CSS_Motion_Path)
- [Offscreen Canvas](https://developer.mozilla.org/docs/Web/API/OffscreenCanvas)
- [Pointer and mouse Events](https://developer.mozilla.org/docs/Web/API/Pointer_events)
- [URL](https://developer.mozilla.org/docs/Web/API/URL)
- Web Compat 2023: A catchall focus area for small bugs that cause known site compatibility issues
- [Web Codecs (video)](https://developer.mozilla.org/docs/Web/API/WebCodecs_API)
- [Web Components](https://developer.mozilla.org/docs/Web/Web_Components)

You can find full details of all focus areas at [Web Platform Tests](https://github.com/web-platform-tests/interop/blob/main/2023/README.md#focus-areas) based on [MDN Web Docs](https://developer.mozilla.org/), however here are a few that we think you might be really excited about.

### Container Queries

Container queries has been a [top request](https://2021.stateofcss.com/opinions/#currently_missing_from_css_wins) from developers for many years, and in 2022 Chrome and Safari shipped it. Firefox expects to ship container queries in Firefox 110, and the tests for this focus area help to ensure that container queries work reliably cross-browser and according to the spec.

### :has(…)

Developers have for a long time asked for a parent selector in CSS. The [`:has()`](https://developer.mozilla.org/docs/Web/CSS/:has) pseudo-class makes possible many of the use cases for parent selectors, as well as selecting a previous sibling element with respect to a reference element. For example, this makes it possible to style a figure that has a caption differently to one that doesn’t. Learn more about the use cases for `has()` in [:has(), the family selector](https://developer.chrome.com/blog/has-m105/).

### Custom Properties

CSS custom properties, also known as CSS variables, make it possible to define a value once in a stylesheet and reuse that in many places, reducing repetition. For example, you can define a common color or font size once in a stylesheet and use this across components. Basic support for custom properties has been in browsers for a long time. Interop 2023 focuses on the [`@property`](https://developer.mozilla.org/docs/Web/CSS/@property) at-rule. `@property` represents a custom property registration in a stylesheet, allowing for property type checking, setting default values, and whether the property should inherit values. Learn more in [@property: giving superpowers to CSS variables](/at-property/).

### CSS masking

[CSS masking](https://developer.mozilla.org/docs/Web/CSS/CSS_Masking) provides methods to apply image effects, such as you might see in a graphics application, using CSS. Support for the various masking properties is patchy, making masking harder to use than it should be. This focus area will help developers to confidently use creative effects cross-browser. Learn more about applying effects to images in this [article about image masking](/css-masking/).

### OffscreenCanvas

The [`<canvas>`](https://developer.mozilla.org/docs/Web/HTML/Element/canvas)  element and Canvas API provide a scriptable way to draw graphics to the screen. However, this can cause performance problems as the work is completed on the same thread as user interaction.  [OffscreenCanvas](https://developer.mozilla.org/docs/Web/API/OffscreenCanvas) offers developers a canvas which is decoupled from the DOM and the Canvas API. Developers can also run rendering tasks in a Web Worker, separate from the main thread. Learn more about [the performance benefits of OffscreenCanvas](https://developer.chrome.com/blog/offscreen-canvas/).

### Pointer and mouse events

[Pointer events](https://developer.mozilla.org/docs/Web/API/Pointer_events) are fired when interacting with a page using a mouse, pen, stylus, or touch screen. Mouse events are fired when using a mouse, but for historical reasons also for touch. This focus area covers the behavior of pointer and mouse interaction with pages, including how they interact with hit testing and scrolling areas. The focus area for 2023 excludes touch and stylus, due to a lack of Web Platform Tests in this area.

### WebCodecs

The [WebCodecs API](https://developer.mozilla.org/docs/Web/API/WebCodecs_API) provides methods for developers to access the individual frames of video, and chunks of audio. It offers access to codecs that are already available in the browser, and various interfaces to interact with them. The article [Video processing with WebCodecs](https://developer.chrome.com/en/articles/webcodecs/) shows how to use the API to decode and render individual frames to a canvas.

### Web Components

[Web Components](https://developer.mozilla.org/docs/Web/Web_Components) is an umbrella term for a number of technologies used to create reusable components, such as Custom Elements and Shadow DOM. Interop 2023 will focus on improving the interoperability of these foundational technologies.

## Dashboard

Follow progress throughout the year [on the Interop 2023 dashboard](https://wpt.fyi/interop-2023/), where you can see current scores and the status of addressing these focus areas across all major browser engines.

<figure>
<a href="https://wpt.fyi/interop-2023/">
{% Img src="image/RYmV5NPuMZRoF3PVwIXTUpdYeQ23/rK7xV8u6Jvf9oSl7VkCT.png", alt="The Scores for Interop overall: 62, Investigations: 0, and the scores per browser - 86 for Chrome and Edge, 74 for Firefox, 86 for Safari Technology Preview.", width="800", height="866" %}
</a>
<figcaption>The Interop 2023 Dashboard (screenshot taken January 31st, 2023).</figcaption>
</figure>


The Focus Area scores are calculated based on test pass rates. If you have feedback or want to contribute improvements to [WPT](https://github.com/web-platform-tests/wpt), please file an issue to request updating the set of tests used for scoring.

<figure>
<a href="https://wpt.fyi/interop-2023/">
{% Img src="image/RYmV5NPuMZRoF3PVwIXTUpdYeQ23/NYQC2r4udqv0RXxrkWVe.png", alt="A list of all Active Focus Areas together with browser scores and overall Interop score", width="800", height="1032" %}
</a>
<figcaption>All the Active Focus Areas and their overall Interop Score.</figcaption>
</figure>

## More about Interop 2023

- [Apple](https://webkit.org/blog/13706/interop-2023/)
- [Bocoup](https://bocoup.com/blog/interop-2023)
- [Igalia](https://www.igalia.com/news/2023/interop2023.html)
- [Microsoft](https://blogs.windows.com/msedgedev/2023/02/01/microsoft-edge-and-interop-2023/)
- [Mozilla](https://hacks.mozilla.org/2023/02/announcing-interop-2023/)
