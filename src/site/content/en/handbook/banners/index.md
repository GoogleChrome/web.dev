---
layout: handbook
title: Banners
date: 2021-06-28
description: |
  Learn how to add banners to the site.
---

This guide explains how to add a banner to the site.

## Add a site-wide banner

In `src/site/_date/site.js`, look for these two lines:

```js
isBannerEnabled: …,
banner: …
```

Set `isBannerEnabled` to `true`.
Add a markdown string for your `banner` message.

Example:

```js
isBannerEnabled: true,
banner:
  'PWA Summit: a conference to help everyone succeed with PWAs is happening Oct 6 & 7. [Submit your talk now](https://pwasummit.org).',
```

## Exclude a banner from a page

If you set `show_banner: false` in a page's YAML frontmatter, then it will
not display a site banner.
