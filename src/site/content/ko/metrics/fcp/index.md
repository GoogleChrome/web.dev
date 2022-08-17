---
layout: post
title: First Contentful Paint(최초 콘텐츠풀 페인트, FCP)
authors:
  - philipwalton
date: 2019-11-07
updated: 2022-07-18
description: 이 게시물에서는 최초 콘텐츠풀 페인트(FCP) 메트릭을 소개하고 이를 측정하는 방법을 설명합니다.
tags:
  - performance
  - metrics
---

{% Aside %} 최초 콘텐츠풀 페인트(FCP)는 사용자가 화면에서 콘텐츠를 볼 수 있는 페이지 로드 타임라인의 첫 번째 지점을 표시하기 때문에 사용자가 [감지하는 로드 속도](/user-centric-performance-metrics/#types-of-metrics)를 측정할 수 있는 중요한 사용자 중심 메트릭입니다. FCP가 빠르면 사용자가 페이지에서 뭔가가 [진행되고 있음](/user-centric-performance-metrics/#questions)을 인지해 안심할 수 있습니다. {% endAside %}

## FCP란 무엇인가요?

최초 콘텐츠풀 페인트(FCP) 메트릭은 페이지가 로드되기 시작한 시점부터 페이지 콘텐츠의 일부가 화면에 렌더링될 때까지의 시간을 측정합니다. 이 메트릭에서 "콘텐츠"란 텍스트, 이미지(배경 이미지 포함), `<svg>` 요소 또는 흰색이 아닌 `<canvas>` 요소를 뜻합니다.

{% Img src="image/admin/3UhlOxRc0j8Vc4DGd4dt.png", alt="google.com의 FCP 타임라인", width="800", height="311", linkTo=true %}

위의 로드 타임라인에서 FCP는 첫 번째 텍스트와 이미지 요소가 화면에 렌더링되는 두 번째 프레임에서 발생합니다.

전체가 아닌 일부 콘텐츠만 렌더링되었음을 확인하실 수 있습니다. 이는 *최초* 콘텐츠풀 페인트(FCP)와 페이지의 주요 콘텐츠 로딩이 완료된 시점을 측정하는 것을 목표로 하는 *[Large Contentful Paint(최대 콘텐츠풀 페인트, LCP)](/lcp/)*를 구분하는 중요한 차이점입니다.

  <picture>
    <source srcset="{{ "image/eqprBhZUGfb8WYnumQ9ljAxRrA72/V1mtKJenViYAhn05WxqR.svg" | imgix }}" media="(min-width: 640px)" width="400", height="100">
    {% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/vQKpz0S2SGnnoXHMDidj.svg", alt="좋은 FCP 값은 1.8초 이하이고 나쁜 값은 3.0초보다 크며 그 사이에는 개선이 필요합니다", width="400", height="300" %}
  </picture>

### 좋은 FCP 점수는 무엇인가요?

우수한 사용자 경험을 제공하려면 사이트의 최초 콘텐츠풀 페인트가 **1.8초** 이하여야 합니다. 대부분의 사용자에 대해 이 목표를 달성할 수 있도록 하려면 모바일 및 데스크톱 기기 전반에 분할된 페이지 로드의 **75번째 백분위수**를 측정하는 것이 바람직한 임계값입니다.

## FCP 측정 방법

FCP는 [실험실](/user-centric-performance-metrics/#in-the-lab)이나 [현장](/user-centric-performance-metrics/#in-the-field)에서 측정할 수 있으며 다음 도구에서 사용할 수 있습니다.

### 현장 도구

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Chrome User Experience Report](https://developer.chrome.com/docs/crux/)
- [Search Console(Speed Report)](https://webmasters.googleblog.com/2019/11/search-console-speed-report.html)
- [`web-vitals` JavaScript 라이브러리](https://github.com/GoogleChrome/web-vitals)

### 실험실 도구

- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### JavaScript에서 FCP 측정

JavaScript에서 FCP를 측정하려면 [Paint Timing API를](https://w3c.github.io/paint-timing/) 사용할 수 있습니다. 다음 예시에서는 이름이 `first-contentful-paint`인 `paint` 항목을 수신 대기하고 콘솔에 기록하는 [`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver)를 작성하는 방법을 확인하실 수 있습니다.

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
    console.log('FCP candidate:', entry.startTime, entry);
  }
}).observe({type: 'paint', buffered: true});
```

{% Aside 'warning' %}

이 코드에서는 `first-contentful-paint` 항목을 콘솔에 기록하는 방법을 보여주지만 JavaScript에서 FCP를 측정하는 것은 보다 복잡합니다. 자세한 내용은 아래를 참조하세요.

{% endAside %}

위의 예에서 기록된 `first-contentful-paint` 항목은 최초 콘텐츠풀 요소가 언제 화면에 그려졌는지 알려줍니다. 그러나 이 항목이 FCP 측정에 유효하지 않은 경우도 일부 있습니다.

다음 섹션에는 API가 보고하는 내용과 메트릭이 계산되는 방법 사이의 차이점이 나열되어 있습니다.

#### 메트릭과 API의 차이점

- API는 백그라운드 탭에 로드된 페이지에 대해 `first-contentful-paint` 항목을 전달하지만 FCP를 계산할 때는 해당 페이지를 무시해야 합니다. 최초 페인트 타이밍은 전체 시간 내내 전경에 있던 페이지만 고려하기 때문입니다.
- 페이지가 [백/포워드 캐시](/bfcache/#impact-on-core-web-vitals)에서 복원될 때 API는 `first-contentful-paint` 항목을 보고하지 않지만, 사용자는 이를 고유한 페이지 방문으로 경험하므로 FCP는 측정되어야 합니다.
- API는 [교차 원본 iframe의 페인트 타이밍을 보고하지 않을 수 있지만](https://w3c.github.io/paint-timing/#:~:text=cross-origin%20iframes) FCP를 올바르게 측정하려면 모든 프레임을 고려해야 합니다. 하위 프레임은 API를 사용하여 집계를 위해 상위 프레임에 이러한 페인트 타이밍을 보고할 수 있습니다.

개발자는 이러한 미묘한 차이점을 모두 기억하는 대신 가능한 경우 다음과 같은 차이점을 대신 처리해주는 [`web-vitals` JavaScript 라이브러리](https://github.com/GoogleChrome/web-vitals)를 사용하여 FCP를 측정할 수 있습니다.

```js
import {getFCP} from 'web-vitals';

// FCP를 이용 가능하게 되면 바로 측정 및 기록합니다.
getFCP(console.log);
```

JavaScript에서 FCP를 측정하는 방법에 대한 전체 예제는 [`getFCP()`의 소스 코드](https://github.com/GoogleChrome/web-vitals/blob/master/src/getFCP.ts)를 참조하세요.

{% Aside %} 일부 경우(예: 교차 원본 iframe) JavaScript에서 FCP를 측정할 수 없습니다. 자세한 내용은 `web-vitals` 라이브러리의 [제한 사항](https://github.com/GoogleChrome/web-vitals#limitations) 섹션을 참조하세요. {% endAside %}

## FCP를 개선하는 방법

특정 사이트에 대한 FCP를 개선하는 방법을 알아보려면 Lighthouse 성능 감사를 실행하고 감사에서 제안하는 특정한 [기회](/lighthouse-performance/#opportunities) 또는 [진단](/lighthouse-performance/#diagnostics)을 주의 깊게 살펴보시기 바랍니다.

모든 사이트에서 일반적으로 FCP를 개선하는 방법을 알아보려면 다음 성능 가이드를 참조하세요.

- [렌더링 차단 리소스 제거](/render-blocking-resources/)
- [CSS 축소](/unminified-css/)
- [사용하지 않는 CSS 제거](/unused-css-rules/)
- [필요한 원본에 사전 연결](/uses-rel-preconnect/)
- [서버 응답 시간 단축(TTFB)](/ttfb/)
- [여러 페이지 리디렉션 방지](/redirects/)
- [핵심 요청 사전 로드](/uses-rel-preload/)
- [막대한 네트워크 페이로드 방지](/total-byte-weight/)
- [효율적인 캐시 정책으로 정적 자산 제공](/uses-long-cache-ttl/)
- [과도한 DOM 크기 방지](/dom-size/)
- [크리티컬 요청 깊이 최소화](/critical-request-chains/)
- [웹폰트 로드 중에 텍스트가 계속 표시되는지 확인](/font-display/)
- [요청 수를 낮게 유지하고 전송 크기를 작게 유지](/resource-summary/)

{% include 'content/metrics/metrics-changelog.njk' %}
