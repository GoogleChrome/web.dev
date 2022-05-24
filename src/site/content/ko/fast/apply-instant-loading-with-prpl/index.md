---
layout: post
title: PRPL 패턴으로 즉시 로딩 적용
authors:
  - houssein
description: |2-

  PRPL은 웹 페이지를 더 빠르게 로드하고 상호작용할 수 있도록 만드는 데 사용되는 패턴을 설명하는 약어입니다. 이 가이드에서는 이러한 각 기술을 함께 사용하거나 독립적으로 사용하여 성능을 내는 방법을 배웁니다.
date: 2018-11-05
tags:
  - performance
---

PRPL은 웹 페이지를 로드하고 대화식으로 더 빠르게 만드는 데 사용되는 패턴을 설명하는 약어입니다.

- 가장 중요한 리소스를 **푸시**(또는 **미리 로드**)합니다.
- 가능한 한 빨리 초기 경로를 **렌더링**합니다.
- 나머지 자산을 **미리 캐시**합니다.
- 다른 경로 및 중요하지 않은 자산을 **지연 로드**합니다.

이 가이드에서는 이러한 각 기술이 함께 잘 사용되거나 독립적으로 사용되어 성능을 낼 수 있는 방법을 알아봅니다.

## Lighthouse로 페이지 감사

Lighthouse를 실행하여 PRPL 기술과 일치하는 개선 기회를 식별합니다.

{% Instruction 'devtools-lighthouse', 'ol' %}

1. **성능** 및 **프로그레시브 웹 앱** 확인란을 선택합니다.
2. **감사 실행을** 클릭하여 보고서를 생성합니다.

자세한 내용은 [Lighthouse로 성능 기회 발견](/discover-performance-opportunities-with-lighthouse)을 참조하십시오.

## 중요한 리소스 미리 로드

Lighthouse는 특정 리소스을 분석하고 가져오는 게 늦어지는 경우 다음과 같은 실패한 감사를 표시합니다.

{% Img src="image/admin/tgcMfl3HJLmdoERFn7Ji.png", alt="Lighthouse: 사전 로드 키 요청 감사", width="745", height="97" %}

