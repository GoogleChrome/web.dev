---
layout: post
title: 모바일 네트워크에서 페이지 로드가 충분히 빠르지 않습니다.
description: |2-

  모바일 네트워크에서 웹 페이지를 빠르게 로드하는 방법을 알아봅니다.
web_lighthouse:
  - load-fast-enough-for-pwa
date: 2019-05-04
updated: 2020-06-10
---

페이지의 많은 사용자가 느린 셀룰러 네트워크 연결로 방문합니다. 모바일 네트워크에서 페이지를 빠르게 로드할 수 있게 하면 모바일 사용자에게 긍정적인 경험을 제공하는 데 도움이 됩니다.

{% Aside 'note' %} 모바일 네트워크에서의 빠른 페이지 로드는 사이트가 프로그레시브 웹 앱으로 간주되기 위한 기본 요구사항입니다. [코어 프로그레시브 웹 앱 체크리스트를](/pwa-checklist/#core) 참조하십시오. {% endAside %}

## Lighthouse 페이지 로드 속도 감사가 실패하는 이유

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 모바일에서 충분히 빠르게 로드되지 않는 페이지에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Cg0UJ1Lykj672ygYYeXo.png", alt="페이지가 모바일에서 충분히 빠르게 로드되지 않음을 보여주는 Lighthouse 감사", width="800", height="98" %}</figure>

두 가지 주요 메트릭은 사용자가 로드 시간을 인식하는 방식에 영향을 줍니다.

- [첫 번째 의미 있는 페인트(FMP)](/first-meaningful-paint) , 페이지의 기본 콘텐츠가 시각적으로 완전히 나타나는 시점을 측정합니다.
- [상호 작용까지의 시간(TTI)](/tti/), 페이지가 완전히 상호 작용하는 때를 측정

예를 들어 페이지가 1초 후에 시각적으로 완료된 것처럼 보이지만 사용자가 10초 동안 페이지와 상호 작용할 수 없는 경우 사용자는 페이지 로드 시간을 10초로 인식할 것입니다.

Lighthouse는 느린 4G 네트워크 연결에서 TTI가 무엇인지 계산합니다. 상호 작용 시간이 10초를 초과하면 감사가 실패합니다.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## 페이지 로드 시간을 개선하는 방법

{% include 'content/lighthouse-performance/improve.njk' %}

## 참고 자료

- [**모바일 네트워크에서 페이지 로드가 충분히 빠르지 않습니다.** 감사를 위한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/load-fast-enough-for-pwa.js)
- [베이스라인 프로그레시브 웹 앱 체크리스트](https://developers.google.com/web/progressive-web-apps/checklist#baseline)
- [중요 렌더링 경로](/critical-rendering-path/)
- [런타임 성능 분석 시작하기](https://developer.chrome.com/docs/devtools/evaluate-performance/)
- [로드 성능 기록](https://developer.chrome.com/docs/devtools/evaluate-performance/reference/#record-load)
- [콘텐츠 효율성 최적화](/performance-optimizing-content-efficiency/)
- [렌더링 성능](/rendering-performance/)
