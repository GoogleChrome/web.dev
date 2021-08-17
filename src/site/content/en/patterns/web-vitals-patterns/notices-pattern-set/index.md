---
layout: pattern-set
title: Banners and notices
description: Banners and notices that don't cause layout shifts
date: 2021-08-17
---

Banners and notices are a common source of layout shifts. Inserting a banner into the DOM after the surrounding page has already been rendered pushes the page elements below it further down the page.

Placing banners "on top" of the rest of the page is one way to avoid these types of layout shifts. Regardless of when these banners load, these banners should not cause layout shifts.

For more information, see [Best practices for cookie notices](https://web.dev/cookie-notice-best-practices/).
