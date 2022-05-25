---
layout: post
title: サードパーティのJavaScriptを効率的に読み込む
subhead: サードパーティのスクリプトを使用して読み込み時間とユーザーエクスペリエンスを改善するときによくある誤りを回避します。
authors:
  - mihajlija
date: 2019-08-14
description: サードパーティのスクリプトを使用して読み込み時間とユーザーエクスペリエンスを改善するときによくある誤りを回避する方法について説明します。
hero: image/admin/udp7L9LSo5mfI3F0tvNY.jpg
alt: 輸送コンテナーの航空写真。
codelabs: codelab-optimize-third-party-javascript
tags:
  - performance
  - javascript
---

サードパーティのスクリプトによってページの読み込みが[遅くなっている](/third-party-javascript/)場合は、パフォーマンスを改善するための次の2つのオプションがあります。

- そのスクリプトがサイトにとって明確な価値を付加するのでなければ、スクリプトを削除する。

- 読み込み処理を最適化する。

この投稿では、次の手法を使用してサードパーティスクリプトの読み込み処理を最適化する方法について説明します。

1. `<script>`タグで`async`または`defer`属性を使用する

2. 必要なオリジンへの早期接続を確立する

3. 遅延読み込み

4. サードパーティのスクリプトを実行する方法を最適化する

## `async`または`defer`を使用する

[同期スクリプト](/third-party-javascript/)はDOMの構築とレンダリングを遅らせるため、ページをレンダリングする前にスクリプトを実行する必要がないかぎり、サードパーティのスクリプトは常に非同期で読み込んでください。

`async`属性と`defer`属性は、バックグラウンドでスクリプトを読み込んでいるときにHTMLの解析を続行し、読み込み後にスクリプトを実行する可能性があることをブラウザーに通知します。このように、スクリプトのダウンロードはDOMの構築とページのレンダリングをブロックしません。その結果、すべてのスクリプトの読み込みが完了する前に、ページがユーザーに表示されます。

```html
<script async src="script.js">

<script defer src="script.js">
```

`async`と`defer`の違いは、スクリプトの実行を開始するタイミングです。

### `async`

