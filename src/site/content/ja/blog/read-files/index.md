---
title: JavaScriptでファイルを読む
subhead: ファイルを選択し、ファイルのメタデータとコンテンツを読み取り、読み取りの進捗を監視する方法。
description: |2-

  ファイルを選択し、ファイルのメタデータとコンテンツを読み取り、読み取りの進捗を監視する方法。
date: 2010-06-18
updated: 2021-03-29
authors:
  - kaycebasques
  - petelepage
  - thomassteiner
tags:
  - blog
  - storage
---

ユーザーのローカルデバイスにあるファイルを選択して操作することは、Webで最も一般的に使用される機能の1つです。これにより、ユーザーはファイルを選択し、サーバーにアップロードすることができます。たとえば、写真をアップロードしたり、税務書類の提出したりできます。ただし、サイトは、ネットワーク経由でデータを転送せずにファイルを読み取り、操作するということもできてしまいます。

## 最新の File System Access API

File System Access API (ファイルシステムアクセス) API は、ユーザーのローカルシステム上のファイルとディレクトリの読み取りおよび書き込みの両方を簡単に行う方法を提供します。現在、ChromeやEdgeなど、ほとんどのChromium派生ブラウザで利用できます。詳細については、[File System Access API](/file-system-access/) の記事を参照してください。

File System Access API は、まだすべてのブラウザーと互換性があるわけではないため、利用可能な場合に新しいAPIを使用するヘルパーライブラリ、[browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access)、をご確認ください。新しいAPIが利用可能でない場合は、従来のアプローチにフォールバックします。

## 従来のやり方でファイルを操作する方法

このガイドでは、以下を行う方法について説明します。

