---
page_type: guide
title: Virtualize large lists with react-window
description: |
  The `React.lazy` method makes it easy to code-split a React application on a component level using dynamic imports. Use it along with Suspense to show appropriate loading states to your users.
author: houssein
web_lighthouse: N/A
web_updated_on: N/A # TODO: update
web_published_on: N/A # TODO: update
wf_blink_components: N/A
---

# Virtualize long lists with react-window

`react-window` is a library that allows large lists to be rendered efficiently.

Here's an example of a 1000 rows being rendered with `react-window`. Try scrolling as fast you can.

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/react-window?path=src/App.js&attributionHidden=true"
    alt="react-window on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## Why is this useful?

There may be times where you need to display a large table or list that contains many rows to your users. Loading every single item on a massive list can affect performance significantly.

**List virtualization**, or "windowing", is the concept of only showing a limited number content to 





```
import React from 'react';
import { FixedSizeList } from 'react-window';

import RowComponent from './RowComponent';

import items from './mock.json';
 
const Row = ({ index, style }) => (
  <RowComponent style={style} item={items[index]} index={index} />
);
 
const ListComponent = () => (
  <FixedSizeList
    height={500}
    width={500}
    itemCount={items.length}
    itemSize={120}
    className="list-container"
  >
    {Row}
  </FixedSizeList>
);

export default ListComponent;
```