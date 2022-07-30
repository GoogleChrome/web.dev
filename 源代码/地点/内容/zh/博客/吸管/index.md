---
layout: post
title: 使用 EyeDropper API 选择屏幕上任何像素的颜色
subhead: >
  EyeDropper API 使作者能够使用浏览器提供的吸管来构建自定义颜色选择器。
authors:
  - patrickbrosset
  - thomassteiner
description: >
  创意应用程序的开发人员可以使用 EyeDropper API 来实现一个选择器，允许用户从屏幕上的像素中选择颜色，包括浏览器之外的像素。
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/6Gl4RG1zitlgmpMZviDD.jpg
alt: A pipette.
date: 2022-7-31
tags:
  - capabilities
  - progressive-web-apps
  - blog
---

{% Aside %} EyeDropper API 是 [capabilities project](https://developer.chrome.com/blog/fugu-status/) 的一部分，目前正在
开发中。这篇文章将随着实施的进展而更新。 {% endAside %}

## 什么是吸管 API? {: #what }

许多创意应用程序允许用户从应用程序窗口的某些部分甚至整个屏幕中选择颜色，通常使用吸管来比喻。

例如，Photoshop 允许用户从画布上采集颜色，这样他们就不必猜测颜色并冒着弄错的风险。 PowerPoint 还有一个吸管工具，
在设置形状的轮廓或填充的颜色时很有用。 甚至 Chromium DevTools 也有一个吸管，您可以在 CSS 样式面板中编辑颜色时使用，这样您就不必记住或从其他地方复制颜色代码。

如果您正在使用 Web 技术构建创意应用程序，您可能希望为您的用户提供类似的功能。 但是，如果可能的话，在 Web 上执行此操作很困难，特别是如果您想从整个设备的屏幕（例如，从不同的应用程序）中采集颜色，而不仅仅是从当前浏览器选项卡中。 没有一款浏览器提供的滴管工具可以满足网络应用的需要。

[`<input type="color">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/color) 元素很接近这个功能了。在桌面设备上运行的基于 Chromium 的浏览器上，它在颜色选择器下拉菜单中提供了一个有用的吸管。 但是，使用这意味着您的应用程序必须使用 CSS 对其进行自定义，并将其包装在一些 JavaScript 中以使其可用于您应用程序的其他部分。

使用此选项还意味着其他浏览器将无法访问该功能。

EyeDropper API 通过提供一种从屏幕上采样颜色的方法来填补这一空白。

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/JqDpX2OSqF6WAO9ytD8x.png", alt="Chromium color picker.", width="308", height="400" %}

## 当前状态 {: #status }

<div>


| 步骤 | 状态 |
| ---------------------------------------- | ------------------------------------ |
| 1. 创建解释器                             | [完成][解释器]                        |
| 2. 创建规范的初稿                          | [完整][规格]                         |
| 3. 收集反馈并迭代设计                      | [进行中](#feedback)                  |
| 4. 初次试用                               | 完成                                 |
| 5. **启动**                              || **Chromium&nbsp;95**<br/>（仅限桌面。）|

</div>

## 如何使用 EyeDropper API {: #use }

### 特征检测和浏览器支持

首先，确保 API 在使用前可用。

```javascript
if ('EyeDropper' in window) {
  // API 可用！
}
```

EyeDropper API 在基于 Chromium 的浏览器（如 Edge 或 Chrome版​本&nbsp;95）上受支持。

### 使用 API

要使用 API，请创建一个 `EyeDropper` 对象，然后调用其 `open()` 方法。

```js
const eyeDropper = new EyeDropper();
```

`open()` 方法返回一个promise，该promise在用户选择屏幕上的像素后解析，解析的值提供对 sRGBHex 格式 (`#RRGGBB`) 的像素颜色的访问。
如果用户通过按 <kbd>esc</kbd> 键退出吸管模式，则该promise将被拒绝。

```js
try {
  const result = await eyeDropper.open();
  // 用户选择了一个像素，这里是它的颜色：
  const colorHexValue = result.sRGBHex;
} catch (err) {
  // 用户退出了吸管模式。
}
```

该应用程序的代码还可以取消吸管模式。如果应用程序的状态发生实质性变化，这会很有用。可能会出现一个弹出对话框，需要用户输入。此时应停止吸管模式。

要取消吸管，您可以使用[AbortController](https://developer.mozilla.org/docs/Web/API/AbortController) 对象的信号和将其传递给 `open()` 方法。

```js
const abortController = new AbortController();

try {
  const result = await eyeDropper.open({signal: abortController.signal});
  // ...
} catch (err) {
  // ...
}

// 然后，当需要停止吸管模式时：
abortController.abort();
```

把它们放在一起，你可以在下面找到一个可重用的异步函数：

```js
async function sampleColorFromScreen(abortController) {
  const eyeDropper = new EyeDropper();
  try {
    const result = await eyeDropper.open({signal: abortController.signal});
    return result.sRGBHex;
  } catch (e) {
    return null;
  }
}
```

## 试试看！

在 Windows 或 Mac 上使用 Microsoft Edge 或 Google Chrome 95 或更高版本，打开其中一个
[EyeDropper 演示](https://captainbrosset.github.io/eyedropper-demos/)。

试试 [color game demo](https://captainbrosset.github.io/eyedropper-demos/color-game.html) for
实例。点击 **Play** 按钮，在有限的时间内，并尝试从底部的列表中匹配顶部的彩色方块。

{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/gD2C2AmnOnP4EhVBhczm.png", alt="Color game demo.", width="800", height="455" %}

## 隐私和安全注意事项

在这个看似简单的 Web API 背后隐藏着潜在的有害隐私和安全问题。如果恶意网站可以开始从您的屏幕上看到像素？

为了解决这个问题，API 规范要求采取以下措施：

- 首先，API 实际上不会让吸管模式在没有用户意图的情况下启动。`open()` 方法只能在响应用户操作（如按钮单击）时调用。
- 其次，在没有用户意图的情况下，无法再次检索像素信息。 `open()` 返回的promise仅解析为响应用户操作（单击像素）的颜色值。所以吸管不能在没有用户注意的情况下在后台使用。
- 为了帮助用户更容易地注意到吸管模式，浏览器需要使模式明显化。
  这就是为什么正常的鼠标光标在短时间延迟后消失，而出现在专用用户界面的原因。在吸管模式启动和用户可以选择像素也有延迟，以确保用户有时间看到放大镜。
- 最后，用户可以随时取消吸管模式（按<kbd>esc</kbd>键）。

## 反馈 {: #feedback }

Chromium 团队希望了解您对 EyeDropper API 的体验。

### 告诉我们有关 API 设计的信息

API 是否有一些不像您预期的那样工作？还是缺少方法或实现您的想法所需的属性？对安全模式有疑问或意见？在 API 的 [GitHub repo][issues] 上提交规范问题，或将您的想法添加到已存在的问题issue上。

### 报告实现问题

您是否发现 Chromium 的实现存在错误？还是实现与规范不同？
在 [new.crbug.com](https://new.crbug.com) 提交错误。确保包含尽可能多的细节，
复现的简单说明，并在 **Components** 框中输入 `Blink>Forms>Color`。
[Glitch](https://glitch.c​om/) 非常适合分享快速简单的重现。


### 显示对 API 的支持

您打算使用 EyeDropper API 吗？您的公开支持有助于 Chromium 团队优先考虑功能并向其他浏览器供应商展示支持它们的重要性。发送推文到[@ChromiumDev][cr-dev-twitter] 使用标签[`#EyeDropper`](https://twitter.com/search?q=%23EyeDropper&src=recent_search_click&f=live) 并让我们知道您在哪里以及如何使用它。

## 有用的链接 {: #helpful }

- [Public explainer][explainer]
- [EyeDropper API Demo][demo] | [EyeDropper API Demo source][demo-source]
- [Chromium tracking bug][cr-bug]
- [ChromeStatus.com entry][cr-status]
- Blink Component: [`Blink>Forms>Color`][blink-component]
- [TAG Review](https://github.com/w3ctag/design-reviews/issues/587)
- [WebKit position request](https://lists.webkit.org/pipermail/webkit-dev/2021-July/031929.html)
- [Mozilla position request](https://github.com/mozilla/standards-positions/issues/557)
- [Intent to Ship](https://groups.google.com/a/chromium.org/g/blink-dev/c/rdniQ0D5UfY/m/Aywn9XyyAAAJ)

## 致谢

EyeDropper API 由[Ionel Popescu](https://www.linkedin.com/in/ionelpopescu/) 来自 Microsoft Edge 团队指定和实现。这个帖子由 [Joe Medley](https://github.com/jpmedley) 审核。​

[规格]：https://wigg.github.io/eyedropper-api/
[问题]：https://github.com/wigg/eyedropper-api/issues
[演示]：https://captainbrosset.github.io/eyedropper-demos/
[演示源]：https://github.com/captainbrosset/eyedropper-demos
[解释者]：https://github.com/WICG/eyedropper-api
[cr-bug]：https://bugs.chromium.org/p/chromium/issues/detail?id=897309
[cr-status]：https://bugs.chromium.org/p/chromium/issues/detail?id=897309
[闪烁组件]：https://chromestatus.com/features#component%3ABlink%3EForms%3EForms
[cr-dev-twitter]：https://twitter.com/ChromiumDev
[强大的API]：https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md 

