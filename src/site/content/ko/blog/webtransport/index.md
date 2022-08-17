---
title: WebTransport 실험하기
subhead: WebTransport는 대기 시간이 짧은 양방향 클라이언트-서버 메시징을 제공하는 새로운 API입니다. 사용 사례와 구현의 미래에 대한 피드백을 제공하는 방법에 대해 자세히 알아보세요.
authors:
  - jeffposnick
description: WebTransport는 대기 시간이 짧은 양방향 클라이언트-서버 메시징을 제공하는 새로운 API입니다. 사용 사례와 구현의 미래에 대한 피드백을 제공하는 방법에 대해 자세히 알아보세요.
date: 2020-06-08
updated: 2021-09-29
hero: image/admin/Wh6q6ughWxUYcu4iOutU.jpg
hero_position: 센터
alt: |2

  빠르게 움직이는 교통의 사진.
origin_trial:
  url: "https://developer.chrome.com/origintrials/#/view_trial/793759434324049921"
tags:
  - blog
  - capabilities
  - network
feedback:
  - api
---

{% Aside 'caution' %} 이 제안은 원본 평가판 기간 동안 계속 변경됩니다. 브라우저 구현과 이 기사의 정보 사이에 차이가 있을 수 있습니다.

이 진화하는 제안에 대한 최신 정보는 [편집자의 WebTransport 초안](https://w3c.github.io/webtransport/)을 읽어보십시오.

제안이 안정화되면 이 기사와 관련 코드 샘플을 최신 정보로 업데이트할 것입니다. {% endAside %}

## 배경

### WebTransport란 무엇입니까?

[WebTransport](https://w3c.github.io/webtransport/)는 [HTTP/3](https://quicwg.org/base-drafts/draft-ietf-quic-http.html) 프로토콜을 양방향 전송으로 사용하는 웹 API입니다. 웹 클라이언트와 HTTP/3 서버 간의 양방향 통신을 위한 것입니다. [데이터그램 API](#datagram)를 통해 데이터를 안정적으로 전송하지 않고 [스트림 API](#stream)를 통해 안정적으로 데이터 전송을 지원합니다.

[데이터그램](https://tools.ietf.org/html/draft-ietf-quic-datagram-00)은 강력한 전달 보장이 필요하지 않은 데이터를 보내고 받는 데 이상적입니다. 데이터의 개별 패킷은 기본 연결의 [최대 전송 단위(MTU)](https://en.wikipedia.org/wiki/Maximum_transmission_unit)에 의해 크기가 제한되며 성공적으로 전송되거나 전송되지 않을 수 있으며 전송되는 경우 임의의 순서로 도착할 수 있습니다. 이러한 특성으로 인해 데이터그램 API는 대기 시간이 짧고 최선의 데이터 전송에 이상적입니다. 데이터그램은 [사용자 데이터그램 프로토콜(UDP)](https://en.wikipedia.org/wiki/User_Datagram_Protocol) 메시지로 생각할 수 있지만 암호화되고 정체가 제어됩니다.

이와 대조적으로 스트림 API는 [안정적](https://en.wikipedia.org/wiki/Reliability_(computer_networking))이고 정렬된 데이터 전송을 제공합니다. 하나 이상의 정렬된 데이터 스트림을 보내거나 받아야 하는 시나리오에 [적합](https://quicwg.org/base-drafts/draft-ietf-quic-transport.html#name-streams)합니다. 여러 WebTransport 스트림을 사용하는 것은 여러 [TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol) 연결을 설정하는 것과 유사하지만 HTTP/3은 내부적으로 더 가벼운 [QUIC](https://www.chromium.org/quic) 프로토콜을 사용하기 때문에 많은 오버헤드 없이 열고 닫을 수 있습니다.

### 사용 사례

이것은 개발자가 WebTransport를 사용할 수 있는 가능한 방법의 작은 목록입니다.

- 작고 신뢰할 수 없는 순서가 잘못된 메시지를 통해 서버에 최소한의 대기 시간으로 규칙적인 간격으로 게임 상태를 보냅니다.
- 다른 데이터 스트림과 관계없이 최소한의 대기 시간으로 서버에서 푸시된 미디어 스트림을 수신합니다.
- 웹 페이지가 열려 있는 동안 서버에서 푸시된 알림을 수신합니다.

원본 평가판 프로세스의 일부로 WebTransport를 사용하려는 계획에 대해 자세히 [듣고 싶습니다.](#feedback)

{% Aside %} 이 제안의 많은 개념은 이전에 Chrome의 일부로 출시되지 않은 이전 QuicTransport 원본 평가판의 일부로 실험되었습니다.

WebTransport는 [QUIC](https://www.chromium.org/quic) 대신 [HTTP/3](https://quicwg.org/base-drafts/draft-ietf-quic-http.html)이 기본 전송 프로토콜이라는 주요 차이점을 제외하고 QuickTransport와 유사한 사용 사례를 지원합니다. {% endAside %}

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
<td data-md-type="table_cell"><a href="https://github.com/w3c/webtransport/blob/main/explainer.md" data-md-type="link">완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. 사양의 초안 작성</td>
<td data-md-type="table_cell"><a href="https://w3c.github.io/webtransport/" data-md-type="link">완료</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">3. 피드백 수집 및 설계 반복</strong></td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link"><strong data-md-type="double_emphasis">진행</strong></a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">4. 원본 평가판</strong></td>
<td data-md-type="table_cell"><a href="#register-for-ot" data-md-type="link"><strong data-md-type="double_emphasis">진행</strong></a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. 출시</td>
<td data-md-type="table_cell">시작되지 않음</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## WebTransport와 다른 기술의 관계

### WebTransport가 WebSocket을 대체합니까?

어쩌면 그럴 수도 있습니다. [WebSocket](https://developer.mozilla.org/docs/Web/API/WebSockets_API) 또는 WebTransport가 유효한 통신 프로토콜일 수 있는 사용 사례가 있습니다.

WebSockets 통신은 일부 유형의 통신 요구 사항에 적합한 하나의 안정적이고 정렬된 메시지 스트림을 중심으로 모델링됩니다. 이러한 특성이 필요한 경우 WebTransport의 스트림 API도 이러한 특성을 제공할 수 있습니다. 이에 비해 WebTransport의 데이터그램 API는 안정성이나 주문에 대한 보장 없이 짧은 지연 시간 전달을 제공하므로 WebSocket을 직접 대체할 수 없습니다.

데이터그램 API 또는 여러 동시 Streams API 인스턴스를 통해 WebTransport를 사용하면 WebSocket에서 문제가 될 수 있는 [헤드 오브 라인 차단](https://en.wikipedia.org/wiki/Head-of-line_blocking)에 대해 걱정할 필요가 없습니다. 또한 기본 [QUIC 핸드셰이크](https://www.fastly.com/blog/quic-handshake-tls-compression-certificates-extension-study)가 TLS를 통해 TCP를 시작하는 것보다 빠르기 때문에 새 연결을 설정할 때 성능 이점이 있습니다.

WebTransport는 새로운 초안 사양의 일부이며 클라이언트 및 서버 라이브러리를 둘러싼 WebSocket 에코시스템은 현재 훨씬 더 강력합니다. 일반적인 서버 설정과 광범위한 웹 클라이언트 지원으로 "즉시 사용 가능한" 기능이 필요한 경우 오늘날 WebSocket이 더 나은 선택입니다.

### WebTransport는 UDP 소켓 API와 동일합니까?

아닙니다. WebTransport는 [UDP 소켓 API](https://www.w3.org/TR/raw-sockets/)가 아닙니다. WebTransport는 HTTP/3을 사용하고 UDP는 "후드에서" UDP를 사용하지만 WebTransport는 암호화 및 혼잡 제어에 대한 요구 사항이 있어 기본 UDP 소켓 API 이상입니다.

### WebTransport는 WebRTC 데이터 채널의 대안입니까?

네, 클라이언트-서버 연결의 경우 그렇습니다. WebTransport는 기본 프로토콜이 다르지만 [WebRTC 데이터 채널](https://developer.mozilla.org/docs/Web/API/RTCDataChannel)과 많은 동일한 속성을 공유합니다.

{% Aside %} WebRTC 데이터 채널은 P2P 통신을 지원하지만 WebTransport는 클라이언트-서버 연결만 지원합니다. 서로 직접 대화해야 하는 여러 클라이언트가 있는 경우 WebTransport는 실행 가능한 대안이 아닙니다. {% endAside %}

일반적으로, HTTP / 3 호환 서버를 실행하는 것은 이해 여러 프로토콜 (포함하는 WebRTC가 서버 유지보다 설치 및 구성이 필요 [ICE](https://developer.mozilla.org/docs/Web/API/WebRTC_API/Connectivity#ICE_candidates), [DTLS](https://webrtc-security.github.io/#4.3.1.) 및 [SCTP](https://developer.mozilla.org/docs/Web/API/RTCSctpTransport)를 작업 전송을 얻기 위해 참조). WebRTC는 클라이언트/서버 협상 실패로 이어질 수 있는 더 많은 움직이는 부분을 수반합니다.

WebTransport API는 웹 개발자 사용 사례를 염두에 두고 설계되었으며 WebRTC의 데이터 채널 인터페이스를 사용하는 것보다 최신 웹 플랫폼 코드를 작성하는 것과 같은 느낌이 들 것입니다. [WebRTC와 달리](https://bugs.chromium.org/p/chromium/issues/detail?id=302019) WebTransport는 [Web Worker](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers) 내에서 지원되므로 주어진 HTML 페이지와 독립적으로 클라이언트-서버 통신을 수행할 수 있습니다. WebTransport는 [Streams](https://streams.spec.whatwg.org/) 호환 인터페이스를 노출하기 때문에 [backpressure](https://streams.spec.whatwg.org/#backpressure)에 대한 최적화를 지원합니다.

그러나 이미 만족스럽게 작동하는 WebRTC 클라이언트/서버 설정이 있는 경우 WebTransport로 전환하는 것이 많은 이점을 제공하지 않을 수 있습니다.

## 사용해보기

WebTransport를 실험하는 가장 좋은 방법은 호환되는 HTTP/3 서버를 로컬로 시작하는 것입니다. (안타깝게도 최신 사양과 호환되는 공개 참조 서버는 현재 사용할 수 없습니다.) 그러면 이 페이지를 [기본 JavaScript 클라이언트](https://googlechrome.github.io/samples/webtransport/client.html)와 함께 사용하여 클라이언트/서버 통신을 시도할 수 있습니다.

## API 사용

[WebTransport는 Streams API](https://developer.mozilla.org/docs/Web/API/Streams_API)와 같은 최신 웹 플랫폼 기본 요소를 기반으로 설계되었습니다. 또한 [promise](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Using_promises)에 크게 의존하며 [<code>async</code> 및 <code>await</code>](https://developer.mozilla.org/docs/Learn/JavaScript/Asynchronous/Async_await)와 원활히 작동합니다.

WebTransport [원본 평가판](#register-for-ot)은 데이터그램과 단방향 및 양방향 스트림의 세 가지 고유한 트래픽 유형을 지원합니다.

### 서버에 연결

`WebTransport` 인스턴스를 생성하여 HTTP/3 서버에 연결할 수 있습니다. URL 스키마는 `https`여야 합니다. 포트 번호를 명시적으로 지정해야 합니다.

연결이 설정될 때까지 기다리 `ready` promise를 사용해야 합니다. 이 약속은 설정이 완료될 때까지 이행되지 않으며 QUIC/TLS 단계에서 연결이 실패하면 거부됩니다.

`closed` promise는 연결이 정상적으로 닫힐 때 수행되고 예기치 않은 닫힘이 있는 경우 거부합니다.

서버가 [클라이언트 표시](https://tools.ietf.org/html/draft-vvv-webtransport-quic-01#section-3.2) 오류(예: URL의 경로가 유효하지 않음)로 인해 연결을 거부하는 경우 `ready`가 확인되지 않은 상태로 유지되고 `closed`가 거부됩니다.

```js
const url = 'https://example.com:4999/foo/bar';
const transport = new WebTransport(url);

// Optionally, set up functions to respond to
// the connection closing:
transport.closed.then(() => {
  console.log(`The HTTP/3 connection to ${url} closed gracefully.`);
}).catch((error) => {
  console.error('The HTTP/3 connection to ${url} closed due to ${error}.');
});

// Once .ready fulfills, the connection can be used.
await transport.ready;
```

### 데이터그램 API {: #datagram }

서버에 연결된 WebTransport 인스턴스가 있으면 이를 사용하여 [데이터그램](https://en.wikipedia.org/wiki/Datagram)이라고 하는 개별 데이터 비트를 보내고 받을 수 있습니다.

`writeable` getter는 웹 클라이언트가 서버에 데이터를 보내는 데 사용할 수 <code>[WritableStream](https://developer.mozilla.org/docs/Web/API/WritableStream)</code>를 반환합니다. <code>readable</code> getter는 <code>[ReadableStream](https://developer.mozilla.org/docs/Web/API/ReadableStream)</code> 반환하여 서버에서 데이터를 수신할 수 있습니다. 두 스트림 모두 본질적으로 신뢰할 수 없으므로 작성하는 데이터가 서버에서 수신되지 않을 수 있으며 그 반대의 경우도 마찬가지입니다.

두 가지 유형의 스트림 모두 <code>[Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)</code> 인스턴스를 사용합니다.

```js
// Send two datagrams to the server.
const writer = transport.datagrams.writable.getWriter();
const data1 = new Uint8Array([65, 66, 67]);
const data2 = new Uint8Array([68, 69, 70]);
writer.write(data1);
writer.write(data2);

// Read datagrams from the server.
const reader = transport.datagrams.readable.getReader();
while (true) {
  const {value, done} = await reader.read();
  if (done) {
    break;
  }
  // value is a Uint8Array.
  console.log(value);
}
```

{% Aside %} Chrome은 [현재](https://bugs.chromium.org/p/chromium/issues/detail?id=929585) `ReadableStream`에 대한 [비동기 반복자](https://github.com/whatwg/streams/issues/778)를 노출하지 않습니다. 당분간은 `getReader()` `while()` 루프와 함께 사용하는 것이 스트림에서 읽는 가장 좋은 방법입니다. {% endAside %}

### 스트림 API {: #stream }

서버에 연결하면 WebTransport를 사용하여 Streams API를 통해 데이터를 보내고 받을 수도 있습니다.

모든 스트림의 각 청크는 `Uint8Array`입니다. Datagram API와 달리 이러한 스트림은 신뢰할 수 있습니다. 그러나 각 스트림은 독립적이므로 스트림 전체의 데이터 순서가 보장되지 않습니다.

#### 센드스트림

<code>[SendStream](https://wicg.github.io/web-transport/#sendstream)</code> `WebTransport` <code>createSendStream()</code> 메서드를 사용하여 웹 클라이언트에 의해 생성되며, 이 <code>SendStream</code>를 반환합니다.

<code>[WritableStreamDefaultWriter](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter)</code> 관련 HTTP/3 연결을 닫습니다. 브라우저는 연결된 연결을 실제로 닫기 전에 보류 중인 모든 데이터를 보내려고 합니다.

```js
// Send two Uint8Arrays to the server.
const stream = await transport.createSendStream();
const writer = stream.writable.getWriter();
const data1 = new Uint8Array([65, 66, 67]);
const data2 = new Uint8Array([68, 69, 70]);
writer.write(data1);
writer.write(data2);
try {
  await writer.close();
  console.log('All data has been sent.');
} catch (error) {
  console.error(`An error occurred: ${error}`);
}
```

마찬가지로 <code>[WritableStreamDefaultWriter](https:/ /developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter)</code>에서 [QUIC RESET_STREAM](https://tools.ietf.org/html/draft-ietf-quic-transport-27#section-19.4)을 서버로 보냅니다. <code>abort()</code>를 사용할 때 브라우저는 아직 전송되지 않은 보류 중인 데이터를 삭제할 수 있습니다.

```js
const ws = await transport.createSendStream();
const writer = ws.getWriter();
writer.write(...);
writer.write(...);
await writer.abort();
// Not all the data may have been written.
```

#### ReceiveStream

<code>[ReceiveStream](https://wicg.github.io/web-transport/#receivestream)</code>은 서버에서 시작됩니다. <code>ReceiveStream</code> 얻는 것은 웹 클라이언트에 대한 2단계 프로세스입니다. `WebTransport` <code>receiveStreams()</code> 메서드를 호출하여 <code>ReadableStream</code>을 반환합니다. <code>ReadableStream</code>의 각 청크는 차례로 서버에서 보낸 <code>Uint8Array</code> 인스턴스를 읽는 데 사용할 수 <code>ReceiveStream</code>에 해당합니다.

```js
async function readFrom(receiveStream) {
  const reader = receiveStream.readable.getReader();
  while (true) {
    const {done, value} = await reader.read();
    if (done) {
      break;
    }
    // value is a Uint8Array
    console.log(value);
  }
}

const rs = transport.receiveStreams();
const reader = rs.getReader();
while (true) {
  const {done, value} = await reader.read();
  if (done) {
    break;
  }
  // value is an instance of ReceiveStream
  await readFrom(value);
}
```

<code>[ReadableStreamDefaultReader](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader)</code>의 <code>[ReadableStreamDefaultReader](https: //developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader)</code> promise를 사용하여 스트림 닫힘을 감지할 수 있습니다. 기본 HTTP/3 연결이 [FIN 비트로 닫히면](https://tools.ietf.org/html/draft-ietf-quic-transport-27#section-19.8) 모든 데이터를 읽은 후 <code>닫힌</code> 약속이 이행됩니다. HTTP/3 연결이 갑자기 종료된 경우(예: <code>[STREAM_RESET](https://tools.ietf.org/html/draft-ietf-quic-transport-27#section-19.4)</code>) <code>closed</code> promise가 거부됩니다.

```js
// Assume an active receiveStream
const reader = receiveStream.readable.getReader();
reader.closed.then(() => {
  console.log('The receiveStream closed gracefully.');
}).catch(() => {
  console.error('The receiveStream closed abruptly.');
});
```

#### BidirectionalStream

<code>[BidirectionalStream](https://wicg.github.io/web-transport/#bidirectional-stream)</code>은 서버 또는 클라이언트에 의해 생성될 수 있습니다.

`createBidirectionalStream()` 메서드를 사용하여 생성할 수 있으며, `BidirectionalStream` `WebTransport`에 대한 promise를 반환합니다.

```js
const stream = await transport.createBidirectionalStream();
// stream is a BidirectionalStream
// stream.readable is a ReadableStream
// stream.writable is a WritableStream
```

`ReadableStream`을 반환하는 `WebTransport` `receiveBidirectionalStreams()` 메서드를 사용하여 서버에서 생성한 `BidirectionalStream`을 수신할 수 있습니다. 따라서 `ReadableStream`의 각 청크는 `BidirectionalStream`입니다.

```js
const rs = transport.receiveBidrectionalStreams();
const reader = rs.getReader();
while (true) {
  const {done, value} = await reader.read();
  if (done) {
    break;
  }
  // value is a BidirectionalStream
  // value.readable is a ReadableStream
  // value.writable is a WritableStream
}
```

`BidirectionalStream` `SendStream`과 `ReceiveStream`의 조합일 뿐입니다. 이전 두 섹션의 예제에서는 각각의 사용 방법을 설명합니다.

### 더 많은 예

[WebTransport 초안 사양](https://wicg.github.io/web-transport/)에는 모든 메서드 및 속성에 대한 전체 문서와 함께 여러 추가 인라인 예제가 포함되어 있습니다.

## 원본 평가판 동안 지원 활성화 {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### Chrome DevTools의 WebTransport

불행히도 WebTransport에 대한 [Chrome의 DevTools](https://developer.chrome.com/docs/devtools/) 지원은 원본 평가판을 시작할 준비가 되지 않았습니다. [이 Chrome 문제](https://bugs.chromium.org/p/chromium/issues/detail?id=1152290)에 "별표"를 표시하여 DevTools 인터페이스의 업데이트에 대한 알림을 받을 수 있습니다.

## 개인 정보 및 보안 고려 사항

신뢰할 수 있는 지침은 사양 초안의 [해당 섹션](https://wicg.github.io/web-transport/#privacy-security)을 참조하십시오.

## 피드백 {: #feedback }

Chrome 팀은 원본 평가판 프로세스 전반에 걸쳐 이 API를 사용한 사용자 여러분의 생각과 경험을 듣고 싶습니다.

### API 설계에 대한 피드백

API에 대해 어색하거나 예상대로 작동하지 않는 것이 있습니까? 아니면 아이디어를 구현하는 데 필요한 누락된 부분이 있습니까?

[Web Transport GitHub 리포지토리](https://github.com/WICG/web-transport/issues)에 문제를 제출하거나 기존 문제에 생각을 추가하세요.

### 구현에 문제가 있습니까?

Chrome 구현에서 버그를 찾으셨나요?

[https://new.crbug.com](https://new.crbug.com)에서 버그를 신고하십시오. 복제에 대한 간단한 지침과 함께 가능한 한 많은 세부 정보를 포함하십시오.

### API를 사용할 계획이신가요?

공개 지원은 Chrome이 기능의 우선 순위를 지정하는 데 도움이 되며 다른 브라우저 공급업체에서 해당 기능을 지원하는 것이 얼마나 중요한지 보여줍니다.

- 관심을 표시하고 도메인 및 연락처 정보를 제공하려면 [원본 평가판](https://developer.chrome.com/origintrials/#/view_trial/793759434324049921)에 가입했는지 확인하십시오.
- 에 트윗 보내기 [@ChromiumDev](https://twitter.com/chromiumdev) 해시 태그 사용 [`#WebTransport`](https://twitter.com/search?q=%23WebTransport&src=typed_query&f=live) 당신이 그것을 사용하는 위치 및 방법에 관한 세부 사항을.

### 일반 토론

다른 범주에 속하지 않는 일반적인 질문이나 문제에 대해 [web-transport-dev Google 그룹](https://groups.google.com/a/chromium.org/g/web-transport-dev)을 사용할 수 있습니다.

## 감사의 말

이 기사는 [WebTransport Explainer](https://github.com/w3c/webtransport/blob/main/explainer.md), [사양 초안](https://wicg.github.io/web-transport/) 및 [관련 설계 문서의](https://docs.google.com/document/d/1UgviRBnZkMUq4OKcsAJvIQFX6UCXeCbOtX_wMgwD_es/edit#) 정보를 통합합니다. 그 토대를 마련해 주신 각 저자에게 감사드립니다.

*이 게시물의 영웅 이미지는 Unsplash의 [Robin Pierre](https://unsplash.com/photos/dPgPoiUIiXk)가 제공한 것입니다.*
