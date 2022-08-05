---
layout: post
title: 미니앱 마크업, 스타일링, 그리고 스크립팅
authors:
  - thomassteiner
date: 2021-03-03
# updated: 2021-03-03
description: |
  다양한 미니앱 플랫폼에서 마크업, 스타일링, 그리고 스크립팅 옵션들을 알아봐요.
tags:
  - mini-apps
---

{% Aside %}
  이 포스트는 글타래의 일부이며, 이전 글들에서 언급한 내용 위에 새로운 내용을 다루는 글이에요.
  만약 이 페이지에 막 이르렀다면, [처음](/mini-app-super-apps/)부터 읽어보는 것을 추천해요.
{% endAside %}

## 마크업 언어

전에 이야기한 것처럼 미니앱은 순수 HTML이 아닌 HTML의 방언을 사용해요.
[Vue.js](https://vuejs.org/)의 Text Interpolation과 Directive를 사용해본 경험이 있다면 익숙하겠지만,
비슷한 개념들이 XML Transformations ([XSLT](https://www.w3.org/TR/xslt-30/)) 등의 형태로 존재했었어요.
아래는 WeChat의 [WXML](https://developers.weixin.qq.com/miniprogram/en/dev/framework/view/wxml/)의 코드 예제들이에요.
하지만 개념 자체는 Alipay의 [AXML](https://opendocs.alipay.com/mini/framework/axml), Baidu의 [Swan Element](https://smartprogram.baidu.com/docs/develop/framework/dev/), ByteDance의 [TTML](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/guide/mini-app-framework/view/ttml), (개발자 도구에서는 Bxml이라고 불리지만요), 그리고 QuickApp의 [HTML](https://doc.quickapp.cn/tutorial/framework/for.html) 등 모든 미니앱 플랫폼들이 비슷해요.
Vue.js처럼, 미니앱의 기반 프로그래밍 콘셉트는 [model-view-viewmodel](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) (MVVM)이에요.

### 데이터 바인딩

데이터 바인딩은 Vue.js의 [Text Interpolation](https://vuejs.org/v2/guide/syntax.html#Text)과 비슷해요.

```html
<!-- wxml -->
<view>{% raw %}{{message}}{% endraw %}</view>
```

```js
// page.js
Page({
  data: {
    message: "Hello World!",
  },
});
```

### 리스트 렌더링

리스트 렌더링은 Vue.js의 [`v-for` directive](https://vuejs.org/v2/guide/list.html)와 비슷해요.

```html
<!-- wxml -->
<view wx:for="{% raw %}{{array}}{% endraw %}">{% raw %}{{item}}{% endraw %}</view>
```

```js
// page.js
Page({
  data: {
    array: [1, 2, 3, 4, 5],
  },
});
```

### 조건부 렌더링

조건부 렌더링은 Vue.js의 [`v-if` directive](https://vuejs.org/v2/guide/conditional.html)와 비슷해요.

```html
<!-- wxml -->
<view wx:if="{% raw %}{{view == 'one'}}{% endraw %}">One</view>
<view wx:elif="{% raw %}{{view == 'two'}}{% endraw %}">Two</view>
<view wx:else="{% raw %}{{view == 'three'}}{% endraw %}">Three</view>
```

```js
// page.js
Page({
  data: {
    view: "three",
  },
});
```

### 템플릿

[HTML 템플릿의 `content` 복제](https://developer.mozilla.org/docs/Web/API/HTMLTemplateElement/content)를 의무화하는 것이 아니라, WXML 템플릿들은 템플릿 정의와 링크된 `is` 속성을 통해 선언적으로 사용될 수 있어요.

```html
<!-- wxml -->
<template name="person">
  <view>
    First Name: {% raw %}{{firstName}}{% endraw %}, Last Name: {% raw %}{{lastName}}{% endraw %}
  </view>
</template>
```

```html
<template is="person" data="{% raw %}{{...personA}}{% endraw %}"></template>
<template is="person" data="{% raw %}{{...personB}}{% endraw %}"></template>
<template is="person" data="{% raw %}{{...personC}}{% endraw %}"></template>
```

```js
// page.js
Page({
  data: {
    personA: { firstName: "Alice", lastName: "Foo" },
    personB: { firstName: "Bob", lastName: "Bar" },
    personC: { firstName: "Charly", lastName: "Baz" },
  },
});
```

## 스타일링

스타일링도 CSS의 방언으로 할 수 있어요. WeChat은 이름을 [WXSS](https://developers.weixin.qq.com/miniprogram/en/dev/framework/quickstart/code.html#WXSS-Style)라고 해요.
Alipay의 경우 [ACSS](https://opendocs.alipay.com/mini/framework/acss)라고 하고, Baidu는 직관적으로 [CSS](https://smartprogram.baidu.com/docs/develop/framework/view_css/)라고 하고 ByteDance 방언은 [TTSS](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/guide/mini-app-framework/view/ttss)라고 해요.
이들의 공통점은 CSS를 반응형 픽셀 단위로 확장한다는거예요.
일반적인 CSS로 작성할 경우, 개발자는 모든 픽셀 단위를 서로 다른 화면 비율과 픽셀 비율에 맞춰 변환해야 해요.
TTSS의 경우 `rpx` 단위를 지원해, 화면 크기를 `750rpx`로 잡아서 미니앱에서 그 모든 변환을 담당해요.
예를 들어, Pixel 3a 휴대전화의 경우는 화면 폭이 `393px`이며, 화면비는 `2.75`예요.
즉, 반응형 `200rpx`는 `104px`이 돼요. 개발자 도구를 통해서 393px / 750rpx \* 200rpx ≈ 104px임을 확인할 수 있어요.
안드로이드에서는 동일한 개념을 [density-independent pixel](https://developer.android.com/training/multiscreen/screendensities#TaskUseDP)이라고 해요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/n26ptkMoSfiTDanfFh5F.png", alt="Inspecting a view with Chrome DevTools whose responsive pixel padding was specified with `200rpx` shows that it is actually `104px` on a Pixel 3a device.", width="800", height="385" %}
  <figcaption>
    Pixel 3a 기기에서 실제 패딩 크기를 개발자 도구로 분석하는 모습.
  </figcaption>
</figure>

```css
/* app.wxss */
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0; /* ← responsive pixels */
  box-sizing: border-box;
}
```

컴포넌트들이 Shadow DOM을 사용하기 않기 때문에, 한 페이지 내에서 선언된 스타일은 모든 컴포넌트에 적용돼요.
대부분 글로벌 스타일을 담당하는 Root Stylesheet이 하나 존재하고, 각 페이지마다 Stylesheet가 별도로 존재해요.
스타일은 `@import` 구문을 통해서 불러올 수 있어요 (마치 웹 CSS의 [`@import`](https://developer.mozilla.org/docs/Web/CSS/@import)처럼요).
HTML처럼 스타일은 in-line으로 선언될 수도 있고, 데이터 바인딩을 통한 동적 Text Interpolation으로도 적용할 수 있어요.

```html
<view style="color:{% raw %}{{color}}{% endraw %};" />
```

## 스크립팅

미니앱은 JavaScript의 "안전한 부분집합"과 [CommonJS](http://www.commonjs.org/) 또는 [RequireJS](https://requirejs.org/)와 유사한 모듈 시스템을 지원해요.
JavaScript 코드는 `eval()` 등으로 실행될 수 없고 어떤 함수도 `new Function()`을 통해서 생성될 수 없어요.
실행 환경은 기기에서는 [V8](https://v8.dev/)이나 [JavaScriptCore](https://developer.apple.com/documentation/javascriptcore)이고,
시뮬레이터에서는 V8 또는 [NW.js](https://nwjs.io/)이에요
대부분 IDE에서 트랜스파일링을 지원하기 때문에 빌드 타겟이 오래된 WebView 구현일지라도 ES6 등의 새로운 문법을 사용하는 것도 가능해요. ([추가 정보](/mini-app-project-structure-lifecycle-and-bundling/#the-build-process))
슈퍼앱의 개발자 문서에는 스크립팅 언어들이 JavaScript가 아니라고 명시하고 있어요.
하지만 이 이야기는 거의 모듈 시스템에 대해서만 해당되는 이야기예요.
그 말은, 미니앱은 아직 표준 [ES Modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules)을 지원하지 않아요.

[이전에](/mini-app-markup-styling-and-scripting/#markup-languages) 언급한 것처럼 미니앱의 프로그래밍 콘셉트는 
[model-view-viewmodel](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) (MVVM)이에요.
논리 계층(Logic Layer)과 화면 계층(View Layer)는 서로 다른 쓰레드에서 동작해요.
덕분에 계산에 오래 걸리는 작업 중에서 사용자 화면은 멈추지 않아요.
웹으로 비유하자면, 스크립트들이 [Web Worker](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers) 상에서 돌아가는거예요.

WeChat의 스크립팅 언어는
[WXS](https://developers.weixin.qq.com/miniprogram/en/dev/reference/wxs/)라고 하고, Alipay는
[SJS](https://opendocs.alipay.com/mini/framework/sjs), ByteDance 또한
[SJS](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/framework/sjs-syntax-reference/sjs-introduction/)이라고 해요.


Baidu는 자신의 언어를 [JS](https://smartprogram.baidu.com/docs/develop/framework/devjs/)라고 해요.
이 스크립트들은 실행되기 위해서는 특수한 태그가 포함되어야 해요. 예를 들어 WeChat의 경우는 `<wxs>`가 포함되어야 해요.
이에 대비해서 QuickApp은 표준 `<script>` 태그와 ES6 [JS](https://doc.quickapp.cn/framework/script.html) 문법을 사용해요.

```html
<wxs module="m1">
  var msg = "hello world";
  module.exports.message = msg;
</wxs>

<view>{% raw %}{{m1.message}}{% endraw %}</view>
```

모듈은 `src` 요소나 `require()`을 통해서도 불러올 수 있어요.

```js
// /pages/tools.wxs
var foo = "'hello world' from tools.wxs";
var bar = function (d) {
  return d;
};
module.exports = {
  FOO: foo,
  bar: bar,
};
module.exports.msg = "some msg";
```

```html
<!-- page/index/index.wxml -->
<wxs src="./../tools.wxs" module="tools" />
<view>{% raw %}{{tools.msg}}{% endraw %}</view>
<view>{% raw %}{{tools.bar(tools.FOO)}}{% endraw %}</view>
```

```js
// /pages/logic.wxs
var tools = require("./tools.wxs");

console.log(tools.FOO);
console.log(tools.bar("logic.wxs"));
console.log(tools.msg);
```

### JavaScript 브릿지 API

JavaScript 브릿지는 미니앱들을 강력한 기기 기능들을 사용할 수 있도록 해요. ([강력한 기능에 접근](/mini-app-about/#access-to-powerful-features) 참고)
그 외에도 여러 편리한 기능들을 제공해요.
이에 대한 개략적인 이해를 위해
[WeChat](https://developers.weixin.qq.com/miniprogram/en/dev/api/),
[Alipay](https://opendocs.alipay.com/mini/api),
[Baidu](https://smartprogram.baidu.com/docs/develop/api/apilist/),
[ByteDance](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/api/foundation/tt-can-i-use),
그리고 [Quick App](https://doc.quickapp.cn/features/) 등
서로 다른 API들을 확인해보세요.


기능 감지 또한 아주 직관적이에요. 모든 플랫폼에서 말 그대로 `canIUse()` 함수를 지원하기 때문이에요.
아마도 웹사이트 [caniuse.com](https://caniuse.com/)에서 영감을 받은 것 같아요.
예를 들어, ByteDance의 [`tt.canIUse()`](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/api/foundation/tt-can-i-use)
은 API, 함수, 인자, 옵션, 컴포넌트, 그리고 속성 등을 검사할 수 있도록 해요.

```js
// Testing if the `<swiper>` component is supported.
tt.canIUse("swiper");
// Testing if a particular field is supported.
tt.canIUse("request.success.data");
```

{% Aside 'success' %}
  다음 글에서는 [미니 앱 컴포넌트](/mini-app-components/)에 대해서 알아볼거예요.
{% endAside %}

## Acknowledgements

This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
and Keith Gu.
