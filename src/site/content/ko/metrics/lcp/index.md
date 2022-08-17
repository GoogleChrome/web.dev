---
layout: post
title: Largest Contentful Paint(최대 콘텐츠풀 페인트, LCP)
authors:
  - philipwalton
date: 2019-08-08
updated: 2022-07-18
description: 이 게시물에서는 최대 콘텐츠풀 페인트(LCP) 메트릭을 소개하고 이를 측정하는 방법을 설명합니다.
tags:
  - performance
  - metrics
---

{% Aside %} 최대 콘텐츠풀 페인트(LCP)는 페이지의 메인 콘텐츠가 로드되었을 가능성이 있을 때 페이지 로드 타임라인에 해당 시점을 표시하므로 사용자가 [감지하는 로드 속도](/user-centric-performance-metrics/#types-of-metrics)를 측정할 수 있는 중요한 사용자 중심 메트릭입니다. LCP가 빠르면 사용자가 해당 페이지를 [사용할 수 있다](/user-centric-performance-metrics/#questions)고 인지하는 데 도움이 됩니다. {% endAside %}

일반적으로 웹 개발자가 웹 페이지의 메인 콘텐츠가 얼마나 빨리 로드되어 사용자에게 표시되는지 측정하는 것은 어려운 일입니다.

[load](https://developer.mozilla.org/docs/Web/Events/load) 또는 [DOMContentLoaded](https://developer.mozilla.org/docs/Web/Events/DOMContentLoaded)와 같은 오래된 메트릭은 사용자가 화면에서 보는 것과 반드시 일치하지는 않기 때문에 적절하다고 볼 수 없습니다. 또한, [First Contentful Paint(최초 콘텐츠풀 페인트, FCP)](/fcp/) 와 같은 새로운 사용자 중심 성능 메트릭은 로딩 경험의 시작 부분만을 포착합니다. 페이지에 시작 화면이 표시되거나 로딩 표시기를 표시되는 순간은 사용자와 큰 관련이 있다고 볼 수 없습니다.

이전에는 초기 페인트 후의 더 많은 로딩 경험을 포착할 수 있도록 Lighthouse에서 사용 가능한 [First Meaningful Paint(유의미한 최초 페인트, FMP)](/first-meaningful-paint/) 및 [Speed Index(속도 인덱스, SI)](/speed-index/)와 같은 성능 메트릭을 권장했지만 이러한 메트릭은 복잡하고 설명하기 어려우며, 잘못된 경우도 많습니다. 즉 페이지의 메인 콘텐츠가 로드된 시점을 식별하지 못한다는 것입니다.

때로는 단순한 방법이 가장 효과적입니다. [W3C Web Performance Working Group](https://www.w3.org/webperf/)의 토론과 Google에서 수행한 연구에 따르면, 페이지의 메인 콘텐츠가 로드되는 시기를 측정하는 보다 정확한 방법은 가장 큰 요소가 렌더링된 시기를 확인하는 것입니다.

## LCP란 무엇인가요?

최대 콘텐츠풀 페인트(LCP) 메트릭은 페이지가 [처음으로 로드를 시작한 시점](#what-elements-are-considered)을 기준으로 뷰포트 내에 있는 가장 큰 [이미지 또는 텍스트 블록](https://w3c.github.io/hr-time/#timeorigin-attribute)의 렌더링 시간을 보고합니다.

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/elqsdYqQEefWJbUM2qMO.svg" | imgix }}" media="(min-width: 640px)" width="400", height="100">
  {% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/8ZW8LQsagLih1ZZoOmMR.svg", alt="좋은 LCP 값은 2.5초이고 나쁜 값은 4.0초보다 크며 그 사이인 경우 개선이 필요함", width="400", height="300" %}
</picture>

### 좋은 LCP 점수는 무엇인가요?

우수한 사용자 경험을 제공하려면 사이트의 최대 콘텐츠풀 페인트가 **2.5초** 이하여야 합니다. 대부분의 사용자에 대해 이 목표를 달성할 수 있도록 하려면 모바일 및 데스크톱 기기 전반에 분할된 페이지 로드의 **75번째 백분위수**를 측정하는 것이 바람직한 임계값입니다.

{% Aside %} 이러한 권장 사항의 기반이 되는 연구 및 방법론에 대해 자세히 알아보려면 [Core Web Vitals 메트릭 임계값 정의](/defining-core-web-vitals-thresholds/)를 참조하시기 바랍니다. {% endAside %}

### 어떤 요소를 고려하나요?

현재 [Largest Contentful Paint API](https://wicg.github.io/largest-contentful-paint/)에 지정된 대로, 최대 콘텐츠풀 페인트에 대해 고려되는 요소 유형은 다음과 같습니다.

- `<img>` 요소
- `<svg>` 요소 내부의 `<image>`
- `<video>` 요소(포스터 이미지 사용)
- [`url()`](https://developer.mozilla.org/docs/Web/CSS/url()) 함수를 통해 로드된 배경 이미지가 있는 요소[(CSS 그라데이션](https://developer.mozilla.org/docs/Web/CSS/CSS_Images/Using_CSS_gradients)과는 대조적임)
- 텍스트 노드 또는 기타 인라인 수준 텍스트 하위 요소를 포함하는 [블록 수준](https://developer.mozilla.org/docs/Web/HTML/Block-level_elements) 요소

요소를 이렇게 제한한 이유는 처음부터 단순하게 작업을 진행하기 위한 의도적인 선택입니다. 이후 더 많은 연구가 수행되면 추가 요소(예: `<svg>`, `<video>`)가 추가될 수도 있습니다.

### 요소의 크기는 어떻게 결정되나요?

최대 콘텐츠풀 페인트에 대해 보고된 요소의 크기는 일반적으로 뷰포트 내에서 사용자에게 표시되는 크기입니다. 요소가 뷰포트 외부로 확장되거나, 요소가 잘리거나, 보이지 않는 [오버플로](https://developer.mozilla.org/docs/Web/CSS/overflow)가 있는 경우 해당 부분은 요소 크기에 포함되지 않습니다.

[기본 크기](https://developer.mozilla.org/docs/Glossary/Intrinsic_Size)에서 크기가 조정된 이미지 요소의 경우 가시적 크기 또는 기본 크기 중 더 작은 것이 보고됩니다. 예를 들어 기본 크기보다 훨씬 작게 축소된 이미지는 표시된 만큼의 크기가, 더 크게 늘어나거나 확장된 경우에는 기본 크기만 보고됩니다.

텍스트 요소의 경우 텍스트 노드의 크기만 고려됩니다(모든 텍스트 노드를 포함하는 가장 작은 직사각형).

모든 요소에 대해 CSS를 통해 적용된 여백, 안쪽 여백, 테두리는 고려되지 않습니다.

{% Aside %} 어떤 텍스트 노드가 어떤 요소에 속하는지 결정하는 건 꽤 까다로울 수 있습니다. 특히 하위 요소가 인라인 요소와 일반 텍스트 노드를 포함하면서 블록 수준 요소까지 포함하는 경우에는 더욱 그렇습니다. 여기서 요점은 모든 텍스트 노드가 가장 가까운 블록 수준 상위 요소에만 속한다는 것입니다. [사양 측면](https://wicg.github.io/element-timing/#set-of-owned-text-nodes)에서 각 텍스트 노드는 [포함하는 블록](https://developer.mozilla.org/docs/Web/CSS/Containing_block)을 생성하는 요소에 속합니다. {% endAside %}

### 최대 콘텐츠풀 페인트는 언제 보고되나요?

웹 페이지는 단계적으로 로드되는 경우가 많으며, 그 결과 페이지의 최대 요소가 변경될 수 있습니다.

이러한 변경 가능성을 처리하기 위해 브라우저는 브라우저가 첫 번째 프레임을 그리는 즉시 최대 콘텐츠 요소를 식별하는 `largest-contentful-paint` 유형의 [`PerformanceEntry`](https://developer.mozilla.org/docs/Web/API/PerformanceEntry)를 디스패치합니다. 그러나 이후 프레임이 렌더링된 후에는 최대 콘텐츠풀 요소가 변경될 때마다 또 다른 [`PerformanceEntry`](https://developer.mozilla.org/docs/Web/API/PerformanceEntry)를 디스패치합니다.

예를 들어, 텍스트와 대표 이미지가 있는 페이지인 경우 브라우저는 처음에는 텍스트만 렌더링할 수 있습니다. 이 시점에서 브라우저는 `element` 속성이 `<p>` 또는 `<h1>`를 참조할 가능성이 있는 `largest-contentful-paint` 항목을 디스패치합니다. 이후 대표 이미지 로드가 완료되면 두 번째 `largest-contentful-paint` 항목이 디스패치되고 `element` 속성은 `<img>`를 참조하게 됩니다.

요소는 렌더링된 후 사용자에게 표시되고 나서야 최대 콘텐츠풀 요소로 간주될 수 있다는 점에 유의해야 합니다. 아직 로드되지 않은 이미지는 "렌더링"된 것으로 간주되지 않습니다. [글꼴 차단 기간](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display#The_font_display_timeline) 동안 웹 글꼴을 사용하는 텍스트 노드도 마찬가지입니다. 이러한 경우 더 작은 요소가 최대 콘텐츠풀 요소로 보고될 수 있지만 더 큰 요소가 렌더링을 완료하는 즉시 다른 `PerformanceEntry` 오브젝트를 통해 보고됩니다.

이미지와 글꼴을 늦게 로드하는 것 외에도, 페이지는 새 콘텐츠를 사용할 수 있게 되면 DOM에 새 요소를 추가할 수 있습니다. 이러한 새 요소 중 하나가 이전의 최대 콘텐츠풀 요소보다 큰 경우에도 새 `PerformanceEntry`가 보고됩니다.

현재 최대 콘텐츠풀 요소가 뷰포트에서 제거(또는 DOM에서 제거)되더라도 이보다 더 큰 요소가 렌더링되지 않는 이상, 해당 요소가 최대 콘텐츠풀 요소로 유지됩니다.

{% Aside %} Chrome 88 이전에는 제거된 요소가 최대 콘텐츠풀 요소로 간주되지 않았으며, 현재 후보를 제거하면 새로운 `largest-contentful-paint` 항목의 디스패치가 트리거되곤 했습니다. 그러나 DOM 요소를 제거하는 경우가 많은 이미지 캐러셀 같은 인기 UI 패턴으로 인해 이러한 메트릭은 사용자가 경험하는 것을 더욱 정확히 반영할 수 있도록 업데이트되었습니다. 자세한 내용은 [변경 기록](https://chromium.googlesource.com/chromium/src/+/master/docs/speed/metrics_changelog/2020_11_lcp.md)을 참조하세요. {% endAside %}

브라우저는 사용자가 페이지와 상호작용(탭, 스크롤 또는 키 누르기를 통해)하는 즉시 새 항목 보고를 중지합니다. 사용자 상호작용, 특히 스크롤은 사용자에게 표시되는 내용을 변경하기 떄문입니다.

분석을 위해서는 가장 최근에 디스패치된 `PerformanceEntry`만 분석 서비스에 보고해야 합니다.

{% Aside 'caution' %} 사용자는 백그라운드 탭에서 페이지를 열 수 있으므로 최대 콘텐츠풀 페인트는 사용자가 탭에 집중할 때까지 발생하지 않을 수도 있으며, 이럴 경우 최초 로드보다 훨씬 뒤에 이루어집니다. {% endAside %}

#### 로드 시간 vs. 렌더링 시간

[`Timing-Allow-Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Timing-Allow-Origin) 헤더가 없는 교차 출처 이미지의 경우 이미지의 렌더링 타임스탬프가 노출되지 않고 대신 로드 시간만 노출됩니다. 이는 다른 여러 가지 API에 이미 노출되어 있는 부분이기 때문입니다.

[아래 사용 예시](#measure-lcp-in-javascript)에서는 렌더링 시간을 사용할 수 없는 요소를 처리하는 방법을 보여줍니다. 하지만 가능하다면 언제나 [`Timing-Allow-Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Timing-Allow-Origin) 헤더를 설정하는 것이 좋습니다. 그래야 메트릭이 더욱 정확해지기 때문입니다.

### 요소 레이아웃 및 크기 변경은 어떻게 처리되나요?

새 성능 항목을 계산하고 디스패치하는 성능 오버헤드를 낮게 유지하기 위해 요소의 크기나 위치를 변경해도 새 LCP 후보가 생성되지 않으며 오직 뷰포트에서 요소의 처음 크기와 위치만 고려합니다.

즉, 처음에 화면 밖에서 렌더링된 후 다음 화면으로 전환되는 이미지는 보고되지 않을 수 있습니다. 또한, 처음에 뷰포트에서 렌더링된 요소가 아래로 밀려 뷰에서 벗어나도 초기 뷰포트 내에서의 크기를 보고합니다.

### 예시

다음은 인기 웹사이트에서 최대 콘텐츠풀 페인트가 발생하는 경우의 예시입니다.

{% Img src="image/admin/bsBm8poY1uQbq7mNvVJm.png", alt="cnn.com의 최대 콘텐츠풀 페인트 타임라인", width="800", height="311" %}

{% Img src="image/admin/xAvLL1u2KFRaqoZZiI71.png", alt="techcrunch.com의 최대 콘텐츠풀 페인트 타임라인", width="800", height="311" %}

위의 두 타임라인에서는 콘텐츠가 로드되면 최대 요소가 변경됩니다. 첫 번째 예에서는 새 콘텐츠가 DOM에 추가되었기 때문에 최대 요소가 변경됩니다. 두 번째 예에서는 레이아웃이 변경되고 이전의 최대 콘텐츠가 뷰포트에서 제거됩니다.

늦게 로드하는 콘텐츠가 페이지에 이미 있는 콘텐츠보다 큰 경우가 많지만 반드시 그런 것은 아닙니다. 다음 두 예는 페이지가 완전히 로드되기 전에 발생하는 가장 큰 콘텐츠가 포함된 페인트를 보여줍니다.

{% Img src="image/admin/uJAGswhXK3bE6Vs4I5bP.png", alt="instagram.com의 최대 콘텐츠풀 페인트 타임라인", width="800", height="311" %}

{% Img src="image/admin/e0O2woQjZJ92aYlPOJzT.png", alt="google.com의 최대 콘텐츠풀 페인트 타임라인", width="800", height="311" %}

첫 번째 예에서는 Instagram 로고가 비교적 일찍 로드되어 다른 콘텐츠가 점진적으로 표시된 후에도 최대 요소로 남아 있습니다. Google 검색 결과 페이지 예에서 최대 요소는 이미지 또는 로고 로드가 완료되기 전에 표시되는 텍스트 단락입니다. 개별 이미지가 모두 이 단락보다 작기 때문에 텍스트 단락이 로드 프로세스 전체에서 최대 요소로 유지됩니다.

{% Aside %} Instagram 타임라인의 첫 번째 프레임에서 카메라 로고 주위에 녹색 상자가 없음을 알 수 있습니다. 이는 `<svg>` 요소이고 `<svg>` 요소는 현재 LCP 후보로 간주되지 않기 때문입니다. 첫 번째 LCP 후보는 두 번째 프레임의 텍스트입니다. {% endAside %}

## LCP 측정 방법

LCP는 [실험실](/user-centric-performance-metrics/#in-the-lab)이나 [현장](/user-centric-performance-metrics/#in-the-field)에서 측정할 수 있으며 다음 도구에서 사용할 수 있습니다.

### 현장 도구

- [Chrome User Experience Report](https://developer.chrome.com/docs/crux/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Search Console(Core Web Vitals Report)](https://support.google.com/webmasters/answer/9205520)
- [`web-vitals` JavaScript 라이브러리](https://github.com/GoogleChrome/web-vitals)

### 실험실 도구

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [WebPageTest](https://webpagetest.org/)

### JavaScript에서 LCP 측정

JavaScript에서 LCP를 측정하려면 [Largest Contentful Paint API](https://wicg.github.io/largest-contentful-paint/)를 사용할 수 있습니다. 다음 예시에서는 `largest-contentful-paint` 항목을 수신 대기하고 콘솔에 기록하는 [`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver)를 작성하는 방법을 확인하실 수 있습니다.

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    console.log('LCP candidate:', entry.startTime, entry);
  }
}).observe({type: 'largest-contentful-paint', buffered: true});
```

{% Aside 'warning' %}

이 코드에서는 `largest-contentful-paint` 항목을 콘솔에 기록하는 방법을 보여주지만 JavaScript에서 LCP를 측정하는 것은 보다 복잡합니다. 자세한 내용은 아래를 참조하세요.

{% endAside %}

위의 예에서 기록된 각각의 `largest-contentful-paint` 항목은 현재 LCP 후보를 나타냅니다. 일반적으로 마지막 항목이 내보낸 `startTime` 값이 LCP 값이지만 항상 그런 것은 아닙니다. 모든 `largest-contentful-paint` 항목이 LCP 측정에 유효한 것은 아닙니다.

다음 섹션에는 API가 보고하는 내용과 메트릭이 계산되는 방법 사이의 차이점이 나열되어 있습니다.

#### 메트릭과 API의 차이점

- API는 백그라운드 탭에 로드되는 페이지에 대한 `largest-contentful-paint` 항목을 디스패치하지만 이러한 페이지는 LCP를 계산할 때 무시됩니다.
- API는 `largest-contentful-paint` 항목을 계속 디스패치하지만 LCP를 계산할 때는 해당 항목을 무시해야 합니다. 요소는 페이지가 계속 전경에 있어야 유효한 것으로 간주되기 때문입니다.
- 페이지가 [백/포워드 캐시](/bfcache/#impact-on-core-web-vitals)에서 복원될 때 API는 `largest-contentful-paint` 항목을 보고하지 않지만, 사용자는 이를 고유한 페이지 방문으로 경험하므로 LCP는 측정되어야 합니다.
- API는 iframe 내의 요소를 고려하지 않지만 LCP를 올바르게 측정하려면 이를 고려해야 합니다. 하위 프레임은 API를 사용하여 집계를 위해 상위 프레임에 `largest-contentful-paint` 항목을 보고할 수 있습니다.

개발자는 이러한 미묘한 차이점을 모두 기억하는 대신 가능한 경우 다음과 같은 차이점을 대신 처리해주는 [`web-vitals` JavaScript 라이브러리](https://github.com/GoogleChrome/web-vitals)를 사용하여 LCP를 측정할 수 있습니다.

```js
import {getLCP} from 'web-vitals';

// LCP를 이용 가능하게 되면 바로 측정 및 기록합니다.
getFCP(console.log);
```

JavaScript에서 LCP를 측정하는 방법에 대한 전체 예제는 [`getLCP()`의 소스 코드](https://github.com/GoogleChrome/web-vitals/blob/master/src/getLCP.ts)를 참조하세요.

{% Aside %} 일부 경우(예: 교차 원본 iframe) JavaScript에서 LCP를 측정할 수 없습니다. 자세한 내용은 `web-vitals` 라이브러리의 [제한 사항](https://github.com/GoogleChrome/web-vitals#limitations) 섹션을 참조하세요. {% endAside %}

### 최대 요소가 가장 중요한 요소가 아닐 때는 어떻게 하나요?

페이지에서 가장 중요한 요소가 최대 요소와 같지 않은 경우가 있으며, 개발자는 이 대신 다른 요소의 렌더링 시간을 측정하는 데 더 관심이 있을 수 있습니다. 이런 경우에는 [사용자 지정 메트릭](https://wicg.github.io/element-timing/)에 대한 문서에 설명되어 있는 것처럼 [Element Timing API](/custom-metrics/#element-timing-api)를 사용합니다.

## LCP를 개선하는 방법

LCP는 주로 4가지 요인에 의해 영향을 받습니다.

- 느린 서버 응답 시간
- 렌더링 차단 JavaScript 및 CSS
- 리소스 로드 시간
- 클라이언트 측 렌더링

LCP를 개선하는 방법에 대한 자세한 내용은 [LCP 최적화](/optimize-lcp/)를 참조하시기 바랍니다. LCP를 개선할 수 있는 개별 성능 기술에 대한 추가 지침은 다음을 참조하세요.

- [PRPL 패턴으로 즉각적 로딩 적용](/apply-instant-loading-with-prpl)
- [중요 렌더링 경로 최적화](/critical-rendering-path/)
- [CSS 최적화](/fast#optimize-your-css)
- [이미지 최적화](/fast#optimize-your-images)
- [웹 글꼴 최적화](/fast#optimize-web-fonts)
- [JavaScript 최적화](/fast#optimize-your-javascript)(클라이언트 렌더링 사이트용)

## 추가 리소스

- [performance.now()](https://perfnow.nl/) (2019)에서 [Annie Sullivan](https://anniesullie.com/)이 발표한 [Chrome의 성능 모니터링에서 알게 된 내용](https://youtu.be/ctavZT87syI)

{% include 'content/metrics/metrics-changelog.njk' %}
