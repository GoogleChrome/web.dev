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
For example, if some buttons on a page have accessible names,
but others don't, the page gets a 0 for the
[**Buttons do not have an accessible name** audit](/button-name).

The following table shows the weighting for each accessibility audit.
More heavily weighted audits have a bigger effect on your score.
[Manual audits](/lighthouse-accessibility/#additional-items-to-manually-check)
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
        <td><a href="/accesskeys/"><code>[accesskey]</code> values are not unique</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/bypass/">The page does not contain a heading, skip link, or landmark region</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/duplicate-id-active/"><code>[id]</code> attributes on active, focusable elements are not unique</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/heading-order">Headings skip levels</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/tabindex/">Some elements have a <code>[tabindex]</code> value greater than <code>0</code></a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/aria-allowed-attr/"><code>[aria-*]</code> attributes do not match their roles</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/aria-hidden-body"><code>[aria-hidden="true"]</code> is present on the document <code>&#60;body&#62;</code></a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/aria-hidden-focus"><code>[aria-hidden="true"]</code> elements contain focusable descendants</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/aria-input-field-name">Not all ARIA input fields have accessible names</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/aria-required-attr/"><code>[role]</code>s do not have all required <code>[aria-*]</code> attributes</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/aria-required-children/">Elements with an ARIA <code>[role]</code> that require children to contain a specific <code>[role]</code> are missing some or all of those required children</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/aria-required-parent/"><code>[role]</code>s are not contained by their required parent element</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/aria-roles/"><code>[role]</code> values are not valid</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/aria-toggle-field-name/">Not all ARIA toggle fields have accessible names</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/aria-valid-attr-value/"><code>[aria-*]</code> attributes do not have valid values</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/aria-valid-attr/"><code>[aria-*]</code> attributes are not valid or misspelled</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/duplicate-id-aria/">ARIA IDs are not all unique</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/button-name/">Buttons do not have an accessible name</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/document-title/">Document doesn't have a <code>&#60;title&#62;</code> element</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/form-field-multiple-labels">Form fields have multiple labels</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/frame-title/"><code>&#60;frame&#62;</code> or <code>&#60;iframe&#62;</code> elements do not have a title</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/image-alt/">Image elements do not have <code>[alt]</code> attributes</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/input-image-alt/"><code>&#60;input type="image"&#62;</code> elements do not have <code>[alt]</code> text</a></td>
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
        <td><a href="/object-alt/"><code>&#60;object&#62;</code> elements do not have <code>[alt]</code> text</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/color-contrast/">Background and foreground colors do not have a sufficient contrast ratio</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/definition-list/"><code>&#60;dl&#62;</code>s do not contain only properly ordered <code>&#60;dt&#62;</code> and <code>&#60;dd&#62;</code> groups, <code>&#60;script&#62;</code>, or <code>&#60;template&#62;</code> elements</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/dlitem/">Definition list items are not wrapped in <code>&#60;dl&#62;</code> elements</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/list/">Lists do not contain only <code>&#60;li&#62;</code> elements and script supporting elements (<code>&#60;script&#62;</code> and <code>&#60;template&#62;</code>)</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/listitem/">List items (<code>&#60;li&#62;</code>) are not contained within <code>&#60;ul&#62;</code> or <code>&#60;ol&#62;</code> parent elements</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/layout-table/">Presentational <code>&#60;table&#62;</code> elements do not avoid using <code>&#60;th&#62;</code>, <code>&#60;caption&#62;</code>, or the <code>[summary]</code> attribute</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/td-headers-attr/">Cells in a <code>&#60;table&#62;</code> element that use the <code>[headers]</code> attribute refer to an element id not found within the same table</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/th-has-data-cells/"><code>&#60;th&#62;</code> elements and elements with <code>[role="columnheader"/"rowheader"]</code> do not have data cells they describe</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/meta-refresh/">The document uses <code>&#60;meta http-equiv="refresh"&#62;</code></a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/meta-viewport/"><code>[user-scalable="no"]</code> is used in the <code>&#60;meta name="viewport"&#62;</code> element or the <code>[maximum-scale]</code> attribute is less than 5</a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/audio-caption/"><code>&#60;audio&#62;</code> elements are missing a <code>&#60;track&#62;</code> element with <code>[kind="captions"]</code></a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/video-caption/"><code>&#60;video&#62;</code> elements do not contain a <code>&#60;track&#62;</code> element with <code>[kind="captions"]</code></a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/video-description/"><code>&#60;video&#62;</code> elements do not contain a <code>&#60;track&#62;</code> element with <code>[kind="description"]</code></a></td>
        <td>10</td>
      </tr>
      <tr>
        <td><a href="/html-has-lang/"><code>&#60;html&#62;</code> element does not have a <code>[lang]</code> attribute</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/html-lang-valid/"><code>&#60;html&#62;</code> element does not have a valid value for its <code>[lang]</code> attribute</a></td>
        <td>3</td>
      </tr>
      <tr>
        <td><a href="/valid-lang/"><code>[lang]</code> attributes do not have a valid value</a></td>
        <td>3</td>
      </tr>
    </tbody>
  </table>
</div>
