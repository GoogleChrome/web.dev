---
layou: post
title: 'Cache API: クイックガイド'
subhead: Cache APIを使用してアプリケーションデータをオフラインで利用できるようにする方法を学びます。
authors:
  - petelepage
description: Cache API を使用してアプリケーションデータをオフラインで利用できるようにする方法を学びます。
date: 2017-10-03
updated: 2020-04-27
tags:
  - blog
  - progressive-web-apps
feedback:
  - api
---

[Cache API](https://developer.mozilla.org/docs/Web/API/Cache) は、ネットワークリクエストとそれに対応するレスポンスを保存、取得するためのシステムです。これらは、アプリケーションの実行中に作成される普通のリクエストとレスポンスである場合があれば、後で使用できるようにデータを保存しておくというだけの目的で作成される場合もあります。

Cache API は、サービスワーカーがネットワークリクエストをキャッシュすることにより、ネットワークの速度や可用性を問わず、スピーディなレスポンスを提供できるようにする目的で作成されました。ただし、この API は一般的なストレージメカニズムとしても使用できます。

## どこで利用できますか？

Cache API は、[最新のすべてのブラウザ](https://caniuse.com/#feat=mdn-api_cache)で利用できます。 グローバル `caches` プロパティを通じて公開されるため、簡単な機能検出を使えば API の存在を調べられます。

```js
const cacheAvailable = 'caches' in self;
```

キャッシュ API には、ウィンドウ、iframe、ワーカー、またはサービスワーカーからアクセスできます。

## 何を保存できるか

キャッシュには、それぞれ HTTP のリクエストとレスポンスを意味する [`Request`](https://developer.mozilla.org/docs/Web/API/Request) オブジェクトと [`Response`](https://developer.mozilla.org/docs/Web/API/Response) オブジェクトのペアだけが格納されます。ただし、リクエストとレスポンスには、HTTP 経由で転送できるデータなら種類を問わず何でも含められます。

### どれくらいの量を保管できるか？

一言で言うと、**膨大な量**です。少なくとも数百メガバイト、場合によっては数百ギガバイト以上を保管できます。ブラウザの実装はさまざまですが、一般的に、使用可能なストレージの量は、デバイスの使用可能なストレージの量によります。

## キャッシュの作成とオープン

キャッシュを開くには、 `caches.open(name)`メソッドを使用して、キャッシュの名前を単一のパラメーターとして渡します。名前付きキャッシュが存在しない場合は、作成されます。このメソッドは`Cache`オブジェクトで解決さ`Promise`を返します。

```js
const cache = await caches.open('my-cache');
// do something with cache...
```

## キャッシュに追加する

キャッシュにアイテムを追加する方法は、`add` 、 `addAll` 、`put` という 3 種類があります。 3 つのメソッドはすべて `Promise` を返します。

### `cache.add`

まずは、`cache.add()` について説明します。受け取るパラメーターは、`Request` か URL (`string` ) のいずれかです。ネットワークにリクエストを送信し、レスポンスをキャッシュに保存します。フェッチが失敗した場合、またはレスポンスのステータスコードが 200 の範囲外である場合は、何も保存されず、`Promise` は拒否されます。CORS モードになっていないクロスオリジンリクエストは、`status` `0` を返すため、保管できません。このようなリクエストは、`put` を使用してのみ保存できます。

```js
// Retreive data.json from the server and store the response.
cache.add(new Request('/data.json'));

// Retreive data.json from the server and store the response.
cache.add('/data.json');
```

### `cache.addAll`

次は、`cache.addAll()` です。昨日は `add()` と似ていますが、`Request` オブジェクトまたは URL の (`string`) の配列を受け取ります。これは、個々のリクエストごとに `cache.add` を呼び出す場合と同じように機能しますが、キャッシュされないリクエストが 1 つでもあれば、`Promise` は拒否されます。

```js
const urls = ['/weather/today.json', '/weather/tomorrow.json'];
cache.addAll(urls);
```

これらのいずれの場合も、既存の一致するエントリがあれば、新しいエントリによって上書きされます。これは、[キャッシュからの取得](#retrieving)に関するセクションで説明するのと同じ一致ルールを使用します。

### `cache.put`

最後は、`cache.put()` です。これを使用すると、ネットワークからのレスポンスを保存するか、独自の `Response` を作成して保存できます。受け取りパラメーターは 2 つです。1 つ目は、`Request` オブジェクトでも、URL の (`string`) でも構いませんが、2 つ目はネットワークからの `Response` か、コードによって生成されたレスポンスでなければいけません。

```js
// Retrieve data.json from the server and store the response.
cache.put('/data.json');

// Create a new entry for test.json and store the newly created response.
cache.put('/test.json', new Response('{"foo": "bar"}'));

// Retrieve data.json from the 3rd party site and store the response.
cache.put('https://example.com/data.json');
```

`put()` は `add()` と `addAll()` よりも許容度が高く、CORS 以外のレスポンス、またはレスポンスのステータスコードが 200 の範囲外にあるその他のレスポンスを保存できます。また、同じリクエストに対する以前のレスポンスを上書きします。

#### リクエストオブジェクトの作成

保存されているものの URL を使用して、`Request` オブジェクトを作成します。

```js
const request = new Request('/my-data-store/item-id');
```

#### レスポンスオブジェクトの操作

`Response` オブジェクトのコンストラクターは、 `Blob` や `ArrayBuffer`、`FormData` オブジェクト、文字列など、さまざまな種類のデータを受け入れます。

```js
const imageBlob = new Blob([data], {type: 'image/jpeg'});
const imageResponse = new Response(imageBlob);
const stringResponse = new Response('Hello world');
```

`Response` の MIMEタイプは、適切なヘッダーを設定することにより設定できます。

```js
  const options = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  const jsonResponse = new Response('{}', options);
```

`Response` を取得して、その本文にアクセスしたいという場合に使用できるヘルパーメソッドはいくつかあります。それぞれが、異なる種類の値で解決する `Promise` を返します。

<table>
  <thead>
    <th>方法</th>
    <th>説明</th>
  </thead>
  <tbody>
    <tr>
      <td><code>arrayBuffer</code></td>
      <td>バイトにシリアル化された本体を含む <code>ArrayBuffer</code> を返します。</td>
    </tr>
    <tr>
      <td><code>blob</code></td>
      <td>
<code>Blob</code> を返します。<code>Response</code> が <code>Blob</code> を使って作成された場合、この新しい <code>Blob</code> は同じタイプになります。それ以外の場合は、<code>Response</code> <br> の <code>Content-Type</code> が使用されます。</td>
    </tr>
    <tr>
      <td><code>text</code></td>
      <td>本文のバイトを UTF-8 でエンコードされた文字列として解釈します。</td>
    </tr>
    <tr>
      <td><code>json</code></td>
      <td>本文のバイトを UTF-8 でエンコードされた文字列として解釈し、JSON として解析しようとします。結果のオブジェクトを返します。もしくは、文字列を JSON として解析できない場合は <code>TypeError</code> を投げます。</td>
    </tr>
    <tr>
      <td><code>formData</code></td>
      <td>本文のバイトを HTML フォームとして解釈し、 <code>multipart/form-data</code> または <code>application/x-www-form-urlencoded</code> としてエンコードします。 <a href="https://developer.mozilla.org/docs/Web/API/FormData">FormData</a> オブジェクトを返す、もしくはデータを解析できない場合は <code>TypeError</code> を投げます。</td>
    </tr>
    <tr>
      <td><code>body</code></td>
      <td>本文データの <a href="https://developer.mozilla.org/docs/Web/API/ReadableStream">ReadableStream</a> を返します。</td>
    </tr>
  </tbody>
</table>

例えば

```js
const response = new Response('Hello world');
const buffer = await response.arrayBuffer();
console.log(new Uint8Array(buffer));
// Uint8Array(11) [72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100]
```

## キャッシュからの取得 {: #retrieveing}

キャッシュ内のアイテムを見つける場合は、`match` メソッドを使用できます。

```js
const response = await cache.match(request);
console.log(request, response);
```

`request` が文字列の場合、ブラウザは `new Request(request)` を呼び出して `Request` に変換します。一致するエントリが見つかれば、この関数は `Response` に解決する `Promise` を返し、それ以外の場合は、`undefined` を返します。

2 つの `Requests` が一致するかどうかを判断するために、ブラウザは URL 以外のものも使用します。クエリ文字列、`Vary` ヘッダー、または HTTP メソッド (`GET`、`POST`、`PUT` など) が異なる場合、2 つのリクエストは別のものとみなされます。

options オブジェクトを 2 番目のパラメータとして渡せば、これらを部分的に、もしくは全て無視できます。

```js
const options = {
  ignoreSearch: true,
  ignoreMethod: true,
  ignoreVary: true
};

const response = await cache.match(request, options);
// do something with the response
```

キャッシュされたリクエストのうち、一致するものが複数ある場合は、最初に作成されたリクエストが返されます。一致する*すべて*のレスポンスを取得する場合は、`cache.matchAll()` を使用できます。

```js
const options = {
  ignoreSearch: true,
  ignoreMethod: true,
  ignoreVary: true
};

const responses = await cache.matchAll(request, options);
console.log(`There are ${responses.length} matching responses.`);
```

各キャッシュに `cache.match()` を呼び出す代わりに、ショートカットとして、`caches.match()` を使用すれば、すべてのキャッシュを一度に検索できます。

## 検索

Cache API は、`Response` オブジェクトに対してエントリを一致させる場合を除き、リクエストまたはレスポンスを検索する手段を提供しません。ただし、フィルタリングを使用するか、インデックスを作成すれば、独自の検索を実装できます。

### フィルタリング

独自の検索を実装する方法として、すべてのエントリをイテレートし、必要なエントリに絞り込むということができます。たとえば、`.png` で終わる URL を持つすべてのアイテムを検索するとします。

```js
async function findImages() {
  // Get a list of all of the caches for this origin
  const cacheNames = await caches.keys();
  const result = [];

  for (const name of cacheNames) {
    // Open the cache
    const cache = await caches.open(name);

    // Get a list of entries. Each item is a Request object
    for (const request of await cache.keys()) {
      // If the request URL matches, add the response to the result
      if (request.url.endsWith('.png')) {
        result.push(await cache.match(request));
      }
    }
  }

  return result;
}
```

このようにすれば、`Request` オブジェクトと `Response` オブジェクトの任意のプロパティを使用してエントリをフィルタリングできます。大量のデータセットを検索する場合は、処理速度が遅くなるので注意してください。

### インデックスの作成

独自の検索を実装するもう 1 つの方法に、検索可能なエントリのインデックスを個別に管理し、そのインデックスを IndexedDB に格納するという手があります。IndexedDB は、そもそも、こうしたオペレーションを意識してデザインされたものであるため、エントリの数が多いほど、優れたパフォーマンスを見せます。

`Request` の URL を検索可能なプロパティと一緒に保存すると、検索後に正しいキャッシュエントリを簡単に取得できます。

## アイテムの削除

キャッシュからアイテムを削除するには、こちらのコードを使います。

```js
cache.delete(request);
```

リクエストを `Request` または URL の文字列にできる場合に使用します。また、このメソッドは、`cache.match` と同じ options オブジェクトも受け取ります。これにより、同じ URL に対して複数の `Request` / `Response` ペアを削除できます。

```js
cache.delete('/example/file.txt', {ignoreVary: true, ignoreSearch: true});
```

## キャッシュの削除

キャッシュを削除するには、 `caches.delete(name)`呼び出します。この関数は、キャッシュが存在して削除された場合は`true`解決され、それ以外の場合は`false`解決さ`Promise`

## 感謝の言葉

WebFundamentals に最初に登場したこの記事のオリジナルバージョンを執筆した Mat Scales に感謝いたします。
