---
title: セレクター
description: 要素に CSS を適用するには、要素を選択する必要があります。CSS には、これを行う方法がたくさんあります。本モジュールではそれを詳しく見ていきます。
audio:
  title: CSS ポッドキャスト   - 002：セレクター
  src: "https://traffic.libsyn.com/secure/thecsspodcast/TCP_CSS_Podcast__Episode_002_v2.0_FINAL.mp3?dest-id=1891556"
  thumbnail: image/foR0vJZKULb5AGJExlazy1xYDgI2/ECDb0qa4TB7yUsHwBic8.png
authors:
  - andybell
date: 2021-03-29
---

記事の最初のパラグラフとして使用される場合には、サイズを大きくして、かつ赤色で表示したいテキストがあるとします。

```html
<article>
  <p>I want to be red and larger than the other text.</p>
  <p>I want to be normal sized and the default color.</p>
</article>
```

その場合は、CSS セレクターを使ってその特定の要素を検索し、次のように CSS ルールを適用します。

```css
article p:first-of-type {
  color: red;
  font-size: 1.5em;
}
```

このような状況を解決するために、CSS には対象となる要素を選択し、それに対して、シンプルさや複雑さを問わず、さまざまなルールを適用できるオプションがたくさんあります。

{% Codepen { user: 'web-dot-dev', id: 'XWprGYz', height: 250 } %}

## CSS ルールの構成要素

CSS におけるセレクターの機能の仕組みと役割について理解するには、CSS ルールを構成する各要素について知っておくことが重要です。 CSS ルールは、1 つ以上のセレクターと 1 つ以上の宣言を含むコードブロックです。

<figure>{% Img src="image/VbAJIREinuYvovrBzzvEyZOpw5w1/hFR4OOwyH5zWc5XUIcyu.svg", alt=".my-css-rule というセレクターが使用された CSS ルールの画像", width="800", height="427" %}を使用したCSSルールの画像</figure>

この CSS ルールの**セレクター**は、`.my-css-rule` で、ページ上で `my-css-rule` というクラスを持つすべての要素を検索します。中括弧内には 3 つの宣言があります。宣言とは、セレクターによって一致する要素にスタイルを適用するプロパティと値のペアです。CSS ルールで使用できる宣言とセレクターの数に制限はありません。

## シンプルなセレクター

最もシンプルなセレクターは、HTML タグに追加できる HTML 要素とタグ、ID、またそれ以外の属性をターゲットにします。

### ユニバーサルセレクター

