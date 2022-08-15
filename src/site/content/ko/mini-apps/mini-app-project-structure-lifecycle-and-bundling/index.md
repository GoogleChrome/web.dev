---
layout: post
title: 프로젝트 구조, 라이프사이클, 그리고 번들링
authors:
  - thomassteiner
date: 2021-03-03
# updated: 2021-03-03
description: |
  미니앱의 프로젝트 구조, 라이프사이클,  그리고 번들링에 대해서 알아봐요.
tags:
  - mini-apps
---

{% Aside %}
이 포스트는 글타래의 일부이며, 이전 글들에서 언급한 내용 위에 새로운 내용을 다루는 글이에요.
만약 이 페이지에 막 이르렀다면, [처음](/mini-app-super-apps/)부터 읽어보는 것을 추천해요.
{% endAside %}

## 미니앱의 프로젝트 구조

이전에 살펴본 마크업 언어, 스타일링 언어, 그리고 컴포넌트처럼 프로젝트 구조들은 슈퍼앱에 따라 조금씩 다를 수 있어요.
하지만 전체적인 아이디어는 비슷해요. 프로젝트 구조는 다음의 형태를 하고 있어요.

- 루트에서 미니앱을 시작하는 `app.js` 파일.
- [Web App Manifest](https://developer.mozilla.org/docs/Web/Manifest)와 비슷한 역할을 하는 `app.json` 설정 파일.
- (선택) 글로벌 스타일을 담당하는 `app.css` 스타일시트 파일.
- 빌드 정보를 담고 있는 `project.config.json` 파일.

모든 페이지들은 `pages`의 하위 폴더에 개별적으로 저장돼요.
각각의 페이지들은 하나의 CSS 파일, JS 파일, HTML 파일, 그리고 선택적인 JSON 설정 파일을 가지고 있어요.
이처럼, 처음에 구동될 `app.json` 파일 하나만 필요하고 나머지 파일들은 동적으로 찾아낼 수 있어요.
웹 개발자의 관점에서 보자면 미니앱은 멀티 페이지 앱과 유사해요.

```bash
├── app.js               # Initialization logic
├── app.json             # Common configuration
├── app.css              # Common style sheet
├── project.config.json  # Project configuration
└── pages                # List of pages
   ├── index               # Home page
   │   ├── index.css         # Page style sheet
   │   ├── index.js          # Page logic
   │   ├── index.json        # Page configuration
   │   └── index.html        # Page markup
   └── other               # Other page
       ├── other.css         # Page style sheet
       ├── other.js          # Page logic
       ├── other.json        # Page configuration
       └── other.html        # Page markup
```

## 미니앱 라이프사이클

미니앱은 `App()` 함수를 선언해 반드시 슈퍼앱에 등록되어야 해요.
위에서 살펴본 프로젝트 구조를 참고하면, 이 과정은 `app.js`에서 일어나요.
미니앱의 라이프사이클은 `launch`, `show`, `hide`, 그리고 `error` 이렇게 크게 4개의 이벤트로 나타나요.
이 이벤트의 핸들러들은 `App()` 함수에 Configuration Object 형태로 전달될 수 있어요.
이 객체에는 모든 페이지에 전역적으로 제공될 `globalData`를 포함할 수 있어요.

```js
/* app.js */
App({
  onLaunch(options) {
    // Do something when the app is launched initially.
  },
  onShow(options) {
    // Do something when the app is shown.
  },
  onHide() {
    // Do something when the app is hidden.
  },
  onError(msg) {
    console.log(msg);
  },
  globalData: 'I am global data',
});
```

평소와 같이, 세부 사항은 다르지만, 개념 자체는
[WeChat](https://developers.weixin.qq.com/miniprogram/en/dev/reference/api/App.html),
[Alipay](https://opendocs.alipay.com/mini/framework/app-detail),
[Baidu](https://smartprogram.baidu.com/docs/develop/framework/app_service_register/),
[ByteDance](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/framework/logic-layer/start-app/),
그리고
[Quick App](https://doc.quickapp.cn/tutorial/framework/lifecycle.html#app-%E7%9A%84%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F) 모두 동일해요.

## 페이지 라이프 사이클

앱 라이프 사이클처럼, 페이지 라이프 사이클도 개발자들이 `listen`하고 반응할 수 있는 이벤트들로 구성되어 있어요.
핵심 이벤트들은 `load`, `show`, `ready`, `hide`, 그리고 `unload`예요.
어떤 페이지들은 `pulldownrefresh` 같은 추가적인 이벤트들을 제공하기도 해요.
이런 이벤트 핸들러를 설정하는 것은 각 페이지마다 존재하는 `Page()` 함수를 통해 이루어져요.
위의 프로젝트 구조에서 `index`와 `other` 페이지의 경우 `index.js` 그리고 `other.js`에서 이 과정이 이루어져요.

```js
/* index.js */
Page({
  data: {
    text: 'This is page data.',
  },
  onLoad: function (options) {
    // Do something when the page is initially loaded.
  },
  onShow: function () {
    // Do something when the page is shown.
  },
  onReady: function () {
    // Do something when the page is ready.
  },
  onHide: function () {
    // Do something when the page is hidden.
  },
  onUnload: function () {
    // Do something when the page is closed.
  },
  onPullDownRefresh: function () {
    // Do something when the user pulls down to refresh.
  },
  onReachBottom: function () {
    // Do something when the user scrolls to the bottom.
  },
  onShareAppMessage: function () {
    // Do something when the user shares the page.
  },
  onPageScroll: function () {
    // Do something when the user scrolls the page.
  },
  onResize: function () {
    // Do something when the user resizes the page.
  },
  onTabItemTap(item) {
    // Do something when the user taps the page's tab.
  },
  customData: {
    foo: 'bar',
  },
});
```

## 빌드 과정

빌드 과정은 개발자들이 몰라도 되도록 추상화되어 있어요.
내부적으로는 업계 도구인 [Babel](https://babeljs.io/) 컴파일러를 통해 트랜스파일링 후 압축(Minify)하고, [postcss](https://postcss.org/) CSS 변환기를 통해 앱을 변환해요.
빌드 경험 자체는 개발자들이 (원한다면) 전혀 몰라도 된다는 점에서, [Next.js](https://nextjs.org/)나 [`create-react-app`](https://reactjs.org/docs/create-a-new-react-app.html)와 비슷해요.
결과적으로 생성되는 파일들은 디지털 서명되고 암호화되어 하나의 온전한 패키지(혹은 여러 개의 하위 패키지로 구성된 하나의 패키지)로 빌드되어 슈퍼앱 제공자들의 서버로 전송돼요.
하위 패키지들은 처음부터 모든 패키지를 다운 받지 않아도 되도록 Lazy Loading을 위해서 사용돼요.
패키지에 대한 자세한 내용은 비공개 상태로 자세한 내용은 찾아볼 수 없지만,
WeChat의 `wxapkg` 포맷 등 몇몇 포맷은 [리버스 엔지니어링](https://github.com/sjatsh/unwxapkg)되었어요.

{% Aside 'success' %}
다음으로 [미니앱의 표준화를 위한 노력](/mini-app-standardization/)에 대해서 알아봐요.
{% endAside %}

## 감사의 말

이 글은 [Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
그리고 Keith Gu에 의해 리뷰되었어요.
