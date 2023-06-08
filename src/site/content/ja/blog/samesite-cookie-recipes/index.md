---
title: SameSite Cookieレシピ
subhead: 今後のSameSite属性の動作の変更に備えて、サイトのCookieを更新します。
authors:
  - rowan_m
date: 2019-10-30
updated: 2020-05-28
hero: image/kheDArv5csY6rvQUJDbWRscckLr1/5f56hyvtMT6Dymo839tc.png
description: 新しいSameSite = None属性値の導入により、サイトでは、Cookieをクロスサイトで使用するように明示的に設定できるようになりました。ブラウザは、SameSite属性がないCookieをデフォルトでファーストパーティとして機能させようとしています。これは、現在のオープン動作よりも安全でプライバシーを保護するオプションです。ここでは、Cookieをマークアップし、この変更が適用されたときに、ファーストパーティおよびサードパーティCookieを確実に動作させ続ける方法について説明します。
tags:
  - blog
  - security
  - cookies
  - chrome-80
  - test-post
feedback:
  - api
---

{% Aside %}この記事は、Cookie の `SameSite` 属性の変更を扱うシリーズ記事の一部です。

- [SameSite Cookie の説明](/samesite-cookies-explained/)
- [SameSite Cookie のレシピ](/samesite-cookie-recipes/)
- [スキームフル Same-Site](/schemeful-samesite){% endAside %}

