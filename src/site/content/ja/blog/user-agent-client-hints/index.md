---
title: User-Agent Client Hints によるユーザーのプライバシーと開発者体験の改善
subhead: User-Agent Client Hints は Client Hints API に新しく追加された拡張機能であり、プライバシーの保護が担保された、人間工学に基づいた方法を通して開発者がユーザーの使用ブラウザーに関する情報にアクセスできるようにします。
authors:
  - rowan_m
  - yoavweiss
date: 2020-06-25
updated: 2021-02-12
hero: image/admin/xlg4t3uiTp0L5TBThFHQ.jpg
thumbnail: image/admin/hgxRNa56Vb9o3QRwIrm9.jpg
alt: 誰がそこにいたのかを特定するヒントになる、雪の上に残された様々な種類の足跡。
tags:
  - blog
  - privacy
  - security
feedback:
  - api
---

{% YouTube 'f0YY0o2OAKA' %}

Client Hints を使用することにより、開発者はユーザーの使用デバイスや使用条件に関する情報を User-Agent (UA) 文字列から解析するのではなく、積極的にリクエストすることができるようになります。この代替手法の提供は、最終的に User-Agent 文字列の粒度を低下させるための第一歩となります。

User-Agent 文字列の解析に依存している既存の機能を更新し、その代替手法として User-Agent Client Hints を使用する方法について説明します。

