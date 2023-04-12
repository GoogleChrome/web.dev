---
layout: post
title: 미니앱 표준화
authors:
  - thomassteiner
date: 2021-03-03
# updated: 2021-03-03
description: |
  미니앱의 표준화를 위한 노력들을 알아봐요.
tags:
  - mini-apps
---

{% Aside %}
이 포스트는 글타래의 일부이며, 이전 글들에서 언급한 내용 위에 새로운 내용을 다루는 글이에요.
만약 이 페이지에 막 이르렀다면, [처음](/mini-app-super-apps/)부터 읽어보는 것을 추천해요.
{% endAside %}

## 미니앱의 인기

미니앱은 엄청난 성장을 하고 있어요. WeChat의 미니앱은 2020년 6월에 [8억 3000만 활성 사용자](https://www.questmobile.com.cn/research/report-new/122)를 달성했어요.
Alipay 미니앱은 2019년 4월 [4억 100만 활성 사용자](https://kr-asia.com/the-mau-of-wechat-alipay-and-baidus-mini-programs-now-add-up-to-more-than-1-billion)를 달성했고,
Baidu 미니앱은 같은 달 [1억 1500만 활성 사용자](https://kr-asia.com/the-mau-of-wechat-alipay-and-baidus-mini-programs-now-add-up-to-more-than-1-billion)를 달성했어요.
본질적으로, 기업체들은 iOS와 Android, 그리고 Web 플랫폼에서 앱을 개발하는 대신 위 3사의 (혹은 더 많은) [슈퍼앱 플랫폼](/mini-app-super-apps/)에서 개발하기를 선택한거예요.
이 슈퍼앱 플랫폼들은 안드로이드, iOS 그리고 Web만큼 서로 다르지 않지만, 그래도 파편화되어있기는 해요.
안드로이드, iOS, 그리고 Web을 하나의 소스에서 빌드하는

[Flutter](https://flutter.dev/), [Ionic](https://ionicframework.com/), 그리고
[React Native](https://reactnative.dev/) ([웹](https://github.com/necolas/react-native-web))
등의 도전이 인기를 얻었지만, 미니앱의 생태계에서는 [미니앱 생태계 커뮤니티 그룹](https://www.w3.org/community/miniapps/)
과 Alibaba, Baidu, ByteDance, Huawei, Intel, Xiaomi, China Mobile, Facebook, 그리고 Google 등의 [멤버들](https://www.w3.org/community/miniapps/participants)이 표준을 주도하고 있어요.

## 출판

이 그룹의 대표적인 출판 사항으로는
[백서](https://w3c.github.io/miniapp/white-paper/), a
[미니앱, W3C 스펙, 그리고 PWA의 API 차이 비교](https://www.w3.org/TR/mini-app-white-paper/comparison.html),
그리고 여러 설명서와 세부사항들이 있어요.

- URI 구조: [spec](https://w3c.github.io/miniapp/specs/uri/),
  [explainer](https://github.com/w3c/miniapp/blob/gh-pages/specs/uri/docs/explainer.md)
- 라이프 사이클: [spec](https://w3c.github.io/miniapp/specs/lifecycle/),
  [explainer](https://github.com/w3c/miniapp/blob/gh-pages/specs/lifecycle/docs/explainer.md)
- 매니페스트: [spec](https://w3c.github.io/miniapp/specs/manifest/),
  [explainer](https://github.com/w3c/miniapp/blob/gh-pages/specs/manifest/docs/explainer.md)
- 패키징: [spec](https://w3c.github.io/miniapp/specs/packaging/),
  [explainer](https://github.com/w3c/miniapp/blob/gh-pages/specs/packaging/docs/explainer.md)
- [위젯 요구 사항](https://w3c.github.io/miniapp/specs/widget-req/)

W3C 멤버이자 그룹 참여자인 Fuqiao Xue (W3C)는 [미니앱과 웹앱의 비교](https://xfq.github.io/miniapp-comparison/)를 혼자 작성했어요.
그룹 공식 사항은 아니지만, 읽을 가치가 있어요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/NW2O3YZ3kxJPPeFr4Jw6.png", alt="The header of the MiniApp Standardization White Paper in a browser window.", width="800", height="540" %}
  <figcaption>
    미니앱 표준 백서.
  </figcaption>
</figure>

## W3C 미니앱 워킹 그룹의 공식 출범

2021년 1월 19일에

[미니앱 워킹 그룹](https://www.w3.org/2021/miniapps/)이 W3C에서 [공식 출범](https://www.w3.org/blog/2021/01/w3c-launches-the-miniapps-working-group/)했어요.
이 그룹은 철자 "MiniApps"를 사용하여 그 기반 기술과 표준 기술을 구별할 예정이에요.
그룹의 [헌장](https://www.w3.org/2021/01/miniapps-wg-charter.html)을 읽어봄으로써 앞으로 어떤 일을 하게될 지 감을 잡을 수 있어요.
그룹 리더들은 이런 노력을 다음과 같이 말했어요.

> Currently, there are many variants of MiniApps developed by different vendors with different APIs.
> To enhance the interoperability between MiniApp platforms, mainstream MiniApp vendors including
> Alibaba, Baidu, Huawei, and Xiaomi have been working together in the [W3C Chinese Web Interest Group](https://www.w3.org/2018/chinese-web-ig/index.html)
> since May 2019 and published a [MiniApp Standardization White Paper](https://www.w3.org/TR/mini-app-white-paper/) in September 2019 as the initial standardization exploration for MiniApp technologies. As more global companies get interested in joining the MiniApp related discussion, the MiniApps Ecosystem Community Group launched during TPAC 2019 so that the global Web community can join the discussion.

> Based on extensive standardization requirements, W3C today announced the formal establishment of the MiniApps Working Group,
> dedicated to in-depth exploration and coordination of the diverse MiniApp ecosystem with W3C members and the public,
> and enhancing the interoperability of different MiniApp platforms, thereby maximizing the integration of MiniApps and the Web,
> reducing technical fragmentation and the learning cost of developers.

"MiniApps와 웹의 결합을 최대화한다" (_"Maximizing the integration of MiniApps and the Web"_)는 내용이 특히 흥미로워요.
이 그룹의 호기심 많은 멤버로써 앞으로 어떤 여정을 하게 될지 기대돼요.

{% Aside 'success' %}
다음으로 모바일 기기가 아닌 [대안 미니앱 구동 환경](/mini-app-alternative-runtime-environments/)에 대해서 알아봐요.
{% endAside %}

## 감사의 말

이 글은 [Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
그리고 Keith Gu에 의해 리뷰되었어요.
