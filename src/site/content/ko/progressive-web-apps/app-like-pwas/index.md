---
layout: post
title: PWA를 앱처럼 느껴지도록 만드십시오.
subhead: 귀하의 프로그레시브 웹 앱을 웹사이트가 아닌 "실제" 앱처럼 제작해 보십시오.
authors:
  - thomassteiner
description: |2-

  웹 기술로 플랫폼별 앱 패턴을 구현하는 방법을 이해하여 Progressive Web App을 "실제" 앱처럼 느껴지게 만드는 방법을 배우십시오.
date: 2020-06-15
updated: 2020-07-23
tags:
  - capabilities
---

Progressive Web App 버즈워드 빙고를 플레이할 때 "PWA는 웹사이트일 뿐입니다"로 설정하는 것이 안전합니다. Microsoft의 PWA 문서는 [동의하고](https://docs.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/#progressive-web-apps-on-windows:~:text=PWAs%20are%20just%20websites), 우리는 바로 이 사이트에서 [말하고](/progressive-web-apps/#content:~:text=Progressive%20Web%20Apps,Websites) 있으며, 심지어 PWA 후보인 Frances Berriman과 Alex Russell도 [그렇게 씁니다](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/#post-2263:~:text=they%E2%80%99re%20just%20websites). PWA는 단순한 웹사이트 그 이상을 의미합니다. 제대로 수행되면 PWA는 웹사이트가 아니라 "실제" 앱처럼 느껴질 것입니다. 그렇다면 실제 앱처럼 느껴진다는 것은 무엇을 의미할까요?

이 질문에 답하기 위해 Apple [Podcasts](https://support.apple.com/en-us/HT201859) 앱을 예로 들어 보겠습니다. 데스크톱의 macOS와 모바일의 iOS(각각 iPadOS)에서 사용할 수 있습니다. Podcasts는 미디어 응용 프로그램이지만 도움말과 함께 설명하는 핵심 아이디어는 다른 범주의 응용 프로그램에도 적용됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/aNYiT2EkVkjNplAIKbLU.png", alt="iPhone과 MacBook이 나란히 Podcast 응용 프로그램을 실행하고 있습니다.", width="800", height="617" %}<figcaption> iPhone 및 macOS의 Apple 팟캐스트( <a href="https://support.apple.com/en-us/HT201859">출처</a> ).</figcaption></figure>

{% Aside 'caution' %} 아래 나열된 각 iOS/Android/데스크톱 앱 기능에는 **웹 구성요소에서 이 작업을 수행하는 방법**이 있으며 열면 자세한 내용을 볼 수 있습니다. 다양한 운영 체제의 모든 브라우저가 나열된 API 또는 기능을 모두 지원하는 것은 아닙니다. 링크된 문서에서 호환성 정보를 주의 깊게 검토하십시오. {% endAside %}

## 오프라인 실행 가능

한 걸음 물러서서 휴대 전화나 데스크톱 컴퓨터에 있을 수 있는 플랫폼별 응용 프로그램을 생각해 보면 한 가지 분명한 사실이 있습니다. 팟캐스트 앱에는 사용자가 오프라인일 때도 항상 무언가가 있습니다. 네트워크 연결이 없을 때 앱은 자연스럽게 계속 열립니다. **상위 차트** 섹션에는 콘텐츠가 표시되지 않지만 대신 **다시 시도** 버튼과 연결된 **지금 연결할 수 없음** 메시지로 돌아갑니다. 가장 환영할 만한 경험은 아닐지 모르지만 뭔가를 얻었습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TMbGLQkbLROxmUMdxLET.png", alt="팟캐스트 앱에 '지금 연결할 수 없습니다.'가 표시됩니다. 네트워크 연결을 사용할 수 없는 경우 정보 메시지입니다.", width="800", height="440" %}<figcaption> 네트워크 연결이 없는 팟캐스트 앱.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} 팟캐스트 앱은 소위 앱 셸 모델을 따릅니다. 왼쪽 메뉴 아이콘 및 핵심 플레이어 UI 아이콘과 같은 장식 이미지를 포함하여 핵심 앱을 표시하는 데 필요한 모든 정적 콘텐츠는 로컬로 캐시됩니다. <b>상위 차트</b> 데이터와 같은 동적 콘텐츠는 요청 시에만 로드되며, 로드에 실패할 경우 로컬에 캐시된 대체 콘텐츠를 사용할 수 있습니다. <a href="https://developers.google.com/web/fundamentals/architecture/app-shell">앱 셸 모델</a> 문서를 읽고 이 아키텍처 모델을 웹 앱에 적용하는 방법을 알아보세요. {% endDetails %}

## 오프라인 콘텐츠 사용 가능 및 미디어 재생 가능

오프라인 상태에서도 왼쪽 서랍을 통해 **다운로드됨** 섹션으로 이동하여 다운로드한 팟캐스트 에피소드를 즐길 수 있습니다. 이 에피소드는 재생 준비가 되어 있고 삽화 및 설명과 같은 모든 메타데이터와 함께 표시됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/onUIDiaFNNHOmnwXzRh1.png", alt="재생 중인 팟캐스트의 다운로드 에피소드가 있는 팟캐스트 앱.", width="800", height="440" %}<figcaption> 다운로드한 팟캐스트 에피소드는 네트워크 없이도 재생할 수 있습니다.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} 이전에 다운로드한 미디어 콘텐츠는 예를 들어 <a href="https://developer.chrome.com/docs/workbox/">Workbox</a> 라이브러리에서 <a href="https://developer.chrome.com/docs/workbox/serving-cached-audio-and-video/">캐시된 오디오 및 비디오 제공</a> 레시피를 사용하여 캐시에서 제공할 수 있습니다. 다른 콘텐츠는 항상 캐시나 IndexedDB에 저장할 수 있습니다. 모든 세부 정보와 언제 어떤 스토리지 기술을 사용해야 하는지 알아보려면 <a href="/storage-for-the-web/">웹용 스토리지</a> 기사를 읽으십시오. 사용 가능한 메모리 양이 줄어들 때 제거될 위험 없이 지속적으로 저장해야 하는 데이터가 있는 경우 <a href="/persistent-storage/">Persistent Storage API</a>를 사용할 수 있습니다. {% endDetails %}

## 사전 백그라운드 다운로드

`http 203`과 같은 쿼리로 콘텐츠를 검색할 수 있으며 검색 결과인 [HTTP 203 팟캐스트](/podcasts/)를 구독하기로 결정하면 시리즈의 최신 에피소드가 질문 없이 즉시 다운로드됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WbCk4nPpBS3zwkPVRGuo.png", alt="구독 직후 팟캐스트의 최신 에피소드를 다운로드하는 팟캐스트 앱입니다.", width="800", height="658" %}<figcaption> 팟캐스트를 구독하면 최신 에피소드가 즉시 다운로드됩니다.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} 팟캐스트 에피소드를 다운로드하는 작업은 시간이 더 오래 걸릴 수 있습니다. <a href="https://developers.google.com/web/updates/2018/12/background-fetch">Background Fetch API</a>를 사용하면 백그라운드에서 처리하는 브라우저에 다운로드를 위임할 수 있습니다. Android에서는 브라우저가 이러한 다운로드를 운영 체제에 더 위임할 수도 있으므로 브라우저를 계속 실행할 필요가 없습니다. 다운로드가 완료되면 앱의 서비스 워커가 깨어나고 응답으로 무엇을 할지 결정할 수 있습니다. {% endDetails %}

## 다른 응용 프로그램과 공유 및 상호 작용

팟캐스트 앱은 다른 애플리케이션과 자연스럽게 통합됩니다. 예를 들어 내가 좋아하는 에피소드를 마우스 오른쪽 버튼으로 클릭하면 메시지 앱과 같은 내 기기의 다른 앱과 공유할 수 있습니다. 또한 자연스럽게 시스템 클립보드와 통합됩니다. 에피소드를 마우스 오른쪽 버튼으로 클릭하고 링크를 복사할 수 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gKeFGOAZ2muuYeDNFbBW.png", alt="'에피소드 공유 &gt; 메시지' 옵션이 선택된 팟캐스트 에피소드에서 팟캐스트 앱의 컨텍스트 메뉴가 호출되었습니다.", width="800", height="392" %}<figcaption> 메시지 앱에 팟캐스트 에피소드 공유하기.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} <a href="/web-share/">Web Share API</a>와 <a href="/web-share-target/">Web Share Target API</a>를 사용하면 앱이 기기의 다른 애플리케이션과 텍스트, 파일 및 링크를 공유하고 받을 수 있습니다. 웹 앱이 운영 체제의 기본 제공 오른쪽 클릭 메뉴에 메뉴 항목을 추가하는 것은 아직 가능하지 않지만 장치의 다른 앱과 연결하거나 연결하는 다른 방법이 많이 있습니다. <a href="/image-support-for-async-clipboard/">Async Clipboard API</a>를 사용하면 프로그래밍 방식으로 시스템 클립보드에서 텍스트 및 이미지 데이터(PNG 이미지)를 읽고 쓸 수 있습니다. Android에서는 <a href="/contact-picker/">Contact Picker API</a>를 사용하여 기기의 연락처 관리자에서 항목을 선택할 수 있습니다. 플랫폼별 앱과 PWA를 모두 제공하는 경우 <a href="/get-installed-related-apps/">Get Installed Related Apps API</a>를 사용하여 플랫폼별 앱이 설치되어 있는지 확인할 수 있습니다. 설치된 경우, 사용자가 PWA를 설치하도록 권장하거나 웹 푸시 알림을 수락할 필요가 없습니다. {% endDetails %}

## 백그라운드 앱 새로고침

팟캐스트 앱 설정에서 새 에피소드를 자동으로 다운로드하도록 앱을 구성할 수 있습니다. 그런 식으로 생각하지 않아도 업데이트된 콘텐츠는 항상 거기에 있습니다. 아주 멋진 기능입니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/iTKgVVjX0EM0RQS3ap4X.png", alt="'팟캐스트 새로 고침' 옵션이 '매시간'으로 설정된 '일반' 섹션의 팟캐스트 앱 설정 메뉴입니다.", width="800", height="465" %}<figcaption>매시간 새로운 팟캐스트 에피소드를 확인하도록 구성된 팟캐스트.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} <a href="/periodic-background-sync/">Periodic Background Sync API</a>를 사용하면 앱을 실행할 필요 없이 백그라운드에서 콘텐츠를 정기적으로 새로 고칠 수 있습니다. 즉, 새로운 콘텐츠를 사전에 사용할 수 있으므로 사용자가 결정할 때마다 즉시 탐색을 시작할 수 있습니다. {% endDetails %}

## 클라우드를 통해 동기화된 상태

동시에 내 구독은 내가 소유한 모든 장치에서 동기화됩니다. 원활한 세상에서는 팟캐스트 구독을 수동으로 동기화하는 것에 대해 걱정할 필요가 없습니다. 마찬가지로, 모바일 장치의 메모리가 데스크탑에서 이미 들은 에피소드에 의해 소모되거나 그 반대의 경우도 마찬가지입니다. 재생 상태는 동기화 상태로 유지되며 청취한 에피소드는 자동으로 삭제됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uVJJ40Zxi5jx1AP1jd9U.png", alt="'기기 간 구독 동기화' 옵션이 활성화된 '고급' 섹션의 팟캐스트 앱 설정 메뉴입니다.", width="800", height="525" %}<figcaption> 상태는 클라우드를 통해 동기화됩니다.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} 앱 상태 데이터 동기화는 <a href="https://developers.google.com/web/updates/2015/12/background-sync">백그라운드 동기화 API</a>에 위임할 수 있는 작업입니다. 동기화 작업 자체는 즉시 발생하지 않아도 되며 <em>결국</em>에는 사용자가 이미 앱을 다시 닫은 경우일 수도 있습니다. {% endDetails %}

## 하드웨어 미디어 키 컨트롤

Chrome 브라우저에서 뉴스 페이지를 읽는 것과 같이 다른 애플리케이션으로 바쁠 때에도 랩톱의 미디어 키로 Podcast 앱을 제어할 수 있습니다. 앞으로 또는 뒤로 건너뛰기 위해 앱으로 전환할 필요가 없습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TqRtzNtfhahjX93hI1P6.png", alt="주석이 있는 미디어 키가 있는 Apple MacBook Pro Magic Keyboard.", width="800", height="406" %}<figcaption> 미디어 키를 사용하여 Podcast 앱(<a href="https://support.apple.com/guide/macbook-pro/magic-keyboard-apdd0116a6a2/mac">Source</a>)을 제어할 수 있습니다.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} 미디어 키는 <a href="/media-session/">미디어 세션 API</a>에서 지원됩니다. 이와 같이 사용자는 실제 키보드, 헤드폰의 하드웨어 미디어 키를 사용하거나 스마트워치의 소프트웨어 미디어 키에서 웹 앱을 제어할 수도 있습니다. 탐색 작업을 원활하게 하기 위한 추가 아이디어는 사용자가 콘텐츠의 상당 부분(예: 오프닝 크레딧 또는 챕터 경계 통과)을 탐색할 때 <a href="https://developer.mozilla.org/docs/Web/API/Vibration_API">진동 패턴</a>을 보내는 것입니다. {% endDetails %}

## 멀티태스킹 및 앱 바로 가기

물론 언제 어디서나 팟캐스트 앱으로 멀티태스킹을 할 수 있습니다. 앱에는 명확하게 구별되는 아이콘이 있어 데스크탑이나 애플리케이션 도크에 놓을 수도 있으므로 원할 때 팟캐스트를 즉시 실행할 수 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/l5EzElV5BGweYXLAqF4u.png", alt="선택할 수 있는 앱 아이콘이 많은 macOS 작업 전환기, 그 중 하나는 팟캐스트 앱입니다.", width="800", height="630" %}<figcaption> Podcast 앱으로 다시 멀티태스킹.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} 데스크톱과 모바일 모두에서 Progressive Web Apps를 홈 화면, 시작 메뉴 또는 애플리케이션 독에 설치할 수 있습니다. 사전 프롬프트에 따라 설치하거나 앱 개발자가 완전히 제어할 수 있습니다. <a href="/install-criteria/">설치하려면 무엇이 필요합니까?</a> 기사는 알아야 할 모든 내용을 다룹니다. 멀티태스킹 시 PWA는 브라우저와 독립적으로 나타납니다. {% endDetails %}

## 상황에 맞는 메뉴의 빠른 작업

가장 일반적인 앱 작업인 새 콘텐츠 **검색** 및 **새 에피소드 확인**은 Dock에 있는 앱의 컨텍스트 메뉴에서 바로 사용할 수 있습니다. **옵션** 메뉴를 통해 로그인할 때 앱을 열도록 결정할 수도 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SnA6Thz5xaopuTWRzWgQ.png", alt="'검색' 및 '새 에피소드 확인' 옵션을 보여주는 팟캐스트 앱 아이콘 컨텍스트 메뉴.", width="534", height="736" %}<figcaption> 빠른 작업은 앱 아이콘에서 바로 사용할 수 있습니다.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} PWA의 웹 앱 매니페스트에서 <a href="/app-shortcuts/">앱 아이콘 바로 가기</a>를 지정하면 사용자가 앱 아이콘에서 직접 연결할 수 있는 일반적인 작업에 대한 빠른 경로를 등록할 수 있습니다. macOS와 같은 운영 체제에서 사용자는 앱 아이콘을 마우스 오른쪽 버튼으로 클릭하고 로그인 시 앱이 실행되도록 설정할 수도 있습니다. <a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/RunOnLogin/Explainer.md">로그인 시 실행</a>에 대한 제안에 대한 작업이 진행 중입니다. {% endDetails %}

## 기본 앱으로 작동

다른 iOS 응용 프로그램과 웹 사이트 또는 이메일도 `podcasts://` URL 체계를 활용하여 Podcasts 앱과 통합할 수 있습니다. [`podcasts://podcasts.apple.com/podcast/the-css-podcast/id1042283903`](podcasts://podcasts.apple.com/podcast/the-css-podcast/id1042283903)과 같은 링크를 따라가면 Podcast 앱으로 바로 이동하여 Podcast를 구독하거나 들을지 결정할 수 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/x8mjOWiMO4CVigvtV8Kg.png", alt="사용자에게 팟캐스트 앱을 열 것인지 묻는 확인 대화상자를 표시하는 Chrome 브라우저.", width="800", height="492" %}<figcaption> 팟캐스트 앱은 브라우저에서 바로 열 수 있습니다.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} 완전 사용자 지정 URL 체계를 처리하는 것은 아직 가능하지 않지만 PWA에 대한 <a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/URLProtocolHandler/explainer.md">URL 프로토콜 처리</a>에 대한 제안에 대한 작업이 진행 중입니다. 현재, <code>web+</code> 구성표 접두사가 있는 <a href="https://developer.mozilla.org/docs/Web/API/Navigator/registerProtocolHandler"><code>registerProtocolHandler()</code></a>가 최상의 대안입니다. {% endDetails %}

## 로컬 파일 시스템 통합

당장 생각이 나지 않을 수도 있지만 팟캐스트 앱은 자연스럽게 로컬 파일 시스템과 통합됩니다. 팟캐스트 에피소드를 다운로드하면 내 랩탑에서 `~/Library/Group Containers/243LU875E5.groups.com.apple.podcasts/Library/Cache`에 저장됩니다. `~/Documents`와 달리 이 디렉토리는 물론 일반 사용자가 직접 액세스할 수는 없지만 존재합니다. 파일 이외의 다른 저장 메커니즘은 [오프라인 콘텐츠](#offline-content-available-and-media-playable) 섹션에서 참조됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Og60tp5kB9lVZsi3Prdt.png", alt="macOS Finder가 팟캐스트 앱의 시스템 디렉토리로 이동했습니다.", width="800", height="337" %}<figcaption> 팟캐스트 에피소드는 특별한 시스템 앱 폴더에 저장됩니다.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} 개발자는 <a href="/file-system-access/">파일 시스템 액세스 API</a>를 사용하여 기기의 로컬 파일 시스템에 액세스할 수 있습니다. API를 지원하지 않는 브라우저에 대한 대체를 투명하게 제공하는 <a href="https://github.com/GoogleChromeLabs/browser-fs-access">browser-fs-access</a> 지원 라이브러리를 통해 또는 직접 사용할 수 있습니다. 보안상의 이유로 시스템 디렉토리는 웹에서 액세스할 수 없습니다. {% endDetails %}

## 플랫폼 모양과 느낌

Podcast와 같은 iOS 응용 프로그램에 대해 자명한 더 미묘한 것이 있습니다. 텍스트 레이블을 선택할 수 없고 모든 텍스트가 시스템의 시스템 글꼴과 혼합됩니다. 또한 내가 선택한 시스템 색상 테마(다크 모드)도 존중됩니다.

<div class="w-columns">
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/OApP9uGUje6CkS7cKcZh.png", alt="팟캐스트 앱이 어두운 모드입니다.", width="800", height="463" %}<figcaption> 팟캐스트 앱은 라이트 모드와 다크 모드를 지원합니다.</figcaption></figure>
  <figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cnVihfFR2anSBlIVfCSW.png", alt="라이트 모드의 팟캐스트 앱입니다.", width="800", height="463" %}<figcaption> 앱은 기본 시스템 글꼴을 사용합니다.</figcaption></figure>
</div>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} <a href="https://developer.mozilla.org/docs/Web/CSS/user-select#Syntax:~:text=none,-The"><code>none</code></a> <a href="https://developer.mozilla.org/docs/Web/CSS/user-select"><code>user-select</code></a> CSS 속성을 활용하면 실수로 UI 요소가 선택되는 것을 방지할 수 있습니다. 그러나 <em>앱 콘텐츠</em>를 선택할 수 없도록 만들기 위해 이 속성을 남용하지 않도록 하십시오. 버튼 텍스트 등과 같은 UI 요소에만 사용해야 합니다. <a href="https://developer.mozilla.org/docs/Web/CSS/font-family"><code>font-family</code></a> CCS 속성에 대한 <a href="https://developer.mozilla.org/docs/Web/CSS/font-family#&lt;generic-name&gt;:~:text=system%2Dui,-Glyphs"><code>system-ui</code></a> 값을 사용하면 앱에 사용할 시스템의 기본 UI 글꼴을 지정할 수 있습니다. 마지막으로, 응용 프로그램은 <a href="/prefers-color-scheme/"><code>prefers-color-scheme</code></a> 옵션을 따라 사용자의 색상표 선호도를 준수할 수 있고, 선택적으로 <a href="https://github.com/GoogleChromeLabs/dark-mode-toggle">다크 모드</a>를 사용해 재정의할 수 있습니다. 결정해야 할 또 다른 사항은 스크롤 영역의 경계에 도달할 때 브라우저가 수행해야 하는 작업입니다(예: <em>새로 고침</em>에 대한 사용자 지정 끌어오기 구현). 이것은 <a href="https://developer.mozilla.org/docs/Web/CSS/overscroll-behavior"><code>overscroll-behavior</code></a> CSS 속성으로 가능합니다. {% endDetails %}

## 맞춤형 제목 표시줄

Podcasts 앱 창을 보면 Safari 브라우저 창과 같은 클래식 통합 제목 표시줄 및 도구 모음이 없지만 기본 플레이어 창에 도킹된 사이드바처럼 보이는 사용자 지정 환경이 있다는 것을 알 수 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cB7G2e31JXU71EfvhG3i.png", alt="Safari 브라우저의 통합 타일 막대 및 도구 모음입니다.", width="800", height="40" %}<figcaption></figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/mFvLbyQ90wsDPQ9l86s3.png", alt="팟캐스트 앱의 맞춤 분할 맞춤 제목 표시줄입니다.", width="800", height="43" %}<figcaption> Safari 및 Podcast의 사용자 정의된 제목 표시줄.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} 현재 불가능하지만 <a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/TitleBarCustomization/explainer.md">제목 표시줄 사용자 정의</a> 작업이 현재 진행 중입니다. 그러나 <a href="/add-manifest/#display"><code>display</code></a> 및 <a href="/add-manifest/#theme-color"><code>theme-color</code></a> 속성을 지정하여 애플리케이션 창의 모양과 느낌을 결정하고 표시할 기본 브라우저 컨트롤(어느 것도 표시되지 않을 수도 있음)을 결정할 수 있습니다. {% endDetails %}

## 날렵한 애니메이션

팟캐스트에서 인앱 애니메이션은 빠르고 부드럽습니다. 예를 들어, 오른쪽에 있는 **에피소드 노트** 서랍을 열면 우아하게 들어옵니다. 다운로드에서 한 에피소드를 제거하면 나머지 에피소드가 뜨고 삭제된 에피소드로 인해 비워진 화면 공간을 소비합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Ucob9t4Ga3jMK20RVvSD.png", alt="'Episode Notes' 서랍이 확장된 팟캐스트 앱입니다.", width="800", height="463" %}<figcaption> 서랍을 열 때와 같은 인앱 애니메이션은 신속합니다.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} <a href="https://developers.google.com/web/fundamentals/design-and-ux/animations/animations-and-performance">애니메이션 및 성능</a> 문서에 요약된 여러 모범 사례를 고려하면 웹에서 성능이 뛰어난 애니메이션을 만들 수 있습니다. 페이지가 매겨진 콘텐츠 또는 미디어 캐러셀에서 일반적으로 볼 수 있는 스크롤 애니메이션은 <a href="https://developers.google.com/web/updates/2018/07/css-scroll-snap">CSS 스크롤 스냅</a> 기능을 사용하여 크게 개선할 수 있습니다. 완전한 제어를 위해 <a href="https://developer.mozilla.org/docs/Web/API/Web_Animations_API">Web Animations API</a>를 사용할 수 있습니다. {% endDetails %}

## 앱 외부에 노출된 콘텐츠

iOS의 팟캐스트 앱은 실제 애플리케이션이 아닌 다른 위치의 콘텐츠를 표시할 수 있습니다(예: 시스템의 위젯 보기 또는 Siri 제안 형식). 탭하기만 하면 되는 사전 예방적 사용 기반 클릭 유도문안을 사용하면 팟캐스트와 같은 앱의 재참여율을 크게 높일 수 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/w8zhRHcKzRfgjXZu7y4h.png", alt="팟캐스트의 새 에피소드를 제안하는 팟캐스트 앱을 보여주는 iOS 위젯 보기.", width="751", height="1511" %}<figcaption> 앱 콘텐츠는 기본 팟캐스트 앱 외부에 표시됩니다.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} <a href="/content-indexing-api/">Content Index API</a>를 사용하면 애플리케이션이 오프라인에서 사용할 수 있는 PWA 콘텐츠를 브라우저에 알릴 수 있습니다. 이를 통해 브라우저는 기본 앱 외부에 이 콘텐츠를 표시할 수 있습니다. 앱에서 흥미로운 콘텐츠를 <a href="https://developers.google.com/search/docs/data-types/speakable">읽기 가능</a>한 오디오 재생으로 마크업하고 일반적으로 <a href="https://developers.google.com/search/docs/guides/search-gallery">구조화된 마크업</a>을 사용해, 검색 엔진과 Google 어시스턴트와 같은 가상 도우미를 사용해 이상적으로 제공 솔루션을 선보일 수 있습니다. {% endDetails %}

## 잠금 화면 미디어 제어 위젯

팟캐스트 에피소드가 재생 중일 때 팟캐스트 앱은 에피소드 아트워크, 에피소드 제목 및 팟캐스트 이름과 같은 메타데이터가 포함된 아름다운 제어 위젯을 잠금 화면에 표시합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Lr9R2zpjDEgHtyJ7hjHf.png", alt="리치 메타데이터가 포함된 팟캐스트 에피소드를 표시하는 잠금 화면의 iOS 미디어 재생 위젯.", width="751", height="1511" %}<figcaption> 앱에서 재생 중인 미디어는 잠금 화면에서 제어할 수 있습니다.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} <a href="/media-session/">미디어 세션 API</a>를 사용하면 아트워크, 트랙 제목 등과 같은 메타데이터를 지정할 수 있으며, 이 메타데이터는 브라우저의 잠금 화면, 스마트워치 또는 기타 미디어 위젯에 표시됩니다. {% endDetails %}

## 푸시 알림

([알림 프롬프트가 훨씬 조용해](https://blog.chromium.org/2020/01/introducing-quieter-permission-ui-for.html)졌지만) 푸시 알림은 웹에서 약간의 성가신 일이 되었습니다. 그러나 적절하게 사용하면 많은 가치를 추가할 수 있습니다. 예를 들어 iOS 팟캐스트 앱은 내가 구독 중인 팟캐스트의 새로운 에피소드를 선택적으로 알려주거나 새로운 에피소드를 추천할 수 있을 뿐만 아니라 새로운 앱 기능에 대해 알려줄 수 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/IFnNRo6BnHL6BxDmiqF7.png", alt="'새로운 에피소드' 알림 토글이 활성화된 것을 보여주는 '알림' 설정 화면의 iOS 팟캐스트 앱.", width="1511", height=" " %}<figcaption> 앱은 사용자에게 새로운 콘텐츠를 알리기 위해 푸시 알림을 보낼 수 있습니다.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} <a href="https://developers.google.com/web/fundamentals/push-notifications">푸시 API</a>를 사용하면 앱에서 푸시 알림을 받을 수 있으므로 PWA와 관련된 주목할만한 이벤트에 대해 사용자에게 알릴 수 있습니다. 미래의 알려진 시간에 실행되어야 하고 네트워크 연결이 필요하지 않은 알림의 경우 <a href="/notification-triggers/">알림 트리거 API</a>를 사용할 수 있습니다. {% endDetails %}

## 앱 아이콘 배지

내가 구독하는 팟캐스트 중 하나에 사용할 수 있는 새 에피소드가 있을 때마다 팟캐스트 홈 화면 아이콘에 앱 아이콘 배지가 나타나 방해가 되지 않는 방식으로 앱에 다시 참여하도록 권장합니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3smO2sJz5oMwy4RYpQoF.png", alt="'배지' 토글이 활성화된 것을 보여주는 iOS 설정 화면입니다.", width="751", height="1511" %}<figcaption> 배지는 응용 프로그램이 사용자에게 새 콘텐츠를 알리는 미묘한 방법입니다.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} <a href="/badging-api/">Badging API</a>를 사용하여 앱 아이콘 배지를 설정할 수 있습니다. 이것은 PWA에 "읽지 않은" 항목에 대한 개념이 있거나 사용자의 주의를 앱으로 눈에 띄지 않게 되돌릴 수 있는 수단이 필요할 때 특히 유용합니다. {% endDetails %}

## 미디어 재생이 에너지 절약 설정보다 우선

팟캐스트 미디어가 재생 중일 때 화면이 꺼질 수 있지만 시스템은 대기 모드로 들어가지 않습니다. 앱은 예를 들어 가사나 캡션을 표시하기 위해 선택적으로 화면을 계속 깨울 수도 있습니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CRkipfmdkLJrND83qvQw.png", alt="macOS 환경설정은 '절전' 섹션에 있습니다.", width="800", height="573" %}<figcaption> 앱은 화면을 깨운 상태로 유지할 수 있습니다.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} <a href="/wakelock/">Screen Wake Lock API</a>를 사용하면 화면이 꺼지는 것을 방지할 수 있습니다. 웹에서의 미디어 재생은 시스템이 대기 모드로 들어가는 것을 자동으로 방지합니다. {% endDetails %}

## 앱 스토어를 통한 앱 검색

팟캐스트 앱은 macOS 데스크탑 경험의 일부이지만 iOS에서는 App Store에서 설치해야 합니다. `podcast` , `podcasts` 또는 `apple podcasts`를 빠르게 검색하면 App Store에 즉시 앱이 표시됩니다.

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZLr5quaQWA9VJGAHNrLd.png", alt="iOS App Store에서 '팟캐스트'를 검색하면 팟캐스트 앱이 표시됩니다.", width="751", height="1511" %}<figcaption> 사용자는 앱 스토어에서 앱을 발견하는 방법을 배웠습니다.</figcaption></figure>

{% Details %} {% DetailsSummary %} 웹에서 이 작업을 수행하는 방법 {% endDetailsSummary %} Apple은 App Store에서 PWA를 허용하지 않지만 Android에서는 <a href="/using-a-pwa-in-your-android-app/">신뢰할 수 있는 웹 활동으로 래핑된</a> PWA를 제출할 수 있습니다. <a href="https://github.com/GoogleChromeLabs/bubblewrap"><code>bubblewrap</code></a> 스크립트를 사용하면 이 작업을 쉽게 수행할 수 있습니다. 이 스크립트는 또한 명령줄을 건드리지 않고도 사용할 수 있는 <a href="https://www.pwabuilder.com/">PWABuilder</a>의 Android 앱 내보내기 기능을 내부적으로 지원합니다. {% endDetails %}

## 기능 요약

아래 표는 모든 기능에 대한 간략한 개요를 보여주고 웹에서 구현하는 데 유용한 리소스 목록을 제공합니다.

<div class="table-wrapper scrollbar">
  <table>
    <thead>
      <tr>
        <th>특징</th>
        <th>웹에서 이 작업을 수행하는 데 유용한 리소스</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="#capable-of-running-offline">오프라인 실행 가능</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/fundamentals/architecture/app-shell">앱 셸 모델</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#offline-content-available-and-media-playable">오프라인 콘텐츠 사용 가능 및 미디어 재생 가능</a></td>
        <td>
          <ul>
            <li><a href="https://developer.chrome.com/docs/workbox/serving-cached-audio-and-video/">캐시된 오디오 및 비디오 제공</a></li>
            <li><a href="https://developer.chrome.com/docs/workbox/">워크박스 라이브러리</a></li>
            <li><a href="/storage-for-the-web/">스토리지 API</a></li>
            <li><a href="/persistent-storage/">영구 저장소 API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#proactive-background-downloading">사전 백그라운드 다운로드</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/updates/2018/12/background-fetch">백그라운드 가져오기 API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#sharing-to-and-interacting-with-other-applications">다른 응용 프로그램과 공유 및 상호 작용</a></td>
        <td>
          <ul>
            <li><a href="/web-share/">웹 공유 API</a></li>
            <li><a href="/web-share-target/">웹 공유 대상 API</a></li>
            <li><a href="/image-support-for-async-clipboard/">비동기 클립보드 API</a></li>
            <li><a href="/contact-picker/">연락처 선택기 API</a></li>
            <li><a href="/get-installed-related-apps/">설치된 관련 앱 API 가져오기</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#background-app-refreshing">백그라운드 앱 새로고침</a></td>
        <td>
          <ul>
            <li><a href="/periodic-background-sync/">주기적 백그라운드 동기화 API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#state-synchronized-over-the-cloud">클라우드를 통해 동기화된 상태</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/updates/2015/12/background-sync">백그라운드 동기화 API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#hardware-media-key-controls">하드웨어 미디어 키 컨트롤</a></td>
        <td>
          <ul>
            <li><a href="/media-session/">미디어 세션 API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#multitasking-and-app-shortcut">멀티태스킹 및 앱 바로 가기</a></td>
        <td>
          <ul>
            <li><a href="/install-criteria/">설치성 기준</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#quick-actions-in-context-menu">상황에 맞는 메뉴의 빠른 작업</a></td>
        <td>
          <ul>
            <li><a href="/app-shortcuts/">앱 아이콘 바로 가기</a></li>
            <li>
<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/tree/master/RunOnLogin">로그인 시 실행</a> (초기 단계)</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#act-as-default-app">기본 앱으로 작동</a></td>
        <td>
          <ul>
            <li>
<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/URLProtocolHandler/explainer.md">URL 프로토콜 처리</a> (초기 단계)</li>
            <li>
              <a href="https://developer.mozilla.org/docs/Web/API/Navigator/registerProtocolHandler"><code>registerProtocolHandler()</code></a>
            </li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#local-file-system-integration">로컬 파일 시스템 통합</a></td>
        <td>
          <ul>
            <li><a href="/file-system-access/">파일 시스템 액세스 API</a></li>
            <li><a href="https://github.com/GoogleChromeLabs/browser-fs-access">브라우저 fs 액세스 라이브러리</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#platform-look-and-feel">플랫폼 모양과 느낌</a></td>
        <td>
          <ul>
            <li>
              <a href="https://developer.mozilla.org/docs/Web/CSS/user-select#Syntax:~:text=none,-The"><code>user-select: none</code></a>
            </li>
            <li>
              <a href="https://developer.mozilla.org/docs/Web/CSS/font-family"><code>font-family: system-ui</code></a>
            </li>
            <li>
              <a href="/prefers-color-scheme/"><code>prefers-color-scheme</code></a>
            </li>
            <li><a href="https://github.com/GoogleChromeLabs/dark-mode-toggle">다크 모드 토글</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#customized-title-bar">맞춤형 제목 표시줄</a></td>
        <td>
          <ul>
            <li>
<a href="https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/TitleBarCustomization/explainer.md">제목 표시줄 사용자 지정</a> (초기 단계)</li>
            <li><a href="/add-manifest/#display">디스플레이 모드</a></li>
            <li><a href="/add-manifest/#theme-color">테마 색상</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#snappy-animations">날렵한 애니메이션</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/fundamentals/design-and-ux/animations/animations-and-performance">애니메이션 및 성능 팁</a></li>
            <li><a href="https://developers.google.com/web/updates/2018/07/css-scroll-snap">CSS 스크롤 스냅</a></li>
            <li><a href="https://developer.mozilla.org/docs/Web/API/Web_Animations_API">웹 애니메이션 API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#content-surfaced-outside-of-app">앱 외부에 노출된 콘텐츠</a></td>
        <td>
          <ul>
            <li><a href="/content-indexing-api/">콘텐츠 색인 API</a></li>
            <li><a href="https://developers.google.com/search/docs/data-types/speakable">말할 수 있는 콘텐츠</a></li>
            <li><a href="https://developers.google.com/search/docs/guides/search-gallery">구조화된 마크업</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#lock-screen-media-control-widget">잠금 화면 미디어 제어 위젯</a></td>
        <td>
          <ul>
            <li><a href="/media-session/">미디어 세션 API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#push-notifications">푸시 알림</a></td>
        <td>
          <ul>
            <li><a href="https://developers.google.com/web/fundamentals/push-notifications">푸시 API</a></li>
            <li><a href="/notification-triggers/">알림 트리거 API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#app-icon-badging">앱 아이콘 배지</a></td>
        <td>
          <ul>
            <li><a href="/badging-api/">배지 API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#media-playback-takes-precedence-over-energy-saver-settings">미디어 재생이 에너지 절약 설정보다 우선합니다.</a></td>
        <td>
          <ul>
            <li><a href="/wakelock/">화면 깨우기 잠금 API</a></li>
          </ul>
        </td>
      </tr>
      <tr>
        <td><a href="#app-discovery-through-an-app-store">앱 스토어를 통한 앱 검색</a></td>
        <td>
          <ul>
            <li><a href="/using-a-pwa-in-your-android-app/">신뢰할 수 있는 웹 활동</a></li>
            <li><a href="https://github.com/GoogleChromeLabs/bubblewrap"><code>bubblewrap</code> 라이브러리</a></li>
            <li><a href="https://www.pwabuilder.com/">PWABuilder 도구</a></li>
          </ul>
        </td>
      </tr>
    </tbody>
  </table>
</div>

## 결론

PWA는 2015년에 도입된 이후로 먼 길을 왔습니다. [Project Fugu 🐡](https://developer.chrome.com/blog/fugu-status)의 맥락에서 회사 간 Chromium 팀이 마지막 남은 공백을 메우기 위해 노력하고 있습니다. 이 기사의 조언 중 일부만 따르면 앱과 같은 느낌에 조금씩 더 다가갈 수 있으며 사용자가 "단지 웹사이트"를 다루고 있다는 사실을 잊게 만들 수 있습니다. *실제* 앱처럼 느껴지기만 하면 앱이 어떻게 구축되는지(왜 그래야 하는지?) 신경 쓰지 마세요.

## 감사의 말

이 기사는 [Kayce Basques](/authors/kaycebasques/) , [Joe Medley](/authors/joemedley/) , [Joshua Bell](https://github.com/inexorabletash) , [Dion Almaer](https://blog.almaer.com/) , [Ade Oshineye](https://blog.oshineye.com/) , [Pete LePage](/authors/petelepage/) , [Sam Thorogood](/authors/samthor/) , [Reilly Grant](https://github.com/reillyeon) 및 [Jeffrey Yasskin](https://github.com/jyasskin)이 검수하였습니다.
