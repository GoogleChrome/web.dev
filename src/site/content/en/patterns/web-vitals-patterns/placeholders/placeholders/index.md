---
layout: pattern
title: Placeholders
description: Reserve space for future page content
date: 2021-08-23
updated: 2021-08-23
height: 600
---

Creating placeholders for page content can sometimes be as simple as adding a
background effect to existing page elements. In this example, all list items
share the same underlying HTML structure. However, the placeholders are styled
with a gray background that uses a CSS animation to create a pulsing loading
effect.

Depending on how your page elements are implemented, you may also need to adjust
your CSS slightly to ensure that the placeholders still take up space even
though they don't contain content. Often this takes the form of adding `width`
or `height` properties to existing page elements. For instance, in this example,
adding `height: 1.5em` to `.text-container` ensures that its placeholder remains
visible even though it doesn't contain any text.