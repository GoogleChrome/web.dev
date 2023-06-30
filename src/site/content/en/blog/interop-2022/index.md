---
layout: post
title: "Interop 2022: browsers working together to improve the web for developers"
description:
    "Learn more about how all browser vendors, and other stakeholders, have come together to solve the top browsers compatibility issues identified by web developers. Interop 2022 will improve the experience of developing for the web in 15 key areas."
authors:
  - rachelandrew
  - robertnyman
  - foolip
hero: "image/RYmV5NPuMZRoF3PVwIXTUpdYeQ23/xv75zUKa4jUR2xGMZ7Xb.jpg"
alt: "A picture of a brick wall."
date: 2022-03-03
updated: 2022-03-07
tags:
  - blog
  - css
  - news
---

For the first time ever, all major browser vendors, and other stakeholders, have come together to solve the top browsers compatibility issues identified by web developers. Interop 2022 will improve the experience of developing for the web in 15 key areas. In this article, find out how we got here, what the project focuses on, how success will be measured, and how you can track progress.

## It all started in 2019

Back in 2019 Mozilla, Google, and others started [a major effort](https://insights.developer.mozilla.org/) to understand developers' pain points, in the form of the [MDN Developer Needs Assessment surveys](https://insights.developer.mozilla.org/), and the deep-dive [Browser Compatibility Report](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html). These reports gave us detailed and actionable information to address top challenges for developers with the web platform, and led to the [Compat 2021 effort](/compat2021/).

Among other things, Compat 2021 led to creating a solid foundation for powerful features such as [CSS grid](https://wpt.fyi/compat2021?feature=css-grid) ([12% usage and steadily growing](https://chromestatus.com/metrics/feature/timeline/popularity/1693)) and [CSS flexbox](https://wpt.fyi/compat2021?feature=css-flexbox) ([77% usage](https://chromestatus.com/metrics/feature/timeline/popularity/1692)), including the `gap` property in flexbox, which solves a top pain point for developers when adopting new layout methods.

We were delighted to reach [a score of over 90%](/compat2021-holiday-update/) across all implementations at the end of 2021!

## What is Interop 2022?

Interop 2022 is a benchmark, agreed on by representatives of three major browser implementations, and developed through a process of [public nomination](https://github.com/web-platform-tests/interop-2022/labels/proposal) and review with input from [supporters](https://github.com/web-platform-tests/interop-2022/blob/main/supporters.md) [Apple](https://webkit.org/blog/12288/working-together-on-interop-2022/), [Bocoup](https://bocoup.com/blog/interop-2022), Google, [Igalia](https://igalia.com/news/interop2022.html), [Microsoft](https://aka.ms/microsoft-interop2022), and [Mozilla](https://hacks.mozilla.org/2022/03/interop-2022/).

The benchmark focuses on 15 areas, [identified by developers](/state-of-css-2021/) as being particularly troublesome when they are missing or have compatibility issues across browsers. All browser vendors have agreed to focus on these areas, and everyone involved is excited to get started on making the experience of developing for the web measurably better.

{% Aside %}
The terms "compatibility" and "interoperability" are typically distinguished by browser vendors, where compat refers to site compat, and interop refers to two or more browsers behaving the same. In that terminology,this effort is about interoperability and so the project has aligned with that naming.
{% endAside %}

## The 15 areas of focus

The following features will be the focus of Interop 2022. They include 10 new areas, plus 5 carried over from Compat 2021. The new areas of focus are:

### Cascade layers

[Cascade layers](https://developer.mozilla.org/docs/Web/CSS/@layer) give web developers more control over the cascade. They provide a way to group selectors into layers, each with its own specificity. This means you don't need to order selectors carefully or create highly specific selectors to overwrite base CSS rules.

### Color spaces and CSS color functions

To use color functions in a design system, you currently need to rely on Sass, PostCSS, or `calc()` on HSL values. Color functions built into CSS mean that colors can be dynamically updated, and new color spaces remove the restriction to the sRGB gamut, and perceptual limitations of HSL.

There are two functions defined in [CSS Color Level 5](https://drafts.csswg.org/css-color-5/) that enable more dynamic theming on the web platform:

- `color-mix()`: Takes two colors and returns the result of mixing them in a specified color space by a specified amount.
- `color-contrast()`: Selects from a list of colors the color with the highest contrast to a specified single color.

These functions support expanded color spaces (LAB, LCH, and P3), and in addition to HSL and sRGB, they default to the uniform LCH color space. 

### New viewport units

Difficulties dealing with viewport sizing are prominent in both the [MDN Browser Compatibility Report 2020](https://insights.developer.mozilla.org/reports/mdn-browser-compatibility-report-2020.html#findings-viewport) and the new [State of CSS 2021](https://2021.stateofcss.com/en-US/opinions/#browser_interoperability_features) survey. [CSS Values and Units Level 4](https://drafts.csswg.org/css-values-4/#viewport-relative-lengths) adds new units for the largest, smallest, and dynamic viewport sizes, `lv*`, `sv*`, and `dv*`. These units will make it easier to create layouts that fill the visible viewport on mobile devices while taking the address bar into account.

{% Img src="image/RYmV5NPuMZRoF3PVwIXTUpdYeQ23/JUvvIgXen1zmHFH53CBS.png", alt="The different parts of the viewport for each type of viewport unit.", width="800", height="664" %}

Additionally, the cross vendor team behind Interop 2022 will collaborate on researching and improving the state of interoperability of existing viewport measurement features, including the existing `vh` unit.

### Scrolling

The [2021 Scroll Survey Report](/2021-scroll-survey-report/) confirms that scrolling features and scrolling compatibility are difficult to implement and have many areas for improvement. We'll focus on [scroll snap](https://developer.mozilla.org/docs/Web/CSS/CSS_Scroll_Snap), [scroll-behavior](https://developer.mozilla.org/docs/Web/CSS/scroll-behavior), and [overscroll-behavior](https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior) to help scrolling be more consistent and smooth across platforms.

We are also exploring new [scroll snap feature proposals](https://github.com/argyleink/ScrollSnapExplainers). 


### Subgrid

The [`subgrid`](https://developer.mozilla.org/docs/Web/CSS/CSS_Grid_Layout/Subgrid) value of `grid-template-columns` and `grid-template-rows` means that a grid item that has `display: grid` applied can inherit the track definition from the part of the parent grid it is placed over.

For example, the following three card components have a header and footer aligned with the adjacent card headers and footers, even though each card has an independent grid. This pattern works because each card is an item that spans three rows of the parent grid, then uses subgrid to inherit those rows into the card.

<figure>

{% Img src="image/kheDArv5csY6rvQUJDbWRscckLr1/yYDiYpyyTkH9IJK4KxvA.png", alt="A three card component where the headers and footers are aligned between the cards.", width="800", height="209" %}

  <figcaption><a href="https://codepen.io/web-dot-dev/pen/XWzqrLR">See this on CodePen</a>.</figcaption>
</figure>


### Also included

- CSS Containment (the `contain` property)
- The `<dialog>` element
- Form controls
- Typography and Encodings: including `font-variant-alternates`, `font-variant-position`,  the `ic` unit, and CJK text encodings
- Web Compat, which focuses on differences between browsers that have caused site compatibility issues affecting end users

The following areas made great progress through the Compat 2021 project, but there is still room for improvement. Therefore, they have been included in Interop 2022, in order that the remaining issues can be addressed.

- Aspect Ratio
- Flexbox
- Grid
- Sticky Positioning
- Transforms


### Investigation efforts

In addition to the 15 focus areas, Interop 2022 includes three investigation efforts. These are areas that are problematic and need improvement, but where the current state of the specifications or tests aren’t yet good enough to be able to score progress using test results:

- Editing, `contenteditable` and `execCommand`
- Pointer and Mouse Events
- Viewport Measurement

Browser vendors and other stakeholders will collaborate on improving the tests and specifications for these areas, so that they could be included in future iterations of this effort.


## Measuring success and tracking progress

{% Img src="image/RYmV5NPuMZRoF3PVwIXTUpdYeQ23/MfdXmrXC3aspp2CIQCdb.png", alt="The scores per browser - 71 for Chrome and Edge, 74 for Firefox, 73 for Safari Technology Preview.", width="800", height="374" %}

The existing [web-platform-tests dashboard](https://wpt.fyi/) will be used to track the progress in the 15 focus areas. For each area, a set of tests have been identified. Browsers are then scored against these tests, giving a score for each area and an overall score for all 15 areas.

To follow along and track the progress, check out the [Interop 2022 dashboard](https://wpt.fyi/interop-2022). Over the course of the year, you can follow along and see how the platform you build for is improving. 

<figure>
  {% Img src="image/RYmV5NPuMZRoF3PVwIXTUpdYeQ23/jrtdwPgBhznFQ5u8cZmk.png", alt="An image of a table with scores for many areas for all major web browsers", width="800", height="1146" %}
  <figcaption><a href="https://wpt.fyi/interop-2022">See all browser scores per focus area on wpt.fyi/interop-2022.</a></figcaption> 
</figure>

## What will all this mean for developers?

The goal of these multi-year interoperability efforts, in the form of Compat 2021, Interop 2022 and much more, is to fully acknowledge and address the pain points developers have experienced through for many years. And it's not a one-browser effort but rather a strong collaboration between all major browser vendors and friends for improving the web platform across the board.

In essence, the goal is to make the web platform more usable and reliable for developers, so that they can spend more time building great web experiences instead of working around browser inconsistencies.



## Let us know what you think

If you have feedback on the improvements made during [Compat 2021](/compat2021/), or on any of the features included in Interop 2022, we would love to hear from you. Which of these features will make the most difference to your work? What are you really excited about? [File issues for the GitHub repo](https://github.com/web-platform-tests/interop-2022/issues/) or [let us know on Twitter](https://twitter.com/chromiumdev).

More about Interop 2022 from:

- [Apple](https://webkit.org/blog/12288/working-together-on-interop-2022/)
- [Bocoup](https://bocoup.com/blog/interop-2022)
- [Igalia](https://igalia.com/news/interop2022.html)
- [Microsoft](https://aka.ms/microsoft-interop2022)
- [Mozilla](https://hacks.mozilla.org/2022/03/interop-2022/)
