---
layout: codelab
title: "Intrinsic Navbar Sandbox"
authors:
  - adamargyle
description:
glitch: intrinsic-layout-nav
path: app/css/layouts/nav.css
previewSize: 70
related_post: codelab-intrinsic-layout-nav
---

{% Aside 'objective' %}
  Grok `min-content` vs `max-content`
{% endAside %}

This is a playground where you can try or break anything regarding the navbar layout! Play, poke and explore 👍

There are a couple of specific things I'd like to encourage you to do that I think really help solidify certain aspects of `min-content` and `max-content`. If you're down, give these few things a try.

View the code for `app/css/layouts/nav.css` to follow along with the tasks

### Task 1
› Flip flop min-content for max-content for the brand name
1. Line 6 is the `grid-template-column` definition, change the 2nd columns definition to `minmax(max-content, var(--sidebar-width))`
1. **Resize the viewport** to see how the brand name reflows (or doesn't) when space get's constrained

### Task 2
› Flip flop min-content for max-content for the search bar
1. Line 6 is the `grid-template-column` definition, change the 3rd columns definition to `minmax(max-content, var(--search-width))`
1. **Resize the viewport** to see how the search bar reflows (or doesn't) when space get's constrained or available

### Task 3
› Play with liquid values for the flex column
1. Line 6 is the `grid-template-column` definition, change the 4th columns definition to one of the following: auto, 100%, min-content, max-content, 1000000fr
1. **Resize the viewport** to see how the brand name reflows (or doesn't) when space get's constrained

Hopefully this codelab helped make tangible some aspects of intrinsic design. Our content has intrinsic value and these keywords help us leverage or ignore those values. I've found through tangible play that I was able to retain and understand more about the technique.
