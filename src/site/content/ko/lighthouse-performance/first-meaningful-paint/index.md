---
layout: post
title: 첫 번째 의미 있는 페인트
description: |2

  Lighthouse의 첫 번째 의미 있는 페인트 메트릭에 대해 알아보고

  측정하고 최적화하는 방법.
date: 2019-05-02
updated: 2019-11-05
web_lighthouse:
  - 첫 번째 의미있는 페인트
---

{% Aside 'caution' %} 첫 번째 의미 있는 페인트(FMP)는 Lighthouse 6.0에서 더 이상 사용되지 않습니다. 실제로 FMP는 페이지 로드의 작은 차이에 지나치게 민감하여 일관성 없는(바이모달) 결과를 초래합니다. 또한 메트릭의 정의는 브라우저별 구현 세부 정보에 의존하므로 모든 웹 브라우저에서 표준화하거나 구현할 수 없습니다. 앞으로는 [가장 큰 콘텐츠가 포함된 페인트](/lcp/)를 대신 사용하는 것이 좋습니다. {% endAside %}

첫 번째 의미 있는 페인트(FMP)는 Lighthouse 보고서의 **성능** 섹션에서 추적되는 6가지 메트릭 중 하나입니다. 각 메트릭은 페이지 로드 속도의 일부 측면을 캡처합니다.

Lighthouse는 몇 초 만에 FMP를 표시합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6XzSjk0QsMpAL8V0bZiq.png", alt="Lighthouse 첫 번째 의미 있는 페인트 감사의 스크린샷", width="800", height="588" %}</figure>

## FMP가 측정하는 것

FMP는 페이지의 주요 콘텐츠가 사용자에게 표시되는 시점을 측정합니다. FMP의 원시 점수는 페이지 로드를 시작한 사용자와 스크롤 없이 볼 수 있는 기본 콘텐츠를 렌더링하는 페이지 사이의 시간(초)입니다. FMP는 기본적으로 가장 큰 스크롤 없이 볼 수 있는 레이아웃 변경이 발생한 후 페인트의 타이밍을 보여줍니다. Google의 [Time to First meaningful Paint: 레이아웃 기반 접근 방식](https://docs.google.com/document/d/1BR94tJdZLsin5poeet0XoTW60M0SjvOJQttKT-JK8HI/view)에서 FMP의 기술적 세부사항에 대해 자세히 알아보세요.

[FCP(First Contentful Paint)](/fcp/)와 FMP는 페이지에 렌더링된 콘텐츠의 첫 번째 비트에 스크롤 없이 볼 수 있는 부분의 콘텐츠가 포함되어 있는 경우가 많습니다. 그러나 이러한 측정항목은 예를 들어 iframe 내 스크롤 없이 볼 수 있는 부분에 콘텐츠가 있는 경우 다를 수 있습니다. FMP는 iframe 내의 콘텐츠가 사용자에게 표시될 때 등록되지만 FCP는 iframe 콘텐츠를 포함 *하지 않습니다.*

## Lighthouse가 FMP 점수를 결정하는 방법

FCP와 마찬가지로 FMP는 [HTTP 아카이브의 실제 웹사이트 성능 데이터](https://httparchive.org/reports/loading-speed#fcp)를 기반으로 합니다.

FMP와 FCP가 같을 때 점수는 같다. FCP 이후에 FMP가 발생하는 경우(예: 페이지에 iframe 콘텐츠가 포함된 경우) FMP 점수는 FCP 점수보다 낮습니다.

예를 들어 FCP가 1.5초이고 FMP가 3초라고 가정해 보겠습니다. FCP 점수는 99점이지만 FMP 점수는 75점입니다.

다음 표는 FMP 점수를 해석하는 방법을 보여줍니다.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>FMP 메트릭<br> (초 단위)</th>
        <th>색상 코딩</th>
        <th>FMP 점수<br> (FCP HTTP 아카이브 백분위수)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>0–2</td>
        <td>녹색(빠름)</td>
        <td>75–100</td>
      </tr>
      <tr>
        <td>2–4</td>
        <td>주황색(보통)</td>
        <td>50–74</td>
      </tr>
      <tr>
        <td>4 이상</td>
        <td>빨간색(느림)</td>
        <td>0–49</td>
      </tr>
    </tbody>
  </table>
</div>

{% include 'content/lighthouse-performance/scoring.njk' %}

## FMP 점수를 높이는 방법

[사이트에서 가장 큰 콘텐츠가 포함된 페인트를 개선하는 방법](/largest-contentful-paint#how-to-improve-largest-contentful-paint-on-your-site)을 참조하십시오. FMP를 개선하기 위한 전략은 Largest Contentful Paint를 개선하기 위한 전략과 대체로 동일합니다.

## 실제 사용자의 장치에서 FMP 추적

FMP가 실제로 사용자의 기기에서 발생하는 시점을 측정하는 방법을 알아보려면 Google의 [사용자 중심 성능 메트릭](/user-centric-performance-metrics/) 페이지를 참조하세요. [영웅 요소를 사용하여 FMP 추적](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_fmp_using_hero_elements) 섹션에서는 프로그래밍 방식으로 FCP 데이터에 액세스하고 이를 Google 애널리틱스에 제출하는 방법을 설명합니다.

실제 사용자 측정항목 수집에 대한 자세한 내용은 [탐색 및 리소스 타이밍을 사용하여 실생활에서 로드 성능 평가](https://developers.google.com/web/fundamentals/performance/navigation-and-resource-timing/)를 참조하세요. [사용자 시간 표시 및 측정 Lighthouse 감사](/user-timings)를 사용하면 보고서에서 사용자 시간 데이터를 볼 수 있습니다.

{% include 'content/lighthouse-performance/improve.njk' %}

## 리소스

- [**첫 번째 의미 있는 페인트** 감사를 위한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/metrics/first-meaningful-paint.js)
- [Lighthouse v3 스코어링 가이드](https://developers.google.com/web/tools/lighthouse/v3/scoring)
- [첫 번째 의미 있는 페인트까지의 시간: 레이아웃 기반 접근 방식](https://docs.google.com/document/d/1BR94tJdZLsin5poeet0XoTW60M0SjvOJQttKT-JK8HI/view)
- [가장 큰 콘텐츠가 포함된 페인트](/lcp/)
