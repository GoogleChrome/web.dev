---
title: 将安装的 Web 应用程序作为文件处理程序
subhead: 将应用程序注册为操作系统的文件处理程序。
authors:
  - thomassteiner
Description: 将应用程序注册为操作系统的文件处理程序并使用适当的应用程序打开文件。
date: 2020-10-22
updated: 2022-01-25
tags:
  - blog
  - capabilities
hero: image/admin/tf0sUZX6G7AM8PvU1t0B.jpg
alt: 多种颜色的绑定器。
---

{% Aside %} 文件处理 API 是[功能项目的](https://developer.chrome.com/blog/fugu-status/)一部分，目前正在开发中。本博文将根据实施进展随时更新。{% endAside %}

现在，Web 应用程序[能够读写文件](/file-system-access/)，下一个逻辑步骤是让开发人员将这些 Web 应用程序声明为他们的应用程序可以创建和处理的文件的文件处理程序。利用文件处理 API 即可实现。将文本编辑器应用程序注册为文件处理程序并安装后，您可以在 macOS 上右键单击 `.txt` 文件并选择“获取信息”，然后指示操作系统始终将该应用程序作为打开 `.txt` 文件的默认应用程序。

### 文件处理 API 的建议用例 {: #use-cases }

可能使用此 API 的站点示例包括：

- Office 应用程序，如文本编辑器、电子表格应用程序和幻灯片创建器。
- 图形编辑器和绘图工具。
- 视频游戏关卡编辑器工具。

## 当前状态 {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">步骤</th>
<th data-md-type="table_cell">状态</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. 创建解释文档</td>
<td data-md-type="table_cell"><a href="https://github.com/WICG/file-handling/blob/main/explainer.md" data-md-type="link">完成</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. 创建规范初稿</td>
<td data-md-type="table_cell">未开始</td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. 收集反馈并对设计进行迭代</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">进行中</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. 来源测试</td>
<td data-md-type="table_cell"><a>完成</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. 发布</td>
<td data-md-type="table_cell">未开始</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## 如何使用文件处理 API {: #use }

### 通过 about://flags 启用

在没有来源试验令牌的情况下，要在本地试验文件处理 API，请在 `about://flags` 中启用 `#file-handling-api` 标志。

### 渐进增强

文件处理 API 本身不能实施填充代码 (Polyfill)。但是，使用 Web 应用程序打开文件的功能可通过另外两种方式实现：

- [Web 共享目标 API](/web-share-target/) 支持开发人员将应用程序指定为共享目标，以便从操作系统的共享表中打开文件。
- [文件系统访问 API](/file-system-access/) 可以集成文件拖放操作，因此，开发人员可以在打开的应用程序中处理拖放文件。

### 功能检测

要检查是否支持文件处理 API，请使用：

```javascript
if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
  // 支持文件处理 API。
}
```

{% Aside %} 目前，文件处理仅限于桌面操作系统。{% endAside %}

### 文件处理 API 的声明部分

第一步，Web 应用程序需要在 [Web 应用程序清单](/add-manifest/)中以声明方式描述可处理的文件类型。该文件处理 API 使用一个称为 `"file_handlers"` 的新属性扩展了 Web 应用程序清单，该属性可接受一组文件处理程序。文件处理程序是具有两个属性的对象：

- 其一是 `"action"` 属性，它指向应用程序范围内的 URL，将其作为值
- 其二是 `"accept"` 属性，它以 MIME 类型的对象作为键，并将文件扩展名列表作为值。
- 包含一组 [`ImageResource`](https://www.w3.org/TR/image-resource/) 图标的 `"icons"` 属性。某些操作系统允许显示一个图标的文件类型关联，该图标不仅是关联的应用程序图标，而且是与应用程序使用的该文件类型相关的特殊图标。

下面的示例更清楚，仅显示了 Web 应用程序清单的相关摘录：

```json
{
  "file_handlers": [
    {
      "action": "/open-csv",
      "accept": {
        "text/csv": [".csv"]
      },
      "icons": [
        {
          "src": "csv-icon.png",
          "sizes": "256x256",
          "type": "image/png"
        }
      ]
    },
    {
      "action": "/open-svg",
      "accept": {
        "image/svg+xml": ".svg"
      },
      "icons": [
        {
          "src": "svg-icon.png",
          "sizes": "256x256",
          "type": "image/png"
        }
      ]
    },
    {
      "action": "/open-graf",
      "accept": {
        "application/vnd.grafr.graph": [".grafr", ".graf"],
        "application/vnd.alternative-graph-app.graph": ".graph"
      },
      "icons": [
        {
          "src": "graf-icon.png",
          "sizes": "256x256",
          "type": "image/png"
        }
      ]
    }
  ]
}
```

这是一个假设的应用程序，它可以处理 `/open-csv` 中的逗号分隔值文件 `.csv` )、`/open-svg` 中的可缩放矢量图形文件 (`.svg`)，以及 `/open-graf` 中将 `.grafr`、`.graf` 或 `.graph` 作为扩展名的 Grafr 生成文件格式。

{% Aside %} 必须安装应用程序才能让声明生效。您可以在本站点上的[让应用程序可安装](/progressive-web-apps/#make-it-installable)系列文章中了解更多信息。{% endAside %}

### 文件处理 API 的必要部分

既然应用程序已声明该 API 在理论上可以处理哪个范围内 URL 的哪些文件，但是，在实践中，它需要以命令方式对传入的文件执行一些操作。这就是 `launchQueue` 发挥作用的地方。要访问启动的文件，站点需要为 `window.launchQueue` 对象指定一个使用者。启动会一直排队，直到指定的使用者处理启动，每次启动都会调用使用者一次。这样，无论何时指定使用者，每次启动都会得到处理。

```js
if ('launchQueue' in window && 'files' in LaunchParams.prototype) {
  launchQueue.setConsumer((launchParams) => {
    // 当队列为空时不执行任何操作。
    if (!launchParams.files.length) {
      return;
    }
    for (const fileHandle of launchParams.files) {
      // 处理文件。
    }
  });
}
```

### DevTools 支持

撰写本文时尚无 DevTools 支持，不过，我已经提交了[功能请求](https://bugs.chromium.org/p/chromium/issues/detail?id=1130552)，以便将来添加支持。

## 演示

[我已经为 Excalidraw](https://excalidraw.com/)（一款卡通风格的绘图应用程序）添加了文件处理支持。要进行测试，您需要先安装 Excalidraw。当您使用它创建一个文件并将其存储在文件系统中时，您可以通过双击打开该文件，也可以单击右键，然后在上下文菜单中选择“Excalidraw”。您可以查看源代码的[实现](https://github.com/excalidraw/excalidraw/search?q=launchqueue&type=code)。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/TMh8Qev0XdwgIx7jJlP5.png", alt="包含 Excalidraw 文件的 macOS 访达窗口。", width="800", height="422" %} <figcaption>在操作系统的文件资源管理器中双击或右键单击文件。</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/wCNbMl6kJ11XziG3LO65.png", alt="右键单击文件时显示的上下文菜单，其中突出显示了“打开方式...Excalidraw”项目。", width="488", height=" 266" %} <figcaption> Excalidraw 是 <code>.excalidraw</code> 文件的默认文件处理程序。</figcaption></figure>

## 安全性

Chrome 团队按照[控制对强大 Web 平台功能的访问](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md)一文中定义的核心原则设计和实现了文件系统访问 API，包括了用户控制、透明度和用户工效几方面。

## 权限、权限持久性和文件处理程序更新

使用文件处理 API 打开文件时，为了确保用户的信任和用户文件的安全，使用 PWA 查看文件之前会显示权限提示。该权限提示会在用户选择使用 PWA 打开文件后立即显示，因此，权限与使用 PWA 打开文件的操作紧密衔接，从而使其更易于理解且密切相关。

在用户单击**允许**或**阻止**站点的文件处理，或者忽略提示 3 次（之后 Chromium 将禁用并阻止此权限）之前，每次都会显示此权限。所选设置将在 PWA 关闭和重新打开期间保持不变。

`"file_handlers"` 部分的清单更新和更改时，将重置权限。

### 与文件相关的挑战

允许网站访问文件会产生很多攻击媒介。这部分内容在[关于文件系统访问 API 的文章](/file-system-access/#security-considerations)中进行了概述。文件处理 API 通过文件系统访问 API 提供的附加安全相关功能能够通过操作系统的内置 UI（而不是通过 Web 应用程序显示的文件选择器）授予对某些文件的访问权限。

用户通过打开文件而在无意中授予 Web 应用程序访问权限的风险仍然存在。但是，一般来说，打开文件就意味着允许打开它的应用程序读取和/或操作该文件。因此，用户明确选择在安装的应用程序中打开文件（例如，通过“打开方式…”上下文菜单），即可视为对应用程序的充分信任信号。

### 默认处理程序挑战

例外情况是主机系统上没有打开特定文件类型的应用程序。在这种情况下，某些主机操作系统可能会自动将新注册的处理程序提升为该文件类型的默认处理程序，并且无需用户干预。这意味着如果用户双击这种类型的文件，它将在注册的 Web 应用程序中自动打开。在此类主机操作系统上，当用户代理确定文件类型没有现有的默认处理程序时，可能需要明确的权限提示才能避免在未经用户同意的情况下意外将文件内容发送到 Web 应用程序。

### 用户控制

该规范指出浏览器不能将每个可以处理文件的站点都注册为文件处理程序。文件处理注册应在安装之后实施门控，并且在用户没有明确确认的情况下永远不能注册，尤其是当站点将成为默认处理程序时。网站应考虑创建自己的扩展名，而不是劫持用户可能已注册默认处理程序的 `.json` 等现有扩展名。

### 透明度

所有操作系统都允许用户更改当前文件关联。这超出了浏览器的范围。

## 反馈意见 {: #feedback }

Chrome 团队希望了解您使用文件处理 API 的经验。

### 告诉我们您对 API 设计的看法

API 是否符合您的预期？是否缺少实现您的想法所需的方法或属性？或者是您对安全模型有疑问或意见？

- 请在相应的 [GitHub 存储库](https://github.com/WICG/file-handling/issues)上提交规范问题，或将您的想法添加到现有问题中。

### 报告实现问题

您是否发现 Chrome 实现存在错误？或者实现与规范不同？

- 在 [new.crbug.com](https://new.crbug.com) 上提交错误。请务必尽可能提供更多详细信息，简单的重现说明，并在**组件**框中输入 `UI>Browser>WebAppInstalls>FileHandling`。[Glitch](https://glitch.com/) 非常适合共享快速简单的重现。

### 展示您对 API 的支持

您是否打算使用文件处理 API？您的公开支持有助于 Chrome 团队确定功能的优先级，并向其他浏览器供应商展示支持这些功能的重要性。

- 请前往 [WICG Discourse 帖子](https://discourse.wicg.io/t/proposal-ability-to-register-file-handlers/3084)分享您的使用计划。
- 发一条推文给 [@ChromiumDev](https://twitter.com/search?q=%23FileHandling&src=typed_query&f=live) 并添加话题标签 [`#FileHandling`](https://twitter.com/search?q=%23FileHandling&src=typed_query&f=live)，让我们知道您在何处以及如何使用它。

## 实用链接 {: #helpful }

- [公共解释文档](https://github.com/WICG/file-handling/blob/main/explainer.md)
- [文件处理 API 演示](https://excalidraw.com/)| [文件处理 API 演示源代码](https://github.com/excalidraw/excalidraw/search?q=launchqueue&type=code)
- [Chromium 跟踪错误](https://bugs.chromium.org/p/chromium/issues/detail?id=829689)
- [ChromeStatus.com 条目](https://chromestatus.com/feature/5721776357113856)
- Blink 组件：[`UI>Browser>WebAppInstalls>FileHandling`](https://bugs.chromium.org/p/chromium/issues/list?q=component:UI%3EBrowser%3EWebAppInstalls%3EFileHandling)
- [TAG 审阅](https://github.com/w3ctag/design-reviews/issues/371)
- [Mozilla 标准定位](https://github.com/mozilla/standards-positions/issues/158)

## 鸣谢

文件处理 API 由[Eric Willigers](https://github.com/ericwilligers)、[Jay Harris](https://github.com/fallaciousreasoning) 和 [Raymes Khoury](https://github.com/raymeskhoury) 规范。本文由 [Joe Medley](https://github.com/jpmedley) 审阅。
