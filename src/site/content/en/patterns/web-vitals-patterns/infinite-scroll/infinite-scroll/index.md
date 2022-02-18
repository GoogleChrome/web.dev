---
layout: pattern
title: Infinite scroll
description: In this implementation of infinite scroll there
  are never any layout shifts - regardless of how long it takes the server to
  respond with new content.
date: 2021-08-18
updated: 2021-08-18
height: 500
---

This infinite scroll implementation is designed to ensure that there are never any
layout shifts - regardless of how long it takes the server to respond with new content.

One of the most common issues with many infinite scroll implementations is that
the page footer (or similar UX element) gets pushed further down the page
whenever new items are added. With this infinite scroll implementation, this
never occurs.

**High-level approach**

Whenever possible, new items are inserted into the page before the user reaches
them. Because this insertion happens offscreen (and is not visible to the user),
the user experiences no layout shifts.

In the event that new content cannot be inserted in time, a "Show More" button
is displayed instead. However, the button is enabled only when new items are
ready to be displayed - this ensures that the user does not click the button
only to find that nothing happens. Thus, regardless of how slowly the server
responds with new content (or how quickly the user scrolls), there will never be
any unexpected layout shifts.

**Implementation**

The [Intersection Observer
API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API)
is a performant way of monitoring the position and visibility of page
elements. This design is implemented using two separate intersertion observers:
- `listObserver` observes the position of the `#infinite-scroll-button` that is
  located at the end of the infinite scroll list. When the button is nearing the
  viewport, uninserted content is added to the DOM.
- `sentinelObserver` observes the position of the `#sentinel` element. When the
  sentinel becomes visible, more content is requested from the server. Adjusting
  the position of the sentinel is a way of controlling how far in advance that
  new content should be requested from the server.


This is not the only way to address layout shifts stemming
from use of infinite scroll. Other ways to approach this problem include
switching to pagination, using list virtualization, and adjusting page layouts.
