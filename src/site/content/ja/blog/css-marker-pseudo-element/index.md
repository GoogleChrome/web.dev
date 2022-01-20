---
layout: post
title: "CSS ::markerで箇条書きをカスタムします"
subhead: "<ul>or<ol>を使用すると、数字または箇条書きの色、サイズ、またはタイプをカスタマイズするのは簡単になります。"
authors:
  - adamargyle
  - loirooriol
description: "<ul>or<ol>を使用すると、数字または箇条書きの色、サイズ、またはタイプをカスタマイズするのは簡単になります。"
tags:
  - blog
  - css
date: 2020-09-02
updated: 2020-09-02
scheduled: NS
hero: image/admin/GPGTyXJOh0cH0wa1PvXH.png
thumbnail: image/admin/jbdOq0tGGzobMtaBsajn.png
alt: 箇条書きとテキストの周りに別々のボックスを配置して、単一のリストアイテムの構造を表示する
feedback:
  - api
---

ブルームバーグが後援しているIgaliaのおかげで、私たちはついにスタイリングリストのハックを片付けることができます。見る！

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/WOmqXrog0YoriZqqIzEZ.png", alt="", width="665", height="384" %} <figcaption> <a href="https://glitch.com/edit/#!/marker-fun-example">ソースを見る</a> </figcaption></figure>

