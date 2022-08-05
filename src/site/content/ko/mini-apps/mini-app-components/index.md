---
layout: post
title: 미니앱 컴포넌트
authors:
  - thomassteiner
date: 2021-03-03
updated: 2021-03-17
description: |
  모든 미니앱 플랫폼에서 제공되는 컴포넌트들의 정보에 대해서 알아봐요.
tags:
  - mini-apps
---

{% Aside %}
이 포스트는 글타래의 일부이며, 이전 글들에서 언급한 내용 위에 새로운 내용을 다루는 글이에요.
만약 이 페이지에 막 이르렀다면, [처음](/mini-app-super-apps/)부터 읽어보는 것을 추천해요.
{% endAside %}

## 웹 컴포넌트

[웹 컴포넌트](https://developer.mozilla.org/docs/Web/Web_Components/)는 개발자들이 조각들을 조립하여 멋진 앱을 만들 수 있다는 약속에서 시작됐어요.
그런 Atomic Component의 예시로 GitHub의 [time-elements](https://github.com/github/time-elements), Stefan
Judis의 [web-vitals-element](https://github.com/stefanjudis/web-vitals-element) 그리고 Google의 [dark mode toggle](https://github.com/GoogleChromeLabs/dark-mode-toggle/) 등이 있어요.
하지만 어떤 온전한 디자인 시스템의 경우 사람들은 하나의 제조사의 일관적인 세트에 더 의존해요.
몇몇 예시로 SAP의
[UI5 Web Components](https://sap.github.io/ui5-webcomponents/),
[Polymer Elements](https://www.webcomponents.org/author/PolymerElements),
[Vaadin's elements](https://www.webcomponents.org/author/vaadin), 마이크로소프트의
[FAST](https://github.com/microsoft/fast),
[Material Web Components](https://github.com/material-components/material-components-web-components),
[AMP components](https://amp.dev/documentation/components/)를 비롯해 수많은 제조사들의 디자인이 있어요.

이 글에서 다루기엔 너무 복잡한 수많은 이유로, 개발자들은 [React](https://reactjs.org/), [Vue.js](https://vuejs.org/),
[Ember.js](https://emberjs.com/)등으로 완전히 이주하기도 했어요.

개발자들에게 이런 선택지를 주는 대신 (또는, 관점에 따라 특정한 기술적 결정을 내려야만 하도록 강요하는 대신) 슈퍼앱 제조사들은 개발자들이 반드시 사용해야하는 통일된 컴포넌트 세트를 제공해요.

## 미니앱의 컴포넌트

이 컴포넌트들은 위에 언급한 컴포넌트 라이브러리와 비슷하다고 생각하면 돼요.
컴포넌트에 어떤 것들이 있는지 확인하려면
[WeChat의 컴포넌트 라이브러리](https://developers.weixin.qq.com/miniprogram/en/dev/component/),
[ByteDance의 컴포넌트](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/component/all),
[Alipay의 컴포넌트](https://opendocs.alipay.com/mini/component),
[Baidu의 컴포넌트](https://smartprogram.baidu.com/docs/develop/component/component/), 또는
[QuickApp 컴포넌트를](https://doc.quickapp.cn/widgets/common-events.html) 확인해보세요.

앞서 몇몇 컴포넌트들은 [기반 레벨에서 웹 기술로 동작한다](/mini-app-devtools/#custom-elements-under-the-hood)는 것을 보여드렸어요.
예를 들어, WeChat의 `<image>`는 웹 기술로 구현되어 있어요.
하지만 모든 컴포넌트가 웹 기술로 구현된 것은 아니에요.
`<map>` 또는 `<video>` 등의 태그들은 [OS에 내장된 컴포넌트](https://developers.weixin.qq.com/ebook?action=get_post_info&docid=000caab39b88b06b00863ab085b80a)로
웹뷰 위에서 렌더링돼요.
어떤 식으로 구현되었는지 자세하게 공개된 바는 없지만, 다른 컴포넌트처럼 프로그램되어 있어요.

여느 때와 같이, 사소한 디테일은 다르지만 모든 슈퍼앱들은 공통된 프로그래밍 철학을 가지고 있어요.
가장 중요한 것은 [마크업 언어](/mini-app-markup-styling-and-scripting/#markup-languages)에서 설명한 것처럼 데이터 바인딩이에요.
컴포넌트들은 주로 기능 단위로 구분되어 있으므로 필요한 컴포넌트를 찾는 것은 어렵지 않아요.
아래는 Alipay의 분류이지만 다른 제조사들도 비슷해요.

- View 컨테이너
  - `view`
  - `swiper`
  - `scroll-view`
  - `cover-view`
  - `cover-image`
  - `movable-view`
  - `movable-area`
- 기본 콘텐츠
  - `text`
  - `icon`
  - `progress`
  - `rich-text`
- Form 요소
  - `button`
  - `form`
  - `label`
  - `input`
  - `textarea`
  - `radio`
  - `radio-group`
  - `checkbox`
  - `checkbox-group`
  - `switch`
  - `slider`
  - `picker-view`
  - `picker`
- 내비게이션
  - `navigator`
- 미디어 컴포넌트
  - `image`
  - `video`
- 캔버스
  - `canvas`
- 지도
  - `map`
- 오픈 컴포넌트
  - `web-view`
  - `lifestyle`
  - `contact-button`
- 접근성
  - `aria-component`

아래는 Alipay의 [`<image>`](https://opendocs.alipay.com/mini/component/image)로`a:for` directive([리스트 렌더링](/mini-app-markup-styling-and-scripting/#list-rendering) 참고)를 사용하는 예시예요.
`index.js`에서 이미지 데이터 배열을 받아서 배열을 순회해요.

```js
/* index.js */
Page({
  data: {
    array: [
      {
        mode: 'scaleToFill',
        text: 'scaleToFill',
      },
      {
        mode: 'aspectFit',
        text: 'aspectFit',
      },
    ],
    src: 'https://images.example.com/sample.png',
  },
  imageError(e) {
    console.log('image', e.detail.errMsg);
  },
  onTap(e) {
    console.log('image tap', e);
  },
  imageLoad(e) {
    console.log('image', e);
  },
});
```

```html
<!-- index.axml -->
<view class="page">
  <view
    class="page-section"
    a:for="{% raw %}{{array}}{% endraw %}"
    a:for-item="item"
  >
    <view class="page-section-demo" onTap="onTap">
      <image
        class="image"
        mode="{% raw %}{{item.mode}}{% endraw %}"
        onTap="onTap"
        onError="imageError"
        onLoad="imageLoad"
        src="{% raw %}{{src}}{% endraw %}"
        lazy-load="true"
        default-source="https://images.example.com/loading.png"
      />
    </view>
  </view>
</view>
```

`item.mode`는 `mode` 속성으로, `src`는 `src` 속성으로, 그리고 3개의 이벤트 핸들러 `onTap`, `onError`, 그리고 `onLoad`는 동명의 함수로 데이터 바인딩이 된다는 점을 참고하세요.
[이전](/mini-app-devtools/#custom-elements-under-the-hood)에 보았듯이, `<image>` 태그는 내부적으로 `<div>`로 변환되며
이미지의 해상도, (선택) Lazy Loading, 기본 소스 등의 정보를 가지고 있어요.

가능한 세부 옵션들은 [문서](https://opendocs.alipay.com/mini/component/image)에 나와있어요.
문서에 내장된 [컴포넌트 미리보기 시뮬레이터](https://herbox-embed.alipay.com/s/doc-image?chInfo=openhome-doc&theme=light)를 통해 코드를 보다 쉽게 이해할 수 있어요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/t2Y6WWsRhp6LjThxROUo.png", alt="Alipay component documentation with embedded component preview, showing a code editor with simulator that shows the component rendered on a simulated iPhone 6.", width="800", height="510" %}
  <figcaption>
    Alipay 컴포넌트 문서와 포함된 컴포넌트 미리보기 시뮬레이터.
  </figcaption>
</figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xu2F51XL9Z0M3Z9n6n2O.png", alt="Alipay component preview running in a separate browser tab showing a code editor with simulator that shows the component rendered on a simulated iPhone 6.", width="800", height="514" %}
  <figcaption>
    Alipay 컴포넌트 미리보기 창이 새로운 탭으로 분리된 모습.
  </figcaption>
</figure>

각각의 컴포넌트는 독자적인 QR 코드를 가지고 있어서 Alipay 앱으로 스캔하여 컴포넌트를 예시를 통해 확인할 수 있어요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gaWqLG5GqeqqfbhWz8D1.png", alt="Alipay's `image` component previewed on a real device after scanning a QR code in the documentation.", width="300", height="649" %}
  <figcaption>
    Alipay <code>&lt;image&gt;</code> 컴포넌트를 <a href="https://qr.alipay.com/s6x01278ucjhjyknjd5ow53">QR 코드 링크</a>를 통해 미리보는 모습.
  </figcaption>
</figure>

개발자들은 문서에서 URI scheme `antdevtool-tiny://`를 통해 Alipay 개발자 도구 IDE로 바로 건너갈 수 있어요.
개발자들은 이를 통해 자신의 프로젝트로 컴포넌트를 바로 불러올 수 있어요.

## 커스텀 컴포넌트

제조사에서 제공하는 컴포넌트 외에도 다양한 커스텀 컴포넌트를 만들 수 있어요.
이런 개념은
[WeChat](https://developers.weixin.qq.com/miniprogram/en/dev/framework/custom-component/),
[ByteDance](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/guide/custom-component/custom-component),
[Alipay](https://opendocs.alipay.com/mini/framework/component_configuration),
[Baidu](https://smartprogram.baidu.com/docs/develop/framework/custom-component/), 그리고
[QuickApp](https://doc.quickapp.cn/tutorial/framework/parent-child-component-communication.html#%E7%BB%84%E4%BB%B6%E8%87%AA%E5%AE%9A%E4%B9%89)에도 존재해요.

예를 들어, Baidu의 커스텀 컴포넌트는 `custom.swan`, `custom.css`, `custom.js`, 그리고 `custom.json` 4개의 파일을 동일한 폴더에 작성함으로써 만들 수 있어요.

`custom.json` 파일은 폴더에 있는 자료들이 커스텀 컴포넌트임을 나타내요.

```json
{
  "component": true
}
```

`custom.swan`은 마크업을, `custom.css`는 CSS를 나타내요.

```html
<view class="name" bindtap="tap"
  >{% raw %}{{name}}{% endraw %} {% raw %}{{age}}{% endraw %}</view
>
```

```css
.name {
  color: red;
}
```

그리고 `custom.js`는 로직을 담당해요. 컴포넌트의 라이프사이클 함수로는 `attached()`, `detached()`, `created()`, 그리고 `ready()` 등이 있어요.
컴포넌트는 또한 `show()` 그리고 `hide()` 등의 [페이지 라이프 사이클](/mini-app-project-structure-lifecycle-and-bundling/#mini-app-lifecycle) 이벤트에도 반응할 수 있어요.

```js
Component({
  properties: {
    name: {
      type: String,
      value: 'swan',
    },
  },
  data: {
    age: 1,
  },
  methods: {
    tap: function () {},
  },
  lifetimes: {
    attached: function () {},
    detached: function () {},
    created: function () {},
    ready: function () {},
  },
  pageLifetimes: {
    show: function () {},
    hide: function () {},
  },
});
```

커스텀 컴포넌트는 `index.json`으로 불러올 수 있어요.그리고 `import`의 `key`로 `index.swan`에서 사용할 컴포넌트의 이름을 지정할 수 있어요.
여기에서는 이름은 `"custom"`이에요.

```json
{
  "usingComponents": {
    "custom": "/components/custom/custom"
  }
}
```

```html
<view>
  <custom name="swanapp"></custom>
</view>
```

{% Aside 'success' %}
다음으로 미니앱의 [프로젝트 구조, 라이프 사이클, 그리고 번들링](/mini-app-project-structure-lifecycle-and-bundling/)에 대해서 알아볼거예요.
{% endAside %}

## Acknowledgements

This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
and Keith Gu.
