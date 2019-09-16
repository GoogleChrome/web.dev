---
layout: post
title: "List items (<li>) are not contained within <ul> or <ol> parent elements"
description: |
  Learn how to make list items on your web page accessible to screen reader
  users by placing them in list elements.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - listitem
---

Screen readers require list items (`<li>`) to be contained
within parent `<ul>` or `<ol>` to be announced properly.

When screen readers come to a list,
they notify users how many items are within the list.
If you don't wrap list items in a parent list element,
the screen reader can't set user expectations correctly.

## How this Lighthouse audit fails

Lighthouse flags list items (`<li>`) that aren't contained
in `<ul>` ' or `<ol>` parent elements:

<figure class="w-figure">
  <img class="w-screenshot" src="listitem.png" alt="Lighthouse audit showing list item isn't contained within a parent list">
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix orphaned list items

Wrap any orphaned `<li>` elements inside a `<ul>` or `<ol>` element.

Learn more in
[`<li>` elements must be contained in a `<ul>` or `<ol>`](https://dequeuniversity.com/rules/axe/3.3/listitem).

## Resources

- [Source code for **List items (`<li>`) are not contained within `<ul>` or `<ol>` parent elements** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/listitem.js)
- [axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
