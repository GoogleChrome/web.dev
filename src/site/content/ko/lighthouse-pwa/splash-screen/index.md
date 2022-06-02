---
layout: post
title: 커스텀 스플래시 스크린에 대해 구성되지 않았습니다.
description: 프로그레시브 웹 앱에 대한 커스텀 스플래시 스크린을 만드는 방법을 알아봅니다.
web_lighthouse:
  - 스플래시 스크린
date: 2019-05-04
updated: 2019-09-19
---

커스텀 스플래시 스크린을 사용하면 [PWA(프로그레시브 웹 앱)](/discover-installable)가 해당 장치용으로 빌드된 앱처럼 느껴지게 됩니다. 기본적으로 사용자가 홈 화면에서 PWA를 시작하면 Android는 PWA가 준비될 때까지 흰색 화면을 표시합니다. 사용자는 최대 200ms 동안 이 빈 흰색 화면을 볼 수 있습니다. 커스텀 스플래시 스크린을 설정하여 사용자에게 커스텀 배경색과 PWA 아이콘을 표시하여 브랜드화된 매력적인 경험을 제공할 수 있습니다.

## Lighthouse 스플래시 스크린 감사가 실패하는 이유

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 커스텀 스플래시 스크린이 없는 페이지에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CKrrTDSCZ0XLZ7ABKlZt.png", alt="Lighthouse 감사 표시 사이트가 커스텀 스플래시 스크린에 대해 구성되지 않았습니다.", width="800", height="98" %}</figure>

{% include 'content/lighthouse-pwa/scoring.njk' %}

## 커스텀 스플래시 스크린을 만드는 방법

Android용 Chrome은 [웹 앱 매니페스트](/add-manifest)에서 다음 요구 사항을 충족하기만 하면 자동으로 커스텀 스플래시 스크린을 표시합니다.

- `name` 속성은 PWA의 이름으로 설정됩니다.
- `background_color` 속성은 유효한 CSS 색상 값으로 설정됩니다.
- `icons` 배열은 최소 512x512픽셀의 아이콘을 지정합니다.
- 지정된 아이콘이 존재하며 PNG입니다.

자세한 내용은 [Chrome 47에 설치된 웹 앱에 스플래시 스크린 추가{/a0 를 참조하세요.](https://developers.google.com/web/updates/2015/10/splashscreen)

{% Aside %} Lighthouse의 감사는 단일 512x512픽셀 아이콘이 있는 경우 통과되지만 PWA에 포함되어야 하는 아이콘에 대해서는 약간의 의견 차이가 있습니다. 다양한 접근 방식의 장단점에 관한 토론은 [감사: 아이콘 크기 적용](https://github.com/GoogleChrome/lighthouse/issues/291)을 참조하세요. {% endAside %}

## 리소스

[**커스텀 스플래시 스크린에 대해 구성되지 않음** 감사에 대한 소스 코드](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/audits/splash-screen.js)
