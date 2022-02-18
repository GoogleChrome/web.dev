---
layout: post
title: 测量广告转化更私密的方式：事件转化测量 API
subhead: 一个可用作原始试验的全新网络 API，能够测量广告点击时带来的转化，而无需使用跨站标识符。
authors:
  - maudn
  - samdutton
hero: image/admin/wRrDtHNikUNqgdDewvYG.jpg
date: 2020-10-06
updated: 2020-05-04
tags:
  - blog
  - privacy
---

{% Aside 'caution' %} 事件转化测量 API 将更名为*归因报告 API* 并提供更多功能。

- 如果您正在 [Chrome 91](https://chromestatus.com/features/schedule) 及更低版本中尝试使用（[转化测量 API](https://github.com/WICG/conversion-measurement-api/blob/3e0ef7d3cee8d7dc5a4b953e70cb027b0e13943b/README.md)），请阅读本篇博文，了解该 API 使用方式的更多详情、用例和说明。
- 如果您对即将在 Chrome 中投入实验（原始试验）的该 API 的下一次迭代（归因报告）感兴趣，请[加入邮件列表](https://groups.google.com/u/1/a/chromium.org/g/attribution-reporting-api-dev)获取可用实验的相关更新。

{% endAside %}

为了测量广告活动的有效性，广告商和发布商需要知道哪些广告点击或查看带来了[转化](/digging-into-the-privacy-sandbox/#conversion)（例如购买或注册）。长久以来，这都是通过**第三方 cookie** 来实现的。现在，事件转化测量 API 能够将发布商网站上的事件与广告商网站上的后续转化相关联，而无需涉及可用于跨站识别用户的机制。

{% Aside %} **本提案需要您的反馈！**如果您希望发表意见，请在 API 提案的存储库中[创建问题](https://github.com/WICG/conversion-measurement-api/issues/)。{% endAside %}

{% Aside %}该 API 是隐私沙盒的一部分，这是一系列满足第三方用例的提案，同时无需第三方 cookie 或其他跨站跟踪机制。请参阅[深入挖掘隐私沙盒](/digging-into-the-privacy-sandbox)，了解有关全部提案的概述。{% endAside %}

## 通用术语

- **广告技术平台**：提供软件和工具从而使品牌或代理机构能够定位、交付和分析其数字广告的公司。
- **广告商**：为广告付费的公司。
- **发布商**：在其网站上展示广告的公司。
- **点击型转化**：归因于广告点击的转化。
- **浏览型转化**：归因于广告展示的转化（用户未与广告交互，而稍后又发生了转化）。

## 谁需要了解此 API：广告技术平台、广告商和发布商

- **广告技术平台**（例如**[需求方平台](https://en.wikipedia.org/wiki/Demand-side_platform)**）可能会有兴趣使用此 API 来支持当前依赖第三方 cookie 的功能。如果您正在研究转化测量系统：请[尝试演示版](#demo)、[使用该 API 进行实验](#experiment-with-the-api)并[分享您的反馈](#share-your-feedback)。
- **依赖自定义代码进行广告或转化测量的广告商和发布商**可能同样有兴趣使用此 API 来替换现有技术。
- **依靠广告技术平台进行广告或转化测量的广告商和发布商**不需要直接使用 API，但可能会对[此 API 的基本原理](#why-is-this-needed)感兴趣，尤其是在您正在使用可能集成 API 的广告技术平台的情况下。

## API 概览

### 为什么需要这个 API？

如今，广告转化测量通常依赖于[第三方 cookie](https://developer.mozilla.org/docs/Web/HTTP/Cookies#Third-party_cookies)。**但是浏览器正在限制获取这些 cookie。**

Chrome 计划[逐步停止对第三方 cookie 的支持，](https://blog.chromium.org/2020/01/building-more-private-web-path-towards.html)并[为用户提供阻止这些 cookie 的方法和选项](https://support.google.com/chrome/answer/95647?co=GENIE.Platform%3DDesktop&hl=en)。Safari [阻止第三方 cookie](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)，Firefox [阻止已知的第三方跟踪 cookie](https://blog.mozilla.org/blog/2019/09/03/todays-firefox-blocks-third-party-tracking-cookies-and-cryptomining-by-default)，而 Edge [提供反跟踪功能](https://support.microsoft.com/en-us/help/4533959/microsoft-edge-learn-about-tracking-prevention?ocid=EdgePrivacySettings-TrackingPrevention)。

第三方 cookie 正在成为一种传统解决方案。像此 API 这样的**新型专用 API** 正在兴起，通过保护隐私的方式来解决以往利用第三方 cookie 解决的用例。

**事件转化测量 API 与第三方 cookie 相比如何？**

- 与 cookie 不同，该 API **专为**测量转化**而构建**。这反过来又可以使浏览器应用更多增强的隐私保护。
- **更加私密**：该 API 使得在两个不同的顶级网站上识别同一位用户（例如将发布商端和广告商端的用户资料联系起来）变得困难。请参阅[该 API 如何保护用户隐私](#how-this-api-preserves-user-privacy)。

### 第一次迭代

此 API 还处于**早期实验阶段**。将其用作原始试验是**第一次迭代**中的功能。在[未来迭代](#use-cases)中，情况可能会发生重大变化。

### 仅支持点击型

本次 API 迭代仅支持**点击型转化测量**， [浏览型转化测量](https://github.com/WICG/conversion-measurement-api/blob/main/event_attribution_reporting.md)正在进行公开孵化。

### 运作方式

<figure>{% Img src="image/admin/Xn96AVosulGisR6Hoj4J.jpg", alt="图解：转化测量 API 步骤概览", width="800", height="496" %}</figure>

此 API 可以与两类用于广告的链接（`<a>`元素）一起使用：

- **第一方**上下文中的链接，例如社交网络或搜索引擎结果页面上的广告；
- **第三方 iframe** 中的链接，例如使用第三方广告技术提供商的发布商网站上的链接。

通过此 API，可以使用于广告转化的特定属性来配置这类出站链接：

- 附加到发布商端广告点击的自定义数据，例如点击 ID 或活动 ID。
- 该广告预期会发生转化的网站。
- 应该收到成功转化通知的报告端点。
- 无法再计入广告转化的截止日期和时间。

当用户点击广告时，用户本地设备上的浏览器会记录此事件以及由`<a>`元素上的转化测量属性指定的转化配置和点击数据。

稍后，用户可能会访问广告商的网站并执行由广告商或其广告技术提供商归类为**转化**的操作。如果发生这种情况，那么用户浏览器就会匹配广告点击和转化事件。

浏览器最终安排将**转化报告**发送给`<a>`元素属性中指定的端点。该报告包含有关促成此次转化的广告点击数据以及有关转化的数据。

如果某次给定的广告点击注册了多次转化，则浏览器会安排发送尽可能多的相应报告（每次广告点击最多发送三次）。

报告会延迟发送：转化后数天或有时数周（请参阅[报告时间](#report-timing)了解具体原因）。

## 浏览器支持和类似 API

### 浏览器支持

对事件转化测量 API 提供的支持：

- 作为一个[原始试验](/origin-trials/)。原始试验为一个给定[域](/same-site-same-origin/#origin)的**所有访问者**启用 API。**您需要为原始试验注册您的域，以便对最终用户试用 API**。请参阅[使用转化测量 API](/using-conversion-measurement)，了解原始试验的相关详情。
- 通过在 Chrome 86 及更高版本中开启标志。标志会在**单个用户**的浏览器上启用 API。**标志在本地开发时十分有用**。

请在 [Chrome 功能条目](https://chromestatus.com/features/6412002824028160)上查看当前状态的相关详情。

### 标准化

此 API 是在网络平台孵化器社区组（[WICG](https://www.w3.org/community/wicg/)）中进行公开设计的，目前可以在 Chrome 中进行实验。

### 类似 API

Safari 使用的网络浏览器引擎 WebKit 有一个具有类似目标的提案，即[私人点击测量](https://github.com/privacycg/private-click-measurement)。隐私社区组（[PrivacyCG](https://www.w3.org/community/privacycg/)）正在对该提案进行研究。

## 此 API 如何保护用户隐私

通过使用此 API，您就可以在保护用户隐私的同时测量转化：用户无法被跨站识别。这是通过**数据限制**、**向转化数据中添加噪声**以及**报告时间**机制实现的。

让我们仔细看看这些机制的工作原理及其在实践中的意义。

### 数据限制

在下文中，**点击时间或浏览时间数据**是`adtech.example`在广告被提供给用户，然后被点击或浏览时获得的数据。转化发生时的数据是**转化时间数据**。

我们来看看一个**发布商**`news.example`和一个**广告商**`shoes.example`的情况。发布商网站`news.example`上有来自**广告技术平台**`adtech.example`的第三方脚本，其中包含广告商`shoes.example`的广告。`shoes.example`还包括`adtech.example`脚本，用以检测转化。

`adtech.example`可以了解到网络用户的多少信息？

#### 使用第三方 cookie

<figure>{% Img src="image/admin/kRpuY2r7ZSPtADz7e1P5.jpg", alt="图解：第三方 cookie 如何实现跨站用户识别", width="800", height="860" %}</figure>

`adtech.example`依赖一个**第三方 cookie 作为唯一的跨站标识符**来**跨站识别用户**。此外， `adtech.example`可以**同时**访问详细的点击或浏览时间数据以及详细的转化时间数据，并将数据联系起来。

因此，`adtech.example`可以跨站跟踪单个用户在浏览和点击广告，以及转化之间的行为。

由于`adtech.example`通常会出现在大量发布商和广告商的网站上（而不仅仅是`news.example`和`shoes.example`），因此用户在整个网络上的行为都可以被跟踪。

#### 使用事件转化测量 API

<figure>{% Img src="image/admin/X6sfyeKGncVm0LJSYJva.jpg", alt="图解：API 如何在避免跨站用户识别的情况下启用转化测量", width="800", height="643" %}<figcaption>cookie 图解中的"广告 ID"和"点击 ID"都是可以映射到详细数据的标识符。在这张图解中，标识符被称为"点击 ID"，因为该 API 仅支持点击型转化测量。</figcaption></figure>

`adtech.example`无法使用跨站标识符，因此**无法跨站识别用户**。

- 64 位标识符可以附加到广告点击上。
- 只有 3 位的转化数据可以附加到转化事件中。3 位可以拟合到一个从 0 到 7 的整数值。虽然数据不多，但足以让广告商了解如何对未来的广告预算支出做出正确的决定（例如通过训练数据模型）。

{% Aside %}点击数据和转化数据绝不会在同一上下文中暴露到 JavaScript 环境。{% endAside %}

#### 如果没有第三方 cookie 替代方案

如果没有像事件转化测量 API 这样的第三方 cookie 替代方案，转化就无法进行归因：如果`adtech.example`同时出现在发布商和广告商的网站上，它可能会访问点击时间或转化时间数据，但无法将数据联系起来。

在这种情况下，虽然用户隐私得到了保护，但广告商也无法对其广告支出进行优化。因此我们才需要像事件转化测量 API 这样的替代方案。

### 向转化数据中添加噪声

转化时收集的 3 位数据是有**噪声**的。

例如，在 Chrome 的执行中，向数据中添加噪声的原理如下：API 在 5% 的时间里报告一个随机 3 位值，而不是实际的转化数据。

这可以保护用户免受隐私攻击。试图滥用多次转化的数据来创建标识符的行为者不再会对他们收到的数据有充分的信心，因此使得这些类型的攻击变得更加复杂。

请注意，您可以[恢复真实的转化计数](/using-conversion-measurement/#(optional)-recover-the-corrected-conversion-count)。

对点击数据和转化数据的总结：

<div>
  <table data-alignment="top">
    <thead>
      <tr>
        <th>数据</th>
        <th>大小</th>
        <th>示例</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>点击数据（<code>impressiondata</code>属性）</td>
        <td>64 位</td>
        <td>一个广告 ID 或点击 ID</td>
      </tr>
      <tr>
        <td>转化数据</td>
        <td>3 位，有噪声</td>
        <td>一个从 0 到 7 的整数，可以映射到一种转化类型：注册、完成结帐等。</td>
      </tr>
    </tbody>
  </table>
</div>

### 报告时间

如果某次给定的广告点击注册了多次转化，则浏览器会**为每次转化发送相应的报告，且每次点击最多发送 3 次**。

为了防止转化时间被用于从转化方获取更多信息而妨碍用户隐私，此 API 指定转化报告不会在转化发生后立即发送。在最初的广告点击后，与此次点击相关联的**报告窗口**时间表就会开始计时。每个报告窗口都有一个截止日期，在该截止日期前注册的转化将在窗口结束时发送。

报告也可能不会在这些准确的预定日期和时间发送：如果在预定发送报告时浏览器没有运行，则报告会在浏览器启动时发送，而这可能是预定时间之后的几天或几周。

到期后（点击时间 + `impressionexpiry`），浏览器将不再对广告转化进行计数，`impressionexpiry`是不再计入该广告转化的截止日期和时间。

在 Chrome 中，报告安排的运作方式如下：

<div>
  <table data-alignment="top">
    <thead>
      <tr>
        <th><code>impressionexpiry</code></th>
        <th>转化报告根据转化时间进行发送（如果浏览器处于打开状态）...</th>
        <th>报告窗口数</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>30 天，默认最大值</td>
        <td>
          <ul>
            <li>广告点击后 2 天</li>
            <li>或广告点击后 7 天</li>
            <li>或<code>impressionexpiry</code> = 广告点击后 30 天。</li>
          </ul>
        </td>
        <td>3</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code>在 7 到 30 天之间</td>
        <td>
          <ul>
            <li>广告点击后 2 天</li>
            <li>或广告点击后 7 天</li>
            <li>或广告点击后<code>impressionexpiry</code>。</li>
          </ul>
        </td>
        <td>3</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code>在 2 到 7 天之间</td>
        <td>
          <ul>
            <li>广告点击后 2 天</li>
            <li>或广告点击后<code>impressionexpiry</code>。</li>
          </ul>
        </td>
        <td>2</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code>不到 2 天</td>
        <td>
          <li>广告点击后 2 天</li>
        </td>
        <td>1</td>
      </tr>
    </tbody>
  </table>
</div>

<figure>{% Img src="image/admin/bgkpW6Nuqs5q1ddyMG8X.jpg", alt="何时发送什么报告的时间表", width="800", height="462" %}</figure>

请参阅[发送预定报告](https://github.com/WICG/conversion-measurement-api#sending-scheduled-reports)了解有关报告时间的更多详情。

## 示例

{% Aside %} 如需查看实际效果，请试用[演示版](https://goo.gle/demo-event-level-conversion-measurement-api)⚡️ 并查看相应的[代码](https://github.com/GoogleChromeLabs/trust-safety-demo/tree/main/conversion-measurement)。{% endAside %}

以下是 API 记录和报告转化的方式。请注意，这是当前 API 的点击转化流程工作方式。此 API 的未来迭代[可能会有所不同](#use-cases)。

### 广告点击（步骤 1 到 5）

<figure>{% Img src="image/admin/FvbacJL6u37XHuvQuUuO.jpg", alt="图解：广告点击和点击存储", width="800", height="694" %}</figure>

一个`<a>`广告元素在 iframe 中由`adtech.example`加载到发布商网站上。

广告技术平台开发者已经为`<a>`元素配置了转化测量属性：

```html
<a
  id="ad"
  impressiondata="200400600"
  conversiondestination="https://advertiser.example"
  reportingorigin="https://adtech.example"
  impressionexpiry="864000000"
  href="https://advertiser.example/shoes07"
>
  <img src="/images/shoe.jpg" alt="shoe" />
</a>
```

此代码指定了以下内容：

<div>
  <table data-alignment="top">
    <thead>
      <tr>
        <th>属性</th>
        <th>默认值、最大值、最小值</th>
        <th>示例</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
<code>impressiondata</code>（必需）：附加到广告点击的一个 <b>64 位</b>标识符。</td>
        <td>（无默认）</td>
        <td>一个动态生成的点击 ID，例如一个 64 位整数：<code>200400600</code>
</td>
      </tr>
      <tr>
        <td>
<code>conversiondestination</code>（必需）：该广告预期会发生转化的 <b><a href="/same-site-same-origin/#site" noopener="">eTLD + 1</a></b>。</td>
        <td>（无默认）</td>
        <td>
<code>https://advertiser.example</code>。<br>如果<code>conversiondestination</code>是<code>https://advertiser.example</code>，则<code>https://advertiser.example</code>和<code>https://shop.advertiser.example</code>上的转化都将进行归因。<br>如果<code>conversiondestination</code>是<code>https://shop.advertiser.example</code>，也会发生同样的情况：<code>https://advertiser.example</code>和<code>https://shop.advertiser.example</code>上的转化都将进行归因。</td>
      </tr>
      <tr>
        <td>
<code>impressionexpiry</code>（可选）：以毫秒为单位，该广告转化可以进行归因的截止时间。</td>
        <td>
<code>2592000000</code> = 30 天（以毫秒为单位）。<br><br>最大值：30 天（以毫秒为单位）。<br><br>最小值：2 天（以毫秒为单位）。</td>
        <td>点击后十天：<code>864000000</code>
</td>
      </tr>
      <tr>
        <td>
<code>reportingorigin</code>（可选）：报告已确认转化的目标。</td>
        <td>已添加链接元素的页面的顶级域。</td>
        <td><code>https://adtech.example</code></td>
      </tr>
      <tr>
        <td>
<code>href</code>：广告点击的预期目标。</td>
        <td><code>/</code></td>
        <td><code>https://advertiser.example/shoes07</code></td>
      </tr>
    </tbody>
  </table>
</div>

{% Aside %} 关于示例的一些说明：

- 尽管 API 目前仅支持点击型转化，但您会在 API 属性或 API 提案中看到"展示量"这个术语。这些名称可能会在 API 的未来迭代中更新。
- 广告并不一定要在 iframe 中，但本示例中的广告属于这一情况。

{% endAside %}

{% Aside 'gotchas' %}

- 通过`window.open`或`window.location`导航产生的流将不符合归因条件。

{% endAside %}

当用户点选或点击广告时，他们会导航到广告商的网站。导航提交后，浏览器会存储一个对象，其中包括`impressiondata`、`conversiondestination`、`reportingorigin`和`impressionexpiry`：

```json
{
  "impression-data": "200400600",
  "conversion-destination": "https://advertiser.example",
  "reporting-origin": "https://adtech.example",
  "impression-expiry": 864000000
}
```

### 转化和报告安排（步骤 6 到 9）

<figure>{% Img src="image/admin/2fFVvAwyiXSaSDp8XVXo.jpg", alt="图解：转化和报告安排", width="800", height="639" %}</figure>

用户直接在点击广告后或者在点击广告的一段时间后（例如在第二天）访问`advertiser.example`，浏览运动鞋并找到他们想要购买的一双，然后前往结帐。`advertiser.example`已经在结帐页面上包含了一个像素：

```html
<img
  height="1"
  width="1"
  src="https://adtech.example/conversion?model=shoe07&type=checkout&…"
/>
```

`adtech.example`收到此请求，并确定请求符合转化条件。这时候，API 需要请求浏览器记录一次转化。 `adtech.example`将所有转化数据压缩成 3 位的数据，即 0 到 7 之间的一个整数，例如，**结账**操作可能被映射为转化值 2。

然后，`adtech.example`向浏览器发送一个特定的注册转化重定向：

```js
const conversionValues = {
  signup: 1,
  checkout: 2,
};

app.get('/conversion', (req, res) => {
  const conversionData = conversionValues[req.query.conversiontype];
  res.redirect(
    302,
    `/.well-known/register-conversion?conversion-data=${conversionData}`,
  );
});
```

{% Aside %}`.well-known` URL 是一些特殊的 URL。这些 URL 使软件工具和服务器可以轻松发现网站常用的信息或资源，例如，用户可以在哪个页面上[更改他们的密码](/change-password-url/)。`.well-known`在此处的作用只是为了让浏览器将其识别为一个特殊转化请求。该请求实际上是由浏览器在内部取消的。{% endAside %}

浏览器收到此请求。在检测到`.well-known/register-conversion`时，浏览器：

- 会在存储中查找与该`conversiondestination`匹配的所有广告点击（因为浏览器是从一个已经在用户点击广告时被注册为`conversiondestination`的 URL 上收到转化的）。浏览器找到一天前在发布商网站上发生的广告点击。
- 为该广告点击注册一次转化。

多次广告点击都可以匹配一次转化：用户可能同时在`news.example`和`weather.example`上都点击了`shoes.example`广告。在这种情况下，多次点击将注册多次转化。

现在，浏览器知道自己需要向广告技术服务器通知此次转化，而更具体地说，浏览器必须通知在`<a>`元素和像素请求( `adtech.example` ) 中指定的`reportingorigin`。

为此，浏览器计划发送**转化报告**，即一个包含点击数据（来自发布商网站）和转化数据（来自广告商网站）的数据对象。在此示例中，用户在点击之后的一天发生了转化。因此，如果浏览器正在运行，报告预计会在之后一天，也就是点击后两天标记处发送。

### 发送报告（步骤 10 和 11）

<figure>{% Img src="image/admin/Er48gVzK5gHUGdDHWHz1.jpg", alt="图解：浏览器发送报告", width="800", height="533" %}</figure>

一到发送报告的预定时间，浏览器就会发送**转化报告**：浏览器会向`<a>`元素 ( `adtech.example` ) 中指定的报告域发送一个 HTTP POST。例如：

`https://adtech.example/.well-known/register-conversion?impression-data=200400600&conversion-data=2&credit=100`

所包括的参数有：

- 与原始广告点击相关的数据（`impression-data`）。
- 与转化相关的数据，[可能包含噪声](#noising-of-conversion-data)。
- 归因于该点击的转化功劳。此 API 遵循**最终点击归因**模型：最近一次匹配的广告点击功劳为 100，其他所有匹配的广告点击功劳为 0。

当广告技术服务器收到此请求时，就可以从中提取`impression-data`和`conversion-data`，即转化报告：

```json
{"impression-data": "200400600", "conversion-data": 3, "credit": 100}
```

### 后续转化和到期

随后，用户可能会再次发生转化，例如在`advertiser.example`上购买一个网球拍来和他们的鞋子搭配使用。这种情况下也是类似的流程：

- 广告技术服务器向浏览器发送转化请求。
- 浏览器将该转化与广告点击进行匹配，安排报告，稍后将其发送到广告技术服务器。

在`impressionexpiry`后，浏览器将不再对该广告点击的转化进行计数，并会将广告点击从浏览器存储中删除。

## 用例

### 目前支持哪些功能

- 测量点击型转化：确定哪些广告点击带来了转化，并获取有关转化的粗略信息。
- 收集数据从而优化广告选择，例如通过训练机器学习模型。

### 本次迭代不支持的功能

以下功能暂不支持，但可能会出现在该 API 的未来迭代中，或出现在[聚合](https://github.com/WICG/conversion-measurement-api/blob/master/AGGREGATE.md)报告中：

- 浏览型转化测量。
- [多个报告端点](https://github.com/WICG/conversion-measurement-api/issues/29)。
- [在 iOS/安卓应用程序中开始的网络转化](https://github.com/WICG/conversion-measurement-api/issues/54)。
- 转化提升测量/增量：对于转化行为因果差异的测量，测量看到广告的测试组和没有看到广告的对照组之间的差异。
- 非最终点击归因模型。
- 需要大量转化事件相关信息的用例。例如，粒度购买价值或产品类别。

在支持这些功能以及更多功能之前，我们必须向 API 添加**更多隐私保护机制**（噪声、更少的位数或其他限制）。

围绕更多可能实现的功能的公开讨论正在 [API 提案存储库的**问题**](https://github.com/WICG/conversion-measurement-api/issues)中展开。

{% Aside %}您的用例是否未被提及？您有关于此 API 的反馈吗？[欢迎分享](#share-your-feedback)。{% endAside %}

### 在未来的迭代中还可能会有什么变化

- 此 API 目前处于早期的实验阶段。在未来的迭代中，此 API 可能会发生重大变化，包括但不限于以下所列。该 API 的目标是在保护用户隐私的同时测量转化，因此任何有助于更好地解决这一用例的改变都将进行落实。
- API 和属性命名可能会发生变化。
- 点击数据和转化数据可能不需要进行编码。
- 3 位的转化数据限制可能会增加或减少。
- [可能会加入更多功能](#what-is-not-supported-in-this-iteration)，以及会在必要时添加**更多隐私保护**（噪声/更少的位数/其他限制）来支持这些新功能。

如需关注并参与有关新功能的讨论，请观看提案的 [GitHub 存储库](https://github.com/WICG/conversion-measurement-api/issues)并提交想法。

## 试试看

### 演示版

请试用[演示版](https://goo.gle/demo-event-level-conversion-measurement-api)。确保遵循"开始之前"的说明。

有关演示版的任何问题，请在推特上 [@maudnals](https://twitter.com/maudnals?lang=en) 或 [@ChromiumDev！](https://twitter.com/ChromiumDev)

### 试用 API

如果您打算（在本地或对最终用户）试用 API，请参阅[使用转化测量 API](/using-conversion-measurement) 。

### 分享您的反馈

**您的反馈至关重要**，这样新的转化测量 API 才能支持您的用例并提供良好的开发者体验。

- 如需报告 Chrome 执行过程中的错误，请[开立一项错误](https://bugs.chromium.org/p/chromium/issues/entry?status=Unconfirmed&components=Internals%3EConversionMeasurement&description=Chrome%20Version%3A%20%28copy%20from%20chrome%3A%2F%2Fversion%29%0AOS%3A%20%28e.g.%20Win10%2C%20MacOS%2010.12%2C%20etc...%29%0AURLs%20%28if%20applicable%29%20%3A%0A%0AWhat%20steps%20will%20reproduce%20the%20problem%3F%0A%281%29%0A%282%29%0A%283%29%0A%0AWhat%20is%20the%20expected%20result%3F%0A%0A%0AWhat%20happens%20instead%3F%0A%0AIf%20applicable%2C%20include%20screenshots%2Finfo%20from%20chrome%3A%2F%2Fconversion-internals%20or%20relevant%20devtools%20errors.%0A)。
- 如需分享关于 Chrome API 的反馈以及讨论用例，请在 [API 提案存储库](https://github.com/WICG/conversion-measurement-api/issues)中创建新问题或参与现有问题的讨论。同样，您也可以在 [API 提案存储库](https://github.com/privacycg/private-click-measurement/issues)中讨论 WebKit/Safari API 及其用例。
- 如需与行业专家讨论广告用例以及交换意见：加入[改善网络广告业务组](https://www.w3.org/community/web-adv/)。请加入[隐私社区组](https://www.w3.org/community/privacycg/)讨论 WebKit/Safari API 的相关问题。

### 留心关注

- 随着开发者反馈和用例的收集，事件转化测量 API 将随着时间的推移而不断发展。观看提案的 [GitHub 存储库](https://github.com/WICG/conversion-measurement-api/)。
- [聚合转化测量 API](https://github.com/WICG/conversion-measurement-api/blob/master/AGGREGATE.md) 的发展也将对此 API 的功能进行完善，敬请持续关注。

*非常感谢所有审稿人的贡献和反馈：特别是 Charlie Harrison、John Delaney、Michael Kleber 和 Kayce Basques。*

*首图作者：William Warby / [Unsplash](https://unsplash.com/photos/WahfNoqbYnM) 上的 @wawarby，已编辑。*