[ユニバーサルセレクター](https://developer.mozilla.org/docs/Web/CSS/Universal_selectors) (別名ワイルドカード) は、あらゆる要素をマッチさせます。

```css
* {
  color: hotpink;
}
```

上のルールを使うと、ページ上のすべての HTML 要素のテキストはホットピンクで表示されます。

### タイプセレクター

[タイプセレクター](https://developer.mozilla.org/docs/Web/CSS/Type_selectors)は、指定する HTML 要素を直接マッチさせます。

```css
section {
  padding: 2em;
}
```

上のルールを使うと、`<section>` の各要素の全側面に `2em` の `padding` が適用されます。

### クラスセレクター

HTML 要素は、`class` 属性に 1 つ以上の項目を定義できます。[クラスセレクター](https://developer.mozilla.org/docs/Web/CSS/Class_selectors)は、そのクラスが適用されているすべての要素をマッチさせます。

```html
<div class="my-class"></div>
<button class="my-class"></button>
<p class="my-class"></p>
```

クラスが適用されている要素はすべて赤になります。

```css
.my-class {
  color: red;
}
```

`.` が CSS だけに使われている (HTML には**使われていない**) 点に注意してください。その理由は、`.` 文字を使うと、CSS 言語にクラス属性のメンバーを一致させるよう指示できるためです。これは CSS で一般的に使われるパターンであり、1 つまたは複数の特殊文字によってセレクターのタイプが定義されます。

`.my-class` クラスを持つ HTML 要素は、以下のようなクラスが他にいくつかある場合でも、上記の CSS ルールにマッチされます。

```html
<div class="my-class another-class some-other-class"></div>
```

それは、CSS は、定義されたクラスそのものにマッチさせるのではなく、そのクラスを*持つ* `class` 属性を探すことが理由です。

{% Aside %}クラス属性の値は、ほぼすべての値にすることができます。クラス名 (または ID) は、`.1element` のように、数字からはじめることはできませんので、注意が必要です。詳しくは、[仕様](https://www.w3.org/TR/CSS21/syndata.html#characters)をお読みください。{% endAside %}

### ID セレクター

`id` 属性を持つ HTML 要素は、ページ上でその ID 値を持つ唯一の要素でなくてはいけません。[ID セレクター](https://developer.mozilla.org/docs/Web/CSS/ID_selectors)を使って要素を選択する場合は、以下のようにします。

```css
#rad {
  border: 1px solid blue;
}
```

この CSS は、`rad` という `id` を持つ HTML 要素に青い境界線を適用します。以下のように記述します。

```html
<div id="rad"></div>
```

クラスセレクター `.` の場合と似ていますが、CSS に特定の `id` にマッチする要素を探す指示をするときは、`#` 文字の後に対象となる要素の名前を記述します。

{% Aside %} ブラウザは、`id` のインスタンスを複数個検出しても、セレクターが一致する CSS ルールを適用します。 ただし、`id` 属性を持つ要素は、その id に対して一意の値を持つことが決められているため、1 つの要素に対して非常に具体的な CSS を記述していない限り、`id` セレクターを使ったスタイルは、再利用できなくなることを避ける意味でも、適用しない方が無難でしょう。{% endAside %}

### 属性セレクター

[属性セレクター](https://developer.mozilla.org/docs/Web/CSS/Attribute_selectors)を使用すれば、特定の HTML 属性を持つ要素や HTML 属性に特定の値を持つ要素を探すことができます。セレクターを (`[ ]`) で囲めば、特定の属性を探すよう CSS に指示することができます。

```css
[data-type='primary'] {
  color: red;
}
```

こちらの CSS は、`data-type` 属性の値が `primary` となっているすべての要素を探します。

```html
<div data-type="primary"></div>
```

`data-type` の特定の値を探さずに、値を問わず、何らかの属性を持つ要素を探すこともできます。

```css
[data-type] {
  color: red;
}
```

```html
<div data-type="primary"></div>
<div data-type="secondary"></div>
```

上の `<div>` 要素は 2 つともテキストの色が赤くなります。

属性セレクターに `s` 演算子を追加すれば、ケース (大文字と小文字) を区別する属性セレクターを使用できます。

```css
[data-type='primary' s] {
  color: red;
}
```

つまり、HTML 要素の `data-type` が `primary` ではなく、`Primary` であれば、テキストの色は赤くなりません。その逆のパターンとして、`i` 演算子を使用すれば、大文字と小文字は区別されません。

ケース演算子の他にも、属性値内の文字列を部分的にマッチさせる演算子も使用できます。

```css
/* A href that contains "example.com" */
[href*='example.com'] {
  color: red;
}

/* A href that starts with https */
[href^='https'] {
  color: green;
}

/* A href that ends with .com */
[href$='.com'] {
  color: blue;
}
```

<figure>{% Codepen { user: 'web-dot-dev', id: 'BapBbOy' } %} <figcaption>このデモでは、属性セレクターの `$` 演算子が `href` 属性からファイルの種類を取得しています。これにより、取得したファイルの種類に応じて、疑似要素を使ってラベルにプレフィックスを付けることができます。</figcaption></figure>

### グループ化セレクター

セレクターは、複数の要素をマッチさせることができます。複数のセレクターをコンマで区切れば、1 つのグループにできます。

```css
strong,
em,
.my-class,
[lang] {
  color: red;
}
```

この例では、色の変更の適用範囲が `<strong>` 要素と `<em>` 要素の両方に拡張されています。また、`.my-class` という名前のクラスと `lang` 属性を持つ要素にも拡張されています。

{% Assessment 'simple-selectors' %}

## 疑似クラスと疑似要素

CSS は、プラットフォームの特定の状態 (要素がホバーされたときなど) や、*要素内*の構造、要素の一部などにフォーカスする便利なセレクタータイプを提供します。

### 疑似クラス

HTML 要素は、操作中であったり、子要素の 1 つが一定の状態にあったりするため、さまざまな状態が発生します。

たとえば、ユーザーは、マウスポインターを使って HTML 要素*または*子要素をホバーすることもできます。このような状況では、`:hover` 疑似クラスを使用します。

```css
/* Our link is hovered */
a:hover {
  outline: 1px dotted green;
}

/* Sets all even paragraphs to have a different background */
p:nth-child(even) {
  background: floralwhite;
}
```

詳しくは、[pseudo-classes module (疑似クラスモジュール)](/learn/css/pseudo-classes)をご覧ください。

### 疑似要素

疑似要素は、プラットフォームの状態に応答する代わりに、CSS で新しい要素を挿入しているかのように機能するため、疑似クラスとは異なります。 また、疑似要素は、1 つのコロン (`:`) を使用する代わりに二重コロン (`::`) を使用するため、構文的にも異なります。

{% Aside %}二重コロン (`::`) は、疑似要素と疑似クラスを区別するものですが、この区別は古いバージョンの CSS 仕様にはなかったため、ブラウザーは、IE8 といった古いブラウザーとの下位互換性を維持できるよう、`:before` や `:after` のように、元の疑似要素に対し単一のコロンを使用することをサポートしています。{% endAside %}

```css
.my-element::before {
  content: 'Prefix - ';
}
```

上のデモでリンクのラベルの前にファイルのタイプが付けられていることからも分かるように、コンテンツは `::before` 疑似要素を使用すれば**要素の先頭に**、`::after` 疑似要素を使用すれば**要素の終わりに**挿入できます。

しかし、疑似要素は、コンテンツを挿入する以外にも、要素の特定の部分をターゲットにすることにも使用できます。たとえば、何らかのリストがある場合、`::marker` を使用すれば、リスト内の各箇条書や数字のスタイルを指定できます

```css
/* Your list will now either have red dots, or red numbers */
li::marker {
  color: red;
}
```

また、`::selection` を使用すれば、ユーザーがハイライトしたコンテンツのスタイルを指定できます。

```css
::selection {
  background: black;
  color: white;
}
```

詳しくは、[module on pseudo-elements (疑似要素に関するモジュール)](/learn/css/pseudo-elements) をご覧ください。

{% Assessment 'pseudo-selectors' %}

## 複雑なセレクター

これまでさまざまな種類のセレクターを紹介してきましたが、CSS を使った*より細かな制御*が必要になる場合があります。そこで便利なのが、複雑なセレクターです。

次に紹介するセレクターを使うと、より細かな制御が可能になる一方で、下方にしかカスケードできない、つまり子要素しか選択できないことをこの時点で覚えておくとよいでしょう。上方にターゲットを合わせ、親要素を選択することはできません。カスケードの概要と仕組みについては、[後のセッション](/learn/css/the-cascade)でカバーします。

### コンビネータ

コンビネータは、2 つのセレクターの間に記述します。たとえば、`p > strong` というセレクターがあれば、`>` 文字がコンビネーターです。こうしたコンビネータを使用するセレクタは、ドキュメント内の位置に基づいてアイテムを選択するのに役立ちます。

#### 子孫コンビネータ

子孫コンビネータについて理解するには、まず最初に親要素と子要素について理解する必要があります。

```html
<p>A paragraph of text with some <strong>bold text for emphasis</strong>.</p>
```

テキストを含む `<p>` が親要素です。その `<p>` 要素の中に `<strong>` 要素があり、その中がコンテンツが太字になります。`<p>` 要素の中にあるため、子要素となります。

子孫コンビネータを使用すると、子要素をターゲットにできます。その場合はスペース (` `) を使い、ブラウザに子要素を探す指示を出します。

```css
p strong {
  color: blue;
}
```

上のスニペットでは、`<p>` 要素の子要素である `<strong>` 要素がすべて選択され、テキストは再帰的に青色にされます。

<figure>{% Codepen { user: 'web-dot-dev', id: 'BapBbGN' } %} <figcaption>子孫コンビネータは再帰的な働きをするため、各子要素に追加されたパディングが適用されるので、互い違いな効果が得られます。</figcaption></figure>

その効果は、上の例で `.top div` を使用すると分かりやすく視覚化できるでしょう。その CSS ルールは、そうした`<div>` 要素に左パディングを追加します。コンビネータは再帰的に働くため、`.top` 内にあるすべての `<div>` 要素に同じパディングが適用されます。

このデモの HTML ウィンドウを見れば、`.top` 要素に複数の `<div>` 子要素があり、それらの中にも `<div>` 子要素があるのが分かります。

#### 隣接兄弟コンビネータ

セレクターに「`+`」文字を使用すると、ある要素の直後に続く要素を探すことができます。

{% Codepen { user: 'web-dot-dev', id: 'JjEPzwB' } %}

スタックされた要素の間にスペースを追加したい場合、対象の要素が `.top` の子要素に隣接する**次の兄弟**であれば、隣接兄弟コンビネータを使用します。

下のセレクターを使用すれば、`.top` のすべての子要素にマージンを追加できます。

```css
.top * {
  margin-top: 1em;
}
```

このルールは、`.top` のすべての子要素を選択しているため、余分かつ不要なスペースが作成される可能性があるという問題点があります。**隣接兄弟コンビネータ** を **ユニバーサルセレクター** を組み合わせれば、スペースを追加する要素をコントロールできるだけでなく、**どの要素にも**スペースを適用することができます。そうすれば、`.top` どのような HTML 要素が表示されても、長期的に柔軟に対応できます。

#### 後続兄弟コンビネータ

後続コンビネータは、隣接兄弟セレクターと非常によく似ていまが「`+`」文字の代わりに「`~`」文字を使用します。同じ親を持つ隣接要素ではなく、同じ親を持つ別の要素の後に来る要素が対象になるという点で異なります。

<figure>{% Codepen { user: 'web-dot-dev', id: 'ZELzPPX', height: 400 } %} <figcaption>純粋な CSS スイッチ要素を作成するには、後続セレクターを「:checked」疑似クラスと一緒に使用します。</figcaption></figure>

この後続コンビネータは、わずかながら柔軟性があるため、カスタムスイッチに関連付けられているチェックボックスが `:checked` の状態にあるときは、そのカスタムスイッチの色を変更するといった上のサンプルのようなコンテキストでは便利です。

#### 子コンビネータ

子コンビネータ (別名: 直系子孫) を使用すると、コンビネータセレクタの使用に伴う再帰をより細かく制御できます。`>` 文字を使用すれば、コンビネータセレクターを**直接の子にのみ**適用できます。

先ほど紹介した隣接兄弟セレクターの例について考えてみましょう。各**隣接兄弟**にスペースが追加された訳ですが、対象となっている要素がその子として**隣接兄弟要素**を持っている場合は、不要かつ余分なスペースができてしまう場合があります。

{% Codepen { user: 'web-dot-dev', id: 'ExZYMJL' } %}

この問題を解決するには、**隣接兄弟セレクター** を `> * + *` のように、子コンビネーターを取り入れるかたちで変更します。これで、このルールは、`.top` の直接の子**だけに**適用されるようになります。

{% Codepen { user: 'web-dot-dev', id: 'dyNbrEr' } %}

### 複合セレクター

セレクターを組み合われば、特定性と読みやすさを高めることができます。たとえば、`.my-class`  クラスを持つ `<a>` 要素をターゲットにするには、次のように記述します。

```css
a.my-class {
  color: red;
}
```

これは、すべてのリンクに赤色を適用するものではありません。むしろ、`.my-class` に赤色が適用されるのは、それが `<a>` 要素にある**場合に限ります**。詳しくは、[specificity module (特異性モジュール)](/learn/css/specificity) を参照してください。

{% Assessment 'complex-selectors' %}

## リソース

- [CSS selectors reference (CSS セレクターのリファレンス)](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors)
- [}Interactive selectors game (インタラクティブセレクターゲーム)](https://flukeout.github.io/)
- [Pseudo-class and pseudo-elements reference (疑似クラスおよび疑似要素のリファレンス)](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors/Pseudo-classes_and_pseudo-elements)
- [A tool that translates CSS selectors into plain-english explainers (CSS セレクターをわかりやすい英語の説明に変換するツール)](https://kittygiraudel.github.io/selectors-explained/)
