---
title: 'WebSocketStream: WebSocket API와 스트림 통합'
subhead: 역 압력(backpressure)을 적용하여 앱이 WebSocket 메시지의 홍수에 빠지거나 WebSocket 서버에 메시지가 넘쳐나는 것을 방지합니다.
authors:
  - thomassteiner
date: 2020-03-27
updated: 2021-02-23
hero: image/admin/8SrIq5at2bH6i98stCgs.jpg
alt: 물이 흘러 나오고 있는 소방 호스.
description: WebSocketStream은 스트림과 WebSocket API를 통합합니다. 이렇게 하면 여러분의 앱이 수신된 메시지에 역 압력을 적용할 수 있습니다.
tags:
  - blog
  - capabilities
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/1977080236415647745"
feedback:
  - api
---

## 배경

### WebSocket API

[WebSocket API](https://developer.mozilla.org/docs/Web/API/WebSockets_API)는 [WebSocket 프로토콜](https://tools.ietf.org/html/rfc6455)에 JavaScript 인터페이스를 제공하며 이를 통해 사용자의 브라우저와 서버 간에 양방향 대화형 통신 세션을 열 수 있습니다. 이 API를 사용하면 서버에 메시지를 보낼 수 있으며, 응답을 위해 서버를 폴링하지 않아도 이벤트 기반 응답을 받을 수 있습니다.

### Streams API

[Streams API](https://developer.mozilla.org/docs/Web/API/Streams_API)를 사용하면 JavaScript가 네트워크를 통해 수신한 데이터 청크 스트림에 프로그래밍 방식으로 액세스하고 원하는 대로 처리할 수 있습니다. 스트림의 맥락에서 중요한 개념은 [역 압력](https://developer.mozilla.org/docs/Web/API/Streams_API/Concepts#Backpressure)입니다. 이것은 단일 스트림 또는 파이프 체인이 읽기 또는 쓰기 속도를 조절하는 프로세스입니다. 스트림 자체 또는 파이프 체인의 나중 스트림이 여전히 사용 중이고 아직 더 많은 청크를 수락할 준비가 되지 않은 경우 적절하게 전달을 느리게 하기 위해 체인을 통해 뒤로 신호를 보냅니다.

### 현재 WebSocket API의 문제

#### 수신한 메시지에 역 압력을 적용하는 것은 불가능

현재 WebSocket API에서는 서버에서 메시지를 수신할 때 호출되는 `EventHandler`인 [`WebSocket.onmessage`](https://developer.mozilla.org/docs/Web/API/WebSocket/onmessage)에서 메시지에 대한 반응이 발생합니다.

새 메시지가 수신될 때마다 많은 양의 데이터 처리 작업을 수행해야 하는 애플리케이션이 있다고 가정해 보겠습니다. 여러분은 아마 아래 코드와 비슷한 흐름을 설정했을 것이고, `process()` 호출의 결과를 `await`합니다. 맞습니까?

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

아닙니다! 현재 WebSocket API의 문제점은 역 압력을 적용할 방법이 없다는 것입니다. 메시지가 `process()` 메서드가 처리할 수 있는 것보다 빠르게 도착하면 렌더링 프로세스는 해당 메시지를 버퍼링하여 메모리를 채우거나, 100% CPU 사용량으로 인해 응답하지 않게 되거나, 두 가지 모두를 수행합니다.

#### 보낸 메시지에 역 압력을 적용하는 것은 인체 공학적이지 않습니다

보낸 메시지에 역 압력을 적용할 수 있지만, 비효율적이며 인체 공학적이지 않은 [`WebSocket.bufferedAmount`](https://developer.mozilla.org/docs/Web/API/WebSocket/bufferedAmount) 속성을 폴링해야 합니다. 이 읽기 전용 속성은 [`WebSocket.send()`](https://developer.mozilla.org/docs/Web/API/WebSocket/send)에 대한 호출을 사용하여 대기했지만 아직 네트워크로 전송되지 않은 데이터의 바이트 수를 반환합니다. 이 값은 대기 중인 모든 데이터가 전송되면 0으로 재설정되지만 `WebSocket.send()`를 계속 호출하면 계속 증가합니다.

## WebSocketStream API란 무엇입니까? {: #what }

WebSocketStream API는 스트림과 WebSocket API를 통합하여 존재하지 않거나 인체 공학적이지 않은 역 압력 문제를 처리합니다. 이는 추가 비용 없이 역 압력을 "무료"로 적용할 수 있음을 의미합니다.

### WebSocketStream API에 대한 권장 사용 사례 {: #use-cases }

이 API를 사용할 수 있는 사이트의 예는 다음과 같습니다.

- 동영상 및 화면 공유와 같이 상호 작용을 유지해야 하는 고대역폭 WebSocket 애플리케이션.
- 이와 유사하게, 서버에 업로드해야 하는 브라우저에서 많은 데이터를 생성하는 동영상 캡처 및 기타 애플리케이션. 역 압력을 사용하면 클라이언트가 메모리에 데이터를 축적하는 대신 데이터 생성을 중지할 수 있습니다.

## 현재 상태 {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">단계</th>
<th data-md-type="table_cell">상태</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. 안내서 만들기</td>
<td data-md-type="table_cell"><a href="https://github.com/ricea/websocketstream-explainer/blob/master/README.md" data-md-type="link">완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. 사양의 초안 작성</td>
<td data-md-type="table_cell"><a href="https://github.com/ricea/websocketstream-explainer/blob/master/README.md" data-md-type="link">진행 중</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. 피드백 수집 및 설계 반복</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">진행 중</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. 원본 평가판</td>
<td data-md-type="table_cell"><a href="https://developers.chrome.com/origintrials/#/view_trial/1977080236415647745" data-md-type="link">완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. 출시</td>
<td data-md-type="table_cell">시작되지 않음</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## WebSocketStream API 사용 방법 {: #use }

### 소개 예시

WebSocketStream API는 프라미스 기반이므로 요즘의 JavaScript 세계에서 자연스럽게 처리할 수 있습니다. 새 `WebSocketStream`을 구성하고 WebSocket 서버의 URL을 전달하여 시작합니다. 다음으로 `connection`이 설정될 때까지 기다리면 [`ReadableStream`](https://developer.mozilla.org/docs/Web/API/ReadableStream/ReadableStream) 및/또는 `WritableStream`의 결과를 얻습니다.

[`ReadableStream.getReader()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/getReader) 메서드를 호출하면 스트림이 완료될 때까지 [`read()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader/read) 데이터를, 그리고 `{value: undefined, done: true}` 형식의 개체를 반환할 때까지 최종적으로 [`ReadableStreamDefaultReader`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader)를 얻을 수 있습니다.

[`WritableStream.getWriter()`](https://developer.mozilla.org/docs/Web/API/WritableStream/getWriter) 메서드를 호출 [`WritableStreamDefaultWriter`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter) 얻을 수 있으며, 이를 통해 데이터를 [`write()`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/write)

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

#### 역 압력

프라미스 역 압력 기능은 어떤가요? 위에 작성한 것처럼 여러분은 "무료"로 이를 얻을 수 있으며 추가 단계가 필요하지 않습니다. `process()`에 추가 시간이 소요되는 경우 파이프라인이 준비된 경우에만 다음 메시지가 사용됩니다. 마찬가지로 `WritableStreamDefaultWriter.write()` 단계는 안전한 경우에만 진행됩니다.

### 고급 예시

WebSocketStream에 대한 두 번째 인수는 향후 확장을 허용하는 옵션 가방(option bag)입니다. 현재 유일한 옵션은 [WebSocket 생성자에 대한 두 번째 인수](https://developer.mozilla.org/docs/Web/API/WebSocket/WebSocket#Parameters:~:text=respond.-,protocols)와 동일하게 작동하는 `protocols`입니다.

```js
const chatWSS = new WebSocketStream(CHAT_URL, {protocols: ['chat', 'chatv2']});
const {protocol} = await chatWSS.connection;
```

선택한 `protocol`과 잠재적인 `extensions`는 `WebSocketStream.connection` 프라미스를 통해 사용할 수 있는 사전의 일부입니다. 라이브 연결에 대한 모든 정보는 연결이 실패하더라도 관련이 없기 때문에 이 프라미스에 의해 제공됩니다.

```js
const {readable, writable, protocol, extensions} = await chatWSS.connection;
```

### 닫힌 WebSocketStream 연결에 대한 정보

WebSocket API의 [`WebSocket.onclose`](https://developer.mozilla.org/docs/Web/API/WebSocket/onclose) 및 [`WebSocket.onerror`](https://developer.mozilla.org/docs/Web/API/WebSocket/onerror) 이벤트에서 사용할 수 있었던 정보를 이제 `WebSocketStream.closed` 프라미스를 통해 사용할 수 있습니다. 이 프라미스는 불완전하게 닫힌 이벤트에서는 거부하며 그렇지 않은 경우에는 서버에서 보낸 코드와 이유를 확인합니다.

가능한 모든 상태 코드와 그 의미는 [`CloseEvent` 상태 코드 목록](https://developer.mozilla.org/docs/Web/API/CloseEvent#Status_codes)에 설명되어 있습니다.

```js
const {code, reason} = await chatWSS.closed;
```

### WebSocketStream 연결 닫기

WebSocketStream은 [`AbortController`](https://developer.mozilla.org/docs/Web/API/AbortController)로 닫을 수 있습니다. 따라서, [`AbortSignal`](https://developer.mozilla.org/docs/Web/API/AbortSignal)을 `WebSocketStream` 생성자에 전달하도록 합니다.

```js
const controller = new AbortController();
const wss = new WebSocketStream(URL, {signal: controller.signal});
setTimeout(() => controller.abort(), 1000);
```

대안으로 `WebSocketStream.close()` 메서드를 사용할 수도 있지만 주요 목적은 서버로 전송되는 [코드](https://developer.mozilla.org/docs/Web/API/CloseEvent#Status_codes)와 이유를 지정하도록 허용하는 것입니다.

```js
wss.close({code: 4000, reason: 'Game over'});
```

### 점진적 향상 및 상호 운용성

Chrome은 현재 WebSocketStream API를 구현하는 유일한 브라우저입니다. 기본형 WebSocket API와의 상호 운용성을 위해 수신한 메시지에 역 압력을 적용하는 것은 불가능합니다. 보낸 메시지에 역 압력을 적용할 수 있지만 비효율적이며 인체 공학적이지 않은 [`WebSocket.bufferedAmount`](https://developer.mozilla.org/docs/Web/API/WebSocket/bufferedAmount) 속성을 폴링해야 합니다.

#### 기능 감지

WebSocketStream API가 지원되는지 확인하려면 다음을 사용합니다.

```javascript
if ('WebSocketStream' in window) {
  // `WebSocketStream` is supported!
}
```

## 데모

지원하는 브라우저에서 WebSocketStream API가 삽입된 iframe에서, 또는 [Glitch에서 직접](https://websocketstream-demo.glitch.me/) 작동하는 것을 볼 수 있습니다.

{% Glitch { id: 'websocketstream-demo', path: 'public/index.html' } %}

## 피드백 {: #feedback }

Chrome 팀은 WebSocketStream API 사용 경험에 대해 듣고 싶습니다.

### API 디자인에 대해 알려주세요

API에 대해 예상한 대로 작동하지 않는 것이 있습니까? 아니면 여러분의 아이디어를 구현하는 데 필요한 메서드나 속성이 누락되어 있습니까? 보안 모델에 대한 질문이나 의견이 있으십니까? 해당하는 [GitHub 리포지토리](https://github.com/ricea/websocketstream-explainer/issues) 에 사양 문제를 제출하거나 기존 문제에 대한 생각을 추가하세요.

### 구현 문제 보고

Chrome 구현에서 버그를 찾으셨나요? 아니면 구현이 사양과 다른가요? [new.crbug.com](https://new.crbug.com)에서 버그를 신고하세요. 가능한 한 많은 세부 정보를 포함하고 버그를 재현하기 위한 간단한 지침을 제공하고 **구성요소** 상자에 `Blink>Network>WebSockets`를 입력하세요. [Glitch](https://glitch.com/)는 빠르고 쉬운 재현을 공유하는 데 유용합니다.

### API에 대한 지원 표시

WebSocketStream API를 사용할 계획이십니까? Chrome 팀이 기능의 우선 순위를 정하고 브라우저 공급업체에 이 API의 지원이 얼마나 중요한지 보여주기 위해서는 여러분의 공개 지원이 힘이 됩니다.

[@ChromiumDev](https://twitter.com/ChromiumDev)으로 해시태그 [`#WebSocketStream`](https://twitter.com/search?q=%23WebSocketStream&src=typed_query&f=live)를 포함한 트윗을 보내서 어디에서 어떻게 활용하고 있는지 알려주세요.

## 유용한 링크 {: #helpful }

- [공개 설명문](https://github.com/ricea/websocketstream-explainer/blob/master/README.md)
- [WebSocketStream API 데모](https://websocketstream-demo.glitch.me/) | [WebSocketStream API 데모 소스](https://glitch.com/edit/#!/websocketstream-demo)
- [버그 추적](https://bugs.chromium.org/p/chromium/issues/detail?id=983030)
- [ChromeStatus.com 항목](https://chromestatus.com/feature/5189728691290112)
- Blink 구성 요소: [`Blink>Network>WebSockets`](https://bugs.chromium.org/p/chromium/issues/list?q=component:Blink%3ENetwork%3EWebSockets)

## 감사의 말

WebSocketStream API는 [Adam Rice](https://github.com/ricea) 와 [Yutaka Hirano에](https://github.com/yutakahirano) 의해 구현되었습니다. [Unsplash](https://unsplash.com/photos/91LGCVN5SAI)의 [Daan Mooij](https://unsplash.com/@daanmooij)의 영웅 이미지.
