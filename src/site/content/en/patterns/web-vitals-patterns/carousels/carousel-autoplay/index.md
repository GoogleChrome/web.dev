---
layout: pattern
title: Autoplay carousel
description: A no-layout autoplay carousel
date: 2021-08-17
---

This carousel uses [CSS scroll snap](https://web.dev/css-scroll-snap/) to create
smooth, performant slide transitions that do not cause layout shifts.

This carousel can be navigated in a variety of ways: in addition to navigation controls, it supports keyboard navigation and swiping.

To maximize usability and readability, the carousel stops auto-transitioning once the user mouseovers within the carousel area.