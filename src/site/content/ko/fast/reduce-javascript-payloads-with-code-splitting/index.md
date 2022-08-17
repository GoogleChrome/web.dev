---
layout: post
title: 코드 분할로 JavaScript 페이로드 줄이기
authors:
  - houssein
description: 대용량 JavaScript 페이로드를 보내면 사이트 속도에 상당한 영향을 미칩니다. 애플리케이션의 첫 페이지가 로드되는 즉시 모든 JavaScript를 사용자에게 제공하는 대신 번들을 여러 조각으로 나누고 맨 처음에 필요한 것만 보내십시오.
date: 2018-11-05
codelabs:
  - codelab-code-splitting
tags:
  - performance
---

기다리는 것을 좋아하는 사람은 없습니다. **[사용자의 50% 이상이 로드하는 데 3초 이상 걸리는 경우 웹사이트를 이탈합니다](https://www.thinkwithgoogle.com/intl/en-154/insights-inspiration/research-data/need-mobile-speed-how-mobile-latency-impacts-publisher-revenue/)**.

대용량 JavaScript 페이로드를 보내면 사이트 속도에 상당한 영향을 미칩니다. 애플리케이션의 첫 페이지가 로드되는 즉시 모든 JavaScript를 사용자에게 제공하는 대신 번들을 여러 조각으로 나누고 맨 처음에 필요한 것만 보내십시오.

## 측정

Lighthouse는 페이지에서 모든 JavaScript를 실행하는 데 상당한 시간이 걸리면 실패한 감사라고 표시합니다.

{% Img src="image/admin/p0Ahh3pzXog3jPdDp6La.png", alt="실행하는 데 너무 오래 걸리는 스크립트를 보여주는 실패한 Lighthouse 감사.", width="797", height="100" %}

사용자가 애플리케이션을 로드할 때 초기 경로에 필요한 코드만 보내도록 JavaScript 번들을 분할합니다. 이렇게 하면 구문 분석 및 컴파일해야 하는 스크립트의 양이 최소화되어 페이지 로드 시간이 빨라집니다.

[webpack](https://parceljs.org/code_splitting.html), [Parcel](https://rollupjs.org/guide/en#dynamic-import), [Rollup](https://webpack.js.org/guides/code-splitting/)과 같은 인기 있는 모듈 번들러를 사용하면 [동적 가져오기](https://v8.dev/features/dynamic-import)를 사용하여 번들을 분할할 수 있습니다. 예를 들어 양식이 제출될 때 실행되는 `someFunction` 메소드의 예를 보여주는 다음 코드 스니펫을 고려하십시오.

```js
import moduleA from "library";

form.addEventListener("submit", e => {
  e.preventDefault();
  someFunction();
});

const someFunction = () => {
  // uses moduleA
}
```

여기에서 `someFunction`은 특정 라이브러리에서 가져온 모듈을 사용합니다. 이 모듈이 다른 곳에서 사용되지 않는 경우 동적 가져오기를 사용하여 사용자가 양식을 제출한 경우에만 가져오도록 코드 블록을 수정할 수 있습니다.

```js/2-5
form.addEventListener("submit", e => {
  e.preventDefault();
  import('library.moduleA')
    .then(module => module.default) // using the default export
    .then(someFunction())
    .catch(handleError());
});

const someFunction = () => {
    // uses moduleA
}
```

모듈을 구성하는 코드는 초기 번들에 포함되지 않고 이제 **지연 로드**되거나 양식 제출 후 필요할 때만 사용자에게 제공됩니다. 페이지 성능을 더욱 향상시키려면 [중요한 청크를 미리 로드하여 우선순위를 지정하고 더 빨리 가져오세요](/preload-critical-assets).

이전 코드 스니펫은 간단한 예이지만 지연 로드 타사 종속성은 대규모 애플리케이션에서 일반적인 패턴이 아닙니다. 일반적으로 타사 종속성은 자주 업데이트되지 않기 때문에 캐시될 수 있는 별도의 공급업체 번들로 분할됩니다. [**SplitChunksPlugin**](https://webpack.js.org/plugins/split-chunks-plugin/)이 이를 어떻게 도울 수 있는지 자세히 알아볼 수 있습니다.

클라이언트 측 프레임워크를 사용할 때 경로 또는 구성 요소 수준에서 분할하는 것은 애플리케이션의 다른 부분을 지연 로드하는 더 간단한 방법입니다. 웹팩(webpack)을 사용하는 많은 인기 프레임워크는 구성을 직접 살펴보는 것보다 지연 로딩을 쉽게 하기 위해 추상화를 제공합니다.
