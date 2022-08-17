---
title: ウェブ用ストレージ
subhead: ブラウザにデータを保存するための手段はたくさんあります。あなたのニーズに一番合ったものを選びましょう。
authors:
  - petelepage
description: ブラウザにデータを保存するための手段はたくさんあります。あなたのニーズに一番合ったものを選びましょう。
date: 2020-04-27
updated: 2021-02-11
tags:
  - blog
  - progressive-web-apps
  - storage
  - memory
hero: image/admin/c8u2hKEFoFfgTsmcKeuK.jpg
alt: 積み重なった輸送コンテナ
feedback:
  - api
---

外出先では、インターネット接続が不安定であったり、存在しなかったりします。オフラインサポートと信頼性の高いパフォーマンスが[プログレッシブウェブアプリ](/progressive-web-apps/)の一般的な機能であるのはそのためです。たとえワイヤレス環境が完璧であっても、キャッシュやその他のストレージ技術を賢明に活用すれば、ユーザーエクスペリエンスを大幅に向上させることができます。静的アプリケーションリソース (HTML、JavaScript、CSS、画像など) やデータ (ユーザーデータ、ニュース記事など) をキャッシュする方法はいくつかあります。しかし、最適なソリューションはどれか？どれだけのデータを保管できるのか？削除されないようにするにはどうすればいいか？といった疑問が残ります。

## 何を使うべきか？{: #recommendation }

以下は、リソースを保管するのに便利なおすすめの手段です。

