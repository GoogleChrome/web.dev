---
layout: post
title: 설치가 가능하려면 무엇이 필요합니까?
authors:
  - petelepage
date: 2020-02-14
updated: 2021-05-19
description: |2

  프로그레시브 웹 앱 설치 가능성 기준.
tags:
  - progressive-web-apps
---

프로그레시브 웹 앱(PWA)은 웹 기술을 사용하여 구축된 최신 고품질 애플리케이션입니다. PWA는 iOS/Android/데스크톱 앱과 유사한 기능을 제공하며 불안정한 네트워크 조건에서도 안정적이며 설치가 가능하여 사용자가 쉽게 찾고 사용할 수 있습니다.

대부분의 사용자는 응용 프로그램 설치와 설치된 경험의 이점에 익숙합니다. 설치된 애플리케이션은 Mac OS X의 애플리케이션 폴더, Windows의 시작 메뉴, Android 및 iOS의 홈 화면과 같은 운영 체제 시작 화면에 나타납니다. 설치된 응용 프로그램은 활동 전환기, Spotlight와 같은 장치 검색 엔진 및 콘텐츠 공유 시트에도 표시됩니다.

대부분의 브라우저는 PWA(Progressive Web App)가 특정 기준을 충족할 때 설치할 수 있음을 사용자에게 나타냅니다. 표시기의 예로는 주소 표시줄의 설치 버튼이나 오버플로 메뉴의 설치 메뉴 항목이 있습니다.

<div class="switcher">
  <figure id="browser-install-promo">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/O9KXz4aQXm3ZOzPo98uT.png", alt="설치 표시기가 표시된 검색주소창의 스크린샷.", width="800", height="307" %}<figcaption> 브라우저 제공 설치 프로모션(데스크톱)</figcaption></figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bolh05TCEeT7xni4eUTG.png", alt="브라우저 제공 설치 프로모션 스크린샷", width="800", height="307" %}<figcaption> 브라우저 제공 설치 프로모션(모바일)</figcaption></figure>
</div>

또한 기준이 충족되면 많은 브라우저에서 `beforeinstallprompt` 이벤트를 실행하여 앱 내에서 설치 흐름을 트리거하는 사용자 지정 인앱 UX를 제공할 수 있습니다.

## 설치 기준 {: #criteria }

`beforeinstallprompt` 이벤트를 실행하고 브라우저 내 설치 프로모션을 표시하기 전에 다음 기준을 충족해야 합니다.

- 웹 앱이 아직 설치되지 않음
- 사용자 참여 휴리스틱 충족
- HTTPS를 통해 제공
- 다음을 포함하는 [웹 앱 매니페스트](/add-manifest/)를 포함합니다.
    - `short_name` 또는 `name`
    - `icons` - 192px 및 512px 아이콘을 포함해야 합니다.
    - `start_url`
    - `display` `fullscreen` , `standalone` 또는 `minimal-ui` 중 하나여야 합니다.
    - `prefer_related_applications`이 존재하거나 `false`여서는 안 됩니다.
- `fetch` 핸들러에 서비스 워커를 등록합니다.

다른 브라우저는 설치 기준이 비슷하지만 약간의 차이가 있을 수 있습니다. 자세한 내용은 해당 사이트를 확인하십시오.

- [Edge](https://docs.microsoft.com/microsoft-edge/progressive-web-apps#requirements)
- [파이어폭스](https://developer.mozilla.org/docs/Web/Progressive_web_apps/Installable_PWAs)
- [오페라](https://dev.opera.com/articles/installable-web-apps/)

{% Aside %} Android에서 웹 앱 매니페스트에 `related_applications` 및 `"prefer_related_applications": true` 포함되어 있으면 사용자는 Google Play 스토어로 이동하고 [대신 지정된 Android 앱을 설치하라는 메시지가 표시](https://developer.chrome.com/blog/app-install-banners-native/)됩니다. {% endAside %}
