---
layout: post
title: RAIL 모델을 사용한 성능 측정
description: |2-

  RAIL 모델을 통해 디자이너와 개발자는 사용자 경험에 가장 큰 영향을 미치는 성능 최적화 작업을 안정적으로 목표로 삼을 수 있습니다. RAIL 모델이 설정한 목표와 지침, 그리고 이를 달성하기 위해 사용할 수 있는 도구에 대해 알아봅니다.
date: 2020-06-10
tags:
  - performance
  - animations
  - devtools
  - lighthouse
  - metrics
  - mobile
  - network
  - rendering
  - ux
---

**RAIL**은 성능에 대해 생각할 수 있는 구조를 제공하는 **사용자 중심**의 성능 모델입니다. 이 모델은 사용자 경험을 주요 작업(예: 탭, 스크롤, 로드)으로 분류하고 각각에 대한 성능 목표를 정의하는 데 도움을 줍니다.

RAIL은 웹 앱 수명 주기의 4가지 뚜렷한 측면인 응답(response), 애니메이션(animation), 유휴 상태(idle) 및 로드(load)를 나타냅니다. 사용자는 이러한 각 컨텍스트에 대해 서로 다른 성능 기대치를 가지고 있으므로 컨텍스트 및 [사용자가 지연을 인식하는 방식에 대한 UX 연구](https://www.nngroup.com/articles/response-times-3-important-limits/)를 기반으로 성능 목표가 정의됩니다.

<figure>{% Img src="image/admin/uc1IWVOW2wEhIY6z4KjJ.png", alt="RAIL 성능 모델의 네 가지 부분: 응답(response), 애니메이션(animation), 유휴 상태(idle) 및 로드(load)", width="800", height="290" %} <figcaption>RAIL 성능 모델의 네 가지 부분</figcaption></figure>

## 사용자에게 집중

사용자를 성능 개선 노력의 중심에 둡니다. 아래 표는 사용자가 성능 지연을 인식하는 방식에 대한 주요 측정항목을 설명합니다.

<table class="table-wrapper scrollbar">
  <thead>성능 지연에 대한 사용자 인식</thead>
  <tr>
    <td>0~16ms</td>
    <td>사용자는 움직임을 추적하는 데 매우 능숙하며 애니메이션이 매끄럽지 않으면 싫어합니다. 사용자는 초당 60개의 새 프레임이 렌더링되는 한 애니메이션을 부드럽게 인식합니다. 이 경우 브라우저가 새 프레임을 화면에 그리는 데 걸리는 시간을 포함하여 프레임당 16ms이며, 앱에서 프레임을 생성하는 데에는 약 10ms가 걸립니다.</td>
  </tr>
  <tr>
    <td>0~100ms</td>
    <td>이 시간 내에 사용자 동작에 응답하면 창과 사용자는 결과가 즉각적이라고 느낍니다. 더 길어지면, 동작과 응답 사이의 연결이 끊어집니다.</td>
  </tr>
  <tr>
    <td>100~1000ms</td>
    <td>이 창에서 대상이 자연스럽고 지속적인 작업 진행의 일부로 느껴집니다. 대부분의 웹 사용자에게 페이지 로드 또는 보기 변경은 작업을 나타냅니다.</td>
  </tr>
  <tr>
    <td>1000ms 이상</td>
    <td>1000밀리초(1초)를 초과하면 사용자는 수행 중인 작업에 대한 집중을 잃습니다.</td>
  </tr>
  <tr>
    <td>10000ms 이상</td>
    <td>10000밀리초(10초)를 초과하면 사용자가 좌절하고 작업을 포기할 가능성이 높습니다. 사용자는 나중에 돌아올 수도 있고 그렇지 않을 수도 있습니다.</td>
  </tr>
</table>

{% Aside %} 사용자는 네트워크 조건 및 하드웨어에 따라 성능 지연을 다르게 인식합니다. 예를 들어, 빠른 Wi-Fi 연결을 사용하는 강력한 성능의 데스크톱 컴퓨터에서 사이트를 로드하면 일반적으로 1초 이내에 완료하며, 사용자는 이에 익숙해집니다. 연결 속도가 느린 3G 모바일 장치에서 사이트를 로드하면 시간이 더 오래 걸리므로 모바일 사용자는 일반적으로 더 인내하며 모바일에서 사이트를 5초 안에 로드한다는 현실적인 목표를 갖습니다. {% endAside %}

## 목표 및 지침

RAIL의 컨텍스트에서 **목표** 및 **지침**이라는 용어는 다음과 같은 구체적인 의미를 갖습니다.

- **목표**. 사용자 경험과 관련된 주요 성능 측정항목입니다. 예를 들어 탭하면 100밀리초 이내에 화면에 그립니다. 인간의 인식은 상대적으로 일정하기 때문에 이러한 목표는 조만간 변경되지 않을 것입니다.

- **지침**. 목표 달성에 도움이 되는 권장 사항입니다. 이는 현재 하드웨어 및 네트워크 연결 조건에 따라 다를 수 있으므로 시간이 지남에 따라 변경될 수 있습니다.

## 응답: 50ms 미만으로 이벤트 처리

**목표**: 사용자 입력으로 시작된 전환을 100ms 이내에 완료하여 사용자가 상호 작용이 즉각적인 것처럼 느끼게 합니다.

**지침**:

- 100ms 이내에 가시적인 응답을 보장하기 위해 50ms 이내에 사용자 입력 이벤트를 처리합니다. 이는 버튼 클릭, 양식 컨트롤 토글 전환 또는 애니메이션 시작과 같은 대부분의 입력에 적용됩니다. 이것은 터치하여 끌기 또는 스크롤에는 적용되지 않습니다.

- 직관적이지 않게 들릴 수 있지만 사용자 입력에 즉시 응답하는 것이 항상 올바른 호출은 아닙니다. 리소스를 많이 필요로 하는 비싼 작업을 수행하기 위해 이 100ms 창을 사용할 수 있지만 사용자를 차단하지 않게 주의해야 합니다. 가능하면 백그라운드에서 작업하도록 합니다.

- 완료하는 데 50ms 이상 걸리는 작업의 경우 항상 피드백을 제공합니다.

### 50ms 또는 100ms?

목표는 100ms 이내에 입력에 응답하는 것인데 우리의 예산은 왜 50ms에 불과할까요? 이는 일반적으로 입력 처리 외에 다른 작업이 수행되고 있으며, 해당 작업이 허용 가능한 입력 응답에 사용할 수 있는 시간의 일부를 차지하기 때문입니다. 애플리케이션이 유휴 시간 동안 권장되는 50ms 청크로 작업을 수행한다면, 이는 해당 작업 청크 중 하나의 동안 작업이 이루어질 때, 입력이 최대 50ms 동안 대기할 수 있음을 의미합니다. 이를 고려한다면 실제 입력 처리에 나머지 50ms만 사용할 수 있다고 가정하는 것이 안전합니다. 이러한 효과는 유휴 작업 동안 수신된 입력이 사용 가능한 처리 시간을 줄이며 큐에서 대기하는 방식을 보여주는 아래 다이어그램에 시각화되어 있습니다.

<figure>{% Img src="image/admin/I7HDZ9qGxe0jAzz6PxNq.png", alt="유휴 작업 동안 수신된 입력이 사용 가능한 처리 시간을 50ms로 줄이며 큐에서 대기하는 방식을 보여주는 다이어그램", width="800", height="400" %} <figcaption>유휴 작업이 입력 응답 예산에 영향을 미치는 방식.</figcaption></figure>

## 애니메이션: 10ms 안에 프레임 생성

**목표** :

- 애니메이션의 각 프레임을 10ms 이하로 생성합니다. 기술적으로 각 프레임의 최대 예산은 16ms(1000ms/초당 60프레임 ≈ 16ms)이지만 브라우저가 각 프레임을 렌더링하는 데 약 6ms가 필요하므로 프레임당 10ms의 지침이 필요합니다.

- 시각적 부드러움을 목표로 합니다. 프레임 속도가 달라지면 사용자가 알아차립니다.

**지침** :

- 애니메이션과 같이 높은 가중 지점에서의 핵심은 가능하다면 아무것도 하지 않고, 그럴 수 없는 경우 절대적으로 최소한의 작업만 수행합니다. 가능할 때마다 100ms 응답을 사용하여 값비싼 작업을 미리 계산하여 60fps에 도달할 가능성을 극대화합니다.

- 다양한 애니메이션 최적화 전략은 [렌더링 성능](/rendering-performance/)을 참조합니다.

{% Aside %} 모든 유형의 애니메이션을 인식합니다. 애니메이션은 단순한 UI 효과가 아닙니다. 이러한 각 상호 작용은 애니메이션으로 간주됩니다.

- 입구 및 출구, [트윈](https://www.webopedia.com/TERM/T/tweening.html) 및 로드 표시기와 같은 시각적 애니메이션.
- 스크롤. 여기에는 사용자가 스크롤을 시작한 다음 손을 떼면 페이지가 계속 스크롤되는 플링이 포함됩니다.
- 끌기. 지도를 이동하거나 손가락을 모아 확대/축소하는 것과 같이 애니메이션이 사용자 상호 작용을 따르는 경우가 종종 있습니다. {% endAside %}

## 유휴 상태: 유휴 시간 극대화

**목표**: 유휴 시간을 극대화하여 페이지가 50ms 이내에 사용자 입력에 응답할 가능성을 높입니다.

**지침** :

- 유휴 시간을 사용하여 지연 작업을 완료합니다. 예를 들어 초기 페이지 로드의 경우 데이터를 최대한 적게 로드한 후 [유휴 시간](https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback)을 사용하여 나머지를 로드합니다.

- 50ms 이내의 유휴 시간 동안 작업을 수행합니다. 더 길어지면 50ms 이내에 사용자 입력에 응답해야 하는 앱의 기능을 방해할 위험이 있습니다.

- 사용자가 유휴 시간 작업 중에 페이지와 상호 작용하는 경우 사용자 상호 작용이 항상 가장 높은 우선순위를 취하며, 유휴 시간 작업은 중단해야 합니다.

## 로드: 5초 이내에 콘텐츠를 전달하고 상호 작용 준비하기

로드: 5초 이내에 콘텐츠를 전달하고 대화형 준비 완료하기

**목표** :

- 사용자의 장치 및 네트워크 기능과 관련된 빠른 로드 성능을 최적화합니다. 현재 첫 번째 로드의 좋은 목표는 페이지를 로드하고 [느린 3G 연결을 사용하는 중급 휴대 장치에서 5초 이내](/tti/)로 [상호 작용](/performance-budgets-101/#establish-a-baseline) 준비를 완료하는 것입니다.

- 다음 로드의 경우 2초 이내로 페이지를 로드하는 것을 목표로 하는 것이 좋습니다.

{% Aside %}

이러한 목표는 시간이 지남에 따라 변경될 수 있습니다.

{% endAside %}

**지침** :

- 사용자 간에 공통적인 모바일 장치 및 네트워크 연결에서 로드 성능을 테스트합니다. [Chrome 사용자 경험 보고서](/chrome-ux-report/)를 사용하여 사용자의 [연결 분포](/chrome-ux-report-data-studio-dashboard/#using-the-dashboard)를 확인할 수 있습니다. 사이트에서 데이터를 사용할 수 없는 경우를 위해 [The Mobile Economy 2019](https://www.gsma.com/mobileeconomy/)는 Moto G4와 같은 중급 Android 휴대전화와 느린 3G 네트워크(400ms RTT 및 400kbps 전송 속도로 정의됨)가 좋은 글로벌 기준이라고 제안합니다. 이 조합은 [WebPageTest](https://www.webpagetest.org/easy)에서 사용할 수 있습니다.

- 일반적인 모바일 사용자의 장치가 2G, 3G 또는 4G에 연결되어 있어도 실제로는 패킷 손실 및 네트워크 변동으로 인해 [유효 연결 속도](/adaptive-serving-based-on-network-quality/#how-it-works)가 상당히 느린 경우가 많습니다.

- [렌더링 차단 리소스를 제거합니다](/render-blocking-resources/).

- 완전한 로드를 인식하기 위해 5초 이내에 모든 것을 로드할 필요는 없습니다. [지연 로드 이미지](/browser-level-image-lazy-loading/), [코드 분할 JavaScript 번들](/reduce-javascript-payloads-with-code-splitting/) 및 [web.dev에 제안된 기타 최적화](/fast/)를 고려해 보십시오.

{% Aside %} 페이지 로드 성능에 영향을 미치는 요인을 파악합니다.

- 네트워크 속도 및 대기 시간
- 하드웨어(예: 느린 CPU)
- 캐시 제거
- L2/L3 캐싱의 차이
- 자바스크립트 파싱 {% endAside %}

## RAIL 측정 도구

RAIL 측정을 자동화하는 데 도움이 되는 몇 가지 도구가 있습니다. 사용하는 도구는 필요한 정보 유형과 선호하는 워크플로 유형에 따라 다릅니다.

### Chrome DevTools

[Chrome DevTools](https://developer.chrome.com/docs/devtools/)는 페이지가 로드되거나 실행되는 동안 발생하는 모든 것에 대한 심층 분석을 제공합니다. **성능** 패널 UI에 익숙해지려면 [런타임 성능 분석 시작하기](https://developer.chrome.com/docs/devtools/evaluate-performance/)를 참조하십시오.

다음 DevTools 기능이 특히 관련이 있습니다.

- [CPU 조절](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#cpu-throttle)로 덜 강력한 장치를 시뮬레이션합니다.

- [네트워크 조절](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#network-throttle)로 느린 연결을 시뮬레이션합니다.

- [기본 스레드 활동 보기](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#main)로 기록하는 동안 기본 스레드에서 발생한 모든 이벤트를 봅니다.

- [표로 기본 스레드 활동 보기](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#activities)로 가장 많은 시간을 차지하는 활동을 기준으로 활동을 정렬합니다.

- [초당 프레임 수(FPS) 분석](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#fps)으로 애니메이션이 실제로 원활하게 실행되는지 측정합니다.

- **성능 모니터링**을 사용하여 실시간으로 [CPU 사용량, JS 힙 크기, DOM 노드, 초당 레이아웃 등을 모니터링](https://developers.google.com/web/updates/2017/11/devtools-release-notes#perf-monitor)합니다.

- **네트워크** 섹션을 사용하여 기록하는 동안 발생한 [네트워크 요청을 시각화](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#network)합니다.

- [기록하는 동안 스크린샷을 캡처](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#screenshots)하여 페이지가 로드되는 동안이나 애니메이션이 실행되는 동안 등에 페이지가 어떻게 보이는지 정확하게 재생합니다.

- [상호 작용 확인](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#interactions)으로 사용자가 페이지와 상호 작용한 후 페이지에서 발생한 일을 빠르게 식별합니다.

- 잠재적으로 문제가 있는 수신기가 실행될 때마다 페이지를 강조 표시하여 [실시간으로 스크롤 성능 문제를 찾습니다](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#scrolling-performance-issues).

- [실시간으로 페인트 이벤트 보기](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#paint-flashing)로 애니메이션 성능에 해를 끼칠 수 있는 비용이 많이 드는 페인트 이벤트를 식별합니다.

### Lighthouse

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 Chrome DevTools와 [web.dev/measure](/measure/)에서 사용하고, Chrome 확장 프로그램과 Node.js 모듈로 사용하거나 WebPageTest 내에서 사용할 수 있습니다. URL을 지정하면 느린 3G 연결을 사용하는 중급 장치를 시뮬레이션하고 페이지에서 일련의 감사를 실행한 다음 로드 성능에 대한 보고서와 개선 방법에 대한 제안을 제공합니다.

다음 감사가 특히 관련이 있습니다.

**응답**

- [최대 잠재적 최초 입력 지연(FID)](/lighthouse-max-potential-fid/) . 기본 스레드 유휴 시간을 기반으로 앱이 사용자 입력에 응답하는 데 걸리는 시간을 추정합니다.

- [스크롤 성능을 향상시키기 위해 소극적 수신기를 사용하지 않습니다](/uses-passive-event-listeners/) .

- [총 차단 시간](/lighthouse-total-blocking-time/) . 마우스 클릭, 화면 탭 또는 키보드 누름과 같은 사용자 입력에 응답하지 못하도록 페이지가 차단된 총 시간을 측정합니다.

- [상호 작용까지의 시간](https://developers.google.com/web/tools/lighthouse/audits/consistently-interactive). 사용자가 모든 페이지 요소와 일관되게 상호 작용할 수 있는 시점을 측정합니다.

**로드**

- [페이지 및 start_url을 제어하는 서비스 작업자를 등록하지 않습니다](/service-worker/). 서비스 작업자는 사용자 장치의 공통 리소스를 캐시하여 네트워크를 통해 리소스를 가져오는 데 소요되는 시간을 줄일 수 있습니다.

- [모바일 네트워크에서 페이지 로드가 충분히 빠르지 않습니다](/load-fast-enough-for-pwa/).

- [렌더링 차단 리소스를 제거합니다](https://developers.google.com/web/tools/lighthouse/audits/blocking-resources) .

- [오프스크린 이미지를 지연합니다](/offscreen-images/). 필요할 때까지 오프스크린 이미지 로드를 지연합니다.

- [이미지 크기를 적절하게 조정합니다](/uses-responsive-images/). 모바일 뷰포트에서 렌더링된 크기보다 훨씬 큰 이미지를 제공하면 안 됩니다.

- [중요한 요청의 연결을 피합니다](/critical-request-chains/).

- [모든 해당 리소스에 대해 HTTP/2를 사용하지 않습니다](/uses-http2/).

- [이미지를 효율적으로 인코딩합니다](/uses-optimized-images/).

- [텍스트 압축을 활성화합니다](/uses-text-compression/) .

- [거대한 네트워크 페이로드를 피합니다](/total-byte-weight/).

- [과도한 DOM 크기를 피합니다](/dom-size/). 페이지를 렌더링하는 데 필요한 DOM 노드만 전달하여 네트워크 바이트를 줄입니다.

### WebPageTest

WebPageTest는 실제 브라우저를 사용하여 웹페이지에 액세스하고 타이밍 측정항목을 수집하는 웹 성능 도구입니다. 느린 3G 연결을 사용하는 실제 Moto G4 장치에서의 페이지의 로드 성능에 대한 자세한 보고서를 받으려면 [webpagetest.org/easy](https://webpagetest.org/easy)에 URL을 입력합니다. Lighthouse 감사를 포함하도록 구성할 수도 있습니다.

## 요약

RAIL은 웹사이트의 사용자 경험을 고유한 상호 작용으로 구성된 여정으로 보기 위한 렌즈입니다. 사용자 경험에 가장 큰 영향을 미치는 성능 목표를 설정하기 위해 사용자가 사이트를 어떻게 인식하는지 이해해야 합니다.

- 사용자에게 집중합니다.

- 100ms 이내에 사용자 입력에 응답합니다.

- 애니메이션 또는 스크롤 시 10ms 미만의 프레임을 생성합니다.

- 메인 스레드 유휴 시간을 극대화합니다.

- 5000ms 이내에 상호 작용 콘텐츠를 로드합니다.
