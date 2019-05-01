---
layout: post
title: Avoid making pages that rely on browser plugins
authors:
  - ekharvey
date: 2018-11-05
description: |
  Search engines often can't index content that requires browser plugins such as
  Java applets or Flash animations. Also, most mobile devices don't support
  plugins, and this can create frustrating experiences for mobile users.
web_lighthouse:
  - plugins
---

## Why does this matter?

Search engines often can't index content that requires browser plugins such as
Java applets or Flash animations. Content that requires plugins will not show up
in search results. Also, most mobile devices don't support plugins, and this can
create frustrating experiences for mobile users.

## Measure

Lighthouse displays the following failed audit if your content relies on
plugins: **Document uses plugins**.

## Don't rely on browser plugins to display your content

To replace content that relies on plugins, you will need to refer to specific
documentation for the plugin. For example,
[how to switch Flash video to HTML5 video](https://developer.mozilla.org/en-US/docs/Plugins/Flash_to_HTML5/Video).

## Verify

Run the Lighthouse SEO Audit (**Lighthouse > Options > SEO**) and look for the
results of the audit **Document uses plugins**.
