---
layout: post
title: react-window로 대형 리스트 가상화
subhead: 초대형 테이블과 리스트는 사이트 성능을 현저히 저하시킬 수 있습니다. 가상화가 도움이 될 수 있습니다!
hero: image/admin/CVkKShuaQw4CfZBg3Eub.jpg
date: 2019-04-29
description: react-window는 대형 리스트를 효율적으로 렌더링할 수 있는 라이브러리입니다.
authors:
  - houssein
  - developit
feedback:
  - api
---

[`react-window`](https://react-window.now.sh/#/examples/list/fixed-size)는 대형 리스트를 효율적으로 렌더링할 수 있는 라이브러리입니다.

`react-window`로 렌더링되는 1000개의 행을 포함하는 리스트의 예입니다. 최대한 빠르게 스크롤하세요.

{% Glitch { id: 'react-window-fixed', path: 'src/App.js', height: 750 } %}

## 이것이 왜 유용한가요?

많은 행이 포함된 큰 테이블이나 리스트를 표시해야 하는 경우가 있습니다. 이러한 리스트의 모든 단일 항목을 로드하면 성능에 상당한 영향을 미칠 수 있습니다.

**목록 가상화** 또는 "윈도잉"은 사용자에게 보이는 것만 렌더링하는 개념입니다. 먼저 렌더링되는 요소의 수는 전체 목록의 아주 작은 부분 집합이며 사용자가 스크롤을 계속하는 경우 보이는 콘텐츠의 "창"이 *움직입니다*. 이렇게 하면 리스트의 렌더링 및 스크롤 성능이 모두 향상됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/aWscOPGSFKVAIkgnUplQ.jpg", alt="가상화된 리스트의 콘텐츠 창", width="578", height="525" %}<figcaption> 가상화된 리스트에서 콘텐츠 "창" 이동</figcaption></figure>

"창"을 종료하는 DOM 노드는 재활용되거나 사용자가 목록을 아래로 스크롤할 때 새로운 요소로 즉시 교체됩니다. 이렇게 하면 창 크기에 따라 렌더링된 모든 요소의 수가 유지됩니다.

## react-window

`react-window`는 애플리케이션에서 가상화된 목록을 쉽게 생성할 수 있게 해주는 작은 서드 파티 라이브러리입니다. 다양한 유형의 목록 및 테이블에 사용할 수 있는 여러 기본 API를 제공합니다.

### 고정 크기 리스트를 사용하는 경우

동일한 크기의 항목으로 구성된 긴 1차원 리스트가 있는 경우 `FixedSizeList` 구성 요소를 사용하세요.

```jsx
import React from 'react';
import { FixedSizeList } from 'react-window';

const items = [...] // 일부 항목 리스트

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

- `FixedSizeList` 구성 요소는 `height` , `width` 및 `itemSize` 속성을 사용하여 리스트 내의 항목 크기를 제어합니다.
- 행을 렌더링하는 함수는 자식으로 `FixedSizeList`에 전달됩니다. 특정 항목에 대한 세부 정보는 `index` 인수(`items[index]`)를 사용하여 액세스할 수 있습니다.
- `style` 매개변수는 행 요소에 첨부**되어야** 하는 행 렌더링 메서드에도 전달됩니다. 리스트 항목은 인라인으로 할당된 높이 및 너비 값으로 절대적으로 배치되며 `style` 매개변수가 이를 담당합니다.

{% Aside 'caution' %} 외부 CSS 파일이 있는 리스트 또는 리스트 항목에 `height` 및 `width` 속성을 할당하지 마세요. 이러한 스타일 속성은 인라인으로 적용된다는 사실 때문에 무시됩니다. {% endAside %}

이 문서의 앞부분에 나와 있는 Glitch 예는  `FixedSizeList` 구성 요소의 예를 보여줍니다.

### 가변 크기 리스트를 사용해야 하는 경우

`VariableSizeList` 구성 요소를 사용하여 크기가 다른 항목 리스트를 렌더링합니다. 이 구성 요소는 고정 크기 리스트와 같은 방식으로 작동하지만 대신 특정 값 대신 `itemSize` 속성에 대한 기능을 요구합니다.

```jsx
import React from 'react';
import { VariableSizeList } from 'react-window';

const items = [...] // 일부 항목 리스트

const Row = ({ index, style }) => (
  <div style={style}>
     {/* define the row component using items[index] */}
  </div>
);

const getItemSize = index => {
  // 아이템 크기 반환[지수]
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

다음 삽입된 예는 이 구성요소의 예를 보여줍니다.

{% Glitch { id: 'react-window-variable', path: 'src/ListComponent.js', height: 750 } %}

`itemSize` 속성에 전달된 항목 크기 함수는 이 예제에서 행 높이를 무작위로 지정합니다. 그러나 실제 애플리케이션에는 각 항목의 크기를 정의하는 실제 논리가 있어야 합니다. 이상적으로는 이러한 크기는 데이터를 기반으로 계산하거나 API에서 가져와야 합니다.

{% Aside %} `FixedSizeList` 및 `VariableSizeList` 구성요소 모두 `layout="horizontal"` 속성을 사용하여 수평 리스트를 지원합니다. 예제를 보려면 [설명서](https://react-window.now.sh/#/examples/list/fixed-size)를 살펴보세요. {% endAside %}

### 그리드

`react-window` 는 또한 다차원 리스트 또는 그리드 가상화를 지원합니다. 이 컨텍스트에서 표시되는 콘텐츠의 "창"은 사용자가 가로 **및** 세로로 스크롤할 때 변경됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/1j2qoGW8bFzBNiOzaJKZ.jpg", alt="가상화된 그리드에서 콘텐츠 이동 창은 2차원적입니다.", width="739", height="516" %}<figcaption> 가상화된 그리드에서 콘텐츠의 "창" 이동은 2차원적입니다.</figcaption></figure>

마찬가지로, 특정 리스트 항목의 크기가 다양할 수 있는지 여부에 따라 `FixedSizeGrid` 및 `VariableSizeGrid` 구성 요소 모두 사용될 수 있습니다.

- `FixedSizeGrid`의 경우 API는 거의 동일하지만 열과 행 모두에 대해 높이, 너비 및 항목 수를 표시해야 합니다.
- `VariableSizeGrid`의 경우 각각의 속성에 값 대신 함수를 전달하여 열 너비와 행 높이를 모두 변경할 수 있습니다.

가상화된 그리드의 예를 보려면 [설명서](https://react-window.now.sh/#/examples/grid/fixed-size)를 살펴보세요.

{% Aside %} 효율적인 리스트와 그리드를 만들기 위한 기본 구성요소를 제공하는 것 외에도 `react-window`는 특정 항목으로 스크롤하거나 사용자가 스크롤할 때 표시기를 제공하는 것과 같은 다른 기능도 제공합니다. [설명서](https://react-window.now.sh/#/examples/list/scrolling-indicators)는 이에 대한 예를 제공합니다. {% endAside %}

## 스크롤 시 지연 로딩

많은 웹 사이트는 사용자가 아래로 스크롤할 때까지 긴 리스트의 항목을 로드하고 렌더링하기를 대기하여 성능을 향상시킵니다. 일반적으로 "무한 로드"라고 하는 이 기술은 사용자가 끝 부분에 가까운 특정 임계값을 지나 스크롤할 때 새 DOM 노드를 목록에 추가합니다. 이것이 목록의 모든 항목을 한 번에 로드하는 것보다 낫지만 사용자가 그 이상의 행 항목을 스크롤한 경우 여전히 수천 개의 행 항목으로 DOM을 채우게 됩니다. 이로 인해 DOM 크기가 지나치게 커져 스타일 계산 및 DOM 변형을 느리게 만들어 성능에 영향을 미치기 시작할 수 있습니다.

다음 다이어그램은 이를 요약하는 데 도움이 될 수 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/dKuKVjP02xWxO9LPoOuc.jpg", alt="일반 리스트와 가상화 리스트의 스크롤 차이", width="800", height="531" %}<figcaption> 일반 리스트와 가상화 리스트 간의 스크롤 차이</figcaption></figure>

이 문제를 해결하는 가장 좋은 방법은 `react-window` 와 같은 라이브러리를 계속 사용하여 페이지에 있는 요소의 "창"을 작게 유지하고 사용자가 아래로 스크롤할 때 최신 항목을 지연 로드하는 것입니다. 별도의 패키지인 `react-window-infinite-loader`은 `react-window`로 이를 가능하게 합니다.

`App` 구성 요소에서 관리되는 상태의 예를 보여주는 다음 코드를 고려하세요.

```jsx
import React, { Component } from 'react';

import ListComponent from './ListComponent';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [], // 여기에 초기 리스트 인스턴트화
      moreItemsLoading: false,
      hasNextPage: true
    };

    this.loadMore = this.loadMore.bind(this);
  }

  loadMore() {
   // 리스트에 대한 새로운 엔트리를 가져오기 위한 메서드
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

`loadMore` 메서드는 무한 로더 리스트를 포함하는 자식인 `ListComponent`로 이를 전달합니다. 무한 로더는 사용자가 특정 지점을 스크롤한 후 더 많은 항목을 로드하기 위해 콜백을 실행해야 하기 때문에 중요합니다.

목록을 렌더링하는 `ListComponent` 모양은 다음과 같습니다.

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

여기에서 `FixedSizeList` 구성 요소는 `InfiniteLoader` 내에 래핑됩니다. 로더에 할당된 속성은 다음과 같습니다.

- `isItemLoaded` : 특정 항목이 로드되었는지 확인하는 메서드
- `itemCount` : 리스트(또는 예상)의 항목 수
- `loadMoreItems` : 리스트에 대한 추가 데이터로 resolve 하는 약속을 반환하는 콜백

[렌더링 속성](https://reactjs.org/docs/render-props.html#using-props-other-than-render)은 리스트 구성 요소가 렌더링하기 위해 사용하는 함수를 반환하는 데 사용됩니다. `onItemsRendered` 및 `ref` 속성은 모두 전달해야 하는 속성입니다.

다음은 가상화된 리스트에서 무한 로딩이 작동하는 방법의 예입니다.

{% Glitch { id: 'react-window-infinite', path: 'src/ListComponent.js', height: 750 } %}

리스트를 아래로 스크롤해도 같은 느낌이 들 수 있지만 이제 리스트의 끝까지 스크롤할 때마다 [임의의 사용자 API](https://randomuser.me/)에서 10명의 사용자를 검색하라는 요청이 만들어집니다. 한 번에 하나의 결과 "창"만 렌더링하는 동안 이 모든 작업이 수행됩니다.

특정 항목의 `index`를 확인하면 최신 항목에 대한 요청이 있었고 항목이 아직 로드 중인지 여부에 따라 항목에 대해 다른 로드 상태가 표시될 수 있습니다.

예를 들면 다음과 같습니다.

```js
const Row = ({ index, style }) => {
  const itemLoading = index === items.length;

  if (itemLoading) {
      // 로드 상태 반환
  } else {
      // 항목 반환
  }
};
```

## 오버스캔

가상화된 리스트의 항목은 사용자가 스크롤할 때만 변경되기 때문에 새 항목이 표시될 때 빈 공간이 잠시 깜박일 수 있습니다. 이 가이드의 이전 예제를 빠르게 스크롤하여 이를 확인할 수 있습니다.

가상화된 리스트의 사용자 경험을 개선하기 위해 `react-window`로 `overscanCount` 속성을 사용해 항목을 오버스캔할 수 있습니다. 이를 통해 표시되는 "창" 외부에 항상 렌더링할 항목 수를 정의할 수 있습니다.

```jsx
<FixedSizeList
  //...
  overscanCount={4}
>
  {...}
</FixedSizeList>
```

`overscanCount`는 `FixedSizeList` 및 `VariableSizeList` 구성 요소 모두에서 작동하며 기본값은 1입니다. 리스트의 크기와 각 항목의 크기에 따라 둘 이상의 항목을 오버스캔하면 사용자가 스크롤 할 때 빈 공간이 눈에 띄게 깜박이는 것을 방지할 수 있습니다. 그러나 너무 많은 항목을 오버스캔하면 성능에 부정적인 영향을 줄 수 있습니다. 가상화된 리스트을 사용하는 목적은 주어진 순간에 사용자가 볼 수 있는 항목 수를 최소화하는 것이므로 오버스캔된 항목의 수를 가능한 한 적게 유지하기 위해 노력합니다.

`FixedSizeGrid` 및 `VariableSizeGrid`의 경우, `overscanColumnsCount` 및 `overscanRowsCount` 속성을 사용하여 각각 오버스캔할 열과 행 수를 제어합니다.

## 결론

애플리케이션에서 리스트 및 테이블 가상화를 어디서 시작해야 할지 잘 모르겠다면 다음 단계를 따르세요.

1. 렌더링 및 스크롤링 성능을 측정합니다. 이 [문서](https://addyosmani.com/blog/react-window/)에서는 Chrome DevTools의 [FPS meter](https://developer.chrome.com/docs/devtools/evaluate-performance/#analyze_frames_per_second)를 사용하여 항목이 리스트에서 얼마나 효율적으로 렌더링되는지 탐색하는 방법을 보여줍니다.
2. 성능에 영향을 미치는 긴 리스트 또는 그리드에 대한`react-window`를 포함합니다.
3. `react-window`에서 지원하지 않는 특정 기능이 있는 경우 이 기능을 직접 추가할 수 없다면 [`react-virtualized`](https://github.com/bvaughn/react-virtualized) 사용을 고려하세요.
4. 사용자가 스크롤할 때 항목을 지연 로드해야 하는 경우 가상화된 리스트를 `react-window-infinite-loader`로 래핑하세요.
5. 리스트에 `overscanCount` 속성을 사용하고 그리드에 `overscanColumnsCount` 및 `overscanRowsCount` 속성을 사용하여 빈 콘텐츠가 깜박이는 것을 방지합니다. 너무 많은 항목을 오버스캔하면 성능에 부정적인 영향을 미치므로 너무 많이 오버스캔하지 마세요.
