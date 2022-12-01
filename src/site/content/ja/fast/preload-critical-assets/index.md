---
layout: post
title: 重要なアセットをプリロードして、読み込み速度を向上させる
authors:
  - houssein
  - mihajlija
description: Webページを開くと、ブラウザはすぐにサーバーからのHTMLファイルをリクエストして、その内容を解析し、その他の外部参照用に個別のリクエストを送信します。クリティカルリクエストチェーンは、ブラウザによって優先順位が付けられてフェッチされるリソースの順序を表します。
date: 2018-11-05
updated: 2020-05-27
codelabs:
  - codelab-preload-critical-assets
  - codelab-preload-web-fonts
tags:
  - performance
feedback:
  - api
---

Webページを開くと、ブラウザはすぐにサーバーからのHTMLファイルをリクエストして、その内容を解析し、その他の外部参照用に個別のリクエストを送信します。開発者はページが必要とするすべてのリソースとどれが最も重要であるかを理解しています。その知識を使用すれば、重要なリソースを事前に要求し、ロードプロセスを高速化することが可能です。この記事には`<link rel="preload">`を使用してそれを実現する方法について説明します。

## プリロードの仕組み

プリロードは、通常、ブラウザが遅れて検出するリソースに最適です。

<figure>{% Img src="image/admin/Ad9PLq3DcQt9Ycp63z6O.png", alt="Chrome DevToolsネットワークパネルのスクリーンショット。", width="701", height="509" %} <figcaption>この例では、<a href="/reduce-webfont-size/#defining-a-font-family-with-@font-face)"><code>@font-face</code></a>ルールを使って、Pacificoフォントがスタイルシートに定義されています。ブラウザは、スタイルシートのダウンロードと解析が完了した後にのみフォントファイルをロードします。</figcaption></figure>

特定のリソースが現在のページで重要であることがわかっているため、そのリソースをプリロードすることで、ブラウザがロードするよりも前にそのリソースをフェッチするようにブラウザに指示します。

<figure>{% Img src="image/admin/PgRbERrxLGfF439yBMeY.png", alt="プリロードを適用した後のChrome DevToolsネットワークパネルのスクリーンショット。", width="701", height="509" %} <figcaption>この例では、Pacificoフォントがプリロードされているため、ダウンロードはスタイルシートと並行して行われます。</figcaption></figure>

クリティカルリクエストチェーンは、ブラウザが優先順位を付けてフェッチするリソースの順序を表します。Lighthouseは、このチェーンの3番目のレベルにあるアセットを遅延検出と識別します。[**重要リクエストのプリロード**](/uses-rel-preload)監査を使用して、プリロードするリソースを特定できます。

{% Img src="image/admin/BPUTHBNZFbeXqb0dVx2f.png", alt="Lighthouseの「重要なリクエストのプリロード」監査。", width="745", height="97" %}

HTMLドキュメントのheadに、`<link>`タグと`rel="preload"`を追加して、リソースをプリロードできます。

```html
<link rel="preload" as="script" href="critical.js">
```

ブラウザはプリロードされたリソースをキャッシュするため、必要なときにすぐに利用できます。（スクリプトを実行したり、スタイルシートを適用したりすることはありません。）

{% Aside %} プリロード実装後、[Shopify、Financial Times、Treeboなどの多くのサイトで、](https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf)[Time to Interactive](/tti/)や[First Contentful Paint](/fcp/)などのユーザー中心の指標において1秒の改善が確認されました。{% endAside %}

[`preconnect`](/preconnect-and-dns-prefetch)や[`prefetch`](/link-prefetch)などのリソースヒントは、ブラウザが適切と判断したときに実行されますが、`preload`はブラウザ必須です。最新のブラウザはすでにリソースの優先順位付けの実行に非常に優れているため、`preload`を慎重に使用し、最も重要なリソースのみをプリロードすることが重要です。

未使用のpreloadについては、Chromeは`load`イベントの約3秒後にコンソール警告を表示します。

{% Img src="image/admin/z4FbCezjXHxaIhq188TU.png", alt="未使用のプリロードされたリソースに関するChrome DevToolsコンソールの警告。", width="800", height="228" %}

{% Aside %} [`preload`はすべての最新のブラウザでサポート](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility)されています。{% endAside %}

## ユースケース

