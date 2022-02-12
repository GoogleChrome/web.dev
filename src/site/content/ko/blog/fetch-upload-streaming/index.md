---
layout: post
title: fetch API를 사용한 스트리밍 요청
authors:
  - jakearchibald
description: Chrome은 이제 버전 95부터 업로드 스트리밍을 지원합니다. 이는 전체 본문을 사용할 수 있게 되기 전에 요청을 시작할 수 있다는 것을 의미합니다.
date: 2020-07-22
updated: 2021-09-22
hero: image/admin/9U7u4C7WCGbrdHm3181W.jpg
alt: 시냇물을 향해 가는 카누
tags:
  - blog
  - chrome-95
  - network
  - service-worker
feedback:
  - api
---

Chrome 95부터 streams API를 사용하여 전체 본문을 사용할 수 있게 되기 전에 요청을 시작할 수 있습니다.

이것을 사용하여 다음을 수행할 수 있습니다.

- 서버를 워밍업합니다. 즉, 사용자가 텍스트 입력 필드에 포커스를 맞추면 요청을 시작하고 모든 헤더를 제거한 다음 입력한 데이터를 보내기 전에 사용자가 '보내기'를 누를 때까지 기다릴 수 있습니다.
- 오디오, 비디오 또는 입력 데이터와 같이 클라이언트에서 생성된 데이터를 차례로 보냅니다.
- HTTP을 통해 웹 소켓을 다시 만듭니다.

그러나 이것은 낮은 수준의 웹 플랫폼 기능이므로 *제* 아이디어에 국한되지 마십시오. 요청 스트리밍에 대한 훨씬 더 흥미로운 사용 사례를 생각할 수 있습니다.

## 데모 {: #demo }

{% Glitch { id: 'fetch-request-stream', path: 'index.html', height: 480 } %}

이것은 사용자에서 서버로 데이터를 스트리밍하고 실시간으로 처리할 수 있는 데이터를 다시 보내는 방법을 보여줍니다.

네, 가장 상상력이 풍부한 예는 아닙니다. 저는 그저 단순하게 하고 싶었습니다. 알겠죠?

어쨌든, 이것은 어떻게 작동할까요?

## fetch 스트림의 흥미진진한 모험에 대한 지난 이야기

*응답* 스트림은 현재 모든 최신 브라우저에서 사용할 수 있습니다. 서버에서 도착하는 응답의 일부에 다음과 같이 액세스할 수 있습니다.

```js
const response = await fetch(url);
const reader = response.body.getReader();

while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  console.log('Received', value);
}

console.log('Response fully received');
```

각 `value`는 바이트의 `Uint8Array` 입니다. 얻을 수 있는 어레이의 수와 어레이의 크기는 네트워크 속도에 따라 다릅니다. 빠른 연결을 사용하는 경우 더 적은 양의 더 큰 데이터 '청크(chuncks)'를 얻게 됩니다. 느린 연결을 사용하는 경우 더 많은 작은 청크를 얻게 됩니다.

