---
title: ボックスモデル
description: |2

  CSSで表示されるものはすべてボックスです。
  したがって、CSSボックスモデルがどのように機能するかを理解することは、CSSのコア基盤です。
audio:
  title: 'CSSポッドキャスト   - 001: ボックスモデル'
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_001_v2.0.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-03-29
---

次のHTMLコードがあるとします。

```html
<p>I am a paragraph of text that has a few words in it.</p>
```

このHTMLに次のCSSを記述します。

```css
p {
  width: 100px;
  height: 50px;
  padding: 20px;
  border: 1px solid;
}
```

コンテンツは要素から外れ、幅は100ピクセルではなく142ピクセルになります。なぜでしょうか。ボックスモデルはCSSの重要な基盤です。より予測可能なCSSを作成するには、ボックスモデルがどのように機能して、CSSの他の側面によってどのように影響を受けるのかを理解する必要があります。そして、重要な点は、ボックスモデルを制御する方法を理解することです。

<figure>{% Codepen { user: 'web-dot-dev', id: 'WNRemxN', height: 300 } %}</figure>

CSSを作成するとき、またはWeb全般で作業するときに覚えておくべき非常に重要なことは、CSSによって表示される要素がすべてボックスであるということです。これは、`border-radius`を使用して円のように見えるボックスでも、単純なテキストでも同じです。覚えておくべき重要なことは、それがすべてボックスであるということです。

## コンテンツとサイズ設定

ボックスの動作は、 `display`値、設定されたサイズ、およびボックス内に存在するコンテンツに基づいて異なります。このコンテンツは、子要素によって生成されたさらに多くのボックスであったり、プレーンテキストコンテンツであったりする可能性があります。いずれにしても、このコンテンツはデフォルトでボックスのサイズに影響します。

これを制御するには、**外在サイズ設定**を使用します。あるいは、**内在サイズ設定**を使用して、コンテンツサイズに基づいてブラウザに決定させることもできます。

デモを使用して、違いを簡単に見てみましょう。

<figure>{% Codepen { user: 'web-dot-dev', id: 'abpoMBL' } %} <figcaption>ボックスが外在サイズ設定を使用しているときには、追加できるコンテンツの量には制限があり、それを超えると、ボックスの境界からオーバーフローします。このため、「awesome」という単語がオーバーフローします。</figcaption></figure>