{% Aside 'caution' %}執筆時点では、Chromeには、他の優先度の高いリソースよりも早くフェッチされるプリロードリクエストに関する未解決の[バグ](https://bugs.chromium.org/p/chromium/issues/detail?id=788757)があります。これが解決されるまでは、プリロードされるリソースがどのように「キューを割り込んで」、必要以上に早く要求される可能性があることに注意してください。 {% endAside %}

### CSSで定義されたリソースのプリロード

[`@font-face`](/reduce-webfont-size/#defining-a-font-family-with-@font-face)ルールで定義されたフォントやCSSファイルで定義された背景画像は、ブラウザがそれらのCSSファイルをダウンロードして解析するまで検出されません。これらのリソースをプリロードすると、CSSファイルがダウンロードされる前に確実にフェッチされます。

### CSSファイルのプリロード

[クリティカルCSSアプローチ](/extract-critical-css)を使用している場合は、CSSは2つの部分に分割されます。展開の上のコンテンツをレンダリングするために必要なクリティカルCSSは、ドキュメントの`<head>`にインライン化され、それ以外のCSSは通常JavaScriptで遅延読み込みされます。クリティカルでないCSSを読み込まれるまでJavaScriptの実行を待機すると、ユーザーがスクロールする際にレンダリングに遅延が発生することがあるため、`<link rel="preload">`を使用してダウンロードをより早く開始することをお勧めします。

### JavaScriptファイルのプリロード

ブラウザはプリロードされたファイルを実行しないため、プリロードはフェッチをと[実行](https://developer.chrome.com/docs/lighthouse/performance/bootup-time/)を分離するのに役立ち、Time to Interactiveなどの指標を改善できます。プリロードは、JavaScriptバンドルを[分割](/reduce-javascript-payloads-with-code-splitting)して、重要なチャンクのみをプリロードする場合に最適にです。

## rel=preloadを実装する方法

`preload`を実装する最も簡単な方法は、ドキュメントの`<head>`に`<link>`タグを追加することです。

```html
<head>
  <link rel="preload" as="script" href="critical.js">
</head>
```

`as`属性を指定すると、ブラウザはプリフェッチされたリソースのタイプに応じて優先度を設定し、適切なヘッダーを設定し、リソースがキャッシュにすでに存在するかどうかを判断するのに役立ちます。この属性に使用できる値には、`script`、`style`、`font`、`image`[など](https://developer.mozilla.org/docs/Web/HTML/Element/link#Attributes)があります。

{% Aside %}ブラウザが様々な種類のリソースの優先順位をどのように付けているかを知るには、[Chromeのリソースの優先順位とスケジュール](https://docs.google.com/document/d/1bCDuq9H1ih9iNjgzyAL0gpwNFiEP4TZS-YLRp_RuMlc/edit)に関するドキュメントをご覧ください。{% endAside %}

{% Aside 'caution' %} `as`属性を省略したり、無効な値を設定したりすることは、ブラウザが何をフェッチしているのかわからないため、正しい優先度を決定できない[XHRリクエスト](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest)と同等です。また、スクリプトなどの一部のリソースが2回フェッチされる可能性もあります。 {% endAside %}

フォントなどの一部の種類のリソースは、[匿名モード](https://www.w3.org/TR/css-fonts-3/#font-fetching-requirements)で読み込まれます。 `preload`を使って`crossorigin`属性を設定する必要がある場合は、次のようにします。

```html
<link rel="preload" href="ComicSans.woff2" as="font" type="font/woff2" crossorigin>
```

{% Aside 'caution' %} `crossorigin`属性なしでプリロードされたフォントは2回フェッチされます！ {% endAside %}

`<link>`要素には、[`type` attribute](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types)属性も使用できます。これには、紐付けされたリソースの[MIMEタイプ](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types)が含まれます。ブラウザが`type`属性の値を使用することにより、ファイルタイプがサポートされている場合にのみリソースがプリロードされるようにすることができます。ブラウザが指定されたリソースタイプをサポートしていない場合は、`<link rel="preload">`を無視します。

{% Aside 'codelab' %} [Webフォントをプリロードすることで、ページのパフォーマンスを向上させます](/codelab-preload-web-fonts)。 {% endAside %}

[`Link` HTTPヘッダーを](https://developer.mozilla.org/docs/Web/HTTP/Headers/Link)介して、任意のタイプのリソースをプリロードすることもできます。

`Link: </css/style.css>; rel="preload"; as="style"`

HTTPヘッダーでの`preload`の指定には、ブラウザがドキュメントを解析して検出する必要がないというメリットがあるため、一部のケースでわずかな改善が得られます。

### Webpackを使用したJavaScriptモジュールのプリロード

アプリケーションのビルドファイルを作成するモジュールバンドラーを使用している場合は、preloadタグの挿入をサポートしているかどうかを確認する必要があります。[Webpack](https://webpack.js.org/)のバージョン4.6.0以降では、`import()`内で[マジックコメント](https://webpack.js.org/api/module-methods/#magic-comments)を使用することでpreloadがサポートされています。

```js
import(_/* webpackPreload: true */_ "CriticalChunk")
```

古いバージョンのWebpackを使用している場合は、[preload-webpack-plugin](https://github.com/GoogleChromeLabs/preload-webpack-plugin)などのサードパーティのプラグインを使用してください。

## 結論

ページ速度を向上させるには、ブラウザが遅れて検出する重要なリソースをプリロードするようにします。すべてをプリロードすると逆効果になるため、`preload`を慎重に使用し、[実際の影響を測定](/fast#measure-performance-in-the-field)するようにしてください。
