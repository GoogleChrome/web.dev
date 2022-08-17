---
layout: post
title: Total Blocking Time(총 차단 시간, TBT)
authors:
  - philipwalton
date: 2019-11-07
updated: 2020-06-15
description: 이 게시물에서는 총 차단 시간(TBT) 메트릭을 소개하고 이를 측정하는 방법을 설명합니다.
tags:
  - performance
  - metrics
---

{% Aside %}

총 차단 시간(TBT)은 페이지가 안정적인 상호 작용 환경이 되기 전, 상호 작용이 불가능했을 때의 심각성을 수량화하는 데 도움이 되기 때문에 [로드 응답성](/user-centric-performance-metrics/#in-the-lab)을 측정하기에 중요한 [실험실 메트릭](/user-centric-performance-metrics/#types-of-metrics)입니다. TBT가 낮으면 해당 페이지의 [사용 가능성](/user-centric-performance-metrics/#questions)을 보장하는 데 도움이 됩니다.

{% endAside %}

## TBT란 무엇인가요?

총 차단 시간(TBT) 메트릭은 메인 스레드가 입력 응답을 막을 만큼 오래 차단되었을 때 [First Contentful Paint(최초 콘텐츠풀 페인트, FCP)](/fcp/)와 [Time to Interactive(상호 작용까지의 시간, TTI)](/tti/) 사이 총 시간을 측정합니다.

메인 스레드에서 50밀리초(ms) 이상 실행되는 작업, 즉 [긴 작업](/custom-metrics/#long-tasks-api)이 있을 때마다 메인 스레드는 "차단"된 것으로 간주됩니다. 메인 스레드가 "차단"되었다고 하는 이유는 브라우저가 진행 중인 작업을 중단할 수 없기 때문입니다. 따라서 사용자가 긴 작업 중 페이지와 *상호 작용한 경우* 브라우저는 일단 해당 작업이 끝나기까지 기다린 후에야 응답할 수 있습니다.

작업이 길어지는 경우(예: 50ms 이상) 사용자는 지연을 알아차리고 페이지가 느리거나 버벅거리는 것으로 인지하게 됩니다.

주어진 긴 작업의 *차단 시간*은 50ms를 초과해 지속됩니다. 또한 페이지의 *총 차단 시간*은 FCP와 TTI 사이에서 발생하는 각각의 긴 작업에 대한 *차단 시간*을 합한 것입니다.

페이지 로드 중 브라우저의 메인 스레드에 대한 다음 다이어그램을 예시로 들어보겠습니다.

{% Img src="image/admin/clHG8Yv239lXsGWD6Iu6.svg", alt="메인 스레드의 작업 타임라인", width="800", height="156", linkTo=true %}

위의 타임라인에는 5개의 작업이 있으며 그 중 3개는 지속 시간이 50ms를 초과하기 때문에 긴 작업으로 간주됩니다. 다음 다이어그램은 각각의 긴 작업에 대한 차단 시간을 보여줍니다.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xKxwKagiz8RliuOI2Xtc.svg", alt="차단 시간을 보여주는 메인 스레드의 작업 타임라인", width="800", height="156", linkTo=true %}

따라서 메인 스레드에서 작업을 실행하는 데 소요된 총 시간은 560ms이지만 차단 시간으로 간주되는 것은 345ms뿐입니다.

<table>
  <tr>
    <th></th>
    <th>작업 기간</th>
    <th>작업 차단 시간</th>
  </tr>
  <tr>
    <td>작업 1</td>
    <td>250ms</td>
    <td>200ms</td>
  </tr>
  <tr>
    <td>작업 2</td>
    <td>90ms</td>
    <td>40ms</td>
  </tr>
  <tr>
    <td>작업 3</td>
    <td>35ms</td>
    <td>0ms</td>
  </tr>
  <tr>
    <td>작업 4</td>
    <td>30ms</td>
    <td>0ms</td>
  </tr>
  <tr>
    <td>작업 5</td>
    <td>155ms</td>
    <td>105ms</td>
  </tr>
  <tr>
    <td colspan="2"><strong>총 차단 시간</strong></td>
    <td><strong>345ms</strong></td>
  </tr>
</table>

### TBT는 TTI와 어떤 관련이 있나요?

TBT는 페이지가 안정적인 상호 작용 환경이 되기 전, 상호 작용이 불가능했을 때의 심각성을 수량화하는 데 도움이 되기 때문에 TTI와 함께 보기에 가장 좋은 메트릭입니다.

TTI는 메인 스레드에 최소 5초 동안 긴 작업이 없는 경우 페이지를 "안정적 상호 작용 가능" 환경으로 간주합니다. 이는 10초에 걸쳐 3개의 51ms 작업이 분산되어 TTI가 10초 길이의 단일 작업만큼 밀려날 수 있음을 의미합니다. 그러나 이 두 시나리오는 페이지와 상호 작용하려는 사용자에게는 매우 다르게 느껴질 것입니다.

첫 번쨰 상황에서 3개의 51ms 작업에 대한 TBT는 **3ms**일 것입니다. 반면 10초 길이의 단일 작업은 TBT가 **9950ms** 입니다. 두 번째 상황의 큰 TBT 값은 사용자 경험이 얼마나 열악한지 수량화해서 보여주는 것입니다.

## TBT 측정 방법

TBT는 [실험실에서](/user-centric-performance-metrics/#in-the-lab) 측정해야 하는메트릭입니다. TBT를 측정하는 가장 좋은 방법은 사이트에서 Lighthouse 성능 감사를 실행하는 것입니다. 사용법에 대한 자세한 내용은 [TBT에 대한 Lighthouse 문서](/lighthouse-total-blocking-time)를 참조하세요.

### 실험실 도구

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [WebPageTest](https://www.webpagetest.org/)

{% Aside %} TBT는 현장에서 측정하는 것도 가능하지만, 사용자 상호 작용이 보고서에서 많은 편차를 일으키는 방식으로 페이지의 TBT에 영향을 줄 수 있으므로 권장하지 않습니다. 현장에서 페이지의 상호 작용을 이해하려면 [First Input Delay(최초 입력 지연, FID)](/fid/)를 측정해야 합니다. {% endAside %}

## 좋은 TBT 점수는 무엇인가요?

우수한 사용자 경험을 제공하기 위해 사이트는 **평균 모바일 하드웨어**에서 테스트할 때 총 차당 시간이 **300밀리초** 미만이 될 수 있도록 해야 합니다.

페이지의 TBT가 Lighthouse 성능 점수에 미치는 영향에 대한 자세한 내용은 [Lighthouse가 TBT 점수를 결정하는 방법](/lighthouse-total-blocking-time/#how-lighthouse-determines-your-tbt-score)을 참조하세요.

## TBT를 개선하는 방법

특정 사이트에 대한 TBT를 개선하는 방법을 알아보려면 Lighthouse 성능 감사를 실행하고 감사에서 제안하는 특정한 [기회](/lighthouse-performance/#opportunities)를 주의 깊게 살펴보시기 바랍니다.

모든 사이트에 대해 일반적으로 TBT를 개선하는 방법을 알아보려면 다음 성능 가이드를 참조하세요.

- [타사 코드의 영향 줄이기](/third-party-summary/)
- [JavaScript 실행 시간 단축](/bootup-time/)
- [메인 스레드 작업 최소화](/mainthread-work-breakdown/)
- [요청 수를 낮게 유지하고 전송 크기를 작게 유지](/resource-summary/)
