---
layout: post
title: 使用 react-window 虚拟化大型列表
subhead: 超大的表格和列表会显著降低网站的性能。虚拟化可以提供帮助！
hero: image/admin/CVkKShuaQw4CfZBg3Eub.jpg
date: 2019-04-29
description: react-window 是一个允许高效渲染大型列表的库。
authors:
  - houssein
  - developit
feedback:
  - api
---

[`react-window`](https://react-window.now.sh/#/examples/list/fixed-size) 是一个允许高效渲染大型列表的库。

以下是一个包含 1000 行的列表示例，它使用 `react-window` 进行渲染。尝试以最快的速度滚动。

{% Glitch { id: 'react-window-fixed', path: 'src/App.js', height: 750 } %}

## 为什么这很有用？

有时您可能需要显示包含多行的大型表格或列表。加载此类列表中的每一项都会显著影响性能。

**列表虚拟化**或“窗口化”是仅渲染用户可见内容的概念。最初渲染的元素数量是整个列表的一个非常小的子集，当用户继续滚动时，可见内容的“窗口”将*移动*。这提高了列表的渲染和滚动性能。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/aWscOPGSFKVAIkgnUplQ.jpg", alt="虚拟化列表中的内容窗口", width="578", height="525" %} <figcaption>在虚拟化列表中移动内容“窗口”</figcaption></figure>

离开“窗口”的 DOM 节点会被回收，或者在用户向下滚动列表时立即被替换为更新的元素。这将使特定于窗口大小的所有渲染元素数量保持不变。

## react-window

`react-window` 是一个小型的第三方库，通过它可以更轻松地在应用程序中创建虚拟化列表。它提供了许多基本 API，可用于不同类型的列表和表格。

### 何时使用固定大小的列表

如果您有一个长长的一维列表，其中包含的项目大小相同，则使用 `FixedSizeList` 组件。

```jsx
import React from 'react';
import { FixedSizeList } from 'react-window';

const items = [...] // some list of items

const Row = ({ index, style }) => (
  <div style={style}>
     {/* define the row component using items[index] */}
  </div>
);

const ListComponent = () => (
  <FixedSizeList
    height={500}
    width={500}
    itemSize={120}
    itemCount={items.length}
  >
    {Row}
  </FixedSizeList>
);

export default ListComponent;
```

- `FixedSizeList` 组件接受 `height`、`width` 和`itemSize` 属性来控制列表中项目的大小。
- 用于渲染行的函数作为子项传递给 `FixedSizeList`。可以使用 `index` 参数 (`items[index]`) 获取特定项目的详细信息。
- 还向**必须**附加到行元素的行渲染方法传递了一个 `style` 参数。列表项通过内联分配的高度和宽度值来定位到绝对位置，`style` 参数负责此操作。

{% Aside 'caution' %} 不要通过外部 CSS 文件为列表或列表项分配 `height` 和 `width` 属性。因为这些样式属性是内联应用的，它们会被忽略。{% endAside %}

本文前面给出的 Glitch 示例显示了 `FixedSizeList` 组件的示例。

### 何时使用大小可变的列表

使用 `VariableSizeList` 组件可渲染具有不同大小的项目的列表。该组件的工作方式与固定大小的列表相同，但需要 `itemSize` 属性的函数，而不是特定值。

```jsx
import React from 'react';
import { VariableSizeList } from 'react-window';

const items = [...] // some list of items

const Row = ({ index, style }) => (
  <div style={style}>
     {/* define the row component using items[index] */}
  </div>
);

const getItemSize = index => {
  // return a size for items[index]
}

const ListComponent = () => (
  <VariableSizeList
    height={500}
    width={500}
    itemCount={items.length}
    itemSize={getItemSize}
  >
    {Row}
  </VariableSizeList>
);

export default ListComponent;
```

以下嵌入内容显示了此组件的示例。

{% Glitch { id: 'react-window-variable', path: 'src/ListComponent.js', height: 750 } %}

在此示例中，传递给 `itemSize` 属性的项目大小函数将行高随机化。然而，在实际应用中，应该有实际逻辑来定义每个项目的大小。理想情况下，这些大小应根据数据进行计算或通过 API 获取。

{% Aside %} `FixedSizeList` 和 `VariableSizeList` 组件都通过 `layout="horizontal"` 属性支持水平列表。请参见[文档](https://react-window.now.sh/#/examples/list/fixed-size)来查看示例。{% endAside %}

### 网格

`react-window` 还提供对虚拟化多维列表或网格的支持。在这个背景中，可见内容的“窗口”随着用户水平**和**垂直滚动而变化。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1j2qoGW8bFzBNiOzaJKZ.jpg", alt="在虚拟化网格中移动内容窗口是二维的", width="739", height="516"%} <figcaption>在虚拟化网格中移动内容“窗口”是二维的</figcaption></figure>

同样，根据具体列表项的大小是否会变化，可以使用 `FixedSizeGrid` 和 `VariableSizeGrid` 组件。

- 对于 `FixedSizeGrid`，API 大致相同，但需要为列和行表示高度、宽度和项目数。
- 对于 `VariableSizeGrid`，可以通过将函数而不是值传递给相应的属性来更改列宽和行高。

请参见[文档](https://react-window.now.sh/#/examples/grid/fixed-size)以查看虚拟化网格的示例。

{% Aside %} 除了提供用于创建高效列表和网格的基本组件之外， `react-window` 还提供其他功能，例如滚动到特定项目或在用户滚动时提供指示器。此[文档](https://react-window.now.sh/#/examples/list/scrolling-indicators)提供了相关示例。{% endAside %}

## 滚动时延迟加载

许多网站为了提高性能，会等待用户向下滚动，然后才加载和渲染长列表中的项目。这种技术通常称为“无限加载”，当用户滚动到接近末尾的某个阈值时，将新的 DOM 节点添加到列表中。虽然这比一次加载列表中的所有项目要好，但如果用户滚动多行，最终仍会用数千行条目填充 DOM。这会导致 DOM 过大，使样式计算和 DOM 变化变慢，进而开始影响性能。

下图可能有助于总结这种情况：

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dKuKVjP02xWxO9LPoOuc.jpg", alt="常规列表和虚拟化列表之间的滚动差异", width="800", height="531" %} <figcaption>常规列表和虚拟化列表之间的滚动差异</figcaption></figure>

解决这个问题的最佳方法是继续使用 `react-window` 这样的库在页面上保持一个小的元素“窗口”，但在用户向下滚动时延迟加载新条目。一个单独的软件包 `react-window-infinite-loader` 通过 `react-window` 实现了这一点。

考虑以下代码段，它展示了在父 `App` 组件中管理的状态的示例。

```jsx
import React, { Component } from 'react';

import ListComponent from './ListComponent';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [], // instantiate initial list here
      moreItemsLoading: false,
      hasNextPage: true
    };

    this.loadMore = this.loadMore.bind(this);
  }

  loadMore() {
   // method to fetch newer entries for the list
  }

  render() {
    const { items, moreItemsLoading, hasNextPage } = this.state;

    return (
      <ListComponent
        items={items}
        moreItemsLoading={moreItemsLoading}
        loadMore={this.loadMore}
        hasNextPage={hasNextPage}
      />
    );
  }
}

export default App;
```

`loadMore` 方法被传递到包含无限加载器列表的子 `ListComponent` 中。此行为很重要，因为一旦用户滚动超过某个特定点，无限加载器就需要触发回调以加载更多项目。

以下是用于渲染列表的 `ListComponent` 的样子：

```jsx
import React from 'react';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from "react-window-infinite-loader";

const ListComponent = ({ items, moreItemsLoading, loadMore, hasNextPage }) => {
  const Row = ({ index, style }) => (
     {/* define the row component using items[index] */}
  );

  const itemCount = hasNextPage ? items.length + 1 : items.length;

  return (
    <InfiniteLoader
      isItemLoaded={index => index < items.length}
      itemCount={itemCount}
      loadMoreItems={loadMore}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          height={500}
          width={500}
          itemCount={itemCount}
          itemSize={120}
          onItemsRendered={onItemsRendered}
          ref={ref}
        >
          {Row}
        </FixedSizeList>
      )}
  </InfiniteLoader>
  )
};

export default ListComponent;
```

这里，`FixedSizeList` 组件包装在 `InfiniteLoader` 中。分配给加载器的属性为：

- `isItemLoaded`：用于检查是否已加载某个项目的方法
- `itemCount`：列表中的项目数（或预期）
- `loadMoreItems`：返回一个 promise 的回调，该 promise 解析为列表的附加数据

使用一个[渲染属性](https://reactjs.org/docs/render-props.html#using-props-other-than-render)返回列表组件用于渲染的函数。`onItemsRendered` 和 `ref` 属性都是需要传递的属性。

以下是无限加载如何处理虚拟化列表的示例。

{% Glitch { id: 'react-window-infinite', path: 'src/ListComponent.js', height: 750 } %}

向下滚动列表可能会有同样的感受，但现在每次滚动到接近列表末尾时，都会请求从[随机用户 API](https://randomuser.me/) 中检索 10 个用户。这一切都是在一次只渲染一个结果“窗口”的情况下完成的。

通过检查特定项目的 `index`，可以根据是否已请求更新条目以及该项目是否仍在加载来显示项目的不同加载状态。

例如：

```js
const Row = ({ index, style }) => {
  const itemLoading = index === items.length;

  if (itemLoading) {
      // return loading state
  } else {
      // return item
  }
};
```

## 过扫描

由于虚拟化列表中的项目仅在用户滚动时更改，因此当即将显示更新条目时，空白区域可能会短暂闪烁。尝试快速滚动本指南前面的任何示例就会注意到这个现象。

为了改善虚拟化列表的用户体验，`react-window` 允许通过 `overscanCount` 属性对项目过扫描。这样可以定义在可见“窗口”外部始终渲染的项目数。

```jsx
<FixedSizeList
  //...
  overscanCount={4}
>
  {...}
</FixedSizeList>
```

`overscanCount` 适用于 `FixedSizeList` 和 `VariableSizeList` 组件，默认值为 1。根据列表的大小以及每个项目的大小，过扫描多个条目有助于防止在用户滚动时出现明显闪烁的空白区域。但是，过扫描太多条目会对性能产生负面影响。使用虚拟化列表的全部意义在于最大限度地减少用户在任何给定时刻可以看到的条目数量，所以尽量使过扫描的项目数尽可能少。

对于 `FixedSizeGrid` 和`VariableSizeGrid`，使用 `overscanColumnsCount` 和 `overscanRowsCount` 属性分别控制要过扫描的列数和行数。

## 结论

如果您不确定从哪里开始虚拟化应用程序中的列表和表格，请按照以下步骤操作：

1. 测量渲染和滚动性能。这篇[文章](https://addyosmani.com/blog/react-window/)展示了如何使用 Chrome DevTools 中的 [FPS meter](https://developer.chrome.com/docs/devtools/evaluate-performance/#analyze_frames_per_second) 来探索列表上的项目的渲染效率。
2. 对于任何会影响性能的长列表或网格，包含 `react-window`
3. 如果 `react-window` 不支持某些功能，并且您无法自己添加此功能，请考虑使用 [`react-virtualized`](https://github.com/bvaughn/react-virtualized)。
4. 如果需要在用户滚动时延迟加载项目，则使用 `react-window-infinite-loader` 包装虚拟化列表。
5. 使用列表的 `overscanCount` 属性以及网格的  `overscanColumnsCount` 和 `overscanRowsCount` 属性来防止出现闪烁的空白内容。不要过扫描太多条目，因为这会对性能产生负面影响。
