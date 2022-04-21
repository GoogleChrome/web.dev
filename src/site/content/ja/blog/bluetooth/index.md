---
title: JavaScriptを介したBluetoothデバイスとの通信
subhead: |2-

  Web Bluetooth APIを使用すると、ウェブサイトはBluetoothデバイスと通信できます。
authors:
  - beaufortfrancois
date: 2015-07-21
updated: 2021-10-01
hero: image/admin/CME5IVhdn0pngs7jAlFX.jpg
thumbnail: image/admin/1J1OTu90a2oH8wFogKnF.jpg
alt: コイン上に置かれたBluetoothチップ
description: |2-

  Web Bluetooth APIを使用すると、ウェブサイトはBluetoothデバイスと通信できます。
tags:
  - blog
  - capabilities
  - devices
feedback:
  - api
stack_overflow_tag: web-bluetooth
---

セキュリティとプライバシーが保護された状態で、ウェブサイトが近くのBluetoothデバイスと通信できると言ったら信じられますか？これが可能であれば、心拍数モニター、歌う電球、さらには[カメ](https://www.youtube.com/watch?v=1LV1Fk5ZXwA)でさえ、ウェブサイトと直接対話することができることになります。

これまで、Bluetoothデバイスと対話する機能は、プラットフォーム固有のアプリでのみ可能でした。 Web Bluetooth APIはこれを変更し、ウェブブラウザでも実現することを目的としています。

## まず始めに

[この記事は、Bluetooth Low Energy（BLE）とGeneric Attribute Profile](https://www.bluetooth.com/specifications/gatt/) （GATT）がどのように機能するかについての基本的な知識があることを前提としています。

[Web Bluetooth API仕様](https://webbluetoothcg.github.io/web-bluetooth/)はまだ完成していませんが、仕様の作成者は、このAPIを試して、[仕様に関するフィードバック](https://github.com/WebBluetoothCG/web-bluetooth/issues)と[実装に関するフィードバック](https://bugs.chromium.org/p/chromium/issues/entry?components=Blink%3EBluetooth)を提供する意気込みのある開発者を積極的に探しています。

Web Bluetooth APIのサブセットは、ChromeOS、Chrome for Android 6.0、Mac（Chrome 56）、およびWindows 10（Chrome 70）で利用できます。つまり、近くのBluetooth Low Energyデバイスを[リクエスト](#request)して[接続](#connect)し、Bluetoothの特性を[読み](#read)/[書き](#write)し、[GATT通知を受信](#notifications)して[Bluetoothデバイスの切断](#disconnect)を認識し、[Bluetooth記述子の読み書き](#descriptors)さえも行うことができということです。詳細については、MDNの[ブラウザ互換性](https://developer.mozilla.org/docs/Web/API/Web_Bluetooth_API#Browser_compatibility)テーブルを参照してください。

Linuxおよび以前のバージョンのWindowsの場合は、`about://flags`で`#experimental-web-platform-features`フラグを有効にしてください。

### オリジントライアルに利用可能

現場でWeb Bluetooth APIを使用している開発者から可能な限り多くのフィードバックを得るために、Chromeは以前、この機能をChromeOS、Android、およびMacの[オリジントライアル](https://github.com/GoogleChrome/OriginTrials/blob/gh-pages/developer-guide.md)としてChrome53に追加しました。

このトライアルは2017年1月に成功して終了しました。

## セキュリティ要件

セキュリティのトレードオフを理解するために、ChromeチームのソフトウェアエンジニアとしてWeb Bluetooth APIの仕様に取り組むJeffreyYasskinが投稿した「[Web Bluetooth Security Model](https://medium.com/@jyasskin/the-web-bluetooth-security-model-666b4e7eed2)」という記事を読むことをお勧めします。

### HTTPSのみ

この実験的なAPIはウェブに追加された強力な新機能であるため、[セキュリティで保護されたコンテキスト](https://w3c.github.io/webappsec-secure-contexts/#intro)でのみ使用できます。つまり、[TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security)を念頭にビルドする必要があります。

### ユーザージェスチャーが必要

セキュリティ機能として、`navigator.bluetooth.requestDevice`でBluetoothデバイスを検出するには、タッチやマウスクリックなどの[ユーザージェスチャ](https://html.spec.whatwg.org/multipage/interaction.html#activation)によるトリガーが必要です。[`pointerup`](https://developer.chrome.com/blog/pointer-events/)、`click`、`touchend`イベントをリスンするということです。

```js
button.addEventListener('pointerup', function(event) {
  // navigator.bluetooth.requestDeviceを呼び出す
});
```

## コードを確認する

Web Bluetooth APIは、JavaScriptの[Promises](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)に大きく依存しています。それらに精通していない場合は、このすばらしい[Promisesチュートリアル](/promises)をご覧ください。また、`() => {}`は単にECMAScript 2015の[Arrow関数](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions)です。

### Bluetoothデバイスを要求する {: #request }

このバージョンのWeb Bluetooth API仕様では、Centralロールで実行しているウェブサイトが、BLE接続を介してリモートGATTサーバーに接続できるようになっています。Bluetooth4.0以降を実装したデバイス間の通信をサポートしています。

`navigator.bluetooth.requestDevice`を使用して近くのデバイスにアクセスを要求すると、ブラウザはユーザーにデバイスセレクターを表示します。ユーザーは1つのデバイスを選択するか、単にリクエストをキャンセルすることができます。

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/web-dev-assets/bluetooth/bluetooth-device-chooser.mp4">
  </source></video>
  <figcaption>
    <p data-md-type="paragraph"><a href="https://webbluetoothcg.github.io/demos/playbulb-candle/">Bluetoothデバイスのユーザープロンプト。</a></p>
  </figcaption></figure>

`navigator.bluetooth.requestDevice()`関数は、フィルターを定義する必須オブジェクトを取ります。これらのフィルターは、アドバタイズされたBluetooth GATTサービスやデバイス名に一致するデバイスのみを返すために使用されます。

#### サービスフィルター

たとえば、[Bluetooth GATT Battery Service](https://www.bluetooth.com/specifications/gatt/)をアドバタイズするBluetoothデバイスを要求するには、次のように行います。

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

ただし、Bluetooth GATT Serviceが[標準Bluetooth GATTサービス](https://www.bluetooth.com/specifications/assigned-numbers/)のリストにない場合は、完全なBluetooth UUIDか短い16ビットまたは32ビット形式のいずれかを指定できます。

```js
navigator.bluetooth.requestDevice({
  filters: [{
    services: [0x1234, 0x12345678, '99999999-0000-1000-8000-00805f9b34fb']
  }]
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

#### 名前フィルター

`name`フィルターキーを使ってアドバタイズされているデバイス名に基づいて、または`namePrefix`フィルターキーを使ってこの名前のプレフィックスに基づいて、Bluetoothデバイスを要求することもできます。この場合、サービスフィルターに含まれていないサービスにアクセスできるように、`optionalServices`キーも定義する必要があることに注意してください。そうしない場合、後でそれらにアクセスしようとしたときにエラーが発生します。

```js
navigator.bluetooth.requestDevice({
  filters: [{
    name: 'Francois robot'
  }],
  optionalServices: ['battery_service'] // 後でサービスにアクセスするために必要です。
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

#### メーカーデータフィルター

`manufacturerData`フィルターキーを使ってアドバタイズされているメーカー固有のデータに基づいてBluetoothデバイスをリクエストすることもできます。このキーは、`companyIdentifier`という名前の必須の[Bluetooth会社ID](https://www.bluetooth.com/specifications/assigned-numbers/company-identifiers/)キーを持つオブジェクトの配列です。それで始まるBluetoothデバイスからのメーカーデータをフィルタリングするデータプレフィックスを指定することもできます。サービスフィルターに含まれていないサービスにアクセスできるように`optionalServices`キーも定義する必要があることに注意してください。そうしない場合、後でそれらにアクセスしようとしたときにエラーが発生します。

```js
// メーカーデータのバイトが [0x01, 0x02] で開始するGoogle会社のBluetoothデバイスを
// フィルターします。
navigator.bluetooth.requestDevice({
  filters: [{
    manufacturerData: [{
      companyIdentifier: 0x00e0,
      dataPrefix: new Uint8Array([0x01, 0x02])
    }]
  }],
  optionalServices: ['battery_service'] // 後でサービスにアクセスするために必要です。
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

マスクをデータプレフィックスとともに使用して、メーカーデータの一部のパターンに一致させることもできます。詳細については、 [Bluetoothデータフィルターの説明](https://github.com/WebBluetoothCG/web-bluetooth/blob/main/data-filters-explainer.md)をご覧ください。

{% Aside %}執筆時点では、 `manufacturerData`フィルターキーはChrome 92で使用できます。古いブラウザーとの下位互換性が必要な場合は、メーカーデータフィルターが空であると見なされるため、フォールバックオプションを提供する必要があります。 [例を](https://groups.google.com/a/chromium.org/g/blink-dev/c/5Id2LANtFko/m/5SIig7ktAgAJ)参照してください。 {% endAside %}

#### フィルターなし

最後に、 `filters`の代わりに、`acceptAllDevices`キーを使用すると、近くにあるすべてのBluetoothデバイスを表示できます。一部のサービスにアクセスできるように`optionalServices`キーも定義する必要があります。そうしない場合、後でそれらにアクセスしようとしたときにエラーが発生します。

```js
navigator.bluetooth.requestDevice({
  acceptAllDevices: true,
  optionalServices: ['battery_service'] // 後でサービスにアクセスするために必要です。
})
.then(device => { /* … */ })
.catch(error => { console.error(error); });
```

{% Aside 'caution' %}フィルターがないために、関連のないデバイスがセレクターに表示され、エネルギーが浪費される可能性があります。注意して使用してください。 {% endAside %}

### Bluetoothデバイスに接続する {: #connect }

`BluetoothDevice`を取得したら、次はどうすればよいでしょうか。サービスと特性の定義を保持しているBluetoothリモートGATTサーバーに接続することにしましょう。

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => {
  // 人間が読み取れるデバイス名。
  console.log(device.name);

  // リモートGATTサーバーへの接続を試行。
  return device.gatt.connect();
})
.then(server => { /* … */ })
.catch(error => { console.error(error); });
```

### Bluetooth特性を読み取る {: #read }

ここでは、リモートBluetoothデバイスのGATTサーバーに接続しています。次に、プライマリGATTサービスを取得し、このサービスに属する特性を読み取ります。たとえば、デバイスのバッテリーの現在の充電レベルを読み取ってみましょう。

以下の例では、 `battery_level`は[標準化されたバッテリーレベル特性](https://www.bluetooth.com/specifications/gatt/)です。

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
.then(device => device.gatt.connect())
.then(server => {
  // Battery Serviceを取得中…
  return server.getPrimaryService('battery_service');
})
.then(service => {
  // Battery Level Characteristicを取得中…
  return service.getCharacteristic('battery_level');
})
.then(characteristic => {
  // Battery Levelを読み取り中…
  return characteristic.readValue();
})
.then(value => {
  console.log(`Battery percentage is ${value.getUint8(0)}`);
})
.catch(error => { console.error(error); });
```

カスタムBluetoothGATT特性を使用する場合は、完全なBluetooth UUIDまたは短い16ビットまたは32ビット形式のいずれかを指定して、`service.getCharacteristic`を構成します。

`characteristicvaluechanged`イベントリスナーを追加して、その値の読み取りを処理することもできることに注意してください。以降でのGATT通知もオプションで処理する方法については、「[Read Characteristic Value Changed Sample](https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html)」をご覧ください。

```js
…
.then(characteristic => {
  // 特性値が変化したときのイベントリスナーをセットアップ。
  characteristic.addEventListener('characteristicvaluechanged',
                                  handleBatteryLevelChanged);
  // Battery Levelを読み取り中…
  return characteristic.readValue();
})
.catch(error => { console.error(error); });

function handleBatteryLevelChanged(event) {
  const batteryLevel = event.target.value.getUint8(0);
  console.log('Battery percentage is ' + batteryLevel);
}
```

### Bluetooth特性への書き込み {: #write }

Bluetooth GATT特性への書き込みは、読み取るのと同じくらい簡単です。今回は、Heart Rate Control Point（心拍数コントロールポイント）を使用して、心拍数モニターデバイスの [Energy Expended]（消費エネルギー）フィールドの値を0にリセットしましょう。

これは特別な技ではなく、すべて[Heart Rate Control Point Characteristicsページ](https://www.bluetooth.com/specifications/gatt/)で説明されています。

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('heart_rate'))
.then(service => service.getCharacteristic('heart_rate_control_point'))
.then(characteristic => {
  // 1の書き込みは、使用されたエネルギーをリセットするシグナルとなります。
  const resetEnergyExpended = Uint8Array.of(1);
  return characteristic.writeValue(resetEnergyExpended);
})
.then(_ => {
  console.log('Energy expended has been reset.');
})
.catch(error => { console.error(error); });
```

### GATT通知を受け取る {: #notifications }

次に、デバイスで[Heart Rate Measurement](https://www.bluetooth.com/specifications/gatt/)（心拍数測定）特性が変更されたときに通知を受ける方法を見てみましょう。

```js
navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('heart_rate'))
.then(service => service.getCharacteristic('heart_rate_measurement'))
.then(characteristic => characteristic.startNotifications())
.then(characteristic => {
  characteristic.addEventListener('characteristicvaluechanged',
                                  handleCharacteristicValueChanged);
  console.log('Notifications have been started.');
})
.catch(error => { console.error(error); });

function handleCharacteristicValueChanged(event) {
  const value = event.target.value;
  console.log('Received ' + value);
  // TODO: Heart Rate Measurement値を解析する。
  // https://github.com/WebBluetoothCG/demos/blob/gh-pages/heart-rate-sensor/heartRateSensor.jsを参照
}
```

[通知サンプル](https://googlechrome.github.io/samples/web-bluetooth/notifications.html)`stopNotifications()`を使用して通知を停止し、追加された`characteristicvaluechanged`イベントリスナーを適切に削除する方法を示しています。

### Bluetoothデバイスから切断する {: #disconnect }

より優れたユーザーエクスペリエンスを提供するには、切断イベントをリスンし、ユーザーが再接続できるようにすることをお勧めします。

```js
navigator.bluetooth.requestDevice({ filters: [{ name: 'Francois robot' }] })
.then(device => {
  // デバイスが切断されたときのイベントリスナーをセットアップ。
  device.addEventListener('gattserverdisconnected', onDisconnected);

  // リモートGATTサーバーへの接続を試行。
  return device.gatt.connect();
})
.then(server => { /* … */ })
.catch(error => { console.error(error); });

function onDisconnected(event) {
  const device = event.target;
  console.log(`Device ${device.name} is disconnected.`);
}
```

`device.gatt.disconnect()`を呼び出して、ウェブアプリをBluetoothデバイスから切断することもできます。これにより、既存の`gattserverdisconnected`イベントリスナーがトリガーされます。別のアプリがすでにBluetoothデバイスと通信している場合、Bluetoothデバイスの通信は停止しないことに注意してください。詳細については、 [Device Disconnect Sample](https://googlechrome.github.io/samples/web-bluetooth/device-disconnect.html)（デバイス切断サンプル）と[Automatic Reconnect Sample](https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html)（自動再接続サンプル）をご覧ください。

{% Aside 'caution' %} Bluetooth GATTの属性、サービス、特性などは、デバイスが切断されると無効になります。つまり、コードは、再接続後に`getPrimaryService(s)` 、 `getCharacteristic(s)`などを介して取得し直す必要があります。 {% endAside %}

### Bluetooth記述子の読み書き {: #descriptors }

Bluetooth GATT記述子は、特性値を説明する属性です。 Bluetooth GATTの特性と同様の方法で、それらを読み書きできます。

たとえば、デバイスの体温計の測定間隔のユーザー説明を読み取る方法を見てみましょう。

以下の例では、`health_thermometer`は[Health Thermometerサービス](https://www.bluetooth.com/specifications/gatt/)、 `measurement_interval`は[Measurement Interval特性](https://www.bluetooth.com/specifications/gatt/)、 `gatt.characteristic_user_description`は[Characteristic User Description記述子](https://www.bluetooth.com/specifications/assigned-numbers/)です。

```js/4-9
navigator.bluetooth.requestDevice({ filters: [{ services: ['health_thermometer'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('health_thermometer'))
.then(service => service.getCharacteristic('measurement_interval'))
.then(characteristic => characteristic.getDescriptor('gatt.characteristic_user_description'))
.then(descriptor => descriptor.readValue())
.then(value => {
  const decoder = new TextDecoder('utf-8');
  console.log(`User Description: ${decoder.decode(value)}`);
})
.catch(error => { console.error(error); });
```

デバイスの体温計の測定間隔のユーザー説明を読み取ったので、それを更新してカスタム値を書き込む方法を見てみましょう。

```js/5-9
navigator.bluetooth.requestDevice({ filters: [{ services: ['health_thermometer'] }] })
.then(device => device.gatt.connect())
.then(server => server.getPrimaryService('health_thermometer'))
.then(service => service.getCharacteristic('measurement_interval'))
.then(characteristic => characteristic.getDescriptor('gatt.characteristic_user_description'))
.then(descriptor => {
  const encoder = new TextEncoder('utf-8');
  const userDescription = encoder.encode('Defines the time between measurements.');
  return descriptor.writeValue(userDescription);
})
.catch(error => { console.error(error); });
```

## サンプル、デモ、コードラボ

以下のすべての[Web Bluetoothサンプル](https://googlechrome.github.io/samples/web-bluetooth/index.html)は正常に検証済みです。これらのサンプルをフルに活用するには、Battery Service、Heart Rate Service、またはHealth Thermometer Serviceを使用してBLEペリフェラルをシミュレートする[BLE Peripheral Simulator Android App](https://play.google.com/store/apps/details?id=io.github.webbluetoothcg.bletestperipheral)をインストールすることをお勧めします。

### 初心者

- [Device Infor](https://googlechrome.github.io/samples/web-bluetooth/device-info.html) - デバイス情報。BLEデバイスから基本的なデバイス情報を取得します。
- [Battery Level](https://googlechrome.github.io/samples/web-bluetooth/battery-level.html) - バッテリーレベル。バッテリー情報をアドバタイズするBLEデバイスからバッテリー情報を取得します。
- [Reset Energy](https://googlechrome.github.io/samples/web-bluetooth/reset-energy.html) - エネルギーのリセット。心拍数をアドバタイズするBLEデバイスから消費されるエネルギーをリセットします。
- [Characteristic Properties](https://googlechrome.github.io/samples/web-bluetooth/characteristic-properties.html) - 特性プロパティ。BLEデバイスの特定の特性のすべてのプロパティを表示します。
- [Notifications](https://googlechrome.github.io/samples/web-bluetooth/notifications.html) - 通知。BLEデバイスからの特徴的な通知を開始および停止します。
- [Device Disconnect](https://googlechrome.github.io/samples/web-bluetooth/device-disconnect.html) - デバイスの切断。BLEデバイスに接続した後、接続を解除して、BLEデバイスの切断から通知を受け取ります。
- [Get Characteristics](https://googlechrome.github.io/samples/web-bluetooth/get-characteristics.html) - 特性の取得。BLEデバイスからアドバタイズされたサービスのすべての特性を取得します。
- [Get Descriptors](https://googlechrome.github.io/samples/web-bluetooth/get-descriptors.html) - 記述子の取得。BLEデバイスからアドバタイズされたサービスのすべての特性の記述子を取得します。
- [Manufacturer Data Filter](https://googlechrome.github.io/samples/web-bluetooth/manufacturer-data-filter.html) - メーカーデータフィルター。メーカーデータと一致するBLEデバイスから基本的なデバイス情報を取得します。

### 複数の操作を組み合わせる

- [GAP Characteristics](https://googlechrome.github.io/samples/web-bluetooth/gap-characteristics.html) - GAP特性。BLEデバイスのすべてのGAP特性を取得します。
- [Device Information Characteristics](https://googlechrome.github.io/samples/web-bluetooth/device-information-characteristics.html) - デバイス情報の特性。BLEデバイスのすべてのデバイス情報の特性を取得します。
- [Link Loss](https://googlechrome.github.io/samples/web-bluetooth/link-loss.html) - リンク損失。BLEデバイスのアラートレベル特性（readValueおよびwriteValue）を設定します。
- [Discover Services &amp; Characteristics](https://googlechrome.github.io/samples/web-bluetooth/discover-services-and-characteristics.html) - サービスと特性の検出。BLEデバイスからアクセス可能なすべてのプライマリサービスとその特性を検出します。
- [Automatic Reconnect](https://googlechrome.github.io/samples/web-bluetooth/automatic-reconnect.html) - 自動再接続。指数バックオフアルゴリズムを使用して、切断されたBLEデバイスに再接続します。
- [Read Characteristic Value Changed](https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html) - 変更された特性値の読み取り。バッテリーレベルを読み取り、BLEデバイスから変更が通知されます。
- [Read Descriptors](https://googlechrome.github.io/samples/web-bluetooth/read-descriptors.html) - 記述子の読み取り。BLEデバイスからサービスのすべての特性の記述子を読み取ります。
- [Write Descriptor](https://googlechrome.github.io/samples/web-bluetooth/write-descriptor.html) - 記述子の書き込み。BLEデバイス上の記述「Characteristic User Description」に書き込みます。

厳選された[Web Bluetooth デモ](https://github.com/WebBluetoothCG/demos)と[公式のWeb Bluetooth Codelabs](https://github.com/search?q=org%3Agooglecodelabs+bluetooth)もご覧ください。

## ライブラリ

- [web-bluetooth-utils](https://www.npmjs.com/package/web-bluetooth-utils)は、APIにいくつかの便利な関数を追加するnpmモジュールです。
- Web Bluetooth APIシムは、最も人気のあるNode.js BLE 中央モジュールである[noble](https://github.com/sandeepmistry/noble)で利用できます。これにより、WebSocketサーバーやその他のプラグインを必要とせずに、nobleをwebpack/browserifyで処理することができます。
- [angle-web-bluetooth](https://github.com/manekinekko/angular-web-bluetooth)は、Web Bluetooth APIの構成に必要なすべてのボイラープレートを抽象化する[Angular](https://angularjs.org)のモジュールです。

## ツール

- [Get Started with Web Bluetooth](https://beaufortfrancois.github.io/sandbox/web-bluetooth/generator)は、Bluetoothデバイスとの対話を開始するためのすべてのJavaScriptボイラープレートコードを生成するシンプルなウェブアプリです。デバイス名、サービス、特性を入力し、そのプロパティを定義すれば、準備は完了です。
- すでにBluetooth開発者である場合、 [Web Bluetooth Developer Studio Plugin](https://github.com/beaufortfrancois/sandbox/tree/gh-pages/web-bluetooth/bluetooth-developer-studio-plugin)でも、Bluetoothデバイス用のWeb Bluetooth JavaScriptコードを生成できます。

## ヒント

**Bluetooth Internals**ページはChromeの`about://bluetooth-internals`で利用できるため、近くのBluetoothデバイスに関するすべて（ステータス、サービス、特性、記述子）を調べることができます。

<figure>{% Img src="image/admin/nPX2OfcQKwKtU9xBNhMe.jpg", alt="BluetoothをデバッグするChrome内部ページのスクリーンショット", width="800", height="572" %} <figcaption>BluetoothデバイスをデバッグするChromeの内部ページ。</figcaption></figure>

また、Bluetoothのデバッグが難しい場合があるため、公式の[How to file Web Bluetooth bugs](https://sites.google.com/a/chromium.org/dev/developers/how-tos/file-web-bluetooth-bugs)（Web Bluetoothバグの報告方法）ページを確認することもお勧めします。

{% Aside 'caution' %} Bluetooth特性の読み書きを並行して行うと、プラットフォームによってはエラーが発生する場合があります。必要に応じて、GATT操作要求を手動でキューに入れることを強くお勧めします。「[GATT operation in progress - how to handle it?](https://github.com/WebBluetoothCG/web-bluetooth/issues/188)」（進行中のGATT操作 - その処理方法は？）をご覧ください。 {% endAside %}

## 今後の学習

まず、[ブラウザとプラットフォームの実装ステータス](https://github.com/WebBluetoothCG/web-bluetooth/blob/master/implementation-status.md)を確認して、Web Bluetooth APIのどの部分が現在実装されているかを確認してください。

まだ不完全ですが、近い将来に期待される内容が簡単に説明されています。

- [近くのBLEアドバタイズメント](https://github.com/WebBluetoothCG/web-bluetooth/pull/239)のスキャンは、 `navigator.bluetooth.requestLEScan()`で行われます。
- 新しい`serviceadded`イベントは、新しく検出されたBluetooth GATT Serviceを追跡し、`serviceremoved`イベントは削除されたサービスを追跡します。新しい`servicechanged`イベントは、特性や記述子がBluetooth GATT Serviceに追加または削除されたときに発生します。

### APIのサポートを表示する

Web Bluetooth APIを使用することをぽ考えですか？あなたのパブリックサポートは、Chromeチームが機能に優先順位を付け、他のブラウザベンダーにそれらをサポートすることがいかに重要であるかを示す上でとても役立ちます。

[@ChromiumDev](https://twitter.com/ChromiumDev)にツイートして、このAPIをどこで、どのように使用しているのかお知らせください。ハッシュタグは[`#WebBluetooth`](https://twitter.com/search?q=%23WebBluetooth&src=typed_query&f=live)をお使いください。

## リソース

- Stack Overflow: [https://stackoverflow.com/questions/tagged/web-bluetooth](https://stackoverflow.com/questions/tagged/web-bluetooth)
- Chromeの機能ステータス: [https://www.chromestatus.com/feature/5264933985976320](https://www.chromestatus.com/feature/5264933985976320)
- Chrome実装のバグ: [https://crbug.com/?q=component:Blink&gt;Bluetooth](https://crbug.com/?q=component:Blink%3EBluetooth)
- Web Bluetooth仕様:  [https://webbluetoothcg.github.io/web-bluetooth](https://webbluetoothcg.github.io/web-bluetooth)
- 仕様の問題: [https://github.com/WebBluetoothCG/web-bluetooth/issues](https://github.com/WebBluetoothCG/web-bluetooth/issues)
- BLE Peripheral Simulator App: [https://github.com/WebBluetoothCG/ble-test-peripheral-android](https://github.com/WebBluetoothCG/ble-test-peripheral-android)

{% YouTube '_BUwOBdLjzQ' %}

## 謝辞

この記事をレビューしてくれた[Kayce Basques](https://github.com/kaycebasques)にお礼申し上げます。ヒーロー画像提供: [SparkFun Electronics（米国、ボルダー）](https://commons.wikimedia.org/wiki/File:Bluetooth_4.0_Module_-_BR-LE_4.0-S2A_(16804031059).jpg)
