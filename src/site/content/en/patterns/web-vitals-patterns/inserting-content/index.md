---
layout: pattern-set
title: Inserting content
description: Insert new content without causing layout shifts
date: 2021-08-20
updated: 2021-08-20
height: 500
---

Inserting new page content can cause [layout
shifts](https://web.dev/debugging-layout-shifts/) if it causes existing page
content to visibly change position. Infinite scroll, as well as the insertion of
ads and other embeds, are two of the scenarios where this issue is commonly
encountered.