[CSS `::marker`](https://www.w3.org/TR/css-lists-3/#marker-pseudo)で、箇条書きと数字の内容といくつかのスタイルを変更できます。

## ブラウザの互換性

`::marker`は、Firefox for DesktopとAndroid、デスクトップSafariとiOS Safari（ただし、 `color`と`font-*`プロパティのみ、[バグ204163を](https://bugs.webkit.org/show_bug.cgi?id=204163)参照）、およびChromium-basedのデスクトップとAndroidブラウザでサポートされています。アップデートについては、MDNの[ブラウザ互換性](https://developer.mozilla.org/docs/Web/CSS/::marker#Browser_compatibility)テーブルを参照してください。

## 疑似要素

次の重要なHTMLの順序付けされていないリストを検討してください。

```html
<ul>
  <li>Lorem ipsum dolor sit amet consectetur adipisicing elit</li>
  <li>Dolores quaerat illo totam porro</li>
  <li>Quidem aliquid perferendis voluptates</li>
  <li>Ipsa adipisci fugit assumenda dicta voluptates nihil reprehenderit consequatur alias facilis rem</li>
  <li>Fuga</li>
</ul>
```

次の予想できるレンダリングにつながるのは何ですか？

<div class="glitch-embed-wrap" style="height: 480px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-plain-list?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

`<li>`アイテムの先頭のドットは無料です！ブラウザは、生成されたマーカーボックスを描画および作成しています。

本日、ブラウザが作成する箇条書き要素のスタイルを設定する機能を提供する`::marker`疑似要素についてお話させて頂き喜びます。

{% Aside 'key-term' %}疑似要素は、document treeにある要素と違うドキュメント内の要素を表します。例えば、`p::first-line`を使用したら、段落にある最初の行を選択できますが、そのテキスト行をラップするHTML要素はありません。 {% endAside %}

### Markerの作成

`::marker`疑似要素マーカーボックスは、すべてのリストアイテム要素内に自動的に生成され、実際のコンテンツと `::before`疑似要素の前に存在します。

```css
li::before {
  content: "::before";
  background: lightgray;
  border-radius: 1ch;
  padding-inline: 1ch;
  margin-inline-end: 1ch;
}
```

<div class="glitch-embed-wrap" style="height: 340px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-before-example?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

通常、リストアイテムは`<li>` HTML要素ですが、他の要素も`display: list-item`とリストアイテムになることができます。

```html
<dl>
  <dt>Lorem</dt>
  <dd>Lorem ipsum dolor sit amet consectetur adipisicing elit</dd>
  <dd>Dolores quaerat illo totam porro</dd>

  <dt>Ipsum</dt>
  <dd>Quidem aliquid perferendis voluptates</dd>
</dl>
```

```css/1
dd {
  display: list-item;
  list-style-type: "🤯";
  padding-inline-start: 1ch;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-definition-list?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

### マーカーのスタイリング

`::marker`までは`list-style-type`と`list-style-image`を使用してリストのスタイルを設定し、1行のCSSでリストアイテムのシンボルを変更できます。

```css
li {
  list-style-image: url(/right-arrow.svg);
  /* OR */
  list-style-type: '👉';
  padding-inline-start: 1ch;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-list-style-type?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

これは十分に便利ですが、より改善する必要です。色、サイズ、間隔などを変更するのはどうですか？そこで、 `::marker`が役に立ちます。これにより、CSS:からこれらの疑似要素を個別およびグローバルにターゲティングできます。

```css
li::marker {
  color: hotpink;
}

li:first-child::marker {
  font-size: 5rem;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-style-introduction?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

{% Aside 'caution' %}上記のリストにピンク色の箇条書きがない場合、 `::marker`はブラウザでサポートされていません。 {% endAside %}

`list-style-type`プロパティは、指定のスタイリングの可能性を提供します。 `::marker`疑似要素は、marker自体をターゲットでき、それに直接スタイルを適用できることを意味します。これにより、はるかに細かく制御する可能になります。

`::marker`ですべてのCSSプロパティを使用できるわけではありません。許可されているプロパティと許可されていないプロパティのリストは、仕様に明確に示されています。この疑似要素で面白いものを試するがうまくいかない場合は、以下のリストを参考し、CSSでできることとできないことの案内してもらいます。

#### 許可されたCSS `::marker`プロパティ

- `animation-*`
- `transition-*`
- `color`
- `direction`
- `font-*`
- `content`
- `unicode-bidi`
- `white-space`

`::marker`内容の変更は、 `list-style-type`ではなく`content`で行われます。この次の例では、一番目の項目は`list-style-type`を、2番目の項目は`::marker`を使用してスタイル設定されます。一番目のケースのプロパティは、markerだけでなくリストアイテム全体に適用されます。つまり、テキストはmarkerと同様にアニメーション化されます。 `::marker`を使用する場合、テキストではなくmarkerボックスのみをターゲットにできます。

許可されない`background`プロパティがどのように影響しないかに注意してください。

<div class="switcher">
{% Compare 'worse', 'List Styles' %}
```css
li:nth-child(1) {
  list-style-type: '?';
  font-size: 2rem;
  background: hsl(200 20% 88%);
  animation: color-change 3s ease-in-out infinite;
}
```

{% CompareCaption %}
Mixed results between the marker and the list item
{% endCompareCaption %}

{% endCompare %}

{% Compare 'better', 'Marker Styles' %}
```css
li:nth-child(2)::marker {
  content: '!';
  font-size: 2rem;
  background: hsl(200 20% 88%);
  animation: color-change 3s ease-in-out infinite;
}
```

{% CompareCaption %}
Focused results between marker and list item
{% endCompareCaption %}

{% endCompare %}
</div>

<br>

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/marker-style-vs-list-style-type?path=style.css&previewSize=100"
    alt="List Demo on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

{% Aside 'gotchas' %} Chromiumでは、 `white-space`は内側に配置されたmarkerにのみ機能します。外側に配置されたmarkerの場合、末尾のスペースを保持できるようにスタイルアジャスターは常に`white-space: pre`を強制します。 {% endAside %}

#### Markerの内容を変更する

Markerのスタイルを設定する方法は次に表示します。

**すべてのリストアイテムを変更する**

```css
li {
  list-style-type: "😍";
}

/* OR */

li::marker {
  content: "😍";
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-change-all?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

**1つのリストアイテムのみを変更する**

```css
li:last-child::marker {
  content: "😍";
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-change-one?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

**リストアイテムをSVGに変更する**

```css
li::marker {
  content: url(/heart.svg);
  content: url(#heart);
  content: url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='24' width='24'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' fill='none' stroke='hotpink' stroke-width='3'/></svg>");
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-inline-svg?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

**番号付きリストの変更**`<ol>`はどうですか？順序付きリストアイテムのマーカーは数字であり、デフォルトで箇条書きではありません。CSSでは、これらが[Counter](https://developer.mozilla.org/docs/Web/CSS/CSS_Lists_and_Counters/Using_CSS_counters)と呼ばれ、そして非常に強力です。数字の開始位置と終了位置を設定およびリセットしたり、ローマ数字に切り替えたりするためのプロパティもあります。それをスタイリングできますか？はい、markerコンテンツの値を使用して、独自の番号付けプレゼンテーションを作成することもできます。

```css
li::marker {
  content: counter(list-item) "› ";
  color: hotpink;
}
```

<div class="glitch-embed-wrap" style="height: 420px; width: 100%;">   <iframe src="https://glitch.com/embed/#!/embed/marker-numbered-lists?path=style.css&amp;previewSize=100" alt="List Demo on Glitch" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

### デバッグ

`::marker`疑似要素に適用されるスタイルの検査、デバッグ、および変更をサポートできるようになりました。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/PYKVXEzycrMhQujXsNxQ.png", alt="DevToolsがユーザーエージェントからのスタイルとユーザースタイルを開いて、表示します", width="776", height="574", style="max-inline-size: 480px" %}</figure>

### 将来の疑似要素のスタイリング

:: markerの詳細については、次のサイトをご覧ください。

- [Smashing Magazineの](https://www.smashingmagazine.com/)[CSSリスト、Marker、Counter](https://www.smashingmagazine.com/2019/07/css-lists-markers-counters/)
- [CSS-Tricks](https://css-tricks.com/)からの[CSS CounterとCSS Gridによるカウント](https://css-tricks.com/counting-css-counters-css-grid/)
- [MDNの](https://developer.mozilla.org/)[CSS Counterを使用する](https://developer.mozilla.org/docs/Web/CSS/CSS_Lists_and_Counters/Using_CSS_counters)

スタイリングが難しいものにアクセスできるのは素晴らしいことです。あなたが他の自動生成された要素のスタイルを設定したいかもしれません。`<details>`または検索入力のオートコンプリートインジケーターに不満を感じるかもしれません。これらはブラウザー間で同じように実装されていません。必要なものを共有するには、 [https：//webwewant.fyiで](https://webwewant.fyi)に欲しいものを作成することです。
