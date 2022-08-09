---
title: Largest Contentful Paint を最適化する
subhead: メインコンテンツをより速くレンダリングする方法。
authors:
  - houssein
date: 2020-05-05
updated: 2020-08-20
hero: image/admin/qqTKhxUFqdLXnST2OFWN.jpg
alt: '"LCP を最適化する" のバナー画像'
description: Largest Contentful Paint (最大視覚コンテンツの表示時間、LCP) は、ページのメイン コンテンツの画面へのレンダリングが完了したタイミングを判断するために使用されます。この記事では、応答に時間がかかっているサーバー、リソースの読み込み時間、クライアントサイドでのレンダリングなどを改善することによって LCP を最適化する方法について説明します。
tags:
  - blog
  - performance
  - web-vitals
---

{% YouTube id='AQqFZ5t8uNc', startTime='1073' %}

<blockquote>
  <p>便利なコンテンツが表示されません！どうしてこんなに読み込みに時間がかかるのですか？😖</p>
</blockquote>

ユーザー エクスペリエンスを低下させる要因の 1 つに、画面にレンダリングされたコンテンツをユーザーが視認するまでの時間が挙げられます。[First Contentful Paint](/fcp) (視覚コンテンツの初期表示時間、FCP) は DOM コンテンツが最初にレンダリングされるまでの時間を測定する指標ですが、ページ上で最もサイズが大きいコンテンツ (通常はこちらの方がより重要となります) がレンダリングされるまでの時間を捕捉することはできません。

