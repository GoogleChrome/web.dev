---
layout: post
title: Content reordering
authors:
  - rachelandrew
date: 2020-05-29
description: |
  When creating a layout using CSS, you need to take care that you don't create a disconnected experience for users who are navigation with the keyboard.
tags:
  - accessibility
---

The order of content in your document is important for the accessibility of your site.
A screen reader will read out content based on the document order,
using the HTML elements that you have selected to give meaning to that content.
A person navigating the site using a keyboard, rather than a touchscreen or mouse, will tab around the document.
This means that they will jump from active element to active element,
tabbing between links and form fields, once again in the order they exist in the document.

Starting with a well-structured document and using all of the right HTML elements
is therefore a key part of creating an accessible site.
However, it is possible to undo some of that good work when you start using CSS. Let's take a look at why.

## Source vs. visual order

Website navigation is often marked up as a list of links.
You can then use [Flexbox](/responsive-web-design-basics/#flexbox) to turn these into a horizontal bar.
In the Glitch example below, I have created this commonly used pattern.
Click into the example, and tab between the links.
The focus will move in a logical direction from left to right,
the order that we read in English.

{% Glitch {
  id: 'flex-nav-source-ordered',
  path: 'index.html'
} %}

If you have created this sort of pattern and then were asked to move **Contact Us**,
which is second in the source, to the end. You could use the `order` property which works in Flexbox.
Try tabbing through the items in the example below, which has used the `order` property to rearrange the items.

{% Glitch {
  id: 'flex-nav-ordered',
  path: 'style.css'
} %}

The focus jumps to the final item and then back again.
As far as the tab order is concerned that item is the second item.
Visually however, it's the last item.

The above example highlights the problem that we face if we rearrange and reorder content using CSS.
If you were dealing with this issue then the right thing to do would be to change the order in the source,
rather than using CSS.

## Which CSS properties can cause reordering?

Any layout method that allows you to move elements around can cause this problem.
The following CSS properties commonly cause content reordering problems:

- Using `position: absolute` and taking an item out of flow visually.
- The `order` property in Flexbox and Grid layout.
- The `row-reverse` and `column-reverse` values for `flex-direction` in Flexbox.
- The `dense` value for `grid-auto-flow` in Grid Layout.
- Any positioning by line name or number, or with `grid-template-areas` in Grid Layout.

In this next example, I have created a layout using CSS Grid and positioned the items
using line numbers, without considering where they are in the source.

{% Glitch {
  id: 'grid-mixed-up-order',
  path: 'index.html'
} %}

Try tabbing around this example, and see how the focus jumps about.
This makes for a very confusing experience, especially if this is a long page.

## Testing for the problem

A very simple test is to keyboard navigate through your page. Can you get to everything?
Are there any strange jumps as you do so?

For a visual demonstration of content reordering,
try the Tab Stop checker in the [Accessibility Insights](https://accessibilityinsights.io/) extension for Chrome.
The image below shows the CSS Grid example in that tool.
You can see how the focus has to jump around the layout.

<figure class="w-figure" style="max-width: 600px">
  {% Img src="image/admin/n0i0TJf3OdZYvwswrHDV.jpg", alt="A screenshot of the Accessibility Insights Tool demonstrating the confusing order of items.", width="800", height="919", class="w-screenshot" %}
</figure>

## Content reordering and responsive web design

If you only have one presentation of your content,
then having your source in a logical order, and reflecting that in layout is not usually difficult.
It can become harder, when you consider the layout at different breakpoints.
It might make sense to have an element moved to the bottom of the layout on smaller screens for example.

There is not at this time a good solution for this problem.
In most situations developing "mobile first", will help you keep your source and layout in order.
The choices you make about priority on mobile, are often solid ones for the content in general.
The key is to be aware when there is a possibility of this type of content reordering,
and to test that the end experience is not too jarring at each breakpoint.
