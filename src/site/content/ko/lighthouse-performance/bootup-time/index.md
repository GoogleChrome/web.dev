---
layout: post
title: 자바스크립트 실행 시간 단축
description: JavaScript 실행이 페이지 성능을 저하시키는 방식과 속도를 높이는 방법에 대해 알아봅니다.
date: 2019-05-02
updated: 2019-10-04
web_lighthouse:
  - bootup-time
tags:
  - memory
---

JavaScript를 실행하는 데 시간이 오래 걸리면 여러 가지 방법으로 페이지 성능을 저하시킵니다.

- **네트워크 비용**

    바이트가 높을수록 다운로드 시간이 길어집니다.

- **구문 분석 및 컴파일 비용**

    JavaScript는 기본 스레드에서 구문 분석되고 컴파일됩니다. 메인 스레드가 사용 중일 때 페이지는 사용자 입력에 응답할 수 없습니다.

- **실행 비용**

    JavaScript는 기본 스레드에서도 실행됩니다. 페이지에서 실제로 필요로 하기 전에 많은 코드를 실행하면 사용자가 페이지 속도를 인식하는 방식과 관련된 주요 측정 항목 중 하나인 [상호 작용까지의 시간](/tti/)도 지연됩니다.

- **메모리 비용**

    JavaScript가 많은 참조를 보유하고 있다면 잠재적으로 많은 메모리를 소모할 수 있습니다. 페이지가 많은 메모리를 사용하면 버벅거리거나 느려지는 현상이 나타납니다. 메모리 누수로 인해 페이지가 완전히 정지될 수 있습니다.

## Lighthouse JavaScript 실행 시간 감사가 실패하는 방식

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 JavaScript 실행이 2초 이상 걸리면 경고를 표시합니다. 실행 시간이 3.5초를 초과하면 감사가 실패합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BoomMoQNycPXsy34DZZs.png", alt="Lighthouse Reduce JavaScript 실행 시간 감사의 스크린샷", width="800", height="321" %}</figure>

Lighthouse는 실행 시간에 가장 큰 영향을 미치는 요인을 식별하는 데 도움이 되도록 페이지에서 로드하는 각 JavaScript 파일을 실행, 평가 및 구문 분석하는 데 소요된 시간을 보고합니다.

{% include 'content/lighthouse-performance/scoring.njk' %}

## JavaScript 실행 속도를 높이는 방법

{% include 'content/lighthouse-performance/js-perf.njk' %}

## 참고 자료

[**JavaScript 실행 시간 감소** 감사를 위한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/bootup-time.js)
