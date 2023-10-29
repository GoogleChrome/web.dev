---
title: 流   - 权威指南
subhead: 了解如何通过流式 API 使用可读流、可写流和转换流。
description: 流式 API 允许 JavaScript 以编程方式访问通过网络接收的数据流，并根据需要对其进行处理。
authors:
  - thomassteiner
date: 2021-02-19
updated: 2021-02-25
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/TuciUuOQOd3u7uMgDZBi.jpg
alt: 有彩色落叶的森林溪流。
tags:
  - blog
  - capabilities
---

利用流式 API 可以用编程方式访问通过网络接收或通过本地任何方式创建的数据流，并使用 JavaScript 对其进行处理。流式处理涉及将您想要接收、发送或转换的资源分解成小区块，然后一点一点地处理这些区块。虽然流式处理是浏览器在接收 HTML 或要在网页上显示的视频等资产时执行的操作，但在 2015 年引入通过流 `fetch` 之前，JavaScript 从未有过此功能。

{% Aside %} 流式处理在技术上可使用 `XMLHttpRequest` 实现，但它[实际上并不好用](https://gist.github.com/igrigorik/5736866)。{% endAside %}

以前，如果您想处理某种资源（无论是视频，还是文本文件等），您必须下载整个文件，等待其反序列化为合适的格式，然后再进行处理。JavaScript 可以使用流后，这一切都改变了。现在，只要客户端获得原始数据，即可通过 JavaScript 逐步处理原始数据，而无需生成缓冲区、字符串或 blob。这便解锁了许多用例，我在下面列出了其中一些用例：

- **视频效果：** 通过实时应用效果的转换流传输可读视频流。
- **数据（解）压缩：** 通过有选择地（解）压缩文件流的转换流来传输文件流。
- **图像解码：** 先后通过将字节解码为位图数据和将位图转换为 PNG 的不同转换流来传输 HTTP 响应流。如果安装在 Service Worker 的 `fetch` 处理程序内，便能明确地支持新的图像格式，如 AVIF。

## 核心概念

在详细介绍各种类型的流之前，我先介绍一些核心概念。

### 区块

区块 (chunk) 是写入流或从流中读取的**一块数据**。它可以是任何类型；流甚至可以包含不同类型的区块。大多数情况下，区块不会是给定流的最小数据单元。例如，字节流可能包含由 16 KiB `Uint8Array` 单元组成的区块，而不是单个字节。

### 可读流

可读流表示您可以从中读取的数据源。换句话说，数据**出自**可读流。具体来讲，可读流是 `ReadableStream` 类的实例。

### 可写流

可写流表示您可以在其中写入数据的目标。换句话说，数据**进入**可写流。具体来讲，可写流是 `WritableStream` 类的实例。

### 转换流

变换流包含**一对流**：可写流和可读流，分别称为可写侧和可读侧。这就好比是现实世界将一种语言即时翻译成另一种语言的[同声传译员](https://en.wikipedia.org/wiki/Simultaneous_interpretation)。以特定于转换流的方式，写入到可写端会导致新数据可用于从可读端读取。具体来讲，任何具有 `writable` 属性和 `readable` 属性的对象都可以用作转换流。然而，标准 `TransformStream` 类可以更容易地创建这样正确关联的一个配对。

### 管道链

流的主要使用方式是彼此之间**通过管道进行传输**。可读流可以通过管道直接传输到可写流，此时使用的是可读流的 `pipeTo()` 方法，也可以先通过一个或多个转换流进行传输，此时使用的是可读流的 `pipeThrough()` 方法。以这种方式**通过管道连接在一起的一组流**称为管道链。

### 背压

一旦构建了管道链，管道链将传播关于区块应该以多快的速度在其中流过的信号。如果链中的任何步骤还不能接受区块，它会通过管道链向后传播信号，直到最终原始源被告知停止如此快速地生成区块。这种**使流量正常化**的过程称为背压 (backpressure)。

###  T 型改造

可使用`tee()` 方法对可读流进行 T 型改造（以大写 'T' 的形状命名）。这将**锁定**流，也就是使其不再直接可用；但是，它会创建**两个新的流**，这两个流称为分支，可以独立使用。T 型改造也很重要，因为流不能倒回或重新启动，稍后我会详细介绍。

<figure><comment data-md-type="comment"></comment>{% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/M70SLIvXhMkYfxDm5b98.svg", alt="管道链图，其中包含一个可读流，该流来自 fetch API 的调用，然后通过输出已经过 T 型改造的转换流进行传输，之后再发送至第一个结果可读流的浏览器和第二个结果可读流的 Service Worker 缓存。", width="800", height="430" %}<figcaption>管道链。</figcaption></figure>

## 可读流的机制

可读流是在 JavaScript 中由从基础源流出的 [`ReadableStream`](https://developer.mozilla.org/docs/Web/API/ReadableStream) 对象表示的数据源。[`ReadableStream()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/ReadableStream) 构造函数从给定的处理程序创建并返回一个可读流对象。有两种类型的基础源：

- **推送源**会在您访问之后不断推送数据，您可以开始、暂停或取消对流的访问。示例包括实时视频流、服务器发送的事件或 WebSocket。
- **拉取源**要求您在连接之后明确向其请求数据。示例包括通过 `fetch()` 或 `XMLHttpRequest` 调用进行的 HTTP 操作。

流数据以称为**区块**的小段按顺序读取。放置在流中的区块即为**已排入队列**。这意味着它们正在可供读取的队列中等待。尚未读取的区块由**内部队列**跟踪。

**排队策略**是一个对象，用于根据其内部队列的状态确定流应如何发出背压信号。排队策略为每个区块分配一个大小，并将队列中所有区块的总大小与指定的数字（称为**高水位线**）进行比较。

流中的区块由**读取器** (reader) 读取。该读取器一次检索一个区块的数据，这样您便可以对其进行任何类型的操作。读取器加上与之相伴的其他处理代码称为**使用者** (consumer)。

下一个构造称为**控制器** (controller)。每个可读流都有一个关联的控制器，顾名思义，利用它可以控制流。

一次只能有一个读取器可以读取流；当创建某个读取器且其开始读取流（即成为**活动读取器**）时，它即**锁定**到流。如果您希望另一个读取器接管该流的读取工作，您通常需要先**释放**第一个读取器，然后再执行任何其他操作（尽管您可以对流进行 **T 型改造**）。

### 创建可读流

您可以通过调用可读流的构造函数 [`ReadableStream()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/ReadableStream) 来创建可读流。该构造函数有一个可选参数 `underlyingSource`，此参数表示一个对象，对象具有的方法和属性用于定义构造的流实例的行为方式。

#### `underlyingSource`

它可以使用以下开发人员定义的可选方法：

- `start(controller)`：在构造对象时立即调用。该方法可以访问流源，并执行设置流功能所需的任何其他操作。如果此过程将要异步完成，该方法可以返回 Promise 来表示成功或失败。传递给此方法的 `controller` 参数为 [`ReadableStreamDefaultController`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultController)。
- `pull(controller)`：可用于在提取更多区块时控制流。只要流的内部区块队列未满，就会重复调用它，直到队列达到其高水位线。如果调用 `pull()` 的结果是 Promise，`pull()` 将不会再次调用，直到所述 Promise 完成。如果 Promise 拒绝，流将出错。
- `cancel(reason)`：在流使用者取消流时调用。

```js
const readableStream = new ReadableStream({
  start(controller) {
    /* … */
  },

  pull(controller) {
    /* … */
  },

  cancel(reason) {
    /* … */
  },
});
```

`ReadableStreamDefaultController` 支持以下方法：

- [`ReadableStreamDefaultController.close()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultController/close) 关闭关联的流。
- [`ReadableStreamDefaultController.enqueue()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultController/enqueue) 将关联流中的给定区块排入队列。
- [`ReadableStreamDefaultController.error()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultController/error) 导致与关联流的任何未来交互出错。

```js
/* … */
start(controller) {
  controller.enqueue('The first chunk!');
},
/* … */
```

#### `queuingStrategy`

`ReadableStream()` 构造函数的第二个参数为 `queuingStrategy`，其同样是可选参数。它是一个有选择地为流定义排队策略的对象，采用两个参数：

- `highWaterMark`：一个非负数，指示使用此排队策略的流的高水位标记。
- `size(chunk)`：计算并返回给定区块值的有限非负大小的函数。结果用于确定背压，并通过适当的 `ReadableStreamDefaultController.desiredSize` 属性表现出来。它还控制何时调用基础源的 `pull()` 方法。

```js
const readableStream = new ReadableStream({
    /* … */
  },
  {
    highWaterMark: 10,
    size(chunk) {
      return chunk.length;
    },
  },
);
```

{% Aside %} 您可以定义您自己的自定义 `queuingStrategy`，也可以将 [`ByteLengthQueuingStrategy`](https://developer.mozilla.org/docs/Web/API/ByteLengthQueuingStrategy) 或 [`CountQueuingStrategy`](https://developer.mozilla.org/docs/Web/API/CountQueuingStrategy) 的实例用于此对象的值。如果未提供 `queuingStrategy`，则使用的默认值与 `CountQueuingStrategy` 相同且 `highWaterMark` 为 `1`。{% endAside %}

#### `getReader()` 方法和 `read()` 方法

要从可读流中读取，您需要一个读取器，也就是 [`ReadableStreamDefaultReader`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader)。`ReadableStream` 接口的 `getReader()` 方法创建一个读取器并将流锁定到它。当流被锁定时，在此读取器释放之前，无法获取其他读取器。

`ReadableStreamDefaultReader` 接口的 [`read()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader/read) 方法返回 Promise，并提供对流内部队列中下一个区块的访问。它根据流的状态完成或拒绝 Promise 并显示结果。各种可能的结果如下：

- 如果区块可用，则完成 Promise 且对象形式如下：<br>`{ value: chunk, done: false }`。
- 如果流关闭，则完成 Promise 且对象形式如下：<br> `{ value: undefined, done: true }`。
- 如果流出错，则会拒绝 Promise 并显示相关错误。

```js
const reader = readableStream.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) {
    console.log('流已完成。');
    break;
  }
  console.log('只读取区块：', value);
}
```

#### `locked` 属性

可通过访问 [`ReadableStream.locked`](https://developer.mozilla.org/docs/Web/API/ReadableStream/locked) 属性来检查可读流是否锁定。

```js
const locked = readableStream.locked;
console.log(`流 ${locked ? '确实' : '未'} 锁定。`);
```

### 可读流代码示例

以下代码示例显示了实际应用的所有步骤。您首先创建一个 `ReadableStream`，它在其 `underlyingSource` 参数（即 `TimestampSource` 类）中定义 `start()` 方法。此方法告诉流的 `controller` 在十秒内每秒钟对时间戳执行一次 `enqueue()`。最后，它告诉控制器对流执行 `close()`。您可以使用此流，具体方式是通过 `getReader()` 方法创建读取器并调用 `read()`，直到流处于 `done` 状态。

```js
class TimestampSource {
  #interval

  start(controller) {
    this.#interval = setInterval(() => {
      const string = new Date().toLocaleTimeString();
      // 向流中添加字符串。
      controller.enqueue(string);
      console.log(`已排入队列 ${string}`);
    }, 1_000);

    setTimeout(() => {
      clearInterval(this.#interval);
      // 10 秒后关闭流。
      controller.close();
    }, 10_000);
  }

  cancel() {
    // 这在读取器取消时调用。
    clearInterval(this.#interval);
  }
}

const stream = new ReadableStream(new TimestampSource());

async function concatStringStream(stream) {
  let result = '';
  const reader = stream.getReader();
  while (true) {
    // `read()` 方法返回 Promise，
    // 已接收到值时会对其进行解析。
    const { done, value } = await reader.read();
    // 结果对象包含两个属性：
    // `done`  - 流已为您提供其所有数据时为 `true`。
    // `value` - 某些数据。`done` 为 `true` 时始终为 `undefined`。
    if (done) return result;
    result += value;
    console.log(`目前读取 ${result.length} 个字符`);
    console.log(`最近读取的区块： ${value}`);
  }
}
concatStringStream(stream).then((result) => console.log('流完成', result));
```

### 异步迭代

在每次 `read()` 循环迭代时检查流是否为 `done` 状态可能不是最方便的 API。幸运的是，很快就会有更好的方法来做到这一点：异步迭代。

```js
for await (const chunk of stream) {
  console.log(chunk);
}
```

{% Aside 'caution' %} 异步迭代尚未在任何浏览器中实现。{% endAside %}

如今，使用异步迭代的解决方法是借助 helper 函数来实现行为。这样，您就可以在代码中使用该功能，如下面的代码段所示。

```js
function streamAsyncIterator(stream) {
  // 锁定流：
  const reader = stream.getReader();

  return {
    next() {
      // 流读取已使用 {done, value} 进行解析，因此
      // 我们只能调用读取：
      return reader.read();
    },
    return() {
      // 迭代器终止时释放锁定。
      reader.releaseLock();
      return {};
    },
    // for-await 无论传递的是什么都会调用它，因此
    // 迭代器往往返回自身。
    [Symbol.asyncIterator]() {
      return this;
    },
  };
}

async function example() {
  const response = await fetch(url);
  for await (const chunk of streamAsyncIterator(response.body)) {
    console.log(chunk);
  }
}
```

### 对可读流进行 T 型改造

`ReadableStream` 接口的 [`tee()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/tee) 方法对当前可读流进行 T 型改造，并返回一个包含两个结果分支的二元素数组作为新的 `ReadableStream` 实例。这允许两个 reader 同时读取一个流。例如，如果您想从服务器提取响应并将其流式处理至浏览器，同时还将其流式处理至 Service Worker 缓存，则可能会这样做。由于响应主体无法使用多次，因此需要两个副本才能实现此目的。要取消流，则需要取消两个结果分支。对流进行 T 型改造通常会在持续时间内锁定流，从而防止其他读取器将其锁定。

```js
const readableStream = new ReadableStream({
  start(controller) {
    // 由构造函数调用。
    console.log('[start]');
    controller.enqueue('a');
    controller.enqueue('b');
    controller.enqueue('c');
  },
  pull(controller) {
    // 控制器的队列为空时调用的是 `read()`。
    console.log('[pull]');
    controller.enqueue('d');
    controller.close();
  },
  cancel(reason) {
    // 流被取消时调用。
    console.log('[cancel]', reason);
  },
});

// 创建两个 `ReadableStream`。
const [streamA, streamB] = readableStream.tee();

// 以迭代方式逐个读取 streamA。通常，您
// 不会这样做，但您确实可以如此。
const readerA = streamA.getReader();
console.log('[A]', await readerA.read()); //=> {value: "a", done: false}
console.log('[A]', await readerA.read()); //=> {value: "b", done: false}
console.log('[A]', await readerA.read()); //=> {value: "c", done: false}
console.log('[A]', await readerA.read()); //=> {value: "d", done: false}
console.log('[A]', await readerA.read()); //=> {value: undefined, done: true}

// 以循环方式读取 streamB。这是从流中读取数据
// 的最常见方法。
const readerB = streamB.getReader();
while (true) {
  const result = await readerB.read();
  if (result.done) break;
  console.log('[B]', result);
}
```

## 可读字节流

对于表示字节的流，提供了可读流的扩展版本以有效地处理字节，特别是通过最小化副本数的方式。字节流允许获取自带缓冲区 (BYOB) 读取器。如果是 WebSocket，默认实现可以提供一系列不同的输出，例如字符串或数组缓冲区，而字节流则保证字节输出。此外，BYOB 读取器还具有稳定性优势。这是因为如果缓冲区分离，它可以保证一个人不会两次写入同一个缓冲区，从而避免出现竞争。 BYOB 读取器可以减少浏览器需要运行垃圾收集的次数，因为它可以重用缓冲区。

### 创建可读字节流

将附加的 `type` 参数传递至 `ReadableStream()` 构造函数可以创建可读字节流。

```js
new ReadableStream({ type: 'bytes' });
```

#### `underlyingSource`

可读字节流的基础源被赋予一个 `ReadableByteStreamController` 来操作。它的 `ReadableByteStreamController.enqueue()` 方法采用值为 `ArrayBufferView` 的 `chunk` 参数。`ReadableByteStreamController.byobRequest` 属性返回当前 BYOB 拉取请求，如果没有，则返回 null。最后，`ReadableByteStreamController.desiredSize` 属性返回填充受控流的内部队列所需的大小。

### `queuingStrategy`

`ReadableStream()` 构造函数的第二个参数为 `queuingStrategy`，也是可选参数。它是一个有选择地为流定义排队策略的对象，采用一个参数：

- `highWaterMark`：指示使用此排队策略的流的高水位标记的非负字节数。这用于确定背压，并通过适当的 `ReadableByteStreamController.desiredSize` 属性表现出来。它还控制何时调用基础源的 `pull()` 方法。

{% Aside %} 与其他流类型的排队策略不同，可读字节流的排队策略没有 `size(chunk)` 函数。每个区块的大小始终由其 `byteLength` 属性决定。{% endAside %}

{% Aside %} 如果未提供 `queuingStrategy`，则使用的默认值为 1 且 `highWaterMark` 为 `0`。{% endAside %}

#### `getReader()` 方法和 `read()` 方法

然后，您可以通过相应地设置 `mode` 参数来访问 `ReadableStreamBYOBReader`：`ReadableStream.getReader({ mode: "byob" })`。这样便可更精确地控制缓冲区分配以避免副本。要从字节流中读取，您需要调用 `ReadableStreamBYOBReader.read(view)`，其中 `view` 为 [`ArrayBufferView`](https://developer.mozilla.org/docs/Web/API/ArrayBufferView)。

#### 可读字节流代码示例

```js
const reader = readableStream.getReader({ mode: "byob" });

let startingAB = new ArrayBuffer(1_024);
const buffer = await readInto(startingAB);
console.log("第一个 1024 字节或更少:", buffer);

async function readInto(buffer) {
  let offset = 0;

  while (offset < buffer.byteLength) {
    const { value: view, done } =
        await reader.read(new Uint8Array(buffer, offset, buffer.byteLength - offset));
    buffer = view.buffer;
    if (done) {
      break;
    }
    offset += view.byteLength;
  }

  return buffer;
}
```

以下函数返回可读字节流，这些流可以对随机生成的数组进行高效的零拷贝读取。它并不使用预先确定的 1,024 区块大小，而是尝试填充开发人员提供的缓冲区，从而实现完全控制。

```js
const DEFAULT_CHUNK_SIZE = 1_024;

function makeReadableByteStream() {
  return new ReadableStream({
    type: 'bytes',

    pull(controller) {
      // 甚至在使用者使用默认读取器时，
      // 自动分配功能也会分配缓冲区并
      // 通过 `byobRequest` 将其传递给我们。
      const view = controller.byobRequest.view;
      view = crypto.getRandomValues(view);
      controller.byobRequest.respond(view.byteLength);
    },

    autoAllocateChunkSize: DEFAULT_CHUNK_SIZE,
  });
}
```

## 可写流的机制

可写流是可在其中写入数据的目标，在 JavaScript 中由 [`WritableStream`](https://developer.mozilla.org/docs/Web/API/WritableStream) 对象表示。它是基于**基础接收器**（在其中写入原始数据的较低级别 I/O 接收器）的抽象对象。

数据通过**编写器** (writer) 写入到流，一次一个区块。区块可以采用多种形式，就像读取器中的区块一样。您可以使用任何喜欢的代码来生成准备好写入的区块；编写器加上关联代码称为**制作者** (producer)。

编写器在创建后开始写入到流（成为**活动编写器**）时，即称为**锁定**到流。一次只有一个编写器可以写入到可写流。如果希望另一个编写器开始向您的流写入内容，通常需要先释放它，然后再向其附加另一个编写器。

**内部队列**跟踪已写入到流但尚未由基础接收器处理的区块。

**排队策略**是一个对象，用于根据其内部队列的状态确定流应如何发出背压信号。排队策略为每个区块分配一个大小，并将队列中所有区块的总大小与指定的数字（称为**高水位线**）进行比较。

最终构造称为**控制器**。每个可写流都有一个关联的控制器，可用于对流进行控制（例如，中止流）。

### 创建可写流

流 API 的 [`WritableStream`](https://developer.mozilla.org/docs/Web/API/WritableStream) 接口为将流数据写入到目标提供了标准抽象对象，称为接收器。此对象带有内置的背压和排队。您可以通过调用可写流的构造函数 [`WritableStream()`](https://developer.mozilla.org/docs/Web/API/WritableStream/WritableStream) 来创建可写流。它有一个可选的 `underlyingSink` 参数，该参数表示一个对象，对象具有的方法和属性用于定义构造的流实例的行为方式。

#### `underlyingSink`

`underlyingSink` 可以包括以下开发人员定义的可选方法。传递给某些方法的 `controller` 参数为 [`WritableStreamDefaultController`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultController)。

- `start(controller)`：在构造对象时立即调用此方法。此方法的内容应旨在访问基础接收器。如果此过程将要异步完成，它可以返回 Promise 来表示成功或失败。
- `write(chunk, controller)`：当新的数据区块（在 `chunk` 参数中指定）准备好写入到基础接收器时，将会调用此方法。它可以返回 Promise 来表示写入操作的成功或失败。此方法仅在先前的写入成功后才会调用，流关闭或中止后从不会调用。
- `close(controller)`：如果应用程序发出信号指示它已完成将区块写入到流，则将调用此方法。内容应执行任何必要操作来完成对基础接收器的写入，并释放对它的访问。如果此过程是异步的，它可以返回 Promise 来表示成功或失败。此方法仅在所有已排队的写入成功后才会调用。
- `abort(reason)`：如果应用发出信号指示它希望意外关闭流并将其置于错误状态，则将调用此方法。它可以清理任何持有的资源，很像 `close()`，但即使写入已排队，也会调用 `abort()`。那些区块将会被丢弃。如果此过程是异步的，它可以返回 Promise 来表示成功或失败。`reason` 参数包含一个 `DOMString`，用于描述流的中止原因。

```js
const writableStream = new WritableStream({
  start(controller) {
    /* … */
  },

  write(chunk, controller) {
    /* … */
  },

  close(controller) {
    /* … */
  },

  abort(reason) {
    /* … */
  },
});
```

流 API 的 [`WritableStreamDefaultController`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultController) 接口代表一个控制器，允许控制设置期间的 `WritableStream` 状态，因为更多的块被提交用于写入，或写入即将结束。在构造 `WritableStream` 时，基础接收器被赋予一个相应的 `WritableStreamDefaultController` 实例来操作。`WritableStreamDefaultController` 只有一个方法：[`WritableStreamDefaultController.error()`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultController/error)，它会导致将来与关联流的交互出错。

```js
/* … */
write(chunk, controller) {
  try {
    // 尝试对 `chunk` 做一些危险操作。
  } catch (error) {
    controller.error(error.message);
  }
},
/* … */
```

#### `queuingStrategy`

`WritableStream()` 构造函数的第二个参数为 `queuingStrategy`，其同样是可选参数。它是一个有选择地为流定义排队策略的对象，采用两个参数：

- `highWaterMark`：一个非负数，指示使用此排队策略的流的高水位标记。
- `size(chunk)`：计算并返回给定区块值的有限非负大小的函数。结果用于确定背压，并通过适当的 `WritableStreamDefaultWriter.desiredSize` 属性表现出来。

{% Aside %} 您可以定义您自己的自定义 `queuingStrategy`，也可以将 [`ByteLengthQueuingStrategy`](https://developer.mozilla.org/docs/Web/API/ByteLengthQueuingStrategy) 或 [`CountQueuingStrategy`](https://developer.mozilla.org/docs/Web/API/CountQueuingStrategy) 的实例用于此对象的值。如果未提供 `queuingStrategy`，则使用的默认值与 `CountQueuingStrategy` 相同且 `highWaterMark` 为 `1`。{% endAside %}

#### `getWriter()` 方法和 `write()` 方法

要写入到可写流，需要一个编写器，即 `WritableStreamDefaultWriter`。`WritableStream` 接口的 `getWriter()` 方法返回 `WritableStreamDefaultWriter` 的新实例并将流锁定到该实例。当流被锁定时，在当前编写器释放之前，无法获取其他编写器。

[`WritableStreamDefaultWriter`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/write) 接口的 [`write()`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter) 方法将传递的数据区块写入到 `WritableStream` 及其基础接收器，然后返回 Promise，其解析后可指示写入操作的成功或失败。请注意，“成功”的含义取决于基础接收器；它可能指示区块已被接受，并不一定表示区块已安全保存到其最终目标。

```js
const writer = writableStream.getWriter();
const resultPromise = writer.write('第一个区块！');
```

#### `locked` 属性

可通过访问 [`WritableStream.locked`](https://developer.mozilla.org/docs/Web/API/WritableStream/locked) 属性来检查可写流是否锁定。

```js
const locked = writableStream.locked;
console.log(`流 ${locked ? '确实' : '未'} 锁定。`);
```

### 可写流代码示例

以下代码示例显示了起作用的所有步骤。

```js
const writableStream = new WritableStream({
  start(controller) {
    console.log('[start]');
  },
  async write(chunk, controller) {
    console.log('[write]', chunk);
    // 等待下一个写入。
    await new Promise((resolve) => setTimeout(() => {
      document.body.textContent += chunk;
      resolve();
    }, 1_000));
  },
  close(controller) {
    console.log('[close]');
  },
  abort(reason) {
    console.log('[abort]', reason);
  },
});

const writer = writableStream.getWriter();
const start = Date.now();
for (const char of 'abcdefghijklmnopqrstuvwxyz') {
  // 等待添加到写入队列。
  await writer.ready;
  console.log('[ready]', Date.now() - start, 'ms');
  // 写入完成后对 Promise 进行解析。
  writer.write(char);
}
await writer.close();
```

### 将可读流通过管道传输到可写流

可读流可以通过可读流的 [`pipeTo()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/pipeTo) 方法传输到可写流。`ReadableStream.pipeTo()` 将当前 `ReadableStream` 通过管道传输到给定的 `WritableStream` 并返回 Promise，当传输过程成功完成时 Promise 的状态为完成，如果遇到错误，状态则为拒绝。

```js
const readableStream = new ReadableStream({
  start(controller) {
    // 由构造函数调用。
    console.log('[start readable]');
    controller.enqueue('a');
    controller.enqueue('b');
    controller.enqueue('c');
  },
  pull(controller) {
    // 控制器的队列为空时调用。
    console.log('[pull]');
    controller.enqueue('d');
    controller.close();
  },
  cancel(reason) {
    // 流被取消时调用。
    console.log('[cancel]', reason);
  },
});

const writableStream = new WritableStream({
  start(controller) {
    // 由构造函数调用。
    console.log('[start writable]');
  },
  async write(chunk, controller) {
    // writer.write() 时调用。
    console.log('[write]', chunk);
    // 等待下一个写入。
    await new Promise((resolve) => setTimeout(() => {
      document.body.textContent += chunk;
      resolve();
    }, 1_000));
  },
  close(controller) {
    console.log('[close]');
  },
  abort(reason) {
    console.log('[abort]', reason);
  },
});

await readableStream.pipeTo(writableStream);
console.log('[finished]');
```

## 创建转换流

流 API 的 `TransformStream` 接口表示一组可转换的数据。您可以通过调用转换流的构造函数 `TransformStream()` 来创建转换流，该构造函数从给定的处理程序创建并返回转换流对象。`TransformStream()` 构造函数接受其第一个参数作为可选的 JavaScript 对象，该对象表示 `transformer`。此类对象可以包含以下任一方法：

### `transformer`

- `start(controller)`：在构造对象时立即调用此方法。通常，此方法用于使用 `controller.enqueue()` 将前缀区块排入队列。这些区块将读取自可读端，但不依赖于对可写端的任何写入。如果此初始过程是异步的，例如由于获取前缀区块需要一些努力，则该函数可以返回 Promise 来表示成功或失败；被拒绝的 Promise 将导致流出错。`TransformStream()` 构造函数将重新抛出任何已抛出的异常。
- `transform(chunk, controller)`：当最初写入到可写端的新区块准备好进行转换时，会调用此方法。流实现可保证此函数仅在先前的转换成功后才会调用，在 `start()` 完成之前或 `flush()` 调用之后永远不会调用。该函数执行转换流的实际转换工作。它可以使用 `controller.enqueue()` 将结果排入队列。这样，写入到可写端的单个区块就可以在可读端产生零个或多个区块，具体取决于调用 `controller.enqueue()` 的次数。如果转换过程是异步的，则此函数可以返回 Promise 来表示转换成功或失败。被拒绝的 Promise 将导致转换流的可读端和可写端均出错。如果未提供 `transform()` 方法，则使用身份转换，它会将区块按原样从可写端排入到可读端的队列。
- `flush(controller)`：当写入到可写端的所有区块均成功通过 `transform()` 完成转换后会调用此方法，此时可写端即将关闭。通常，此方法用于将后缀区块排入到可读端的队列，然后再关闭可读端。如果刷新过程是异步的，该函数可以返回 Promise 来表示成功或失败；结果将传达给 `stream.writable.write()` 的调用方。此外，被拒绝的 Promise 将导致流的可读端和可写端均出错。抛出异常会视为与返回被拒绝的 Promise 相同。

```js
const transformStream = new TransformStream({
  start(controller) {
    /* … */
  },

  transform(chunk, controller) {
    /* … */
  },

  flush(controller) {
    /* … */
  },
});
```

### `writableStrategy` 和 `readableStrategy` 排队策略

`TransformStream()` 构造函数的第二个和第三个可选参数是可选的 `writableStrategy` 和 `readableStrategy` 排队策略。它们的定义分别在[可读](#the-queuingstrategy)流和[可写](#the-queuingstrategy-3)流部分中概述。

### 转换流代码示例

以下代码示例显示了一个简单转换流的实际运用。

```js
// 请注意，现在已有 `TextEncoderStream` 和 `TextDecoderStream`。
// 此实例所示为以前的完成方法。
const textEncoderStream = new TransformStream({
  transform(chunk, controller) {
    console.log('[transform]', chunk);
    controller.enqueue(new TextEncoder().encode(chunk));
  },
  flush(controller) {
    console.log('[flush]');
    controller.terminate();
  },
});

(async () => {
  const readStream = textEncoderStream.readable;
  const writeStream = textEncoderStream.writable;

  const writer = writeStream.getWriter();
  for (const char of 'abc') {
    writer.write(char);
  }
  writer.close();

  const reader = readStream.getReader();
  for (let result = await reader.read(); !result.done; result = await reader.read()) {
    console.log('[value]', result.value);
  }
})();
```

### 通过转换流传输可读流

`ReadableStream` 接口的 [`pipeThrough()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/pipeThrough) 方法提供了一种通过转换流或任何其他可写/可读对来传输当前流的可链接方式。通过管道传输流通常会在管道持续时间内锁定流，从而防止其他读取器将其锁定。

```js
const transformStream = new TransformStream({
  transform(chunk, controller) {
    console.log('[transform]', chunk);
    controller.enqueue(new TextEncoder().encode(chunk));
  },
  flush(controller) {
    console.log('[flush]');
    controller.terminate();
  },
});

const readableStream = new ReadableStream({
  start(controller) {
    // 由构造函数调用
    console.log('[start]');
    controller.enqueue('a');
    controller.enqueue('b');
    controller.enqueue('c');
  },
  pull(controller) {
    // 控制器的队列为空时调用读取
    console.log('[pull]');
    controller.enqueue('d');
    controller.close(); // 或 controller.error();
  },
  cancel(reason) {
    // rs.cancel(reason) 时调用
    console.log('[cancel]', reason);
  },
});

(async () => {
  const reader = readableStream.pipeThrough(transformStream).getReader();
  for (let result = await reader.read(); !result.done; result = await reader.read()) {
    console.log('[value]', result.value);
  }
})();
```

下一个代码示例（有点刻意）展示了如何实现 `fetch()` 的“呼喊”版本，该版本通过将返回的响应 Promise [作为流](https://developer.mozilla.org/docs/Web/API/Streams_API/Using_readable_streams#consuming_a_fetch_as_a_stream)使用并对区块逐个大写来大写所有文本。此方法的优点是您不需要等待整个文档下载完毕，这在处理大文件时会有很大的不同。

```js
function upperCaseStream() {
  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk.toUpperCase());
    },
  });
}

function appendToDOMStream(el) {
  return new WritableStream({
    write(chunk) {
      el.append(chunk);
    }
  });
}

fetch('./lorem-ipsum.txt').then((response) =>
  response.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(upperCaseStream())
    .pipeTo(appendToDOMStream(document.body))
);
```

## 浏览器支持和补丁

各浏览器对流 API 的支持各不相同。请务必查看[我可以使用](https://caniuse.com/streams)以获取详细的兼容性数据。请注意，某些浏览器仅具有某些功能的部分实现，因此请务必彻底检查数据。

好消息是有一个可用的[参考实现](https://github.com/whatwg/streams/tree/master/reference-implementation)和一个面向生产用途的 [polyfill](https://github.com/MattiasBuelens/web-streams-polyfill) (补丁)。

{% Aside 'gotchas' %} 如果可能，仅当内置功能不可用时，有条件地加载补丁。{% endAside %}

## 演示

以下演示显示了实际运用的可读流、可写流和转换流。它还包括 `pipeThrough()` 和 `pipeTo()` 管道链的示例，并且还演示了 `tee()`。您可以选择在自己的窗口中运行[演示](https://streams-demo.glitch.me/)或查看[源代码](https://glitch.com/edit/#!/streams-demo?path=script.js)。

{% Glitch 'streams-demo' %}

## 浏览器中提供的有用流

浏览器中内置了许多有用的流。您可以轻松地从 blob 创建 `ReadableStream`。[`Blob`](https://developer.mozilla.org/docs/Web/API/Blob) 接口的 [stream()](https://developer.mozilla.org/docs/Web/API/Blob/stream) 方法返回一个 `ReadableStream`，其在读取时返回 blob 中包含的数据。另请记得，[`File`](https://developer.mozilla.org/docs/Web/API/File) 对象是一种特定类型的 `Blob`，可在任何可以使用 blob 的上下文中使用。

```js
const readableStream = new Blob(['hello world'], { type: 'text/plain' }).stream();
```

`TextDecoder.decode()` 和 `TextEncoder.encode()` 的流变体分别称为 [`TextDecoderStream`](https://encoding.spec.whatwg.org/#interface-textdecoderstream) 和 [`TextEncoderStream`](https://encoding.spec.whatwg.org/#interface-textencoderstream)。

```js
const response = await fetch('https://streams.spec.whatwg.org/');
const decodedStream = response.body.pipeThrough(new TextDecoderStream());
```

[`CompressionStream`](https://wicg.github.io/compression/#compression-stream) 和 [`DecompressionStream`](https://wicg.github.io/compression/#decompression-stream) 转换流分别可以轻松地压缩和解压缩文件。下面的代码示例展示了如何下载流规范、在浏览器中对其进行压缩 (gzip)，然后将压缩文件直接写入到磁盘。

```js
const response = await fetch('https://streams.spec.whatwg.org/');
const readableStream = response.body;
const compressedStream = readableStream.pipeThrough(new CompressionStream('gzip'));

const fileHandle = await showSaveFilePicker();
const writableStream = await fileHandle.createWritable();
compressedStream.pipeTo(writableStream);
```

[文件系统访问 API](/file-system-access/) 的 [`FileSystemWritableFileStream`](https://wicg.github.io/file-system-access/#filesystemwritablefilestream) 和实验性 [`fetch()` 请求流](/fetch-upload-streaming/#writable-streams)是自然情况下可写流的示例。

[串行 API](/serial/) 大量使用可读流和可写流。

```js
// 提示用户选择任何串行端口。
const port = await navigator.serial.requestPort();
// 等待串行端口开放。
await port.open({ baudRate: 9_600 });
const reader = port.readable.getReader();

// 监听来自串行设备的数据。
while (true) {
  const { value, done } = await reader.read();
  if (done) {
    // 允许串行端口稍后关闭。
    reader.releaseLock();
    break;
  }
  // 值为 Uint8Array。
  console.log(value);
}

// 写入到串行端口。
const writer = port.writable.getWriter();
const data = new Uint8Array([104, 101, 108, 108, 111]); // 你好
await writer.write(data);
// 允许串行端口稍后关闭。
writer.releaseLock();
```

最后，[`WebSocketStream`](/websocketstream/) API 将流与 WebSocket API 集成在一起。

```js
const wss = new WebSocketStream(WSS_URL);
const { readable, writable } = await wss.connection;
const reader = readable.getReader();
const writer = writable.getWriter();

while (true) {
  const { value, done } = await reader.read();
  if (done) {
    break;
  }
  const result = await process(value);
  await writer.write(result);
}
```

## 实用资源

- [流规范](https://streams.spec.whatwg.org/)
- [配套演示](https://streams.spec.whatwg.org/demos/)
- [流补丁](https://github.com/MattiasBuelens/web-streams-polyfill)
- [2016 - Web 流年](https://jakearchibald.com/2016/streams-ftw/)
- [异步迭代器和生成器](https://jakearchibald.com/2017/async-iterators-and-generators/)
- [流可视化工具](https://surma.dev/lab/whatwg-stream-visualizer/lab.html)

## 鸣谢

本文由 [Jake Archibald](https://jakearchibald.com/) 、[François Beaufort](https://github.com/beaufortfrancois) 、[Sam Dutton](https://samdutton.com/) 、[Mattias Buelens](https://github.com/MattiasBuelens) 、[Surma](https://surma.dev/) 、[Joe Medley](https://github.com/jpmedley) 和 [Adam Rice](https://github.com/ricea) 审阅。[Jake Archibald](https://jakearchibald.com/) 的博客文章对于我对流的理解帮助良多。一些代码示例的灵感来自 GitHub 用户 [@bellbind](https://gist.github.com/bellbind/f6a7ba88e9f1a9d749fec4c9289163ac) 的探索，文章的部分内容在很大程度上基于[流的 MDN Web 文档](https://developer.mozilla.org/docs/Web/API/Streams_API)而构建。[流标准](https://streams.spec.whatwg.org/)的[作者](https://github.com/whatwg/streams/graphs/contributors)在编写本规范方面做了大量工作。主图由 [Ryan Lara](https://unsplash.com/@ryanlara) 在 [Unsplash](https://unsplash.com/) 上创作。
