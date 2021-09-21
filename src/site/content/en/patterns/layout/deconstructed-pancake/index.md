---
layout: pattern
title: Deconstructed Pancake
description: Create a layout that stretches to fit the space, and snaps to the next line at a minimum size.
date: 2021-09-20
draft: true
---

`flex: 1 1 <baseWidth>` created a layout that stretches to fit the space, and snaps to the next line at a minimum size. To prevent stretching, try `flex: 0 1 <baseWidth>`.
