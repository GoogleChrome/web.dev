---
layout: post
title: 총 차단 시간
description: |2-

  Lighthouse의 총 차단 시간 메트릭과 이를 측정하고 최적화하는 방법에 대해 알아봅니다.
web_lighthouse:
  - 총 차단 시간
date: 2019-10-09
updated: 2021-06-04
---

총 차단 시간(TBT)은 Lighthouse 보고서의 **성능** 섹션에서 추적하는 메트릭 중 하나입니다. 각 메트릭은 페이지 로드 속도의 일부 측면을 포착합니다.

Lighthouse 보고서는 TBT를 밀리초 단위로 표시합니다.

<figure>{% Img src="image/MtjnObpuceYe3ijODN3a79WrxLU2/wk3OTIdxFPoUImDCnjic.png", alt="Lighthouse 총 차단 시간 감사를 보여주는 스크린샷", width="800", height="592" %}</figure>

## TBT 측정 항목

TBT는 마우스 클릭, 화면 탭 또는 키보드 누름과 같은 사용자 입력으로부터 페이지가 응답하지 못하도록 차단된 총 시간을 측정합니다. 합계는 [최초 콘텐츠풀 페인트](/fcp/)와 [상호 작용까지의 시간](/tti/) 사이의 모든 [긴 작업](/long-tasks-devtools)의 *차단 부분*을 더하여 계산합니다. 50ms 이상 실행되는 모든 작업은 긴 작업입니다. 50ms 이후의 시간이 차단 부분입니다. 예를 들어 Lighthouse가 70ms 길이의 작업을 감지하면 차단 부분은 20ms가 됩니다.

## Lighthouse가 TBT 점수를 산정하는 방법

TBT 점수는 모바일 장치에 로드되었을 때의 페이지 TBT 시간과 수백만 개의 실제 사이트 TBT 시간을 비교한 것입니다. Lighthouse 점수 임계값이 설정되는 방식을 알아보려면 [메트릭 점수를 산정하는 방식/a0}을 참조하십시오.](/performance-scoring/#metric-scores)

다음 표는 TBT 점수를 해석하는 방식을 보여줍니다.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>TBT 시간<br>(밀리초)</th>
        <th>색상 코딩</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–200</td>
        <td>녹색(빠름)</td>
      </tr>
      <tr>
        <td>200-600</td>
        <td>주황색(보통)</td>
      </tr>
      <tr>
        <td>600 초과</td>
        <td>빨간색(느림)</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## TBT 점수를 높이는 방법

Chrome DevTools의 성능 패널로 긴 작업의 근본 원인을 진단하는 방법을 알아보려면 [긴 작업의 원인은 무엇입니까?](/long-tasks-devtools/#what-is-causing-my-long-tasks) 를 참조하십시오.

일반적으로 긴 작업의 가장 일반적인 원인은 다음과 같습니다.

- 불필요한 JavaScript 로딩, 구문 분석 또는 실행. 성능 패널에서 코드를 분석하는 동안 기본 스레드가 페이지를 로드하는 데 실제로 필요하지 않은 작업을 수행하고 있음을 발견할 수 있습니다. [코드 분할로 JavaScript 페이로드 줄이기](/remove-unused-code/), [사용하지 않는 코드 제거](/efficiently-load-third-party-javascript/) 또는 [타사 JavaScript를 효율적으로 로드](/reduce-javascript-payloads-with-code-splitting/)하면 TBT 점수가 향상됩니다.
- 비효율적인 JavaScript 문. 예를 들어 성능 패널에서 코드를 분석한 후 2000개의 노드를 반환하는 `document.querySelectorAll('a')`에 대한 호출이 표시된다고 가정합니다. 10개의 노드만 반환하는 등 더 구체적인 선택기를 사용하도록 코드를 리팩토링하면 TBT 점수가 향상됩니다.

{% Aside %} 불필요한 JavaScript 로드, 구문 분석 또는 실행은 일반적으로 대부분의 사이트에서 개선할 수 있는 훨씬 더 큰 기회입니다. {% endAside %}

{% include 'content/lighthouse-performance/improve.njk' %}

## 참고 자료

- [**총 차단 시간** 감사에 대한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/metrics/total-blocking-time.js)
- [긴 JavaScript 작업으로 인해 상호 작용까지의 시간이 지연됩니까?](/long-tasks-devtools)
- [첫 번째 입력 지연 최적화](/optimize-fid)
- [최초 콘텐츠풀 페인트](/fcp/)
- [상호 작용까지의 시간](/tti/)
- [코드 분할로 JavaScript 페이로드 줄이기](/reduce-javascript-payloads-with-code-splitting/)
- [사용하지 않는 코드 제거](/remove-unused-code/)
- [타사 리소스를 효율적으로 로드](/efficiently-load-third-party-javascript/)
