---
title: 필드의 Web Vitals 측정 모범 사례
subhead: 현재 분석 도구로 Web Vitals를 측정하는 방법.
authors:
  - philipwalton
description: 현재 분석 도구로 Web Vitals를 측정하는 방법
date: 2020-05-27
updated: 2020-07-21
hero: image/admin/WNrgCVjmp8Gyc8EbZ9Jv.png
alt: 현재 분석 도구로 Web Vitals를 측정하는 방법
tags:
  - blog
  - performance
  - web-vitals
---

페이지의 실제 성능을 측정하고 보고하는 기능을 확보하는 것은 시간 경과에 따른 성능을 진단하고 개선하는 데 중요한 부분입니다. [필드 데이터](/user-centric-performance-metrics/#in-the-field)가 없다면 사이트에 대한 변경 사항이 실제로 원하는 결과를 얻고 있는지 확실히 알 수 없습니다.

여러 가지 인기 [Real User Monitoring(실제 사용자 모니터링, RUM)](https://en.wikipedia.org/wiki/Real_user_monitoring) 분석 제공업체에서는 이미 자체 도구에서 [Core Web Vitals 메트릭](/vitals/#core-web-vitals)과 [기타 Web Vitals](/vitals/#core-web-vitals)를 지원하고 있습니다. 현재 이러한 RUM 분석 도구 중 하나를 사용하고 있다면 사이트의 페이지가 [권장되는 Core Web Vitals 임계값](/vitals/#core-web-vitals)을 얼마나 잘 충족하는지 평가하고 향후 회귀를 방지할 수 있습니다.

Core Web Vitals 메트릭을 지원하는 분석 도구를 사용하는 것이 좋긴 하지만 현재 사용 중인 분석 도구가 이를 지원하지 않는 경우 반드시 전환할 필요는 없습니다. 거의 모든 분석 도구는 [사용자 지정 메트릭](https://support.google.com/analytics/answer/2709828) 또는 [이벤트](https://support.google.com/analytics/answer/1033068) 를 정의 및 측정하는 방법을 제공합니다. 즉, 현재 분석 공급업체를 이용해 Core Web Vitals 메트릭을 측정하고 이를 기존 분석 보고서 및 대시보드에 추가할 수 있다는 의미입니다.

이 가이드에서는 타사 또는 내부 분석 도구를 사용하여 Core Web Vitals 메트릭(또는 모든 사용자 지정 메트릭)을 측정하는 모범 사례를 설명합니다. 서비스에 Core Web Vitals 지원을 추가하려는 분석 벤더인 경우 이를 가이드로 삼을 수 있습니다.

## 사용자 지정 메트릭 또는 이벤트 사용

위에서 언급했듯이 대부분의 분석 도구에서는 사용자 지정 데이터를 측정할 수 있습니다. 분석 도구가 이를 지원하는 경우 이 메커니즘을 사용하여 각 Core Web Vitals 메트릭을 측정할 수 있어야 합니다.

분석 도구에서 사용자 지정 메트릭 또는 이벤트를 측정하기 위해서는 일반적으로 3단계를 거칩니다.

1. 필요한 경우 도구의 관리자에서 사용자 지정 메트릭을 [정의하거나 등록](https://support.google.com/analytics/answer/2709829?hl=en&ref_topic=2709827)합니다. *(참고: 모든 분석 제공업체에서 사용자 지정 메트릭을 미리 정의해야 하는 것은 아닙니다.)*
2. 프런트엔드 JavaScript 코드에서 메트릭 값을 계산합니다.
3. 이름 또는 ID가 1단계에서 정의된 것과 일치하도록 메트릭 값을 분석 백엔드로 보냅니다*(필요한 경우에만)*.

1단계와 3단계의 경우 분석 도구의 설명서에서 지침을 참조할 수 있습니다. 2단계에서는 [Web Vitals](https://github.com/GoogleChrome/web-vitals) JavaScript 라이브러리를 사용하여 각 Core Web Vitals 메트릭의 값을 계산할 수 있습니다.

다음 코드 샘플은 코드에서 이러한 메트릭을 추적하고 분석 서비스로 보내는 것이 얼마나 쉬운지를 보여줍니다.

```js
import {getCLS, getFID, getLCP} from 'web-vitals';

function sendToAnalytics({name, value, id}) {
  const body = JSON.stringify({name, value, id});
  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  (navigator.sendBeacon && navigator.sendBeacon('/analytics', body)) ||
      fetch('/analytics', {body, method: 'POST', keepalive: true});
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getLCP(sendToAnalytics);
```

## 분포를 보고할 수 있는지 확인

각 Core Web Vitals에 대한 값을 계산하고 사용자 지정 메트릭 또는 이벤트를 사용하여 분석 서비스로 보낸 후 다음 단계는 수집된 값을 표시하는 보고서 또는 대시보드를 작성하는 것입니다.

[권장 Core Web Vitals 임계값](/vitals/#core-web-vitals)을 충족하는지 확인하려면 75번째 백분위수에서 각 메트릭의 값을 표시하는 보고서가 필요합니다.

분석 도구가 백분위수 보고를 기본적으로 제공하지 않는 경우 오름차순으로 정렬된 모든 메트릭 값을 나열하는 보고서를 생성하여 이 데이터를 수동으로 얻을 수 있습니다. 이 보고서가 생성되면 해당 보고서의 모든 값이 정렬된 전체 목록의 75%에 해당하는 결과가 해당 메트릭의 75번째 백분위수가 됩니다. 이는 장치 유형, 연결 유형, 국가 등 데이터를 어떻게 분류했는지와 상관 없이 동일합니다.

분석 도구가 기본적으로 메트릭 수준 보고 세분화를 제공하지 않는 경우 분석 도구가 [커스텀 차원](https://support.google.com/analytics/answer/2709828)을 지원하면 동일한 결과를 얻을 수 있습니다. 추적하는 각 개별 메트릭 인스턴스에 대해 고유한 사용자 지정 차원 값을 설정하면 보고서 구성에 사용자 지정 메트릭을 포함해 개별 메트릭 인스턴스별로 분류된 보고서를 생성할 수 있습니다. 각 인스턴스에는 고유한 차원 값이 있으므로 그룹화되지 않습니다.

[Web Vitals Report](https://github.com/GoogleChromeLabs/web-vitals-report)는 Google Analytics를 사용하는 이러한 기술의 예시입니다. 보고서의 코드는 [오픈 소스](https://github.com/GoogleChromeLabs/web-vitals-report)이므로 개발자는 이 섹션에 설명된 기술의 예로 이를 참조할 수 있습니다.

<img src="https://user-images.githubusercontent.com/326742/101584324-3f9a0900-3992-11eb-8f2d-182f302fb67b.png" no="" alt="Web Vitals Report 스크린샷">

{% Aside %} 팁: [`web-vitals`](https://github.com/GoogleChrome/web-vitals) JavaScript 라이브러리는 보고된 각 메트릭 인스턴스에 대한 ID를 제공하므로 대부분의 분석 도구에서 분포를 구축할 수 있습니다. 자세한 내용은 [`Metric`](https://github.com/GoogleChrome/web-vitals#metric) 인터페이스 문서를 참조하세요. {% endAside %}

## 적시에 데이터 전송

일부 성능 메트릭은 페이지 로드가 완료되면 계산할 수 있는 반면 CLS와 같은 다른 성능 메트릭은 페이지의 전체 수명을 고려하며 페이지에서 언로드를 시작한 후에야 최종적으로 결정됩니다.

하지만 이러한 방법은 특히 모바일에서 `beforeunload` 및 `unload` 이벤트를 모두 신뢰할 수 없으며 사용이 [권장되지 않기](https://developer.chrome.com/blog/page-lifecycle-api/#legacy-lifecycle-apis-to-avoid) 때문에 문제가 될 수 있습니다. 이로 인해 페이지가 [Back-Forward Cache](https://developer.chrome.com/blog/page-lifecycle-api/#what-is-the-back-forward-cache)에 부적합해질 수 있기 때문입니다.

페이지의 전체 수명을 추적하는 메트릭의 경우 `visibilitychange` 이벤트 동안 페이지의 페이지의 가시성 상태가 `hidden`으로 변경될 때마다 메트릭의 현재 값을 보내는 것이 가장 좋습니다. 페이지의 가시성 상태가 `hidden`으로 변경되면 해당 페이지의 스크립트가 다시 실행될 수 있다는 보장이 없기 때문입니다. 이는 페이지 콜백이 실행되지 않고 브라우저 앱 자체를 닫을 수 있는 모바일 운영 체제에서 특히 그렇습니다.

모바일 운영 체제는 일반적으로 탭을 전환하거나, 앱을 전환하거나, 브라우저 앱 자체를 닫을 때 `visibilitychange`를 실행한다는 점에 유의하시기 바랍니다. 또한 탭을 닫거나 새 페이지로 이동할 때도 `visibilitychange` 이벤트를 실행합니다. 이로 인해 `visibilitychange` 이벤트가 `unload` 또는 `beforeunload` 이벤트보다 훨씬 더 안정적입니다.

{% Aside 'gotchas' %} [일부 브라우저 버그](https://github.com/w3c/page-visibility/issues/59#issue-554880545)로 인해  `visibilitychange` 이벤트가 실행되지 않는 경우도 있습니다. 자체 분석 라이브러리를 구축하는 경우 이러한 버그를 인식하는 것이 중요합니다. [web-vitals](https://github.com/GoogleChrome/web-vitals) JavaScript 라이브러리는 이러한 모든 버그를 설명합니다. {% endAside %}

## 시간 경과에 따른 성능 모니터링

Core Web Vitals 메트릭을 추적하고 보고하도록 분석 구현을 업데이트한 후 다음 단계는 사이트 변경 사항이 시간 경과에 따라 성능에 미치는 영향을 추적하는 것입니다.

### 변경 사항 버전 관리

변경 사항을 추적할 때 프로덕션에 변경 사항을 배포하고, 배포일 이후 수신된 모든 메트릭이 새로운 사이트에 해당하며, 배포일 이전에 수신된 모든 메트릭은 이전 사이트에 해당한다고 가정하는 것은 너무나 고지식하며 안정적이도 않은 방법입니다. HTTP, 서비스 작업자 또는 CDN 계층에서의 캐싱을 포함한 여러 가지 요소가 이를 작동할 수 없게 하기 때문입니다.

훨씬 더 나은 접근 방식은 배포된 각 변경 사항에 대해 고유한 버전을 만든 다음 분석 도구에서 해당 버전을 추적하는 것입니다. 대부분의 분석 도구는 버전 설정을 지원합니다. 그렇지 않은 경우 사용자 지정 차원을 만들고 해당 차원을 배포된 버전으로 설정할 수 있습니다.

### 실험 실행

동시에 여러 버전 또는 실험을 추적하여 버전 관리를 한 단계 더 발전시킬 수 있습니다.

분석 도구에서 실험 그룹을 정의할 수 있는 경우 해당 기능을 사용하세요. 해당 기능이 없다면 사용자 지정 메트릭을 사용해 각 측메트릭 값을 보고서의 특정 실험 그룹에 연결할 수 있습니다.

분석에 실험을 적용하면 실험적 변경 사항을 일부 사용자에게 적용하고 해당 변경 사항의 성능을 통제 그룹의 사용자 성능과 비교할 수 있습니다. 변경이 실제로 성능을 향상시킨다는 확신이 생기면 모든 사용자에게 롤아웃할 수 있습니다.

{% Aside %} 실험 그룹은 항상 서버에서 설정해야 합니다. 클라이언트에서 실행되는 실험 또는 A/B 테스트 도구는 사용하지 마세요. 이러한 도구는 일반적으로 사용자의 실험 그룹이 결정될 때까지 렌더링을 차단하므로 LCP 시간에 악영향을 미칠 수 있습니다. {% endAside %}

## 측정이 성능에 영향을 미치지 않는지 확인

실제 사용자의 성능을 측정할 때 실행 중인 성능 측정 코드가 페이지 성능에 부정적인 영향을 미치지 않도록 하는 것이 매우 중요합니다. 그렇게 되는 경우 분석 코드 자체가 문제인지 알 수 없기 때문에 성능이 비즈니스에 미치는 영향에 대한 결과를 신뢰할 수 없게 됩니다.

프로덕션 사이트에 RUM 분석 코드를 배포할 때는 항상 다음 원칙을 따르세요.

### 분석 지연

분석 코드는 항상 비동기식, 비차단 방식으로 로드해야 하며 일반적으로 마지막에 로드해야 합니다. 차단 방식으로 분석 코드를 로드하면 LCP에 부정적인 영향을 미칠 수 있습니다.

Core Web Vitals 메트릭을 측정하는 데 사용되는 모든 API는 [`buffered`](https://www.chromestatus.com/feature/5118272741572608) 플래그를 통해 비동기 및 지연된 스크립트 로드를 지원하도록 특별히 설계되었으므로 스크립트를 일찍 로드하기 위해 서두를 필요가 없습니다.

페이지 로드 타임라인에서 나중에 계산할 수 없는 메트릭을 측정하는 경우라면 *초기에 실행해야 하는 코드만* 문서의 `<head>`에 인라인해야 합니다(그러므로 [렌더링 차단 요청이](https://developer.chrome.com/docs/lighthouse/performance/render-blocking-resources/) 아님). 그리고 나머지는 미루세요. 단일 메트릭에 필요하다고 해서 모든 분석을 초반에 로드할 필요는 없습니다.

### 긴 작업을 생성하지 말 것

분석 코드는 종종 사용자 입력에 대한 응답으로 실행되지만 분석 코드가 많은 DOM 측정을 수행하거나 다른 프로세서 집약적인 API를 사용하는 경우 분석 코드 자체가 입력 응답성을 저하시킬 수 있습니다. 또한 분석 코드가 포함된 JavaScript 파일이 큰 경우 해당 파일을 실행하면 메인 스레드가 차단되어 FID에 부정적인 영향을 미칠 수 있습니다.

### 비차단 API 사용

<code>[sendBeacon()](https://developer.mozilla.org/docs/Web/API/Navigator/sendBeacon)</code> 및 <code>[requestIdleCallback()](https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback)</code> 같은 API는 사용자에게 크리티컬한 태스크를 차단하지 않는 방식으로 크리티컬이 아닌 태스크를 운영하기 위해 특별히 설계되었습니다.

이러한 API는 RUM 분석 라이브러리에서 사용할 수 있는 훌륭한 도구입니다.

일반적으로 모든 분석 비콘은 `sendBeacon()` API(사용 가능한 경우)를 사용하여 전송되어야 하며 모든 수동 분석 측정 코드는 유휴 기간 실행되어야 합니다.

{% Aside %} 유휴 시간 사용을 최대화하는 동시에 필요할 때(예: 사용자가 페이지를 언로드하는 경우) 코드가 긴급하게 실행될 수 있도록 하는 방법을 알아보려면 [idle-until-urgent](https://philipwalton.com/articles/idle-until-urgent/) 패턴을 참조하세요. {% endAside %}

### 필요 이상으로 추적하지 말 것

브라우저는 많은 성능 데이터를 노출하지만 데이터를 사용할 수 있다고 해서 반드시 기록하고 분석 서버로 보내야 하는 것은 아닙니다.

예를 들어 [Resource Timing API](https://w3c.github.io/resource-timing/)는 페이지에 로드된 모든 단일 리소스에 대한 자세한 타이밍 데이터를 제공합니다. 그러나 모든 데이터가 리소스 로드 성능을 개선하는 데 반드시 또는 유용하지는 않죠.

존재하는 모든 데이터를 추적하지 마세요. 추적하기 위해 리소스를 사용하기 전에 해당 데이터가 사용될 것인지를 확인하는 것이 우선입니다.
