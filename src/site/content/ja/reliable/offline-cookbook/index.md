---
layout: post
title: オフラインクックブック
description: アプリをオフラインで動作させるための一般的なレシピ。
authors:
  - jakearchibald
date: 2014-12-09
updated: 2020-09-28
---

[サービスワーカー](/service-workers-cache-storage/)を用いたオフラインでの解決をあきらめ、開発者たちに自力で解決するための可動要素を提供しました。キャッシュとリクエストの処理方法をコントロールできます。つまり、独自のパターンを作成できるということです。考えられるいくつかのパターンを別々に見てみましょう。ただし、実際には、URL とコンテキストに応じて、多くのパターンを連携させて使用する可能性があります。

こうしたパターンの実用的なデモは、[Trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) およびパフォーマンスへの影響を示す[こちらのビデオ](https://www.youtube.com/watch?v=px-J9Ghvcx4)で一部ご覧いただけます。

## キャッシュマシン - リソースを保存するタイミング

[サービスワーカー](/service-workers-cache-storage/)を使用すれば、リクエストの処理をキャッシュとは別に行えますので、切り離してお見せしていきます。まずは、キャッシングを行うタイミングについて見ていきましょう。

### インストール時 - 依存関係としての場合 {: #on-install-as-dependency}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CLdlCeKfoOPfpYDx1s0p.png", alt="インストール時 - 依存関係としての場合。", width="800", height="498" %}<figcaption>インストール時 - 依存関係としての場合。</figcaption></figure>

サービスワーカーは、`install` イベントを起こします。これを使用すれば、他のイベントを処理する前に準備しておく必要があるものを準備できます。このイベントが発生する間、サービスワーカーの古いバージョンはまだ実行中で、ページのためにあくせく働いていますので、ここで実行することがサービスワーカーの働きを邪魔することがあってはいけません。

**理想的な用途:** CSS、画像、フォント、JS、テンプレートなど、基本的には、サイトのその「バージョン」に対して静的であるとみなせるもの。

これらは、フェッチに失敗した場合にサイトの機能を完全に損なわせるものであり、同等のプラットフォーム固有アプリが最初のダウンロードの一部として取り込むものです。

```js
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('mysite-static-v3').then(function (cache) {
      return cache.addAll([
        '/css/whatever-v3.css',
        '/css/imgs/sprites-v6.png',
        '/css/fonts/whatever-v8.woff',
        '/js/all-min-v4.js',
        // etc.
      ]);
    }),
  );
});
```

`event.waitUntil`は、インストールの長さと成功を定義する Promise を受け取ります。Promise が拒否された場合、インストールは失敗と見なされ、このサービスワーカーは破棄されます (古いバージョンが実行されている場合は、そのまま残ります)。`caches.open()` と `cache.addAll()` は Promise を返します。リソースのいずれかのフェッチに失敗した場合、`cache.addAll()` の呼び出しは拒否されます。

[trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) では、これを使用して[静的アセットをキャッシュ](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L3)します。

### インストール時 - 依存関係としてではない場合 {: #on-install-not}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/S5L9hw95GKGWS1l0ImGl.png", alt="インストール時 - 依存関係としてではない場合。", width="800", height="500" %}<figcaption>インストール時 - 依存関係としてではない場合。</figcaption></figure>

これは上述した内容と似ていますが、インストールの完了を遅らせることも、キャッシュが失敗した場合にインストールを失敗させることもありません。

**理想的な用途:** ゲーム後半のレベルのアセットなど、すぐには必要とされない一層大きなリソース。

```js
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('mygame-core-v1').then(function (cache) {
      cache
        .addAll
        // levels 11–20
        ();
      return cache
        .addAll
        // core assets and levels 1–10
        ();
    }),
  );
});
```

上記の例では、レベル 11～20 の `cache.addAll` Promise が `event.waitUntil` に戻されないため、たとえ失敗しても、ゲームは引き続きオフラインでプレイできます。もちろん、こうしたレベルが存在しない場合に備え、実際に存在しない場合は、それらをもう一度キャッシングしようと試みる必要があります。

サービスワーカーは、イベントの処理を完了しているため、レベル 11〜20 のダウンロード中に強制終了される可能性があります。つまり、イベントはキャッシュされません。将来的には、こういったケースや映画のような容量の大きなダウンロードは、[Web Periodic Background Synchronization API](https://developer.mozilla.org/docs/Web/API/Web_Periodic_Background_Synchronization_API) によって処理されるようになります。現在、その API は Chromium フォークでのみサポートされています。

### アクティベート時 {: #on-activate }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/pUH91vKtMTLXNgpHmID2.png", alt="アクティベート時", width="800", height="500" %}<figcaption>アクティベート時。</figcaption></figure>

**理想的な用途:** クリーンアップと移行。

新しいサービスワーカーがインストールされ、前のバージョンが使用されなくなれば、新しいサービスワーカーがアクティブになり、`activate` イベントが発生します。古いバージョンはもう使用されないため、このタイミングで [IndexedDB におけるスキーマの移行](/indexeddb-best-practices/)を処理し、未使用のキャッシュを削除しておくとよいでしょう。

```js
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (cacheName) {
            // Return true if you want to remove this cache,
            // but remember that caches are shared across
            // the whole origin
          })
          .map(function (cacheName) {
            return caches.delete(cacheName);
          }),
      );
    }),
  );
});
```

アクティベーション中には、`fetch` といった他のイベントがキューに入るため、アクティベーションが長くなり、ページの読み込みがブロックされる可能性があります。アクティベーションは極力効率的なものにして、古いバージョンがアクティブであったときには*実行できなかったこと*だけに使用しましょう。

[trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) では、これを使用して[古いキャッシュを除去](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L17)します。

### ユーザーによる操作時 {: #on-user-interaction}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/q5uUUHvxb3Is8N5Toxja.png", alt="ユーザーによる操作時。", width="800", height="222" %}<figcaption>ユーザーによる操作時。</figcaption></figure>

**理想的な用途:** サイト全体をオフラインにはできないため、ユーザーがオフラインで利用できるコンテンツを選択できるようにした場合。たとえば、YouTube のようなビデオやウィキペディアの記事、Flickr の特定のギャラリーなどが該当します。

ユーザーのために [後で読む] ボタンや [オフライン用に保存] ボタンを用意します。クリックされたら、ネットワークから必要なものをフェッチして、キャッシュにポップします。

```js
document.querySelector('.cache-article').addEventListener('click', function (event) {
  event.preventDefault();

  var id = this.dataset.articleId;
  caches.open('mysite-article-' + id).then(function (cache) {
    fetch('/get-article-urls?id=' + id)
      .then(function (response) {
        // /get-article-urls returns a JSON-encoded array of
        // resource URLs that a given article depends on
        return response.json();
      })
      .then(function (urls) {
        cache.addAll(urls);
      });
  });
});
```

[caches API](https://developer.mozilla.org/docs/Web/API/Cache) は、ページとサービスワーカーから利用できるため、キャッシュに何かを追加するのにサービスワーカーを使う必要がありません。

### ネットワークからレスポンスを受信する時 {: #on-network-response}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/86mv3BK2kjWi8Dm1KWpr.png", alt="ネットワークからレスポンスを受信する時。", width="800", height="390" %}<figcaption>ネットワークからレスポンスを受信する時。</figcaption></figure>

**理想的な用途:** ユーザーの受信トレイや記事の内容といったリソースを頻繁に更新する場合。アバターなどの必須ではないコンテンツにも便利ですが、注意が必要です。

リクエストがキャッシュ内のデータのいずれにも一致しない場合は、ネットワークからリクエストを取得してページに送信すると同時にキャッシュに追加します。

これをアバターなどのさまざまな URL に対して行う場合は、オリジンのストレージを肥大化させないよう注意が必要です。ユーザーがディスクスペースを解放する必要がある場合に、最初の候補になるのは避けたいものです。キャッシュ内の不要なアイテムは必ず削除しましょう。

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        return (
          response ||
          fetch(event.request).then(function (response) {
            cache.put(event.request, response.clone());
            return response;
          })
        );
      });
    }),
  );
});
```

メモリを効率的に使用するために、レスポンス / リクエストの本文を読み取ることができるのは 1 回だけです。上記のコードは、 [`.clone()`](https://fetch.spec.whatwg.org/#dom-request-clone) を使用して、個別に読み取ることができる別のコピーを作成します。

[trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) では、これを使用して [Flickr 画像](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L109)をキャッシュします。

### Stale-while-revalidate {: #stale-while-revalidate}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/6GyjQkG2pI5tV1xirXSX.png", alt="Stale-while-revalidate。", width="800", height="388" %}<figcaption>Stale-while-revalidate。</figcaption></figure>

**理想的な用途:** リソースを頻繁に更新するが、最新バージョンを使用することは必須ではない場合。アバターはこのカテゴリに該当します。

キャッシュされたバージョンが利用可能な場合は、それを使用しますが、次回に備えてアップデートをフェッチします。

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return cache.match(event.request).then(function (response) {
        var fetchPromise = fetch(event.request).then(function (networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        return response || fetchPromise;
      });
    }),
  );
});
```

