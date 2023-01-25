---
title: 앱 바로 가기로 빠르게 작업 완료
subhead: 앱 바로 가기를 사용하면 사용자가 자주 필요로 하는 몇 가지 일반적인 작업에 빠르게 액세스할 수 있습니다.
authors:
  - beaufortfrancois
  - jungkees
date: 2020-05-20
updated: 2021-10-12
hero: image/admin/1ekafMZjtzcd0G3TLQJ4.jpg
alt: 앱 바로가기 메뉴가 표시된 Android 휴대전화 사진
description: 앱 바로 가기를 사용하면 사용자가 자주 필요로 하는 몇 가지 일반적인 작업에 빠르게 액세스할 수 있습니다.
tags:
  - blog
  - capabilities
  - progressive-web-apps
feedback:
  - api
---

사용자의 생산성을 향상하고 주요 작업에 대한 재참여를 촉진하기 위해 웹 플랫폼은 이제 앱 바로 가기를 지원합니다. 이를 통해 웹 개발자는 사용자가 자주 필요로 하는 몇 가지 일반적인 작업에 빠르게 액세스할 수 있습니다.

이 문서에서는 이러한 앱 바로 가기를 정의하는 방법을 설명합니다. 또한 몇 가지 관련 모범 사례를 배우게 됩니다.

## 앱 바로 가기 정보

앱 바로 가기를 사용하면 사용자가 웹 앱 내에서 일반적인 작업이나 권장 작업을 빠르게 시작할 수 있습니다. 앱 아이콘이 표시되는 곳이면 어디에서나 이러한 작업에 쉽게 액세스할 수 있으므로 사용자의 생산성이 향상되고 웹 앱에 대한 참여도가 높아집니다.

앱 바로 가기 메뉴는 사용자 바탕 화면의 작업 표시줄(Windows) 또는 독(macOS)에서 앱 아이콘을 마우스 오른쪽 버튼으로 클릭하거나 Android에서 앱의 런처 아이콘을 길게 누르면 호출됩니다.

<figure>{% Img src="image/admin/F4TsJNfRJNJSt2ZpqVAy.png", alt="Android에서 열린 앱 바로 가기 메뉴의 스크린샷", width="800", height="420" %}<figcaption> Android에서 열린 앱 바로 가기 메뉴</figcaption></figure>

<figure>{% Img src="image/admin/RoF6k7Aw6WNvaEcsgIcb.png", alt="Windows에서 열린 앱 바로 가기 메뉴의 스크린샷", width="800", height="420" %}<figcaption> Windows에서 열린 앱 바로 가기 메뉴</figcaption></figure>

앱 바로 가기 메뉴는 사용자의 데스크톱 또는 모바일 장치에 설치된 [Progressive Web Apps](/progressive-web-apps/)에 대해서만 표시됩니다. [설치하려면 무엇이 필요합니까?](/install-criteria/)를 확인하십시오. 설치 가능성 요구 사항에 대해 알아보십시오.

