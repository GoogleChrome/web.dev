---
layout: post
title: 웹 앱 매니페스트가 설치 가능성 요구 사항을 충족하지 않음
description: |2

  프로그레시브 웹 앱을 설치 가능하게 만드는 방법을 알아보세요.
web_lighthouse:
  - installable-manifest
codelabs:
  - codelab-make-installable
date: 2019-05-04
updated: 2019-09-19
---

설치 가능성은 [PWA(프로그레시브 웹 앱)](/discover-installable)의 핵심 요구 사항입니다. 사용자에게 PWA를 설치하라는 메시지를 표시하면 PWA를 홈 화면에 추가할 수 있습니다. 홈 화면에 앱을 추가하는 사용자는 해당 앱을 더 자주 사용합니다.

[웹 앱 매니페스트](/add-manifest/)에는 앱을 설치 가능하게 만드는 데 필요한 주요 정보가 포함되어 있습니다.

## Lighthouse 웹 앱 매니페스트 감사가 실패하는 방법

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)는 설치 가능성에 대한 최소 요구 사항을 충족하는 [웹 앱 매니페스트](/add-manifest/)가 없는 페이지에 플래그를 지정합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/039DlaixA4drrswBzSra.png", alt="사용자가 홈 화면에서 웹 앱을 설치할 수 없음을 보여주는 Lighthouse 감사", width="800", height="98" %}</figure>

페이지의 매니페스트에 다음 속성이 포함되어 있지 않으면 감사에 실패합니다.

- [`short_name`](https://developer.mozilla.org/docs/Web/Manifest/short_name) 또는 [`name`](https://developer.mozilla.org/docs/Web/Manifest/name) 속성
- 192x192픽셀 및 512x512픽셀 아이콘을 포함하는 [`icons`](https://developer.mozilla.org/docs/Web/Manifest/icons)
- [`start_url`](https://developer.mozilla.org/docs/Web/Manifest/start_url) 속성
- `fullscreen` , `standalone` 또는 `minimal-ui`로 설정된 [`display`](https://developer.mozilla.org/docs/Web/Manifest/display)
- `true` 이외의 값으로 설정되는 [`prefer_related_applications`](https://developer.chrome.com/blog/app-install-banners-native/) 속성.

{% Aside 'caution' %} 앱을 설치하려면 웹 앱 매니페스트가 *필요*하지만 *충분*하지 않습니다. 설치 가능성에 대한 모든 요구 사항을 충족하는 방법을 알아보려면 [설치 가능 게시물에 필요한 사항 알아보기](/discover-installable)를 참조하십시오. {% endAside %}

{% include 'content/lighthouse-pwa/scoring.njk' %}

## PWA를 설치 가능하게 만드는 방법

앱에 위의 기준을 충족하는 매니페스트가 있는지 확인하세요. PWA 생성에 대한 자세한 내용은 [설치 가능](/installable/) 컬렉션을 참조하세요.

## PWA가 설치 가능한지 확인하는 방법

### Chrome에서

앱이 설치 가능성에 대한 최소 요구 사항을 충족하면 Chrome은 사용자에게 PWA를 설치하라는 메시지를 표시하는 데 사용할 수 있는 `beforeinstallprompt` 이벤트를 실행합니다.

{% Aside 'codelab' %} [설치 가능하게 만들기](/codelab-make-installable) 코드랩을 사용하여 Chrome에서 앱을 설치할 수 있도록 하는 방법에 대해 배우십시오. {% endAside %}

### 다른 브라우저에서

다른 브라우저에는 설치 및 `beforeinstallprompt` 이벤트 트리거 기준이 다릅니다. 자세한 내용은 해당 사이트를 확인하십시오.

- [Edge](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps#requirements)
- [Firefox](https://developer.mozilla.org/docs/Web/Progressive_web_apps/Add_to_home_screen#How_do_you_make_an_app_A2HS-ready)
- [Opera](https://dev.opera.com/articles/installable-web-apps/)
- [Samsung Internet](https://hub.samsunginter.net/docs/ambient-badging/)
- [UC Browser](https://plus.ucweb.com/docs/pwa/docs-en/zvrh56)

## 참고 자료

- [**웹 앱 매니페스트의 소스 코드가 설치 가능성 요구 사항** 감사를 충족하지 않음](https://github.com/GoogleChrome/lighthouse/blob/master/core/audits/installable-manifest.js)
- [웹 앱 매니페스트 추가](/add-manifest/)
- [설치에 필요한 사항 알아보기](/discover-installable)
- [웹 앱 매니페스트](https://developer.mozilla.org/docs/Web/Manifest)
- [HTTPS를 사용하지 않음](/is-on-https/)
