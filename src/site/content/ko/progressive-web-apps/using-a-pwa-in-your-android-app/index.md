---
layout: post
title: Android 앱에서 PWA 사용
authors:
  - andreban
date: 2020-03-19
updated: 2021-12-06
description: Android 앱에서 프로그레시브 웹 앱을 여는 방법.
tags:
  - progressive-web-apps
---

## Android 앱에서 PWA 시작

[PWA(프로그레시브 웹 앱](/progressive-web-apps/))은 앱과 유사한 기능을 사용하여 빠르고 안정적이며 매력적인 고품질 환경을 만드는 웹 애플리케이션입니다.

웹은 놀라운 도달 범위를 가지고 있으며 사용자가 새로운 경험을 발견할 수 있는 강력한 방법을 제공합니다. 그러나 사용자는 OS 스토어에서 애플리케이션을 검색하는 데도 익숙합니다. 이러한 사용자는 많은 경우에 이미 자신이 찾고 있는 브랜드 또는 서비스에 익숙하며 평균 이상의 참여 메트릭으로 이어지는 높은 수준의 의도를 가지고 있습니다.

Play Store는 Android 앱을 위한 스토어이며 개발자는 종종 Android 앱에서 Progressive Web Apps를 열고 싶어 합니다.

신뢰할 수 있는 웹 활동은 브라우저가 Android 앱 내에서 PWA를 렌더링하는 완전한 웹 플랫폼 호환 컨테이너를 제공할 수 있도록 하는 개방형 표준입니다. 이 기능은 [Chrome](https://play.google.com/store/apps/details?id=com.android.chrome)에서 사용할 수 있으며 [Firefox Nightly](https://play.google.com/store/apps/details?id=org.mozilla.fenix)에서 개발 중입니다.

### 기존 솔루션은 제한적

[Android WebView](https://developer.android.com/reference/android/webkit/WebView)와 같은 기술 또는 [Cordova](https://cordova.apache.org/)와 같은 프레임워크를 사용하여 Android 앱에 웹 경험을 포함하는 것은 항상 가능했습니다.

Android WebView의 한계점은 브라우저 대체품을 의도한 것이 아니라는 것입니다. Android WebView는 Android 앱에서 웹 UI를 사용하기 위한 개발자 도구이며 [contact picker](/contact-picker/), 또는 [filesystem](/file-system-access/), [among others](https://developer.chrome.com/blog/fugu-status/)와 같은 최신 웹 플랫폼 기능에 대한 완전한 액세스 기능을 제공하지 않습니다.

Cordova는 WebView의 단점을 보완하도록 설계되었지만 API는 Cordova 환경으로 제한됩니다. 즉, 개방형 웹의 PWA와 별도로 Android 앱용 Cordova API를 사용하기 위한 추가 코드베이스를 유지해야 합니다.

또한 기능 검색 기능이 항상 예상대로 작동하지 않는 경우가 많으며 Android 버전과 OEM 간의 호환성 문제도 문제가 될 수 있습니다. 이러한 솔루션 중 하나를 사용할 때 개발자는 추가 품질 보증 프로세스가 필요하고 대안을 감지하고 생성하기 위한 추가 개발 비용이 발생합니다.

### 신뢰할 수 있는 웹 활동은 Android의 웹 앱을 위한 새로운 컨테이너입니다

이제 개발자는 [신뢰할 수 있는 웹 활동](https://developer.chrome.com/docs/android/trusted-web-activity/)을 컨테이너로 사용하여 Android 앱의 시작 활동으로 PWA를 포함할 수 있습니다. 이 기술은 브라우저를 활용하여 PWA를 전체 화면으로 렌더링 하여 신뢰할 수 있는 웹 활동이 기본 브라우저와 동일한 웹 플랫폼 기능 및 API와 호환되도록 합니다. 신뢰할 수 있는 웹 활동을 사용하여 Android 앱을 훨씬 쉽게 구현할 수 있는 오픈 소스 유틸리티도 있습니다.

다른 솔루션에서는 사용할 수 없는 또 다른 이점은 컨테이너가 브라우저와 스토리지를 공유한다는 것입니다. 로그인 상태와 사용자 기본 설정은 여러 경험에서 원활하게 공유됩니다.

#### 브라우저 호환성

이 기능은 버전 75부터 Chrome에서 사용할 수 있으며 Firefox는 야간 버전에서 이를 구현합니다.

### 품질 기준

웹 개발자는 Android 앱에 웹 콘텐츠를 포함하려는 경우 신뢰할 수 있는 웹 활동을 사용해야 합니다.

신뢰할 수 있는 웹 활동의 웹 콘텐츠는 PWA 설치 가능성 기준을 충족해야 합니다.

또한 사용자가 Android 애플리케이션에서 기대하는 동작과 일치시키기 위해 다음과 같은 시나리오를 처리하지 못하는 것이 충돌로 간주되는 [변경 사항이 Chrome 86에 도입됐습니다.](https://blog.chromium.org/2020/06/changes-to-quality-criteria-for-pwas.html)

- 애플리케이션 실행 시 디지털 애셋 링크 확인 실패.
- 오프라인 네트워크 리소스 요청에 대해 HTTP 200 반환 실패.
- HTTP 404 또는 5xx 오류를 반환하는 탐색 요청.

신뢰할 수 있는 웹 활동에서 이러한 시나리오 중 하나가 발생하면 사용자가 Android 애플리케이션에서 볼 수 있는 충돌이 발생합니다. 서비스 워커에서 이러한 시나리오를 처리하는 방법에 대한 [지침](https://developer.chrome.com/docs/android/trusted-web-activity/whats-new/#updates-to-the-quality-criteria)을 확인하세요.

또한 애플리케이션은 [정책 준수](https://play.google.com/about/developer-content-policy/)와 같은 추가적인 Android 관련 기준을 충족해야 합니다.

{% Aside 'caution' %} 앱이 주로 13세 미만의 어린이를 위해 설계된 경우 신뢰할 수 있는 웹 활동 사용과 호환되지 않을 수 있는 추가적인 [Play 가족 정책](https://play.google.com/about/families/)이 적용됩니다. {% endAside %}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9Z70W3aCI8ropKpMXHcz.png", alt="PWA 배지가 있고 성능 점수가 100인 AirHorn의 Lighthouse 점수를 보여주는 스크린샷.", width="840", height="141 " %}<figcaption> Lighthouse의 PWA 배지는 PWA가 설치 가능성 기준을 통과하는지 여부를 보여줍니다.</figcaption></figure>

## 도구

신뢰할 수 있는 웹 활동을 활용하려는 웹 개발자는 PWA를 Android 애플리케이션으로 변환하기 위해 새로운 기술이나 API를 배울 필요가 없습니다. Bubblewrap과 PWABuilder는 함께 라이브러리, 명령줄 인터페이스(CLI) 및 그래픽 사용자 인터페이스(GUI) 형태로 개발자 도구를 제공합니다.

### Bubblewrap

[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) 프로젝트는 NodeJS 라이브러리 및 CLI(명령줄 인터페이스) 형식으로 Android 앱을 생성합니다.

새 프로젝트를 부트스트래핑하려면 도구를 실행하고 다음과 같은 Web Manifest의 URL을 전달합니다.

```shell
npx @bubblewrap/cli init --manifest=https://pwa-directory.appspot.com/manifest.json
```

이 도구는 프로젝트를 구축할 수도 있으며 아래 명령을 실행하면 Play 스토어에 업로드할 준비가 된 Android 애플리케이션이 출력됩니다.

```shell
npx @bubblewrap/cli build
```

이 명령을 실행하면 프로젝트의 루트 디렉터리에서 `app-release-signed.apk` 파일을 사용할 수 있습니다. 이 파일이 [Play 스토어에 업로드](https://support.google.com/googleplay/android-developer/answer/3131213?hl=en-GB) 될 파일입니다.

### PWABuilder

[PWABuilder는](https://pwabuilder.com/) 개발자가 기존 웹 사이트를 프로그레시브 웹 앱으로 변환하는 데 도움이 됩니다. 또한 Bubblewrap과 통합되어 해당 PWA를 Android 앱으로 래핑하는 GUI 인터페이스를 제공합니다. PWABuilder 팀은 도구를 사용하여 Android 애플리케이션을 생성하는 방법에 대한 [훌륭한 블로그 게시물](https://www.davrous.com/2020/02/07/publishing-your-pwa-in-the-play-store-in-a-couple-of-minutes-using-pwa-builder/)을 작성했습니다.

## Android 앱에서 PWA 소유권 확인

훌륭한 프로그레시브 웹 앱을 구축하는 개발자는 다른 개발자가 허락 없이 Android 앱을 구축하는 것을 원하지 않을 것입니다. 이러한 일이 발생하지 않도록 하려면 [Digital Asset Links](https://developers.google.com/digital-asset-links/v1/getting-started)라는 도구를 사용하여 Android 애플리케이션을 프로그레시브 웹 앱과 페어링해야 합니다.

Bubblewrap 및 PWABuilder는 Android 애플리케이션에서 필요한 구성을 처리하지만, PWA에 `assetlinks.json` 파일을 추가하는 마지막 단계가 남아있습니다.

이 파일을 생성하려면 개발자는 사용자가 다운로드하는 APK에 서명하는 데 사용되는 키의 SHA-256 서명이 필요합니다.

키는 여러 방법으로 생성할 수 있으며 최종 사용자에게 제공되는 APK에 서명한 키를 찾는 가장 쉬운 방법은 Play 스토어 자체에서 다운로드하는 것입니다.

손상된 애플리케이션이 사용자에게 표시되지 않도록 하려면 애플리케이션을 [비공개 테스트 채널](https://support.google.com/googleplay/android-developer/answer/3131213?hl=en-GB)에 배포하고 테스트 장치에 설치한 다음 [Peter's Asset Link Tool](https://play.google.com/store/apps/details?id=dev.conn.assetlinkstool)을 사용하여 앱에 대한 `assetlinks.json` 파일을 생성하세요. 생성된 `assetlinks.json` 파일을 검증 중인 도메인의 `/.well-known/assetlinks.json`에서 사용할 수 있습니다.

## 다음으로 갈 곳

프로그레시브 웹 앱은 고품질 웹 경험입니다. 신뢰할 수 있는 웹 활동은 Android 앱이 최소 품질 기준을 충족할 때 이러한 고품질 경험을 여는 새로운 방법입니다.

Progressive Web Apps를 시작하는 경우 [훌륭한 PWA를 구축하는 방법에 대한 지침](/progressive-web-apps/)을 읽어보세요. 이미 PWA가 있는 개발자의 경우 [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)를 사용하여 품질 기준을 충족하는지 확인하세요.

그런 다음, [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) 또는 [PWABuilder](https://pwabuilder.com/)를 사용하여 Android 애플리케이션을 생성하고 [애플리케이션을 Play 스토어의 비공개 테스트 채널에 업로드](https://support.google.com/googleplay/android-developer/answer/3131213?hl=en-GB)하고 [Peter's Asset Link Tool](https://play.google.com/store/apps/details?id=dev.conn.assetlinkstool)을 사용하여 PWA와 페어링 합니다.

마지막으로 비공개 테스트 채널에서 프로덕션으로 애플리케이션을 옮기세요!