[これは、HTTPのstale-while-revalidate](https://www.mnot.net/blog/2007/12/12/stale)と非常によく似ています。

### プッシュメッセージ送信時 {: #on-push-message}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/bshuBXOyD2A4zveXQMul.png", alt="プッシュメッセージ送信時。", width="800", height="498" %}<figcaption>プッシュメッセージ送信時。</figcaption></figure>

[Push API](/push-notifications/) は、サービスワーカーを土台に構築されたもう 1 つの機能です。これを使用することで、OS のメッセージングサービスから送られてくるメッセージに応答して、サービスワーカーを起動できます。これは、ユーザーがサイトに対してタブを開いていない場合でも発生します。サービスワーカーだけが起動します。ページからこれを行う許可を要求すると、ユーザーにプロンプトが表示されます。

**最適な用途:** チャットメッセージ、最新ニュース、電子メールなどの通知に関連するコンテンツ。また、ToDo リストの更新やカレンダーの変更など、即時に同期することがメリットとなるコンテンツを変更する頻度が低い場合。

{% YouTube '0i7YdSEQI1w' %}

タップすると関連するページを開く、またはそれにフォーカスを当てる通知が一般的には最終的な結果となりますが、これが発生する前にキャッシュを更新するということが*非常に重要*となります。ユーザーはプッシュメッセージを受信した時点では明らかにオンライン中なわけですがが、最終的に通知を操作するときはオフラインである可能性があるため、このコンテンツをオフラインで利用できるようにすることが重要です。

このコードは、通知を表示する前にキャッシュを更新します。

```js
self.addEventListener('push', function (event) {
  if (event.data.text() == 'new-email') {
    event.waitUntil(
      caches
        .open('mysite-dynamic')
        .then(function (cache) {
          return fetch('/inbox.json').then(function (response) {
            cache.put('/inbox.json', response.clone());
            return response.json();
          });
        })
        .then(function (emails) {
          registration.showNotification('New email', {
            body: 'From ' + emails[0].from.name,
            tag: 'new-email',
          });
        }),
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  if (event.notification.tag == 'new-email') {
    // Assume that all of the resources needed to render
    // /inbox/ have previously been cached, e.g. as part
    // of the install handler.
    new WindowClient('/inbox/');
  }
});
```

### バックグランドでの同期時 {: #on-background-sync}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/tojpjg0cvZZVvZWStG81.png", alt="バックグランドでの同期時。", width="800", height="219" %}<figcaption>バックグランドでの同期時。</figcaption></figure>

[バックグランドでの同期時](https://developer.chrome.com/blog/background-sync/)も、サービスワーカーを土台に構築された機能の 1 です。これを使えば、バックグラウンドデータの同期を 1 回だけ、または (非常にヒューリスティックな) 間隔で要求できます。これは、ユーザーがサイトに対してタブを開いていなくても発生します。サービスワーカーだけが起動します。ページからこれを行う許可を要求すると、ユーザーにプロンプトが表示されます。

**理想的な用途:** 緊急性のない更新。特に更新がある度に送られてくるプッシュメッセージがユーザーにとって頻繁すぎるほど定期的に発生する更新  (ソーシャルタイムラインやニュース記事など)。

```js
self.addEventListener('sync', function (event) {
  if (event.id == 'update-leaderboard') {
    event.waitUntil(
      caches.open('mygame-dynamic').then(function (cache) {
        return cache.add('/leaderboard.json');
      }),
    );
  }
});
```

## キャッシュの永続性 {: #cache-persistence}

あなたのオリジンには、やりたいことができるように、一定の空きスペースが与えられます。その空きスペースは、すべてのオリジンストレージ[((ローカル) ストレージ](https://developer.mozilla.org/docs/Web/API/Storage)、[IndexedDB](https://developer.mozilla.org/docs/Glossary/IndexedDB) 、[ファイルシステムアクセス](/file-system-access/)、そして、もちろん[キャッシュ](https://developer.mozilla.org/docs/Web/API/Cache)) の間で共有されます。

あなたに与えられる量は仕様で決定されていません。これは、デバイスやストレージ条件によります。以下のコードを使えば、自分に割り当てられた量を確認できます。

```js
navigator.storageQuota.queryInfo('temporary').then(function (info) {
  console.log(info.quota);
  // Result: <quota in bytes>
  console.log(info.usage);
  // Result: <used data in bytes>
});
```

ただし、すべてのブラウザのストレージと同様に、ブラウザは、デバイスのストレージが不足してくると、自由にデータを破棄することができます。残念なことに、ブラウザは、ユーザーが何としてでもキープしておきたい映画と無くてもいいようなゲームとの違いを区別することができません。

この回避策として、[StorageManager](https://developer.mozilla.org/docs/Web/API/StorageManager) インターフェイスを使用します。

```js
// From a page:
navigator.storage.persist()
.then(function(persisted) {
  if (persisted) {
    // Hurrah, your data is here to stay!
  } else {
   // So sad, your data may get chucked. Sorry.
});
```

もちろん、ユーザーは許可を与える必要があります。これには、PermissionsAPI を使用します。

ユーザーによる操作をこのフローに含めるのは重要なことです。これは、ユーザーに削除する作業を任せられるためです。デバイスのストレージが不足し始め、重要でないデータをクリアしてもそれを解決しない場合、ユーザーはキープするアイテムと削除するアイテムを決定することができます。

これを機能させるには、オペレーティングシステムが、ブラウザを単一のアイテムとして報告するのではなく、「耐久性のある」オリジンを、ストレージ使用量の内訳でプラットフォーム固有のアプリと同等に扱う必要があります。

## 提案への対応 — リクエストへの対応 {: #serving-suggestions}

データは好きなだけキャッシュできます。どのタイミングで、どのように使用するかを指示しない限り、サービスワーカーがキャッシュを使用することはありません。以下に、リクエストの処理パターンをいくつか紹介します。

### キャッシュのみ {: #cache-only}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/ppXImAnXW7Grk4igLRTj.png", alt="キャッシュのみ。", width="800", height="272" %}<figcaption>キャッシュのみ。</figcaption></figure>

**理想的な用途:** サイトの特定の「バージョン」に対して静的であると考えられるもの。これらは、その存在を当てにできるよう、インストールイベントでキャッシュしておく必要があります。

```js
self.addEventListener('fetch', function (event) {
  // If a match isn't found in the cache, the response
  // will look like a connection error
  event.respondWith(caches.match(event.request));
});
```

このケースを特別に処理することは稀ですが、その方法は [Cache, falling back to network](#cache-falling-back-to-network) でカバーしています。

### ネットワークのみ {: #network-only}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/5piPzi4NRGcgy1snmlEW.png", alt="ネットワークのみ。", width="800", height="272" %}<figcaption>ネットワークのみ。</figcaption></figure>

**理想的な用途:** 分析 ping や GET 以外のリクエストなど、同等のオフライン機能が無いもの。

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(fetch(event.request));
  // or simply don't call event.respondWith, which
  // will result in default browser behavior
});
```

このケースを特別に処理することが必要になるのは稀ですが、そのやり方は、[キャッシュ、ネットワークへのフォールバック)](#cache-falling-back-to-network) でカバーします。

### キャッシュ、ネットワークへのフォールバック {: #cache-falling-back-to-network}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/FMXq6ya5HdjkNeGjTlAN.png", alt="キャッシュ、ネットワークへのフォールバック。", width="800", height="395" %}<figcaption>キャッシュ、ネットワークへのフォールバック。</figcaption></figure>

**理想的な用途:** オフラインファーストのアプローチで構築する場合。そのような場合は、以下のコードでリクエストの大多数を処理します。他のパターンは、受信するリクエストに応じて例外とされます。

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }),
  );
});
```

これにより、キャッシュ内のものに対しては「キャッシュのみ」の動作が提供され、キャッシュされていないものに対しては「ネットワークのみ」の動作が提供されます (キャッシュできないため、GET 以外のすべてのリクエストが含まれます)。

### キャッシュとネットワークの競合 {: #cache-and-network-race}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/j6xbmOpm4GbayBJHChNW.png", alt="キャッシュとネットワークの競合。", width="800", height="427" %}<figcaption> キャッシュとネットワークの競合。</figcaption></figure>

**理想的な用途:** 小さなアセットのうち、ディスクアクセスが遅いデバイスにおいてパフォーマンスを追い求めているアセット。

古いハードドライブ、ウイルススキャナー、および高速インターネット接続の組み合わせ方によっては、ディスクよりもネットワークからの方がリソースをすばやく取得できる場合があります。ただし、ユーザーのデバイスにコンテンツがあるときにネットワークにアクセスすると、データが無駄になる可能性があるため、注意が必要です。

```js
// Promise.race is no good to us because it rejects if
// a promise rejects before fulfilling. Let's make a proper
// race function:
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    // make sure promises are all promises
    promises = promises.map((p) => Promise.resolve(p));
    // resolve this promise as soon as one resolves
    promises.forEach((p) => p.then(resolve));
    // reject if all promises reject
    promises.reduce((a, b) => a.catch(() => b)).catch(() => reject(Error('All failed')));
  });
}

self.addEventListener('fetch', function (event) {
  event.respondWith(promiseAny([caches.match(event.request), fetch(event.request)]));
});
```

### ネットワークがキャッシュにフォールバックする場合 {: #network-falling-back-to-cache}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/efLECR7ZqNiPjmAzvEzO.png", alt="ネットワークがキャッシュにフォールバックする場合。", width="800", height="388" %}<figcaption>ネットワークがキャッシュにフォールバックする場合。</figcaption></figure>

**理想的な用途:** サイトの「バージョン」の外で頻繁に更新されるリソースのクイックフィックス。たとえば、記事、アバター、ソーシャルメディアのタイムライン、ゲームリーダーボードなど。

つまり、オンラインユーザーには最新のコンテンツを提供される一方で、オフラインユーザーには古いキャッシュバージョンが提供されます。ネットワークリクエストが成功した場合は、[キャッシュエントリを更新](#on-network-response)することをお勧めします。

ただし、この方法には欠点があります。ユーザーが断続的な接続、または低速の接続を使用している場合は、全く差し支えのないコンテンツすでにデバイス上にあるにもかかわらず、それを取得するにはデバイスに何らかの障害が起きるまで待たなくてはいけないのです。それまでには、とても長い時間がかかり、ユーザーにとってはとてもイライラする使用体験となります。より好適な解決策については、次のパターン、[キャッシュ、ネットワークの順にアクセスする](#cache-then-network)を参照してください。

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(function () {
      return caches.match(event.request);
    }),
  );
});
```

### キャッシュ、ネットワークの順にアクセスする {: #cache-then-network}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/BjxBlbCf14ed9FBQRS6E.png", alt="Cache then network。", width="800", height="478" %}<figcaption>キャッシュ、ネットワークの順にアクセスする。</figcaption></figure>

**最適な用途:** 頻繁に更新されるコンテンツ。例: 記事、ソーシャルメディアのタイムライン、ゲーム。リーダーボードなど。

この場合、ページは 2 つのリクエストを行う必要があります。1 つはキャッシュに対して、もう 1 つはネットワークに対して行います。最初にキャッシュされたデータを表示してから、ネットワークデータが到着したとき / 到着した場合にページを更新するというものです。

新しいデータが到着したときに現在のデータを置き換えることができる場合もありますが (ゲームリーダーボードなど)、コンテンツが大きい場合は混乱を招く可能性があります。基本的に、ユーザーが読んだり、操作したりしているかもしれないものを「消してしまう」のはいけません。

Twitter では、古いコンテンツの上に新しいコンテンツを追加し、ユーザーがスムーズにコンテンツを読めるように、スクロールの位置が調整されています。これができるのは、Twitter ではコンテンツに対してほぼ線形の順序が大体維持されているためです。私は、このやり方を [trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) に適用し、コンテンツを出来るだけ速く画面に表示するようにしましたが、最新のコンテンツについては到着すると同時に表示しています。

**ページのコード:**

```js
var networkDataReceived = false;

startSpinner();

// fetch fresh data
var networkUpdate = fetch('/data.json')
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    networkDataReceived = true;
    updatePage(data);
  });

// fetch cached data
caches
  .match('/data.json')
  .then(function (response) {
    if (!response) throw Error('No data');
    return response.json();
  })
  .then(function (data) {
    // don't overwrite newer network data
    if (!networkDataReceived) {
      updatePage(data);
    }
  })
  .catch(function () {
    // we didn't get cached data, the network is our last hope:
    return networkUpdate;
  })
  .catch(showErrorMessage)
  .then(stopSpinner);
```

**サービスワーカーのコード:**

常にネットワークにアクセスし、キャッシュを更新する必要があります。

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function (cache) {
      return fetch(event.request).then(function (response) {
        cache.put(event.request, response.clone());
        return response;
      });
    }),
  );
});
```

[trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) では、回避策として [fetch の代わりに XHR](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/utils.js#L3) を使用し、Accept ヘッダーを基準外の使い方をして、結果を取得する場所 ([ページコード](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/index.js#L70)、[サービスワーカーコード](https://github.com/jakearchibald/trained-to-thrill/blob/3291dd40923346e3cc9c83ae527004d502e0464f/www/static/js-unmin/sw/index.js#L61)) をサービスワーカーに指示しました。

### 一般的なフォールバック {: #generic-fallback}

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/URF7IInbQtWL6GZK9GW3.png", alt="一般的なフォールバック。", width="800", height="389" %}<figcaption>一般的なフォールバック。</figcaption></figure>

キャッシュやネットワークから提供できないものがあった場合は、一般的なフォールバックを提供することをお勧めします。

**最適な用途:** アバター、失敗した POST リクエスト、「オフライン中は利用できません」ページといったセカンダリ画像。

```js
self.addEventListener('fetch', function (event) {
  event.respondWith(
    // Try the cache
    caches
      .match(event.request)
      .then(function (response) {
        // Fall back to network
        return response || fetch(event.request);
      })
      .catch(function () {
        // If both fail, show a generic fallback:
        return caches.match('/offline.html');
        // However, in reality you'd have many different
        // fallbacks, depending on URL and headers.
        // Eg, a fallback silhouette image for avatars.
      }),
  );
});
```

フォールバック先のアイテムは、[インストールの依存関係](#on-install-as-dependency)である可能性があります。

ページに電子メールが表示されている場合、サービスワーカーは、電子メールを IndexedDB の「送信トレイ」に保存することにフォールバックし、送信は失敗したがデータは正常に保持されたことをページに知らせることによって応答する場合があります。

### サービスワーカー側のテンプレート {: #Service Worker-side-templating }

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/o5SqtDczlvhw6tPJkr2z.png", alt="サービスワーカー側のテンプレート。", width="800", height="463" %} <figcaption>サービスワーカー側のテンプレート。</figcaption></figure>

**理想的な用途:** サーバーの応答をキャッシュできないページ。

[ページをサーバー上でレンダリングすると処理が速くなる](https://jakearchibald.com/2013/progressive-enhancement-is-faster/)ものですが、これは、「ログイン済み…」など、キャッシュ内では理解に困るような状態データが含まれることを意味する場合があります。ページがサービスワーカーによって制御されている場合は、代わりにテンプレートと一緒に JSON データをリクエストし、それをレンダリングすると良いかもしれません。

```js
importScripts('templating-engine.js');

self.addEventListener('fetch', function (event) {
  var requestURL = new URL(event.request.url);

  event.respondWith(
    Promise.all([
      caches.match('/article-template.html').then(function (response) {
        return response.text();
      }),
      caches.match(requestURL.path + '.json').then(function (response) {
        return response.json();
      }),
    ]).then(function (responses) {
      var template = responses[0];
      var data = responses[1];

      return new Response(renderTemplate(template, data), {
        headers: {
          'Content-Type': 'text/html',
        },
      });
    }),
  );
});
```

## まとめ

使用するメソッドをこのうちの 1 つに限定する必要はありません。実際、リクエストの URL によっては、たくさんの方法を活用することになるでしょう。たとえば、[trained-to-thrill](https://jakearchibald.github.io/trained-to-thrill/) では以下が使用されています。

- [インストール時のキャッシュ](#on-install-as-dependency) (静的 UIと動作の場合)
- [ネットワークからレスポンスを受信する時にキャッシュ](#on-network-response) (Flickr 画像とデータの場合)
- [キャッシュからフェッチし、ネットワークにフォールバックする](#cache-falling-back-to-network) (大半のリクエストの場合)
- [キャッシュ、ネットワークの順にフェッチする](#cache-then-network) (Flickr 検索結果の場合)

どう対応するかは、リクエストを見て判断します。

```js
self.addEventListener('fetch', function (event) {
  // Parse the URL:
  var requestURL = new URL(event.request.url);

  // Handle requests to a particular host specifically
  if (requestURL.hostname == 'api.example.com') {
    event.respondWith(/* some combination of patterns */);
    return;
  }
  // Routing for local URLs
  if (requestURL.origin == location.origin) {
    // Handle article URLs
    if (/^\/article\//.test(requestURL.pathname)) {
      event.respondWith(/* some other combination of patterns */);
      return;
    }
    if (/\.webp$/.test(requestURL.pathname)) {
      event.respondWith(/* some other combination of patterns */);
      return;
    }
    if (request.method == 'POST') {
      event.respondWith(/* some other combination of patterns */);
      return;
    }
    if (/cheese/.test(requestURL.pathname)) {
      event.respondWith(
        new Response('Flagrant cheese error', {
          status: 512,
        }),
      );
      return;
    }
  }

  // A sensible default pattern
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    }),
  );
});
```

お分かりいただけたでしょうか。

### クレジット

素敵なアイコンをご提供いただきありがとうございます。

- [コード](http://thenounproject.com/term/code/17547/): buzzyrobot
- [カレンダー](http://thenounproject.com/term/calendar/4672/): Scott Lewis
- [ネットワーク](http://thenounproject.com/term/network/12676/): Ben Rizzo
- [SD](http://thenounproject.com/term/sd-card/6185/): Thomas Le Bas
- [CPU](http://thenounproject.com/term/cpu/72043/): iconsmind.com
- [ゴミ箱](http://thenounproject.com/term/trash/20538/): trasnik
- [通知](http://thenounproject.com/term/notification/32514/): @daosme
- [レイアウト](http://thenounproject.com/term/layout/36872/): Mister Pixel
- [クラウド](http://thenounproject.com/term/cloud/2788/): P.J. Onori

そして、「公開」前にお恥ずかしいミスをたくさん見つけてくれた [Jeff Posnick](https://twitter.com/jeffposnick) に感謝します。

### 参考文献

- [Service Workers—an Introduction (サービスワーカー — はじめに)](/service-workers-cache-storage/)
- [Is Service Worker ready? (サービスワーカーの準備はできていますか？)](https://jakearchibald.github.io/isserviceworkerready/)—track the implementation status across the main browsers (メインブラウザー全体で実装ステータスを追跡)
- [JavaScript Promises — an Introduction (JavaScript の Promise - はじめに)](/promises) - guide to promises (Promise の手引き)
