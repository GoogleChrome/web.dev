---
title: リファラーとリファラーポリシーのベストプラクティス
subhead: リファラーポリシーを設定し、送信されてくるリクエストにリファラーを使用するためのベストプラクティス。
authors:
  - maudn
date: '2020-07-30'
updated: '2020-09-23'
hero: image/admin/kh2IMJFSJ3Cj6Zo8jEv5.jpg
thumbnail: image/admin/kh2IMJFSJ3Cj6Zo8jEv5.jpg
description: |2

 "Consider setting a referrer policy of `strict-origin-when-cross-origin`. It retains much of the referrer's usefulness, while mitigating the risk of leaking data cross-origins."
tags:
  - blog
  - security
  - privacy
feedback:
  - api
---

## 概要

- 予期しないクロスオリジン情報の漏洩は、Web ユーザーのプライバシーに支障をきたします。保護リファラーポリシーが便利です。
- Consider setting a referrer policy of `strict-origin-when-cross-origin`. It retains much of the referrer's usefulness, while mitigating the risk of leaking data cross-origins.
- クロスサイトリクエストフォージェリ (CSRF) 保護にリファラーを使用しないでください。 [代わりに CSRF トークン](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation)を使用し、セキュリティの追加レイヤーとして他のヘッダーを使用します。

{% Aside %}始める前に：

- If you're unsure of the difference between "site" and "origin", check out [Understanding "same-site" and "same-origin"](/same-site-same-origin/).
- The `Referer` header is missing an R, due to an original misspelling in the spec. The `Referrer-Policy` header and `referrer` in JavaScript and the DOM are spelled correctly. {% endAside %}

## リファラーとリファラーポリシー 101

HTTP リクエストには、リクエストの発信元または Web ページの URL を示す [`Referer` ヘッダーが含まれる場合があります。](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) [`Referrer-Policy` ヘッダーは、](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)`Referer` ヘッダーで使用できるデータを定義します。

以下の例では、`Referer` ヘッダーには、リクエストの発信元となる `site-one` のページの完全な URL が含まれています。

<figure class="w-figure">{％Img src = "image / admin / cXgqJfmD5OPdzqXl9RNt.jpg"、alt = "リファラーヘッダーを含む HTTP リクエスト。"、width = "800"、height = "573"％}</figure>

`Referer` ヘッダーは、さまざまなタイプのリクエストに存在する可能性があります。

- Navigation requests, when a user clicks a link
- Subresource requests, when a browser requests images, iframes, scripts, and other resources that a page needs.

For navigations and iframes, this data can also be accessed via JavaScript using `document.referrer`.

`Referer` 値はインサイトを提供する可能性があります。たとえば、分析サービスはこの値を使用して、 `site-two.example` の訪問者のうち 50% は `social-network.example`から来たと判断することが考えられます。

But when the full URL including the path and query string is sent in the `Referer` **across origins**, this can be **privacy-hindering** and pose **security risks** as well. Take a look at these URLs:

<figure class="w-figure">   {% Img src="image/admin/oTUtfrwaGYYjlOJ6KRs6.jpg", alt="URLs with paths, mapped to different privacy and security risks.", width="800", height="370" %} </figure>

URLs #1 to #5 contain private information—sometimes even identifying or sensitive. Leaking these silently across origins can compromise web users' privacy.

