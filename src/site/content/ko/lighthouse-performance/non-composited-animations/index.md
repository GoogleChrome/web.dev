---
layout: post
title: 합성되지 않은 애니메이션 방지
description: '"합성되지 않은 애니메이션 방지" Lighthouse 감사를 통과하는 방법입니다.'
date: 2020-08-12
web_lighthouse:
  - 합성되지 않은 애니메이션
---

합성되지 않은 애니메이션은 저가형 휴대폰 또는 성능이 많이 요구되는 작업이 메인 스레드에서 실행될 때 버벅거림(즉, 매끄럽지 않음)으로 나타날 수 있습니다. 버벅거리는 애니메이션은 페이지의 [누적 레이아웃 이동](/cls/)(CLS)을 증가시킬 수 있습니다. CLS를 줄이면 Lighthouse Performance 점수가 향상됩니다.

## 배경

HTML, CSS 및 JavaScript를 픽셀로 변환하기 위한 브라우저의 알고리즘을 통틀어 *렌더링 파이프라인*이라고 합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/68xt0KeUvOpB8kA1OH0a.jpg", alt="렌더링 파이프라인은 JavaScript, 스타일, 레이아웃, 페인트, 합성과 같은 순차적 단계로 구성됩니다.", width="800", height="122 " %}<figcaption> 렌더링 파이프라인.</figcaption></figure>

렌더링 파이프라인의 각 단계가 의미하는 바를 이해하지 못해도 괜찮습니다. 지금 이해해야 할 핵심은 렌더링 파이프라인의 각 단계에서 브라우저가 이전 작업의 결과를 사용하여 새 데이터를 생성한다는 것입니다. 예를 들어, 코드가 레이아웃을 트리거 하는 작업을 수행하는 경우 페인트 및 합성 단계를 다시 실행해야 합니다. 합성되지 않은 애니메이션은 렌더링 파이프라인(스타일, 레이아웃 또는 페인트)의 이전 단계 중 하나를 트리거 하는 모든 애니메이션입니다. 합성되지 않은 애니메이션은 브라우저가 더 많은 작업을 수행하도록 하기 때문에 성능이 저하됩니다.

렌더링 파이프라인에 대해 자세히 알아보려면 다음 리소스를 확인하세요.

- [최신 웹 브라우저 내부 살펴보기(3부)](https://developer.chrome.com/blog/inside-browser-part3/)
- [페인트 복잡성을 단순화하고 페인트 영역 줄이기](/simplify-paint-complexity-and-reduce-paint-areas/)
- [합성 전용 속성 유지 및 레이어 수 관리](/stick-to-compositor-only-properties-and-manage-layer-count/)

## Lighthouse가 합성되지 않은 애니메이션을 감지하는 방법

애니메이션을 합성할 수 없는 경우 Chrome은 Lighthouse가 읽는 DevTools 추적에 실패 이유를 보고합니다. Lighthouse는 각 애니메이션의 실패 이유와 함께 합성되지 않은 애니메이션이 있는 DOM 노드를 나열합니다.

## 애니메이션이 합성되었는지 확인하는 방법

[합성 전용 속성 유지 및 레이어 수 관리](/stick-to-compositor-only-properties-and-manage-layer-count/) 및 [고성능 애니메이션](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)을 참조하세요.

## 리소스

- [*합성되지 않은 애니메이션 방지* 감사를 위한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/non-composited-animations.js)
- [합성 전용 속성 유지 및  레이어 수 관리](/stick-to-compositor-only-properties-and-manage-layer-count/)
- [고성능 애니메이션](https://www.html5rocks.com/en/tutorials/speed/high-performance-animations/)
- [페인트 복잡성을 단순화하고 페인트 영역 줄이기](/simplify-paint-complexity-and-reduce-paint-areas/)
- [최신 웹 브라우저 내부 살펴보기(3부)](https://developer.chrome.com/blog/inside-browser-part3/)
