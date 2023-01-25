---
layout: post
title: "Cells in a `<table>` element that use the `[headers]` attribute refer to an element ID not found within the same table"
description: |
  Learn how to improve the accessibility of tables on your web page by making
  sure that data cells always refer to existing header elements.
date: 2019-05-02
updated: 2020-03-20
web_lighthouse:
  - td-headers-attr
---

Screen readers and other assistive technologies
announce table headers when they come to each table data cell.
If the headers and data cells don't match up,
it's very confusing.
Every table data cell must relate to the correct table header;
therefore, there should only be one table header per column.

## How this Lighthouse audit fails

Lighthouse flags tables that have more than one table header per column:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/RI3y7LU6YECI6AdOw5GC.png", alt="Lighthouse audit showing there's more than one table header for a single column", width="800", height="227", class="w-screenshot" %}
</figure>

{% include 'content/lighthouse-accessibility/scoring.njk' %}

## How to fix data cells that refer to nonexistent headers

Each table data cell must align with one table header cell.

The following table isn't structured correctly;
one column has multiple table headers:

```html
<table>
  <caption><strong>My marathon training log</strong></caption>
  <thead>
    <tr>
      <th>Week</th>
      <th>Total miles</th>
      <th>Longest run</th>
      <th>Long run pace</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th headers="Week">1</th>
      <td>14</td>
      <td>5</td>
      <td>12.30</td>
    </tr>

    <tr>
      <th>1</th>
      <td>16</td>
      <td>6</td>
      <td>12.15</td>
    </tr>

  </tbody>

</table>
```

To fix this table,
remove `headers="Week"` and
apply the `scope` attribute to our header column and table rows.

The `scope` attribute tells the browser and assistive technologies
that everything under the column
is related to the header at the top,
and everything to the right of the row header is related to that header.

Also add the missing `<td>` to the first row in the body,
so that the table data aligns correctly with the table headers:

```html
<table>
  <caption>My marathon training log</caption>
  <thead>
    <tr>
      <th scope="col">Week</th>
      <th scope="col">Total miles</th>
      <th scope="col">Longest run</th>
      <th scope="col">Long run pace</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>14</td>
      <td>5</td>
      <td>12.30</td>
    </tr>

    <tr>
      <th scope="row">1</th>
      <td>16</td>
      <td>6</td>
      <td>12.15</td>
    </tr>

  </tbody>

</table>
```

## Resources

- [Source code for **Cells in a `<table>` element that use the `[headers]` attribute refer to an element `id` not found within the same table** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/td-headers-attr.js)
- [All cells in a `<table>` element that use the headers attribute must only refer to other cells of that same `<table>` (Deque University)](https://dequeuniversity.com/rules/axe/3.3/td-headers-attr)