[Largest Contentful Paint](/lcp) (最大視覚コンテンツの表示時間、LCP) は [Core Web Vitals](/vitals/) に含まれている指標であり、ビューポート内で最もサイズが大きいコンテンツ要素の表示タイミングを測定します。この指標は、ページのメイン コンテンツの画面へのレンダリングが完了したタイミングを判断するために使用されます。

  <picture>
    <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/elqsdYqQEefWJbUM2qMO.svg" | imgix }}" media="(min-width: 640px)">
    {% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/9trpfS9wruEPGekHqBdn.svg", alt="良好なLCP値は2.5秒、不良な値は4.0秒を超え、その間の値は改善が必要", width="384", height="96" %}
  </picture>

LCP が低下する要因としては、一般的に以下のものが考えられます。

- [サーバーの応答速度の低下](#slow-servers)
- [レンダリングを妨げる JavaScript および CSS](#render-blocking-resources)
- [リソースの読み込み速度の低下](#slow-resource-load-times)
- [クライアントサイドでのレンダリング](#client-side-rendering)

## サーバーの応答速度の低下 {: #slow-servers }

ブラウザーがサーバーからコンテンツを受信するのに時間がかかればかかるほど、画面に何かをレンダリングするのに時間がかかってしまいます。サーバーの応答速度を高速化することで、LCP を含むすべてのページの読み込みに関連する指標を直接的に改善することができます。

何よりもまず、サーバーがコンテンツを処理する方法と場所を改善しましょう。サーバーの応答時間を測定するには、[**Time to First Byte**](/ttfb/) (サーバーの初期応答時間、TTFB) を使用します。TTFB の改善には、以下のような様々な方法があります。

- サーバーを最適化する
- ユーザーを近くの CDN にルーティングする
- アセットをキャッシュする
- HTML ページをキャッシュファーストで配信する
- サードパーティの接続を早期に確立する
- Signed Exchange (SXG) を使用する

### サーバーを最適化する

サーバーが処理を完了するまでにかなり長い時間がかかってしまうような、負荷が高いクエリを実行していませんか？あるいは、別の複雑な処理がサーバーサイドで実行されていて、ページ コンテンツを返す処理に遅延が発生していませんか？サーバーサイドのコードを分析して効率化することで、ブラウザーがデータを受け取るまでの時間を直接的に改善することができます。

多くのサーバーサイド Web フレームワークでは、ブラウザーからのリクエストに応じて即座に静的なページを配信するのではなく、動的に Web ページを生成する必要があります。つまり、すでに用意されている完全な HTML ファイルがブラウザーのリクエストに応じて送信されるのではなく、ページを構築するためのロジックをフレームワーク側で実行する必要があるのです。これは、データベース クエリの結果が保留されることや、UI フレームワーク ([React](https://reactjs.org/docs/react-dom-server.html) など) によってコンポーネントをマークアップ内に生成する必要があることが原因です。サーバー上で動作する多くの Web フレームワークには、この処理を高速化するためのパフォーマンス ガイダンスが用意されています。

{% Aside %}詳細については、「[過負荷状態に陥っているサーバーの修正](/overloaded-server/)」を参照してください。{% endAside %}

### ユーザーを近くの CDN にルーティングする

コンテンツ デリバリー ネットワーク (CDN) とは、様々な場所に分散して設置されたサーバーのネットワークのことを指します。Web ページのコンテンツが 1 台のサーバーでホストされている場合、地理的に離れた場所にいるユーザーが使用しているブラウザーからのリクエストが文字通り世界中を移動しなければならなくなってしまうため、結果的に Web サイトの読み込みが遅くなります。ユーザーが地理的に離れたサーバーへのネットワーク リクエストによって長時間待たされることがないように、CDN の利用をご検討ください。

### アセットをキャッシュする

HTML が静的なもので、リクエストのたびに変更する必要がない場合には、キャッシングによって無駄な生成を防ぐことができます。生成された HTML のコピーをディスクに保存しておくこと (サーバーサイド キャッシング) によって TTFB を削減し、リソースの使用を最小限に抑えることができます。

サーバー キャッシングの適用については、ご利用のツールチェーンに応じて以下のような複数の方法が存在します。

- リバース プロキシ ([Varnish](https://varnish-cache.org/)、[nginx](https://www.nginx.com/)) を構成し、キャッシュされたコンテンツを配信するか、アプリケーション サーバーの前にインストールされた場合にキャッシュ サーバーとして機能させる
- クラウド プロバイダー ([Firebase](https://firebase.google.com/docs/hosting/manage-cache)、[AWS](https://aws.amazon.com/caching/)、[Azure](https://docs.microsoft.com/azure/architecture/best-practices/caching)) のキャッシュ動作を構成して管理する
- エッジ サーバーを設置している CDN を使用し、ユーザーの近くでコンテンツをキャッシュして保存する

### HTML ページをキャッシュファーストで配信する

インストールされている場合は、[Service Worker](https://developer.mozilla.org/docs/Web/API/Service_Worker_API) がブラウザーのバックグラウンドで動作し、サーバーからのリクエストをインターセプトすることができます。このレベルのプログラマティック キャッシュ コントロールにより、HTML ページのコンテンツの一部または全部をキャッシュし、コンテンツが変更された場合にのみキャッシュを更新することができるようになります。

このパターンを使用しているサイトで LCP の分布がどのように減少したかを、次の図に示します。

<figure>{% Img src="image/admin/uB0Sm56R88MRF16voQ1k.png", alt="HTML キャッシングの使用前後での Largest Contentful Paint の分布の比較", width="800", height="495" %} <figcaption>Service Worker を使用している場合と、そうではない場合での Largest Contentful Paint の分布の比較 - <a href="https://philipwalton.com/articles/smaller-html-payloads-with-service-workers/">philipwalton.com</a></figcaption></figure>

このグラフは、過去 28 日間に渡る単一サイトでの LCP の分布を、Service Worker の状態別に示したものです。Service Worker にキャッシュファーストの HTML ページ配信が導入されると、LCP の値が高速化したページ読み込みの数が大幅に増加することにご注目ください (青いグラフで表示)。

{% Aside %}HTML ページの全部または一部をキャッシュファーストで配信する技術については、「[Service Worker による HTML ペイロードの削減](https://philipwalton.com/articles/smaller-html-payloads-with-service-workers/)」を参照してください。{% endAside %}

### サードパーティとの接続を早期に確立する

サードパーティ オリジンへのサーバー リクエストも LCP に影響を及ぼす可能性があります。特にページ上で重要となるコンテンツの表示に必要な場合には、注意が必要です。`rel="preconnect"` を使用し、ページが可能な限り早期に接続を確立しようとしていることをブラウザーに通知します。

```html
<link rel="preconnect" href="https://example.com" />
```

また、`dns-prefetch` を使用して DNS ルックアップをより速く完了させることも可能です。

```html
<link rel="dns-prefetch" href="https://example.com" />
```

どちらの場合でも動作はしますが、`preconnect` をブラウザーがサポートしていない場合のフォールバックとして `dns-prefetch` の使用をご検討ください。

```html
<head>
  …
  <link rel="preconnect" href="https://example.com" />
  <link rel="dns-prefetch" href="https://example.com" />
</head>
```

{% Aside %}詳細については、「[ネットワーク接続を早期に確立し、知覚されるページ速度を向上させる](/preconnect-and-dns-prefetch/)」を参照してください。{% endAside %}

### Signed Exchange (SXG) を使用する

[Signed Exchange (SXG)](/signed-exchanges) は、簡単にキャッシュ可能な形式でコンテンツを配信することにより、より高速なユーザー エクスペリエンスを可能にする配信メカニズムです。具体的には、[Google 検索](https://developers.google.com/search/docs/advanced/experience/signed-exchange)が SXG をキャッシュし、状況に応じてプリフェッチします。トラフィックの大部分を Google 検索が占めているサイトにとっては、SXG は LCP を改善するための重要なツールとなる可能性があります。詳細については、「[Signed Exchange](/signed-exchanges)」を参照してください。

## レンダリングを妨げる JavaScript および CSS {: #render-blocking-resources }

ブラウザーは、コンテンツのレンダリングを開始する前に HTML のマークアップを解析して DOM ツリーに変換する必要があります。HTML パーサーは、外部スタイルシート (`<link rel="stylesheet">`) や同期的な JavaScript タグ (`<script src="main.js">`) に遭遇すると、一時停止します。

スクリプトとスタイルシートは、どちらも FCP、ひいては LCP の低下につながるレンダリングを妨げるリソースです。重要でない JavaScript や CSS の読み込みは先送りし、Web ページのメイン コンテンツの読み込みを高速化しましょう。

### CSS のブロック時間を短縮する

以下の手法を用いて、サイト上でレンダリングを妨げる CSS の量が必要最小限になるようにします。

- CSS を圧縮する
- 重要でない CSS を先送りする
- クリティカル CSS をインライン化する

### CSS を圧縮する

CSS ファイルには、読みやすくするために、スペース、インデント、コメントなどの文字が含まれています。こういった文字はブラウザーにとっては不要なものであり、これらのファイルを圧縮することによって確実に削除することができます。レンダリングを妨げる CSS の量を減らすことにより、最終的にはページのメイン コンテンツのレンダリングにかかる時間 (LCP) を改善することができます。

モジュール バンドラーやビルド ツールを使用している場合には、適切なプラグインを導入してビルドごとに CSS ファイルを圧縮してください。

- webpack の場合: [optimize-css-assets-webpack-plugin](https://github.com/NMFR/optimize-css-assets-webpack-plugin)
- Gulp の場合: [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css)
- Rollup の場合: [rollup-plugin-css-porter](https://www.npmjs.com/package/rollup-plugin-css-porter)

<figure>{% Img src="image/admin/vQXSKrY1Eq3CKkNbu9Td.png", alt="LCP の改善例: CSS の圧縮前後の比較", width="800", height="139" %} <figcaption>LCP の改善例: CSS の圧縮前後の比較</figcaption></figure>

{% Aside %}詳細については、「[CSS を圧縮する](/minify-css/)」ガイドを参照してください。{% endAside %}

### 重要でない CSS を先送りする

Chrome DevTools の [Coverage](https://developer.chrome.com/docs/devtools/coverage/) (カバレッジ) タブを使用し、Web ページで使用されていない CSS を見つけます。

{% Img src="image/admin/wjS4NrU5EsJeCuvK0zhn.png", alt="Chrome DevTools の Coverage (カバレッジ) タブ", width="800", height="559" %}

最適化の手順は、以下の通りです。

- 使用されていない CSS は、すべて削除してください。サイト内の別のページで使用されている場合には、別のスタイルシートへと移動してください。
- 初期のレンダリングに使用されない CSS については、`rel="preload"` や `onload` を活用した [loadCSS](https://github.com/filamentgroup/loadCSS/blob/master/README.md) を使用し、非同期でファイルを読み込みます。

```html
<link rel="preload" href="stylesheet.css" as="style" onload="this.rel='stylesheet'">
```

<figure>{% Img src="image/admin/2fcwrkXQRQrM8w1qyy3P.png", alt="LCP の改善例: 重要でない CSS の先送り前後の比較", width="800", height="139" %} <figcaption>LCP の改善例: 重要でない CSS の先送り前後の比較</figcaption></figure>

<figure>
  {% Img
    src="image/admin/2fcwrkXQRQrM8w1qyy3P.png",
    alt="LCP の改善例: 重要でない CSS の先送り前後の比較",
    width="800",
    height="139"
  %}
  <figcaption>
    LCP の改善例: 重要でない CSS の先送り前後の比較
  </figcaption>
</figure>

{% Aside %}詳細については、「[重要でない CSS を先送りする](/defer-non-critical-css/)」ガイドを参照してください。{% endAside %}

### クリティカル CSS をインライン化する

Above the fold (アバブ・ザ・フォールド、スクロールせずに閲覧可能なサイトのファースト ビューを指す) のコンテンツに使用されているクリティカル パス CSS は、`<head>` タグ内に直接記述してインライン化します。

<figure>
  {% Img
    src="image/admin/m0n0JsLpH9JsNnXywSwz.png",
    alt="重要なCSSがインライン化",
    width="800", height="325"
  %}
  <figcaption>重要なCSSがインライン化</figcaption>
</figure>

重要なスタイルをインライン化してしまえば、重要な CSS を取得するために順番にリクエストを行う必要がなくなります。そして、残りの部分を先送りすることによって CSS のブロック時間を最小限に抑えることができるようになります。

インライン化されたスタイルを手動で追加できない場合には、ライブラリを使用してプロセスを自動化します。以下に、いくつかの例を挙げます。

- [Critical](https://github.com/addyosmani/critical)、[CriticalCSS](https://github.com/filamentgroup/criticalCSS)、[Penthouse](https://github.com/pocketjoso/penthouse) は、Above the fold に含まれている CSS を抽出し、インライン化するためのパッケージです。
- [Critters](https://github.com/GoogleChromeLabs/critters) は、クリティカル CSS をインライン化し、残りの部分の遅延読み込みを行う webpack プラグインです。

<figure>
  {% Img
    src="image/admin/L8sc51bd3ckxwnUfczC4.png",
    alt="LCP の改善例: クリティカル CSS のインライン化前後の比較",
    width="800",
    height="175"
  %}
  <figcaption>
    LCP の改善例: クリティカル CSS のインライン化前後の比較
  </figcaption>
</figure>

{% Aside %}詳細については、「[クリティカル CSS を抽出する](/extract-critical-css/)」ガイドを参照してください。{% endAside %}

### JavaScript のブロック時間を短縮する

ダウンロードされ、ユーザーに提供される JavaScript の量が必要最小限となるようにします。レンダリングを妨げる JavaScript の量を少なくすることでレンダリングが高速化し、結果的に LCP が改善されます。

これを行うには、以下に示す様々な方法を用いてスクリプトの最適化を行う必要があります。

- [JavaScript ファイルを圧縮する](/reduce-network-payloads-using-text-compression/)
- [使用されていない JavaScript を先送りする](/reduce-javascript-payloads-with-code-splitting/)
- [使用されていないポリフィルを最小限に抑える](/serve-modern-code-to-modern-browsers/)

{% Aside %}「[First Input Delay を最適化する](/optimize-fid/)」ガイドでは、JavaScript によるブロック時間を短縮するために必要なすべての技術を、より詳細に説明しています。{% endAside %}

## リソースの読み込み速度の低下 {: #slow-resource-load-times }

CSS や JavaScript によるブロック時間の増加はパフォーマンスの低下に直接つながるものですが、その他様々な種類のリソースの読み込みにかかる時間についても、描画時間に影響を及ぼす可能性があります。LCP に影響を及ぼす要素の種類は、以下のとおりです。

- `<img>` 要素
- `<svg>` 要素内の `<image>` 要素
- `<video>` 要素 ([ポスター](https://developer.mozilla.org/docs/Web/HTML/Element/video#attr-poster)画像が LCP の測定に使用されます)
- ([CSS グラデーション](https://developer.mozilla.org/docs/Web/CSS/url())とは対照的に、) <a><code>url()</code></a> 関数を介して読み込まれた背景画像が含まれている要素
- テキスト ノードやその他のインラインレベルのテキスト要素を含む[ブロックレベル](https://developer.mozilla.org/docs/Web/HTML/Block-level_elements)要素。

これらの要素が Above the fold でレンダリングされた場合、その読み込みにかかる時間は LCP に直接影響を及ぼします。これらのファイルの読み込みを可能な限り高速化するには、以下のような方法があります。

- 画像を最適化して圧縮する
- 重要なリソースを事前に読み込む
- テキスト ファイルを圧縮する
- ネットワーク接続の状況に応じて異なるアセットを配信する (アダプティブ サービング)
- Service Worker を使用してアセットをキャッシュする

### 画像を最適化して圧縮する

多くのサイトにおいて、ページの読み込みが完了した時点で最もサイズが大きい要素として表示されるのは画像です。一般的な例としては、ヒーロー画像、大きなカルーセル、バナー画像などが挙げられます。

<figure>
  {% Img
    src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/unWra6cq0hPJJJT7Y3ye.png",
    alt="",
    width="459",
    height="925"
  %}
  <figcaption>画像がページで最もサイズの大きい要素となっている例: <a href="https://design.google/">design.google</a></figcaption>
</figure>

こういったタイプの画像の読み込みやレンダリングにかかる時間の短縮は、LCP の直接的な改善につながります。これを実現するためには、以下の手法を用います。

- まず第一に、画像を使用しないことを検討します。コンテンツに関係のない画像は、削除しましょう。
- 画像を圧縮する (たとえば [Imagemin](/use-imagemin-to-compress-images) を使用)
- 画像をより新しい形式 (JPEG 2000、JPEG XR、WebP) に変換する
- レスポンシブ画像を使用する
- 画像 CDN の使用を検討する

{% Aside %}これらの技術について詳細に説明しているガイドやリソースについては、「[画像を最適化する](/fast/#optimize-your-images)」を参照してください。{% endAside %}

### 重要なリソースを事前に読み込む

たとえば、あるアプリケーションに含まれている数多くの CSS ファイルのいずれかの深い場所に記述されているフォントのように、特定の CSS ファイルや JavaScript ファイル内で宣言されている、または使用されている重要なリソースが意図したタイミングよりも遅れて取得される場合があります。

特定のリソースを優先する必要があることが分かっている場合には、`<link rel="preload">` を使用してより早いタイミングでそのリソースを取得します。事前読み込みは[様々な種類のリソース](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#What_types_of_content_can_be_preloaded)に対して行うことができますが、まずはフォント、Above the fold に配置されている画像や動画、クリティカル パス CSS、JavaScript などを含む[重要なアセットの事前読み込み](/preload-critical-assets/)に焦点を当てる必要があります。

```html
<link rel="preload" as="script" href="script.js" />
<link rel="preload" as="style" href="style.css" />
<link rel="preload" as="image" href="img.png" />
<link rel="preload" as="video" href="vid.webm" type="video/webm" />
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin />
```

Chrome 73 以降では、事前読み込みと[レスポンシブ画像](/preload-responsive-images/)を併用して両方のパターンを組み合わせることにより、画像の読み込みを大幅に高速化することができます。

```html
<link
  rel="preload"
  as="image"
  href="wolf.jpg"
  imagesrcset="wolf_400px.jpg 400w, wolf_800px.jpg 800w, wolf_1600px.jpg 1600w"
  imagesizes="50vw"
/>
```

### テキスト ファイルを圧縮する

[Gzip](https://www.youtube.com/watch?v=whGwm0Lky2s&feature=youtu.be&t=14m11s) や [Brotli](https://opensource.googleblog.com/2015/09/introducing-brotli-new-compression.html) などの圧縮アルゴリズムを使用すれば、サーバーとブラウザー間で転送されるテキスト ファイル (HTML、CSS、JavaScript) のサイズを大幅に削減することができます。Gzip はすべてのブラウザーで効果的にサポートされており、さらに優れた圧縮結果を提供する Brotli は[比較的新しいブラウザーのほぼすべてで使用することができます](https://caniuse.com/#feat=brotli)。

リソースを圧縮することで配信サイズも圧縮されるため、読み込み時間が改善されることで結果的に LCP も改善されます。

1. まず、ご利用のサーバーがすでにファイルを自動的に圧縮しているかどうかを確認します。ほとんどのホスティング プラットフォーム、CDN、リバース プロキシ サーバーでは、デフォルトでアセットを圧縮してエンコードしているか、またはその設定を簡単に行うことができます。
2. ファイルを圧縮するためにサーバーの設定を変更する必要がある場合には、gzip の代わりに圧縮率がより優れている Brotli の使用をご検討ください。
3. 使用する圧縮アルゴリズムの選択が完了したら、ブラウザーからのリクエストがあったときにその場で圧縮するのではなく、ビルド処理の中で事前にアセットを圧縮します。これにより、サーバーのオーバーヘッドを最小限に抑え、特に高い圧縮率を使用する場合におけるリクエスト時の遅延を防ぐことができます。

<figure>
  {% Img
    src="image/admin/Ckh2Jjkoh7ojLj5Wxeqc.png",
    alt="LCP の改善例: Brotli による圧縮の前後比較",
    width="800",
    height="139"
  %}
  <figcaption>
    LCP の改善例: Brotli による圧縮の前後比較
  </figcaption>
</figure>

{% Aside %}詳細については、「[ネットワーク ペイロードを圧縮する](/reduce-network-payloads-using-text-compression/)」ガイドを参照してください。{% endAside %}

### アダプティブ サービング

ページのメイン コンテンツを構成するリソースを読み込む際には、ユーザーのデバイスやネットワーク状況に応じた様々なアセットを条件付きでフェッチすると効果的です。この手法は、[Network Information](https://wicg.github.io/netinfo/) API、[Device Memory](https://www.w3.org/TR/device-memory/) API、[HardwareConcurrency](https://html.spec.whatwg.org/multipage/workers.html#navigator.hardwareconcurrency) API を使用して実施することができます。

初期のレンダリングで重要な役割を果たすサイズの大きいアセットが存在する場合、ユーザーの接続状況やデバイスに応じて同一のリソースを異なるバリエーションで使用することができます。たとえば、接続速度が 4G 以下の場合に動画の代わりに画像を表示したりすることができます。

```js
if (navigator.connection && navigator.connection.effectiveType) {
  if (navigator.connection.effectiveType === '4g') {
    // 動画の読み込み
  } else {
    // 画像の読み込み
  }
}
```

使用可能な便利なプロパティには、以下のものがあります。

- `navigator.connection.effectiveType`: 効果的な接続タイプ
- `navigator.connection.saveData`: データセーバーの有効/無効
- `navigator.hardwareConcurrency`: CPU のコア数
- `navigator.deviceMemory`: デバイスのメモリ量

{% Aside %}詳細については、「[ネットワーク品質に基づくアダプティブ サービング](/adaptive-serving-based-on-network-quality/)」を参照してください。{% endAside %}

### Service Worker を使用してアセットをキャッシュする

この記事の前半で説明したように、Service Worker は比較的小さな HTML レスポンスの配信などを含む数多くの便利なタスクに利用が可能です。また、これを利用して静的なリソースをブラウザーにキャッシュし、繰り返しリクエストされる場合にネットワークを経由せずにリソースを提供することも可能です。

Service Worker を使用して重要なリソースを事前にキャッシュしておくと、特に接続状態が悪い中で Web ページを再読み込みするユーザー (またはオフラインでアクセスするユーザー) の読み込み時間を大幅に削減することができます。また、[Workbox](https://developer.chrome.com/docs/workbox/) のようなライブラリを使用すれば、事前にキャッシュされたアセットの更新処理を自分で Service Worker を記述して処理するよりも簡単に行うことができます。

{% Aside %}Service Worker と Workbox については、「[ネットワークの信頼性](/reliable/)」を参照してください。{% endAside %}

## クライアントサイドでのレンダリング {: #client-side-rendering }

多くのサイトでは、クライアントサイド JavaScript のロジックを使用してブラウザーで直接ページをレンダリングしています。[React](https://reactjs.org/)、[Angular](https://angular.io/)、[Vue](https://vuejs.org/) などのフレームワークやライブラリの登場により、Web ページの様々な側面をサーバーではなくクライアント側で完全に処理するシングルページ アプリケーションの構築が容易になりました。

ほとんどがクライアント側でレンダリングされるサイトを構築している場合、サイズの大きい JavaScript バンドルの使用が LCP に影響を及ぼす可能性があるため、注意が必要です。この現象を防ぐための最適化が実施されていない場合、重要な JavaScript のダウンロードと実行がすべて完了するまでの間にユーザーがページ上のコンテンツを表示することも操作することもできなくなってしまう可能性があります。

クライアント側でレンダリングが行われるサイトを構築する場合には、以下のような最適化の実施をご検討ください。

- 重要な JavaScript を圧縮する
- サーバーサイドでレンダリングを行う
- 事前レンダリングを行う

### 重要な JavaScript を圧縮する

もしも運営するサイトのコンテンツが一定量の JavaScript のダウンロードが完了した後にのみ表示や操作が可能となっている場合には、バンドルのサイズを可能な限り縮小することがより重要になります。これを行うには、以下の方法があります。

- JavaScript の圧縮
- 使用されていない JavaScript の先送り
- 使用されていないポリフィルの最小化

これらの最適化については、「[JavaScript のブロック時間を短縮する](#reduce-javascript-blocking-time)」セクションに戻り、詳細をご確認ください。

### サーバーサイドでレンダリングを行う

ほとんどの要素がクライアントサイドでレンダリングされているサイトにおいては、JavaScript の量を最小化することが最優先課題となります。しかしながら、LCP を少しでも改善したい場合には、サーバーサイド レンダリングの併用もご検討ください。

このコンセプトは、サーバーを使用してアプリケーションを HTML へとレンダリングし、クライアント側で JavaScript や必要なデータのすべてを同一の DOM コンテンツへと "[ハイドレート](https://www.gatsbyjs.org/docs/react-hydration/)" することで機能します。これにより、ページのメイン コンテンツがクライアント側のみでレンダリングされるのではなく最初にサーバー上でレンダリングされるようになり、結果的に LCP を改善させることができます。ただし、この手法にはいくつかの欠点があります。

- サーバー側とクライアント側で JavaScript を使用してレンダリングされる同一のアプリケーションを維持すると、複雑さが増してしまう。
- サーバー上の HTML ファイルをレンダリングするために JavaScript を実行すると、単純にサーバーから静的なページを配信する場合に比べてサーバーの応答時間 (TTFB) が常に増大してしまう。
- サーバー側でレンダリングされたページは一見操作可能に見えるものの、クライアントサイド JavaScript の実行がすべて完了するまではユーザーによる入力に応答することができない。つまり、これによって [**Time to Interactive**](/tti/) (操作可能になるまでの時間、TTI) が悪化してしまう可能性がある。

### 事前レンダリングを行う

事前レンダリングは、サーバーサイド レンダリングよりもシンプルな別の技術を用いてアプリケーションの LCP を改善する手法です。この方法では、ヘッドレス ブラウザー (ユーザー インターフェースのないブラウザー) を使用してビルド時にすべてのパターンで静的な HTML ファイルを生成します。これらのファイルは、アプリケーションに必要な JavaScript バンドルと一緒に配信することが可能です。

事前レンダリングを使用する場合、TTI に関してはネガティブな影響を与えますが、サーバーの応答時間に関してはリクエストに応じてそれぞれのページを動的にレンダリングするサーバーサイド レンダリング ソリューションほどの影響は与えません。

<figure>
  {% Img
    src="image/admin/sm9s16UHfh8a5MDEWjxa.png",
    alt="LCP の改善例: 事前レンダリング前後の比較",
    width="800",
    height="139"
  %}
  <figcaption>
    LCP の改善例: 事前レンダリング前後の比較
  </figcaption>
</figure>

{% Aside %}さまざまな種類のサーバーサイド レンダリング アーキテクチャの詳細については、「[Web 上でのレンダリング](/rendering-on-the-web/)」を参照してください。{% endAside %}

## 開発者ツール

LCP を測定またはデバッグするためのツールは、以下のように様々なものが用意されています。

- [Lighthouse 6.0](https://developer.chrome.com/docs/lighthouse/overview/) では、ラボ設定での LCP の測定がサポートされています。

    {% Img src="image/admin/Sar3Pa7TDe9ibny6sfq4.jpg", alt="Lighthouse 6.0", width="800", height="309" %}

- Chrome DevTools の [Performance](https://developer.chrome.com/docs/devtools/evaluate-performance/) (パフォーマンス) パネルの **Timings** (タイミング) セクションには LCP マーカーが含まれており、**Related Node** (関連するノード) フィールドにカーソルを置くことで LCP に関連する要素を表示することができます。

    {% Img src="image/admin/sxczQPKH0cvMBsNCx5uH.png", alt="Chrome DevTools での LCP", width="800", height="509" %}

- [Chrome User Experience Report](https://developer.chrome.com/docs/crux/) は、オリジンレベルで集計された実際の環境での LCP 値を提供します。

*レビューしていただいた Philip Walton、Katie Hempenius、Kayce Basques、Ilya Grigorik には、心より感謝申し上げます。*
