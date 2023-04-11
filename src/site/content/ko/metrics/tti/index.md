---
layout: post
title: Time to Interactive(상호 작용까지의 시간, TTI)
authors:
  - philipwalton
date: 2019-11-07
updated: 2020-06-15
description: 이 게시물에서는 상호 작용까지의 시간(TTI) 메트릭을 소개하고 이를 측정하는 방법을 설명합니다.
tags:
  - performance
  - metrics
---

{% Aside %} 상호 작용까지의 시간(TTI)은 [로드 응답성](/user-centric-performance-metrics/#types-of-metrics)을 측정하기 위한 중요한 [실험실 메트릭](/user-centric-performance-metrics/#in-the-lab)입니다. 페이지가 상호 작용하는 것처럼 *보이지만* 실제로는 그렇지 않은 경우를 식별하는 데 도움이 됩니다. 빠른 TTI로 해당 페이지가 [사용 가능](/user-centric-performance-metrics/#questions)하다는 것을 확인할 수 있습니다. {% endAside %}

## TTI는 무엇인가요?

TTI 메트릭은 페이지가 로드되기 시작한 시점부터 주요 하위 리소스가 로드되고 사용자 입력에 신속하게 안정적으로 응답할 수 있는 시점까지의 시간을 측정합니다.

[웹 페이지의 성능 추적](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/)을 기반으로 TTI를 계산하려면 다음 단계를 따르세요.

1. [First Contentful Paint(최초 콘텐츠풀 페인트, FCP)](/fcp/)에서 시작합니다.
2. 이 시점 이후부터 최소 5초 정도의 조용한 기간을 검색합니다. 여기서 *조용한 기간*이란 [긴 작업](/custom-metrics/#long-tasks-api)이 없고 전송 중 네트워크 GET 요청이 2개 미만인 기간을 뜻합니다.
3. 긴 작업이 발견되지 않으면 조용한 기간 이전의 마지막 긴 작업을 역방향으로 검색하며 FCP에서 종료합니다.
4. TTI는 조용한 기간이 발생하기 이전 마지막 긴 작업의 종료 시간이거나, 긴 작업이 발견되지 않았을 경우에는 FCP와 동일한 값입니다.

다음 다이어그램은 위의 단계를 시각화하는 데 도움이 됩니다.

{% Img src="image/admin/WZM0n4aXah67lEyZugOT.svg", alt="TTI 계산 방법을 보여주는 페이지 로드 타임라인", width="800", height="473", linkTo=true %}

일반적으로 개발자는 빠른 렌더링 시간을 위해 페이지를 최적화해 왔으며 때로는 TTI를 희생하는 경우도 있었습니다.

SSR(서버 측 렌더링)과 같은 기술로 인해 페이지가 상호 작용 환경으로 *보이는* 시나리오(즉, 링크와 버튼이 화면에 표시됨)로 이어질 수 있지만, 메인 스레드가 차단되었거나 이러한 요소를 제어하는 JavaScript 코드가 로드되지 않았기 때문에 *실제로는 그렇지 않습니다*.

사용자가 상호 작용 환경처럼 보이지만 실제로는 그렇지 않은 페이지와 상호 작용하려고 하는 경우 다음 두 가지 반응을 보일 가능성이 큽니다.

- 가장 좋은 시나리오라고 해도, 페이지의 응답 속도가 느리다며 짜증스러워할 것입니다.
- 최악의 시나리오는 해당 페이지에 문제가 있다고 생각하고 아예 떠나버리는 것입니다. 심지어 해당 사용자는 브랜드 가치에 대한 자신 또는 신뢰를 잃어버릴 수도 있습니다.

이런 문제를 피하기 위해서는 FCP와 TTI 사이 차이를 최소화하기 위해 최대한의 노력을 기울여야 합니다. 차이가 있지만 가시적이지 않은 경우, 페이지의 구성 요소가 아직 상호 작용하지 않는다는 것을 시각적 표시를 통해 분명히 알려주어야 합니다.

## TTI 측정 방법

TTI는 [실험실에서](/user-centric-performance-metrics/#in-the-lab) 가장 측정하기 좋은 메트릭입니다. TTI를 측정하는 가장 좋은 방법은 사이트에서 Lighthouse 성능 감사를 실행하는 것입니다. 사용법에 대한 자세한 내용은 [TTI에 대한 Lighthouse 문서](/tti/)를 참조하세요.

### 실험실 도구

- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [WebPageTest](https://www.webpagetest.org/)

{% Aside %} TTI는 현장에서 측정하는 것도 가능하지만, 사용자 상호 작용이 보고서에서 많은 편차를 일으키는 방식으로 페이지의 TTI에 영향을 줄 수 있으므로 권장하지 않습니다. 현장에서 페이지의 상호 작용을 이해하려면 [First Input Delay(최초 입력 지연, FID)](/fid/)를 측정해야 합니다. {% endAside %}

## 좋은 TTI 점수는 무엇인가요?

우수한 사용자 경험을 제공하기 위해 사이트는 **평균 모바일 하드웨어**에서 테스트할 때 상호 작용까지의 시간이 **5초** 미만이 될 수 있도록 해야 합니다.

페이지의 TTI가 Lighthouse 성능 점수에 미치는 영향에 대한 자세한 내용은 [Lighthouse가 TTI 점수를 결정하는 방법](https://developer.chrome.com/docs/lighthouse/performance/interactive/#how-lighthouse-determines-your-tti-score)을 참조하세요.

## TTI를 개선하는 방법

특정 사이트에 대한 TTI를 개선하는 방법을 알아보려면 Lighthouse 성능 감사를 실행하고 감사에서 제안하는 특정한 [기회](https://developer.chrome.com/docs/lighthouse/performance/#opportunities)를 주의 깊게 살펴보시기 바랍니다.

모든 사이트에 대해 일반적으로 TTI를 개선하는 방법을 알아보려면 다음 성능 가이드를 참조하세요.

- [JavaScript 축소](https://developer.chrome.com/docs/lighthouse/performance/unminified-javascript/)
- [필요한 원본에 사전 연결](https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preconnect/)
- [핵심 요청 사전 로드](https://developer.chrome.com/docs/lighthouse/performance/uses-rel-preload/)
- [타사 코드의 영향 줄이기](https://developer.chrome.com/docs/lighthouse/performance/third-party-summary/)
- [크리티컬 요청 깊이 최소화](https://developer.chrome.com/docs/lighthouse/performance/critical-request-chains/)
- [JavaScript 실행 시간 단축](https://developer.chrome.com/docs/lighthouse/performance/bootup-time/)
- [메인 스레드 작업 최소화](https://developer.chrome.com/docs/lighthouse/performance/mainthread-work-breakdown/)
- [요청 수를 낮게 유지하고 전송 크기를 작게 유지](https://developer.chrome.com/docs/lighthouse/performance/resource-summary/)
