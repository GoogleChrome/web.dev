---
layout: post
title: Ensure layout tables do not use data table elements
description: |
  Learn about layout-table audit.
date: 2019-05-02
web_lighthouse:
  - layout-table
---

Tables used for layout purposes shouldn't include data elements:
`th` element, `caption` element or `summary` attribute.
Lighthouse reports when layout `<table>` elements use `<th>`, `<caption>`, or `summary`.

<!--
***Todo*** This audit doesn't seem to be failing for me. I added `role="presentation"` to a table
with `th` expecting this to fail, and it does not.

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="layout-table.png" alt="Lighthouse audit showing presentational <table> elements incorrectly using <th>, <caption>, or summary
  figcaption class with a value of 'w-figcaption'">
    Presentational <code>&lt;table></code> elements incorrectly using <code>&lt;th></code>, <code>&lt;caption></code>, or <code>summary</code>.
  </figcaption>
</figure>
-->
## How to fix this problem

It's simple to pass the Lighthouse audit:
remove data elements (`th`, `caption` elements or the `summary` attribute) from layout tables.

If using a table just for visual layout, and not for tabular data,
the better fix is to remove the table all together,
and use cascading style sheets (CSS) to control layout instead.

Learn more in
[Layout tables must not use data table elements](https://dequeuniversity.com/rules/axe/3.3/layout-table).

<!--
## How this audit impacts overall Lighthouse score

Todo. I have no idea how accessibility scoring is working!
-->
## More information

- [Layout tables must not use data table elements audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/accessibility/layout-table.js)
- [axe-core rule descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
