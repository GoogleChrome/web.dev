---
layout: post
title: "Lighthouse accessibility scoring"
description: |
  Learn how Lighthouse generates the accessibility score for your page.
date: 2019-09-19
---

The Lighthouse Accessibility score is a weighted average
of all [accessibility audits](/lighthouse-accessibility).
Weighting is based on
[axe user impact assessments](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md).

Each accessibility audit is pass or fail.
Unlike the [Performance audits](/lighthouse-performance),
a page doesn't get points for partially passing an accessibility audit.
For example, if some buttons on a page have screen-reader-friendly names,
but others don't, the page gets a 0 for the
[Buttons do not have an accessible name](//button-name/).
See the [Lighthouse Scoring Guide](https://developers.google.com/web/tools/lighthouse/v3/scoring#a11y)
for more information.

The following table shows the weighting for each accessibility audit.
More heavily weighted audits have a bigger effect on your score.
[Manual audits](http://localhost:8080/lighthouse-accessibility/#additional-items-to-manually-check)
aren't included in the table because they don't affect your score.

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Audit</th>
        <th>Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/aria-allowed-attr/">[aria-*] attributes do not match their roles</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/aria-required-attr/">[role]s do not have all required [aria-*] attributes</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/aria-required-children/">Elements with an ARIA [role] that require children to contain a specific [role] are missing some or all of those required children</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/aria-required-parent/">[role]s are not contained by their required parent element</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/aria-roles/">[role] values are not valid</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/aria-valid-attr-value/">[aria-*] attributes do not have valid values</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/aria-valid-attr/">[aria-*] attributes are not valid or misspelled</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/audio-caption/">&#60;audio&#62; elements are missing a &#60;track&#62; element with [kind="captions"]</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/video-caption/">&#60;video&#62; elements do not contain a &#60;track&#62; element with [kind="captions"]</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/video-description/">&#60;video&#62; elements do not contain a &#60;track&#62; element with [kind="description"]</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/duplicate-id/">[id] attributes on the page are not unique</a></td>
        <td>1</td>
      </tr>
      <tr>
        <td><a href="/meta-refresh/">The document uses &#60;meta http-equiv="refresh"&#62;</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/meta-viewport/">[user-scalable="no"] is used in the &#60;meta name="viewport"&#62; element or the [maximum-scale] attribute is less than 5</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/color-contrast/">Background and foreground colors do not have a sufficient contrast ratio</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/html-has-lang/">&#60;html&#62; element does not have a [lang] attribute</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/html-lang-valid/">&#60;html&#62; element does not have a valid value for its [lang] attribute</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/valid-lang/">[lang] attributes do not have a valid value</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/button-name/">Buttons do not have an accessible name</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/document-title/">Ensure that each HTML document contains a title</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/frame-title/">&#60;frame&#62; or &#60;iframe&#62; elements do not have a title</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/image-alt/">Image elements do not have [alt] attributes</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/input-image-alt/">&#60;input type="image"&#62; elements do not have [alt] text</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/label/">Form elements do not have associated labels</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/link-name/">Links do not have a discernible name</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/object-alt/">&#60;object&#62; elements do not have [alt] text</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/accesskeys/">[accesskey] values are not unique</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/bypass/">The page does not contain a heading, skip link, or landmark region</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/tabindex/">Some elements have a [tabindex] value greater than 0</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/definition-list/">&#60;dl&#62;s do not contain only properly ordered &#60;dt&#62; and &#60;dd&#62; groups, &#60;script&#62;, or &#60;template&#62; elements</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/dlitem/">Definition list items are not wrapped in &#60;dl&#62; elements</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/layout-table/">Presentational &#60;table&#62; elements do not avoid using &#60;th&#62;, &#60;caption&#62;, or the [summary] attribute</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/list/">Lists do not contain only &#60;li&#62; elements and script supporting elements (&#60;script&#62; and &#60;template&#62;)</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/listitem/">List items (&#60;li&#62;) are not contained within &#60;ul&#62; or &#60;ol&#62; parent elements</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/td-headers-attr/">Cells in a &#60;table&#62; element that use the [headers] attribute refer to an element id not found within the same table</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/th-has-data-cells/">&#60;th&#62; elements and elements with [role="columnheader"/"rowheader"] do not have data cells they describe</a></td>
        <td>3</td>
      </tr>
    </tbody>
  </table>
</div>
