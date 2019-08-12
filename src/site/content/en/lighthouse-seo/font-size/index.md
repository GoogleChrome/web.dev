---
layout: post
title: Document does not use legible font sizes
description: |
  Learn about the "Document does not use legible font sizes" Lighthouse audit.
web_lighthouse:
  - font-size
---

Many search engines rank pages based on how mobile-friendly they are. Font
sizes smaller than 12&nbsp;px are often difficult to read on mobile devices
and may require users to zoom in to display text at a comfortable reading size.

Lighthouse flags pages with font sizes that are too small to read easily
on mobile:

<figure class="w-figure">
  <img class="w-screenshot w-screenshot--filled" src="font-size.png" alt="Lighthouse audit showing page has illegible font sizes">
</figure>

## How this audit fails

Lighthouse flags pages on which 60% or more of the text has a font size smaller
than 12&nbsp;px. When a page fails the audit, Lighthouse lists the results in a
table with four columns:

- **Source**.
The source location of the CSS ruleset that is causing the illegible text.
- **Selector**.
The selector of the ruleset.
- **% of Page Text**.
The percentage of text on the page that is affected by the ruleset.
- **Font Size**.
The computed size of the text.

{% include 'content/lighthouse-seo/scoring.njk' %}

## How to fix illegible fonts

Aim to have a font size of at least 12&nbsp;px on at least 60% of the text on
your page. See the [Fix small font sizes](/fix-small-fonts) page for more
information.

## How to fix a missing viewport config

If Lighthouse reports `Text is illegible because of a missing viewport config`,
add a `<meta name="viewport" content="width=device-width, initial-scale=1">`
tag to the `<head>` of your document.

See the [Has a `<meta name="viewport">` tag with `width` or `initial-scale`](/viewport)
post for more information.

## More information

[**Document does not use legible font sizes** audit source](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/seo/font-size.js)
