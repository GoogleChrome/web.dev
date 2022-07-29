---
layout: post
title: Cumulative Layout Shift(누적 레이아웃 이동, CLS)
authors:
  - philipwalton
  - mihajlija
date: 2019-06-11
updated: 2022-07-18
description: 이 게시물에서는 누적 레이아웃 이동(CLS) 메트릭을 소개하고 이를 측정하는 방법을 설명합니다.
tags:
  - performance
  - metrics
  - web-vitals
---

{% Aside 'caution' %} **2021년 6월 1일:** CLS 구현이 변경되었습니다. 변경 이유에 대해 자세히 알아보려면 [진화하는 CLS 메트릭](/evolving-cls)을 확인하시기 바랍니다. {% endAside %}

{% Aside 'key-term' %} 누적 레이아웃 이동(CLS)은 사용자가 예상치 못한 레이아웃 이동을 경험하는 빈도를 수량화하므로 [시각적 안정성](/user-centric-performance-metrics/#types-of-metrics)을 측정할 때 중요한 사용자 중심 메트릭입니다. CLS가 낮으면 [우수](/user-centric-performance-metrics/#questions)한 사용자 경험을 보장하는 데 도움이 됩니다. {% endAside %}

페이지에 갑자기 바뀌는 부분이 생기는 온라인 기사를 읽으신 경험이 있으신가요? 아무런 경고 없이 텍스트가 움직이며 읽던 부분을 놓치게 되거나, 더 심한 경우 링크나 버튼을 탭하기 직전 갑작스레 링크가 움직이는 바람에 다른 걸 클릭할 수도 있습니다.

대부분의 경우 이러한 경험은 짜증스러운 정도에서 그치지만, 경우에 따라 실제 피해를 겪게 될 수 있습니다.

<figure>
  <video autoplay controls loop muted poster="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability-poster.png" width="658" height="510">
    <source src="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability2.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/web-dev-assets/layout-instability-api/layout-instability2.mp4" type="video/mp4; codecs=h264">
  </source></source></video>
  <figcaption>불안정한 레이아웃이 사용자에게 어떻게 부정적인 영향을 미칠 수 있는지 보여주는 스크린캐스트.</figcaption></figure>

페이지 콘텐츠의 예기치 않은 이동은 일반적으로 리소스가 비동기식으로 로드되거나 DOM 요소가 기존 콘텐츠 위의 페이지에 동적으로 추가되기 때문에 발생합니다. 원인은 알 수 없는 크기의 이미지나 동영상, 대체 크기보다 크거나 작게 렌더링되는 글꼴, 동적으로 크기가 조정되는 타사 광고 또는 위젯일 수 있습니다.

이것이 더욱 큰 문제가 되는 이유는 개발 중인 사이트가 기능하는 방식이 종종 사용자가 경험하는 방식과 상당히 다르다는 것입니다. 대부분 개인화된 콘텐츠나 타사 콘텐츠는 프로덕션 환경에서는 개발 환경과 동일하게 작동하지 않고, 테스트 이미지는 이미 개발자의 브라우저 캐시에 존재하며, 로컬에서 실행되는 API 호출이 너무 빨라 지연이 눈에 띄지 않는 경우가 많기 때문입니다.

누적 레이아웃 이동(CLS) 메트릭은 실제 사용자에게 이러한 일이 발생하는 빈도를 측정하여 이 문제를 해결하는 데 도움을 줍니다.

## CLS란 무엇인가요?

CLS는 페이지의 전체 수명 동안 발생하는 모든 [예기치 않은](/cls/#expected-vs.-unexpected-layout-shifts) 레이아웃 이동에 대해 가장 큰 *레이아웃 이동 점수* 버스트를 뜻합니다.

*레이아웃 이동*은 시각적 요소가 렌더링된 프레임에서 다음 프레임으로 위치를 변경할 때마다 발생합니다. 개별 [레이아웃 이동 점수](#layout-shift-score) 계산 방법에 대한 자세한 내용은 아래를 참조하세요.

[*세션 기간*](evolving-cls/#why-a-session-window)으로 알려진 레이아웃 이동 버스트는 하나 이상의 개별 레이아웃 이동이 빠르게 연속해서 이루어지는 경우를 뜻합니다. 이때 각 레이아웃 사이 간격은 1초 미만이며, 총 기간은 최대 5초입니다.

가장 큰 버스트는 해당 기간 내 모든 레이아웃 이동에 대해 누적 점수가 최대인 세션 기간입니다.

<figure>
  <video controls autoplay loop muted width="658" height="452">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.webm" type="video/webm">
    <source src="https://storage.googleapis.com/web-dev-assets/better-layout-shift-metric/session-window.mp4" type="video/mp4">
  </source></source></video>
  <figcaption>세션 기간의 예시입니다. 파란색 막대는 개별 레이아웃 이동의 점수를 나타냅니다.</figcaption></figure>

{% Aside 'caution' %} 이전 CLS는 페이지의 전체 수명 동안 발생한 *모든 개별 레이아웃 이동 점수*의 합계를 측정했습니다. 원래 구현과 비교하여 벤치마킹할 수 있는 기능을 제공하는 도구가 무엇인지 확인하려면 [웹 도구에서 진화하는 누적 레이아웃 이동](/cls-web-tooling)을 참조하세요. {% endAside %}

### 좋은 CLS 점수는 무엇인가요?

우수한 사용자 경험을 제공하려면 사이트의 CLS 점수가 **0.1** 이하여야 합니다. 대부분의 사용자에 대해 이 목표를 달성할 수 있도록 하려면 모바일 및 데스크톱 기기 전반에 분할된 페이지 로드의 **75번째 백분위수**를 측정하는 것이 바람직한 임계값입니다.

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9mWVASbWDLzdBUpVcjE1.svg" | imgix }}" media="(min-width: 640px)" width="400", height="100">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uqclEgIlTHhwIgNTXN3Y.svg", alt="양호한 CLS 값은 0.1 미만이고 불량한 값은 0.25보다 크며 그 사이에는 개선이 필요합니다", width="400", height="300" %}
</picture>

{% Aside %} 이러한 권장 사항의 기반이 되는 연구 및 방법론에 대해 자세히 알아보려면 [Core Web Vitals 메트릭 임계값 정의](/defining-core-web-vitals-thresholds/)를 참조하시기 바랍니다. {% endAside %}

## 레이아웃 이동 상세 정보

레이아웃 이동은 [Layout Instability API](https://developer.mozilla.org/docs/Web/CSS/writing-mode)가 정의하는 것으로, 뷰포트 내의 가시적 요소가 두 프레임 사이에서 시작 위치가 변경될 때마다(예: 기본 [쓰기 모드](https://github.com/WICG/layout-instability) 의 상단 및 왼쪽 위치) `layout-shift` 항목을 보고합니다. 그리고 이러한 요소는 *불안정 요소*로 간주됩니다.

레이아웃 이동은 기존 요소가 시작 위치를 변경할 때만 발생합니다. 새 요소가 DOM에 추가되거나 기존 요소의 크기가 변경되면 변경으로 인해 다른 가시적 요소의 시작 위치가 변경되지 않는 한 레이아웃 이동으로 간주되지 않습니다.

### 레이아웃 이동 점수

*레이아웃 이동 점수*를 계산하기 위해 브라우저는 렌더링된 두 개의 프레임 사이 뷰포트의 크기와 뷰포트 내 *불안정 요소*의 움직임을 살핍니다. 레이아웃 이동 점수는 해당 움직임에 대한 *impact fraction*(영향분율)과 *distacne fraction*(거리분율)이라는 두 가지 측정값을 사용해 계산합니다.

```text
layout shift score = impact fraction * distance fraction
```

### 영향분율

[영향분율](https://github.com/WICG/layout-instability#Impact-Fraction)은 *불안정 요소*가 두 프레임 사이 뷰포트 영역에 미치는 영향을 측정합니다.

이전 프레임과 현재 프레임 *모두*에서 *불안정 요소* 가시 영역의 합집함은 뷰포트 총 영역의 일부로서 현재 프레임에 대한 *영향분율*입니다.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BbpE9rFQbF8aU6iXN1U6.png", alt=" *불안정 요소*가 하나 있는 영향분율 예시", width="800", height="600", linkTo=true %}

위 이미지에는 한 프레임에서 뷰포트의 절반을 차지하는 요소가 있습니다. 다음 프레임에서는 요소가 뷰포트 높이의 25%만큼 아래로 이동합니다. 빨간색 점선 직사각형은 두 프레임 모두에서 요소의 가시 영역을 합한 것입니다. 이 경우 전체 뷰포트의 75%이므로 *영향분율*은 `0.75`입니다.

### 거리분율

레이아웃 이동 점수 방정식의 또 다른 부분은 뷰포트를 기준으로 불안정 요소가 이동한 거리를 측정합니다. *거리분율*은 프레임에서 *불안정 요소*가 수평 또는 수직으로 이동한 최대 거리를 뷰포트의 가장 큰 치수(너비 또는 높이 중 더 큰 것)로 나눈 값입니다.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ASnfpVs2n9winu6mmzdk.png", alt="*불안정 요소*가 하나 있는 거리분율 예시", width="800", height="600", linkTo=true %}

위의 예에서 가장 큰 뷰포트 치수는 높이이고 불안정한 요소는 뷰포트 높이의 25%만큼 이동하였으므로 *거리분율*은 0.25가 됩니다.

따라서 이 예에서 *영향분율*은 `0.75`이고 *거리분율*은 `0.25`이므로 *레이아웃 이동 점수* 는 `0.75 * 0.25 = 0.1875` 입니다.

{% Aside %} 처음에 레이아웃 이동 점수는 *영향분율*만을 기준으로 계산되었습니다. 그러다가 크기가 큰 요소가 소량으로 이동하는 경우에 과도한 페널티를 주는 것을 피하기 위해 *거리분율*이 도입되었습니다. {% endAside %}

다음 예는 기존 요소에 콘텐츠를 추가하면 레이아웃 이동 점수에 어떤 영향을 미치는지 보여줍니다.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xhN81DazXCs8ZawoCj0T.png", alt="안정적 요소, *불안정 요소*, 뷰포트 클리핑이 있는 레이아웃 이동 예시", width="800", height="600", linkTo=true %}

"Click Me!" 버튼이 검은색 텍스트가 있는 회색 상자의 맨 아래에 추가되어 흰색 텍스트가 있는 녹색 상자를 아래로(그리고 부분적으로 뷰포트 밖으로) 밀어냅니다.

이 예에서 회색 상자는 크기가 변경되지만 시작 위치는 변경되지 않으므로 *불안정 요소* 가 아닙니다.

"Click Me!" 버튼은 이전에 DOM에 없었으므로 시작 위치도 변경되지 않습니다.

그러나 녹색 상자의 경우 시작 위치는 변경되었지만 부분적으로 뷰포트 밖으로 이동되었으며 *영향분율*을 계산할 때 보이지 않는 영역은 고려되지 않습니다. 두 프레임(빨간색 점선 직사각형으로 표시)에서 녹색 상자의 가시 영역 합은 첫 번째 프레임의 녹색 상자 영역(뷰포트의 50%)과 동일합니다. 그러므로 *영향분율*은 `0.5`입니다.

*거리분율*은 보라색 화살표로 표시되어 있습니다. 녹색 상자는 뷰포트의 약 14%만큼 아래로 이동하였으므로 *거리분율*은 `0.14`입니다.

레이아웃 이동 점수는 `0.5 x 0.14 = 0.07`입니다.

마지막 예시에는 *불안정 요소*가 여러 개 있습니다.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FdCETo2dLwGmzw0V5lNT.png", alt="안정적 요소, *불안정 요소*가 여러 개 있는 레이아웃 이동 예시", width="800", height="600", linkTo=true %}

위의 첫 번째 프레임에는 동물에 대한 API 요청의 네 가지 결과가 알파벳순으로 정렬되어 있습니다. 두 번째 프레임에서는 정렬된 목록에 더 많은 결과가 추가됩니다.

목록의 첫 번째 항목("Cat")은 프레임 간에 시작 위치를 변경하지 않으므로 안정적입니다. 마찬가지로 목록에 추가된 새 항목은 이전에 DOM에 없었으므로 시작 위치가 변경되지 않았습니다. 그러나 "Dog", "Horse", "Zebra"라고 표시된 항목은 모두 시작 위치가 변경되었으므로 *불안정 요소*입니다.

다시 말하지만, 빨간색 점선 직사각형은 이 세 가지 *불안정 요소*에 대한 전후 영역의 합을 나타내며, 이 경우 뷰포트 영역의 약 38%라고 볼 수 있습니다(*영향분율*: `0.38`).

화살표는 *불안정 요소*가 시작 위치에서 이동한 거리를 나타냅니다. 파란색 화살표로 표시된 "Zebra" 요소가 뷰포트 높이의 30% 정도로 가장 많이 이동했습니다. 따라서 이 예에서 *거리분율*은 `0.3`입니다.

레이아웃 전환 점수는 `0.38 x 0.3 = 0.1172`입니다.

### 예상한 레이아웃 이동 vs. 예상치 못한 레이아웃 이동

모든 레이아웃 변경이 나쁜 것은 아닙니다. 실제로 많은 동적 웹 응용 프로그램은 페이지에서 요소의 시작 위치를 자주 변경합니다.

#### 사용자 개시 레이아웃 이동

레이아웃 이동은 사용자가 예상하지 않은 경우에만 나쁩니다. 반면에 사용자 상호 작용(링크 클릭, 버튼 누르기, 검색 상자 입력 등)에 대한 응답으로 발생하는 레이아웃 이동은 사용자에게 그 관계가 명확하게 보이는 한 괜찮습니다.

예를 들어, 사용자 상호 작용이 완료하는 데 시간이 걸릴 수 있는 네트워크 요청을 트리거하는 경우 요청이 완료될 때 사용자에게 불편한 레이아웃 이동을 피하기 위해 즉시 공간을 만들고 로딩 표시기를 표시하는 것이 가장 좋습니다. 사용자가 무언가가 로드되고 있다는 사실을 깨닫지 못하거나 리소스가 언제 준비될지 알지 못하는 경우 대기 시간에 뭔가 다른 것을 클릭하게 될 수도 있습니다.

사용자 입력 후 500밀리초 이내에 발생하는 레이아웃 이동에는 [`hadRecentInput`](https://wicg.github.io/layout-instability/#dom-layoutshift-hadrecentinput) 플래그가 설정되어 계산에서 제외됩니다.

{% Aside 'caution' %} `hadRecentInput` 플래그는 탭, 클릭 또는 키 누르기와 같은 개별 입력 이벤트에 대해서만 true가 됩니다. 스크롤, 드래그, 핀치 및 줌 제스처와 같은 지속적인 상호 작용은 "최근 입력"으로 간주되지 않습니다. 자세한 내용은 [레이아웃 불안정 요소 사양](https://github.com/WICG/layout-instability#recent-input-exclusion) 을 참조하세요. {% endAside %}

#### 애니메이션 및 전환

제대로 된 애니메이션 및 전환은 사용자를 놀라게 하지 않고서도 페이지의 콘텐츠를 업데이트할 수 있는 좋은 방법입니다. 페이지에서 갑자기 예기치 않게 콘텐츠가 이동하는 경우는 거의 항상 좋지 않은 사용자 경험으로 이어집니다 그러나 한 위치에서 다음 위치로 점진적이고 자연스럽게 이동하는 콘텐츠는 사용자가 상황을 더 잘 이해하고, 사용자에게 상태의 변경을 안내하는 데 도움이 됩니다.

CSS [`transform`](https://developer.mozilla.org/docs/Web/CSS/transform) 속성을 사용하면 레이아웃 이동을 트리거하지 않고 요소에 애니메이션을 적용할 수 있습니다.

- `height` 및 `width` 속성을 변경하는 대신 `transform: scale()`을 사용하세요.
- 요소를 이동하려면 `top` , `right` , `bottom` 또는 `left` 속성을 변경하는 것은 피하고, 대신 `transform: translate()`를 사용하세요.

## CLS 측정 방법

CLS는 [실험실](/user-centric-performance-metrics/#in-the-lab)이나 [현장](/user-centric-performance-metrics/#in-the-field)에서 측정할 수 있으며 다음 도구에서 사용할 수 있습니다.

{% Aside 'caution' %} 실험실 도구는 일반적으로 인공적인 환경에서 페이지를 로드하므로 페이지 로드 중에 발생하는 레이아웃 이동만 측정할 수 있습니다. 결과적으로 주어진 페이지에 대해 랩 도구에서 보고한 CLS 값은 실제 사용자가 실제로 경험하는 것보다 작을 수 있습니다. {% endAside %}

### 현장 도구

- [Chrome User Experience Report](https://developer.chrome.com/docs/crux/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Search Console(Core Web Vitals Report)](https://support.google.com/webmasters/answer/9205520)
- [`web-vitals` JavaScript 라이브러리](https://github.com/GoogleChrome/web-vitals)

### 실험실 도구

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [WebPageTest](https://webpagetest.org/)

### JavaScript에서 CLS 측정

JavaScript에서 CLS를 측정하려면 [Layout Instability API를](https://github.com/WICG/layout-instability) 사용할 수 있습니다. 다음 예시에서는 예기치 않은 `layout-shift` 항목을 수신 대기하고, 세션으로 그룹화하고, 변경될 때마다 최대 세션 값을 기록하는 [`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) 를 생성하는 방법을 보여줍니다.

```js
let clsValue = 0;
let clsEntries = [];

let sessionValue = 0;
let sessionEntries = [];

new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    // Only count layout shifts without recent user input.
    if (!entry.hadRecentInput) {
      const firstSessionEntry = sessionEntries[0];
      const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

      // If the entry occurred less than 1 second after the previous entry and
      // less than 5 seconds after the first entry in the session, include the
      // entry in the current session. Otherwise, start a new session.
      if (sessionValue &&
          entry.startTime - lastSessionEntry.startTime < 1000 &&
          entry.startTime - firstSessionEntry.startTime < 5000) {
        sessionValue += entry.value;
        sessionEntries.push(entry);
      } else {
        sessionValue = entry.value;
        sessionEntries = [entry];
      }

      // If the current session value is larger than the current CLS value,
      // update CLS and the entries contributing to it.
      if (sessionValue > clsValue) {
        clsValue = sessionValue;
        clsEntries = sessionEntries;

        // Log the updated value (and its entries) to the console.
        console.log('CLS:', clsValue, clsEntries)
      }
    }
  }
}).observe({type: 'layout-shift', buffered: true});
```

{% Aside 'warning' %}

이 코드는 CLS를 계산하고 기록하는 기본적인 방법을 보여줍니다. 그러나 [Chrome User Experience Report](https://developer.chrome.com/docs/crux/)(CrUX)에서 측정된 것과 일치하는 방식으로 CLS를 정확하게 측정하는 것은 보다 복잡한 문제입니다. 자세한 내용은 아래를 참조하세요.

{% endAside %}

대부분의 경우 페이지가 언로드되는 시점의 현재 CLS 값이 해당 페이지의 최종 CLS 값이지만 몇 가지 중요한 예외 사항이 있습니다.

다음 섹션에는 API가 보고하는 내용과 메트릭이 계산되는 방법 사이의 차이점이 나열되어 있습니다.

#### 메트릭과 API의 차이점

- 페이지가 백그라운드에서 로드되거나 브라우저가 콘텐츠를 페인팅하기 전에 백그라운드화된 경우 CLS 값을 보고하지 않습니다.
- 페이지가 [백/포워드 캐시](/bfcache/#impact-on-core-web-vitals)에서 복원될 때 사용자는 이를 별개의 페이지 방문으로 경험하므로 해당 CLS 값을 0으로 재설정해야 합니다.
- API는 iframe 내에서 발생하는 이동에 대한 `layout-shift` 항목을 보고하지 않지만 CLS를 적절하게 측정하려면 이를 고려해야 합니다. 하위 프레임은 [집계](https://github.com/WICG/layout-instability#cumulative-scores)를 위해 API를 사용하여 상위 프레임에 `layout-shift` 항목을 보고할 수 있습니다.

이러한 예외 외에도 CLS는 페이지의 전체 수명을 측정하기 때문에 조금 더 복잡해집니다.

- 사용자는 며칠, 몇 주, 몇 달 등 *매우* 오랫동안 탭을 열어 둘 수 있습니다. 실제로 사용자는 탭을 닫지 않을 수도 있습니다.
- 모바일 운영 체제에서 브라우저는 일반적으로 백그라운드 탭에 대해 페이지 언로드 콜백을 실행하지 않으므로 "최종" 값을 보고하기 어렵습니다.

이러한 경우를 처리하려면 페이지가 언로드될 때뿐 아니라 페이지가 백그라운드일 때마다 CLS를 보고해야 합니다([`visibilitychange` 이벤트](https://developer.chrome.com/blog/page-lifecycle-api/#event-visibilitychange)는 이 두 시나리오 모두에 적용됨). 그리고 이 데이터를 수신하는 분석 시스템은 백엔드에서 최종 CLS 값을 계산해야 합니다.

개발자는 이러한 모든 경우를 직접 암기하고 고심하지 않아도, [`web-vitals` JavaScript 라이브러리](https://github.com/GoogleChrome/web-vitals)를 사용해 위에서 언급한 모든 것을 처리하는 CLS를 측정할 수 있습니다.

```js
import {getCLS} from 'web-vitals';

// Measure and log CLS in all situations
// where it needs to be reported.
getCLS(console.log);
```

JavaScript에서 CLS를 측정하는 방법에 대한 전체 예제는 [`getCLS)` 의 소스 코드](https://github.com/GoogleChrome/web-vitals/blob/master/src/getCLS.ts)를 참조하세요.

{% Aside %} 일부 경우(예: 교차 원본 iframe) JavaScript에서 CLS를 측정할 수 없습니다. 자세한 내용은 `web-vitals` 라이브러리의 [제한 사항](https://github.com/GoogleChrome/web-vitals#limitations) 섹션을 참조하세요. {% endAside %}

## CLS를 개선하는 방법

대부분의 웹사이트에서 다음과 같은 몇 가지 기본 원칙을 준수하면 예기치 않은 레이아웃 이동을 모두 방지할 수 있습니다.

- **이미지 및 비디오 요소에 항상 크기 속성을 포함하거나 [CSS 가로 세로 비율 상자](https://css-tricks.com/aspect-ratio-boxes/)와 같은 방식으로 필요한 공간을 미리 확보하세요.** 이러한 접근 방식을 사용하면 이미지가 로드되는 동안 브라우저가 문서에 올바른 양의 공간을 할당할 수 있습니다. [unsized-media 기능 정책](https://github.com/w3c/webappsec-feature-policy/blob/master/policies/unsized-media.md)을 사용하여 기능 정책을 지원하는 브라우저에서 이 동작을 강제할 수도 있습니다.
- **사용자 상호 작용에 대한 응답을 제외하고는 기존 콘텐츠 위에 콘텐츠를 삽입하지 마세요.** 이렇게 하면 레이아웃 이동이 발생하기 때문입니다.
- **레이아웃 변경을 트리거하는 속성의 애니메이션보다 전환 애니메이션을 사용하세요.** 상태에서 상태로 컨텍스트와 연속성을 제공하는 방식으로 애니메이션 전환을 수행하는 것이 좋습니다.

CLS를 개선하는 방법에 대한 자세한 내용은 [CLS 최적화](/optimize-cls/) 및 [레이아웃 이동 디버그](/debug-layout-shifts)를 참조하세요.

## 추가 리소스

- [레이아웃 이동 최소화](https://developers.google.com/doubleclick-gpt/guides/minimize-layout-shift)에 대한 Google Publisher Tag 지침
- [#PerfMatters](https://youtu.be/zIJuY-JCjqw)(2020년), [Annie Sullivan](https://anniesullie.com/)과 [Steve Kobes](https://kobes.ca/)의 [누적 레이아웃 이동 이해](https://perfmattersconf.com/) 동영상

{% include 'content/metrics/metrics-changelog.njk' %}