[**사전 로드**](https://developer.mozilla.org/docs/Web/HTML/Preloading_content)는 브라우저에 가능한 한 빨리 리소스를 요청하도록 지시하는 선언적 가져오기 요청입니다. HTML 문서의 헤드에 `rel="preload"`를 포함한 `<link>` 태그를 추가하여 중요한 리소스를 미리 로드합니다.

```html
<link rel="preload" as="style" href="css/style.css">
```

`window.onload` 이벤트를 지연시키지 않으면서 더 빨리 다운로드를 시도하기 위해 리소스에 대해 더 적절한 우선 순위 수준을 설정합니다.

중요한 리소스를 미리 로드하는 방법에 대한 자세한 내용은 [중요한 자산 미리 로드](/preload-critical-assets) 가이드를 참조하세요.

## 최대한 빠르게 초기 경로를 렌더링

Lighthouse는 사이트에서 픽셀을 화면에 렌더링하는 순간인 [**FP(First Paint)**](/user-centric-performance-metrics/#important-metrics-to-measure)를 지연시키는 리소스가 있는 경우 경고합니다.

{% Img src="image/admin/gvj0jlCYbMdpLNtHu0Ji.png", alt="Lighthouse: 렌더링 차단 리소스 감사 제거", width="800", height="111" %}

FP를 개선하기 위해 Lighthouse는 중요한 JavaScript를 인라인하고 [`async`](/critical-rendering-path-adding-interactivity-with-javascript/)를 사용하여 나머지는 연기할 뿐만 아니라 스크롤 없이 볼 수 있는 부분에서 사용되는 중요한 CSS를 인라인할 것을 권장합니다. 이는 렌더링 차단 자산을 가져오기 위한 서버와의 왕복 통신을 제거함으로써 성능을 향상시킵니다. 그러나 인라인 코드는 개발 관점에서 유지 관리하기가 더 어려우며 브라우저에서 별도로 캐시할 수 없습니다.

FP를 개선하는 또 다른 방법은 페이지의 초기 HTML을 **서버 측에서 렌더링**하는 것입니다.이렇게 하면 스크립트를 계속 가져오고, 구문 분석하고, 실행하는 동안 사용자에게 즉시 콘텐츠가 표시됩니다. 그러나 이렇게 하면 HTML 파일의 페이로드가 크게 증가하여 응용 프로그램이 대화형이 되어 사용자 입력에 응답하는 데 걸리는 시간인 [**상호 작용까지의 시간**](/tti/)이 나빠질 수 있습니다.

응용 프로그램에서 FP를 줄이는 올바른 하나의 해법은 없으며, 응용 프로그램에서 잃는 것보다 얻는 것이 더 큰 경우에만 인라인 스타일과 서버 측 렌더링을 고려해야 합니다. 다음 리소스를 통해 이 두 개념에 대해 자세히 알아볼 수 있습니다.

- [CSS 전달 최적화](https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery)
- [서버 측 렌더링이란 무엇입니까?](https://www.youtube.com/watch?v=GQzn7XRdzxY)

<figure data-float="right">{% Img src="image/admin/xv1f7ZLKeBZD83Wcw6pd.png", alt="서비스 작업자와의 요청/응답", width="800", height="1224" %}</figure>

## 자산 사전 캐시

**서비스 작업자**는 프록시 역할을 하여 반복 방문 시 서버가 아닌 캐시에서 자산을 직접 가져올 수 있습니다. 이렇게 하면 사용자가 오프라인일 때 애플리케이션을 사용할 수 있을 뿐만 아니라 반복 방문 시 페이지 로드 시간이 빨라집니다.

라이브러리에서 제공할 수 있는 것보다 더 복잡한 캐싱 요구 사항이 없는 경우 타사 라이브러리를 사용하여 서비스 작업자 생성 프로세스를 단순화합니다. 예를 들어 [Workbox](/workbox)는 자산을 캐시할 서비스 작업자를 만들고 유지 관리할 수 있는 도구 모음을 제공합니다. 서비스 워커 및 오프라인 안정성에 대한 자세한 내용은 안정성 학습 경로의 [서비스 작업자 가이드](/service-workers-cache-storage)를 참조하세요.

## 지연 로드

Lighthouse는 네트워크를 통해 너무 많은 데이터를 보내면 실패한 감사를 표시합니다.

{% Img src="image/admin/Ml4hOCqfD4kGWfuKYVTN.png", alt="Lighthouse: 막대한 네트워크 페이로드 감사 있음", width="800", height="99" %}

여기에는 모든 자산 유형이 포함되지만 대형 JavaScript 페이로드는 브라우저가 이를 구문 분석하고 컴파일하는 데 걸리는 시간으로 인해 특히 비용이 많이 듭니다. Lighthouse는 적절한 경우 이에 대한 경고도 제공합니다.

{% Img src="image/admin/aKDCV8qv3nuTVFt0Txyj.png", alt="Lighthouse: JavaScript 부팅 시간 감사", width="797", height="100" %}

사용자가 애플리케이션을 처음 로드할 때 필요한 코드만 포함하는 더 작은 JavaScript 페이로드를 보내려면 요청 시 전체 번들과 [지연 로드](/reduce-javascript-payloads-with-code-splitting) 청크를 분할합니다.

번들을 분할하는 데 성공했다면 더 중요한 청크를 미리 로드하세요([중요 자산 미리 로드](/preload-critical-assets) 가이드 참조). 미리 로드하면 브라우저에서 더 중요한 리소스를 더 빨리 가져와 다운로드할 수 있습니다.

요청에 따라 다양한 JavaScript 청크를 분할하고 로드하는 것 외에도 Lighthouse는 중요하지 않은 이미지를 지연 로드하는 것에 대한 감사도 제공합니다.

{% Img src="image/admin/sEgLhoYadRCtKFCYVM1d.png", alt="Lighthouse: 오프스크린 이미지 감사 연기", width="800", height="90" %}

웹 페이지에 많은 이미지를 로드하는 경우 페이지가 로드될 때 스크롤 없이 볼 수 있는 부분 또는 장치 표시 영역 외부에 있는 모든 이미지를 연기합니다([이미지를 지연 로드하기 위해 lazysizes 사용](/use-lazysizes-to-lazyload-images) 참조).

## 다음 단계

이제 PRPL 패턴의 기본 개념 중 일부를 이해했으므로 이 섹션의 다음 가이드를 계속 진행하여 자세히 알아보세요. 모든 기술을 함께 적용할 필요는 없다는 점을 기억하는 것이 중요합니다. 다음 중 하나에 대한 모든 노력은 눈에 띄는 성능 향상을 제공합니다.

- 중요한 리소스를 **푸시**(또는 **미리 로드**)합니다.
- 가능한 한 빨리 초기 경로를 **렌더링**합니다.
- 나머지 자산을 **미리 캐시**합니다.
- 다른 경로 및 중요하지 않은 자산을 **지연 로드**합니다.
