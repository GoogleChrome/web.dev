---
title: 'Responsive images'
authors:
  - matmarquis
description: A deep dive into responsive images.
date: 2023-02-01
tags:
  - images
---

[Responsive image](/learn/design/responsive-images/) markup can be divided into two scenarios: situations
where the goal is the most efficient possible images, and situations where you need explicit control over what image source
the browser selects. You can think of these as _descriptive_ and _prescriptive_ syntaxes, respectively.

In this module you'll learn both approaches. First we'll cover `srcset` and `sizes`, and how to help the browser make the best
choice based on what it knows about the user, their device, and their browsing situation. You'll then discover the `<picture>` element,
which allows for explicit control over source selection based on factors like viewport size and browser support for image formats.

## Descriptive syntaxes

A descriptive syntax provides the browser with information about image sources and how they'll be used, but ultimately leaves
the decision-making to the browser. This is by far the more common scenario; for the vast majority of images you won't _want_ granular
control over browser behavior. Browsers have far more information at their disposal than web developers do, and can make complex decisions
based on this information. You can't predict users' browsing contexts accurately—there's too much about their hardware, preferences, and connection
speeds that you can't know. At best, you can make educated guesses, but can't know for _certain_ how each user experiences the web. The
central use case for responsive images is strictly goal-oriented, from a developer's perspective: allow browsers to make the most efficient image
requests possible, based on the information the browser has at hand.

To enable browsers to make these choices, `srcset` allows you to provide the browser with a list of potential sources for populating a single
`<img>`, while `sizes` allows you to provide the browser with information about how that `<img>` will be rendered. You'll learn how to use
these in the [next module](/learn/images/descriptive/).

## Prescriptive syntaxes

With a prescriptive syntax, you tell the browser what to do—what source to select, based on specific criteria you've defined. While this use case isn't as
common as "just load the most efficient asset to render this image," it allows us to provide usage instructions to the browser to account for
information it doesn't have prior to the transfer of assets, such as the content of the sources or their formats.

While `srcset` and `sizes` provide you with a syntax for passing information along to the user's browser and allowing it to make decisions about
image sources, there are times when you'll need explicit control over which source file is presented and when. For example, you might
want to display versions of the same image content with different aspect ratios, based on different design treatments across layout breakpoints,
or make sure only browsers with support for a specific encoding receive specific sources.

In these cases, you want explicit control over which source is shown, and when. These are assurances that `srcset` and `sizes` can't give us,
by design. To get that control, we'll need to use the [`<picture>` element](/learn/images/prescriptive/).