デモでは、固定サイズで太い境界線のボックスがあり、このボックスに「CSS is awesome」という単語が入っています。このボックスは幅設定があるので、外在サイズです。これで子コンテンツのサイズが制御されます。ただし、これには問題があります。「awesome」という単語がボックスに対して大きすぎるため、親ボックスの**境界ボックス**の外側にオーバーフローしてしまいます(この点については授業の後半で詳しく説明します)。 このオーバーフローを防止するための方法の1つは、幅の設定を解除するか、この場合は`width`を`min-content`に設定して、ボックスを内在サイズにできるようにすることです。 `min-content`キーワードは、ボックスの幅をコンテンツの内在最小幅(「{awesome」)に制限するようにボックスに命令します。これにより、「CSS is awesome」がボックス内にきっちりと収まります。

さらに複雑な例を見て、実際のコンテンツに対するさまざまなサイズ設定の影響を確認しましょう。

<figure>{% Codepen { user: 'web-dot-dev', id: 'wvgwOJV', height: 650 } %}</figure>

内在サイズ設定のオンとオフを切り替え、外在サイズ設定をより詳細に制御し、コンテンツに内在サイズ設定をより詳細に制御させる方法を確認します。内在および外在サイズ設定の効果を確認するには、カードにコンテンツの文をいくつか追加します。この要素が外在サイズ設定を使用しているときには、追加できるコンテンツの量に制限があり、それを超えると要素の境界からオーバーフローしますが、内部サイズ設定がオンになっている場合はオーバーフローしません。

デフォルトでは、この要素には`width`と`height`があり、いずれも`400px`に設定されています。これらのサイズは、要素内のすべてに厳密な境界を設定します。この境界は、コンテンツがボックスに対して大きすぎる場合を除いて尊重されます。大きすぎる場合、目に見えるオーバーフローが発生します。花の写真の下にあるキャプションの内容をボックスの高さ(2、3行)を超えるように変更すると、この実際の動作を確認できます。

{% Aside "key-term" %}ボックスに対してコンテンツが大きすぎて収まらないときには、これをオーバーフローと呼びます。要素がオーバーフローコンテンツを処理する方法を管理するには、`overflow`プロパティを使用します。 {% endAside %}

内在サイズ設定に切り替えると、ボックスのコンテンツのサイズに基づいて、ブラウザに決定させます。内在サイズ設定では、ボックスがコンテンツのサイズ変更を試みるのではなく、コンテンツに合わせてボックスのサイズが変更されるため、オーバーフローが発生する可能性は大幅に低くなります。これはブラウザのデフォルトの柔軟な動作であることを覚えておくことが重要です。表面上は外在サイズ設定の方がより細かい制御ができますが、ほとんどの場合において内在サイズ設定が最も柔軟性に優れています。

## ボックスモデルの領域

ボックスは、すべてが特定の仕事をする別個のボックスモデル領域で構成されています。

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/ECuEOJEGnudhXW5JEFih.svg", alt="ボックスモデルの4つの主な領域を示す図 - コンテンツボックス、パディングボックス、境界ボックス、マージンボックス", width="800", height="547" %} <figcaption>ボックスモデルの4つの主な領域は、コンテンツボックス、パディングボックス、境界ボックス、マージンボックスです。</figcaption></figure>

まず、**コンテンツボックス**から始めます。これはコンテンツが存在する領域です。すでに学習したように、このコンテンツは親のサイズを制御できるため、通常は、最もサイズが変動する領域です。

**パディングボックス**はコンテンツボックスを囲み、[`padding`](https://developer.mozilla.org/docs/Web/CSS/padding)プロパティによって作成されたスペースです。パディングはボックス内にあるため、ボックスの背景は作成されたスペースに表示されます。 `overflow: auto`や`overflow: scroll`などのオーバーフロールールがボックスに設定されている場合、スクロールバーもこのスペースを占有します。

<figure>{% Codepen { user: 'web-dot-dev', id: 'BaReoEV' } %}</figure>

**境界ボックス**はパディングボックスを囲みます。スペースは`border`値によって占められます。境界ボックスはボックスの境界です。**境界エッジ**は視覚的に見える内容の限界です。 <a href="https://developer.mozilla.org/docs/Web/CSS/border" data-md-type="link">`border`</a>プロパティは、要素を視覚的にフレーム化するために使用されます。

最後の領域である**マージンボックス**はボックスの周囲のスペースであり、ボックスの`margin`ルールによって定義されます。 [`outline`](https://developer.mozilla.org/docs/Web/CSS/outline)や[`box-shadow`](https://developer.mozilla.org/docs/Web/CSS/box-shadow)などのプロパティも上部に描画されるためこのスペースを占め、ボックスのサイズには影響しません。 ボックスでは`outline-width`を`200px`に設定することができ、ボックスを含むボックスのすべての要素がまったく同じサイズになります。

<figure>{% Codepen { user: 'web-dot-dev', id: 'XWprGea' } %}</figure>

## 役に立つ例

ボックスモデルは複雑で理解することが難しいので、例を使用して学習した内容をまとめます。

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/FBaaJXdnuSkvOx1nB0CB.jpg", alt="3つのフォトフレーム", width="800", height="562" %}</figure>

この図では、3つのフォトフレームが隣に並べて壁に取り付けられています。この図には、フレームの要素をボックスモデルに関連付けるラベルがあります。

この例を分解するには、次の手順を実行します。

- コンテンツボックスはアートワークです。
- パディングボックスは、フレームとアートワークの間にある白いマットです。
- ボーダーボックスはフレームであり、アートワークに文字通りのボーダーを提供します。
- マージンボックスは、各フレーム間のスペースです。
- 影はマージンボックスと同じスペースを占めます。

## ボックスモデルのデバッグ

ブラウザのDevToolsは、選択したボックスのボックスモデル計算を視覚化します。これは、ボックスモデルがどのように機能するか、そして重要な点として作業中のWebサイトにどのように影響するかを理解するのに役立ちます。

先に進み、ブラウザで次の手順を試します。

1. [DevToolsを開く](https://developer.chrome.com/docs/devtools/open/)
2. [要素を選択します](https://developer.chrome.com/docs/devtools/css/reference/#select)
3. ボックスモデルデバッガーを表示する

<figure>{% Video src="video/VbAJIREinuYvovrBzzvEyZOpw5w1/sKdHrAfqahgWfDVQEBBT.mp4", controls=true %}</figure>

## ボックスモデルの制御

ボックスモデルを制御する方法を理解するには、まずブラウザで発生する動作を理解する必要があります。

すべてのブラウザは、ユーザーエージェントスタイルシートをHTMLドキュメントに適用します。使用されるCSSはブラウザごとに異なりますが、コンテンツを読みやすくするために適切なデフォルト設定を提供します。これらは、CSSが定義されていない場合に、要素がどのように表示され、動作するかを定義します。 これは、ボックスのデフォルトの`display`も設定されている、ユーザーエージェントスタイルにあります。たとえば、通常のフローでは、 `<div>`要素のデフォルトの`display`値は`block`であり、 `<li>`のデフォルトの`display`値は`list-item`であり、 `<span>`のデフォルトの`display`値は`inline`です。

`inline`要素にはブロックマージンがありますが、他の要素はそれを無視します。 `inline-block`使用すると、これらの要素はブロックマージンを適用しますが、要素は`inline`要素と同じ動作のほとんどを維持します。 `block`アイテムは、デフォルトで使用可能な**インラインスペースを**埋めますが、 `inline`要素と`inline-block`要素はそのコンテンツと同じ大きさしかありません。

ユーザーエージェントのスタイルが各ボックスにどのように影響するかを理解するとともに`box-sizing`を理解する必要があります。これは、ボックスのサイズを計算する方法をボックスに指示します。デフォルトでは、すべての要素のユーザーエージェントスタイルは次のとおりです。`box-sizing: content-box;`。

`box-sizing`が`content-box`の値であるということは、`width`や`height`などのサイズを設定すると、それらが**コンテンツボックスに**適用されることを意味します。次に、 `padding`と`border`を設定すると、これらの値がコンテンツボックスのサイズに追加されます。

{% Assessment 'box-model' %}

このボックスの実際の幅は260pxになります。 CSSはデフォルトの`box-sizing: content-box`ため、適用される幅はコンテンツの幅であり、 `padding`と`border`がそれに追加されます。したがって、コンテンツの200px +パディングの40px +境界線の20pxは、合計で260pxの表示幅になります。

`border-box`を使用するように次の変更を加えることで、これ*を*制御できます。

```css/1
.my-box {
  box-sizing: border-box;
	width: 200px;
	border: 10px solid;
	padding: 20px;
}
```

この代替ボックスモデルは、CSSにコンテンツボックスではなく境界ボックスに`width`を適用するように命令します。つまり、 `border`と`padding`が*押し込まれ*ます。その結果、 `.my-box`を`200px`幅に設定すると、実際には`200px`幅でレンダリングされます。

次のインタラクティブデモでこれがどのように機能するかを確認してください。 `box-sizing`値を切り替えると、青い背景で表示されます。CSSは*ボックス内*に適用されています。

<figure>{% Codepen { user: 'web-dot-dev', id: 'oNBvVpM', height: 650 } %}</figure>

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

このCSSルールは、ドキュメント内のすべての要素と、すべての`::before`および`::after`疑似要素を選択し、 `box-sizing: border-box`を適用します。これは、すべての要素にこの代替ボックスモデルがあることを意味します。

代替ボックスモデルでは予測可能性が高くなることがあるため、[この例のように](https://piccalil.li/blog/a-modern-css-reset)、開発者はこのルールを[このような](https://piccalil.li/blog/a-modern-css-reset)リセットやノーマライザーに追加することがよくあります。

## リソース

- [ボックスモデルの紹介](https://developer.mozilla.org/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)
- [ブラウザ開発ツールとは何ですか？](https://developer.mozilla.org/docs/Learn/Common_questions/What_are_browser_developer_tools)

### ユーザーエージェントのスタイルシート

- [Chromium](https://chromium.googlesource.com/chromium/blink/+/master/Source/core/css/html.css)
- [Firefox](https://searchfox.org/mozilla-central/source/layout/style/res/html.css)
- [Webkit](https://trac.webkit.org/browser/trunk/Source/WebCore/css/html.css)
