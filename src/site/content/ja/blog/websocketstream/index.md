---
title: WebSocketStream：ストリームをWebSocket APIと統合する
subhead: アプリがWebSocketメッセージに溺れるのを防ぎます または、バックプレッシャを適用してWebSocketサーバーをメッセージで溢れさせます。
authors:
  - thomassteiner
date: 2020-03-27
updated: 2021-02-23
hero: image/admin/8SrIq5at2bH6i98stCgs.jpg
alt: 水が滴り落ちる消火ホース。
description: WebSocketStreamは、ストリームをWebSocket APIと統合します。 これにより、アプリは受信したメッセージにバックプレッシャを適用できます。
tags:
  - blog
  - capabilities
origin_trial:
  url: "https://developers.chrome.com/origintrials/#/view_trial/1977080236415647745"
feedback:
  - api
---

## バックグラウンド

### WebSocket API

[WebSocket API](https://developer.mozilla.org/docs/Web/API/WebSockets_API)[は、WebSocketプロトコル](https://tools.ietf.org/html/rfc6455)へJavaScriptインターフェースを提供します。これにより、ユーザーのブラウザーとサーバーの間で双方向の対話型通信セッションを開くことができます。このAPIを使用すると、サーバーにメッセージを送信し、応答のためにサーバーをポーリングしなくても、イベント駆動型の応答を受信できます。

### Streams API

[Streams APIを](https://developer.mozilla.org/docs/Web/API/Streams_API)を使用することで、JavaScriptは、ネットワーク経由で受信したデータチャンクのストリームにプログラムでアクセスし、それらを適切に処理できます。ストリームのコンテキストでの重要な概念は[背圧](https://developer.mozilla.org/docs/Web/API/Streams_API/Concepts#Backpressure)です。これは、単一のストリームまたはパイプチェーンが読み取りまたは書き込みの速度を調整するプロセスです。ストリーム自体またはパイプチェーンの次のストリームがまだビジーであり、さらにチャンクを受け入れる準備ができていない場合、必要に応じて配信を遅くするためにチェーンを介して信号を逆方向に送信します。

### 現在のWebSocketAPIの問題

#### 受信したメッセージにバックプレッシャを適用することは不可能です

現在のWebSocketAPIでは、メッセージへの反応は[`WebSocket.onmessage`](https://developer.mozilla.org/docs/Web/API/WebSocket/onmessage)で発生します。これは、サーバーからメッセージを受信したときに`EventHandler`を呼び出されます。

新しいメッセージを受信するたびに大量のデータの処理操作を実行する必要があるアプリケーションがあると仮定してください。おそらく以下のコードのようなフローを設定し、 `process()`呼び出しの結果`await`ので、うまくいくはずでしょう？

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

それは間違い！現在のWebSocket APIの問題は、背圧を適用する方法がないことです。 `process()`メソッドが処理できるよりも速くメッセージが到着すると、レンダリングプロセスはそれらのメッセージをバッファリングすることによってメモリをいっぱいにするか、100％のCPU使用率のせいで応答しなくなるか、またはその両方が発生します。

#### 送信されたメッセージに背圧を適用することは非人間工学的です

送信されたメッセージにバックプレッシャを適用することは可能ですが、 [`WebSocket.bufferedAmount`](https://developer.mozilla.org/docs/Web/API/WebSocket/bufferedAmount)プロパティをポーリングすることに係わって、これは非効率的と非人間工学的です。[`WebSocket.send()`](https://developer.mozilla.org/docs/Web/API/WebSocket/send)呼び出しを使用してキューに入れられたが、ネットワークにまだ送信されていないデータのバイト数を返します。キューに入れられたすべてのデータが送信されると、この値はゼロにリセットされますが、 `WebSocket.send()`呼び出しを続けると、上昇し続けます。

## WebSocketStream APIとは何ですか？{: #what }

WebSocketStream APIは、ストリームをWebSocket APIと統合することにより、存在しない、または非人間工学的な背圧の問題に対処します。これは、追加費用なしで「無料」で背圧が適用させられることを意味します。

### WebSocketStream APIの推奨されるユースケース{: #use-cases }

このAPIを使用できるサイトの例は次のとおりです。

- 対話性を維持する必要がある高帯域幅のWebSocketアプリケーション、特にビデオと画面共有。
- 同様に、サーバーにアップロードする必要があるブラウザで大量のデータを生成するビデオキャプチャやその他のアプリケーション。背圧を使用することで、クライアントはデータをメモリに蓄積するのではなく、データの生成を停止することができます。

## 現在のステータス {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">ステップ</th>
<th data-md-type="table_cell">状態</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1.説明者を作成します</td>
<td data-md-type="table_cell"><a href="https://github.com/ricea/websocketstream-explainer/blob/master/README.md" data-md-type="link">完了</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2.仕様の初期ドラフトを作成します</td>
<td data-md-type="table_cell"><a href="https://github.com/ricea/websocketstream-explainer/blob/master/README.md" data-md-type="link">進行中</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3.フィードバックを収集し、設計を繰り返します</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">進行中</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4.Origin trial</td>
<td data-md-type="table_cell"><a href="https://developers.chrome.com/origintrials/#/view_trial/1977080236415647745" data-md-type="link">完了</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">5.起動</td>
<td data-md-type="table_cell">未開始</td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## WebSocketStream APIの使用方法{: #use }

### 導入例

WebSocketStream APIはpromiseベースであるため、最新のJavaScript界で自然に処理できます。まず、新しい`WebSocketStream`を作成し、それにWebSocketサーバーのURLを渡します。次に`connection`が確立されるのを待ちます。これにより、[`ReadableStream`](https://developer.mozilla.org/docs/Web/API/ReadableStream/ReadableStream)及び/又は[`WritableStream`](https://developer.mozilla.org/docs/Web/API/WritableStream/WritableStream)が生成されます。

[`ReadableStream.getReader()`](https://developer.mozilla.org/docs/Web/API/ReadableStream/getReader) メソッドを呼び出すことで、最終的に[`ReadableStreamDefaultReader`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader)を取得します。これにより、ストリームが完了するまで、つまり、`{value: undefined, done: true}`の形式のオブジェクトが返されるまで、データを[`read()`](https://developer.mozilla.org/docs/Web/API/ReadableStreamDefaultReader/read)できます。

したがって、 [`WritableStream.getWriter()`](https://developer.mozilla.org/docs/Web/API/WritableStream/getWriter)メソッドを呼び出すことにより、最終的に[`WritableStreamDefaultWriter`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter)取得し、これにデータを[`write()`](https://developer.mozilla.org/docs/Web/API/WritableStreamDefaultWriter/write)ことができます。

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

#### 背圧

約束された背圧機能はどうですか？私が上記で書いたように、あなたは余分なステップなしでそれを「無料」で手に入れます。 `process()`にさらに時間がかかる場合、次のメッセージはパイプラインの準備ができた後のみ消費されます。同様に、 `WritableStreamDefaultWriter.write()`ステップは、安全に実行できる場合にのみ続行されます。

### 高度な例

WebSocketStreamの2番目の引数は、将来の拡張を可能にするオプションバッグです。現在、唯一のオプションは`protocols` です。これは、[WebSocketコンストラクターの2番目の引数](https://developer.mozilla.org/docs/Web/API/WebSocket/WebSocket#Parameters:~:text=respond.-,protocols)と同じように動作します。

```js
const chatWSS = new WebSocketStream(CHAT_URL, {protocols: ['chat', 'chatv2']});
const {protocol} = await chatWSS.connection;
```

選択された`protocol`と潜在的な`extensions` `WebSocketStream.connection`を介して利用可能な辞書の一部です。ライブ接続に関するすべての情報は、接続が失敗した場合には関係がないため、このPromiseによって提供されます。

```js
const {readable, writable, protocol, extensions} = await chatWSS.connection;
```

### 閉じられたWebSocketStream接続に関する情報

WebSocket APIの[`WebSocket.onclose`](https://developer.mozilla.org/docs/Web/API/WebSocket/onclose)と[`WebSocket.onerror`](https://developer.mozilla.org/docs/Web/API/WebSocket/onerror)から入手できた情報は、`WebSocketStream.closed` promiseから入手できるようになりました。不潔なクローズの場合、約束はリークジェクトします。それ以外の場合、サーバーから送信されたコードと理由で解決されます。

考えられるすべてのステータスコードとその意味は[`CloseEvent`ステータスコードのリストで](https://developer.mozilla.org/docs/Web/API/CloseEvent#Status_codes)説明されています。

```js
const {code, reason} = await chatWSS.closed;
```

### WebSocketStream接続を閉じる

[`AbortController`](https://developer.mozilla.org/docs/Web/API/AbortController)でWebSocketStreamを閉じることができます。したがって、 [`AbortSignal`](https://developer.mozilla.org/docs/Web/API/AbortSignal)を`WebSocketStream`コンストラクターに渡してください。

```js
const controller = new AbortController();
const wss = new WebSocketStream(URL, {signal: controller.signal});
setTimeout(() => controller.abort(), 1000);
```

他の方法として、`WebSocketStream.close()`メソッドを使用することもできますが、その主な目的は、サーバーに送信される[コード](https://developer.mozilla.org/docs/Web/API/CloseEvent#Status_codes)と理由を指定できるようにすることです。

```js
wss.close({code: 4000, reason: 'Game over'});
```

### プログレッシブエンハンスメントと相互運用性

Chromeは現在、WebSocketStream APIを実装する唯一のブラウザです。クラシックのWebSocketAPIとの相互運用性のために、受信したメッセージに背圧を適用することはできません。送信されたメッセージに背圧を適用することは可能ですが、  [`WebSocket.bufferedAmount`](https://developer.mozilla.org/docs/Web/API/WebSocket/bufferedAmount)プロパティをポーリングすることに係わって、これは非効率的と非人間工学的です。

#### 特徴の検出

WebSocketStream APIがサポートされているかどうかを確認するには、次を使用しましょう。

```javascript
if ('WebSocketStream' in window) {
  // `WebSocketStream` is supported!
}
```

## デモ

サポートされているブラウザでは、埋め込みiframeで、または[Glitchで直接](https://websocketstream-demo.glitch.me/)WebSocketStreamAPIの動作を確認できます。

{% Glitch { id: 'websocketstream-demo', path: 'public/index.html' } %}

## フィードバック {: #feedback }

Chromeチームは、WebSocketStreamAPIの使用経験について聞きたいと思っています。

### APIの設計について教えてください

期待どおりに機能しないAPIについて何かありますか？または、アイデアを実装するために必要なメソッドやプロパティが不足していますか？セキュリティモデルについて質問やコメントがありますか？該当の[対応するGitHub](https://github.com/ricea/websocketstream-explainer/issues)リポジトリに仕様の問題をファイルするか、既存の問題に考えを追加してください。

### 実装に関する問題を報告する

Chromeの実装にバグを見つけましたか？それとも、実装は仕様とは異なりますか？ [new.crbug.comで](https://new.crbug.com)でバグを報告してください。できる限り詳細な説明と複製の簡単な手順を必ず含めて、コンポーネントボックスに**コンポーネント**に`Blink>Network>WebSockets`と入力してください。[グリッチ](https://glitch.com/)は、すばやく簡単に共有できる複製ケースに最適です。

### APIのサポートを表示します

WebSocketStream APIを使用する予定がありますか？パブリックサポートは、Chromeチームが機能に優先順位を付けることに役立ち、他のブラウザベンダーにそれらをサポートすることがいかに重要であるかを示します。

[@ChromiumDev](https://twitter.com/ChromiumDev)にツイートして、このAPIをどこで、どのように使用されているのかお知らせください。ハッシュタグは[`#WebSocketStream`](https://twitter.com/search?q=%23WebSocketStream&src=typed_query&f=live)をお使いください。

## 参考リンク{: #helpful }

- [公開説明者](https://github.com/ricea/websocketstream-explainer/blob/master/README.md)
- [WebSocketStreamAPIデモ](https://websocketstream-demo.glitch.me/)| [WebSocketStreamAPIデモソース](https://glitch.com/edit/#!/websocketstream-demo)
- [バグの追跡](https://bugs.chromium.org/p/chromium/issues/detail?id=983030)
- [ChromeStatus.comエントリ](https://chromestatus.com/feature/5189728691290112)
- 点滅コンポーネント： [`Blink>Network>WebSockets`](https://bugs.chromium.org/p/chromium/issues/list?q=component:Blink%3ENetwork%3EWebSockets)

## 謝辞

WebSocketStream APIは[Adam Rice](https://github.com/ricea)と[Yutaka Hirano](https://github.com/yutakahirano)によって実装されました。ヒーローイメージは[Daan Mooij](https://unsplash.com/@daanmooij)に[Unsplash](https://unsplash.com/photos/91LGCVN5SAI)でアップロードされました。
