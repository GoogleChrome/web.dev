---
title: WebTransportの実験
subhead: WebTransportは、低レイテンシーで双方向のクライアントサーバーメッセージングを提供する新しいAPIです。その使用例と、実装の将来についてフィードバックを提供する方法の詳細をご覧ください。
authors:
  - jeffposnick
description: WebTransportは、低レイテンシーで双方向のクライアントサーバーメッセージングを提供する新しいAPIです。その使用例と、実装の将来についてフィードバックを提供する方法の詳細をご覧ください。
date: 2020-06-08
updated: 2021-09-29
hero: image/admin/Wh6q6ughWxUYcu4iOutU.jpg
hero_position: center
alt: |2

  動きの速い交通の写真。
origin_trial:
  url: "https://developer.chrome.com/origintrials/#/view_trial/793759434324049921"
tags:
  - blog
  - capabilities
  - network
feedback:
  - api
---

{% Aside 'caution' %} この提案は、オリジンの試用期間中も変更され続けます。ブラウザの実装とこの記事の情報には相違がある可能性があります。

進化しつづけるこの提案の最新情報については、[WebTransportの編集者の下書き](https://w3c.github.io/webtransport/)をお読みください。

提案が安定したら、この記事と関連するコードサンプルを最新の情報で更新します。 {% endAside %}

## 背景

### WebTransportとは？

[WebTransport](https://w3c.github.io/webtransport/)は、[HTTP/3](https://quicwg.org/base-drafts/draft-ietf-quic-http.html)プロトコルを双方向トランスポートとして使用するWebAPIです。これは、WebクライアントとHTTP/3サーバー間の双方向通信を目的としています。[データグラムAPI](#datagram)を介した信頼性の低いデータ送信と、[ストリームAPI](#stream)を介した信頼性の高いデータ送信の両方をサポートします。

[データグラム](https://tools.ietf.org/html/draft-ietf-quic-datagram-00)は、強力な配信保証を必要としないデータの送受信に最適です。データの個々のパケットは、基盤となる接続の[最大転送単位（MTU）](https://en.wikipedia.org/wiki/Maximum_transmission_unit)によってサイズが制限され、正常に送信される場合とされない場合があり、転送される場合は任意の順序で届く可能性があります。これらの特性により、データグラムAPIは、低レイテンシーでベストエフォートのデータ送信に最適です。データグラムは[ユーザーデータグラムプロトコル（UDP）](https://en.wikipedia.org/wiki/User_Datagram_Protocol)メッセージと考えることができますが、暗号化され、輻輳制御されています。

それとは対照的に、ストリームAPIは、[信頼性の高い](https://en.wikipedia.org/wiki/Reliability_(computer_networking))順序付けられたデータ転送を提供します。これらは、順序付けられたデータの1つ以上のストリームを送受信する必要があるシナリオに[最適](https://quicwg.org/base-drafts/draft-ietf-quic-transport.html#name-streams)です。複数のWebTransportストリームを使用することは、複数の[TCP](https://en.wikipedia.org/wiki/Transmission_Control_Protocol)接続を確立することに似ていますが、HTTP/3は内部で軽量の[QUIC](https://www.chromium.org/quic)プロトコルを使用するため、オーバーヘッドをあまりかけずに開閉できます。

### ユースケース

これは、開発者がWebTransportを使用する可能性のある方法を小さくまとめたリストです。

- 小さな、信頼性の低い順不同のメッセージを介して、最小限のレイテンシーで定期的にゲームの状態をサーバーに送信します。
- 他のデータストリームに関係なく、最小限のレイテンシーでサーバーからプッシュされたメディアストリームを受信します。
- Webページが開いているときにサーバーからプッシュされた通知を受信します。

オリジントライアルプロセスの一環として、 WebTransportをどのように使用しようと考えているのかについて、[詳しくお聞かせください](#feedback)。

{% Aside %} この提案の概念の多くは、以前のQuicTransportオリジントライアルの一部として実験されましたが、Chromeの一部としてリリースされることはありませんでした。

WebTransportは、QuicTransportと同様のユースケースに役立ちますが、主な違いは、[QUIC](https://quicwg.org/base-drafts/draft-ietf-quic-http.html)ではなく[HTTP/3](https://www.chromium.org/quic)が、基盤となるトランスポートプロトコルであるということです。 {% endAside %}

## 現在のステータス {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">ステップ</th>
<th data-md-type="table_cell">状態</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. 説明者を作成する</td>
<td data-md-type="table_cell"><a href="https://github.com/w3c/webtransport/blob/main/explainer.md" data-md-type="link">完了</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. 仕様の初期ドラフトを作成する</td>
<td data-md-type="table_cell"><a href="https://w3c.github.io/webtransport/" data-md-type="link">完了</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">3. フィードバックを収集して設計を繰り返す</strong></td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link"><strong data-md-type="double_emphasis">進行中</strong></a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">4. オリジントライアル</strong></td>
<td data-md-type="table_cell"><a href="#register-for-ot" data-md-type="link"><strong data-md-type="double_emphasis">進行中</strong></a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5. 公開</td>
<td data-md-type="table_cell">未開始</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## WebTransportと他のテクノロジーの関係

### WebTransportはWebSocketの代わりですか？

おそらくそうでしょう。[WebSocket](https://developer.mozilla.org/docs/Web/API/WebSockets_API)またはWebTransportのいずれかを有効な通信プロトコルとして使用するユースケースがあります。

WebSocket通信は、単一の信頼できる順序付けられたメッセージストリームを中心にモデル化されています。これは、一部の種類の通信ニーズに適しています。これらの特性が必要なのであれば、WebTransportのストリームAPIでも提供されています。それに比べて、WebTransportのデータグラムAPIは、信頼性や順序を保証することなく、低レイテンシーの配信を提供するため、WebSocketの直接の代替ではありません。

データグラムAPIまたは複数の同時ストリームAPIインスタンスを介してWebTransportを使用すると、WebSocketで問題になることのある[ヘッドオブライン（HOL）ブロッキング](https://en.wikipedia.org/wiki/Head-of-line_blocking)について心配する必要がありません。さらに、基盤となる[QUICハンドシェイク](https://www.fastly.com/blog/quic-handshake-tls-compression-certificates-extension-study)はTCP over TLSを起動するよりも高速であるため、新しい接続を確立するときにパフォーマンス上の利点があります。

WebTransportは新しいドラフト仕様の一部であるため、クライアントおよびサーバーライブラリを取り巻くWebSocketエコシステムは現在はるかに堅牢になっています。一般的なサーバー設定で「初期状態で」機能し、幅広いWebクライアントをサポートするものが必要な場合は、現時点ではWebSocketsがより良い選択と言えます。

### WebTransportはUDP Socket APIと同じですか？

いいえ。WebTransportは[UDP Socket API](https://www.w3.org/TR/raw-sockets/)ではありません。WebTransportはHTTP/3を使用し、HTTP/3は「内部」でUDPを使用しますが、WebTransportには、暗号化と輻輳制御に関する要件があり、基本的なUDP Socket API以上のものになります。

### WebTransportはWebRTCデータチャネルの代替手段ですか？

はい。クライアント/サーバー接続の場合はそうです。WebTransportは、[WebRTCデータチャネル](https://developer.mozilla.org/docs/Web/API/RTCDataChannel)と同じプロパティの多くを共有していますが、基盤となるプロトコルは異なります。

{% Aside %} WebRTCデータチャネルはピアツーピア通信をサポートしますが、WebTransportはクライアント/サーバー接続のみをサポートします。相互に直接通信する必要のある複数のクライアントがある場合、WebTransportは実行可能な代替手段ではありません。 {% endAside %}

一般に、HTTP/3互換サーバーを実行するには、WebRTCサーバーを維持するよりもセットアップと構成が少なくて済みます。これには、トランスポートを機能させるために複数のプロトコル（[ICE](https://developer.mozilla.org/docs/Web/API/WebRTC_API/Connectivity#ICE_candidates)、[DTLS](https://webrtc-security.github.io/#4.3.1.)、および[SCTP](https://developer.mozilla.org/docs/Web/API/RTCSctpTransport)）を理解する必要があります。WebRTCには、クライアント/サーバーのネゴシエーションの失敗につながる可能性のある、さらに多くの可動部分が伴います。

WebTransport APIは、Web開発者のユースケースを念頭に置いて設計されており、WebRTCのデータチャネルインターフェイスを使用するよりも、最新のWebプラットフォームコードを記述しているように感じるはずです。 [WebRTCとは異なり](https://bugs.chromium.org/p/chromium/issues/detail?id=302019)、WebTransportは[Web Workers](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers)内でサポートされているため、特定のHTMLページに関係なくクライアント/サーバー通信を実行できます。WebTransportが[ストリーム](https://streams.spec.whatwg.org/)準拠のインターフェースを公開するため、それが[バックプレッシャー](https://streams.spec.whatwg.org/#backpressure)周りの最適化をサポートします。

ただし、満足のいくWebRTCクライアント/サーバーのセットアップがすでに機能している場合は、WebTransportに切り替えても多くの利点が得られない可能性があります。

## 試してみましょう

WebTransportを試す最善の方法は、互換性のあるHTTP/3サーバーをローカルで起動することです。（残念ながら、最新の仕様と互換性のある公開リファレンスサーバーは現在ありません。）その後、このページを[基本的なJavaScriptクライアント](https://googlechrome.github.io/samples/webtransport/client.html)で使用して、クライアント/サーバー通信を試すことができます。

## APIの使用

WebTransportは、[ストリームAPI](https://developer.mozilla.org/docs/Web/API/Streams_API)などの近代的なWebプラットフォームプリミティブの上に設計されました。これは、[プロミス](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Using_promises)に大きく依存し、[<code>async</code>や<code>await</code>](https://developer.mozilla.org/docs/Learn/JavaScript/Asynchronous/Async_await)とうまく動作します 。

WebTransport[オリジントライアル](#register-for-ot)は、データグラムと、単方向ストリームと双方向ストリームの両方の3つの異なるタイプのトラフィックをサポートします。

### サーバーへの接続

HTTP/3サーバーへの接続は、`WebTransport`インスタンスを作成することで実現できます。URLのスキームは`https`であることが推奨されます。ポート番号を明示的に指定する必要があります。

接続が確立されるまで待機するには、`ready`プロミスを使用することをお勧めします。このプロミスは、セットアップが完了するまで実行されず、QUIC/TLSステージで接続が失敗した場合は拒否されます。

`closed`プロミスは、接続が正常に閉じられたときに実行され、クローズが予期されていない場合は拒否されます。

[クライアント表示](https://tools.ietf.org/html/draft-vvv-webtransport-quic-01#section-3.2)エラー（たとえば、URLのパスが無効である場合）が原因でサーバーが接続を拒否した場合、 `ready`は未解決のままですが`closed`は拒否されます。

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

### データグラムAPI {: #datagram }

サーバーに接続されたWebTransportインスタンスを作成したら、それを使用して、[データグラム](https://en.wikipedia.org/wiki/Datagram)と呼ばれる個別のデータビットを送受信できます。

`writeable` getterは<code>[WritableStream](https://developer.mozilla.org/docs/Web/API/WritableStream)</code>を返します。これは、Webクライアントがサーバーにデータを送信するために使用できます。<code>readable</code> getterは<code>[ReadableStream](https://developer.mozilla.org/docs/Web/API/ReadableStream)</code>を返し、サーバーからのデータをリスンできるようにします。どちらのストリームも本質的に信頼性が低いため、書き込んだデータがサーバーで受信されない可能性があります。その逆も同様です。

どちらのタイプのストリームもデータ転送に<code>[Uint8Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)</code>インスタンスを使用します。

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

{% Aside %} Chromeは[現在](https://bugs.chromium.org/p/chromium/issues/detail?id=929585)、 `ReadableStream`の[非同期イテレータ](https://github.com/whatwg/streams/issues/778)を公開していません。当面は、`getReader()`メソッドを`while()`ループと組み合わせて使用することが、ストリームから読み取るための最善の方法です。 {% endAside %}

### ストリームAPI {: #stream }

サーバーに接続したら、WebTransportを使用してストリームAPIを介してデータを送受信することもできます。

すべてのストリームの各チャンクは`Uint8Array`です。データグラムAPIとは異なり、これらのストリームには信頼性があります。ただし、各ストリームは独立しているため、ストリーム間のデータの順序は保証されません。

#### SendStream

<code>[SendStream](https://wicg.github.io/web-transport/#sendstream)</code>は、`WebTransport`インスタンスの<code>createSendStream()</code>メソッドを使用してWebクライアントによって作成され、<code>SendStream</code>のプロミスを返します。

関連付けられたHTTP/3接続を閉じるには、<code>[WritableStreamDefaultWriter](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter)</code>の<code>[close()](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/close)</code>メソッドを使用します。ブラウザは、関連付けられた接続を実際に閉じる前に、保留中のすべてのデータの送信を試みます。

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

同様に、サーバーに[QUIC RESET_STREAM](https://tools.ietf.org/html/draft-ietf-quic-transport-27#section-19.4)を送信するには、<code>[WritableStreamDefaultWriter](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter)</code>の<code>[abort()](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/abort)</code>メソッドを使用します。<code>abort()</code>を使用している場合、ブラウザはまだ送信されていない保留中のすべてのデータを破棄する場合があります。

```js
const ws = await transport.createSendStream();
const writer = ws.getWriter();
writer.write(...);
writer.write(...);
await writer.abort();
// Not all the data may have been written.
```

#### ReceiveStream

<code>[ReceiveStream](https://wicg.github.io/web-transport/#receivestream)</code>がサーバーによって開始されます。<code>ReceiveStream</code>の取得は、Webクライアントの2段階のプロセスです。まず、 `WebTransport`インスタンスの<code>receiveStreams()</code>メソッドを呼び出します。これは<code>ReadableStream</code>を返します。<code>ReadableStream</code>の各チャンクはその代わり、サーバーによって送信された<code>Uint8Array</code>インスタンスを読み取るために使用できる<code>ReceiveStream</code>です。

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

ストリームが閉じたことを検出するには、<code>[ReadableStreamDefaultReader](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader)</code>の<code>[closed](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader/closed)</code>プロミスを使用できます。基盤のHTTP/3接続が[FINビットで閉じられる](https://tools.ietf.org/html/draft-ietf-quic-transport-27#section-19.8)場合、<code>closed</code>プロミスは、すべてのデータが読み取られてから実行されます。HTTP/3接続が突然閉じられる場合（たとえば<code>[STREAM_RESET](https://tools.ietf.org/html/draft-ietf-quic-transport-27#section-19.4)</code>によって）、<code>closed</code>プロミスは拒否します。

```js
// Assume an active receiveStream
const reader = receiveStream.readable.getReader();
reader.closed.then(() => {
  console.log('The receiveStream closed gracefully.');
}).catch(() => {
  console.error('The receiveStream closed abruptly.');
});
```

#### BidirectionStream

<code>[BidirectionalStream](https://wicg.github.io/web-transport/#bidirectional-stream)</code>は、サーバーまたはクライアントのいずれかによって作成されることがあります。

Webクライアントは、`WebTransport`インスタンスの`createBidirectionalStream()`メソッドを使用して作成できます。これにより、`BidirectionalStream`のプロミスが返されます。

```js
const stream = await transport.createBidirectionalStream();
// stream is a BidirectionalStream
// stream.readable is a ReadableStream
// stream.writable is a WritableStream
```

`WebTransport`インスタンスの`receiveBidirectionalStreams()`メソッドを使用して、サーバーによって作成された`BidirectionalStream`をリスンできます。これは、`ReadableStream`を返します。代わりに、`ReadableStream`の各チャンクは、`BidirectionalStream`です。

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

`BidirectionalStream`は単に、`SendStream`と`ReceiveStream`の組み合わせです。前の2つのセクションの例では、それぞれの使用方法を説明しています。

### その他の例

[WebTransportドラフト仕様](https://wicg.github.io/web-transport/)には、すべてのメソッドとプロパティの完全なドキュメントとともに、いくつかのインライン例が追加で含まれています。

## オリジントライアル中のサポートの有効化 {: #register-for-ot }

{% include 'content/origin-trial-register.njk' %}

### ChromeのDevToolsのWebTransport

残念ながら、 WebTransport用の[ChromeのDevTools](https://developer.chrome.com/docs/devtools/)サポートは、オリジントライアルを開始する準備ができていません。[このChromeの問題](https://bugs.chromium.org/p/chromium/issues/detail?id=1152290)に「スター」を付けて、DevToolsインターフェースの更新について通知を受けることができます。

## プライバシーとセキュリティに関する考慮事項

信頼できるガイダンスについては、ドラフト仕様の[対応するセクション](https://wicg.github.io/web-transport/#privacy-security)を参照してください。

## フィードバック {: #feedback }

オリジントライアルプロセス全体を通じ、このAPIを使用した感想や体験をあなたの考えや経験をChromeチームにお聞かせください。

### API設計に関するフィードバック

APIについて、厄介なものや期待どおりに機能しないものはありますか？または、アイデアを実装するために必要なものが不足していませんか？

[Web Transport GitHubリポジトリ](https://github.com/WICG/web-transport/issues)に課題を提出するか、既存の課題に考えを追加してください。

### 実装に問題がありますか？

Chromeの実装にバグが見つかりましたか？

[https://new.crbug.com](https://new.crbug.com)でバグを報告してください。再現するための簡単な手順とともに、できるだけ多くの詳細を含めてください。

### APIの使用を計画していますか？

皆さんの一般サポートによって、Chromeは機能に優先順位を付け、他のブラウザベンダーにそれらをサポートすることがいかに重要であるかを示すことができます。

- [オリジントライアル](https://developer.chrome.com/origintrials/#/view_trial/793759434324049921)に登録して関心があることを示し、ドメインと連絡先情報を入力してください。
- ハッシュタグ「[`#WebTransport`](https://twitter.com/search?q=%23WebTransport&src=typed_query&f=live)」を使用し、どこでどのようWebTransformを使用しているかを詳しくツイートしてください。

### 一般的なディスカッション

他のカテゴリのいずれにも当てはまらない一般的な質問や問題については、[web-transport-devのGoogleグループ](https://groups.google.com/a/chromium.org/g/web-transport-dev)を使用できます。

## 謝辞

この記事には、[WebTransport Explainer](https://github.com/w3c/webtransport/blob/main/explainer.md)、[ドラフト仕様](https://wicg.github.io/web-transport/)、および[関連する設計ドキュメント](https://docs.google.com/document/d/1UgviRBnZkMUq4OKcsAJvIQFX6UCXeCbOtX_wMgwD_es/edit#)からの情報が組み込まれています。その基盤を提供してくれた各作成者に感謝いたします。

*この記事のヒーロー画像: [Robin Pierre](https://unsplash.com/photos/dPgPoiUIiXk)（Unsplash）。*
