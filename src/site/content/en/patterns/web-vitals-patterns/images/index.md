---
layout: pattern-set
title: Images
description: Display images without causing layout shifts
date: 2021-08-17
---

Images can cause layout shifts if they load after the surrounding page has
already been rendered. This issue is more prominent in situations where images
are slow to load - for example, on a slow connection or when loading an image
with a particularly large file size.

To avoid layout shifts, it's important to indicate to the browser the dimensions
that the image will be displayed at. This is done by setting the `width`
and `height` attributes.
