---
title: Streams—최종 가이드
subhead: Streams API를 통해 읽기, 쓰기 및 변환 스트림을 사용하는 방법에 대해 알아보세요.
description: Streams API를 사용하면 JavaScript가 네트워크를 통해 수신된 데이터 스트림에 프로그래밍 방식으로 액세스하여 원하는 대로 처리할 수 있습니다.
authors:
  - thomassteiner
date: 2021-02-19
updated: 2021-02-25
hero: image/8WbTDNrhLsU0El80frMBGE4eMCD3/TuciUuOQOd3u7uMgDZBi.jpg
alt: 낙엽이 물든 숲 속 개울
tags:
  - blog
  - capabilities
---

Streams API를 사용하면 네트워크를 통해 수신되거나 로컬에서 생성된 데이터 스트림에 프로그래밍 방식으로 액세스하고 JavaScript로 처리할 수 있습니다. 스트리밍은 수신, 전송 또는 작은 청크로 변환하려는 리소스를 분할한 다음 이러한 청크를 비트 단위로 처리하는 작업과 관련이 있습니다. 스트리밍은 웹 페이지에 표시할 HTML이나 비디오 같은 자산을 수신할 때 브라우저가 수행하는 것이지만, 이 기능은 2015년에 스트림이 포함된 `fetch`가 도입되기 전에는 JavaScript에서 사용할 수 없었습니다.

