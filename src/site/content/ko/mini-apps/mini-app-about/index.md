---
layout: post
title: 미니 앱은 무엇인가요?
authors:
  - thomassteiner
date: 2021-03-03
updated: 2021-10-28
description: |
  미니 앱이 무엇인지 개념을 알아보고 예시를 통해 어떤 모습과 느낌을 제공하는지 알아봐요.
tags:
  - mini-apps
---

{% Aside %}
  이 포스트는 글타래의 일부이며, 이전 글들에서 언급한 내용 위에 새로운 내용을 다루는 글이에요.
  만약 이 페이지에 막 이르렀다면, [처음](/mini-app-super-apps/)부터 읽어보는 것을 추천해요.
{% endAside %}

## 구성 요소와 호환성

미니 앱은 아주 작으며 (주로 [2-4&nbsp;MB](https://www.w3.org/2021/10/MiniApp-Overview-breakout.pdf)) 구동되기 위해 [슈퍼 앱](/mini-app-super-apps/#for-mini-apps-you-need-super-apps)이 필요해요.
대부분의 미니 앱은 HTML, CSS, 그리고 JavaScript를 포함한 웹 기술들(혹은 그 "방언"들)로 만들어진다는 점이 비슷해요.
미니 앱의 구동 런타임은 슈퍼 앱의 [웹뷰](https://research.google/pubs/pub46739/) 화면이기에 크로스플랫폼하게 구동돼요.
그래서 똑같은 미니 앱은 똑같은 슈퍼 앱 안에서 그게 안드로이드든, iOS든, 또 다른 OS이든 동일하게 동작할 수 있어요.
하지만 모든 미니 앱이 모든 슈퍼 앱에서 동작할 수 있는 것은 아니에요.
이에 대해서는 [나중에](/mini-app-standardization/) 살펴봐요.

## 미니 앱의 발견

미니 앱은 어떤 중요한 일을 하는 과정에서 브랜딩된 2D 바코드 등으로 _우연히_ 발견돼요.
예를 들어 식당에 가서 메뉴를 보며 결제 미니앱을 열거나, 전동 킥보드를 빌리기 위해 킥보드 대여 미니 앱을 여는 것처럼요.
아래 사진은 [WeChat의 데모 미니 앱](https://github.com/wechat-miniprogram/miniprogram-demo)을 여는 2D 바코드의 예시예요.
WeChat 슈퍼 앱으로 바코드를 스캔하면, 미니 앱이 바로 실행돼요.
다른 슈퍼 앱들은 대부분 이 바코드를 인식하지 못할 거예요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SOisfOqKQWr0GZZvUaqn.jpg", alt="WeChat-branded 2d barcode.", width="250", height="250" %}
  <figcaption>
    WeChat 앱으로 이 2D 바코드를 스캔하면 데모 미니 앱이 실행돼요.
  </figcaption>
</figure>

또한 미니 앱은 슈퍼 앱 내에서 채팅 메시지나 뉴스 피드 등에서도 발견될 수 있어요.
어떤 슈퍼 앱들은 공인 계정들이 미니 앱을 자신들의 프로필에 포함할 수 있도록 허용하기도 해요.
미니 앱들은 사용자들이 물리적으로 가까이 있을 때나 (매장 앞에 서있는 등) 사실상 가까이 있을 때 (그 매장으로 가는 길을 찾고 있을 때 등) 사용자에게 추천되어 발견될 수도 있어요.
자주 사용되는 미니 앱들은 주로 슈퍼 앱을 스와이프-다운해서 나오거나 별도의 영역에 있는 앱 서랍에 고정되어 접근할 수도 있어요.

## 사용자 경험

모든 슈퍼 앱은 미니앱을 위해 사실상 똑같은 사용자 경험을 제공해요.
상단바의 테마는 커스터마이징이 가능하며 미니 앱의 이름을 나타내고, 상단 오른쪽 구석에는 닫기 버튼과 액션 버튼(주로 공유, 즐겨찾기, 신고, 피드백, 설정 등)이 존재해요.
아래 스크린샷은 Alipay 슈퍼 앱에서 동작하는 쇼핑 미니 앱과 액션 버튼의 메뉴들을 보여줘요.


<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PkjzF8AyxDVIAMZmhVrr.jpg", alt="The Alipay super app running a shopping mini app with highlighted top bar, action menu button, and close button. The action menu is opened.", width="300", height="649" %}
  <figcaption>
    Alipay 슈퍼 앱 안에서 열린 쇼핑 미니 앱의 액션 메뉴
  </figcaption>
</figure>

## UI 패러다임

미니 앱의 하단에는 주 내비게이션을 위한 하단바가 주로 존재해요.
대부분의 슈퍼 앱들은 미니 앱들의 빠른 개발 구현을 위해 주로 사용되는 캐러셀, 아코디언, 프로그레스 바, 스피너, 스위치, 지도, 등의 공용 UI 패러다임 [컴포넌트를 제공해요](/mini-app-components/).
이런 공용 컴포넌트는 서로 다른 미니 앱들의 일관된 사용자 경험을 만드는 것에도 매우 좋고, 이는 [WeChat의 미니 앱 디자인 가이드라인](https://developers.weixin.qq.com/miniprogram/en/design/)에도 권장돼요.
[Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios/overview/themes/)과 Google의 [Design for Android](https://developer.android.com/design) 권장 사항과 달성하려는 목표가 비슷해요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/nFVCU3HqKERzl7Lops6Q.png", alt="The Douyin demo mini app showcasing the Douyin slider (carousel) component with toggles for auto-advance, dot indicators, etc.", width="300", height="617" %}
  <figcaption>
    Douyin 앱의 슬라이더 (캐러셀) 컴포넌트와 다양한 옵션들.
  </figcaption>
</figure>

## 서빙

미니 앱은 조각 조각 별도의 리소스로 서빙되지 않고, 모든 정보를 포함하는 하나의 암호화된 패키지로 서빙돼요.
일반적인 웹앱과 달리 미니 앱 개발자의 서버(origin)에서 서빙되는 것이 아니라 슈퍼 앱 제공자로부터 직접 제공돼요.
물론 미니 앱 개발자들의 서버 등과 API를 통해서 통신을 할 수는 있지만, 핵심 자원(주로 App Shell이라고 불러요)들은 슈퍼앱 제공자를 통해서 전달돼야 해요.
또한 미니 앱은 자신들이 정보를 요청할 서버 (origin) 주소들 미리 명시적으로 작성해야 해요.

## 캐싱, 업데이트, 그리고 딥 링킹

미니 앱은 슈퍼 앱 내에 캐시 형태로 저장되어 사용자가 다음 번에 미니 앱을 재실행하면 거의 즉시 실행돼요.
만약 업데이트 사항이 있다면 새로운 앱 패키지가 실행돼요.
버전 번호는 실행 URI의 일부가 될 수도 있어요 ([미니 앱의 발견](/mini-app-about/#-2) 참고).
이렇게 되면 슈퍼 앱이 로컬 캐싱된 미니앱이 최신 버전인지 아닌지 빠르게 판별할 수 있다는 장점이 있어요.
실행 URI는 또한 미니 앱 내의 특정 페이지에 대한 정보를 마치 딥 링크처럼 담고 있을 수도 있어요.
사이트맵을 통해 미니 앱의 어느 페이지가 슈퍼 앱의 크롤러에 의해 발견될 수 있는지 명시할 수도 있어요.


<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ZKLNvNnm3Rr6aBmYbons.png", alt="macOS Finder showing a folder containing cached WeChat mini app `.wxapkg` files.", width="800", height="465" %}
  <figcaption>
    미니 앱이 암호화된 패키지 앱으로 캐시된 모습이에요.
  </figcaption>
</figure>

## 저장 공간과 권한

미니 앱은 슈퍼 앱 제공자에 의해서 리뷰되기에 사용자들은 일반적인 웹앱보다 미니 앱을 더 안전하다고 인식하게 돼요.
미니 앱들은 Manifest 파일이나 별도의 설정 파일을 통해서 미니 앱이 사용할 권한들과, 경우에 따라 그 권한이 필요한 이유까지 명시해야 해요.
물론 이 정보들을 허위로 작성할 수도 있겠지만, 사용자들이 납득할 만한 이유 없이 권한을 접근하는데 어려움을 겪을거예요.
마치 정당한 이유 없이 [모션 센서에 접근](https://twitter.com/search?q=why%20website%20access%20%22motion%20sensors%22%20&src=typed_query&f=live)하는 것처럼요.
또한 웹앱과 비해 미니 앱 제공자들은 굳이 사용자를 식별(fingerprinting)하기 위해 노력할 이유가 없어요.
사용자들은 대부분 슈퍼앱을 통해 이미 로그인된 상태이기 때문이에요. ([신원, 결제 정보, 소셜 그래프](/mini-app-about/#-8) 참고)

미니 앱이 특별한 권한을 요청할 때는 권한 요구 창이 사용자에게 제시돼요.
플랫폼 제공자가 의무화할 경우 개발자는 권한 요구 이유까지 포함하여 작성하게 돼요.
아래 스크린샷은 [Douyin 데모 미니 앱](https://microapp.bytedance.com/docs/zh-CN/mini-app/introduction/plug-in/example/)이 위치 확인 권한을 사용자에게 묻는 장면이에요.
어떤 슈퍼 앱에서는 미니 앱들이 특정 권한이 허용되었는지 확인하거나 권한을 미리 요청하는 Imperative API 등을 제공하기도 해요.
심지어 어떤 슈퍼 앱들은 슈퍼 앱의 권한 설정 페이지를 여는 API를 제공하기도 해요 (마치 Chrome의 _[페이지 설정](about://settings/content/siteDetails?site=https%3A%2F%2Fexample.com%2F)_처럼요.
미니 앱은 또한 자신들이 통신하는 모든 서버(Origin)들을 미리 명시해야 해요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/8To8DiUqnP4qqFfpPNqk.png", alt="The Douyin demo mini app showing a geolocation prompt with two options: 'Not Allowed' and 'Allowed'.", width="300", height="617" %}
  <figcaption>
    Douyin 데모 미니 앱이 지리적 위치 정보를 요청하는 모습.
  </figcaption>
</figure>

## 강력한 기능에 접근하기

미니 앱을 호스팅하는 슈퍼 앱은 JavaScript 브릿지를 통해 강력한 API 등을 미니 앱에 제공해요.
이 JavaScript 브릿지는 운영 체제의 API에 접근하는 다양한 Hook을 제공해요.
예를 들어, 미니 앱은 현재 연결된 활성 Wi-Fi 정보를 반환하는 `getConnectedWifi()` 같은 JavaScript 함수를 제공할 수 있어요.
그 구현은 안드로이드의 경우 [`getConnectionInfo()`](<https://developer.android.com/reference/android/net/wifi/WifiManager#getConnectionInfo()>)로,
iOS의 경우 [`CNCopyCurrentNetworkInfo()`](https://developer.apple.com/documentation/systemconfiguration/1614126-cncopycurrentnetworkinfo)로 구현되고요.
슈퍼 앱은 이 뿐만 아니라 더 다양한 기기 API들을 제공할 수 있어요 (예: 블루투스, NFC, iBeacon, GPS, 시스템 클립보드, 방향 센서, 배터리 정보, 캘린더 접근, 전화번호부 접근, 화면 밝기 조절, 파일 시스템 접근, 물리적 피드백을 위한 진동 하드웨어 접근, 카메라와 마이크 접근, 화면 녹화와 스크린샷 생성, 네트워크 상태, UDP 소켓, 바코드 인식, 기기 메모리 정보 등)


<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/HNEKyoLVeq3IUKGXEZEZ.png", alt="The WeChat demo mini app showing a slider that controls the screen brightness of the device moved all the way to the maximum.", width="300", height="649" %}
  <figcaption>
    WeChat 데모 미니 앱이 기기의 화면 밝기를 최대로 설정하는 모습.
  </figcaption>
</figure>

## 클라우드 서비스 접근

여러 슈퍼 앱들은 텍스트 번역, 사물 인식, 이미지 분류, 음성 인식, 또는 다양한 머신러닝 작업 등의 고차원 작업들을 돕기 위해 주 컴퓨팅 자원과 별도로 서버리스한 클라우드 서비스를 운영해요.
미니 앱은 또한 슈퍼 앱 제공자들이 제공하는 광고를 통해 수익을 창출할 수도 있어요.
슈퍼 앱 제공자들은 미니 앱 개발자들이 미니 앱 사용 패턴을 이해할 수 있도록 사용자 지표를 제공하기도 해요.

## 신원, 결제 정보, 소셜 그래프

미니 앱의 아주 중요한 기능은 슈퍼 앱을 통해서 제공되는 신원과 소셜 그래프 정보예요.
Douyin과 WeChat 같은 슈퍼 앱들은 소셜 네트워킹 사이트로 시작했기 때문에, 대부분의 사용자들은 온라인 신원(identity)과 친구 관계, 그리고 개인 정보를 가지고 있어요.
어떤 사용자들은 정부로부터 공인(verified)되기도 했고요.
예를 들어, 어떤 쇼핑 미니 앱은 사용자의 동의 아래 사용자의 집 주소와 전화번호, 실명 등을 사용자들이 하나하나 힘들게 입력하지 않도록 슈퍼 앱으로부터 직접 받을 수 있어요.
아래 사진은 WeChat 안에서 구동되는 Walmart 미니 앱이 첫 실행에 개인화된 화면과 어디서 많이 본 사용자 사진을 보여주는 모습이에요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/HzPx6ZSqQWvsUDT04ex2.png", alt="The Walmart mini app showing the author's face and name on the 'Me' tab.", width="300", height="649" %}
  <figcaption>
    첫 구동에 개인화된 Me 페이지를 보여주는 Walmart 미니 앱의 모습.
  </figcaption>
</figure>

미니 앱은 게임 내에서 자신의 최고 기록 같은 업적이나 연락처의 친구에게 도전하는 등이 방식으로 엄청난 인기를 얻을 수도 있어요.
그 경우 미니 앱은 딱 한 번의 탭으로 열 수 있기 때문에, 사용자들은 어떤 불편함이나 방해 요소 없이 미니 앱에 도달할 수 있어요.

{% Aside 'success' %}
  다음 챕터에서 [미니 앱들이 H5 앱들과 QuickApp과 다른 점들](/mini-app-what-are-h5-and-quickapp)을 알아볼거예요.
{% endAside %}

## Acknowledgements

This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
and Keith Gu.
