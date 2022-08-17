---
layout: post
title: 페이지 및 `start_url`을 제어하는 서비스 워커를 등록하지 않습니다.
description: 오프라인 기능, 푸시 알림 및 설치 가능성과 같은 기능을 특징으로 하는 Progressive Web App을 지원하는 서비스 워커를 등록하는 방법을 배웁니다.
web_lighthouse:
  - 서비스 워커
date: 2019-05-04
updated: 2020-06-10
---

[서비스 워커를](/service-workers-cache-storage/) 등록하는 것은 주요 [PWA(Progressive Web App)](/discover-installable) 기능을 활성화하기 위한 첫 번째 단계입니다.

- 오프라인에서 작동
- 푸시 알림 지원
- 장치에 설치 가능

[서비스 워커 및 Cache Storage API](/service-workers-cache-storage/) 게시물에서 자세히 알아보세요.

## 브라우저 호환성

Internet Explorer를 제외한 모든 주요 브라우저는 서비스 워커를 지원합니다. [브라우저 호환성](https://developer.mozilla.org/docs/Web/API/ServiceWorker#Browser_compatibility)을 참조하세요.

## Lighthouse 서비스 워커 감사가 실패하는 이유

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 서비스 워커를 등록하지 않은 페이지에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/URqaGD5akD2LNczr0jjQ.png", alt="Lighthouse 감사 표시 사이트에서 서비스 워커를 등록하지 않음", width="800", height="95" %}</figure>

Lighthouse는 [Chrome 원격 디버깅 프로토콜](https://github.com/ChromeDevTools/devtools-protocol) 이 서비스 워커 버전을 반환하는지 확인합니다. 그렇지 않으면 감사가 실패합니다.

{% include 'content/lighthouse-pwa/scoring.njk' %}

## 서비스 워커 등록 방법

{% include 'content/reliable/workbox.njk' %}

서비스 워커를 등록하는 데는 몇 줄의 코드만 필요하지만 서비스 워커를 사용하는 유일한 이유는 위에 설명된 PWA 기능 중 하나를 구현할 수 있도록 하기 위해서입니다. 실제로 이러한 기능을 구현하려면 더 많은 작업이 필요합니다.

- 오프라인 사용을 위해 파일을 캐시 하는 방법을 알아보려면 [네트워크 안정성이란 무엇이며 어떻게 측정합니까?](/network-connections-unreliable)게시물을 참조하세요.
- 앱을 설치 가능하게 만드는 방법을 알아보려면 [설치 가능하게 만들기](/codelab-make-installable/) 코드랩을 참조하세요.
- 푸시 알림을 활성화하는 방법을 알아보려면 Google의 [웹 앱에 푸시 알림 추가를](https://codelabs.developers.google.com/codelabs/push-notifications) 참조하세요.

## 자원

- [**페이지 및 `start_url`을 제어하는 서비스 작업자를 등록하지 않은** 감사에 대한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/service-worker.js)
- [서비스 워커: 소개](https://developer.chrome.com/docs/workbox/service-worker-overview/)
- [서비스 워커와 Cache Storage API](/service-workers-cache-storage/)
- [네트워크 안정성이란 무엇이며 어떻게 측정합니까?](/network-connections-unreliable)
- [설치 가능하게 만들기](/codelab-make-installable/)
- [웹 앱에 푸시 알림 추가](https://codelabs.developers.google.com/codelabs/push-notifications)