각 앱 바로 가기는 웹 앱 [범위](/add-manifest/#scope) 내의 URL과 연결된 사용자 의도를 나타냅니다. 사용자가 앱 바로 가기를 활성화하면 URL이 열립니다. 앱 바로 가기의 예는 다음과 같습니다.

- 최상위 탐색 항목(예: 홈, 타임라인, 최근 주문)
- 검색
- 데이터 입력 작업(예: 이메일 또는 트윗 작성, 영수증 추가)
- 활동(예: 가장 인기 있는 연락처와 채팅 시작)

{% Aside %} 앱 바로 가기를 설계하고 표준화한 Microsoft Edge 및 Intel 직원에게 큰 감사를 드립니다. Chrome은 Chromium 프로젝트를 진행하기 위해 협력하는 커미터 커뮤니티에 의존합니다. 모든 Chromium 커미터가 Google 직원은 아니며 이러한 기여자는 특별한 인정을 받을 자격이 있습니다! {% endAside %}

## 웹 앱 매니페스트에서 앱 바로 가기 정의

앱 바로 가기는 [웹 앱 매니페스트](/add-manifest)에 선택적으로 정의되며, 이 JSON 파일은 브라우저에 프로그레시브 웹 앱에 대해 알려주고 사용자의 데스크톱이나 모바일 장치에 설치했을 때 작동 방식을 알려줍니다. 더 구체적으로 말하면 `shortcuts` 배열 멤버에서 선언됩니다. 다음은 잠재적인 웹 앱 매니페스트의 예입니다.

```json
{
  "name": "Player FM",
  "start_url": "https://player.fm?utm_source=homescreen",
  …
  "shortcuts": [
    {
      "name": "Open Play Later",
      "short_name": "Play Later",
      "description": "View the list of podcasts you saved for later",
      "url": "/play-later?utm_source=homescreen",
      "icons": [{ "src": "/icons/play-later.png", "sizes": "192x192" }]
    },
    {
      "name": "View Subscriptions",
      "short_name": "Subscriptions",
      "description": "View the list of podcasts you listen to",
      "url": "/subscriptions?utm_source=homescreen",
      "icons": [{ "src": "/icons/subscriptions.png", "sizes": "192x192" }]
    }
  ]
}
```

`shortcuts` 배열의 각 구성원은 `name`과 `url`을 포함하는 사전입니다. 다른 구성원은 선택 사항입니다.

### 이름

사용자에게 표시될 때 앱 바로 가기에 대한 사람이 읽을 수 있는 레이블입니다.

### short_name(선택 사항)

공간이 제한된 곳에 사용되는 사람이 읽을 수 있는 레이블입니다. 선택 사항이더라도 제공하는 것이 좋습니다.

### 설명 (선택 사항)

앱 바로 가기의 사람이 읽을 수 있는 용도입니다. 작성 당시에는 사용되지 않았지만 향후 보조 기술에 노출될 수 있습니다.

### URL

사용자가 앱 바로 가기를 활성화할 때 열리는 URL입니다. 이 URL은 웹 앱 매니페스트 범위 내에 있어야 합니다. 상대 URL인 경우 기본 URL은 웹 앱 매니페스트의 URL이 됩니다.

### 아이콘(선택 사항)

이미지 리소스 개체의 배열입니다. 각 개체는 `src` 및 `sizes` 속성을 포함해야 합니다. [웹 앱 매니페스트 아이콘](/add-manifest/#icons) 과 달리 `type`은 선택 사항입니다.

작성 당시 SVG 파일은 지원되지 않으므로 대신 PNG를 사용하십시오.

완벽한 픽셀 아이콘을 원하면 48dp 단위로 제공하십시오(즉, 36x36, 48x48, 72x72, 96x96, 144x144, 192x192 픽셀 아이콘). 그렇지 않으면 단일 192x192 픽셀 아이콘을 사용하는 것이 좋습니다.

품질 측정을 위해 아이콘은 Android에서 기기의 이상적인 크기인 48dp의 절반 이상이어야 합니다. 예를 들어 [xxhdpi 화면](https://developer.android.com/training/multiscreen/screendensities#TaskProvideAltBmp)에 표시하려면 아이콘이 최소 72 x 72 픽셀이어야 합니다. (픽셀 단위의 dp 단위를 [변환](https://developer.android.com/training/multiscreen/screendensities#dips-pels)하는 공식에서 파생됩니다.)

## 앱 바로 가기 테스트

앱 바로 가기가 올바르게 설정되었는지 확인하려면 DevTools의 **애플리케이션** 패널에서 **매니페스트** 창을 사용하세요.

<figure>{% Img src="image/admin/rEL0r8lEfYHlsj0ylLSL.png", alt="DevTools의 앱 바로 가기 스크린샷", width="800", height="534" %}<figcaption> DevTools에 표시된 앱 바로 가기</figcaption></figure>

이 창은 앱 바로 가기를 포함하여 많은 매니페스트 속성의 사람이 읽을 수 있는 버전을 제공합니다. 모든 바로 가기 아이콘이 제공되는 경우 제대로 로드되는지 쉽게 확인할 수 있습니다.

프로그레시브 웹 앱 업데이트는 하루에 한 번으로 제한되기 때문에 모든 사용자가 앱 바로 가기를 즉시 사용하지 못할 수 있습니다. [Chrome에서 웹 앱 매니페스트에 대한 업데이트를 처리하는 방법](/manifest-updates)에 대해 자세히 알아보세요.

## 모범 사례

### 우선 순위에 따라 앱 바로 가기 주문

표시되는 앱 바로 가기 수의 제한은 플랫폼에 따라 다르므로 `shortcuts` 배열에서 가장 먼저 나타나도록 앱 바로 가기를 우선 순위에 따라 정렬하는 것이 좋습니다. 예를 들어 Windows의 Chrome 및 Edge는 앱 바로 가기 수를 10개로 제한하는 반면 Android용 Chrome은 처음 4개의 앱 바로 가기만 고려합니다.

{% Aside %} Android 7용 Chrome 92는 이제 3개의 앱 단축키만 허용합니다. 앱에 사용 가능한 바로 가기 슬롯 중 하나를 사용하여 사이트 설정에 대한 바로 가기가 추가되었습니다. {% endAside %}

### 고유한 앱 바로 가기 이름 사용

앱 바로 가기가 항상 표시되지 않을 수 있으므로 아이콘에 의존하여 앱 바로 가기를 구별해서는 안 됩니다. 예를 들어 macOS는 도크 바로 가기 메뉴에서 아이콘을 지원하지 않습니다. 각 앱 바로 가기에 고유한 이름을 사용합니다.

### 앱 바로가기 사용량 측정

`start_url`을 사용하는 것처럼 앱 바로 가기 `url` 항목에 주석을 달아야 합니다(예: `url: "/my-shortcut?utm_source=homescreen"`).

## 브라우저 지원

앱 바로가기는 Android(Chrome 84), Windows(Chrome 85 및 Edge 85), ChromeOS(Chrome 92), macOS 및 Linux(Chrome 96 및 Edge 96)에서 사용할 수 있습니다.

<figure>{% Img src="image/vvhSqZboQoZZN9wBvoXq72wzGAf1/6KgvySxUcryuD0gwXa0u.png",alt="ChromeOS에서 열린 앱 바로 가기 메뉴의 스크린샷", width="800", height="450" %}<figcaption> ChromeOS에서 열린 앱 바로 가기 메뉴</figcaption></figure>

## 신뢰할 수 있는 웹 활동 지원

[신뢰할 수 있는 웹 활동](/using-a-pwa-in-your-android-app/)을 사용하는 Android 앱을 빌드하는 데 권장되는 도구인 [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap)은 웹 앱 매니페스트에서 앱 바로 가기를 읽고 Android 앱에 대한 해당 구성을 자동으로 생성합니다. 앱 바로 가기 아이콘은 [필수](https://github.com/GoogleChromeLabs/bubblewrap/issues/116)이며 Bubblewrap에서 최소 96 x 96픽셀이어야 합니다.

프로그레시브 웹 앱을 신뢰할 수 있는 웹 활동으로 쉽게 전환할 수 있는 훌륭한 도구인 [PWABuilder](https://www.pwabuilder.com/)는 몇 가지 [주의 사항](https://github.com/pwa-builder/CloudAPK/issues/25)이 있는 앱 바로 가기를 지원합니다.

신뢰할 수 있는 웹 활동을 Android 애플리케이션에 수동으로 통합하는 개발자의 경우 [Android 앱 바로 가기](https://developer.android.com/guide/topics/ui/shortcuts)를 사용하여 동일한 동작을 구현할 수 있습니다.

## 샘플

<figure>
  <video controls autoplay loop muted src="https://storage.googleapis.com/web-dev-assets/app-shortcuts/app-shortcuts-recording.mp4">
  </video></figure>

[앱 바로 가기 샘플](https://app-shortcuts.glitch.me) 및 해당 [소스](https://glitch.com/edit/#!/app-shortcuts)를 확인하세요.

{% Glitch { id: 'app-shortcuts', path: 'public/manifest.json', height: 480 } %}

## 유용한 링크

- [Explainer](https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/Shortcuts/explainer.md)
- [사양](https://w3c.github.io/manifest/#shortcuts-member)
- [앱 바로 가기 샘플](https://app-shortcuts.glitch.me) | [앱 바로 가기 샘플 소스](https://glitch.com/edit/#!/app-shortcuts)
- [추적 버그](https://bugs.chromium.org/p/chromium/issues/detail?id=955497)
- [ChromeStatus.com 항목](https://chromestatus.com/feature/5706099464339456)
- Blink 구성 요소: [`UI>Browser>WebAppInstalls`](https://crbug.com/?q=component:UI%3EBrowser%3EWebAppInstalls)