[Chrome](https://www.chromium.org/updates/same-site)、[Firefox](https://groups.google.com/d/msg/mozilla.dev.platform/nx2uP0CzA9k/BNVPWDHsAQAJ)、[Edge](https://groups.google.com/a/chromium.org/d/msg/blink-dev/AknSSyQTGYs/8lMmI5DwEAAJ)などは、IETFの提案である[Incrementally Better Cookies](https://tools.ietf.org/html/draft-west-cookie-incrementalism-00)に沿って、デフォルトの動作を次のように変更します。

- `SameSite`属性のないCookieは`SameSite=Lax`として扱われます。つまり、デフォルトの動作では、Cookieはファーストパーティのコンテキスト**のみ**に制限されます。
- クロスサイト使用のCookieは、`SameSite=None; Secure`を指定し、サードパーティコンテキストを追加できるようにする**必要があります**。

この機能は、 [Chrome 84 stable以降のデフォルトの動作](https://blog.chromium.org/2020/05/resuming-samesite-cookie-changes-in-july.html)です。まだ対応していない場合は、サードパーティのCookieの属性を更新して、将来ブロックされないようにしてください。

## クロスブラウザのサポート

MDNの[`Set-Cookie`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie)ページの[ブラウザの互換性](https://developer.mozilla.org/docs/Web/HTTP/Headers/Set-Cookie)セクションを参照してください。

## クロスサイトまたはサードパーティCookieの使用例

さまざまな一般的なユースケースやパターンでは、Cookieをサードパーティのコンテキストで送信する必要があります。これらのユースケースのいずれかを提供したり、依存したりしている場合は、確実にサービスが正しく機能し続けるように、ユーザーまたはプロバイダのいずれかがCookieを更新していることを確認してください。

### `<iframe>`内のコンテンツ

`<iframe>`で表示される別のサイトのコンテンツは、サードパーティのコンテキストにあります。ここでの標準的な使用例は次のとおりです。

- 動画、地図、コードサンプル、ソーシャル投稿など、他のサイトから共有される埋め込みコンテンツ。
- 決済、カレンダー、手配、予約機能などの外部サービスのウィジェット。
- あまり明確ではない`<iframes>`を作成するソーシャルボタンや不正防止サービスなどのウィジェット。

ここでは、Cookieを使用して、セッションの状態を維持したり、一般的な設定を保存したり、統計を有効にしたり、既存のアカウントを持つユーザーのコンテンツをパーソナライズしたりできます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/fTUQP4SffHHcexSipvlz.png", alt="埋め込みコンテンツのURLがページのURLと一致しないブラウザウィンドウの図。", width="468", height="383", style="max-width: 35vw;" %} <figcaption>埋め込まれたコンテンツが最上位のブラウジングコンテキストと同じサイトから取得されていない場合は、サードパーティのコンテンツです。</figcaption></figure>

さらに、本質的に、Webは構成可能であるため、`<iframes>`は、最上位またはファーストパーティのコンテキストでも表示されるコンテンツを埋め込むために使用されます。そのサイトで使用されているすべてのCookieは、サイトがフレーム内に表示されたときにサードパーティのCookieと見なされます。他のユーザーが簡単に埋め込むことができるサイトを作成し、Cookieを機能させる場合は、確実にサイト間で使用できるように設定するか、Cookieを使用せずにフォールバックできるようにする必要があります。

### サイト間での「安全でない」要求

「安全ではない」と言うと少し不安に思われるかもしれませんが、これは状態を変更することを目的とした要求を指します。Webでは、これは主にPOST要求です。`SameSite=Lax`に設定されたCookieは、安全な最上位のナビゲーションで送信されます。たとえば、リンクをクリックして別のサイトに移動します。ただし、POST経由の別のサイトへの`<form>`送信などには、Cookieは含まれません。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/vddDg7f9Gp93OgaqWwHu.png", alt="あるページから別のページに送信される要求の図。", width="719", height="382", style="max-width: 35vw;" %} <figcaption>受信要求が「安全な」方法を使用している場合、Cookieが送信されます。</figcaption></figure>

このパターンは、ユーザーをリモートサービスにリダイレクトして、戻る前に何らかの操作を実行する可能性のあるサイトに使用されます。たとえば、サードパーティのIDプロバイダーにリダイレクトします。ユーザーがサイトを離れる前に、[クロスサイトリクエストフォージェリ (CSRF)](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) 攻撃を軽減するために、返される要求でこのトークンをチェックできるように、使い捨てトークンを含むCookieが設定されます。その返り要求がPOST経由で送信される場合、Cookieを`SameSite=None; Secure`に設定する必要があります。

### リモートリソース

ページのリモートリソースは、`<img>`タグ、 `<script>`タグなどから要求ともに送信されるCookieに依存している可能性があります。一般的な使用例には、ピクセルの追跡とコンテンツのパーソナライズが含まれます。

これは、`fetch`または`XMLHttpRequest`によってJavaScriptから開始された要求にも当てはまります。`fetch()`が[`credentials: 'include'`オプションを使用](https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch#Sending_a_request_with_credentials_included)して呼び出された場合、これらの要求でCookieが想定される可能性があることを示します。`XMLHttpRequest`の場合、`true`に設定されている[`withCredentials`プロパティ](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/withCredentials)のインスタンスを探します。これは、これらのリクエストでCookieが想定される可能性があることを示します。これらのCookieは、クロスサイト要求に含めるように適切に設定する必要があります。

### WebView内のコンテンツ

プラットフォーム固有のアプリのWebViewはブラウザに基づいているため、同じ制限や問題が当てはまるかどうかをテストする必要があります。Androidでは、WebViewがChromeに基づく場合、新しいデフォルト値はすぐにChrome 84に**適用されません**。ただし、今後は適用される予定です。このため、この点についてまだテストして準備してください。また、Androidでは、直接[CookieManager API](https://developer.android.com/reference/android/webkit/CookieManager)を使用して、プラットフォーム固有のアプリでCookieを設定できます。 ヘッダーまたはJavaScriptで設定されたCookieのように、クロスサイトで使用する計画の場合は、`SameSite=None; Secure`を追加することを検討してください。

## `SameSite`を実装する方法

ファーストパーティのコンテキストでのみ必要なCookieの場合、必要に応じて、`SameSite=Lax`または`SameSite=Strict`に設定することをお勧めします。何もせずにブラウザのデフォルトを適用させることもできますが、ブラウザ間で一貫性のない動作が発生し、各Cookieに対してコンソール警告が発生する可能性があります。

```text
Set-Cookie: first_party_var=value; SameSite=Lax
```

サードパーティコンテキストで必要なCookieの場合、必ず`SameSite=None; Secure`に設定する必要があります。`Secure`なしで`None`のみを指定した場合、Cookieは拒否されます。ブラウザ実装では相互に互換性がない差異があるため、次の[互換性がないクライアントの取り扱い](#handling-incompatible-clients)で説明する低減戦略の一部を使用しなければならない場合があります。

```text
Set-Cookie: third_party_var=value; SameSite=None; Secure
```

### 互換性がないクライアントの取り扱い

`None`を含み、デフォルトの動作を更新するこれらの変更はまだ比較的新しいため、これらの変更の処理方法に関してブラウザ間で一貫性がありません。現在確認済みの問題については、[chromium.orgの更新ページを](https://www.chromium.org/updates/same-site/incompatible-clients)参照できますが、これが網羅的であるかどうかを判断することはできません。これは理想的ではありませんが、この移行フェーズで採用できる回避策があります。ただし、一般的なルールは、互換性のないクライアントを特別な場合として扱うことです。新しいルールを実装しているブラウザの例外を作成しないでください。

<code>None</code>を含み、デフォルトの動作を更新するこれらの変更はまだ比較的新しいため、これらの変更の処理方法に関してブラウザ間で一貫性がありません。現在確認済みの問題については、<a>chromium.orgの更新ページを</a>参照できますが、これが網羅的であるかどうかを判断することはできません。これは理想的ではありませんが、この移行フェーズで採用できる回避策があります。ただし、一般的なルールは、互換性のないクライアントを特別な場合として扱うことです。新しいルールを実装しているブラウザの例外を作成しないでください。

```text
Set-cookie: 3pcookie=value; SameSite=None; Secure
Set-cookie: 3pcookie-legacy=value; Secure
```

新しい動作を実装するブラウザは`SameSite`値でCookieを設定しますが、他のブラウザではそれが無視されるか、誤って設定される可能性があります。ただし、これらの同じブラウザでは、`3pcookie-legacy` Cookieが設定されます。含まれているCookieを処理するときには、サイトは最初に新しいスタイルのCookieの存在を確認し、見つからない場合はレガシーCookieにフォールバックします。

以下の例は、Node.jsでこの処理を行う方法を示しています。[Expressフレームワーク](https://expressjs.com)とその[cookie-parser](https://www.npmjs.com/package/cookie-parser)ミドルウェアを使用しています。

```javascript
const express = require('express');
const cp = require('cookie-parser');
const app = express();
app.use(cp());

app.get('/set', (req, res) => {
  // 新しいスタイルCookieを設定
  res.cookie('3pcookie', 'value', { sameSite: 'none', secure: true });
  // レガシーCookieで同じ値を設定
  res.cookie('3pcookie-legacy', 'value', { secure: true });
  res.end();
});

app.get('/', (req, res) => {
  let cookieVal = null;

  if (req.cookies['3pcookie']) {
    // 最初に新しいスタイルCookieを確認
    cookieVal = req.cookies['3pcookie'];
  } else if (req.cookies['3pcookie-legacy']) {
    // ない場合はレガシーCookieにフォールバック
    cookieVal = req.cookies['3pcookie-legacy'];
  }

  res.end();
});

app.listen(process.env.PORT);
```

この方法の欠点は、すべてのブラウザに対応するように冗長Cookieを設定しなければならず、Cookieの設定と読み取りの両方の時点で変更する必要があることです。ただし、この方法では、動作に関係なくすべてのブラウザに対応し、サードパーティCookieが以前と同じように機能し続けることが保証されます。

別の方法として、`Set-Cookie`ヘッダーを送信する時点で、ユーザーエージェント文字列経由でクライアントを検出するように選択することもできます。[互換性のないクライアント](https://www.chromium.org/updates/same-site/incompatible-clients)のリストを参照してから、プラットフォームに適したライブラリ (Node.jsの[ua-parser-js](https://www.npmjs.com/package/ua-parser-js)ライブラリなど) を利用してください。これらの正規表現を自分で記述せずに済むように、ユーザーエージェントの検出を処理するライブラリを見つけることをお勧めします。

この方法の利点は、Cookieを設定する時点で1つの変更を加えるだけで済むことです。ただし、ユーザーエージェントのスニッフィングは本質的に脆弱であり、影響を受けるすべてのユーザーを特定できない可能性があるため、注意が必要です。

{% Aside %}

選択するオプションに関係なく、レガシールートで送信されるトラフィックのレベルをログに記録する方法があることを確認することをお勧めします。これらのレベルがサイトの許容しきい値を下回ったら、この回避策を削除するように通知するリマインダまたはアラートがあることを確認してください。

{% endAside %}

## 言語、ライブラリ、フレームワークでの`SameSite=None`のサポート

大半の言語とライブラリでCookieの`SameSite`属性がサポートされていますが、`SameSite=None`の追加はまだ比較的新しいため、今のところ標準的な動作の一部を回避する必要があるかもしれません。これらについては、<a href="https://github.com/GoogleChromeLabs/samesite-examples" data-md-type="link">GitHubの`SameSite`サンプルリポジトリ</a>を参照してください。

## ヘルプ

Cookieはいたるところにあり、特にサイト間のユースケースを組み合わせて使用する場合は、Cookieが設定され、使用されている場所がサイトによって完全に監査されていることはめったにありません。問題が発生した場合、初めてその問題が生じた可能性があります。その場合は、遠慮なく次の方法でお問い合わせください。

- [GitHubの`SameSite`サンプルリポジトリ](https://github.com/GoogleChromeLabs/samesite-examples)で問題を登録する。
- [StackOverflowで「samesite」タグ](https://stackoverflow.com/questions/tagged/samesite)に関する質問をブログに投稿する。
- Chromiumの動作に関する問題については、 [[SameSitecookies]問題テンプレートを](https://bit.ly/2lJMd5c)でバグを登録する。
- [`SameSite`更新ページ](https://www.chromium.org/updates/same-site)でChromeの進捗状況をフォローする。


