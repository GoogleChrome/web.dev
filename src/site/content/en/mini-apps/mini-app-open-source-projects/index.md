---
layout: post
title: Mini app open source projects
authors:
  - thomassteiner
date: 2021-03-03
# updated: 2021-03-03
description: |
  This chapter presents a selection of interesting mini app open source projects.
tags:
  - mini-apps
---

{% Aside %}
  This post is part of an article collection where each article builds upon previous articles.
  If you just landed here, you may want to start reading from the [beginning](/mini-app-super-apps/).
{% endAside %}

## kbone

The [kbone](https://wechat-miniprogram.github.io/kbone/docs/) project
([open source on GitHub](https://github.com/Tencent/kbone)) implements an adapter that simulates a
browser environment in the adaptation layer, so that code written for the web can run without
changes in a mini app. Several starter templates (among them
[Vue](https://github.com/wechat-miniprogram/kbone-template-vue),
[React](https://github.com/wechat-miniprogram/kbone-template-react), and
[Preact](https://github.com/wechat-miniprogram/kbone-template-preact)) exist that make the
onboarding experience for web developers coming from these frameworks easier.

A new project can be created with the `kbone-cli` tool. A wizard asks what framework to initiate the
project with. The code snippet below shows the Preact demo. In the code snippet below, the `mp`
command builds the mini app, the `web` command builds the web app, and `build` creates the
production web app.

```bash
npx kbone-cli init my-app
cd my-app
npm run mp
npm run web
npm run build
```

The code snippet below shows a simple counter component that then gets isomorphically rendered in a
mini app and a web app. The overhead of the mini app is significant, purely judging from the DOM
structure.

```js
import { h, Component } from "preact";
import "./index.css";

class Counter extends Component {
  state = { count: 1 };

  sub = () => {
    this.setState((prevState) => {
      return { count: --prevState.count };
    });
  };

  add = () => {
    this.setState((prevState) => {
      return { count: ++prevState.count };
    });
  };

  clickHandle = () => {
    if ("undefined" != typeof wx && wx.getSystemInfoSync) {
      wx.navigateTo({
        url: "../log/index?id=1",
      });
    } else {
      location.href = "log.html";
    }
  };

  render({}, { count }) {
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

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/DDreycxzclMP8IiUplyO.png", alt="The Preact kbone template demo app opened in WeChat DevTools. Inspecting the DOM structure shows a significant overhead compared to the web app.", width="800", height="664" %}
  <figcaption class="w-figure">
   The Preact kbone template demo app opened in WeChat DevTools. Note the complex DOM structure and how the plus and minus buttons are actually not <code>&lt;button&gt;</code> elements.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/rerYiCnwc92DP7pM7WPc.png", alt="The Preact kbone template demo app opened in the web browser. Inspecting the DOM structure shows the to-be-expected markup based on the Preact component code.", width="800", height="496" %}
  <figcaption class="w-figure">
   The Preact kbone template demo app opened in the web browser. Note the DOM structure.
  </figcaption>
</figure>

## kbone-ui

The [kbone-ui](https://wechat-miniprogram.github.io/kbone/docs/ui/intro/) project
([open source on GitHub](https://github.com/wechat-miniprogram/kbone-ui)) is a UI framework that
facilitates both mini app development as well as Vue.js development with kbone. The kbone-ui
components emulate the look and feel of
[WeChat's built-in mini app components](https://developers.weixin.qq.com/miniprogram/dev/component/)
(also see [Components](/mini-app-components/) above). A
[demo](https://wechat-miniprogram.github.io/kboneui/ui/#/) that runs directly in the browser lets
you explore the available components.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wEA4Hr2JyVfKgdHnpb5o.png", alt="Demo of the kbone-ui framework showing form-related components like radio buttons, switches, inputs, and labels.", width="320", height="438" %}
  <figcaption class="w-figure">
   The kbone-ui demo showing form-related components.
  </figcaption>
</figure>

## WeUI

[WeUI](https://github.com/Tencent/weui) is a set of basic style libraries consistent with WeChat's
default visual experience. The official WeChat design team has tailored designs for WeChat internal
web pages and WeChat mini apps to make users' perception of use more uniform. It includes components
such as `button`, `cell`, `dialog`, `progress`, `toast`, `article`, `actionsheet`, and `icon`. There
are different versions of WeUI available like [weui-wxss](https://github.com/Tencent/weui-wxss/) for
WeChat mini apps styled with WXSS (see [Styling](/mini-app-markup-styling-and-scripting/#styling) above),
[weui.js](https://github.com/weui/weui.js/) for web apps, and
[react-weui](https://github.com/weui/react-weui/) for WeChat React components.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/V0xswCD3MJltrxALmy8n.png", alt="Demo of the WeUI framework showing form-related components, namely switches.", width="450", height="395" %}
  <figcaption class="w-figure">
   The WeUI demo app showing switches.
  </figcaption>
</figure>

## Omi

[Omi](https://tencent.github.io/omi/) is a self-proclaimed frontend cross-frameworks framework
([open source on GitHub](https://github.com/Tencent/omi). It merges Web Components, JSX, Virtual
DOM, functional style, observer or Proxy into one framework with tiny size and high performance. Its
aim is to let developers write components once and use them everywhere, such as Omi, React, Preact,
Vue.js, or Angular. Writing Omi components is very intuitive and free of almost all boilerplate.

```js
import { render, WeElement, define } from "omi";

define("my-counter", class extends WeElement {
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
});

render(<my-counter />, "body");
```

## Omiu

[Omiu](https://tencent.github.io/omi/components/docs/) is a cross framework UI component library
([open source on GitHub](https://github.com/Tencent/omi#omiu)) developed based on Omi, which outputs
custom elements of standard web components.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/eoNhik827CE4TfaT9ZaV.png", alt="Demo of the Omiu framework showing form-related components, namely switches.", width="800", height="939" %}
  <figcaption class="w-figure">
   The Omiu demo app showing switches.
  </figcaption>
</figure>

## WePY

[WePY](https://wepyjs.github.io/wepy-docs/) is a framework that allows mini apps to support
componentized development. Through pre-compilation, developers can choose their favorite development
style to develop mini apps. The detailed optimization of the framework and the introduction of
Promises and async functions all make the development of mini app projects easier and more
efficient. At the same time, WePY is also a growing framework, which has largely absorbed some
optimized frontend tools and framework design concepts and ideas, mostly from Vue.js.

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
  { usingComponents: { customComponent: '@/components/customComponent', vendorComponent:
  'module:vendorComponent' } }
</config>

<script>
  import wepy from "@wepy/core";

  wepy.page({
    data: {
      num: 0,
      text: "Hello World",
    },
  });
</script>
```

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ooxZuXzVY9aHXmha36vM.png", alt="WePY 'getting started' documentation page showing the first steps to get going.", width="800", height="505" %}
  <figcaption class="w-figure">
   WePY "getting started" documentation.
  </figcaption>
</figure>

## vConsole

The [vConsole](https://github.com/Tencent/vConsole) project provides a lightweight, extendable
frontend developer tool for mobile web pages. It offers a DevTools-like debugger that can be
injected directly into web apps and mini apps. A
[demo](http://wechatfe.github.io/vconsole/demo.html) showcases the opportunities. The vConsole
includes tabs for logs, system, network, elements, and storage.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ow6FfaoI7fMCJDN1819t.png", alt="vConsole demo app. The vConsole opens at the bottom and has tabs for logs, system, network, elements, and storage.", width="800", height="505" %}
  <figcaption class="w-figure">
   vConsole demo app showing the elements explorer.
  </figcaption>
</figure>

## weweb

The [weweb](https://weidian-inc.github.io/hera/#/) project
([open source on GitHub](https://github.com/wdfe/weweb)) is the underlying frontend framework of
the [Hera](https://weidian-inc.github.io/hera/#/) mini app framework that claims to be compatible
with the syntax of WeChat mini apps, so you can write web applications in the way of mini apps. The
documentation promises that if you already have a mini app, you can run it in the browser thanks to
weweb. In my experiments, this did not work reliably for current mini apps, most probably because
the project has not seen updates recently leading its compiler to miss changes in the
WeChat platform.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/jU9Od9IDqFlmuYzAtirn.png", alt="Documentation of the Hera mini app framework listing the WeChat APIs that it supports like `wx.request`, `wx.uploadFile`, etc.", width="800", height="505" %}
  <figcaption class="w-figure">
   Hera mini app framework documentation showing the list of supported WeChat APIs.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/C7ZpPrFE4geW0dylRpZ2.png", alt="The weweb demo mini app compiled with weweb to run in the browser showing form elements.", width="300", height="429" %}
  <figcaption class="w-figure">
    The weweb demo mini app compiled with weweb to run in the browser.
  </figcaption>
</figure>

{% Aside 'success' %}
  In the next chapter, you will learn how to [program the mini app way](/mini-app-programming-way/).
{% endAside %}

## Acknowledgements

This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
and Keith Gu.
