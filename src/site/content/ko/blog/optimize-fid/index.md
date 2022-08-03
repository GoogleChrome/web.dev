---
title: 최초 입력 지연 최적화
subhead: 사용자 상호 작용에 더 빨리 응답하는 방법
authors:
  - houssein
  - addyosmani
date: 2020-05-05
updated: 2022-07-18
hero: image/admin/WH0KlcJXJlxvsxU9ow2i.jpg
alt: 스마트폰 화면을 만지는 손
description: First Input Delay(최초 입력 지연, FID)는 사용자가 사이트에 처음 상호 작용한 시간부터 브라우저가 실제로 해당 상호 작용에 응답할 수 있었던 시간까지를 측정합니다. 사용하지 않는 JavaScript를 최소화하고, 긴 작업을 분리하고, 상호 작용 준비를 개선하여 FID를 최적화하는 방법을 알아봅니다.
tags:
  - blog
  - performance
  - web-vitals
---

<blockquote>
  <p>분명히 클릭했는데 아무 일도 없잖아! 이 페이지와 상호 작용할 수 없는 이유가 뭐지? 😢</p>
</blockquote>

[First Contentful Paint(최초 콘텐츠풀 페인트, FCP)](/fcp/) 및 [Largest Contentful Paint(최대 콘텐츠풀 페인트, LCP)](/lcp/)는 모두 콘텐츠가 페이지에서 시각적으로 렌더링(페인트)하는 데 걸리는 시간을 측정하는 메트릭입니다. 페인트 시간은 중요하긴 하지만 *로드 응답성* 또는 페이지가 사용자 상호 작용에 얼마나 빨리 응답하는지는 포착하지 않습니다.

