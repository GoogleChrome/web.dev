---
layout: post
title: 미니앱처럼 프로그래밍하기
authors:
  - thomassteiner
date: 2021-03-03
# updated: 2021-03-03
description: |
  미니앱처럼 프로그래밍하는 방법을 알아봐요.
tags:
  - mini-apps
---

{% Aside %}
이 포스트는 글타래의 일부이며, 이전 글들에서 언급한 내용 위에 새로운 내용을 다루는 글이에요.
만약 이 페이지에 막 이르렀다면, [처음](/mini-app-super-apps/)부터 읽어보는 것을 추천해요.
{% endAside %}

## 미니앱에서 잘 됐던 것들

이 글에서는 제가 웹프로그래머의 관점에서 미니앱에 대해서 조사하면서 배웠던 점들을 돌아보고,
미니앱처럼 프로그래밍하는 방법에 대해서 이야기해보려고 해요.

## 컴포넌트

개발자들이 "바퀴를 재창조"하고, 탭과 같은 일반적인 UI 패러다임의 또 다른 구현을 구축하도록 만드는 대신,
미니 앱은 아코디언, 캐러셀 등 기본 선택 구성 요소를 함께 제공해요. 이 구성 요소는 더 필요할 때 확장할 수 있어요.
웹에서는, 비슷한 여러가지 옵션들이 있어요. 몇몇 것들은 [미니앱 컴포넌트의 한 챕터](/mini-app-components/#web-components)에 나열해두었어요.
이상적인 경우에서는 웹 컴포넌트는 서로 자유롭게 섞어서 사용할 수 있도록 제작되었겠죠.
하지만 현실에서는 대부분의 경우 하나의 컴포넌트를 추가할 때 특정한 락인 효과가 발생하거나, 단일한 컴포넌트를 사용하는 것이 아니라 컴포넌트 라이브러리를 통째로 사용해야하는 문제가 발생해요.
하지만 작은 규모로 사용할 수 있는 아토믹 컴포넌트 또한 존재해요.
또는 [generic-components](https://github.com/thepassle/generic-components) 라이브러리 같이 의도적으로 스타일되지 않은 라이브러리도 있어요.
이들을 적절히 사용하는 것이 좋을 것 같아요.

## 모델-뷰-뷰모델

[모델-뷰-뷰모델](/mini-app-markup-styling-and-scripting/#markup-languages) (MVVM) 개발 패턴은 마크업 언어를 이용한 GUI(뷰)의 개발과
백엔드 로직(모델)을 분리시켜요. 그 말은, 뷰가 하나의 모델 플랫폼에 종속되지 않는다는 말을 뜻해요.
몇몇 [불이익](https://docs.microsoft.com/en-us/archive/blogs/johngossman/advantages-and-disadvantages-of-m-v-vm)이
존재하긴 하지만, 전반적으로 미니앱의 복잡도 상에서는 잘 작동해요.
특히나 Rich Templating Libraries에서 빛을 발해요 ([다음 챕터](/mini-app-example-project/) 참고).

## 페이지 단위 사고

미니앱을 디버깅하면 본질적으로 멀티 페이지 애플리케이션(MPA)임을 알 수 있어요.
이는 Trivial Routing, 충돌 없는 페이지별 스타일링 등의 장점을 가져요.
PWA에 [성공적으로 MPA 적용한 사례](https://medium.com/elemefe/upgrading-ele-me-to-progressive-web-app-2a446832e509)도 많고요.
이렇게 페이지 단위로 사고하는 것은 페이지 단위의 CSS와 JavaScript, 그리고 이미지나 비디오 같은 리소스를 관리하는데 도움이 돼요.
무엇보다도, 이를 통해 아무것도 하지 않고 페이지 단위 코드스플리팅을 하는 효과를 얻을 수 있어요.
이 경우, 각 페이지는 동작해야할 시점에만 로딩된다는 것을 뜻해요.

## 빌드 과정

미니앱은 별도의 [빌드 프로세스가 없어요](/mini-app-project-structure-lifecycle-and-bundling/#the-build-process).
웹에서는, [Snowpack](https://www.snowpack.dev/) 같은 빌드 도구를 이용해 ESM으로 알려진 JavaScript의 내장된 Module System을 이용해
프로젝트가 거대해져도 중복된 작업을 제거할 수 있어요.
아직은 [Web Bundles](/web-bundles/)의 초기 단계이지만, 위와 같이 빌드 과정에 손쉽게 추가할 수 있어요.

## 강력한 기능들

웹 플랫폼은 최근 여러 [새로운 기능들](/tags/capabilities/)을 얻었어요.
[블루투스](/bluetooth/), [USB](/usb/), [HID](/hid/), [시리얼](/serial/),
그리고 [NFC](/nfc/)를 통한 [기기](/tags/devices/) 접근이 이제 모두 가능해요.
미니앱들은 [JavaScript bridge](/mini-app-markup-styling-and-scripting/#javascript-bridge-api)를 통해서 기능들에 접근했지만,
웹에서는 이런 기능들에 바로 접근할 수 있어요.
JavaScript Bridge를 통한 API에 접근하는 것이 아니라, 브라우저 API로 바로 프로그래밍할 수 있어요.

{% Aside 'success' %}
다음으로는 [예시 프로젝트](/mini-app-example-project/)를 통해 이 프로젝트의 실무 적용에 대해서 알아볼거예요.
{% endAside %}

## Acknowledgements

This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
and Keith Gu.
