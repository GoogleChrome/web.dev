---
title: 要素の document.onresize のような ResizeObserver
subhead: "`ResizeObserver` を使って、要素のサイズが変更されたことを知ることができます。"
authors:
  - surma
  - joemedley
date: 2016-10-07
updated: 2020-05-26
hero: image/admin/WJ69aw9UMPwsc7ShYvif.jpg
alt: プランターで成長する植物。
description: "`ResizeObserver` は、要素のコンテンツの矩形が変更されたときにそのことを通知するため、それに合わせて反応することができます。"
tags:
  - blog
  - dom
  - javascript
  - layout
  - rendering
feedback:
  - api
---

`ResizeObserver` が導入される前、ビューポートのサイズ変更の通知を受けるには、ドキュメントの `resize` にリスナーをアタッチする必要がありました。その上で、イベントハンドラーで、その変更によって影響を受けた要素を特定し、特定のルーチンを呼び出して適切に対応していました。サイズ変更後の要素の新しいサイズが必要な場合は、`getBoundingClientRect()` または `getComputedStyle()` を呼び出す必要がありましたが、この場合、*すべて*の読み取りと*すべて*の書き込みのバッチ処理を行わないと、レイアウトがスラッシングする可能性がありました。

この方法は、メインウィンドウのサイズを変更せずに要素が要素のサイズが変更するというケースもカバーしていませんでした。たとえば、新しい子を追加したり、要素の `display` スタイルを `none`に設定したり、または同様のアクションを実行すると、要素、その兄弟、またはその祖先のサイズが変更されてしまいます。

これが、 `ResizeObserver` が便利なプリミティブである理由です。これは、変化の原因に関係なく、監視されている要素のサイズの変化に反応します。監視されている要素の新しいサイズへのアクセスも提供します。

## API

上記で述べた `Observer` 接尾辞を持つすべての API には、単純な API 設計があります。`ResizeObserver` も例外ではありません。`ResizeObserver` オブジェクトを作成し、コンストラクターにコールバックを渡します。コールバックには `ResizeObserverEntry` オブジェクトの配列（監視されている要素当たり 1 つのエントリ）が渡されます。

```js
var ro = new ResizeObserver(entries => {
  for (let entry of entries) {
    const cr = entry.contentRect;
    console.log('Element:', entry.target);
    console.log(`Element size: ${cr.width}px x ${cr.height}px`);
    console.log(`Element padding: ${cr.top}px ; ${cr.left}px`);
  }
});

// Observe one or multiple elements
ro.observe(someElement);
```

## もう少し詳しく

### 何がレポートされていますか？