[First Input Delay](/fid/)(최초 입력 지연, FID)는 사이트의 상호 작용 및 응답성에 대한 사용자의 첫인상을 포착하는 [Core Web Vitals](/vitals/) 메트릭으로, 사용자가 페이지와 처음 상호 작용한 시점부터 브라우저가 실제로 해당 상호 작용에 응답한 시점까지의 시간을 측정합니다. FID는 [필드 메트릭](/user-centric-performance-metrics/#in-the-field)이며 실험실 환경에서 시뮬레이션할 수 없습니다. 응답 지연을 측정하려면 **실제 사용자 상호 작용**이 필요하기 때문입니다.

  <picture>
    <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eXyvkqRHQZ5iG38Axh1Z.svg" | imgix }}" media="(min-width: 640px)">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Se4TiXIdp8jtLJVScWed.svg", alt="좋은 fid 값은 2.5초이고, 나쁨 값은 4.0초보다 크며 그 사이에는 개선이 필요합니다.", width="384", height="96" %}
  </picture>

[실험실](/how-to-measure-speed/#lab-data-vs-field-data)에서 FID를 예측하는 데 활용할 만한 메트릭은 [Total Blocking Time(총 차단 시간, TBT)](/tbt/)입니다. 둘은 서로 다른 부분을 측정하지만, TBT를 개선하면 일반적으로 FID도 개선됩니다.

열악한 FID의 주요 원인은 **과도한 JavaScript 실행**입니다. JavaScript가 웹 페이지에서 구문 분석, 컴파일 및 실행하는 방식을 최적화하면 FID가 감소합니다.

## 집약적 JavaScript 실행

브라우저는 메인 스레드에서 JavaScript를 실행하는 동안 대부분의 사용자 입력에 응답할 수 없습니다. 즉, 메인 스레드가 사용 중인 경우 브라우저는 사용자 상호 작용에 응답할 수 없다는 의미입니다. 이를 개선하기 위한 방법은 다음과 같습니다.

- [긴 작업 세분화](#long-tasks)
- [상호 작용 준비를 위해 페이지 최적화](#optimize-interaction-readiness)
- [웹 작업자 사용](#use-a-web-worker)
- [JavaScript 실행 시간 단축](#reduce-javascript-execution)

## 긴 작업 세분화 {: #long-tasks }

단일 페이지에 로드되는 JavaScript를 줄이는 방법을 이미 시도했다면, 장기 실행 코드를 **더 작은 비동기 작업**으로 세분화하는 방법이 유용할 수도 있습니다.

[**긴 작업**](/custom-metrics/#long-tasks-api)이란 사용자가 UI가 응답하지 않는다는 것을 발견할 수 있는 JavaScript 실행 기간입니다. 50ms 이상 메인 스레드를 차단하는 모든 코드는 긴 작업이라고 볼 수 있으며 사용자가 현재 필요로 하는 것보다 더 많은 것을 로드 및 실행해 JavaScript가 팽창할 가능성이 있음을 나타내는 신호일 수 있습니다. 그러므로 긴 작업을 분할하면 사이트의 입력 지연을 줄일 수 있습니다.

<figure>{% Img src="image/admin/THLKu0sOPhSghNr0XkP1.png", alt="Chrome DevTools의 긴 작업", width="800", height="132" %} <figcaption>Chrome DevTools의 Performance 패널에서 <a href="https://developers.google.com/web/updates/2020/03/devtools#long-tasks">긴 작업을 시각화</a>한 모습</figcaption></figure>


<figure>
  {% Img src="image/admin/THLKu0sOPhSghNr0XkP1.png", alt="Chrome DevTools의 긴 작업", width="800", height="132" %}
  <figcaption>Chrome DevTools의 Performance 패널에서 <a href="https://developers.google.com/web/updates/2020/03/devtools#long-tasks">긴 작업을 시각화</a>한 모습</figcaption>
</figure>

FID는 코드 분할 및 긴 작업 세분화와 같은 모범 사례를 채택하면 눈에 띄게 개선됩니다. TBT는 필드 메트릭이 아니지만 궁극적으로 Time To Interactive(상호 작용까지의 시간, TTI)와 FID를 모두 개선하기 위한 진행 상황을 확인하는 데 유용합니다.

{% Aside %} 자세한 내용은 [긴 JavaScript 작업으로 인해 상호 작용까지의 시간이 지연되나요?](/long-tasks-devtools/)를 참조하세요. {% endAside %}

## 상호 작용 준비를 위해 페이지 최적화

JavaScript에 크게 의존하는 웹 앱에서 FID 및 TBT 점수가 좋지 않은 일반적인 원인에는 여러 가지가 있습니다.

### 자사 스크립트 실행으로 상호 작용 준비가 지연될 수 있음

- JavaScript 크기 팽창, 과도한 실행 시간 및 비효율적인 청크로 인해 페이지가 사용자 입력에 응답하고 FID, TBT 및 TTI에 영향을 미치는 속도가 느려질 수 있습니다. 코드와 기능을 점진적으로 로드하면 이 작업을 분산하고 상호 작용 준비를 개선하는 데 도움이 될 수 있습니다.
- 서버 측에서 렌더링된 앱은 화면에 픽셀이 빠르게 그려지는 것처럼 보일 수 있지만 대규모 스크립트 실행(예: 이벤트 리스너를 연결하기 위한 원상 회복)으로 인해 사용자 상호 작용이 차단될 수도 있다는 점에 유의해야 합니다. 경로 기반 코드 분할을 사용하는 경우 수백 밀리초, 때로는 몇 초가 소요될 수 있습니다. 더 많은 논리를 서버 측으로 이동하거나 빌드 시간 동안 더 많은 콘텐츠를 고정적으로 생성하도록 하는 것이 좋습니다.

다음은 애플리케이션에 대한 자사 스크립트 로딩을 최적화하기 전과 후의 TBT 점수입니다. 중요하지 않은 구성 요소에 대해 비용이 많이 드는 스크립트 로드(및 실행)를 이동함으로써 사용자는 페이지와 훨씬 더 빨리 상호 작용할 수 있게 되었습니다.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TEIbBnIAyfzIoQtvXvMk.png", alt="자사 스크립트 최적화 후 개선된 Lighthouse의 TBT 점수.", width="800", height="148" %}

### 상호 작용 준비의 여러 측면에 영향을 주는 데이터 가져오기

- 계속해서 이어지는 계단식 가져오기(예: 구성 요소에 대한 JavaScript 및 데이터 가져오기)를 기다리는 것은 상호 작용 지연 시간에 영향을 줄 수 있습니다. 그러므로 계단식 데이터 가져오기에 대한 의존도를 최소화하는 것을 목표로 하세요.
- 대규모 인라인 데이터 저장소는 HTML 구문 분석 시간을 늘려 페인트 및 상호 작용 메트릭 모두에 영향을 줄 수 있습니다. 클라이언트 측에서 후처리해야 하는 데이터의 양을 최소화하는 것을 목표로 하세요.

### 상호 작용 지연 시간을 늦출 수 있는 타사 스크립트 실행

- 많은 사이트에는 네트워크를 계속 바쁘게 유지하고 메인 스레드가 주기적으로 응답하지 않도록 하여 상호 작용 대기 시간에 영향을 줄 수 있는 타사 태그 및 분석이 포함되어 있습니다. 타사 코드의 주문형 로드를 탐색해보세요(예: 뷰포트에 더 가깝게 스크롤될 때까지 스크롤해야 볼 수 있는 광고를 로드하지 않을 수 있음).
- 경우에 따라 타사 스크립트가 메인 스레드의 우선순위 및 대역폭 측면에서 자사 스크립트보다 앞에 올 수 있으며, 이 경우 페이지에서 상호 작용 준비를 마치는 시간도 지연됩니다. 사용자에게 가장 큰 가치를 제공하는 부분을 먼저 로드하도록 우선순위를 정하세요.

## 웹 작업자 사용

차단된 메인 스레드는 입력 지연의 주요 원인 중 하나입니다. [웹 작업자](https://developer.mozilla.org/docs/Web/API/Worker)를 사용하면 백그라운드 스레드에서 JavaScript를 실행할 수 있습니다. UI가 아닌 작업을 별도의 작업자 스레드로 이동하면 메인 스레드 차단 시간을 줄이고 결과적으로 FID를 개선할 수 있습니다.

사이트에서 웹 작업자를 더 쉽게 사용할 수 있도록 다음 라이브러리를 사용하는 것이 좋습니다.

- [Comlink](https://github.com/GoogleChromeLabs/comlink) `postMessage`를 추상화하고 사용하기 쉽게 만드는 도우미 라이브러리
- [Workway](https://github.com/WebReflection/workway) : 일반적 목적의 웹 작업자 익스포터
- [Workerize](https://github.com/developit/workerize) : 모듈을 웹 작업자로 이동

{% Aside %} 웹 작업자가 메인 스레드에서 코드를 실행하는 방법에 대해 자세히 알아보려면 [웹 작업자를 사용하여 브라우저의 메인 스레드에서 JavaScript 실행](/off-main-thread/)을 참조하세요. {% endAside %}

### JavaScript 실행 시간 단축 {: #reduce-javascript-execution }

페이지의 JavaScript 양을 제한하면 브라우저에서 JavaScript 코드를 실행하는 데 필요한 시간이 줄어듭니다. 이렇게 하면 브라우저가 사용자 상호 작용에 응답할 수 있는 속도가 빨라집니다.

페이지에서 실행되는 JavaScript의 양을 줄이는 방법은 다음과 같습니다.

- 사용하지 않는 JavaScript 지연
- 사용하지 않는 Polyfills 최소화

#### 사용하지 않는 JavaScript 지연

기본적으로 모든 JavaScript는 렌더링을 차단합니다. 브라우저가 외부 JavaScript 파일에 연결되는 스크립트 태그를 만나면 수행 중인 작업을 일시 중지하고 해당 JavaScript를 다운로드, 구문 분석, 컴파일 및 실행해야 합니다. 따라서 페이지 또는 사용자 입력에 응답하는 데 필요한 코드만 로드해야 합니다.

Chrome DevTools의 [Coverage](https://developer.chrome.com/docs/devtools/coverage/) 탭을 보면 웹 페이지에서 사용되지 않는 JavaScript가 어느 정도인지 파악할 수 있습니다.

{% Img src="image/admin/UNEigFiwsGu48rtXMZM4.png", alt="Coverage 탭.", width="800", height="559" %}

사용하지 않는 JavaScript를 줄이는 방법은 다음과 같습니다.

- 번들을 여러 청크로 코드 분할
- `async` 또는 `defer`를 사용하여 타사 스크립트를 비롯한 중요하지 않은 JavaScript 지연

**코드 분할**은 하나의 큰 JavaScript 번들을 조건부로 로드할 수 있는 더 작은 청크로 분할하는 개념입니다(지연 로드라고도 함). 대부분의 최신 브라우저는 [동적 가져오기 구문을 지원하며](https://caniuse.com/#feat=es6-module-dynamic-import) 이는 요청 시 모듈 가져오기를 허용합니다.

```js
import('module.js').then((module) => {
  // 모듈로 뭔가 해보기.
});
```

특정 사용자 상호 작용(예: 경로 변경 또는 모달 표시)에서 JavaScript를 동적으로 가져오면 초기 페이지 로드에 사용되지 않는 코드는 필요할 때만 가져오도록 합니다.

일반적인 브라우저 지원 외에도 다양한 빌드 시스템에서 동적 가져오기 구문을 사용할 수 있습니다.

- [webpack](https://medium.com/rollup/rollup-now-has-code-splitting-and-we-need-your-help-46defd901c82) , [Rollup](https://parceljs.org/code_splitting.html) 또는 [Parcel](https://webpack.js.org/guides/code-splitting/)을 모듈 번들러로 사용하는 경우 동적 가져오기 지원을 활용하세요.
- [React](https://reactjs.org/docs/code-splitting.html#reactlazy) , [Angular](https://angular.io/guide/lazy-loading-ngmodules) 및 [Vue](https://vuejs.org/v2/guide/components-dynamic-async.html#Async-Components) 와 같은 클라이언트 측 프레임워크는 구성 요소 수준에서 지연 로드를 쉽게 하기 위해 추상화를 제공합니다.

{% Aside %} 코드 분할에 대해 자세히 알아보려면 [코드 분할로 JavaScript 페이로드 줄이기](/reduce-javascript-payloads-with-code-splitting/)를 참조하세요. {% endAside %}

코드 분할 외에도 중요 경로 또는 스크롤 없이 볼 수 있는 콘텐츠에 필요하지 않은 스크립트에는 항상 [async 또는 defer](https://javascript.info/script-async-defer)를 사용하세요.

```html
<script defer src="…"></script>
<script async src="…"></script>
```

특별한 이유가 없는 한 모든 타사 스크립트는 기본적으로 `defer` 또는 `async`

#### 사용하지 않는 Polyfills 최소화

최신 JavaScript 구문을 사용하여 코드를 작성하고 최신 브라우저 API를 참조하는 경우 이전 브라우저에서 작동하려면 코드를 변환하고 Polyfills을 포함해야 합니다.

사이트에 Polyfills 및 변환 컴파일된 코드를 포함할 때 발생하는 주요 성능 문제는 최신 브라우저에서 필요하지 않은 경우 이를 다운로드할 필요가 없다는 것입니다. 애플리케이션의 JavaScript 크기를 줄이려면 사용하지 않는 Polyfills을 최대한 최소화하고 필요한 환경에서만 사용을 제한하세요.

사이트에서 폴리필 사용을 최적화하려면 다음과 같은 방법을 사용합니다.

- [Babel](https://babeljs.io/docs/en/index.html)을 변환기로 사용하는 경우 [`@babel/preset-env`](https://babeljs.io/docs/en/babel-preset-env)를 사용하여 타겟팅하려는 브라우저에 필요한 Polyfills만 포함합니다. Babel 7.9의 경우 [`bugfixes`](https://babeljs.io/docs/en/babel-preset-env#bugfixes) 옵션을 활성화하여 불필요한 Polyfills을 더 줄일 수 있습니다.

- module/nomodule 패턴을 사용하여 두 개의 개별 번들을 제공합니다(`@babel/preset-env` 역시 [`target.esmodules`](https://babeljs.io/docs/en/babel-preset-env#targetsesmodules)를 통해 이를 지원함).

    ```html
    <script type="module" src="modern.js"></script>
    <script nomodule src="legacy.js" defer></script>
    ```

    Babel로 컴파일된 많은 최신 ECMAScript 기능은 JavaScript 모듈을 지원하는 환경에서 이미 지원되고 있습니다. 따라서 이렇게 하면 실제로 필요한 브라우저에 대해 변환 컴파일된 코드만 사용되도록 하여 프로세스를 단순화할 수 있습니다.

{% Aside %} [더 빠른 페이지 로드를 위해 최신 브라우저에 최신 코드 제공](/serve-modern-code-to-modern-browsers/) 가이드에서 이 주제에 대해 자세히 설명합니다. {% endAside %}

## 개발자 도구

FID를 측정하고 디버그하는 데 사용할 수 있는 여러 가지 도구가 있습니다.

- [Lighthouse 6.0](https://developer.chrome.com/docs/lighthouse/overview/)은 필드 메트릭인 FID에 대한 지원을 포함하지 않습니다. 그러나 [총 차단 시간](/tbt/)(TBT)를 그 대체제로 사용할 수 있습니다. TBT를 개선하는 최적화는 필드에서 FID도 개선합니다.

    {% Img src="image/admin/FRM9kHWmsDv9dddGMgwu.jpg", alt="Lighthouse 6.0.", width="800", height="309" %}

- [Chrome User Experience Report](https://developer.chrome.com/docs/crux/) 는 원본 수준에서 집계된 실제 FID 값을 제공합니다.

*Philip Walton, Kayce Basques, Ilya Grigorik 및 Annie Sullivan의 리뷰에 감사드립니다.*
