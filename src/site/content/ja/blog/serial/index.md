---
title: シリアルポートとの読み書き
subhead: WebシリアルAPIを使用すると、Webサイトはシリアルデバイスと通信できます。
authors:
  - beaufortfrancois
date: 2020-08-12
updated: 2021-11-18
hero: image/admin/PMOws2Au6GPLq9sXSSqw.jpg
thumbnail: image/admin/8diipQ5aHdP03xNuFNp7.jpg
alt: |2

  古いモデム、ルーター、ネットワーク機器。シリアル、電話、オーディオ、イーサネットコネクタ。
description: WebシリアルAPIはWebと物理的な世界の橋渡しとして、Webサイトがシリアルデバイスと通信できるようにします。
tags:
  - blog
  - capabilities
  - devices
feedback:
  - api
---

{% Aside 'success' %}[機能プロジェクト](https://developer.chrome.com/blog/fugu-status/)の一部であるWebSerial APIは、Chrome89でリリースされました。{% endAside %}

## WebシリアルAPIとは何ですか？ {: #what }

シリアルポートは、データをバイト単位で送受信できる双方向通信インターフェースです。

WebシリアルAPIは、WebサイトがJavaScriptを使用してシリアルデバイスとの間で読み取りおよび書き込みを行うための方法を提供します。シリアルデバイスは、ユーザーのシステムのシリアルポートを介して、またはシリアルポートをエミュレートする取り外し可能なUSBおよびBluetoothデバイスを介して接続されます。

言い換えると、WebシリアルAPIは、Webサイトがマイクロコントローラーや3Dプリンターなどのシリアルデバイスと通信できるようにすることで、Webと物理的な世界を橋渡しします。

オペレーティングシステムは、一部のシリアルポートとの通信において、アプリケーションの低レベルのUSB APIではなく高レベルのシリアルAPIを使用する必要があるため、このAPIは[WebUSB](https://developers.google.com/web/updates/2016/03/access-usb-devices-on-the-web)の優れたコンパニオンでもあります。

## 推奨されるユースケース {: #use-cases }

教育、ホビイスト、および産業部門では、ユーザーは周辺機器をコンピューターに接続します。これらのデバイスは、多くの場合、カスタムソフトウェアで使用されるシリアル接続を介してマイクロコントローラーによって制御されます。これらのデバイスを制御するためのいくつかのカスタムソフトウェアは、Webテクノロジーで構築されています。

- [Arduino Create](https://create.arduino.cc/)
- [Betaflight Configurator](https://github.com/betaflight/betaflight-configurator)
- [Espruino Web IDE](http://espruino.com/ide)
- [Microsoft MakeCode](https://www.microsoft.com/makecode)

一部のケースでは、Webサイトは、ユーザーが手動でインストールしたエージェントアプリケーションを介してデバイスと通信します。また他のケースでは、アプリケーションは、Electronなどのフレームワークを介してパッケージ化されたアプリケーションで提供される場合もあります。さらに他のケースでは、コンパイルされたアプリケーションをUSBフラッシュドライブを介してデバイスにコピーするなど、追加の手順を実行する必要ももあります。

これらすべての場合において、ユーザーエクスペリエンスは、Webサイトとそれが制御するデバイスとの間にダイレクトな通信を提供することによって改善されます。

## 現在のステータス {: #status }

<div></div>
<table data-md-type="table">
<thead data-md-table-header><tr data-md-type="table_row">
<th data-md-type="table_cell">ステップ</th>
<th data-md-type="table_cell">状態</th>
</tr></thead>
<tbody data-md-table-body>
<tr data-md-type="table_row">
<td data-md-type="table_cell">1. 説明文書を作成する</td>
<td data-md-type="table_cell"><a href="https://github.com/WICG/serial/blob/main/EXPLAINER.md" data-md-type="link">完了</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">2. 仕様の初期ドラフトを作成する</td>
<td data-md-type="table_cell"><a href="https://github.com/WICG/serial" data-md-type="link">完了</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">3. フィードバックを収集し、設計を繰り返す</td>
<td data-md-type="table_cell"><a href="#feedback" data-md-type="link">完了</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell">4. オリジントライアル</td>
<td data-md-type="table_cell"><a href="https://developers.chrome.com/origintrials/#/view_trial/2992641952387694593" data-md-type="link">完了</a></td>
</tr>
<tr data-md-type="table_row">
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">5. リリース</strong></td>
<td data-md-type="table_cell"><strong data-md-type="double_emphasis">完了</strong></td>
</tr>
</tbody>
</table>
<div data-md-type="block_html"></div>

## WebシリアルAPIの使用 {: #use }

### 機能検出 {: #feature-detection }

WebシリアルAPIがサポートされているかどうかを確認するには、次を使用します。

```js
if ("serial" in navigator) {
  // The Web Serial API is supported.
}
```

### シリアルポートを開く {: #open-port }

WebシリアルAPIは、設計上、非同期型です。このため、入力を待機するときにWebサイトのUIがブロックされるのが防止されます。これは、シリアルデータの受信がいつでも行われる可能性があり、それをリスンする方法が必要になるため重要です。

シリアルポートを開くには、最初に`SerialPort`オブジェクトにアクセスします。このためには、タッチやマウスクリックなどのユーザージェスチャに応答して `navigator.serial.requestPort()`を呼び出して単一のシリアルポートを選択するか、Webサイトがアクセスを付与するシリアルポートのリストを返す`navigator.serial.getPorts()`から1つ選択するようにユーザーにプロンプトできます。

```js
document.querySelector('button').addEventListener('click', async () => {
  // Prompt user to select any serial port.
  const port = await navigator.serial.requestPort();
});
```

```js
// Get all serial ports the user has previously granted the website access to.
const ports = await navigator.serial.getPorts();
```

`navigator.serial.requestPort()`関数は、フィルターを定義するオブジェクトリテラルを任意に取ります。これらは、USB経由で接続されている任意のシリアルデバイスを必須のUSBベンダー（`usbVendorId`）とオプションのUSB製品識別子（ `usbProductId` ）に照合するために使用されます。

```js
// Filter on devices with the Arduino Uno USB Vendor/Product IDs.
const filters = [
  { usbVendorId: 0x2341, usbProductId: 0x0043 },
  { usbVendorId: 0x2341, usbProductId: 0x0001 }
];

// Prompt user to select an Arduino Uno device.
const port = await navigator.serial.requestPort({ filters });

const { usbProductId, usbVendorId } = port.getInfo();
```

<figure>{% Img src="image/admin/BT9OxLREXfb0vcnHlYu8.jpg", alt="Webサイトのシリアルポートプロンプトのスクリーンショット", width="800", height="513" %} <figcaption>BBC micro:bitを選択するためのユーザープロンプト</figcaption></figure>

`requestPort()`呼び出すと、ユーザーはデバイスを選択するように求められ、`SerialPort`オブジェクトが返されます。`SerialPort`オブジェクトを取得したら、目的のボーレートで`port.open()`を呼び出すことで、シリアルポートが開きます。`baudRate`ディクショナリメンバーは、データがシリアル回線を介して送信される速度を指定します。これは、ビット/秒（bps）の単位で表されます。これが正しく指定されていない場合、送受信するすべてのデータが意味のないものになるため、デバイスのドキュメントが正しい値で作成されていることを確認してください。シリアルポートをエミュレートする一部のUSBおよびBluetoothデバイスでは、この値はエミュレーションによって無視されるため、任意の値に安全に設定できます。

```js
// Prompt user to select any serial port.
const port = await navigator.serial.requestPort();

// Wait for the serial port to open.
await port.open({ baudRate: 9600 });
```

シリアルポートを開くときに、以下のオプションのいずれかを指定することもできます。これらのオプションは任意であり、便利な[デフォルト値](https://wicg.github.io/serial/#serialoptions-dictionary)を使用できます。

- `dataBits`: フレームあたりのデータビット数（7または8）。
- `stopBits`: フレームの終わりのストップビットの数（1または2）。
- `parity`: パリティモード（`"none"`、`"even"`、`"odd"`のいずれか）。
- `bufferSize`: 作成する必要のある読み取りおよび書き込みバッファーのサイズ（16MB未満である必要があります）。
- `flowControl`: フロー制御モード（`"none"`または`"hardware"`のいずれか）。

### シリアルポートからの読み取り {: #read-port }

WebシリアルAPIの入力ストリームと出力ストリームは、Streams APIによって処理されます。

{% Aside %} ストリームに詳しくない場合は、Streams APIの[概念](https://developer.mozilla.org/docs/Web/API/Streams_API/Concepts)を確認してください。この記事では、ストリームとストリーム処理についてあまり詳しく説明していません。 {% endAside %}

シリアルポート接続が確立された後、`SerialPort`オブジェクトの`readable`および`writable`プロパティは[ReadableStream](https://developer.mozilla.org/docs/Web/API/ReadableStream)と[WritableStreamを](https://developer.mozilla.org/docs/Web/API/WritableStream)返します。これらは、シリアルデバイスとの間でデータを送受信するために使用されます。どちらもデータ転送に`Uint8Array`インスタンスを使用します。

シリアルデバイスから新しいデータが届くと、 `port.readable.getReader().read()`は、`value`と`done`ブール型の2つのプロパティを非同期的に返します。`done`がtrueである場合、シリアルポートが閉じられているか、データが入力されていません。`port.readable.getReader()`を呼び出すと、リーダーが作成され、`readable`にロックされます。`readable`が[ロック](https://streams.spec.whatwg.org/#lock)されている間は、シリアルポートを閉じることはできません。

```js
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
```

一部の重大ではないシリアルポート読み取りのエラーは、バッファオーバーフロー、フレーミングエラー、パリティエラーなどの特定の条件で発生する可能性があります。これらは例該当してスローされ、`port.readable`をチェックする前のループの上に別のループを追加することでキャッチできます。これは、エラーが重大でない限り、新しい[ReadableStream](https://developer.mozilla.org/docs/Web/API/ReadableStream)が自動的に作成されるため機能します。シリアルデバイスが取り外されるなどの重大なエラーが発生した場合、`port.readable`はnullになります。

```js/0,3,15-18
while (port.readable) {
  const reader = port.readable.getReader();

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        // Allow the serial port to be closed later.
        reader.releaseLock();
        break;
      }
      if (value) {
        console.log(value);
      }
    }
  } catch (error) {
    // TODO: Handle non-fatal read error.
  }
}
```

シリアルデバイスがテキストを送り返す場合は、以下に示すように`TextDecoderStream`を介して`port.readable`を通信（パイプ）します。 `TextDecoderStream`は、すべての`Uint8Array`チャンクを取得して文字列に変換する[変換ストリーム](https://developer.mozilla.org/docs/Web/API/TransformStream)です。

```js/0-2,12
const textDecoder = new TextDecoderStream();
const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
const reader = textDecoder.readable.getReader();

// Listen to data coming from the serial device.
while (true) {
  const { value, done } = await reader.read();
  if (done) {
    // Allow the serial port to be closed later.
    reader.releaseLock();
    break;
  }
  // value is a string.
  console.log(value);
}
```

### シリアルポートへの書き込み {: #write-port }

シリアルデバイスにデータを送信するには、データを `port.writable.getWriter().write()`に渡します。後でシリアルポートを閉じるには、`port.writable.getWriter()`で`releaseLock()`を呼び出す必要があります。

```js
const writer = port.writable.getWriter();

const data = new Uint8Array([104, 101, 108, 108, 111]); // hello
await writer.write(data);


// Allow the serial port to be closed later.
writer.releaseLock();
```

以下に示すように、`port.writable`にパイプされた`TextEncoderStream`を介してデバイスにテキストを送信します。

```js
const textEncoder = new TextEncoderStream();
const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

const writer = textEncoder.writable.getWriter();

await writer.write("hello");
```

### シリアルポートを閉じる {: #close-port }

`readable`および`writable`メンバーの[ロックが解除されている](https://streams.spec.whatwg.org/#lock)場合、つまり、 `releaseLock()`がそれぞれのリーダーとライター用に呼び出されている場合、`port.close()`はシリアルポートを閉じます。

```js
await port.close();
```

ただし、ループを使用してシリアルデバイスからデータを継続的に読み取る場合、 `port.readable`は、エラーが発生するまで常にロックされます。この場合、`reader.cancel()`を呼び出すと、`reader.read()`が直ちに `{ value: undefined, done: true }`で解決することが強制されるため、ループが`reader.releaseLock()`を呼び出せるようになります。

```js
// Without transform streams.

let keepReading = true;
let reader;

async function readUntilClosed() {
  while (port.readable && keepReading) {
    reader = port.readable.getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          // reader.cancel() has been called.
          break;
        }
        // value is a Uint8Array.
        console.log(value);
      }
    } catch (error) {
      // Handle error...
    } finally {
      // Allow the serial port to be closed later.
      reader.releaseLock();
    }
  }

  await port.close();
}

const closedPromise = readUntilClosed();

document.querySelector('button').addEventListener('click', async () => {
  // User clicked a button to close the serial port.
  keepReading = false;
  // Force reader.read() to resolve immediately and subsequently
  // call reader.releaseLock() in the loop example above.
  reader.cancel();
  await closedPromise;
});
```

[変換ストリーム](https://developer.mozilla.org/docs/Web/API/TransformStream)（`TextDecoderStream`や`TextEncoderStream`など）を使用すると、シリアルポートを閉じるのがより複雑になります。以前と同じように`reader.cancel()`を呼び出してから、 `writer.close()`と`port.close()`を呼び出すと、変換ストリームを介して基礎のシリアルポートにエラーが伝播されます。エラーの伝播はすぐには発生しないため、`port.readable`と`port.writable`がロック解除されていることを検出するために前に作成した`readableStreamClosed`と`writableStreamClosed`プロミスを使用する必要があります。`reader`をキャンセルすると、ストリームが中止されてしまうため、これが、生成されるエラーをキャッチして無視する必要がある理由です。

```js/20-26
// With transform streams.

const textDecoder = new TextDecoderStream();
const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
const reader = textDecoder.readable.getReader();

// Listen to data coming from the serial device.
while (true) {
  const { value, done } = await reader.read();
  if (done) {
    reader.releaseLock();
    break;
  }
  // value is a string.
  console.log(value);
}

const textEncoder = new TextEncoderStream();
const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);

reader.cancel();
await readableStreamClosed.catch(() => { /* Ignore the error */ });

writer.close();
await writableStreamClosed;

await port.close();
```

### 接続と切断をリスンする {: #connection-disconnection }

シリアルポートがUSBデバイスによって提供されている場合、そのデバイスはシステムに接続されている可能性もあれば、切断されている可能性もあります。Webサイトに、シリアルポートにアクセスするための権限を付与されている場合、`connect`と`disconnect`のイベントはWebサイトによって監視されています。

```js
navigator.serial.addEventListener("connect", (event) => {
  // TODO: Automatically open event.target or warn user a port is available.
});

navigator.serial.addEventListener("disconnect", (event) => {
  // TODO: Remove |event.target| from the UI.
  // If the serial port was opened, a stream error would be observed as well.
});
```

{% Aside %}Chrome 89の前は、`connect`イベントと`disconnect`イベントによって、`port`属性として使用できる影響のある`SerialPort`インターフェースとともに、カスタム`SerialConnectionEvent`オブジェクトが起動されていました。この移行に対応するには、`event.port || event.target`を使用することをお勧めします。{% endAside %}

### 信号を処理する {: #signals }

シリアルポート接続を確立したら、デバイスの検出とフロー制御のためにシリアルポートが公開する信号を明示的にクエリして設定することができます。これらの信号はブール値として定義されます。たとえば、Arduinoなどのデバイスは、データ端末レディ（DTR）信号が切り替えられるとプログラミングモードになります。

[出力信号](https://wicg.github.io/serial/#serialoutputsignals-dictionary)の設定と[入力信号](https://wicg.github.io/serial/#serialinputsignals-dictionary)の取得はそれぞれ`port.setSignals()`と`port.getSignals()`の呼び出しによって行われます。以下の使用例を参照してください。

```js
// Turn off Serial Break signal.
await port.setSignals({ break: false });

// Turn on Data Terminal Ready (DTR) signal.
await port.setSignals({ dataTerminalReady: true });

// Turn off Request To Send (RTS) signal.
await port.setSignals({ requestToSend: false });
```

```js
const signals = await port.getSignals();
console.log(`Clear To Send:       ${signals.clearToSend}`);
console.log(`Data Carrier Detect: ${signals.dataCarrierDetect}`);
console.log(`Data Set Ready:      ${signals.dataSetReady}`);
console.log(`Ring Indicator:      ${signals.ringIndicator}`);
```

### ストリームの変換 {: #transforming-streams }

シリアルデバイスからデータを受信する場合、必ずしもすべてのデータを一度に取得するとは限らず、任意にチャンク化される可能性があります。詳細については、 [Streams APIの概念](https://developer.mozilla.org/docs/Web/API/Streams_API/Concepts)を参照してください。

これに対処するには、`TextDecoderStream`などの組み込みの変換ストリームを使用するか、着信ストリームを解析して解析されたデータを返すことができる独自の変換ストリームを作成することができます。変換ストリームは、シリアルデバイスとそのストリームを消費している読み取りループの間にあります。データが消費される前に、任意の変換を適用できます。組み立てラインのようにイメージするとよいでしょう。ウィジェットがラインに入ると、ラインの各工程がウィジェットを変更するため、最終的な目的地に到達するまでに、ウィジェットは完全に機能するウィジェットになります。

<figure>{% Img src="image/admin/seICV1jfxA6NfFRt9iVL.jpg", alt="飛行機工場の写真", width="800", height="519" %} <figcaption>第二次世界大戦のキャッスルブロムウィッチ飛行機工場</figcaption></figure>

たとえば、ストリームを消費し、改行に基づいてストリームをチャンク化する変換ストリームクラスを作成する方法を考察してみましょう。その`transform()`メソッドは、ストリームが新しいデータを受信するたびに呼び出されます。データをキューに入れるか、後で使用できるように保存することができます。`flush()`メソッドは、ストリームが閉じられたときに呼び出され、まだ処理されていないデータを処理します。

変換ストリームクラスを使用するには、着信ストリームをパイプで渡す必要があります。「[シリアルポートからの読み取り](#read-port)」の3番目のコード例では、元の入力ストリームは　`TextDecoderStream`のみをパイプしていただけであるため、新しい`LineBreakTransformer`を介してパイプするように`pipeThrough()`を呼び出す必要があります。

```js
class LineBreakTransformer {
  constructor() {
    // A container for holding stream data until a new line.
    this.chunks = "";
  }

  transform(chunk, controller) {
    // Append new chunks to existing chunks.
    this.chunks += chunk;
    // For each line breaks in chunks, send the parsed lines out.
    const lines = this.chunks.split("\r\n");
    this.chunks = lines.pop();
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller) {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }
}
```

```js/2-5
const textDecoder = new TextDecoderStream();
const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
const reader = textDecoder.readable
  .pipeThrough(new TransformStream(new LineBreakTransformer()))
  .getReader();
```

シリアルデバイスの通信の問題をデバッグするには、`port.readable`の`tee()`メソッドを使用して、シリアルデバイスに送信されるストリームとシリアルデバイスから送信されるストリームを分割します。作成された2つのストリームは個別に使用できるため、1つをコンソールに出力して検査できます。

```js
const [appReadable, devReadable] = port.readable.tee();

// You may want to update UI with incoming data from appReadable
// and log incoming data in JS console for inspection from devReadable.
```

## 開発のヒント {: #dev-tips }

ChromeでWebシリアルAPIをデバッグするには、Chrome内部の`about://device-log`ページで簡単に行えます。このページでは、すべてのシリアルデバイス関連イベントをまとめて表示することができます。

<figure>{% Img src="image/admin/p2T9gxxLsDWsS1GaqoXj.jpg", alt="WebシリアルAPIのデバッグに使用できる内部ページのスクリーンショット。", width="800", height="547" %} <figcaption>WebシリアルAPIのデバッグに使用できるChromeの内部ページ。</figcaption></figure>

## Codelab {: #codelab }

[Google Developerコードラボ](https://codelabs.developers.google.com/codelabs/web-serial)では、WebシリアルAPIを使用して[BBC micro:bit](https://microbit.org/)ボードとやり取りし、5x5 LED行列に画像を表示します。

## ブラウザのサポート {: #browser-support }

WebシリアルAPIは、Chrome 89のすべてのデスクトッププラットフォーム（ChromeOS、Linux、macOS、およびWindows）で使用できます。

## ポリフィル {: #polyfill }

Androidでは、WebUSB APIと[シリアルAPIポリフィル](https://github.com/google/web-serial-polyfill)を使用して、USBベースのシリアルポートをサポートできます。このポリフィルは、デバイスが組み込みデバイスドライバーによって引き受けられていないため、WebUSB APIを通じてデバイスにアクセス可能なハードウェアとプラットフォームに制限されています。

## セキュリティとプライバシー {: #security-privacy }

仕様の作成者は、ユーザー制御、透過性、人間工学など、[強力なWebプラットフォーム機能へのアクセスの制御](https://chromium.googlesource.com/chromium/src/+/lkgr/docs/security/permissions-for-powerful-web-platform-features.md)で定義されたコア原則を使用してWebシリアルAPIを設計し実装しています。このAPIを使用する機能は、主に、一度に1つのシリアルデバイスのみへのアクセスを付与する権限モデルによって制御されています。ユーザープロンプトに応答し、ユーザーは積極的な手順を踏んで特定のシリアルデバイスを選択する必要があります。

セキュリティのトレードオフを理解するには、WebシリアルAPIの説明文書の[セキュリティ](https://wicg.github.io/serial/#security)と[プライバシー](https://wicg.github.io/serial/#privacy)のセクションをご覧ください。

## フィードバック {: #feedback }

Chromeチームは、WebシリアルAPIに関する意見や体験についてのフィードバックをお待ちしています。

### APIの設計についてお聞かせください

期待どおりに動作しないAPIについてのご意見をお持ちですか？または、アイデアを実装するために必要なメソッドやプロパティが不足していませんか？

[WebシリアルAPIのGitHubリポジトリ](https://github.com/wicg/serial/issues)に仕様の問題を提出するか、既存の問題についてのご意見を追加してください。

### 実装に関する問題を報告する

Chromeの実装にバグを見つけましたか？または、実装が仕様と異なりますか？

[https://new.crbug.com](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3ESerial)にバグをご報告ください。できる限り詳しい情報を含め、バグを再現するための単純な手順をご説明の上、*Components*を`Blink>Serial`に設定してください。すばやく簡単に再現を共有するには、[Glitch](https://glitch.com)が最適です。

### サポートの表明

WebシリアルAPIを使用することをお考えですか？あなたのパブリックサポートは、Chromeチームが機能に優先順位を付け、他のブラウザベンダーにそれらをサポートすることがいかに重要であるかを示す上でとても役立ちます。

[@ChromiumDev](https://twitter.com/chromiumdev)にツイートして、このAPIをどこで、どのように使用されているのかお知らせください。ハッシュタグは[`#SerialAPI`](https://twitter.com/search?q=%23SerialAPI&src=typed_query&f=live)をお使いください。

## 便利なリンク {: #helpful }

- [仕様](https://github.com/WICG/serial)
- [バグ追跡](https://crbug.com/884928)
- [ChromeStatus.comエントリ](https://chromestatus.com/feature/6577673212002304)
- Blinkコンポーネント: [`Blink>Serial`](https://chromestatus.com/features#component%3ABlink%3ESerial)

## デモ {: #demos }

- [シリアル端末](https://googlechromelabs.github.io/serial-terminal/)
- [Espruino Web IDE](https://www.espruino.com/ide/)

## 謝辞

この記事をレビューしていただいた[Reilly Grant](https://twitter.com/reillyeon)と[Joe Medley](https://github.com/jpmedley)に感謝いたします。飛行機工場の写真提供: [Birmingham Museums Trust](https://unsplash.com/photos/E1PSU-7aWcY)（[Unsplash](https://unsplash.com/@birminghammuseumstrust)）
