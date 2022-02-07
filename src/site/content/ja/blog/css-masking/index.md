---
title: CSS の mask-image プロパティを使用して画像に効果を適用する
subhead: CSS マスキングでは、画像をマスクレイヤーとして使用するオプションが提供されます。つまり、画像、SVG、またはグラデーションをマスクとして使用し、画像エディタなしで興味深い効果を作成することができます。
description: CSS マスキングでは、画像をマスクレイヤーとして使用するオプションが提供されます。つまり、画像、SVG、またはグラデーションをマスクとして使用し、画像エディタなしで興味深い効果を作成することができます。
authors:
  - rachelandrew
date: 2020-09-14
hero: image/admin/uNWkHLVFNcTDk09OplrA.jpg
alt: マスクをかぶったテディベア。
tags:
  - blog
  - css
feedback:
  - api
---

`clip-path` プロパティを使用して[要素をクリップする](/css-clipping)と、クリップされた領域が非表示になります。代わりに、画像の一部を不透明にしたり、他の効果を適用したりする場合は、マスキングを使用する必要があります。この記事では、マスクレイヤーとして使用する画像を指定できる [`mask-image`](https://developer.mozilla.org/docs/Web/CSS/mask-image) プロパティを使用する方法について説明します。これには、3つのオプションがあり、画像ファイル、SVG、またはグラデーションとしてマスクを使用できます。

## ブラウザの互換性

ほとんどのブラウザは、標準の CSS マスキングプロパティを部分的にしかサポートしていません。最高のブラウザ互換性を得るには、標準プロパティに加えて `-webkit-` 接頭辞を使用する必要があります。完全なブラウザサポート情報については、「[CSS マスクを使用できますか？](https://caniuse.com/#feat=css-masks)」をご覧ください。

接頭辞付きのプロパティを使用してブラウザをサポートする方法は優れてはいますが、マスキングを使用して画像の上にテキストを表示する場合、マスキングが使用できない場合に何が起こるかを確認する必要があります。マスキングバージョンを追加する前に、`mask-image` または `-webkit-mask-image` サポートを検出する機能クエリを使用して、読み取り可能なフォールバックを提供することをお勧めします。

```css
@supports(-webkit-mask-image: url(#mask)) or (mask-image: url(#mask)) {
  /* ここに mask-image を必要とするコードを挿入します。 */
}
```

## 画像によるマスキング

`mask-image` プロパティは `background-image`プロパティと同じように動作します。`url()` 値を使用して、画像を渡します。マスク画像には、透明または半透明の領域が必要です。

完全に透明な領域の場合、その領域の下の画像の部分が見えなくなります。ただし、半透明の領域を使用すると、元の画像の一部が透けて見えます。この違いは以下の Glitch で確認できます。最初の画像は、マスクのない元の風船の画像です。2 番目の画像には、完全に透明な背景に白い星が付いたマスクが適用されています。3 番目の画像には、背景に白い星があり、透明度がグラデーションになっています。

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-image?path=index.html&amp;previewSize=100" title="mask-image on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

この例では、値に `cover` を指定した `mask-size` プロパティも使用しています。このプロパティは、 [`background-size`](https://developer.mozilla.org/docs/Web/CSS/background-size) と同じように動作します。キーワードの `cover` と `contain` を使用するか、任意の有効な長さの単位、またはパーセンテージを使用して背景のサイズを指定することができます。

小さな画像を繰り返しパターンとして使用するために、背景画像を繰り返すのと同じようにしてマスクを繰り返すこともできます。

## SVG によるマスキング

画像ファイルをマスクとして使用する代わりに、SVG を使用できます。これを実現する方法にはいくつかありますが、1 つ目は SVG 内に `<mask>` 要素を指定し、その要素の ID を `mask-image` プロパティで参照する方法です。

```html
<svg width="0" height="0" viewBox="0 0 400 300">
  <defs>
    <mask id="mask">
      <rect fill="#000000" x="0" y="0" width="400" height="300"></rect>
      <circle fill="#FFFFFF" cx="150" cy="150" r="100" />
      <circle fill="#FFFFFF" cx="50" cy="50" r="150" />
    </mask>
  </defs>
</svg>

<div class="container">
    <img src="balloons.jpg" alt="Balloons">
</div>
```

```css
.container img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  -webkit-mask-image: url(#mask);
  mask-image: url(#mask);
}
```

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/3HnPhISiVazDTwezxfcy.jpg", alt="SVG マスクの使用例", width="699", height="490" %}</figure>

このアプローチの利点は、画像だけでなく、任意の HTML 要素にマスクを適用できることです。残念ながら、このアプローチは Firefox 以外でサポートされていません。

ただし、すべてが失われるわけではなく、画像をマスキングする最も一般的なシナリオであれば、SVG に画像を含めることができます。

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-image-svg-image?path=README.md&amp;previewSize=100" title="mask-image-svg-image on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## グラデーションによるマスキング

CSS グラデーションをマスクとして使用するのが、画像や SVG を作成する手間をかけずにマスク領域を実現できる洗練された方法です。

単純な線形グラデーションをマスクとして使用すると、たとえば、画像の下部がキャプションに隠れて暗くなりすぎないようにすることができます。

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-linear-gradient?path=README.md&amp;previewSize=100" title="mask-linear-gradient on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

サポートされているグラデーションタイプのいずれかを好きなだけクリエイティブに使用することができます。この次の例では、放射状グラデーションを使用して、キャプションの背後を照らす円形マスクを作成します。

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-radial-gradient?path=README.md&amp;previewSize=100" title="mask-radial-gradient on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## 複数のマスクを使用する

背景画像と同様に、複数のマスクソースを指定し、それらを組み合わせて必要な効果を得ることができます。これは、CSS グラデーションで生成されるパターンをマスクとして使用する場合に特に便利です。これらは通常、複数の背景画像を使用するため、マスクに簡単に変換できます。

例として、[この記事](https://cssgradient.io/blog/gradient-patterns/)で素敵なチェッカーボードパターンを見つけました。背景画像を使用したコードは、次のようになります。

```css
background-image:
  linear-gradient(45deg, #ccc 25%, transparent 25%),
  linear-gradient(-45deg, #ccc 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #ccc 75%),
  linear-gradient(-45deg, transparent 75%, #ccc 75%);
background-size:20px 20px;
background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
```

これ、または背景画像用にデザインされた他のパターンをマスクに変換するには、`background-*` プロパティを、 `-webkit` 接頭辞付きのプロパティを含む関連する`mask` プロパティに置き換えます。

```css
-webkit-mask-image:
  linear-gradient(45deg, #000000 25%, rgba(0,0,0,0.2) 25%),
  linear-gradient(-45deg, #000000 25%, rgba(0,0,0,0.2) 25%),
  linear-gradient(45deg, rgba(0,0,0,0.2) 75%, #000000 75%),
  linear-gradient(-45deg, rgba(0,0,0,0.2) 75%, #000000 75%);
-webkit-mask-size:20px 20px;
  -webkit-mask-position: 0 0, 0 10px, 10px -10px, -10px 0px;
```

画像にグラデーションパターンを適用することで、非常に素晴らしい効果が得られます。Glitch をリミックスして、他のバリエーションをテストしてみてください。

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/mask-checkers?path=README.md&amp;previewSize=100" title="mask-checkers on Glitch" allow="encrypted-media" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

CSS マスクは、クリッピングに加えて、グラフィックアプリケーションを使用せずに画像やその他の HTML 要素に注意を引くことのできる方法です。

*<span>写真提供: <a href="https://unsplash.com/@juliorionaldo">Julio Rionaldo</a>（Unsplash）</span>。*