通常、 [`ResizeObserverEntry`](https://developer.mozilla.org/docs/Web/API/ResizeObserverEntry)は、`contentRect` と呼ばれるプロパティを介して要素のコンテンツボックスをレポートし、これにより [`DOMRectReadOnly`](https://developer.mozilla.org/docs/Web/API/DOMRectReadOnly) オブジェクトが返されます。このコンテンツボックスがコンテンツを配置できるボックスであり、パディングを差し引いたボーダーボックスです。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/CKxpe8LNq2CMPFdtLtVK.png", alt="CSS ボックスモデルの図。", width="727", height="562" %}</figure>

`ResizeObserver` は `contentRect` とパディングの両方のサイズを*レポート*しますが、`contentRect` のみを*監視*することに注意しておくことが重要です。`contentRect`  を要素の境界ボックスと*混同しない*ようにしましょう。`getBoundingClientRect()` によってレポートされる境界ボックスは、要素とその子孫をすべて含むボックスです。SVG はこのルールの例外であり、`ResizeObserver` は境界ボックスのサイズをレポートします。

Chrome 84 の時点では、`ResizeObserverEntry` には、より詳細な情報を提供する 3 つの新しいプロパティが導入されています。これらのプロパティはそれぞれ、`blockSize` プロパティと `inlineSize` プロパティを含む `ResizeObserverSize` オブジェクトを返します。これは、コールバックが呼び出されたときに監視されている要素に関する情報です。

- `borderBoxSize`
- `contentBoxSize`
- `devicePixelContentBoxSize`

将来的には、複数列のシナリオで発生する複数のフラグメントを持つ要素をサポートできることが期待されるため、これらの項目はすべて読み取り専用配列を返すようになっています。今のところ、これらの配列には 1 つの要素しか含まれていません。

これらのプロパティのプラットフォームサポートは制限され[ていますが、](https://developer.mozilla.org/docs/Web/API/ResizeObserverEntry#Browser_compatibility)[Firefox はすでに最初の2つをサポートしています](https://developer.mozilla.org/docs/Web/API/ResizeObserverEntry#Browser_compatibility)。

### レポートされるタイミングは？

仕様では、 `ResizeObserver` がペイント前とレイアウト後にすべてのサイズ変更イベントを処理することを禁じています。そのため、`ResizeObserver` のコールバックが、ページのレイアウトを変更するのに理想的な場所となります。`ResizeObserver` 処理はレイアウトとペイントの間で行われるため、これを行うとレイアウトが無効になるだけで、ペイントは無効になりません。

### 落とし穴

`ResizeObserver` へのコールバック内で監視されているオブジェクトのサイズを変更した場合はどうなるでしょうか。答えは次のとおりです。コールバックへの別の呼び出しをすぐにトリガーすることになります。幸い、`ResizeObserver` は、無限のコールバックループと循環依存を回避するメカニズムがあります。サイズ変更された要素が前のコールバックで処理された、DOM ツリー構造で*最も浅い*要素よりも深い場合、変更は同じフレームでのみ処理されます。それ以外の場合は、次のフレームに延期されます。

## 応用

`ResizeObserver` を使用して行えることの 1 つに、要素ごとのメディアクエリを実装することがあります。要素を監視することにより、デザインのブレークポイントを必然的に定義して要素のスタイルを変更することができます。次の[例](https://googlechrome.github.io/samples/resizeobserver/)では、2 番目のボックスは幅に応じて境界線の半径を変更します。

<figure>
  <video controls autoplay loop muted>
    <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/elem-mq_vp8.webm" type="video/webm; codecs=vp8">
    <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/elem-mq_x264.mp4" type="video/mp4; codecs=h264">
  </source></source></video></figure>

```js
const ro = new ResizeObserver(entries => {
  for (let entry of entries) {
    entry.target.style.borderRadius =
        Math.max(0, 250 - entry.contentRect.width) + 'px';
  }
});
// Only observe the second box
ro.observe(document.querySelector('.box:nth-child(2)'));
```

もう 1 つの興味深い例として、チャットウィンドウが挙げられます。典型的な上から下への会話レイアウトで発生する問題は、スクロールの配置です。ユーザーの混乱を避けるために、ウィンドウが会話の下部に固定され、最新のメッセージが表示されるようにするとわかりやすくなります。さらに、あらゆる種類のレイアウト変更（電話の向きがランドスケープからポートレート、またはその逆に変わることを想定）でも同じことを達成できるでしょう。

`ResizeObserver` を使用すると、*両方*のシナリオを処理する*単一*のコードを記述できます。ウィンドウのサイズ変更は、定義により `ResizeObserver` がキャプチャできるイベントではありますが、`appendChild()` 呼び出すと、新しい要素用にスペースを作成する必要があるため、その要素のサイズも変更されます（`overflow: hidden` が設定されていない限り）。これを念頭に置くと、ごくわずかな行でこの目的の効果を達成することができます。

<figure>
 <video controls autoplay loop muted>
   <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/chat_vp8.webm" type="video/webm; codecs=vp8">
   <source src="https://storage.googleapis.com/webfundamentals-assets/resizeobserver/chat_x264.mp4" type="video/mp4; codecs=h264">
 </source></source></video></figure>

```js
const ro = new ResizeObserver(entries => {
  document.scrollingElement.scrollTop =
    document.scrollingElement.scrollHeight;
});

// Observe the scrollingElement for when the window gets resized
ro.observe(document.scrollingElement);
// Observe the timeline to process new messages
ro.observe(timeline);
```

すごいと思いませんか？

ここから、ユーザーが手動で上にスクロールし、新しいメッセージが届いた場合に*その*メッセージにスクロールを固定するというケースを処理するためのコードを追加できます。

別のユースケースは、独自のレイアウトを操作しているあらゆる種類のカスタム要素のケースです。`ResizeObserver` が導入されるまでは、サイズが変更されたときに通知を受け取て子をレイアウトし直すための確実な方法はありませんでした。

## まとめ

`ResizeObserver` は、[ほとんどの主要なブラウザ](https://developer.mozilla.org/docs/Web/API/ResizeObserver#Browser_compatibility)で使用できます。場合によっては、ごく最近になって使用できるようになっていることもあります。[利用可能なポリフィル](https://github.com/WICG/ResizeObserver/issues/3)はありますが、`ResizeObserver` の機能を完全に複製しているわけではありません。現在の実装は、ポーリングまたは DOM へのセンチネル要素の追加に依存しています。前者では CPU がビジー状態になってしまうため、モバイルのバッテリーを消耗しますが、後者は DOM を変更してしまうため、スタイルやその他の DOM 依存コードを台無しにしてしまう可能性があります。

写真提供: [Markus Spiske](https://unsplash.com/@markusspiske?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)（[Unsplash](https://unsplash.com/s/photos/observe-growth?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)）。
