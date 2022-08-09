---
layout: post
title: クロスオリジンアイソレーションを有効にするためのガイド
authors:
  - agektmr
date: 2021-02-09
updated: 2021-08-05
subhead: クロスオリジンアイソレーションを使用すると、ウェブページで SharedArrayBuffer のような強力な機能を使用できるようになります。この記事では、ウェブサイトでクロスオリジンアイソレーションを有効にする方法について説明します。
description: クロスオリジンアイソレーションを使用すると、ウェブページで SharedArrayBuffer のような強力な機能を使用できるようになります。この記事では、ウェブサイトでクロスオリジンアイソレーションを有効にする方法について説明します。
tags:
  - security
---

このガイドでは、Cross-Origin Isolation (クロスオリジンアイソレーション) を有効にする方法を説明します。クロスオリジンアイソレーションは、[`SharedArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) や [`performance.measureUserAgentSpecificMemory()`](/monitor-total-page-memory-usage/)、[高精度の高解像度タイマー](https://developer.chrome.com/blog/cross-origin-isolated-hr-timers/)を使用する場合に必要となります。

クロスオリジンアイソレーションを有効にする場合は、広告の配置など、ウェブサイト上の他のクロスオリジンリソースに与える影響を評価してください。

{% Details %} {% DetailsSummary %} `SharedArrayBuffer` がウェブサイト上のどこで使用されているかを判断します。

Chrome 92 以降、`SharedArrayBuffer` を使用する機能は、クロスオリジンアイソレーションがないと動作しなくなります。`SharedArrayBuffer` が非推奨となったことを告げるメッセージを見てこのページにたどり着いたのであれば、お使いのウェブサイトまたはそのウェブサイトに埋め込まれているリソースの 1 つが `SharedArrayBuffer` を使用している可能性があります。これが非推奨となったためにウェブサイトサイトで問題が発生するということがないように、まずは使用されている場所を特定します。

{% endDetailsSummary %}

{% Aside 'objective' %}

- クロスオリジンアイソレーションを有効にして、`SharedArrayBuffer` を引き続き使用できるようにします。
- `SharedArrayBuffer` を使用するサードパーティのコードに依存している場合は、サードパーティのプロバイダーに何らかの措置を取るよう通知してください。 {% endAside %}

`SharedArrayBuffer` がサイトのどこで使用されているかわからない場合は、次の 2 つの方法で確認できます。

- ChromeDevTools を使う
- (高度) 非推奨のレポート機能を使う

`SharedArrayBuffer`を使用している場所がすでにわかっている場合は、[クロスオリジンアイソレーションの影響を分析する](#analysis)にスキップしてください。

### ChromeDevTools を使う

[Chrome DevTools](https://developer.chrome.com/docs/devtools/open/) を使用すると、開発者はウェブサイトを検査できます。

1. [SharedArrayBuffer](https://developer.chrome.com/docs/devtools/open/) を使用していると思われるページで [Chrome DevTools を開きます](https://developer.chrome.com/docs/devtools/open/)。
2. **コンソール**パネルを選択します。
3. ページに `SharedArrayBuffer` が使用されている場合は、次のメッセージが表示されます。
    ```text
    [Deprecation] SharedArrayBuffer will require cross-origin isolation as of M92, around May 2021. See https://developer.chrome.com/blog/enabling-shared-array-buffer/ for more details. common-bundle.js:535
    ```
4. メッセージの最後に記載されているファイル名と行番号 (たとえば、`common-bundle.js:535`) は、 `SharedArrayBuffer` がどこから取得されているのかを示しています。サードパーティのライブラリの場合は、開発者に連絡して問題を修正してください。ウェブサイトの一部として実装されている場合は、以下のガイドに従って、クロスオリジンアイソレーションを有効にしてください。

<figure>
  {% Img src="image/YLflGBAPWecgtKJLqCJHSzHqe2J2/GOgkyjAabePTc8AG22F7.png", alt="DevToools Console warning when SharedArrayBuffer is used without cross-origin isolation", width="800", height="163" %}
  <figcaption>DevToools Console warning when SharedArrayBuffer is used without cross-origin isolation.</figcaption>
</figure>

### (高度) 非推奨のレポート機能を使う

一部のブラウザには、[非推奨になる API を指定されたエンドポイントに報告する機能](https://wicg.github.io/deprecation-reporting/)があります。

1. [非推奨レポートサーバーをセットアップし、報告する URL を取得します](/coop-coep/#set-up-reporting-endpoint)。これは、公共のサービスを使用するか、独自に構築して行います。
2. URL を使って、`SharedArrayBuffer` を提供している可能性のあるページに次の HTTP ヘッダーを設定します。
    ```http
    Report-To: {"group":"default","max_age":86400,"endpoints":[{"url":"THE_DEPRECATION_ENDPOINT_URL"}]}
    ```
3. ヘッダーの伝播が開始されると、登録したエンドポイントが非推奨レポートの収集を開始します。

こちらの実装例を参照してください： [https://cross-origin-isolation.glitch.me](https://cross-origin-isolation.glitch.me)。

{% endDetails %}

## クロスオリジンアイソレーションの影響を分析する{：#analysis}

クロスオリジンアイソレーションを有効にすることがサイトに与える影響を何も破損せずに評価できたら非常に便利だと思いませんか？[`Cross-Origin-Opener-Policy-Report-Only`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy) および [`Cross-Origin-Embedder-Policy-Report-Only`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy) ヘッダーを使用すると、それを実際に行うことができます。

1. トップレベルドキュメントで[`Cross-Origin-Opener-Policy-Report-Only: same-origin`](/coop-coep/#1.-set-the-cross-origin-opener-policy:-same-origin-header-on-the-top-level-document) を設定します。名前から分かるように、このヘッダーは、`COOP: same-origin` がサイトに与えると**思われる**影響に関するレポートのみを送信します。ポップアップウィンドウとの通信が無効化されることはありません。
2. レポートを設定し、レポートを受信して保存するようにウェブサーバーを設定します。
3. トップレベルのドキュメントで [`Cross-Origin-Embedder-Policy-Report-Only: require-corp`](/coop-coep/#3.-use-the-coep-report-only-http-header-to-assess-embedded-resources) を設定します。ここでも、`COEP: require-corp` を有効化することのインパクトをサイトに影響を与えずに確認することができます。このヘッダーは、前のステップでセットアップした同じレポートサーバーにレポートを送信するように設定できます。

{% Aside %} Chrome DevTools の**ネットワーク**パネルの[**ドメイン**列を有効化する](https://developer.chrome.com/docs/devtools/network/#information)ことにより、影響を受けると思われるリソースの全体像を確認することもできます。{% endAside %}

{% Aside 'caution' %}

クロスオリジンアイソレーションを有効にすると、明示的にオプトインしていないクロスオリジンリソースの読み込みがブロックされ、トップレベルのドキュメントがポップアップウィンドウと通信できなくなります。

クロスオリジンアイソレーションではすべてのサブリソースを明示的にオプトインする必要があるため、`Cross-Origin-Resource-Policy` を大規模にデプロイする方法を模索してきました。そして、真逆の手段、つまり、すべてのクレデンシャルを削除することで、CORP ヘッダーなしでリソースをロードできる[新しい COEP の「クレデンシャルなし」モード](https://github.com/mikewest/credentiallessness/)を採用するというアイデアを思いつきました。どのように機能させるかについて、詳細は現在考えている最中ですが、サブリソースによって `Cross-Origin-Resource-Policy` ヘッダーが送信されることを確認する手間が軽減されることを願っています。

また、`Cross-Origin-Opener-Policy: same-origin` ヘッダーにより、OAuth や支払いなどのクロスオリジンウィンドウのインタラクションを必要とする統合が断たれてしまうことが分かっています。この問題を緩和するために、[条件を緩和](https://github.com/whatwg/html/issues/6364)して、`Cross-Origin-Opener-Policy: same-origin-allow-popups` に対するクロスオリジンアイソレーションを有効にすることを検討しています。このようにして、自らを開くウィンドウとの通信が可能になります。

クロスオリジンアイソレーションを有効にしたいが、これらの課題に先に進めない場合は、[オリジントライアルに登録](https://developer.chrome.com/blog/enabling-shared-array-buffer/#origin-trial)し、新しいモードが利用可能になるまでお待ちいただくことをお勧めします。新しいモードが利用可能になるまで、オリジントライアルを終了する予定はありません。

{% endAside %}

## クロスオリジンアイソレーションの影響を軽減する

以下は、どのリソースがクロスオリジンアイソレーションの影響を受けるのかを判断した後に、そうしたクロスオリジンリソースを実際にオプトインする際のガイドラインです。

1. 画像、スクリプト、スタイルシート、iframe などのクロスオリジンリソースに対して、[`Cross-Origin-Resource-Policy: cross-origin`](https://resourcepolicy.fyi/#cross-origin) ヘッダーを設定します。同じサイトのリソースには、[`Cross-Origin-Resource-Policy: same-site`](https://resourcepolicy.fyi/#same-origin) ヘッダーを設定します。
2. リソースが [CORS](/cross-origin-resource-sharing/) で提供される場合は、トップレベルドキュメントの HTML タグに `crossorigin` 属性を設定します (`<img src="example.jpg" crossorigin>` のようにする)。
3. iframe にロードされたクロスオリジンリソースに iframe の別のレイヤーが含まれる場合は、このセクションで説明している手順を再帰的に適用してから続行してください。
4. すべてのクロスオリジンリソースがオプトインされていることを確認したら、iframe にロードされたクロスオリジンリソースに対して `Cross-Origin-Embedder-Policy: require-corp` ヘッダーを設定します。
5. `postMessage()` 経由の通信を必要とするクロスオリジンポップアップウィンドウがないことを確認してください。クロスオリジンアイソレーションが有効になっている状態でそれらを継続的に機能させることはできません。通信をクロスオリジンアイソレーションが有効な別のドキュメントに移動したり、別の通信方法 (HTTP リクエストなど) を使用したりできます。

## クロスオリジンアイソレーションを有効にする

以下は、クロスオリジンアイソレーションによる影響を軽減した後にクロスオリジンアイソレーションを有効にするためガイドラインです。

1. トップレベルのドキュメントに `Cross-Origin-Opener-Policy: same-origin` ヘッダーを設定します。`Cross-Origin-Opener-Policy-Report-Only: same-origin` を設定している場合は、それを置き換えます。これにより、トップレベルのドキュメントとそのポップアップウィンドウとの通信がブロックされます。
2. トップレベルのドキュメントに `Cross-Origin-Embedder-Policy: require-corp` ヘッダーを設定します。`Cross-Origin-Embedder-Policy-Report-Only: require-corp` を設定している場合は、それを置き換えます。これにより、オプトインされていないクロスオリジンリソースのロードがブロックされます。
3. `self.crossOriginIsolated` が `true` を返すことを確認して、ページのクロスオリジンアイソレーションが有効であることを確認します。

{% Aside 'gotchas' %}

シンプルなサーバーはヘッダーの送信をサポートしていないため、ローカルサーバーでクロスオリジンアイソレーションを有効にするのは面倒な場合があります。コマンドラインフラグ `--enable-features=SharedArrayBuffer` を使って Chrome を起動すれば、クロスオリジンアイソレーションを有効にしなくても `SharedArrayBuffer` を有効にできます。[それぞれのプラットフォームでコマンドラインフラグを使って Chrome を起動する方法を見る。](https://www.chromium.org/developers/how-tos/run-chromium-with-flags)

{% endAside %}

## リソース

- [COOP と COEP を使用してウェブサイトのクロスオリジンアイソレーションを有効化する](/coop-coep/)
- [Android Chrome88 および DesktopChrome92 における SharedArrayBuffer の更新](https://developer.chrome.com/blog/enabling-shared-array-buffer/)
