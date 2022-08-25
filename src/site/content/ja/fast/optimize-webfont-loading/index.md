---
layout: post
title: WebFont の読み込みとレンダリングを最適化する
authors:
  - ilyagrigorik
date: 2019-08-16
updated: 2020-07-03
description: この記事では、ページの読み込み時に WebFonts が使用できない場合に、レイアウトのずれや空白のページを防ぐために WebFonts を読み込む方法について説明します。
tags:
  - performance
  - fonts
feedback:
  - api
---

スタイルのバリエーションで、不要な可能性のあるものすべてを含む「完全な」WebFont に加え、結局未使用となり得るすべてのグリフが使用されていると、ダウンロードのデータ量は簡単に数メガバイトに跳ね上がる場合があります。この記事では、ユーザーが使用するものだけをダウンロードできるように、WebFonts の読み込みを最適化する方法について説明します。

大きなファイルにすべてのバリエ―ションが含まれるという問題に対処できるよう、`@font-face` CSS ルールは、フォントファミリをリソースのコレクションに分割できるように設計されています。Unicode サブセットやスタイルの個別のバリエーションなどがその例にあたります。

ブラウザは、こうした宣言をもとに、必要なサブセットとバリエーションを見つけ出し、テキストのレンダリングに最小限必要なセットをダウンロードします。とても便利な機能です。ただし、注意が足りないと、重要なレンダリングパスにパフォーマンスのボトルネックが発生し、テキストのレンダリングが遅れる可能性があります。

### デフォルトの動作

フォントの遅延読み込みは、テキストのレンダリングを遅れさせる可能性があると考えられます。ブラウザは、テキストをレンダリングするために必要なフォントリソースを認識する前に、DOM ツリーと CSSOM ツリーに依存する[レンダリングツリー](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/render-tree-construction)を構築する必要があります。その結果、フォントリクエストは他の重要なリソースの後まで処理されず、ブラウザはリソースがフェッチされるまでテキストのレンダリングができないようブロックされるという場合があります。

{% Img src="image/admin/NgSTa9SirmikQAq1G5fN.png", alt="フォントのクリティカルレンダリングパス", width="800", height="303" %}

1. ブラウザが HTML ドキュメントを要求します。
2. ブラウザが HTML レスポンスの解析と DOM の構築を開始します。
3. ブラウザが CSS、JS、およびその他のリソースを検出し、リクエストをディスパッチします。
4. すべての CSS コンテンツが受信された後にブラウザが CSSOM を構築し、それを DOM ツリーと組み合わせてレンダリングツリーを構築します。
    - フォントリクエストは、レンダリングツリーが、ページ上で指定されたテキストをレンダリングするのに必要なフォントバリエーションを示した後にディスパッチされます。
5. ブラウザはレイアウトを実行し、コンテンツを画面に描画します。
    - フォントがまだ使用できない場合、ブラウザはテキストピクセルを一切レンダリングしない可能性があります。
    - フォントが使用可能になると、ブラウザはテキストピクセルを描画します。

ブラウザがページレイアウトをレンダリングしながらも、テキストを完全に省いてしまう「空白テキスト問題」は、レンダリングツリーが構築された直後に完了し得るページコンテンツの最初の描画とフォントリソースに対するリクエストとの間で起る「競合」が原因で発生します。

WebFonts をプリロードし、`font-display` を使用することにより、フォントが利用できない場合のブラウザーの動作をコントロールすれば、フォントの読み込みによって発生する空白ページやレイアウトのずれを防ぐことができます。

### WebFont リソースをプリロードする

