---
title: 信頼できるタイプを使用して、DOMベースのクロスサイトスクリプティングの脆弱性を防止します
subhead: アプリケーションのDOMXSS攻撃対象領域を減らします。
authors:
  - koto
date: 2020-03-25
hero: image/admin/3Mgu37qU0P4fVdI4NTxM.png
alt: クロスサイトスクリプティングの脆弱性を示すコードスニペット。
description: |2

  信頼できるタイプの紹介：DOMベースのクロスサイトを防ぐためのブラウザーAPI

  最新のWebアプリケーションでのスクリプト。
tags:
  - blog
  - security
feedback:
  - api
---

## なぜあなたは気にする必要がありますか？

DOMベースのクロスサイトスクリプティング（DOM XSS）は、最も一般的なWebセキュリティの脆弱性の1つであり、アプリケーションに導入するのは非常に簡単です。[信頼できるタイプ](https://github.com/w3c/webappsec-trusted-types)は、危険なWeb API関数をデフォルトで安全にすることにより、DOM XSSの脆弱性のないアプリケーションを作成、セキュリティレビュー、および維持するためのツールを提供します。[信頼できるタイプはChrome83](https://github.com/w3c/webappsec-trusted-types#polyfill)でサポートされており、他のブラウザではポリフィルを利用できます。最新のクロスブラウザサポート情報[については、ブラウザの互換性](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types#browser_compatibility)を参照してください。

{% Aside 'key-term' %} DOMベースのクロスサイトスクリプティングは、ユーザーが制御する*ソース*（ユーザー名、URLフラグメントから取得したリダイレクトURLなど）*からのデータがシンク*`eval()`ような関数またはのようなプロパティセッターです`.innerHTML` 、任意のJavaScriptコードを実行できます。 {% endAside %}

## バックグラウンド

何年もの間、 [DOM XSS](https://owasp.org/www-community/attacks/xss/)は、最も一般的で危険なWebセキュリティの脆弱性の1つでした。

クロスサイトスクリプティングには2つの異なるグループがあります。一部のXSSの脆弱性は、Webサイトを形成するHTMLコードを安全に作成しないサーバー側のコードが原因で発生します。他の人はクライアントに根本的な原因があり、JavaScriptコードがユーザー制御のコンテンツで危険な関数を呼び出します。

[サーバー側のXSS](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)を防ぐために、文字列を連結してHTMLを生成せず、代わりに安全なコンテキスト自動エスケープテンプレートライブラリを使用してください。バグが必然的に発生するため、バグをさらに軽減するために[、ノンスベースのコンテンツセキュリティポリシー](https://csp.withgoogle.com/docs/strict-csp.html)を使用してください。

[これで、ブラウザーは、信頼できるタイプ](https://bit.ly/trusted-types)のクライアント側（DOMベースとも呼ばれる）XSSを防ぐのにも役立ちます。

## APIの紹介

トラステッドタイプは、次の危険なシンク機能をロックダウンすることで機能します。[ブラウザベンダーとWebフレームワーク](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)は、セキュリティ上の理由からこれらの機能の使用をすでに避けているため、すでにそれらのいくつかを認識しているかもしれません。

- **スクリプト操作**：<br> [`<script src>`](https://developer.mozilla.org/docs/Web/HTML/Element/script#attr-src)との設定のテキストコンテンツ[`<script>`](https://developer.mozilla.org/docs/Web/HTML/Element/script)要素。

- **文字列からのHTMLの生成**：<br>

    [`innerHTML`](https://developer.mozilla.org/docs/Web/API/Element/innerHTML) 、 [`outerHTML`](https://developer.mozilla.org/docs/Web/API/Element/outerHTML) 、[`insertAdjacentHTML`](https://developer.mozilla.org/docs/Web/API/Element/insertAdjacentHTML) 、 [`<iframe> srcdoc`](https://developer.mozilla.org/docs/Web/HTML/Element/iframe#attr-srcdoc) 、 [`document.write`](https://developer.mozilla.org/docs/Web/API/Document/write) 、 [`document.writeln`](https://developer.mozilla.org/docs/Web/API/Document/writeln) 、および[`DOMParser.parseFromString`](https://developer.mozilla.org/docs/Web/API/DOMParser#DOMParser.parseFromString)

- **プラグインコンテンツの実行**：<br> [`<embed src>`](https://developer.mozilla.org/docs/Web/HTML/Element/embed#attr-src) 、 [`<object data>`](https://developer.mozilla.org/docs/Web/HTML/Element/object#attr-data) 、および[`<object codebase>`](https://developer.mozilla.org/docs/Web/HTML/Element/object#attr-codebase)

- **ランタイムJavaScriptコードのコンパイル**：<br> `eval` 、 `setTimeout` 、 `setInterval` 、 `new Function()`

トラステッドタイプでは、データを上記のシンク関数に渡す前にデータを処理する必要があります。ブラウザはデータが信頼できるかどうかわからないため、文字列を使用するだけでは失敗します。

{% Compare 'worse' %}

```javascript
anElement.innerHTML  = location.href;
```

{% CompareCaption %}信頼できるタイプを有効にすると、ブラウザは*TypeError*をスローし、文字列でDOMXSSシンクを使用できないようにします。 {% endCompareCaption %}

{% endCompare %}

データが安全に処理されたことを示すために、特別なオブジェクト（信頼できるタイプ）を作成します。

{% Compare 'better' %}

```javascript
anElement.innerHTML = aTrustedHTML;
```

{% CompareCaption %}信頼できるタイプを有効にすると、ブラウザはHTMLスニペットを期待するシンクの`TrustedHTML`他の機密性の高いシンク用の`TrustedScript`および`TrustedScriptURL`オブジェクトもあります。 {% endCompareCaption %}

{% endCompare %}

信頼できるタイプは、アプリケーションの[DOMXSS攻撃対象領域](https://en.wikipedia.org/wiki/Attack_surface)を大幅に削減します。これにより、セキュリティレビューが簡素化され、ブラウザで実行時にコードをコンパイル、リント、またはバンドルするときに実行されるタイプベースのセキュリティチェックを実施できます。

## 信頼できるタイプの使用方法

### コンテンツセキュリティポリシー違反レポートの準備

レポートコレクター（オープンソースの[go-csp-collectorなど](https://github.com/jacobbednarz/go-csp-collector)）をデプロイするか、同等の商用製品の1つを使用できます。ブラウザで違反をデバッグすることもできます。

```js
window.addEventListener('securitypolicyviolation',
    console.error.bind(console));
```

### レポートのみのCSPヘッダーを追加する

信頼できるタイプに移行するドキュメントに、次のHTTP応答ヘッダーを追加します。

```text
Content-Security-Policy-Report-Only: require-trusted-types-for 'script'; report-uri //my-csp-endpoint.example
```

これで、すべての違反が`//my-csp-endpoint.example`に報告されますが、Webサイトは引き続き機能します。次のセクションでは、 `//my-csp-endpoint.example`どのように機能するかを説明します。

{% Aside 'caution' %}信頼できるタイプは、HTTPSや`localhost`[などの安全なコンテキスト](https://developer.mozilla.org/docs/Web/Security/Secure_Contexts)でのみ使用できます。 {% endAside %}

### 信頼できるタイプの違反を特定する

これ以降、信頼できるタイプが違反を検出するたびに、構成された`report-uri`が送信されます。たとえば、アプリケーションが文字列を`innerHTML`渡すと、ブラウザは次のレポートを送信します。

```json/6,8,10
{
"csp-report": {
    "document-uri": "https://my.url.example",
    "violated-directive": "require-trusted-types-for",
    "disposition": "report",
    "blocked-uri": "trusted-types-sink",
    "line-number": 39,
    "column-number": 12,
    "source-file": "https://my.url.example/script.js",
    "status-code": 0,
    "script-sample": "Element innerHTML <img src=x"
}
}
```

これは、39行目の`https://my.url.example/script.js` `<img src=x` `innerHTML`が呼び出されたことを示しています。この情報は、コードのどの部分がDOM XSSを導入していて、変更する必要があるかを絞り込むのに役立ちます。

{% Aside %}このような違反のほとんどは、コードベースで[コードリンターまたは静的コードチェッカーを実行することによっても検出できます。](https://github.com/mozilla/eslint-plugin-no-unsanitized)これは、違反の大部分をすばやく特定するのに役立ちます。

とはいえ、これらは不適合コードが実行されたときにトリガーされるため、CSP違反も分析する必要があります。 {% endAside %}

### 違反を修正する

信頼できるタイプの違反を修正するには、いくつかのオプションがあります。[問題のあるコード](#remove-the-offending-code)を[削除したり、ライブラリを使用し](#use-a-library)[たり、信頼できるタイプのポリシーを作成し](#create-a-trusted-type-policy)たり、最後の手段として[デフォルトのポリシーを作成したりできます](#create-a-default-policy)。

#### 問題のあるコードを書き直してください

おそらく、不適合な機能はもう必要ないのでしょうか、それともエラーが発生しやすい関数を使用せずに最新の方法で書き直すことができるのでしょうか。

{% Compare 'worse' %}

```javascript
el.innerHTML = '<img src=xyz.jpg>';
```

{% endCompare %}

{% Compare 'better' %}

```javascript
el.textContent = '';
const img = document.createElement('img');
img.src = 'xyz.jpg';
el.appendChild(img);
```

{% endCompare %}

#### ライブラリを使用する

一部のライブラリは、シンク関数に渡すことができる信頼できるタイプをすでに生成しています。たとえば、 [DOMPurify](https://github.com/cure53/DOMPurify)を使用してHTMLスニペットをサニタイズし、XSSペイロードを削除できます。

```javascript
import DOMPurify from 'dompurify';
el.innerHTML = DOMPurify.sanitize(html, {RETURN_TRUSTED_TYPE: true});
```

[DOMPurifyは](https://github.com/cure53/DOMPurify#what-about-dompurify-and-trusted-types)TrustedTypesをサポートし、ブラウザーが違反を生成しないよう`TrustedHTML`れたHTMLを返します。 {% Aside 'caution' %} DOMPurifyのサニタイズロジックにバグがある場合でも、アプリケーションにDOMXSSの脆弱性がある可能性があります。信頼できるタイプでは、*何らかの*方法で値を処理する必要がありますが、正確な処理ルールとは何か、およびそれらが安全かどうかはまだ定義されていません。 {% endAside %}

#### 信頼できるタイプのポリシーを作成する

機能を削除できない場合があり、値をサニタイズして信頼できるタイプを作成するためのライブラリがありません。そのような場合は、TrustedTypeオブジェクトを自分で作成してください。

そのためには、最初に[ポリシーを](https://w3c.github.io/webappsec-trusted-types/dist/spec/#policies-hdr)作成します。ポリシーは、入力に特定のセキュリティルールを適用するトラステッドタイプのファクトリです。

```javascript/2
if (window.trustedTypes && trustedTypes.createPolicy) { // Feature testing
  const escapeHTMLPolicy = trustedTypes.createPolicy('myEscapePolicy', {
    createHTML: string => string.replace(/\</g, '<')
  });
}
```

このコードは、 `createHTML()`関数を`TrustedHTML`オブジェクトを生成できる`myEscapePolicy`定義されたルールは、新しいHTML要素の作成を防ぐために、 `<`

次のようなポリシーを使用します。

```javascript
const escaped = escapeHTMLPolicy.createHTML('<img src=x onerror=alert(1)>');
console.log(escaped instanceof TrustedHTML);  // true
el.innerHTML = escaped;  // '<img src=x onerror=alert(1)>'
```

{% Aside %}
`trustedTypes.createPolicy()`として`createHTML()`渡されるJavaScript関数は文字列を返しますが、 `createPolicy()`は、戻り値を正しい型（この場合は`TrustedHTML` ）でラップするポリシーオブジェクトを返します。 {% endAside %}

#### デフォルトのポリシーを使用する

問題のあるコードを変更できない場合があります。たとえば、これは、CDNからサードパーティのライブラリをロードする場合に当てはまります。その場合は、 [デフォルトのポリシーを](https://w3c.github.io/webappsec-trusted-types/dist/spec/#default-policy-hdr)使用してください。

```javascript
if (window.trustedTypes && trustedTypes.createPolicy) { // Feature testing
  trustedTypes.createPolicy('default', {
    createHTML: (string, sink) => DOMPurify.sanitize(string, {RETURN_TRUSTED_TYPE: true})
  });
}
```

信頼できるタイプのみを受け入れるシンクで文字列が使用される場合は常に、 `default`の名前のポリシーが使用されます。 {% Aside 'gotchas' %}デフォルトのポリシーは慎重に使用し、代わりに通常のポリシーを使用するようにアプリケーションをリファクタリングすることをお勧めします。そうすることで、セキュリティルールが処理するデータに近く、値を正しくサニタイズするためのコンテキストが最も多い設計が促進されます。 {% endAside %}

### コンテンツセキュリティポリシーの実施に切り替える

アプリケーションで違反が発生しなくなったら、信頼できるタイプの適用を開始できます。

```text
Content-Security-Policy: require-trusted-types-for 'script'; report-uri //my-csp-endpoint.example
```

出来上がり！これで、Webアプリケーションがどれほど複雑であっても、DOM XSSの脆弱性をもたらす可能性があるのは、ポリシーの1つに含まれるコードだけです。 [ポリシーの作成を制限することで、それをさらに制限できます。](https://w3c.github.io/webappsec-trusted-types/dist/spec/#trusted-types-csp-directive)

## 参考文献

- [信頼できるタイプGitHub](https://github.com/w3c/webappsec-trusted-types)
- [W3C仕様ドラフト](https://w3c.github.io/webappsec-trusted-types/dist/spec/)
- [よくある質問](https://github.com/w3c/webappsec-trusted-types/wiki/FAQ)
- [統合](https://github.com/w3c/webappsec-trusted-types/wiki/Integrations)
