---
layout: post
title: "Presentational `<table>` elements do not avoid using `<th>`, `<caption>`, or the `[summary]` attribute"
description: |
  Learn how to make presentational tables more accessible for assistive
  technology users by avoiding child elements meant for data tables.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - layout-table
---

{% Banner 'caution', 'body' %}This audit has been deprecated and was removed in Lighthouse 7.0.{% endBanner %}

Tables used for layout purposes shouldn't include data elements:
`<th>` element, `<caption>` element or `summary` attribute.

## How this Lighthouse audit fails

Lighthouse flags layout `<table>` elements that use `<th>`, `<caption>`, or `summary`:

<!--
***Todo*** This audit doesn't seem to be failing for me. I added `role="presentation"` to a table
with `th` expecting this to fail, and it does not.

<figure class="w-figure">
  <img class="w-screenshot" src="layout-table.png" alt="Lighthouse audit showing presentational <table> elements incorrectly using <th>, <caption>, or [summary] attribute">
</figure>
-->

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to make presentational tables accessible

It's simple to pass the Lighthouse audit:
remove data elements (`<th>`, `<caption>` elements or the `summary` attribute) from layout tables.

If using a table just for visual layout, and not for tabular data,
the better fix is to remove the table all together,
and use cascading style sheets (CSS) to control layout instead.

## Resources

- [Source code for **Presentational `<table>` elements do not avoid using `<th>`, `<caption>`, or the `[summary]` attribute** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/layout-table.js)
- [Layout tables must not use data table elements (Deque University)](https://dequeuniversity.com/rules/axe/3.3/layout-table)