바이트를 텍스트로 변환하려면 [`TextDecoder`](https://developer.mozilla.org/docs/Web/API/TextDecoder/decode)를 사용하거나 [대상 브라우저에서 지원하는](https://caniuse.com/#feat=mdn-api_textdecoderstream) 경우 최신 변환 스트림을 사용할 수 있습니다.

```js
const response = await fetch(url);
const reader = response.body
  .pipeThrough(new TextDecoderStream())
  .getReader();
```

`TextDecoderStream`는 이러한 모든 `Uint8Array` 덩어리를 가져와 문자열로 변환하는 변환 스트림입니다.

스트림은 데이터가 도착하는 즉시 작업을 시작할 수 있기 때문에 훌륭합니다. 예를 들어, 100개의 '결과' 목록을 수신하는 경우 100개 모두를 기다리지 않고 수신하는 즉시 첫 번째 결과를 표시할 수 있습니다.

어쨌든, 그것은 응답 스트림입니다. 제가 이야기하고 싶은 흥미롭고 새로운 것은 요청 스트림입니다.

## 본문 요청 스트리밍

요청에는 다음과 같은 본문이 있을 수 있습니다.

```js
await fetch(url, {
  method: 'POST',
  body: requestBody,
});
```

이전에는 요청을 시작하기 전에 전체 본문을 준비해야 했지만 이제는 Chrome 95에서 고유 `ReadableStream` 데이터를 제공할 수 있습니다.

```js
function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

const stream = new ReadableStream({
  async start(controller) {
    await wait(1000);
    controller.enqueue('This ');
    await wait(1000);
    controller.enqueue('is ');
    await wait(1000);
    controller.enqueue('a ');
    await wait(1000);
    controller.enqueue('slow ');
    await wait(1000);
    controller.enqueue('request.');
    controller.close();
  },
}).pipeThrough(new TextEncoderStream());

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' },
  body: stream,
});
```

위는 "이것은 느린 요청입니다"를 한 번에 한 단어씩 서버에 보내고 각 단어마다 1초간 일시적으로 정지됩니다.

요청 본문의 각 청크는 바이트의 `Uint8Array`여야 하기 때문에, `pipeThrough(new TextEncoderStream())`을 사용하여 변환합니다.

### 쓰기 가능한 스트림

`WritableStream` 이 있을 때 스트림으로 작업하는 것이 더 쉬운 경우가 있습니다. 'identity' 스트림을 사용하여 이 작업을 수행할 수 있으며 이는 읽기/쓰기 가능 쌍으로, 전달된 내용을 쓰기 가능한 end로 가져와서 읽기 가능한 end로 보냅니다. 인수 없이 `TransformStream`을 생성하여 다음 중 하나를 생성할 수 있습니다.

```js
const { readable, writable } = new TransformStream();

const responsePromise = fetch(url, {
  method: 'POST',
  body: readable,
});
```

이제 쓰기 가능한 스트림으로 보내는 모든 것이 요청의 일부가 됩니다. 이를 통해 스트림을 함께 작성할 수 있습니다. 예를 들어, 다음은 한 URL에서 데이터를 가져와 압축하고 다른 URL로 보내는 어리석은 예입니다.

```js
// url1에서 가져오기:
const response = await fetch(url1);
const { readable, writable } = new TransformStream();

// url1에서 데이터 압축하기:
response.body
  .pipeThrough(new CompressionStream('gzip'))
  .pipeTo(writable);

// url2로 게시하기:
await fetch(url2, {
  method: 'POST',
  body: readable,
});
```

위의 예는 gzip을 사용하여 임의의 데이터를 압축하기 위해 [압축 스트림](https://chromestatus.com/feature/5855937971617792)을 사용합니다.

### 특징 감지

```js
const supportsRequestStreamsP = (async () => {
  const supportsStreamsInRequestObjects = !new Request('', {
    body: new ReadableStream(),
    method: 'POST',
  }).headers.has('Content-Type');

  if (!supportsStreamsInRequestObjects) return false;

  return fetch('data:a/a;charset=utf-8,', {
    method: 'POST',
    body: new ReadableStream(),
  }).then(() => true, () => false);
})();

// 참고: supportsRequestStreamsP는 약속입니다.
if (await supportsRequestStreamsP) {
  // …
} else {
  // …
}
```

궁금하시다면, 기능 감지가 작동하는 방식은 다음과 같습니다.

브라우저가 특정 `body` 유형을 지원하지 않는 경우, 객체에 `toString()` 을 호출하고 그 결과를 본문으로 사용합니다. 따라서 브라우저가 요청 스트림을 지원하지 않는 경우 요청 본문은 `"[object ReadableStream]"` 문자열이 됩니다. 문자열이 본문으로 사용되면 `Content-Type` 헤더를 `text/plain;charset=UTF-8`로 알맞게 설정합니다. 따라서 해당 헤더가 설정되어 있으면 브라우저가 요청 개체의 스트림을 지원하지 *않는다*는 것을 알고 일찍 종료할 수 있습니다.

불행히도 Safari는 요청 객체의 스트림을 지원*하지만*  `fetch`와 함께 사용할 수 는 *없습니다*.

이를 테스트하기 위해 스트림 본문으로 `fetch`를 시도합니다. 테스트는 네트워크에 의존하는 경우 불안정하고 느릴 수 있지만 고맙게도 사양의 단점은 `data:` URL)에 `POST` 요청을 허용합니다. 이것은 연결 없이 빠르게 작동합니다. Safari는 스트림 본문을 지원하지 않기 때문에 이 호출을 거부합니다.

## 제한

스트리밍 요청은 웹의 새로운 기능이기 때문에 다음과 같은 몇 가지 제한 사항이 있습니다.

### 제한된 리디렉션

일부 형식의 HTTP 리디렉션에서는 브라우저에서 요청 본문을 다른 URL로 다시 보내야 합니다. 이를 지원하려면 브라우저는 스트림의 내용을 버퍼링해야 하는데, 이는 일종의 요점을 무효화하므로 그렇게 하지 않습니다.

대신 요청에 스트리밍 본문이 있고 응답이 303이 아닌 HTTP 리디렉션인 경우 가져오기가 거부되고 리디렉션이 수행되지 *않습니다*.

303 리디렉션은 메서드를 명확하게 `GET`으로 변경하고 요청 본문을 삭제하기 때문에 허용됩니다.

### 기본적으로 HTTP/2 전용

기본적으로 연결 방식이 HTTP/2가 아니면 가져오기가 거부됩니다. HTTP/1.1을 통한 스트리밍 요청을 사용하려면 다음을 선택해야 합니다.

```js/3-3
await fetch(url, {
  method: 'POST',
  body: stream,
  allowHTTP1ForStreamingUpload: true,
});
```

{% Aside 'caution' %} `allowHTTP1ForStreamingUpload`는 비표준이며 Chrome의 실험적 구현의 일부로만 사용됩니다. {% endAside %}

HTTP/1.1 규칙에 따라 요청 및 응답 본문은 어느 것이든 `Content-Length` 헤더를 보내야 하므로 상대방이 수신할 데이터의 양을 알거나 [청크 인코딩](https://en.wikipedia.org/wiki/Chunked_transfer_encoding)을 사용하도록 메시지 형식을 변경합니다. 청크 인코딩을 사용하면 본문이 각각 고유한 콘텐츠 길이를 가진 부분으로 분할됩니다.

청크 인코딩은 HTTP/1.1 *응답*에 관해서는 매우 일반적이지만 *요청*에 관해서는 매우 드뭅니다. 이 때문에 Chrome은 호환성에 대해 약간 걱정하고 있으므로 지금은 옵트인 상태입니다.

{% Aside %} HTTP/2 데이터는 청크 [프레임](https://developers.google.com/web/fundamentals/performance/http2#streams_messages_and_frames)을 호출하지만 항상 '청크'되기 때문에 HTTP/2에서는 문제가 되지 않습니다. 청크 인코딩은 HTTP/1.1까지 도입되지 않았으므로 스트리밍 본문이 있는 요청은 HTTP/1 연결에서 항상 실패합니다. {% endAside %}

이 시도가 어떻게 진행되는지에 따라 사양은 스트리밍 응답을 HTTP/2로 제한하거나 항상 HTTP/1.1 및 HTTP/2 모두에 대해 허용합니다.

### 이중 통신 없음

HTTP의 잘 알려지지 않은 기능(이것이 표준 동작인지 여부는 묻는 사람에 따라 다름)은 요청을 보내는 동안 응답을 받을 수 있다는 것입니다. 그러나 잘 알려지지 않았기 때문에 서버와 브라우저에서 잘 지원되지 않습니다.

Chrome의 현재 구현에서는 본문이 완전히 전송될 때까지 응답을 받지 못합니다. 다음 예제에서 `responsePromise` 는 읽을 수 있는 스트림이 닫힐 때까지 resove 되지 않습니다. 그 지점 이전에 서버가 보내는 모든 것은 버퍼링됩니다.

```js
const responsePromise = fetch(url, {
  method: 'POST',
  body: readableStream,
});
```

이중 통신의 다음으로 가장 좋은 방법은 스트리밍 요청으로 하나의 가져오기를 수행한 다음 스트리밍 응답을 수신하기 위해 다른 가져오기를 수행하는 것입니다. 서버는 URL의 ID와 같이 이러한 두 요청을 연결하는 방법이 필요합니다. 이것이 [데모](#demo)가 작동하는 방식입니다.

## 잠재적인 문제

예, 그래서… 이것은 새로운 기능이며 오늘날 인터넷에서 잘 사용되지 않는 기능입니다. 다음은 주의해야 할 몇 가지 문제입니다.

### 서버 측의 비호환성

일부 앱 서버는 스트리밍 요청을 지원하지 않고 대신 전체 요청이 수신될 때까지 기다렸다가 전체 요청을 볼 수 있게 합니다. 대신 [NodeJS](https://nodejs.org/dist/latest-v14.x/docs/api/http.html#http_class_http_incomingmessage)와 같이 스트리밍을 지원하는 앱 서버를 사용하세요.

하지만 아직 숲에서 나오지 않았습니다! NodeJS와 같은 애플리케이션 서버는 일반적으로 "프론트 엔드 서버"라고 하는 다른 서버 뒤에 위치하며, 이 서버는 결국 CDN 뒤에 위치할 수 있습니다. 이들 중 하나가 요청을 체인의 다음 서버에 제공하기 전에 버퍼링하기로 결정하면 요청 스트리밍의 이점을 잃게 됩니다.

또한 HTTP/1.1을 사용하는 경우 서버 중 하나가 청크 인코딩에 대해 준비되지 않을 수 있으며 오류와 함께 실패할 수 있습니다. 하지만 적어도 테스트하고 필요한 경우 서버를 변경해 볼 수는 있습니다.

*…긴 한숨…*

### 통제할 수 없는 비호환성

HTTPS를 사용하는 경우 사용자와 사용자 간의 프록시에 대해 걱정할 필요가 없지만 사용자가 자신의 컴퓨터에서 프록시를 실행 중일 수 있습니다. 일부 인터넷 보호 소프트웨어는 브라우저와 네트워크 사이를 오가는 모든 것을 모니터링할 수 있도록 이 작업을 수행합니다.

이 소프트웨어가 요청 본문을 버퍼링하거나 HTTP/1.1의 경우 청크 인코딩을 예상하지 않고 흥미로운 방식으로 중단되는 경우가 있을 수 있습니다.

현재로서는 이런 일이 얼마나 자주 일어날지는 분명하지 않습니다.

이를 방지하려면 위의 [데모](#demo)와 유사한 '기능 테스트'를 만들 수 있습니다. 여기서 스트림을 닫지 않고 일부 데이터를 스트리밍하려고 합니다. 서버가 데이터를 수신하면 다른 가져오기를 통해 응답할 수 있습니다. 이러한 일이 발생하면 클라이언트가 엔드 투 엔드 스트리밍 요청을 지원한다는 것을 알게 됩니다.

## 피드백 환영

커뮤니티의 피드백은 새 API 설계에 매우 중요하므로 사용해 보고 의견을 알려주세요! 버그가 발생하면 [보고](https://bugs.chromium.org/p/chromium/issues/list) 해주세요. 일반적인 피드백인 경우에는 [Blink-network-dev Google 그룹](https://groups.google.com/a/chromium.org/forum/#!forum/blink-network-dev)으로 보내주세요.

사진 제공: [Unsplash](https://unsplash.com/s/photos/canoe-stream?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)에서 [Laura Lefurgey-Smith](https://unsplash.com/s/photos/canoe-stream?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
