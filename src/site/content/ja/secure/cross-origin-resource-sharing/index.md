---
layout: post
title: クロスオリジンリソースシェアリング（CORS）
subhead: クロスオリジンリソースを安全に共有する
authors:
  - kosamari
date: 2018-11-05
description: |2-

  ブラウザの same-origin ポリシーは、別のオリジンからのリソースの読み取りをブロックします。このメカニズムは、悪意のあるサイトが別のサイトを読み取るのを防ぎます。しかし、正当な使用までもが防がれてしまいます。
  他の国から気象データを取得したい場合はどうすればいいでしょうか？CORSを有効にすると、サーバーはブラウザに別のオリジンの使用が許可されていると伝えることができます。
tags:
  - security
---

ブラウザの same-origin ポリシーは、別のオリジンからのリソースの読み取りをブロックします。このメカニズムは、悪意のあるサイトが別のサイトのデータを読み取るのを防ぎますが、正当な使用も防がれてしまいます。他の国から気象データを取得したい場合はどうすればいいでしょうか？

最新のWebアプリケーションでは、アプリケーションが別のオリジンからリソースを取得したがることがよくあります。たとえば、別のドメインからJSONデータを取得したり、別のサイトの画像を`<canvas>`要素に読み込んだりすることが必要な場合があります。

