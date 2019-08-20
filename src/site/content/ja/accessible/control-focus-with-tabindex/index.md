---
layout: post
title: tabinxed でフォーカスを制御する
authors:
  - robdodson
date: 2018-11-18
description: |
  <button> や <input> といったネイティブの HTML 要素には、キーボードアクセシビリティ機能が最初から組み込まれています。 カスタムのコンポーネントを開発している場合は、tabindex 属性でキーボードでアクセシブルになるようにしましょう。.
---
`<button>` や `<input>` といったネイティブの HTML 要素には、キーボードアクセシビ
リティ機能が最初から組み込まれています。 *カスタム*のコンポーネントを開発してい
る場合は、`tabindex` 属性でキーボードでアクセシブルになるようにしましょう。

{% Aside %}
可能な限り、独自のカスタム バージョンを作るのではなく、ネイティブのHTML 要素を使
用します。 例えば、`<button>` は非常に簡単にスタイルを当てることができ、 キー
ボード操作もサポートされています。 こうすることで、`tabindex` を管理したり、ARIA
を使ってセマンティクスを追加する必要がなくなります。
{% endAside %}

## コントロールがキーボードで制御可能か調べる

Lighthouse のようなツールを使うことでアクセシビリティの問題は発見しやすくなりま
すが、中には人間にしか調べられないものもあります。

`TAB` を使ってあなたのサイトを回遊してみて下さい。 ページ内のすべてのインタラク
ティブ コントロールを網羅することはできましたか？ もしできなかったのだとしたら、
[`tabindex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex)
を使ってコントロールのフォーカスを改善する必要があります。

{% Aside 'warning' %}
フォーカス箇所が見えない場合は、CSS で見えなくなっている可能性があります。
`:focus { outline: none; }` が使われている箇所がないか確認してみましょう。
[styling focus](https://web.dev/accessible/style-focus) を読めば具体的な直し方が
分かります。
{% endAside %}

## タブの順番に要素を追加する

`tabindex="0"` を使って自然なタブの順に要素を追加して並べ替えます。 例えば：

```html
<div tabindex="0">Focus me with the TAB key</div>
```


要素にフォーカスを当てるには、`TAB` キーを押すか、要素の `focus()` を呼び出します。

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/tabindex-zero?path=index.html&previewSize=100&attributionHidden=true"
    alt="tabindex-zero on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## タブの順番から要素を取り除く

`tabindex="-1"` を使って要素を取り除きます。 例えば：

```html
<button tabindex="-1">Can't reach me with the TAB key!</button>
```

これによって自然なタブの順番から要素を取り除きつつ、`focus()` を使ってフォーカス
を当てることもできます。

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/tabindex-negative-one?path=index.html&previewSize=100&attributionHidden=true"
    alt="tabindex-negative-one on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## 0 よりも大きい `tabindex` は避ける

0 よりも大きい `tabindex` は自然なタブの順番を壊します。 複数の要素が 0 よりも大
きい `tabindex` を持っている場合、タブの順番は 0 よりも大きい最も小さいものから
の昇順になります。

0 よりも大きい `tabindex` は、スクリーンリーダーがタブの順番ではなく、ページ内の
DOM の順番で回遊されるため、**アンチパターン** と考えられています。 もし特定の要
素にタブの順番よりも早くフォーカスを当てたい場合は、その要素を DOM 上のより前の
位置に移動するべきです。

Lighthouse を使うことで 0 よりも大きい `tabindex` を容易に見つけ出すことができま
す。 Accessibility Audit (Lighthouse > Options > Accessibility) を使って “No
element has a [tabindex] value greater than 0” の結果をご確認下さい。

## "roving `tabindex`" を使ってアクセシブルなコンポーネントを作る

複雑なコンポーネントを作っている場合、フォーカス以外にもキーボードを利用したい
ケースがあるかもしれません。 そんな時はネイティブの `select` 要素を使ってみて下
さい。 フォーカスを当てることができる上に、矢印キーを使って機能 (選択可能なオプ
ション) を追加することができます。

同様の機能は roving `tabindex` というテクニックを使って、独自のコンポーネントで
も作ることができます。 Roving tabindex は現在アクティブな要素を除く全ての小要素
の `tabindex` を -1 にすることで機能します。 そして要素は、イベントリスナーを
使ってどのキーが押されたかを検知します。

イベントが検知されると、要素はフォーカスされていた子の `tabindex` を -1 にし、次
にフォーカスする要素の `tabindex` を 0 にした上で、 `focus()` を呼びます。

**Before**

```html/2-3
<div role="toolbar">
  <button tabindex="-1">Undo</div>
  <strong><button tabindex="0">Redo</div></strong>
  <strong><button tabindex="-1">Cut</div></strong>
</div>
</pre>
```

**After**

```html/2-3
<div role="toolbar">
  <button tabindex="-1">Undo</div>
  <button tabindex="-1">Redo</div>
  <button tabindex="0">Cut</div>
</div>
```


<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/roving-tabindex?path=index.html&previewSize=100&attributionHidden=true"
    alt="tabindex-negative-one on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

{% Aside %}
`role=""` 属性が何に使われるのか気になりますか？ これを使えば、要素のセマンティ
クスを変更できるので、スクリーンリーダーにその役割を伝えることができるようになり
ます。この件についてより深く学ぶには [screen reader
basics](https://web.dev/accessible/semantics-and-screen-readers) をご覧くださ
い。
{% endAside %}

## キーボード アクセシビリティのレシピ

カスタム コンポーネントにどんなレベルのキーボード サポートが必要か分からない場合
は、[ARIA Authoring Practices
1.1](https://www.w3.org/TR/wai-aria-practices-1.1/) をご確認下さい。 このガイド
には、よくある UI パターンと、コンポーネントがサポートすべきキーが掲載されていま
す。