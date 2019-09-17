---
layout: post
title: Ensure each table header has data cells
description: |
  Learn about th-has-data-cells audit.
date: 2019-05-02
web_lighthouse:
  - th-has-data-cells
---

Screen readers have features to make navigating tables easier.
In order for screen readers to be able to help users navigate tables easier,
table headers must refer to some set of cells.
Lighthouse reports when `<th>` elements and elements with `[role="columnheader"/"rowheader"]`
do not have the data cells they describe.

<!--
***Todo*** I cannot for the life of me get this audit to fail. I've tried all sorts of combinations of things.
For sure, empty columns don't fail. I've also had columns without headers, and they don't fail either.
I've removed scope, I've tried making the tables as confusing as possible, and the audit just doesn't fail.

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="td-headers-attr.png" alt="Lighthouse audit showing table headers do not have data cells
  <figcaption class="w-figcaption">
    Table headers do not have data cells.
  </figcaption>
</figure>
-->
## How to fix this problem

To fix this problem,
markup tables semantically and with the correct header structure.
The following table isn't structured correctly;
there's a table header column, "Marathon pace", without table data cells:

```html
<table>
  <caption><strong>My marathon training log</strong></caption>
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
  <caption><strong>My marathon training log</strong></caption>
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
      <td>12.30</td>
    </tr>

    <tr>
      <th scope="row">2</th>
      <td>16</td>
      <td>6</td>
      <td>12.10</td>
    </tr>

  </tbody>

</table
```

Screen readers announce the table headers when it comes to each table data cell.
If the headers and data cells don't match up,
it's very confusing to screen reader users.
Learn more in
[All `<th>` elements and elements with `role="columnheader"` or `role="rowheader"` must have data cells they describe](https://dequeuniversity.com/rules/axe/3.3/th-has-data-cells).

<!--
## How this audit impacts overall Lighthouse score

Todo. I have no idea how accessibility scoring is working!
-->
## More information

- [Ensure each table header has data cells audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/th-has-data-cells.js)
- [axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
