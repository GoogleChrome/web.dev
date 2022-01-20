---
title: Web上のUSBデバイスにアクセスする
subhead: |2-

  WebUSB APIは、USBをWebに導入することで、USBをより安全で使いやすくします。
authors:
  - beaufortfrancois
date: 2016-03-30
updated: 2021-02-23
hero: image/admin/hhnhxiNuRWMfGqy4NSaH.jpg
thumbnail: image/admin/RyaGPB8fHCuuXUc9Wj9Z.jpg
alt: Arduino Microボードの写真
description: |2

  WebUSB APIは、USBをWebに持ち込むことで、USBをより安全で使いやすくします。
tags:
  - blog
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: webusb
---

「USB」をわかりやすく簡単に言えば、ほとんどの場合、キーボード、マウス、音声、動画、ストレージデバイスがすぐに思い浮かぶでしょう。その通りですが、他の種類のユニバーサルシリアルバ (USB) デバイスもあります。

これらの標準化されていないUSBデバイスでは、ユーザー (開発者) がそれらを利用できるようにするには、ハードウェアベンダーがプラットフォーム固有のドライバーとSDKを作成する必要があります。残念ながら、このプラットフォーム固有のコードは、歴史的にこれらのデバイスがWebで使用されるのを妨げてきました。そして、それがWebUSB APIが作成された理由の1つです。このAPIは、USBデバイスサービスをWebに公開する方法を提供するためです。このAPIを使用すると、ハードウェアメーカーは、デバイス用のクロスプラットフォームJavaScriptSDKを構築できます。しかし、最も重要なことは、**USBをWebに導入することで、USBをより安全で使いやすくすること**です。

WebUSBAPIで期待できる動作を見てみましょう。

1. USBデバイスを購入します。
2. それをコンピュータに接続します。このデバイスにアクセスする適切なWebサイトとともに、通知がすぐに表示されます。
3. 通知をクリックします。Webサイトが開き、すぐに使用できます。
4. クリックして接続すると、USBデバイス選択ダイアログがChromeに表示され、デバイスを選択できます。

これで完了です!

WebUSB APIがない場合、この手順はどのようになるのでしょうか。

