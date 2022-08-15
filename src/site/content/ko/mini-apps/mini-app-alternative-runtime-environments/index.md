---
layout: post
title: 다른 미니앱 구동 환경
authors:
  - thomassteiner
date: 2021-03-03
updated: 2021-09-07
description: |
  모바일 외에 미니앱의 다른 구동 환경에 대해서 알아봐요.
tags:
  - mini-apps
---

{% Aside %}
이 포스트는 글타래의 일부이며, 이전 글들에서 언급한 내용 위에 새로운 내용을 다루는 글이에요.
만약 이 페이지에 막 이르렀다면, [처음](/mini-app-super-apps/)부터 읽어보는 것을 추천해요.
{% endAside %}

## 모바일 그 이상의

중국과 같은 나라에서는 미니앱은 시장에 돌풍을 불러왔어요.
모바일 기기 같이 미니앱이 넘쳐나는 환경 외에도, 미니앱은 자동차나 컴퓨터 같은 환경에도 진출하기 시작했어요.

## 자동차의 미니앱

2020년 7월 독일의 자동차 회사 BMW 그룹은 Tencent의 WeScenario와 협업한다는 사실을 [발표했어요](https://www.press.bmwgroup.com/china/article/detail/T0313254ZH_CN/%E2%80%9C2020-%E5%AE%9D%E9%A9%AC%E7%A7%91%E6%8A%80%E6%97%A5%E2%80%9D%E5%9C%A8%E7%BA%BF%E5%8F%91%E5%B8%83%E5%A4%9A%E6%AC%BE%E8%BD%A6%E5%86%85%E6%95%B0%E5%AD%97%E4%BA%A7%E5%93%81).
[Tencent에 따르자면](https://www.tencent.com/en-us/articles/2201068.html), 이 협업을 통해 "30개 이상의 자동차 브랜드에 탑재되며 [WeScenario의] 소셜, 콘텐츠, 서비스 생태계를 110가지 이상의 주류 자동차 모델들에 설치될 것"이라고 밝혔어요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/AX07xQlEHL7MDjPo1U1H.jpg", alt="Dashboard of a Tencent car showing two rows of mini app icons.", width="800", height="533" %}
  <figcaption>
    Tencent WeScenario의 랜딩 페이지 (출처: <a href="https://www.press.bmwgroup.com/china/article/detail/T0313254ZH_CN/%E2%80%9C2020-%E5%AE%9D%E9%A9%AC%E7%A7%91%E6%8A%80%E6%97%A5%E2%80%9D%E5%9C%A8%E7%BA%BF%E5%8F%91%E5%B8%83%E5%A4%9A%E6%AC%BE%E8%BD%A6%E5%86%85%E6%95%B0%E5%AD%97%E4%BA%A7%E5%93%81">BMW</a>).
  </figcaption>
</figure>

## 데스크톱의 미니앱

### WeChat 데스크톱의 미니앱

[macOS](https://dldir1.qq.com/weixin/mac/WeChatMac.dmg)와 [Windows](https://dldir1.qq.com/weixin/Windows/WeChatSetup.exe))의 WeChat 클라이언트를 통해서 데스크톱에서도 미니앱을 구동할 수 있어요.
(만약 macOS에서 연구 중이며 더 많은 기능들을 시도해보고 싶다면 [앱스토어 버전](https://itunes.apple.com/cn/app/id836500024) 대신 웹사이트 버전을 사용하세요.)

macOS에서 실험해보고 싶다면, File Transfer 계정을 통해서 스스로에게 미니앱을 공유하세요.
이를 통해서 데스크톱에서도 미니앱을 열 수 있어요. 대부분의 경우 미니앱을 바로 클릭하여 실행할 수 있을 거예요. 일부 경우는 채팅 기록 자체를 모바일에서 복사해야하는 경우도 있어요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/qLbYBpAoSvbc1Qjc9Ub0.png", alt="The WeChat macOS desktop client showing a chat with oneself with a shared mini app and a chat history as the two visible messages.", width="800", height="602" %}
  <figcaption>
    WeChat macOS 데스크톱 앱에서 미니앱을 공유하는 모습.
  </figcaption>
</figure>

Windows에서는 미니앱을 공유해서 열 필요가 없어요. 기본적으로 미니앱 패널이 존재해서 최근 사용된 미니앱과 미니앱 검색 페이지를 볼 수 있어요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/NQCoGaAWcbuiO37dCNY5.png", alt="The mini app panel in the WeChat Windows client showing the user's recently used mini apps.", width="800", height="531" %}
  <figcaption>
    WeChat Windows 클라이언트의 미니앱 패널.
  </figcaption>
</figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/H5nqmnoK9JjLcu8mWDSH.png", alt="The mini app search in the WeChat Windows client showing mini apps listed in various categories like games, business, education, etc.", width="800", height="576" %}
  <figcaption>
    WeChat Windows Client의 미니앱 검색 페이지.
  </figcaption>
</figure>

데스크톱에서 사용하는 WeChat의 미니앱은 OS와 긴밀하게 통합돼요.
macOS와 Windows 모두 독에 하나의 앱 아이콘을 가지게 돼요.
macOS에서는 독에서 보관하는 기능이 존재하기는 하지만 WeChat 클라이언트가 종료되면 동시에 미니앱도 종료돼요.
또한 Windows에서는 미니앱의 이름이 정확하게 보이지만 macOS에서는 미니앱의 이름 대신 WeChat의 이름이 나타나요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/nrvwtwOWot6eZI40evfp.png", alt="The macOS multitask switcher includes mini apps alongside regular macOS app.", width="800", height="79" %}
  <figcaption>
    스타벅스 미니앱도 일반적인 macOS 앱처럼 멀티태스킹할 수 있어요.
  </figcaption>
</figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fG4cpJgpyXeqvjn4lF3v.png", alt="The Starbucks mini app icon on the macOS Dock with a WeChat title.", width="646", height="412" %}
  <figcaption>
    macOS에서의 미니앱은 이름으로 WeChat이 나타나요.
  </figcaption>
</figure>

대부분의 미니앱은 데스크톱에 최적화되지 않아 모바일 인터페이스로 고정된 크기로만 사용할 수 있어요. ([사용자 경험](/mini-app-about/#-3) 참고).

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/uorcciuZIL8sadxTjXbv.png", alt="The Starbucks mini app running on macOS asking for the user profile permission which the user can grant via a prompt shown at the bottom.", width="300", height="484" %}
  <figcaption>
    macOS에서 실행되는 스타벅스 미니앱이 신원 정보 권한을 요청하는 모습.
  </figcaption>
</figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/UGufvRnoaAGm8A3qQG4a.png", alt="The Starbucks mini app running on macOS showing the home screen of the app.", width="300", height="484" %}
  <figcaption>
    스타벅스 미니앱이 macOS에서 고정된 크기로만 동작하는 모습.
  </figcaption>
</figure>

반응형 미니앱은 데스크톱에 최적화되어 있어요. macOS에서는 여전히 고정된 크기로 동작하지만 Windows에서는 유연하게 크기를 변경할 수 있어요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cUMqQ75zPeCDNTcCWF5D.png", alt="The WeChat components demo app in a responsive app window that can be resized and that by default is wider than the usual mobile screen.", width="800", height="620" %}
  <figcaption>
    WeChat 컴포넌트 데모 앱이 반응형으로 동작하는 모습.
  </figcaption>
</figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rPbojIjBGKbNtDviB0MJ.png", alt="The WeChat components demo app in a narrow window showing three boxes A, B, and C stacked on top of each other.", width="300", height="614" %}
  <figcaption>
    WeChat 컴포넌트 데모 앱을 좁게 연 모습.
  </figcaption>
</figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xnlacc8Xm1eNMCuajYYL.png", alt="The WeChat components demo app in a wide window showing three boxes A, B, and C with A stacked on top of B and C on the side.", width="600", height="565" %}
  <figcaption>
    WeChat 컴포넌트 데모 앱을 넓게 연 모습.
  </figcaption>
</figure>

macOS에서 미니앱의 권한은 컨텍스트 메뉴를 통해서 변경할 수 있어요.
Windows에서는 권한을 설정하는 것은 불가능한 것 같고, 위치 또한 권한 없이 접근 가능한 대략적인 위치만 읽을 수 있는 것 같았어요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rHyiTGbMauqbSFWBFlMW.png", alt="The WeChat components demo app running on macOS showing two checkboxes for the location and user info permission.", width="500", height="384" %}
  <figcaption>
    macOS에서 위챗 미니앱의 설정.
  </figcaption>
</figure>

### 360 Secure Browser에서의 미니앱

360 Secure Browser(360 安全浏览器)는 Qihoo 사에서 개발한 웹브라우저예요.
[iOS와 Android](https://mse.360.cn/)뿐만 아니라, [Windows](https://browser.360.cn/se/), [macOS](https://browser.360.cn/ee/mac/index.html), [Linux](https://browser.360.cn/se/linux/index.html)에서도 사용할 수 있어요.
Windows에서는 특별한 [360 mini apps](https://mp.360.cn/#/)를 구동할 수 있어요.
[개발자 문서](https://mp.360.cn/doc/miniprogram/dev/)와 [API](https://mp.360.cn/doc/miniprogram/dev/#/e1487ee88399013ec06eff05007391fc)는 타사와 비슷하지만 개발자 도구는 제공하지 않아요.
대신 개발자들은 자신의 IDE에서 앱을 개발한 뒤 브라우저에서 개발 모드를 활성화해서 테스트해야 해요.
디버깅은 Chrome 개발자 도구로 진행해요.
[데모 앱](https://mp.360.cn/examples/appdemo.zip)으로 개발을 시작할 수 있어요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/IdHpN4GhVWDZ5gmSZ4Jb.png", alt="A 360 mini app running in 360 Secure Browser being debugged with Chrome Dev Tools.", width="800", height="402" %}
  <figcaption>
    Chrome 개발자 도구로 360 미니앱을 디버깅하는 모습
  </figcaption>
</figure>

360 미니앱은 전체화면으로 동작할 수 있고 하단 멀티태스킹 바에도 하나의 앱으로 나타나요.
컨텍스트 메뉴에서, 데스크톱에서 실행할 수 있는 미니앱 바로가기 버튼을 생성할 수 있어요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/M4MPV6TXwsLC6lFn9Jgi.png", alt="A 360 video mini app running in fullscreen mode showing various thumbnails of videos to watch.", width="800", height="402" %}
  <figcaption>
    360 미니앱이 전체화면으로 열린 모습.
  </figcaption>
</figure>

## 웹 기반 미니앱

어떤 미니앱들은 웹에 기반하고 있어요. 하지만 그 미니앱들은 더 많은 것을 하기 위해 특별한 WebView를 사용하기도 해요.

### LINE

[LINE](https://line.me/)은 스마트폰, 태블릿, 컴퓨터 등 전자기기에서 사용할 수 있는 인스턴트 메신저예요.
LINE은 뿐만 아니라 디지털 지갑, 뉴스 스트림, 비디오 스트리밍, 웹툰 서비스도 하고 있어요.
이 서비스는 대한민국 인터넷 검색 엔진 회사 [Naver Corporation](http://www.navercorp.com/)의 자회사예요.
LINE의 [미니앱](https://developers.line.biz/en/docs/line-mini-app/quickstart/)은
[본질적으로 일반 웹앱이에요](https://developers.line.biz/en/docs/line-mini-app/discover/specifications/#supported-platforms-and-versions)
([샘플 앱](https://github.com/line/line-liff-v2-starter) 참고).
[LINE Front-end Framework](https://developers.line.biz/en/docs/liff/developing-liff-apps/#developing-a-liff-app) (LIFF)에 기반하고 있어요.
[퍼머링크](https://developers.line.biz/en/docs/line-mini-app/develop/permanent-links/)를 활용해서 LINE 앱 바깥에서도 접근할 수 있어요.
([예시](https://liff.line.me/1653544369-LP5XbPYw)).
하지만, 그 경우 모든 API가 동작하지는 않아요.
예시로, QR 코드를 읽는데 사용되는 [`liff.scanCode()`](https://developers.line.biz/en/reference/liff/#scan-code) 또는 블루투스 관련 기능인 [`liff.bluetooth.getAvailability()`](https://developers.line.biz/en/reference/liff/#bluetooth-get-availability) 같은 기능들은 broswer API로는 사용할 수 없어요.
플랫폼에 대한 느낌을 잡아보려면 [LINE Playground app](https://liff.line.me/1653544369-LP5XbPYw)를 브라우저에서 실행해보거나, LINE 계정이 있으시다면 LINE 앱에서 실행해보세요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/YIlFjXgZhq8ROMrPA1BO.png", alt="The LINE Playground demo app running on an iOS device showing `liff.getOS()` returning 'ios'.", width="300", height="649" %}
  <figcaption>
    iOS 기기에서 LINE Playground 데모 앱을 실행한 모습.
  </figcaption>
</figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/UPwJbVhssGfA4IQ89kEo.png", alt="The LINE Playground demo app running in the web browser showing `liff.getOS()` returning 'web'.", width="800", height="510" %}
  <figcaption>
    브라우저에서 LINE Playground 데모 앱을 실행한 모습.
  </figcaption>
</figure>

### Google Spot

[Google Spot 플랫폼](https://developers.google.com/pay/spot)는 개발자들이 [Google Pay](https://pay.google.com/)로 개발자들이 생성하고, 브랜딩하고, 호스팅할 수 있는 디지털 스토어프론트인 "스폿"을 만들 수 있도록 해요.
온라인에서 발견하거나, 오프라인 매장에서도 물리적 바코드를 통해서 발견할 수 있어요.
사용자들은 Spot을 공유하거나, Google Pay 앱에서 발견할 수 있어요.
Spot은 HTML과 JavaScript로 만들어져 있기에 존재하는 PWA나 모바일 웹사이트에 "단 몇줄의 JavaScript"를 추가하면 Spot으로 만들 수 있어요.
공식 발표 자료에 따르면요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/T4OLZX8PIFjFq3gVzUmo.png", alt="The Eat.fit mini app running in the Google Pay super app showing the sign-in bottom sheet.", width="300", height="637" %}
  <figcaption>
    Eat.fit 미니앱이 Google Pay 슈퍼앱에서 구동되는 모습 (출처: <a href="https://developers.google.com/pay/spot">Google</a>).
  </figcaption>
</figure>

### Snap Mini

[Snap Inc.](https://snap.com/)은 [Snapchat](https://www.snapchat.com/)으로 잘 알려진 미국의 카메라 및 소셜 미디어 회사예요.
Snap은 최근 친구들과 사용할 수 있는 작은 도구인 [Snap Minis](https://minis.snapchat.com/)를 발표했어요.
HTML5로 만들어져 쉽게 개발할 수 있어요.
또한, 모든 Snapchat 유저에게 기종에 불문하고 설치 없이 사용할 수 있어요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vM5d0wK5fCQSV0VyP7HA.png", alt="The Atom Tickets mini app running in Snapchat showing three snapchat users reserving their seats in a movie theater.", width="320", height="470" %}
  <figcaption>
   Atom Tickets 미니앱이 Snapchat에서 구동되는 모습 (출처: <a href="https://minis.snapchat.com/">Snap</a>).
  </figcaption>
</figure>

### VK 미니앱

러시아의 소셜 네트워킹 플랫폼 [VK](https://vk.com/mini-apps) 또한 개발자들이 자사의 소셜 네트워크와 연동하여 [개발할 수 있는](https://vk.com/dev/vk_apps_docs) [미니앱](https://vk.com/mini-apps) 플랫폼을 운영해요.
VK mini apps 또한 VK의 플랫폼별 모바일 앱 또는 데스크톱 웹사이트에서 사용할 수 있어요.
[Mail.ru](https://mail.ru/) 같은 자사의 서비스를 제외하고는 VK mini apps은 [Atom browser](https://browser.ru/)에도 깊게 통합되어 있어요.

<figure>
  {% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/tZJgYpdjurBVfhInqWRo.webp", alt="The Все аптеки mini app running in VK.", width="460", height="948" %}
  <figcaption>
    VK에서 구동되는 Все аптеки 미니앱 (출처: <a href="https://vk.com/mini-apps">VK</a>).
  </figcaption>
</figure>

{% Aside 'success' %}
다음으로는 [미니앱 오픈소스 프로젝트](/mini-app-open-source-projects/)에 대해서 알아봐요.
{% endAside %}

## 감사의 말

이 글은 [Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
그리고 Keith Gu에 의해 리뷰되었어요.
