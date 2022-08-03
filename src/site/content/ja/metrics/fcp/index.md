---
layout: post
title: First Contentful Paint (FCP)
authors:
  - philipwalton
date: 2019-11-07
updated: 2022-07-18
description: この投稿では、First Contentful Paint (視覚コンテンツの初期表示時間、FCP) という指標について紹介し、その測定方法に関する説明を行います。
tags:
  - performance
  - metrics
---

{% Aside %}First Contentful Paint (視覚コンテンツの初期表示時間、FCP) は、[知覚される読み込み速度](/user-centric-performance-metrics/#types-of-metrics)を測定するための重要なユーザーを中心とした指標です。これは、FCP がページの読み込みタイムラインにおいて最初にコンテンツが読み込まれたと思われる時点 (ユーザーが画面上に何らかのコンテンツが表示されたことを確認するタイミング) を示すためです。FCP を高速にすることで、そのページが[動作している](/user-centric-performance-metrics/#questions)ことをユーザーに確信させることができるようになります。{% endAside %}

## FCP とは？

First Contentful Paint (FCP) 指標は、ページの読み込みが開始されてからページ内のコンテンツのいずれかの部分が画面上にレンダリングされるまでの時間を測定します。この指標における "コンテンツ" は、テキスト、画像 (背景画像を含む)、`<svg>` 要素、白以外の `<canvas>` 要素のことを指しています。

{% Img src="image/admin/3UhlOxRc0j8Vc4DGd4dt.png", alt="google.com の FCP タイムライン", width="800", height="311", linkTo=true %}

上の読み込みタイムラインでは、FCP は 2 フレーム目で発生しています。これが、最初のテキストや画像要素が画面にレンダリングされるタイミングです。

コンテンツの一部がレンダリングされたものの、すべてのコンテンツがレンダリングされたわけではないことがわかります。これは、*First* Contentful Paint (FCP) と、ページのメイン コンテンツの読み込み完了タイミングの測定が目的となる *[Largest Contentful Paint (LCP)](/lcp/)* の重要な違いです。

<picture>
  <source srcset="{{ "image/eqprBhZUGfb8WYnumQ9ljAxRrA72/V1mtKJenViYAhn05WxqR.svg" | imgix }}" media="(min-width: 640px)" width="400", height="100">
  {% Img src="image/eqprBhZUGfb8WYnumQ9ljAxRrA72/vQKpz0S2SGnnoXHMDidj.svg", alt="良好なFCP値は1.8秒以下、不良な値は3.0秒を超え、その間の値は改善が必要", width="400", height="300" %}
</picture>

### FCP における良いスコアとは？

良好なユーザー体験を提供するために、サイトは First Contentful Paint が **1.8 秒**以下になるように努力する必要があります。ほぼすべてのユーザーに対してこの目標値を確実に達成するためには、モバイル デバイスとデスクトップ デバイスに分けた上で、総ページロード数の 75 パーセンタイルをしきい値として設定します。

## FCP の測定方法

FCP は[ラボ環境](/user-centric-performance-metrics/#in-the-lab)または[実際のユーザー環境](/user-centric-performance-metrics/#in-the-field)で測定が可能で、以下のツールが使用できます。

### フィールド測定を実施するためのツール

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Chrome User Experience Report](https://developer.chrome.com/docs/crux/)
- [Search Console (Core Web Vitals Report)](https://webmasters.googleblog.com/2019/11/search-console-speed-report.html)
- [`web-vitals` JavaScript ライブラリ](https://github.com/GoogleChrome/web-vitals)

### ラボ測定を実施するためのツール

- [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### JavaScript を使用して FCP を測定する

JavaScript を使用した FCP の測定には、[Paint Timing API](https://w3c.github.io/paint-timing/) を使用することができます。以下の例では、`first-contentful-paint` という名前の `paint` エントリをリッスンし、コンソールにログを記録する [`PerformanceObserver`](https://developer.mozilla.org/docs/Web/API/PerformanceObserver) の作成方法を示しています。

```js
new PerformanceObserver((entryList) => {
  for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
    console.log('FCP candidate:', entry.startTime, entry);
  }
}).observe({type: 'paint', buffered: true});
```

{% Aside 'warning' %}

このコードは `first-contentful-paint` エントリをコンソールにログとして記録する方法を示していますが、JavaScript を使用して FCP を測定する方法はより複雑です。詳細については、以下を参照してください。

{% endAside %}

上記の例では、ログに記録されている `first-contentful-paint` エントリが、最初の視覚コンテンツ要素が描画されるタイミングを教えてくれます。ただし、このエントリが FCP の測定に有効とはならない場合もあります。

次のセクションでは、API がレポートする内容と、指標の計算方法の違いについて説明します。

#### 指標と API の違い

- API はバックグラウンド タブで読み込まれているページに対しても `first-contentful-paint` エントリをディスパッチしますが、FCP を計算する場合には、そういったページは無視する必要があります (最初の描画タイミングが考慮されるのは、ページがずっとフォアグラウンドにあった場合のみです)。
- API は、ページが [Back/Forward Cache](/bfcache/#impact-on-core-web-vitals) から復元された場合の `first-contentful-paint` エントリはレポートしませんが、これらはユーザーにとっては別々のページ訪問となるため、こういったケースにおいても FCP は測定される必要があります。
- API では [クロス オリジンの iframe の描画タイミングはレポートされない場合があります](https://w3c.github.io/paint-timing/#:~:text=cross-origin%20iframes)が、FCP を正確に測定するためにはすべてのフレームを考慮に入れる必要があります。サブフレームが集約のために API を使用してその親フレームに描画タイミングをレポートすることができます。

こういった微妙な違いをすべて記憶していなくても、[`web-vitals` JavaScript ライブラリ](https://github.com/GoogleChrome/web-vitals)を使用して FCP を測定すれば、これらの違いを (可能な限り) 処理してくれます。

```js
import {getFCP} from 'web-vitals';

// 実行可能となった時点ですぐに FCP の測定やログ記録を実行します。
getFCP(console.log);
```

JavaScript を使用して FCP を測定する方法に関する詳細な例については、[`getFCP()` のソース コード](https://github.com/GoogleChrome/web-vitals/blob/master/src/getFCP.ts)を参照してください。

{% Aside %}場合によっては (クロスオリジン iframe など)、JavaScript を使用して FCP を測定することはできません。詳細については、`web-vitals` ライブラリの「[制限事項](https://github.com/GoogleChrome/web-vitals#limitations)」セクションを参照してください。{% endAside %}

## FCP の改善方法

特定のサイトについて FCP の改善方法を把握するには、Lighthouse でパフォーマンス監査を実行し、そこで推奨される具体的な [Opportunities](/lighthouse-performance/#opportunities) (改善機会) や [Diagnostics](/lighthouse-performance/#diagnostics) (診断) に注目します。

FCP の (あらゆるサイトに共通する) 一般的な改善方法については、以下のパフォーマンス ガイドを参照してください。

- [レンダリングをブロックするリソースを排除する](/render-blocking-resources/)
- [CSS を圧縮する](/unminified-css/)
- [使用されていない CSS を削除する](/unused-css-rules/)
- [必要なオリジンに事前接続する](/uses-rel-preconnect/)
- [サーバーの応答時間 (TTFB) を短縮する](/ttfb/)
- [複数のページ リダイレクトを避ける](/redirects/)
- [キー リクエストを事前に読み込む](/uses-rel-preload/)
- [過大なネットワーク ペイロードを回避する](/total-byte-weight/)
- [効率的なキャッシュ ポリシーを使用して静的なアセットを配信する](/uses-long-cache-ttl/)
- [過大な DOM サイズを回避する](/dom-size/)
- [クリティカルなリクエストの深さを最小化する](/critical-request-chains/)
- [Web フォントの読み込み中にテキストが表示されたままになっていることを確認する](/font-display/)
- [リクエスト数を少なく、転送サイズを小さく維持する](/resource-summary/)

{% include 'content/metrics/metrics-changelog.njk' %}
