---
layout: post
title: 미니앱과 슈퍼앱
authors:
  - thomassteiner
date: 2021-03-03
# updated: 2021-03-03
description: |
  슈퍼앱의 개념과 주요 슈퍼앱 제공자들에 대해서 알아봐요.
tags:
  - mini-apps
---

## 미니앱의 세계에 오신 것을 환영해요

휴대전화의 애플리케이션을 보면 아마 특정한 목표를 위해 특정한 앱을 가지고 계실거예요.
아마 은행 앱도 있고, 대중교통 앱도 있고, 길찾기 앱도 있으실거예요.
이 글은 미니 프로그램, 혹은 애플릿이라고 불리는 특별한 형태의 앱인 미니앱에 대해서 소개할거예요.
먼저 다양한 미니앱 플랫폼의 배경과 개발자 경험, 그리고 웹이 미니앱에서 무엇을 배울 수 있는지에 대해서 알아볼거예요.
미니앱에 대해서 배우기 전에 먼저 슈퍼앱에 대해서 알아봐요.

## 슈퍼앱은 무엇인가요?

슈퍼앱은 **미니앱**이라고 불리는 다른 앱들을 구동할 수 있어요.
유명한 슈퍼앱들에는 Tencent의 [WeChat](https://weixin.qq.com/), Ant Group(중국 Alibaba의 자회사)의 [Alipay](https://www.alipay.com/), 검색 엔진 [Baidu](https://baidu.com/)의 앱,
ByteDance의 [Douyin](https://www.douyin.com/) (TikTok)이 있어요.
첫 3개의 회사는 주로 **B**(aidu) **A**(libaba) **T**(encent) 에서 따와 BAT라고 불려요.
슈퍼앱들은 중국 시장을 매섭게 장악했고, 그 때문에 이 앱의 여러 예시들은 중국의 예시예요.

<figure>
  {% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/UKmUgG231MtQ2nEo1P0K.PNG", alt="List of recently launched mini apps in the WeChat super app.", width=300, height=649 %}
  <figcaption>WeChat 슈퍼앱이 최근에 실행된 미니앱을 보여주는 모습</figcaption>
</figure>

### 슈퍼앱 플랫폼에 대하여

WeChat은 자신의 서비스를 사용자들이 살아가는 데 있어 필요한 모든 제품이 판매하는 만물상을 목표로 해요.
Alipay는 자신의 플랫폼을 신용, 대금, 보험, 할부, 생활 서비스 등의 금융 시스템 위에 건설하고 있어요.
Baidu는 자신의 검색 엔진을 미니앱들에 information-as-a-service로 제공하여 여행, 쇼핑, 광고, 결제 등으로 사람, 서비스, 그리고 정보를 결합하고 있어요.
Douyin 또한 자신의 소셜커머스 플랫폼을 엔터테인먼트와 쇼핑 플랫폼으로 확장하고 있어요.

### 슈퍼앱의 설치

슈퍼앱은 여러 운영 체제에서 제공돼요.
물론 공식 앱스토어에서 제공되는 여러 버전의 슈퍼앱들은 지역에 따라 일부 기능이 비활성화되어 있을 수도 있어요.
아래 링크들은 세상 어디에서나 작동하지만, 신뢰할 수 없는 출처와 통신하게 될 수도 있어요.
이에 대한 위험 부담을 확인하고 **본인의 책임 하에** 아래 앱들을 설치하세요.
대부분 전화번호를 통해 계정을 생성해야하기에 일회용 전화번호를 사용하는 것도 고려해보세요.
많은 슈퍼앱들은 외국인들에겐 **해외 계정**만 생성할 수 있도록 하기에, 국내 계정의 몇몇 기능들을 사용하지 못할 수도 있어요.

- **WeChat:** [iOS](https://apps.apple.com/us/app/wechat/id414478124),
  [Android](https://weixin.qq.com/cgi-bin/readtemplate?uin=&stype=&promote=&fr=&lang=zh_CN&ADTAG=&check=false&t=weixin_download_method&sys=android&loc=weixin,android,web,0),
  [macOS](https://mac.weixin.qq.com/), [Windows](https://pc.weixin.qq.com/)
- **Baidu:** [iOS](https://apps.apple.com/us/app/%E7%99%BE%E5%BA%A6/id382201985),
  [Android](https://play.google.com/store/apps/details?id=com.baidu.searchbox&hl=en)
- **Alipay:** [iOS](https://itunes.apple.com/app/id333206289?mt=8),
  [Android](https://t.alipayobjects.com/L1/71/100/and/alipay_wap_main.apk)
- **Douyin:**
  [iOS](https://itunes.apple.com/cn/app/%E6%8A%96%E9%9F%B3%E7%9F%AD%E8%A7%86%E9%A2%91/id1142110895?l=zh&ls=1&mt=8)
  (CN-only), [Android](http://s.toutiao.com/UsMYE/)

{% Aside %}
이 앱들은 대부분 중국어로만 제공되니, 중국어를 하지 못한다면 다른 휴대전화로 [Google 번역 앱](https://translate.google.com/intl/en/about/#!#speak-with-the-world)의 카메라 모드를 사용해보세요.
{% endAside %}

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/kSLjHjkFgscBC2j2d6j9.png", alt="A secondary phone running Google Translate in camera mode live-translating the user interface of a Chinese mini app running on the primary phone.", width="300", height="520" %}
  <figcaption>
    Google 번역 앱을 통해 중국 미니앱을 실시간 번역하는 모습.
  </figcaption>
</figure>

{% Aside 'success' %}
[다음 글](/mini-app-about/)에서 미니앱에 대해 더 배워보세요.
{% endAside %}

## Acknowledgements

This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
and Keith Gu.
