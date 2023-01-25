---
layout: post
title: レスポンシブ画像のプリロード
subhead: Chrome 73からは、link rel = "preload"とレスポンシブ画像を組み合わせて、画像をより速く読み込むことができます。
authors:
  - yoavweiss
description: |2-

  優れたユーザーエクスペリエンスを提供するためにレスポンシブ画像をプリロードする新しくエキサイティングな可能性について学びます。
hero: image/admin/QDCTiiyXE11bYSZMP3Yt.jpg
alt: さまざまなサイズの画像フレームがたくさんある壁。
date: 2019-09-30
tags:
  - blog
  - performance
  - images
feedback:
  - api
---

この記事では、私の2つのお気に入り、レスポンシブ画像*と*プリロードについて説明したいと思います。これらの機能の開発に深く関わった人間として、私はこの2つの機能が連携し合う様子を見るのをとても楽しみにしています！

## レスポンシブ画像の概要

幅300ピクセルの画面でウェブを閲覧しているときに、ページが幅1500ピクセルの画像をリクエストしたとします。あなたの画面では余分な解像度を使ってどうすることもできないため、そのページは、セルラーデータをたくさん無駄にしてしまいました。ブラウザが画面サイズより*少しだけ*幅が広いバージョン、たとえば325ピクセルをフェッチするというのが理想的でしょう。そうすれば、データを無駄にせずに、高解像度の画像が保証されます。また、画像の読み込みが速くなるので、まさに一石二鳥。[レスポンシブ画像](/serve-responsive-images/#serve-multiple-image-versions)を使用すると、ブラウザはさまざまな画像リソースをさまざまなデバイスにフェッチできます。[イメージCDN](/image-cdns/)を使用しない場合は、イメージごとに複数の村法を保存し、それらを`srcset`属性に指定しなくてはいけません。`w`値は、ブラウザに各バージョンの幅を指示します。デバイスに応じて、ブラウザは適切なものを選択できます。

```html
<img src="small.jpg" srcset="small.jpg 500w, medium.jpg 1000w, large.jpg 1500w" alt="…">
```

## プリロードの概要

[プリロード](/preload-critical-assets)を使用すると、HTMLで検出される前に、できるだけ早く読み込む必要がある重要なリソースをブラウザに知らせることができます。これは、スタイルシートに含まれているフォントや背景画像、スクリプトから読み込まれたリソースなど、簡単に見つけられないリソースを扱う場合に重宝します。

```html
<link rel="preload" as="image" href="important.png">
```

## レスポンシブ画像 + プリロード = 画像読み込みのスピードアップ

レスポンシブ画像とプリロードが利用できるようになってから、数年が経ちましたが、何か足らないものがありました。そうです、レスポンシブ画像をプリロードする方法がなかったのです。 [Chrome 73](https://developers.google.com/web/updates/2019/03/nic73#more)から、ブラウザは`img`タグを検出する前に、`srcset`に指定されたレスポンシブ画像の適切なバリアントをプリロードできるようになったのです！

サイトの構造によっては、画像の表示が大幅に高速化される可能性があります。JavaScriptを使用してレスポンシブ画像を遅延読み込みするサイトでテストを実行しました。プリロードを使ったことで、画像の読み込みがなんと1.2秒も速くなりました。

{% Aside %}

レスポンシブ画像は、[最近のすべてのブラウザでサポートされています](https://developer.mozilla.org/docs/Web/HTML/Element/img#Browser_compatibility)が、レスポンシブ画像のプリロードは、[Chromiumベースのブラウザでしかサポートされていません](https://developer.mozilla.org/docs/Web/HTML/Preloading_content#Browser_compatibility)。

{% endAside %}

## `imagesrcset`と`imagesizes`

レスポンシブ画像をプリロードできるよう、最近`<link>`要素に`imagesrcset`と`imagesizes`という属性が新しく追加されました。これらは、`<link rel="preload">`と一緒に使用され、`<img>`要素で使用される`srcset`と`sizes`のシンタックスと一致します。

たとえば、次のように指定されたレスポンシブ画像をプリロードするとします。

```html
<img src="wolf.jpg" srcset="wolf_400px.jpg 400w, wolf_800px.jpg 800w, wolf_1600px.jpg 1600w" sizes="50vw" alt="A rad wolf">
```

その場合は、HTMLの`<head>`タグに以下を追加すれば行えます。

```html
<link rel="preload" as="image" href="wolf.jpg" imagesrcset="wolf_400px.jpg 400w, wolf_800px.jpg 800w, wolf_1600px.jpg 1600w" imagesizes="50vw">
```

これにより、`srcset`と`sizes`が適用するのと同じリソース選択ロジックを使ってリクエストが開始されます。

## ユースケース

### 動的に注入するレスポンシブ画像のプリロード

スライドショーの一部としてヒーロー画像を動的に読み込むとします。どの画像が最初に表示されるかも分かっています。その場合、スクリプトが実行されるのを待ってから対象の画像を読み込むというのは避けたいものでしょう。そんなことをすると、ユーザーに表示されるのが遅れてしまうからです。

この問題は、画像ギャラリーが動的に読み込まれるウェブサイトで詳しく見ることができます。

1. [このサンプルウェブサイト](https://responsive-preload.glitch.me/no_preload.html)を新しいタブで開きます。

{% Instruction 'devtools-network', 'ol' %}

1. [**Throttle**]ドロップダウンリストで、[**Fast 3G**]を選択します。

2. [**Disable cache**] (キャッシュを無効にする) チェックボックスを無効にします。

3. ページを再読み込みします。

<figure>{% Img src="image/admin/cyocwRmB3XlfY26vUZ5h.png", alt="Chrome DevTools Networkパネルのスクリーンショット。", width="800", height="481" %}<figcaption>この滝は、ブラウザがスクリプトを実行し終えるまで画像の読み込みが始まらないため、画像が最初にユーザーに表示されるタイミングを不要に遅らせていることを示しています。</figcaption></figure>

`preload`を使用すると、画像の読み込みが事前に開始され、ブラウザで表示する必要があるときにすでに読み込みが完了している可能性が高いため、ここでは重宝します。

<figure>{% Img src="image/admin/rIRdFypLWf1ljMaXCVCs.png", alt="Chrome DevTools Networkパネルのスクリーンショット。", width="800", height="481" %}<figcaption>この滝は、最初の画像の読み込みがスクリプトの実行と同時に開始されているため、不要な遅延が回避され、画像が速く表示されていることを示しています。</figcaption></figure>

プリロードによって生じる違いを確認するには、最初の例の手順に従って、動的に読み込まれた同じ画像ギャラリーを検査できますが、[プリロードされた最初の画像](https://responsive-preload.glitch.me/preload.html)から始めます。

{% Aside %}この問題を回避する別の方法として、マークアップベースのカルーセルを使用して、[ブラウザのプリローダー](https://hacks.mozilla.org/2017/09/building-the-dom-faster-speculative-parsing-async-defer-and-preload/)に必要なリソースを取得させるという術があります。ただし、このアプローチは常に実用的であるとは限りません（マークアップベースではない既存のコンポーネントを再利用している場合など）。{% endAside %}

### image-setを使用した背景画像のプリロード

画面密度ごとに異なる背景画像を用意してある場合は、CSSの`image-set`構文を使用すればそれを指定できます。ブラウザは、画面の[DPR](https://developer.mozilla.org/docs/Web/API/Window/devicePixelRatio)に基づいて表示するものを選択できます。

```css
background-image: image-set( "cat.png" 1x, "cat-2x.png" 2x);
```

{% Aside %}

上記の構文では、ChromiumベースのブラウザーとWebKitベースのブラウザーの両方において、この機能を使うにはベンダープレフィックスが必要であることが無視されています。この機能を使うことを予定している方は、[Autoprefixer](https://github.com/postcss/autoprefixer)を使用して、これに自動的に対処することを検討してください。

{% endAside %}

CSSの背景画像は、ブラウザがページ内の`<head>`タグにあるすべてのCSSをダウンロードし、処理し終わるまで検出されないという点が問題となっています。かなりの数におよぶ場合があります。

この問題は、サンプルウェブサイトに[レスポンシブ背景画像](https://responsive-preload.glitch.me/background_no_preload.html)使って確認できます。

<figure>{% Img src="image/admin/7sjFt1RsoEOKn5zlS5zb.png", alt="Chrome DevTools Networkパネルのスクリーンショット。", width="800", height="451" %}<figcaption>この例では、CSSが完全にダウンロードされるまで画像のダウンロードが開始されないため、画像の表示に不必要な遅れが生じています。</figcaption></figure>

レスポンシブ画像のプリロードは、こうした画像をより高速に読み込むためのシンプルな方法で、小技などは一切不要です。

```html
<link rel=preload href=cat.png as=image imagesrcset="cat.png 1x, cat-2x.png 2x">
```

前の例に[プリロードされたレスポンシブ背景画像](https://responsive-preload.glitch.me/background_preload.html)を使った場合の動作を確認できます。

<figure>{% Img src="image/admin/dOI6EmChfahBujnZOke7.png", alt="Chrome DevTools Networkパネルのスクリーンショット。", width="800", height="439" %}<figcaption>ここでは、画像とCSSのダウンロードを同時に開始しているため、遅延が回避され、画像がより速く読み込まれています。</figcaption></figure>

## レスポンシブ画像を実際にプリロードしてみる

レスポンシブ画像をプリロードするということは、理論的には高速化を図るということですが、実際には何をしていることになるのでしょうか？

その答えを見つけるために、私は[デモPWAショップ](https://github.com/GoogleChromeLabs/sample-pie-shop)のコピーを2([画像をプリロードしないもの](https://20190710t144416-dot-pie-shop-app.appspot.com/apparel)と[画像の一部だけをプリロードするもの](https://20190710t132936-dot-pie-shop-app.appspot.com/apparel))を作成しました。サイトはJavaScriptを使用して画像を遅延読み込みするため、最初のビューポートに入る画像を事前読み込みすることに効果を得られる可能性があります。

そして、[プリロードなしの場合](https://www.webpagetest.org/result/190710_VM_30b9d4c993a1e60befba17e1261ba1ca/)と[イメージをプリロードする場合](https://www.webpagetest.org/result/190710_7B_a99e792121760f81a270b4b9c847797b/)について、次の結果が得られました。生の数値を見ると、[Start Render](https://github.com/WPO-Foundation/webpagetest-docs/blob/main/src/getting-started.md#start-render)には変化が見られませんが、[Speed Indexは](https://developer.chrome.com/docs/lighthouse/performance/speed-index/)わずかに改善されています (画像がより速く到着するため、273ミリ秒へと改善。しかも、ピクセル領域の大きなチャンクを占めていません) が、一番重要な違いを示しているのは、[Last Painted Hero](https://github.com/WPO-Foundation/webpagetest/blob/master/docs/Metrics/HeroElements.md)メトリックで、1.2秒も改善されています。 🎉🎉

もちろん、違いを視覚的に示すのであれば、フィルムストリップを使って比較するのが一番です。

<figure>{% Img src="image/admin/sXyZOvsNoAY0K2NRqT4U.png", alt="プリロードされた画像が約1.5秒速く表示されることをを示すWebPageTestのフィルムストリップによる比較を示したスクリーンショット。", width="800", height="328" %}<figcaption>フィルムストリップは、画像をプリロードすると到着までの時間が大幅に短縮されるため、ユーザーエクスペリエンスが大幅に向上することを示しています。</figcaption></figure>

## プリロードと`<picture>` ？

レスポンシブ画像に詳しい方は、「 [`<picture>`](https://developer.mozilla.org/docs/Web/HTML/Element/picture)についてはどうなのか？」と疑問に思われるかもしれません。

Web Performance Working Groupは、`srcset`と`sizes`にプリロードと同様のものを追加することについて話し合っていますが、[「アートディレクション」](/codelab-art-direction/)のユースケースの課題に対処するはずの`<picture>`要素は考慮されていません。

このユースケースが「無視」されているのはどうしてなのでしょう？

そのユースケースを解決することにも関心はありますが、[先に解決すべき技術的な問題](https://calendar.perfplanet.com/2018/how-the-sausage-is-made-webperfwg-meeting-summary/)がまだいくつもあります。つまり、ここでの解決策が非常に複雑になるということです。その上、そのユースケースについては、今日この場でほぼ一通り対処できそうです。ちょっとした小技が必要になりますが (下をご覧ください)。

そのため、Web Performance WGは、まず最初に`srcset`をアップロードし、`picture`を同等にサポートする需要が生まれるどうかを確認することにしています。

`<picture>`をプリロードしなくてはいけなくなった場合は、回避策として次の手段が効果を発揮する可能性があります。

以下のようなコードがある場合。

```html
<picture>
    <source src="small_cat.jpg" media="(max-width: 400px)">
    <source src="medium_cat.jpg" media="(max-width: 800px)">
    <img src="huge_cat.jpg">
</picture>
```

`<picture>`要素のロジック (正確には、画像ソース選択ロジック) は、`<source>`要素の`media`属性を順番に確認していき、最初に一致するものを見つけたら、アタッチされているリソースを使用するというものです。

レスポンシブプリロードには「順序」または「最初の一致」の概念がないため、ブレークポイントは次のように変換する必要があります。

```html
<link rel="preload" href="small_cat.jpg" as="image" media="(max-width: 400px)">
<link rel="preload" href="medium_cat.jpg" as="image" media="(min-width: 400.1px) and (max-width: 800px)">
<link rel="preload" href="large_cat.jpg" as="image" media="(min-width: 800.1px)">
```

## 概要

レスポンシブ画像のプリロードは、以前なら必要であった小技を使わなくてもレスポンシブ画像をプリロードできる新しい可能性を与えてくれます。これは、スピードを重視する開発者のツールボックスに加わった重要な新機能であり、私たちは、それを利用することで、ユーザーにできるだけ速く表示したい重要な画像を必要なタイミングで確実に表示することができます。
