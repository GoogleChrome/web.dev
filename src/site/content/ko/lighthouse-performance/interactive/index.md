---
layout: post
title: 상호 작용까지의 시간
description: Lighthouse의 상호 작용까지의 시간 메트릭과 이를 측정하고 최적화하는 방법에 대해 알아봅니다.
date: 2019-05-02
updated: 2019-10-10
web_lighthouse:
  - 상호 작용
---

상호 작용까지의 시간(TTI)은 Lighthouse 보고서의 **성능** 섹션에서 추적하는 6가지 메트릭 중 하나입니다. 각 메트릭은 페이지 로드 속도의 일부 측면을 캡처합니다.

일부 사이트에서는 상호 작용을 희생하면서 콘텐츠 가시성을 최적화하기 때문에 TTI 측정이 중요합니다. 이로 인해 실망스러운 사용자 경험이 생길 수 있습니다. 즉, 사이트가 준비된 것처럼 보이지만 사용자가 사이트와 상호 작용하려고 하면 아무 일도 일어나지 않습니다.

Lighthouse는 TTI를 초 단위로 표시합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/MOXhGOQxWpolq6nhBleq.png", alt="Lighthouse 상호 작용까지의 시간 감사를 보여주는 스크린샷", width="800", height="588" %}</figure>

## TTI로 측정되는 내용

TTI는 페이지가 *완전히* 상호 작용 가능하게 되는 데 걸리는 시간을 측정합니다. 다음과 같은 경우에 페이지가 완전한 상호 작용 가능한 것으로 간주됩니다.

- 페이지에 [첫 번째 콘텐츠풀 페인트](/fcp/)에 의해 측정되는 유용한 콘텐츠가 표시됩니다.
- 가장 많이 보이는 페이지 요소에 이벤트 핸들러가 등록됩니다.
- 페이지가 50밀리초 이내에 사용자 상호 작용에 응답합니다.

{% Aside %} [첫 번째 CPU 유휴](/first-cpu-idle) 및 TTI는 모두 페이지가 사용자 입력에 준비되는 시기를 측정합니다. 첫 번째 CPU 유휴는 사용자가 페이지와 상호 작용을 *시작*할 수 있을 때 발생합니다. TTI는 사용자가 페이지와 *완전히* 상호 작용할 수 있을 때 발생합니다. 각 메트릭에 대한 정확한 계산에 관심이 있다면 Google의 [첫 상호 작용 및 지속적 상호 작용](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit)을 참조하세요. {% endAside %}

## Lighthouse가 TTI 점수를 결정하는 방법

TTI 점수는 [HTTP 아카이브의 데이터](https://httparchive.org/reports/loading-speed#ttci)를 기반으로 페이지의 TTI와 실제 웹사이트의 TTI를 비교한 것입니다. 예를 들어, 99번째 백분위수에서 작동하는 사이트는 약 2.2초만에 TTI를 렌더링합니다. 웹사이트의 TTI가 2.2초라면 TTI 점수는 99입니다.

다음 표는 TTI 점수를 해석하는 방법을 보여줍니다.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>TTI 메트릭<br>(초)</th>
        <th>색상 코딩</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–3.8</td>
        <td>녹색(빠름)</td>
      </tr>
      <tr>
        <td>3.9–7.3</td>
        <td>주황색(보통)</td>
      </tr>
      <tr>
        <td>7.3 이상</td>
        <td>빨간색(느림)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## TTI 점수를 높이는 방법

TTI에 특히 큰 영향을 미칠 수 있는 한 가지 개선 사항은 불필요한 JavaScript 작업을 연기하거나 제거하는 것입니다. [JavaScript를 최적화](/fast#optimize-your-javascript)할 수 있는 기회를 찾아보세요. 특히, [코드 분할로 JavaScript 페이로드를 줄이](/apply-instant-loading-with-prpl)고 [PRPL 패턴을 적용](/reduce-javascript-payloads-with-code-splitting)하는 방법을 고려하세요. [타사 JavaScript를 최적화](/fast/#optimize-your-third-party-resources)해도 일부 사이트에서 상당한 개선이 이루어집니다.

다음 두 가지 진단 감사는 JavaScript 작업을 줄일 수 있는 추가 기회를 제공합니다.

- [메인 스레드 작업 최소화](/mainthread-work-breakdown)
- [JavaScript 실행 시간 단축](/bootup-time)

## 실제 사용자의 장치에서 TTI 추적

TTI가 실제로 사용자의 기기에서 발생하는 시점을 측정하는 방법을 알아보려면 Google의 [사용자 중심 성능 메트릭](/user-centric-performance-metrics/) 페이지를 참조하세요. [TTI 추적](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_tti) 섹션에서는 프로그래밍 방식으로 TTI 데이터에 액세스하고 이를 Google Analytics에 제출하는 방법을 설명합니다.

{% Aside %} TTI는 실제 상황에서 추적하기 어려울 수 있습니다. [첫 번째 입력 지연](https://developers.google.com/web/updates/2018/05/first-input-delay)을 추적하면 TTI를 간접적으로 가늠해볼 수 있습니다. {% endAside %}

{% include 'content/lighthouse-performance/improve.njk' %}

## 리소스

- [**상호 작용까지의 시간** 감사에 대한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/metrics/interactive.js)
- [Lighthouse 스코어링 가이드](/performance-scoring)
- [첫 상호 작용 및 지속적 상호 작용](https://docs.google.com/document/d/1GGiI9-7KeY3TPqS3YT271upUVimo-XiL5mwWorDUD4c/edit)
- [JavaScript 시작 최적화](/optimizing-content-efficiency-javascript-startup-optimization/)
- [트리 쉐이킹으로 JavaScript 페이로드 줄이기](https://developers.google.com/web/fundamentals/performance/optimizing-javascript/tree-shaking/)
- [타사 리소스 최적화](/fast/#optimize-your-third-party-resources)
