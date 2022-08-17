---
layout: post
title: 막대한 네트워크 페이로드 방지
description: 사용자에게 제공하는 리소스의 전체 파일 크기를 줄여 웹 페이지 로드 시간을 개선하는 방법에 대해 알아봅니다.
date: 2019-05-02
updated: 2020-05-29
web_lighthouse:
  - total-byte-weight
---

대규모 네트워크 페이로드는 긴 로드 시간과 높은 상관관계가 있습니다. 또한 사용자는 이로 인해 많은 비용을 지불해야 합니다. 예를 들어 사용자는 더 많은 셀룰러 데이터에 대한 비용을 지불해야 할 수 있습니다. 따라서 사이트 *와* 지갑에서 사용자 환경을 개선하기 위해 페이지 네트워크 요청의 전체 크기를 줄이는 것이 좋습니다.

{% Aside %} 전 세계에서 사이트 액세스 비용을 알아보려면 WebPageTest의 [내 사이트 비용은 얼마일까요?](https://whatdoesmysitecost.com/)를 확인해보세요. 구매력을 고려하기 위해 결과를 조정할 수 있습니다. {% endAside %}

## Lighthouse 네트워크 페이로드 감사 실패 방식

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 페이지에서 요청한 모든 리소스의 전체 크기를 [KiB(kibibytes)](https://en.wikipedia.org/wiki/Kibibyte) 단위로 표시합니다. 가장 큰 요청이 먼저 표시됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cCFb8MJkwnYquq3K9UmX.png", alt="Lighthouse의 막대한 네트워크 페이로드 방지 감사에 대한 스크린샷", width="800", height="518" %}</figure>

[HTTP 아카이브 데이터](https://httparchive.org/reports/state-of-the-web?start=latest#bytesTotal)를 기반으로 하는 중간 네트워크 페이로드는 1,700~1,900KiB입니다. 가장 높은 페이로드가 표시되도록 지원하기 위해 Lighthouse는 전체 네트워크 요청이 5,000KiB를 초과하는 페이지에 플래그를 지정합니다.

{% include 'content/lighthouse-performance/scoring.njk' %}

## 페이로드 크기를 줄이는 방법

전체 바이트 크기를 1,600KiB 미만으로 유지하는 것을 목표로 하십시오. 이 목표는 10초 이하의 [Interactive 시간](/tti/)을 달성하면서 이론적으로 3G 연결에서 다운로드할 수 있는 데이터의 양을 기반으로 합니다.

다음은 페이로드 크기를 줄이는 몇 가지 방법입니다.

- 페이로드가 필요할 때까지 요청을 연기합니다. 한 가지 가능한 접근 방식은 [PRPL 패턴](/apply-instant-loading-with-prpl)을 참조하십시오.
- 요청을 최대한 작게 최적화합니다. 가능한 기술은 다음과 같습니다.
    - [네트워크 페이로드를 최소화하고 압축합니다](/reduce-network-payloads-using-text-compression).
    - [이미지에 대해 JPEG 또는 PNG 대신 WebP를 사용합니다](/serve-images-webp).
    - [JPEG 이미지의 압축 수준을 85로 설정합니다](/use-imagemin-to-compress-images).
- 페이지가 반복 방문 시 리소스를 다시 다운로드하지 않도록 요청을 캐시합니다. (캐싱의 작동 방식과 구현 방법을 알아 보려면 [네트워크 안정성 랜딩 페이지)](/reliable)를 참조하십시오.

## 스택별 지침

### Angular

JavaScript 번들 크기를 최소화하려면 [경로 수준 코드 분할](/route-level-code-splitting-in-angular/)을 적용하십시오. 또한 [Angular 서비스 작업자](/precaching-with-the-angular-service-worker/)로 자산을 미리 캐싱하는 것을 고려하십시오.

### Drupal

[반응형 이미지 스타일](https://www.drupal.org/docs/8/mobile-guide/responsive-images-in-drupal-8)을 사용하여 페이지에 로드되는 이미지의 크기를 줄이는 것을 고려하십시오. 보기를 사용하여 페이지에 여러 콘텐츠 항목을 표시하는 경우 페이지 매김을 구현하여 해당 페이지에 표시되는 콘텐츠 항목 수를 제한하는 것을 고려하십시오.

### Joomla

기사 카테고리에서 발췌문을 표시(예: "더 읽기" 링크를 통해)하고, 해당 페이지에 표시되는 기사 수를 줄이거나 긴 게시물을 여러 페이지로 나누거나 플러그인을 사용하여 댓글을 지연 로드하는 것을 고려하십시오.

### WordPress

게시물 목록에 발췌문을 표시하고(예: "more" 태그를 통해), 주어진 페이지에 표시되는 게시물 수를 줄이거나, 긴 게시물을 여러 페이지로 나누거나, 플러그인을 사용하여 댓글을 지연 로드하는 것을 고려하십시오.

## 리소스

[**막대한 네트워크 페이로드 방지** 감사를 위한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/byte-efficiency/total-byte-weight.js)
