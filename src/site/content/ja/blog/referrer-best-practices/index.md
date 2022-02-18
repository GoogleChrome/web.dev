---
layout: post
title: リファラーとリファラーポリシーのベストプラクティス
subhead: リファラーポリシーを設定し、送信されてくるリクエストにリファラーを使用するためのベストプラクティス。
authors:
  - maudn
date: 2020-07-30
updated: 2020-09-23
hero: image/admin/kh2IMJFSJ3Cj6Zo8jEv5.jpg
thumbnail: image/admin/kh2IMJFSJ3Cj6Zo8jEv5.jpg
description: |
  `strict-origin-when-cross-origin` のリファラーポリシーを設定をご検討ください。データのクロスオリジンが漏洩するリスクを軽減しながら、リファラーの有用性の多くを保持します。
tags:
  - blog
  - security
  - privacy
feedback:
  - api
---

## 概要

- 予期しないクロスオリジン情報の漏洩は、Web ユーザーのプライバシーに支障をきたします。保護リファラーポリシーが便利です。
- `strict-origin-when-cross-origin`リファラーポリシーを設定することをご検討ください。データのクロスオリジンを漏洩するリスクを軽減しながら、リファラーの有用性の多くを保持します。
- クロスサイトリクエストフォージェリ (CSRF) 保護にリファラーを使用しないでください。 [代わりに CSRF トークン](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation)を使用し、セキュリティの追加レイヤーとして他のヘッダーを使用します。

{% Aside %}始める前に：

- 「サイト」と「オリジン」の違いがわからない場合は、 [「同一サイト」と「同一オリジン」について](/same-site-same-origin/)をご確認ください。
- 元々仕様にスペルミスがあり、 `Referer` ヘッダーの「R」が抜けています。JavaScript と DOM の`Referrer-Policy` ヘッダーと`referrer` のスペルは正しく表記されています。{% endAside %}

## リファラーとリファラーポリシー 101

HTTP リクエストには、リクエストの発信元または Web ページの URL を示す [`Referer` ヘッダーが含まれる場合があります。](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referer) [`Referrer-Policy` ヘッダーは、](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy)`Referer` ヘッダーで使用できるデータを定義します。

以下の例では、`Referer` ヘッダーには、リクエストの発信元となる `site-one` のページの完全な URL が含まれています。

<figure>
  {% Img src="image/admin/cXgqJfmD5OPdzqXl9RNt.jpg", alt="リファラーヘッダーを含む HTTP リクエスト。", width="800", height="573" %}
</figure>

`Referer` ヘッダーは、さまざまなタイプのリクエストに存在する可能性があります。

- ユーザーがリンクをクリックしたときのナビゲーションリクエスト
- ブラウザーが画像、iframe、スクリプト、およびページに必要なその他のリソースを要求するときのサブリソース要求。

`document.referrer` を使用して JavaScript 経由でアクセスすることも可能です。

`Referer` 値はインサイトを提供する可能性があります。たとえば、分析サービスはこの値を使用して、 `site-two.example` の訪問者のうち 50% は `social-network.example`から来たと判断することが考えられます。

ただし、パスとクエリ文字列を含む完全な URL が**オリジン間**を`リファラー`として送信される場合、これは**プライバシーの阻害**となるほか、**セキュリティリスク**をもたらす可能性があります。以下の URL をご覧ください。

<figure>
  {% Img src="image/admin/oTUtfrwaGYYjlOJ6KRs6.jpg", alt="パス付きの URL。さまざまなプライバシーとセキュリティのリスクにマッピングされています。", width="800", height="370" %}
</figure>

URL＃1 から ＃5 には個人情報が含まれており、場合によっては識別情報や機密情報も含まれます。これらがオリジン間でサイレントに漏洩されると、Web ユーザーのプライバシーが危険にさらされる可能性があります。

