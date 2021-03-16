---
layout: post
title: Mini app markup, styling, and scripting
authors:
  - thomassteiner
date: 2021-03-03
# updated: 2021-03-03
description: |
  This chapter looks at the mark-up, styling, and scripting options of various mini apps platforms.
tags:
  - mini-apps
---

{% Aside %}
  This post is part of an article collection where each article builds upon previous articles.
  If you just landed here, you may want to start reading from the [beginning](/mini-app-super-apps/).
{% endAside %}

## Markup languages

As outlined before, rather than with plain HTML, mini apps are written with dialects of HTML. If you
have ever dealt with [Vue.js](https://vuejs.org/) text interpolation and directives, you will feel
immediately at home, but similar concepts existed way before that in XML Transformations
([XSLT](https://www.w3.org/TR/xslt-30/)). Below, you can see code samples from WeChat's
[WXML](https://developers.weixin.qq.com/miniprogram/en/dev/framework/view/wxml/), but the concept is
the same for all mini apps platforms, namely Alipay's
[AXML](https://opendocs.alipay.com/mini/framework/axml), Baidu's
[Swan Element](https://smartprogram.baidu.com/docs/develop/framework/dev/), ByteDance's
[TTML](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/guide/mini-app-framework/view/ttml)
(despite the DevTools calling it Bxml), and Quick App's
[HTML](https://doc.quickapp.cn/tutorial/framework/for.html). Just like with Vue.js, the underlying
mini app programming concept is the
[model-view-viewmodel](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) (MVVM).

### Data binding

Data binding corresponds to Vue.js'
[text interpolation](https://vuejs.org/v2/guide/syntax.html#Text).

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

### List rendering

List rendering works like Vue.js [`v-for` directive](https://vuejs.org/v2/guide/list.html).

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

### Conditional rendering

Conditional rendering works like Vue.js'
[`v-if` directive](https://vuejs.org/v2/guide/conditional.html).

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

### Templates

Rather than requiring the imperative
[cloning of the `content` of an HTML template](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTemplateElement/content),
WXML templates can be used declaratively via the `is` attribute that links to a template definition.

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

## Styling

Styling happens with dialects of CSS. WeChat's is named
[WXSS](https://developers.weixin.qq.com/miniprogram/en/dev/framework/quickstart/code.html#WXSS-Style).
For Alipay, theirs is called [ACSS](https://opendocs.alipay.com/mini/framework/acss), Baidu's simply
[CSS](https://smartprogram.baidu.com/docs/develop/framework/view_css/), and for ByteDance, their
dialect is referred to as
[TTSS](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/guide/mini-app-framework/view/ttss).
What they have in common is that they extend CSS with responsive pixels. When writing regular CSS,
developers need to convert all pixel units to adapt to different mobile device screens with
different widths and pixel ratios. TTSS supports the `rpx` unit as its underlying layer, which means
the mini app takes over the job from the developer and converts the units on their behalf, based on
a specified screen width of `750rpx`. For example, on a Pixel 3a phone with a screen width of
`393px` (and a device pixel ratio of `2.75`), responsive `200rpx` become `104px` on the real device
when inspected with Chrome DevTools (393px / 750rpx \* 200rpx ≈ 104px). In Android, the same concept
is called
[density-independent pixel](https://developer.android.com/training/multiscreen/screendensities#TaskUseDP).

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/n26ptkMoSfiTDanfFh5F.png", alt="Inspecting a view with Chrome DevTools whose responsive pixel padding was specified with `200rpx` shows that it is actually `104px` on a Pixel 3a device.", width="800", height="385" %}
  <figcaption class="w-figure">
    Inspecting the actual padding on a Pixel 3a device with Chrome DevTools.
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

Since components (see [later](/mini-app-components/)) do not use shadow DOM, styles declared on a page reach
into all components. The common stylesheet file organization is to have one root stylesheet for
global styles, and individual per-page stylesheets specific to each page of the mini app. Styles can
be imported with an `@import` rule that behaves like the
[`@import`](https://developer.mozilla.org/en-US/docs/Web/CSS/@import) CSS at-rule. Like in HTML,
styles can also be declared inline, including dynamic text interpolation (see
[before](/mini-app-markup-styling-and-scripting/#data-binding)).

```html
<view style="color:{% raw %}{{color}}{% endraw %};" />
```

## Scripting

Mini apps support a "safe subset" of JavaScript that includes support for modules using varying
syntaxes that remind of [CommonJS](http://www.commonjs.org/) or [RequireJS](https://requirejs.org/).
JavaScript code cannot be executed via `eval()` and no functions can be created with
`new Function()`. The scripting execution context is [V8](https://v8.dev/) or
[JavaScriptCore](https://developer.apple.com/documentation/javascriptcore) on devices, and V8 or
[NW.js](https://nwjs.io/) in the simulator. Coding with ES6 or newer syntax is usually possible,
since the particular DevTools automatically transpile the code to ES5 if the build target is an
operating system with an older WebView implementation (see [later](/mini-app-project-structure-lifecycle-and-bundling/#the-build-process)). The
documentation of the super app providers explicitly mentions that their scripting languages are not
to be confused with and are distinct from JavaScript. This statement, however, refers mostly just to
the way modules work, that is, that they do not support standard
[ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) yet.

As mentioned [before](/mini-app-markup-styling-and-scripting/#markup-languages), the mini app programming concept is the
[model-view-viewmodel](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) (MVVM).
The logic layer and the view layer run on different threads, which means the user interface does not
get blocked by long-running operations. In web terms, you can think of scripts running in a
[Web Worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers).

WeChat's scripting language is called
[WXS](https://developers.weixin.qq.com/miniprogram/en/dev/reference/wxs/), Alipay's
[SJS](https://opendocs.alipay.com/mini/framework/sjs), ByteDance's likewise
[SJS](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/framework/sjs-syntax-reference/sjs-introduction/).
Baidu speaks of [JS](https://smartprogram.baidu.com/docs/develop/framework/devjs/) when referencing
theirs. These scripts need to be included using a special kind of tag, for example, `<wxs>` in
WeChat. In contrast, Quick App uses regular `<script>` tags and the ES6
[JS](https://doc.quickapp.cn/framework/script.html) syntax.

```html
<wxs module="m1">
  var msg = "hello world";
  module.exports.message = msg;
</wxs>

<view>{% raw %}{{m1.message}}{% endraw %}</view>
```

Modules can also be loaded via a `src` attribute, or imported via `require()`.

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

### JavaScript bridge API

The JavaScript bridge that connects mini apps with the operating system makes it possible
to use OS capabilities (see [Access to powerful features](/mini-app-about/#access-to-powerful-features). It
also offers a number of convenience methods. For an overview, you can check out the different APIs
of [WeChat](https://developers.weixin.qq.com/miniprogram/en/dev/api/),
[Alipay](https://opendocs.alipay.com/mini/api),
[Baidu](https://smartprogram.baidu.com/docs/develop/api/apilist/),
[ByteDance](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/api/foundation/tt-can-i-use),
and [Quick App](https://doc.quickapp.cn/features/).

Feature detection is straightforward, since all platforms provide a (literally called like this)
`canIUse()` method whose name seems inspired by the website [caniuse.com](https://caniuse.com/). For
example, ByteDance's
[`tt.canIUse()`](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/api/foundation/tt-can-i-use)
allows for support checks for APIs, methods, parameters, options, components, and attributes.

```js
// Testing if the `<swiper>` component is supported.
tt.canIUse("swiper");
// Testing if a particular field is supported.
tt.canIUse("request.success.data");
```

{% Aside 'success' %}
  The next chapter introduces [mini app components](/mini-app-components/).
{% endAside %}

## Acknowledgements

This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
and Keith Gu.