{% Aside %} `XMLHttpRequest`를 사용하여 기술적으로 스트리밍할 수 있었지만 [그리 효과적이지 않았습니다](https://gist.github.com/igrigorik/5736866). {% endAside %}

이전에는 어떤 종류의 리소스(비디오 또는 텍스트 파일 등)를 처리하려면 전체 파일을 다운로드하고 적절한 형식으로 역직렬화될 때까지 기다린 다음 처리해야 했습니다. JavaScript에서 스트림을 사용할 수 있게 되면서 이 모든 것이 바뀌었습니다. 이제 버퍼, 문자열 또는 blob을 생성할 필요 없이 클라이언트에서 사용 가능한 즉시 JavaScript를 사용해 원시 데이터를 점진적으로 처리할 수 있습니다. 이렇게 하면 여러 사용 사례가 잠금 해제됩니다. 그 중 일부는 아래에 나열되어 있습니다.

- **비디오 효과:** 실시간으로 효과를 적용하는 변환 스트림을 통해 읽기 가능한 비디오 스트림 파이핑합니다.
- **데이터 압축(압축 해제):** 파일 스트림을 선택적으로 압축(압축 해제)하는 변환 스트림을 통해 파이핑합니다.
- **이미지 디코딩:** 바이트를 비트맵 데이터로 디코딩하는 변환 스트림을 통해 HTTP 응답 스트림을 파이핑한 다음, 비트맵을 PNG로 변환하는 또 다른 변환 스트림을 통해 파이핑합니다. 서비스 작업자의 `fetch` 핸들러 내에 설치된 경우 이를 통해 AVIF와 같은 새 이미지 형식을 투명하게 폴리필할 수 있습니다.

## 핵심 개념

다양한 유형의 스트림에 대해 자세히 설명하기 전에 몇 가지 핵심 개념을 소개하겠습니다.

### 청크

청크는 스트림에 쓰거나 스트림에서 읽는 **단일 데이터 조각**입니다. 모든 유형이 될 수 있습니다. 스트림은 다른 유형의 청크를 포함할 수도 있습니다. 대부분의 경우 청크는 해당 스트림에 대한 가장 원자적인 단위의 데이터가 아닙니다. 예를 들어, 바이트 스트림에는 단일 바이트 대신 16KiB `Uint8Array`로 구성된 청크가 포함될 수 있습니다.

### 읽기 가능한 스트림

읽기 가능한 스트림은 읽을 수 있는 데이터 소스를 나타냅니다. 즉, 데이터는 읽기 가능한 스트림에서 **나옵니다**. 구체적으로, 읽기 가능한 스트림은 `ReadableStream` 클래스의 인스턴스입니다.

### 쓰기 가능한 스트림

쓰기 가능한 스트림은 쓸 수 있는 데이터의 대상을 나타냅니다. 즉, 데이터는 쓰기 가능한 스트림으로 **들어갑니다**. 구체적으로, 쓰기 가능한 스트림은 `WritableStream` 클래스의 인스턴스입니다.

### 스트림 변환

변환 스트림은 **한 쌍의** 스트림 즉, 쓰기 가능한 쪽이라고 하는 쓰기 가능한 스트림과 읽을 수 있는 쪽이라고 하는 읽을 수 있는 스트림으로 구성되어 있습니다. 이는 실제 세계에서 한 언어에서 다른 언어로 즉석에서 번역하는 [동시 통역사](https://en.wikipedia.org/wiki/Simultaneous_interpretation)로 비유할 수 있습니다. 변환 스트림에 고유한 방식으로 쓰기 가능한 쪽에 기록하면 읽기 가능한 쪽에서 읽을 수 있는 새 데이터가 생성됩니다. 구체적으로, `writable` 속성과 `readable` 속성이 있는 모든 개체는 변환 스트림으로 사용할 수 있습니다. 그러나 표준 `TransformStream` 클래스를 사용하면 적절하게 얽힌 쌍을 더 쉽게 만들 수 있습니다.

### 파이프 체인

스트림은 주로 서로 **파이핑**하여 사용됩니다. 읽기 가능한 스트림은 읽기 가능한 스트림의 `pipeTo()` 메서드를 사용하여 쓰기 가능한 스트림에 직접 파이핑할 수 있습니다. 또한 읽기 가능한 스트림의 `pipeThrough()` 메서드를 사용하여 우선 하나 이상의 스트림을 통해 파이핑할 수 있습니다. 이러한 방식으로 **함께 파이핑된 스트림 세트**를 파이프 체인이라 부릅니다.

### 배압

파이프 체인이 구성되면 청크가 파이프 체인을 통해 얼마나 빨리 통과하는지에 대한 신호를 전달합니다. 체인의 단계가 아직 청크를 수락할 수 없는 경우 파이프 체인을 통해 신호를 역방향으로 전파하여 결국 원래 소스에 청크를 너무 빨리 생성하는 것을 중지하라는 지시를 내립니다. 이러한 **정규화 흐름** 프로세스를 배압이라고 합니다.

### 티잉

`tee()` 메서드를 사용하여 읽기 가능한 스트림을 티잉(대문자 'T' 모양의 이름을 따서 명명)할 수 있습니다. 이렇게 하면 스트림이 **잠깁니다**. 즉, 스트림을 더 이상 직접 사용할 수 없게 됩니다. 그러나 독립적으로 사용할 수 있는 분기라고 하는 **두 개의 새로운 스트림**을 생성합니다. 스트림을 되감거나 다시 시작할 수 없기 때문에 티잉도 중요합니다. 이에 대해서는 나중에 자세히 다루도록 하겠습니다.

<figure><comment data-md-type="comment"></comment> {% Img src="image/8WbTDNrhLsU0El80frMBGE4eMCD3/M70SLIvXhMkYfxDm5b98.svg", alt="호출에서 패치 API(출력이 티잉되는 변환 스트림을 통해 파이핑된 다음 첫 번째 결과로 나타나는 읽기 가능한 스트림을 위해 브라우저에 전송되고 두 번째 결과로 나타나는 읽기 가능한 스트림을 위해 서비스 작업자 캐시에 전송됨)로 이어지는 읽기 가능한 스트림으로 구성된 파이프 체인 다이어그램", width="800", height="430" %} <figcaption>파이프 체인.</figcaption></figure>

## 읽기 가능한 스트림 메커니즘

읽기 가능한 스트림은 기본 소스로부터 흐르는 [`ReadableStream`](https://developer.mozilla.org/docs/Web/API/ReadableStream) 개체에 의해 JavaScript로 표현되는 데이터 소스입니다. [`ReadableStream()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/ReadableStream) 생성자는 해당 핸들러에서 읽기 가능한 스트림 개체를 만들고 반환합니다. 기본 소스에는 다음과 같은 두 가지 유형이 있습니다.

- **푸시 소스**는 액세스할 때 데이터를 지속적으로 푸시하며 스트림에 대한 액세스를 시작, 일시 중지 또는 취소하는 것은 사용자에게 달려 있습니다. 예에는 라이브 비디오 스트림, 서버 전송 이벤트 또는 WebSocket이 포함됩니다.
- **풀 소스**는 일단 연결되면 데이터를 명시적으로 요청해야 합니다. 예에는 `fetch()` 또는 `XMLHttpRequest` 호출을 통한 HTTP 작업이 포함됩니다.

스트림 데이터는 **청크**라고 하는 작은 조각으로 순차적으로 판독됩니다. 스트림에 배치된 청크는 **대기열에 추가**됩니다. 이는 청그가 읽을 준비가 된 대기열에서 대기하고 있음을 의미합니다. **내부 큐**는 아직 읽지 않은 청크를 추적합니다.

**대기열 전략**은 스트림이 내부 큐의 상태를 기반으로 배압 신호를 보내는 방법을 결정하는 개체입니다. 대기열 전략은 각 청크에 크기를 할당하고 대기열에 있는 모든 청크의 전체 크기를 **상위 워터 마크**라고 하는 지정된 숫자와 비교합니다.

스트림 내부의 청크는 **리더**에 의해 판독됩니다. 이 리더는 한 번에 하나의 청크씩 데이터를 검색하므로 원하는 작업을 수행할 수 있습니다. 리더 및 리더와 함께 제공되는 다른 처리 코드를 **컨슈머(consumer)**라고 합니다.

이 컨텍스트에서 다음 구성을 **컨트롤러**라고 합니다. 읽기 가능한 각 스트림에는 이름에서 알 수 있듯이 스트림을 제어할 수 있는 연결된 컨트롤러가 있습니다.

한 번에 하나의 리더만 스트림을 읽을 수 있습니다. 리더가 생성되고 스트림 읽기를 시작하면(즉, **활성 리더**가 되면) 스트림에 **잠깁니다**. 다른 리더가 스트림 읽기를 인계하도록 하려면 일반적으로 다른 작업을 수행하기 전에 첫 번째 리더를 **해제**해야 합니다(스트림을 **티잉**할 수는 있음).

### 읽기 가능한 스트림 만들기

[`ReadableStream()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/ReadableStream) 생성자를 호출하여 읽기 가능한 스트림을 만듭니다. 생성자에는 생성된 스트림 인스턴스의 동작 방식을 정의하는 메서드 및 속성을 가진 개체를 나타내는 선택적 인수 `underlyingSource`가 있습니다.

#### `underlyingSource`

다음과 같은 선택적 개발자 정의 메서드를 사용할 수 있습니다.

- `start(controller)`: 개체가 생성되는 즉시 호출됩니다. 이 메서드는 스트림 소스에 액세스할 수 있으며 스트림 기능을 설정하는 데 필요한 다른 모든 작업을 수행할 수 있습니다. 이 프로세스를 비동기식으로 수행해야 하는 경우 이 메서드가 성공 또는 실패를 알리는 약속을 반환할 수 있습니다. 이 메서드에 전달된 `controller` 매개변수는 [`ReadableStreamDefaultController`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultController)입니다.
- `pull(controller)`: 더 많은 청크를 가져올 때 스트림을 제어하는 데 사용할 수 있습니다. 스트림의 내부 청크 대기열이 가득 차 있지 않은 한 대기열이 높은 워터 마크에 도달할 때까지 반복적으로 호출됩니다. `pull()` 호출의 결과가 약속이면 해당 약속이 이행될 때까지 `pull()`이 호출되지 않습니다. 약속이 거부되면 스트림에 오류가 발생합니다.
- `cancel(reason)`: 스트림 컨슈머가 스트림을 취소할 때 호출됩니다.

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

`ReadableStreamDefaultController`는 다음 메서드를 지원합니다.

- [`ReadableStreamDefaultController.close()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultController/close)는 연결된 스트림을 닫습니다.
- [`ReadableStreamDefaultController.enqueue()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultController/enqueue)는 연결된 스트림의 해당 청크를 대기열에 넣습니다.
- [`ReadableStreamDefaultController.error()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultController/error)는 연결된 스트림과의 향후 상호 작용에 오류를 발생시킵니다.

```js
/* … */
start(controller) {
  controller.enqueue('The first chunk!');
},
/* … */
```

#### `queuingStrategy`

마찬가지로 옵션인 두 번째 `ReadableStream()` 생성자는 `queuingStrategy`입니다. 이는 스트림에 대한 대기열 전략을 선택적으로 정의하는 개체이며 다음과 같은 두 개의 매개변수를 취합니다.

- `highWaterMark`: 이 대기열 전략을 사용하는 스트림의 높은 워터 마크를 나타내는 음수가 아닌 숫자입니다.
- `size(chunk)`: 주어진 청크 값에 대한 음이 아닌 유한한 크기를 계산하고 반환하는 함수입니다. 결과 값은 `ReadableStreamDefaultController.desiredSize` 속성을 통해 표시되는 배압을 결정하는 데 사용됩니다. 기본 소스의 `pull()` 메서드가 호출되는 시점을 관할합니다.

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

{% Aside %} 사용자 정의 `queuingStrategy`를 지정하거나 이 개체의 값에 대해 [`ByteLengthQueuingStrategy`](https://developer.mozilla.org/docs/Web/API/ByteLengthQueuingStrategy) 또는 [`CountQueuingStrategy`](https://developer.mozilla.org/docs/Web/API/CountQueuingStrategy)의 인스턴스를 사용할 수 있습니다. `queuingStrategy`가 제공되지 않으면 사용하는 기본 값은 `1`의 `highWaterMark`를 갖는 `CountQueuingStrategy`와 동일합니다. {% endAside %}

#### `getReader()` 및 `read()` 메서드

읽기 가능한 스트림에서 읽으려면 [`ReadableStreamDefaultReader`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader)가 되는 리더가 필요합니다. `ReadableStream` 인터페이스의 `getReader()` 메서드는 리더를 생성하고 스트림을 잠급니다. 스트림이 잠겨 있는 동안 이 스트림을 해제할 때까지 다른 리더를 얻을 수 없습니다.

`ReadableStreamDefaultReader` 인터페이스의 [`read()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader/read) 메서드는 스트림의 내부 대기열에 있는 다음 청크에 대한 액세스를 제공하는 약속을 반환합니다. 스트림의 상태에 따라 하나의 결과로 이행하거나 거부합니다. 다양한 가능성은 다음과 같습니다.

- 청크를 사용할 수 있는 경우 <br> `{ value: chunk, done: false }` 형식의 개체로 약속이 이행됩니다.
- 스트림이 닫히면 <br> `{ value: undefined, done: true }` 형식의 개체로 약속이 이행됩니다.
- 스트림에 오류가 발생하면 관련 오류와 함께 약속이 거부됩니다.

```js
const reader = readableStream.getReader();
while (true) {
  const { done, value } = await reader.read();
  if (done) {
    console.log('The stream is done.');
    break;
  }
  console.log('Just read a chunk:', value);
}
```

#### `locked` 속성

[`ReadableStream.locked`](https://developer.mozilla.org/docs/Web/API/ReadableStream/locked) 속성에 액세스하여 읽기 가능한 스트림이 잠겨 있는지 확인할 수 있습니다.

```js
const locked = readableStream.locked;
console.log(`The stream is ${locked ? 'indeed' : 'not'} locked.`);
```

### 읽기 가능한 스트림 코드 샘플

아래 코드 샘플은 실행 중인 모든 스텝을 보여줍니다. 먼저 `underlyingSource` 인수(즉, `TimestampSource` 클래스)에서 `start()` 메서드를 정의하는 `ReadableStream`을 만듭니다. 이 메서드는 스트림의 `controller`에 10초 동안 매초마다 타임스탬프를 `enqueue()`하도록 지시합니다. 마지막으로 컨트롤러에 스트림을 `close()`하도록 지시합니다. `getReader()` 메서드를 통해 리더를 생성하고 스트림이 `done`될 때까지 `read()`를 호출하여 이 스트림을 사용합니다.

```js
class TimestampSource {
  #interval

  start(controller) {
    this.#interval = setInterval(() => {
      const string = new Date().toLocaleTimeString();
      // Add the string to the stream.
      controller.enqueue(string);
      console.log(`Enqueued ${string}`);
    }, 1_000);

    setTimeout(() => {
      clearInterval(this.#interval);
      // Close the stream after 10s.
      controller.close();
    }, 10_000);
  }

  cancel() {
    // This is called if the reader cancels.
    clearInterval(this.#interval);
  }
}

const stream = new ReadableStream(new TimestampSource());

async function concatStringStream(stream) {
  let result = '';
  const reader = stream.getReader();
  while (true) {
    // The `read()` method returns a promise that
    // resolves when a value has been received.
    const { done, value } = await reader.read();
    // Result objects contain two properties:
    // `done`  - `true` if the stream has already given you all its data.
    // `value` - Some data. Always `undefined` when `done` is `true`.
    if (done) return result;
    result += value;
    console.log(`Read ${result.length} characters so far`);
    console.log(`Most recently read chunk: ${value}`);
  }
}
concatStringStream(stream).then((result) => console.log('Stream complete', result));
```

### 비동기식 반복

스트림이 `done`되면 각 `read()` 루프 반복을 확인하는 것이 가장 편리한 API가 아닐 수 있습니다. 다행히도 곧 이를 수행하는 더 좋은 방법이 있습니다. 바로 비동기식 반복입니다.

```js
for await (const chunk of stream) {
  console.log(chunk);
}
```

{% Aside 'caution' %} 비동기 반복은 아직 어떤 브라우저에서도 구현되지 않았습니다. {% endAside %}

오늘날 비동기식 반복을 사용하는 해결 방법은 도우미 함수로 동작을 구현하는 것입니다. 이를 통해 아래 스니펫에 제시되어 있는 코드에서 기능을 사용할 수 있습니다.

```js
function streamAsyncIterator(stream) {
  // Get a lock on the stream:
  const reader = stream.getReader();

  return {
    next() {
      // Stream reads already resolve with {done, value}, so
      // we can just call read:
      return reader.read();
    },
    return() {
      // Release the lock if the iterator terminates.
      reader.releaseLock();
      return {};
    },
    // for-await calls this on whatever it's passed, so
    // iterators tend to return themselves.
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

### 읽기 가능한 스트림 티잉

`ReadableStream` 인터페이스의 [`tee()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/tee) 메서드는 현재 읽기 가능한 스트림을 티잉하여 두 개의 결과 분기를 새 `ReadableStream` 인스턴스로 포함하는 두 요소 배열을 반환합니다. 이를 통해 두 개의 리더가 스트림을 동시에 읽을 수 있습니다. 예를 들어 서버에서 응답을 가져와 브라우저로 스트리밍하고 서비스 작업자 캐시로 스트리밍하려는 경우 서비스 작업자에서 이 작업을 수행할 수 있습니다. 응답 본문은 두 번 이상 사용할 수 없으므로 이를 수행하려면 두 개의 사본이 필요합니다. 스트림을 취소하려면 결과 분기를 모두 취소해야 합니다. 스트림을 티잉하면 일반적으로 해당 기간 동안 스트림이 잠기므로 다른 리더가 스트림을 잠글 수 없습니다.

```js
const readableStream = new ReadableStream({
  start(controller) {
    // Called by constructor.
    console.log('[start]');
    controller.enqueue('a');
    controller.enqueue('b');
    controller.enqueue('c');
  },
  pull(controller) {
    // Called `read()` when the controller's queue is empty.
    console.log('[pull]');
    controller.enqueue('d');
    controller.close();
  },
  cancel(reason) {
    // Called when the stream is canceled.
    console.log('[cancel]', reason);
  },
});

// Create two `ReadableStream`s.
const [streamA, streamB] = readableStream.tee();

// Read streamA iteratively one by one. Typically, you
// would not do it this way, but you certainly can.
const readerA = streamA.getReader();
console.log('[A]', await readerA.read()); //=> {value: "a", done: false}
console.log('[A]', await readerA.read()); //=> {value: "b", done: false}
console.log('[A]', await readerA.read()); //=> {value: "c", done: false}
console.log('[A]', await readerA.read()); //=> {value: "d", done: false}
console.log('[A]', await readerA.read()); //=> {value: undefined, done: true}

// Read streamB in a loop. This is the more common way
// to read data from the stream.
const readerB = streamB.getReader();
while (true) {
  const result = await readerB.read();
  if (result.done) break;
  console.log('[B]', result);
}
```

## 읽기 가능한 바이트 스트림

바이트를 나타내는 스트림의 경우, 특히 복사본을 최소화하여 바이트를 효율적으로 처리하기 위해 읽기 가능한 스트림의 확장 버전이 제공됩니다. 바이트 스트림을 사용하면 BYOB(Bring-Your-Own-Buffer) 리더를 확보할 수 있습니다. 기본 구현은 WebSocket의 경우 문자열 또는 배열 버퍼와 같은 다양한 출력을 제공할 수 있지만 바이트 스트림은 바이트 출력을 보장합니다. 또한 BYOB 리더는 안정적이라는 이점이 있습니다. 버퍼가 분리되면 동일한 버퍼에 두 번 쓰지 않도록 보장하여 경쟁 조건을 피할 수 있기 때문입니다. BYOB 리더는 버퍼를 재사용할 수 있으므로 브라우저에서 가비지 수집 작업을 실행해야 하는 횟수를 줄일 수 있습니다.

### 읽기 가능한 바이트 스트림 만들기

`ReadableStream()` 생성자에 추가적인 `type` 매개변수를 전달하여 읽기 가능한 바이트 스트림을 만들 수 있습니다.

```js
new ReadableStream({ type: 'bytes' });
```

#### `underlyingSource`

읽기 가능한 바이트 스트림의 기본 소스에는 `ReadableByteStreamController`가 제공됩니다. `ReadableByteStreamController.enqueue()` 메서드는 값이 `ArrayBufferView`인 `chunk` 인수를 취합니다. `ReadableByteStreamController.byobRequest` 속성은 현재 BYOB pull 요청을 반환하거나 없는 경우 null을 반환합니다. 마지막으로 `ReadableByteStreamController.desiredSize` 속성은 제어되는 스트림의 내부 대기열을 채우는 데 필요한 크기를 반환합니다.

### `queuingStrategy`

마찬가지로 옵션인 `ReadableStream()` 생성자의 인수는 `queuingStrategy`입니다. 이는 하나의 매개변수를 취하는 스트림에 대한 대기열 전략을 선택적으로 정의하는 개체입니다.

- `highWaterMark`: 이 대기열 전략을 사용하는 스트림의 상위 워터 마크를 나타내는 음수가 아닌 바이트 수입니다. `ReadableByteStreamController.desiredSize` 속성을 통해 명시되는 배압을 결정하는 데 사용됩니다. `pull()` 메서드가 호출되는 시기를 제어합니다.

{% Aside %} 다른 스트림 유형에 대한 대기열 전략과 달리 읽기 가능한 바이트 스트림에 대한 대기열 전략에는 `size(chunk)` 함수가 없습니다. 각 청크의 크기는 항상 `byteLength` 속성에 의해 결정됩니다. {% endAside %}

{% Aside %} `queuingStrategy`가 제공되지 않은 경우 사용되는 기본값은 `0`의 `highWaterMark`를 갖는 값입니다. {% endAside %}

#### `getReader()` 및 `read()` 메서드

그런 다음 `ReadableStream.getReader({ mode: "byob" })`에 따라 `mode` 매개변수를 설정하여 `ReadableStreamBYOBReader`에 액세스할 수 있습니다. 이를 통해 복사를 방지하기 위해 버퍼 할당을 보다 정밀하게 제어할 수 있습니다. 바이트 스트림에서 읽으려면 `ReadableStreamBYOBReader.read(view)`를 호출해야 합니다. 여기에서 `view`는 [`ArrayBufferView`](https://developer.mozilla.org/docs/Web/API/ArrayBufferView)입니다.

#### 읽기 가능한 바이트 스트림 코드 샘플

```js
const reader = readableStream.getReader({ mode: "byob" });

let startingAB = new ArrayBuffer(1_024);
const buffer = await readInto(startingAB);
console.log("The first 1024 bytes, or less:", buffer);

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

다음 함수는 무작위로 생성된 배열의 효율적인 제로 카피 읽기를 허용하는 읽기 가능한 바이트 스트림을 반환합니다. 미리 결정된 1,024의 청크 크기를 사용하는 대신 개발자가 제공한 버퍼를 채우려고 시도하여 전체적으로 제어할 수 있도록 합니다.

```js
const DEFAULT_CHUNK_SIZE = 1_024;

function makeReadableByteStream() {
  return new ReadableStream({
    type: 'bytes',

    pull(controller) {
      // Even when the consumer is using the default reader,
      // the auto-allocation feature allocates a buffer and
      // passes it to us via `byobRequest`.
      const view = controller.byobRequest.view;
      view = crypto.getRandomValues(view);
      controller.byobRequest.respond(view.byteLength);
    },

    autoAllocateChunkSize: DEFAULT_CHUNK_SIZE,
  });
}
```

## 쓰기 가능한 스트림의 메커니즘

쓰기 가능한 스트림은 데이터를 쓸 수 있는 하나의 대상이며 이는 [`WritableStream`](https://developer.mozilla.org/docs/Web/API/WritableStream) 개체에 의해 JavaScript에 표시됩니다. 쓰기 가능한 스트림은 원시 데이터가 기록되는 하위 수준 I/O 싱크인 **기본 싱크** 상단에서 추상화 함수로서의 역할을 수행합니다.

데이터는 한 번에 하나의 청크씩 **작성자**를 통해 스트림에 기록됩니다. 청크는 리더의 청크와 마찬가지로 다양한 형태를 취할 수 있습니다. 원하는 코드를 사용하여 쓰기 준비가 된 청크를 생성할 수 있습니다. 작성자와 관련 코드를 **생산자**라고 합니다.

작성자(**활성 작성자**)가 생성되고 스트림에 대한 쓰기 작업을 시작하면, 스트림에 **잠기게 됩니다**. 한 번에 하나의 작성자만 쓰기 가능한 스트림에 쓸 수 있습니다. 다른 작성자가 스트림에 대한 쓰기 작업을 시작하도록 하려면 일반적으로 스트림을 해제한 다음 다른 작성자를 연결해야 합니다.

**내부 큐**는 스트림에 기록되었지만 기본 싱크에서 아직 처리되지 않은 청크를 계속 추적합니다.

**대기열 전략**은 스트림이 내부 큐의 상태를 기반으로 배압 신호를 보내는 방법을 결정하는 개체입니다. 대기열 전략은 각 청크에 크기를 할당하고 대기열에 있는 모든 청크의 전체 크기를 **상위 워터 마크**라고 하는 지정된 숫자와 비교합니다.

최종 구성은 **컨트롤러**라고 합니다. 쓰기 가능한 각 스트림에는 스트림을 제어(예: 중단)할 수 있는 관련 컨트롤러가 있습니다.

### 쓰기 가능한 스트림 만들기

Streams API의 [`WritableStream`](https://developer.mozilla.org/docs/Web/API/WritableStream) 인터페이스는 스트리밍 데이터를 싱크라고 하는 대상에 쓰기 위한 표준 추상화 함수를 제공합니다. 이 개체는 내장된 배압 및 대기열과 함께 제공됩니다. [`WritableStream()`](https://developer.mozilla.org/docs/Web/API/WritableStream/WritableStream) 생성자를 호출하여 쓰기 가능한 스트림을 만듭니다. 여기에는 생성된 스트림 인스턴스가 작동하는 방식을 정의하는 메서드와 속성이 있는 개체를 나타내는 옵션 `underlyingSink`가 있습니다.

#### `underlyingSink`

`underlyingSink`에는 다음과 같은 옵션의 개발자 정의 메서드가 포함될 수 있습니다. 일부 메서드에 전달된 `controller` 매개변수는 [`WritableStreamDefaultController`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultController)입니다.

- `start(controller)`: 이 메서드는 개체가 생성될 때 즉시 호출됩니다. 이 메서드의 콘텐츠는 기본 싱크에 액세스하는 것을 목표로 해야 합니다. 이 프로세스를 비동기식으로 수행해야 하는 경우 성공 또는 실패를 알리는 약속을 반환할 수 있습니다.
- `write(chunk, controller)`: 이 메서드는 새로운 데이터 청크(`chunk` 매개변수에 지정됨)가 기본 싱크에 기록될 준비가 되면 호출됩니다. 쓰기 작업의 성공 또는 실패를 알리는 약속을 반환할 수 있습니다. 이 메서드는 이전 쓰기가 성공한 이후에만 호출되고 스트림이 닫히거나 중지된 이후에는 호출되지 않습니다.
- `close(controller)`: 이 메서드는 앱이 스트림에 청크 쓰기를 완료했다는 신호를 보내는 경우에 호출됩니다. 콘텐츠는 기본 싱크에 대한 쓰기를 완료하고 액세스를 해제하는 데 필요한 모든 작업을 수행해야 합니다. 이 프로세스가 비동기식이면 성공 또는 실패를 알리는 약속을 반환할 수 있습니다. 이 메서드는 대기 중인 모든 쓰기가 성공한 후에만 호출됩니다.
- `abort(reason)`: 이 메서드는 앱이 스트림을 갑자기 닫고 오류 상태가 되기를 바란다는 신호를 보내는 경우에 호출됩니다. `close()`와 마찬가지로 보유하고 있는 리소스를 정리할 수 있지만 쓰기가 대기 중인 경우라도 `abort()`가 호출됩니다. 이러한 청크는 폐기됩니다. 이 프로세스가 비동기식으로 이루어지면 성공 또는 실패를 알리는 약속을 반환할 수 있습니다.  `reason` 매개변수에는 스트림이 중지된 이유를 설명하는 `DOMString`이 포함되어 있습니다.

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

Streams API의 [`WritableStreamDefaultController`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultController) 인터페이스는 쓰기 동안 또는 쓰기가 끝날 때 더 많은 청크가 제출되므로 설정하는 동안 `WritableStream`의 상태를 제어할 수 있는 컨트롤러를 나타냅니다. `WritableStream`을 구성할 때 기본 싱크에는 이에 상응하는 `WritableStreamDefaultController` 인스턴스가 제공됩니다. `WritableStreamDefaultController`에는 [`WritableStreamDefaultController.error()`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultController/error) 메서드가 하나만 있습니다. 이 메서드는 관련 스트림과의 향후 상호 작용에서 오류를 발생시킵니다.

```js
/* … */
write(chunk, controller) {
  try {
    // Try to do something dangerous with `chunk`.
  } catch (error) {
    controller.error(error.message);
  }
},
/* … */
```

#### `queuingStrategy`

마찬가지로 옵션인 두 번째 `WritableStream()` 생성자 인수는 `queuingStrategy`입니다. 스트림에 대한 대기열 전략을 선택적으로 정의하는 개체이며 다음과 같은 두 개의 매개변수를 취합니다.

- `highWaterMark`: 이 대기열 전략을 사용하는 스트림의 높은 워터 마크를 나타내는 음수가 아닌 숫자입니다.
- `size(chunk)`: 주어진 청크 값의 음이 아닌 유한한 크기를 계산하고 반환하는 함수입니다. `WritableStreamDefaultWriter.desiredSize` 속성을 통해 표시되는 배압을 결정하는 데 사용됩니다.

{% Aside %} 사용자 정의 `queuingStrategy`를 지정하거나 이 개체의 값에 대해 [`ByteLengthQueuingStrategy`](https://developer.mozilla.org/docs/Web/API/ByteLengthQueuingStrategy) 또는 [`CountQueuingStrategy`](https://developer.mozilla.org/docs/Web/API/CountQueuingStrategy)의 인스턴스를 사용할 수 있습니다. `queuingStrategy`가 제공되지 않으면 사용하는 기본 값은 `1`의 `highWaterMark`를 갖는 `CountQueuingStrategy`와 동일합니다. {% endAside %}

#### `getWriter()` 및 `write()` 메서드

쓰기 가능한 스트림에 쓰려면 `WritableStreamDefaultWriter`가 될 작성자가 필요합니다. `WritableStream` 인터페이스의 `getWriter()` 메서드가 새로운 인스턴스 `WritableStreamDefaultWriter`를 반환하며 해당 인스턴스에 대한 스트림을 잠급니다. 스트림이 잠겨 있는 동안 현재 작성자가 해제될 때까지 다른 작성자를 확보할 수 없습니다.

[`WritableStreamDefaultWriter`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/write) 인터페이스의 [`write()`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter) 메서드가 전달된 데이터 청크를 `WritableStream` 및 기본 싱크에 쓴 다음 쓰기 작업의 성공 또는 실패를 알리는 약속을 반환합니다. "성공"이 의미하는 바는 기본 싱크에 달려 있습니다. 청크가 수락되었음을 나타낼 수 있으며 반드시 최종 대상에 안전하게 저장되는 것은 아닙니다.

```js
const writer = writableStream.getWriter();
const resultPromise = writer.write('The first chunk!');
```

#### `locked` 속성

[`WritableStream.locked`](https://developer.mozilla.org/docs/Web/API/WritableStream/locked) 속성에 액세스하여 쓰기 가능한 스트림이 잠겨 있는지 확인할 수 있습니다.

```js
const locked = writableStream.locked;
console.log(`The stream is ${locked ? 'indeed' : 'not'} locked.`);
```

### 쓰기 가능한 스트림 코드 샘플

아래 코드 샘플은 실행 중인 모든 단계를 나타냅니다.

```js
const writableStream = new WritableStream({
  start(controller) {
    console.log('[start]');
  },
  async write(chunk, controller) {
    console.log('[write]', chunk);
    // Wait for next write.
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
  // Wait to add to the write queue.
  await writer.ready;
  console.log('[ready]', Date.now() - start, 'ms');
  // The Promise is resolved after the write finishes.
  writer.write(char);
}
await writer.close();
```

### 읽기 가능한 스트림을 쓰기 가능한 스트림으로 파이핑

읽기 가능한 스트림은 읽기 가능한 스트림의 [`pipeTo()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/pipeTo) 메서드를 통해 쓰기 가능한 스트림으로 파이핑될 수 있습니다. `ReadableStream.pipeTo()`는 현재 `ReadableStream`을 해당 `WritableStream`으로 파이핑하고 파이핑 프로세스가 성공적으로 완료되면 이행되는 약속을 반환하거나 오류가 발생하면 거부합니다.

```js
const readableStream = new ReadableStream({
  start(controller) {
    // Called by constructor.
    console.log('[start readable]');
    controller.enqueue('a');
    controller.enqueue('b');
    controller.enqueue('c');
  },
  pull(controller) {
    // Called when controller's queue is empty.
    console.log('[pull]');
    controller.enqueue('d');
    controller.close();
  },
  cancel(reason) {
    // Called when the stream is canceled.
    console.log('[cancel]', reason);
  },
});

const writableStream = new WritableStream({
  start(controller) {
    // Called by constructor
    console.log('[start writable]');
  },
  async write(chunk, controller) {
    // Called upon writer.write()
    console.log('[write]', chunk);
    // Wait for next write.
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

## 변환 스트림 생성

Streams API의 `TransformStream` 인터페이스는 변환 가능한 데이터 세트를 나타냅니다. 해당 핸들러에서 변환 스트림 개체를 생성하고 반환하는 `TransformStream()` 생성자를 호출하여 변환 스트림을 생성합니다. `TransformStream()` 생성자는 `transformer`를 나타내는 선택적 JavaScript 개체를 첫 번째 인수로 수락합니다. 이러한 개체에는 다음과 같은 메서드가 포함될 수 있습니다.

### `transformer`

- `start(controller)`: 이 메서드는 개체가 생성될 때 즉시 호출됩니다. 일반적으로 이 메서드는`controller.enqueue()` 사용하여 접두사 청크를 대기열에 넣는 데 사용됩니다. 이러한 청크는 읽기 가능한 쪽에서 읽혀지지만 쓰기 가능한 쪽의 쓰기에 의존하지 않습니다. 예를 들어 접두사 청크를 획득하는 데 약간의 노력이 필요하므로 이 초기 프로세스가 비동기식으로 이루어지는 경우 함수는 성공 또는 실패를 알려주는 약속을 반환할 수 있습니다. 거부된 약속은 스트림에 오류를 발생시킵니다. 생성된 모든 예외는 `TransformStream()` 생성자에 의해 다시 생성됩니다.
- `transform(chunk, controller)`: 이 메서드는 원래 쓰기 가능한 쪽에 쓰여진 새로운 청크가 변환될 준비가 되었을 때 호출됩니다. 이 스트림이 구현되면 이전 변환이 성공한 이후에만 호출되고 `start()`가 완료하기 전 또는 `flush()`가 호출된 이후에 호출되지 않도록 보장합니다. 이 함수는 변환 스트림의 실제 변환 작업을 수행합니다. 이 함수는 `controller.enqueue()`를 사용하여 결과를 대기열에 넣을 수 있습니다. 이렇게 하면`controller.enqueue()`가 호출된 횟수에 따라 쓰기 가능한 쪽에 작성된 단일 청크가 읽기 가능한 쪽에서 제로나 여러 청크로 나타납니다. 변환 프로세스가 비동기식으로 이루어지면 이 함수는 변환의 성공 또는 실패를 알리는 약속을 반환할 수 있습니다. 거부된 약속은 변환 스트림의 읽기 가능한 쪽과 쓰기 가능한 쪽 모두에 오류가 발생합니다. `transform()` 메서드가 제공되지 않으면 아이덴터티 변환이 사용됩니다. 이는 쓰기 가능한 쪽에서 읽기 가능한 쪽까지 변경되지 않은 청크를 대기열에 넣습니다.
- `flush(controller)`: 이 메서드는 쓰기 가능한 쪽에 쓰여진 모든 청크가 `transform()`을 성공적으로 통과하여 변환되고 쓰기 가능한 쪽이 닫히려고 한 후에 호출됩니다. 일반적으로 접미사 청크가 닫히기 전에 읽을 수 있는 쪽에 접미사 청크를 추가하는 데 사용됩니다. 플러싱 프로세스가 비동기식으로 이루어지는 경우 이 함수는 성공 또는 실패를 알려주는 약속을 반환할 수 있습니다. 결과가 `stream.writable.write()` 호출자에게 전달됩니다. 또한 거부된 약속은 스트림의 읽기 가능한 쪽과 쓰기 가능한 쪽 모두에 오류를 발생시킵니다. 예외 생성 작업은 거부된 약속을 반환하는 것과 동일하게 처리됩니다.

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

### `writableStrategy` 및 `readableStrategy` 대기열 전략

`TransformStream()` 생성자의 두 번째 및 세 번째 선택적 매개변수는 선택적 `writableStrategy` 및 `readableStrategy` 대기열 전략입니다. 이러한 매개변수들은 각각  [읽기 가능한](#the-queuingstrategy) 스트림 섹션과 [쓰기 가능한](#the-queuingstrategy-3) 스트림 섹션에 설명된 대로 정의됩니다.

### 스트림 코드 샘플 변환

다음 코드 샘플은 작동 중인 간단한 변환 스트림을 보여줍니다.

```js
// Note that `TextEncoderStream` and `TextDecoderStream` exist now.
// This example shows how you would have done it before.
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

### 변환 스트림을 통해 읽을 수 있는 스트림 파이핑

`ReadableStream` 인터페이스의 [`pipeThrough()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/pipeThrough) 메서드는 변환 스트림 또는 다른 쓰기/읽기 가능한 쌍을 통해 현재 스트림을 파이핑하는 연결 가능한 방법을 제공합니다. 스트림을 파이핑하면 일반적으로 파이프 기간 동안 스트림이 잠기므로 다른 리더가 스트림을 잠글 수 없습니다.

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
    // called by constructor
    console.log('[start]');
    controller.enqueue('a');
    controller.enqueue('b');
    controller.enqueue('c');
  },
  pull(controller) {
    // called read when controller's queue is empty
    console.log('[pull]');
    controller.enqueue('d');
    controller.close(); // or controller.error();
  },
  cancel(reason) {
    // called when rs.cancel(reason)
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

다음 코드 샘플(약간 인위적임)은 반환된 응답 약속을 [스트림으로](https://developer.mozilla.org/docs/Web/API/Streams_API/Using_readable_streams#consuming_a_fetch_as_a_stream) 사용하고 청크 단위로 대문자화하여 모든 텍스트를 대문자로 지정하는 `fetch()`의 "샤우팅" 버전을 구현하는 방법을 보여줍니다. 이 접근 방식의 장점은 전체 문서가 다운로드될 때까지 기다릴 필요가 없다는 것입니다. 이는 대용량 파일을 처리할 때 큰 차이를 만들 수 있습니다.

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

## 브라우저 지원 및 폴리필

브라우저에서 Streams API에 대한 지원은 다양합니다. 자세한 호환성 데이터는 [사용할 수](https://caniuse.com/streams) 있는지 확인하십시오. 일부 브라우저는 특정 기능의 일부만 구현하므로 데이터를 철저히 확인해야 합니다.

좋은 소식은 사용 가능한 [참조 구현](https://github.com/whatwg/streams/tree/master/reference-implementation)과 프로덕션 사용을 대상으로 하는 [폴리필](https://github.com/MattiasBuelens/web-streams-polyfill)이 있다는 것입니다.

{% Aside 'gotchas' %} 가능한 한 기본 제공 기능을 사용할 수 없는 경우에만 조건부로 폴리필을 로드합니다. {% endAside %}

## 데모

아래 데모는 읽기, 쓰기 및 변환 스트림이 작동하는 모습을 보여줍니다. 이 데모는 `pipeThrough()` 및 `pipeTo()` 파이프 체인의 예도 포함하며 `tee()`도 보여줍니다. 선택적으로 자체 창에서 [데모](https://streams-demo.glitch.me/)를 실행하거나 [소스 코드](https://glitch.com/edit/#!/streams-demo?path=script.js)를 볼 수 있습니다.

{% Glitch 'streams-demo' %}

## 브라우저에서 사용할 수 있는 유용한 스트림

브라우저에 바로 내장된 유용한 스트림이 많습니다. Blob에서 `ReadableStream`을 쉽게 만들 수 있습니다. [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob) 인터페이스의 [stream()](https://developer.mozilla.org/docs/Web/API/Blob/stream) 메서드는 `ReadableStream`를 반환하는 데 이는 읽을 때 Blob 내에 포함된 데이터를 반환합니다. 또한 [`File`](https://developer.mozilla.org/docs/Web/API/File) 개체는 `Blob`의 특정 종류이며 Blob가 사용할 수 있는 모든 컨텍스트에서 사용할 수 있습니다.

```js
const readableStream = new Blob(['hello world'], { type: 'text/plain' }).stream();
```

`TextDecoder.decode()` 및 `TextEncoder.encode()`의 스트리밍 변형을 각각 [`TextDecoderStream`](https://encoding.spec.whatwg.org/#interface-textdecoderstream) 및 [`TextEncoderStream`](https://encoding.spec.whatwg.org/#interface-textencoderstream)이라고 합니다.

```js
const response = await fetch('https://streams.spec.whatwg.org/');
const decodedStream = response.body.pipeThrough(new TextDecoderStream());
```

[`CompressionStream`](https://wicg.github.io/compression/#compression-stream) 및 [`DecompressionStream`](https://wicg.github.io/compression/#decompression-stream) 변환 스트림으로 각각 파일을 압축하거나 압축 해제하는 것은 쉽습니다. 아래 코드 샘플은 Streams 사양을 다운로드하고 브라우저에서 바로 압축(gzip)하고 압축된 파일을 디스크에 직접 쓰는 방법을 보여줍니다.

```js
const response = await fetch('https://streams.spec.whatwg.org/');
const readableStream = response.body;
const compressedStream = readableStream.pipeThrough(new CompressionStream('gzip'));

const fileHandle = await showSaveFilePicker();
const writableStream = await fileHandle.createWritable();
compressedStream.pipeTo(writableStream);
```

[파일 시스템 액세스 API](/file-system-access/)의 [`FileSystemWritableFileStream`](https://wicg.github.io/file-system-access/#filesystemwritablefilestream) 및 실험적인 [`fetch()` 요청 스트림](/fetch-upload-streaming/#writable-streams)은 외부에서 쓰기 가능한 스트림의 예입니다.

[직렬 API](/serial/)는 읽기 및 쓰기 가능한 스트림을 모두 많이 사용합니다.

```js
// Prompt user to select any serial port.
const port = await navigator.serial.requestPort();
// Wait for the serial port to open.
await port.open({ baudRate: 9_600 });
const reader = port.readable.getReader();

// Listen to data coming from the serial device.
while (true) {
  const { value, done } = await reader.read();
  if (done) {
    // Allow the serial port to be closed later.
    reader.releaseLock();
    break;
  }
  // value is a Uint8Array.
  console.log(value);
}

// Write to the serial port.
const writer = port.writable.getWriter();
const data = new Uint8Array([104, 101, 108, 108, 111]); // hello
await writer.write(data);
// Allow the serial port to be closed later.
writer.releaseLock();
```

마지막으로 [`WebSocketStream`](/websocketstream/) API는 스트림을 WebSocket API와 통합합니다.

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

## 유용한 리소스

- [스트림 사양](https://streams.spec.whatwg.org/)
- [함께 제공되는 데모](https://streams.spec.whatwg.org/demos/)
- [스트림 폴리필](https://github.com/MattiasBuelens/web-streams-polyfill)
- [2016년 - 웹 스트림의 해](https://jakearchibald.com/2016/streams-ftw/)
- [비동기 반복자와 생성자](https://jakearchibald.com/2017/async-iterators-and-generators/)
- [스트림 시각화 도우미](https://surma.dev/lab/whatwg-stream-visualizer/lab.html)

## 감사의 말

이 기사는 [Jake Archibald](https://jakearchibald.com/), [François Beaufort](https://github.com/beaufortfrancois), [Sam Dutton](https://samdutton.com/), [Mattias Buelens](https://github.com/MattiasBuelens), [Surma](https://surma.dev/), [Joe Medley](https://github.com/jpmedley) 및 [Adam Rice](https://github.com/ricea)가 검토했습니다. [Jake Archibald](https://jakearchibald.com/)의 블로그 게시물은 스트림을 이해하는 데 많은 도움이 되었습니다. 코드 샘플 중 일부는 GitHub 사용자 [@bellbind](https://gist.github.com/bellbind/f6a7ba88e9f1a9d749fec4c9289163ac)의 탐색에서 영감을 얻었으며 산문의 일부는 [Streams에 대한 MDN Web Docs](https://developer.mozilla.org/docs/Web/API/Streams_API)를 기반으로 구축되었습니다. [Streams 표준](https://streams.spec.whatwg.org/)의 [작성자](https://github.com/whatwg/streams/graphs/contributors)는 이 사양을 작성하는 데 엄청난 노력을 기울였습니다. 히어로 이미지는 [Unsplash](https://unsplash.com/@ryanlara)에 [Ryan Lara](https://unsplash.com/)가 제공한 이미지입니다.
