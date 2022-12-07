---
title: 긴 JavaScript 작업으로 인해 상호 작용까지의 시간이 지연됩니까?
subhead: 사용자 상호 작용을 방해하는 비용이 많이 드는 작업을 진단하는 방법을 알아봅니다.
authors:
  - addyosmani
date: 2019-05-29
hero: image/admin/QvWXvBSXsRKtpGOcakb5.jpg
alt: 모래가 쏟아지는 모래시계
description: 긴 작업은 메인 스레드를 바쁘게 하여 사용자 상호 작용을 지연시킬 수 있습니다. Chrome DevTools가 이제 긴 작업을 시각화하여 최적화할 작업을 더 쉽게 보여줍니다.
tags:
  - blog
  - performance
---

**tl;dr: 긴 작업은 메인 스레드를 바쁘게 만들어 사용자 상호 작용을 지연시킬 수 있습니다. Chrome DevTools는 이제 긴 작업을 시각화하여 최적화할 작업을 더 쉽게 보여줍니다.**

Lighthouse를 사용하여 페이지를 감사하는 경우 사용자가 페이지와 상호 작용하고 응답을 받을 수 있는 시간을 나타내는 지표인 [상호 작용 시간](/tti/)에 익숙할 것입니다. 하지만 긴 (JavaScript) 작업이 TTI를 저하시키는 데 크게 기여할 수 있다는 사실을 알고 계셨나요?

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/4XCzYI9gaUJDTTJu9JxH.png", alt="Lighthouse 보고서에 표시되는 상호 작용 시간", width="800", height="169" %}

## 긴 작업이란?

[긴 작업](https://developer.mozilla.org/docs/Web/API/Long_Tasks_API)은 오랜 시간 동안 메인 스레드를 독점하여 UI를 "정지"시키는 JavaScript 코드입니다.

웹 페이지가 로드되는 동안 긴 작업은 메인 스레드를 묶어두기 때문에 페이지가 준비된 것처럼 보이더라도 사용자 입력에 응답하지 않게 만들 수 있습니다. 이벤트 리스너, 클릭 핸들러 등이 아직 연결되지 않았기 때문에 클릭과 탭이 작동하지 않는 경우가 많습니다.

CPU를 많이 사용하는 긴 작업은 50ms 이상 걸리는 복잡한 작업으로 인해 발생합니다. 왜 하필 50ms일까요? [RAIL 모델](/rail/)은 100ms 이내에 가시적인 응답을 보장하기 위해 [50ms](/rail/#response-process-events-in-under-50ms) 내에 사용자 입력 이벤트를 처리할 것을 제안합니다. 그렇지 않으면 동작과 그 반응 사이의 연결이 끊어집니다.

## 내 페이지에 상호 작용을 지연시킬 수 있는 긴 작업이 있나요?

지금까지는 [Chrome DevTools](https://developer.chrome.com/docs/devtools/)에서 50ms가 넘는 스크립트의 "긴 노란색 블록"을 수동으로 찾거나 [Long Tasks API](https://calendar.perfplanet.com/2017/tracking-cpu-with-long-tasks-api/)를 사용하여 상호 작용을 지연시키는 작업을 파악해야 했습니다. 조금 번거로울 수 있습니다.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mSKnMWBcEBHWkXzTGCAH.png", alt="짧은 작업과 긴 작업의 차이점을 보여주는 DevTools 성능 패널 스크린샷", width="800", height="450" %}

성능 감사 워크플로를 쉽게 수행하도록 [DevTools는 이제 긴 작업을 시각화](https://developers.google.com/web/updates/2019/03/devtools#longtasks)합니다. 작업(회색으로 표시)이 긴 작업이면 빨간색 플래그가 지정됩니다.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fyDPyO4XbSINMVpSSY9E.png", alt="DevTools는 긴 작업에 대해 성능 패널에서 빨간색 플래그가 있는 회색 막대를 표시해 시각화", width="800", height="450" %}

- 웹 페이지를 로드하는 [성능 패널](https://developer.chrome.com/docs/devtools/evaluate-performance/)에서 추적을 기록합니다.
- 기본 스레드 보기에서 빨간색 플래그를 찾습니다. 이제 작업이 회색("작업")으로 표시된 것을 볼 수 있습니다.
- 막대 위로 마우스를 가져가면 작업 기간과 이 작업이 "긴" 것으로 간주되었는지 여부를 알 수 있습니다.

## 긴 작업의 원인은 무엇인가요?

긴 작업의 원인을 찾으려면 회색 **작업** 표시줄을 선택합니다. 아래 드로어에서 **Bottom-Up(상향식)** 및 **Group by Activity(활동별 그룹화)**를 선택합니다. 이를 통해 완료하는 데 너무 오래 걸리는 작업에 가장 많은(전체적으로) 기여를 한 활동을 확인할 수 있습니다. 아래에서는 비용이 많이 드는 DOM 쿼리 세트가 이유인 것으로 보입니다.

{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/7irBiePkFJRmzKMlcJUV.png", alt="DevTools에서 긴 작업('Task'로 레이블 지정)을 선택하면 작업이 오래 걸리는 원인을 제공한 활동을 심층 조사할 수 있습니다.", width="800", height="450" %}

## 긴 작업을 최적화하는 일반적인 방법은 무엇인가요?

큰 스크립트가 긴 작업의 주된 원인인 경우가 많으므로 [이를 분할](/reduce-javascript-payloads-with-code-splitting)하는 것이 좋습니다. 또한 타사 스크립트에도 주목하세요. 이러한 스크립트의 긴 작업으로 인해 기본 콘텐츠가 빠르게 응답하지 못할 수 있습니다.

모든 작업을 작은 덩어리(50ms 미만에 실행됨)로 나누고 이러한 덩어리를 올바른 위치와 시간에 실행시키세요. 올바른 위치는 작업자의 기본 스레드에서 벗어날 수도 있습니다. Phil Walton의 [Idle Until Urgent(급해질 때까지 놀기)](https://philipwalton.com/articles/idle-until-urgent/)를 읽어보면 좋은 참조가 될 것입니다.

페이지가 빠르게 반응하도록 만드세요. 긴 작업을 최소화하면 사용자가 사이트를 방문할 때 즐거운 경험을 할 수 있습니다. 긴 작업에 대한 자세한 내용은 [사용자 중심의 성능 메트릭](https://developers.google.com/web/fundamentals/performance/user-centric-performance-metrics#tracking_long_tasks)을 확인해 보세요.