{% Banner 'caution', 'body' %}すでに User-Agent Client Hints をご利用の場合には、今後の変更にご注意ください。ヘッダーのフォーマットは変更され、`Accept-CH` トークンが返されるヘッダーに正確に一致するようになります。これまでサイトは `Sec-CH-UA-Platform` ヘッダーを受信するために `Accept-CH: UA-Platform` を送信していましたが、現在は `Accept-CH: Sec-CH-UA-Platform` を送信する必要があります。すでに User-Agent Client Hints を実装している場合には、この変更内容が安定版の Chromium で完全にロールアウトされるまでは、両方のフォーマットを送信するようにしてください。詳細については、「[削除の意図: User-Agent Client Hint ACCEPT-CH トークンの名前の変更](https://groups.google.com/a/chromium.org/g/blink-dev/c/t-S9nnos9qU/m/pUFJb00jBAAJ)」を参照してください。{% endBanner %}

## 背景

Web ブラウザーがリクエストを行う場合、そのリクエストにはブラウザーとその環境に関する情報が含まれています。これを基にサーバーは分析を行い、レスポンスをカスタマイズすることができるようになります。この仕組みは 1996 年に定義されたもので (RFC 1945 for HTTP/1.0)、その中には [User-Agent 文字列の初期の定義](https://tools.ietf.org/html/rfc1945#section-10.15)が含まれています。そこには、次のような例が記載されています。

```text
User-Agent: CERN-LineMode/2.15 libwww/2.17b3
```

このヘッダーは、製品 (例: ブラウザーやライブラリ) とコメント (例: バージョン) を重要度が高い順に指定することを目的としています。

### User-Agent 文字列の状態

この文字列は、過去*数十年*に渡ってリクエストを実行するクライアントに関する様々な追加情報を蓄積してきました (下位互換性を担保するために粗悪な情報も含まれています)。Chrome の現在の User-Agent 文字列を見てみると、それがよく分かります。

```text
Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4076.0 Mobile Safari/537.36
```

上記の文字列には、ユーザーの OS とバージョン、デバイスのモデル、ブラウザーのブランドと完全なバージョン表記など、使用するブラウザーがモバイル ブラウザーであることを推測するために十分な情報が含まれており、また、歴史的な理由から他のブラウザーの参照情報も含まれています。

これらのパラメーターと利用可能な値の多彩な組み合わせは、User-Agent 文字列が個々のユーザーを一意に識別できるほどの情報を持っていることを意味します。自分のブラウザーを [AmIUnique](https://amiunique.org/) でテストしてみると、**ご利用の** User-Agent 文字列が**あなた**をどの程度正確に識別しているのかが分かります。結果的に得られる "類似度" が低ければ低いほど、あなたのリクエストがユニークであり、サーバーが密かにあなたを追跡することが容易になっていることを意味しています。

User-Agent 文字列は、数多くの合法的な[ユース ケース](https://github.com/WICG/ua-client-hints/blob/main/README.md#use-cases)を実現可能にし、開発者やサイトの所有者にとって重要な目的を果たしています。しかしながら、秘密の追跡手法からユーザーのプライバシーを保護することも重要であり、UA 情報をデフォルトで送信する仕様はその目標に反することになります。

また、User-Agent 文字列に関しては、Web での互換性を高めていく必要性も残されています。User-Agent 文字列は構造化が成されていないため、その解析には無駄な複雑性が伴い、それがバグやサイトの互換性に関する問題の原因となっています。その結果として、ユーザーに対する不利益が生じているケースも多く見られています。こういった問題は、比較的マイナーなブラウザーを使用しているユーザーに対し、サイト側でそういった構成に対するテストを行うことができない可能性があるために偏って不利益を生じさせてしまいます。

## 新しい User-Agent Client Hints のご紹介

[User-Agent Client Hints](https://github.com/WICG/ua-client-hints#explainer-reducing-user-agent-granularity) は、同一の情報へのアクセスを実現しながらも、プライバシーをより安全に保護することができる方法であり、ブラウザーは最終的に User-Agent 文字列のすべてのブロードキャストの既定値を削減することができるようになります。[Client Hints](https://tools.ietf.org/html/draft-ietf-httpbis-client-hints) は、サーバーがブラウザーにクライアントに関する一連のデータ (ヒント) をリクエストし、ブラウザーが独自のポリシーやユーザー構成を適用して返されるデータを決定するようなモデルを強制します。つまり、**すべて**の User-Agent 情報をデフォルトで公開するのではなく、明示的かつ監査可能な方法でアクセスが管理されるようになったのです。また、開発者にとっても API がシンプルになる (正規表現を使用する必要がなくなるなど) というメリットがあります。

現在の Client Hints には、主にブラウザーの表示や接続に関連する機能の情報が記載されています。詳細については「[Client Hints によるリソース選択の自動化](https://developers.google.com/web/updates/2015/09/automating-resource-selection-with-client-hints)」でご確認いただくことが可能ですが、ここでもこの手順について簡単にご説明させていただきます。

サーバーは、ヘッダーを介して特定の Client Hint をリクエストします。

⬇️*サーバーからのレスポンス*

```text
Accept-CH: Viewport-Width, Width
```

また、メタ タグは次のようになります。

```html
<meta http-equiv="Accept-CH" content="Viewport-Width, Width" />
```

ブラウザーは、後続するリクエストで次のヘッダーを送り返す選択をすることができるようになります。

⬆️*後続するリクエスト*

```text
Viewport-Width: 460
Width: 230
```

サーバーは、たとえば適切な解像度の画像の提供など、レスポンスの内容を変化させることができるようになります。

{% Aside %}初回のリクエストでの Client Hints の有効化については継続的な議論が行われていますが、この方法を選択する前に[レスポンシブ デザイン](/responsive-web-design-basics)やプログレッシブ エンハンスメントなどの方法を検討する必要があります。{% endAside %}

User-Agent Client Hints は、`Accept-CH` サーバー レスポンス ヘッダーを介して指定可能な `Sec-CH-UA` プレフィックスを使用してプロパティの範囲を拡張することができます。詳細については、「[説明書](https://github.com/WICG/ua-client-hints/blob/main/README.md)」から学習を開始し、「[提案の詳細](https://wicg.github.io/ua-client-hints/)」を参照して理解を深めてください。

{% Aside %}Client Hints は**安全な接続を介してのみ送信が可能**となるため、[サイトの HTTPS への移行](/why-https-matters)が完了していることをご確認ください。{% endAside %}

新しいヒントは Chromium 84 より利用可能となっています。それでは、その仕組みを見てみましょう。

## Chromium 84 以降の User-Agent Client Hints

User-Agent Client Hints は、[互換性の問題](https://bugs.chromium.org/p/chromium/issues/detail?id=1091285)が解決されるとともに Chrome の安定版において徐々に有効化されていきます。テストを実施するために機能を強制的にオンにするには、以下に従ってください。

- Chrome 84 の**ベータ版**または同等のものを使用する。
- `about://flags/#enable-experimental-web-platform-features` フラグを有効にする。

デフォルトでは、ブラウザーのブランド、重要なバージョン/メジャー バージョン、クライアントがモバイル デバイスであるかどうかを示すインジケーターが返されます。

⬆️*すべてのリクエスト*

```text
Sec-CH-UA: "Chromium";v="84", "Google Chrome";v="84"
Sec-CH-UA-Mobile: ?0
```

{% Aside 'caution' %}これらのプロパティは単一の値に比べてより複雑であるため、リストやブール値の表現については[構造化されたヘッダー](https://httpwg.org/http-extensions/draft-ietf-httpbis-header-structure.html)が使用されています。{% endAside %}

### User-Agent レスポンスとリクエスト ヘッダー

<style>
.w-table-wrapper th:nth-of-type(1), .w-table-wrapper th:nth-of-type(2) {
    width: 28ch;
}

.w-table-wrapper td {
  padding: 4px 8px 4px 0;
}
</style>

⬇️レスポンスの `Accept-CH`<br>⬆️リクエスト ヘッダー | ⬆️リクエスト<br>値の例 | 説明
--- | --- | ---
`Sec-CH-UA` | `"Chromium";v="84",`<br>`"Google Chrome";v="84"` | ブラウザーのブランドと、その重要なバージョンのリスト。
`Sec-CH-UA-Mobile` | `?1` | ブラウザーがモバイル デバイス上で実行されているか (true の場合: `?1`)、またはそうでないか (false の場合: `?0`) を示すブール値。
`Sec-CH-UA-Full-Version` | `"84.0.4143.2"` | ブラウザの完全版。
`Sec-CH-UA-Platform` | `"Android"` | デバイスのプラットフォーム (通常はオペレーティング システム (OS) を表示)。
`Sec-CH-UA-Platform-Version` | `"10"` | プラットフォームまたは OS のバージョン。
`Sec-CH-UA-Arch` | `"arm"` | デバイスの基礎的なアーキテクチャ。ページの表示には関係がない可能性もありますが、サイトで正確なフォーマットをデフォルトでダウンロードできるようにすることが必要になる可能性もあります。
`Sec-CH-UA-Model` | `"Pixel 3"` | デバイスのモデル。

{% Aside 'gotchas' %}プライバシーや互換性を考慮し、値を空白にしたり、返さなかったり、さまざまに変化する値とともに追加されたりする場合があります。これは、[GREASE](https://wicg.github.io/ua-client-hints/#grease) と呼ばれています。{% endAside %}

### やり取りの例

やり取りの例は、次のようになります。

⬆️*ブラウザーからの初回リクエスト*<br>ブラウザーはサイトに `/downloads` ページをリクエストしており、デフォルトの基本的な User-Agent を送信します。

```text
GET /downloads HTTP/1.1
Host: example.site

Sec-CH-UA: "Chromium";v="84", "Google Chrome";v="84"
Sec-CH-UA-Mobile: ?0
```

⬇️*サーバーからのレスポンス*<br>サーバーはページを送り返し、さらにブラウザーの完全なバージョン表記とプラットフォームをリクエストします。

```text
HTTP/1.1 200 OK
Accept-CH: Sec-CH-UA-Full-Version, Sec-CH-UA-Platform
```

⬆️*後続するリクエスト*<br>ブラウザーはサーバーに追加情報へのアクセスを許可し、その後のすべてのレスポンスで追加のヒントを送り返します。

```text
GET /downloads/app1 HTTP/1.1
Host: example.site

Sec-CH-UA: "Chromium";v="84", "Google Chrome";v="84"
Sec-CH-UA-Mobile: ?0
Sec-CH-UA-Full-Version: "84.0.4143.2"
Sec-CH-UA-Platform: "Android"
```

### JavaScript API

ヘッダーを利用する方法以外にも、JavaScript の `navigator.userAgentData` を使用して User-Agent にアクセスすることも可能です。デフォルトの `Sec-CH-UA` ヘッダーおよび `Sec-CH-UA-Mobile` ヘッダーの情報には、以下のようにそれぞれ `brands` および `mobile` プロパティを介してアクセスすることができます。

```js
// ブランド データを出力
console.log(navigator.userAgentData.brands);

// 出力内容
[
  {
    brand: 'Chromium',
    version: '84',
  },
  {
    brand: 'Google Chrome',
    version: '84',
  },
];

// モバイル インジケーターを出力
console.log(navigator.userAgentData.mobile);

// 出力内容
false;
```

追加の値には、`getHighEntropyValues()` 呼び出しを介してアクセスすることができます。"High Entropy" (高エントロピー) という用語は[情報エントロピー](https://en.wikipedia.org/wiki/Entropy_(information_theory))にちなんでおり、言い換えるならば、これらの値がユーザーのブラウザーに関する情報をどの程度明らかにできるかという観点から見た情報量のことを意味しています。追加ヘッダーのリクエストと同様に、(返す値がある場合に) どのような値が返されるかはブラウザー次第です。

```js
// 完全な User-Agent データを出力
navigator
  .userAgentData.getHighEntropyValues(
    ["architecture", "model", "platform", "platformVersion",
     "uaFullVersion"])
  .then(ua => { console.log(ua) });

// 出力内容
{
  "architecture": "x86",
  "model": "",
  "platform": "Linux",
  "platformVersion": "",
  "uaFullVersion": "84.0.4143.2"
}
```

### デモ

「[user-agent-client-hints.glitch.me](https://user-agent-client-hints.glitch.me)」では、ヘッダーと JavaScript API の両方をご自身のデバイスで試してみることができます。

{% Aside %}Chrome 84 のベータ版または同等のブラウザーを使用しており、`about://flags/#enable-experimental-web-platform-features` が有効になっていることをご確認ください。{% endAside %}

### ヒントの存続期間とリセット

`Accept-CH` ヘッダーを介して指定されたヒントは、ブラウザーのセッションの継続期間中、または別のヒントが指定されるまでの間送信されます。

つまり、サーバーが送信を行うと、次のようになります。

⬇️*レスポンス*

```text
Accept-CH: Sec-CH-UA-Full-Version
```

その後ブラウザーは、ブラウザーを閉じるまでの間、そのサイトに対するすべてのリクエストで `Sec-CH-UA-Full-Version` ヘッダーを送信します。

⬆️*後続するリクエスト*

```text
Sec-CH-UA-Full-Version: "84.0.4143.2"
```

しかしながら、別の `Accept-CH` ヘッダーを受信した場合には、ブラウザーが送信している現在のヒントを**完全に置き換えます**。

⬇️*レスポンス*

```text
Accept-CH: Sec-CH-UA-Platform
```

⬆️*後続するリクエスト*

```text
Sec-CH-UA-Platform: "Android"
```

前にリクエストされた `Sec-CH-UA-Full-Version` は、**送信されません**。

`Accept-CH` ヘッダーがこのページに必要なヒントの完全なセットを指定しているものとして考えるのがよいでしょう。つまり、次にブラウザーはそのページのすべてのサブリソースについて指定されたヒントを送信することを意味します。ヒントは次のナビゲーションまで持続しますが、サイトはそれが送信されるものとして想定してはいけません。

{% Aside 'success' %}この情報がなかったとしても有意義なユーザー エクスペリエンスを提供できるよう、常に準備するようにしてください。この情報はユーザー エクスペリエンスを向上させるために存在するものであり、定義するものではありません。それゆえに、"回答" や "要求" ではなく "ヒント" と呼ばれているのです。{% endAside %}

また、レスポンスで空白の `Accept-CH` を送信することにより、ブラウザーから送信されるすべてのヒントを効果的に消去する方法にこれを利用することもできます。ユーザーが設定をリセットしたり、サイトからサインアウトしたりする必要がある場合には、この手法の採用をご検討ください。

このパターンは、`<meta http-equiv="Accept-CH" …>` タグを介したヒントの動作にも一致します。リクエストされたヒントはそのページで開始されたリクエストでのみ送信され、後続するナビゲーションでは送信されません。

### ヒントの範囲とクロスオリジン リクエスト

デフォルトでは、Client Hints は同一オリジン リクエストでのみ送信されます。つまり、`https://example.com` が特定のヒントをリクエストしたとしても、最適化を実施するリソースが `https://downloads.example.com` にある場合には、ヒントを受信することは**できません**。

クロスオリジン リクエストでヒントを許可するためには、それぞれのヒントとオリジンを `Feature-Policy` ヘッダーで指定する必要があります。これを User-Agent Client Hints に適用するには、ヒントを小文字にし、`sec-` プレフィックスを削除する必要があります。たとえば、次のようになります。

⬇️*`example.com`からのレスポンス*

```text
Accept-CH: Sec-CH-UA-Platform, DPR
Feature-Policy: ch-ua-platform downloads.example.com;
                ch-dpr cdn.provider img.example.com
```

⬆️*`downloads.example.com`へのリクエスト*

```text
Sec-CH-UA-Platform: "Android"
```

⬆️*`cdn.provider` または `img.example.com`へのリクエスト*

```text
DPR: 2
```

## User-Agent Client Hints を使用する場所

簡単に説明をすると、User-Agent ヘッダーを解析したり、同じ情報にアクセスする JavaScript 呼び出し (例: `navigator.userAgent`、`navigator.appVersion`、`navigator.platform`) のいずれかを使用したりしている任意のインスタンスをリファクタリングし、代わりに User-Agent Client Hints を使用する必要があります。

さらに一歩進む場合には、User-Agent 情報の使用そのものを再検討し、可能な限り別の方法で置き換えていく必要があります。多くの場合、プログレッシブ エンハンスメント、機能検出、[レスポンシブ デザイン](/responsive-web-design-basics)を利用することによって同じ目的を達成することが可能です。User-Agent データに依存する場合に考えられる基本的な問題としては、検査対象のプロパティと、そのプロパティが可能にする動作との間のマッピングを常に維持しなければいけなくなるという点が挙げられます。これは、包括的に検出を行い、最新の状態を維持するためにメンテナンスに関連するオーバーヘッドが生じてしまうことを意味します。

これらの注意点を踏まえた上で、User-Agent Client Hints のリポジトリではサイトでの利用に役立つ「[ユース ケース](https://github.com/WICG/ua-client-hints#use-cases)」をいくつか紹介しています。

## User-Agent 文字列はどう変化しますか？

この計画は、既存のサイトに過度の混乱をもたらさないようにしながら、既存の User-Agent 文字列が公開する識別情報の量を削減することにより、Web 上で秘密の追跡が行われる可能性を最小限に抑えることを目的としています。User-Agent Client Hints を現段階で導入しておけば、User-Agent 文字列に変更が加えられる前に新しい機能について理解を深めたり、実験を行ったりすることが可能になります。

[最終的には](https://groups.google.com/a/chromium.org/d/msg/blink-dev/-2JIRNMWJ7s/u-YzXjZ8BAAJ)、User-Agent 文字列の情報は削減され、従来の形式を維持しながらデフォルトのヒントと同一の高レベルのブラウザー情報および重要なバージョン情報のみが提供されるようになります。Chromium では、新しい User Agent Client Hints の機能をエコシステムが十分に評価するための期間を確保するために、この変更の実施は少なくとも 2021 年にまで延期されています。

Chrome 93 の `about://flags/#reduce-user-agent` フラグを有効にすることで、このバージョンの User-Agent 文字列をテストすることができます (注: このフラグは、Chrome 84 から 92 のバージョンでは `about://flags/#freeze-user-agent` という名前でした)。このバージョンでは互換性の理由から過去のエントリを含む文字列が返されますが、詳細部分はサニタイズされています。たとえば、次のようになっています。

```text
Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.0.0 Mobile Safari/537.36
```

*写真の提供: [Unsplash](https://unsplash.com/photos/m9qMoh-scfE?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) の [Sergey Zolkin](https://unsplash.com/@szolkin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)*
