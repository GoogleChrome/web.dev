---
layout: post
title: 重要でないCSSを延期する
authors:
  - demianrenzulli
description: Critical Rendering Path (クリティカルレンダリングパス) を最適化し、FCP (First Contentful Paint) を改善する目的で重大でない CSS を延期する方法について学びます。
date: 2019-02-17
updated: 2020-06-12
tags:
  - performance
---

CSS ファイルは[レンダリングをブロックするリソース](https://developers.google.com/web/tools/lighthouse/audits/blocking-resources)です。つまり、ブラウザがページをレンダリングする前に、CSS ファイルを読み込み、処理する必要があります。不要に大きなスタイルを使うウェブページは、その分レンダリングの時間が長くなります。

[本ガイドでは、Critical Rendering Path (クリティカルレンダリングパス) を最適化し、FCP (First Contentful Paint) を改善する目的で重大でない CSS を延期する方法について学びます。](/critical-rendering-path/)

## 準最適な方法で CSS を読み込む

次の例には、テキストで構成される 3 つのパラグラフが非表示となっているアコーディオンが含まれています。それぞれのスタイルは、異なるクラスを使って定義されています。

{% Glitch { id: 'defer-css-unoptimized', path: 'index.html' } %}

このページは 8 つのクラスを持つ CSS ファイルを要求しますが、「目に見える」コンテンツをレンダリングするのに 8 個すべては必要ありません。

本ガイドの目的は、このページを最適化することです。そのため、**重要な**スタイルのみが同期され、読み込まれます。そして、残り (各パラグラフに適用されるスタイルなど) は非ブロック方式で読み込まれます。

## 評価

[ページで](https://defer-css-unoptimized.glitch.me/)[Lighthouse](/discover-performance-opportunities-with-lighthouse/#run-lighthouse-from-chrome-devtools) を実行し、[**パフォーマンス**] セクションに移動します。

レポートでは、**First Contentful Paint**メトリックの値が「1」となっており、Opportunties のセクションでは、**Eliminate render-blocking resources** が **style.css** を指しています。

<figure>{% Img src="image/admin/eZtuQ2IwL3Mtnmz09bmp.png", alt="最適化されていないページの Lighthouse レポート。FCP は「1」、Opportunities のセクションには「Eliminate blocking resources」と表示されている", width="800", height="640" %}</figure>

{% Aside %}このデモサイトに使用している CSS は非常に小さなものです。より大きな CSS ファイルを要求していて (本番環境ではいたって普通です)、かつ対象のページには**アバブ・ザ・フォールド**コンテンツ (スクロールしなくても閲覧できる画面領域) のレンダリング中に使用されなかった CSS ルールが少なくとも 2048 バイトあることが Lighthouse によって検出される場合は、**Remove Unused CSS** という提案が表示されます。{% endAside %}

この CSS がレンダリングをブロックする仕組みを視覚化するには、以下のことを行います。

1. Chrome で[対象のページ](https://defer-css-unoptimized.glitch.me/)を開きます。{% Instruction 'devtools-performance', 'ol' %}
2. [パフォーマンス]パネルで、[再**Reload**] (再読み込み) をクリックします。

結果のトレースでは、CSS の読み込みが完了した直後に **FCP** マーカーが配置されていることがわかります。

<figure>{% Img src="image/admin/WhpaDYb98Rf03JmuPenp.png", alt="最適化されていないページに対する DevTools のパフォーマンストレース。CSS の読み込み後に FCP が開始することを示している。", width="800", height="352", class="w -screenshot" %}</figure>

これは、ブラウザは、画面上にピクセルを 1 つ描画するのにも、すべての CSS の読み込みと処理が完了するのを待たなくてはいけないことを意味しています。

## 最適化

このページを最適化するには、どのクラスが「クリティカル」と見なされるかを知る必要があります。それには、[Coverage Tool](https://developer.chrome.com/docs/devtools/css/reference/#coverage) (カバレッジツール) を使用します。

1. DevTools で、`Control+Shift+P` または `Command+Shift+P` (Mac の場合) をクリックして、[Command Menu](https://developer.chrome.com/docs/devtools/command-menu/) (コマンドメニュー) を開きます。
2. 「Coverage」と入力し、**Show Coverage** (カバレッジを表示) を選択します。
3. [**Reload**] (再読み込み) ボタンをクリックして、ページを再読み込みし、カバレッジの取り込みを開始します。

<figure>{% Img src="image/admin/JTFK7wjhlTzd2cCfkpps.png", alt="CSS ファイルのカバレッジ、未使用のバイトが 55.9％ であることを示している。", width="800", height="82" %}</figure>

レポートをダブルクリックして、2 つの色に分けられたクラスを表示します。

- 緑 (**クリティカル**): これらは、ブラウザが表示可能なコンテンツ (タイトル、サブタイトル、アコーディオンボタンなど) をレンダリングするために必要なクラスです。
- 赤 (**重要ではない**): これらのスタイルは、すぐには表示されないコンテンツ (アコーディオン内のパラグラフなど) に適用されます。

この情報を使って CSS を最適化することにより、ブラウザがページを読み込んだ直後に重要なスタイルの処理を開始すると同時に重要でない CSS は先送りにできるようにします。

- カバレッジツールから取得したレポートにある緑色のクラス定義を抽出し、そうしたクラスをページの &lt;head&gt; タグ内の`<style>`ブロックに配置します。

```html
<style type="text/css">
.accordion-btn {background-color: #ADD8E6;color: #444;cursor: pointer;padding: 18px;width: 100%;border: none;text-align: left;outline: none;font-size: 15px;transition: 0.4s;}.container {padding: 0 18px;display: none;background-color: white;overflow: hidden;}h1 {word-spacing: 5px;color: blue;font-weight: bold;text-align: center;}
</style>
```

- 次に、次のパターンを適用して、残りのクラスを非同期に読み込みます。

```html
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>
```

これは CSS を読み込む標準的な方法ではありません。以下のような仕組みになっています。

- `link rel="preload" as="style"`は、スタイルシートを非同期的に要求します。`preload` の詳細については、[Preload critical assets guide (重要なアセットをプリロードする際のガイド)](/preload-critical-assets) をご覧ください。
- `link` タグ内の `onload` 属性により、CSS は読み込みが完了した時点で処理されるようになります。
- 使用した `onload` ハンドラを「null」にしておくと、一部のブラウザーでは、rel 属性を切り替えたときにハンドラを再度呼び出さないようにすることができます。
- `noscript` 要素内のスタイルシートへの参照は、JavaScript を実行しないブラウザーのフォールバックとして機能します。

{% Aside %}本ガイドでは、この最適化を実装するのにバニラコードを使用しました。実際の本番環境では、[loadCSS](https://github.com/filamentgroup/loadCSS/blob/master/README.md) などの関数を使用することをお勧めします。この動作をカプセル化できるほか、異なるブラウザでも適切に機能するので便利です。{% endAside %}

[結果のページ](https://defer-css-optimized.glitch.me/)は、ほとんどのスタイルが非同期に読み込まれる場合でも、前のバージョンと全く同じように見えます。以下は、インライン化されたスタイルと CSS ファイルに対する非同期リクエストを HTML ファイルに表示したものです。

<!-- Copy and Paste Me -->

{% Glitch { id: 'defer-css-optimized', path: 'index.html', previewSize: 0 } %}

## モニター

DevTools を使用して、[最適化されたページ](https://defer-css-optimized.glitch.me/)に対してもう一度**パフォーマンス**トレースを実行します。

**FCP** マーカーは、ページが CSS を要求する前に表示されます。つまり、ブラウザーは、CSS が読み込まれるのを待たずにページをレンダリングすることができます。

<figure>{% Img src="image/admin/0mVq3q760y37JSn2MmCP.png", alt="最適化されていないページに対する DevTools のパフォーマンストレース。CSS が読み込まれる前に FCP が開始されていることがわかります。", width="800", height="389" %}</figure>

最後のステップとして、最適化されたページに対して Lighthouse を実行します。

レポートを見れば、FCP ページが **0.2 秒**短縮されたことがわかります (20％ も改善しました！)。

<figure>{% Img src="image/admin/oTDQFSlfQwS9SbqE0D0K.png", alt="FCP の値が 0.8s になったことを示す Lighthouse のレポート。", width="800", height="324" %}</figure>

**Eliminate render-blocking resources** という提案は **Opportunities** セクションから **Passed Audits** セクションに移動されています。

<figure>{% Img src="image/admin/yDjEvZAcjPouC6I3I7qB.png", alt="'Eliminate blocing resources' が 'Passed Audits' セクションに移っていることを示す Lighthouse のレポート。", width="800", height="237" %}</figure>

## 今度のステップと参考資料

本ガイドでは、ページ内の未使用のコードを手動で抽出することにより、重要ではない CSS を延期する方法について学びました。本ガイドを補足する [extract critical CSS guide (重要な CSS を抽出するためのガイド)](/extract-critical-css/) では、重要な CSS を抽出できる人気の高いツールを紹介するほか、[コードラボ](/codelab-extract-and-inline-critical-css/)も含まれていますので、実際の動作をご覧いただけます。