URL＃6 は[機能 URL](https://www.w3.org/TR/capability-urls/) で、意図したユーザー以外の人物には渡したくないものです。これが発生した場合、悪意のある攻撃者がこのユーザーのアカウントを乗っ取る可能性があります。

**サイトからのリクエストで利用できるリファラーデータを制限するには、リファラーポリシーを設定できます。**

## 利用可能なポリシーは？それぞれの違う点は？

8 つのポリシーから 1 つ選択できます。ポリシーに応じて、 `Referer` ヘッダー (および`document.referrer`) からは以下のデータを使用できる場合があります。

- データなし (`Referer` ヘッダーがない)
- [オリジン](/same-site-same-origin/#origin)のみ
- 完全な URL：オリジン、パス、クエリ文字列

<figure class="w-figure">   {% Img src="image/admin/UR1U0HRP0BOF1e0XnyWA.jpg", alt="Data that can be contained in the Referer header and document.referrer.", width="800", height="255" %} </figure>

一部のポリシーは、**コンテキスト**に応じて異なる動作をするように設計されています：クロスオリジンまたは同じオリジンのリクエスト、セキュリティ (リクエストの宛先がオリジンと同じくらい安全かどうか)、またはその両方。これは、自分のサイト内のリファラーの豊富さを維持しながら、オリジン間で共有される情報の量を制限したり、安全性の低いオリジンに制限したりするのに役立ちます。

リファラ―ポリシーによってリファラ―ヘッダーと `document.referrer` の使用できる URL データがどのように制限されるかを以下にまとめています。

<figure class="w-figure">{％Img src = "image / admin / BIHWDY60CI317O7IzmQs.jpg"、alt = "セキュリティとクロスオリジンコンテキストに応じた、さまざまなリファラーポリシーとその動作。"、width = "800"、height = "537"％}</figure>

MDN provides a [full list of policies and behavior examples](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy#Directives).

注意事項：

- All policies that take the scheme (HTTPS vs. HTTP) into account (`strict-origin`, `no-referrer-when-downgrade` and `strict-origin-when-cross-origin`) treat requests from an HTTP origin to another HTTP origin the same way as requests from an HTTPS origin to another HTTPS origin—even if HTTP is less secure. That's because for these policies, what matters is whether a security **downgrade** takes place, i.e. if the request can expose data from an encrypted origin to an unencrypted one. An HTTP → HTTP request is unencrypted all along, so there is no downgrade. HTTPS → HTTP requests, on the contrary, present a downgrade.
- リクエストの**オリジンが同じ**である場合は、スキーム (HTTPS または HTTP) が同じであるため、セキュリティのダウングレードは起こらないことを意味します。

## ブラウザのデフォルトのリファラーポリシー

*As of July 2020*

**リファラーポリシーが設定されていない場合は、ブラウザーのデフォルトポリシーが使用されます。**

<div class="w-table-wrapper">
  <table>
    <thead>
      <tr>
        <th>Browser</th>
        <th>Default <code>Referrer-Policy</code> / Behavior</th>
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
<code>strict-origin-when-cross-origin</code> (<a href="https://bugzilla.mozilla.org/show_bug.cgi?id=1589074">see closed bug</a>)</li>
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
<a href="https://github.com/privacycg/proposals/issues/13">Experimenting</a> with <code>strict-origin-when-cross-origin</code>             </li>
          </ul>
        </td>
      </tr>
      <tr>
        <td>サファリ</td>
        <td>           Similar to <code>strict-origin-when-cross-origin</code>. See           <a href="https://webkit.org/blog/9661/preventing-tracking-prevention-tracking/">Preventing Tracking Prevention Tracking</a> for details.         </td>
      </tr>
    </tbody>
  </table>
</div>

## リファラーポリシーの設定：ベストプラクティス

{% Aside 'objective' %}`strict-origin-when-cross-origin` (またはそれ以上に厳密なポリシー) などのプライバシー強化ポリシーを明示的に設定します。 {% endAside %}

サイトのリファラーポリシーを設定するには、さまざまな方法があります。

- HTTP ヘッダーとして設定する
- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy#Integration_with_HTML) 内で設定する
- [リクエストごとに](https://javascript.info/fetch-api#referrer-referrerpolicy) JavaScript から設定する

ページ、リクエスト、要素ごとに異なるポリシーを設定できます。

HTTP ヘッダーとメタ要素はどちらもページレベルです。要素の有効なポリシーを決定する際の優先順位は次のとおりです。

1. 要素レベルのポリシー
2. ページレベルのポリシー
3. Browser default

**例：**

`index.html` ：

```html
<meta name="referrer" content="strict-origin-when-cross-origin" />
<img src="..." referrerpolicy="no-referrer-when-downgrade" />
```

The image will be requested with a `no-referrer-when-downgrade` policy, while all other subresource requests from this page will follow the `strict-origin-when-cross-origin` policy.

## リファラーポリシーを確認するにはどうすればよいですか？

特定のサイトまたはページが使用しているポリシーを判別するには、[securityheaders.com](https://securityheaders.com/) が便利です。

Chrome、Edge、または Firefox の開発者ツールを使用して、特定のリクエストに使用されるリファラーポリシーを確認することもできます。この記事の執筆時点では、Safari に`Referrer-Policy`ヘッダーは表示されませんが、送信された`Referer` は表示されます。

<figure class="w-figure">   {% Img src="image/admin/8Qlu6ZzSVgL2f9iYIplJ.jpg", alt="A screenshot of the Network panel of Chrome DevTools, showing Referer and Referrer-Policy.", width="800", height="416" %}   <figcaption class="w-figcaption">     Chrome DevTools, <b>Network</b> panel with a request selected.   </figcaption> </figure>

## Which policy should you set for your website?

`strict-origin-when-cross-origin` （またはそれ以上）などのプライバシー強化ポリシーを明示的に設定します。

### なぜ「明示的に」設定するのか？

リファラーポリシーが設定されていない場合は、ブラウザーのデフォルトポリシーが使用されます。実際、Web サイトはブラウザーのデフォルト設定に従うことがよくあります。しかし、これは理想的ではありません。理由は次のとおりです。

- Browser default policies are either `no-referrer-when-downgrade`, `strict-origin-when-cross-origin`, or stricter—depending on the browser and mode (private/incognito). So your website won't behave predictably across browsers.
- `strict-origin-when-cross-origin`などのより厳密なデフォルトと、クロスオリジンリクエストの[リファラートリミング](https://github.com/privacycg/proposals/issues/13)などのメカニズムを採用しています。ブラウザのデフォルトが変更される前にプライバシー強化ポリシーを明示的にオプトインすると、制御が可能になり、適切と思われるテストを実行できるようになります。

### なぜ`strict-origin-when-cross-origin` (またはより厳密なポリシー) を使うのですか？

ポリシーは安全で、プライバシーの強化につながり、かつ便利なものが必要だからです。何が「便利」なのかは、リファラーに何を求めているかによって異なります。

- **Secure**: if your website uses HTTPS ([if not, make it a priority](/why-https-matters/)), you don't want your website's URLs to leak in non-HTTPS requests. Since anyone on the network can see these, this would expose your users to person-in-the-middle-attacks. The policies `no-referrer-when-downgrade`, `strict-origin-when-cross-origin`, `no-referrer` and `strict-origin` solve this problem.
- **Privacy-enhancing**: for a cross-origin request, `no-referrer-when-downgrade` shares the full URL—this is not privacy-enhancing. `strict-origin-when-cross-origin` and `strict-origin` only share the origin, and `no-referrer` shares nothing at all. This leaves you with `strict-origin-when-cross-origin`, `strict-origin`, and `no-referrer` as privacy-enhancing options.
- **Useful**: `no-referrer` and `strict-origin` never share the full URL, even for same-origin requests—so if you need this, `strict-origin-when-cross-origin` is a better option.

All of this means that **`strict-origin-when-cross-origin`** is generally a sensible choice.

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

Note that Safari/WebKit may cap `document.referrer` or the `Referer` header for [cross-site](/same-site-same-origin/#same-site-cross-site) requests. See [details](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/).

### 例：リクエストレベルのポリシー

`script.js` ：

```javascript
fetch(url, {referrerPolicy: 'no-referrer-when-downgrade'});
```

### 他には何を考慮すべきですか？

Your policy should depend on your website and use cases—this is up to you, your team, and your company. If some URLs contain identifying or sensitive data, set a protective policy.

{% Aside 'warning' %}機密性が低いと思われるデータでも、ユーザーにとっては機密性が高いものである場合があります。または、単に不要なデータであったり、オリジン間でサイレントにリークするとは思われていないデータである場合もあります。{% endAside %}

## 送信されてくるリクエストのリファラーの使用：ベストプラクティス

### サイトの機能が送信されてくるリクエストのリファラー URL を使用している場合はどうすればよいですか？

#### ユーザーのデータを保護する

`Referer`には、個人データや識別データが含まれている可能性があるため、適切に取り扱う必要があります。

#### 受信する`Referer`は変更される場合があることを覚えておきましょう。

送られてくるクロスオリジンリクエストのリファラーを使用することには、制限がいくつかあります。

- If you have no control over the request emitter's implementation, you can't make assumptions about the `Referer` header (and `document.referrer`) you receive. The request emitter may decide anytime to switch to a `no-referrer` policy, or more generally to a stricter policy than what they used before—meaning you'll get less data via the `Referer` than you used to.
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
- If available, headers like [`Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) and [`Sec-Fetch-Site`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site) give you the `Origin` or describe whether the request is cross-origin, which may be exactly what you need.

**URL の他の要素 (パス、クエリパラメータなど) が必要な場合：**

- リクエストパラメータはユースケースに対応している可能性があり、これによりリファラーを解析する手間が省けます。
- If you're using the referrer in a script that has top-level access to the page, `window.location.pathname` may be an alternative. Extract only the path section of the URL and pass it on as an argument, so any potentially sensitive information in the URL parameters isn't passed on.

**これらの代替手段を使用できない場合：**

- Check if your systems can be changed to expect the request emitter (`site-one.example`) to explicitly set the information you need in a configuration of some sort. Pro: more explicit, more privacy-preserving for `site-one.example` users, more future-proof. Con: potentially more work from your side or for your system's users.
- リクエストを発信するサイトが、要素ごとまたはリクエストごとのリファラーポリシーを `no-referrer-when-downgrade` に設定することに同意するかどうかを確認します。 `site-one.example` のユーザーのプライバシー保護が低下する可能性があり、すべてのブラウザーでサポートされるとは限りません。

### クロスサイトリクエストフォージェリ (CSRF) 保護

Note that a request emitter can always decide not to send the referrer by setting a `no-referrer` policy (and a malicious actor could even spoof the referrer).

Use [CSRF tokens](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#token-based-mitigation) as your primary protection. For extra protection, use [SameSite](/samesite-cookie-recipes/#%22unsafe%22-requests-across-sites)—and instead of `Referer`, use headers such as [`Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) (available on POST and CORS requests) and [`Sec-Fetch-Site`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site) (if available).

### ロギング

`Referer` 含まれている可能性のあるユーザーの個人データまたは機密データを必ず保護してください。

オリジンのみを使用している場合は、[`Origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) ヘッダーを代替として使用できるかどうかを確認してください。そうすることで、わざわざリファラーを解析せずに、デバッグに必要な情報をより簡単に得られる場合があります。

### 支払い

支払いプロバイダーは、セキュリティチェックを行う際に、受信するリクエストの `Referer` ヘッダーを確認する場合がります。

For example:

- The user clicks a **Buy** button on `online-shop.example/cart/checkout`.
- `online-shop.example` は、取引を管理するため `payment-provider.example` にリダイレクトします。
- `payment-provider.example` は、このリクエストの `Referer` をマーチャントが設定した許可されている `Referer` 値のリストと照合します。リストのどのエントリとも一致しない場合、`payment-provider.example`はリクエストを拒否します。一致する場合、ユーザーは取引に進むことができます。

#### 支払いフローのセキュリティチェックのベストプラクティス

**まとめ: 支払いプロバイダーは、`Referer` をナイーブな攻撃に対する基本的なチェックとして使用できますが、他にも信頼性の高い検証方法を絶対に用意しておく必要があります。**

The `Referer` header alone isn't a reliable basis for a check: the requesting site, whether they're a legitimate merchant or not, can set a `no-referrer` policy which will make the `Referer` information unavailable to the payment provider. However, as a payment provider, looking at the `Referer` may help you catch naive attackers who did not set a `no-referrer` policy. So you can decide to use the `Referer` as a first basic check. If you do so:

- **Do not expect the `Referer` to always be present; and if it's present, only check against the piece of data it will include at the minimum: the origin**. When setting the list of allowed `Referer` values, make sure that no path is included, but only the origin. Example: the allowed `Referer` values for `online-shop.example` should be `online-shop.example`, not `online-shop.example/cart/checkout`. Why? Because by expecting either no `Referer` at all or a `Referer` value that is the origin of the requesting website, you prevent unexpected errors since you're **not making assumptions about the `Referrer-Policy`** your merchant has set or about the browser's behavior if the merchant has no policy set. Both the site and the browser could strip the `Referer` sent in the incoming request to only the origin or not send the `Referer` at all.
- `Referer` が存在しない場合、またはリファラーが存在し、基本的な`Referer` 発信元チェックが成功した場合は、もう 1 つのより信頼性が高い検証方法を試します (以下を参照)。

**より信頼性の高い検証方法とは何ですか？**

信頼できる検証方法の 1 つとして、リクエスターに**一意のキーを使ってリクエストパラメーターをハッシュ化させる**という方法があります。支払いプロバイダーとして、**同じハッシュを自分サイドで計算する**ことにより、自分の計算結果と一致した場合にのみ、そのリクエストを受け入れるということができます。

**What happens to the `Referer` when an HTTP merchant site with no referrer policy redirects to an HTTPS payment provider?**

No `Referer` will be visible in the request to the HTTPS payment provider, because [most browsers](#default-referrer-policies-in-browsers) use `strict-origin-when-cross-origin` or `no-referrer-when-downgrade` by default when a website has no policy set. Also note that [Chrome's change to a new default policy](https://developers.google.com/web/updates/2020/07/referrer-policy-new-chrome-default) won't change this behaviour.

{% Aside %}

Web サイトに HTTP を使用している場合は、 [HTTPS に移行します](/why-https-matters/)。

{% endAside %}

## 結論

保護リファラーポリシーは、ユーザーのプライバシーを高める優れた方法です。

ユーザーを保護するさまざまな手法の詳細については、web.dev の [Safe and secure](/secure/) コレクションをご覧ください！

*Kaustubha Govind、David Van Cleve、Mike West、Sam Dutton、Rowan Merewood、Jxck、Kayce Basques をはじめとする、すべてのレビューアーの貢献とフィードバックに感謝いたします。*

## リソース

- [Understanding "same-site" and "same-origin"](/same-site-same-origin/)
- [新しいセキュリティヘッダー：リファラーポリシー (2017)](https://scotthelme.co.uk/a-new-security-header-referrer-policy/)
- [Referrer-Policy on MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)
- [Referer header: privacy and security concerns on MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Referer_header:_privacy_and_security_concerns)
- [Chrome の変更：Blink Intent to Implement](https://groups.google.com/a/chromium.org/d/msg/blink-dev/aBtuQUga1Tk/n4BLwof4DgAJ)
- [Chrome の変更：Blink Intent to Ship](https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/lqFuqwZDDR8)
- [Chrome の変更：ステータスエントリ](https://www.chromestatus.com/feature/6251880185331712)
- [Chrome の変更：85 件のベータ版ブログ記事](https://blog.chromium.org/2020/07/chrome-85-upload-streaming-human.html)
- [GitHub スレッドをトリミングするリファラ―：さまざまなブラウザーの機能](https://github.com/privacycg/proposals/issues/13)
- [リファラーポリシーの仕様](https://w3c.github.io/webappsec-referrer-policy/#referrer-policy-delivery)
