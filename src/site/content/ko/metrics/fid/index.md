---
layout: post
title: First Input Delay(최초 입력 지연, FID)
authors:
  - philipwalton
date: 2019-11-07
updated: 2022-07-18
description: 이 게시물에서는 최초 입력 지연(FID) 메트릭을 소개하고 이를 측정하는 방법을 설명합니다.
tags:
  - performance
  - metrics
---

{% Aside %} 최초 입력 지연(FID)은 사용자가 응답하지 않는 페이지와 상호 작용할 때 느끼는 경험을 수량화하기 때문에 [로드 반응성](/user-centric-performance-metrics/#types-of-metrics)을 측정하기 위한 중요한 사용자 중심 메트릭입니다. FID가 낮아야 해당 페이지를 [사용할 수 있다](/user-centric-performance-metrics/#questions)는 의미입니다. {% endAside %}

좋은 첫인상을 남기는 것이 얼마나 중요한지 우리는 모두 알고 있습니다. 새로운 사람들을 만날 때도 그렇지만, 웹 경험을 구축할 때도 중요한 부분입니다.

웹의 첫인상은 사용자가 충성도 높은 사용자로 남을지, 해당 웹을 떠나 다시 돌아오지 않을지를 판가름하는 부분입니다. 그렇다면 무엇이 좋은 인상을 주는지, 그리고 사용자에게 어떤 인상을 줄 가능성이 있는지 측정하는 방법은 무엇일까요?

웹에서 첫인상은 매우 다양한 형태를 취할 수 있습니다. 사이트의 디자인과 매력적인 시각적 요소는 물론, 속도와 응답성에 대한 첫인상도 있습니다.

웹 API로 사용자가 사이트 디자인을 얼마나 좋아하는지 측정하는 것은 어렵지만, 속도와 응답성을 측정하는 것은 어렵지 않습니다.

사용자의 사이트 로드에 대한 첫인상은 [First Contentful Paint(최초 콘텐츠풀 페인트, FCP)](/fcp/)를 통해 측정할 수 있습니다. 그러나 사이트가 화면에 픽셀을 얼마나 빨리 칠할 수 있는지는 일부일 뿐이며, 사용자가 해당 픽셀과 상호 작용하려고 할 때 사이트의 반응 속도 역시 중요하게 살펴야 할 부분입니다.

최초 입력 지연(FID) 메트릭은 사이트의 상호 작용성과 반응성에 대한 사용자의 첫인상을 측정하는 데 도움이 됩니다.

## FID란 무엇인가요?

FID는 사용자가 페이지와 처음 상호 작용할 때(예: 링크를 클릭하거나 버튼을 탭하거나 사용자 지정 JavaScript 기반 컨트롤을 사용할 때)부터 해당 상호 작용에 대한 응답으로 브라우저가 실제로 이벤트 핸들러 처리를 시작하기까지의 시간을 측정합니다.

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eXyvkqRHQZ5iG38Axh1Z.svg" | imgix }}" media="(min-width: 640px)" width="400", height="100">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Se4TiXIdp8jtLJVScWed.svg", alt="좋은 fid 값은 2.5초, 나쁜 값은 4.0초보다 크며 그 사이에 개선이 필요함", width="400", height="300" %}
</picture>

### 좋은 FID 점수는 무엇인가요?

우수한 사용자 경험을 제공하려면 사이트의 최초 입력 지연 값이 **100밀리초** 이하여야 합니다. 대부분의 사용자에 대해 이 목표를 달성할 수 있도록 하려면 모바일 및 데스크톱 기기 전반에 분할된 페이지 로드의 **75번째 백분위수**를 측정하는 것이 바람직한 임계값입니다.

{% Aside %} 이러한 권장 사항의 기반이 되는 연구 및 방법론에 대해 자세히 알아보려면 [Core Web Vitals 메트릭 임계값 정의](/defining-core-web-vitals-thresholds/)를 참조하시기 바랍니다. {% endAside %}

## FID 상세 정보

이벤트에 응답하는 코드를 작성하는 개발자로서 우리는 종종 이벤트가 발생하는 즉시 코드가 실행될 것이라고 가정합니다. 그러나 사용자로서는 자주 반대의 경험을 하곤 하죠. 전화기에 로드된 웹페이지에 상호 작용을 시도했을 때 아무 일도 일어나지 않아 좌절을 겪곤 합니다.

일반적으로 입력 지연(입력 대기 시간이라고도 함)은 브라우저의 메인 스레드가 다른 작업을 하고 있어 사용자에게 아직은 응답할 수 없기 때문에 발생합니다. 이러한 일이 발생하는 일반적인 이유로는 브라우저가 앱에서 로드한 대규모 JavaScript 파일을 구문 분석하고 실행하기 때문입니다. 그렇게 하는 동안에는 로드 중인 JavaScript가 다른 작업을 수행하도록 지시할 수 있기 때문에 이벤트 리스너를 실행할 수 없습니다.

{% Aside 'gotchas' %} FID는 이벤트 처리에서 "지연" 부분만 측정하며 이벤트 처리 시간 자체나 브라우저에서 이벤트 핸들러를 실행한 후 UI를 업데이트하는 데 걸리는 시간은 측정하지 않습니다. 이 시간은 사용자 경험에 영향을 미치지만 이를 FID의 일부로 포함하는 경우 개발자는 이벤트에 비동기적으로 응답하는 방향으로 유도됩니다. 이러한 방식은 메트릭 자체는 개선하지만 경험은 악화시킬 수 있습니다. 자세한 내용은 아래에서 [입력 지연만 고려하는 이유](#why-only-consider-the-input-delay)를 참조하십시오. {% endAside %}

다음과 같이 일반적인 웹 페이지 로드와 관련한 타임라인을 고려하시기 바랍니다.

{% Img src="image/admin/9tm3f6pwlHMqNKuFvaP0.svg", alt="페이지 로드 추적 예시", width="800", height="260", linkTo=true %}

위의 시각화는 리소스(CSS 및 JS 파일일 확률이 큼)에 대한 몇 가지 네트워크 요청을 수행하고 해당 리소스에서 다운로드를 완료한 후 메인 스레드에서 처리되는 페이지를 보여줍니다.

이로 인해 메인 스레드는 일시적으로 사용 중인 상태가 되며 베이지색 [작업](https://html.spec.whatwg.org/multipage/webappapis.html#concept-task) 블록으로 표시됩니다.

페이지에서 일부 콘텐츠를 렌더링했지만 아직 안정적으로 상호 작용할 수 없는 상태이므로 일반적으로 긴 최초 입력 지연은 [First Contentful Paint(최초 콘텐츠풀 페인트, FCP)](/fcp/)와 [Time to Interactive(상호 작용까지의 시간, TTI)](/tti/) 사이에 발생합니다. 어떻게 이러한 일이 발생하는지 설명하기 위해 FCP와 TTI가 타임라인에 추가되었습니다.

{% Img src="image/admin/24Y3T5sWNuZD9fKhkuER.svg", alt="FCP 및 TTI가 있는 페이지 로드 추적의 예시", width="800", height="340", linkTo=true %}

FCP와 TTI 사이에 상당한 시간이 소요(3개의 [긴 작업](/custom-metrics/#long-tasks-api) 포함)되었다는 것을 확인하실 수 있습니다. 사용자가 해당 시간에 페이지와 상호 작용을 시도하면(예: 링크 클릭), 클릭이 수신되는 시기와 메인 스레드가 응답할 수 있는 시기 사이에 지연이 발생합니다.

사용자가 가장 긴 작업이 시작될 때 상호 작용을 시도하는 경우 어떤 일이 일어날지 생각해 봅시다.

{% Img src="image/admin/krOoeuQ4TWCbt9t6v5Wf.svg", alt="FCP, TTI, FID가 있는 페이지 로드 추적의 예시", width="800", height="380", linkTo=true %}

브라우저가 작업을 실행하는 동안 입력이 발생하기 때문에 입력에 응답하려면 작업이 완료될 때까지 기다려야 합니다. 이러한 대기 시간이 바로 이 페이지에서 이 사용자에 대한 FID 값입니다.

{% Aside %} 이 예에서 사용자는 메인 스레드가 가장 바쁘게 작업하는 기간이 시작될 때 페이지와 상호 작용했습니다. 사용자가 조금 더 일찍(유휴 기간 동안) 페이지와 상호 작용했다면 브라우저가 즉시 응답했을 수 있습니다. 입력 지연의 이러한 차이는 메트릭을 보고할 때 FID 값의 분포를 살펴보는 것이 왜 중요한지를 분명히 보여줍니다. FID 데이터 분석 및 보고에 대한 내용은 아래 섹션에서 자세히 알아볼 수 있습니다. {% endAside %}

### 상호 작용에 이벤트 리스너가 없으면 어떻게 되나요?

FID는 입력 이벤트가 수신된 시점과 메인 스레드가 다음 유휴 상태에 들어간 시점 사이의 델타를 측정합니다. 즉 **이벤트 리스너가 등록되지 않은 경우에도** FID가 측정된다는 의미입니다. 이는 대다수의 사용자 상호 작용에 이벤트 리스너는 필요하지 않지만, 실행을 위해서는 메인 스레드가 유휴 상태가 될 *필요가 있기* 때문입니다.

예를 들어 다음 HTML 요소는 모두 사용자 상호 작용에 응답하려면 메인 스레드에서 진행 중인 작업이 완료될 때까지 대기해야 합니다.

- 텍스트 필드, 체크박스, 라디오 버튼( `<input>` , `<textarea>` )
- 선택 드롭다운( `<select>` )
- 링크( `<a>` )

### 최초 입력만 고려하는 이유는 무엇인가요?

입력 지연으로 인해 사용자 경험이 좋지 않을 수 있지만 주로 다음과 같은 몇 가지 이유로 첫 번째 입력 지연을 측정하는 것이 좋습니다.

- 최초 입력 지연은 사이트의 응답성에 대한 사용자의 첫인상이 될 것이며, 사이트의 품질과 신뢰성에 대한 전반적인 인상을 형성하는 데 중요합니다.
- 오늘날 웹에서 볼 수 있는 가장 큰 상호 작용 문제는 페이지 로드 중에 발생합니다. 따라서 처음에는 사이트의 최초 사용자 상호 작용을 개선하는 데 중점을 두는 것이 웹의 전반적인 상호 작용을 개선하는 데 가장 큰 영향을 미치게 될 것입니다.
- 사이트의 긴 최초 입력 지연을 수정하는 방법에 대한 권장 솔루션(코드 분할, 더 작은 JavaScript부터 먼저 로드하기 등)과 페이지 로드 후 느린 입력 지연 수정 솔루션이 반드시 같은 것은 아닙니다. 이러한 메트릭을 분리해 웹 개발자에게 보다 특정한 성능 가이드라인을 제시할 수 있습니다.

### 최초 입력으로 간주되는 것은 무엇인가요?

FID는 로드 중 페이지의 응답성을 측정하는 메트릭입니다. 따라서 클릭, 탭 및 키 누름과 같은 개별 작업의 입력 이벤트에만 초점을 맞춥니다.

스크롤 및 확대/축소와 같은 다른 상호 작용은 연속 작업이며 완전히 다른 성능 제약 조건을 갖습니다. 또한 브라우저에서는 보통 이를 별도의 스레드에서 실행하여 대기 시간을 숨길 수 있습니다.

즉, FID는 [RAIL 성능 모델](/rail/) 중 R(반응성)에 중점을 두는 반면, 스크롤 및 확대/축소는 A(애니메이션)에 가깝기 때문에 성능 품질도 개별적으로 평가되어야 합니다.

### 사용자가 사이트와 상호 작용하지 않으면 어떻게 되나요?

모든 사용자가 방문할 때마다 사이트와 상호 작용하는 것은 아닙니다. 그리고 이전 섹션에서 언급한 바와 같이 모든 상호 작용이 FID와 관련이 있는 것도 아닙니다. 또한 첫 번째 상호 작용이 좋지 않은 타이밍(메인 스레드가 오랫동안 바쁘게 작업 중일 때)에 이루어진 사용자도, 원활한 타이밍(메인 스레드가 완전히 유휴 상태일 때)에 이루어진 사용자도 있습니다.

즉 사용자마다 FID 값이 없거나, 낮거나, 높을 수 있다는 것입니다.

FID를 추적, 보고 및 분석하는 방법은 기존에 사용하던 다른 메트릭과는 상당히 다를 수 있습니다. 다음 섹션에서는 이를 수행하는 가장 좋은 방법을 설명합니다.

### 입력 지연만 고려하는 이유는 무엇인가요?

위에서 언급했듯 FID는 이벤트 처리의 "지연"만 측정합니다. 이벤트 처리 시간 자체나 브라우저에서 이벤트 핸들러를 실행한 후 UI를 업데이트하는 데 걸리는 시간은 측정하지 않습니다.

이 시간은 사용자에게 중요한 요소이며 사용자 경험에도 *확실히* 영향을 미치지만, 이 메트릭에는 포함되지 않습니다. 이 시간을 메트릭에 포함한다면 개발자가 실제적으로 경험에 악영향을 미칠 워크로드를 추가할 가능성이 높아지기 때문입니다. 예를 들면 이벤트 핸들러 로직을 비동기화 콜백(`setTimeout()` 또는 `requestAnimationFrame()` 사용)으로 감싸 이벤트와 관련된 작업으로부터 이를 분리하는 방법을 선택하게 될 수 있습니다. 그 결과 메트릭 점수는 좋아지지만, 사용자가 인지하는 응답 시간은 더 느려지게 됩니다.

그러나 FID는 이벤트 대기 시간의 '지연' 부분만 측정하지만 더 많은 이벤트 수명 주기를 추적하려는 개발자는 [Event Timing API](https://wicg.github.io/event-timing/)를 사용하여 추적할 수 있습니다. 자세한 내용은 [커스텀 메트릭](/custom-metrics/#event-timing-api)에 대한 가이드를 참조하시기 바랍니다.

## FID 측정 방법

FID는 실제 사용자가 페이지와 상호 작용해야 하므로 [사이트](/user-centric-performance-metrics/#in-the-field)에서만 측정할 수 있는 메트릭입니다. 다음 도구를 사용하여 FID를 측정할 수 있습니다.

{% Aside %} FID는 실제 사용자가 필요하므로 실험실에서 측정할 수 없습니다. 그러나 [Total Blocking Time(총 차단 시간, TBT)](/tbt/) 메트릭은 실험실에서 측정할 수 있고 사이트의 FID와 상관관계가 있으며 상호 작용에 영향을 미치는 문제도 포착합니다. 즉, 실험실에서 TBT를 개선하는 최적화는 사용자를 위한 FID 또한 개선합니다. {% endAside %}

### 현장 도구

- [Chrome User Experience Report](https://developer.chrome.com/docs/crux/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Search Console(Core Web Vitals Report)](https://support.google.com/webmasters/answer/9205520)
- [`web-vitals` JavaScript 라이브러리](https://github.com/GoogleChrome/web-vitals)

### JavaScript에서 FID 측정

JavaScript에서 FID를 측정하려면 [Event Timing API](https://wicg.github.io/event-timing)를 사용할 수 있습니다. 다음 예시에서는 [`PerformanceObserver`](https://wicg.github.io/event-timing/#sec-performance-event-timing)를 작성해 [`first-input`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) 항목을 수신 대기하고 콘솔에 기록하는 방법을 확인하실 수 있습니다.

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    const delay = entry.processingStart - entry.startTime;
    console.log('FID candidate:', delay, entry);
  }
}).observe({type: 'first-input', buffered: true});
```

{% Aside 'warning' %} 이 코드는 `first-input` 항목을 기록하고 지연을 계산하는 방법을 보여줍니다. 그러나 JavaScript에서 FID를 측정하는 것은 이보다 복잡합니다. 자세한 내용은 아래를 참조하세요. {% endAside %}

위의 예에서 `first-input` 항목의 지연 값은 항목의 `startTime` 과 `processingStart` 타임스탬프 간의 델타를 취하여 측정됩니다. 대부분의 경우 이러한 측정 값은 FID 값이 됩니다. 그러나 모든 `first-input` 항목이 FID 측정에 유효한 것은 아닙니다.

다음 섹션에는 API가 보고하는 내용과 메트릭이 계산되는 방법 사이의 차이점이 나열되어 있습니다.

#### 메트릭과 API의 차이점

- API는 백그라운드에 로드되는 페이지에 대한 `first-input` 항목을 발송하지만 이러한 페이지는 FID를 계산할 때 무시됩니다.
- 페이지가 최초 입력이 발생하기 전 백그라운드에 있었다면 API도 `first-input` 항목을 발송하지만 FID를 계산할 때는 해당 페이지를 무시해야 합니다. 입력은 전체 시간 내내 전경에 있던 페이지만 고려하기 때문입니다.
- 페이지가 [백/포워드 캐시](/bfcache/#impact-on-core-web-vitals)에서 복원될 때 API는 `first-input` 항목을 보고하지 않지만, 사용자는 이를 고유한 페이지 방문으로 경험하므로 FID는 측정되어야 합니다.
- API는 iframe 내에서 발생하는 입력을 보고하지 않지만 FID를 적절하게 측정하려면 이를 고려해야 합니다. 하위 프레임은 집계를 위해 API를 사용하여 상위 프레임에 `first-input` 항목을 보고합니다.

개발자는 이러한 미묘한 차이점을 모두 기억하는 대신 가능한 경우 다음과 같은 차이점을 처리해주는 [`web-vitals` JavaScript 라이브러리](https://github.com/GoogleChrome/web-vitals)를 사용하여 FID를 측정할 수 있습니다.

```js
import {getFID} from 'web-vitals';

// FID를 이용 가능하게 되면 바로 측정 및 기록합니다.
getFID(console.log);
```

JavaScript에서 FID를 측정하는 방법에 대한 전체 예제는 [`getFID)`의 소스 코드](https://github.com/GoogleChrome/web-vitals/blob/master/src/getFID.ts)를 참조하세요.

{% Aside %} 일부 경우(예: 교차 원본 iframe) JavaScript에서 FID를 측정할 수 없습니다. 자세한 내용은 `web-vitals` 라이브러리의 [제한 사항](https://github.com/GoogleChrome/web-vitals#limitations) 섹션을 참조하세요. {% endAside %}

### FID 데이터 분석 및 보고

FID 값에는 변동이 예상되므로, FID를 보고할 때는 값 분포를 살펴보고 더 높은 백분위수에 초점을 맞추는 것이 중요합니다.

모든 Core Web Vitals 임계값에 대해 [선택된 백분위수](/defining-core-web-vitals-thresholds/#choice-of-percentile)는 75번째이지만, FID는 특별히 95~99번째 백분위수를 확인하는 것이 좋습니다. 이는 사용자가 사이트에서 특별히 좋지 않다고 느끼는 첫 번째 경험에 해당하기 때문입니다. 또한, 이는 개선이 가장 크게 필요한 부분을 보여줍니다.

보고서를 장치 범주 또는 유형별로 분류하는 경우에도 마찬가지입니다. 예를 들어 데스크톱과 모바일에 대해 별도의 보고서를 실행하는 경우 데스크톱에서 가장 중요하게 생각하는 FID 값은 데스크톱 사용자의 95~99번째 백분위수여야 하고 모바일에서 가장 중요하게 여기는 FID 값은 모바일 사용자의 95~99번째 백분위수여야 합니다.

## FID를 개선하는 방법

특정 사이트에 대한 FID를 개선하는 방법을 알아보려면 Lighthouse 성능 감사를 실행하고 감사에서 제안하는 특정한 [기회](/lighthouse-performance/#opportunities)를 주의 깊게 살펴보시기 바랍니다.

FID는 필드 메트릭(Lighthouse는 실험실 메트릭 도구임)이지만 FID 개선 지침은 [총 차단 시간(TBT)](/tbt/)을 개선하는 지침과 동일합니다.

FID를 개선하는 방법에 대한 자세한 내용은 [FID 최적화](/optimize-fid/)를 참조하시기 바랍니다. FID를 개선할 수 있는 개별 성능 기술에 대한 추가 지침은 다음을 참조하세요.

- [타사 코드의 영향 줄이기](/third-party-summary/)
- [JavaScript 실행 시간 단축](/bootup-time/)
- [메인 스레드 작업 최소화](/mainthread-work-breakdown/)
- [요청 수를 낮게 유지하고 전송 크기를 작게 유지](/resource-summary/)

{% include 'content/metrics/metrics-changelog.njk' %}