URL＃6 は[機能 URL](https://www.w3.org/TR/capability-urls/) で、意図したユーザー以外の人物には渡したくないものです。これが発生した場合、悪意のある攻撃者がこのユーザーのアカウントを乗っ取る可能性があります。

**サイトからのリクエストで利用できるリファラーデータを制限するには、リファラーポリシーを設定できます。**

## 利用可能なポリシーは？それぞれの違う点は？

8 つのポリシーから 1 つ選択できます。ポリシーに応じて、 `Referer` ヘッダー (および`document.referrer`) からは以下のデータを使用できる場合があります。

- データなし (`Referer` ヘッダーがない)
- [オリジン](/same-site-same-origin/#origin)のみ
- 完全な URL：オリジン、パス、クエリ文字列

<figure>
  {% Img src="image/admin/UR1U0HRP0BOF1e0XnyWA.jpg", alt="Referer ヘッダーと document.referrer に含めることができるデータ。", width="800", height="255" %}
</figure>

一部のポリシーは、**コンテキスト**に応じて異なる動作をするように設計されています：クロスオリジンまたは同じオリジンのリクエスト、セキュリティ (リクエストの宛先がオリジンと同じくらい安全かどうか)、またはその両方。これは、自分のサイト内のリファラーの豊富さを維持しながら、オリジン間で共有される情報の量を制限したり、安全性の低いオリジンに制限したりするのに役立ちます。

リファラ―ポリシーによってリファラ―ヘッダーと `document.referrer` の使用できる URL データがどのように制限されるかを以下にまとめています。

<figure>
  {% Img src="image/admin/BIHWDY60CI317O7IzmQs.jpg", alt="セキュリティとクロスオリジンコンテキストに応じた、さまざまなリファラーポリシーとその動作。", width="800", height="537" %}
</figure>

MDN で、 [ポリシーと動作の例の完全なリスト](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy#Directives)が提供されています。

注意事項：

- スキーム (HTTPS と HTTP) を考慮に入れるすべてのポリシー (`strict-origin` 、 `no-referrer-when-downgrade` 、および `strict-origin-when-cross-origin`) は、HTTP オリジンから別の HTTP オリジンへのリクエストを HTTPS オリジンから別の HTTPS オリジンへのリクエストと同じように処理します (HTTP の安全性が低い場合も例外ではありません)。これらのポリシーについては、セキュリティの**ダウングレード**が発生するかどうか、つまり、リクエストによりデータが暗号化されたオリジンから暗号化されていないオリジンに公開されてしまうかどうかが重要だからです。 HTTP から HTTP へのリクエストは最初から最後まで暗号化されないため、ダウングレードは起こりません。逆に、HTTPS から HTTP リクエストへのリクエストでは、ダウングレードが起こります。
- リクエストの**オリジンが同じ**である場合は、スキーム (HTTPS または HTTP) が同じであるため、セキュリティのダウングレードは起こらないことを意味します。

## ブラウザのデフォルトのリファラーポリシー

*2020 年 7 月現在*

**リファラーポリシーが設定されていない場合は、ブラウザーのデフォルトポリシーが使用されます。**

<div>
  <table>
    <thead>
      <tr>
        <th>ブラウザー</th>
        <th>デフォルトの<code>Referrer-Policy</code>/動作</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>クロム</td>
        <td>
<a href="https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default">バージョン85で</a><code>strict-origin-when-cross-origin</code>への切り替えを計画しています (以前は<code>no-referrer-when-downgrade</code>)</td>
      </tr>
      <tr>
        <td>Firefox</td>
        <td>
          <ul>
            <li>
<code>strict-origin-when-cross-origin</code> （<a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1589074">クローズドバグを参照してください</a>）</li>
            <li>プライベートブラウジングおよびトラッカーの<code>strict-origin-when-cross-origin</code>
</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>角</td>
        <td>
          <ul>
            <li><code>no-referrer-when-downgrade</code></li>
            <li>
<code>strict-origin-when-cross-origin</code>での<a href="https://github.com/privacycg/proposals/issues/13">実験</a>
</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>サファリ</td>
        <td>
<code>strict-origin-when-cross-origin</code>と同様です。詳細については、「<a href="https://webkit.org/blog/9661/preventing-tracking-prevention-tracking/">トラッキング防止トラッキングの防止</a>」を参照してください。</td>
      </tr>
    </tbody>
  </table>
</div>

## リファラーポリシーの設定：ベストプラクティス

{% Aside 'objective' %}`strict-origin-when-cross-origin` (またはそれ以上に厳密なポリシー) などのプライバシー強化ポリシーを明示的に設定します。 {% endAside %}

サイトのリファラーポリシーを設定するには、さまざまな方法があります。

- HTTP ヘッダーとして設定する
- [HTML](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy#Integration_with_HTML) 内で設定する
- [リクエストごとに](https://javascript.info/fetch-api#referrer-referrerpolicy) JavaScript から設定する

ページ、リクエスト、要素ごとに異なるポリシーを設定できます。

HTTP ヘッダーとメタ要素はどちらもページレベルです。要素の有効なポリシーを決定する際の優先順位は次のとおりです。

1. 要素レベルのポリシー
2. ページレベルのポリシー
3. ブラウザーのデフォルト

**例：**

`index.html` ：

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
<img src="..." referrerpolicy="no-referrer-when-downgrade" />
```

画像は`no-referrer-when-downgrade`ポリシーでリクエストされますが、このページからの他のすべてのサブリソースリクエストは、`strict-origin-when-cross-origin`ポリシーに従います。

## リファラーポリシーを確認するにはどうすればよいですか？

特定のサイトまたはページが使用しているポリシーを判別するには、[securityheaders.com](https://securityheaders.com/) が便利です。

Chrome、Edge、または Firefox の開発者ツールを使用して、特定のリクエストに使用されるリファラーポリシーを確認することもできます。この記事の執筆時点では、Safari に`Referrer-Policy`ヘッダーは表示されませんが、送信された`Referer` は表示されます。

<figure>
  {% Img src="image/admin/8Qlu6ZzSVgL2f9iYIplJ.jpg", alt="Chrome DevTools のネットワークパネルのスクリーンショット。リファラーとリファラーポリシーを示しています。", width="800", height="416" %}
  <figcaption>
    Chrome DevTools、リクエストが選択された<b>ネットワーク</b>パネル。
  </figcaption>
</figure>

## Web サイトにはどのポリシーを設定する必要がありますか？

`strict-origin-when-cross-origin` （またはそれ以上）などのプライバシー強化ポリシーを明示的に設定します。

### なぜ「明示的に」設定するのか？

リファラーポリシーが設定されていない場合は、ブラウザーのデフォルトポリシーが使用されます。実際、Web サイトはブラウザーのデフォルト設定に従うことがよくあります。しかし、これは理想的ではありません。理由は次のとおりです。

- ブラウザーのデフォルトポリシーは、ブラウザーとモード (プライベート/シークレット) に応じて、 `no-referrer-when-downgrade` 、 `strict-origin-when-cross-origin`のいずれか、またはさらに厳密なポリシーであるため、ブラウザーが異なると Web サイトの動作は予期できないものになります。
- `strict-origin-when-cross-origin`などのより厳密なデフォルトと、クロスオリジンリクエストの[リファラートリミング](https://github.com/privacycg/proposals/issues/13)などのメカニズムを採用しています。ブラウザのデフォルトが変更される前にプライバシー強化ポリシーを明示的にオプトインすると、制御が可能になり、適切と思われるテストを実行できるようになります。

### なぜ`strict-origin-when-cross-origin` (またはより厳密なポリシー) を使うのですか？

ポリシーは安全で、プライバシーの強化につながり、かつ便利なものが必要だからです。何が「便利」なのかは、リファラーに何を求めているかによって異なります。

- **安全**：Web サイトが HTTPS を使用している場合 ([使用していない場合は優先します](/why-https-matters/))、HTTPS 以外の要求で Web サイトの URL がリークしないようにします。ネットワーク上の誰もがこれらを見ることができるので、これはあなたのユーザーを中途半端な攻撃にさらすことになります。`no-referrer-when-downgrade`、`strict-origin-when-cross-origin`、`no-referrer`、`strict-origin` ポリシーがこの問題を解決します。
- **プライバシー強化**：クロスオリジンリクエストの場合、 `no-referrer-when-downgrade` が完全な URL を共有します。これはプライバシー強化ではありません。 `strict-origin-when-cross-origin` と `strict-origin` のみを共有し、 `no-referrer` は何も共有しません。したがって、プライバシーを強化するオプションとしては `strict-origin-when-cross-origin`、`strict-origin`、および `no-referrer` を使用することになります。
- **便利**： `no-referrer` と `strict-origin` は、同じオリジンのリクエストであっても、完全な URL を共有することはありません。したがって、これが必要な場合は、`strict-origin-when-cross-origin` の方が適切なオプションであると言えます。

つまり、**`strict-origin-when-cross-origin`**が通常賢明な選択肢となります。

**例： `strict-origin-when-cross-origin`ポリシーの設定：**

`index.html` ：

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
```

またはサーバー側、たとえば Express の場合：

```javascript
const helmet = require('helmet');
app.use(helmet.referrerPolicy({policy: 'strict-origin-when-cross-origin'}));
```

### `strict-origin-when-cross-origin` (またはより厳密なポリシー) がすべてのユースケースに対応できない場合はどうしますか？

この場合、**プログレッシブアプローチを採用します。**`strict-origin-when-cross-origin`などの保護ポリシーを設定し、必要に応じて、特定のリクエストや HTML 要素に対してより寛容なポリシーを設定します。

### 例：要素レベルのポリシー

`index.html` ：

```html/6
<head>
  <!-- document-level policy: strict-origin-when-cross-origin -->
  <meta name="referrer" content="strict-origin-when-cross-origin" />
  <head>
    <body>
      <!-- policy on this <a> element: no-referrer-when-downgrade -->
      <a src="…" href="…" referrerpolicy="no-referrer-when-downgrade"></a>
      <body></body>
    </body>
  </head>
</head>
```

Safari/WebKit は、[クロスサイト](/same-site-same-origin/#same-site-cross-site)リクエストの `document.referrer` または `Referer` ヘッダーに上限を設ける場合があることにご注意ください。「[詳細](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)」をご確認ください。

### 例：リクエストレベルのポリシー

`script.js` ：

```javascript
fetch(url, {referrerPolicy: 'no-referrer-when-downgrade'});
```

### 他には何を考慮すべきですか？

どのポリシーを使用するかは、Web サイトやユースケースにより異なります。これは、あなた自信やあなたのチーム、お勤め先の企業が決める事です。一部の URLに 識別データまたは機密データが含まれている場合は、保護ポリシーを設定します。

{% Aside 'warning' %}機密性が低いと思われるデータでも、ユーザーにとっては機密性が高いものである場合があります。または、単に不要なデータであったり、オリジン間でサイレントにリークするとは思われていないデータである場合もあります。{% endAside %}

## 送信されてくるリクエストのリファラーの使用：ベストプラクティス

### サイトの機能が送信されてくるリクエストのリファラー URL を使用している場合はどうすればよいですか？

#### ユーザーのデータを保護する

`Referer`には、個人データや識別データが含まれている可能性があるため、適切に取り扱う必要があります。

#### 受信する`Referer`は変更される場合があることを覚えておきましょう。

送られてくるクロスオリジンリクエストのリファラーを使用することには、制限がいくつかあります。

- リクエスト発信元の実装を一切制御できない場合には、受信する`Referer`ヘッダー (および`document.referrer`) について予想を立てることはできません。リクエスト発信元は、いつでも `no-referrer` ポリシー、または一般的にはより厳密なポリシーに切り替えることができます。つまり、`Referer` からは、それまでよりも少ない量のデータしか取得できなくなります。
- ブラウザには、デフォルトで Referrer-Policy `strict-origin-when-cross-origin` が使用されることを増えつつあります。これは、これらを送信するサイトにポリシーが設定されていない場合は、受信するクロスオリジンリクエストで (完全なリファラーURLではなく) オリジンのみを受信できることを意味します。
- ブラウザーは `Referer` の管理方法を変更する場合があります。たとえば、将来的には、ユーザーのプライバシーを保護するために、クロスオリジンサブリソースリクエストのオリジンへのリファラーを常にトリミングすることを決定することができます。
- `Referer`ヘッダー (および`document.referrer`) には、必要以上のデータが含まれている場合があります。たとえば、リクエストがクロスオリジンであるかどうかだけを知りたいときに、完全な URL が含まれている場合があります。

#### `Referer`代替

次の場合は、代替案を検討する必要があります。

- サイトの重要な機能は、受信するクロスオリジンリクエストのリファラー URL を使用します。
- および/またはサイトがクロスオリジンリクエストで必要なリファラー URL の一部を受信しなくなった場合。これは、リクエストエミッタがポリシーを変更した場合、またはポリシーが設定されておらず、ブラウザのデフォルトのポリシーが変更された場合に発生します ([Chrome 85など](https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default))。

代替案を定義するには、最初にリファラーのどの部分を使用しているかを分析します。

**オリジンのみが必要な場合 (`https://site-one.example`)：**

- ページへのトップレベルのアクセス権を持つスクリプトでリファラーを使用している場合は、`window.location.origin` が代わりとなります。
- [`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin) や [`Sec-Fetch-Site`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site) などのヘッダーを使用できる場合には、`Origin` を取得できたり、リクエストがクロスオリジンかどうかを説明できたりします。それがまさに必要となものである場合もあります。

**URL の他の要素 (パス、クエリパラメータなど) が必要な場合：**

- リクエストパラメータはユースケースに対応している可能性があり、これによりリファラーを解析する手間が省けます。
- ページへのトップレベルのアクセス権を持つスクリプトでリファラーを使用している場合は、 `window.location.pathname`が代わりとなる可能性があります。 URL のパスセクションのみを抽出して引数として渡すため、URL パラメーター内の機密情報が渡されることはありません。

**これらの代替手段を使用できない場合：**

- リクエストの発信元 (`site-one.example`) が必要とされている情報を何らかの構成で明示的に設定することを要件とするようにシステムを変更できるかどうかを確認します。 メリット: `site-one.example` のユーザーにとっては情報がより明示的になり、プライバシーも保護され、将来的にも効果を発揮します。デメリット: 管理者およびシステムのユーザーの作業が増える可能性があります。
- リクエストを発信するサイトが、要素ごとまたはリクエストごとのリファラーポリシーを `no-referrer-when-downgrade` に設定することに同意するかどうかを確認します。 `site-one.example` のユーザーのプライバシー保護が低下する可能性があり、すべてのブラウザーでサポートされるとは限りません。

### クロスサイトリクエストフォージェリ (CSRF) 保護

リクエストの発信元は、`no-referrer`ポリシーを設定すれば、いつでもリファラーを送信しないようにすることができます。(悪意のあるアクターはリファラーに対してスプーフィングを実行できる可能性すらあります)。

[CSRF トークン](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation)を主な保護として使用します。保護を強化するには [SameSite](/samesite-cookie-recipes/#%22unsafe%22-requests-across-sites) を使用し、`Referer` の代わりに [`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin) (POST および CORS リクエストで利用可能) や (利用可能な場合は) [`Sec-Fetch-Site`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Sec-Fetch-Site) などのヘッダーを使用します。

### ロギング

`Referer` 含まれている可能性のあるユーザーの個人データまたは機密データを必ず保護してください。

オリジンのみを使用している場合は、[`Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Origin) ヘッダーを代替として使用できるかどうかを確認してください。そうすることで、わざわざリファラーを解析せずに、デバッグに必要な情報をより簡単に得られる場合があります。

### 支払い

支払いプロバイダーは、セキュリティチェックを行う際に、受信するリクエストの `Referer` ヘッダーを確認する場合がります。

たとえば：

- ユーザーが `online-shop.example/cart/checkout` で**購入**ボタンをクリックします。
- `online-shop.example` は、取引を管理するため `payment-provider.example` にリダイレクトします。
- `payment-provider.example` は、このリクエストの `Referer` をマーチャントが設定した許可されている `Referer` 値のリストと照合します。リストのどのエントリとも一致しない場合、`payment-provider.example`はリクエストを拒否します。一致する場合、ユーザーは取引に進むことができます。

#### 支払いフローのセキュリティチェックのベストプラクティス

**まとめ: 支払いプロバイダーは、`Referer` をナイーブな攻撃に対する基本的なチェックとして使用できますが、他にも信頼性の高い検証方法を絶対に用意しておく必要があります。**

`Referer` ヘッダーだけを見ても、セキュリティチェックを判断できる信頼性の高い根拠にはなりません。リクエストする側のサイトは、正当なマーチャントであるかどうかは問わず、`no-referrer` ポリシーを設定できてしまうからです。それにより、支払いプロバイダーは `Referer` 情報を使用できなくなってしまいます。ただし、支払いプロバイダーは、`Referer` を見ることで、`no-referrer` ポリシーを設定していないナイーブな攻撃者なら特定できる可能性があります。したがって、`Referer` を最初の基本的なチェックとして使用しても構わないでしょう。そうする場合は以下に注意しましょう。

- **` Referer `が常に存在すると思ってはいけません。存在する場合は、それに少なくとも含まれるデータ (オリジン) だけをチェックします。**許可された ` Referer` のリストを設定するときは、オリジンだけが含まれていること、パスは一切含まれていないことを確認します。例: `Referer` 値のリストを設定するときは、パスが含まれておらず、起点のみが含まれていることを確認してください。例: `Referer` が全く存在しないこと、または `Referer` 値 (リクエストする側のウェブサイトのオリジン) が存在することを期待することで、マーチャントが設定した **`Referrer-Policy` やマーチャントがポリシーを一切設定していない場合ならブラウザーの動作について何の憶測も立てていない**ため、不測のエラーを防ぐことになるからです。サイトとブラウザーはともに、受信するリクエストの中身をオリジンだけ残して取り除くことができます。また、`Referer` を全く送信しないこともできます。
- `Referer` が存在しない場合、またはリファラーが存在し、基本的な`Referer` 発信元チェックが成功した場合は、もう 1 つのより信頼性が高い検証方法を試します (以下を参照)。

**より信頼性の高い検証方法とは何ですか？**

信頼できる検証方法の 1 つとして、リクエスターに**一意のキーを使ってリクエストパラメーターをハッシュ化させる**という方法があります。支払いプロバイダーとして、**同じハッシュを自分サイドで計算する**ことにより、自分の計算結果と一致した場合にのみ、そのリクエストを受け入れるということができます。

**リファラーポリシーを持たない HTTP マーチャントサイトが HTTPS プロバイダーにリダイレクトしたとき、`Referer` はどうなりますか？**

ウェブサイトにポリシーが設定されていない場合、[多くのブラウザー](#default-referrer-policies-in-browsers)ではデフォルトで `strict-origin-when-cross-origin` または `no-referrer-when-downgrade` が使用されるため、HTTPS を介した支払いプロバイダーへのリクエストには `Referer` が一切表示されません。また、[Chrome が新たに採用したデフォルトのポリシー](https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default)によって、この動作が変更されることもありません。

{% Aside %}

Web サイトに HTTP を使用している場合は、 [HTTPS に移行します](/why-https-matters/)。

{% endAside %}

## 結論

保護リファラーポリシーは、ユーザーのプライバシーを高める優れた方法です。

ユーザーを保護するさまざまな手法の詳細については、web.dev の [Safe and secure](/secure/) コレクションをご覧ください！

*Kaustubha Govind、David Van Cleve、Mike West、Sam Dutton、Rowan Merewood、Jxck、Kayce Basques をはじめとする、すべてのレビューアーの貢献とフィードバックに感謝いたします。*

## リソース

- [「同一サイト」と「同一オリジン」を理解する](/same-site-same-origin/)
- [新しいセキュリティヘッダー：リファラーポリシー (2017)](https://scotthelme.co.uk/a-new-security-header-referrer-policy/)
- MDN の[リファラーポリシー](https://developer.mozilla.org/docs/Web/HTTP/Headers/Referrer-Policy)
- MDN の[リファラーヘッダー：プライバシーとセキュリティの懸念](https://developer.mozilla.org/docs/Web/Security/Referer_header:_privacy_and_security_concerns)
- [Chrome の変更：Blink Intent to Implement](https://groups.google.com/a/chromium.org/d/msg/blink-dev/aBtuQUga1Tk/n4BLwof4DgAJ)
- [Chrome の変更：Blink Intent to Ship](https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/lqFuqwZDDR8)
- [Chrome の変更：ステータスエントリ](https://www.chromestatus.com/feature/6251880185331712)
- [Chrome の変更：85 件のベータ版ブログ記事](https://blog.chromium.org/2020/07/chrome-85-upload-streaming-human.html)
- [GitHub スレッドをトリミングするリファラ―：さまざまなブラウザーの機能](https://github.com/privacycg/proposals/issues/13)
- [リファラーポリシーの仕様](https://w3c.github.io/webappsec-referrer-policy/#referrer-policy-delivery)
