---
layout: post
title: 如何提供应用内安装体验
authors:
  - petelepage
date: 2020-02-14
updated: 2021-05-19
description: |2-

  使用 beforeinstallprompt 事件为您的用户提供自定义、无缝的应用内安装体验。
tags:
  - progressive-web-apps
---

许多浏览器使您可以直接在 PWA 的用户界面内启用并推进您的渐进式 Web 应用 (PWA) 的安装。安装（以前有时称为添加到主屏幕）使用户可以轻松地在他们的移动或桌面设备上安装您的 PWA。安装 PWA 会将其添加到用户的启动器中，使其可以像任何其他已安装的应用一样运行。

除了[浏览器提供的安装体验之外](/promote-install/#browser-promotion)，还可以直接在您的应用内提供您自己的自定义安装流程。

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/SW3unIBfyMRTZNK0DRIw.png", alt="Spotify PWA 中提供的安装应用按钮", width="491", height="550" %}<figcaption> Spotify PWA 中提供的“安装应用”按钮</figcaption></figure>

在考虑是否推进安装时，最好考虑用户通常如何使用您的 PWA。例如，如果有一组用户在一周内多次使用您的 PWA，则从智能手机主屏幕或桌面操作系统的开始菜单启动您的应用会令这些用户受益于额外的便利。在安装 `standalone` 或 `minimal-ui` 模式下，删除窗口中的浏览器工具栏，创建额外的屏幕空间，也会让生产性和娱乐性应用程序受益。

## 推进安装 {: #promote-installation }

为了表明您的渐进式 Web 应用可安装，并提供自定义的应用内安装流程，请执行下列操作：

1. 侦听 `beforeinstallprompt` 事件。
2. 保存 `beforeinstallprompt` 事件，以便将来可以使用它来触发安装流程。
3. 提醒用户您的 PWA 是可安装的，并提供一个按钮或其他元素来启动应用内安装流程。

{% Aside %} `beforeinstallprompt` 事件和 `appinstalled` 事件已从网络应用清单规范移至它们自己的[孵化器](https://github.com/WICG/beforeinstallprompt)。 Chrome 团队仍然致力于支持它们，并且没有计划取消或弃用支持。Google 的 Web DevRel 团队继续推荐使用它们来提供定制的安装体验。 {% endAside %}

### 侦听 `beforeinstallprompt` 事件 {: #beforeinstallprompt }

如果您的渐进式 Web 应用满足所需的[安装标准](/install-criteria/)，则浏览器会触发 `beforeinstallprompt` 事件。保存对事件的引用，并更新您的用户界面以向用户表明可以安装您的 PWA。如下突出显示。

```js
// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  showInstallPromotion();
  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`'beforeinstallprompt' event was fired.`);
});
```

{% Aside %}您可以使用多种不同[模式](/promote-install/)来通知用户您的应用可以安装并提供应用内安装流程，例如，标题中的按钮、导航菜单中的一项或您的内容提要。 {% endAside %}

### 应用内安装流程 {: #in-app-flow }

要提供应用内安装，请提供一个按钮或其他界面元素，以供用户点击来安装您的应用。点击该元素后，将调用已保存的 `beforeinstallprompt` 事件（存储在 `deferredPrompt` 变量中）的 `prompt()`。其会向用户显示一个模式安装对话框，要求他们确认想要安装您的 PWA。

```js
buttonInstall.addEventListener('click', async () => {
  // Hide the app provided install promotion
  hideInstallPromotion();
  // Show the install prompt
  deferredPrompt.prompt();
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  // Optionally, send analytics event with outcome of user choice
  console.log(`User response to the install prompt: ${outcome}`);
  // We've used the prompt, and can't use it again, throw it away
  deferredPrompt = null;
});
```

`userChoice` 属性是根据用户的选择进行解析的承诺。您只能调用延迟事件的 `prompt()` 一次。如果用户关闭了它，您需要等到 `beforeinstallprompt` 事件被再次触发，通常是在 `userChoice` 属性解析后立即触发。

{% Aside 'codelab' %}[使用 beforeinstallprompt 事件使网站可安装](/codelab-make-installable)。 {% endAside %}

## 检测 PWA 是否被成功安装  {: #detect-install }

您可以使用 `userChoice` 属性来确定用户是否从您的用户界面中安装了您的应用。不过，如果用户从地址栏或其他浏览器组件安装您的 PWA，则 `userChoice` 将不起作用。相反，您应该侦听 `appinstalled` 事件。无论何时安装 PWA，无论使用什么机制安装 PWA，它都会被触发。

```js
window.addEventListener('appinstalled', () => {
  // Hide the app-provided install promotion
  hideInstallPromotion();
  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt = null;
  // Optionally, send analytics event to indicate successful install
  console.log('PWA was installed');
});
```

## 检测 PWA 的启动方式 {: #detect-launch-type }

CSS `display-mode` 媒体查询指示 PWA 的启动方式，无论是在浏览器选项卡中启动，还是作为已安装的 PWA 启动。这使得可以根据应用的启动方式应用不同的样式。例如，当作为已安装的 PWA 启动时，始终隐藏安装按钮并提供后退按钮。

### 跟踪 PWA 的启动方式

要跟踪用户启动 PWA 的方式，请使用 `matchMedia()` 测试 `display-mode` 媒体查询。iOS 上的 Safari 尚不支持此功能，因此您必须检查 `navigator.standalone` ，它会返回一个布尔值，指示浏览器是否在独立模式下运行。

```js
function getPWADisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (document.referrer.startsWith('android-app://')) {
    return 'twa';
  } else if (navigator.standalone || isStandalone) {
    return 'standalone';
  }
  return 'browser';
}
```

### 跟踪显示模式的变化

要跟踪用户是否在 `standalone` 和 `browser tab` 之间发生变化，请侦听`display-mode` 媒体查询的变化。

```js
window.matchMedia('(display-mode: standalone)').addEventListener('change', (evt) => {
  let displayMode = 'browser';
  if (evt.matches) {
    displayMode = 'standalone';
  }
  // Log display mode change to analytics
  console.log('DISPLAY_MODE_CHANGED', displayMode);
});
```

### 根据当前显示模式更新 UI

要在作为已安装 PWA 启动时为 PWA 应用不同的背景颜色，请使用条件 CSS：

```css
@media all and (display-mode: standalone) {
  body {
    background-color: yellow;
  }
}
```

## 更新应用的图标和名称

如果您需要更新应用名称或提供新图标怎么办？查看 [Chrome <br> 如何处理 Web 应用清单的更新](/manifest-updates/)，了解这些更改何时以及如何反映在 Chrome 中。
