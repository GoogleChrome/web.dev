---
layout: post
title: Fix small font sizes
authors:
  - ekharvey
date: 2018-11-05
description: |
  Font sizes smaller than 12px are often difficult to read on mobile devices,
  and may require users to pinch-to-zoom in order to display the text at a
  comfortable reading size. Mobile-friendly pages is a ranking factor for many
  search engines because users should be able to navigate your site on their
  mobile devices.
web_lighthouse:
  - font-size
---

## Why does this matter?

Font sizes smaller than 12px are often difficult to read on mobile devices, and
may require users to pinch-to-zoom in order to display the text at a comfortable
reading size. Mobile-friendly pages is a ranking factor for many search engines
because users should be able to navigate your site on their mobile devices.

## Measure

Lighthouse displays the following failed audit if your content is too small for
mobile devices: **Document doesn't use legible font sizes**.

## Fix small font

Check font sizes in your CSS. Aim for font sizes of 12px or more for at least
60% of the text on your pages. 

## Verify

Run the Lighthouse SEO Audit (**Lighthouse > Options > SEO**) and look for the
results of the audit **Document doesn't use legible font sizes**.
