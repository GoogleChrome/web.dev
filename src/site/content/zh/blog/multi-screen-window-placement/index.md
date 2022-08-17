---
title: 使用 Multi-Screen Window Placement API 管理多个显示器
subhead: 获取有关连接的显示器和相对于这些显示器的位置窗口的信息。
authors:
  - thomassteiner
description: Multi-Screen Window Placement API 允许您枚举连接到您的机器的显示器并将窗口放置到特定的屏幕上。
date: 2020-09-14
updated: 2021-11-10
tags:
  - blog
  - capabilities
hero: image/admin/9wQYJACMKOM6aUA0BPsW.jpg
alt: 显示多种假加密货币及其价格图表的模拟交易台。
origin_trial:
  url: "https://developer.chrome.com/origintrials/#/view_trial/-8087339030850568191"
feedback:
  - api
---

{% Aside %}Multi-Screen Window Placement API 是[功能项目](https://developer.chrome.com/blog/fugu-status/)的一部分，目前正在开发中。本文将随着实施的进展而更新。 {% endAside %}

Multi-Screen Window Placement API 允许您枚举连接到您的机器的显示器并将窗口放置在特定的屏幕上。

### 建议用例 {: #use-cases }

可能使用此 API 的网站示例包括：

- à la [Gimp](https://www.gimp.org/release-notes/gimp-2.8.html#single-window-mode) 多窗口图形编辑器可以在精确定位的窗口中放置各种编辑工具。
- 虚拟交易台可以在多个窗口中显示市场趋势，其中任何一个都可以在全屏模式下查看。
- 幻灯片应用可以在内部主屏幕上显示演讲者备注，在外部投影仪上显示演示文稿。

## 当前状态 {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">步骤</th>
<th data-md-type="table_cell">状态</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. 创建解释器</td>
<td data-md-type="table_cell"><a href="https://github.com/webscreens/window-placement/blob/main/EXPLAINER.md" data-md-type="link">完成</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. 创建规范初稿</td>
<td data-md-type="table_cell"><a href="https://webscreens.github.io/window-placement/" data-md-type="link">完成</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. 收集反馈并迭代设计</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">进行中</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. <strong data-md-type="double_emphasis">初始试用</strong>
</td>
<td data-md-type="table_cell"><strong data-md-type="double_emphasis"><p data-md-type="paragraph"><a href="https://developer.chrome.com/origintrials/#/view_trial/-8087339030850568191" data-md-type="link">进行中</a></p></strong></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. 发布</td>
<td data-md-type="table_cell">未开始</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## 如何使用 Multi-Screen Window Placement API {: #use }

### 通过 about://flags 启用

要在没有初始试用令牌的情况下在本地试验 Multi-Screen Window Placement API，请在 `about://flags` 中启用 `#enable-experimental-web-platform-features` 标志。

### 在初始试用期间启用支持

第一次初始试用在 Chromium 86 到 Chromium 88 版本间进行。在此次初始试用之后，我们对该 API 进行了一些[更改](https://github.com/webscreens/window-placement/blob/main/CHANGES.md)。本文也进行了相应的更新。

从 Chromium 93 开始，Multi-Screen Window Placement API 将再次作为 Chromium 中的初始试用版提供。第二次初始试用预计将以 Chromium 96（2021 年 12 月 15 日）结束。

{% include 'content/origin-trials.njk' %}

### 登记进行初始试用 {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### 问题

不幸的是，长久以来用于控制窗口的良好方法 [`Window.open()`](https://developer.mozilla.org/docs/Web/API/Window/open) 不兼容其他屏幕。虽然该 API 的某些方面看起来有点陈旧，例如它的 [`windowFeatures`](https://developer.mozilla.org/docs/Web/API/Window/open#Parameters:~:text=title.-,windowFeatures) `DOMString`参数，但多年来它一直为我们服务。要指定窗口的[位置](https://developer.mozilla.org/docs/Web/API/Window/open#Position)，您可以将坐标作为 `left` 和 `top`（或 `screenX` 和 `screenY` ）传递，并将所需的[大小](https://developer.mozilla.org/docs/Web/API/Window/open#Size:~:text=well.-,Size)作为 `width` 和 `height`（或分别为 `innerWidth` 和 `innerHeight`）传递。例如，要在距左侧 50 像素和距顶部 50 像素的位置打开一个 400×300 的窗口，您可以使用以下代码：

```js
const popup = window.open(
  'https://example.com/',
  'My Popup',
  'left=50,top=50,width=400,height=300',
);
```

通过查看 [`window.screen`](https://developer.mozilla.org/docs/Web/API/Window/screen) 属性可获取有关当前屏幕的信息，该属性会返回一个 [`Screen`](https://developer.mozilla.org/docs/Web/API/Screen) 对象。这是我的 MacBook Pro 13" 上的输出：

```js
window.screen;
/* Output from my MacBook Pro 13″:
  availHeight: 969
  availLeft: 0
  availTop: 25
  availWidth: 1680
  colorDepth: 30
  height: 1050
  isExtended: true
  onchange: null
  orientation: ScreenOrientation {angle: 0, type: "landscape-primary", onchange: null}
  pixelDepth: 30
  width: 1680
*/
```

像大多数从事技术工作的人一样，我不得不让自己适应新的工作现实并建立我的个人家庭办公室。我的办公室看起来像下面的照片（如果您有兴趣，可以阅读[有关我的设置的完整详细信息](https://blog.tomayac.com/2020/03/23/my-working-from-home-setup-during-covid-19/)）。我的 MacBook 旁边的 iPad 通过 [Sidecar](https://support.apple.com/en-us/HT210380) 连接到笔记本电脑，所以只要我需要，我可以快速将 iPad 变成第二个屏幕。

<figure>{% Img src="image/admin/Qt3SlHOLDzxpZ3l3bN5t.jpg", alt="两把椅子上的学校长凳。在学校长凳的顶部是支撑笔记本电脑和两个 iPad 的鞋盒。", width="558", height="520" %}<figcaption>多屏设置。</figcaption></figure>

如果我想利用更大的屏幕，我可以将上面[代码示例](/multi-screen-window-placement/#the-problem)中的弹出窗口放到第二个屏幕上。我这样做：

```js
popup.moveTo(2500, 50);
```

这是一个粗略的猜测，因为无法知道第二个屏幕的尺寸。`window.screen` 的信息仅涵盖内置屏幕，不包括 iPad 屏幕。内置屏幕的报告 `width` 为 `1680` 像素，因此移动到 `2500` 像素*可能*会将窗口转移到 iPad，因为*我*碰巧知道它位于我的 MacBook 的右侧。在一般情况下我该怎么做？事实证明，有比猜测更好的方法。这种方式就是 Multi-Screen Window Placement API。

### 功能检测

要检查是否支持 Multi-Screen Window Placement API，请使用：

```js
if ('getScreenDetails' in window) {
  // The Multi-Screen Window Placement API is supported.
}
```

### `window-placement` 权限

在我可以使用 Multi-Screen Window Placement API 之前，我必须征得用户的许可才能这样做。可以使用 [Permissions API](https://developer.mozilla.org/docs/Web/API/Permissions_API) 查询新的 `window-placement` 权限，如下所示：

```js
let granted = false;
try {
  const { state } = await navigator.permissions.query({ name: 'window-placement' });
  granted = state === 'granted';
} catch {
  // Nothing.
}
```

浏览器[可以](https://webscreens.github.io/window-placement/#usage-overview-screen-information:~:text=This%20method%20may%20prompt%20the%20user%20for%20permission)选择在第一次尝试使用新 API 的任何方法时动态显示权限提示。请继续阅读以了解更多信息。

### `window.screen.isExtended` 属性

要确定是否有多个屏幕连接到我的设备，我访问 `window.screen.isExtended` 属性。它返回 `true` 或 `false` 。对于我的设置，它返回 `true` 。

```js
window.screen.isExtended;
// Returns `true` or `false`.
```

### `getScreenDetails()` 方法

现在我知道当前设置是多屏幕的，我可以使用 `Window.getScreenDetails()` 获取有关第二个屏幕的更多信息。调用此函数将显示一个权限提示，询问我该站点是否可以在我的屏幕上打开和放置窗口。该函数返回一个使用 `ScreenDetailed` 对象解析的承诺。在连接 iPad 的 MacBook Pro 13 上，这包括一个带有两个 `ScreenDetailed`  对象的  `screens` 字段：

```js
await window.getScreenDetails();
/* Output from my MacBook Pro 13″ with the iPad attached:
{
  currentScreen: ScreenDetailed {left: 0, top: 0, isPrimary: true, isInternal: true, devicePixelRatio: 2, …}
  oncurrentscreenchange: null
  onscreenschange: null
  screens: [{
    // The MacBook Pro
    availHeight: 969
    availLeft: 0
    availTop: 25
    availWidth: 1680
    colorDepth: 30
    devicePixelRatio: 2
    height: 1050
    isExtended: true
    isInternal: true
    isPrimary: true
    label: ""
    left: 0
    onchange: null
    orientation: ScreenOrientation {angle: 0, type: "landscape-primary", onchange: null}
    pixelDepth: 30
    top: 0
    width: 1680
  },
  {
    // The iPad
    availHeight: 999
    availLeft: 1680
    availTop: 25
    availWidth: 1366
    colorDepth: 24
    devicePixelRatio: 2
    height: 1024
    isExtended: true
    isInternal: false
    isPrimary: false
    label: ""
    left: 1680
    onchange: null
    orientation: ScreenOrientation {angle: 0, type: "landscape-primary", onchange: null}
    pixelDepth: 24
    top: 0
    width: 1366
  }]
}
*/
```

`screens` 阵列中提供了有关连接屏幕的信息。请注意 iPad 的 `left` 值如何从 `1680` 开始，这正是内置显示器的 `width`。这使我能够准确地确定屏幕的逻辑排列方式（彼此相邻、彼此重叠等）。现在还有每个屏幕的数据来显示它是否是 `isInternal` 以及是否是 `isPrimary` 。请注意，内置屏幕[不一定是主屏幕](https://osxdaily.com/2010/04/27/set-the-primary-display-mac/#:~:text=Click%20on%20the%20Display%20icon,primary%20display%20for%20your%20Mac)。

`currentScreen` 字段是对应于当前 `window.screen` 的活动对象。对象在跨屏幕窗口放置或设备更改时更新。

### `screenschange` 事件

现在唯一缺少的是一种检测我的屏幕设置何时发生变化的方法。新事件 `screenschange` 正有这种作用：只要修改了屏幕坐标，它就会触发。 （请注意，事件名称中的“screens”是复数形式。）这意味着只要新屏幕或现有屏幕（在 Sidecar 的情况下是物理或虚拟的）插入或拔出，就会触发事件。

请注意，您需要异步查找新屏幕详细信息， `screenschange` 事件本身不提供此数据。要查找屏幕详细信息，请使用缓存 `Screens` 界面中的实时对象。

```js
const screenDetails = await window.getScreenDetails();
let cachedScreensLength = screenDetails.screens.length;
screenDetails.addEventListener('screenschange', (event) => {
  if (screenDetails.screens.length !== cachedScreensLength) {
    console.log(
      `The screen count changed from ${cachedScreensLength} to ${screenDetails.screens.length}`,
    );
    cachedScreensLength = screenDetails.screens.length;
  }
});
```

### `currentscreenchange` 事件

如果我只对当前屏幕的变化（即活动对象 `currentScreen` 的值）感兴趣，我可以监听 `currentscreenchange` 事件。

```js
const screenDetails = await window.getScreenDetails();
screenDetails.addEventListener('currentscreenchange', async (event) => {
  const details = screenDetails.currentScreen;
  console.log('The current screen has changed.', event, details);
});
```

### `change` 事件

最后，如果我只对具体屏幕的更改感兴趣，我可以侦听该屏幕的 `change` 事件。

```js
const firstScreen = (await window.getScreenDetails())[0];
firstScreen.addEventListener('change', async (event) => {
  console.log('The first screen has changed.', event, firstScreen);
});
```

### 新的全屏选项

到目前为止，您可以通过恰当命名的 [`requestFullScreen()`](https://developer.mozilla.org/docs/Web/API/Element/requestFullscreen) 方法请求以全屏模式显示元素。该方法采用 `options` 参数，您可以在其中传递 [`FullscreenOptions`](https://developer.mozilla.org/docs/Web/API/FullscreenOptions) 。到目前为止，它唯一的属性是 [`navigationUI`](https://developer.mozilla.org/docs/Web/API/FullscreenOptions/navigationUI) 。 Multi-Screen Window Placement API 添加了一个新的 `screen` 属性，允许您确定在哪个屏幕上启动全屏视图。例如，如果要使主屏幕全屏：

```js
try {
  const primaryScreen = (await getScreenDetails()).screens.filter((screen) => screen.isPrimary)[0];
  await document.body.requestFullscreen({ screen: primaryScreen });
} catch (err) {
  console.error(err.name, err.message);
}
```

### Polyfill

无法对 Multi-Screen Window Placement API 进行 polyfill，但您可以填充其形状，以便您可以专门针对新 API 进行编码：

```js
if (!('getScreenDetails' in window)) {
  // Returning a one-element array with the current screen,
  // noting that there might be more.
  window.getScreenDetails = async () => [window.screen];
  // Set to `false`, noting that this might be a lie.
  window.screen.isExtended = false;
}
```

API 的其他方面，即各种屏幕更改事件和 `FullscreenOptions` 的 `screen` 属性，将永远不会被不支持的浏览器分别触发或静默忽略。

## 演示

如果您和我一样，您会密切关注各种加密货币的发展。（实际上，我并非真正喜欢这个领域，只是，就本文而言，假设我喜欢。）为了跟踪我拥有的加密货币，我开发了一个网络应用，可以让我在生活中随时随地观看行情，例如在我舒适的床上，在那里我有一个不错的单屏幕设置。

<figure>{% Img src="image/admin/sSLkcAMHuqBaj4AmT5eP.jpg", alt="床尾的大电视屏幕，作者的腿部分可见。屏幕上是一个假的加密货币交易台。", width="800", height="863" %}<figcaption>放松和观察市场。</figcaption></figure>

这与加密有关，市场随时都可能变得忙碌。如果发生这种情况，我可以快速移动到我的办公桌上，那里有一个多屏幕设置。我可以单击任何货币的窗口，然后在对面屏幕的全屏视图中快速查看完整详细信息。下面是我在上次 [YCY bloodbath](https://www.youtube.com/watch?v=dQw4w9WgXcQ)期间拍摄的照片。它让我完全措手不及，让我[双手捂脸](https://www.buzzfeednews.com/article/gavon/brokers-with-hands-on-their-faces)。

<figure>{% Img src="image/admin/wFu8TBzOAqaKCgcERr3z.jpg", alt="作者双手捂着惊恐的脸盯着假加密货币交易台。", width="800", height="600" %}<figcaption>惊慌失措，目睹了 YCY bloodbath。</figcaption></figure>

您可以播放下面嵌入的[演示](https://window-placement.glitch.me/)，或在 glitch 上查看其[源代码](https://glitch.com/edit/#!/window-placement)。

<!-- Copy and Paste Me -->

<div class="glitch-embed-wrap" style="height: 800px; width: 100%;">   <iframe src="https://window-placement.glitch.me/" title="window-placement on Glitch" allow="fullscreen; window-placement" sandbox="allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## 安全和权限

Chrome 团队使用[控制对强大 Web 平台功能的访问](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md)中定义的核心原则设计并实现了 Multi-Screen Window Placement API，包括用户控制、透明度和人体工程学。Multi-Screen Window Placement API 公开了有关连接到设备的屏幕的新信息，增加了用户的指纹识别面，尤其是那些始终连接到其设备的多个屏幕的用户。作为此隐私问题的一种缓解措施，暴露的屏幕属性仅限于常见放置用例所需的最低限度。站点需要用户许可才能获取多屏信息并将窗口放置在其他屏幕上。

### 用户控制

用户可以完全控制其设置的曝光。他们可以接受或拒绝权限提示，并通过浏览器中的站点信息功能撤销之前授予的权限。

### 透明度

是否已授予使用 Multi-Screen Window Placement API 的权限这一事实在浏览器的站点信息中公开，也可通过 Permissions API 进行查询。

### 权限持久化

浏览器保留权限授予。可以通过浏览器的站点信息撤销该权限。

## 反馈意见 {: #feedback }

Chrome 团队希望了解您对 Multi-Screen Window Placement API 的体验。

### 告诉我们您对 API 设计的看法

API 是否符合您的预期？是否缺少实现您的想法所需的方法或属性？抑或是您对安全模型有疑问或意见？

- 请在相应的 [GitHub 存储库](https://github.com/webscreens/window-placement/issues)上提交规范问题，或将您的想法添加到现有问题中。

### 报告实施问题

您是否发现 Chrome 实现存在错误？或者实现与规范不同？

- 在 [new.crbug.com](https://new.crbug.com)上提交错误。请务必尽可能提供更多详细信息，简单的重现说明，并在**组件**框中输入 [`Blink>WindowDialog`](https://bugs.chromium.org/p/chromium/issues/list?q=component:Blink%3EWindowDialog)，[Glitch](https://glitch.com/) 非常适合共享快速简单的重现。

### 展示您对 API 的支持

您是否打算使用 Multi-Screen Window Placement API？您的公开支持有助于 Chrome 团队确定功能的优先级，并向其他浏览器供应商展示支持这些功能的重要性。

- 请前往 [WICG Discourse 帖子](https://discourse.wicg.io/t/proposal-supporting-window-placement-on-multi-screen-devices/3948)分享您的使用计划。
- 请向 [@ChromiumDev](https://twitter.com/search?q=%23WindowPlacement&src=typed_query&f=live) 发送带有 `#WindowPlacement` 标签的推文，让我们知道您在哪里以及以何种方式在使用它。
- 要求其他浏览器供应商实现 API。

## 实用链接 {: #helpful }

- [规范草案](https://webscreens.github.io/window-placement/)
- [公共解释文档](https://github.com/webscreens/window-placement/blob/main/EXPLAINER.md)
- [Multi-Screen Window Placement API 演示](https://window-placement.glitch.me/)| [Multi-Screen Window Placement API 演示源码](https://glitch.com/edit/#!/window-placement)
- [Chromium 跟踪错误](https://crbug.com/897300)
- [ChromeStatus.com 条目](https://chromestatus.com/feature/5252960583942144)
- Blink 组件：[`Blink>WindowDialog`](https://bugs.chromium.org/p/chromium/issues/list?q=component:Blink%3EWindowDialog)
- [TAG 审阅](https://github.com/w3ctag/design-reviews/issues/522)
- [实验意图](https://groups.google.com/a/chromium.org/g/blink-dev/c/C6xw8i1ZIdE/m/TJsr0zXxBwAJ)

## 致谢

Multi-Screen Window Placement API 规范由 [Victor Costan](https://www.linkedin.com/in/pwnall) 和 [Joshua Bell](https://www.linkedin.com/in/joshuaseanbell) 编辑。API 由 [Mike Wasserman](https://www.linkedin.com/in/mike-wasserman-9900a079/) 和 [Adrienne Walker](https://github.com/quisquous) 实施。本文由 [Joe Medley](https://github.com/jpmedley)、[François Beaufort](https://github.com/beaufortfrancois) 和 [Kayce Basques](https://github.com/kaycebasques) 审阅。在此表示衷心的感谢。一并感谢 Laura Torrent Puig 提供照片。