`async`属性のスクリプトは、ダウンロードが完了した後、ウィンドウの[読み込み](https://developer.mozilla.org/docs/Web/Events/load)イベントの前の最初の機会に実行されます。これは、`async`スクリプトがHTMLに表示される順序で実行されない可能性がある (高い) ことを意味します。また、パーサーがまだ動作している間にダウンロードが終了すると、DOMの構築を中断される可能性があることも意味します。

{% Img src="image/admin/tCqsJ3E7m4lpKOprXu5B.png", alt="パーサーをブロックするasync属性のスクリプトの図", width="800", height="252" %}

### `defer`

`defer`属性のスクリプトは、HTML解析が完全に終了した後、[`DOMContentLoaded`](https://developer.mozilla.org/docs/Web/Events/DOMContentLoaded)イベントの前に実行されます。`defer`は、スクリプトがHTMLに表示される順序で実行され、パーサーをブロックしません。

{% Img src="image/admin/Eq0mcvDALKibHe15HspN.png", alt="defer属性のスクリプトとパーサーフローの図", width="800", height="253" %}

- 読み込みプロセスの早い段階でスクリプトを実行させることが重要な場合は、`async`使用する。

- 重要度の低いリソースでは`defer`を使用する (例: 最も重要な項目の下にある動画プレイヤー)。

これらの属性を使用すると、ページの読み込みを大幅に高速化できます。たとえば、[最近、Telegraphは広告や分析を含むすべてのスクリプトを遅延](https://medium.com/p/a0a1000be5#4123)させ、広告の読み込み時間を平均4秒改善しました。

{% Aside %}通常、分析スクリプトは早い段階で読み込まれるため、貴重な分析データを見逃すことはありません。幸い、初期のページ読み込みデータを保持しながら、[分析の初期化を遅延するパターン](https://philipwalton.com/articles/the-google-analytics-setup-i-use-on-every-site-i-build/)があります。 {% endAside %}

## 必要なオリジンへの早期接続を確立する

重要なサードパーティのオリジンへの[早期接続を確立](/preconnect-and-dns-prefetch/)することで、100〜500ミリ秒を節約できます。

ここでは、次の2つの[`<link>`](https://developer.mozilla.org/docs/Web/HTML/Element/link)タイプが役立ちます。

- `preconnect`

- `dns-prefetch`

### `preconnect`

`<link rel="preconnect">`は、ページが別のオリジンへの接続を確立する予定であり、プロセスをできるだけ早く開始することをブラウザーに通知します。事前に接続されたオリジンからのリソースの要求が行われると、ダウンロードはすぐに開始されます。

```html
<link rel="preconnect" href="https://cdn.example.com">
```

{% Aside 'caution' %}ブラウザーは10秒以内に使用されない接続をすべて閉じるため、すぐに使用する重要なドメインにのみ事前接続します。不必要な事前接続は他の重要なリソースを遅らせる可能性があるため、事前接続されたドメインの数を制限し、[事前接続の影響](https://andydavies.me/blog/2019/08/07/experimenting-with-link-rel-equals-preconnect-using-custom-script-injection-in-webpagetest/)をテストします。 {% endAside %}

### `dns-prefetch`

`<link rel="dns-prefetch>`は、`<link rel="preconnect">`によって処理される対象の小さなサブセットを処理します。接続の確立には、DNSルックアップとTCPハンドシェイクが含まれます。安全なオリジンには、TLSネゴシエーションが必要です。`dns-prefetch`は、明示的に呼び出される前に特定のドメインのDNSのみを解決するようにブラウザーに命令します。

`preconnect`ヒントは、最も重要な接続にのみ使用するのが最適です。重要度の低いサードパーティドメインの場合は、`<link rel=dns-prefetch>`を使用します。

```html
<link rel="dns-prefetch" href="http://example.com">
```

[`dns-prefetch`のブラウザーサポート](https://caniuse.com/#search=dns-prefetch)は[`preconnect`のサポート](https://caniuse.com/#search=preconnect)とは少し異なります。`dns-prefetch`は、`preconnect`をサポートしていないブラウザーのためのフォールバックとして機能します。これを安全に実装するには、次の個別のリンクタグを使用します。

```html
<link rel="preconnect" href="http://example.com">
<link rel="dns-prefetch" href="http://example.com">
```

## サードパーティリソースの遅延読み込み

埋め込まれたサードパーティのリソースは、構築が不十分な場合、ページ速度を低下させる大きな要因となる可能性があります。それらが重要ではない場合、画面の外にある場合 (つまり、ユーザーがスクロールして表示する必要がある場合)、遅延読み込みはページ速度とペイントメトリックを改善するための良い方法です。このようにして、ユーザーはメインページのコンテンツをより速く取得し、より良いエクスペリエンスを得ることができます。

<figure data-float="left">{% Img src="image/admin/uzPZzkgzfrv2Oy3UQPrN.png", alt="モバイルデバイスに表示されるWebページの図で、スクロール可能なコンテンツが画面外に展開しています。スクロール可能なコンテンツがまだ読み込まれていないため、画面外のコンテンツの彩度が低くなっています。", width="366", height="438" %}</figure>

効果的なアプローチの1つは、メインページのコンテンツが読み込まれた後にサードパーティのコンテンツを遅延読み込みすることです。広告はこのアプローチの良い候補です。

広告は多くのサイトにとって重要な収入源ですが、ユーザーにとって必要なのはコンテンツです。広告を遅延読み込みして、メインコンテンツをより速く配信することで、広告の全体的な視認性の割合を高めることができます。たとえば、MediaVineは[遅延読み込み広告に](https://www.mediavine.com/lazy-loading-ads-mediavine-ads-load-200-faster/)切り替え、ページの読み込み速度が200％改善されました。DoubleClickの[公式ドキュメントに](https://support.google.com/dfp_premium/answer/4578089#lazyloading)は、広告を遅延読み込みする方法に関するガイダンスがあります。

別のアプローチは、ユーザーがページのそのセクションまでスクロールしたときにのみサードパーティのコンテンツを読み込む方法です。

[Intersection Observer](https://developer.chrome.com/blog/intersectionobserver/)は、要素がブラウザーのビューポートに入出力されるタイミングを効率的に検出するブラウザAPIであり、この手法を実装するために使用できます。[lazysizes](/use-lazysizes-to-lazyload-images/)は画像と[`iframes`](http://afarkas.github.io/lazysizes/#examples)を遅延読み込みするための一般的なJavaScriptライブラリです。 YouTubeの埋め込みと[ウィジェット](https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/unveilhooks)をサポートしています。また、IntersectionObserverの[オプションのサポート](https://github.com/aFarkas/lazysizes/blob/097a9878817dd17be3366633e555f3929a7eaaf1/src/lazysizes-intersection.js)もあります。

{% Aside 'caution' %} JavaScriptを使用してリソースを遅延ロードするときには注意が必要です。不安定なネットワーク状態が原因でJavaScriptの読み込みに失敗した場合、リソースはまったく読み込まれません。 {% endAside %}

[画像とiframeの遅延読み込みで`loading`属性](/browser-level-image-lazy-loading/)を使用することは、JavaScript手法の優れた代替手段であり、最近ではChrome76で利用できるようになりました。

## サードパーティのスクリプトを実行する方法を最適化する

### サードパーティのCDNホスティング

サードパーティベンダーは、通常、[コンテンツ配信ネットワーク (CDN)](https://en.wikipedia.org/wiki/Content_delivery_network) でホスティングするJavaScriptファイルのURLを提供するのが一般的です。このアプローチの利点は、URLをコピーして貼り付けるだけですぐに開始でき、メンテナンスの負荷がないことです。サードパーティベンダーは、サーバー構成とスクリプトの更新を処理します。

ただし、それらは他のリソースと同じオリジンではないため、パブリックCDNからファイルを読み込むにはネットワークコストがかかります。ブラウザーは、DNSルックアップを実行し、新しいHTTP接続を確立して、安全なオリジンでベンダーのサーバーとSSLハンドシェイクを実行する必要があります。

サードパーティのサーバーからのファイルを使用する場合、キャッシュを制御できることはめったにありません。他の誰かのキャッシュ戦略に依存すると、スクリプトがネットワークから不必要に頻繁に再取得される可能性があります。

### サードパーティのスクリプトをセルフホスティングする

セルフホスティングのサードパーティスクリプトは、スクリプトの読み込み処理をより細かく制御できるオプションです。セルフホスティングにより、次のことができます。

- DNSルックアップとラウンドトリップ時間を短縮する。
- [HTTPキャッシュ](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)ヘッダーを改善する。
- [HTTP / 2サーバープッシュを利用](/performance-http2/)する。

たとえば、Casperは、A/Bテストスクリプトをセルフホスティングすることで、読み込み時間を[1.7秒短縮](https://medium.com/caspertechteam/we-shaved-1-7-seconds-off-casper-com-by-self-hosting-optimizely-2704bcbff8ec)することができました。

ただし、セルフホスティングには大きな欠点が1つあります。それは、APIの変更やセキュリティの修正があった場合に、スクリプトが古くなり、自動更新を実行できない可能性があることです。

{% Aside 'caution' %}

スクリプトを手動で更新すると、開発プロセスの負荷が増大し、重要な更新を見逃す可能性があります。すべてのリソースを提供するためにCDNホスティングを使用していない場合は、[エッジキャッシング](https://www.cloudflare.com/learning/cdn/glossary/edge-server/)も見逃しており、サーバーの圧縮を最適化する必要があります。 {% endAside%}

### サービスワーカーを使用して、サードパーティサーバーのスクリプトをキャッシュに保存する

サードパーティのCDNの利点を活用しながら、キャッシュをより細かく制御できるセルフホスティングの代わりに、[サービスワーカーを使用してサードパーティのサーバーからスクリプトをキャッシュに保存することもできます](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/#cross-origin-considerations)。これにより、スクリプトがネットワークから再取得される頻度を制御でき、ページが主要なユーザーの瞬間に到達するまで、必須ではないサードパーティリソースの要求を抑制する読み込み戦略を作成できます。この場合は、`preconnect`接続を使用して早期接続を確立することで、ネットワークコストをある程度軽減することもできます。