事前に分かっている URL でホストされている特定の WebFont がページに必要になる可能性が高い場合は、[リソースの優先順位設定](https://developers.google.com/web/fundamentals/performance/resource-prioritization)を行うと便利です。`<link rel="preload">` を使用すると、クリティカルレンダリングパスの早い段階で、CSSOM が作成されるのを待たずに、WebFont のリクエストがトリガーされます。

### テキストレンダリングの遅延をカスタマイズする

プリロードを実行すれば、ページのコンテンツがレンダリングされるタイミングで WebFont が使用可能になる可能性は高まりますが、それが保証される訳ではありません。どちらにしろ、まだ利用できない `font-family` が使用されるテキストをレンダリングするブラウザの動作を考慮する必要があります。

[Avoid invisible text during font loading](/avoid-invisible-text/) と題した記事を読めば、ブラウザのデフォルト動作には一貫性がないことがわかります。最新のブラウザであれば、[`font-display`](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display) を使って希望の動作を指示できます。

一部のブラウザに実装されるフォントタイムアウトの既存の動作と同様に、`font-display` を使用すれば、フォントダウンロードの存続期間を主に次の 3 つ期間に分割します。

1. 最初のピリオドは**フォントブロック期間**です。この期間中にフォントフェイスが読み込まれていない場合、それを使用しようとする要素は、代わりに非表示のフォールバックフォントフェイスを使ってレンダリングする必要があります。フォントフェイスは、ブロック期間中に正常に読み込まれると、通常どおり使用されます。
2. **フォントスワップ期間**は、フォントブロック期間の直後に発生します。この期間中にフォントフェイスが読み込まれていない場合、それを使用しようとする要素は、代わりにフォールバックフォントフェイスを使ってレンダリングする必要があります。フォントフェイスは、スワップ期間中に正常に読み込まれると、通常どおり使用されます。
3. **フォント失敗期間**は、フォントスワップ期間の直後に発生します。この期間の開始時にフォントフェイスが読み込まれていない場合は、読み込み失敗とされ、通常のフォントへのフォールバックが発生します。それ以外の場合、フォントフェイスは通常どおり使用されます。

こうした期間を理解すれば、`font-display` を使用して、ダウンロードされたのか、またはどのタイミングでダウンロードされたのかに応じて、どのようにフォントをレンダリングすべきかを判断できます。

`font-display`プロパティを使用するには、`@font-face` ルールに追加します。

```css
@font-face {
  font-family: 'Awesome Font';
  font-style: normal;
  font-weight: 400;
  font-display: auto; /* or block, swap, fallback, optional */
  src: local('Awesome Font'),
       url('/fonts/awesome-l.woff2') format('woff2'), /* will be preloaded */
       url('/fonts/awesome-l.woff') format('woff'),
       url('/fonts/awesome-l.ttf') format('truetype'),
       url('/fonts/awesome-l.eot') format('embedded-opentype');
  unicode-range: U+000-5FF; /* Latin glyphs */
}
```

現在、`font-display` は次の値をサポートしています。

- `auto`
- `block`
- `swap`
- `fallback`
- `optional`

フォントのプリロードと `font-display` プロパティについて詳しくは、以下の記事を参照してください。

- [Avoid invisible text during font loading (フォントの読み込み中に非表示のテキストが表示されるのを避ける)](/avoid-invisible-text/)
- [Controlling font performance using font-display (font-display を使用したフォントパフォーマンスの制御)](https://developers.google.com/web/updates/2016/02/font-display)
- [Prevent layout shifting and flashes of invisibile text (FOIT) by preloading optional fonts (オプションのフォントをプリロードすることにより、レイアウトのずれやテキストが一瞬見えなくなる現象 (FOIT) を防ぐ)](/preload-optional-fonts/)

### Font Loading API

`<link rel="preload">`と`font-display`を一緒に使用すると、オーバーヘッドをあまり追加せずに、フォントの読み込みとレンダリングを細かく制御できます。ただし、追加のカスタマイズが必要で、かつ JavaScript の実行により発生するオーバーヘッドを負担しても構わないなら、別の選択肢を使えます。

[Font Loading API](https://www.w3.org/TR/css-font-loading/) は、CSS フォントフェイスを定義および操作し、ダウンロードの進行状況を追跡し、デフォルトの遅延読み込み動作をオーバーライドするためのスクリプトインターフェイスを提供します。たとえば、特定のフォントバリエーションが必要だと確信している場合は、それを定義して、フォントリソースを直地にフェッチするようブラウザに指示することができます。

```javascript
var font = new FontFace("Awesome Font", "url(/fonts/awesome.woff2)", {
  style: 'normal', unicodeRange: 'U+000-5FF', weight: '400'
});

// don't wait for the render tree, initiate an immediate fetch!
font.load().then(function() {
  // apply the font (which may re-render text and cause a page reflow)
  // after the font has finished downloading
  document.fonts.add(font);
  document.body.style.fontFamily = "Awesome Font, serif";

  // OR... by default the content is hidden,
  // and it's rendered after the font is available
  var content = document.getElementById("content");
  content.style.visibility = "visible";

  // OR... apply your own render strategy here...
});
```

また、([`check()`](https://www.w3.org/TR/css-font-loading/#font-face-set-check)) メソッドを使ってフォントの状態を確認し、そのダウンロードの進行状況を追跡できるため、ページにテキストをレンダリングするためのカスタム戦略を定義することもできます。

- フォントが使用可能になるまで、すべてのテキストレンダリングをホールドできます。
- フォントごとにカスタムタイムアウトを実装できます。
- フォールバックフォントを使用して、レンダリングのブロックを解除し、フォントが使用可能になった後で目的のフォントを使用する新しいスタイルを挿入できます。

何よりも、ページ上のさまざまなコンテンツに対して上記の戦略を組み合わせたり、マッチさせたりすることができます。たとえば、フォントが使用可能になるまで、一部のセクションでテキストのレンダリングを遅らせ、フォールバックフォントを使用し、フォントのダウンロードが完了した後に再度レンダリングすることができます。

{% Aside %}Font Loading API は、[古いブラウザでは使用できません](http://caniuse.com/#feat=font-loading)。たとえ、JavaScript の他の依存関係から負担するオーバーヘッドが増えるとしても、[FontLoader polyfill](https://github.com/bramstein/fontloader) または [WebFontloader library](https://github.com/typekit/webfontloader) を使用して同様の機能を提供することを検討してください。{% endAside %}

### 適切なキャッシングは必須

フォントリソースは、通常、頻繁に更新されない静的リソースです。その結果、最大有効期限が長い場合に最適です。すべてのフォントリソースに対して、[条件付き ETag ヘッダー](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#validating-cached-responses-with-etags)または[最適なキャッシュコントロールポリシー](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching#cache-control)を必ず指定しましょう。

ウェブアプリケーションが[サービスワーカー](https://developer.chrome.com/docs/workbox/service-worker-overview/)を使用する場合は、ほぼすべてのユースケースにおいて、[キャッシュファースト戦略](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-then-network)を用いてフォントリソースを提供するのが適切です。

フォントを保存するために、[`localStorage`](https://developer.mozilla.org/docs/Web/API/IndexedDB_API)  や [IndexedDB](https://developer.mozilla.org/docs/Web/API/IndexedDB_API) を使用するのは避けましょう。どちらも、パフォーマンスに問題があります。ブラウザの HTTP キャッシュは、ブラウザにフォントリソースを提供するのに最も適した、最も堅牢なメカニズムを提供します。

## WebFont の読み込みチェックリスト

- **`<link rel="preload">` 、`font-display` 、または Font Loading API を使用して、フォントの読み込みとレンダリングをカスタマイズする**。デフォルトの遅延読み込み動作は、テキストのレンダリングを遅らせる場合があります。こうしたウェブプラットフォーム機能を使用すれば、ページ上のさまざまなコンテンツに対してカスタムレンダリングとタイムアウト連略を指定できます。
- **再検証のポリシーと最適なキャッシュのポリシーを指定する**。フォントは、更新頻度の低い静的リソースです。異なるページ間でフォントを効率的に再利用できるように、長い間に渡って保存される最長有効期間のタイムスタンプと再検証トークンがブラウザによって提供されていることを確認してください。 サービスワーカーを使用する場合は、キャッシュファースト戦略が適切です。

## Lighthouse を使用した WebFont の読み込み動作の自動テスト

[Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) を使用すると、ウェブフォントを最適化するためのベストプラクティスが実践されていることを確認するプロセスを自動化できます。

以下の監査を実施すれば、ウェブページでウェブフォントを最適化するためのベストプラクティスが長期に渡って実践されていることが保証されます。

- [Preload key requests (キーリクエストをプリロードする)](/uses-rel-preload/)
- [Uses inefficient cache policy on static assets (静的アセットに非効率的なキャッシュポリシーが使用されている)](/uses-long-cache-ttl/)
- [All text remains visible during WebFont loads (WebFont の読み込み中もすべてのテキストが表示されたままになる)](/font-display/)
