---
layout: post
title: Mini app components
authors:
  - thomassteiner
date: 2021-03-03
updated: 2021-03-17
description: |
  This chapter provides details on the components that all mini app platforms make available.
tags:
  - mini-apps
---

{% Aside %}
  This post is part of an article collection where each article builds upon previous articles.
  If you just landed here, you may want to start reading from the [beginning](/mini-app-super-apps/).
{% endAside %}

## Web components

[Web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components/) started with the
promise of letting developers piece them together and build great apps on top of them. Examples of
such atomic components are GitHub's [time-elements](https://github.com/github/time-elements), Stefan
Judis' [web-vitals-element](https://github.com/stefanjudis/web-vitals-element), or, shameless plug,
Google's [dark mode toggle](https://github.com/GoogleChromeLabs/dark-mode-toggle/). When it comes to
complete design systems, however, I have observed that people prefer to rely on a coherent set of
components from the same vendor. An incomplete list of examples includes SAP's
[UI5 Web Components](https://sap.github.io/ui5-webcomponents/), the
[Polymer Elements](https://www.webcomponents.org/author/PolymerElements),
[Vaadin's elements](https://www.webcomponents.org/author/vaadin), Microsoft's
[FAST](https://github.com/microsoft/fast), the
[Material Web Components](https://github.com/material-components/material-components-web-components),
arguably the [AMP components](https://amp.dev/documentation/components/), and many more. Due to a
number of factors out of scope for this article, a lot of developers, however, have also flocked to
frameworks like [React](https://reactjs.org/), [Vue.js](https://vuejs.org/),
[Ember.js](https://emberjs.com/), etc. Rather than giving the developer the freedom to choose from
any of these options (or, dependent on your viewpoint, _forcing_ them to make a technology choice),
super app providers universally supply a set of components that developers must use.

## Components in mini apps

You can think of these components like any of the component libraries mentioned above. To get an
overview of the available components, you can browse
[WeChat's component library](https://developers.weixin.qq.com/miniprogram/en/dev/component/),
[ByteDance's components](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/component/all),
[Alipay's components](https://opendocs.alipay.com/mini/component),
[Baidu's](https://smartprogram.baidu.com/docs/develop/component/component/), and
[Quick App components](https://doc.quickapp.cn/widgets/common-events.html).

Earlier [I showed](/mini-app-devtools/#custom-elements-under-the-hood) that while, for example, WeChat's `<image>`
is a web component under the hood, not all of these components are technically web components. Some
components, like `<map>` and `<video>`, are rendered as
[OS-built-in components](https://developers.weixin.qq.com/ebook?action=get_post_info&docid=000caab39b88b06b00863ab085b80a)
that get layered over the WebView. For the developer, this implementation detail is not revealed,
they are programmed like any other component.

As always, the details vary, but the overall programming concepts are the same across all super app
providers. An important concept is data binding, as shown before in
[Markup languages](/mini-app-markup-styling-and-scripting/#markup-languages). Generally, components are grouped by function, so finding the
right one for the job is easier. Below is an example from Alipay's categorization, which is similar
to the component grouping of other vendors.

- View containers
  - `view`
  - `swiper`
  - `scroll-view`
  - `cover-view`
  - `cover-image`
  - `movable-view`
  - `movable-area`
- Basic content
  - `text`
  - `icon`
  - `progress`
  - `rich-text`
- Form components
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
- Navigation
  - `navigator`
- Media components
  - `image`
  - `video`
- Canvas
  - `canvas`
- Map
  - `map`
- Open components
  - `web-view`
  - `lifestyle`
  - `contact-button`
- Accessibility
  - `aria-component`

Below, you can see Alipay's [`<image>`](https://opendocs.alipay.com/mini/component/image) used in an
`a:for` directive (see [List rendering](/mini-app-markup-styling-and-scripting/#list-rendering)) that loops over an image data array
provided in `index.js`.

```js
/* index.js */
Page({
  data: {
    array: [
      {
        mode: "scaleToFill",
        text: "scaleToFill",
      },
      {
        mode: "aspectFit",
        text: "aspectFit",
      },
    ],
    src: "https://images.example.com/sample.png",
  },
  imageError(e) {
    console.log("image", e.detail.errMsg);
  },
  onTap(e) {
    console.log("image tap", e);
  },
  imageLoad(e) {
    console.log("image", e);
  },
});
```

```html
<!-- index.axml -->
<view class="page">
  <view class="page-section" a:for="{% raw %}{{array}}{% endraw %}" a:for-item="item">
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

Note the data binding of the `item.mode` to the `mode` attribute, the `src` to the `src` attribute,
and the three event handlers `onTap`, `onError`, and `onLoad` to the functions of the same name. As
shown [before](/mini-app-devtools/#custom-elements-under-the-hood), the `<image>` tag internally gets converted into a
`<div>` with a placeholder of the image's final dimensions, optional lazy-loading, a default source,
etc.

The available configuration options of the component are all listed in the
[documentation](https://opendocs.alipay.com/mini/component/image). An embedded-in-the-docs
[component preview with simulator](https://herbox-embed.alipay.com/s/doc-image?chInfo=openhome-doc&theme=light)
makes the code immediately tangible.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/t2Y6WWsRhp6LjThxROUo.png", alt="Alipay component documentation with embedded component preview, showing a code editor with simulator that shows the component rendered on a simulated iPhone 6.", width="800", height="510" %}
  <figcaption class="w-figure">
    Alipay component documentation with embedded component preview.
  </figcaption>
</figure>

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xu2F51XL9Z0M3Z9n6n2O.png", alt="Alipay component preview running in a separate browser tab showing a code editor with simulator that shows the component rendered on a simulated iPhone 6.", width="800", height="514" %}
  <figcaption class="w-figure">
    Alipay component preview popped out into its own tab.
  </figcaption>
</figure>

Each component also has a QR code that can be scanned with the Alipay app that opens the component
example in a self-contained minimal example.

<figure class="w-figure">
  {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/gaWqLG5GqeqqfbhWz8D1.png", alt="Alipay's `image` component previewed on a real device after scanning a QR code in the documentation.", width="300", height="649" %}
  <figcaption class="w-figure">
    Preview of the Alipay <code>&lt;image&gt;</code> component on a real device after following a <a href="https://qr.alipay.com/s6x01278ucjhjyknjd5ow53">QR code link</a> from the docs.
  </figcaption>
</figure>

Developers can jump from the documentation straight into Alipay DevTools IDE by leveraging a
proprietary URI scheme `antdevtool-tiny://`. This allows the documentation to link directly into a
to-be-imported mini app project, so developers can get started with the component immediately.

## Custom components

Apart from using the vendor-provided components, developers can also create custom components. The
concept exists for
[WeChat](https://developers.weixin.qq.com/miniprogram/en/dev/framework/custom-component/),
[ByteDance](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/guide/custom-component/custom-component),
[Alipay](https://opendocs.alipay.com/mini/framework/component_configuration), and
[Baidu](https://smartprogram.baidu.com/docs/develop/framework/custom-component/), as well as
[Quick App](https://doc.quickapp.cn/tutorial/framework/parent-child-component-communication.html#%E7%BB%84%E4%BB%B6%E8%87%AA%E5%AE%9A%E4%B9%89).
For example, a Baidu custom component consists of four files that must reside in the same folder:
`custom.swan`, `custom.css`, `custom.js`, and `custom.json`.

The file `custom.json` denotes the folder contents as a custom component.

```json
{
  "component": true
}
```

The file `custom.swan` contains the markup and `custom.css` the CSS.

```html
<view class="name" bindtap="tap">{% raw %}{{name}}{% endraw %} {% raw %}{{age}}{% endraw %}</view>
```

```css
.name {
  color: red;
}
```

The file `custom.js` contains the logic. The component lifecycle functions are `attached()`,
`detached()`, `created()`, and `ready()`. The component can additionally also react on
[page lifecycle events](/mini-app-project-structure-lifecycle-and-bundling/#mini-app-lifecycle), namely `show()` and `hide()`.

```js
Component({
  properties: {
    name: {
      type: String,
      value: "swan",
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

The custom component can then be imported in `index.json`, the key of the import determines the name
(here: `"custom"`) that the custom component can then be used with in `index.swan`.

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
  Continue reading to learn about the [project structure, lifecycle, and bundling](/mini-app-project-structure-lifecycle-and-bundling/) of mini apps.
{% endAside %}

## Acknowledgements

This article was reviewed by
[Joe Medley](https://github.com/jpmedley),
[Kayce Basques](https://github.com/kaycebasques),
[Milica Mihajlija](https://github.com/mihajlija),
[Alan Kent](https://github.com/alankent),
and Keith Gu.