1. プラットフォーム固有のアプリケーションをインストールします。
2. オペレーティングシステムでサポートされている場合は、正しいアプリケーションをダウンロードしたことを確認します。
3. アプリケーションをインストールします。運が良ければ、インターネットからのドライバ/アプリケーションのインストールについて警告する恐ろしいOSプロンプトやポップアップは表示されません。運が悪ければ、インストールされているドライバやアプリケーションが誤動作し、コンピュータに損害を与えます。(Webには[誤動作しているWebサイト](https://www.youtube.com/watch?v=29e0CtgXZSI)が含まれていることを忘れないでください)。
4. この機能を1回だけ使用する場合、削除するまでコードはコンピュータに残ります。(Webでは、未使用のスペースは最終的に再利用されます。)

## はじめに

この記事は、USBの仕組みについての基本的な知識があることを前提としています。そうでない場合は、 [NutShellでUSB](http://www.beyondlogic.org/usbnutshell)を読み取ることをお勧めします。USBの背景情報については、[公式のUSB仕様](https://www.usb.org/)を確認してください。

[WebUSB API](https://wicg.github.io/webusb/)はChrome61で利用できます。

### オリジントライアルで利用可能

現場でWebUSB APIを使用している開発者から可能な限り多くのフィードバックを得るために、以前、この機能を[オリジントライアル](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)としてChrome 54およびChrome 57に追加しました。

最新のトライアルは2017年9月に正常に終了しました。

## プライバシーとセキュリティ

### HTTPSのみ

この機能の能力により、[安全なコンテキスト](https://w3c.github.io/webappsec/specs/powerfulfeatures/#intro)でのみ機能します。これは、[TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)を念頭に置いてビルドする必要があることを意味します。

### ユーザージェスチャーが必要

セキュリティ上の予防措置として、`navigator.usb.requestDevice()`は、タッチやマウスクリックなどのユーザージェスチャによってのみ呼び出すことができます。

### 機能ポリシー

[機能ポリシー](https://developer.mozilla.org/docs/Web/HTTP/Feature_Policy)は、開発者がさまざまなブラウザ機能とAPIを選択的に有効化または無効化できるようにするメカニズムです。 HTTPヘッダーやiframeの「allow」属性を使用して定義できます。

usb属性をNavigatorオブジェクトに公開するかどうか、つまりWebUSBを許可するかどうかを制御する機能ポリシーを定義できます。

次に、WebUSBが許可されていないヘッダーポリシーの例を示します。

```http
Feature-Policy: fullscreen "*"; usb "none"; payment "self" https://payment.example.com
```

次に、USBが許可されているコンテナポリシーの別の例を示します。

```html
<iframe allowpaymentrequest allow="usb; fullscreen"></iframe>
```

## コーディングを始める

WebUSB APIは、JavaScriptの[Promises](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)に大きく依存しています。それらに精通していない場合は、このすばらしい[Promisesチュートリアル](/promises)をご覧ください。また、`() => {}`は単にECMAScript 2015の[Arrow関数](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions)です。

### USBデバイスにアクセスする

`navigator.usb.requestDevice()`を使用して接続された単一のUSBデバイスを選択するようにユーザーに指示するか、`navigator.usb.getDevices()`を呼び出して、オリジンがアクセスできるすべての接続されたUSBデバイスのリストを取得できます。

`navigator.usb.requestDevice()`関数は、`filters`を定義する必須のJavaScriptオブジェクトを取ります。これらのフィルタは、任意のUSBデバイスを特定のベンダー (`vendorId`) および任意の製品 (`productId`) 識別子と照合するために使用されます。`classCode`、`protocolCode`、`serialNumber`、および`subclassCode`キーもそこで定義できます。

<figure>{% Img src="image/admin/KIbPwUfEqgZZLxugxBOY.png", alt="ChromeでのUSBデバイスユーザープロンプトのスクリーンショット", width="800", height="533" %} <figcaption>USBデバイスのユーザープロンプト。</figcaption></figure>

たとえば、オリジンを許可するように構成された接続済みのArduinoデバイスにアクセスする方法は次のとおりです。

```js
navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
.then(device => {
  console.log(device.productName);      // "Arduino Micro"
  console.log(device.manufacturerName); // "Arduino LLC"
})
.catch(error => { console.error(error); });
```

まず、`0x2341` 16進数ですが、魔法のように思いついたわけではありません。[このUSBIDのリスト](http://www.linux-usb.org/usb.ids)で「Arduino」という単語を検索しただけです。

上記の実行されたpromiseで返されるUSB `device`には、サポートされているUSBバージョン、最大パケットサイズ、ベンダー、製品ID、デバイスで可能な構成の数など、デバイスに関する基本的かつ重要な情報が含まれています。基本的に、デ[バイスのUSB記述子](http://www.beyondlogic.org/usbnutshell/usb5.shtml#DeviceDescriptors)のすべてのフィールドが含まれます。

ちなみに、USBデバイス[がWebUSBのサポート](https://wicg.github.io/webusb/#webusb-platform-capability-descriptor)を発表し、ランディングページのURLを定義すると、ChromeはUSBデバイスが接続されたときに永続的な通知を表示します。この通知をクリックすると、ランディングページが開きます。

<figure>{% Img src="image/admin/1gRIz2wY4LYofeFq5cc3.png", alt="ChromeでのWebUSB通知のスクリーンショット", width="800", height="450" %} <figcaption>WebUSB通知。</figcaption></figure>

`navigator.usb.getDevices()`を呼び出すだけで、以下に示すようにArduinoデバイスにアクセスできます。

```js
navigator.usb.getDevices().then(devices => {
  devices.forEach(device => {
    console.log(device.productName);      // "Arduino Micro"
    console.log(device.manufacturerName); // "Arduino LLC"
  });
})
```

### Arduino USBボードと通信する

では、WebUSB互換のArduinoボードからUSBポート経由で通信するのがいかに簡単かを見てみましょう。[https://github.com/webusb/arduino](https://github.com/webusb/arduino)で[スケッチ](http://www.arduino.cc/en/Tutorial/Sketch)をWebUSB対応にする手順を確認してください。

ご安心ください。この記事の後半では、以下のすべてのWebUSBデバイスの方法について説明します。

```js
let device;

navigator.usb.requestDevice({ filters: [{ vendorId: 0x2341 }] })
.then(selectedDevice => {
    device = selectedDevice;
    return device.open(); // セッション開始。
  })
.then(() => device.selectConfiguration(1)) // デバイスの#1の構成を選択。
.then(() => device.claimInterface(2)) // インターフェイス#2の排他的な制御を要求。
.then(() => device.controlTransferOut({
    requestType: 'class',
    recipient: 'interface',
    request: 0x22,
    value: 0x01,
    index: 0x02})) // Ready to receive data
.then(() => device.transferIn(5, 64)) // エンドポイント#5から64バイトのデータを待機。
.then(result => {
  const decoder = new TextDecoder();
  console.log('Received: ' + decoder.decode(result.data));
})
.catch(error => { console.error(error); });
```

ここで使用しているWebUSBライブラリは、(標準のUSBシリアルプロトコルに基づく) 1つのサンプルプロトコルを実装しているだけであり、メーカーは任意のセットとタイプのエンドポイントを作成できることに注意してください。制御転送は、バスの優先順位を取得し、明確に定義された構造になっているため、小さな構成コマンドに特に適しています。

そして、これがArduinoボードにアップロードされたスケッチです。

```arduino
// サードパーティWebUSB Arduinoライブラリ
#<WebUSB.h> を含める

WebUSB WebUSBSerial(1 /* https:// */, "webusb.github.io/arduino/demos");

#シリアルWebUSBSerialを定義

void setup() {
  Serial.begin(9600);
  while (!Serial) {
    ; // 接続するシリアルポートを待機。
  }
  Serial.write("WebUSB FTW!");
  Serial.flush();
}

void loop() {
  // 何も処理しない。
}
```

上記のサンプルコードで使用されているサードパーティの[WebUSBArduinoライブラリ](https://github.com/webusb/arduino/tree/gh-pages/library/WebUSB)は、基本的に次の2つの処理を実行します。

- このデバイスは、Chromeが[ランディングページのURL](https://wicg.github.io/webusb/#webusb-platform-capability-descriptor)を読み取れるWebUSBデバイスとして機能します。
- これは、デフォルトをオーバーライドするために使用できるWebUSBシリアルAPIを公開します。

JavaScriptコードをもう一度見てください。ユーザーが`device`を選択すると、`device.open()`はプラットフォーム固有のすべての手順を実行して、USBデバイスとのセッションを開始します。次に、`device.selectConfiguration()`を使用して、使用可能なUSB構成を選択する必要があります。構成では、デバイスへの電力供給方法、最大消費電力、およびインターフェイスの数を指定することに注意してください。インターフェイスについて言えば、データはインターフェイスが要求されたときにのみインターフェイスまたは関連するエンドポイントに転送できるため、`device.claimInterface()`使用して排他的アクセスを要求する必要もあります。最後に、適切なコマンドを使用してArduinoデバイスをセットアップし、WebUSBシリアルAPIを使用して通信するには、 `device.controlTransferOut()`が必要です。

そこから、`device.transferIn()`はデバイスへの一括転送を実行して、ホストが大量データを受信する準備ができていることをデバイスに通知します。次に、適切に解析する必要のある[DataView](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/DataView) `data`を含む`result`オブジェクトでpromiseが実行されます。

USBに精通している場合は、これらすべてがかなり馴染みの方法に見えるはずです。

### さらに進める

WebUSB APIを使用すると、すべてのUSB転送/エンドポイントタイプと連携できます。

- 構成またはコマンドパラメータをUSBデバイスに送受信するために使用されるCONTROL転送は、`controlTransferIn(setup, length)`および`controlTransferOut(setup, data)`で処理されます。
- 少量の時間が重要なデータに使用されるINTERRUPT転送は、`transferIn(endpointNumber, length)`および`transferOut(endpointNumber, data)`を使用したBULK転送と同じメソッドで処理されます。
- 動画や音声などのデータストリームに使用されるISOCHRONOUS転送は、`isochronousTransferIn(endpointNumber, packetLengths)`および`isochronousTransferOut(endpointNumber, data, packetLengths)`で処理されます。
- 時間が重要ではない大量のデータを信頼できる方法で転送するために使用されるBULK転送は、`transferIn(endpointNumber, length)`および`transferOut(endpointNumber, data)`で処理されます。

また、WebUSB API用に設計されたUSB制御のLEDデバイスを構築するための基本的な例を提供するMike Tsao氏の[WebLightプロジェクト](https://github.com/sowbug/weblight)もご覧ください (Arduinoは使用していません)。ハードウェア、ソフトウェア、およびファームウェアが見つかります。

## ヒント

内部ページ`about://device-log`を使用すると、ChromeでのUSBのデバッグが簡単です。ここでは、USBデバイスに関連するすべてのイベントを1か所で確認できます。

<figure>{% Img src="image/admin/ssq2mMZmxpWtALortfZx.png", alt="ChromeでWebUSBをデバッグするためのデバイスログページのスクリーンショット", width="800", height="442" %} <figcaption>WebUSBAPIをデバッグするためのChromeのデバイスログページ。</figcaption></figure>

`about://usb-internals`内部ページも便利で、仮想WebUSBデバイスの接続と切断をシミュレートできます。これは、実際のハードウェアを使用せずにUIテストを実行する場合に役立ちます。

<figure>{% Img src="image/admin/KB5z4p7fZRsvkfhVTNkb.png", alt="ChromeでWebUSBをデバッグするための内部ページのスクリーンショット", width="800", height="294" %} <figcaption>WebUSBAPIをデバッグするためのChromeの内部ページ。</figcaption></figure>

ほとんどのLinuxシステムでは、USBデバイスはデフォルトで読み取り専用のアクセス許可にマッピングされます。ChromeがUSBデバイスを開くことができるようにするには、新しい[udevルール](https://www.freedesktop.org/software/systemd/man/udev.html)を追加する必要があります。`/etc/udev/rules.d/50-yourdevicename.rules`に、次の内容のファイルを作成します。

```vim
SUBSYSTEM=="usb", ATTR{idVendor}=="[yourdevicevendor]", MODE="0664", GROUP="plugdev"
```

たとえば、デバイスがArduinoの場合、`[yourdevicevendor]`は`2341`です。より具体的なルールには、`ATTR{idProduct}`を追加することもできます。 `user`が`plugdev`グループの[メンバー](https://wiki.debian.org/SystemGroups)であることを確認してください。次に、デバイスを再接続します。

{% Aside  %} Arduinoの例で使用されているMicrosoft OS 2.0記述子は、Windows8.1以降でのみ機能します。それがなくても、WindowsのサポートにはINFファイルの手動インストールが必要です。 {% endAside %}

## リソース

- スタックオーバーフロー: [https://stackoverflow.com/questions/tagged/webusb](https://stackoverflow.com/questions/tagged/webusb)
- WebUSB API仕様: [http://wicg.github.io/webusb/](https://wicg.github.io/webusb/)
- Chromeの機能ステータス: [https://www.chromestatus.com/feature/5651917954875392](https://www.chromestatus.com/feature/5651917954875392)
- 仕様の問題: [https://github.com/WICG/webusb/issues](https://github.com/WICG/webusb/issues)
- 実装のバグ： [http：//crbug.com？q = component：Blink&gt; USB](http://crbug.com?q=component:Blink%3EUSB)
- WebUSB ❤ ️Arduino: [https://github.com/webusb/arduino](https://github.com/webusb/arduino)
- IRC: W3CのIRCの[#webusb](irc://irc.w3.org:6665/#webusb)
- WICGメーリングリスト: [https://lists.w3.org/Archives/Public/public-wicg/](https://lists.w3.org/Archives/Public/public-wicg/)
- WebLightプロジェクト: [https://github.com/sowbug/weblight](https://github.com/sowbug/weblight)

[`#WebUSB`](https://twitter.com/search?q=%23WebUSB&src=typed_query&f=live)を使用して[@ChromiumDev] [cr-dev-twitter]にツイートを送信し、どこでどのように使用しているかをお知らせください。

## 謝辞

この記事をレビューしてくださった[Joe Medley](https://github.com/jpmedley)氏に感謝します。
