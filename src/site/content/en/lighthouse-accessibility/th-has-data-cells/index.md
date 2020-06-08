---
layout: post
title: "`<th>` elements and elements with `[role=\"columnheader\"/\"rowheader\"]` do not have data cells they describe"
description: |
  Learn how to make tables on your web page more accessible to assistive
  technology users by making sure that there are data cells associated with
  each header cell.
date: 2019-05-02
updated: 2019-09-19
web_lighthouse:
  - th-has-data-cells
---

Screen readers and other assistive technologies
have features to make navigating tables easier.
Table headers must refer to some set of cells
so that assistive technologies can help users navigate tables easily.

## How this Lighthouse audit fails

Lighthouse flags `<th>` elements and elements with `[role="columnheader"/"rowheader"]`
that don't have the data cells they describe:

<!--
***Todo*** I cannot for the life of me get this audit to fail. I've tried all sorts of combinations of things.
For sure, empty columns don't fail. I've also had columns without headers, and they don't fail either.
I've removed scope, I've tried making the tables as confusing as possible, and the audit just doesn't fail.

<figure class="w-figure">
  <img class="w-screenshot" src="td-headers-attr.png" alt="Lighthouse audit showing table headers do not have data cells">
</figure>
-->

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix table headers that have no associated data cells

The following table isn't structured correctly;
there's a table header column, "Marathon pace", without table data cells:

```html
<table>
  <caption>My marathon training log</caption>
  <thead>
    <tr>
      <th scope="col">Week</th>
      <th scope="col">Total miles</th>
      <th scope="col">Longest run</th>
      <th scope="col">Marathon pace</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>14</td>
      <td>5</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>16</td>
      <td>6</td>
    </tr>
  </tbody>
</table>
```

To fix this table,
add the missing table data cells for the table header column, "Marathon pace":


```html
<table>
  <caption>My marathon training log</caption>
  <thead>
    <tr>
      <th scope="col">Week</th>
      <th scope="col">Total miles</th>
      <th scope="col">Longest run</th>
      <th scope="col">Marathon pace</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>14</td>
      <td>5</td>
      <td>4:45:00</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>16</td>
      <td>6</td>
      <td>4:33:00</td>
    </tr>
  </tbody>
</table>
```

Assistive technologies announce the table headers
when they come to each table data cell.
If the headers and data cells don't match up,
it's very confusing.

## Resources

- [Source code for **`<th>` elements and elements with `[role="columnheader"/"rowheader"]` do not have data cells they describe** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/th-has-data-cells.js)
- [All `<th>` elements and elements with `role="columnheader"` or `role="rowheader"` must have data cells they describe (Deque University)](https://dequeuniversity.com/rules/axe/3.3/th-has-data-cells)
