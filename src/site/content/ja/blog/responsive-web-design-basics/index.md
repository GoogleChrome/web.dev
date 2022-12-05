---
title: レスポンシブウェブデザインの基本
subhead: サイトを表示するデバイスのニーズと機能に対応するサイトを作成する方法。
description: サイトを表示するデバイスのニーズと機能に対応するサイトを作成する方法。
date: 2019-02-12
updated: 2020-05-14
authors:
  - petelepage
  - rachelandrew
tags:
  - blog
  - css
  - layout
  - mobile
  - ux
---

{＃TODO (kayce):＃1983が掲載されたら、ハードコードされたこのToCを削除します。＃}

- [ビューポートを設定する](#viewport)
- [コンテンツのサイズをビューポートに合わせる](#size-content)
- [応答性を確保するためにCSSメディアクエリを使用する](#media-queries)
- [ブレークポイントの選択方法](#breakpoints)
- [ChromeDevToolsでメディアクエリブレークポイントを表示する](#devtools)

モバイルデバイスを使ったWebの閲覧は、天飛躍的なペースで成長し続けています。こうしたデバイスはディスプレイサイズに制約されることが多く、コンテンツを画面上にレイアウトする上で異なるアプローチが必要です。

レスポンシブウェブデザインは、もともと[A  List Apart の Ethan Marcotte 氏](http://alistapart.com/article/responsive-web-design/)によって定義されたもので、ユーザーとユーザーの使用するデバイスのニーズに応えます。レイアウトは、デバイスのサイズと機能に応じて変わります。たとえば、携帯電話の場合は、コンテンツ 1 列のビューに表示されます。タブレットでは、同じコンテンツが 2 列のビューに表示される場合があります。

<figure>{% Video src="video/tcFciHGuF3MxnTr1y5ue01OGLBn2/8RKRFvbuoXGkOSuEArb7.mp4", autoplay=true, controls=true, loop=true, muted=true, playsinline=true %}</figure>

携帯電話、「ファブレット」、タブレット、デスクトップ、ゲーム機、テレビ、さらにはウェアラブルでは、さまざまな画面サイズが存在します。画面サイズは常に変化するため、サイトが任意の画面サイズに適応できることは、今も今後も重要です。さらに、デバイスには、デバイスと対話するためのさまざまな機能があります。たとえば、訪問者の中にはタッチスクリーンを使用するユーザーがいるでしょう。現代のレスポンシブデザインは、これらすべてを考慮して、あらゆるユーザーのエクスペリエンスを最適化します。

## ビューポートを設定する {: #viewport}

さまざまなデバイス用に最適化されたページでは、ドキュメントの先頭にメタビューポートタグを含める必要があります。メタビューポートタグは、ページのサイズとスケーリングを制御する方法に関する指示をブラウザに出します。

最高のエクスペリエンスを提供するために、モバイルブラウザはデスクトップ画面の幅 (通常は約`980px`ですが、デバイスによって異なります) を基準にページをレンダリングします。また、フォントサイズを大きくし、コンテンツを画面におさまるように拡大することにより、コンテンツの見栄えを良くしようとします。つまり、フォントサイズが一貫していないように見える可能性があり、ユーザーは、コンテンツを表示して操作するために、ダブルタップしたり、ピンチしてズームしたりする必要があります。

```html/4
<!DOCTYPE html>
<html lang="en">
  <head>
    …
    <meta name="viewport" content="width=device-width, initial-scale=1">
    …
  </head>
  …

```

メタビューポート値 `width=device-width` は、デバイスに依存しないピクセルで画面の幅に合わせることをページに指示します。デバイス (または密度) に依存しないピクセルは、1 つのピクセスを表現したものであり、高密度画面では、多くの物理ピクセルで構成される場合があります。これにより、小型の携帯電話でも大型のデスクトップモニターでも、ページをリフローしてさまざまな画面サイズに合わせることができます。

<figure>{% Img src="image/admin/SrMBH5gokGU06S0GsjLS.png", alt="大きくズームアウトされているため、テキストが読みにくいページのスクリーンショット", width="500", height="640"%}<figcaption>ビューポートメタタグのないデバイスでページが読み込まれる様子を示した例。<a href="https://without-vp-meta.glitch.me/">Glitch でこちらの例をご覧ください</a>。</figcaption></figure>

<figure>{% Img src="image/admin/9NrJxt3aEv37A3E7km65.png", alt="テキストを判読できるサイズにした同じページのスクリーンショット", width="500", height="888"%}<figcaption>ビューポートメタタグを使用してページをデバイスに読み込む方法の例。<a href="https://with-vp-meta.glitch.me/">Glitch でこちらの例をご覧ください</a>。</figcaption></figure>

[一部のブラウザ](https://css-tricks.com/probably-use-initial-scale1/)は、横向きモードに回転するときにページの幅を一定に保ち、リフローして画面全体に表示する代わりにズームします。`initial-scale=1` 値を追加すると、デバイスの向きを問わず、CSS ピクセルとデバイスに依存しないピクセルの間に1：1の関係を確立する指示をブラウザーに出し、ページは横の幅を完全に利用できるようになります。

{% Aside 'caution' %}古いブラウザが属性を適切に解析できるようにするには、コンマを使用して属性を区切ります。{% endAside %}

[`width`または`initial-scale` Lighthouse監査を含む`<meta name="viewport">`タグ](https://developer.chrome.com/docs/lighthouse/pwa/viewport/)がない場合、HTMLドキュメントがビューポートメタタグを正しく使用していることを確認するプロセスを自動化するのに役立ちます。

### アクセス可能なビューポートを確認する {: ＃accessible-viewport}

`initial-scale` 以外にも、ビューポートでは次の属性も設定できます。

- `minimum-scale`
- `maximum-scale`
- `user-scalable`

これらは、一旦設定されると、ゆーがーがズームできなくなるため、アクセシビリティの問題を引き起こす可能性があります。したがい、これらの属性を使用することはお勧めしません。

## コンテンツのサイズをビューポートに合わせる {: #size-content}

ユーザーは、デスクトップデバイスでも、モバイルデバイスでも、Webサイトを垂直方向にスクロールすることに慣れていますが、水平方向へのスクロールには慣れていないでしょう。したがい、ユーザーがページ全体を表示するのに水平方向にスクロールしたり、ズームアウトしたりする必要があると、優れたユーザーエクスペリエンスが損なわれてしまいます。

メタビューポートタグを使用してモバイルサイトを開発する場合、指定したビューポートに完全に収まらないページコンテンツを誤って作成してしまう可能性があります。たとえば、ビューポートよりも広い幅で画像が表示されると、ビューポートが水平方向にスクロールする可能性があります。ユーザーがページを水平方向にスクロールする必要がないように、コンテンツをビューポートの幅内に収まるように調整する必要があります。

Lighthouse の [Content is not sized correctly for the viewport](https://developer.chrome.com/docs/lighthouse/pwa/content-width/) 監査は、オーバーフローするコンテンツを検出するプロセスを自動化するのに役立ちます。

### 画像 {: #images}

画像のサイズは固定されており、ビューポートよりも大きい場合はスクロールバーが表示されます。この問題に対処する一般的な方法は、すべての画像に`100%` `max-width`を与えることです。これにより、ビューポートサイズが画像よりも小さい場合、画像はそのスペースに合わせて縮小されます。ただし、`width` の代わりに `max-width` を `100%` にするため、画像は自然なサイズを超えてストレッチすることはありません。画像が原因でスクロールバーが表示される問題が発生しないよう、スタイルシートに以下を追加しておくと無難でしょう。

```css
img {
  max-width: 100%;
  display: block;
}
```

#### 画像のサイズをimg要素に追加する {: #image-dimensions}

`max-width: 100%`を使用すると、画像の自然なサイズが上書きされます。しかし、`<img>` タグには `width` 属性と `height` 属性を使用すべきでしょう。理由としては、最近のブラウザは、この情報を使用して画像のスペースを確保してから画像を読み込むため、それがコンテンツの読み込み時に[レイアウトがずれる](/optimize-cls/)問題を防ぐのに役立つためです。

### レイアウト {: #layout}

CSSピクセルの画面サイズと幅はデバイス間（たとえば、電話とタブレット間、さらには異なる電話間）で大きく異なるため、コンテンツを適切にレンダリングするためには、特定のビューポート幅に依存することは避けなくてはいけません。

以前は、これにはパーセンテージでレイアウトを作成するために使用される設定要素が必要でした。以下の例では、ピクセルを使用してサイズ設定された、フロート要素を含む2列のレイアウトを確認できます。ビューポートが列の全幅よりも小さくなったら、コンテンツを表示するために水平方向にスクロールする必要があります。

<figure>{% Img src="image/admin/exFCZNQLUveUnpMFjvcj.jpg", alt="2列からなるレイアウトがあり、2つ目の列の大部分がビューポートからはみ出しているスクリーンショット", width="800", height="504" %}<figcaption>ピクセルを使用したフロートレイアウト。<a href="https://layout-floats-px.glitch.me/">Glitch でこちらの例をご覧ください</a>。</figcaption></figure>

幅にパーセンテージを使用すると、列は常にコンテナサイズの特定のパーセンテージを維持します。つまり、列が狭くなるため、スクロールバーは作成されません。

{% Glitch { id: 'layout-floats-percent', path: 'README.md' } %}

Flexbox、Grid Layout、Multicolなど、最新のCSSレイアウト手法により、こうした柔軟なグリッドの作成が非常に簡単になります。

#### Flexbox {: #flexbox}

このレイアウト方法は、さまざまなサイズのアイテムがあり、小さいアイテムに小さいスぺースを、大きいアイテムに大きなスペースを与えることにより、各アイテムを 1 つまたは複数の列にゆったり収めたいという場合に最適です。

```css
.items {
  display: flex;
  justify-content: space-between;
}
```

レスポンシブデザインでは、Flexboxを使用してアイテムを単一の行として表示したり、使用可能なスペースが減少したときに複数の行に折り返したりすることができます。

{% Glitch { id: 'responsive-flexbox', height: 220 } %}

[Flexbox について詳しくお読みください](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Flexbox)。

#### CSS Grid Layout {: #grid }

CSSグリッドレイアウトを使用すると、柔軟なグリッドを簡単に作成できます。先ほどのフロートの例を考慮すれば、パーセンテージの代わりに、グリッドレイアウトと `fr` ユニット (コンテナ内の使用可能なスペースの一部を表す) を使って列を作成することができるでしょう。

```css
.container {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
```

{% Glitch 'two-column-grid' %}

また、グリッドを使用すると、通常のグリッドレイアウトを作成し、スペースに収まるだけのアイテムを含めることができます。画面サイズが小さくなると、利用可能なトラックの数が減ります。以下のデモでは、各行に収まるだけの数のカードがあり、最小サイズは`200px`としています。

{% Glitch 'grid-as-many-as-fit' %}

[CSS Grid Layout について詳しく読む](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Grids)

#### 複数列のレイアウト{: #multicol}

一部のタイプのレイアウトでは、複数列レイアウト（Multicol）を使用できます。これにより、 `column-width`プロパティを使用してレスポンシブな数の列を作成できます。 `200px`の列を追加する余地がある場合は、列が追加されていることがわかります。

{% Glitch { id: 'responsive-multicol', path: 'style.css' } %}

[Multicolについて詳しく読む](https://developer.mozilla.org/docs/Learn/CSS/CSS_layout/Multiple-column_Layout)

## 応答性を確保するためにCSSメディアクエリを使用する{: media-queries}

上記の手法で確保できる画面サイズ以上のサイズをサポートするには、レイアウトをさらに変更する必要があります。そこで便利なのが、メディクエリです。

メディアクエリは、CSSスタイルに適用できるシンプルなフィルターです。コンテンツをレンダリングするデバイスのタイプ、またはそのデバイスの機能（幅、高さ、向き、ホバー機能、デバイスがタッチスクリーンとして使用されているかどうかなど）に基づいて、スタイルを簡単に変更できます。

印刷に異なるスタイルを提供するには、次のように出力の*タイプ*をターゲットにし、印刷スタイルが指定されたスタイルシートを含める必要があります。

```html/4
<!DOCTYPE html>
<html lang="en">
  <head>
    …
    <link rel="stylesheet" href="print.css" media="print">
    …
  </head>
  …
```

または、メディアクエリを使用して、メインのスタイルシートに印刷スタイルを含めることもできます。

```css
@media print {
  /* print styles go here */
}
```

{% Aside 'note' %}`@import`構文、 `@import url(print.css) print;`を使用して、メインのCSSファイルに別のスタイルシートを含めることもできます。ただし、パフォーマンス上の理由から、この使用はお勧めしません。詳細については、[Avoid CSS imports](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/page-speed-rules-and-recommendations#avoid_css_imports) を参照してください。{% endAside %}

レスポンシブウェブデザインの場合、通常、小さな画面に異なるレイアウトを提供するために、または訪問者がタッチスクリーンを使用していることを検出したときに、デバイス*の機能を照会します。*

### ビューポートサイズに基づくメディアクエリ {: #viewport-media-queries}

メディアクエリを使用すると、特定のスタイルが小さな画面から大きな画面に渡って適用されるレスポンシブエクスペリエンスを作成できます。したがって、ここで検出している機能は画面サイズであり、次の要素をテストできます。

- `width` （ `min-width` 、 `max-width` ）
- `height` （ `min-height` 、 `max-height` ）
- `orientation`
- `aspect-ratio`

{% Glitch { id: 'media-queries-size', path: 'index.html' } %}

これらの機能はすべて、優れたブラウザサポートを備えています。ブラウザのサポート情報などの詳細については、MDNで[幅](https://developer.mozilla.org/docs/Web/CSS/@media/width)、[高さ](https://developer.mozilla.org/docs/Web/CSS/@media/height)、[向き](https://developer.mozilla.org/docs/Web/CSS/@media/orientation)、[アスペクト比を参照してください。](https://developer.mozilla.org/docs/Web/CSS/@media/aspect-ratio)

{% Aside 'note' %} 仕様には、`device-width` と `device-height` のテストが含まれていました。これらは非推奨になっていますので、実行しないでください。デバイスウィンドウの実際の `device-width` と `device-height` を調べるためのテストは、ユーザーがデバイスウィンドウのサイズを変更した場合などは、ユーザーが見ているビューポイントと異なる場合があるため、実際には有用なものではありませんでした。{% endAside %}

### デバイス機能に基づくメディアクエリ {: #capability-media-queries}

利用可能なデバイスの種類を考慮すると、すべての大きなデバイスが通常のデスクトップであるのか、ノートパソコンであるのか、またユーザーが小さなデバイスでタッチスクリーンだけを使っているのかは判断できません。メディアクエリの仕様に新たな内容がいくつか追加されたおかげで、デバイスとの対話に使用されるポインターのタイプや、ユーザーが要素にカーソルを合わせることができるかどうかなどの機能をテストできるようになりました。

- `hover`
- `pointer`
- `any-hover`
- `any-pointer`

このデモは、通常のデスクトップコンピューターや携帯電話、タブレットなど、さまざまなデバイスで表示してみてください。

{% Glitch 'media-query-pointer' %}

こうした新機能は、すべての最新ブラウザで適切にサポートされています。[hover](https://developer.mozilla.org/docs/Web/CSS/@media/hover)、[any-hover](https://developer.mozilla.org/docs/Web/CSS/@media/any-hover)、[pointer](https://developer.mozilla.org/docs/Web/CSS/@media/pointer)、[any-pointer](https://developer.mozilla.org/docs/Web/CSS/@media/any-pointer) の詳細については、MDN の該当するページを参照してください。

#### `any-hover`と`any-pointer` の使用について

`any-hover` および `any-pointer` といった機能は、ユーザーがホバーする機能を持っているかどうか、または、デバイスと対話する主要な方法でなくても、そのタイプのポインターを使用しているかをテストします。これらを使用するときは十分に注意してください。タッチスクリーンを使用しているときにユーザーにマウスへの切り替えを強制することは、あまり好ましくありません。ただし、ユーザーが使用しているデバイスの種類を把握することが重要な場合は、`any-hover` と ` any-pointer` が重宝するかもしれません。たとえば、タッチスクリーンとトラックパッドを備えたノートパソコンは、ホバーする機能に加えて、粗いポインターと細かいポインターに一致する必要があります。

## ブレークポイントの選択方法 {: #breakpoints}

デバイスクラスに基づいてブレークポイントを定義しないでください。現在使用されている特定のデバイス、製品、ブランド名、またはオペレーティングシステムに基づいてブレークポイントを定義すると、メンテナンスが手に負えなくなる場合があります。代わりに、レイアウトをどのようにコンテナに調整するかは、コンテンツそのものを基に判断するべきです。

### ブレークポイントは小さいものから始めて大きなものを選択する {: #major-breakpoints }

最初に小さな画面サイズに収まるようにコンテンツを設計してから、ブレークポイントが必要になるまで画面を拡大します。これにより、コンテンツに基づいてブレークポイントを最適化し、可能な限り少ない数のブレークポイントを維持できます。

最初に紹介した天気予報の例を見てみましょう。最初のステップは、予報を小さな画面に見栄えよく表示することです。

<figure>{% Img src="image/admin/3KPWtKzDFCwImLyHprRP.png", alt="モバイル幅で表示された気象アプリのスクリーンショット", width="400", height="667" %}<figcaption>狭い幅で表示したアプリ。</figcaption></figure>

次に、要素間に空白があり過ぎて、予報の見栄えがとにかく悪いという所までブラウザのサイズを変更します。この判断は幾分主観的なものですが、 `600px`以上は確実に広すぎると言えるでしょう。

<figure>{% Img src="image/admin/sh1P84rvjvviENlVFED4.png", alt="アイテム間に大きなギャップがある気象アプリのスクリーンショット", width="400", height="240" %}<figcaption>アプリのデザインを微調整する必要があると感じる状態。</figcaption></figure>

`600px` でブレークポイントを挿入するには、CSSの終わりにコンポートネントに対するメディアクエリを 2 つ (ブラウザーが`600px`以下の場合に使用するものを 1 つ、`600px` よりも広い場合に使用するものを 1 つ) 作成します。

```css
@media (max-width: 600px) {

}

@media (min-width: 601px) {

}
```

最後に、CSSをリファクタリングします。`max-width` が `600px` のメディアクエリ内に、小さな画面専用のCSSを追加します。`min-width` が `601px`のメディアクエリ内には、より大きな画面用のCSSを追加します。

#### 必要に応じてマイナーブレークポイントを選択します

レイアウトが大幅に変更されたときにメジャーブレークポイントを選択することに加えて、マイナーな変更を調整することも役立ちます。たとえば、主要なブレークポイント間では、要素の余白やパディングを調整したり、フォントサイズを大きくして、レイアウトがより自然に感じられるようにしたりすることが役に立つ場合があります。

小さな画面のレイアウトを最適化することから始めましょう。この場合、ビューポイントの幅が `360px` より広いときにはフォントをブーストしましょう。次に、十分なスペースがある場合は、高温と低温を分けることにより、双方が重なり合うのを避け、同じ線上に収めることができます。また、気象アイコンを少し大きくしましょう。

```css
@media (min-width: 360px) {
  body {
    font-size: 1.0em;
  }
}

@media (min-width: 500px) {
  .seven-day-fc .temp-low,
  .seven-day-fc .temp-high {
    display: inline-block;
    width: 45%;
  }

  .seven-day-fc .seven-day-temp {
    margin-left: 5%;
  }

  .seven-day-fc .icon {
    width: 64px;
    height: 64px;
  }
}
```

同様に、大画面の場合は、画面全体の幅を消費しないように、予報パネルの最大幅を制限とすることをお勧めします。

```css
@media (min-width: 700px) {
  .weather-forecast {
    width: 700px;
  }
}
```

{% Glitch { id: 'responsive-forecast', path: 'style.css' } %}

### テキストを最適化して読みやすくする

読みやすさに関する従来の理論では、1 行あたり 70〜80 文字 (英語では約 8〜10 ワード) の列が理想とされています。したがって、テキストブロックの幅がおよそ 10 ワードを超えるときは、ブレークポイントを追加することを検討してください。

<figure>{% Img src="image/admin/C4IGJw9hbPXKnTSovEXS.jpg", alt="テキストを含むページをモバイルデバイスに表示したスクリーンショット", width="400", height="488" %}<figcaption>モバイルデバイスで読み取られたテキスト。</figcaption></figure>

<figure>{% Img src="image/admin/rmsa1EB5FpvWV0vFIpTF.jpg", alt="テキストを含むページをデスクトップ用のブラウザに表示したスクリーンショット", width="800", height="377" %}<figcaption>行の長さを制限するためにブレークポイントが追加された状態でデスクトップブラウザ上で読み取られたのテキスト。</figcaption></figure>

上記のブログ記事の例を詳しく見てみましょう。小さい画面では、`1em` のRobotoフォントは完全に機能しており、1 行あたり 10 ワードを表示していますが、大きい画面ではブレークポイントが必要です。この場合、ブラウザの幅が `575px` より大きい場合、コンテンツの幅は `550px` とするのが理想的です。

```css
@media (min-width: 575px) {
  article {
    width: 550px;
    margin-left: auto;
    margin-right: auto;
  }
}
```

{% Glitch { id: 'rwd-reading', path: 'index.html' } %}

### 単純にコンテンツを非常時にするということは避けましょう

画面サイズに応じて、非表示または表示するコンテンツを選択するときは注意してください。画面に収まらないという理由だけでコンテンツを非表示にするのは止めましょう。画面サイズは、ユーザーが期待すると思われる情報を基に決定するものではありません。たとえば、天気予報から花粉数を省いてしまうことは、春のアレルギーに苦しみ、外出できるかどうかを判断するための情報を必要とする人々にとっては深刻な問題になる可能性があります。

## Chrome DevToolsでメディアクエリブレークポイントを表示する {: #devtools}

メディアクエリブレークポイントを設定したら、サイトがどのように表示されるかを確認する必要があります。ブラウザウィンドウのサイズを変更してブレークポイントをトリガーすることもできますが、Chrome DevToolsには、さまざまなブレークポイントの下でページがどのように表示されるかを簡単に確認できる機能が組み込まれています。

<figure>{% Img src="image/admin/DhaeCbVo5AmzZ0CyLtVp.png", alt="気象アプリを開いて822ピクセルの幅を選択したDevToolsのスクリーンショット。", width="800", height="522" %}<figcaption> より広いビューポートサイズを見た状態で気象アプリを表示する DevToolsに。</figcaption></figure>

<figure>{% Img src="image/admin/35IEQnhGox93PHvbeglM.png", alt="気象アプリを開いて436ピクセルの幅を選択したDevToolsのスクリーンショット。", width="800", height="521" %}<figcaption>より狭いビューポートサイズを見た状態で気象アプリを表示するDevTools。</figcaption></figure>

さまざまなブレークポイントでページを表示する場合は、

[DevTools を開き](https://developer.chrome.com/docs/devtools/open/)、[デバイスモード](https://developer.chrome.com/docs/devtools/device-mode/#toggle)をオンにします。デフォルトでは、[レスポンシブモード](https://developer.chrome.com/docs/devtools/device-mode/#responsive)で開きます。

[メディアクエリ](https://developer.chrome.com/docs/devtools/device-mode/#queries)を表示するには、[デバイスモード]メニューを開き、[メディアクエリを表示]を選択して、ブレークポイントを色付きのバーとしてページの上に表示します。

メディアクエリがアクティブなときにページを表示するには、バーの1つをクリックします。バーを右クリックして、メディアクエリの定義にジャンプします。