- ファイルを選択
    - [HTML入力要素の使用](#select-input)
    - [drag-and-dropゾーンの使用](#select-dnd)
- [ファイルのメタデータを読み取る](#read-metadata)
- [ファイルの中身を読む](#read-content)

## ファイルを選択 {: #select }

### HTML入力要素 {: #select-input}

ユーザーがファイルを選択できるようにする最も簡単な方法は、すべての主要なブラウザーでサポートされている[`<input type="file">`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file)要素を使用することです。クリックすると、ユーザーはオペレーティングシステムの組み込みファイル選択UIを使用して、単一のファイル、または[`multiple`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Additional_attributes)属性が含まれている場合は、複数のファイルを選択できます。ユーザーが1つまたは複数のファイルの選択を終了すると、要素の`change`イベントが発生します。ファイルの一覧は、[`FileList`](https://developer.mozilla.org/docs/Web/API/FileList)オブジェクトである`event.target.files`からアクセスできます。`FileList`の各アイテムは、[`File`](https://developer.mozilla.org/docs/Web/API/File)オブジェクトです。

```html
<!-- The `multiple` attribute lets users select multiple files. -->
<input type="file" id="file-selector" multiple>
<script>
  const fileSelector = document.getElementById('file-selector');
  fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList);
  });
</script>
```

{% Aside %}[`window.showOpenFilePicker()`](/file-system-access/#ask-the-user-to-pick-a-file-to-read)メソッドは、ファイルハンドルを使用して、ファイルを読み取るだけでなく、ファイルへの書き戻しもできるため、自分のユースケースにおいて実行可能な代替手段であるかどうかを確認します。 [この方法はポリフィル](https://github.com/GoogleChromeLabs/browser-fs-access#opening-files)することができます。 {% endAside %}

この例では、ユーザーはオペレーティングシステムの組み込みファイル選択UIを使用して複数のファイルを選択し、選択した各ファイルをコンソールに記録できます。

{% Glitch { id: 'input-type-file', height: 480 } %}

#### ユーザーが選択できるファイルの種類を制限する {: #accept}

場合によっては、ユーザーが選択できるファイルの種類を制限したいときがあります。たとえば、画像編集アプリが、テキストファイルではなく、画像のみを受け入れるようにする場合です。これを行うには、入力要素に[`accept`](https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Additional_attributes)属性を追加して、受け入れるファイルを指定します。

```html
<input type="file" id="file-selector" accept=".jpg, .jpeg, .png">
```

### カスタムドラッグアンドドロップ{: #select-dnd}

一部のブラウザでは、`<input type="file">`要素もドロップターゲットであるため、ユーザーはアプリにファイルをドラッグアンドドロップできます。ただし、ドロップターゲットは小さいため、使いにくい場合があります。代わりに、`<input type="file">`要素を使ってコア機能を指定したら、大きなカスタムドラッグアンドドロップサーフェスを提供できます。

{% Aside %}[`DataTransferItem.getAsFileSystemHandle()`](/file-system-access/#drag-and-drop-integration)メソッドは、ファイルハンドルも提供し、ファイルの読み取りだけでなく、ファイルへの書き戻しもできるため、ユースケースの実行可能な代替手段であるかどうかを確認してください。{% endAside %}

#### ドロップゾーンを選択する {: #choose-drop-zone}

ドロップサーフェスは、アプリケーションの設計によって異なります。ドロップサーフェスは、ウィンドウの一部のみ、またはウィンドウ全体にすることもできます。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/xX8UXdqkLmZXu3Ad1Z2q.png", alt="画像圧縮WebアプリSquooshのスクリーンショット。", width="800", height="589" %}<figcaption> Squooshは、ウィンドウ全体をドロップゾーンにします。</figcaption></figure>

Squooshを使用すると、ユーザーは画像をウィンドウ内の任意の場所にドラッグアンドドロップでき、**画像を選択**を選択すると、`<input type="file">`要素が呼び出されます。何をドロップゾーンとする場合も、そのサーフェスにファイルをドラッグアンドドロップできることをユーザーが分かるようにしましょう。

#### ドロップゾーンを定義する {: #define-drop-zone}

要素をドラッグアンドドロップゾーンにするには、2 つのイベント `dragover` と [`drop`](https://developer.mozilla.org/docs/Web/API/Document/drop_event) をリッスンする必要があります。`dragover`イベントは、ブラウザのUIを更新して、ドラッグアンドドロップアクションがファイルのコピーを作成していることを視覚的に示します。`drop` イベントは、ユーザーがファイルをサーフェスにドロップした後に発生します。入力要素の場合と同じように、ファイルの一覧は、[`FileList`](https://developer.mozilla.org/docs/Web/API/FileList) オブジェクトである `event.dataTransfer.files` からアクセスできます。`FileList`の各アイテムは、[`File`](https://developer.mozilla.org/docs/Web/API/File) オブジェクトです。

```js
const dropArea = document.getElementById('drop-area');

dropArea.addEventListener('dragover', (event) => {
  event.stopPropagation();
  event.preventDefault();
  // Style the drag-and-drop as a "copy file" operation.
  event.dataTransfer.dropEffect = 'copy';
});

dropArea.addEventListener('drop', (event) => {
  event.stopPropagation();
  event.preventDefault();
  const fileList = event.dataTransfer.files;
  console.log(fileList);
});
```

[`event.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation)および[`event.preventDefault()`](https://developer.mozilla.org/docs/Web/API/Event/preventDefault)は、ブラウザーのデフォルトの動作が実行されないようにし、代わりにコードが実行されるようにします。これらのメソッドがないと、ブラウザはページから離れ、ユーザーがブラウザウィンドウにドロップしたファイルを開きます。

{＃この例は埋め込みとしては機能しません。＃}

ライブデモンストレーションは、[Custom drag-and-drop (カスタムドラッグアンドドロップ)](https://custom-drag-and-drop.glitch.me/)をご覧ください。

### ディレクトリの場合は？ {: #directories}

残念ながら、現時点では、ディレクトリにアクセスする良い方法はありません。

`<input type="file">` 要素の [`webkitdirectory`](https://developer.mozilla.org/docs/Web/API/HTMLInputElement/webkitdirectory) 属性を使用すると、単一のディレクトリまたは複数のディレクトリを選択できます。一部のChromiumベースのブラウザのほか、おそらくデスクトップ版のSafari でもサポートされていますが、ブラウザの互換性について[矛盾した情報](https://caniuse.com/#search=webkitdirectory)が報告されています。

{% Aside %}[`window.showDirectoryPicker()`](/file-system-access/#opening-a-directory-and-enumerating-its-contents)メソッドは、ファイルハンドルも提供し、ファイルの読み取りだけでなく、ファイルへの書き戻しもできるため、ユースケースの実行可能な代替手段であるかどうかを確認してください。この方法は[ポリフィル](https://github.com/GoogleChromeLabs/browser-fs-access#opening-directories)することができます。{% endAside %}

ドラッグアンドドロップが有効になっていると、ユーザーはディレクトリをドロップゾーンにドラッグしようとするかもしれません。ドロップイベントが発生すると、ディレクトリの `File` オブジェクトが含まれますが、ディレクトリ内のファイルには一切アクセスできなくなります。

## ファイルメタデータの読み取り {: #read-metadata}

[`File`](https://developer.mozilla.org/docs/Web/API/File)オブジェクトには、ファイルに関するいくつかのメタデータプロパティが含まれています。ほとんどのブラウザは、ファイル名、ファイルのサイズ、およびMIMEタイプを提供しますが、プラットフォームによっては、ブラウザが提供する情報が違ったり、他のブラウザよりも多くの情報が提供されたりする場合があります。

```js
function getMetadataForFileList(fileList) {
  for (const file of fileList) {
    // Not supported in Safari for iOS.
    const name = file.name ? file.name : 'NOT SUPPORTED';
    // Not supported in Firefox for Android or Opera for Android.
    const type = file.type ? file.type : 'NOT SUPPORTED';
    // Unknown cross-browser support.
    const size = file.size ? file.size : 'NOT SUPPORTED';
    console.log({file, name, type, size});
  }
}
```

実際の動作は、[`input-type-file`](https://input-type-file.glitch.me/) Glitch デモでご覧いただけます。

## ファイルのコンテンツを読み取る {: #read-content}

ファイルを読み取るには、 [`FileReader`](https://developer.mozilla.org/docs/Web/API/FileReader)を使用します。これにより、`File`オブジェクトのコンテンツをメモリに読み込むことができます。 `FileReader`には、ファイルを[配列バッファー](https://developer.mozilla.org/docs/Web/API/FileReader/readAsArrayBuffer)、[データURL](https://developer.mozilla.org/docs/Web/API/FileReader/readAsDataURL) 、または[テキスト](https://developer.mozilla.org/docs/Web/API/FileReader/readAsText)として読み取るように指示できます。

```js
function readImage(file) {
  // Check if the file is an image.
  if (file.type && !file.type.startsWith('image/')) {
    console.log('File is not an image.', file.type, file);
    return;
  }

  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    img.src = event.target.result;
  });
  reader.readAsDataURL(file);
}
```

上記の例では、ユーザーが指定した `File` を読み取り、それをデータ URL に変換し、そのデータ URL を使って `img` 要素に画像を表示しています。ユーザーが画像ファイルを選択したことを確認する方法は、[`read-image-file`](https://read-image-file.glitch.me/) をご覧ください。

{% Glitch { id: 'read-image-file', height: 480 } %}

### 読み取られたファイルの進捗を監視する {: #monitor-progress}

大きなファイルを読み取るときは、読み取りがどこまで進んだかを示すUXを提供すると便利な場合があります。そうするには、`FileReader` が提供する [`progress`](https://developer.mozilla.org/docs/Web/API/FileReader/progress_event) イベントを使用します。`progress` イベントは、`loaded` (読み取られた量) と `total` (読み取る量の合計) という 2 つのプロパティを提供します。

```js/7-12
function readFile(file) {
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    const result = event.target.result;
    // Do something with result
  });

  reader.addEventListener('progress', (event) => {
    if (event.loaded && event.total) {
      const percent = (event.loaded / event.total) * 100;
      console.log(`Progress: ${Math.round(percent)}`);
    }
  });
  reader.readAsDataURL(file);
}
```

ヒーロー画像、[Unsplash](https://unsplash.com/photos/bv_rJXpNU9I)、Vincent Botta 氏提供
