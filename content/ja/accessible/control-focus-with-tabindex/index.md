---
page_type: guide
title: tabinxed でフォーカスを制御する
description: |
  <button> や <input> といったネイティブの HTML 要素には、キーボードアクセシビリティ機能が最初から組み込まれています。 カスタムのコンポーネントを開発している場合は、tabindex 属性でキーボードでアクセシブルになるようにしましょう。
author: robdodson
web_lighthouse:
  - tabindex
  - focusable-controls
web_updated_on: 2018-12-06
web_published_on: 2018-11-18
wf_blink_components: Blink>Accessibility
---
# tabinxed でフォーカスを制御する

`<button>` や `<input>` といったネイティブの HTML 要素には、キーボードアクセシビリティ機能が最初から組み込まれています。 *カスタム*のコンポーネントを開発している場合は、`tabindex` 属性でキーボードでアクセシブルになるようにしましょう。

<div class="aside note">
  可能な限り、独自のカスタム バージョンを作るのではなく、ネイティブの HTML 要素を使用します。 例えば、<code>&lt;button&gt;<code> は非常に簡単にスタイルを当てることができ、 キーボード操作もサポートされています。 こうすることで、<code>tabindex</code> を管理したり、ARIA を使ってセマンティクスを追加する必要がなくなります。
</div>

## コントロールがキーボードで制御可能か調べる

Lighthouse のようなツールを使うことでアクセシビリティの問題は発見しやすくなりますが、中には人間にしか調べられないものもあります。

`TAB` を使ってあなたのサイトを回遊してみて下さい。 ページ内のすべてのインタラクティブ コントロールを網羅することはできましたか？ もしできなかったのだとしたら、[`tabindex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) を使ってコントロールのフォーカスを改善する必要があります。

<div class="aside warning">
  フォーカス箇所が見えない場合は、CSS で見えなくなっている可能性があります。 <code>:focus { outline: none; }</code> が使われている箇所がないか確認してみましょう。
  <a href="https://web.dev/accessible/style-focus">styling focus</a> を読めば具体的な直し方が分かります。
</div>

## タブの順番に要素を追加する

`tabindex="0"` を使って自然なタブの順に要素を追加して並べ替えます。 例えば：

    <div tabindex="0">Focus me with the TAB key</div>
    

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

    <button tabindex="-1">Can't reach me with the TAB key!</button>
    

これによって自然なタブの順番から要素を取り除きつつ、`focus()` を使ってフォーカスを当てることもできます。

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/tabindex-negative-one?path=index.html&previewSize=100&attributionHidden=true"
    alt="tabindex-negative-one on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

## 0 よりも大きい `tabindex` は避ける

0 よりも大きい `tabindex` は自然なタブの順番を壊します。 複数の要素が 0 よりも大きい `tabindex` を持っている場合、タブの順番は 0 よりも大きい最も小さいものからの昇順になります。

0 よりも大きい `tabindex` は、スクリーンリーダーがタブの順番ではなく、ページ内の DOM の順番で回遊されるため、**アンチパターン** と考えられています。 もし特定の要素にタブの順番よりも早くフォーカスを当てたい場合は、その要素を DOM 上のより前の位置に移動するべきです。

Lighthouse を使うことで 0 よりも大きい `tabindex` を容易に見つけ出すことができます。 Accessibility Audit (Lighthouse > Options > Accessibility) を使って “No element has a [tabindex] value greater than 0” の結果をご確認下さい。

## "roving `tabindex`" を使ってアクセシブルなコンポーネントを作る

複雑なコンポーネントを作っている場合、フォーカス以外にもキーボードを利用したいケースがあるかもしれません。 そんな時はネイティブの `select` 要素を使ってみて下さい。 フォーカスを当てることができる上に、矢印キーを使って機能 (選択可能なオプション) を追加することができます。

同様の機能は roving `tabindex` というテクニックを使って、独自のコンポーネントでも作ることができます。 Roving tabindex は現在アクティブな要素を除く全ての小要素の `tabindex` を -1 にすることで機能します。 そして要素は、イベントリスナーを使ってどのキーが押されたかを検知します。

イベントが検知されると、要素はフォーカスされていた子の `tabindex` を -1 にし、次にフォーカスする要素の `tabindex` を 0 にした上で、 `focus()` を呼びます。

**Before**

<pre class="prettyprint devsite-disable-click-to-copy">&lt;div role="toolbar"&gt;
  &lt;button tabindex="-1"&gt;Undo&lt;/div&gt;
  <strong>&lt;button tabindex="0"&gt;Redo&lt;/div&gt;</strong>
  <strong>&lt;button tabindex="-1"&gt;Cut&lt;/div&gt;</strong>
&lt;/div&gt;
</pre>

**After**

<pre class="prettyprint devsite-disable-click-to-copy">&lt;div role="toolbar"&gt;
  &lt;button tabindex="-1"&gt;Undo&lt;/div&gt;
  <strong>&lt;button tabindex="-1"&gt;Redo&lt;/div&gt;</strong>
  <strong>&lt;button tabindex="0"&gt;Cut&lt;/div&gt;</strong>
&lt;/div&gt;
</pre>

<div class="glitch-embed-wrap" style="height: 346px; width: 100%;">
  <iframe
    src="https://glitch.com/embed/#!/embed/roving-tabindex?path=index.html&previewSize=100&attributionHidden=true"
    alt="tabindex-negative-one on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>

<div class="aside note">
  role="" 属性が何に使われるのか気になりますか？ これを使えば、要素のセマンティクスを変更できるので、スクリーンリーダーにその役割を伝えることができるようになります。
  この件についてより深く学ぶには <a href="https://web.dev/accessible/semantics-and-screen-readers">screen reader basics</a> をご覧ください。
</div>

## キーボード アクセシビリティのレシピ

カスタム コンポーネントにどんなレベルのキーボード サポートが必要か分からない場合は、[ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/) をご確認下さい。 このガイドには、よくある UI パターンと、コンポーネントがサポートすべきキーが掲載されています。