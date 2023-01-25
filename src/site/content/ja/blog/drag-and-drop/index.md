---
title: HTML5 Drag and Drop APIの使用
authors:
  - ericbidelman
  - rachelandrew
date: 2010-09-30
updated: 2021-08-30
description: |2-

  HTML5 Drag and Drop (DnD) APIを使うということは、ページ上のほぼすべての要素をドラッグ可能にできるということです。本記事では、ドラッグ & ドロップの基礎について説明します。
tags:
  - blog
  - html
  - javascript
  - file-system
---

HTML5 Drag and Drop (DnD) APIを使うということは、ページ上のほぼすべての要素をドラッグ可能にできるということです。本記事では、ドラッグ &amp; ドロップの基礎について説明します。

## ドラッグ可能なコンテンツの作成

ほとんどのブラウザで、テキストの選択、画像、リンクがデフォルトでドラッグ可能になっていることは注目に値するでしょう。たとえば、[Google検索で](https://google.com)Googleロゴをドラッグすると、ゴースト画像が表示されます。次に、画像をアドレスバー、 `<input type="file" />`要素、またはデスクトップにドロップできます。他のタイプのコンテンツをドラッグ可能にするには、HTML5 DnD APIを使用する必要があります。

オブジェクトをドラッグ可能にするには、その要素に対して`draggable=true`と設定します。画像、ファイル、リンク、またはページ上のマークアップなど、ほぼすべてのものをドラッグ可能にできます。

この例では、CSSグリッドでレイアウトされたいくつかの列を再配置するためのインターフェイスを作成しています。私の列の基本的なマークアップは次のようになり、各列で`draggable`が`true`に設定されています。

```html
<div class="container">
  <div draggable="true" class="box">A</div>
  <div draggable="true" class="box">B</div>
  <div draggable="true" class="box">C</div>
</div>
```

こちらは私のコンテナ要素とボックス要素のCSSです。DnD 機能に関連するCSSは、[`cursor: move`](https://developer.mozilla.org/docs/Web/CSS/cursor)プロパティのみであることに注目してください。コードの残りの部分は、コンテナとボックス要素のレイアウトとスタイルを制御しています。

```css/11
.container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.box {
  border: 3px solid #666;
  background-color: #ddd;
  border-radius: .5em;
  padding: 10px;
  cursor: move;
}
```

この時点で、アイテムをドラッグできることがわかりますが、他には何も起こりません。 DnD機能を追加するには、JavaScript APIを使用する必要があります。

## ドラッグイベントをリッスンする

ドラッグ &amp; ドロップのプロセス全体を監視する目的でアタッチするイベントは多岐に渡ります。

- [`dragstart`](https://developer.mozilla.org/docs/Web/API/Document/dragstart_event)
- [`drag`](https://developer.mozilla.org/docs/Web/API/Document/drag_event)
- [`dragenter`](https://developer.mozilla.org/docs/Web/API/Document/dragenter_event)
- [`dragleave`](https://developer.mozilla.org/docs/Web/API/Document/dragleave_event)
- [`dragover`](https://developer.mozilla.org/docs/Web/API/Document/dragover_event)
- [`drop`](https://developer.mozilla.org/docs/Web/API/Document/drop_event)
- [`dragend`](https://developer.mozilla.org/docs/Web/API/Document/dragend_event)

DnDフローを処理するには、ある種のソース要素（ドラッグが発生する場所）、データペイロード（ドロップしようとしているもの）、およびターゲット（ドロップをキャッチする領域）が必要です。ソース要素には、画像、リスト、リンク、ファイルオブジェクト、HTMLのブロックなどがあります。ターゲットは、ユーザーがドロップしようとしているデータを受け入れるドロップゾーン（または一連のドロップゾーン）です。すべての要素をターゲットにできるわけではないことに注意してください。たとえば、画像はターゲットにできません。

## ドラッグ &amp; ドロップシーケンスの開始と終了

コンテンツに対して`draggable="true"`属性を定義したら、`dragstart`イベントハンドラーをアタッチして、各列のDnDシーケンスを開始します。

このコードは、ユーザーが列をドラッグし始めたときに列の不透明度を40％に設定し、ドラッグイベントが終了したときに100％に戻します。

```js
function handleDragStart(e) {
    this.style.opacity = '0.4';
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';
  }

  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);
  });
```

結果は、下のGlitchデモで確認できます。アイテムをドラッグすると不透明になります。`dragstart`イベントのターゲットはソース要素であるため、`this.style.opacity`を40％に設定すると、移動されているのが現在選択している要素であるという視覚的なフィードバックがユーザーに与えられます。アイテムをドロップすると、ドロップ機能は適用されませんが、ソース要素の不透明度は100%に戻ります。

{% Glitch { id: 'simple-drag-and-drop-1', path: 'style.css' } %}

## `dragenter` 、 `dragover` 、`dragleave`を使用して視覚的な手がかりを追加する

インターフェースの操作方法を理解しやすくするために、 3つのイベントハンドラー `dragenter` 、`dragover` 、`dragleave`を使用します。この例の列は、ドラッグ可能であることに加えて、ドロップターゲットでもあります。ユーザーがこれを理解しやすいように、ドラッグしたアイテムを列の上に移動させたとたんに境界線が破線に変わるようにすると良いでしょう。たとえば、CSSで、ドロップターゲットである要素を表すには、`over`クラスを作成することをおすすめします。

```css
.box.over {
  border: 3px dotted #666;
}
```

次に、JavaScriptでイベントハンドラーを設定し、列がドラッグされるときに`over`クラスを追加し、ドラッグを止めるときに削除します。また、`dragend`ハンドラでは、ドラッグの終了時に必ずクラスを削除します。

```js/9-11,14-28,34-36
document.addEventListener('DOMContentLoaded', (event) => {

  function handleDragStart(e) {
    this.style.opacity = '0.4';
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';

    items.forEach(function (item) {
      item.classList.remove('over');
    });
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }

    return false;
  }

  function handleDragEnter(e) {
    this.classList.add('over');
  }

  function handleDragLeave(e) {
    this.classList.remove('over');
  }

  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
  });
});
```

{% Glitch { id: 'simple-drag-drop2', path: 'dnd.js' } %}

このコードには、カバーしておく価値のあるポイントがいくつかあります。

- リンクのようなものをドラッグする場合、そのリンクに移動しようとするブラウザのデフォルト動作を防ぐ必要があります。これを行うには`dragover`イベントで`e.preventDefault()`を呼び出します。同じハンドラーで、`false`を返すのも良いプラクティスです。
- `over`クラスを切り替える場合は、`dragover`ではなく、`dragenter`イベントハンドラーが使用されます。`dragover`を使用すると、列のホバー時に`dragover`イベントが引き続き発生するため、CSSクラスが何度も切り替えられることになります。最終的には、ブラウザのレンダラーが不要な作業を大量に行うことになります。再描画を最小限に抑えることに間違いはありません。`dragover`イベントを何かに使用する必要がある場合は、[イベントリスナーをスロットルまたはデバウンスする](https://css-tricks.com/debouncing-throttling-explained-examples/)ことを検討してください。

## ドロップを完了する

実際のドロップを処理するには、`drop`イベントのイベントリスナーを追加します。`drop`ハンドラーでは、ドロップに対するブラウザーのデフォルト動作を防ぐ必要があります。一般的には、何らかのリダイレクトが発生します。`e.stopPropagation()`呼び出すと、イベントがDOMをバブリングするのを防げます。

```js
function handleDrop(e) {
  e.stopPropagation(); // stops the browser from redirecting.
  return false;
}
```

新しいハンドラーは必ず他のハンドラーにも登録しておきましょう。

```js/7-7
  let items = document.querySelectorAll('.container .box');
  items.forEach(function(item) {
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragover', handleDragOver);
    item.addEventListener('dragenter', handleDragEnter);
    item.addEventListener('dragleave', handleDragLeave);
    item.addEventListener('dragend', handleDragEnd);
    item.addEventListener('drop', handleDrop);
  });
```

この時点でコードを実行すると、アイテムは新しい場所にドロップされません。これを実現するには、[`DataTransfer`](https://developer.mozilla.org/docs/Web/API/DataTransfer)オブジェクトを使用する必要があります。

すべてのDnDマジックは、`dataTransfer`プロパティで起こります。ドラッグアクションで送信されたデータを保持します。`dataTransfer`が`dragstart`イベントで設定され、dropイベントで読み取り/処理されます。 `e.dataTransfer.setData(mimeType, dataPayload)`を呼び出すと、オブジェクトのMIMEタイプとデータペイロードを設定できます。

この例では、ユーザーが列の順番を並べ替えられるようにします。これを行うには、まず、ドラッグの開始時にソース要素のHTMLを保存する必要があります。

  <figure>
    <video controls autoplay loop muted>
      <source src="https://storage.googleapis.com/web-dev-assets/drag-and-drop/webdev-dnd.mp4" type="video/mp4">
    </source></video>
  </figure>

```js/3-6
function handleDragStart(e) {
  this.style.opacity = '0.4';

  dragSrcEl = this;

  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
}
```

`drop`イベントでは、列のドロップを処理し、ソース列のHTMLをドロップしたターゲット列のHTMLに設定します。最初に、ユーザーがドラッグしてきた同じ列にまたドロップしないことを確認します。

```js/5-8
function handleDrop(e) {
  e.stopPropagation();

  if (dragSrcEl !== this) {
    dragSrcEl.innerHTML = this.innerHTML;
    this.innerHTML = e.dataTransfer.getData('text/html');
  }

  return false;
}
```

次のデモで結果を確認できます。A列をB列の上にドラッグして放し、場所がどのように変化するかを確認します。

{% Glitch { id: 'simple-drag-drop', path: 'dnd.js' } %}

## その他のドラッグプロパティ

`dataTransfer`オブジェクトはプロパティを公開し、ドラッグプロセス中に視覚的なフィードバックを提供します。こうしたプロパティを使用して、各ドロップターゲットの特定のデータ型に対する反応を制御することもできます。

- [`dataTransfer.effectAllowed`](https://developer.mozilla.org/docs/Web/API/DataTransfer/effectAllowed)は、ユーザーが要素に対して実行できる「ドラッグのタイプ」を制限します。これは、ドラッグアンドドロップ処理モデルで使用され、`dragenter` および `dragover` イベントの最中に`dropEffect`を初期化します。プロパティは次の値に設定できます。`none` 、 `copy` 、`copyLink` 、 `copyMove` 、`link` 、 `linkMove` 、`move` 、 `all` 、`uninitialized` 。
- [`dataTransfer.dropEffect`](https://developer.mozilla.org/docs/Web/API/DataTransfer/dropEffect)は、`dragenter`イベントおよび`dragover`イベント中にユーザーに与えられるフィードバックを制御します。ユーザーがターゲット要素にカーソルを合わせると、ブラウザーのカーソルに実行される操作のタイプ（コピー、移動など）が示されます。 効果は、次の値のいずれかになります。`none`、`copy`、`link`、`move`。
- [`e.dataTransfer.setDragImage(imgElement, x, y)`](https://developer.mozilla.org/docs/Web/API/DataTransfer/setDragImage)は、ブラウザのデフォルトの「ゴースト画像」フィードバックを使用する代わりに、ドラッグアイコンを設定できることを意味します。

## ドラッグ &amp; ドロップによるファイルのアップロード

この簡単な例では、列をドラッグソースとドラッグターゲットの両方として使用しています。これは、ユーザーがアイテムの再配置を求められるUIで見られることがあるかも知れません。場合によっては、たとえば、ドラッグターゲットとソースは異なる場合があります。ユーザーが製品のメイン画像として画像を1つ選択し、それをターゲットにドラッグするといったインターフェイスなどがそれに該当します。

ドラッグ &amp; ドロップは、ユーザーがデスクトップからアプリケーションにアイテムをドラッグできるようにするためによく使用されます。主な違いは、`drop`ハンドラーにあります。`dataTransfer.getData()`を使用してファイルにアクセスする代わりに、それらのデータは`dataTransfer.files`プロパティに格納されます。

```js
function handleDrop(e) {
  e.stopPropagation(); // Stops some browsers from redirecting.
  e.preventDefault();

  var files = e.dataTransfer.files;
  for (var i = 0, f; f = files[i]; i++) {
    // Read the File objects in this FileList.
  }
}
```

これに関する詳細は、[Custom drag-and-drop (カスタムドラッグ &amp; ドロップ](/read-files/#select-dnd)をご覧ください。

## その他のリソース

- [The Drag and Drop Specification (ドラッグ &amp; ドロップの仕様)](https://html.spec.whatwg.org/multipage/dnd.html#dnd)
- [MDN HTML Drag and Drop API](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API)
- [Vanilla JavaScriptを使用してドラッグ &amp; ドロップファイルアップローダーを作成する方法](https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/)
- [HTMLのDrag and Drop APIを使用した駐車ゲームの作成](https://css-tricks.com/creating-a-parking-game-with-the-html-drag-and-drop-api/)
- [ReactでHTMLのDrag and Drop APIを使用する方法](https://www.smashingmagazine.com/2020/02/html-drag-drop-api-react/)