- アプリとファイルベースのコンテンツを読み込むために必要なネットワークリソースについては、[**Cache Storage API**](/cache-api-quick-guide/) ([サービスワーカー](https://developer.chrome.com/docs/workbox/service-worker-overview/)の一部)を使用する。
- その他のデータについては、[**IndexedDB**](https://developer.mozilla.org/docs/Web/API/IndexedDB_API)を使用する ([promiseラッパー付き](https://www.npmjs.com/package/idb))。

IndexedDBとCacheStorage APIは、最新のすべてのブラウザーでサポートされています。両方とも非同期であり、メインスレッドをブロックしません。これらは、`window`オブジェクト、ウェブワーカー、およびサービスワーカーからアクセスできるため、コード内の好きな場所から簡単に使用できます。

## 他のストレージメカニズムは？ {: #other }

ブラウザには利用できるストレージメカニズムが他にもいくつかありますが、使用制限があるほか、重大なパフォーマンスの問題を引き起こす可能性があります。

[SessionStorage](https://developer.mozilla.org/en/docs/Web/API/Window/sessionStorage)はタブ固有のもので、スコープはタブの有効期間に設定されています。IndexedDBのキーなど、セッション特有のわずかな情報を保管する場合に便利です。同期して働き、メインスレッドをブロックするため、使用する場合は注意が必要です。データ量は約5MBに制限されており、文字列しか含めることができません。タブ固有のものであるため、ウェブワーカーやサービスワーカーからはアクセスできません。

[LocalStorage](https://developer.mozilla.org/en/docs/Web/API/Window/localStorage)は同期して働き、メインスレッドをブロックするため、使用を避けるべきでしょう。データ量は、約5MBに制限されており、文字列しか含めることができません。ウェブワーカーやサービスワーカーからはアクセスできません。

[クッキー](https://developer.mozilla.org/docs/Web/HTTP/Cookies)は使い道がいくつもありますが、ストレージとして使用するべきではありません。CookieはすべてのHTTPリクエストで送信されるため、少量以上のデータを保管すると、すべてのウェブリクエストのサイズを大幅に増加させてしまいます。同期して働くものであるため、ウェブワーカーからはアクセスできません。LocalStorageやSessionStorageと同じく、Cookieも文字列に制限されています。

[File System API](https://developer.mozilla.org/docs/Web/API/File_and_Directory_Entries_API/Introduction)とFileWriter APIは、サンドボックス化されたファイルシステムに対してファイルの読み書きをするためのメソッドを提供します。非同期に働くものですが、[Chromiumベースのブラウザでしか利用できない](https://caniuse.com/#feat=filesystem)ため、おすすめしていません。

[File System Access API](/file-system-access/)は、ユーザーがローカルファイルシステム上のファイルを簡単に読み取ったり、編集したりできるように設計されています。ユーザーは、ページがローカルファイルの読み書きを行う前にアクセス許可を付与する必要があるほか、アクセス許可はセッションをまたいで保持されません。

WebSQLは、**使用を避けるべきです**。また、現在使用されている分は、IndexedDBに移行するべきです。サポートは、ほぼすべての主要ブラウザから[削除されています](https://caniuse.com/#feat=sql-storage)。W3Cは、2010年に[Web SQLの仕様の管理を終了](https://www.w3.org/TR/webdatabase/)し、今後更新する予定もありません。

Application Cacheは**使用しないでください**。また、現在使用されている分は、サービスワーカーとCache APIに移行するべきです。[非推奨](https://developer.mozilla.org/docs/Web/API/Window/applicationCache)とされており、将来的にはブラウザからサポートが除去される予定です。

## どれくらいのデータ量を保管できますか？{: #how-much }

一言で言えば、**相当な量**を保管できます。少なくとも数百メガバイト。数百ギガバイトを超える可能性もあります。ブラウザの実装はさまざまですが、使用可能なストレージの量は、通常、デバイスで使用可能なストレージの量に基づいています。

- Chromeでは、ブラウザは合計ディスク容量の最大80％を使用できます。オリジンは、合計ディスク容量の最大60％を使用できます。 [StorageManager API](#check)を使用すれば、使用可能な最大クォータを判断できます。他のChromiumベースのブラウザでは、より多くのストレージを使用できる場合があります。Chromeの実装の詳細については。[PR＃3896](https://github.com/GoogleChrome/web.dev/pull/3896)を参照してください。
- Internet Explorer 10以降は最大250MBを保存できます。10MB以上が使用された場合は、それについてプロンプトが表示されます。
- Firefoxは、ブラウザが空きディスク容量の50％までを使用できるようにしています。[eTLD + 1](https://godoc.org/golang.org/x/net/publicsuffix)グループ　(例: `example.com` 、 `www.example.com` 、 `foo.bar.example.com`)は、[最大2GBまで使用できます](https://developer.mozilla.org/docs/Web/API/IndexedDB_API/Browser_storage_limits_and_eviction_criteria#Storage_limits)。[StorageManager API](#check-available)を使用すれば、残りの使用可能なスペースを判断できます。
- Safari (デスクトップとモバイルの両方) は、約1GBの使用を許可しているようです。制限に達すると、Safariはユーザーにプロンプトを表示し、200MBずつ制限を増やしていきます。これに関する公式のドキュメントは見つかりませんでした。
    - モバイル版Safariのホーム画面にPWAが追加されると、新しいストレージコンテナが作成され、PWAとモバイル版Safariの間では何も共有されなくなるようです。インストールされているPWAのクォータに達した際にストレージの追加を要求する手段は見当たりません。

以前は、サイトが保存できるデータのしきい値を超えた場合、ブラウザはもっと多くのデータを使用する許可をユーザーに求めていました。たとえば、オリジンが50MB以上のデータを使用した場合、ブラウザは最大で100MBのデータを保存する許可をユーザーに求め、その後は50MBごとに再び要求していました。

現在、最新のブラウザの多くは、ユーザーにプロンプトを表示せず、サイトが割り当てられたクォータまで使用することを許可しています。例外はSafariで、750MBでプロンプトを出し、最大1.1GBを保存する許可を求えます。オリジンが割り当てられた以上のクォータを使用しようとすると、それ以降のデータの書き込みは失敗します。

## 利用可能なストレージの量を確認するにはどうすればよいですか？ {: #check }

[多くのブラウザー](https://caniuse.com/#feat=mdn-api_storagemanager)では、[StorageManager API](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate)を使って、オリジンで利用可能なストレージの量とオリジンが使用しているストレージの量を判断することができます。IndexedDBとCacheAPIによって使用された合計バイト数を報告してくれるため、利用可能な残りのストレージ容量を概算できます。

```js
if (navigator.storage && navigator.storage.estimate) {
  const quota = await navigator.storage.estimate();
  // quota.usage -> Number of bytes used.
  // quota.quota -> Maximum number of bytes available.
  const percentageUsed = (quota.usage / quota.quota) * 100;
  console.log(`You've used ${percentageUsed}% of the available storage.`);
  const remaining = quota.quota - quota.usage;
  console.log(`You can write up to ${remaining} more bytes.`);
}
```

[StorageManager](https://caniuse.com/#feat=mdn-api_storagemanager)は、まだすべてのブラウザーに実装されていないため、使用する前に機能を検出する必要があります。利用可能な場合でも、クォータ超過エラーをキャッチする必要があります (以下を参照)。場合によっては、使用可能なクォータが実際に使用可能なストレージの量を超える可能性があります。

{% Aside %}他のChromiumベースのブラウザは、使用可能なクォータを報告するときに空き容量を考慮に入れる場合があります。 Chromeはこうした報告をせず、常に実際のディスクサイズの60％を報告します。これは、保存されているクロスオリジンリソースのサイズを決定する機能を減らすのに役立ちます。{% endAside %}

### 検査

開発中は、ブラウザのDevToolsを使用すれば、さまざまなストレージタイプを検査し、保存されているすべてのデータを簡単に消去できます。

Chrome 88に新機能が追加され、ストレージウィンドウでサイトのストレージクォータを上書きできるようになりました。この機能により、さまざまなデバイスをシミュレートし、ディスクの可用性が低いシナリオでアプリの動作をテストすることができます。**[Application]** (アプリケーション) 、**[Storage]** (ストレージ) の順に移動し、[**Simulate custom storage quota (カスタムストレージクォータをシミュレートする)** のチェックボックスにチェックを入れます。そして、有効な数値を入力してストレージクォータをシミュレートします。

{% Img src="image/0g2WvpbGRGdVs0aAPc6ObG7gkud2/tYlbklNwF6DFKNV2cY0D.png", alt="DevTools Storage ウィンドウ。", width="800", height="567"%}

この記事の執筆に取り組んでいる間、私は[シンプルなツール](https://storage-quota.glitch.me/)を作成し、できるだけ多くのストレージをすばやく使用しようと試みました。さまざまなストレージメカニズムを試し、クォータを使い尽くすと何が起こりかを簡単にすばやく調べることができます。

## クォータの超過に対処する方法とは？ {: #over-quota }

クォータを超えてしまった場合はどうすればよいでしょう。それよりも大切なのは、`QuotaExceededError`であろうと他のエラーであろうと、書き込みエラーは常にキャッチして処理するべきだということです。次に、アプリのデザインに応じて、その対処方法を決定します。たとえば、長期間アクセスされていないコンテンツを削除したり、サイズに基づいてデータを削除したり、ユーザーが削除したいものを選択する手段を提供したりします。

利用可能なクォータを超えると、IndexedDBとCache APIの両方が`DOMError`の`QuotaExceededError`という名前のエラーを投げます。

### IndexedDB

オリジンがクォータを超えた場合、IndexedDBへの書き込みは失敗します。トランザクションの`onabort()`ハンドラーが呼び出され、イベントが渡されます。イベントには、エラープロパティに`DOMException`を含めます。エラーの`name`を確認すると、 `QuotaExceededError`が返されます。

```js
const transaction = idb.transaction(['entries'], 'readwrite');
transaction.onabort = function(event) {
  const error = event.target.error; // DOMException
  if (error.name == 'QuotaExceededError') {
    // Fallback code goes here
  }
};
```

### Cache API

オリジンがクォータを超えた場合にCache APIに書き込もうとすれば、`QuotaExceededError` `DOMException`が投げられ、拒否されます。

```js
try {
  const cache = await caches.open('my-cache');
  await cache.add(new Request('/sample1.jpg'));
} catch (err) {
  if (error.name === 'QuotaExceededError') {
    // Fallback code goes here
  }
}
```

## 削除はどのような仕組みになっているのか？{: #eviction }

ウェブストレージは、「ベストエフォート型」と「パーシステント型」という2種類のバケットに分類されます。ベストエフォートとは、ユーザーの邪魔をせずにブラウザでストレージを消去できることを意味しますが、長期データや重大なデータに対する耐久性は低くなります。ストレージの容量が少ない場合、パーシステント型 (永続的) のストレージは自動的に消去されません。このストレージを消去するには、ブラウザの設定から手動で行う必要があります。

サイトのデータ (IndexedDB、Cache APIなどを含む) は、デフォルトでは、ベストエフォート型に分類されます。つまり、サイトが [パーシステント型のストレージを要求](/persistent-storage/)していない限り、ブラウザは、独自の判断でサイトのデータを削除します (デバイスのストレージ容量が少ない場合など)。

ベストエフォート型における削除のポリシーは以下のとおりです。

- Chromiumベースのブラウザは、ブラウザの容量が不足すると、データの削除を開始します。最近最も使用頻度の低いデータから順に削除していき、ブラウザによるデータの使用量が制限以内に収まるまで続けます。
- Internet Explorer 10以降はデータを削除しませんが、オリジンによるそれ以上の書き込みは許可されません。
- Firefoxは、使用可能なディスクスペースがいっぱいになるとデータの削除を開始します。最近最も使用頻度の低いオリジンから順に削除していき、ブラウザによるデータの使用量が制限以内に収まるまで続けます。
- Safariはこれまでデータを削除していませんでしたが、最近、すべての書き込み可能なストレージに対して7日間の上限を設けています (以下を参照)。

iOSとiPadOS 13.4およびmacOSのSafari13.1からは、IndexedDB、サービスワーカー登録、Cache APIを含む、スクリプトの書き込みが可能なすべてのストレージに7日間の上限が設けられています。これは、Safariが使用された後に、7日間経過してもユーザーがサイトを操作しない場合、Safariはすべてのコンテンツをキャッシュから削除することを意味します。この削除ポリシーは、ホーム画面に追加された**インストール済みのPWAには適用されません**。完全な詳細については、[Full Third-Party Cookie Blocking and More](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)と題したWebKitブログを参照してください。

{% Aside %}重要なユーザーデータやアプリケーションデータを保護できるように、[パーシステント型ストレージ](/persistent-storage/)をリクエストすることができます。{% endAside %}

## ボーナス：IndexedDBのラッパーを使用する理由

IndexedDBは低レベルのAPIであり、使用する前に細かいセットアップが必要です。単純なデータを保存する場合は特に苦労するかもしれません。このAPIは、最新のPromiseベースのAPIとは異なり、イベントベースのAPIです。IndexedDBの[idb](https://www.npmjs.com/package/idb)のようなPromiseラッパーは、強力な機能を一部非表示にしますが、IndexedDBライブラリに付属する複雑な機構 (トランザクション、スキーマのバージョン管理など) を非表示にすることは、さらに重要な点であると言えます。

## 結論

ストレージに制限があり、ユーザーにもっと多くのデータを保存するよう促すというのはもう過去の話です。サイトは、実行に必要なすべてのリソースとデータを効果的に保存できます。 [StorageManager API](https://developer.mozilla.org/docs/Web/API/StorageManager/estimate)を使用すると、使用可能な量と使用した量を割り出せます。また、[パーシステント型ストレージ](/persistent-storage/)を使用すれば、ユーザーが削除しない限り、データが削除されることはありません。

### 他のリソース

- [IndexedDBのベストプラクティス](/indexeddb-best-practices/)
- [ChromeWebストレージとクォータの概念](https://docs.google.com/document/d/19QemRTdIxYaJ4gkHYf2WWBNPbpuZQDNMpUVf8dQxj4U/preview)

### 関係者への感謝の言葉

本記事のレビューを担当してくれた Jarryd Goodman、Phil Walton、キタムラ・エイジ、Daniel Murphy、Darwin Huang、Josh Bell、Marijn Kruisselbrink、Victor Costan、そして本記事のベースとなっている元の記事の執筆作業を行った Eiji Kitamura、Addy Osmani、Marc Cohen に感謝いたします。キタムラさんは、現在の動作を検証するのに役立つ Browser Storage Abuser という便利なツールを制作してくれました。可能な限りのデータを保存し、ブラウザーの制限を割り出すことができる優れものです。Safari のストレージ制限を詳しく調べてくれた Francois Beaufort にも感謝いたします。

ヒーロー画像は、[Unsplash](https://unsplash.com/photos/uBe2mknURG4) の GuillaumeBolduc 氏が提供してくれました。
