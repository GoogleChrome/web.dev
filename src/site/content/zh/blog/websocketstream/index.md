---
title: WebSocketStream：对数据流集成 WebSocket API
subhead: 通过应用背压，避免应用被 WebSocket 消息淹没或者使用消息淹没 WebSocket 服务器。
authors:
  - thomassteiner
date: 2020-03-27
updated: 2021-02-23
hero: image/admin/8SrIq5at2bH6i98stCgs.jpg
alt: 一条正在向外淌水的消防水管。
description: WebSocketStream 将数据流与 WebSocket API 集成在一起，从而使您的应用对收到的消息应用背压。
tags:
  - blog
  - capabilities
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/1977080236415647745"
feedback:
  - api
---

## 背景

### WebSocket API

[WebSocket API](https://developer.mozilla.org/docs/Web/API/WebSockets_API) 为 [WebSocket 协议](https://tools.ietf.org/html/rfc6455)提供了一个 JavaScript 接口，从而可以实现用户浏览器和服务器之间的双向交互通信会话。通过此 API，您可以向服务器发送消息并接收事件驱动的响应，无需为了获取回复轮询服务器。

### Streams API

[Streams API](https://developer.mozilla.org/docs/Web/API/Streams_API) 允许 JavaScript 以编程方式访问通过网络接收的数据块流，并根据需要处理它们。数据流上下文中的一个重要概念是[背压](https://developer.mozilla.org/docs/Web/API/Streams_API/Concepts#Backpressure)。背压是指单个数据流或管道链调节读取或写入速度的过程。当数据流本身或管道链中较晚的数据流仍然在忙、且尚未准备好接受更多数据块时，它会通过管道链反向发送信号，来适当地减慢交付速度。

### 当前 WebSocket API 存在的问题

#### 无法对收到的消息应用背压

在使用当前 WebSocket API 时，对消息的反应发生在[`WebSocket.onmessage`](https://developer.mozilla.org/docs/Web/API/WebSocket/onmessage)，收到服务器发来的消息时会调用`EventHandler`。

假设您有一个应用需要在收到新消息时执行繁重的数据处理操作。您可能会设置类似于下面代码的流程，并且因为您要`await`（等待）`process()`调用的结果，结果应该让人满意，对吧？

```js
// A heavy data crunching operation.
const process = async (data) => {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      console.log('WebSocket message processed:', data);
      return resolve('done');
    }, 1000);
  });
};

webSocket.onmessage = async (event) => {
  const data = event.data;
  // Await the result of the processing step in the message handler.
  await process(data);
};
```

错了！当前 WebSocket API 存在的问题是无法应用背压。当消息抵达的速度比`process()`方法处理它们的速度更快时，渲染进程将通过缓冲用这些消息来填满内存，或者由于 100% 的 CPU 占用率而变得无法响应，或者同时出现两种情况。

#### 对发送的消息应用背压不符合人机工程学

对发送的消息应用背压是可能的，但这会涉及轮询[`WebSocket.bufferedAmount`](https://developer.mozilla.org/docs/Web/API/WebSocket/bufferedAmount)属性，这样做效率低下且与人机工程学的理念背道而驰。此只读属性会返回通过调用[`WebSocket.send()`](https://developer.mozilla.org/docs/Web/API/WebSocket/send)已加入队列但尚未传输到网络的数据字节数。发送完队列中的所有数据后，该值将重置为零，但如果您继续调用`WebSocket.send()`，这个值会继续提高。

## 什么是 WebSocketStream API？{: #what }

WebSocketStream API 通过将数据流与 WebSocket API 集成，来处理不存在或不符合人机工程学的背压问题。这意味着可以“免费”应用背压，无需任何额外负担。

### WebSocketStream API 的建议用例 {: #use-cases }

可以使用此 API 的网站示例包括：

- 需要保持交互性的高带宽 WebSocket 应用程序，特别是视频和屏幕共享应用。
- 同样，在浏览器中生成大量需要上传到服务器数据的视频捕捉等应用程序。通过背压，客户端可以停止生成数据，而不是在内存中积累数据。

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
<td data-md-type="table_cell"><a href="https://github.com/ricea/websocketstream-explainer/blob/master/README.md" data-md-type="link">已完成</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. 创建规范初稿</td>
<td data-md-type="table_cell"><a href="https://github.com/ricea/websocketstream-explainer/blob/master/README.md" data-md-type="link">进行中</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. 收集反馈并对设计进行迭代</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">进行中</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. 极早期试验</td>
<td data-md-type="table_cell"><a href="https://developers.chrome.com/origintrials/#/view_trial/1977080236415647745" data-md-type="link">已完成</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. 发布</td>
<td data-md-type="table_cell">未开始</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## 如何使用 WebSocketStream API {: #use }

### 介绍性示例

WebSocketStream API 是基于 Promise 的，这样在现代 JavaScript 世界中处理它就变得很自然。首先构造一个新的`WebSocketStream`并将 WebSocket 服务器的 URL 传递给它。接下来，您等待`connection`，这会产生[`ReadableStream`](https://developer.mozilla.org/docs/Web/API/ReadableStream/ReadableStream)和/或[`WritableStream`](https://developer.mozilla.org/docs/Web/API/WritableStream/WritableStream) 。

通过调用[`ReadableStream.getReader()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/getReader)方法，您最终获得了一个[`ReadableStreamDefaultReader`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader) ，然后您可以[`read()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader/read)（读取）其中的数据，直到数据流完成，即直到它返回形式为`{value: undefined, done: true}`的对象。

因此通过调用[`WritableStream.getWriter()`](https://developer.mozilla.org/docs/Web/API/WritableStream/getWriter)方法，您最终会获得一个[`WritableStreamDefaultWriter`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter) ，然后您就可以向其中[`write()`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/write)（写入）数据了。

```js
  const wss = new WebSocketStream(WSS_URL);
  const {readable, writable} = await wss.connection;
  const reader = readable.getReader();
  const writer = writable.getWriter();

  while (true) {
    const {value, done} = await reader.read();
    if (done) {
      break;
    }
    const result = await process(value);
    await writer.write(result);
  }
```

#### 背压

那么我们承诺的背压功能呢？正如我上面写的，你可以“免费”获得它，并不需要采取额外的步骤。如果`process()`需要额外的时间，则只有在管道准备好后才会处理下一条消息。同样， `WritableStreamDefaultWriter.write()`步骤只有在安全的情况下才会继续。

### 高级示例

WebSocketStream 的第二个参数是一个允许未来扩展的选项包。目前暂时只有一个`protocols` ，它的行为与[WebSocket 构造函数的第二个参数](https://developer.mozilla.org/docs/Web/API/WebSocket/WebSocket#Parameters:~:text=respond.-,protocols)相同：

```js
const chatWSS = new WebSocketStream(CHAT_URL, {protocols: ['chat', 'chatv2']});
const {protocol} = await chatWSS.connection;
```

选定的`protocol`以及潜在的`extensions`是`WebSocketStream.connection` promise 中可用的字典的一部分。此 promise 会提供有关实时连接的所有信息，因为如果连接失败则则无关紧要。

```js
const {readable, writable, protocol, extensions} = await chatWSS.connection;
```

### 有关关闭的 WebSocketStream 连接的信息

之前可从 WebSocket API 的[`WebSocket.onclose`](https://developer.mozilla.org/docs/Web/API/WebSocket/onclose)和[`WebSocket.onerror`](https://developer.mozilla.org/docs/Web/API/WebSocket/onerror)事件获得的信息现在可通过`WebSocketStream.closed` promise 获得。如果出现不洁关闭，promise 将拒绝，否则它将解析为服务器发送的代码和原因。

[`CloseEvent`状态代码列表中](https://developer.mozilla.org/docs/Web/API/CloseEvent#Status_codes)解释了所有可能的状态代码及其含义。

```js
const {code, reason} = await chatWSS.closed;
```

### 关闭 WebSocketStream 连接

可以使用[`AbortController`](https://developer.mozilla.org/docs/Web/API/AbortController)关闭 WebSocketStream。因此，将[`AbortSignal`](https://developer.mozilla.org/docs/Web/API/AbortSignal)传递给`WebSocketStream`构造函数。

```js
const controller = new AbortController();
const wss = new WebSocketStream(URL, {signal: controller.signal});
setTimeout(() => controller.abort(), 1000);
```

作为替代方案，您也可以使用`WebSocketStream.close()`方法，但其主要功用是允许指定发送到服务器的[代码](https://developer.mozilla.org/docs/Web/API/CloseEvent#Status_codes)和原因。

```js
wss.close({code: 4000, reason: 'Game over'});
```

### 逐步增强和互操作性

Chrome 是目前唯一实现 WebSocketStream API 的浏览器。对于与经典 WebSocket API 的互操作性，对接收到的消息应用背压是无法实现的。对已发送的消息应用背压是有可能的，但需要轮询[`WebSocket.bufferedAmount`](https://developer.mozilla.org/docs/Web/API/WebSocket/bufferedAmount)属性，这样效率低下且不符合人机工程学。

#### 功能检测

要检查是否支持 WebSocketStream API，请使用：

```javascript
if ('WebSocketStream' in window) {
  // `WebSocketStream` is supported!
}
```

## 演示

在支持的浏览器上，您可以在嵌入式 iframe 中或[直接在 Glitch 上](https://websocketstream-demo.glitch.me/)查看 WebSocketStream API 的运行情况。

{% Glitch { id: 'websocketstream-demo', path: 'public/index.html' } %}

## 反馈意见 {: #feedback }

Chrome 团队希望了解您使用 WebSocketStream API 的体验。

### 告诉我们您对 API 设计的看法

API 是否存在无法按预期工作的情况？或者是否缺少实现您的想法所需的方法或属性？对安全模型有疑问或评论？请在相应 [GitHub repo](https://github.com/ricea/websocketstream-explainer/issues) 上提交规范问题，或将您的想法添加到现有问题中。

### 报告实现问题

您是否发现 Chrome d 实现错误？或者实现与规范不同？请前往 [new.crbug.com](https://new.crbug.com) 提交错误。请务必提供尽可能多的细节、简单的重现说明，并进入 **Components** 框中的`Blink>Network>WebSockets`。[Glitch](https://glitch.com/) 非常适合共享快速简便的重现案例。

### 展示您对 API 的支持

您是否打算使用 WebSocketStream API？您的公开支持有助于 Chrome 团队确定功能的优先级，并向其他浏览器供应商展示支持这些功能的重要性。

请使用标签 [`#WebSocketStream`](https://twitter.com/search?q=%23WebSocketStream&src=typed_query&f=live)<a> 向 @ChromiumDev</a> 发送推文，与我们分享您的使用方式和地点。

## 实用链接 {: #helpful }

- [公共解释文档](https://github.com/ricea/websocketstream-explainer/blob/master/README.md)
- [WebSocketStream API 演示](https://websocketstream-demo.glitch.me/)| [WebSocketStream API 演示源码](https://glitch.com/edit/#!/websocketstream-demo)
- [跟踪缺陷](https://bugs.chromium.org/p/chromium/issues/detail?id=983030)
- [ChromeStatus.com 条目](https://chromestatus.com/feature/5189728691290112)
- Blink 组件：[`Blink>Network>WebSockets`](https://bugs.chromium.org/p/chromium/issues/list?q=component:Blink%3ENetwork%3EWebSockets)

## 鸣谢

WebSocketStream API 由 [Adam Rice](https://github.com/ricea) 和 [Yutaka Hirano](https://github.com/yutakahirano) 实现。主页横幅由 [Daan Mooij](https://unsplash.com/@daanmooij) 在 [Unsplash](https://unsplash.com/photos/91LGCVN5SAI)上提供。
