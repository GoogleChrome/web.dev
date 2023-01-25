---
layout: post
title: Document doesn't use legible font sizes
description: |
  Learn about the "Document doesn't use legible font sizes" Lighthouse audit.
date: 2019-05-02
updated: 2019-08-20
web_lighthouse:
  - font-size
---

Many search engines rank pages based on how mobile-friendly they are. Font
sizes smaller than 12&nbsp;px are often difficult to read on mobile devices
and may require users to zoom in to display text at a comfortable reading size.

## How the Lighthouse font size audit fails

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) flags pages
with font sizes that are too small to read easily on mobile:

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ky2VDt8ZtedleWFLn1Gt.png", alt="Lighthouse audit showing page has illegible font sizes", width="800", height="225", class="w-screenshot" %}
</figure>

Lighthouse flags pages on which 60% or more of the text has a font size smaller
than 12&nbsp;px. When a page fails the audit, Lighthouse lists the results in a
table with four columns:

<div class="w-table-wrapper">
  <table>
    <tbody>
      <tr>
        <td><strong>Source</strong></td>
        <td>The source location of the CSS ruleset that is causing the illegible text.</td>
      </tr>
      <tr>
        <td><strong>Selector</strong></td>
        <td>The selector of the ruleset.</td>
      </tr>
      <tr>
        <td><strong>% of Page Text</strong></td>
        <td>The percentage of text on the page that is affected by the ruleset.</td>
      </tr>
      <tr>
        <td><strong>Font Size</strong></td>
        <td>The computed size of the text.</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-seo/scoring.njk' %}

## How to fix illegible fonts

Check font sizes in your CSS. Aim to have a font size of at least 12&nbsp;px on
at least 60% of the text on your page.

## How to fix a missing viewport config

If Lighthouse reports `Text is illegible because of a missing viewport config`,
add a `<meta name="viewport" content="width=device-width, initial-scale=1">`
tag to the `<head>` of your document.

See the [Does not have a `<meta name="viewport">` tag with `width` or `initial-scale`](/viewport)
post for more information.

## Resources

[Source code for **Document does not use legible font sizes** audit](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/font-size.js)
