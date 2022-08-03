---
layout: post
title: Largest Contentful Paint (LCP)
authors:
  - philipwalton
date: 2019-08-08
updated: 2022-07-18
description: この投稿では、Largest Contentful Paint (LCP) という指標について紹介し、その測定方法に関する説明を行います。
tags:
  - performance
  - metrics
---

{% Aside %}Largest Contentful Paint (最大視覚コンテンツの表示時間、LCP) は、[知覚される読み込み速度](/user-centric-performance-metrics/#types-of-metrics)を測定するための重要なユーザーを中心とした指標です。これは、LCP がページの読み込みタイムラインにおいてページのメイン コンテンツが読み込まれたと思われる時点を示すためです。LCP を高速にすることで、そのページが[便利](/user-centric-performance-metrics/#questions)であることをユーザーに強く印象付けることができるようになります。{% endAside %}

歴史的に見ても、Web ページのメイン コンテンツがどの程度早く読み込まれ、ユーザーに対して表示されるかを測定することは Web 開発者にとっての大きな課題でした。

[load](https://developer.mozilla.org/docs/Web/Events/load) や [DOMContentLoaded](https://developer.mozilla.org/docs/Web/Events/DOMContentLoaded) のような古い指標は、ユーザーが画面上で見ているものとは必ずしも一致しないため、 適切ではありません。また、[First Contentful Paint (視覚コンテンツの初期表示時間、FCP)](/fcp/) のようなユーザーを中心とした新しいパフォーマンス指標は、読み込みエクスペリエンスのごく初期の部分しかキャプチャできません。特にページにスプラッシュ スクリーンや読み込みインジケーターなどが表示されている場合には、この瞬間的な出来事はユーザーにとってあまり意味がありません。

過去には、初期表示後の読み込みエクスペリエンスを把握するために [First Meaningful Paint (意味のある視覚コンテンツの初期表示時間、FMP)](/first-meaningful-paint/) や [Speed Index (スピード インデックス、SI)](/speed-index/) といったパフォーマンス指標を推奨してきました。しかしながら、これらの指標は複雑で説明が難しく、間違っている場合も多かったため、これらを使用してページのメイン コンテンツがいつ読み込まれたかを特定することはできませんでした。

物事には、シンプルな方が好ましい場合があります。[W3C Web Performance ワーキング グループ](https://www.w3.org/webperf/)での議論や Google が実施した調査によると、ページのメイン コンテンツの読み込みタイミングをより正確に測定するためには、最も大きい要素がレンダリングされるタイミングの測定が重要であることが分かりました。

## LCP とは？

Largest Contentful Paint (LCP) 指標は、ビューポート内に表示される最も大きい[画像またはテキスト ブロック](https://w3c.github.io/hr-time/#timeorigin-attribute)のレンダリング時間を、ページの[初期読み込み開始](#what-elements-are-considered)タイミングと比較してレポートします。

<picture>
  <source srcset="{{ "image/tcFciHGuF3MxnTr1y5ue01OGLBn2/elqsdYqQEefWJbUM2qMO.svg" | imgix }}" media="(min-width: 640px)" width="400", height="100">
  {% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/8ZW8LQsagLih1ZZoOmMR.svg", alt="良好なLCP値は2.5秒、不十分な値は4.0秒を超え、その間の値は改善が必要", width="400", height="300" %}
</picture>

### LCP における良いスコアとは？

良好なユーザー体験を提供するために、サイトは Largest Contentful Paint が **2.5 秒**以下になるように努力する必要があります。ほぼすべてのユーザーに対してこの目標値を確実に達成するためには、モバイル デバイスとデスクトップ デバイスに分けた上で、総ページロード数の 75 パーセンタイルをしきい値として設定します。

{% Aside %}この推奨事項の根拠となる調査および方法論に関する詳細については、「[Core Web Vitals の指標のしきい値の定義](/defining-core-web-vitals-thresholds/)」を参照してください。{% endAside %}

### どのような要素が考慮されますか？

[Largest Contentful Paint API](https://wicg.github.io/largest-contentful-paint/) で現在規定されているように、Largest Contentful Paint については以下の要素が考慮されます。

- `<img>` 要素
- `<svg>` 要素内の `<image>` 要素
- `<video>` 要素 (ポスター画像が使用されます)
- ([CSS グラデーション](https://developer.mozilla.org/docs/Web/CSS/CSS_Images/Using_CSS_gradients)とは対照的に、) [`url()`](https://developer.mozilla.org/docs/Web/CSS/CSS_Images/Using_CSS_gradients) 関数を介して読み込まれた背景画像が含まれている要素
- テキスト ノードやその他のインラインレベルのテキスト要素の子要素を含む[ブロックレベル](https://developer.mozilla.org/docs/Web/HTML/Block-level_elements)要素。

なお、要素をこのように限定したのは、最初に考え方をシンプルにするという意図があったためです。研究が進むにつれて、追加の要素 (`<svg>`、`<video>` など) が今後追加されていく可能性があります。

### 要素のサイズはどのようにして決定されますか？

Largest Contentful Paint としてレポートされる要素のサイズは、通常ビューポート内でユーザーに対して表示されるサイズとなります。要素がビューポートからはみ出していたり、要素の一部が切り取られていたり、画面に表示されない[オーバーフロー](https://developer.mozilla.org/docs/Web/CSS/overflow)が発生したりしているような場合、そういった部分は要素のサイズには含まれません。

[本来のサイズ](https://developer.mozilla.org/docs/Glossary/Intrinsic_Size)からリサイズされた画像要素については、表示されたサイズと本来のサイズのうち、いずれか小さい方がレポートされます。たとえば、本来のサイズよりもはるかに小さいサイズへと縮小された画像については、表示されたサイズのみがレポートされ、逆に大きなサイズへと引き伸ばされたり拡大されたりした画像については、本来のサイズのみがレポートされます。

テキスト要素については、そのテキスト ノードのサイズ (すべてのテキスト ノードを包含する最小の長方形) のみが考慮されます。

あらゆる要素において、CSS を介して適用されているマージン、パディング、ボーダーはすべて考慮されません。

{% Aside %}どのテキスト ノードがどの要素に属しているかについての判断は時に難しいものとなり、特にインライン要素やプレーン テキスト ノードだけでなくブロックレベル要素も子要素として含んでいる要素については、特に難しくなります。この場合に重要となるのは、すべてのテキスト ノードは最も近いブロックレベルの祖先要素に属している (そして、その要素にのみ属している) という点です。[仕様](https://wicg.github.io/element-timing/#set-of-owned-text-nodes)では、各テキスト ノードはその[包含ブロック](https://developer.mozilla.org/docs/Web/CSS/Containing_block)を生成する要素に属するとして定義されています。{% endAside %}

### 最大視覚コンテンツはどのタイミングでレポートされますか？

Web ページは段階的に読み込まれる場合が多く、その結果としてページ内で最も大きい要素が変更される可能性があります。

こういった変更の可能性に対応するため、ブラウザーは最初のフレームを描画した直後に、最大のコンテンツ要素を特定する `largest-contentful-paint` タイプの [`PerformanceEntry`](https://developer.mozilla.org/docs/Web/API/PerformanceEntry) をディスパッチします。しかしながら、後続するフレームのレンダリング後に最大のコンテンツ要素が変更されるたびに、別の [`PerformanceEntry`](https://developer.mozilla.org/docs/Web/API/PerformanceEntry) をディスパッチします。

たとえば、テキストとヒーロー画像があるページでは、ブラウザーはテキストを最初にレンダリングします。その時点でブラウザーは `largest-contentful-paint` エントリをディスパッチしますが、その `element` プロパティはおそらく `<p>` または `<h1>` を参照するはずです。その後、ヒーロー画像の読み込みが完了すると 2 番目の `largest-contentful-paint` エントリがディスパッチされ、その `element` プロパティは `<img>` を参照するはずです。

重要なのは、ある要素についてレンダリングが完了し、ユーザーに対して表示された時点で初めて、その要素は最大のコンテンツ要素としてみなされるという点です。まだ読み込まれていない画像は、"レンダリングされた" とはみなされません。また、[フォント ブロック期](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display#The_font_display_timeline)に Web フォントを使用するテキスト ノードについても同様です。このような場合に、比較的サイズが小さい要素が最大のコンテンツ要素としてレポートされる可能性がありますが、よりサイズの大きい要素のレンダリングが完了すれば、別の `PerformanceEntry` オブジェクトを介してすぐにその要素がレポートされます。

遅れて読み込まれる画像やフォントに加えて、新しいコンテンツが利用可能になったタイミングでページが新しい要素を DOM に追加する場合があります。こういった新しい要素のいずれかがそれまでの最大のコンテンツ要素よりもサイズが大きくなる場合、新しい `PerformanceEntry` もレポートされます。

現時点での最大のコンテンツ要素がビューポートから削除された場合 (あるいは DOM から削除された場合)、よりサイズの大きい要素がレンダリングされない限り、その要素が引き続き最大のコンテンツ要素として見なされます。

{% Aside %}Chrome 88 より以前のバージョンでは削除された要素は最大のコンテンツ要素としては見なされず、現在の候補の削除が新しい `largest-contentful-paint` エントリのディスパッチのトリガーとなっていました。しかしながら、画像カルーセルのような一般的な UI パターンにおいては DOM 要素が削除されるケースが多いため、ユーザー体験をより正確に反映するためにこの指標はアップデートされました。詳細については、[CHANGELOG](https://chromium.googlesource.com/chromium/src/+/master/docs/speed/metrics_changelog/2020_11_lcp.md) を参照してください。{% endAside %}

ブラウザーは、ユーザーが (タップ、スクロール、キー押下などにより) ページを操作すると、すぐに新しいエントリのレポートを停止します。ユーザーの操作によって、ユーザーに対して表示される内容が変更される場合がよくあるからです (特にスクロールの場合)。

分析を行う場合には、直近にディスパッチされた `PerformanceEntry` のみをアナリティクス サービスにレポートする必要があります。

{% Aside 'caution' %}ユーザーはバックグラウンド タブでページを開くこともできるため、Largest Contentful Paint はユーザーがタブにフォーカスするまで発生しない可能性があり、そのタイミングはユーザーが最初にタブを読み込んだタイミングよりもずっと後になる可能性があります。{% endAside %}

#### 読み込み時間とレンダリング時間

セキュリティ上の理由から、[`Timing-Allow-Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Timing-Allow-Origin) ヘッダーを持たないクロスオリジン画像では画像のレンダリングのタイムスタンプは公開されません。その代わりに、読み込み時間のみが公開されます (この情報はその他多くの Web API を介してすでに公開されているためです)。

以下の[使用例](#measure-lcp-in-javascript)では、レンダリング時間が利用できない要素の処理方法について示しています。ただし、可能な限り[`Timing-Allow-Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Timing-Allow-Origin) ヘッダーを設定することを常に推奨しています。そうすることで、指標はより正確になります。

### 要素のレイアウトやサイズの変更は、どのように処理されますか？

新しいパフォーマンス エントリを計算してディスパッチする際に発生するパフォーマンス オーバーヘッドを低く抑えるために要素のサイズや位置を変更しても、新しい LCP 候補は生成されません。要素の初期サイズとビューポート内での位置のみが考慮されます。

つまり、最初は画面外にレンダリングされ、その後で画面内に移動した画像についてはレポートされない可能性があります。また、最初はビューポート内にレンダリングされていた要素が押し下げられて表示されなくなった場合でも、ビューポート内での初期サイズがレポートされます。

### 例

ここでは、いくつかの人気 Web サイトにおいて Largest Contentful Paint が発生する場合の例をご紹介します。

{% Img src="image/admin/bsBm8poY1uQbq7mNvVJm.png", alt="cnn.com の Largest Contentful Paint タイムライン", width="800", height="311" %}

{% Img src="image/admin/xAvLL1u2KFRaqoZZiI71.png", alt="techcrunch.com の Largest Contentful Paint タイムライン", width="800", height="311" %}

上記 2 つのタイムラインでは、コンテンツが読み込まれると、最大の要素が変更されます。1 つ目の例では新しいコンテンツが DOM に追加され、それにより最大の要素が変更されています。2 つ目の例ではレイアウトが変更され、それまで最も大きかったコンテンツがビューポートから削除されています。

遅れて読み込まれたコンテンツの方がすでにページ上に表示されているコンテンツよりもサイズが大きいといったケースはよく見られますが、必ずしもそうなるわけではありません。次の 2 つの例では、ページが完全に読み込まれる前に Largest Contentful Paint が発生しています。

{% Img src="image/admin/uJAGswhXK3bE6Vs4I5bP.png", alt="instagram.com の Largest Contentful Paint タイムライン", width="800", height="311" %}

{% Img src="image/admin/e0O2woQjZJ92aYlPOJzT.png", alt="google.com の Largest Contentful Paint タイムライン", width="800", height="311" %}

1 つ目の例では、Instagram のロゴの読み込みが比較的早い段階で完了し、その他のコンテンツが徐々に表示されていく中でもロゴが最大の要素となっています。Google の検索結果ページの例では、画像やロゴの読み込みが完了する前に表示されるテキストの段落が最大の要素となっています。個々の画像はすべてこの段落よりもサイズが小さいため、読み込みプロセス全体を通してこの段落がずっと最大の要素となっています。

{% Aside %}Instagram のタイムラインの最初のフレームで、カメラのロゴに緑色のボックスがないことにお気づきの方がいらっしゃるかもしれません。これは、この要素が `<svg>` 要素だからであり、`<svg>` 要素は現段階で LCP の候補とされていません。最初の LCP 候補は、2 つ目のフレームに含まれているテキストです。{% endAside %}

## LCP の測定方法

LCP は[ラボ環境](/user-centric-performance-metrics/#in-the-lab)または[実際のユーザー環境](/user-centric-performance-metrics/#in-the-field)で測定が可能で、以下のツールが使用できます。

### フィールド測定を実施するためのツール

- [Chrome User Experience Report](https://developer.chrome.com/docs/crux/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Search Console (Core Web Vitals Report)](https://support.google.com/webmasters/answer/9205520)
- [`web-vitals` JavaScript ライブラリ](https://github.com/GoogleChrome/web-vitals)

### ラボ測定を実施するためのツール

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [WebPageTest](https://webpagetest.org/)

### JavaScript を使用して LCP を測定する

JavaScript を使用した LCP の測定には、[Largest Contentful Paint API](https://wicg.github.io/largest-contentful-paint/) を使用することができます。以下の例では、`largest-contentful-paint` エントリをリッスンしてコンソールにログを記録する [`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) の作成方法を示しています。

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntries()) {
    console.log('LCP candidate:', entry.startTime, entry);
  }
}).observe({type: 'largest-contentful-paint', buffered: true});
```

{% Aside 'warning' %}

このコードは `largest-contentful-paint` エントリをコンソールにログとして記録する方法を示していますが、JavaScript を使用して LCP を測定する方法はより複雑です。詳細については、以下を参照してください。

{% endAside %}

上記の例では、ログとして記録された各 `largest-contentful-paint` エントリが現時点での LCP 候補を表しています。一般的には最後に発行されたエントリの `startTime` 値が LCP 値となりますが、必ずしもそうなるわけではありません。すべての `largest-contentful-paint` エントリが LCP の測定に有効なわけではありません。

次のセクションでは、API がレポートする内容と、指標の計算方法の違いについて説明します。

#### 指標と API の違い

- API はバックグラウンド タブで読み込まれているページに対して `largest-contentful-paint` エントリをディスパッチしますが、LCP を計算する場合にはそういったページを無視する必要があります。
- API はページがバックグラウンドに移行した後も `largest-contentful-paint` エントリをディスパッチし続けますが、LCP を計算する場合にはこういったエントリを無視する必要があります (要素が考慮されるのは、ページがずっとフォアグラウンドにあった場合のみです)。
- API は、ページが [Back/Forward Cache](/bfcache/#impact-on-core-web-vitals) から復元された場合の `largest-contentful-paint` エントリはレポートしませんが、これらはユーザーにとっては別々のページ訪問となるため、こういったケースにおいても LCP は測定される必要があります。
- API では iframe に含まれている要素は考慮されませんが、LCP を正確に測定するためにはこれらの要素も考慮に入れる必要があります。サブフレームが集約のために API を使用してその親フレームに `largest-contentful-paint` エントリをレポートすることができます。

こういった微妙な違いをすべて記憶していなくても、[`web-vitals` JavaScript ライブラリ](https://github.com/GoogleChrome/web-vitals)を使用して LCP を測定すれば、これらの違いを (可能な限り) 処理してくれます。

```js
import {getLCP} from 'web-vitals';

// 実行可能となった時点ですぐに LCP の測定やログ記録を実行します。
getLCP(console.log);
```

JavaScript を使用して LCP を測定する方法に関する詳細な例については、[`getLCP()` のソース コード](https://github.com/GoogleChrome/web-vitals/blob/master/src/getLCP.ts)を参照してください。

{% Aside %}場合によっては (クロスオリジン iframe など)、JavaScript を使用して LCP を測定することはできません。詳細については、`web-vitals` ライブラリの「[limitations](https://github.com/GoogleChrome/web-vitals#limitations) (制限事項)」セクションを参照してください。{% endAside %}

### 最も重要な要素が最もサイズの大きい要素ではない場合

場合によっては、ページ上で最も重要な要素が最もサイズの大きい要素ではないため、開発者の方がこれらの要素以外の要素のレンダリング時間を測定したいと考える可能性があります。これは、「[Custom Metrics](https://wicg.github.io/element-timing/) (カスタム指標)」の記事で説明されている [Element Timing API](/custom-metrics/#element-timing-api) を使用すれば可能です。

## LCP の改善方法

LCPは、主に次の 4 つの要因の影響を受けます。

- サーバーの応答時間が遅い
- レンダリングを妨げる JavaScript および CSS
- リソースの読み込み時間
- クライアント側のレンダリング

LCP の改善方法の詳細については、「[LCP を最適化する](/optimize-lcp/)」を参照してください。LCP の改善にもつながる個別のパフォーマンス改善手法に関するその他のガイダンスについては、以下を参照してください。

- [PRPL パターンを使用して読み込みを高速化する](/apply-instant-loading-with-prpl)
- [クリティカル レンダリング パスの最適化](/critical-rendering-path/)
- [CSS を最適化する](/fast#optimize-your-css)
- [画像を最適化する](/fast#optimize-your-images)
- [Web フォントを最適化する](/fast#optimize-web-fonts)
- [JavaScript を最適化する](/fast#optimize-your-javascript) (クライアント サイドでレンダリングを行うサイト向け)

## その他のリソース

- [Annie Sullivan](https://youtu.be/ctavZT87syI) による「[Chrome のパフォーマンス監視から得られた教訓](https://anniesullie.com/)」[performance.now()](https://perfnow.nl/) より (2019)

{% include 'content/metrics/metrics-changelog.njk' %}
