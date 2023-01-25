---
layout: codelab
title: 实现可安装
authors:
  - petelepage
date: 2018-11-05
updated: 2021-02-12
description: |2-

  在此 Codelab 中，了解如何使用

  beforeinstallprompt 事件使网站可供安装。
glitch: make-it-installable?path=script.js
related_post: customize-install
tags:
  - progressive-web-apps
---

此 glitch 已经包含使渐进式 Web 应用程序可安装所需的关键组件，包括一个[非常简单的 service worker](https://glitch.com/edit/#!/make-it-installable?path=service-worker.js) 和一个 [Web 应用程序清单](https://glitch.com/edit/#!/make-it-installable?path=manifest.json)。它还有一个默认隐藏的安装按钮。

## 监听 beforeinstallprompt 事件

当浏览器触发 `beforeinstallprompt` 事件时，表明可以安装渐进式 Web 应用程序并且可以向用户显示安装按钮。当 PWA 满足[可安装性标准](/install-criteria/)时，将触发 `beforeinstallprompt` 事件。

{% Instruction 'remix', 'ol' %}

1. 将 `beforeinstallprompt` 事件处理程序添加到 `window` 对象。
2. 将 `event` 保存为全局变量；稍后需要它来显示提示。
3. 取消隐藏安装按钮。

代码：

```js
window.addEventListener('beforeinstallprompt', (event) => {
  // 防止迷你信息栏出现在移动设备上。
  event.preventDefault();
  console.log('👍', 'beforeinstallprompt', event);
  // 隐藏事件，以便以后再触发。
  window.deferredPrompt = event;
  // 从安装按钮容器中删除 'hidden' 类。
  divInstall.classList.toggle('hidden', false);
});
```

## 处理安装按钮点击

要显示安装提示，请对保存的 `beforeinstallprompt` 事件调用 `prompt()`。调用 `prompt()` 是在安装按钮点击处理程序中完成的，因为 `prompt()` 必须从用户手势调用。

1. 为安装按钮添加点击事件处理程序。
2. 在保存的 `beforeinstallprompt` 事件上调用 `prompt()`。
3. 记录提示的结果。
4. 将保存的 `beforeinstallprompt` 事件设置为  null。
5. 隐藏安装按钮。

代码：

```js
butInstall.addEventListener('click', async () => {
  console.log('👍', 'butInstall-clicked');
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    // 延迟提示不存在。
    return;
  }
  // 显示安装提示。
  promptEvent.prompt();
  // Log the result
  const result = await promptEvent.userChoice;
  console.log('👍', 'userChoice', result);
  // 重置延迟提示变量，因为
  // prompt() 只能调用一次。
  window.deferredPrompt = null;
  // 隐藏安装按钮。
  divInstall.classList.toggle('hidden', true);
});
```

## 跟踪安装事件

通过安装按钮安装渐进式 Web 应用程序只是用户安装 PWA 的一种方式。用户还可以使用 Chrome 的菜单、迷你信息栏和[多功能框中的图标](/promote-install/#browser-promotion) 来安装。可以通过监听 `appinstalled` 事件来跟踪所有这些安装方式。

1. 将`appinstalled`事件处理程序添加到 `window` 对象。
2. 将安装事件记录到分析或其他机制。

代码：

```js
window.addEventListener('appinstalled', (event) => {
  console.log('👍', 'appinstalled', event);
  // 清除 deferredPrompt，以便将其收集起来
  window.deferredPrompt = null;
});
```

## 深入阅读

恭喜，您的应用程序现在可以安装了！

以下是您可以执行的一些其他操作：

- [检测您的应用程序是否从主屏幕启动](/customize-install/#detect-mode)
- [改为显示操作系统的应用程序安装提示](https://developer.chrome.com/blog/app-install-banners-native/)
