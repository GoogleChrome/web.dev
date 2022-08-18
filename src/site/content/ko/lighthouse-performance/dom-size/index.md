---
layout: post
title: 과도한 DOM 크기 피하기
description: |2-

  큰 DOM이 웹 페이지의 성능을 어떻게 감소시키고 어떻게 로드 시 DOM 크기를 줄일 수 있는지 알아봅니다.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - dom-size
tags:
  - memory
---

큰 DOM 트리는 여러 가지 방법으로 페이지 성능을 저하시킬 수 있습니다.

- **네트워크 효율성 및 성능 부하**

    큰 DOM 트리에는 사용자가 처음 페이지를 로드할 때 보이지 않는 많은 노드가 포함되어 있어 사용자의 데이터 비용이 불필요하게 증가하고 로드 시간이 느려집니다.

- **런타임 성능**

    사용자와 스크립트가 페이지와 상호 작용할 때 브라우저는 [노드의 위치와 스타일](https://developers.google.com/web/fundamentals/performance/rendering/reduce-the-scope-and-complexity-of-style-calculations?utm_source=lighthouse&utm_medium=cli)을 지속적으로 다시 계산해야 합니다. 복잡한 스타일 규칙과 결합된 큰 DOM 트리는 렌더링 속도를 심각하게 저하시킬 수 있습니다.

- **메모리 성능**

    `document.querySelectorAll('li')`와 같은 일반 쿼리 선택기를 사용하는 경우 자신도 모르게 매우 많은 노드에 대한 참조를 저장하고 있을 수 있으며, 이는 사용자 장치의 메모리 용량에 과도한 부하를 줄 수도 있습니다.

## Lighthouse DOM 크기 감사가 실패하는 이유

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 페이지의 총 DOM 요소, 페이지의 최대 DOM 깊이 및 최대 하위 요소를 보고합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SUCUejhAE77m6k2WyI6D.png", alt="Lighthouse Avoids 과도한 DOM 크기 감사 스크린샷.", width="800", height="363" %}</figure>

Lighthouse는 다음과 같은 DOM 트리가 있는 페이지에 플래그를 지정합니다.

- body 요소에 ~800개 이상의 노드가 있는 경우 경고합니다.
- body 요소에 ~1,400개 이상의 노드가 있는 경우 오류가 발생합니다.

{% include 'content/lighthouse-performance/scoring.njk' %}

## DOM 크기를 최적화하는 방법

일반적으로 필요할 때만 DOM 노드를 만들고 더 이상 필요하지 않을 때 노드를 파괴하는 방법을 찾으십시오.

현재 대형 DOM 트리를 제공하는 경우 페이지를 로드하고 표시되는 노드를 수동으로 기록해 보십시오. 처음에 로드된 문서에서 표시되지 않은 노드를 제거하고 스크롤 또는 버튼 클릭과 같은 관련 사용자 상호 작용 후에만 노드를 생성하도록 할 수 있습니다.

런타임에 DOM 노드를 생성하는 경우 [하위 트리 수정 DOM 변경 중단점](https://developer.chrome.com/docs/devtools/javascript/breakpoints/#dom)을 사용하면 노드가 생성되는 시점을 정확히 찾아낼 수 있습니다.

큰 DOM 트리를 피할 수 없는 경우 렌더링 성능을 개선하기 위한 또 다른 방법은 CSS 선택기를 단순화하는 것입니다. 자세한 내용은 Google의 [스타일 계산 범위 및 복잡성 줄이기](/reduce-the-scope-and-complexity-of-style-calculations/)를 참조하세요.

## 스택별 지침

### Angular

큰 목록을 렌더링하는 경우 CDK(구성 요소 개발 키트)와 함께 [가상 스크롤](/virtualize-lists-with-angular-cdk/)을 사용합니다.

### React

- 페이지에서 반복되는 많은 요소를 렌더링하는 경우 생성되는 DOM 노드 수를 최소화하려면 [`react-window`](/virtualize-long-lists-react-window/)와 같은 "windowing" 라이브러리를 사용하십시오.
- [`shouldComponentUpdate`](https://reactjs.org/docs/optimizing-performance.html#shouldcomponentupdate-in-action) , [`PureComponent`](https://reactjs.org/docs/react-api.html#reactpurecomponent) 또는 [`React.memo`](https://reactjs.org/docs/react-api.html#reactmemo)를 사용하여 불필요한 재렌더링을 최소화하십시오.
- 런타임 성능을 개선하기 위해 `Effect` 후크를 사용하는 경우 특정 종속성이 변경될 때까지만 [효과를 건너뜁니다](https://reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects).

## 참고자료

- [**과도한 DOM 크기** 감사 방지를 위한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/dobetterweb/dom-size.js)
- [스타일 계산의 범위와 복잡성 줄이기](/reduce-the-scope-and-complexity-of-style-calculations/)
