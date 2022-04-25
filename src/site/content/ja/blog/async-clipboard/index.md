---
title: クリップボードアクセスのブロックを解除する
subhead: テキストと画像へのより安全なブロックされていないクリップボードアクセス
authors:
  - developit
  - thomassteiner
description: 非同期クリップボードAPIは、アクセス権に適したコピーと貼り付けを簡素化します。
date: 2020-07-31
updated: 2021-07-29
tags:
  - blog
  - capabilities
hero: image/admin/aA9eqo0ZZNHFcFJGUGQs.jpg
alt: ショッピングリストが貼り付けられたクリップボード
feedback:
  - api
---

過去数年間、ブラウザはクリップボードの操作に[`document.execCommand()`](https://developers.google.com/web/updates/2015/04/cut-and-copy-commands)を使用してきました。これは広くサポートされていますが、この切り取りと貼り付けの方法には問題がありました。クリップボードへのアクセスは同期的でしたが、DOMの読み取りと書き込みしかできませんでした。

小さなテキストの場合は問題ありませんが、クリップボード転送でページをブロックすると、エクスペリエンスに悪影響を及ぼす場合が多くあります。コンテンツを安全に貼り付けるには、時間のかかるサニタイズまたは画像のデコードが必要になる場合があります。ブラウザは、貼り付けられたドキュメントからリンクされたリソースを読み込むか、インライン化する必要がある場合があります。これにより、ディスクまたはネットワークで待機している間、ページがブロックされます。クリップボードへのアクセスを要求している間、ブラウザがページをブロックすることを要求して、アクセス権をミックスに追加することを想像してみてください。`document.execCommand()`に関連して設定されているアクセス権は緩く定義されており、ブラウザによって異なります。

[非同期クリップボードAPI](https://www.w3.org/TR/clipboard-apis/#async-clipboard-api)はこれらの問題に対処し、ページをブロックしない明確に定義されたアクセス権モデルを提供します。最近、Safariは、[バージョン13.1でのサポート](https://webkit.org/blog/10855/)を発表しました。これにより、主要なブラウザは基本的なレベルのサポートを提供します。この記事の執筆時点では、Firefoxはテキストのみをサポートしています。一部のブラウザでは、画像のサポートはPNGに制限されています。 APIの使用に興味がある場合は、先に進む前に[ブラウザのサポート表](https://developer.mozilla.org/docs/Web/API/Clipboard#Browser_compatibility)を参照してください。

{% Aside %}非同期クリップボードAPIは、テキストと画像の処理に制限されています。 Chrome 84には、クリップボードが任意のデータ型を処理できるようにする実験的な機能が導入されています。 {% endAside %}

## コピー: クリップボードへのデータの書き込み

### writeText()

テキストをクリップボードにコピーするには、`writeText()`を呼び出します。このAPIは非同期であるため、`writeText()`関数は、渡されたテキストが正常にコピーされたかどうかに応じて解決または拒否するPromiseを返します。

```js
async function copyPageUrl() {
  try {
    await navigator.clipboard.writeText(location.href);
    console.log('Page URL copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}
```

### write()

実際、`writeText()`は、汎用`write()`メソッドの便利なメソッドであり、画像をクリップボードにコピーすることもできます。`writeText()`と同様に、非同期であり、Promiseを返します。

クリップボードに画像を書き込むには、画像を[`blob`](https://developer.mozilla.org/docs/Web/API/blob)として作成する必要があります。これを行う1つの方法は、`fetch()`を使用してサーバーに画像を要求し、応答で[`blob()`](https://developer.mozilla.org/docs/Web/API/Body/blob)を呼び出すことです。

さまざまな理由で、サーバーに画像を要求することは、望ましくないか、不可能な場合があります。幸い、画像をキャンバスに描画して、キャンバスの[`toBlob()`](https://developer.mozilla.org/docs/Web/API/HTMLCanvasElement/toBlob)メソッドを呼び出すこともできます。

次に、`ClipboardItem`オブジェクトの配列をパラメータとして`write()`メソッドに渡します。現在、一度に渡すことができる画像は1つだけですが、将来的には複数の画像のサポートを追加したいと考えています。`ClipboardItem`は、画像のMIMEタイプのオブジェクトをキーとして、blobを値として取ります。 `fetch()`または`canvas.toBlob()`から取得したBlobオブジェクトの場合、 `blob.type`プロパティには、画像の正しいMIMEタイプが自動的に含まれます。

```js
try {
  const imgURL = '/images/generic/file.png';
  const data = await fetch(imgURL);
  const blob = await data.blob();
  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob
    })
  ]);
  console.log('Image copied.');
} catch (err) {
  console.error(err.name, err.message);
}
```

{% Aside 'warning' %} Safari (WebKit) は、ユーザーのアクティブ化をChromium (Blink) とは異なる方法で処理します ([WebKitのバグ #222262](https://bugs.webkit.org/show_bug.cgi?id=222262)を参照)。 `ClipboardItem`に結果を割り当てるpromiseですべての非同期操作を実行します。

```js
new ClipboardItem({
  'foo/bar': new Promise(async (resolve) => {
      // Prepare `blobValue` of type `foo/bar`
      resolve(new Blob([blobValue], { type: 'foo/bar' }));
    }),
  })
```

{% endAside %}

### コピーイベント

ユーザーがクリップボードのコピーを開始した場合、非テキストデータがBLOBとして提供されます。[`copy`イベントに](https://developer.mozilla.org/docs/Web/API/Document/copy_event)は、項目がすでに正しい形式になっている`clipboardData`プロパティが含まれているため、Blobを手動で作成する必要がありません。`preventDefault()`を呼び出して、独自のロジックを優先してデフォルトの動作を防ぎ、内容をクリップボードにコピーします。クリップボードAPIがサポートされていないときに以前のAPIにフォールバックする方法については、この例で対応していません。これについては、この記事の後半の[機能の検出](#feature-detection)で説明します。

```js
document.addEventListener('copy', async (e) => {
    e.preventDefault();
    try {
      let clipboardItems = [];
      for (const item of e.clipboardData.items) {
        if (!item.type.startsWith('image/')) {
          continue;
        }
        clipboardItems.push(
          new ClipboardItem({
            [item.type]: item,
          })
        );
        await navigator.clipboard.write(clipboardItems);
        console.log('Image copied.');
      }
    } catch (err) {
      console.error(err.name, err.message);
    }
  });
```

## 貼り付け: クリップボードからデータを読み取る

### readText()

クリップボードからテキストを読み取るには、 `navigator.clipboard.readText()`を呼び出し、返されたPromiseが解決するのを待機します。

```js
async function getClipboardContents() {
  try {
    const text = await navigator.clipboard.readText();
    console.log('Pasted content: ', text);
  } catch (err) {
    console.error('Failed to read clipboard contents: ', err);
  }
}
```

### read()

`navigator.clipboard.read()`メソッドも非同期であり、Promiseを返します。クリップボードから画像を読み取るには、[`ClipboardItem`](https://developer.mozilla.org/docs/Web/API/ClipboardItem)オブジェクトのリストを取得し、この処理を繰り返します。

各`ClipboardItem`は別の型に内容を格納できるため、もう一度`for...of`ループを使用して、型のリストを反復処理する必要があります。型ごとに、現在の型を引数として、`getType()`メソッドを呼び出し、対応するBlobを取得します。以前のように、このコードは画像に関連付けられておらず、他の将来のファイルタイプで動作します。

```js
async function getClipboardContents() {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      for (const type of clipboardItem.types) {
        const blob = await clipboardItem.getType(type);
        console.log(URL.createObjectURL(blob));
      }
    }
  } catch (err) {
    console.error(err.name, err.message);
  }
}
```

### 貼り付けたファイルの操作

ユーザーが<kbd>ctrl</kbd>+<kbd>c</kbd>や<kbd>ctrl</kbd>+<kbd>v</kbd>などのクリップボードのキーボードショートカットを使用できると便利です。 Chromiumは、以下に概説するように、クリップボードに*読み取り専用*ファイルを公開します。これは、ユーザーがオペレーティングシステムのデフォルトの貼り付けショートカットを押すか、ユーザーがブラウザのメニューバーで**[編集]** 、**[貼り付け]**の順にクリックしたときにトリガーされます。これ以上のコードは必要ありません。

```js
document.addEventListener("paste", async e => {
  e.preventDefault();
  if (!e.clipboardData.files.length) {
    return;
  }
  const file = e.clipboardData.files[0];
  // Read the file's contents, assuming it's a text file.
  // There is no way to write back to it.
  console.log(await file.text());
});
```

### 貼り付けイベント

前述のように、クリップボードAPIで機能するイベントを導入する計画がありますが、今のところ、既存の`paste`イベントを使用できます。このイベントは、クリップボードのテキストを読み取るための新しい非同期メソッドとうまく連携します。code1}copyイベントと同様に、必ず`preventDefault()`メソッドを呼び出してください。

```js
document.addEventListener('paste', async (e) => {
  e.preventDefault();
  const text = await navigator.clipboard.readText();
  console.log('Pasted text: ', text);
});
```

`copy`イベントと同様に、クリップボードAPIがサポートされていない場合に以前のAPIにフォールバック方法については、[機能検出](#feature-detection)を参照してください。

## 複数のファイルタイプの処理

ほとんどの実装では、1回の切り取りまたはコピー操作のために、クリップボードに複数のデータ形式が配置されます。これには次の2つの理由があります。アプリ開発者はユーザーがテキストや画像をコピーしたいアプリの機能を知る方法がないことと、多くのアプリケーションが構造化データをプレーンテキストとして貼り付けることをサポートしていることです。**これは、[貼り付けてスタイルを合わせる]**または**[書式なしで貼り付け]**などの名前の**[編集]**メニュー項目がユーザーに表示されます。

次の例は、これを行う方法を示しています。この例では、`fetch()`を使用して画像データを取得しますが、 [`<canvas>`](https://developer.mozilla.org/docs/Web/HTML/Element/canvas)または[File System](/file-system-access/) AccessAPIから取得することもできます。

```js
async function copy() {
  const image = await fetch('kitten.png');
  const text = new Blob(['Cute sleeping kitten'], {type: 'text/plain'});
  const item = new ClipboardItem({
    'text/plain': text,
    'image/png': image
  });
  await navigator.clipboard.write([item]);
}
```

## セキュリティとアクセス権

クリップボードへのアクセスは、常にブラウザにとってセキュリティ上の懸念でした。適切なアクセス権がないと、ページはあらゆる種類の悪意のあるコンテンツをユーザーのクリップボードにサイレントにコピーし、貼り付けられたときに壊滅的な結果を招く可能性があります。`rm -rf /`または[高圧縮ファイル爆弾の画像](http://www.aerasec.de/security/advisories/decompression-bomb-vulnerability.html)をクリップボードにサイレントコピーするWebページを想像してみてください。

<figure>{% Img src="image/tcFciHGuF3MxnTr1y5ue01OGLBn2/Dt4QpuEuik9ja970Zos1.png", alt="クリップボードのアクセス権をユーザーに求めるブラウザプロンプト。", width="800", height="338" %} <figcaption>クリップボードAPIのアクセス権プロンプト。</figcaption></figure>

Webページにクリップボードへの無制限の読み取りアクセスを許可することはさらに厄介です。ユーザーは、パスワードや個人情報などの機密情報をクリップボードに定期的にコピーしますが、ユーザーの知らないうちにどこかのページによってこのような情報が読み取られる可能性があります。

多数の新しいAPIと同様に、クリップボードAPIはHTTPS経由で提供されるページでのみサポートされます。悪用を防ぐために、クリップボードへのアクセスは、ページがアクティブなタブである場合にのみ許可されます。アクティブなタブのページは、アクセス権を要求せずにクリップボードに書き込むことができますが、クリップボードからの読み取りには常に許可が必要です。

コピーと貼り付けのアクセス許可が[PermissionsAPIに](https://developers.google.com/web/updates/2015/04/permissions-api-for-the-web)追加されました。ページがアクティブなタブである場合、`clipboard-write`アクセス権が自動的にページに付与されます。`clipboard-read`アクセス権を要求する必要があります。これは、クリップボードからデータを読み取ろうとすることで実行できます。以下のコードは後者を示しています。

```js
const queryOpts = { name: 'clipboard-read', allowWithoutGesture: false };
const permissionStatus = await navigator.permissions.query(queryOpts);
// Will be 'granted', 'denied' or 'prompt':
console.log(permissionStatus.state);

// Listen for changes to the permission state
permissionStatus.onchange = () => {
  console.log(permissionStatus.state);
};
```

`allowWithoutGesture`オプションを使用して、切り取りまたは貼り付けを呼び出すために、ユーザージェスチャーが必要かどうかを制御することもできます。この値のデフォルトはブラウザによって異なるため、常にこの値を含めてください。

ここで、クリップボードAPIの非同期性が実際に役立ちます。クリップボードデータの読み取りまたは書き込みを試みると、まだ許可されていない場合は、ユーザーにアクセス許可を求めるプロンプトが自動的に表示されます。 APIはPromiseベースであるため、これは完全に透過的です。ユーザーがクリップボードのアクセス許可を拒否すると、ページが適切に応答できるようにPromiseがアクセスを拒否します。

Chromeでは、ページがアクティブなタブである場合にのみクリップボードへのアクセスを許可します。DevTools自体がアクティブなタブであるため、DevToolsに直接貼り付けた場合は、ここで示す例の一部が実行されません。これには注意が必要です。`setTimeout()`を使用してクリップボードへのアクセスを遅らせ、関数が呼び出される前にページ内をすばやくクリックしてフォーカスします。

```js
setTimeout(async () => {
  const text = await navigator.clipboard.readText();
  console.log(text);
}, 2000);
```

## アクセス権ポリシーの統合

iframeでAPIを使用するには、[アクセス権ポリシー](https://developer.chrome.com/docs/privacy-sandbox/permissions-policy/)を使用してAPIを有効にする必要があります。これにより、さまざまなブラウザ機能とAPIを選択的に有効化または無効化できるメカニズムが定義されます。具体的には、アプリのニーズに応じて、`clipboard-read`または`clipboard-write`のいずれかまたは両方を渡す必要があります。

```html/2
<iframe
    src="index.html"
    allow="clipboard-read; clipboard-write"
>
</iframe>
```

## 特徴の検出

すべてのブラウザをサポートしながら非同期クリップボードAPIを使用するには、`navigator.clipboard`をテストし、以前のメソッドにフォールバックします。たとえば、他のブラウザを含めるために貼り付けを実装する方法は次のとおりです。

```js
document.addEventListener('paste', async (e) => {
  e.preventDefault();
  let text;
  if (navigator.clipboard) {
    text = await navigator.clipboard.readText();
  }
  else {
    text = e.clipboardData.getData('text/plain');
  }
  console.log('Got pasted text: ', text);
});
```

それだけではありません。 非同期クリップボードAPIより前は、Webブラウザ間でさまざまなコピーと貼り付けの実装が混在していました。ほとんどのブラウザで、ブラウザ自体のコピーと貼り付けは、`document.execCommand('copy')`および`document.execCommand('paste')`を使用してトリガーできます。コピーするテキストがDOMに存在しない文字列である場合は、DOMに挿入して、次の項目を選択する必要があります。

```js
button.addEventListener('click', (e) => {
  const input = document.createElement('input');
  document.body.appendChild(input);
  input.value = text;
  input.focus();
  input.select();
  const result = document.execCommand('copy');
  if (result === 'unsuccessful') {
    console.error('Failed to copy text.');
  }
});
```

`window.clipboardData`からクリップボードにアクセスすることもできます。クリックイベント (責任を持って許可を求めることの一部) などのユーザージェスチャ内でアクセスした場合、アクセス許可プロンプトは表示されません。

## デモ

以下のデモまたは[直接Glitch](https://async-clipboard-api.glitch.me/)を使用して、非同期クリップボードAPIを試してみることができます。

最初の例は、クリップボードの内外でテキストを移動する方法を示しています。

<div class="glitch-embed-wrap" style="height: 500px; width: 100%;">   <iframe src="https://async-clipboard-text.glitch.me/" title="async-clipboard-text on Glitch" allow="clipboard-read; clipboard-write" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

画像でAPIを試すには、このデモを使用してください。PNGのみが[一部のブラウザ](https://developer.mozilla.org/docs/Web/API/Clipboard_API#browser_compatibility)でのみサポートされていることを覚えていてください。

<div class="glitch-embed-wrap" style="height: 500px; width: 100%;">   <iframe src="https://async-clipboard-api.glitch.me/" title="async-clipboard-api on Glitch" allow="clipboard-read; clipboard-write" style="height: 100%; width: 100%; border: 0;">   </iframe> </div>

## 次のステップ

Chromeは、[ドラッグアンドドロップAPI](https://developer.mozilla.org/docs/Web/API/HTML_Drag_and_Drop_API)に合わせた簡略化されたイベントを使用した、非同期クリップボードAPIの拡張に積極的に取り組んでいます。潜在的なリスクがあるため、Chromeは慎重に進めています。 Chromeの進捗状況に関する最新情報については、この記事と[ブログ](/blog/)で最新情報を確認してください。

現時点で、クリップボードAPIのサポート[は多くのブラウザ](https://developer.mozilla.org/docs/Web/API/Clipboard#Browser_compatibility)で利用できます。

充実したコピーと貼り付けを実装してみてください。

## 関連リンク

- [MDN](https://developer.mozilla.org/docs/Web/API/Clipboard_API)

## 謝辞

非同期クリップボードAPIは、[Darwin Huang](https://www.linkedin.com/in/darwinhuang/)氏と[Gary Kačmarčík](https://www.linkedin.com/in/garykac/)氏によって実装されました。Darwin氏はデモも提供してくれました。この記事の一部をレビューしてくれた[Kyarik](https://github.com/kyarik)氏とGary Kačmarčík氏に感謝します。

ヒーロー画像提供者: [Unsplash](https://unsplash.com/@markuswinkler)、[Markus Winkler氏](https://unsplash.com/@markuswinkler)
