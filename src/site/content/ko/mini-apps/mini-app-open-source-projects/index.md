---
layout: post
title: 미니앱 오픈소스 프로젝트
authors:
  - thomassteiner
date: 2021-03-03
# updated: 2021-03-03
description: |
  흥미로운 미니앱 오픈소스 프로젝트에 대해서 알아봐요.
tags:
  - mini-apps
---

{% Aside %}
이 포스트는 글타래의 일부이며, 이전 글들에서 언급한 내용 위에 새로운 내용을 다루는 글이에요.
만약 이 페이지에 막 이르렀다면, [처음](/mini-app-super-apps/)부터 읽어보는 것을 추천해요.
{% endAside %}

## kbone

[kbone](https://wechat-miniprogram.github.io/kbone/docs/) 프로젝트 ([GitHub 오픈소스](https://github.com/Tencent/kbone))는
미니앱을 위한 브라우저 호환 레이어를 만들어서 웹을 위해 작성된 코드가 변경 없이 미니앱으로 동작하는 것을 목표로 해요.
[Vue](https://github.com/wechat-miniprogram/kbone-template-vue),
[React](https://github.com/wechat-miniprogram/kbone-template-react), 그리고
[Preact](https://github.com/wechat-miniprogram/kbone-template-preact)) 등의 템플릿으로 쉽게 시작할 수 있어요.

새 프로젝트는 `kbone-cli` 도구로 시작해요. 생성 마법사가 어떤 프레임워크를 사용할 것인지 물어봐요. 아래는 Preact 데모예요. 아래 코드에서, `mp`
명령어로 미니앱을 빌드하고, `web` 명령어로 웹앱을 빌드하고, `build` 명령어로 Production 웹앱을 빌드할 수 있어요.

```bash
npx kbone-cli init my-app
cd my-app
npm run mp
npm run web
npm run build
```

아래 코드로 간단한 카운터 컴포넌트를 만들어서 동일한 형태로 미니앱과 웹앱으로 만들 수 있어요.
DOM의 구조로 파악할 때, 미니앱의 오버헤드가 상당해요.

```js
import {h, Component} from 'preact';
import './index.css';

class Counter extends Component {
  state = {count: 1};

  sub = () => {
    this.setState((prevState) => {
      return {count: --prevState.count};
    });
  };

  add = () => {
    this.setState((prevState) => {
      return {count: ++prevState.count};
    });
  };

  clickHandle = () => {
    if ('undefined' != typeof wx && wx.getSystemInfoSync) {
      wx.navigateTo({
        url: '../log/index?id=1',
      });
    } else {
      location.href = 'log.html';
    }
  };

  render({}, {count}) {
    return (
      <div>
        <button onClick={this.sub}>-</button>
        <span>{count}</span>
        <button onClick={this.add}>+</button>
        <div onClick={this.clickHandle}>跳转</div>
      </div>
    );
  }
}

export default Counter;
```

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/DDreycxzclMP8IiUplyO.png", alt="The Preact kbone template demo app opened in WeChat DevTools. Inspecting the DOM structure shows a significant overhead compared to the web app.", width="800", height="664" %}
  <figcaption>
   The Preact kbone template demo app opened in WeChat DevTools. Note the complex DOM structure and how the plus and minus buttons are actually not <code>&lt;button&gt;</code> elements.
  </figcaption>
</figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rerYiCnwc92DP7pM7WPc.png", alt="The Preact kbone template demo app opened in the web browser. Inspecting the DOM structure shows the to-be-expected markup based on the Preact component code.", width="800", height="496" %}
  <figcaption>
   The Preact kbone template demo app opened in the web browser. Note the DOM structure.
  </figcaption>
</figure>

## kbone-ui

[kbone-ui](https://wechat-miniprogram.github.io/kbone/docs/ui/intro/) 프로젝트 ([GitHub 오픈소스](https://github.com/wechat-miniprogram/kbone-ui))
는 Vue.js와 미니앱으로 동시에 개발할 수 있는 UI 프레임워크예요.
kbone-ui 컴포넌트는 [WeChat의 내장 미니앱 컴포넌트](https://developers.weixin.qq.com/miniprogram/dev/component/)
([Components](/mini-app-components/) 참고)와 유사해요.
[데모](https://wechat-miniprogram.github.io/kboneui/ui/#/)를 확인해서 사용할 수 있는 컴포넌트를 확인해보세요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wEA4Hr2JyVfKgdHnpb5o.png", alt="Demo of the kbone-ui framework showing form-related components like radio buttons, switches, inputs, and labels.", width="320", height="438" %}
  <figcaption>
   The kbone-ui demo showing form-related components.
  </figcaption>
</figure>

## WeUI

[WeUI](https://github.com/Tencent/weui)는 WeChat의 시각적 경험과 동일하게 구성된 기본적인 스타일 라이브러리예요.
WeChat 공식 팀에서 WeChat의 웹페이지와 미니앱의 경험을 동일하게 만들기 위해 디자인을 다듬었어요.
`button`, `cell`, `dialog`, `progress`, `toast`, `article`, `actionsheet`, 그리고 `icon` 등의 컴포넌트를 제공해요.

또한 서로 다른 WeUI 버번들이 존재해요.

WXSS로 스타일링되는 WeChat 미니앱을 위한 [weui-wxss](https://github.com/Tencent/weui-wxss/)도 있고
([스타일링](/mini-app-markup-styling-and-scripting/#-6) 참고),

웹앱을 위한 [weui.js](https://github.com/weui/weui.js/),
WeChat 리액트 컴포넌트를 위한 [react-weui](https://github.com/weui/react-weui/)도 있어요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/V0xswCD3MJltrxALmy8n.png", alt="Demo of the WeUI framework showing form-related components, namely switches.", width="450", height="395" %}
  <figcaption>
    스위치를 보여주는 WeChat 데모 앱
  </figcaption>
</figure>

## Omi

[Omi](https://tencent.github.io/omi/)는 크로스 프레임워크를 지향하는 프론트엔드 프레임워크예요.
([GitHub 오픈소스](https://github.com/Tencent/omi).
웹 컴포넌트, JSX, 버추얼 돔, 함수형 수타일, 옵저버와 프록시를 하나의 프레임워크로 모아 적은 용량으로 고성능을 내요.
이 프레임워크의 목표는 개발자들이 하나의 컴포넌트를 Omi, React, Preact,
Vue.js, Angular 같은 여러 플랫폼에서 사용할 수 있게 하는거예요.
Omi 컴포넌트를 작성하는 것은 직관적이고 어떤 보일러플레이트도 필요 없어요.

```js
import {render, WeElement, define} from 'omi';

define(
  'my-counter',
  class extends WeElement {
    data = {
      count: 1,
    };

    static css = `
    span{
        color: red;
    }`;

    sub = () => {
      this.data.count--;
      this.update();
    };

    add = () => {
      this.data.count++;
      this.update();
    };

    render() {
      return (
        <div>
          <button onClick={this.sub}>-</button>
          <span>{this.data.count}</span>
          <button onClick={this.add}>+</button>
        </div>
      );
    }
  },
);

render(<my-counter />, 'body');
```

## Omiu

[Omiu](https://tencent.github.io/omi/components/docs/)는 Omi에 기반한 크로스 프레임워크 UI 컴포넌트 라이브러리예요.
([GitHub 오픈소스](https://github.com/Tencent/omi#omiu)). 일반적인 웹 컴포넌트의 커스텀된 엘리먼트들을 생성해요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eoNhik827CE4TfaT9ZaV.png", alt="Demo of the Omiu framework showing form-related components, namely switches.", width="800", height="939" %}
  <figcaption>
   Omiu 데모 앱의 스위치.
  </figcaption>
</figure>

## WePY

[WePY](https://wepyjs.github.io/wepy-docs/)는 미니앱들을 컴포넌트로 분리하여 개발할 수 있는 프레임워크예요.
선-컴파일(Pre-compilation)을 통해 개발자들은 자신이 선호하는 개발 스타일로 미니앱을 개발할 수 있어요.
WePY 프레임워크의 구체적인 최적화와 Promise와 비동기 함수들의 도입은 미니앱 개발을 훨씬 쉽고 효율적으로 만들었어요.
동시에, WePY는 성장하고 있는 프레임워크로, Vue.js를 비롯한 최적화된 프론트엔드 도구에서 디자인 콘셉트 등을 차용했어요.

```html
<style lang="less">
  @color: #4d926f;
  .num {
    color: @color;
  }
</style>

<template>
  <div class="container">
    <div class="num" @tap="num++">{% raw %}{{num}}{% endraw %}</div>
    <custom-component></custom-component>
    <vendor-component></vendor-component>
    <div>{% raw %}{{text}}{% endraw %}</div>
    <input v-model="text" />
  </div>
</template>

<config>
  { usingComponents: { customComponent: '@/components/customComponent',
  vendorComponent: 'module:vendorComponent' } }
</config>

<script>
  import wepy from '@wepy/core';

  wepy.page({
    data: {
      num: 0,
      text: 'Hello World',
    },
  });
</script>
```

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ooxZuXzVY9aHXmha36vM.png", alt="WePY 'getting started' documentation page showing the first steps to get going.", width="800", height="505" %}
  <figcaption>
   WePY "getting started" documentation.
  </figcaption>
</figure>

## vConsole

[vConsole](https://github.com/Tencent/vConsole) 프로젝트는 모바일 웹페이지를 위한 가볍고 확장성 있는 프론트엔드 개발자 도구예요.
디버거와 같은 개발자 도구를 미니앱에 곧바로 주입할 수 있어요.
[데모](http://wechatfe.github.io/vconsole/demo.html)를 통해 가능성을 확인하세요.
vConsole은 로그, 시스템, 네트워크, 구성 요소, 그리고 저장소 등의 탭을 제공해요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ow6FfaoI7fMCJDN1819t.png", alt="vConsole demo app. The vConsole opens at the bottom and has tabs for logs, system, network, elements, and storage.", width="800", height="505" %}
  <figcaption>
  구성 요소 익스플로러를 보여주는 vConsole 데모 앱.
  </figcaption>
</figure>

## weweb

[weweb](https://weidian-inc.github.io/hera/#/) 프로젝트([GitHub 오픈소스](https://github.com/wdfe/weweb))는
"WeChat와 호환 가능하다"는 [Hera](https://weidian-inc.github.io/hera/#/) 미니앱 프레임워크의 프론트엔드 프레임워크예요.
이를 통해 미니앱의 방식으로 웹앱을 프로그래밍할 수 있어요.
문서에서 언급된 바에 따르면, 미니앱이 있을 경우 이를 곧바로 브라우저에서 실행할 수 있다고 해요.
제 실험에 따르면 현재 존재하는 미니앱들에는 안정적으로 동작하지 않았는데, 아마도 프로젝트가 최근의 WeChat 업데이트를 반영하지 않아서 그런 듯 해요.

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jU9Od9IDqFlmuYzAtirn.png", alt="Documentation of the Hera mini app framework listing the WeChat APIs that it supports like `wx.request`, `wx.uploadFile`, etc.", width="800", height="505" %}
  <figcaption>

지원되는 WeChat API를 보여주는 Hera 미니앱 프레임워크 문서.

  </figcaption>
</figure>

<figure>
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/C7ZpPrFE4geW0dylRpZ2.png", alt="The weweb demo mini app compiled with weweb to run in the browser showing form elements.", width="300", height="429" %}
  <figcaption>
    브라우저에서 구동되기 위해 weweb으로 컴파일된 weweb 데모 미니앱의 모습.
  </figcaption>
</figure>

{% Aside 'success' %}
다음으로 [미니앱처럼 프로그래밍하는 방법](/mini-app-programming-way/)에 대해서 알아봐요.
{% endAside %}

## 감사의 말

이 글은 [Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
그리고 Keith Gu에 의해 리뷰되었어요.
