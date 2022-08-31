---
layout: post
title: 중요한 요청 연결 방지
description: 중요한 요청 연결이 무엇인지, 이것이 웹 페이지 성능에 어떠한 영향을 미치는지, 어떻게 그 효과를 줄일 수 있는지 알아봅니다.
date: 2019-05-02
updated: 2020-04-29
web_lighthouse:
  - critical-request-chains
---

[중요한 요청 연결](https://developers.google.com/web/fundamentals/performance/critical-rendering-path)은 페이지 렌더링에 중요한 일련의 종속 네트워크 요청입니다. 연결의 길이와 다운로드 크기가 클수록 페이지 로드 성능에 미치는 영향이 더 커집니다.

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 높은 우선순위로 로드된 중요한 요청을 보고합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/apWYFAWSuxf9tQHuogSN.png", alt="Lighthouse 최소화 중요 요청 깊이를 보여주는 스크린샷", width="800", height="452" %}</figure>

{% include 'content/lighthouse-performance/scoring.njk' %}

## Lighthouse가 중요한 요청 연결을 식별하는 방법

Lighthouse는 네트워크 우선순위를 프록시로 사용하여 렌더링 차단 중요 리소스를 식별합니다. Chrome에서 이러한 우선순위를 정의하는 방법에 대한 자세한 내용은 Google의 [Chrome 리소스 우선순위 및 일정](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit)을 참조하십시오.

중요한 요청 연결, 리소스 크기, 리소스 다운로드에 소요된 시간에 대한 데이터는 [Chrome 원격 디버깅 프로토콜](https://github.com/ChromeDevTools/devtools-protocol)에서 추출합니다.

## 성능에 대한 중요한 요청 연결의 영향을 줄이는 방법

중요한 요청 연결 감사 결과를 사용하여 페이지 로드에 가장 큰 영향을 미치는 리소스를 먼저 대상으로 지정합니다.

- 중요한 리소스의 수를 최소화합니다. 이를 제거하고 다운로드를 연기하고 `async`로 표시하는 등의 작업을 수행합니다.
- 중요한 바이트의 수를 최적화하여 다운로드 시간(왕복 횟수)을 줄이십시오.
- 나머지 중요 리소스가 로드되는 순서를 최적화합니다. 모든 중요 자산을 최대한 빨리 다운로드하여 중요 경로 길이를 단축합니다.

[이미지](/use-imagemin-to-compress-images), [자바스크립트](/apply-instant-loading-with-prpl), [CSS](/defer-non-critical-css), [웹 글꼴](/avoid-invisible-text) 최적화에 대해 자세히 알아보십시오.

## 스택별 지침

### Magento

JavaScript 자산을 번들로 묶지 않는 경우 [baler](https://github.com/magento/baler) 사용을 고려하십시오.

## 참고 자료

[**중요 요청 깊이 최소화** 감사를 위한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/critical-request-chains.js)
