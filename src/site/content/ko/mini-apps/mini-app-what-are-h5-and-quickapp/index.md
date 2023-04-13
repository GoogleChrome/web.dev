---
layout: post
title: H5와 QuickApp은 무엇인가요?
authors:
  - thomassteiner
date: 2021-03-03
# updated: 2021-03-03
description: |
  미니앱과는 다른 H5 앱과 QuickApp에 대해서 알아봐요.
tags:
  - mini-apps
---

{% Aside %}
이 포스트는 글타래의 일부이며, 이전 글들에서 언급한 내용 위에 새로운 내용을 다루는 글이에요.
만약 이 페이지에 막 이르렀다면, [처음](/mini-app-super-apps/)부터 읽어보는 것을 추천해요.
{% endAside %}

## 미니앱이 아닌 것들

미니앱에 대한 개발자 경험에 대해 더 이야기하기 전에, 미니앱이 아닌 2가지 기술에 대해서 이야기할게요.
바로 H5 앱과 QuickApp이에요.

## H5

H5 앱은, 또는 H5 페이지는, 미니앱의 전신이에요.
주로 H5는 채팅으로 쉽게 공유할 수 있는 잘 디자인된 웹앱이나 웹페이지를 의미해요.
H5는 반응형 디자인과 빠른 CSS 애니메이션, 멀티미디어 콘텐츠 등의 HTML5와 그 관련 기술을 의미해요.
중국어 위키피디아는 아예 H5를 HTML5로 [리다이렉트](https://zh.wikipedia.org/wiki/H5)해요.
H5의 대표적 예시는 WeChat의 [H5 boilerplate](https://panteng.github.io/wechat-h5-boilerplate/) 데모가 있어요.

## QuickApp

[QuickApp](https://www.quickapp.cn/)은 다음 회원사들이 가입되어 있는 업계 연합이에요.

- [vivo open platform](https://dev.vivo.com.cn/)
- [Huawei Developer Alliance](http://developer.huawei.com/cn/consumer)
- [OPPO open platform](https://open.oppomobile.com/)
- [Xiaomi Open Platform](https://dev.mi.com/console/app/newapp.html)
- [Lenovo Open Platform](http://open.lenovo.com/developer/)
- [Gionee Open Platform](http://devquickapp.gionee.com/)
- [Meizu Open Platform](http://open.flyme.cn/)
- [ZTE Developer Platform](https://dev.ztems.com/)
- [Nubian Open Platform](http://developer.nubia.com/developer/view/index.html)
- [OnePlus Open Platform](http://www.oneplus.cn/)
- [Hisense Open Platform](http://dev.hismarttv.com/)
- [China Mobile Terminal Corporation](https://www.chinamobileltd.com/tc/global/home.php)

QuickApp의 기반 기술은 일반적인 미니앱과 비슷하지만 ([구성 요소와 호환성](/mini-app-about/#-2) 참고) 발견 방법은 달라요.
QuickApp은 스토어에 등재되고 회원사의 어떤 기기들에는 선탑재되며 딥링크를 통해 공유할 수 있는 서비스들이에요. ([Quick App showcase](https://www.quickapp.cn/quickAppShow) 참고)
QuickApp은 슈퍼앱 안에서 구동되는 것이 아니고, 기기와 강하게 연동된 하나의 온전한 애플리케이션으로 동작해요.
운영 체제에서 제공되는 JavaScript 브릿지를 통해서 전체화면 애플리케이션으로 렌더링되는거예요.

{% Aside 'success' %}
다음으로 [미니앱의 개발자 경험](/mini-app-devtools/)에 대해서 알아봐요.
{% endAside %}

## 감사의 말

이 글은 [Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
그리고 Keith Gu에 의해 리뷰되었어요.