つまり、**誰もが読み取れるばずの公開リソース**までもが、same-origin ポリシーによってブロックされてしまうのです。[開発者はJSONP](https://stackoverflow.com/questions/2067472/what-is-jsonp-all-about)などの回避策を使用しましたが、**Cross-Origin Resource Sharing (クロスオリジンリソースシェアリング (CORS)) を使用すれば、**これを標準的な方法で修正できます。

**CORS**を有効にすると、サーバーはブラウザに別のオリジンの使用が許可されていることを通知できます。

## リソースリクエストはWeb上でどのように機能しますか？

<figure data-float="right">{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/8J6A0Bk5YXdvyoj8HVzs.png", alt="request and response", width="668", height="327"%}<figcaption>図：図示されたクライアントリクエストとサーバーレスポンス</figcaption></figure>

ブラウザとサーバーは、**Hypertext Transfer Protocol  (ハイパーテキスト転送プロトコル)** (HTTP) を使用することにより、ネットワーク経由でデータのやり取りを行えます。 HTTPは、リソースを取得するために必要な情報など、リクエスターとレスポンダー間の通信ルールを定義します。

HTTPヘッダーは、クライアントとサーバーの間で行うメッセージ交換の種類をネゴシエートするために使用されるほか、アクセスを決定するためにも使用されます。ブラウザのリクエストとサーバーのレスポンスメッセージはどちらも、**ヘッダー**と**本文**の2つの部分に分けられます。

### ヘッダー

メッセージの種類やエンコーディングなど、メッセージに関する情報。ヘッダーには、キーと値のペアとして表される[さまざまな情報](https://en.wikipedia.org/wiki/List_of_HTTP_header_fields)を含めることができます。リクエストヘッダーとレスポンスヘッダーには異なる情報が含まれています。

{% Aside %}ヘッダーにコメントを含めることはできないのでご注意ください。 {% endAside %}

**リクエストヘッダーの例**

```text
Accept: text/html
Cookie: Version=1
```

上記は、「HTML を返してください。Cookieはこちらです」という内容のリクエストです。

**レスポンスヘッダーの例**

```text
Content-Encoding: gzip
Cache-Control: no-store
```

上記は、「データはgzipでエンコードされています。これをキャッシュしないでください」という内容のレスポンスです。

### 本文

これは、メッセージそのものです。プレーンテキスト、画像バイナリ、JSON、HTMLなどが該当します。

## CORSはどのように機能しますか？

same-originポリシーはクロスオリジンリクエストをブロックする指示をブラウザに出すということを覚えておきましょう。別のオリジンからパブリックリソースを取得する場合、リソースを提供するサーバーはブラウザに「リクエストの送信元であるこのオリジンは私のリソースにアクセスできます」と通知を出す必要があります。ブラウザはそれを記憶し、オリジン間でのリソースの共有を可能にします。

### ステップ1：クライアント (ブラウザー) リクエスト

ブラウザは、クロスオリジンリクエストを出す際に、現在のオリジン (スキーム、ホスト、ポート) 付きの `Origin` ヘッダーを追加します。

### ステップ2：サーバーレスポンス

サーバー側では、このヘッダーを見てアクセスを許可する場合、レスポンスに `Access-Control-Allow-Origin`を追加してリクエスト元を指定する必要があります (もしくは `*`を使用してあらゆるオリジンを許可します)。

### ステップ3：ブラウザがレスポンスを受信する

ブラウザは、レスポンスに適切な`Access-Control-Allow-Origin`ヘッダーが付けられているのを見ると、レスポンスデータがクライアントサイトと共有されることを許可します。

## CORSの実例

Expressを使用する小さなWebサーバーがあります。

{% Glitch { id: 'cors-demo', path: 'server.js', height: 480 } %}

最初のエンドポイント (8行目) にはレスポンスヘッダーが設定されておらず、レスポンスとしてファイルを送信します。

{% Instruction 'devtools' %} {% Instruction 'devtools-console', 'ul' %}

- 次のコマンドを試してください。

```js
fetch('https://cors-demo.glitch.me/', {mode:'cors'})
```

次のようなエラーが表示されます。

```bash
request has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header
is present on the requested resource.
```

2番目のエンドポイント (13行目) は、応答として同じファイルを送信しますが、ヘッダーに`Access-Control-Allow-Origin: *`を追加します。コンソールから、以下のコードを試してみてください

```js
fetch('https://cors-demo.glitch.me/allow-cors', {mode:'cors'})
```

今回は、リクエストがブロックされないはずです。

## CORSとクレデンシャルを共有する

プライバシー上の理由から、CORSは通常、「匿名リクエスト」(リクエストがリクエスターを識別しないリクエスト) に使用されます。CORS (送信者を識別できる) を使用するときにCookieを送信する場合は、リクエストとレスポンスにヘッダーを追加する必要があります。

### リクエスト

以下のように、`credentials: 'include'`をフェッチオプションに追加します。これにより、クッキーがリクエストに追加されます。

```js
fetch('https://example.com', {
  mode: 'cors',
  credentials: 'include'
})
```

### レスポンス

`Access-Control-Allow-Origin`は特定のオリジンに設定する必要があり、(`*`を使ったワイルドカードはなし)。また `Access-Control-Allow-Credentials`は、を`true`に設定する必要があります。

```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
```

## 複雑なHTTP呼び出しのプリフライトリクエスト

Webアプリで複雑なHTTPリクエストが必要な場合、ブラウザは**[プリフライトリクエスト](https://developer.mozilla.org/docs/Web/HTTP/CORS#preflighted_requests)**をリクエストチェーンの先頭に追加します。

CORS仕様では、**複雑なリクエスト**は以下のように定義されています。

- GET、POST、またはHEAD以外のメソッドを使用するリクエスト
- `Accept` 、 `Accept-Language`または`Content-Language`以外のヘッダーを含むリクエスト
- `application/x-www-form-urlencoded` 、 `multipart/form-data` 、または`text/plain`以外の`Content-Type`ヘッダーを持つリクエスト

ブラウザは、必要に応じてプリフライトリクエストを作成します。これは、以下のような`OPTIONS`リクエストであり、実際のリクエストメッセージの前に送信されます。

```text
OPTIONS /data HTTP/1.1
Origin: https://example.com
Access-Control-Request-Method: DELETE
```

サーバー側では、アプリケーションは、アプリケーションがこのオリジンから受け入れるメソッドに関する情報をもってプリフライトリクエストに応答する必要があります。

```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: GET, DELETE, HEAD, OPTIONS
```

サーバーのレスポンスには、`Access-Control-Max-Age`ヘッダーを含めて、プリフライトの結果をキャッシュする期間 (秒単位) を指定することもできるため、クライアントは複雑なリクエストを送信するたびにプリフライトリクエストを行う必要がありません。
