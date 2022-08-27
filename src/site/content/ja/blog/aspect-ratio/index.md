---
layout: post
title: Chromium、Safari Technology Preview、およびFirefox Nightlyでサポートされる新しいアスペクト比のCSSプロパティ
subhead: レスポンシブレイアウトの間隔を維持するのに役立つ新しいCSSプロパティ。
authors:
  - una
date: 2021-01-28
hero: image/admin/I14dS86oJT2f0uHaDLEM.jpg
alt: 同じアスペクト比でサイズ変更されたカラフルな電話の画像。
description: 新しい aspect-ratio CSSプロパティで、画像と要素内のアスペクト比の維持をさらに簡単に達成できるようになりました。
tags:
  - blog
  - css
---

{% Aside %}

要約: *アスペクト比*と呼ばれる一貫した幅と高さの比率を維持することは、レスポンシブ Web デザインや、[累積的なレイアウトシフト](/cls/)を防ぐために重要です。[Chromium 88](https://developer.apple.com/safari/technology-preview/release-notes/)、[Firefox 87](https://developer.apple.com/safari/technology-preview/release-notes/)、および [Safari Technology Preview 118](https://developer.apple.com/safari/technology-preview/release-notes/) に導入される新しい `aspect-ratio` プロパティを使用することで、これを維持するのがさらに簡単になりました。

{% endAside %}

## アスペクト比

アスペクト比は、2 つの整数とコロンを使って「幅:高さ」または 「x:y」の次元として表されるのが最も一般的です。写真の最も一般的なアスペクト比は 4:3 と 3:2 ですが、ビデオや最近のコンシューマー向けカメラのアスペクト比は 16:9 である傾向があります。

<figure>{% Img src="image/admin/od54hUUe21UABpbWxSFG.jpg", alt="同じアスペクト比を持つ 2 つの画像。1 つは 634 x 951px で、もう 1 つは 200 x 300px です。どちらもアスペクト比は 2:3 です。", width="800", height="526" %} <figcaption>同じアスペクト比を持つ 2 つの画像。1 つは 634 x 951px で、もう 1 つは 200 x 300px です。どちらもアスペクト比は 2:3 です。</figcaption></figure>

レスポンシブデザインが出現したことで、特に画像のサイズと要素のサイズが使用可能なスペースに基づいて変化するようになったため、アスペクト比を維持することが Web 開発者にとってますます重要になっています。

アスペクト比の維持が重要になる場合には、以下の例があります。

- 親の幅の100％であり、高さが特定のビューポート比のままであるレスポンシブ iframe を作成する
- 画像、[動画](http://fitvidsjs.com/)、または埋め込みが読み込まれてスペースを占有するときに再レイアウトされないように、各アイテム用の固有のプレースホルダーコンテナを作成する
- インタラクティブなデータ視覚化または SVG アニメーション用に均一でレスポンシブなスペースを作成する
- カードやカレンダーの日付といった複数の要素が伴うコンポーネント用に均一でレスポンシブなスペースを作成する
- サイズの異なる複数の画像用に均一でレスポンシブなスペースを作成する（`object-fit` とともに使用する）

## Object-fit

アスペクト比を定義すると、レスポンシブなコンテキストでメディアのサイズを決定するのに役立ちます。このバケツのもう 1 つのツールは、`object-fit` プロパティです。ユーザーはこれを使用して、ブロック内のオブジェクト（画像など）がそのブロックをどのように埋めるかを記述できます。

<figure>{% Img src="image/admin/A7uj6u5MULodlw4lVsI2.jpg", alt="Object-fit デモの視覚化", width="800", height="236" %} <figcaption>さまざまな <code>object-fit</code> の値を実演。<a href="https://codepen.io/una/pen/mdrLGjR">Codepen のデモ</a>をご覧ください。</figcaption></figure>

`initial` 値と `fill` 値は、スペースを埋めるように画像を再調整します。この例では、これにより、ピクセルが再調整されるにつれ、画像が押しつぶされてぼやけています。これは理想的ではありません。`object-fit: cover` は、画像の最小サイズを使用してスペースを埋め、このサイズに基づいて画像をトリミングしてフィットさせます。最も低い境界で「ズームイン」します。`object-fit: contain` は、画像全体が常に表示されるようにするため、 `cover` の動作とは逆に、最大の境界のサイズ（上記の例では幅）を取って、画像のサイズを変更して固有のアスペクト比を維持しながらスペースにフィットさせます。`object-fit: none` の場合は、中央（デフォルトのオブジェクト位置）で自然なサイズでトリミングされた画像を示します。

`object-fit: cover` は、サイズの異なる画像を処理する場合に、ほとんどの状況で、均一なインターフェイスを確保するように機能する傾向がありますが、この方法では情報が失われます（画像は最も長い辺に沿ってトリミングされます）。

これらの失われる情報が重要であるならば（美容製品のフラットレイで作業する場合など）、重要なコンテンツをトリミングすることは許容できません。したがって、トリミングせずに UI スペースにフィットするさまざまなサイズのレスポンシブ画像が理想的と言えます。

## 以前の技法: `padding-top` でアスペクト比を維持する

<figure>{% Img src="image/admin/j3YJicINXjly349uEEUt.jpg", alt="padding-top を使用して、カルーセル内のプレビュー後の画像に 1:1 のアスペクト比を設定する。", width="800", height="296" %} <figcaption><code>padding-top</code> を使用して、カルーセル内のプレビュー後の画像に 1:1 のアスペクト比を設定する。</figcaption></figure>

これらをさらにレスポンシブにするために、アスペクト比を使用できます。これにより、特定の比率のサイズを設定し、残りのメディアを個々の軸（高さまたは幅）に基づいて設定できます。

画像の幅に基づいてアスペクト比を維持するために現在広く受け入れられているクロスブラウザソリューションは、「Padding-Top ハック」として知られています。このソリューションには、親コンテナと絶対的に配置された子コンテナが必要です。その上で、アスペクト比をパーセント率として計算し、 `padding-top` として設定します。以下に例を示します。

- 1:1 のアスペクト比 = 1 / 1 = 1 = `padding-top: 100%`
- 4:3 のアスペクト比 = 3 / 4 = 0.75 = `padding-top: 75%`
- 3:2 のアスペクト比 = 2 / 3 = 0.66666 = `padding-top: 66.67%`
- 16:9 のアスペクト比 = 9 / 16 = 0.5625 = `padding-top: 56.25%`

アスペクト比の値を特定したので、それを親コンテナに適用できます。以下の例を考察してみましょう。

```html
<div class="container">
  <img class="media" src="..." alt="...">
</div>
```

次に、以下のように CSS を記述できます。

```css
.container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 のアスペクト比 */
}

.media {
  position: absolute;
  top: 0;
}
```

## `aspect-ratio` でアスペクト比を維持する

<figure>{% Img src="image/admin/XT8PbPiYx1IJq3Pvmanz.jpg", alt="aspect-ratio を使用してカルーセル内のプレビュー後の画像に 1:1 のアスペクト比を設定する。", width="800", height="296" %} <figcaption><code>aspect-ratio</code> を使用してカルーセル内のプレビュー後の画像に 1:1 のアスペクト比を設定する</figcaption></figure>

残念ながら、これらの `padding-top` 値の計算はあまり直感的ではなく、追加のオーバーヘッドと配置が必要です。新しい固有の `aspect-ratio` [CSS プロパティ](https://drafts.csswg.org/css-sizing-4/#aspect-ratio)を使用すると、アスペクト比を維持するための言語がはるかに明確になります。

同じマークアップで、`padding-top: 56.25%` を`aspect-ratio: 16 / 9` に置き換え、`aspect-ratio` を指定された `width` / `height` の比率に設定します。

<div class="switcher">{% Compare 'worse', 'Using padding-top' %} ```css .container { width: 100%; padding-top: 56.25%; } ``` {% endCompare %}</div>
<p data-md-type="paragraph">{% Compare 'better', 'Using aspect-ratio' %}</p>
<pre data-md-type="block_code" data-md-language="css"><code class="language-css">.container {
  width: 100%;
  aspect-ratio: 16 / 9;
}
</code></pre>
<p data-md-type="paragraph">{% endCompare %}</p>
<div data-md-type="block_html"></div>

`padding-top` の代わりに `aspect-ratio` を使用する方がはるかに明確であり、padding プロパティをオーバーホールして通常の範囲外のことを行うことがありません。

この新しいプロパティは、アスペクト比を `auto` に設定する機能も追加します。この場合、「固有のアスペクト比で置き換えられた要素はそのアスペクト比を使用しますが、そうでない場合は、ボックスには優先アスペクト比はありません」。 `auto` と `<ratio>` の両方が同時に指定されている場合、優先アスペクト比は、`width` を `height` で除算した指定の比率です。ただし、両方が一緒に指定されている場合、固有のアスペクト比で置き換えられた要素である場合は、代わりにそのアスペクト比が使用されます。

## 例: グリッドの一貫性

これは、CSS Grid や Flexbox などの CSS レイアウトメカニズムで非常にうまく機能します。スポンサーアイコンのグリッドなど、1:1 のアスペクト比を維持したい子要素を持つリストを考察してみましょう

```html
<ul class="sponsor-grid">
  <li class="sponsor">
    <img src="..." alt="..."/>
  </li>
  <li class="sponsor">
    <img src="..." alt="..."/>
  </li>
</ul>
```

```css
.sponsor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}

.sponsor img {
  aspect-ratio: 1 / 1;
  width: 100%;
  object-fit: contain;
}
```

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/aspect-ratio/gridimages2.mp4" type="video/mp4">
  </source></video>
  <figcaption>さまざまなアスペクト比のサイズの親要素を持つグリッド内の画像。<a href="https://codepen.io/una/pen/PoGddaw">Codepen のデモをご覧ください</a>。</figcaption></figure>

## 例: レイアウトシフトを防止する

`aspect-ratio` のもう 1 つの優れた機能は、プレースホルダースペースを作成して、[累積レイアウトシフト](/cls/)を防止し、より優れた[ウェブバイタル](/learn-core-web-vitals/)を提供できることです。この最初の例では、[Unsplash](https://source.unsplash.com/) などの API からアセットを読み込むと、メディアの読み込みが終了したときにレイアウトシフトが作成されます。

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/aspect-ratio/aspect-ratio-missing.mp4" type="video/mp4">
  </source></video>
  <figcaption>読み込まれたアセットにアスペクト比が設定されていない場合に発生する累積レイアウトシフトの動画。この動画は、エミュレートされた 3G ネットワークで録画されています。</figcaption></figure>

一方で、`aspect-ratio` を使用すると、このレイアウトシフトを防止するためのプレースホルダーが作成されます。

```css
img {
  width: 100%;
  aspect-ratio: 8 / 6;
}
```

<figure>
  <video controls autoplay loop muted playsinline>
    <source src="https://storage.googleapis.com/web-dev-assets/aspect-ratio/aspect-ratio-set.mp4" type="video/mp4">
  </source></video>
  <figcaption>アスペクト比が設定された動画は、読み込み済みのアセットに配置されます。この動画は、エミュレートされた 3G ネットワークで録画されています。<a href="https://codepen.io/una/pen/GRjLZmG">Codepen のデモをご覧ください。</a></figcaption></figure>

### ボーナスヒント: アスペクト比の画像属性

画像のアスペクト比を設定するもう 1 つの方法は、[画像の属性](https://www.smashingmagazine.com/2020/03/setting-height-width-images-important-again/)を使用することです。前もって画像のサイズがわかっている場合、これらのサイズをその `width` と `height` で設定するのが[ベストプラクティス](/image-aspect-ratio/#check-the-image's-width-and-height-attributes-in-the-html)とされています。

上記の例では、サイズが 800 x 600px であることがわかっている場合、画像のマークアップは、`<img src="image.jpg" alt="..." width="800" height="600">` のようになります。送信される画像のアスペクト比がそれと同じでも、ピクセル値が必ずしも同じでない場合であっても、画像の属性値を使用して比率を設定し、スタイルで `width: 100%` にすることで、画像が適切なスペースを占有するようにすることができます。これらをまとめると、以下のようになります。

```markup
<!-- Markup -->
<img src="image.jpg" alt="..." width="8" height="6">
```

```css
/* CSS */
img {
  width: 100%;
}
```

最終的な効果は、CSS を介して画像に `aspect-ratio` を設定する場合と同じで、累積的なレイアウトシフトが回避されます（[Codepen のデモをご覧ください](https://codepen.io/una/pen/gOwJWoz)）。

## まとめ

複数の最新のブラウザに導入される新しい `aspect-ratio` CSS プロパティを使用すると、メディアとレイアウトのコンテナの適切なアスペクト比を、もう少し簡単に維持できるようになります。

写真提供: [Amy Shamblen](https://unsplash.com/photos/TXg_38oImi0) および [Lionel Gustave](https://unsplash.com/photos/c1rOy44wuts)（Unsplash より）
