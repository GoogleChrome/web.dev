---
title: トラストトークンの使用を開始する
subhead: Trust Tokensは、Webサイトが指定の量の情報を持つ閲覧コンテキストから別のブラウジングコンテキストに（たとえば、サイト間で）伝達できる新規APIであり、受動的な追跡なしで不正行為と戦うのに役立ちます。
authors:
  - samdutton
date: 2020-06-22
updated: 2021-12-10
hero: image/admin/okxi2ttRG3h1Z4F3cylI.jpg
thumbnail: image/admin/cTo0l2opcfNxg1TEjxSg.jpg
alt: トークンを持っている手の白黒写真
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% Aside  'caution' %} **⚠️警告：アプリの更新が必要になります。**

**TrustTokenV3は、ChromiumのTrustTokens実装**に対する下位互換性のない変更のコレクションです。変更はChrome92に到着し、2021年7月末にChromeStableに到達しました。

まだ行っていない場合は、[APIをテスト](https://www.chromestatus.com/feature/5078049450098688)する既存のアプリケーションを更新する必要があります。

詳細： [TrustTokenV3とは何ですか？](https://bit.ly/what-is-trusttokenv3)にご覧ください {% endAside %}

<br><br>

{% YouTube id='bXB1Iwq6Eq4' %}

## 概要

Trust tokenで、オリジンは信頼を持つユーザーに暗号トークンを発行できます。トークンはユーザーのブラウザによって保存されます。その後、ブラウザは他のコンテキストでトークンを使用して、ユーザーの信頼性を評価できます。

Trust Token APIを使用すると、ユーザーを識別したり、2つのIDをリンクしたりせずに、あるコンテキストでのユーザーの信頼を別のコンテキストに伝達できます。

[デモ](https://trust-token-demo.glitch.me)でAPIを試して、ChromeDevToolsの**ネットワーク**タブと**アプリケーション**タブで[トークンを調べることができます。](https://developers.google.com/web/updates/2021/01/devtools#trust-token)

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/krrI292OLd6awb4dxkN0.jpg", alt="Chrome DevToolsネットワークタブの信頼トークンを表示するスクリーンショット.", width="800", height="584" %} <figcaption>ChromeDevToolsの<b>ネットワーク</b>タブの信頼トークンNetwork tab.</figcaption></figure>

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/cwR9JdoVo1M4VDovP2oM.jpg", alt="Chrome DevToolsアプリケーションタブにTrust Tokenを表示するスクリーンショット.", width="800", height="584" %} <figcaption>ChromeDevTools<b>アプリケーション</b>のタブのTrust Token</figcaption></figure>

{% Aside %}プライバシーサンドボックスは、サードパーティのCookieや他の追跡メカニズムを使用せずにサードパーティのユースケースを満たすための一連の提案です。すべての提案の概要については[、プライバシーサンドボックス](/digging-into-the-privacy-sandbox)を掘り下げるを参照してください。

**この提案にはフィードバックが必要です。**コメントがある場合は、 [TrustToken説明](https://github.com/WICG/trust-token-api)リポジトリに[問題を挙げてください。](https://github.com/WICG/trust-token-api/issues/new) {% endAside %}

## なぜTrust Tokenが必要なのですか？

Webには、ユーザーが本人であり、人間になりすましたボットや、実際の人やサービスをだましている悪意のあるサードパーティではないことを示す信頼信号を確立する方法が必要です。不正防止は、広告主、広告プロバイダー、およびCDNにとって特に重要です。

残念ながら、信頼性を測定して伝達するための既存のメカニズムは、たとえば、サイトとのやり取りが本当の人間によるものかどうかを判断するために、フィンガープリントの手法を利用しています。

{% Aside 'key-term' %}**フィンガープリントを**使用すると、サイトは、デバイス、オペレーティングシステム、ブラウザの設定（言語設定、[ユーザーエージェント](https://developer.mozilla.org/docs/Web/API/NavigatorID/userAgent)、使用可能なフォントなど）やデバイスの状態の変化に関するデータを取得することで、個々のユーザーを識別および追跡できます。これは、サーバー上でリクエストヘッダーをチェックするか、クライアント上でJavaScriptを使用して実行できます。

フィンガープリントは、ユーザーが認識しておらず、制御できないメカニズムを使用します。 [Panopticlick](https://panopticlick.eff.org/)や[amiunique.org](https://amiunique.org/)などのサイトでは、指紋データを組み合わせて個人を識別する方法を示しています。 {% endAside %}

APIはプライバシーを保護し、個人のユーザーを追跡することなしで信頼性がサイト間で伝播できるようにする必要があります。

## トラストトークンの提案には何が含まれていますか？

Webには、詐欺やスパムを検出するために信頼信号を構築することが重要です。これを行うには、グローバルなクロスサイトのユーザーごとの識別子を使用してブラウジングを追跡することです。プライバシーを保護するAPIの場合、これは受け入れられません。

提案[**説明者**](https://github.com/WICG/trust-token-api#overview)から：

<blockquote>
<p>このAPIは、サードパーティのコンテキストでアクセス可能な「プライバシーパス」スタイルの暗号化トークン用の新しいオリジンごとのストレージ領域を提案します。これらのトークンは個人化されておらず、ユーザーの追跡には使用できないが、暗号化されているため、偽造することはできません。</p>
<p>オリジンがユーザーを信頼するコンテキストにある場合、ユーザーが不明または信頼性が低いコンテキストで次回で「使用される」可能のトークンのバッチをブラウザーに発行できます。トークンが互いに区別できないため、Webサイトがトークンを介してユーザーを追跡できないことは重要になります。</p>
<p>さらに、特定のトークン償還にバインドされたキーを使用して送信リクエストに署名するためのブラウザの拡張メカニズムを提案します。</p>
</blockquote>

## サンプルAPIの使用法

以下は、API Explainerの[サンプルコードを基にしています](https://github.com/WICG/trust-token-api#sample-api-usage)。

{% Aside %}この投稿のコードは、Chrome88以降で利用可能な更新された構文を使用しています。{% endAside %}

ユーザーがサードパーティの広告ネットワーク(`foo.example`)からの広告を埋め込んだニュースWebサイト(`publisher.example`)を想像してください。ユーザーは以前、trust tokenを発行するソーシャルメディアサイト(`issuer.example`)を使用しました。

以下のシーケンスは、trust tokenがどのように機能するかを示しています。

**1.**ユーザーは`issuer.example` に訪問し、アカウントアクティビティや、CAPTCHAチャレンジの通過など、自分が本物の人間であるとサイトに信じ込ませるアクションを実行します。

**2.** `issuer.example`は、ユーザーが人間であるかを確認し、次のJavaScriptを実行して、ユーザーのブラウザーにtrust tokenを発行します。

```js
fetch('https://issuer.example/trust-token', {
  trustToken: {
    type: 'token-request',
    issuer: 'https://issuer.example'
  }
}).then(...)
```

**3.**ユーザーのブラウザはtrust tokenを保存し、 `issuer.example`に関係付けます。

**4.**しばらくして、ユーザーは`publisher.example`にアクセスします。

**5.** `publisher.example`はユーザーが本物の人間であるかどうかを確認したいです。 `publisher.example`は`issuer.example`を信じるため、ユーザーのブラウザがその原点から有効なトークンを持っていることをチェックします：

```js
document.hasTrustToken('https://issuer.example');
```

**6.** `true`に解決されるpromiseを返すなら、それが`issuer.example`からのトークンを持っていると意味するので、`publisher.example`はトークンの引き換えを試みることができます。

```js
fetch('https://issuer.example/trust-token', {
trustToken: {
  type: 'token-redemption',
  issuer: 'https://issuer.example',
  refreshPolicy: {none, refresh}
}
}).then(...)
```

上記のコードで：

1. 償還者`publisher.example`は償還を要求します。
2. 引き換えが成功すると、発行者`issuer.example`は、ある時点でこのブラウザーに有効なトークンを発行したことを示す引き換えレコードを返します。

**7.** `fetch()`によって返されたpromiseが解決されると、引き換えレコードは後続のリソースリクエストで使用できます。

```js
fetch('https://foo.example/get-content', {
  trustToken: {
    type: 'send-redemption-record',
    issuers: ['https://issuer.example', ...]
  }
});
```

上記のコードで：

1. 償還レコードは、リクエストheader `Sec-Redemption-Record`として含まれています。
2. `foo.example`は償還レコードを受け取り、レコードを解析して、 `issuer.example`がこのユーザーを人間であると見なしたかどうかを判断できます。
3. `foo.example`はそれに応じて応答します。

{% Details %} {% DetailsSummary %} Webサイトは、あなたを信頼するかどうかをどのように判断できますか？ {% endDetailsSummary %} eコマースサイトでのショッピング履歴、ロケーションプラットフォームでのチェックイン、または銀行でのアカウント履歴を持っているようです。発行者は、あなたがアカウントを持っている期間や、あなたが本物の人間である可能性に対する信頼を高める他の相互作用（CAPTCHAやフォーム送信など）などの他の要因も調べる場合もあります。 {% endDetails %}

### トラストトークンの発行

ユーザーが`issuer.example`などのtrust token発行者によって信頼できると見なされた場合、 `trustToken`パラメーターと`fetch()`リクエストを行うことにより、ユーザーのtrust tokenを取得できます。

```js
fetch('issuer.example/trust-token', {
  trustToken: {
    type: 'token-request'
  }
}).then(...)
```

これにより、[新しい暗号化プリミティブ](https://privacypass.github.io/)を使用して[プライバシーパス](https://eprint.iacr.org/2020/072.pdf)発行プロトコルの拡張が呼び出されます。

1. *nonces*呼ばれる疑似乱数のセットを生成します。

2. nonces をブラインドし（発行者がコンテンツを表示できないようにエンコードし）、 `Sec-Trust-Token`ヘッダーでリクエストに添付します。

3. 提供されたエンドポイントにPOSTリクエストを送信します。

エンドポイントは[ブラインドトークン](https://en.wikipedia.org/wiki/Blind_signature)（ブラインドナンスの署名）で応答し、トークンはブラインド解除され、ブラウザーによってtrust tokenとして関連するナンスと一緒に内部に保存されます。

### trust tokenの償還

パブリッシャーサイト（ `publisher.example`など）は、ユーザーが使用できる信頼トークンがあるかどうかを確認できます。

```js
const userHasTokens = await document.hasTrustToken('issuer.example/trust-token');
```

利用可能なトークンがある場合、発行者サイトはそれらを引き換えて、引き換えレコードを取得できます。

```js
fetch('issuer.example/trust-token', {
  ...
  trustToken: {
    type: 'token-redemption',
    refreshPolicy: 'none'
  }
  ...
}).then(...)
```

サイト運営者は、次のような`fetch()`呼出により、コメントの投稿、ページのいいね、投票への投票など、信頼トークンを必要とするリクエストに償還レコードを含めることができます。

```js
fetch('https://foo.example/post-comment', {
  ...
  trustToken: {
    type: 'send-redemption-record',
    issuers: ['issuer.example/trust-token', ...]
  }
  ...
}).then(...);
```

`Sec-Redemption-Record`リクエストheaderとして含まれています。

{% Aside %}Trust tokenには、Fetch、XHR、およびHTML `<iframe>`要素のオプションを介してのみアクセスできます。<br>直接アクセスすることはできません。 {% endAside%}

### プライバシーに関する考慮事項

トークンは「紐付け不可」の形で設計されています。発行者は、ユーザーがアクセスするサイトに関する集約情報を入手できるが、発行と償還を関連付けることはできません。ユーザーがトークンを償還するとき、発行者は、作成済みのトークンと区別することはできません。ただし、現在、trust tokenは空白の状態では存在しません。サードパーティのCookieや秘密の追跡技術など、発行者が現在（理論的には）サイト間でユーザーのIDを結合できる方法は他にもあります。サイトがサポートを計画する際には、このエコシステムの移行を理解することが重要です。これは、多くのプライバシーサンドボックスAPIの移行の一般的な側面であるため、ここではこれ以上説明しません。

### セキュリティに関する考慮事項

**Trust tokenの消耗：** 悪意のあるサイトは、特定の発行者からのユーザーのトークンの供給を故意に消耗させる可能性があります。この攻撃には、発行者が一度に多くのトークンを提供できるようにするなど、いくつかの緩和策があります。そのため、ユーザーは、ブラウザがトップレベルのページビューごとに1つのトークンを引き換えることを保証する十分な供給があります。

**二重利用の防止：** マルウェアは、ユーザーのすべてのtrust tokenにアクセスしする意図を持ちます。ただし、すべての償還は同じトークン発行者に送信されるため、トークンは時間の経過とともに使い果たされます。これにより、各トークンが1回だけ使用されていることを確認できます。リスクを軽減するために、発行者はより少量のトークンに署名することもできます。

### リクエストメカニズム

たとえば、ナビゲーションリクエスト`fetch()`外部で償還レコードを送信できる場合があります。サイトは、HTTP応答headerに発行者データを含めて、ページの読み込みと並行してトークンの引き換えを有効にできる場合があります。

**繰り返しになりますが、この提案にはあなたのフィードバックが必要です。** コメントがある場合は、TrustToken[説明リポジトリに](https://github.com/WICG/trust-token-api)[問題を挙げ](https://github.com/WICG/trust-token-api/issues/new)てください。

## 詳細をご覧ください

- [Trust Tokenのデモ](https://trust-token-demo.glitch.me)
- [Chromeのオリジントライアルを始める](https://developer.chrome.com/blog/origin-trials/)
- [プライバシーサンドボックスを掘り下げる](/digging-into-the-privacy-sandbox/)
- [Trust Token APIExplainer](https://github.com/WICG/trust-token-api)
- [Chromiumプロジェクト：Trust Token API](https://sites.google.com/a/chromium.org/dev/updates/trust-token)
- [実装の意図：Trust TokenAPI](https://groups.google.com/a/chromium.org/g/blink-dev/c/X9sF2uLe9rA/m/1xV5KEn2DgAJ)
- [Chromeプラットフォームのステータス](https://www.chromestatus.com/feature/5078049450098688)
- [プライバシーパス](https://privacypass.github.io/)
- [プライバシーパスの拡張](https://eprint.iacr.org/2020/072.pdf)

---

この投稿の作成とレビューに協力して頂いた皆様にご感謝いたします。

写真は[ZSun Fu](https://unsplash.com/photos/b4D7FKAghoE)に撮影され、[Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)にアップロードされました。
